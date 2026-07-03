import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';
import { createReferral } from '../../../api/staffApi';

export default function CreateReferral() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    alertId: '',
    studentId: '',
    referredTo: 'sumc_counsellor',
    reason: '',
    priority: 'normal',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const role = sessionStorage.getItem('staffRole');

  // Only SUMC can create referrals
  if (role !== 'sumc_counsellor') {
    return (
      <Layout title="Create Referral" role="SUMC Counsellor">
        <div style={{
          background: '#fed7d7',
          border: '1px solid #fc8181',
          color: '#9b2c2c',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p>You do not have permission to create referrals. Only SUMC Counsellors can perform this action.</p>
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createReferral({
        alertId: parseInt(formData.alertId, 10),
        studentId: formData.studentId,
        referredTo: formData.referredTo,
        notes: formData.notes,
        referralStatus: 'pending',
        studentName: formData.studentId,
        priority: formData.priority,
      });

      alert('Referral created successfully!');
      navigate('/staff/sumc/referrals');
    } catch (error) {
      alert('Error creating referral: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Create New Referral" role="SUMC Counsellor">
      <section style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          border: '1px solid #ece8e2',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(42, 42, 114, 0.04)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Alert ID *
                </label>
                <input
                  type="number"
                  name="alertId"
                  placeholder="Enter alert ID"
                  value={formData.alertId}
                  onChange={handleChange}
                  required
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="Enter student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Refer To *
                </label>
                <select
                  name="referredTo"
                  value={formData.referredTo}
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
                  <option value="sumc_counsellor">SUMC Counsellor</option>
                  <option value="peer_counsellor">Peer Counsellor</option>
                  <option value="external_service">External Service</option>
                  <option value="medical">Medical Services</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
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
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Reason for Referral *
                </label>
                <textarea
                  name="reason"
                  placeholder="Describe why this student is being referred..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
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

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="Any additional information..."
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  className={buttonStyles.btnPrimary}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Referral'}
                </button>
                <button
                  type="button"
                  className={buttonStyles.btnSecondary}
                  onClick={() => navigate('/staff/sumc/referrals')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
