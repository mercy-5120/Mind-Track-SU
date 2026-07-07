import React from "react";
import logo from "../Assets/Logo.png";

export default function StaffBrand({
  compact = false,
  showLabel = true,
  align = "center",
  size = "medium",
}) {
  const getLogoSizes = () => {
    switch (size) {
      case "xlarge":
        return {
          width: 120,
          height: 120,
          labelSize: "1.4rem",
          subLabelSize: "0.85rem",
        };
      case "large":
        return {
          width: 90,
          height: 90,
          labelSize: "1.2rem",
          subLabelSize: "0.78rem",
        };
      case "medium":
        return {
          width: 70,
          height: 70,
          labelSize: "1rem",
          subLabelSize: "0.72rem",
        };
      case "small":
      default:
        return {
          width: 50,
          height: 50,
          labelSize: "0.95rem",
          subLabelSize: "0.72rem",
        };
    }
  };

  const sizes = getLogoSizes();
  const logoWidth = compact ? 40 : sizes.width;
  const logoHeight = compact ? 40 : sizes.height;
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
        gap: compact ? 6 : 10,
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
            lineHeight: 1.2,
            alignItems:
              align === "center"
                ? "center"
                : align === "left"
                  ? "flex-start"
                  : "flex-end",
          }}
        >
          <span
            style={{
              fontSize: labelFontSize,
              fontWeight: 700,
              color: "#2A2A72",
              letterSpacing: "-0.3px",
            }}
          >
            MindTrackSU
          </span>
          <span
            style={{
              fontSize: subLabelFontSize,
              fontWeight: 600,
              color: "#5f6470",
            }}
          >
            Staff Portal
          </span>
        </div>
      ) : null}
    </div>
  );
}
