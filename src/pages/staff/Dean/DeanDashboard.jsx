import React, { useEffect, useMemo, useState } from "react";
import DeanLayout from "../../../components/DeanLayout";
import MetricsCards from "../../../components/dean/MetricsCards";
import WellnessChart from "../../../components/dean/WellnessChart";
import CategoryChart from "../../../components/dean/CategoryChart";
import DepartmentBreakdown from "../../../components/dean/DepartmentBreakdown";
import AlertSummary from "../../../components/dean/AlertSummary";
import ReportGenerator from "../../../components/dean/ReportGenerator";
import { getAlerts, getReferrals, getResources } from "../../../api/staffApi";
import styles from "../../../styles/DeanDashboard.module.css";

const defaultDepartments = [
  { name: "Engineering", averageScore: 82, highRisk: 8 },
  { name: "Business", averageScore: 76, highRisk: 12 },
  { name: "Arts & Sciences", averageScore: 79, highRisk: 10 },
  { name: "Health Sciences", averageScore: 84, highRisk: 6 },
];

const fallbackTrend = [
  { label: "W1", score: 74 },
  { label: "W2", score: 76 },
  { label: "W3", score: 78 },
  { label: "W4", score: 80 },
  { label: "W5", score: 77 },
  { label: "W6", score: 81 },
];

export default function DeanDashboard() {
  const [view, setView] = useState("monthly");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [resources, setResources] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [wellnessTrend, setWellnessTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [crisisAlerts, setCrisisAlerts] = useState([]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [alertsData, referralsData, resourcesData] = await Promise.all([
          getAlerts(),
          getReferrals(),
          getResources(),
        ]);

        setAlerts(alertsData);
        setReferrals(referralsData);
        setResources(resourcesData);

        const storedCrisisAlerts = JSON.parse(
          sessionStorage.getItem("crisisAlerts") || "[]",
        );
        setCrisisAlerts(storedCrisisAlerts);

        const totalAlerts = alertsData.length;
        const highRiskAlerts = alertsData.filter(
          (item) => item.risk_level === "high",
        ).length;
        const pendingAlerts = alertsData.filter((item) =>
          ["new", "pending"].includes(item.alert_status),
        ).length;
        const activeCases = alertsData.filter(
          (item) => item.alert_status !== "resolved",
        ).length;

        setMetrics([
          {
            label: "Total Alerts",
            value: `${totalAlerts}`,
            delta: totalAlerts
              ? `+${Math.round((highRiskAlerts / totalAlerts) * 100)}%`
              : "0%",
            trend: "up",
            iconClass: "fas fa-chart-line",
          },
          {
            label: "High-Risk Alerts (Current)",
            value: `${highRiskAlerts}`,
            delta: totalAlerts
              ? `+${Math.round((highRiskAlerts / (totalAlerts || 1)) * 100)}%`
              : "0%",
            trend: highRiskAlerts > 0 ? "up" : "down",
            iconClass: "fas fa-exclamation-triangle",
          },
          {
            label: "Pending Alerts",
            value: `${pendingAlerts}`,
            delta: pendingAlerts ? "+2.4%" : "0%",
            trend: pendingAlerts > 0 ? "up" : "down",
            iconClass: "fas fa-clock",
          },
          {
            label: "Active Cases",
            value: `${activeCases}`,
            delta: activeCases ? "+1.6%" : "0%",
            trend: activeCases > 0 ? "up" : "down",
            iconClass: "fas fa-file-medical",
          },
        ]);

        const categories = ["anxiety", "depression", "burnout", "sleep"];
        setCategoryData(
          categories.map((category) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            value: alertsData.filter((item) => item.category === category)
              .length,
          })),
        );

        const trending = alertsData
          .slice(0, 6)
          .reverse()
          .map((alert, index) => ({
            label: `A${index + 1}`,
            score: Math.min(
              100,
              50 + index * 5 + (alert.risk_level === "high" ? 10 : 0),
            ),
          }));

        setWellnessTrend(trending.length ? trending : fallbackTrend);
        setDepartments(defaultDepartments);
      } catch (loadError) {
        console.error("[DeanDashboard] Error loading data:", loadError);
        setError("Unable to load dean metrics from the staff database.");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();

    const refreshInterval = setInterval(() => {
      loadMetrics();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const filteredDepartments = useMemo(() => {
    if (selectedDepartment === "All") return departments;
    return departments.filter((item) => item.name === selectedDepartment);
  }, [selectedDepartment, departments]);

  const demographicFilteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesDepartment =
        selectedDepartment === "All" || alert.department === selectedDepartment;
      const matchesYear =
        selectedYear === "All" || alert.year_of_study === selectedYear;
      const matchesGender =
        selectedGender === "All" || alert.gender === selectedGender;
      return matchesDepartment && matchesYear && matchesGender;
    });
  }, [alerts, selectedDepartment, selectedYear, selectedGender]);

  if (loading) {
    return (
      <DeanLayout title="Dean's Dashboard">
        <div className={styles.loadingState}>
          Loading institutional wellness insights…
        </div>
      </DeanLayout>
    );
  }

  if (error) {
    return (
      <DeanLayout title="Dean's Dashboard">
        <div className={styles.loadingState}>{error}</div>
      </DeanLayout>
    );
  }

  return (
    <DeanLayout title="Dean's Dashboard">
      <div className={styles.dashboardPage}>
        <section className={styles.heroCard}>
          <div>
            <p className={styles.cardEyebrow}>Institutional oversight</p>
            <h2>University wellness monitoring at a glance</h2>
            <p>
              Track trends, identify risk patterns, and generate reports for
              academic leadership.
            </p>
          </div>
          <div className={styles.heroBadge}>
            Secure • Anonymous • Actionable
          </div>
        </section>

        <MetricsCards metrics={metrics} />

        <div className={styles.chartGrid}>
          <WellnessChart
            data={wellnessTrend}
            view={view}
            onViewChange={setView}
          />
          <CategoryChart data={categoryData} />
        </div>

        <div className={styles.filterBar}>
          <label className={styles.filterLabel}>
            <span>Department</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Law">Law</option>
              <option value="Commerce">Commerce</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </label>
          <label className={styles.filterLabel}>
            <span>Year of Study</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </label>
          <label className={styles.filterLabel}>
            <span>Gender</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className={styles.selectInput}
            >
              <option value="All">All genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div className={styles.bottomGrid}>
          <DepartmentBreakdown
            departments={filteredDepartments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />
          <AlertSummary
            alerts={demographicFilteredAlerts.slice(0, 4)}
            onViewAll={() => setError("Alert detail view coming soon.")}
          />
        </div>

        <ReportGenerator reportData={metrics} />
      </div>
    </DeanLayout>
  );
}
