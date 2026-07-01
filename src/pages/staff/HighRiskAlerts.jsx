import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';
import { getAlerts, updateAlertStatus } from '../../api/staffApi';

export default function HighRiskAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data);
    };
    loadAlerts();
  }, []);

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

  const handleStatusChange = async (alertId, status) => {
    await updateAlertStatus(alertId, status);
    setAlerts((current) => current.map((item) => (item.alert_id === alertId ? { ...item, alert_status: status } : item)));
  };

  return (
    <Layout title="High-Risk Alerts" role="SUMC Counsellor">
      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-exclamation-triangle" style={{ color: 'var(--brick-dust)', marginRight: '8px' }}></i>All High-Risk Alerts</h2>
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
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className={buttonStyles.btnSm} onClick={() => navigate(`/staff/alert-details?id=${alert.alert_id}`)}><i className="fas fa-chevron-right"></i></button>
                      <button className={buttonStyles.btnSm} onClick={() => handleStatusChange(alert.alert_id, 'acknowledged')}>Ack</button>
                      <button className={buttonStyles.btnSm} onClick={() => handleStatusChange(alert.alert_id, 'resolved')}>Resolve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
