import React from "react";
import { Link } from "react-router-dom";
import logo from "../Logo.png";

export default function Header() {
  return (
    <header
      style={{
        background: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid rgba(45,45,52,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="MindTrackSU logo"
            style={{ width: "40px", height: "40px" }}
          />
          <span>MindTrackSU</span>
        </Link>
        <nav
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Home
          </Link>
          <a
            href="#about"
            style={{
              color: "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            About
          </a>
          <Link
            to="/resources"
            style={{
              color: "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Resources
          </Link>
          <Link
            to="/create-account"
            style={{
              color: "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Create Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
