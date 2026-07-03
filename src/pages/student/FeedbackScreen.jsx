import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHeart, FaLeaf, FaMoon } from "react-icons/fa";
import Button from "../../components/Button";
import {
  getAssessmentHistory,
  getCurrentStudent,
} from "../../utils/studentSession";

export default function FeedbackScreen() {
  const currentStudent = getCurrentStudent();
  const history = getAssessmentHistory(currentStudent);
  const latest = history[history.length - 1] || null;
  const feedback = latest
    ? {
        overallScore: latest.overallScore,
        categories: latest.categories.map((cat) => ({
          ...cat,
          icon:
            cat.name === "Burnout" ? (
              <FaExclamationTriangle />
            ) : cat.name === "Sleep" ? (
              <FaMoon />
            ) : cat.name === "Depression" ? (
              <FaLeaf />
            ) : (
              <FaHeart />
            ),
        })),
      }
    : {
        overallScore: 0,
        categories: [],
      };

  const highRisk = feedback.categories.some((cat) => cat.level === "High");

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "760px" }}>
        <div className="card">
          <h1 style={{ marginBottom: "8px" }}>Your Wellness Summary</h1>
          <p style={{ color: "var(--warm-gray)", marginBottom: "24px" }}>
            Here is a calm overview of your recent check-in and your saved
            assessment history.
          </p>

          <div
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginBottom: "28px",
            }}
          >
            {feedback.categories.map((cat) => (
              <div
                key={cat.name}
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(42,42,114,0.06)",
                  border: "1px solid rgba(42,42,114,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  {cat.icon} {cat.name}
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginTop: "8px",
                  }}
                >
                  {cat.score}/100
                </div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    color:
                      cat.level === "High"
                        ? "var(--brick-dust)"
                        : "var(--secondary)",
                    background:
                      cat.level === "High"
                        ? "rgba(179,75,75,0.1)"
                        : "rgba(74,139,107,0.1)",
                  }}
                >
                  {cat.level}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "20px",
              background: "rgba(42,42,114,0.05)",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                color: "var(--warm-gray)",
                fontSize: "0.9rem",
                marginBottom: "8px",
              }}
            >
              Overall Wellness Score
            </p>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              <span
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                {feedback.overallScore}
              </span>
              <span style={{ color: "var(--warm-gray)" }}>/100</span>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "rgba(74,139,107,0.1)",
              borderRadius: "14px",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "var(--secondary)", fontSize: "0.95rem" }}>
              <strong>Feedback:</strong> You seem to be carrying a lot at once,
              and it may help to slow down, rest, and speak with a trusted
              support person.
            </p>
          </div>

          {history.length > 0 ? (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "10px" }}>Assessment history</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {history
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: "rgba(212,184,180,0.18)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>
                          {new Date(entry.taken_at).toLocaleDateString()}
                        </strong>
                        <span>Score: {entry.overallScore}/100</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--warm-gray)", marginBottom: "24px" }}>
              Your assessment history will appear here after you complete a
              check-in.
            </p>
          )}

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "10px" }}>Wellness tips</h3>
            <ul style={{ paddingLeft: "20px", color: "var(--warm-gray)" }}>
              <li>Take a 10-minute pause and breathe slowly.</li>
              <li>
                Try one gentle activity such as walking, journaling, or
                stretching.
              </li>
              <li>
                Reach out to a counsellor or peer support if you need a
                listening ear.
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "10px" }}>Recommended resources</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <Link
                to="/resources"
                style={{ color: "var(--primary)", textDecoration: "none" }}
              >
                Explore the resource directory
              </Link>
              <Link
                to="/crisis"
                style={{ color: "var(--brick-dust)", textDecoration: "none" }}
              >
                Speak to someone immediately
              </Link>
            </div>
          </div>

          {highRisk && (
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "rgba(179,75,75,0.08)",
                color: "var(--brick-dust)",
                marginBottom: "24px",
              }}
            >
              A crisis prompt is available to help you connect with support
              right away.
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/resources" style={{ flex: 1 }}>
              <Button full>Explore Resources</Button>
            </Link>
            <Link to="/" style={{ flex: 1 }}>
              <Button variant="secondary" full>
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
