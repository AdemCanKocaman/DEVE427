import React from 'react';
import './Login.css';
import MontreNoire from '../assets/1.png';
import MontreRouge from '../assets/6.png';

const Login = () => {
  return (
    <div className="login-container">
      <h2>Bienvenue sur</h2>
      <h1>Horizon Style</h1>
      <p>Veuillez vous connecter</p>
        <img src={MontreNoire} alt="Montre Noire"/>
        <img src={MontreRouge} alt="Montre Rouge"/>
      <form>
        <input type="email" placeholder="Adresse Email" required />
        <input type="password" placeholder="Mot de passe" required />
        <button type="submit">Connectez-vous</button>
        <button className="Enregistre">S'Enregistre</button>
      </form>
    </div>
  );
};

export default Login;