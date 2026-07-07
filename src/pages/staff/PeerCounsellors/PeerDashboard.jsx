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

  useEffect(() => {
    const loadData = async () => {
      const [alertsData, crisisData, referralsData, resourcesData] =
        await Promise.all([
          getAlerts(),
          getCrisisAlerts(),
          getReferrals(),
          getResources(),
        ]);

      // Filter alerts assigned to peer counsellor
      const peerAlerts = alertsData.filter(
        (item) =>
          item.assigned_staff_role === "peer_counsellor" ||
          item.assigned_staff_id === 2,
      );
      setAlerts(peerAlerts);

      // Crisis alerts (all crisis alerts are relevant)
      setCrisisAlerts(Array.isArray(crisisData) ? crisisData : []);

      // Referrals for peer counsellors
      const peerReferrals = referralsData.filter(
        (item) =>
          item.referred_to === "peer_counsellor" ||
          item.referred_to === "peer_counsellor",
      );
      setReferrals(peerReferrals);

      setResources(resourcesData);
    };
    loadData();
  }, []);

  // Count pending follow-ups
  const pendingFollowups = alerts.filter(
    (a) => a.alert_status === "pending",
  ).length;

  // Count assigned referrals
  const assignedReferrals = referrals.filter(
    (r) =>
      r.referral_status === "pending" || r.referral_status === "acknowledged",
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
    {
      id: 4,
      title: "Resources",
      icon: <FaBook size={24} color="#4a8b6b" />,
      value: resources.length.toString(),
      route: "/staff/peer/resources",
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
            {referrals.slice(0, 4).map((referral) => (
              <div
                key={referral.referral_id || referral.id}
                className={styles.activityItem}
              >
                <span>
                  {referral.student_name || "Anonymous student"} ·
                  {referral.referred_to || "Peer Counsellor"}
                </span>
                <span
                  className={`${styles.activityTime} ${referral.referral_status === "pending" ? styles.highRisk : styles.success}`}
                >
                  {referral.referral_status || "Pending"}
                </span>
              </div>
            ))}
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
              Record Follow-up
            </button>
            <button
              className={buttonStyles.btnSecondary}
              onClick={() => navigate("/staff/peer/referrals")}
            >
              <FaUserMd style={{ marginRight: "8px" }} />
              Manage Referrals
            </button>
            <button
              className={buttonStyles.btnSecondary}
              onClick={() => navigate("/staff/peer/resources")}
            >
              <FaBook style={{ marginRight: "8px" }} />
              Open Resources
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
