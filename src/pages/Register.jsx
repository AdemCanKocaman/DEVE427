import React from 'react';
import './Register.css';
import MontreNoire from '../assets/1.png';
import MontreRouge from '../assets/6.png';

const Register = () => {
  return (
    <div className="register-container">
      <h2>Bienvenue sur</h2>
      <h1>Horizon Style</h1>
      <p>Veuillez vous Enregistre</p>
        <img id='MontreNoir' src={MontreNoire} alt="Montre Noire"/>
        <img id='MontreRouge' src={MontreRouge} alt="Montre Rouge"/>
      <form>
        <input type="text" placeholder="Prenom" required/>
        <input type="text" placeholder="Nom" required />
        <input type="email" placeholder="Adresse Email" required />
        <input type="password" placeholder="Mot de passe" required />
        <input type="password" placeholder="Confirmer votre Mot de passe" required />
        <input type="phone" placeholder="Numero Telephone" required />
        <button type="submit">S'Enregistre</button>
        <button className="Connecter">Connectez-vous</button>
      </form>
    </div>
  );
};

export default Register;