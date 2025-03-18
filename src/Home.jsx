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
  const { userId } = useParams(); // Kullanıcı ID'sini alıyoruz
  console.log('User ID:', userId);

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    MontreNoire,
    MontreVert,
    MontreBleu,
    MontreCyan,
    MontreJaune,
    MontreRouge,
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/getProduits')
      .then((response) => {
        setProduits(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur!');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const addToPanier = (produit) => {
    if (!userId) {
      alert('Lütfen giriş yapın!');
      return;
    }

    // localStorage'da sepete ürün ekleme
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.push({
      produitId: produit.id,
      nomProduit: produit.nom_produit,
      prixProduit: produit.prix,
      imageProduit: produit.photo,
    });

    localStorage.setItem('panier', JSON.stringify(panier));
    alert('Ürün sepete eklendi!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <nav>
        <h1>Horizon Style</h1>
        <ul>
          <li><a href="#">Accueil<img src={HomeLogo} alt="Accueil" /></a></li>
          <li><a href="#Produit">Produits<img src={MontreLogo} alt="Produit" /></a></li>
          <li><a href={"Paiement"}>Panier<img src={PanierLogo} alt="Panier" /></a></li>
          <li><a href={"Login"}>Compte<img src={UserLogo} alt="Compte" /></a></li>
        </ul>
      </nav>

      <div className="Carrousel">
        <button className="left" onClick={handlePrev}><img src={Fleche} alt="Previous" /></button>
        <img src={images[currentIndex]} alt="Montre" />
        <button className="right" onClick={handleNext}><img src={Fleche} alt="Next" /></button>
      </div>

      <div id='Produit' className="Produit">
        {produits.length === 0 ? (
          <p>Aucun produit</p>
        ) : (
          produits.map((produit) => (
            <span key={produit.id}>
              <img src={produit.photo} alt={produit.nom_produit} />
              <p>{produit.nom_produit}</p>
              <p className="price">{produit.prix} €</p>
              <p className="stock">Stock : {produit.stock}</p>
              <button onClick={() => addToPanier(produit)}>Sepete Ekle</button>
            </span>
          ))
        )}
      </div>

      <footer>
        <p>Horizon Style</p>
        <ol>
          <li><img src={InstaLogo} alt="Insta" /></li>
          <li><img src={MailLogo} alt="Mail" /></li>
          <li><img src={FacebookLogo} alt="Facebook" /></li>
          <li><img src={PhoneLogo} alt="Phone" /></li>
        </ol>
      </footer>
    </>
  );
};

export default Home;
