import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';
import { getAlert, updateAlertStatus } from '../../../api/staffApi';

export default function AlertDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alertId = searchParams.get('id');
  const [alert, setAlert] = useState(null);
  const role = sessionStorage.getItem('staffRole');
  const backUrl = role === 'peer_counsellor' ? '/staff/peer/high-risk-alerts' : '/staff/sumc/high-risk-alerts';

  useEffect(() => {
    const loadAlert = async () => {
      if (!alertId) return;
      const data = await getAlert(alertId);
      setAlert(data);
    };
    loadAlert();
  }, [alertId]);

  const handleAction = async (action) => {
    if (!alert) return;
    const nextStatus = action === 'resolve' ? 'resolved' : 'acknowledged';
    await updateAlertStatus(alert.alert_id, nextStatus);
    setAlert((current) => current ? { ...current, alert_status: nextStatus } : current);
  };

  if (!alert) return <Layout title="Alert Details" role="SUMC Counsellor"><section className={styles.alertsTableSection}>Loading alert…</section></Layout>;

  return (
    <Layout title="Alert Details" role="SUMC Counsellor">
      <section className={styles.alertsTableSection} style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2><i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>Alert #{alert.alert_id}</h2>
          <button onClick={() => navigate(backUrl)} style={{ background: 'var(--muted-eucalyptus)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}>Back to Alerts</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div><p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Risk Level</p><span className={styles.riskHigh}>{alert.risk_level}</span></div>
          <div><p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Status</p><span className={styles.statusPending}>{alert.alert_status}</span></div>
          <div><p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Category</p><p style={{ fontWeight: '600' }}>{alert.category}</p></div>
          <div><p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Date Created</p><p style={{ fontWeight: '600' }}>{alert.created_at?.slice(0, 10) || '—'}</p></div>
        </div>

        <div style={{ marginBottom: '20px' }}><p style={{ color: 'var(--text-light)', marginBottom: '8px' }}>Description</p><p style={{ lineHeight: '1.6' }}>{alert.student_name || 'Anonymous student'} requires follow-up for this alert.</p></div>
        <div style={{ marginBottom: '20px' }}><p style={{ color: 'var(--text-light)', marginBottom: '8px' }}>Assigned Staff</p><p style={{ lineHeight: '1.6' }}>{alert.assigned_staff_name || 'Unassigned'}</p></div>

        <div>
          <p style={{ color: 'var(--text-light)', marginBottom: '12px', fontWeight: '600' }}>Recommended Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className={buttonStyles.btnPrimary} onClick={() => handleAction('acknowledge')}>Acknowledge Alert</button>
            <button className={buttonStyles.btnSecondary} onClick={() => handleAction('resolve')}>Resolve Alert</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
