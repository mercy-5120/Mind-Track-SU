// src/pages/staff/PeerCounsellors/HighRiskAlerts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPhoneAlt,
  FaUserSecret,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import {
  getAlerts,
  updateAlertStatus,
  getCrisisAlerts,
  updateCrisisAlertStatus,
} from "../../../api/staffApi";

export default function HighRiskAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [crisisAlerts, setCrisisAlerts] = useState([]);
  const [localCrisisAlerts, setLocalCrisisAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = sessionStorage.getItem("staffRole") || "Peer Counsellor";

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);

        // Get all alerts (including crisis alerts from staff_alerts)
        const data = await getAlerts();
        setAlerts(Array.isArray(data) ? data : []);

        // Get crisis alerts directly from crisis_alerts table
        const crisisData = await getCrisisAlerts();
        setCrisisAlerts(Array.isArray(crisisData) ? crisisData : []);

        // Get anonymous crisis alerts from localStorage
        const storedAlerts = JSON.parse(
          localStorage.getItem("anonymousCrisisAlerts") || "[]",
        );
        console.log(
          "[HighRiskAlerts] Anonymous crisis alerts from localStorage:",
          storedAlerts,
        );
        setLocalCrisisAlerts(storedAlerts);

        console.log("[HighRiskAlerts] Total alerts:", data?.length || 0);
        console.log("[HighRiskAlerts] Crisis alerts:", crisisData?.length || 0);
        console.log(
          "[HighRiskAlerts] Local crisis alerts:",
          storedAlerts.length,
        );
      } catch (error) {
        console.error("Error loading alerts:", error);
        setAlerts([]);
        setCrisisAlerts([]);

        // Still try to load local alerts
        const storedAlerts = JSON.parse(
          localStorage.getItem("anonymousCrisisAlerts") || "[]",
        );
        setLocalCrisisAlerts(storedAlerts);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  // Combine and sort all alerts by date
  const allAlerts = [...alerts, ...crisisAlerts, ...localCrisisAlerts]
    .filter(
      (alert, index, self) =>
        index === self.findIndex((a) => a.alert_id === alert.alert_id),
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const getRiskClass = (risk) => {
    if (risk === "high") return styles.riskHigh;
    if (risk === "moderate") return styles.riskMedium;
    return styles.riskLow;
  };

  const getStatusClass = (status) => {
    if (status === "new" || status === "pending") return styles.statusPending;
    if (status === "viewed" || status === "acknowledged")
      return styles.statusReview;
    return styles.statusResolved;
  };

  const handleStatusChange = async (alertId, status) => {
    try {
      await updateAlertStatus(alertId, status);
      setAlerts((current) =>
        current.map((item) =>
          item.alert_id === alertId ? { ...item, alert_status: status } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCrisisStatusChange = async (alertId, status) => {
    try {
      // Check if it's a local alert
      const isLocal = localCrisisAlerts.some((a) => a.alert_id === alertId);

      if (isLocal) {
        // Update locally
        const storedAlerts = JSON.parse(
          localStorage.getItem("anonymousCrisisAlerts") || "[]",
        );
        const updatedAlerts = storedAlerts.map((a) =>
          a.alert_id === alertId ? { ...a, alert_status: status } : a,
        );
        localStorage.setItem(
          "anonymousCrisisAlerts",
          JSON.stringify(updatedAlerts),
        );
        setLocalCrisisAlerts(updatedAlerts);
      } else {
        await updateCrisisAlertStatus(alertId, status);
        setCrisisAlerts((current) =>
          current.map((item) =>
            item.alert_id === alertId
              ? { ...item, alert_status: status }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating crisis status:", error);
    }
  };

  if (loading) {
    return (
      <Layout title="High-Risk Alerts" role={role}>
        <section className={styles.alertsTableSection}>
          <p>Loading alerts...</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title="High-Risk Alerts" role="Peer Counsellor">
      <section className={styles.alertsTableSection}>
        <h2>
          <FaExclamationTriangle
            style={{ color: "#b34747", marginRight: "8px" }}
          />
          All High-Risk Alerts (including Crisis Contacts)
        </h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Student</th>
                <th>Risk Level</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Contact Info</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allAlerts.map((alert) => {
                const isAnonymous =
                  alert.is_anonymous ||
                  (alert.student_identifier &&
                    alert.student_identifier.includes("Anonymous"));

                return (
                  <tr key={`${alert.category}-${alert.alert_id}`}>
                    <td>#{alert.alert_id}</td>
                    <td>
                      {alert.student_name ||
                        alert.student_identifier ||
                        "Anonymous"}
                      {isAnonymous && (
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "10px",
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            color: "#6b7280",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaUserSecret size={10} />
                          Anonymous
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={getRiskClass(alert.risk_level)}>
                        {alert.risk_level}
                      </span>
                    </td>
                    <td>{alert.category}</td>
                    <td>{alert.created_at?.slice(0, 10) || "—"}</td>
                    <td>
                      <span className={getStatusClass(alert.alert_status)}>
                        {alert.alert_status}
                      </span>
                    </td>
                    <td>
                      {alert.contact_info ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaPhoneAlt size={12} color="#2a2a72" />
                          {alert.contact_info}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className={buttonStyles.btnSm}
                          onClick={() =>
                            navigate(
                              `/staff/peer/alert-details?id=${alert.alert_id}`,
                            )
                          }
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        {alert.category === "crisis" || alert.contact_info ? (
                          <>
                            <button
                              className={buttonStyles.btnSm}
                              onClick={() =>
                                handleCrisisStatusChange(
                                  alert.alert_id,
                                  "acknowledged",
                                )
                              }
                              title="Acknowledge"
                              disabled={
                                alert.alert_status === "acknowledged" ||
                                alert.alert_status === "resolved"
                              }
                            >
                              <FaCheckCircle size={14} />
                            </button>
                            <button
                              className={buttonStyles.btnSm}
                              onClick={() =>
                                handleCrisisStatusChange(
                                  alert.alert_id,
                                  "resolved",
                                )
                              }
                              title="Resolve"
                              disabled={alert.alert_status === "resolved"}
                            >
                              <FaTimesCircle size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={buttonStyles.btnSm}
                              onClick={() =>
                                handleStatusChange(
                                  alert.alert_id,
                                  "acknowledged",
                                )
                              }
                              title="Acknowledge"
                              disabled={
                                alert.alert_status === "acknowledged" ||
                                alert.alert_status === "resolved"
                              }
                            >
                              <FaCheckCircle size={14} />
                            </button>
                            <button
                              className={buttonStyles.btnSm}
                              onClick={() =>
                                handleStatusChange(alert.alert_id, "resolved")
                              }
                              title="Resolve"
                              disabled={alert.alert_status === "resolved"}
                            >
                              <FaTimesCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {allAlerts.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#4a5568" }}
          >
            <p>No high-risk alerts or crisis contacts at this time.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
