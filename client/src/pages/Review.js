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
    <div className="container mt-4" style={{ maxWidth: "480px" }}>
  <h2 className="mb-4 text-center fw-bold" style={{ color: "#0d6efd" }}>
    Izveidot atsauksmi
  </h2>

  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label className="form-label fw-semibold" style={{ fontSize: "1.1rem" }}>
        Vērtējums:
      </label>
      <div className="text-warning" style={{ fontSize: "2rem", userSelect: "none" }}>
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`bi ${index < mark ? "bi-star-fill" : "bi-star"}`}
            style={{
              cursor: "pointer",
              transition: "color 0.3s ease",
              marginRight: 6,
              color: index < mark ? "#ffc107" : "#ddd",
            }}
            onClick={() => setMark(index + 1)}
            aria-label={`${index + 1} stars`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMark(index + 1);
            }}
          />
        ))}
      </div>
    </div>

    <div className="mb-4">
      <label className="form-label fw-semibold" style={{ fontSize: "1.1rem" }}>
        Apraksts:
      </label>
      <textarea
        className="form-control shadow-sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="5"
        required
        style={{
          resize: "vertical",
          minHeight: "110px",
          borderRadius: "8px",
          borderColor: "#ced4da",
          transition: "border-color 0.3s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
        onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
        placeholder="Ieraksti savu atsauksmi šeit..."
      />
    </div>

    <button
      type="submit"
      className="btn btn-primary w-100 py-2 fs-5 fw-semibold"
      disabled={!mark || description.trim() === ""}
      style={{ borderRadius: "8px" }}
    >
      Saglabāt
    </button>
  </form>

  {success && (
    <p className="text-success mt-3 text-center" style={{ fontWeight: "600" }}>
      {success}
    </p>
  )}
  {error && (
    <p className="text-danger mt-3 text-center" style={{ fontWeight: "600" }}>
      {error}
    </p>
  )}
</div>


  );
};

export default Review;