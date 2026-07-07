// src/components/dean/WellnessChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import styles from "../../styles/DeanDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function WellnessChart({ data, view, onViewChange }) {
  const safeData =
    data && data.length > 0
      ? data
      : [
          { label: "W1", score: 0 },
          { label: "W2", score: 0 },
          { label: "W3", score: 0 },
          { label: "W4", score: 0 },
          { label: "W5", score: 0 },
          { label: "W6", score: 0 },
        ];

  const chartData = {
    labels: safeData.map((item) => item.label),
    datasets: [
      {
        label: "Wellness Score",
        data: safeData.map((item) => item.score),
        borderColor: "#2A2A72",
        backgroundColor: "rgba(42, 42, 114, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#2A2A72",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4a5568",
        borderColor: "#e6e8f0",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `Score: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        min: 50,
        max: 100,
        grid: {
          color: "rgba(42, 42, 114, 0.08)",
        },
        ticks: {
          color: "#6b7280",
          stepSize: 10,
        },
      },
    },
  };

  // Get view label for display
  const getViewLabel = () => {
    switch (view) {
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      default:
        return "Monthly";
    }
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Wellness trends</p>
          <h3>Student wellness score over time ({getViewLabel()})</h3>
        </div>
        <div className={styles.toggleGroup}>
          {["weekly", "monthly", "quarterly"].map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.toggleButton} ${view === option ? styles.toggleActive : ""}`}
              onClick={() => onViewChange(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 280, width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
}
