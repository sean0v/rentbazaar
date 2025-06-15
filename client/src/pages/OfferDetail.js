import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const StarRating = ({ mark }) => {
  return (
    <div className="text-warning">
      {[...Array(5)].map((_, index) => (
        <i key={index} className={`bi ${index < mark ? "bi-star-fill" : "bi-star"}`}></i>
      ))}
    </div>
  );
};

const OfferDetail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // ← Добавили для модалки

  useEffect(() => {
    fetch(`https://rentbazaar-app.azurewebsites.net/api/offers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOffer(data.offer);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Kļūda ielādē", error);
        setLoading(false);
      });
  }, [id]);

  const handleBuy = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/orders/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, offerId: id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kļūda");

      setSuccess("Offer is bougth!");
      navigate("/orders");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <h2 className="text-center mt-5">Ielādē…</h2>;
  if (!offer) return <h2 className="text-center text-danger mt-5">Piedāvājums nav atrasts</h2>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h2>{offer.name}</h2>
          <p className="text-muted">{offer.description}</p>
          <p><strong>Cena:</strong> {offer.price} €</p>
          <p><strong>Kategorija:</strong> {OFFER_TYPES[offer.type]}</p>
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-success btn-lg" onClick={handleBuy}>Nopirkt</button>
        </div>
      </div>

      {offer.images && offer.images.length > 0 && (
        <div className="mb-4 d-flex flex-wrap gap-2">
          {offer.images.map((img) => {
            const fullUrl = `https://rentbazaar-app.azurewebsites.net${img.url}`;
            return (
              <img
                key={img.url}
                src={fullUrl}
                alt={img.alt || offer.name}
                onClick={() => setSelectedImage(fullUrl)}
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Модальное окно */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Fullscreen"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 10,
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}

      <h3 className="mt-5">Atsauces</h3>
      <div className="list-group">
        {offer.reviews.length > 0 ? (
          offer.reviews.map((review) => (
            <div key={review.id} className="list-group-item">
              <StarRating mark={review.mark} />
              <p className="mt-2">{review.description}</p>
              <small className="text-muted">Autors: {review.user.email}</small>
            </div>
          ))
        ) : (
          <p className="text-muted">Nav atsauces</p>
        )}
      </div>
    </div>
  );
};

export default OfferDetail;
