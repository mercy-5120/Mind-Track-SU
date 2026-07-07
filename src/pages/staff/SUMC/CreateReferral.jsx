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
  FaHeart,
  FaUniversity,
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
    referredTo: "sumc_counsellor",
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
      await createReferral({
        alertId: parseInt(formData.alertId, 10),
        studentId: formData.studentId,
        referredTo: formData.referredTo,
        notes: formData.notes,
        referralStatus: "pending",
        studentName: formData.studentId,
        priority: formData.priority,
      });

      alert("Referral created successfully!");
      navigate("/staff/sumc/referrals");
    } catch (error) {
      alert("Error creating referral: " + (error.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <FaExclamationTriangle color="#b34747" />;
      case "high":
        return <FaExclamationTriangle color="#f59e0b" />;
      case "normal":
        return <FaClock color="#4a8b6b" />;
      case "low":
        return <FaClock color="#6b7280" />;
      default:
        return <FaClock />;
    }
  };

  return (
    <Layout title="Create New Referral" role="SUMC Counsellor">
      <section style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            border: "1px solid #ece8e2",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(42, 42, 114, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <FaUserMd size={24} color="#2a2a72" />
            <h2 style={{ margin: 0, color: "#2a2a72" }}>Create New Referral</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaExclamationTriangle
                    style={{ marginRight: "6px" }}
                    size={14}
                  />
                  Alert ID *
                </label>
                <input
                  type="number"
                  name="alertId"
                  placeholder="Enter alert ID"
                  value={formData.alertId}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaUser style={{ marginRight: "6px" }} size={14} />
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="Enter student ID"
                  value={formData.studentId}
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaUserMd style={{ marginRight: "6px" }} size={14} />
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
                  <option value="sumc_counsellor">SUMC Counsellor</option>
                  <option value="peer_counsellor">Peer Counsellor</option>
                  <option value="external_service">External Service</option>
                  <option value="medical">Medical Services</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaClock style={{ marginRight: "6px" }} size={14} />
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaFileAlt style={{ marginRight: "6px" }} size={14} />
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

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  <FaInfoCircle style={{ marginRight: "6px" }} size={14} />
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

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  className={buttonStyles.btnPrimary}
                  disabled={submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
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
