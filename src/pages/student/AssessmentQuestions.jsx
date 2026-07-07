import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaInfoCircle,
  FaClock,
  FaList,
  FaTimesCircle,
} from "react-icons/fa";
import Button from "../../components/Button";
import {
  getCurrentStudent,
  saveAssessmentResult,
} from "../../utils/studentSession";

export default function AssessmentQuestion() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const [showConfirm, setShowConfirm] = useState(false);
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

  // Options with their positive scores (higher = better mental health)
  const options = [
    { label: "Not at all", score: 10 },
    { label: "Several days", score: 7 },
    { label: "More than half the days", score: 4 },
    { label: "Nearly every day", score: 1 },
    { label: "Prefer not to answer", score: 5 }, // Neutral score
  ];

  const total = questions.length;
  const q = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  const handleAnswer = (value) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = value;
    setAnswers(nextAnswers);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#2f855a";
    if (score >= 40) return "#4a5568";
    return "#b34747";
  };

  const getLevel = (score) => {
    if (score >= 70) return "Low";
    if (score >= 40) return "Moderate";
    return "High";
  };

  const calculateResult = (selectedAnswers) => {
    // Get score for each answer
    const getOptionScore = (answerLabel) => {
      const option = options.find((opt) => opt.label === answerLabel);
      return option ? option.score : 0;
    };

    // Define category question indexes
    const categoryIndexes = {
      Anxiety: [0, 4, 8],
      Depression: [1, 5, 9],
      Burnout: [2, 6],
      Sleep: [3, 7],
    };

    // Calculate each category score (higher = better)
    const categories = Object.entries(categoryIndexes).map(
      ([name, indexes]) => {
        const totalScore = indexes.reduce((sum, index) => {
          return sum + getOptionScore(selectedAnswers[index] || "");
        }, 0);

        const maxPossibleScore = indexes.length * 10; // Each question max 10
        const score = Math.round((totalScore / maxPossibleScore) * 100);
        const level = getLevel(score);

        return { name, score, level };
      },
    );

    // Calculate overall score
    const overallScore = Math.round(
      categories.reduce((sum, category) => sum + category.score, 0) /
        categories.length,
    );

    // Generate personalized advice based on scores
    const getAdvice = (overall, catScores) => {
      let level = "";
      let levelColor = "";
      let advice = "";
      let recommendations = [];

      if (overall >= 70) {
        level = "Good";
        levelColor = "#2f855a";
        advice =
          "You're doing well! Continue maintaining your current healthy habits and routines.";
        recommendations = [
          "Keep up your current wellness routines and healthy habits",
          "Maintain social connections and support systems",
          "Continue practicing self-care activities you enjoy",
          "Consider becoming a peer supporter to help others",
        ];
      } else if (overall >= 40) {
        level = "Moderate";
        levelColor = "#4a5568";
        advice =
          "You're managing okay, but there's room for improvement in some areas.";
        recommendations = [
          "Try incorporating more physical activity into your routine",
          "Practice mindfulness or meditation for 5-10 minutes daily",
          "Connect with friends or family regularly",
          "Consider talking to a counsellor for additional support",
          "Review your sleep habits and try to maintain a consistent schedule",
        ];
      } else {
        level = "Needs Attention";
        levelColor = "#b34747";
        advice =
          "You might be experiencing some challenges. We're here to support you.";
        recommendations = [
          "Reach out to a counsellor or mental health professional",
          "Contact our crisis support line for immediate help",
          "Talk to someone you trust about how you're feeling",
          "Practice grounding techniques when feeling overwhelmed",
          "Create a self-care plan with small, achievable goals",
          "Consider taking a break and prioritizing your well-being",
        ];
      }

      // Category-specific advice
      const categoryAdvice = catScores.map((category) => {
        let catAdvice = "";
        if (category.score >= 70) {
          catAdvice = `Your ${category.name} is healthy. Keep up the good work!`;
        } else if (category.score >= 40) {
          catAdvice = `Your ${category.name} could use some attention. Consider small improvements.`;
        } else {
          catAdvice = `Your ${category.name} needs attention. We recommend seeking support.`;
        }
        return {
          ...category,
          advice: catAdvice,
        };
      });

      return {
        level,
        levelColor,
        advice,
        recommendations,
        categoryAdvice,
      };
    };

    const advice = getAdvice(overallScore, categories);

    return {
      overallScore,
      categories,
      answers: selectedAnswers,
      level: advice.level,
      advice: advice.advice,
      recommendations: advice.recommendations,
      categoryAdvice: advice.categoryAdvice,
      levelColor: advice.levelColor,
      mode: currentStudent ? "student" : "anonymous",
    };
  };

  const goNext = () => {
    if (!answers[currentQuestion]) {
      alert("Please select an option before continuing.");
      return;
    }
    if (currentQuestion < total - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const handleSubmit = () => {
    const result = calculateResult(answers);
    saveAssessmentResult(currentStudent, result);
    navigate("/completion", { state: { result } });
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / total) * 100;
  const isAnswered = currentAnswer !== "";

  return (
    <div className="auth-page" style={{ padding: "20px" }}>
      <div className="auth-container" style={{ maxWidth: "560px" }}>
        <div className="auth-card">
          {/* Progress Bar */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                <FaList style={{ marginRight: "6px" }} size={14} />
                Question {currentQuestion + 1} of {total}
              </span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                <FaClock style={{ marginRight: "6px" }} size={14} />
                {Math.round(progress)}%
              </span>
            </div>
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
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #2a2a72, #4a8b6b)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Category Badge */}
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

          {/* Question */}
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: "24px",
              color: "#1f2937",
            }}
          >
            {q.text}
          </h2>

          {/* Options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
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
                  border:
                    currentAnswer === opt.label
                      ? "2px solid #2a2a72"
                      : "1.5px solid var(--dusty-rose)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  background:
                    currentAnswer === opt.label ? "#f0f4ff" : "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (currentAnswer !== opt.label) {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.borderColor = "#2a2a72";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentAnswer !== opt.label) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "var(--dusty-rose)";
                  }
                }}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt.label}
                  checked={currentAnswer === opt.label}
                  onChange={() => handleAnswer(opt.label)}
                  style={{
                    accentColor: "#2a2a72",
                    width: "18px",
                    height: "18px",
                  }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                {currentAnswer === opt.label && (
                  <FaCheckCircle color="#2a2a72" size={18} />
                )}
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={goBack}
              style={{
                background: "transparent",
                border: "none",
                color: "#2a2a72",
                cursor: currentQuestion > 0 ? "pointer" : "default",
                opacity: currentQuestion > 0 ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentQuestion > 0) {
                  e.currentTarget.style.background = "#f0f4ff";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <FaArrowLeft size={14} />
              Back
            </button>
            <Button
              onClick={goNext}
              disabled={!isAnswered}
              style={{
                opacity: isAnswered ? 1 : 0.5,
                cursor: isAnswered ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {currentQuestion < total - 1 ? (
                <>
                  Next <FaArrowRight />
                </>
              ) : (
                "Review & Submit"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#eef4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FaInfoCircle size={32} color="#2a2a72" />
            </div>
            <h3 style={{ margin: 0, color: "#1f2937" }}>Submit Assessment?</h3>
            <p
              style={{ color: "#6b7280", marginTop: "8px", lineHeight: "1.6" }}
            >
              You've answered all questions. Your results will be saved to your
              history and you'll receive personalized feedback.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "10px 24px",
                  background: "#f8fafc",
                  color: "#1f2937",
                  border: "1px solid #e6e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e6e8f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f8fafc";
                }}
              >
                <FaTimesCircle size={16} />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 24px",
                  background: "#4a8b6b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#3a7a5a";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#4a8b6b";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <FaCheckCircle size={16} />
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
