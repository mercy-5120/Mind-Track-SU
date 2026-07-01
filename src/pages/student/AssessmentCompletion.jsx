import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../../components/Button";

export default function AssessmentCompletion() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <FaCheckCircle
            style={{
              fontSize: "48px",
              color: "var(--secondary)",
              marginBottom: "16px",
            }}
          />
          <h1 style={{ marginBottom: "16px" }}>Assessment Complete</h1>
          <p style={{ marginBottom: "32px", color: "var(--warm-gray)" }}>
            Your wellness check-in has been recorded anonymously. You can review
            your summary and explore support options next.
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
            Your privacy is protected. These details are for your own reflection
            and support planning.
          </p>
        </div>
      </div>
    </div>
  );
}
