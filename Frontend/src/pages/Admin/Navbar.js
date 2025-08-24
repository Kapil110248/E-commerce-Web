import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMoon,
  faSun,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

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
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link
          to="/admin/dashboard"
          className="navbar-brand d-flex align-items-center"
        >
          <img
            src="https://tse1.mm.bing.net/th?id=OIP.QpUXywTHXqJMnQfzJuXgXgHaE8&pid=Api&P=0&h=220"
            alt="Admin Logo"
            style={{ borderRadius: "30px", width: "50px" }}
          />
          <span className="ms-2">Admin Panel</span>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink to="/admin/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/manage-products" className="nav-link">
                Manage Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/manage-users" className="nav-link">
                Manage Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/manage-orders" className="nav-link">
                Manage Orders
              </NavLink>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-1">
            {!user ? (
              <Link to="/login-admin" className="profile-icon">
                <Tooltip title="Login / Register">
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      fontSize: "25px",
                      color: darkMode ? "#fff" : "#333",
                    }}
                  />
                </Tooltip>
              </Link>
            ) : (
              <>
                {/* Profile Icon */}
                <Link to="/admin/profile">
                  <Tooltip title="Profile">
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{
                        fontSize: "25px",
                        color: darkMode ? "#fff" : "#333",
                      }}
                    />
                  </Tooltip>
                </Link>

                {/* Logout Button */}
                <Tooltip title="Logout">
                  <button
                    onClick={logout}
                    className="btn btn-link p-0"
                    style={{ color: darkMode ? "#fff" : "#333" }}
                  ></button>
                </Tooltip>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              className="btn mode-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
