// src/pages/Customer/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faUser, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ searchQuery, onSearch, cart }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="https://tse1.mm.bing.net/th?id=OIP.QpUXywTHXqJMnQfzJuXgXgHaE8&pid=Api&P=0&h=220"
            alt="E-Store Logo"
            style={{ borderRadius: "30px", width: "50px" }}
          />
          <span className="ms-2">E-Store</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/categories" className="nav-link">Categories</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/wishlist" className="nav-link">Wishlist</NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink to="/my-orders" className="nav-link">My Orders</NavLink>
              </li>
            )}
          </ul>

          <form className="d-flex search-bar">
            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="form-control me-2"
            />
          </form>

          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="cart-icon position-relative">
              <Tooltip title="Cart">
                <span>
                  <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: "25px" }} />
                  {cart.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  )}
                </span>
              </Tooltip>
            </Link>

            {user ? (
              <Link to="/profile" className="profile-icon">
                <Tooltip title="Profile">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: "25px", color: darkMode ? "#fff" : "#333" }} />
                </Tooltip>
              </Link>
            ) : (
              <Link to="/auth" className="profile-icon">
                <Tooltip title="Login / Register">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: "25px", color: darkMode ? "#fff" : "#333" }} />
                </Tooltip>
              </Link>
            )}

            <button className="btn mode-toggle" onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
