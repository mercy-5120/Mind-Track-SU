import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaHeart,
  FaShieldAlt,
  FaTimes,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLock,
  FaClock,
  FaUserFriends,
  FaHeadset,
} from "react-icons/fa";
import Button from "../../components/Button";
import { getCurrentStudent, saveCrisisAlert } from "../../utils/studentSession";

export default function CrisisPrompt() {
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();
  const [showForm, setShowForm] = useState(false);
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (contact.trim()) {
      saveCrisisAlert(currentStudent, contact);
      setSubmitted(true);
      setContact("");
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
      }, 3000);
    } else {
      alert("Please enter your contact information");
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "48px 52px",
            boxShadow: "0 24px 48px rgba(42,42,114,0.12)",
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

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
              paddingTop: "8px",
            }}
          >
            <div
              style={{
                padding: "14px",
                borderRadius: "50%",
                background: "rgba(179,75,75,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaHeart size={32} color="#b34747" />
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
                We Are Here for You
              </h1>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#6b7280",
                  fontSize: "16px",
                }}
              >
                You don't have to go through this alone
              </p>
            </div>
          </div>

          {!submitted ? (
            <>
              {/* Main Message */}
              <div
                style={{
                  padding: "20px 24px",
                  background: "rgba(179,75,75,0.06)",
                  borderRadius: "16px",
                  marginBottom: "28px",
                  border: "1px solid rgba(179,75,75,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <FaExclamationTriangle
                    color="#b34747"
                    size={20}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#1f2937",
                        fontSize: "16px",
                        lineHeight: "1.7",
                      }}
                    >
                      If this feels overwhelming, you do not have to carry it
                      alone. A caring person can help you through the next step.
                    </p>
                  </div>
                </div>
              </div>

              {/* Options */}
              {!showForm ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <Button
                    full
                    onClick={() => setShowForm(true)}
                    style={{
                      padding: "16px 24px",
                      fontSize: "16px",
                      borderRadius: "12px",
                    }}
                  >
                    <FaPhoneAlt style={{ marginRight: "10px" }} />
                    Yes, I would like a counsellor to contact me
                  </Button>

                  <Button
                    variant="secondary"
                    full
                    style={{
                      padding: "16px 24px",
                      fontSize: "16px",
                      borderRadius: "12px",
                    }}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Call 1199 for 24/7 immediate support. Would you like to see the number?",
                        )
                      ) {
                        alert("Call 1199 for 24/7 immediate support");
                      }
                    }}
                  >
                    <FaShieldAlt style={{ marginRight: "10px" }} />
                    No, I will manage on my own
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "24px",
                    background: "rgba(42,42,114,0.04)",
                    borderRadius: "16px",
                    border: "2px solid #2a2a72",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <FaLock size={18} color="#2a2a72" />
                    <h3
                      style={{ margin: 0, color: "#2a2a72", fontSize: "16px" }}
                    >
                      Confidential Contact Information
                    </h3>
                  </div>
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    <FaInfoCircle style={{ marginRight: "6px" }} size={14} />
                    Your contact details will remain confidential and only used
                    to connect you with support.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter your email or phone number"
                    className="input-field"
                    style={{
                      marginBottom: "16px",
                      padding: "14px 16px",
                      fontSize: "16px",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "#2a2a72")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Button
                      full
                      onClick={handleSubmit}
                      style={{
                        padding: "14px 24px",
                        fontSize: "16px",
                        borderRadius: "10px",
                      }}
                    >
                      <FaCheckCircle style={{ marginRight: "8px" }} />
                      Submit Request
                    </Button>
                    <button
                      onClick={() => setShowForm(false)}
                      style={{
                        padding: "14px 24px",
                        background: "#f8fafc",
                        color: "#1f2937",
                        border: "1px solid #e6e8f0",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#e6e8f0";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#f8fafc";
                      }}
                    >
                      <FaTimes size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              <div
                style={{
                  marginTop: "28px",
                  padding: "20px 24px",
                  background: "rgba(179,75,75,0.08)",
                  borderRadius: "14px",
                  border: "1px solid rgba(179,75,75,0.15)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "50%",
                      background: "rgba(179,75,75,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaHeadset color="#b34747" size={22} />
                  </div>
                  <div>
                    <p
                      style={{ margin: 0, fontWeight: "600", color: "#1f2937" }}
                    >
                      <FaClock
                        style={{ marginRight: "6px" }}
                        size={14}
                        color="#b34747"
                      />
                      24/7 Immediate Support
                    </p>
                    <a
                      href="tel:1199"
                      style={{
                        fontWeight: "700",
                        color: "#b34747",
                        textDecoration: "none",
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaPhoneAlt size={16} />
                      Call 1199
                    </a>
                  </div>
                </div>
              </div>

              {/* Back Link */}
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link
                  to="/student/dashboard"
                  style={{
                    color: "#2a2a72",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: "500",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
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
                  <FaArrowLeft size={14} />
                  Return to Dashboard
                </Link>
              </div>
            </>
          ) : (
            // Success State
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#d4edda",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <FaCheckCircle size={48} color="#2f855a" />
              </div>
              <h2 style={{ color: "#1f2937", marginBottom: "8px" }}>
                Request Submitted
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}
              >
                <FaUserFriends style={{ marginRight: "8px" }} size={16} />A
                counsellor will contact you within 24 hours. You are not alone,
                and support is on the way.
              </p>
              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    padding: "14px 20px",
                    background: "rgba(179,75,75,0.06)",
                    borderRadius: "10px",
                    display: "inline-block",
                  }}
                >
                  <a
                    href="tel:1199"
                    style={{
                      color: "#b34747",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaPhoneAlt size={18} />
                    Need immediate help? Call 1199
                  </a>
                </div>
              </div>
              <Link
                to="/student/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "24px",
                  color: "#2a2a72",
                  textDecoration: "none",
                  fontWeight: "500",
                  padding: "12px 28px",
                  border: "2px solid #2a2a72",
                  borderRadius: "10px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2a2a72";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#2a2a72";
                }}
              >
                <FaArrowLeft size={16} />
                Return to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
