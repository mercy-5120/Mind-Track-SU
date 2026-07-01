import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../../styles/DeanDashboard.module.css';

export default function WellnessChart({ data, view, onViewChange }) {
  return (
    <section className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Wellness trends</p>
          <h3>Student wellness score over time</h3>
        </div>
        <div className={styles.toggleGroup}>
          {['weekly', 'monthly', 'quarterly'].map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.toggleButton} ${view === option ? styles.toggleActive : ''}`}
              onClick={() => onViewChange(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(42, 42, 114, 0.08)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis domain={[50, 100]} tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#2A2A72" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
