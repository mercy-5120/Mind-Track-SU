import React from 'react';
import styles from '../../styles/DeanDashboard.module.css';

export default function DepartmentBreakdown({ departments, selectedDepartment, onDepartmentChange }) {
  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Department view</p>
          <h3>Wellness benchmark by faculty</h3>
        </div>
        <select value={selectedDepartment} onChange={(event) => onDepartmentChange(event.target.value)} className={styles.selectInput}>
          <option value="All">All departments</option>
          {departments.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Avg. score</th>
              <th>High risk</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.averageScore}</td>
                <td>{item.highRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
