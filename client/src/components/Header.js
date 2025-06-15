import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {

  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <div className="px-3 py-2 shadow-sm bg-light border-bottom">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <Link
              to="/"
              className="d-flex align-items-center text-decoration-none"
              style={{ color: 'black' }}
            >
              <img src="/logo.png" alt="RentBazaar" height="40" className="me-2" />
            </Link>

            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              {userId ? (
                <>
                  <li className="d-flex align-items-center border-end pe-3 me-3" style={{ borderColor: 'black' }}>
                    <Link to="/orders" className="nav-link d-flex align-items-center p-0" style={{ color: 'black', fontWeight: '500' }}>
                      <i className="bi bi-card-checklist fs-5 me-2"></i>
                      Pasūtījumi
                    </Link>
                  </li>
                  <li className="d-flex align-items-center border-end pe-3 me-3" style={{ borderColor: 'black' }}>
                    <Link to="/myOffers" className="nav-link d-flex align-items-center p-0" style={{ color: 'black', fontWeight: '500' }}>
                      <i className="bi bi-box-seam fs-5 me-2"></i>
                      Mani piedāvājumi
                    </Link>
                  </li>
                  <li className="d-flex align-items-center border-end pe-3 me-3" style={{ borderColor: 'black' }}>
                    <Link to="/createOffer" className="nav-link d-flex align-items-center p-0" style={{ color: 'black', fontWeight: '500' }}>
                      <i className="bi bi-plus-circle fs-5 me-2"></i>
                      Izveidot piedāvājumu
                    </Link>
                  </li>
                  <li className="d-flex align-items-center">
                    <button
                      onClick={handleLogout}
                      className="btn btn-link nav-link d-flex align-items-center p-0"
                      style={{ color: 'red', fontWeight: '500', textDecoration: 'none' }}
                    >
                      <i className="bi bi-box-arrow-right fs-5 me-2"></i>
                      Atteikties
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="d-flex align-items-center border-end pe-3 me-3" style={{ borderColor: 'black' }}>
                    <Link to="/login" className="nav-link d-flex align-items-center p-0" style={{ color: 'black', fontWeight: '500' }}>
                      <i className="bi bi-box-arrow-in-right fs-5 me-2"></i>
                      Autorizēties
                    </Link>
                  </li>
                  <li className="d-flex align-items-center">
                    <Link to="/register" className="nav-link d-flex align-items-center p-0" style={{ color: 'black', fontWeight: '500' }}>
                      <i className="bi bi-person-plus fs-5 me-2"></i>
                      Piesakties
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>


  );
};

export default Header;

