// src/components/dean/DepartmentBreakdown.jsx
import React from "react";
import { FaUniversity } from "react-icons/fa";
import styles from "../../styles/DeanDashboard.module.css";

export default function DepartmentBreakdown({
  departments,
  selectedDepartment,
  onDepartmentChange,
}) {
  const safeDepartments = departments || [];

  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Department view</p>
          <h3>Wellness benchmark by faculty</h3>
        </div>
        <select
          value={selectedDepartment}
          onChange={(event) => onDepartmentChange(event.target.value)}
          className={styles.selectInput}
        >
          <option value="All">All departments</option>
          {safeDepartments.map((item) => (
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
            {safeDepartments.map((item) => (
              <tr key={item.name}>
                <td>
                  <FaUniversity
                    style={{ marginRight: "6px", color: "#6b7280" }}
                    size={14}
                  />{" "}
                  {item.name}
                </td>
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
