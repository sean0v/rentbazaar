import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const MyOffers = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://rentbazaar-app.azurewebsites.net/api/offers/myOffers/${userId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kļūda ielādējot piedāvājumus");
      setOffers(data.offers || []); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id) => {
    const confirm = window.confirm("Vai dzēst šo piedāvājumu? Šī darbība nav atgriezeniska.");
    if (!confirm) return;

    try {
      const res = await fetch(`https://rentbazaar-app.azurewebsites.net/api/offers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kļūda, dzēšot piedāvājumu");
      }
      await fetchOffers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [userId]);
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <p className="text-center mt-4">Ielādē…</p>;
  if (error) return <p className="text-danger mt-4 text-center">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>My Offers</h2>

      {offers.length === 0 ? (
        <p className="text-muted text-center">Vēl nav piedāvājumu</p>
      ) : (
        <div className="row">
          {offers.map((offer) => (
            <div key={offer.id} className="col-12 mb-3">
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">{offer.name}</h5>
                    <p className="mb-1">
                      <strong>Tips:</strong> {OFFER_TYPES[offer.type] || offer.type}
                    </p>
                    <p className="mb-1">
                      <strong>Cena:</strong> {offer.price} €
                    </p>
                    <p className="mb-1">
                      <strong>Izveidots:</strong>{" "}
                      {format(new Date(offer.createdAt), "dd.MM.yyyy")}
                    </p>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => toggleExpand(offer.id)}
                    >
                      {expandedId === offer.id ? "Aizvērt detaļas" : "Parādīt detaļas"}
                    </button>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => navigate(`/updateOffer/${offer.id}`)}
                    >
                      Mainīt
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteOffer(offer.id)}
                    >
                      Izdzēst
                    </button>
                  </div>
                </div>

                {expandedId === offer.id && (
                  <div className="card-footer bg-light">
                    <p className="mb-1">
                      <strong>Apraksts:</strong> {offer.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOffers;
