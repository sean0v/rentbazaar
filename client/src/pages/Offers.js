import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchOffers();
  }, [search, category, sortBy, order]); 


  const fetchOffers = async () => {
    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: search,
          type: category ? parseInt(category) : undefined,
          sortBy,
          order,
        }),
      });

      const data = await response.json();
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Kļūda:", error);
    }
  };

  return (
    <div className="container mt-1">
  {/* Иллюстрация над фильтрами */}
  <div className="text-center mb-1">
    <img
      src="/main-banner.png" // <-- Подставь свою
      alt="Offers"
      style={{
        maxWidth: "700px",
        opacity: 0.85,
        borderRadius: "1px",
        boxShadow: "0 0px 0px rgba(0,0,0,0.1)"
      }}
    />

  </div>

  {/* Фильтры */}
  <div className="row g-3 mb-4 align-items-center">
    <div className="col-md-3">
      <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
        <option value="">Visas Kategorijas</option>
        {Object.entries(OFFER_TYPES).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>
    </div>

    <div className="col-md-4">
      <input
        type="text"
        className="form-control"
        placeholder="Meklēt piedāvājumus..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="col-md-2">
      <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">Pēc Datuma</option>
        <option value="price">Pēc Cenas</option>
        <option value="rating">Pēc Reitinga</option>
      </select>
    </div>

    <div className="col-md-3">
      <select className="form-select" onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">Augošā</option>
        <option value="desc">Dilstošā</option>
      </select>
    </div>
  </div>

  {/* Список объявлений */}
  <div className="row">
    {offers.length > 0 ? (
      offers.map((offer, idx) => (
        <div key={offer.id} className="col-12 mb-4">
          <div
            className="card border rounded-3 shadow-sm p-3 d-flex flex-row align-items-center"
            style={{
              borderLeft: "4px solid #0d6efd",
              backgroundColor: "#fff",
              transition: "0.3s",
              gap: "1rem"
            }}
          >
            {/* Изображение */}
            {offer.images?.length > 0 && (
              <img
                src={`https://rentbazaar-app.azurewebsites.net${offer.images[0].url}`}
                alt={offer.name}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            )}

            {/* Инфо */}
            <div className="flex-grow-1">
              <h5 className="fw-semibold mb-1">{offer.name}</h5>
              <p className="text-muted small mb-1">{offer.description}</p>
              <p className="fw-bold text-dark mb-1">{offer.price} €</p>
              <span className="badge bg-secondary">{OFFER_TYPES[offer.type]}</span>
            </div>

            <Link to={`/offers/${offer.id}`} className="btn btn-outline-primary">
              Skatīt
            </Link>
          </div>
        </div>
      ))
    ) : (
      <div className="col-12 text-center py-5">
        <p className="text-muted fs-5">Piedāvājumi nav atrasti</p>
      </div>
    )}
  </div>
</div>


  );
};

export default Offers;
