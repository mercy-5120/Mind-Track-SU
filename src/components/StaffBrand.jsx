import React from "react";
import logo from "../Assets/Logo.png";

export default function StaffBrand({
  compact = false,
  showLabel = true,
  align = "center",
  size = "large",
}) {
  const getLogoSizes = () => {
    switch (size) {
      case "xxlarge":
        return {
          width: 160,
          height: 160,
          labelSize: "1.6rem",
          subLabelSize: "0.95rem",
        };
      case "xlarge":
        return {
          width: 130,
          height: 130,
          labelSize: "1.4rem",
          subLabelSize: "0.85rem",
        };
      case "large":
        return {
          width: 110,
          height: 110,
          labelSize: "1.2rem",
          subLabelSize: "0.78rem",
        };
      case "medium":
        return {
          width: 80,
          height: 80,
          labelSize: "1rem",
          subLabelSize: "0.72rem",
        };
      case "small":
      default:
        return {
          width: 60,
          height: 60,
          labelSize: "0.95rem",
          subLabelSize: "0.72rem",
        };
    }
  };

  const sizes = getLogoSizes();
  
  const logoWidth = compact ? 50 : sizes.width;
  const logoHeight = compact ? 50 : sizes.height;
  const labelFontSize = compact ? "0.95rem" : sizes.labelSize;
  const subLabelFontSize = compact ? "0.72rem" : sizes.subLabelSize;

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
        gap: compact ? 8 : 12,
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
      {showLabel ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.3,
            alignItems:
              align === "center"
                ? "center"
                : align === "left"
                  ? "flex-start"
                  : "flex-end",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontSize: labelFontSize,
              fontWeight: 700,
              color: "#2A2A72",
              letterSpacing: "-0.5px",
            }}
          >
            MindTrackSU
          </span>
          <span
            style={{
              fontSize: subLabelFontSize,
              fontWeight: 600,
              color: "#5f6470",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Staff Portal
          </span>
        </div>
      ) : null}
    </div>
  );
}