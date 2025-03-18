const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'deve427',
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion MySQL :', err);
  } else {
    console.log('Connexion MySQL réussie !');
  }
});

// Route d'inscription
app.post('/register', (req, res) => {
  const { prenom, nom, email, mot_de_passe, telephone, confirmPassword } = req.body;

  if (mot_de_passe !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas!' });
  }

  const query = 'INSERT INTO user_ (prenom, nom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [prenom, nom, email, mot_de_passe, telephone], (err, result) => {
    if (err) {
      console.error('Erreur de base de données:', err);
      return res.status(500).json({ message: 'Impossible d\'ajouter à la base de données!' });
    }
    res.status(200).json({ message: 'Utilisateur enregistré avec succès!' });
  });
});

// Route de connexion
app.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  const query = 'SELECT * FROM user_ WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erreur de base de données:', err);
      return res.status(500).json({ message: 'Erreur serveur!' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé!' });
    }

    const user = results[0];

    if (user.mot_de_passe !== mot_de_passe) {
      return res.status(400).json({ message: 'Mot de passe incorrect!' });
    }

    res.status(200).json({ message: 'Connexion réussie!', id_user: user.id_user });
  });
});

// Route pour récupérer les produits
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

// Route pour ajouter un produit au panier
app.post('/addToPanier', (req, res) => {
  const { userId, produitId } = req.body;

  const queryProduit = 'SELECT * FROM produit WHERE id_produit = ?';
  db.query(queryProduit, [produitId], (err, results) => {
    if (err) {
      console.error('Erreur de base de données:', err);
      return res.status(500).json({ message: 'Erreur serveur!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé!' });
    }

    const queryPanier = 'SELECT * FROM panier WHERE id_user = ?';
    db.query(queryPanier, [userId], (err, panierResults) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ message: 'Erreur lors de la récupération du panier!' });
      }

      if (panierResults.length === 0) {
        const insertPanier = 'INSERT INTO panier (id_user, total) VALUES (?, 0)';
        db.query(insertPanier, [userId], (err, insertResult) => {
          if (err) {
            console.error('Erreur lors de la création du panier:', err);
            return res.status(500).json({ message: 'Impossible de créer un panier!' });
          }

          const panierId = insertResult.insertId;
          const insertContenir = 'INSERT INTO contenir (id_panier, id_produit, quantite) VALUES (?, ?, ?)';
          db.query(insertContenir, [panierId, produitId, 1], (err) => {
            if (err) {
              console.error('Erreur lors de l\'ajout au panier:', err);
              return res.status(500).json({ message: 'Impossible d\'ajouter le produit au panier!' });
            }
            res.status(200).json({ message: 'Produit ajouté au panier avec succès!' });
          });
        });
      } else {
        const panierId = panierResults[0].id_panier;
        const insertContenir = 'INSERT INTO contenir (id_panier, id_produit, quantite) VALUES (?, ?, ?)';
        db.query(insertContenir, [panierId, produitId, 1], (err) => {
          if (err) {
            console.error('Erreur lors de l\'ajout au panier:', err);
            return res.status(500).json({ message: 'Impossible d\'ajouter le produit au panier!' });
          }
          res.status(200).json({ message: 'Produit ajouté au panier avec succès!' });
        });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`API Backend fonctionne sur http://localhost:${port}`);
});
