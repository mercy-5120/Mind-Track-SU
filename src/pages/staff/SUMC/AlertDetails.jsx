// src/pages/staff/SUMC/AlertDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaInfoCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaUserSecret,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaClock,
  FaShieldAlt,
  FaSpinner,
  FaEye,
  FaUserGraduate,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import {
  getAlerts,
  updateAlertStatus,
  updateCrisisAlertStatus,
} from "../../../api/staffApi";

export default function AlertDetails() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const displayRole = "SUMC Counsellor";
  const backUrl = "/staff/sumc/dashboard";

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("[AlertDetails] Fetching alerts...");
        const data = await getAlerts();
        console.log("[AlertDetails] Raw data from API:", data);

        let alertsArray = [];
        if (Array.isArray(data)) {
          alertsArray = data;
        } else if (data && data.alerts && Array.isArray(data.alerts)) {
          alertsArray = data.alerts;
        } else if (data && data.data && Array.isArray(data.data)) {
          alertsArray = data.data;
        }

        // Also check localStorage for anonymous crisis alerts
        const anonymousAlerts = JSON.parse(
          localStorage.getItem("anonymousCrisisAlerts") || "[]",
        );
        console.log(
          "[AlertDetails] Anonymous alerts from localStorage:",
          anonymousAlerts,
        );

        // Merge anonymous alerts with API alerts
        const allAlerts = [...alertsArray, ...anonymousAlerts];

        // Remove duplicates based on alert_id
        const uniqueAlerts = allAlerts.filter(
          (alert, index, self) =>
            index === self.findIndex((a) => a.alert_id === alert.alert_id),
        );

        console.log("[AlertDetails] Processed alerts:", uniqueAlerts.length);
        console.log(
          "[AlertDetails] Crisis alerts with contact info:",
          uniqueAlerts.filter((a) => a.contact_info || a.category === "crisis")
            .length,
        );

        setAlerts(uniqueAlerts);
      } catch (error) {
        console.error("[AlertDetails] Error loading alerts:", error);
        setError("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const handleAction = async (action, alert) => {
    if (!alert || updating) return;
    const nextStatus = action === "resolve" ? "resolved" : "acknowledged";

    console.log("[AlertDetails] Action:", action, "Alert:", alert.alert_id);

    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      // Check if it's a crisis alert (has contact_info or category is crisis)
      if (alert.contact_info || alert.category === "crisis") {
        console.log("[AlertDetails] Updating crisis alert:", alert.alert_id);

        // Check if it's a local alert (from localStorage)
        const isLocal = alert.is_anonymous && !alert.student_id;

        if (isLocal) {
          // Update locally
          const storedAlerts = JSON.parse(
            localStorage.getItem("anonymousCrisisAlerts") || "[]",
          );
          const updatedAlerts = storedAlerts.map((a) =>
            a.alert_id === alert.alert_id
              ? { ...a, alert_status: nextStatus }
              : a,
          );
          localStorage.setItem(
            "anonymousCrisisAlerts",
            JSON.stringify(updatedAlerts),
          );
          console.log("[AlertDetails] Updated local alert:", alert.alert_id);
        } else {
          // Update via API
          await updateCrisisAlertStatus(alert.alert_id, nextStatus);
        }
      } else {
        console.log("[AlertDetails] Updating regular alert:", alert.alert_id);
        await updateAlertStatus(alert.alert_id, nextStatus);
      }

      // Update local state
      setAlerts((current) =>
        current.map((item) =>
          item.alert_id === alert.alert_id
            ? { ...item, alert_status: nextStatus }
            : item,
        ),
      );

      if (selectedAlert && selectedAlert.alert_id === alert.alert_id) {
        setSelectedAlert({ ...selectedAlert, alert_status: nextStatus });
      }

      setSuccessMessage(`Alert successfully ${nextStatus}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("[AlertDetails] Error updating status:", error);
      setError("Failed to update alert status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getRiskBadgeColor = (risk) => {
    if (risk === "high")
      return { bg: "#fef2f2", color: "#b34747", label: "High" };
    if (risk === "moderate")
      return { bg: "#fefce8", color: "#b45309", label: "Moderate" };
    return { bg: "#f0fdf4", color: "#2f855a", label: "Low" };
  };

  const getStatusBadgeColor = (status) => {
    if (status === "new" || status === "pending")
      return { bg: "#fef3c7", color: "#92400e", label: "New" };
    if (status === "acknowledged" || status === "viewed")
      return { bg: "#dbeafe", color: "#1e40af", label: "Acknowledged" };
    if (status === "resolved")
      return { bg: "#d4edda", color: "#2f855a", label: "Resolved" };
    if (status === "closed")
      return { bg: "#f3f4f6", color: "#4a5568", label: "Closed" };
    return { bg: "#f3f4f6", color: "#4a5568", label: status };
  };

  const getCategoryIcon = (category) => {
    if (category === "crisis") return <FaExclamationTriangle color="#b34747" />;
    if (category === "anxiety")
      return <FaExclamationTriangle color="#f59e0b" />;
    if (category === "depression")
      return <FaExclamationTriangle color="#6b7280" />;
    return <FaTag color="#6b7280" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAlert(null);
  };

  // Loading state
  if (loading) {
    return (
      <Layout title="Alert Details" role={displayRole}>
        <section
          className={styles.alertsTableSection}
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              gap: "16px",
            }}
          >
            <FaSpinner
              size={40}
              style={{ animation: "spin 1s linear infinite", color: "#2a2a72" }}
            />
            <p style={{ color: "#6b7280" }}>Loading alerts...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </section>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout title="Alert Details" role={displayRole}>
        <section
          className={styles.alertsTableSection}
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fef2f2",
              borderRadius: "12px",
              border: "1px solid #fecaca",
            }}
          >
            <FaExclamationTriangle size={48} color="#b34747" />
            <h3 style={{ color: "#b34747", marginTop: "16px" }}>
              Error Loading Alerts
            </h3>
            <p style={{ color: "#6b7280" }}>{error}</p>
            <button
              onClick={() => navigate(backUrl)}
              style={{
                marginTop: "16px",
                padding: "10px 24px",
                background: "#2a2a72",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaArrowLeft size={14} />
              Back to Dashboard
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  // LIST VIEW - All alerts
  if (viewMode === "list") {
    return (
      <Layout title="Alert Details" role={displayRole}>
        <section
          className={styles.alertsTableSection}
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ margin: 0, color: "#2a2a72" }}>
              <FaExclamationTriangle style={{ marginRight: "10px" }} />
              All Alerts
            </h2>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {successMessage && (
            <div
              style={{
                padding: "12px 16px",
                background: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "8px",
                color: "#155724",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCheckCircle size={18} />
              {successMessage}
            </div>
          )}

          {alerts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e6e8f0",
              }}
            >
              <FaInfoCircle
                size={48}
                color="#6b7280"
                style={{ opacity: 0.3 }}
              />
              <h3 style={{ color: "#1f2937", marginTop: "16px" }}>
                No Alerts Found
              </h3>
              <p style={{ color: "#6b7280" }}>
                There are no alerts to display at this time.
              </p>
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Contact</th>
                    <th>Risk Level</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => {
                    const riskBadge = getRiskBadgeColor(alert.risk_level);
                    const statusBadge = getStatusBadgeColor(alert.alert_status);
                    const isCrisis =
                      !!alert.contact_info || alert.category === "crisis";

                    return (
                      <tr
                        key={alert.alert_id || index}
                        style={{
                          background: isCrisis ? "#fef2f2" : "transparent",
                        }}
                      >
                        <td>#{alert.alert_id}</td>
                        <td>
                          {alert.student_name ||
                            alert.student_identifier ||
                            "Anonymous"}
                          {alert.is_anonymous && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "10px",
                                background: "#f3f4f6",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                color: "#6b7280",
                              }}
                            >
                              Anonymous
                            </span>
                          )}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {getCategoryIcon(alert.category)}
                            {alert.category}
                            {isCrisis && (
                              <span
                                style={{
                                  background: "#fef2f2",
                                  color: "#b34747",
                                  fontSize: "10px",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                Crisis
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {alert.contact_info ? (
                            <a
                              href={`tel:${alert.contact_info}`}
                              style={{
                                color: "#2a2a72",
                                textDecoration: "none",
                                fontWeight: "600",
                              }}
                            >
                              <FaPhoneAlt
                                style={{ marginRight: "4px" }}
                                size={14}
                              />
                              {alert.contact_info}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: riskBadge.bg,
                              color: riskBadge.color,
                            }}
                          >
                            {riskBadge.label}
                          </span>
                        </td>
                        <td>{formatDate(alert.created_at)}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: statusBadge.bg,
                              color: statusBadge.color,
                            }}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() => handleViewAlert(alert)}
                              style={{
                                padding: "6px 10px",
                                background: "#2a2a72",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                              }}
                            >
                              <FaEye size={14} />
                              View
                            </button>
                            {alert.alert_status !== "resolved" &&
                              alert.alert_status !== "closed" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAction("acknowledge", alert)
                                    }
                                    disabled={
                                      updating ||
                                      alert.alert_status === "acknowledged"
                                    }
                                    style={{
                                      padding: "6px 10px",
                                      background:
                                        alert.alert_status === "acknowledged"
                                          ? "#d1d5db"
                                          : "#fef3c7",
                                      color:
                                        alert.alert_status === "acknowledged"
                                          ? "#6b7280"
                                          : "#92400e",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor:
                                        alert.alert_status === "acknowledged"
                                          ? "default"
                                          : "pointer",
                                      fontSize: "12px",
                                      opacity:
                                        alert.alert_status === "acknowledged"
                                          ? 0.6
                                          : 1,
                                    }}
                                  >
                                    {alert.alert_status === "acknowledged"
                                      ? "Acked"
                                      : "Ack"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("resolve", alert)
                                    }
                                    disabled={updating}
                                    style={{
                                      padding: "6px 10px",
                                      background: "#d4edda",
                                      color: "#2f855a",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Resolve
                                  </button>
                                </>
                              )}
                            {alert.alert_status === "resolved" && (
                              <span
                                style={{
                                  padding: "6px 10px",
                                  background: "#d4edda",
                                  color: "#2f855a",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                ✓ Resolved
                              </span>
                            )}
                            {alert.alert_status === "closed" && (
                              <span
                                style={{
                                  padding: "6px 10px",
                                  background: "#f3f4f6",
                                  color: "#4a5568",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                Closed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Layout>
    );
  }

  // No alert selected in detail view
  if (!selectedAlert) {
    return (
      <Layout title="Alert Details" role={displayRole}>
        <section
          className={styles.alertsTableSection}
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
            }}
          >
            <FaInfoCircle size={48} color="#6b7280" style={{ opacity: 0.3 }} />
            <h3 style={{ color: "#1f2937", marginTop: "16px" }}>
              No Alert Selected
            </h3>
            <p style={{ color: "#6b7280" }}>
              Please select an alert to view details.
            </p>
            <button
              onClick={handleBackToList}
              style={{
                marginTop: "16px",
                padding: "10px 24px",
                background: "#2a2a72",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaArrowLeft size={14} />
              Back to List
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  const isResolved = selectedAlert.alert_status === "resolved";
  const isAcknowledged = selectedAlert.alert_status === "acknowledged";
  const riskBadge = getRiskBadgeColor(selectedAlert.risk_level);
  const statusBadge = getStatusBadgeColor(selectedAlert.alert_status);
  const isCrisis =
    !!selectedAlert.contact_info || selectedAlert.category === "crisis";

  // DETAIL VIEW - Single alert
  return (
    <Layout title="Alert Details" role={displayRole}>
      <section
        className={styles.alertsTableSection}
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#2a2a72",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <FaInfoCircle style={{ color: "#2a2a72" }} />
              Alert #{selectedAlert.alert_id}
              {isCrisis && (
                <span
                  style={{
                    background: "#fef2f2",
                    color: "#b34747",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaExclamationTriangle size={14} />
                  Crisis Alert
                </span>
              )}
              {selectedAlert.is_anonymous && (
                <span
                  style={{
                    background: "#f3f4f6",
                    color: "#6b7280",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaUserSecret size={14} />
                  Anonymous
                </span>
              )}
            </h2>
            <p
              style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}
            >
              Created {formatDate(selectedAlert.created_at)}
            </p>
          </div>
          <button
            onClick={handleBackToList}
            style={{
              background: "#4a5568",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2d3748")}
            onMouseLeave={(e) => (e.target.style.background = "#4a5568")}
          >
            <FaArrowLeft size={14} />
            Back to List
          </button>
        </div>

        {successMessage && (
          <div
            style={{
              padding: "12px 16px",
              background: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: "8px",
              color: "#155724",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCheckCircle size={18} />
            {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "8px",
              color: "#721c24",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaExclamationTriangle size={18} />
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              <FaExclamationTriangle style={{ marginRight: "6px" }} size={14} />
              Risk Level
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                background: riskBadge.bg,
                color: riskBadge.color,
              }}
            >
              {riskBadge.label}
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              <FaTag style={{ marginRight: "6px" }} size={14} />
              Status
            </p>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                background: statusBadge.bg,
                color: statusBadge.color,
              }}
            >
              {statusBadge.label}
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              <FaUser style={{ marginRight: "6px" }} size={14} />
              Student
            </p>
            <p style={{ fontWeight: "600", margin: 0, color: "#1f2937" }}>
              {selectedAlert.student_name || "Anonymous"}
              {selectedAlert.is_anonymous && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  (Anonymous)
                </span>
              )}
            </p>
          </div>
          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              <FaClock style={{ marginRight: "6px" }} size={14} />
              Date Created
            </p>
            <p style={{ fontWeight: "600", margin: 0, color: "#1f2937" }}>
              {formatDate(selectedAlert.created_at)}
            </p>
          </div>
        </div>

        {selectedAlert.contact_info && (
          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e6e8f0",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                marginBottom: "8px",
                fontSize: "13px",
              }}
            >
              <FaPhoneAlt style={{ marginRight: "6px" }} size={14} />
              Contact Information
            </p>
            <p style={{ margin: 0, fontSize: "15px", color: "#1f2937" }}>
              <a
                href={`tel:${selectedAlert.contact_info}`}
                style={{ color: "#2a2a72", textDecoration: "none" }}
              >
                {selectedAlert.contact_info}
              </a>
            </p>
          </div>
        )}

        <div
          style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e6e8f0",
            marginBottom: "16px",
          }}
        >
          <p
            style={{ color: "#6b7280", marginBottom: "8px", fontSize: "13px" }}
          >
            <FaUserSecret style={{ marginRight: "6px" }} size={14} />
            Description
          </p>
          <p style={{ margin: 0, lineHeight: "1.6", color: "#1f2937" }}>
            {isCrisis
              ? `Student ${selectedAlert.student_name || "Anonymous"} requested immediate crisis support.${selectedAlert.is_anonymous ? " (Anonymous submission)" : ""}`
              : `${selectedAlert.student_name || "Anonymous student"} requires follow-up for this alert.`}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e6e8f0",
            marginBottom: "24px",
          }}
        >
          <p
            style={{ color: "#6b7280", marginBottom: "8px", fontSize: "13px" }}
          >
            <FaUserGraduate style={{ marginRight: "6px" }} size={14} />
            Assigned Staff
          </p>
          <p style={{ margin: 0, color: "#1f2937" }}>
            {selectedAlert.assigned_staff_name || "Unassigned"}
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e6e8f0",
          }}
        >
          <p
            style={{
              color: "#6b7280",
              marginBottom: "16px",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            <FaShieldAlt style={{ marginRight: "8px" }} size={16} />
            Recommended Actions
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              className={buttonStyles.btnPrimary}
              onClick={() => handleAction("acknowledge", selectedAlert)}
              disabled={isResolved || isAcknowledged || updating}
              style={{
                opacity: isResolved || isAcknowledged || updating ? 0.6 : 1,
                cursor:
                  isResolved || isAcknowledged || updating
                    ? "default"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "500",
                border: "none",
                background:
                  isResolved || isAcknowledged ? "#6b7280" : "#2a2a72",
                color: "#fff",
                width: "100%",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isResolved && !isAcknowledged && !updating) {
                  e.target.style.background = "#1a1a5a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isResolved && !isAcknowledged && !updating) {
                  e.target.style.background = "#2a2a72";
                }
              }}
            >
              {updating ? (
                <FaSpinner
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <FaCheckCircle size={16} />
              )}
              {isResolved
                ? "Already Resolved"
                : isAcknowledged
                  ? "Already Acknowledged"
                  : isCrisis
                    ? "Acknowledge Crisis Request"
                    : "Acknowledge Alert"}
            </button>
            <button
              className={buttonStyles.btnSecondary}
              onClick={() => handleAction("resolve", selectedAlert)}
              disabled={isResolved || updating}
              style={{
                opacity: isResolved || updating ? 0.6 : 1,
                cursor: isResolved || updating ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "500",
                border: "2px solid #4a8b6b",
                background: "transparent",
                color: "#4a8b6b",
                width: "100%",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isResolved && !updating) {
                  e.target.style.background = "#4a8b6b";
                  e.target.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isResolved && !updating) {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4a8b6b";
                }
              }}
            >
              {updating ? (
                <FaSpinner
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <FaTimesCircle size={16} />
              )}
              {isResolved
                ? "Already Resolved"
                : isCrisis
                  ? "Resolve Crisis"
                  : "Resolve Alert"}
            </button>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </section>
    </Layout>
  );
}
