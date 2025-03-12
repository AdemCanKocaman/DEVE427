import React, { useState } from "react";
import "./Paiement.css";
import MontreNoire from "../assets/1.png";
import MontreRouge from "../assets/6.png";

const PaymentPage = () => {
  const [quantityNoire, setQuantityNoire] = useState(1);
  const [quantityRouge, setQuantityRouge] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    alert("Paiement réussi !");
  };

  const changeQuantity = (product, type) => {
    if (product === "noire") {
      if (type === "increase" && quantityNoire < 100) {
        setQuantityNoire(quantityNoire + 1);
      } else if (type === "decrease" && quantityNoire > 1) {
        setQuantityNoire(quantityNoire - 1);
      }
    } else if (product === "rouge") {
      if (type === "increase" && quantityRouge < 100) {
        setQuantityRouge(quantityRouge + 1);
      } else if (type === "decrease" && quantityRouge > 1) {
        setQuantityRouge(quantityRouge - 1);
      }
    }
  };

  return (
    <div className="payment-container">
      <h2>Finalisez votre achat</h2>
      <h1>Horizon Style</h1>
      <p>Veuillez entrer vos informations de paiement</p>
      
      <div className="payment-content">

        {/* Montre Noire */}
        <div className="product-info">
          <div className="product-card">
            <img src={MontreNoire} alt="Montre Noire" />
            <div className="details">
              <h3>Montre Noire Élégante</h3>
              <br></br>
              <div className="quantity-control">
                <p>Quantité :</p>
                <div className="quantity">{quantityNoire}</div>
                <div className="buttons">
                  <button onClick={() => changeQuantity("noire", "decrease")}>-</button>
                  <button onClick={() => changeQuantity("noire", "increase")}>+</button>
                </div>
              </div>
              <br></br>
              <p>Prix: {450 * quantityNoire}€</p>
            </div>
          </div>
        </div>

        {/* Montre Rouge */}
        <div className="product-info">
          <div className="product-card">
            <img src={MontreRouge} alt="Montre Rouge" />
            <div className="details">
              <h3>Montre Rouge Élégante</h3>
              <br></br>
              <div className="quantity-control">
                <p>Quantité :</p>
                <div className="quantity">{quantityRouge}</div>
                <div className="buttons">
                  <button onClick={() => changeQuantity("rouge", "decrease")}>-</button>
                  <button onClick={() => changeQuantity("rouge", "increase")}>+</button>
                </div>
              </div>
              <br></br>
              <p>Prix: {650 * quantityRouge}€</p>
            </div>
          </div>
        </div>

        <form id="Form-Paiment" onSubmit={handlePayment}>
          <input
            type="text"
            placeholder="Nom du titulaire de la carte"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Numéro de carte"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Date d'expiration (MM/YY)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
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

export default PaymentPage;
