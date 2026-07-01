import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';
import { createReferral, getReferrals } from '../../api/staffApi';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadReferrals = async () => {
      setReferrals(await getReferrals());
    };
    loadReferrals();
  }, []);

  const handleNewReferral = async () => {
    const created = await createReferral({
      student_id: 1,
      referral_type: 'external_counselling',
      status: 'pending',
      notes: 'Created from staff portal',
    });
    setMessage(created ? 'Referral created successfully.' : 'Unable to create referral.');
    if (created) {
      setReferrals(await getReferrals());
    }
  };

  return (
    <Layout title="Referrals" role="SUMC Counsellor">
      <section style={{ marginBottom: '30px' }}>
        <button className={buttonStyles.btnPrimary} onClick={handleNewReferral} style={{ maxWidth: '300px' }}>
          <i className="fas fa-plus"></i> Create New Referral
        </button>
        {message ? <p style={{ marginTop: '10px' }}>{message}</p> : null}
      </section>

      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-user-md" style={{ marginRight: '8px' }}></i>Active Referrals</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Referral ID</th><th>Student Name</th><th>Referral Type</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.referral_id}>
                  <td>#{referral.referral_id}</td>
                  <td>{referral.student_name || 'Anonymous student'}</td>
                  <td>{referral.referral_type}</td>
                  <td>{referral.created_at?.slice(0, 10) || '—'}</td>
                  <td><span className={referral.status === 'accepted' ? styles.statusResolved : styles.statusPending}>{referral.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
