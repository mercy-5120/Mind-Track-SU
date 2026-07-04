import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from "../../../styles/Dashboard.module.css";
import buttonStyles from '../../../styles/Button.module.css';

export default function FollowUpNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [alertId, setAlertId] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const role = sessionStorage.getItem('staffRole') || 'peer_counsellor';

  useEffect(() => {
    // Load notes from localStorage
    const storedNotes = JSON.parse(localStorage.getItem('followUpNotes') || '[]');
    setNotes(storedNotes);
  }, []);

  const handleAddNote = () => {
    if (!alertId.trim() || !noteText.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newNote = {
      id: Date.now(),
      alertId,
      note: noteText,
      createdBy: sessionStorage.getItem('staffName') || 'Staff',
      createdAt: new Date().toISOString(),
      role,
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('followUpNotes', JSON.stringify(updatedNotes));

    setAlertId('');
    setNoteText('');
    setShowForm(false);
    alert('Note added successfully');
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('followUpNotes', JSON.stringify(updatedNotes));
    }
  };

  return (
    <Layout title="Follow-Up Notes" role={role === 'peer_counsellor' ? 'Peer Counsellor' : 'SUMC Counsellor'}>
      <section className={styles.alertsTableSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2><i className="fas fa-sticky-note" style={{ color: 'var(--deep-indigo)', marginRight: '8px' }}></i>Follow-Up Notes</h2>
          <button className={buttonStyles.btnPrimary} onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Add Note
          </button>
        </div>

        {showForm && (
          <div style={{
            background: '#f7fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3>Add New Follow-Up Note</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Alert ID</label>
                <input
                  type="text"
                  placeholder="e.g., Alert #123"
                  value={alertId}
                  onChange={(e) => setAlertId(e.target.value)}
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Note</label>
                <textarea
                  placeholder="Enter your follow-up note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows="4"
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
                <button className={buttonStyles.btnPrimary} onClick={handleAddNote}>Save Note</button>
                <button className={buttonStyles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Alert ID</th><th>Note</th><th>By</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#4a5568' }}>No notes yet</td></tr>
              ) : (
                notes.map((note) => (
                  <tr key={note.id}>
                    <td>#{note.alertId}</td>
                    <td>{note.note.substring(0, 50)}...</td>
                    <td>{note.createdBy}</td>
                    <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className={buttonStyles.btnSm}
                          onClick={() => alert(note.note)}
                          title="View full note"
                        >
                          👁️
                        </button>
                        <button
                          className={buttonStyles.btnSm}
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete note"
                        >
                          🗑️
                        </button>
                      </div>
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
