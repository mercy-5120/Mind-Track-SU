import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import styles from '../../styles/DeanDashboard.module.css';

export default function ReportGenerator({ reportData }) {
  const [reportType, setReportType] = useState('summary');
  const [timeRange, setTimeRange] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preview, setPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const previewText = useMemo(() => {
    if (!reportData) return 'Select a report type to preview.';
    return `Generate ${reportType} report for ${timeRange} from ${startDate || 'current range'} to ${endDate || 'current range'}.`;
  }, [reportData, reportType, timeRange, startDate, endDate]);

  const handlePreview = () => {
    setPreview(previewText);
  };

  const handleExport = (format) => {
    setIsGenerating(true);
    setPreview(`Preparing ${format.toUpperCase()} export...`);

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('MindTrackSU Dean Report', 14, 20);
      doc.setFontSize(11);
      doc.text(previewText, 14, 35);
      doc.save(`${reportType}-${timeRange}-report.pdf`);
    } else {
      const csvRows = [['Type', 'Range', 'Summary'], [reportType, timeRange, previewText]];
      const csvContent = csvRows.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-${timeRange}-report.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }

    setTimeout(() => setIsGenerating(false), 300);
  };

  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Report generator</p>
          <h3>Prepare institutional wellness reports</h3>
        </div>
      </div>
      <div className={styles.reportGrid}>
        <label className={styles.fieldGroup}>
          <span>Report type</span>
          <select value={reportType} onChange={(event) => setReportType(event.target.value)} className={styles.selectInput}>
            <option value="summary">Summary Report</option>
            <option value="detailed">Detailed Wellness Report</option>
            <option value="comparison">Department Comparison Report</option>
          </select>
        </label>
        <label className={styles.fieldGroup}>
          <span>Period</span>
          <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} className={styles.selectInput}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className={styles.fieldGroup}>
          <span>Start date</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={styles.selectInput} />
        </label>
        <label className={styles.fieldGroup}>
          <span>End date</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={styles.selectInput} />
        </label>
      </div>
      <div className={styles.previewBox}>{preview || previewText}</div>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.secondaryButton} onClick={handlePreview}>Preview</button>
        <button type="button" className={styles.secondaryButton} onClick={() => handleExport('csv')} disabled={isGenerating}>
          Export CSV
        </button>
        <button type="button" className={styles.primaryButton} onClick={() => handleExport('pdf')} disabled={isGenerating}>
          {isGenerating ? 'Preparing…' : 'Download PDF'}
        </button>
      </div>
    </section>
  );
}
