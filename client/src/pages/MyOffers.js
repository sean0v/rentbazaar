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
    <div className="container mt-5">
  <h2 className="mb-4">Mani piedāvājumi</h2>

  {offers.length === 0 ? (
    <p className="text-muted text-center fs-5 mt-5">Vēl nav piedāvājumu</p>
  ) : (
    <div className="row gy-4">
      {offers.map((offer) => (
        <div key={offer.id} className="col-12">
          <div
            className="card shadow-lg rounded border border-secondary"
            style={{ backgroundColor: "#fafafa", padding: "1.5rem" }}
          >
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <h5 className="card-title mb-2">
                  Piedāvājums: <strong>{offer.name}</strong>
                </h5>
                <p className="mb-1">
                  <strong>Tips:</strong>{" "}
                  <span className="badge bg-info text-dark">
                    {OFFER_TYPES[offer.type] || offer.type}
                  </span>
                </p>
                <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
                  <strong>Cena:</strong> {offer.price} €
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                  <strong>Izveidots:</strong>{" "}
                  {format(new Date(offer.createdAt), "dd.MM.yyyy")}
                </p>
                <button
                  className="btn btn-outline-primary btn-sm mt-3"
                  onClick={() => toggleExpand(offer.id)}
                >
                  {expandedId === offer.id
                    ? "Aizvērt detaļas"
                    : "Parādīt detaļas"}
                </button>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/updateOffer/${offer.id}`)}
                  style={{ fontSize: "1.1rem", padding: "0.5rem 1.2rem" }}
                >
                  Mainīt
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteOffer(offer.id)}
                  style={{ fontSize: "1.1rem", padding: "0.5rem 1.2rem" }}
                >
                  Izdzēst
                </button>
              </div>
            </div>

            {expandedId === offer.id && (
              <div className="card-footer bg-white border-top rounded-bottom mt-3">
                <h6 className="mb-3">Apraksts</h6>
                <p className="mb-0">{offer.description}</p>
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
