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

    res.status(200).json({ message: 'Connexion réussie!' });
  });
});

app.listen(port, () => {
  console.log(`API Backend fonctionne sur http://localhost:${port}`);
});
