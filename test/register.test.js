const request = require('supertest');
const { app, db } = require('../backend/app');

describe('Test de l\'inscription', () => {
  beforeAll(() => {
    jest.setTimeout(10000); // Augmente le temps d'attente pour ces tests
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit renvoyer une erreur si les mots de passe ne correspondent pas', async () => {
    const res = await request(app).post('/register').send({
      prenom: 'John',
      nom: 'Doe',
      email: 'john.doe@example.com',
      mot_de_passe: 'password123',
      confirmPassword: 'differentpassword', // Mot de passe différent
      telephone: '1234567890'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Les mots de passe ne correspondent pas!');
  });

  it('doit renvoyer une erreur si l\'email est déjà utilisé', async () => {
    // Simulation d'un email déjà existant dans la base de données
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'john.doe@example.com' }]); // Email déjà pris
    });

    const res = await request(app).post('/register').send({
      prenom: 'John',
      nom: 'Doe',
      email: 'john.doe@example.com', // Email existant
      mot_de_passe: 'password123',
      confirmPassword: 'password123',
      telephone: '1234567890'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cet email est déjà utilisé!');
  });

  it('doit renvoyer une erreur si l\'email est invalide', async () => {
    const res = await request(app).post('/register').send({
      prenom: 'John',
      nom: 'Doe',
      email: 'john.doeexample.com', // Email invalide (manque le "@")
      mot_de_passe: 'password123',
      confirmPassword: 'password123',
      telephone: '1234567890'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mail non valide!');
  });
});
