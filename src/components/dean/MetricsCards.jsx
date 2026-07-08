// src/components/dean/MetricsCards.jsx
import React from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserMd,
  FaCheckDouble,
} from "react-icons/fa";
import styles from "../../styles/DeanDashboard.module.css";

export default function MetricsCards({ metrics }) {
  const getIcon = (iconClass) => {
    if (iconClass.includes("exclamation-triangle"))
      return <FaExclamationTriangle size={24} color="#b34747" />;
    if (iconClass.includes("check-circle"))
      return <FaCheckCircle size={24} color="#4a8b6b" />;
    if (iconClass.includes("user-md"))
      return <FaUserMd size={24} color="#2a2a72" />;
    if (iconClass.includes("check-double"))
      return <FaCheckDouble size={24} color="#2f855a" />;
    return <FaExclamationTriangle size={24} color="#2a2a72" />;
  };

  return (
    <section className={styles.metricsGrid}>
      {metrics &&
        metrics.map((metric, index) => (
          <article key={metric.label || index} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricIcon}>
                {getIcon(metric.iconClass)}
              </span>
              <span
                className={`${styles.trend} ${metric.trend === "up" ? styles.trendUp : styles.trendDown}`}
              >
                {metric.trend === "up" ? (
                  <FaArrowUp size={12} />
                ) : (
                  <FaArrowDown size={12} />
                )}{" "}
                {metric.delta}
              </span>
            </div>
            <h3>{metric.value}</h3>
            <p>{metric.label}</p>
          </article>
        ))}
    </section>
  );
}
