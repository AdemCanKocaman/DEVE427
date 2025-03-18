const request = require('supertest');
const { app, db } = require('../backend/app');

describe('Test de getProduits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit récupérer les produits avec succès', async () => {
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [
        { id: 1, name: 'Produit 1', price: 100 },
        { id: 2, name: 'Produit 2', price: 200 }
      ]);
    });

    const res = await request(app).get('/getProduits');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: 'Produit 1', price: 100 },
      { id: 2, name: 'Produit 2', price: 200 }
    ]);
  });

  it('doit renvoyer une erreur en cas de problème avec la base de données', async () => {
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error('Database error'), null);
    });

    const res = await request(app).get('/getProduits');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Impossible de récupérer les produits!");
  });

  it('doit renvoyer une réponse vide si aucun produit n\'est trouvé', async () => {
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, []);
    });

    const res = await request(app).get('/getProduits');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
