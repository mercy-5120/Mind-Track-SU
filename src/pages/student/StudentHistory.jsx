import React from "react";
import StudentLayout from "../../components/StudentLayout";
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
} from "react-icons/fa";

export default function StudentHistory() {
  const currentStudent = getCurrentStudent();
  const history = getAssessmentHistory(currentStudent);

  const getScoreColor = (score) => {
    if (score >= 70) return "#2f855a";
    if (score >= 40) return "#4a5568";
    return "#b34747";
  };

  const getScoreEmoji = (score) => {
    if (score >= 70) return <FaCheckCircle color="#2f855a" size={20} />;
    if (score >= 40) return <FaInfoCircle color="#4a5568" size={20} />;
    return <FaExclamationTriangle color="#b34747" size={20} />;
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

  // Calculate statistics
  const totalAssessments = history.length;
  const averageScore =
    totalAssessments > 0
      ? Math.round(
          history.reduce((sum, entry) => sum + entry.overallScore, 0) /
            totalAssessments,
        )
      : 0;

  const latestScore =
    totalAssessments > 0 ? history[history.length - 1].overallScore : null;
  const firstScore = totalAssessments > 0 ? history[0].overallScore : null;
  const trend =
    totalAssessments > 1
      ? latestScore - firstScore > 0
        ? "improving"
        : latestScore - firstScore < 0
          ? "declining"
          : "stable"
      : "stable";

  return (
    <StudentLayout>
      <div
        style={{
          display: "grid",
          gap: "24px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
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
                  color: getScoreColor(latestScore),
                }}
              >
                {latestScore}/100
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
                <FaArrowRight
                  style={{ marginRight: "8px", color: "#2a2a72" }}
                />
                Trend
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "20px",
                  fontWeight: "600",
                  color:
                    trend === "improving"
                      ? "#2f855a"
                      : trend === "declining"
                        ? "#b34747"
                        : "#4a5568",
                }}
              >
                {trend === "improving" && "📈 Improving"}
                {trend === "declining" && "📉 Declining"}
                {trend === "stable" && "➡️ Stable"}
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

          {history.length === 0 ? (
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
              <p
                style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px" }}
              >
                Complete a wellness check-in to see your score summary and
                recommendations.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {history
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "24px",
                      borderRadius: "16px",
                      border: "1px solid #e6e8f0",
                      background: index === 0 ? "#f8faff" : "#fafbff",
                      transition: "all 0.2s",
                      borderLeft: `4px solid ${getScoreColor(entry.overallScore)}`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(42,42,114,0.1)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = "none";
                      e.target.style.transform = "translateY(0)";
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
                          <strong
                            style={{ fontSize: "16px", color: "#1f2937" }}
                          >
                            {new Date(entry.taken_at).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </strong>
                          {index === 0 && (
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
                            {entry.student_name}
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
                            {entry.mode === "anonymous"
                              ? "Anonymous"
                              : "Account"}
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
                          {getScoreEmoji(entry.overallScore)}
                          <span
                            style={{
                              display: "block",
                              fontSize: "28px",
                              fontWeight: 700,
                              color: getScoreColor(entry.overallScore),
                            }}
                          >
                            {entry.overallScore}/100
                          </span>
                        </div>
                        <span style={{ color: "#6b7280", fontSize: "14px" }}>
                          Overall score
                        </span>
                      </div>
                    </div>

                    {/* Categories */}
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
                      {entry.categories?.map((cat) => (
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
                          <span style={{ color: "#1f2937", fontSize: "14px" }}>
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
                                width: `${cat.score}%`,
                                height: "100%",
                                background: getScoreColor(cat.score),
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
                              {cat.score}/100
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
                              {cat.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Advice */}
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
                          Based on this check-in, try gentle self-care, rest,
                          and reach out to support if you need someone to talk
                          to.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
