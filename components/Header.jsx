import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid rgba(45,45,52,0.08)",
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
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          MindTrackSU
        </Link>
        <nav
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "var(--primary)" : "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/assessment-intro"
            style={({ isActive }) => ({
              color: isActive ? "var(--primary)" : "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            Assessment
          </NavLink>
          <NavLink
            to="/resources"
            style={({ isActive }) => ({
              color: isActive ? "var(--primary)" : "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            Resources
          </NavLink>
          <NavLink
            to="/login"
            style={({ isActive }) => ({
              color: isActive ? "var(--primary)" : "var(--warm-gray)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
