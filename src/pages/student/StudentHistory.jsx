// src/pages/student/StudentHistory.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentStudent,
  getAssessmentHistory,
} from "../../utils/studentSession";
import {
  FaCalendarAlt,
  FaUser,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowRight,
  FaMedal,
  FaLightbulb,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
} from "react-icons/fa";

// Helper function to format date in Kenyan time
const formatKenyanDate = (dateString) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
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
  if (score >= 70) return <FaRegSmile color="#2f855a" size={20} />;
  if (score >= 40) return <FaRegMeh color="#4a5568" size={20} />;
  return <FaRegFrown color="#b34747" size={20} />;
};

const getLevelColor = (level) => {
  switch (level) {
    case "High":
      return "#b34747";
    case "Moderate":
      return "#4a5568";
    case "Low":
      return "#2f855a";
    default:
      return "#6b7280";
  }
};

export default function StudentHistory() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);

        const student = getCurrentStudent();
        setCurrentStudent(student);

        let historyData = await getAssessmentHistory(student);

        if (!Array.isArray(historyData)) {
          console.warn("History is not an array:", historyData);
          historyData = [];
        }

        setHistory(historyData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading history:", err);
        setError(err.message || "Failed to load assessment history");
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const totalAssessments = history.length;
  const averageScore =
    totalAssessments > 0
      ? Math.round(
          history.reduce((sum, entry) => sum + (entry.overallScore || 0), 0) /
            totalAssessments,
        )
      : 0;

  const latestScore =
    totalAssessments > 0
      ? history[history.length - 1]?.overallScore || null
      : null;

  const getTrend = () => {
    if (totalAssessments < 2) return "stable";

    const lastScore = history[history.length - 1]?.overallScore || 0;
    const first = history[0]?.overallScore || 0;

    if (lastScore > first + 5) return "improving";
    if (lastScore < first - 5) return "declining";
    return "stable";
  };

  const trend = getTrend();

  const getTrendIcon = () => {
    if (trend === "improving")
      return (
        <FaArrowRight
          color="#2f855a"
          size={16}
          style={{ transform: "rotate(-45deg)" }}
        />
      );
    if (trend === "declining")
      return (
        <FaArrowRight
          color="#b34747"
          size={16}
          style={{ transform: "rotate(45deg)" }}
        />
      );
    return (
      <FaArrowRight
        color="#4a5568"
        size={16}
        style={{ transform: "rotate(90deg)" }}
      />
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "16px",
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
          }}
        />
        <p style={{ color: "#6b7280" }}>Loading history...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <FaExclamationTriangle size={48} color="#b34747" />
        <h2 style={{ color: "#b34747" }}>Something went wrong</h2>
        <p style={{ color: "#6b7280", textAlign: "center", maxWidth: "400px" }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 24px",
            background: "#2a2a72",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#1a1a5a")}
          onMouseLeave={(e) => (e.target.style.background = "#2a2a72")}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Sort history by date - NEWEST FIRST (for display)
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.taken_at || a.completed_at || a.assessment_date);
    const dateB = new Date(b.taken_at || b.completed_at || b.assessment_date);
    return dateB - dateA; // Newest first
  });

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #2a2a72 0%, #3a3a8a 100%)",
          borderRadius: "20px",
          padding: "32px 40px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
            Assessment History
          </h1>
          <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "16px" }}>
            Track your wellness journey over time
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <FaCalendarAlt style={{ marginRight: "8px" }} />
            {totalAssessments} assessment{totalAssessments !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      {totalAssessments > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
              borderLeft: "4px solid #2a2a72",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              <FaChartLine style={{ marginRight: "8px", color: "#2a2a72" }} />
              Average Score
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "28px",
                fontWeight: "700",
                color: "#2a2a72",
              }}
            >
              {averageScore}/100
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
              borderLeft: "4px solid #4a8b6b",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              <FaMedal style={{ marginRight: "8px", color: "#4a8b6b" }} />
              Latest Score
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "28px",
                fontWeight: "700",
                color: latestScore ? getScoreColor(latestScore) : "#6b7280",
              }}
            >
              {latestScore ? `${latestScore}/100` : "N/A"}
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
              borderLeft: "4px solid #2a2a72",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              <FaArrowRight style={{ marginRight: "8px", color: "#2a2a72" }} />
              Trend
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "18px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color:
                  trend === "improving"
                    ? "#2f855a"
                    : trend === "declining"
                      ? "#b34747"
                      : "#4a5568",
              }}
            >
              {getTrendIcon()}
              {trend === "improving"
                ? "Improving"
                : trend === "declining"
                  ? "Declining"
                  : "Stable"}
            </p>
          </div>
        </div>
      )}

      {/* History List */}
      <div
        style={{
          padding: "32px 40px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 16px 32px rgba(42,42,114,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, color: "#2a2a72", fontSize: "20px" }}>
            Recent Assessments
          </h2>
        </div>

        {sortedHistory.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <FaChartLine
              size={48}
              color="#2a2a72"
              style={{ marginBottom: "16px", opacity: 0.3 }}
            />
            <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
              No assessment history found yet.
            </p>
            <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px" }}>
              Complete a wellness check-in to see your score summary and
              recommendations.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {sortedHistory.map((entry, index) => {
              const displayScore = entry.overallScore || 0;
              // Check if this is the latest assessment (index === 0 because sorted newest first)
              const isLatest = index === 0;

              return (
                <div
                  key={entry.id || entry.assessment_id || index}
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #e6e8f0",
                    background: isLatest ? "#f8faff" : "#fafbff",
                    transition: "all 0.2s",
                    borderLeft: `4px solid ${getScoreColor(displayScore)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(42,42,114,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <FaCalendarAlt color="#2a2a72" size={16} />
                        <strong style={{ fontSize: "16px", color: "#1f2937" }}>
                          {formatKenyanDate(
                            entry.taken_at ||
                              entry.completed_at ||
                              entry.assessment_date,
                          )}
                        </strong>
                        {isLatest && (
                          <span
                            style={{
                              padding: "2px 12px",
                              background: "#2a2a72",
                              color: "#fff",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            Latest
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "4px",
                        }}
                      >
                        <FaUser color="#6b7280" size={14} />
                        <p
                          style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          {entry.student_name || "Student"}
                        </p>
                        <span
                          style={{
                            padding: "2px 10px",
                            background:
                              entry.mode === "anonymous"
                                ? "#fef3c7"
                                : "#dbeafe",
                            borderRadius: "12px",
                            fontSize: "12px",
                            color:
                              entry.mode === "anonymous"
                                ? "#92400e"
                                : "#1e40af",
                          }}
                        >
                          {entry.mode === "anonymous" ? "Anonymous" : "Account"}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {getScoreIcon(displayScore)}
                        <span
                          style={{
                            display: "block",
                            fontSize: "28px",
                            fontWeight: 700,
                            color: getScoreColor(displayScore),
                          }}
                        >
                          {displayScore}/100
                        </span>
                      </div>
                      <span style={{ color: "#6b7280", fontSize: "14px" }}>
                        Overall score
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  {entry.categories &&
                    Array.isArray(entry.categories) &&
                    entry.categories.length > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gap: "10px",
                          marginTop: "16px",
                          padding: "16px",
                          background: "#fff",
                          borderRadius: "12px",
                          border: "1px solid #e6e8f0",
                        }}
                      >
                        {entry.categories.map((cat) => (
                          <div
                            key={cat.name}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto 80px",
                              alignItems: "center",
                              gap: "12px",
                              padding: "4px 0",
                            }}
                          >
                            <span
                              style={{ color: "#1f2937", fontSize: "14px" }}
                            >
                              {cat.name}
                            </span>
                            <div
                              style={{
                                width: "100%",
                                maxWidth: "200px",
                                height: "6px",
                                background: "#e6e8f0",
                                borderRadius: "3px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${cat.score || 0}%`,
                                  height: "100%",
                                  background: getScoreColor(cat.score || 0),
                                  borderRadius: "3px",
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  color: "#1f2937",
                                }}
                              >
                                {cat.score || 0}/100
                              </span>
                              <span
                                style={{
                                  color: getLevelColor(cat.level),
                                  fontWeight: 500,
                                  fontSize: "12px",
                                  padding: "2px 8px",
                                  background: `${getLevelColor(cat.level)}15`,
                                  borderRadius: "12px",
                                }}
                              >
                                {cat.level || "N/A"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Advice */}
                  {entry.advice && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <FaInfoCircle
                        color="#2a2a72"
                        size={18}
                        style={{ marginTop: "2px", flexShrink: 0 }}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", color: "#2a2a72" }}>
                          Personalized Advice
                        </strong>
                        <p
                          style={{
                            margin: "4px 0 0",
                            color: "#4a5568",
                            fontSize: "14px",
                          }}
                        >
                          {entry.advice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
