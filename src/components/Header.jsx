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
        style={navLinkStyle}
        onClick={() => setMenuOpen(false)}
      >
        Create Account
      </Link>
      <Link
        to="/staff/login"
        style={{
          ...navLinkStyle,
          color: "var(--primary)",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
        onClick={() => setMenuOpen(false)}
      >
        Staff Login
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
          <img
            src={logo}
            alt="MindTrackSU logo"
            style={{ width: "56px", height: "56px", flexShrink: 0 }}
          />
          <span style={{ whiteSpace: "nowrap" }}>MindTrackSU</span>
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
              borderRadius: "8px",
              background: "white",
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
