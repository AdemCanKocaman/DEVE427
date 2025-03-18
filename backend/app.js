const express = require('express');
const app = express();

const db = { query: jest.fn() };

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Mail non valide!' });
  }

  const query = 'SELECT * FROM user_ WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur!' });
    if (results.length === 0) return res.status(400).json({ message: 'Mail incorrect!' });
    if (results[0].mot_de_passe !== mot_de_passe) return res.status(400).json({ message: 'Mot de passe incorrect!' });

    res.status(200).json({ message: 'Connexion réussie!' });
  });
});

app.post('/register', (req, res) => {
  const { prenom, nom, email, mot_de_passe, telephone, confirmPassword } = req.body;

  if (mot_de_passe !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas!' });
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Mail non valide!' });
  }

  const checkEmailQuery = 'SELECT * FROM user_ WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Erreur de base de données:', err);
      return res.status(500).json({ message: 'Impossible d\'ajouter à la base de données!' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé!' });
    }

    const insertQuery = 'INSERT INTO user_ (prenom, nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [prenom, nom, email, mot_de_passe, telephone], (err, result) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ message: 'Impossible d\'ajouter à la base de données!' });
      }
      res.status(200).json({ message: 'Utilisateur enregistré avec succès!' });
    });
  });
});

app.get('/getProduits', (req, res) => {
  const query = 'SELECT * FROM produit';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur de base de données:', err);
      return res.status(500).json({ message: 'Impossible de récupérer les produits!' });
    }
    res.status(200).json(results);
  });
});

app.post('/addToPanier', (req, res) => {
  const { userId, produitId, nomProduit, prixProduit, imageProduit } = req.body;


  const queryProduit = 'SELECT * FROM produit WHERE id_produit = ?';
  db.query(queryProduit, [produitId], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Veritabanı hatası!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Ürün bulunamadı!' });
    }
    const queryPanier = 'SELECT * FROM panier WHERE id_user = ?';
    db.query(queryPanier, [userId], (err, panierResults) => {
      if (err) {
        console.error('Panier Error:', err);
        return res.status(500).json({ message: 'Sepet kontrol hatası!' });
      }

      if (panierResults.length === 0) {
        const insertPanier = 'INSERT INTO panier (id_user, total) VALUES (?, 0)';
        db.query(insertPanier, [userId], (err, insertResult) => {
          if (err) {
            console.error('Insert Panier Error:', err);
            return res.status(500).json({ message: 'Sepet oluşturulamadı!' });
          }

          const panierId = insertResult.insertId;
          const insertContenir = 'INSERT INTO contenir (id_panier, id_produit, quantite) VALUES (?, ?, ?)';
          db.query(insertContenir, [panierId, produitId, 1], (err) => {
            if (err) {
              console.error('Contenir Insert Error:', err);
              return res.status(500).json({ message: 'Sepete ürün eklenemedi!' });
            }
            res.status(200).json({ message: 'Ürün sepete başarıyla eklendi!' });
          });
        });
      } else {
        // Kullanıcının mevcut sepetine ürün ekliyoruz
        const panierId = panierResults[0].id_panier;
        const insertContenir = 'INSERT INTO contenir (id_panier, id_produit, quantite) VALUES (?, ?, ?)';
        db.query(insertContenir, [panierId, produitId, 1], (err) => {
          if (err) {
            console.error('Contenir Insert Error:', err);
            return res.status(500).json({ message: 'Sepete ürün eklenemedi!' });
          }
          res.status(200).json({ message: 'Ürün sepete başarıyla eklendi!' });
        });
      }
    });
  });
});


module.exports = { app, db };

