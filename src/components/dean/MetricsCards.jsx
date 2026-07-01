import React from 'react';
import styles from '../../styles/DeanDashboard.module.css';

export default function MetricsCards({ metrics }) {
  return (
    <section className={styles.metricsGrid}>
      {metrics.map((metric) => (
        <article key={metric.label} className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}><i className={metric.iconClass} /></span>
            <span className={`${styles.trend} ${metric.trend === 'up' ? styles.trendUp : styles.trendDown}`}>
              {metric.trend === 'up' ? '▲' : '▼'} {metric.delta}
            </span>
          </div>
          <h3>{metric.value}</h3>
          <p>{metric.label}</p>
        </article>
      ))}
    </section>
  );
}
