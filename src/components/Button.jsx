import React from "react";

export default function Button({
  children,
  variant = "primary",
  full = false,
  onClick,
  type = "button",
  className = "",
  style = {},
  ...props
}) {
  const baseClass = `btn btn-${variant} ${full ? "btn-full" : ""} ${className}`;
  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
