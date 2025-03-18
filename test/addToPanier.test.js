const request = require('supertest');
const { app, db } = require('../backend/app');

describe('Test de addToPanier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit ajouter un produit au panier avec succès', async () => {
    // Mocking the product query result (product exists in the database)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, [{ id_produit: values[0], nom: 'Produit 1', prix: 100, image: 'image1.jpg' }]);
      }
    });

    // Mocking the panier query result (user already has a panier)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM panier')) {
        callback(null, [{ id_panier: 1 }]);
      }
    });

    // Mocking the insert into the contenir table (adding product to panier)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('INSERT INTO contenir')) {
        callback(null);
      }
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 1,
      nomProduit: 'Produit 1',
      prixProduit: 100,
      imageProduit: 'image1.jpg'
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Ürün sepete başarıyla eklendi!');
  });

  it('doit renvoyer une erreur si le produit n\'existe pas', async () => {
    // Mocking product query to simulate no product found
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, []); // No product found
      }
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 999, // Non-existent product
      nomProduit: 'Produit Inexistant',
      prixProduit: 100,
      imageProduit: 'image_nonexistent.jpg'
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Ürün bulunamadı!');
  });

  it('doit renvoyer une erreur si la création du panier échoue', async () => {
    // Mocking product query to simulate product found
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, [{ id_produit: values[0], nom: 'Produit 1', prix: 100, image: 'image1.jpg' }]);
      }
    });

    // Mocking panier query to simulate no existing panier for user
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM panier')) {
        callback(null, []); // No panier found
      }
    });

    // Mocking insert panier to simulate a failure (error during panier creation)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('INSERT INTO panier')) {
        callback(new Error('Database error'));
      }
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 1,
      nomProduit: 'Produit 1',
      prixProduit: 100,
      imageProduit: 'image1.jpg'
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Sepet oluşturulamadı!');
  });

  it('doit renvoyer une erreur si la base de données retourne une erreur', async () => {
    // Mocking a database error in the product query
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 1,
      nomProduit: 'Produit 1',
      prixProduit: 100,
      imageProduit: 'image1.jpg'
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Veritabanı hatası!');
  });
});
