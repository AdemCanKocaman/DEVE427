const request = require('supertest');
const { app, db } = require('../backend/app');

describe('Test de addToPanier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit ajouter un produit au panier avec succès', async () => {
    // Simulation du résultat de la requête produit (le produit existe dans la base de données)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, [{ id_produit: values[0], nom: 'Produit 1', prix: 100, image: 'image1.jpg' }]);
      }
    });

    // Simulation du résultat de la requête panier (l'utilisateur a déjà un panier)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM panier')) {
        callback(null, [{ id_panier: 1 }]);
      }
    });

    // Simulation de l'insertion dans la table contenir (ajout du produit au panier)
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
    expect(res.body.message).toBe('Le produit a été ajouté au panier avec succès !');
  });

  it('doit renvoyer une erreur si le produit n\'existe pas', async () => {
    // Simulation de la requête produit pour simuler l'absence du produit
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, []); // Aucun produit trouvé
      }
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 999, // Produit inexistant
      nomProduit: 'Produit Inexistant',
      prixProduit: 100,
      imageProduit: 'image_nonexistent.jpg'
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Produit non trouvé !');
  });

  it('doit renvoyer une erreur si la création du panier échoue', async () => {
    // Simulation de la requête produit pour simuler un produit trouvé
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM produit')) {
        callback(null, [{ id_produit: values[0], nom: 'Produit 1', prix: 100, image: 'image1.jpg' }]);
      }
    });

    // Simulation de la requête panier pour simuler l'absence de panier existant pour l'utilisateur
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('SELECT * FROM panier')) {
        callback(null, []); // Aucun panier trouvé
      }
    });

    // Simulation de l'insertion du panier pour simuler un échec (erreur lors de la création du panier)
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query.includes('INSERT INTO panier')) {
        callback(new Error('Erreur de base de données'));
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
    expect(res.body.message).toBe('Impossible de créer le panier !');
  });

  it('doit renvoyer une erreur si la base de données retourne une erreur', async () => {
    // Simulation d'une erreur de base de données lors de la requête produit
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Erreur de base de données'), null);
    });

    const res = await request(app).post('/addToPanier').send({
      userId: 1,
      produitId: 1,
      nomProduit: 'Produit 1',
      prixProduit: 100,
      imageProduit: 'image1.jpg'
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erreur de base de données !');
  });
});
