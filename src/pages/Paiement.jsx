import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Paiement.css";

const PagePaiement = () => {
  const [panier, setPanier] = useState([]);
  const [numeroCarte, setNumeroCarte] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");
  const [nomTitulaire, setNomTitulaire] = useState("");
  const [idUtilisateur, setIdUtilisateur] = useState(1);

  // Récupérer le panier depuis le localStorage
  useEffect(() => {
    const panierStocke = JSON.parse(localStorage.getItem("panier")) || [];
    setPanier(panierStocke);
  }, []);

  const gererPaiement = (e) => {
    e.preventDefault();

    // Envoyer les informations de paiement à l'API backend
    const donneesPaiement = {
      nom_banque: nomTitulaire,
      num_carte: numeroCarte,
      date_expiration: expiration,
      id_user: idUtilisateur,
      cvc: cvc,
    };

    axios
      .post("http://localhost:3001/addPayment", donneesPaiement)
      .then((response) => {
        alert("Paiement réussi !");
        localStorage.removeItem("panier");
        setPanier([]);
      })
      .catch((error) => {
        console.error("Erreur lors du paiement :", error);
        alert("Une erreur est survenue lors du paiement.");
      });
  };

  const modifierQuantite = (indexProduit, type) => {
    const panierMisAJour = [...panier];
    const produit = panierMisAJour[indexProduit];

    if (type === "augmenter" && produit.quantity < 100) {
      produit.quantity++;
    } else if (type === "diminuer" && produit.quantity > 1) {
      produit.quantity--;
    }

    setPanier(panierMisAJour);
    localStorage.setItem("panier", JSON.stringify(panierMisAJour));
  };

  return (
    <div className="payment-container">
      <h2>Finalisez votre achat</h2>
      <h1>Horizon Style</h1>
      <p>Veuillez entrer vos informations de paiement</p>

      <div className="payment-content">
        {panier.map((produit, index) => (
          <div className="product-info" key={index}>
            <div className="product-card">
              <img src={produit.imageProduit} alt={produit.nomProduit} />
              <div className="details">
                <h3>{produit.nomProduit}</h3>
                <div className="quantity-control">
                  <p>Quantité :</p>
                  <div className="quantity">{produit.quantity || 1}</div>
                  <div className="buttons">
                    <button onClick={() => modifierQuantite(index, "diminuer")}>-</button>
                    <button onClick={() => modifierQuantite(index, "augmenter")}>+</button>
                  </div>
                </div>
                <p>Prix: {produit.prixProduit * (produit.quantity || 1)}€</p>
              </div>
            </div>
          </div>
        ))}

        <form id="Form-Paiement" onSubmit={gererPaiement}>
          <input
            type="text"
            placeholder="Nom du titulaire de la carte"
            value={nomTitulaire}
            onChange={(e) => setNomTitulaire(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Numéro de carte"
            value={numeroCarte}
            onChange={(e) => setNumeroCarte(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Date d'expiration (MM/AA)"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            required
          />
          <button type="submit">Payer</button>
        </form>
      </div>
    </div>
  );
};

export default PagePaiement;
