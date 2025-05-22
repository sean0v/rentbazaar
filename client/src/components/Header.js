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
      <div className="px-3 py-2 text-bg-dark border-bottom">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <Link to="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
              RentBazaar
            </Link>
            {!userId ? null : (
              <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              <li>
                <Link to="/orders" className="nav-link text-white">
                  <svg className="bi d-block mx-auto mb-1" width="24" height="24">
                    <use xlinkHref="#table"></use>
                  </svg>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/myOffers" className="nav-link text-white">
                  <svg className="bi d-block mx-auto mb-1" width="24" height="24">
                    <use xlinkHref="#table"></use>
                  </svg>
                  My Offers
                </Link>
              </li>
            </ul>
            )}
            
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-bottom mb-3">
        <div className="container justify-content-right">
          {/* <form className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
          </form> */}

<div className="text-end">
          {userId ? (
            <>
            <Link to="/createOffer" className="btn btn-primary me-2">Create Offer</Link>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-light text-dark me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign-up</Link>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

