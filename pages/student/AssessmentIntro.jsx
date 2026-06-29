import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function AssessmentIntro() {
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
              Step 0 of 4
            </p>
          </div>
          <div className="auth-header">
            <h1>Mental Wellness Check-In</h1>
            <p>We'll ask you a few questions about how you've been feeling.</p>
          </div>
          <div style={{ marginBottom: "32px" }}>
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
              <li>✓ Covers anxiety, depression, burnout, and sleep</li>
              <li>✓ Takes 2-3 minutes</li>
              <li>✓ Your responses are completely anonymous</li>
            </ul>
          </div>
          <Link to="/assessment">
            <Button full>Start Assessment</Button>
          </Link>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link
              to="/"
              style={{ color: "var(--warm-gray)", textDecoration: "none" }}
            >
              I'll do this later
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
