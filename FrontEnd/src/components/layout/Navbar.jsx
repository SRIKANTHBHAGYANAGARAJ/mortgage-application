import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(!!token);
    setUserName(user.username || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/calculator", label: "Calculator" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/applications", label: "Applications" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-wrapper">
            <svg
              className="snowflake-logo"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 0V40M0 20H40M5.86 5.86L34.14 34.14M34.14 5.86L5.86 34.14"
                stroke="url(#snowflakeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M12 12L28 28M28 12L12 28"
                stroke="url(#snowflakeGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
              <defs>
                <linearGradient
                  id="snowflakeGrad"
                  x1="0"
                  y1="0"
                  x2="40"
                  y2="40"
                >
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="50%" stopColor="#007bff" />
                  <stop offset="100%" stopColor="#6c5ce7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">
              Mortgage<span className="logo-highlight">.IO</span>
            </span>
          </div>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.label}
            </Link>
          ))}

          {isLoggedIn &&
            authLinks.map((link) => (
              <Link key={link.path} to={link.path} className="nav-link">
                {link.label}
              </Link>
            ))}
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">👋 {userName}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-auth btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-auth btn-register">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        initial={false}
        animate={
          isMobileMenuOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn &&
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                to="/login"
                className="mobile-btn-login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="mobile-btn-register"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
