import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaClock,
  FaUserCheck,
  FaBook,
  FaBell,
  FaCalendarCheck,
  FaUserMd,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import Layout from "../../../components/Layout";
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from "../../../styles/Button.module.css";
import {
  getAlerts,
  getReferrals,
  getResources,
  getCrisisAlerts,
} from "../../../api/staffApi";

export default function PeerDashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [crisisAlerts, setCrisisAlerts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [resources, setResources] = useState([]);

  // Normalize status strings to handle case variations and aliases
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const lower = status.toLowerCase().trim();
    if (lower === "pending" || lower === "pend") return "pending";
    if (lower === "acknowledged" || lower === "accepted" || lower === "acknowledge") return "acknowledged";
    if (lower === "completed" || lower === "complete" || lower === "resolved" || lower === "done") return "completed";
    return lower;
  };

  useEffect(() => {
    const loadData = async () => {
      // Load from API
      const [alertsData, crisisData, referralsData, resourcesData] =
        await Promise.all([
          getAlerts(),
          getCrisisAlerts(),
          getReferrals(),
          getResources(),
        ]);

      // Load from localStorage as well
      const storedReferrals = JSON.parse(localStorage.getItem("referrals") || "[]");

      // Combine API and localStorage referrals
      let allReferrals = [...referralsData, ...storedReferrals];

      // Deduplicate by id or referral_id
      allReferrals = allReferrals.filter(
        (referral, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              (r.referral_id || r.id) === (referral.referral_id || referral.id),
          )
      );

      // Filter for peer counsellor referrals
      const peerReferrals = allReferrals.filter(
        (item) =>
          item.referred_to === "peer_counsellor" ||
          item.referred_to?.toLowerCase().includes("peer") ||
          item.referredTo === "peer_counsellor"
      );
      setReferrals(peerReferrals);

      // Filter alerts assigned to peer counsellor
      const peerAlerts = alertsData.filter(
        (item) =>
          item.assigned_staff_role === "peer_counsellor" ||
          item.assigned_staff_id === 2,
      );
      setAlerts(peerAlerts);

      // Crisis alerts (all crisis alerts are relevant)
      setCrisisAlerts(Array.isArray(crisisData) ? crisisData : []);

      setResources(resourcesData);
    };
    loadData();
  }, []);

  // Count pending follow-ups using normalized status
  const pendingFollowups = alerts.filter(
    (a) => normalizeStatus(a.alert_status) === "pending",
  ).length;

  // Count assigned referrals using normalized status
  const assignedReferrals = referrals.filter(
    (r) => {
      const status = r.referral_status || "pending";
      const normalized = normalizeStatus(status);
      return normalized === "pending" || normalized === "acknowledged";
    }
  ).length;

  const stats = [
    {
      id: 1,
      title: "Assigned Referrals",
      icon: <FaUsers size={24} color="#2a2a72" />,
      value: assignedReferrals.toString(),
      route: "/staff/peer/referrals",
    },
    {
      id: 2,
      title: "Pending Follow-ups",
      icon: <FaClock size={24} color="#f59e0b" />,
      value: pendingFollowups.toString(),
      route: "/staff/peer/follow-up-notes",
    },
    {
      id: 3,
      title: "Crisis Alerts",
      icon: <FaExclamationTriangle size={24} color="#b34747" />,
      value: crisisAlerts.length.toString(),
      route: "/staff/peer/high-risk-alerts",
    },
    
  ];

  const handleStatClick = (route) => {
    navigate(route);
  };

  return (
    <Layout title="Peer Counsellor Dashboard" role="Peer Counsellor">
      <section className={styles.statsGrid}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={styles.statCard}
            onClick={() => handleStatClick(stat.route)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <h3>{stat.title}</h3>
              <p className={styles.statNumber}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.chartSection}>
        <div className={styles.chartContainer}>
          <h2>
            <FaBell style={{ color: "#2a2a72", marginRight: "8px" }} />
            Assigned Referrals
          </h2>
          <div>
            {referrals.slice(0, 4).map((referral) => {
              const status = referral.referral_status || "pending";
              const normalizedStatus = normalizeStatus(status);
              const displayStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
              
              return (
                <div
                  key={referral.referral_id || referral.id}
                  className={styles.activityItem}
                >
                  <span>
                    {referral.student_name || referral.studentName || "Anonymous student"} ·
                    {referral.referred_to || referral.referredTo || "Peer Counsellor"}
                  </span>
                  <span
                    className={`${styles.activityTime} ${normalizedStatus === "pending" ? styles.highRisk : normalizedStatus === "completed" ? styles.success : styles.review}`}
                  >
                    {displayStatus}
                  </span>
                </div>
              );
            })}
            {referrals.length === 0 && (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No assigned referrals yet
              </div>
            )}
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.sumcOnly}>
            <button
              className={buttonStyles.btnPrimary}
              onClick={() => navigate("/staff/peer/schedule-sessions")}
            >
              <FaCalendarCheck style={{ marginRight: "8px" }} />
              Follow-up sessions
            </button>
            <button
              className={buttonStyles.btnSecondary}
              onClick={() => navigate("/staff/peer/referrals")}
            >
              <FaUserMd style={{ marginRight: "8px" }} />
              Manage Referrals
            </button>
            
          </div>
        </div>
      </section>
    </Layout>
  );
}