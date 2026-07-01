import React from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--primary)",
        color: "#ffffff",
        padding: "48px 20px",
        marginTop: "80px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              <FaHeartbeat /> MindTrackSU
            </div>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              Supporting your mental wellness journey with anonymity and care.
            </p>
          </div>
          <div>
            <h3
              style={{
                marginBottom: "12px",
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Quick Links
            </h3>
            <Link
              to="/"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Home
            </Link>
            <Link
              to="/resources"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Resources
            </Link>
            <Link
              to="/assessment-intro"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Assessment
            </Link>
          </div>
          <div>
            <h3
              style={{
                marginBottom: "12px",
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Support
            </h3>
            <Link
              to="/login"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Login
            </Link>
            <Link
              to="/create-account"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Create Account
            </Link>
            <Link
              to="/staff/login"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Staff Login
            </Link>
            <a
              href="tel:1199"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Call 1199
            </a>
          </div>
          <div>
            <h3
              style={{
                marginBottom: "12px",
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Legal
            </h3>
            <a
              href="#privacy"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              style={{
                display: "block",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "24px",
            textAlign: "center",
            fontSize: "0.85rem",
            opacity: 0.8,
          }}
        >
          <p>
            &copy; 2024 MindTrackSU. All rights reserved. Your privacy is our
            priority.
          </p>
        </div>
      </div>
    </footer>
  );
}
