const request = require('supertest');
const { app, db } = require('../backend/app');

describe('Test de login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit connecter un utilisateur avec les bonnes informations', async () => {
    // Simulation d'une réponse de la base de données avec un utilisateur valide
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'test@exemple.com', mot_de_passe: 'password123' }]);
    });

    const res = await request(app).post('/login').send({
      email: 'test@exemple.com',
      mot_de_passe: 'password123'
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Connexion réussie!');
  });

  it('doit renvoyer une erreur si le mot de passe est incorrect', async () => {
    // Simulation d'un utilisateur trouvé mais avec un mauvais mot de passe
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'test@exemple.com', mot_de_passe: 'password123' }]);
    });

    const res = await request(app).post('/login').send({
      email: 'test@exemple.com',
      mot_de_passe: 'mauvaispassword'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mot de passe incorrect!');
  });

  it('doit renvoyer une erreur si le mail est invalide (sans "@")', async () => {
    // Simulation d'une tentative de connexion avec un email incorrect
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'test@exemple.com', mot_de_passe: 'password123' }]);
    });

    const res = await request(app).post('/login').send({
      email: 'testexemple.com', // Email invalide
      mot_de_passe: 'password123'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mail non valide!');
  });
});
