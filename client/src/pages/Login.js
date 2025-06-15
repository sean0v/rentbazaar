import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка входа");
      }

      login(data.userId);
      
      navigate("/");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    
    <div className="position-relative d-flex justify-content-center align-items-center vh-100 bg-light">
  {}
  <img
    src="/circle-bg-login.png"
    alt="background art"
    className="position-absolute rounded-circle shadow-lg"
    style={{
      width: "430px",
      height: "430px",
      top: "36%",
      left: "68%",
      transform: "translate(-60%, -60%)",
      zIndex: 0,
      opacity: 0.8, 
      pointerEvents: "none", 
      objectFit: "cover"
    }}
  />

  {}
  <main className="position-relative bg-white p-4 rounded shadow" style={{ maxWidth: "570px", width: "100%", zIndex: 1 }}>
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <i className="bi bi-person-circle fs-1 text-primary mb-2"></i>
        <h1 className="h4 fw-bold">Lūdzu pieslēdzaties</h1>
        <p className="text-muted small">Ievadiet savu e-pastu un paroli, lai turpinātu</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 text-center" role="alert">
          {error}
        </div>
      )}

      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="floatingInput">E-pasts</label>
      </div>

      <div className="form-floating mb-4">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Parole"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="floatingPassword">Parole</label>
      </div>

      <button className="btn btn-primary w-100 py-2 mb-3" type="submit">
        Pieslēgties
      </button>

      <div className="text-center">
        <span className="text-muted small">Nav konta?</span>{' '}
        <Link to="/register" className="small fw-semibold">
          Reģistrēties
        </Link>
      </div>
    </form>
  </main>
</div>


  );
};

export default Login;

