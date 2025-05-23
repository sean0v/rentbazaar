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
    setEmailError(emailRegex.test(value) ? null : "Incorrect email address");
  };

  const validatePassword = (value) => {
    setPassword(value);
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!minLength) setPasswordError("Password nust be at least 8 letters");
    else if (!hasUpperCase) setPasswordError("Pussword must consist at least of one upper case letter");
    else if (!hasSpecialChar) setPasswordError("Password must have at least one special character");
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
    <div className="container-sm d-flex justify-content-center align-items-center vh-100">
      <main className="w-50 p-4 bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            {/* <img
              className="mb-4"
              src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
              alt="Bootstrap Logo"
              width="72"
              height="57"
            /> */}
            <h1 className="h3 mb-3 fw-normal">Welcome, please sign-up</h1>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

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
            <label htmlFor="floatingInput">Email address</label>
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          {/* <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div> */}

          <button type="submit" className="btn btn-primary" disabled={emailError || passwordError}>
            Sign up
          </button>

          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </main>
    </div>
  );
};

export default Register;