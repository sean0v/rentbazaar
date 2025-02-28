import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OFFER_TYPES = {
  1: "Game Currency",
  2: "Account"
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchOffers();
  }, [search, category, sortBy, order]); // Перезапрос при изменении фильтров

  // Запрос офферов с фильтрацией на бэке (POST-запрос)
  const fetchOffers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/offers", {
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
      console.error("Ошибка загрузки офферов:", error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Фильтры и поиск */}
      <div className="d-flex justify-content-between mb-3">
        <select className="form-select w-25" onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {Object.entries(OFFER_TYPES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control w-50"
          placeholder="Search offers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="form-select w-25" onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">By Date</option>
          <option value="price">By Price</option>
        </select>

        <select className="form-select w-25" onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="row">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className="col-12 mb-3">
              <div className="card d-flex flex-row align-items-center p-3 shadow-sm">
                <div className="flex-grow-1">
                  <h5 className="card-title">{offer.name}</h5>
                  <p className="card-text text-muted">{offer.description}</p>
                  <p className="card-text text-muted">{offer.price} €</p>
                  <p className="card-text text-muted">{OFFER_TYPES[offer.type]}</p>
                </div>
                <Link to={`/offers/${offer.id}`} className="btn btn-primary">Buy</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Offers Not Found</p>
        )}
      </div>
    </div>
  );
};

export default Offers;
