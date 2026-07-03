import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';
import { getAlerts, getReferrals, getResources } from '../../../api/staffApi';

export default function PeerDashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [alertsData, referralsData, resourcesData] = await Promise.all([getAlerts(), getReferrals(), getResources()]);
      setAlerts(alertsData.filter((item) => item.assigned_staff_role === 'peer_counsellor' || item.assigned_staff_id === 2));
      setReferrals(referralsData);
      setResources(resourcesData);
    };
    loadData();
  }, []);

  const stats = [
    { id: 1, title: 'Assigned Alerts', icon: 'fas fa-users', value: alerts.length.toString() },
    { id: 2, title: 'Pending Follow-ups', icon: 'fas fa-clock', value: alerts.filter((a) => a.alert_status === 'pending').length.toString() },
    { id: 3, title: 'Referrals', icon: 'fas fa-user-check', value: referrals.length.toString() },
    { id: 4, title: 'Resources', icon: 'fas fa-calendar-alt', value: resources.length.toString() },
  ];

  const handleStatClick = (index) => {
    const routes = ['/staff/peer-dashboard', '/staff/schedule-sessions', '/staff/referrals', '/staff/resources'];
    navigate(routes[index]);
  };

  return (
    <Layout title="Peer Counsellor Dashboard" role="Peer Counsellor">
      <section className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.id} className={styles.statCard} onClick={() => handleStatClick(index)}>
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
          <h2><i className="fas fa-bell" style={{ color: 'var(--deep-indigo)', marginRight: '8px' }}></i>Assigned Alerts</h2>
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
            <button className={buttonStyles.btnPrimary} onClick={() => navigate('/staff/schedule-sessions')}><i className="fas fa-calendar-check"></i> Record Follow-up</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/referrals')}><i className="fas fa-user-md"></i> Manage Referral</button>
            <button className={buttonStyles.btnSecondary} onClick={() => navigate('/staff/resources')}><i className="fas fa-book"></i> Open Resources</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
