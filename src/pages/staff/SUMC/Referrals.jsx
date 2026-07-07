// src/pages/staff/SUMC/Referrals.jsx
import React, { useEffect, useState } from "react";
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
  FaUsers,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import { getReferrals, updateReferral } from "../../../api/staffApi";

export default function SUMCReferrals() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [localReferrals, setLocalReferrals] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const role = sessionStorage.getItem("staffRole");

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const apiReferrals = await getReferrals();
        console.log("[SUMC Referrals] API referrals:", apiReferrals);

        if (apiReferrals && apiReferrals.length > 0) {
          // ✅ SHOW ALL referrals (both peer and sumc) created by SUMC
          // We'll show all referrals since SUMC created them
          setReferrals(apiReferrals || []);
        }
      } catch (error) {
        console.warn("[SUMC Referrals] API load failed, using localStorage:", error);
        setReferrals([]);
      }
    };
    loadReferrals();

    // ✅ SHOW ALL referrals from localStorage (both peer and sumc)
    const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
    console.log("[SUMC Referrals] Local referrals:", stored);
    setLocalReferrals(stored);
  }, []);

  const handleStatusUpdate = async (referralId, newStatus) => {
    if (updating) return;

    try {
      setUpdating(true);
      setUpdateId(referralId);

      const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
      const updated = stored.map((r) =>
        r.id === referralId || r.referral_id === referralId
          ? { ...r, referral_status: newStatus }
          : r,
      );
      localStorage.setItem("referrals", JSON.stringify(updated));
      setLocalReferrals(updated);

      alert(`Referral status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating referral:", error);
      alert("Failed to update referral status. Please try again.");
    } finally {
      setUpdating(false);
      setUpdateId(null);
    }
  };

  // ✅ Combine ALL referrals (no filtering)
  const allReferrals = [...referrals, ...localReferrals]
    .filter(
      (referral, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            (r.referral_id || r.id) === (referral.referral_id || referral.id),
        )
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const getStatusClass = (status) => {
    if (status === "completed" || status === "resolved")
      return styles.statusResolved;
    if (
      status === "acknowledged" ||
      status === "viewed" ||
      status === "accepted"
    )
      return styles.statusReview;
    return styles.statusPending;
  };

  const getStatusColor = (status) => {
    if (status === "completed" || status === "resolved") return "#2f855a";
    if (
      status === "acknowledged" ||
      status === "viewed" ||
      status === "accepted"
    )
      return "#1e40af";
    return "#92400e";
  };

  const getStatusLabel = (status) => {
    if (status === "completed") return "Completed";
    if (status === "resolved") return "Resolved";
    if (status === "acknowledged") return "Acknowledged";
    if (status === "viewed") return "Viewed";
    if (status === "accepted") return "Accepted";
    if (status === "pending") return "Pending";
    if (status === "rejected") return "Rejected";
    return status || "Pending";
  };

  const isUpdating = (id) => {
    return updating && updateId === id;
  };

  const handleCreateClick = () => {
    navigate("/staff/sumc/create-referral");
  };

  // Calculate stats from all referrals
  const pendingCount = allReferrals.filter(
    (r) => r.referral_status === "pending",
  ).length;
  const acknowledgedCount = allReferrals.filter(
    (r) =>
      r.referral_status === "acknowledged" || r.referral_status === "accepted",
  ).length;
  const completedCount = allReferrals.filter(
    (r) =>
      r.referral_status === "completed" || r.referral_status === "resolved",
  ).length;

  // Count peer vs sumc referrals
  const peerCount = allReferrals.filter(
    (r) =>
      r.referred_to === "peer_counsellor" ||
      r.referred_to?.toLowerCase().includes("peer") ||
      r.referredTo === "peer_counsellor"
  ).length;

  const sumcCount = allReferrals.filter(
    (r) =>
      r.referred_to === "sumc_counsellor" ||
      r.referred_to?.toLowerCase().includes("sumc") ||
      r.referredTo === "sumc_counsellor"
  ).length;

  return (
    <Layout title="SUMC Referrals" role="SUMC Counsellor">
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
          <h2 style={{ margin: 0, color: "#2a2a72" }}>
            <FaUserMd style={{ marginRight: "8px", color: "#2a2a72" }} />
            All Referrals
          </h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
            All referrals created by SUMC counsellors
          </p>
        </div>
        <button
          className={buttonStyles.btnPrimary}
          onClick={handleCreateClick}
          style={{ maxWidth: "300px" }}
        >
          <FaPlus style={{ marginRight: "6px" }} /> Create New Referral
        </button>
      </section>

      <section className={styles.alertsTableSection}>
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
            <FaUsers style={{ marginRight: "4px" }} />
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
            Pending: {pendingCount}
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
            Acknowledged: {acknowledgedCount}
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
            Completed: {completedCount}
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#e0e7ff",
              color: "#3730a3",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <FaUserCheck style={{ marginRight: "4px" }} />
            Peer: {peerCount}
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
            <FaUserMd style={{ marginRight: "4px" }} />
            SUMC: {sumcCount}
          </span>
        </div>

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
                    No referrals created yet
                  </td>
                </tr>
              ) : (
                allReferrals.map((referral) => {
                  const referralId = referral.referral_id || referral.id;
                  const currentStatus = referral.referral_status || "pending";
                  const isUpdatingThis = isUpdating(referralId);
                  
                  // Determine who it was referred to
                  const referredTo = referral.referred_to || referral.referredTo || "sumc_counsellor";
                  const isPeer = referredTo === "peer_counsellor" || referredTo?.toLowerCase().includes("peer");
                  const referredToLabel = isPeer ? "Peer Counsellor" : "SUMC Counsellor";
                  const referredToColor = isPeer ? "#4a8b6b" : "#2a2a72";

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
                          "Anonymous"}
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {referral.studentContact || referral.contact ? (
                            <span style={{ fontSize: "13px" }}>
                              <FaPhoneAlt size={14} color="#4a8b6b" />{" "}
                              {referral.studentContact || referral.contact}
                            </span>
                          ) : null}
                          {referral.studentEmail || referral.email ? (
                            <span style={{ fontSize: "13px" }}>
                              <FaEnvelope size={14} color="#4a8b6b" />{" "}
                              {referral.studentEmail || referral.email}
                            </span>
                          ) : null}
                          {!referral.studentContact && !referral.studentEmail && (
                            <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                              No contact info
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <FaTag style={{ marginRight: "6px", color: referredToColor }} size={14} />
                        <span style={{ color: referredToColor, fontWeight: "500" }}>
                          {referredToLabel}
                        </span>
                      </td>
                      <td>
                        <FaCalendarAlt style={{ marginRight: "6px", color: "#6b7280" }} size={14} />
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={getStatusClass(currentStatus)}
                          style={{ color: getStatusColor(currentStatus), fontWeight: "600" }}
                        >
                          {getStatusLabel(currentStatus)}
                        </span>
                      </td>
                      <td>
                        <FaInfoCircle style={{ marginRight: "6px", color: "#6b7280" }} size={14} />
                        {referral.notes || referral.reason || "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            className={buttonStyles.btnSm}
                            onClick={() => handleStatusUpdate(referralId, "acknowledged")}
                            disabled={updating}
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
                              <FaSpinner size={14} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                              <FaCheckCircle size={14} />
                            )}
                            Acknowledge
                          </button>
                          <button
                            className={buttonStyles.btnSm}
                            onClick={() => handleStatusUpdate(referralId, "completed")}
                            disabled={updating}
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
                              <FaSpinner size={14} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                              <FaTimesCircle size={14} />
                            )}
                            Complete
                          </button>
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