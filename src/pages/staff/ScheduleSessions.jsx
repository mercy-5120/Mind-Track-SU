import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';
import { createFollowUp, getAlerts } from '../../api/staffApi';

export default function ScheduleSessions() {
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      const alerts = await getAlerts();
      setSessions(alerts.filter((alert) => alert.alert_status !== 'resolved').map((alert) => ({
        id: alert.alert_id,
        student: alert.student_name || 'Anonymous student',
        date: alert.created_at?.slice(0, 10) || 'TBD',
        time: alert.created_at?.slice(11, 16) || 'TBD',
        status: alert.alert_status,
      })));
    };
    loadSessions();
  }, []);

  const handleSchedule = async () => {
    const fresh = await createFollowUp({
      student_id: 1,
      followup_notes: 'New session scheduled from staff portal',
      status: 'scheduled',
    });
    setMessage(fresh ? 'Session follow-up created successfully.' : 'Unable to create follow-up.');
  };

  return (
    <Layout title="Schedule Sessions" role="SUMC Counsellor">
      <section style={{ marginBottom: '30px' }}>
        <button className={buttonStyles.btnPrimary} onClick={handleSchedule} style={{ maxWidth: '300px' }}>
          <i className="fas fa-plus"></i> Schedule New Session
        </button>
        {message ? <p style={{ marginTop: '10px' }}>{message}</p> : null}
      </section>

      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>Upcoming Sessions</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Session ID</th><th>Student Name</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>#{session.id}</td>
                  <td>{session.student}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
                  <td><span className={session.status === 'resolved' ? styles.statusResolved : styles.statusPending}>{session.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
