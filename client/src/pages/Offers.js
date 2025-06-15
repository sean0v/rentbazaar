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
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <select className="form-select w-25" onChange={(e) => setCategory(e.target.value)}>
          <option value="">Visas Kategorijas</option>
          {Object.entries(OFFER_TYPES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control w-50"
          placeholder="Meklēt piedāvājumus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="form-select w-25" onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Pēc Datuma</option>
          <option value="price">Pēc Cenas</option>
          <option value="rating">Pēc Reitinga</option>
        </select>

        <select className="form-select w-25" onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Augošā</option>
          <option value="desc">Dilstošā</option>
        </select>
      </div>

      <div className="row">
        {offers.length > 0 ? (
          offers.map((offer) => (
  <div key={offer.id} className="col-12 mb-3">
    <div className="card d-flex flex-row align-items-center p-3 shadow-sm">
    
      {offer.images && offer.images.length > 0 && (
        <div className="mb-4 d-flex flex-wrap gap-2">
  <img
    src={`https://rentbazaar-app.azurewebsites.net${offer.images[0].url}`}
    alt={offer.name}
    key={offer.images[0].url}
    style={{
      width: 100,
      height: 100,
      objectFit: "cover",
      borderRadius: 6,
      marginRight: 20,
    }}
  />
  </div>
)}

      <div className="flex-grow-1">
        <h5 className="card-title">{offer.name}</h5>
        <p className="card-text text-muted">{offer.description}</p>
        <p className="card-text text-muted">{offer.price} €</p>
        <p className="card-text text-muted">{OFFER_TYPES[offer.type]}</p>
      </div>

      <Link to={`/offers/${offer.id}`} className="btn btn-primary">Nopirkt</Link>
    </div>
  </div>
))) : (
          <p className="text-center text-muted">Piedāvājumi nav atrasti</p>
        )}
      </div>
    </div>
  );
};

export default Offers;
