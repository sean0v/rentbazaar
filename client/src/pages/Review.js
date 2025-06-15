import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Получаем userId

const Review = () => {
  const { id: offerId } = useParams(); // Получаем offerId из URL
  const { userId } = useAuth(); // Получаем userId из контекста (sessionStorage)
  const navigate = useNavigate();

  const [mark, setMark] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Функция отправки отзыва
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/reviews/placeReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark, description, userId, offerId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kļūda");

      setSuccess("Jūsu atsauce ir saglabāta!");
      setTimeout(() => navigate(`/offers/${offerId}`), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Izveidot Atsauci</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Vērtējums:</label>
          <div className="text-warning">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`bi ${index < mark ? "bi-star-fill" : "bi-star"}`}
                style={{ cursor: "pointer" }}
                onClick={() => setMark(index + 1)}
              ></i>
            ))}
          </div>
        </div>

        {/* 🔹 Текст отзыва */}
        <div className="mb-3">
          <label className="form-label">Apraksts:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Saglabāt</button>
      </form>

      {success && <p className="text-success mt-3">{success}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default Review;