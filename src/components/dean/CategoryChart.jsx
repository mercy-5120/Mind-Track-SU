// src/components/dean/CategoryChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../../styles/DeanDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const COLORS = ["#2A2A72", "#7C4DFF", "#F08A5D", "#4CAF50"];

export default function CategoryChart({ data }) {
  const safeData =
    data && data.length > 0
      ? data
      : [
          { category: "Anxiety", value: 0 },
          { category: "Depression", value: 0 },
          { category: "Burnout", value: 0 },
          { category: "Sleep", value: 0 },
        ];

  const chartData = {
    labels: safeData.map((item) => item.category),
    datasets: [
      {
        label: "Number of Alerts",
        data: safeData.map((item) => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color),
        borderWidth: 1,
        borderRadius: 4,
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
            return `Alerts: ${context.parsed.y}`;
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
        beginAtZero: true,
        grid: {
          color: "rgba(42, 42, 114, 0.08)",
        },
        ticks: {
          color: "#6b7280",
          stepSize: 1,
        },
      },
    },
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Category distribution</p>
          <h3>Wellness concerns across the student population</h3>
        </div>
      </div>
      <div style={{ height: 280, width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </section>
  );
}
