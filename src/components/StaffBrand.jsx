import React from "react";
import logo from "../Assets/Logo.png";

export default function StaffBrand({ compact = false, showLabel = true, align = "center" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align,
        gap: compact ? 8 : 12,
        textDecoration: "none",
      }}
    >
      <img
        src={logo}
        alt="MindTrackSU logo"
        style={{
          width: compact ? 40 : 52,
          height: compact ? 40 : 52,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
      {showLabel ? (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: compact ? "0.95rem" : "1rem", fontWeight: 700, color: "#2A2A72" }}>
            MindTrackSU
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#5f6470" }}>
            Staff Portal
          </span>
        </div>
      ) : null}
    </div>
  );
}
