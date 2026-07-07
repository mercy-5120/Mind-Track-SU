// src/utils/studentSession.js
const API_BASE = import.meta.env.VITE_API_BASE || "/api/student";

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

export const registerStudent = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        display_name: userData.displayName,
        student_id: userData.studentId,
        department: userData.department,
        year_of_study: userData.yearOfStudy,
        email: userData.email,
        phone: userData.phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();

    if (data.success && data.student) {
      const student = data.student;
      storeStudentSession(student);
      console.log("[registerStudent] Student registered:", student);
      return student;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("[registerStudent] Registration error:", error);
    throw error;
  }
};

export const loginStudent = async (username, password) => {
  try {
    console.log("[loginStudent] Attempting login for:", username);

    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    if (data.success && data.student) {
      const student = data.student;
      storeStudentSession(student);
      console.log("[loginStudent] Student logged in:", student);
      return student;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("[loginStudent] Login error:", error);
    throw error;
  }
};

export const logoutStudent = () => {
  clearStudentSession();
  console.log("[logoutStudent] Student logged out");

  // Optionally notify the server
  try {
    fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {});
  } catch (error) {
    // Silently handle logout errors
  }
};

// =====================================================
// SESSION STORAGE HELPERS
// =====================================================

const storeStudentSession = (student) => {
  // Store complete student object
  sessionStorage.setItem("currentStudent", JSON.stringify(student));
  sessionStorage.setItem("isStudentLoggedIn", "true");

  // Store individual fields for easy access
  sessionStorage.setItem("studentId", student.student_id || "");
  sessionStorage.setItem(
    "studentName",
    student.display_name || student.username || "",
  );
  sessionStorage.setItem("studentUsername", student.username || "");
  sessionStorage.setItem("studentDepartment", student.department || "");
  sessionStorage.setItem("studentYear", student.year_of_study || "");
  sessionStorage.setItem("studentEmail", student.email || "");
  sessionStorage.setItem("studentPhone", student.phone || "");
};

const clearStudentSession = () => {
  sessionStorage.removeItem("currentStudent");
  sessionStorage.removeItem("isStudentLoggedIn");
  sessionStorage.removeItem("studentId");
  sessionStorage.removeItem("studentName");
  sessionStorage.removeItem("studentUsername");
  sessionStorage.removeItem("studentDepartment");
  sessionStorage.removeItem("studentYear");
  sessionStorage.removeItem("studentEmail");
  sessionStorage.removeItem("studentPhone");
};

export const getCurrentStudent = () => {
  // First check if we have the complete student object
  const studentJson = sessionStorage.getItem("currentStudent");
  if (studentJson) {
    try {
      const student = JSON.parse(studentJson);
      return student;
    } catch (e) {
      console.error("[getCurrentStudent] Error parsing student data:", e);
    }
  }

  // Fallback: construct from individual fields
  const isLoggedIn = sessionStorage.getItem("isStudentLoggedIn") === "true";
  if (!isLoggedIn) {
    return null;
  }

  const student = {
    student_id: sessionStorage.getItem("studentId"),
    display_name: sessionStorage.getItem("studentName"),
    username: sessionStorage.getItem("studentUsername"),
    department: sessionStorage.getItem("studentDepartment"),
    year_of_study: sessionStorage.getItem("studentYear"),
    email: sessionStorage.getItem("studentEmail"),
    phone: sessionStorage.getItem("studentPhone"),
  };

  // Only return if we have a student_id
  if (student.student_id) {
    return student;
  }

  return null;
};

export const isStudentLoggedIn = () => {
  return sessionStorage.getItem("isStudentLoggedIn") === "true";
};

export const getStudentId = () => {
  return sessionStorage.getItem("studentId");
};

export const getStudentName = () => {
  return sessionStorage.getItem("studentName") || "Student";
};

// =====================================================
// PROFILE FUNCTIONS
// =====================================================

export const updateStudentProfile = async (updatedData) => {
  try {
    const studentId = sessionStorage.getItem("studentId");

    if (!studentId) {
      throw new Error("No student logged in");
    }

    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        display_name: updatedData.display_name,
        username: updatedData.username,
        department: updatedData.department,
        year_of_study: updatedData.year_of_study,
        email: updatedData.email,
        phone: updatedData.phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }

    const data = await response.json();

    if (data.success && data.student) {
      const student = data.student;
      storeStudentSession(student);
      console.log("[updateStudentProfile] Profile updated:", student);
      return student;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("[updateStudentProfile] Update error:", error);
    throw error;
  }
};

// =====================================================
// ASSESSMENT FUNCTIONS
// =====================================================

export const saveAssessmentResult = async (student, result) => {
  try {
    const studentId =
      student?.student_id || sessionStorage.getItem("studentId");

    // If no student ID, save locally for anonymous users
    if (!studentId) {
      console.log("[saveAssessmentResult] No student ID, saving anonymously");
      const anonymousHistory = JSON.parse(
        sessionStorage.getItem("anonymousAssessmentHistory") || "[]",
      );
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        student_id: null,
        student_name: "Anonymous Student",
        mode: "anonymous",
        taken_at: new Date().toISOString(),
        ...result,
      };
      anonymousHistory.push(entry);
      sessionStorage.setItem(
        "anonymousAssessmentHistory",
        JSON.stringify(anonymousHistory),
      );
      return entry;
    }

    const response = await fetch(`${API_BASE}/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        result: result,
        mode: "student",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save assessment");
    }

    const data = await response.json();
    console.log("[saveAssessmentResult] Assessment saved:", data);
    return data.entry || data.assessment;
  } catch (error) {
    console.error("[saveAssessmentResult] Save error:", error);
    throw error;
  }
};

export const getAssessmentHistory = async (student) => {
  try {
    const studentId =
      student?.student_id || sessionStorage.getItem("studentId");

    // If no student ID, return anonymous history
    if (!studentId) {
      const anonymousHistory = JSON.parse(
        sessionStorage.getItem("anonymousAssessmentHistory") || "[]",
      );
      return anonymousHistory;
    }

    const response = await fetch(
      `${API_BASE}/assessments?student_id=${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch history");
    }

    const data = await response.json();
    const history = data.history || [];
    console.log("[getAssessmentHistory] Retrieved history:", history);
    return history;
  } catch (error) {
    console.error("[getAssessmentHistory] Get history error:", error);
    return [];
  }
};

export const getLatestAssessment = async (student) => {
  try {
    const history = await getAssessmentHistory(student);
    if (history && Array.isArray(history) && history.length > 0) {
      // Sort by date - NEWEST FIRST
      const sortedHistory = [...history].sort((a, b) => {
        const dateA = new Date(
          a.taken_at || a.completed_at || a.assessment_date,
        );
        const dateB = new Date(
          b.taken_at || b.completed_at || b.assessment_date,
        );
        return dateB - dateA;
      });
      const latest = sortedHistory[0];
      console.log("[getLatestAssessment] Latest assessment:", latest);
      return latest;
    }
    return null;
  } catch (error) {
    console.error("[getLatestAssessment] Get latest error:", error);
    return null;
  }
};

// =====================================================
// CRISIS ALERT FUNCTIONS
// =====================================================

export const saveCrisisAlert = async (student, contactInfo) => {
  try {
    const studentId =
      student?.student_id || sessionStorage.getItem("studentId");

    console.log("[saveCrisisAlert] Saving crisis alert:", {
      studentId,
      contactInfo: contactInfo,
    });

    // If no student ID, save locally (anonymous)
    if (!studentId) {
      console.log("[saveCrisisAlert] No student ID, saving locally");
      const crisisAlerts = JSON.parse(
        sessionStorage.getItem("anonymousCrisisAlerts") || "[]",
      );
      const alert = {
        alert_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        created_at: new Date().toISOString(),
        contact_info: contactInfo,
        student_id: null,
        student_identifier: `Anonymous ••••• ${contactInfo.slice(-4)}`,
        status: "crisis_contacted",
        category: "crisis",
        risk_level: "high",
        alert_status: "new",
      };
      crisisAlerts.push(alert);
      sessionStorage.setItem(
        "anonymousCrisisAlerts",
        JSON.stringify(crisisAlerts),
      );
      console.log("[saveCrisisAlert] Crisis alert saved locally:", alert);
      return alert;
    }

    // Save to database for logged-in students
    console.log("[saveCrisisAlert] Saving to database for student:", studentId);

    const response = await fetch(`${API_BASE}/crisis-alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        contact_info: contactInfo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit crisis alert");
    }

    const data = await response.json();
    console.log("[saveCrisisAlert] Crisis alert saved to database:", data);
    return data.alert;
  } catch (error) {
    console.error("[saveCrisisAlert] Save error:", error);
    throw error;
  }
};

export const getCrisisAlerts = async (student) => {
  try {
    const studentId =
      student?.student_id || sessionStorage.getItem("studentId");

    // If no student ID, return anonymous crisis alerts
    if (!studentId) {
      const crisisAlerts = JSON.parse(
        sessionStorage.getItem("anonymousCrisisAlerts") || "[]",
      );
      console.log(
        "[getCrisisAlerts] Returning anonymous crisis alerts:",
        crisisAlerts,
      );
      return crisisAlerts;
    }

    const response = await fetch(
      `${API_BASE}/crisis-alerts?student_id=${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch crisis alerts");
    }

    const data = await response.json();
    const alerts = data.alerts || [];
    console.log("[getCrisisAlerts] Retrieved crisis alerts:", alerts);
    return alerts;
  } catch (error) {
    console.error("[getCrisisAlerts] Get alerts error:", error);
    return [];
  }
};

// =====================================================
// LEGACY FUNCTIONS (for backward compatibility)
// =====================================================

export const getStoredStudents = () => {
  console.warn(
    "[getStoredStudents] This function is deprecated. Use API calls instead.",
  );
  return [];
};

export const setCurrentStudent = (student) => {
  if (student) {
    storeStudentSession(student);
  } else {
    clearStudentSession();
  }
};

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

export default {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  isStudentLoggedIn,
  getStudentId,
  getStudentName,
  updateStudentProfile,
  saveAssessmentResult,
  getAssessmentHistory,
  getLatestAssessment,
  saveCrisisAlert,
  getCrisisAlerts,
  getStoredStudents,
  setCurrentStudent,
};
