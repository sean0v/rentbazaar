import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OFFER_TYPES = {
  1: "Game Currency",
  2: "Account",
};

const GAMES = {
  2: "Fortnite",
  3: "CS 2",
  4: "DOTA 2",
  };

const CreateOffer = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGame] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:5000/api/offers/placeOffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, price, description, userId, gameId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erroe creating offer");

      setSuccess("Offer is created!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create your offer</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type:</label>
          <select className="form-select" value={type} onChange={(e) => setType(parseInt(e.target.value, 10) || 0)} required>
          <option value="">Select type</option>
            {Object.entries(OFFER_TYPES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Game:</label>
          <select className="form-select" value={gameId} onChange={(e) => setGame(parseInt(e.target.value, 10) || 0)} required>
          <option value="">Select a game</option>
            {Object.entries(GAMES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Create</button>
      </form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default CreateOffer;