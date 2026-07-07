// src/components/dean/ReportGenerator.jsx
import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { FaFilePdf, FaFileCsv, FaSpinner, FaChartLine } from "react-icons/fa";
import styles from "../../styles/DeanDashboard.module.css";

// src/components/dean/ReportGenerator.jsx - Department list
const departments = [
  { name: 'SCES', fullName: 'School of Computing and Engineering Sciences' },
  { name: 'SIMS', fullName: 'School of Informatics and Mathematical Sciences' },
  { name: 'SUBS', fullName: 'School of Business' },
  { name: 'SHSS', fullName: 'School of Humanities and Social Sciences' },
  { name: 'SLS', fullName: 'School of Law' },
  { name: 'SI', fullName: 'Strathmore Institute' },
];

export default function ReportGenerator({
  reportData,
  alerts,
  referrals,
  resources,
  crisisAlerts,
}) {
  const [reportType, setReportType] = useState("summary");
  const [timeRange, setTimeRange] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const totalAlerts = alerts?.length || 0;
    const highRiskAlerts =
      alerts?.filter((a) => a.risk_level === "high").length || 0;
    const moderateRiskAlerts =
      alerts?.filter((a) => a.risk_level === "moderate").length || 0;
    const lowRiskAlerts =
      alerts?.filter((a) => a.risk_level === "low").length || 0;
    const pendingAlerts =
      alerts?.filter(
        (a) => a.alert_status === "new" || a.alert_status === "pending",
      ).length || 0;
    const resolvedAlerts =
      alerts?.filter((a) => a.alert_status === "resolved").length || 0;
    const totalReferrals = referrals?.length || 0;
    const crisisCount = crisisAlerts?.length || 0;

    const deptStats = departments.map((dept) => {
      const deptAlerts =
        alerts?.filter((a) => a.department === dept.name) || [];
      return {
        ...dept,
        total: deptAlerts.length,
        highRisk: deptAlerts.filter((a) => a.risk_level === "high").length,
        moderateRisk: deptAlerts.filter((a) => a.risk_level === "moderate")
          .length,
        lowRisk: deptAlerts.filter((a) => a.risk_level === "low").length,
      };
    });

    return {
      totalAlerts,
      highRiskAlerts,
      moderateRiskAlerts,
      lowRiskAlerts,
      pendingAlerts,
      resolvedAlerts,
      totalReferrals,
      crisisCount,
      departmentStats: deptStats,
    };
  }, [alerts, referrals, crisisAlerts]);

  const generateReportContent = () => {
    const dateRange =
      startDate && endDate
        ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
        : timeRange;

    let content = {
      title: "",
      sections: [],
    };

    if (reportType === "summary") {
      content.title = "Executive Summary Report";
      content.sections = [
        {
          title: "Overview",
          data: [
            { label: "Total Alerts", value: stats.totalAlerts },
            { label: "Crisis Interventions", value: stats.crisisCount },
            { label: "Active Referrals", value: stats.totalReferrals },
            { label: "Pending Alerts", value: stats.pendingAlerts },
          ],
        },
        {
          title: "Risk Distribution",
          data: [
            { label: "High Risk", value: stats.highRiskAlerts },
            { label: "Moderate Risk", value: stats.moderateRiskAlerts },
            { label: "Low Risk", value: stats.lowRiskAlerts },
          ],
        },
        {
          title: "Resolution Status",
          data: [
            { label: "Resolved", value: stats.resolvedAlerts },
            { label: "Pending", value: stats.pendingAlerts },
          ],
        },
      ];
    } else if (reportType === "detailed") {
      content.title = "Detailed Wellness Report";
      content.sections = [
        {
          title: "Department Breakdown",
          data: stats.departmentStats.map((dept) => ({
            label: dept.fullName,
            value: `${dept.total} alerts (${dept.highRisk} high risk, ${dept.moderateRisk} moderate, ${dept.lowRisk} low)`,
          })),
        },
        {
          title: "Risk Analysis by Department",
          data: stats.departmentStats.map((dept) => ({
            label: dept.name,
            value: `High: ${dept.highRisk}, Moderate: ${dept.moderateRisk}, Low: ${dept.lowRisk}`,
          })),
        },
      ];
    } else if (reportType === "comparison") {
      content.title = "Department Comparison Report";
      content.sections = [
        {
          title: "Department Performance Comparison",
          data: stats.departmentStats.map((dept) => ({
            label: dept.name,
            value: `${dept.total} total alerts - ${Math.round((dept.highRisk / (dept.total || 1)) * 100)}% high risk`,
          })),
        },
      ];
    }

    return content;
  };

  const handleExport = (format) => {
    setIsGenerating(true);
    const content = generateReportContent();
    const dateRange =
      startDate && endDate
        ? `${new Date(startDate).toLocaleDateString()}-${new Date(endDate).toLocaleDateString()}`
        : timeRange;
    const fileName = `${reportType}-${dateRange}-${selectedDepartment}`;

    if (format === "pdf") {
      const doc = new jsPDF("p", "mm", "a4");
      const margin = 20;
      let yPos = 20;

      doc.setFontSize(18);
      doc.setTextColor("#2A2A72");
      doc.text("MindTrackSU - Dean Report", margin, yPos);
      yPos += 12;

      doc.setFontSize(12);
      doc.setTextColor("#4a5568");
      doc.text(content.title, margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor("#6b7280");
      doc.text(`Period: ${dateRange}`, margin, yPos);
      yPos += 6;
      doc.text(`Department: ${selectedDepartment}`, margin, yPos);
      yPos += 6;
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 12;

      doc.setFontSize(12);
      doc.setTextColor("#2A2A72");

      content.sections.forEach((section) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.text(section.title, margin, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setTextColor("#1f2937");

        section.data.forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          if (typeof item === "object" && item.label !== undefined) {
            doc.text(`• ${item.label}: ${item.value}`, margin + 5, yPos);
          } else {
            doc.text(`• ${item}`, margin + 5, yPos);
          }
          yPos += 7;
        });

        yPos += 4;
      });

      doc.setFontSize(9);
      doc.setTextColor("#9ca3af");
      doc.text(
        "Generated by MindTrackSU Dean Dashboard",
        margin,
        doc.internal.pageSize.getHeight() - 10,
      );

      doc.save(`${fileName}.pdf`);
    } else {
      let csvContent = "Report Type,Section,Label,Value\n";
      csvContent += `${content.title},Metadata,Period,${dateRange}\n`;
      csvContent += `${content.title},Metadata,Department,${selectedDepartment}\n`;
      csvContent += `${content.title},Metadata,Generated,${new Date().toLocaleString()}\n\n`;

      content.sections.forEach((section) => {
        section.data.forEach((item) => {
          if (typeof item === "object" && item.label !== undefined) {
            csvContent += `${content.title},${section.title},${item.label},${item.value}\n`;
          } else {
            csvContent += `${content.title},${section.title},${item},\n`;
          }
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }

    setTimeout(() => setIsGenerating(false), 300);
  };

  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>
            <FaChartLine style={{ marginRight: "6px" }} />
            Report generator
          </p>
          <h3>Prepare institutional wellness reports</h3>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Total Alerts
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#2a2a72",
              margin: 0,
            }}
          >
            {stats.totalAlerts}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            High Risk
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#b34747",
              margin: 0,
            }}
          >
            {stats.highRiskAlerts}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Crisis Interventions
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#f59e0b",
              margin: 0,
            }}
          >
            {stats.crisisCount}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Pending Alerts
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#92400e",
              margin: 0,
            }}
          >
            {stats.pendingAlerts}
          </p>
        </div>
      </div>

      <div className={styles.reportGrid}>
        <label className={styles.fieldGroup}>
          <span>Report type</span>
          <select
            value={reportType}
            onChange={(event) => setReportType(event.target.value)}
            className={styles.selectInput}
          >
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Wellness Report</option>
            <option value="comparison">Department Comparison Report</option>
          </select>
        </label>
        <label className={styles.fieldGroup}>
          <span>Period</span>
          <select
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
            className={styles.selectInput}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className={styles.fieldGroup}>
          <span>Department</span>
          <select
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            className={styles.selectInput}
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.name} value={dept.name}>
                {dept.name} - {dept.fullName}
              </option>
            ))}
          </select>
        </label>
        {timeRange === "custom" && (
          <>
            <label className={styles.fieldGroup}>
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={styles.selectInput}
              />
            </label>
            <label className={styles.fieldGroup}>
              <span>End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={styles.selectInput}
              />
            </label>
          </>
        )}
      </div>

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => handleExport("csv")}
          disabled={isGenerating}
        >
          <FaFileCsv style={{ marginRight: "6px" }} /> Export CSV
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => handleExport("pdf")}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <FaFilePdf style={{ marginRight: "6px" }} />
          )}
          {isGenerating ? "Preparing…" : "Download PDF"}
        </button>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
