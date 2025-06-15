import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const GAMES = {
  2: "Fortnite",
  3: "CS 2",
  4: "DOTA 2",
  5: "Roblox",
  6: "Steam",
  7: "World of Warcraft",
  8: "War Thunder"
};

const CreateOffer = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGame] = useState("");
  const [images, setImages] = useState([]); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("userId", userId);
      formData.append("gameId", gameId);


      images.forEach((file) => formData.append("images", file));

      const response = await fetch(
        "https://rentbazaar-app.azurewebsites.net/api/offers/placeOffer",
        {
          method: "POST",
          body: formData, 
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kļūda, veidojot piedāvājumu");

      setSuccess("Piedāvājums ir izveidots!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
  <h2 className="mb-4 text-center fw-bold" style={{ color: "#0d6efd" }}>
    Izveidojiet savu piedāvājumu
  </h2>

  <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
    <div className="mb-4">
      <label htmlFor="name" className="form-label fw-semibold">
        Nosaukums:
      </label>
      <input
        id="name"
        type="text"
        className="form-control shadow-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Ieraksti nosaukumu"
        style={{ borderRadius: "8px" }}
      />
    </div>

    <div className="mb-4">
      <label htmlFor="type" className="form-label fw-semibold">
        Tips:
      </label>
      <select
        id="type"
        className="form-select shadow-sm"
        value={type}
        onChange={(e) => setType(parseInt(e.target.value, 10) || 0)}
        required
        style={{ borderRadius: "8px" }}
      >
        <option value="">Izvēlēties tipu</option>
        {Object.entries(OFFER_TYPES).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>

    <div className="mb-4">
      <label htmlFor="price" className="form-label fw-semibold">
        Cena:
      </label>
      <input
        id="price"
        type="number"
        className="form-control shadow-sm"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min="0"
        placeholder="Ieraksti cenu €"
        style={{ borderRadius: "8px" }}
      />
    </div>

    <div className="mb-4">
      <label htmlFor="description" className="form-label fw-semibold">
        Apraksts:
      </label>
      <textarea
        id="description"
        className="form-control shadow-sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        required
        placeholder="Ieraksti aprakstu"
        style={{ borderRadius: "8px", resize: "vertical", minHeight: "100px" }}
      />
    </div>

    <div className="mb-4">
      <label htmlFor="game" className="form-label fw-semibold">
        Spēlē:
      </label>
      <select
        id="game"
        className="form-select shadow-sm"
        value={gameId}
        onChange={(e) => setGame(parseInt(e.target.value, 10) || 0)}
        required
        style={{ borderRadius: "8px" }}
      >
        <option value="">Izvēlēties spēli</option>
        {Object.entries(GAMES).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>

    <div className="mb-4">
      <label htmlFor="images" className="form-label fw-semibold">
        Attēli (max 10):
      </label>
      <input
        id="images"
        type="file"
        className="form-control shadow-sm"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ borderRadius: "8px" }}
      />
      {images.length > 0 && (
        <small className="text-muted d-block mt-2" style={{ fontStyle: "italic" }}>
          Izvēlētie: {images.map((f) => f.name).join(", ")}
        </small>
      )}
    </div>

    <button
      type="submit"
      className="btn btn-primary w-100 py-2 fs-5 fw-semibold"
      style={{ borderRadius: "8px" }}
    >
      Izveidot
    </button>
  </form>

  {success && (
    <p className="text-success mt-3 text-center fw-semibold" style={{ fontSize: "1rem" }}>
      {success}
    </p>
  )}
  {error && (
    <p className="text-danger mt-3 text-center fw-semibold" style={{ fontSize: "1rem" }}>
      {error}
    </p>
  )}
</div>

  );
};

export default CreateOffer;