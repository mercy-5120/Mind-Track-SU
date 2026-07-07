import React from "react";
import logo from "../Assets/Logo.png";

export default function StudentBrand({
  compact = false,
  align = "center",
  size = "medium",
}) {
  const getLogoSizes = () => {
    switch (size) {
      case "xlarge":
        return { width: 150, height: 150, labelSize: "1.2rem" }; // Increased from 120
      case "large":
        return { width: 110, height: 110, labelSize: "1.1rem" }; // Increased from 90
      case "medium":
        return { width: 80, height: 80, labelSize: "0.9rem" }; // Increased from 70
      case "small":
      default:
        return { width: 60, height: 60, labelSize: "0.8rem" }; // Increased from 50
    }
  };

  const sizes = getLogoSizes();
  const logoWidth = compact ? 60 : sizes.width; // Increased from 50
  const logoHeight = compact ? 60 : sizes.height; // Increased from 50
  const labelFontSize = compact ? "0.8rem" : sizes.labelSize;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems:
          align === "center"
            ? "center"
            : align === "left"
              ? "flex-start"
              : "flex-end",
        gap: compact ? 6 : 8,
        textDecoration: "none",
        width: "100%",
      }}
    >
      <img
        src={logo}
        alt="MindTrackSU logo"
        style={{
          width: logoWidth,
          height: logoHeight,
          objectFit: "contain",
          flexShrink: 0,
          transition: "transform 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
      <span
        style={{
          fontSize: labelFontSize,
          fontWeight: 600,
          color: "#5f6470",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        Student Portal
      </span>
    </div>
  );
}
