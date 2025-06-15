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
  const [quantity, setQuantity] = useState(1);
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
        body: JSON.stringify({ userId, offerId: id, quantity: quantity}),
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
    <div className="container mt-5">
      <div className="row gx-5">
        <div className="col-md-8">
          <h2 className="mb-3">{offer.name}</h2>
          <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>{offer.description}</p>
          
          <div className="mb-3">
            <strong>Cena:</strong> <span className="fs-5">{offer.price} €</span>
          </div>
          
          <div className="mb-4">
            <strong>Kategorija:</strong> <span className="text-primary fw-semibold">{OFFER_TYPES[offer.type]}</span>
          </div>

          {offer.type === 1 && (
            <div className="mb-4" style={{ maxWidth: 120 }}>
              <label htmlFor="quantity" className="form-label fw-semibold">Daudzums</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>
          )}

          <button
            className="btn btn-success btn-lg shadow mb-4"
            onClick={handleBuy}
            style={{ borderRadius: '12px', maxWidth: 150, width: '100%' }}
          >
            Nopirkt
          </button>

          {offer.images && offer.images.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mb-5">
              {offer.images.map((img) => {
                const fullUrl = `https://rentbazaar-app.azurewebsites.net${img.url}`;
                return (
                  <img
                    key={img.url}
                    src={fullUrl}
                    alt={img.alt || offer.name}
                    onClick={() => setSelectedImage(fullUrl)}
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 12,
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Fullscreen"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 16,
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>
      )}

      <h3 className="mt-5 mb-4 border-bottom pb-2">Atsauksmes</h3>
      <div className="list-group shadow-sm rounded">
        {offer.reviews.length > 0 ? (
          offer.reviews.map((review) => (
            <div key={review.id} className="list-group-item mb-3">
              <StarRating mark={review.mark} />
              <p className="mt-2 mb-1" style={{ whiteSpace: 'pre-line' }}>{review.description}</p>
              <small className="text-muted">Autors: {review.user.email}</small>
            </div>
          ))
        ) : (
          <p className="text-muted text-center py-3">Nav atsauksmes</p>
        )}
      </div>
    </div>
  );
};

export default OfferDetail;
