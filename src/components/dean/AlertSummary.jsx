import React from 'react';
import styles from '../../styles/DeanDashboard.module.css';

const statusColors = {
  pending: styles.statusPending,
  'in-progress': styles.statusInProgress,
  resolved: styles.statusResolved,
};

export default function AlertSummary({ alerts, onViewAll }) {
  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Alerts summary</p>
          <h3>Recent high-risk cases</h3>
        </div>
        <button type="button" className={styles.linkButton} onClick={onViewAll}>
          View all alerts
        </button>
      </div>
      <div className={styles.alertList}>
        {alerts.map((alert) => (
          <article key={alert.alert_id || alert.id} className={styles.alertItem}>
            <div>
              <p className={styles.alertTitle}>{alert.student_name || `Alert #${alert.alert_id || alert.id}`}</p>
              <p className={styles.alertMeta}>{alert.category} • {alert.risk_level || alert.riskLevel}</p>
            </div>
            <span className={`${styles.statusBadge} ${statusColors[alert.alert_status || alert.status] || styles.statusPending}`}>
              {alert.alert_status || alert.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
