import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import buttonStyles from '../../../styles/Button.module.css';

export default function AddResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'guide',
    link: '',
    category: 'general'
  });
  const [showForm, setShowForm] = useState(false);
  const role = (sessionStorage.getItem('staffRole') || 'sumc_counsellor').toLowerCase().trim();

  useEffect(() => {
    // Load resources from localStorage
    const storedResources = JSON.parse(localStorage.getItem('resources') || '[]');
    setResources(storedResources);
  }, []);

  // Only SUMC can add resources
  if (role !== 'sumc_counsellor') {
    const displayRole = role === 'peer_counsellor' ? 'Peer Counsellor' : 'SUMC Counsellor';
    return (
      <Layout title="Manage Resources" role={displayRole}>
        <div style={{
          background: '#fed7d7',
          border: '1px solid #fc8181',
          color: '#9b2c2c',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p>You do not have permission to manage resources. Only SUMC Counsellors can perform this action.</p>
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

  const handleAddResource = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newResource = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      resource_type: formData.resourceType,
      category: formData.category,
      link: formData.link,
      created_at: new Date().toISOString(),
      created_by: sessionStorage.getItem('staffName') || 'Staff'
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);
    localStorage.setItem('resources', JSON.stringify(updatedResources));

    setFormData({
      title: '',
      description: '',
      resourceType: 'guide',
      link: '',
      category: 'general'
    });
    setShowForm(false);
    alert('Resource added successfully');
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Delete this resource?')) {
      const updatedResources = resources.filter(r => r.id !== id);
      setResources(updatedResources);
      localStorage.setItem('resources', JSON.stringify(updatedResources));
    }
  };

  return (
    <Layout title="Manage Resources" role="SUMC Counsellor">
      <section className={styles.alertsTableSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2><i className="fas fa-book" style={{ color: 'var(--deep-indigo)', marginRight: '8px' }}></i>Resources</h2>
          <button className={buttonStyles.btnPrimary} onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Add Resource
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
            <h3>Add New Resource</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Resource title"
                  value={formData.title}
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
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Description *</label>
                <textarea
                  name="description"
                  placeholder="Resource description..."
                  value={formData.description}
                  onChange={handleChange}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Type</label>
                  <select
                    name="resourceType"
                    value={formData.resourceType}
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
                    <option value="guide">Guide</option>
                    <option value="training">Training</option>
                    <option value="policy">Policy</option>
                    <option value="tool">Tool</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
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
                    <option value="general">General</option>
                    <option value="mental_health">Mental Health</option>
                    <option value="crisis">Crisis</option>
                    <option value="support">Support</option>
                    <option value="training">Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Link/URL</label>
                <input
                  type="url"
                  name="link"
                  placeholder="https://example.com"
                  value={formData.link}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className={buttonStyles.btnPrimary} onClick={handleAddResource}>Add Resource</button>
                <button className={buttonStyles.btnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Title</th><th>Type</th><th>Category</th><th>Created By</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#4a5568' }}>No resources yet</td></tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.title}</td>
                    <td>{resource.resource_type}</td>
                    <td>{resource.category}</td>
                    <td>{resource.created_by}</td>
                    <td>{new Date(resource.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonStyles.btnSm}
                            title="Open link"
                          >
                            🔗
                          </a>
                        )}
                        <button
                          className={buttonStyles.btnSm}
                          onClick={() => handleDeleteResource(resource.id)}
                          title="Delete resource"
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
