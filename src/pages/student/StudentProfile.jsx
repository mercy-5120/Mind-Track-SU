import React from 'react';
import StudentLayout from '../../components/StudentLayout';
import { getCurrentStudent } from '../../utils/studentSession';

export default function StudentProfile() {
  const student = getCurrentStudent();

  if (!student) {
    return (
      <StudentLayout title="Profile">
        <div style={{ padding: '24px', background: '#fff', borderRadius: '16px' }}>
          <h2>No student signed in</h2>
          <p>Please log in or create an account to view your profile.</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Profile">
      <div style={{ display: 'grid', gap: '20px', maxWidth: '760px' }}>
        <div style={{ padding: '24px', background: '#fff', borderRadius: '18px', boxShadow: '0 16px 32px rgba(42,42,114,0.05)' }}>
          <h2 style={{ marginBottom: '14px' }}>Your profile</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <strong>Name</strong>
              <p>{student.display_name || student.username || 'Anonymous Student'}</p>
            </div>
            <div>
              <strong>Username</strong>
              <p>{student.username || 'Not set'}</p>
            </div>
            <div>
              <strong>Student ID</strong>
              <p>{student.student_id || 'Not available'}</p>
            </div>
            <div>
              <strong>Department</strong>
              <p>{student.department || 'Not set'}</p>
            </div>
            <div>
              <strong>Year of study</strong>
              <p>{student.year_of_study || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
