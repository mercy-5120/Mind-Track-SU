import React, { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Button.module.css';

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: sessionStorage.getItem('staffName') || 'Staff Member',
    email: sessionStorage.getItem('staffEmail') || 'staff@example.com',
    phone: '+254 712 345 678',
    department: sessionStorage.getItem('staffRole') === 'peer_counsellor' ? 'Peer Support' : 'Student Mental Health',
    notifications: true,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    sessionStorage.setItem('staffName', formData.fullName);
    sessionStorage.setItem('staffEmail', formData.email);
    setMessage('Settings saved locally for this session.');
  };

  const handleChangePassword = () => {
    setMessage('Password change workflow will be added in a future pass.');
  };

  return (
    <Layout title="Settings" role="SUMC Counsellor">
      <section className={styles.alertsTableSection} style={{ maxWidth: '600px' }}>
        <h2><i className="fas fa-cog" style={{ marginRight: '8px' }}></i>Account Settings</h2>
        {message ? <p style={{ marginTop: '10px' }}>{message}</p> : null}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="fullName" style={{ fontWeight: '600' }}>Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="email" style={{ fontWeight: '600' }}>Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="phone" style={{ fontWeight: '600' }}>Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="department" style={{ fontWeight: '600' }}>Department</label>
            <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="notifications" name="notifications" checked={formData.notifications} onChange={handleChange} />
            <label htmlFor="notifications">Enable email notifications</label>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="button" className={buttonStyles.btnPrimary} onClick={handleSave} style={{ flex: 1 }}>Save Changes</button>
            <button type="button" className={buttonStyles.btnSecondary} onClick={handleChangePassword} style={{ flex: 1 }}>Change Password</button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
