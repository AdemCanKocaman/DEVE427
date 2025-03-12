import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import MontreNoire from '../assets/1.png';
import MontreRouge from '../assets/6.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      mot_de_passe: motDePasse,
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage('Connexion réussie!');
        navigate('/');
      } else {
        setMessage(data.message || 'Une erreur est survenue!');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur est survenue, veuillez réessayer.');
    }
  };

  return (
    <div className="login-container">
      <h2>Bienvenue sur</h2>
      <h1>Horizon Style</h1>
      <img id='MontreNoir' src={MontreNoire} alt="Montre Noire"/>
      <img id='MontreRouge' src={MontreRouge} alt="Montre Rouge"/>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button id='Connecte-Login' type="submit">Connectez-vous</button>
        <button className="Enregistre" onClick={() => navigate('/register')}>S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
