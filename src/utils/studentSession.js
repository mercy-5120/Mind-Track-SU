const API_BASE = '/api/student';

export const loginStudent = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Uses 'username' field
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    if (data.success && data.student) {
      // Store student session data
      sessionStorage.setItem('studentId', data.student.student_id);
      sessionStorage.setItem('studentName', data.student.display_name);
      sessionStorage.setItem('studentUsername', data.student.username);
      sessionStorage.setItem('studentDepartment', data.student.department);
      sessionStorage.setItem('studentYear', data.student.year_of_study);
      sessionStorage.setItem('isStudentLoggedIn', 'true');
      
      return data.student;
    } else {
      throw new Error('Invalid response from server');
    }

    // IMPORTANT: Preserve the student_id and other critical fields
    const originalStudent = students[studentIndex];

    // Only update the fields that should be editable
    const updatedStudent = {
      ...originalStudent,
      // Only update these specific fields
      display_name:
        updatedData.display_name !== undefined
          ? updatedData.display_name
          : originalStudent.display_name,
      username:
        updatedData.username !== undefined
          ? updatedData.username
          : originalStudent.username,
      department:
        updatedData.department !== undefined
          ? updatedData.department
          : originalStudent.department,
      year_of_study:
        updatedData.year_of_study !== undefined
          ? updatedData.year_of_study
          : originalStudent.year_of_study,
      email:
        updatedData.email !== undefined
          ? updatedData.email
          : originalStudent.email,
      phone:
        updatedData.phone !== undefined
          ? updatedData.phone
          : originalStudent.phone,
      // CRITICAL: Never allow these fields to change
      student_id: originalStudent.student_id, // NEVER change student_id
      password_hash: originalStudent.password_hash, // Preserve password
      anonymous_account: originalStudent.anonymous_account,
      is_active: originalStudent.is_active,
      created_at: originalStudent.created_at,
      // Preserve last_login if it exists
      last_login: originalStudent.last_login,
    };

    // Update the students array
    students[studentIndex] = updatedStudent;
    writeStorage(STUDENT_STORAGE_KEY, students);

    // Update the current session with the new data
    setCurrentStudent(updatedStudent);

    return updatedStudent;
  } catch (error) {
    console.error('Student login error:', error);
    throw error;
  }
};
