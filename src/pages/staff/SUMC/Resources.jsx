import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Dashboard.module.css';
import { getResources } from '../../../api/staffApi';

export default function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const loadResources = async () => {
      setResources(await getResources());
    };
    loadResources();
  }, []);

  return (
    <Layout title="Resources" role="SUMC Counsellor">
      <section className={styles.alertsTableSection}>
        <h2><i className="fas fa-book" style={{ marginRight: '8px' }}></i>Available Resources</h2>
        <div className={styles.tableResponsive}>
          <table>
            <thead>
              <tr><th>Resource Name</th><th>Type</th><th>Date Added</th><th>Action</th></tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.resource_id}>
                  <td>{resource.resource_name || resource.title || 'Untitled resource'}</td>
                  <td>{resource.category || resource.resource_type || 'Other'}</td>
                  <td>{resource.created_at?.slice(0, 10) || '—'}</td>
                  <td><button style={{ background: 'var(--deep-indigo)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
