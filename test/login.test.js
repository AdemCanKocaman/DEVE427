const request = require('supertest');
const { app, db } = require('../backend/app');

/* Automatiser et executer le code a chaque fois que un git request est fait */

describe('Test de login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit connecter un utilisateur avec les bonnes informations', async () => {
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

  it('doit renvoyer une erreur si le mail est invalide (sans utilisation de "@")', async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'test@exemple.com', mot_de_passe: 'password123' }]);
    });
  
    const res = await request(app).post('/login').send({
      email: 'testexemple.com',
      mot_de_passe: 'password123'
    });
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mail non valide!');
  });

});
