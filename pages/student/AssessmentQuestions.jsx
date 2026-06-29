import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function AssessmentQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      id: 1,
      category: "Burnout",
      text: "I feel emotionally drained by my studies",
    },
    {
      id: 2,
      category: "Anxiety",
      text: "Feeling nervous, anxious, or on edge",
    },
    {
      id: 3,
      category: "Depression",
      text: "Little interest or pleasure in doing things",
    },
  ];
  const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
  ];
  const total = questions.length;
  const q = questions[currentQuestion];

  return (
    <div className="auth-page" style={{ padding: "20px" }}>
      <div className="auth-container" style={{ maxWidth: "500px" }}>
        <div className="auth-card">
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                height: "4px",
                background: "var(--dusty-rose)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((currentQuestion + 1) / total) * 100}%`,
                  height: "100%",
                  background: "var(--primary)",
                }}
              ></div>
            </div>
            <p
              style={{
                textAlign: "right",
                fontSize: "0.85rem",
                color: "var(--warm-gray)",
                marginTop: "8px",
              }}
            >
              {currentQuestion + 1} of {total}
            </p>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(42,42,114,0.1)",
                color: "var(--primary)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {q.category}
            </span>
          </div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "24px" }}>{q.text}</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {options.map((opt, idx) => (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "1.5px solid var(--dusty-rose)",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="question"
                  value={idx}
                  style={{ accentColor: "var(--primary)" }}
                />
                {opt}
              </label>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              to="/assessment-intro"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Back
            </Link>
            {currentQuestion < total - 1 ? (
              <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                Next
              </Button>
            ) : (
              <Link to="/completion">
                <Button>Submit</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
