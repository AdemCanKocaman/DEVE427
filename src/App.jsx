import { useState } from 'react';
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

function App() {
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
  const products = [
    { image: MontreNoire, name: 'Montre Noire', price: '139.99 €' },
    { image: MontreRouge, name: 'Montre Rouge', price: '139.99 €' },
    { image: MontreJaune, name: 'Montre Jaune', price: '139.99 €' },
    { image: MontreVert, name: 'Montre Vert', price: '139.99 €' },
    { image: MontreBleu, name: 'Montre Bleue', price: '139.99 €' },
    { image: MontreCyan, name: 'Montre Cyan', price: '139.99 €' },
  ];

  return (
    <>
      <nav>
        <h1>Horizon Style</h1>
        <ul>
          <li><a href="#">Accueil<img src={HomeLogo} alt="Accueil" /></a></li>
          <li><a href="#">Produits<img src={MontreLogo} alt="Produit" /></a></li>
          <li><a href="#">Panier<img src={PanierLogo} alt="Panier" /></a></li>
          <li><a href="#">Compte<img src={UserLogo} alt="Compte" /></a></li>
        </ul>
      </nav>

      <div className="Carrousel">
        <button className="left" onClick={handlePrev}>
          <img src={Fleche} alt="Previous" />
        </button>
        <img src={images[currentIndex]} alt="Montre" />
        <button className="right" onClick={handleNext}>
          <img src={Fleche} alt="Next" />
        </button>
      </div>
      <div className="Produit">
        {products.map((product, index) => (
          <span key={index}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p className="price">{product.price}</p>
          </span>
        ))}
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
}

export default App;
