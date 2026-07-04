import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';
import { getAlerts, updateAlertStatus } from '../../../api/staffApi';

export default function HighRiskAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [crisisAlerts, setCrisisAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await getAlerts();
      setAlerts(data);
      
      // Load crisis alerts from sessionStorage
      const storedCrisisAlerts = JSON.parse(sessionStorage.getItem('crisisAlerts') || '[]');
      setCrisisAlerts(storedCrisisAlerts);
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

  const handleCrisisStatusChange = (alertId, status) => {
    setCrisisAlerts((current) => 
      current.map((item) => (item.alert_id === alertId ? { ...item, alert_status: status } : item))
    );
    // Update sessionStorage
    const updated = crisisAlerts.map((item) => (item.alert_id === alertId ? { ...item, alert_status: status } : item));
    sessionStorage.setItem('crisisAlerts', JSON.stringify(updated));
  };

  // Combine and sort all alerts by date
  const allAlerts = [...alerts, ...crisisAlerts].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <Layout title="High-Risk Alerts" role="Peer Counsellor">
      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-exclamation-triangle" style={{ color: 'var(--brick-dust)', marginRight: '8px' }}></i>All High-Risk Alerts (including Crisis Contacts)</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Alert ID</th><th>Student (Anon)</th><th>Risk Level</th><th>Category</th><th>Date</th><th>Status</th><th>Contact Info</th><th>Action</th></tr>
            </thead>
            <tbody>
              {allAlerts.map((alert) => (
                <tr key={`${alert.category}-${alert.alert_id}`}>
                  <td>#{alert.alert_id}</td>
                  <td>{alert.student_identifier || '•••••'}</td>
                  <td><span className={getRiskClass(alert.risk_level)}>{alert.risk_level}</span></td>
                  <td>{alert.category}</td>
                  <td>{alert.created_at?.slice(0, 10) || '—'}</td>
                  <td><span className={getStatusClass(alert.alert_status)}>{alert.alert_status}</span></td>
                  <td>{alert.contact_info ? `${alert.contact_info.slice(0, 3)}***` : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {alert.contact_info ? (
                        <>
                          <button className={buttonStyles.btnSm} title={alert.contact_info}>📞</button>
                          <button className={buttonStyles.btnSm} onClick={() => handleCrisisStatusChange(alert.alert_id, 'acknowledged')}>Ack</button>
                          <button className={buttonStyles.btnSm} onClick={() => handleCrisisStatusChange(alert.alert_id, 'resolved')}>Resolve</button>
                        </>
                      ) : (
                        <>
                          <button className={buttonStyles.btnSm} onClick={() => navigate(`/staff/peer/alert-details?id=${alert.alert_id}`)}><i className="fas fa-chevron-right"></i></button>
                          <button className={buttonStyles.btnSm} onClick={() => handleStatusChange(alert.alert_id, 'acknowledged')}>Ack</button>
                          <button className={buttonStyles.btnSm} onClick={() => handleStatusChange(alert.alert_id, 'resolved')}>Resolve</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allAlerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#4a5568' }}>
            <p>No high-risk alerts or crisis contacts at this time.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
