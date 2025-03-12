const express = require('express');
const app = express();

const db = { query: jest.fn() };

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Validate email format (simple regex for validation)
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

module.exports = { app, db };
