import React from 'react';
import StudentLayout from '../../components/StudentLayout';
import { getCurrentStudent, getAssessmentHistory } from '../../utils/studentSession';

export default function StudentHistory() {
  const currentStudent = getCurrentStudent();
  const history = getAssessmentHistory(currentStudent);

  return (
    <StudentLayout title="Assessment History">
      <div style={{ display: 'grid', gap: '20px', maxWidth: '840px' }}>
        <div style={{ padding: '24px', background: '#fff', borderRadius: '18px', boxShadow: '0 16px 32px rgba(42,42,114,0.05)' }}>
          <h2 style={{ marginBottom: '14px' }}>Recent assessments</h2>
          {history.length === 0 ? (
            <p style={{ color: '#6b7280' }}>
              No assessment history found yet. Complete a wellness check-in to see your score summary and recommendations.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {history.slice().reverse().map((entry) => (
                <div key={entry.id} style={{ padding: '18px', borderRadius: '16px', border: '1px solid #e6e8f0', background: '#fafbff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <strong>{new Date(entry.taken_at).toLocaleDateString()}</strong>
                      <p style={{ margin: 0, color: '#6b7280' }}>{entry.student_name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700 }}>{entry.overallScore}/100</span>
                      <span style={{ color: '#6b7280' }}>Overall score</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
                    {entry.categories?.map((cat) => (
                      <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <span>{cat.name}</span>
                        <span style={{ fontWeight: 700 }}>{cat.score}/100</span>
                        <span style={{ color: cat.level === 'High' ? '#b34747' : cat.level === 'Moderate' ? '#4a5568' : '#2f855a' }}>{cat.level}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '18px', padding: '16px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0' }}>
                    <strong>Advice</strong>
                    <p style={{ marginTop: '8px', color: '#4a5568' }}>
                      Based on this check-in, try gentle self-care, rest, and reach out to support if you need someone to talk to.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
