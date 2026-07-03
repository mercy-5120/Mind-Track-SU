import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';
import { getAlerts } from '../../api/staffApi';

export default function ScheduleSessions() {
  const [sessions, setSessions] = useState([]);
  const [localSessions, setLocalSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    sessionDate: '',
    sessionTime: '',
    duration: '60',
    topic: '',
    riskLevel: 'low',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const role = sessionStorage.getItem('staffRole');

  useEffect(() => {
    const loadData = async () => {
      const alerts = await getAlerts();
      const upcoming = alerts
        .filter(alert => alert.alert_status !== 'resolved')
        .map(alert => ({
          id: alert.alert_id,
          student: alert.student_name || 'Anonymous student',
          alertId: alert.alert_id,
          category: alert.category,
          riskLevel: alert.risk_level,
          date: alert.created_at?.slice(0, 10) || 'TBD',
          time: alert.created_at?.slice(11, 16) || 'TBD',
          status: alert.alert_status,
        }));
      setSessions(upcoming);
    };
    loadData();

    // Load locally scheduled sessions
    const stored = JSON.parse(localStorage.getItem('sessions') || '[]');
    setLocalSessions(stored);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSession = () => {
    if (!formData.studentId.trim() || !formData.sessionDate || !formData.sessionTime) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const newSession = {
      id: Date.now(),
      studentId: formData.studentId,
      sessionDate: formData.sessionDate,
      sessionTime: formData.sessionTime,
      duration: formData.duration,
      topic: formData.topic,
      riskLevel: formData.riskLevel,
      notes: formData.notes,
      status: 'scheduled',
      scheduledBy: sessionStorage.getItem('staffName') || 'Staff',
      createdAt: new Date().toISOString(),
      role
    };

    const updated = [...localSessions, newSession];
    setLocalSessions(updated);
    localStorage.setItem('sessions', JSON.stringify(updated));

    setFormData({
      studentId: '',
      sessionDate: '',
      sessionTime: '',
      duration: '60',
      topic: '',
      riskLevel: 'low',
      notes: ''
    });
    setShowForm(false);
    setSubmitting(false);
    alert('Session scheduled successfully');
  };

  const handleCancelSession = (id) => {
    if (window.confirm('Cancel this session?')) {
      const updated = localSessions.filter(s => s.id !== id);
      setLocalSessions(updated);
      localStorage.setItem('sessions', JSON.stringify(updated));
    }
  };

  const allSessions = [...sessions, ...localSessions].sort((a, b) =>
    new Date(`${b.sessionDate} ${b.sessionTime}`) - new Date(`${a.sessionDate} ${a.sessionTime}`)
  );

  return (
    <Layout title="Schedule Sessions" role={role === 'peer_counsellor' ? 'Peer Counsellor' : 'SUMC Counsellor'}>
      <section style={{ marginBottom: '30px' }}>
        <button 
          className={buttonStyles.btnPrimary} 
          onClick={() => setShowForm(!showForm)}
          style={{ maxWidth: '300px' }}
        >
          <i className="fas fa-plus"></i> Schedule New Session
        </button>
      </section>

      {showForm && (
        <div style={{
          background: 'white',
          border: '1px solid #ece8e2',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(42, 42, 114, 0.04)'
        }}>
          <h3>Schedule New Session</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Student ID *</label>
              <input
                type="text"
                name="studentId"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Date *</label>
                <input
                  type="date"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Time *</label>
                <input
                  type="time"
                  name="sessionTime"
                  value={formData.sessionTime}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Duration (minutes)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Risk Level</label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Session Topic</label>
              <input
                type="text"
                name="topic"
                placeholder="e.g., Anxiety Management, Stress Coping"
                value={formData.topic}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Notes</label>
              <textarea
                name="notes"
                placeholder="Additional session details..."
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={buttonStyles.btnPrimary} onClick={handleAddSession} disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Schedule Session'}
              </button>
              <button className={buttonStyles.btnSecondary} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>Scheduled Sessions</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Student</th><th>Date</th><th>Time</th><th>Duration</th><th>Topic</th><th>Risk</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {allSessions.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#4a5568' }}>No sessions scheduled</td></tr>
              ) : (
                allSessions.map((session) => (
                  <tr key={`${session.id}`}>
                    <td>{session.student || session.studentId}</td>
                    <td>{session.date || session.sessionDate}</td>
                    <td>{session.time || session.sessionTime}</td>
                    <td>{session.duration} min</td>
                    <td>{session.topic || session.category || '—'}</td>
                    <td>{session.riskLevel || session.risk_level || 'N/A'}</td>
                    <td>
                      <span className={session.status === 'completed' ? styles.statusResolved : styles.statusPending}>
                        {session.status}
                      </span>
                    </td>
                    <td>
                      {session.scheduledBy && (
                        <button
                          className={buttonStyles.btnSm}
                          onClick={() => handleCancelSession(session.id)}
                          title="Cancel session"
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
