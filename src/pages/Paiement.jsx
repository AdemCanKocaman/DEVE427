import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Paiement.css";
import MontreNoire from "../assets/1.png";
import MontreRouge from "../assets/6.png";
import MontreVerte from "../assets/2.png";

const PaymentPage = () => {
  const [panier, setPanier] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(1); // Kullanıcı ID'sini burada belirliyoruz (gerçek kullanıcı ID'sini buraya alacaksınız)

  // Sepeti localStorage'dan al
  useEffect(() => {
    const storedPanier = JSON.parse(localStorage.getItem("panier")) || [];
    setPanier(storedPanier);
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();

    // Ödeme bilgilerini backend API'ye gönder
    const paymentData = {
      nom_banque: name,
      num_carte: cardNumber,
      date_expiration: expiry,
      id_user: userId,
      cvc: cvc,
    };

    axios
      .post("http://localhost:3001/addPayment", paymentData)
      .then((response) => {
        alert("Paiement réussi !");
        localStorage.removeItem("panier");
        setPanier([]);
      })
      .catch((error) => {
        console.error("Ödeme sırasında hata:", error);
        alert("Ödeme sırasında bir hata oluştu.");
      });
  };

  const changeQuantity = (productIndex, type) => {
    const updatedPanier = [...panier];
    const product = updatedPanier[productIndex];

    if (type === "increase" && product.quantity < 100) {
      product.quantity++;
    } else if (type === "decrease" && product.quantity > 1) {
      product.quantity--;
    }

    setPanier(updatedPanier);
    localStorage.setItem("panier", JSON.stringify(updatedPanier));
  };

  return (
    <div className="payment-container">
      <h2>Finalisez votre achat</h2>
      <h1>Horizon Style</h1>
      <p>Veuillez entrer vos informations de paiement</p>

      <div className="payment-content">
        {panier.map((product, index) => (
          <div className="product-info" key={index}>
            <div className="product-card">
              <img src={product.imageProduit} alt={product.nomProduit} />
              <div className="details">
                <h3>{product.nomProduit}</h3>
                <div className="quantity-control">
                  <p>Quantité :</p>
                  <div className="quantity">{product.quantity || 1}</div>
                  <div className="buttons">
                    <button onClick={() => changeQuantity(index, "decrease")}>-</button>
                    <button onClick={() => changeQuantity(index, "increase")}>+</button>
                  </div>
                </div>
                <p>Prix: {product.prixProduit * (product.quantity || 1)}€</p>
              </div>
            </div>
          </div>
        ))}

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
