import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import MetricsCards from '../../components/dean/MetricsCards';
import WellnessChart from '../../components/dean/WellnessChart';
import CategoryChart from '../../components/dean/CategoryChart';
import DepartmentBreakdown from '../../components/dean/DepartmentBreakdown';
import AlertSummary from '../../components/dean/AlertSummary';
import ReportGenerator from '../../components/dean/ReportGenerator';
import styles from '../../styles/DeanDashboard.module.css';

const mockMetrics = [
  { label: 'Total Students Assessed', value: '3,482', delta: '+8.2%', trend: 'up', iconClass: 'fas fa-chart-line' },
  { label: 'High-Risk Alerts (Current)', value: '47', delta: '-3.1%', trend: 'down', iconClass: 'fas fa-exclamation-triangle' },
  { label: 'Average Wellness Score', value: '78/100', delta: '+4.6%', trend: 'up', iconClass: 'fas fa-heart-pulse' },
  { label: 'Active Cases', value: '126', delta: '+2.1%', trend: 'up', iconClass: 'fas fa-file-medical' },
];

const mockWellnessTrend = [
  { label: 'W1', score: 74 },
  { label: 'W2', score: 76 },
  { label: 'W3', score: 78 },
  { label: 'W4', score: 80 },
  { label: 'W5', score: 77 },
  { label: 'W6', score: 81 },
];

const mockCategoryData = [
  { category: 'Anxiety', value: 62 },
  { category: 'Depression', value: 48 },
  { category: 'Burnout', value: 35 },
  { category: 'Sleep', value: 57 },
];

const mockDepartments = [
  { name: 'Engineering', averageScore: 82, highRisk: 8 },
  { name: 'Business', averageScore: 76, highRisk: 12 },
  { name: 'Arts & Sciences', averageScore: 79, highRisk: 10 },
  { name: 'Health Sciences', averageScore: 84, highRisk: 6 },
];

const mockAlerts = [
  { id: 1, studentId: 'A-1042', category: 'Crisis', riskLevel: 'High', status: 'pending' },
  { id: 2, studentId: 'B-2089', category: 'Burnout', riskLevel: 'Moderate', status: 'in-progress' },
  { id: 3, studentId: 'C-3178', category: 'Sleep', riskLevel: 'High', status: 'resolved' },
];

export default function DeanDashboard() {
  const [view, setView] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredDepartments = useMemo(() => {
    if (selectedDepartment === 'All') return mockDepartments;
    return mockDepartments.filter((item) => item.name === selectedDepartment);
  }, [selectedDepartment]);

  if (loading) {
    return (
      <Layout title="Dean's Dashboard" role="Dean">
        <div className={styles.loadingState}>Loading institutional wellness insights…</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dean's Dashboard" role="Dean">
        <div className={styles.loadingState}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Dean's Dashboard" role="Dean">
      <div className={styles.dashboardPage}>
        <section className={styles.heroCard}>
          <div>
            <p className={styles.cardEyebrow}>Institutional oversight</p>
            <h2>University wellness monitoring at a glance</h2>
            <p>Track trends, identify risk patterns, and generate reports for academic leadership.</p>
          </div>
          <div className={styles.heroBadge}>Secure • Anonymous • Actionable</div>
        </section>

        <MetricsCards metrics={mockMetrics} />

        <div className={styles.chartGrid}>
          <WellnessChart data={mockWellnessTrend} view={view} onViewChange={setView} />
          <CategoryChart data={mockCategoryData} />
        </div>

        <div className={styles.bottomGrid}>
          <DepartmentBreakdown
            departments={filteredDepartments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />
          <AlertSummary alerts={mockAlerts} onViewAll={() => setError('Alert detail view coming soon.')} />
        </div>

        <ReportGenerator reportData={mockMetrics} />
      </div>
    </Layout>
  );
}
