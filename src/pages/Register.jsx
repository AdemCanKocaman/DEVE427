import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import MontreNoire from '../assets/1.png';
import MontreRouge from '../assets/6.png';

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    if (motDePasse !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas!');
      return;
    }

    const userData = {
      prenom,
      nom,
      email,
      mot_de_passe: motDePasse,
      confirmPassword,
      telephone,
    };

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage('Utilisateur enregistré avec succès!');
        navigate('/login');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur s\'est produite, veuillez réessayer.');
    }
  };

  return (
    <div className="register-container">
      <h2 id='RegisterSecondTitle'>Bienvenue sur</h2>
      <h1 id='RegisterFirstTitle'>Horizon Style</h1>
        <img id='MontreNoir' src={MontreNoire} alt="Montre Noire"/>
        <img id='MontreRouge' src={MontreRouge} alt="Montre Rouge"/>
      <form id='Form-Register' onSubmit={handleRegister}>
        <input
          id='prenom-Register'
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          id='nom-Register'
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          id='email-Register'
          type="email"
          placeholder="Adresse Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id='password-Register'
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <input
          id='confirmPassword-Register'
          type="password"
          placeholder="Confirmer votre mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          id='phone-Register'
          type="text"
          placeholder="Numéro de téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />
        <button id='submit-Register' type="submit">S'Enregistrer</button>
        <button className="Connecter" onClick={() => navigate('/login')}>Se connecter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
