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
  } catch (error) {
    console.error('Student login error:', error);
    throw error;
  }
};
