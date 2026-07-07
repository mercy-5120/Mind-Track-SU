import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaHeart,
  FaLeaf,
  FaMoon,
  FaCheckCircle,
  FaInfoCircle,
  FaLightbulb,
  FaArrowLeft,
  FaHome,
  FaChartLine,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
} from "react-icons/fa";
import Button from "../../components/Button";
import {
  getAssessmentHistory,
  getCurrentStudent,
} from "../../utils/studentSession";

const getScoreColor = (score) => {
  if (score >= 70) return "#2f855a";
  if (score >= 40) return "#4a5568";
  return "#b34747";
};

const getScoreIcon = (score) => {
  if (score >= 70) return <FaRegSmile color="#2f855a" size={24} />;
  if (score >= 40) return <FaRegMeh color="#4a5568" size={24} />;
  return <FaRegFrown color="#b34747" size={24} />;
};

const getLevelText = (score) => {
  if (score >= 70) return "Low";
  if (score >= 40) return "Moderate";
  return "High";
};

const getLevelColor = (score) => {
  if (score >= 70) return "#2f855a";
  if (score >= 40) return "#4a5568";
  return "#b34747";
};

const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case "Burnout":
      return <FaExclamationTriangle />;
    case "Sleep":
      return <FaMoon />;
    case "Depression":
      return <FaLeaf />;
    case "Anxiety":
      return <FaHeart />;
    default:
      return <FaInfoCircle />;
  }
};

const getAdvice = (overallScore, categories) => {
  let level = "";
  let levelColor = "";
  let advice = "";
  let recommendations = [];

  if (overallScore >= 70) {
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
  } else if (overallScore >= 40) {
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

  const categoryAdvice = categories.map((category) => {
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

export default function FeedbackScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();
  const history = getAssessmentHistory(currentStudent);

  // Check if we have a result from navigation state (from assessment completion)
  const resultFromState = location.state?.result;

  // Use result from state if available, otherwise get latest from history
  let latest = resultFromState || history[history.length - 1] || null;

  // If no result found, show empty state
  if (!latest) {
    return (
      <div style={{ padding: "40px 20px" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          <div
            className="card"
            style={{ textAlign: "center", padding: "60px 40px" }}
          >
            <FaChartLine
              size={64}
              color="#2a2a72"
              style={{ opacity: 0.3, marginBottom: "16px" }}
            />
            <h2 style={{ color: "#1f2937", marginBottom: "12px" }}>
              No Assessment Results
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Complete a wellness assessment to see your personalized feedback
              and recommendations.
            </p>
            <Link to="/assessment-intro">
              <Button>Start Assessment</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get dynamic advice based on scores
  const adviceData = getAdvice(latest.overallScore, latest.categories || []);

  // Check if any category is "High" (needs attention)
  const highRisk =
    latest.categories?.some((cat) => cat.level === "High") || false;

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "760px" }}>
        <div className="card">
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            {getScoreIcon(latest.overallScore)}
            <h1 style={{ margin: 0, color: "#2a2a72" }}>
              Your Wellness Summary
            </h1>
          </div>
          <p style={{ color: "var(--warm-gray)", marginBottom: "24px" }}>
            Here is a calm overview of your recent check-in and your saved
            assessment history.
          </p>

          {/* Overall Score */}
          <div
            style={{
              padding: "20px",
              background: "rgba(42,42,114,0.05)",
              borderRadius: "16px",
              marginBottom: "24px",
              borderLeft: `4px solid ${getScoreColor(latest.overallScore)}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "var(--warm-gray)",
                    fontSize: "0.9rem",
                    marginBottom: "4px",
                  }}
                >
                  Overall Wellness Score
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      color: getScoreColor(latest.overallScore),
                    }}
                  >
                    {latest.overallScore}
                  </span>
                  <span style={{ color: "var(--warm-gray)" }}>/100</span>
                </div>
              </div>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: adviceData.levelColor,
                  background: adviceData.levelColor + "20",
                }}
              >
                {adviceData.level}
              </span>
            </div>
          </div>

          {/* Personalized Advice */}
          <div
            style={{
              padding: "20px",
              background: adviceData.levelColor + "15",
              borderRadius: "14px",
              marginBottom: "24px",
              border: `1px solid ${adviceData.levelColor}30`,
            }}
          >
            <div
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
            >
              <FaInfoCircle
                color={adviceData.levelColor}
                size={20}
                style={{ marginTop: "2px", flexShrink: 0 }}
              />
              <div>
                <strong
                  style={{ color: adviceData.levelColor, fontSize: "16px" }}
                >
                  {adviceData.level === "Good"
                    ? "🌟 You're Doing Well!"
                    : adviceData.level === "Moderate"
                      ? "📊 You're Managing Okay"
                      : "🫂 We're Here to Support You"}
                </strong>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#1f2937",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  {adviceData.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px", color: "#2a2a72" }}>
              Category Breakdown
            </h3>
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              }}
            >
              {latest.categories?.map((cat) => {
                const catColor = getScoreColor(cat.score);
                const catLevel = getLevelText(cat.score);
                return (
                  <div
                    key={cat.name}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      background: catColor + "10",
                      border: `1px solid ${catColor}30`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: 700,
                        color: catColor,
                      }}
                    >
                      {getCategoryIcon(cat.name)} {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        marginTop: "8px",
                        color: catColor,
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
                        fontWeight: "500",
                        color: catColor,
                        background: catColor + "20",
                      }}
                    >
                      {catLevel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Advice */}
          {adviceData.categoryAdvice &&
            adviceData.categoryAdvice.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", color: "#2a2a72" }}>
                  <FaLightbulb style={{ marginRight: "8px" }} />
                  Category Insights
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {adviceData.categoryAdvice.map((cat) => (
                    <div
                      key={cat.name}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(42,42,114,0.05)",
                        borderLeft: `3px solid ${getScoreColor(cat.score)}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {getCategoryIcon(cat.name)}
                        <strong style={{ color: "#1f2937" }}>{cat.name}</strong>
                        <span
                          style={{
                            color: getScoreColor(cat.score),
                            fontWeight: "600",
                          }}
                        >
                          ({cat.score}/100)
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        {cat.advice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
          {adviceData.recommendations &&
            adviceData.recommendations.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", color: "#2a2a72" }}>
                  <FaLightbulb style={{ marginRight: "8px" }} />
                  Recommendations
                </h3>
                <div style={{ display: "grid", gap: "8px" }}>
                  {adviceData.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#f8fafc",
                      }}
                    >
                      <FaCheckCircle
                        color="#4a8b6b"
                        size={16}
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      />
                      <span style={{ color: "#1f2937", fontSize: "14px" }}>
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Assessment History */}
          {history.length > 0 ? (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "10px", color: "#2a2a72" }}>
                <FaChartLine style={{ marginRight: "8px" }} />
                Assessment History
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                {history
                  .slice()
                  .reverse()
                  .slice(0, 5) // Show only last 5
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "rgba(42,42,114,0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "#1f2937", fontSize: "14px" }}>
                        {new Date(entry.taken_at).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          fontWeight: "600",
                          color: getScoreColor(entry.overallScore),
                        }}
                      >
                        Score: {entry.overallScore}/100
                      </span>
                    </div>
                  ))}
              </div>
              {history.length > 5 && (
                <Link
                  to="/student/history"
                  style={{
                    color: "#2a2a72",
                    fontSize: "14px",
                    marginTop: "8px",
                    display: "inline-block",
                  }}
                >
                  View all {history.length} assessments →
                </Link>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--warm-gray)", marginBottom: "24px" }}>
              Your assessment history will appear here after you complete a
              check-in.
            </p>
          )}

          {/* Crisis Alert for High Risk */}
          {highRisk && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "14px",
                background: "rgba(179,75,75,0.1)",
                border: "1px solid rgba(179,75,75,0.2)",
                color: "#b34747",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FaExclamationTriangle size={20} />
              <div>
                <strong>Support Available</strong>
                <p style={{ margin: "2px 0 0", fontSize: "14px" }}>
                  Your assessment indicates you might benefit from additional
                  support.
                  <Link
                    to="/crisis"
                    style={{
                      color: "#b34747",
                      fontWeight: "600",
                      marginLeft: "6px",
                    }}
                  >
                    Connect with support now →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/assessment-intro" style={{ flex: 1 }}>
              <Button full>
                <FaArrowLeft style={{ marginRight: "8px" }} />
                Take Another Assessment
              </Button>
            </Link>
            <Link to="/student/dashboard" style={{ flex: 1 }}>
              <Button variant="secondary" full>
                <FaHome style={{ marginRight: "8px" }} />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
