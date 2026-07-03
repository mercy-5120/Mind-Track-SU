import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { getCurrentStudent, getLatestAssessment, getAssessmentHistory } from '../../utils/studentSession';

export default function StudentDashboard() {
  const student = getCurrentStudent();
  const latestAssessment = getLatestAssessment(student);
  const history = getAssessmentHistory(student);
  const completedCount = history.length;

  return (
    <StudentLayout title="Dashboard">
      <div style={{ display: 'grid', gap: '24px', maxWidth: '920px' }}>
        <section style={{ padding: '24px', background: '#fff', borderRadius: '18px', boxShadow: '0 16px 32px rgba(42,42,114,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280' }}>Welcome back</p>
              <h2 style={{ margin: '8px 0 0', fontSize: '2rem' }}>{student?.display_name || 'Student'}</h2>
              <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{student?.department ? `${student.department}, Year ${student.year_of_study}` : 'Student account'}</p>
            </div>
            <div style={{ minWidth: '160px', padding: '18px 22px', borderRadius: '18px', background: '#f0f4ff' }}>
              <p style={{ margin: 0, color: '#4a5568', fontSize: '0.95rem' }}>Assessments completed</p>
              <p style={{ margin: '8px 0 0', fontSize: '2rem', fontWeight: 700 }}>{completedCount}</p>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
          <Link to="/assessment-intro" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '22px', borderRadius: '18px', background: '#eef4ff', color: '#1f2937' }}>
              <h3 style={{ marginBottom: '12px' }}>Start a new assessment</h3>
              <p style={{ margin: 0, color: '#4a5568' }}>Complete a fresh wellness check-in and keep the result in your account.</p>
            </div>
          </Link>
          <Link to="/student/history" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '22px', borderRadius: '18px', background: '#fff7ed', color: '#1f2937' }}>
              <h3 style={{ marginBottom: '12px' }}>View your history</h3>
              <p style={{ margin: 0, color: '#4a5568' }}>Review past scores and patterns over time.</p>
            </div>
          </Link>
          <Link to="/crisis" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '22px', borderRadius: '18px', background: '#fef2f2', color: '#1f2937' }}>
              <h3 style={{ marginBottom: '12px' }}>Need urgent support?</h3>
              <p style={{ margin: 0, color: '#4a5568' }}>Submit a confidential crisis contact request and get connected with a counsellor.</p>
            </div>
          </Link>
        </section>

        <section style={{ padding: '24px', background: '#fff', borderRadius: '18px', boxShadow: '0 16px 32px rgba(42,42,114,0.05)' }}>
          <h3 style={{ marginBottom: '14px' }}>Latest check-in</h3>
          {latestAssessment ? (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '1.2rem' }}>{latestAssessment.overallScore}/100</strong>
                  <p style={{ margin: '6px 0 0', color: '#6b7280' }}>{new Date(latestAssessment.taken_at).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#4a5568' }}>Mode: {latestAssessment.mode === 'anonymous' ? 'Anonymous' : 'Account'}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {latestAssessment.categories?.map((category) => (
                  <div key={category.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{category.name}</span>
                    <strong>{category.score}/100</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No completed assessments yet. Start one to see personalized feedback and trends.</p>
          )}
        </section>
      </div>
    </StudentLayout>
  );
}
