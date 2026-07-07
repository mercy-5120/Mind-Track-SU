import React from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import {
  getCurrentStudent,
  getLatestAssessment,
  getAssessmentHistory,
} from "../../utils/studentSession";
import {
  FaTachometerAlt,
  FaUser,
  FaHistory,
  FaPlusCircle,
  FaChartLine,
  FaExclamationTriangle,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaUniversity,
  FaBook,
  FaCalendarAlt,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
  FaInfoCircle,
} from "react-icons/fa";

export default function StudentDashboard() {
  const student = getCurrentStudent();
  const latestAssessment = getLatestAssessment(student);
  const history = getAssessmentHistory(student);
  const completedCount = history.length;

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

  // Calculate statistics
  const averageScore =
    completedCount > 0
      ? Math.round(
          history.reduce((sum, entry) => sum + entry.overallScore, 0) /
            completedCount,
        )
      : 0;

  const latestScore =
    completedCount > 0 ? history[history.length - 1].overallScore : null;

  // IMPROVED TREND CALCULATION
  const getTrend = () => {
    if (completedCount === 0) return "stable";
    if (completedCount === 1) return "stable";

    // Get the last 3 assessments or all if less than 3
    const recentAssessments = history.slice(-3);

    // Calculate the trend based on score changes
    let improvements = 0;
    let declines = 0;
    let totalChange = 0;

    for (let i = 1; i < recentAssessments.length; i++) {
      const prevScore = recentAssessments[i - 1].overallScore;
      const currentScore = recentAssessments[i].overallScore;
      const change = currentScore - prevScore;
      totalChange += change;

      if (change > 0) {
        improvements++;
      } else if (change < 0) {
        declines++;
      }
    }

    // If we have at least 3 assessments, use the majority trend
    if (recentAssessments.length >= 3) {
      if (improvements > declines) return "improving";
      if (declines > improvements) return "declining";
    }

    // Otherwise, use the overall change
    if (totalChange > 2) return "improving";
    if (totalChange < -2) return "declining";

    return "stable";
  };

  const trend = getTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return <FaArrowUp color="#2f855a" size={16} />;
      case "declining":
        return <FaArrowDown color="#b34747" size={16} />;
      default:
        return <FaMinus color="#4a5568" size={16} />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case "improving":
        return "Improving";
      case "declining":
        return "Declining";
      default:
        return "Stable";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "improving":
        return "#2f855a";
      case "declining":
        return "#b34747";
      default:
        return "#4a5568";
    }
  };

  // Get trend description based on number of assessments
  const getTrendDescription = () => {
    if (completedCount === 0) return "Complete an assessment to see your trend";
    if (completedCount === 1)
      return "Complete more assessments to see your trend";
    if (trend === "improving")
      return "Your scores are trending upward! Keep up the good work!";
    if (trend === "declining")
      return "Your scores are trending downward. Consider reaching out for support.";
    return "Your scores are consistent. Continue maintaining your wellness.";
  };

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
        {/* Welcome Header */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {student?.display_name
                ? student.display_name.charAt(0).toUpperCase()
                : student?.username
                  ? student.username.charAt(0).toUpperCase()
                  : "S"}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "600" }}>
                Welcome back, {student?.display_name || "Student"}
              </h1>
              <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "16px" }}>
                <FaUniversity style={{ marginRight: "8px" }} size={14} />
                {student?.department
                  ? `${student.department}, Year ${student.year_of_study}`
                  : "Student account"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                padding: "8px 20px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCheckCircle size={14} />
              Active
            </span>
          </div>
        </div>

        {/* Stats Cards */}
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
              <FaHistory style={{ marginRight: "8px", color: "#2a2a72" }} />
              Completed
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "32px",
                fontWeight: "700",
                color: "#2a2a72",
              }}
            >
              {completedCount}
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
              <FaChartLine style={{ marginRight: "8px", color: "#4a8b6b" }} />
              Average Score
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "32px",
                fontWeight: "700",
                color: "#4a8b6b",
              }}
            >
              {completedCount > 0 ? `${averageScore}/100` : "N/A"}
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
              <FaStar style={{ marginRight: "8px", color: "#2a2a72" }} />
              Latest Score
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "32px",
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
              borderLeft: "4px solid #4a8b6b",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              <FaClock style={{ marginRight: "8px", color: "#4a8b6b" }} />
              Trend
            </p>
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: getTrendColor(),
                }}
              >
                {getTrendIcon()}
                {getTrendText()}
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "400",
                }}
              >
                {getTrendDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <Link to="/assessment-intro" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "24px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
                borderLeft: "4px solid #2a2a72",
                transition: "all 0.2s",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(42,42,114,0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(42,42,114,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "#eef4ff",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaPlusCircle color="#2a2a72" size={24} />
                </div>
                <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px" }}>
                  Start New Assessment
                </h3>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Complete a fresh wellness check-in and keep the result in your
                account.
              </p>
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#2a2a72",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Get Started
                </span>
                <FaArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link to="/student/history" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "24px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
                borderLeft: "4px solid #4a8b6b",
                transition: "all 0.2s",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(42,42,114,0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(42,42,114,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "#f0fdf4",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaHistory color="#4a8b6b" size={24} />
                </div>
                <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px" }}>
                  View History
                </h3>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Review past scores and patterns over time.
              </p>
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#4a8b6b",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  View History
                </span>
                <FaArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link to="/crisis" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "24px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(42,42,114,0.08)",
                borderLeft: "4px solid #b34747",
                transition: "all 0.2s",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(42,42,114,0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(42,42,114,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "#fef2f2",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaShieldAlt color="#b34747" size={24} />
                </div>
                <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px" }}>
                  Need Urgent Support?
                </h3>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                Submit a confidential crisis contact request and get connected
                with a counsellor.
              </p>
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#b34747",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Get Help Now
                </span>
                <FaArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>

        {/* Latest Assessment Section */}
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
              <FaChartLine style={{ marginRight: "10px" }} />
              Latest Check-in
            </h2>
            {latestAssessment && (
              <Link
                to="/student/history"
                style={{
                  color: "#2a2a72",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                View All{" "}
                <FaArrowRight size={12} style={{ marginLeft: "4px" }} />
              </Link>
            )}
          </div>

          {latestAssessment ? (
            <div style={{ display: "grid", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  {getScoreIcon(latestAssessment.overallScore)}
                  <div>
                    <strong
                      style={{
                        fontSize: "24px",
                        color: getScoreColor(latestAssessment.overallScore),
                      }}
                    >
                      {latestAssessment.overallScore}/100
                    </strong>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      <FaCalendarAlt style={{ marginRight: "6px" }} size={14} />
                      {new Date(latestAssessment.taken_at).toLocaleDateString(
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
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      padding: "4px 12px",
                      background:
                        latestAssessment.mode === "anonymous"
                          ? "#fef3c7"
                          : "#dbeafe",
                      borderRadius: "12px",
                      fontSize: "13px",
                      color:
                        latestAssessment.mode === "anonymous"
                          ? "#92400e"
                          : "#1e40af",
                    }}
                  >
                    {latestAssessment.mode === "anonymous"
                      ? "Anonymous"
                      : "Account"}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {latestAssessment.categories?.map((category) => (
                  <div
                    key={category.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1f2937",
                          fontSize: "14px",
                          minWidth: "120px",
                        }}
                      >
                        {category.name}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: "#e6e8f0",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${category.score}%`,
                            height: "100%",
                            background: getScoreColor(category.score),
                            borderRadius: "3px",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#1f2937",
                        }}
                      >
                        {category.score}/100
                      </span>
                      <span
                        style={{
                          color:
                            category.level === "High"
                              ? "#b34747"
                              : category.level === "Moderate"
                                ? "#4a5568"
                                : "#2f855a",
                          fontSize: "12px",
                          padding: "2px 8px",
                          background:
                            category.level === "High"
                              ? "#fef2f2"
                              : category.level === "Moderate"
                                ? "#f3f4f6"
                                : "#f0fdf4",
                          borderRadius: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {category.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {latestAssessment.overallScore < 40 && (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <FaInfoCircle
                    color="#b34747"
                    size={18}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ color: "#b34747", fontSize: "14px" }}>
                      Support Available
                    </strong>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#4a5568",
                        fontSize: "14px",
                      }}
                    >
                      Your recent assessment indicates you might benefit from
                      additional support. Please consider reaching out to a
                      counsellor or using our crisis support resources.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
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
                No completed assessments yet.
              </p>
              <p
                style={{ color: "#9ca3af", fontSize: "14px", marginTop: "8px" }}
              >
                Start one to see personalized feedback and trends.
              </p>
              <Link to="/assessment-intro">
                <button
                  style={{
                    marginTop: "16px",
                    padding: "10px 24px",
                    background: "#2a2a72",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "16px auto 0",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1a1a5a";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#2a2a72";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <FaPlusCircle size={16} />
                  Start First Assessment
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
