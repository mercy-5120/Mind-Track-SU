import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "../../components/Button";
import { getCurrentStudent, saveAssessmentResult } from "../../utils/studentSession";

export default function AssessmentQuestion() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const currentStudent = getCurrentStudent();
  const questions = [
    {
      id: 1,
      category: "Anxiety",
      text: "Over the past two weeks, I have felt nervous, anxious, or on edge.",
    },
    {
      id: 2,
      category: "Depression",
      text: "I have had little interest or pleasure in doing things.",
    },
    {
      id: 3,
      category: "Burnout",
      text: "I feel emotionally drained by my studies or work.",
    },
    {
      id: 4,
      category: "Sleep",
      text: "My sleep has been restless or disrupted.",
    },
    {
      id: 5,
      category: "Anxiety",
      text: "I have had trouble relaxing or calming down.",
    },
    {
      id: 6,
      category: "Depression",
      text: "I have felt down, depressed, or hopeless.",
    },
    {
      id: 7,
      category: "Burnout",
      text: "I feel unable to keep up with my responsibilities.",
    },
    {
      id: 8,
      category: "Sleep",
      text: "I have had trouble falling asleep or staying asleep.",
    },
    {
      id: 9,
      category: "Anxiety",
      text: "I have been easily annoyed or irritable.",
    },
    {
      id: 10,
      category: "Depression",
      text: "I have found it difficult to focus on tasks or schoolwork.",
    },
  ];
  const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
    "Prefer not to answer",
  ];
  const total = questions.length;
  const q = questions[currentQuestion];

  const handleAnswer = (value) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = value;
    setAnswers(nextAnswers);
  };

  const calculateResult = (selectedAnswers) => {
    const optionScores = {
      "Not at all": 0,
      "Several days": 1,
      "More than half the days": 2,
      "Nearly every day": 3,
      "Prefer not to answer": 0,
    };

    const categoryIndexes = {
      Anxiety: [0, 4],
      Depression: [1, 5, 9],
      Burnout: [2, 7],
      Sleep: [3, 8],
    };

    const categories = Object.entries(categoryIndexes).map(([name, indexes]) => {
      const total = indexes.reduce(
        (sum, index) => sum + optionScores[selectedAnswers[index]] || 0,
        0,
      );
      const score = Math.round((total / (indexes.length * 3)) * 100);
      const level = score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";
      return { name, score, level };
    });

    const overallScore = Math.round(
      categories.reduce((sum, category) => sum + category.score, 0) / categories.length,
    );

    return { overallScore, categories, answers: selectedAnswers };
  };

  const goNext = () => {
    if (!answers[currentQuestion]) {
      alert("Please select an option before continuing.");
      return;
    }
    if (currentQuestion < total - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateResult(answers);
      saveAssessmentResult(currentStudent, result);
      navigate("/completion", { state: { result } });
    }
  };

  return (
    <div className="auth-page" style={{ padding: "20px" }}>
      <div className="auth-container" style={{ maxWidth: "560px" }}>
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
                  name={`question-${q.id}`}
                  value={opt}
                  checked={answers[currentQuestion] === opt}
                  onChange={() => handleAnswer(opt)}
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
            <button
              onClick={() =>
                currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
              }
              style={{
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                cursor: currentQuestion > 0 ? "pointer" : "default",
                opacity: currentQuestion > 0 ? 1 : 0.5,
              }}
            >
              <FaArrowLeft style={{ marginRight: "6px" }} />
              Back
            </button>
            <Button onClick={goNext}>
              {currentQuestion < total - 1 ? (
                <>
                  Next <FaArrowRight />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
