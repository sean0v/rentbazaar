import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const GAMES = {
  5: "Roblox",
  6: "Steam",
  7: "World of Warcraft",
  8: "War Thunder"
};


const EditOffer = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState(1);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [gameId, setGame] = useState("");
  const [oldImages, setOldImages] = useState([]); 
  const [newImages, setNewImages] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/offers/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error fetching offer");
        const offer = data.offer || data.Offer || data;
        setName(offer.name);
        setType(offer.type);
        setPrice(offer.price);
        setDescription(offer.description);
        setGame(offer.gameId);
        setOldImages(offer.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  const handleNewImages = (e) => {
    setNewImages([...e.target.files]);
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

      if (newImages.length) {
        newImages.forEach((f) => formData.append("images", f));
      }

      const res = await fetch(`https://rentbazaar-app.azurewebsites.net/api/offers/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kļūda");

      setSuccess("Piedāvājums ir izmainīts!");
      setTimeout(() => navigate("/myOffers"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-4">Ielādē…</p>;
  if (error)
    return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
  <h2 className="mb-4 text-center fw-bold" style={{ color: "#0d6efd" }}>
    Mainīt piedāvājumu #{id}
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
        {Object.entries(OFFER_TYPES).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
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
        {Object.entries(GAMES).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>

    {oldImages.length > 0 && (
      <div className="mb-4">
        <label className="form-label fw-semibold">Attēli:</label>
        <div className="d-flex flex-wrap gap-2">
          {oldImages.map((img) => (
            <img
              key={img.id}
              src={`https://rentbazaar-app.azurewebsites.net${img.url}`}
              alt={img.alt || "Offer image"}
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "8px", boxShadow: "0 0 6px rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>
        <small className="text-muted">Tie tiks aizvietoti, ja jums būs jauni.</small>
      </div>
    )}

    <div className="mb-4">
      <label htmlFor="newImages" className="form-label fw-semibold">
        Aizvietot attēlus (max 10):
      </label>
      <input
        id="newImages"
        type="file"
        className="form-control shadow-sm"
        multiple
        accept="image/*"
        onChange={handleNewImages}
        style={{ borderRadius: "8px" }}
      />
      {newImages.length > 0 && (
        <small className="text-muted d-block mt-2" style={{ fontStyle: "italic" }}>
          Izvēlētie: {newImages.map((f) => f.name).join(", ")}
        </small>
      )}
    </div>

    <button
      type="submit"
      className="btn btn-primary w-100 py-2 fs-5 fw-semibold"
      style={{ borderRadius: "8px" }}
    >
      Saglabāt izmaiņas
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

export default EditOffer;