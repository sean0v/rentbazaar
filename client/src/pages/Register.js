import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);;
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate(); 

  const validateEmail = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(value) ? null : "Nepareiza e-pasta adrese");
  };

  const validatePassword = (value) => {
    setPassword(value);
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!minLength) setPasswordError("Parolei jābūt vismaz 8 burtiem");
    else if (!hasUpperCase) setPasswordError("Parolei jābūt vismaz vienam lielajam burtam");
    else if (!hasSpecialChar) setPasswordError("Parolei jābūt vismaz vienai īpašajai zīmei");
    else setPasswordError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    try {
      const response = await fetch("https://rentbazaar-app.azurewebsites.net/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      
      navigate("/login");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100 bg-light">
      {/* Круглая картинка на фоне */}
      <img
        src="/circle-bg-register.png" // Убедись, что изображение лежит в /public
        alt="background art"
        className="position-absolute rounded-circle shadow-lg"
        style={{
          width: "420px",
          height: "420px",
          top: "34%",
          left: "36%",
          transform: "translate(-60%, -60%)",
          zIndex: 0,
          opacity: 0.69,
          pointerEvents: "none",
          objectFit: "cover",
        }}
      />

      {/* Основная форма */}
      <main
        className="position-relative bg-white p-4 rounded shadow"
        style={{ maxWidth: "570px", width: "100%", zIndex: 1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <i className="bi bi-person-plus fs-1 text-primary mb-2"></i>
            <h1 className="h4 fw-bold">Sveiciens, lūdzu reģistrējieties!</h1>
            <p className="text-muted small">Ievadiet datus, lai izveidotu kontu</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">E-pasts</label>
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              id="floatingPassword"
              placeholder="Parole"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Parole</label>
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-3"
            disabled={emailError || passwordError}
          >
            Reģistrēties
          </button>

          <div className="text-center">
            <span className="text-muted small">Jau ir konts?</span>{" "}
            <Link to="/login" className="small fw-semibold">
              Autorizēties
            </Link>
          </div>
        </form>
      </main>
    </div>

  );
};

export default Register;