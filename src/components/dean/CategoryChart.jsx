import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from '../../styles/DeanDashboard.module.css';

const COLORS = ['#2A2A72', '#7C4DFF', '#F08A5D', '#4CAF50'];

export default function CategoryChart({ data }) {
  return (
    <section className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Category distribution</p>
          <h3>Wellness concerns across the student population</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(42, 42, 114, 0.08)" strokeDasharray="3 3" />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`${entry.category}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
