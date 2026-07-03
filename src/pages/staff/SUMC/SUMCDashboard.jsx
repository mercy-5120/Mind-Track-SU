import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';
import { getAlerts } from '../../../api/staffApi';

export default function SUMCDashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data);
    };
    loadAlerts();
  }, []);

  const stats = [
    { id: 1, title: 'Total Alerts', icon: 'fas fa-clipboard-list', value: alerts.length.toString() },
    { id: 2, title: 'High-Risk Alerts', icon: 'fas fa-heartbeat', value: alerts.filter((a) => a.risk_level === 'high').length.toString(), highRisk: true },
    { id: 3, title: 'Pending Alerts', icon: 'fas fa-phone-alt', value: alerts.filter((a) => ['new', 'pending', 'viewed', 'acknowledged'].includes(a.alert_status)).length.toString() },
    { id: 4, title: 'Resolved Alerts', icon: 'fas fa-calendar-plus', value: alerts.filter((a) => a.alert_status === 'resolved').length.toString() },
  ];

  const handleStatClick = (index) => {
    const routes = ['/staff/sumc/dashboard', '/staff/sumc/high-risk-alerts', '/staff/sumc/referrals', '/staff/sumc/schedule-sessions'];
    navigate(routes[index]);
  };

  const getRiskClass = (risk) => {
    if (risk === 'high') return styles.riskHigh;
    if (risk === 'moderate') return styles.riskMedium;
    return styles.riskLow;
  };

  const getStatusClass = (status) => {
    if (status === 'new' || status === 'pending') return styles.statusPending;
    if (status === 'viewed' || status === 'acknowledged') return styles.statusReview;
    return styles.statusResolved;
  };

  return (
    <Layout title="SUMC Dashboard" role="SUMC Counsellor">
      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.id} className={`${styles.statCard} ${stat.highRisk ? styles.highRisk : ''}`} onClick={() => handleStatClick(index)}>
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
                <span>{alert.student_name || 'Anonymous student'} · {alert.category}</span>
                <span className={`${styles.activityTime} ${alert.risk_level === 'high' ? styles.highRisk : styles.success}`}>{alert.alert_status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.sumcOnly}>
            <button className={buttonStyles.btnPrimary} onClick={() => navigate('/staff/sumc/high-risk-alerts')}><i className="fas fa-eye"></i> View High-Risk Alerts</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/create-referral')}><i className="fas fa-plus"></i> Create Referral</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/schedule-sessions')}><i className="fas fa-calendar-check"></i> Schedule Session</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/add-resources')}><i className="fas fa-book-plus"></i> Add Resource</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/sumc/follow-up-notes')}><i className="fas fa-sticky-note"></i> Follow-up Notes</button>
          </div>
        </div>
      </section>

      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-exclamation-triangle" style={{ color: 'var(--brick-dust)', marginRight: '8px' }}></i>Recent Alerts</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Alert ID</th><th>Student (Anon)</th><th>Risk Level</th><th>Category</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.alert_id}>
                  <td>#{alert.alert_id}</td>
                  <td>{alert.student_identifier || '•••••'}</td>
                  <td><span className={getRiskClass(alert.risk_level)}>{alert.risk_level}</span></td>
                  <td>{alert.category}</td>
                  <td>{alert.created_at?.slice(0, 10) || '—'}</td>
                  <td><span className={getStatusClass(alert.alert_status)}>{alert.alert_status}</span></td>
                  <td><button className={buttonStyles.btnSm} onClick={() => navigate(`/staff/sumc/alert-details?id=${alert.alert_id}`)}><i className="fas fa-chevron-right"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
