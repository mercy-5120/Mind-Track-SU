// src/pages/student/AssessmentIntro.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaClock,
  FaUserSecret,
  FaArrowRight,
  FaHeart,
  FaBrain,
  FaMoon,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";
import AssessmentLayout from "../../components/AssessmentLayout";
import Button from "../../components/Button";

export default function AssessmentIntro() {
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    navigate("/assessment");
  };

  return (
    <AssessmentLayout>
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "48px 52px",
              boxShadow: "0 24px 48px rgba(42,42,114,0.10)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative top bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "linear-gradient(90deg, #2a2a72, #4a8b6b, #2a2a72)",
              }}
            />

            {/* Step Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                paddingTop: "8px",
              }}
            >
              <div
                style={{
                  padding: "6px 14px",
                  background: "rgba(42,42,114,0.1)",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#2a2a72",
                }}
              >
                Step 1 of 10
              </div>
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  background: "#e6e8f0",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "10%",
                    height: "100%",
                    background: "linear-gradient(90deg, #2a2a72, #4a8b6b)",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </div>

            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "50%",
                    background: "rgba(42,42,114,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaHeart size={28} color="#2a2a72" />
                </div>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#1f2937",
                    }}
                  >
                    Mental Wellness Check-In
                  </h1>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#6b7280",
                      fontSize: "16px",
                    }}
                  >
                    Take a moment to check in with yourself
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  background: "rgba(42,42,114,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(42,42,114,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "50%",
                    background: "rgba(42,42,114,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaBrain size={16} color="#2a2a72" />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1f2937",
                      display: "block",
                    }}
                  >
                    Anxiety
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    & Depression
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "16px 18px",
                  background: "rgba(74,139,107,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(74,139,107,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "50%",
                    background: "rgba(74,139,107,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaBolt size={16} color="#4a8b6b" />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1f2937",
                      display: "block",
                    }}
                  >
                    Burnout
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    & Stress
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "16px 18px",
                  background: "rgba(42,42,114,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(42,42,114,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "50%",
                    background: "rgba(42,42,114,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaMoon size={16} color="#2a2a72" />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1f2937",
                      display: "block",
                    }}
                  >
                    Sleep
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    Quality
                  </span>
                </div>
              </div>
            </div>

            {/* Info List */}
            <div
              style={{
                padding: "20px 24px",
                background: "#f8fafc",
                borderRadius: "14px",
                marginBottom: "28px",
                border: "1px solid #e6e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#1f2937",
                  }}
                >
                  <FaCheckCircle color="#4a8b6b" size={18} />
                  <span style={{ fontSize: "15px" }}>
                    Covers <strong>4 key areas</strong>: Anxiety, Depression,
                    Burnout & Sleep
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#1f2937",
                  }}
                >
                  <FaClock color="#2a2a72" size={18} />
                  <span style={{ fontSize: "15px" }}>
                    Takes <strong>2-3 minutes</strong> to complete
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#1f2937",
                  }}
                >
                  <FaUserSecret color="#4a8b6b" size={18} />
                  <span style={{ fontSize: "15px" }}>
                    Your responses stay <strong>confidential</strong> and secure
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <form
              onSubmit={handleStart}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <Button
                type="submit"
                full
                style={{
                  padding: "16px 24px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                Start Assessment
                <FaArrowRight size={16} />
              </Button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2a2a72",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(42,42,114,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <FaShieldAlt style={{ marginRight: "6px" }} size={14} />
                Sign in to your student account
              </button>
              <span
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                Your progress is saved when you're signed in
              </span>
            </div>
          </div>
        </div>
      </div>
    </AssessmentLayout>
  );
}
