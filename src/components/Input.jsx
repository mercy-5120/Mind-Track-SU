// src/components/Input.jsx
import React from "react";

export default function Input({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  style = {},
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        name={name || inputId}
        type={type}
        className={`input-field ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={style}
        {...props}
      />
    </div>
  );
}
