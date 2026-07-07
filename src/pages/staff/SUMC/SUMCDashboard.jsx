import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';
import { getAlerts, getReferrals } from '../../../api/staffApi';

export default function SUMCDashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [referrals, setReferrals] = useState([]);

  // Normalize status strings to handle case variations and aliases
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const lower = status.toLowerCase().trim();
    if (lower === "pending" || lower === "pend") return "pending";
    if (lower === "acknowledged" || lower === "accepted" || lower === "acknowledge") return "acknowledged";
    if (lower === "completed" || lower === "complete" || lower === "resolved" || lower === "done") return "completed";
    return lower;
  };

  // Helper to get status from referral regardless of field name
  const getReferralStatus = (referral) => {
    return referral.referral_status || referral.referralStatus || referral.status || "pending";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load alerts from API
        const alertsData = await getAlerts();
        
        // Load referrals from API
        const referralsData = await getReferrals();
        
        // Load from localStorage as well
        const storedReferrals = JSON.parse(localStorage.getItem("referrals") || "[]");
        console.log("[SUMC Dashboard] Stored referrals:", storedReferrals);

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

        console.log("[SUMC Dashboard] All referrals:", allReferrals);
        setReferrals(allReferrals);
        setAlerts(alertsData);
      } catch (error) {
        console.error("[SUMC Dashboard] Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Calculate referral stats using normalized status
  const totalReferrals = referrals.length;
  const pendingReferrals = referrals.filter((r) => {
    const status = getReferralStatus(r);
    return normalizeStatus(status) === "pending";
  }).length;
  const completedReferrals = referrals.filter((r) => {
    const status = getReferralStatus(r);
    return normalizeStatus(status) === "completed";
  }).length;
  const acknowledgedReferrals = referrals.filter((r) => {
    const status = getReferralStatus(r);
    return normalizeStatus(status) === "acknowledged";
  }).length;

  const stats = [
    { 
      id: 1, 
      title: 'Total Referrals', 
      icon: 'fas fa-clipboard-list', 
      value: totalReferrals.toString(),
      route: '/staff/sumc/referrals'
    },
    { 
      id: 2, 
      title: 'Pending Referrals', 
      icon: 'fas fa-clock', 
      value: pendingReferrals.toString(),
      route: '/staff/sumc/referrals'
    },
    { 
      id: 3, 
      title: 'Acknowledged Referrals', 
      icon: 'fas fa-check-circle', 
      value: acknowledgedReferrals.toString(),
      route: '/staff/sumc/referrals'
    },
    { 
      id: 4, 
      title: 'Completed Referrals', 
      icon: 'fas fa-calendar-check', 
      value: completedReferrals.toString(),
      route: '/staff/sumc/referrals'
    },
  ];

  const handleStatClick = (index) => {
    const routes = ['/staff/sumc/referrals', '/staff/sumc/referrals', '/staff/sumc/referrals', '/staff/sumc/referrals'];
    navigate(routes[index]);
  };

  const getRiskClass = (risk) => {
    if (risk === 'high') return styles.riskHigh;
    if (risk === 'moderate') return styles.riskMedium;
    return styles.riskLow;
  };

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === 'pending') return styles.statusPending;
    if (normalized === 'acknowledged' || normalized === 'viewed' || normalized === 'accepted') return styles.statusReview;
    return styles.statusResolved;
  };

  const getDisplayStatus = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'acknowledged') return 'Acknowledged';
    if (normalized === 'completed') return 'Completed';
    return status || 'Pending';
  };

  return (
    <Layout title="SUMC Dashboard" role="SUMC Counsellor">
      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div 
            key={stat.id} 
            className={styles.statCard} 
            onClick={() => handleStatClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.statIcon}><i className={stat.icon}></i></div>
            <div className={styles.statInfo}>
              <h3>{stat.title}</h3>
              <p className={styles.statNumber}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.chartSection}>
        <div className={styles.chartContainer}>
          <h2><i className="fas fa-bell" style={{ color: 'var(--deep-indigo)', marginRight: '8px' }}></i>Live Alert Queue</h2>
          <div>
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.alert_id} className={styles.activityItem}>
                <span>{alert.student_name || alert.studentName || 'Anonymous student'} · {alert.category || alert.alert_type || 'General'}</span>
                <span className={`${styles.activityTime} ${alert.risk_level === 'high' ? styles.highRisk : styles.success}`}>
                  {getDisplayStatus(alert.alert_status)}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                No alerts in queue
              </div>
            )}
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.sumcOnly}>
            <button className={buttonStyles.btnPrimary} onClick={() => navigate('/staff/sumc/high-risk-alerts')}>
              <i className="fas fa-eye"></i> View High-Risk Alerts
            </button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/create-referral')}>
              <i className="fas fa-plus"></i> Create Referral
            </button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/schedule-sessions')}>
              <i className="fas fa-calendar-check"></i> Schedule Session
            </button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/add-resources')}>
              <i className="fas fa-book-plus"></i> Add Resource
            </button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/follow-up-notes')}>
              <i className="fas fa-sticky-note"></i> Follow-up Notes
            </button>
          </div>
        </div>
      </section>

      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-exclamation-triangle" style={{ color: 'var(--brick-dust)', marginRight: '8px' }}></i>Recent Alerts</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Student (Anon)</th>
                <th>Risk Level</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 5).map((alert) => (
                <tr key={alert.alert_id}>
                  <td>#{alert.alert_id}</td>
                  <td>{alert.student_identifier || alert.studentId || '•••••'}</td>
                  <td><span className={getRiskClass(alert.risk_level)}>{alert.risk_level || 'Low'}</span></td>
                  <td>{alert.category || alert.alert_type || 'General'}</td>
                  <td>{alert.created_at?.slice(0, 10) || alert.date || '—'}</td>
                  <td><span className={getStatusClass(alert.alert_status)}>{getDisplayStatus(alert.alert_status)}</span></td>
                  <td>
                    <button 
                      className={buttonStyles.btnSm} 
                      onClick={() => navigate(`/staff/sumc/alert-details?id=${alert.alert_id}`)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                    No alerts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}