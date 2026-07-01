import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import Button from "../../components/Button";

export default function AssessmentIntro() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleStart = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Please enter a password to begin your anonymous assessment.");
      return;
    }
    navigate("/assessment");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p
              style={{
                color: "var(--warm-gray)",
                fontSize: "0.9rem",
                marginBottom: "8px",
              }}
            >
              Step 0 of 10
            </p>
          </div>
          <div className="auth-header">
            <h1>Mental Wellness Check-In</h1>
            <p>
              We will ask you a few questions about how you've been feeling.
            </p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "var(--warm-gray)",
              }}
            >
              <li>
                <FaShieldAlt
                  style={{ color: "var(--secondary)", marginRight: "8px" }}
                />
                Covers four areas: anxiety, depression, burnout, and sleep
              </li>
              <li>
                <FaShieldAlt
                  style={{ color: "var(--secondary)", marginRight: "8px" }}
                />
                Takes 2-3 minutes
              </li>
              <li>
                <FaShieldAlt
                  style={{ color: "var(--secondary)", marginRight: "8px" }}
                />
                Your responses stay anonymous
              </li>
            </ul>
          </div>
          <form
            onSubmit={handleStart}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <label
              htmlFor="assessment-password"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontWeight: 600,
              }}
            >
              Enter a password to begin
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1.5px solid var(--dusty-rose)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  background: "var(--background)",
                }}
              >
                <FaLock style={{ color: "var(--primary)" }} />
                <input
                  id="assessment-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a private password"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    flex: 1,
                  }}
                />
              </div>
            </label>
            <Button type="submit" full>
              Start Assessment
            </Button>
          </form>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--warm-gray)",
                cursor: "pointer",
              }}
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
