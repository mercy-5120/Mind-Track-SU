// src/pages/staff/Dean/DeanDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import DeanLayout from "../../../components/DeanLayout";
import MetricsCards from "../../../components/dean/MetricsCards";
import WellnessChart from "../../../components/dean/WellnessChart";
import CategoryChart from "../../../components/dean/CategoryChart";
import DepartmentBreakdown from "../../../components/dean/DepartmentBreakdown";
import ReportGenerator from "../../../components/dean/ReportGenerator";
import { getAlerts, getReferrals, getResources } from "../../../api/staffApi";
import styles from "../../../styles/DeanDashboard.module.css";

const departments = [
  { name: "SCES", fullName: "School of Computing and Engineering Sciences" },
  { name: "SIMS", fullName: "School of Informatics and Mathematical Sciences" },
  { name: "SUBS", fullName: "School of Business" },
  { name: "SHSS", fullName: "School of Humanities and Social Sciences" },
  { name: "SLS", fullName: "School of Law" },
  { name: "SI", fullName: "Strathmore Institute" },
];

const defaultDepartments = [
  { name: "SCES", averageScore: 82, highRisk: 8 },
  { name: "SIMS", averageScore: 76, highRisk: 12 },
  { name: "SUBS", averageScore: 79, highRisk: 10 },
  { name: "SHSS", averageScore: 84, highRisk: 6 },
  { name: "SLS", averageScore: 78, highRisk: 9 },
  { name: "SI", averageScore: 81, highRisk: 7 },
];

const fallbackTrend = [
  { label: "W1", score: 74 },
  { label: "W2", score: 76 },
  { label: "W3", score: 78 },
  { label: "W4", score: 80 },
  { label: "W5", score: 77 },
  { label: "W6", score: 81 },
];

const fallbackCategoryData = [
  { category: "Anxiety", value: 0 },
  { category: "Depression", value: 0 },
  { category: "Burnout", value: 0 },
  { category: "Sleep", value: 0 },
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
  const [wellnessTrend, setWellnessTrend] = useState(fallbackTrend);
  const [categoryData, setCategoryData] = useState(fallbackCategoryData);
  const [departmentsData, setDepartmentsData] = useState(defaultDepartments);
  const [crisisAlerts, setCrisisAlerts] = useState([]);

  const getFilteredTrendData = (alertsData, viewType) => {
    if (!alertsData || alertsData.length === 0) return fallbackTrend;

    const sortedAlerts = [...alertsData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    let groupedData = [];
    const now = new Date();

    switch (viewType) {
      case "weekly": {
        for (let i = 5; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          const weekAlerts = sortedAlerts.filter((a) => {
            const date = new Date(a.created_at);
            return date >= weekStart && date <= weekEnd;
          });

          const avgScore =
            weekAlerts.length > 0
              ? Math.round(
                  weekAlerts.reduce((sum, a) => {
                    const score = a.total_score || a.overallScore || 75;
                    return sum + (typeof score === "number" ? score : 75);
                  }, 0) / weekAlerts.length,
                )
              : 70 + Math.round(Math.random() * 10);

          groupedData.push({
            label: `W${i + 1}`,
            score: Math.min(100, Math.max(50, avgScore)),
          });
        }
        break;
      }

      case "monthly": {
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            0,
          );

          const monthAlerts = sortedAlerts.filter((a) => {
            const date = new Date(a.created_at);
            return date >= monthStart && date <= monthEnd;
          });

          const avgScore =
            monthAlerts.length > 0
              ? Math.round(
                  monthAlerts.reduce((sum, a) => {
                    const score = a.total_score || a.overallScore || 75;
                    return sum + (typeof score === "number" ? score : 75);
                  }, 0) / monthAlerts.length,
                )
              : 70 + Math.round(Math.random() * 10);

          groupedData.push({
            label: monthStart.toLocaleDateString("en-US", { month: "short" }),
            score: Math.min(100, Math.max(50, avgScore)),
          });
        }
        break;
      }

      case "quarterly": {
        for (let i = 3; i >= 0; i--) {
          const quarterStart = new Date(now);
          quarterStart.setMonth(now.getMonth() - i * 3);
          quarterStart.setDate(1);
          const quarterEnd = new Date(quarterStart);
          quarterEnd.setMonth(quarterEnd.getMonth() + 3);
          quarterEnd.setDate(0);

          const quarterAlerts = sortedAlerts.filter((a) => {
            const date = new Date(a.created_at);
            return date >= quarterStart && date <= quarterEnd;
          });

          const avgScore =
            quarterAlerts.length > 0
              ? Math.round(
                  quarterAlerts.reduce((sum, a) => {
                    const score = a.total_score || a.overallScore || 75;
                    return sum + (typeof score === "number" ? score : 75);
                  }, 0) / quarterAlerts.length,
                )
              : 70 + Math.round(Math.random() * 10);

          groupedData.push({
            label: `Q${4 - i}`,
            score: Math.min(100, Math.max(50, avgScore)),
          });
        }
        break;
      }

      default: {
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            0,
          );

          const monthAlerts = sortedAlerts.filter((a) => {
            const date = new Date(a.created_at);
            return date >= monthStart && date <= monthEnd;
          });

          const avgScore =
            monthAlerts.length > 0
              ? Math.round(
                  monthAlerts.reduce((sum, a) => {
                    const score = a.total_score || a.overallScore || 75;
                    return sum + (typeof score === "number" ? score : 75);
                  }, 0) / monthAlerts.length,
                )
              : 70 + Math.round(Math.random() * 10);

          groupedData.push({
            label: monthStart.toLocaleDateString("en-US", { month: "short" }),
            score: Math.min(100, Math.max(50, avgScore)),
          });
        }
      }
    }

    return groupedData.length > 0 ? groupedData : fallbackTrend;
  };

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [alertsData, referralsData, resourcesData] = await Promise.all([
          getAlerts(),
          getReferrals(),
          getResources(),
        ]);

        // Get anonymous crisis alerts from localStorage
        const anonymousAlerts = JSON.parse(
          localStorage.getItem("anonymousCrisisAlerts") || "[]",
        );
        console.log(
          "[DeanDashboard] Anonymous crisis alerts:",
          anonymousAlerts,
        );

        // Combine API alerts with anonymous alerts
        const allAlertsData = [...(alertsData || []), ...anonymousAlerts];

        // Remove duplicates
        const uniqueAlerts = allAlertsData.filter(
          (alert, index, self) =>
            index === self.findIndex((a) => a.alert_id === alert.alert_id),
        );

        setAlerts(uniqueAlerts);
        setReferrals(referralsData || []);
        setResources(resourcesData || []);

        const storedCrisisAlerts = JSON.parse(
          sessionStorage.getItem("crisisAlerts") || "[]",
        );
        setCrisisAlerts([...storedCrisisAlerts, ...anonymousAlerts]);

        // Filter for SUMC and Peer Counsellor data only
        const sumcAndPeerAlerts = uniqueAlerts.filter(
          (item) =>
            item.assigned_staff_role === "sumc_counsellor" ||
            item.assigned_staff_role === "peer_counsellor" ||
            item.assigned_staff_id === 1 ||
            item.assigned_staff_id === 2 ||
            item.category === "crisis", // Include crisis alerts
        );

        const sumcAndPeerReferrals = (referralsData || []).filter(
          (item) =>
            item.referred_to === "sumc_counsellor" ||
            item.referred_to === "peer_counsellor",
        );

        // Calculate metrics from filtered data
        const totalAlerts = sumcAndPeerAlerts.length;
        const resolvedAlerts = sumcAndPeerAlerts.filter(
          (item) =>
            item.alert_status === "resolved" || item.alert_status === "closed",
        ).length;
        const totalReferrals = sumcAndPeerReferrals.length;
        const resolvedReferrals = sumcAndPeerReferrals.filter(
          (item) =>
            item.referral_status === "completed" ||
            item.referral_status === "resolved",
        ).length;

        const alertResolutionRate =
          totalAlerts > 0
            ? Math.round((resolvedAlerts / totalAlerts) * 100)
            : 0;
        const referralResolutionRate =
          totalReferrals > 0
            ? Math.round((resolvedReferrals / totalReferrals) * 100)
            : 0;

        setMetrics([
          {
            label: "Total Alerts",
            value: `${totalAlerts}`,
            delta: totalAlerts > 0 ? `${alertResolutionRate}% resolved` : "0%",
            trend: "up",
            iconClass: "fas fa-exclamation-triangle",
          },
          {
            label: "Resolved Alerts",
            value: `${resolvedAlerts}`,
            delta:
              resolvedAlerts > 0
                ? `${Math.round((resolvedAlerts / (totalAlerts || 1)) * 100)}%`
                : "0%",
            trend: resolvedAlerts > 0 ? "up" : "down",
            iconClass: "fas fa-check-circle",
          },
          {
            label: "Total Referrals",
            value: `${totalReferrals}`,
            delta:
              totalReferrals > 0 ? `${referralResolutionRate}% resolved` : "0%",
            trend: totalReferrals > 0 ? "up" : "down",
            iconClass: "fas fa-user-md",
          },
          {
            label: "Resolved Referrals",
            value: `${resolvedReferrals}`,
            delta:
              resolvedReferrals > 0
                ? `${Math.round((resolvedReferrals / (totalReferrals || 1)) * 100)}%`
                : "0%",
            trend: resolvedReferrals > 0 ? "up" : "down",
            iconClass: "fas fa-check-double",
          },
        ]);

        // Use filtered alerts for category data
        const categories = [
          "anxiety",
          "depression",
          "burnout",
          "sleep",
          "crisis",
        ];
        const categoryDataArray = categories.map((category) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          value: sumcAndPeerAlerts.filter((item) => item.category === category)
            .length,
        }));
        setCategoryData(
          categoryDataArray.length > 0
            ? categoryDataArray
            : fallbackCategoryData,
        );

        // Use filtered alerts for department stats
        const deptStats = departments.map((dept) => {
          const deptAlerts = sumcAndPeerAlerts.filter(
            (a) => a.department === dept.name,
          );
          const total = deptAlerts.length;
          const highRisk = deptAlerts.filter(
            (a) => a.risk_level === "high",
          ).length;
          const averageScore =
            total > 0 ? Math.round(100 - (highRisk / total) * 30) : 75;
          return {
            name: dept.name,
            averageScore: Math.min(100, Math.max(50, averageScore)),
            highRisk: highRisk,
          };
        });
        setDepartmentsData(deptStats);

        const trendData = getFilteredTrendData(sumcAndPeerAlerts, view);
        setWellnessTrend(trendData);
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

  // Update wellness trend when view changes
  useEffect(() => {
    if (alerts.length > 0) {
      // Filter for SUMC and Peer Counsellor data
      const sumcAndPeerAlerts = alerts.filter(
        (item) =>
          item.assigned_staff_role === "sumc_counsellor" ||
          item.assigned_staff_role === "peer_counsellor" ||
          item.assigned_staff_id === 1 ||
          item.assigned_staff_id === 2 ||
          item.category === "crisis",
      );
      const trendData = getFilteredTrendData(sumcAndPeerAlerts, view);
      setWellnessTrend(trendData);
    }
  }, [view, alerts]);

  const filteredDepartments = useMemo(() => {
    if (selectedDepartment === "All") return departmentsData;
    return departmentsData.filter((item) => item.name === selectedDepartment);
  }, [selectedDepartment, departmentsData]);

  const demographicFilteredAlerts = useMemo(() => {
    // Filter for SUMC and Peer Counsellor data only
    const sumcAndPeerAlerts = (alerts || []).filter(
      (item) =>
        item.assigned_staff_role === "sumc_counsellor" ||
        item.assigned_staff_role === "peer_counsellor" ||
        item.assigned_staff_id === 1 ||
        item.assigned_staff_id === 2 ||
        item.category === "crisis",
    );

    return sumcAndPeerAlerts.filter((alert) => {
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
              {departments.map((dept) => (
                <option key={dept.name} value={dept.name}>
                  {dept.name} - {dept.fullName}
                </option>
              ))}
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
        </div>

        <ReportGenerator
          reportData={metrics}
          alerts={alerts.filter(
            (item) =>
              item.assigned_staff_role === "sumc_counsellor" ||
              item.assigned_staff_role === "peer_counsellor" ||
              item.assigned_staff_id === 1 ||
              item.assigned_staff_id === 2 ||
              item.category === "crisis",
          )}
          referrals={referrals.filter(
            (item) =>
              item.referred_to === "sumc_counsellor" ||
              item.referred_to === "peer_counsellor",
          )}
          resources={resources}
          crisisAlerts={crisisAlerts}
        />
      </div>
    </DeanLayout>
  );
}
