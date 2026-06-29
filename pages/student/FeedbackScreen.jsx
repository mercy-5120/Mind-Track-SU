import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function FeedbackScreen() {
  const [feedback] = useState({
    overallScore: 72,
    categories: [
      { name: "Anxiety", score: 65, level: "Moderate" },
      { name: "Depression", score: 55, level: "Mild" },
      { name: "Burnout", score: 85, level: "High" },
      { name: "Sleep Quality", score: 70, level: "Moderate" },
    ],
  });

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "700px" }}>
        <div className="card">
          <h1 style={{ marginBottom: "24px" }}>
            Your Wellness Assessment Results
          </h1>

          <div
            style={{
              padding: "20px",
              background: "rgba(42,42,114,0.05)",
              borderRadius: "16px",
              marginBottom: "32px",
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

          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
            Category Breakdown
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {feedback.categories.map((cat, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ color: "var(--warm-gray)" }}>
                    {cat.score}/100
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "rgba(212,184,180,0.3)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "var(--primary)",
                      width: `${cat.score}%`,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--warm-gray)",
                    marginTop: "4px",
                  }}
                >
                  Level: {cat.level}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "16px",
              background: "rgba(74,139,107,0.1)",
              borderRadius: "12px",
              marginBottom: "32px",
            }}
          >
            <p style={{ color: "var(--secondary)", fontSize: "0.95rem" }}>
              <strong>📌 Next Steps:</strong> Consider exploring our resources
              or speaking with a counsellor for personalized support.
            </p>
          </div>

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
