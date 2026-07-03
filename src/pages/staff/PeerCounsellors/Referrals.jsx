import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import styles from "../../styles/Dashboard.module.css";
import buttonStyles from "../../styles/Button.module.css";
import { getReferrals } from "../../../api/staffApi";

export default function Referrals() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [localReferrals, setLocalReferrals] = useState([]);
  const role = sessionStorage.getItem("staffRole");

  useEffect(() => {
    const loadReferrals = async () => {
      const apiReferrals = await getReferrals();
      setReferrals(apiReferrals || []);
    };
    loadReferrals();

    // Load locally created referrals
    const stored = JSON.parse(localStorage.getItem("referrals") || "[]");
    setLocalReferrals(stored);
  }, []);

  const allReferrals = [...referrals, ...localReferrals].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  const handleCreateClick = () => {
    navigate("/staff/create-referral");
  };

  return (
    <Layout
      title="Referrals"
      role={role === "peer_counsellor" ? "Peer Counsellor" : "SUMC Counsellor"}
    >
      <section style={{ marginBottom: "30px" }}>
        {role === "sumc_counsellor" && (
          <button
            className={buttonStyles.btnPrimary}
            onClick={handleCreateClick}
            style={{ maxWidth: "300px" }}
          >
            <i className="fas fa-plus"></i> Create New Referral
          </button>
        )}
      </section>

      <section className={styles.alertsTableSection}>
        <h2>
          <i className="fas fa-user-md" style={{ marginRight: "8px" }}></i>
          Referrals
        </h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Referral ID</th>
                <th>Student</th>
                <th>Referred To</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {allReferrals.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#4a5568",
                    }}
                  >
                    No referrals yet
                  </td>
                </tr>
              ) : (
                allReferrals.map((referral, index) => (
                  <tr key={`${referral.referral_id || referral.id}-${index}`}>
                    <td>#{referral.referral_id || referral.id}</td>
                    <td>
                      {referral.student_name ||
                        referral.studentId ||
                        "Anonymous"}
                    </td>
                    <td>
                      {referral.referred_to || referral.referral_type || "N/A"}
                    </td>
                    <td>{referral.priority || "Normal"}</td>
                    <td>
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={
                          referral.referral_status === "accepted" ||
                          referral.referral_status === "resolved"
                            ? styles.statusResolved
                            : referral.referral_status === "acknowledged" ||
                                referral.referral_status === "viewed"
                              ? styles.statusReview
                              : styles.statusPending
                        }
                      >
                        {referral.referral_status || "Pending"}
                      </span>
                    </td>
                    <td>{referral.notes || referral.reason || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
