import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function AssessmentCompletion() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "16px" }}>Assessment Complete</h1>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <p style={{ marginBottom: "32px", color: "var(--warm-gray)" }}>
            You've completed the check-in. Your responses have been recorded
            anonymously.
          </p>
          <Link to="/feedback">
            <Button full>View My Feedback</Button>
          </Link>
          <Link to="/resources">
            <Button variant="secondary" full style={{ marginTop: "12px" }}>
              Explore Resources
            </Button>
          </Link>
          <p
            style={{
              marginTop: "24px",
              fontSize: "0.85rem",
              color: "var(--warm-gray)",
            }}
          >
            Your responses are anonymous. No one can see your answers.
          </p>
        </div>
      </div>
    </div>
  );
}
