import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import "./Profile.css";
import MontreNoire from "../assets/1.png";
import MontreRouge from "../assets/6.png";

const Profile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    prenom: "Adem Can",
    nom: "KOCAMAN",
    email: "ademcankocaman@gmail.com",
    telephone: "+33 7 45 60 28 98",
  });

  const [tempUser, setTempUser] = useState(user);

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(tempUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h2 id="ProfileFirstTitle">Bienvenue sur ton profil</h2>
      <img id="MontreNoir" src={MontreNoire} alt="Montre Noire" />
      <img id="MontreRouge" src={MontreRouge} alt="Montre Rouge" />

      <div id="Profile-Info">
        <h3>
          Profil de {user.prenom} {user.nom} 
          <FaEdit className="edit-icon" onClick={() => setIsEditing(true)} />
        </h3>

        {isEditing ? (
          <div className="edit-form">
            <input type="text" name="prenom" value={tempUser.prenom} onChange={handleChange} />
            <input type="text" name="nom" value={tempUser.nom} onChange={handleChange} />
            <input type="email" name="email" value={tempUser.email} onChange={handleChange} />
            <input type="text" name="telephone" value={tempUser.telephone} onChange={handleChange} />
            <button onClick={handleSave}>Enregistrer</button>
            <button onClick={handleCancel}>Annuler</button>
          </div>
        ) : (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Téléphone:</strong> {user.telephone}</p>
          </>
        )}

        <button id="logout-Profile" onClick={handleLogout}>Se Déconnecter</button>
      </div>
    </div>
  );
};

export default Profile;
