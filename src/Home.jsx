import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HomeLogo from '/1.png';
import MontreLogo from '/2.png';
import PanierLogo from '/3.png';
import UserLogo from '/4.png';
import InstaLogo from '/5.png';
import MailLogo from '/6.png';
import FacebookLogo from '/7.png';
import PhoneLogo from '/8.png';
import Fleche from './assets/Fleche.png';
import MontreNoire from './assets/1.png';
import MontreVert from './assets/2.png';
import MontreBleu from './assets/3.png';
import MontreCyan from './assets/4.png';
import MontreJaune from './assets/5.png';
import MontreRouge from './assets/6.png';
import './App.css';

const Home = () => {
  const { userId } = useParams(); // Récupération de l'ID utilisateur à partir de l'URL
  console.log('ID Utilisateur:', userId);

  const [produits, setProduits] = useState([]); // Stocke la liste des produits
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les erreurs potentielles

  // Gestion du carrousel d'images
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    MontreNoire,
    MontreVert,
    MontreBleu,
    MontreCyan,
    MontreJaune,
    MontreRouge,
  ];

  // Fonction pour passer à l'image précédente
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Fonction pour passer à l'image suivante
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Récupération des produits depuis l'API lors du chargement du composant
  useEffect(() => {
    axios
      .get('http://localhost:3001/getProduits')
      .then((response) => {
        setProduits(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur lors du chargement des produits.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  // Fonction pour ajouter un produit au panier
  const addToPanier = (produit) => {
    if (!userId) {
      alert('Veuillez vous connecter pour ajouter au panier !');
      return;
    }

    // Ajout du produit au panier stocké dans le localStorage
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.push({
      produitId: produit.id,
      nomProduit: produit.nom_produit,
      prixProduit: produit.prix,
      imageProduit: produit.photo,
    });

    localStorage.setItem('panier', JSON.stringify(panier));
    alert('Produit ajouté au panier !');
  };

  // Affichage du chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Affichage des erreurs
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {/* Barre de navigation */}
      <nav>
        <h1>Horizon Style</h1>
        <ul>
          <li><a href="#">Accueil<img src={HomeLogo} alt="Accueil" /></a></li>
          <li><a href="#Produit">Produits<img src={MontreLogo} alt="Produits" /></a></li>
          <li><a href={"Paiement"}>Panier<img src={PanierLogo} alt="Panier" /></a></li>
          <li><a href={"Login"}>Compte<img src={UserLogo} alt="Compte" /></a></li>
        </ul>
      </nav>

      {/* Carrousel d'images */}
      <div className="Carrousel">
        <button className="left" onClick={handlePrev}><img src={Fleche} alt="Précédent" /></button>
        <img src={images[currentIndex]} alt="Montre" />
        <button className="right" onClick={handleNext}><img src={Fleche} alt="Suivant" /></button>
      </div>

      {/* Section des produits */}
      <div id='Produit' className="Produit">
        {produits.length === 0 ? (
          <p>Aucun produit disponible.</p>
        ) : (
          produits.map((produit) => (
            <span key={produit.id}>
              <img src={produit.photo} alt={produit.nom_produit} />
              <p>{produit.nom_produit}</p>
              <p className="price">{produit.prix} €</p>
              <p className="stock">Stock : {produit.stock}</p>
              <button onClick={() => addToPanier(produit)}>Ajouter au panier</button>
            </span>
          ))
        )}
      </div>

      {/* Pied de page */}
      <footer>
        <p>Horizon Style</p>
        <ol>
          <li><img src={InstaLogo} alt="Instagram" /></li>
          <li><img src={MailLogo} alt="E-mail" /></li>
          <li><img src={FacebookLogo} alt="Facebook" /></li>
          <li><img src={PhoneLogo} alt="Téléphone" /></li>
        </ol>
      </footer>
    </>
  );
};

export default Home;
