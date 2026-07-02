import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../../components/Button";
import { getCurrentStudent, getLatestAssessment } from "../../utils/studentSession";

export default function AssessmentCompletion() {
  const location = useLocation();
  const currentStudent = getCurrentStudent();
  const latest = location.state?.result || getLatestAssessment(currentStudent);

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
          <p style={{ marginBottom: "24px", color: "var(--warm-gray)" }}>
            Your wellness check-in has been recorded {currentStudent ? "to your student account" : "anonymously"}. You can review your summary and explore support options next.
          </p>
          {latest ? (
            <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(42,42,114,0.06)", borderRadius: "14px" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--warm-gray)" }}>Latest score</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--primary)" }}>{latest.overallScore}/100</p>
            </div>
          ) : null}
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
