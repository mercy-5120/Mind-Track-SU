import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTag,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
  FaSpinner,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCheck,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import { getReferrals, updateReferral } from "../../../api/staffApi";

export default function Referrals() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [localReferrals, setLocalReferrals] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const role = sessionStorage.getItem("staffRole");

  // Normalize status strings to handle case variations and aliases
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const lower = status.toLowerCase().trim();
    if (lower === "pending" || lower === "pend") return "pending";
    if (lower === "acknowledged" || lower === "accepted" || lower === "acknowledge") return "acknowledged";
    if (lower === "completed" || lower === "complete" || lower === "resolved" || lower === "done") return "completed";
    return lower;
  };

  // Load referrals from API and localStorage
  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const apiReferrals = await getReferrals();
        console.log("[Referrals] API referrals:", apiReferrals);

        if (apiReferrals && apiReferrals.length > 0) {
          // Filter to only show referrals assigned to peer counsellors
          const peerReferrals = apiReferrals.filter(
            (r) =>
              r.referred_to === "peer_counsellor" ||
              r.referred_to?.toLowerCase().includes("peer") ||
              r.referredTo === "peer_counsellor"
          );
          setReferrals(peerReferrals || []);
        }
      } catch (error) {
        console.warn("[Referrals] API load failed, using localStorage:", error);
        setReferrals([]);
      }
    };
    loadReferrals();

    // Load from localStorage as fallback
    const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
    console.log("[Referrals] Local referrals:", stored);

    const peerLocalReferrals = stored.filter(
      (r) =>
        r.referred_to === "peer_counsellor" ||
        r.referred_to?.toLowerCase().includes("peer") ||
        r.referredTo === "peer_counsellor"
    );
    setLocalReferrals(peerLocalReferrals);
  }, []);

  // Map frontend status to database-compatible status
  const mapStatusForDatabase = (status) => {
    if (status === "acknowledged") {
      return "accepted";
    }
    return status;
  };

  // Handle status update for a referral
  const handleStatusUpdate = async (referralId, newStatus) => {
    if (updating) return;

    const mappedStatus = mapStatusForDatabase(newStatus);

    try {
      setUpdating(true);
      setUpdateId(referralId);

      // Check if this is a local referral or from API
      const isLocal = localReferrals.some(
        (r) => r.id === referralId || r.referral_id === referralId,
      );

      if (isLocal) {
        // Update local storage
        const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
        const updated = stored.map((r) =>
          r.id === referralId || r.referral_id === referralId
            ? { ...r, referral_status: mappedStatus }
            : r,
        );
        localStorage.setItem("referrals", JSON.stringify(updated));

        // Update filtered local referrals
        const updatedLocal = updated.filter(
          (r) =>
            r.referred_to === "peer_counsellor" ||
            r.referred_to?.toLowerCase().includes("peer") ||
            r.referredTo === "peer_counsellor"
        );
        setLocalReferrals(updatedLocal);

        // Update API referrals state
        setReferrals((prev) =>
          prev.map((r) =>
            r.id === referralId || r.referral_id === referralId
              ? { ...r, referral_status: mappedStatus }
              : r,
          ),
        );

        alert(`Referral status updated to ${newStatus}`);
      } else {
        // Update via API
        try {
          await updateReferral(referralId, mappedStatus, null);

          setReferrals((prev) =>
            prev.map((r) =>
              r.referral_id === referralId
                ? { ...r, referral_status: mappedStatus }
                : r,
            ),
          );

          alert(`Referral status updated to ${newStatus}`);
        } catch (apiError) {
          // Fallback to local update if API fails
          console.warn(
            "[Referrals] API update failed, updating locally:",
            apiError,
          );

          const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
          const updated = stored.map((r) =>
            r.referral_id === referralId
              ? { ...r, referral_status: mappedStatus }
              : r,
          );
          localStorage.setItem("referrals", JSON.stringify(updated));

          const updatedLocal = updated.filter(
            (r) =>
              r.referred_to === "peer_counsellor" ||
              r.referred_to?.toLowerCase().includes("peer") ||
              r.referredTo === "peer_counsellor"
          );
          setLocalReferrals(updatedLocal);

          alert(`Referral status updated locally to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error("Error updating referral:", error);
      alert("Failed to update referral status. Please try again.");
    } finally {
      setUpdating(false);
      setUpdateId(null);
    }
  };

  // Combine and deduplicate referrals from both sources
  const allReferrals = useMemo(() => {
    const combined = [...referrals, ...localReferrals]
      .filter(
        (referral) =>
          referral.referred_to === "peer_counsellor" ||
          referral.referred_to?.toLowerCase().includes("peer") ||
          referral.referredTo === "peer_counsellor"
      )
      .filter(
        (referral, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              (r.referral_id || r.id) === (referral.referral_id || referral.id),
          )
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return combined;
  }, [referrals, localReferrals]);

  // Calculate statistics using normalized status values
  const stats = useMemo(() => {
    const pending = allReferrals.filter((r) => {
      const status = r.referral_status || "pending";
      return normalizeStatus(status) === "pending";
    }).length;
    
    const acknowledged = allReferrals.filter((r) => {
      const status = r.referral_status || "pending";
      return normalizeStatus(status) === "acknowledged";
    }).length;
    
    const completed = allReferrals.filter((r) => {
      const status = r.referral_status || "pending";
      return normalizeStatus(status) === "completed";
    }).length;
    
    return { pending, acknowledged, completed };
  }, [allReferrals]);

  // Status display helpers
  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === "completed" || normalized === "resolved")
      return styles.statusResolved;
    if (normalized === "acknowledged" || normalized === "viewed" || normalized === "accepted")
      return styles.statusReview;
    return styles.statusPending;
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === "completed" || normalized === "resolved") return "#2f855a";
    if (normalized === "acknowledged" || normalized === "viewed" || normalized === "accepted")
      return "#1e40af";
    return "#92400e";
  };

  const getStatusLabel = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === "completed") return "Completed";
    if (normalized === "resolved") return "Resolved";
    if (normalized === "acknowledged") return "Acknowledged";
    if (normalized === "viewed") return "Viewed";
    if (normalized === "accepted") return "Accepted";
    if (normalized === "pending") return "Pending";
    if (normalized === "rejected") return "Rejected";
    return status || "Pending";
  };

  const canUpdateStatus = (status) => {
    const normalized = normalizeStatus(status);
    return normalized !== "completed" && normalized !== "resolved";
  };

  const isUpdating = (id) => {
    return updating && updateId === id;
  };

  const handleCreateClick = () => {
    navigate("/staff/sumc/create-referral");
  };

  const canCreate = role === "sumc_counsellor";

  return (
    <Layout
      title="Peer Referrals"
      role={role === "peer_counsellor" ? "Peer Counsellor" : "SUMC Counsellor"}
    >
      <section
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            <FaUserCheck style={{ marginRight: "8px", color: "#4a8b6b" }} />
            Peer Referrals
          </h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
            Referrals assigned to peer counsellors for follow-up
          </p>
        </div>
        {canCreate && (
          <button
            className={buttonStyles.btnPrimary}
            onClick={handleCreateClick}
            style={{ maxWidth: "300px" }}
          >
            <FaPlus style={{ marginRight: "6px" }} /> Create New Referral
          </button>
        )}
      </section>

      <section className={styles.alertsTableSection}>
        {/* Statistics cards */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#f3f4f6",
              color: "#4a5568",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Total: {allReferrals.length}
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#fef3c7",
              color: "#92400e",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <FaClock style={{ marginRight: "4px" }} size={12} />
            Pending: {stats.pending}
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#dbeafe",
              color: "#1e40af",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <FaCheckCircle style={{ marginRight: "4px" }} size={12} />
            Acknowledged: {stats.acknowledged}
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#d4edda",
              color: "#2f855a",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <FaTimesCircle style={{ marginRight: "4px" }} size={12} />
            Completed: {stats.completed}
          </span>
        </div>

        {/* Referrals table */}
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Referral ID</th>
                <th>Student</th>
                <th>Contact</th>
                <th>Referred To</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allReferrals.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#4a5568",
                    }}
                  >
                    No peer referrals yet
                  </td>
                </tr>
              ) : (
                allReferrals.map((referral) => {
                  const referralId = referral.referral_id || referral.id;
                  const currentStatus = referral.referral_status || "pending";
                  const normalizedStatus = normalizeStatus(currentStatus);
                  const isCompleted = normalizedStatus === "completed" || normalizedStatus === "resolved";
                  const isUpdatingThis = isUpdating(referralId);

                  const contactNumber =
                    referral.studentContact ||
                    referral.contact_info ||
                    referral.student_contact ||
                    referral.student_phone ||
                    referral.phone ||
                    referral.contact;

                  const email =
                    referral.studentEmail ||
                    referral.student_email ||
                    referral.email;

                  return (
                    <tr key={`${referralId}-${referral.created_at}`}>
                      <td>#{referralId}</td>
                      <td>
                        <FaUser
                          style={{ marginRight: "6px", color: "#6b7280" }}
                          size={14}
                        />
                        {referral.studentName ||
                          referral.student_name ||
                          referral.studentId ||
                          "Anonymous"}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          {contactNumber ? (
                            <a
                              href={`tel:${contactNumber}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#2a2a72",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              <FaPhoneAlt size={14} color="#4a8b6b" />
                              {contactNumber}
                            </a>
                          ) : null}
                          {email ? (
                            <a
                              href={`mailto:${email}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#2a2a72",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              <FaEnvelope size={14} color="#4a8b6b" />
                              {email}
                            </a>
                          ) : null}
                          {!contactNumber && !email && (
                            <span
                              style={{ color: "#9ca3af", fontSize: "13px" }}
                            >
                              No contact info provided
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <FaTag
                          style={{ marginRight: "6px", color: "#4a8b6b" }}
                          size={14}
                        />
                        <span style={{ color: "#4a8b6b", fontWeight: "500" }}>
                          Peer Counsellor
                        </span>
                      </td>
                      <td>
                        <FaCalendarAlt
                          style={{ marginRight: "6px", color: "#6b7280" }}
                          size={14}
                        />
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={getStatusClass(currentStatus)}
                          style={{
                            color: getStatusColor(currentStatus),
                            fontWeight: "600",
                          }}
                        >
                          {getStatusLabel(currentStatus)}
                        </span>
                      </td>
                      <td>
                        <FaInfoCircle
                          style={{ marginRight: "6px", color: "#6b7280" }}
                          size={14}
                        />
                        {referral.notes || referral.reason || "—"}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {!isCompleted && canUpdateStatus(currentStatus) ? (
                            <>
                              <button
                                className={buttonStyles.btnSm}
                                onClick={() =>
                                  handleStatusUpdate(referralId, "acknowledged")
                                }
                                disabled={updating}
                                title="Acknowledge"
                                style={{
                                  padding: "6px 10px",
                                  background: "#dbeafe",
                                  color: "#1e40af",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: updating ? "default" : "pointer",
                                  fontSize: "12px",
                                  opacity: isUpdatingThis ? 0.6 : 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {isUpdatingThis ? (
                                  <FaSpinner
                                    size={14}
                                    style={{
                                      animation: "spin 1s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <FaCheckCircle size={14} />
                                )}
                                Acknowledge
                              </button>
                              <button
                                className={buttonStyles.btnSm}
                                onClick={() =>
                                  handleStatusUpdate(referralId, "completed")
                                }
                                disabled={updating}
                                title="Complete"
                                style={{
                                  padding: "6px 10px",
                                  background: "#d4edda",
                                  color: "#2f855a",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: updating ? "default" : "pointer",
                                  fontSize: "12px",
                                  opacity: isUpdatingThis ? 0.6 : 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {isUpdatingThis ? (
                                  <FaSpinner
                                    size={14}
                                    style={{
                                      animation: "spin 1s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <FaTimesCircle size={14} />
                                )}
                                Complete
                              </button>
                            </>
                          ) : isCompleted ? (
                            <span
                              style={{
                                padding: "6px 12px",
                                background: "#d4edda",
                                color: "#2f855a",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaCheckCircle size={14} />
                              Done
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: "6px 12px",
                                background: "#f3f4f6",
                                color: "#6b7280",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                            >
                              No Action
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    </Layout>
  );
}