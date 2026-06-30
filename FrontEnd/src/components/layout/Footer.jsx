import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              <svg
                className="snowflake-logo"
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M20 0V40M0 20H40M5.86 5.86L34.14 34.14M34.14 5.86L5.86 34.14"
                  stroke="url(#snowflakeGradFooter)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="snowflakeGradFooter"
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
              <span className="footer-logo-text">Mortgage.IO</span>
            </div>
            <p className="footer-description">
              Smart mortgage solutions powered by AI and Snowflake analytics.
            </p>
            <div className="footer-social">
              <button className="social-link" aria-label="Mobile App">
                📱
              </button>
              <button className="social-link" aria-label="Twitter">
                🐦
              </button>
              <button className="social-link" aria-label="LinkedIn">
                💼
              </button>
              <button className="social-link" aria-label="Email">
                📧
              </button>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/calculator">Calculator</Link>
              </li>
              <li>
                <Link to="/global-analytics">Global Analytics</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/apply">Apply Now</Link>
              </li>
              <li>
                <Link to="/applications">My Applications</Link>
              </li>
              <li>
                <Link to="/calculator">Mortgage Calculator</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/bulk-upload">Bulk Upload</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>📧 support@mortgage.io</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Finance St, NY 10001</li>
              <li>🕐 Mon-Fri 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Mortgage.IO. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
