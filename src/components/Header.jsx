import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/Logo.png";

export default function Header() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkStyle = {
    color: "var(--warm-gray)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
  };

  // Blue button style for Create Account
  const createAccountButtonStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    background: "var(--primary)",
    padding: "8px 20px",
    borderRadius: "20px",
    display: "inline-block",
    textAlign: "center",
    transition: "opacity 0.2s, transform 0.2s",
    boxShadow: "0 2px 8px rgba(42,42,114,0.2)",
  };

  const navLinks = (
    <>
      <Link to="/" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
        Home
      </Link>
      <a href="#about" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
        About
      </a>
      <Link
        to="/resources"
        style={navLinkStyle}
        onClick={() => setMenuOpen(false)}
      >
        Resources
      </Link>
      <Link
        to="/create-account"
        style={createAccountButtonStyle}
        onClick={() => setMenuOpen(false)}
        onMouseEnter={(e) => {
          e.target.style.opacity = "0.85";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }}
      >
        Create Account
      </Link>
    </>
  );

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
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
            fontWeight: 700,
            color: "var(--primary)",
            textDecoration: "none",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="MindTrackSU logo"
              style={{
                width: "80px",
                height: "56px",
                flexShrink: 0,
                marginRight: "-10px",
              }}
            />
            <span style={{ whiteSpace: "nowrap" }}>MindTrackSU</span>
          </div>
        </Link>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "4px",
              border: "1px solid rgba(45,45,52,0.15)",
              borderRadius: "20px",
              background: "transparent",
              padding: "8px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "2px",
                background: "var(--primary)",
              }}
            />
            <span
              style={{
                width: "20px",
                height: "2px",
                background: "var(--primary)",
              }}
            />
            <span
              style={{
                width: "20px",
                height: "2px",
                background: "var(--primary)",
              }}
            />
          </button>
        ) : null}

        <nav
          style={{
            display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "8px" : "12px",
            alignItems: isMobile ? "stretch" : "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            width: isMobile ? "100%" : "auto",
            paddingTop: isMobile ? "4px" : 0,
          }}
        >
          {isMobile ? navLinks : navLinks}
        </nav>
      </div>
    </header>
  );
}
