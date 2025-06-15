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
    <div className="container mt-4">
      <h2>Mainīt piedāvājumu #{id}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Nosaukums:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tips:</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(parseInt(e.target.value, 10) || 0)}
            required
          >
            <option value="">Izvēlēties tipu</option>
            {Object.entries(OFFER_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cena:</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Apraksts:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Spēlē:</label>
          <select
            className="form-select"
            value={gameId}
            onChange={(e) => setGame(parseInt(e.target.value, 10) || 0)}
            required
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
          <div className="mb-3">
            <label className="form-label">Attēli:</label>
            <div className="d-flex flex-wrap gap-2">
              {oldImages.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:5000${img.url}`}
                  alt={img.alt}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              ))}
            </div>
            <small className="text-muted">Tie tiks aizvietoti, ja jums būs jauni.</small>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Aizvietot attēlus (max 10):</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleNewImages}
          />
          {newImages.length > 0 && (
            <small className="text-muted">
              Izvēlētie: {newImages.map((f) => f.name).join(", ")}
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Saglabāt izmaiņas
        </button>
      </form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default EditOffer;