// src/pages/student/FeedbackScreen.jsx
import React, { useState, useEffect } from "react";
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
  FaClock,
  FaSignOutAlt,
} from "react-icons/fa";
import AssessmentLayout from "../../components/AssessmentLayout";
import Button from "../../components/Button";
import {
  getAssessmentHistory,
  getCurrentStudent,
  isStudentLoggedIn,
} from "../../utils/studentSession";

// Helper function to format date in Kenyan time
const formatKenyanDate = (dateString) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  });
};

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
      "You are doing well. Continue maintaining your current healthy habits and routines.";
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
      "You are managing okay, but there is room for improvement in some areas.";
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
      "You might be experiencing some challenges. We are here to support you.";
    recommendations = [
      "Reach out to a counsellor or mental health professional",
      "Contact our crisis support line for immediate help",
      "Talk to someone you trust about how you are feeling",
      "Practice grounding techniques when feeling overwhelmed",
      "Create a self-care plan with small, achievable goals",
      "Consider taking a break and prioritizing your well-being",
    ];
  }

  const categoryAdvice =
    categories?.map((category) => {
      let catAdvice = "";
      if (category.score >= 70) {
        catAdvice = `Your ${category.name} is healthy. Keep up the good work.`;
      } else if (category.score >= 40) {
        catAdvice = `Your ${category.name} could use some attention. Consider small improvements.`;
      } else {
        catAdvice = `Your ${category.name} needs attention. We recommend seeking support.`;
      }
      return {
        ...category,
        advice: catAdvice,
      };
    }) || [];

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
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = isStudentLoggedIn();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const resultFromState = location.state?.result;
        console.log("[FeedbackScreen] Result from state:", resultFromState);

        if (resultFromState) {
          setLatest(resultFromState);
          setLoading(false);
          return;
        }

        const history = await getAssessmentHistory(currentStudent);
        console.log("[FeedbackScreen] History from database:", history);

        if (history && Array.isArray(history) && history.length > 0) {
          const latestAssessment = history[history.length - 1];
          console.log("[FeedbackScreen] Latest assessment:", latestAssessment);
          setLatest(latestAssessment);
        } else {
          setLatest(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("[FeedbackScreen] Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [location, currentStudent]);

  // Handle exit for anonymous users - navigate to landing page
  const handleExit = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <AssessmentLayout>
        <div
          style={{
            textAlign: "center",
            padding: "60px 40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e6e8f0",
              borderTop: "4px solid #2a2a72",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <h2 style={{ color: "#1f2937" }}>Loading your results...</h2>
        </div>
      </AssessmentLayout>
    );
  }

  if (error) {
    return (
      <AssessmentLayout>
        <div
          style={{
            textAlign: "center",
            padding: "60px 40px",
          }}
        >
          <FaExclamationTriangle
            size={48}
            color="#b34747"
            style={{ marginBottom: "16px" }}
          />
          <h2 style={{ color: "#b34747" }}>Error loading results</h2>
          <p style={{ color: "#6b7280" }}>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AssessmentLayout>
    );
  }

  if (!latest) {
    return (
      <AssessmentLayout>
        <div
          style={{
            textAlign: "center",
            padding: "60px 40px",
          }}
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
            Complete a wellness assessment to see your personalized feedback and
            recommendations.
          </p>
          <Link to="/assessment-intro">
            <Button>Start Assessment</Button>
          </Link>
        </div>
      </AssessmentLayout>
    );
  }

  const adviceData = getAdvice(
    latest.overallScore || 0,
    latest.categories || [],
  );
  const highRisk =
    latest.categories?.some((cat) => cat.level === "High") || false;
  const assessmentDate = formatKenyanDate(latest.taken_at);

  return (
    <AssessmentLayout>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "40px 48px",
            boxShadow: "0 24px 48px rgba(42,42,114,0.12)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "linear-gradient(90deg, #2a2a72, #4a8b6b, #2a2a72)",
              borderRadius: "24px 24px 0 0",
              margin: "-40px -48px 24px -48px",
              padding: "0 48px",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            {getScoreIcon(latest.overallScore || 0)}
            <h1 style={{ margin: 0, color: "#2a2a72", fontSize: "28px" }}>
              Your Wellness Summary
            </h1>
          </div>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>
            <FaClock style={{ marginRight: "8px" }} size={14} />
            {assessmentDate}
          </p>

          {/* Overall Score */}
          <div
            style={{
              padding: "24px",
              background: "rgba(42,42,114,0.05)",
              borderRadius: "16px",
              marginBottom: "24px",
              borderLeft: `4px solid ${getScoreColor(latest.overallScore || 0)}`,
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
                    color: "#6b7280",
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
                      color: getScoreColor(latest.overallScore || 0),
                    }}
                  >
                    {latest.overallScore || 0}
                  </span>
                  <span style={{ color: "#6b7280" }}>/100</span>
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
              padding: "20px 24px",
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
                    ? "You Are Doing Well"
                    : adviceData.level === "Moderate"
                      ? "You Are Managing Okay"
                      : "We Are Here to Support You"}
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
          {latest.categories &&
            Array.isArray(latest.categories) &&
            latest.categories.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    marginBottom: "16px",
                    color: "#2a2a72",
                    fontSize: "18px",
                  }}
                >
                  <FaChartLine style={{ marginRight: "10px" }} />
                  Category Breakdown
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  }}
                >
                  {latest.categories.map((cat) => {
                    const catColor = getScoreColor(cat.score || 0);
                    const catLevel = getLevelText(cat.score || 0);
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
                          {cat.score || 0}/100
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
            )}

          {/* Category Insights */}
          {adviceData.categoryAdvice &&
            adviceData.categoryAdvice.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    marginBottom: "12px",
                    color: "#2a2a72",
                    fontSize: "18px",
                  }}
                >
                  <FaLightbulb style={{ marginRight: "10px" }} />
                  Category Insights
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {adviceData.categoryAdvice.map((cat) => (
                    <div
                      key={cat.name}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(42,42,114,0.04)",
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
                <h3
                  style={{
                    marginBottom: "12px",
                    color: "#2a2a72",
                    fontSize: "18px",
                  }}
                >
                  <FaCheckCircle style={{ marginRight: "10px" }} />
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

          {/* Crisis Alert */}
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
                    Connect with support now
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Conditional based on login status */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/assessment-intro" style={{ flex: 1 }}>
              <Button
                full
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FaArrowLeft size={16} />
                Take Another Assessment
              </Button>
            </Link>

            {/* Show Dashboard button only for logged-in users */}
            {isLoggedIn ? (
              <Link to="/student/dashboard" style={{ flex: 1 }}>
                <Button
                  variant="secondary"
                  full
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <FaHome size={16} />
                  Dashboard
                </Button>
              </Link>
            ) : (
              // Show Exit button for anonymous users
              <Button
                variant="secondary"
                full
                onClick={handleExit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  flex: 1,
                }}
              >
                <FaSignOutAlt size={16} />
                Exit
              </Button>
            )}
          </div>
        </div>
      </div>
    </AssessmentLayout>
  );
}
