import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaPlus,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUser,
  FaTag,
  FaClock,
  FaFileAlt,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCheck,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import { createReferral } from "../../../api/staffApi";

export default function CreateReferral() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alertId: "",
    studentId: "",
    studentName: "",
    studentContact: "",
    studentEmail: "",
    referredTo: "peer_counsellor",
    reason: "",
    priority: "normal",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const role = (sessionStorage.getItem("staffRole") || "sumc_counsellor")
    .toLowerCase()
    .trim();

  if (role !== "sumc_counsellor") {
    const displayRole =
      role === "peer_counsellor" ? "Peer Counsellor" : "SUMC Counsellor";
    return (
      <Layout title="Create Referral" role={displayRole}>
        <div
          style={{
            background: "#fed7d7",
            border: "1px solid #fc8181",
            color: "#9b2c2c",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <FaShieldAlt style={{ marginRight: "8px" }} />
          You do not have permission to create referrals. Only SUMC Counsellors
          can perform this action.
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create the referral object with all fields
      const referralData = {
        alertId: formData.alertId ? parseInt(formData.alertId, 10) : null,
        studentId: formData.studentId,
        studentName: formData.studentName,
        studentContact: formData.studentContact,
        studentEmail: formData.studentEmail,
        referredTo: formData.referredTo,
        notes: formData.notes,
        referralStatus: "pending",
        reason: formData.reason,
        priority: formData.priority,
        created_at: new Date().toISOString(),
      };

      console.log("[CreateReferral] Submitting referral:", referralData);

      // Save to localStorage
      const existingReferrals = JSON.parse(
        localStorage.getItem("referrals") || "[]",
      );
      const newReferral = {
        ...referralData,
        id: Date.now(),
        referral_id: Date.now(),
        contact_info: formData.studentContact,
        student_contact: formData.studentContact,
        student_email: formData.studentEmail,
        // Include contact in multiple fields for compatibility
        contact: formData.studentContact,
        email: formData.studentEmail,
      };

      console.log("[CreateReferral] Saving to localStorage:", newReferral);
      existingReferrals.push(newReferral);
      localStorage.setItem("referrals", JSON.stringify(existingReferrals));

      // Also try to save via API
      try {
        await createReferral(referralData);
      } catch (apiError) {
        console.warn("API save failed, but saved locally:", apiError);
      }

      alert("Referral created successfully!");
      navigate("/staff/sumc/referrals");
    } catch (error) {
      console.error("[CreateReferral] Error:", error);
      alert("Error creating referral: " + (error.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Create New Referral" role="SUMC Counsellor">
      <section style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            border: "1px solid #ece8e2",
            borderRadius: "18px",
            padding: "28px 32px",
            boxShadow: "0 4px 12px rgba(42, 42, 114, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <FaUserMd size={28} color="#2a2a72" />
            <div>
              <h2 style={{ margin: 0, color: "#2a2a72" }}>
                Create New Referral
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Refer a student to a counsellor for follow-up support
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Student Information Section */}
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e6e8f0",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#2a2a72",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaUser size={16} />
                  Student Information
                </h4>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaUser style={{ marginRight: "6px" }} size={12} />
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      <FaPhoneAlt style={{ marginRight: "6px" }} size={12} />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="studentContact"
                      placeholder="Enter phone number"
                      value={formData.studentContact}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      <FaEnvelope style={{ marginRight: "6px" }} size={12} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="studentEmail"
                      placeholder="Enter email address"
                      value={formData.studentEmail}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaTag style={{ marginRight: "6px" }} size={12} />
                    Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    placeholder="Enter student ID (optional)"
                    value={formData.studentId}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Referral Details Section */}
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e6e8f0",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#2a2a72",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaUserCheck size={16} />
                  Referral Details
                </h4>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaExclamationTriangle
                      style={{ marginRight: "6px" }}
                      size={12}
                    />
                    Alert ID (Optional)
                  </label>
                  <input
                    type="number"
                    name="alertId"
                    placeholder="Enter alert ID (optional)"
                    value={formData.alertId}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaUserMd style={{ marginRight: "6px" }} size={12} />
                    Refer To *
                  </label>
                  <select
                    name="referredTo"
                    value={formData.referredTo}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="peer_counsellor">Peer Counsellor</option>
                    <option value="sumc_counsellor">SUMC Counsellor</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      <FaClock style={{ marginRight: "6px" }} size={12} />
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reason and Notes */}
              <div
                style={{
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e6e8f0",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#2a2a72",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaFileAlt size={16} />
                  Referral Details
                </h4>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaInfoCircle style={{ marginRight: "6px" }} size={12} />
                    Reason for Referral *
                  </label>
                  <textarea
                    name="reason"
                    placeholder="Describe why this student is being referred..."
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    <FaFileAlt style={{ marginRight: "6px" }} size={12} />
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="submit"
                  className={buttonStyles.btnPrimary}
                  disabled={submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 28px",
                  }}
                >
                  <FaPlus size={14} />
                  {submitting ? "Creating..." : "Create Referral"}
                </button>
                <button
                  type="button"
                  className={buttonStyles.btnSecondary}
                  onClick={() => navigate("/staff/sumc/referrals")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaTimes size={14} />
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
