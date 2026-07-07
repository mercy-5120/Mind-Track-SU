const STUDENT_STORAGE_KEY = "mindtracksu_students";
const CURRENT_STUDENT_KEY = "mindtracksu_current_student";
const ASSESSMENT_HISTORY_KEY = "mindtracksu_assessment_history";
const CRISIS_ALERTS_KEY = "mindtracksu_crisis_alerts";

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn("Unable to read storage", key, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const createStudentId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const hashPassword = (password) => {
  if (!password) return "";
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(password)));
  }

  return password;
};

export const getStoredStudents = () => {
  const students = readStorage(STUDENT_STORAGE_KEY, []);

  if (!Array.isArray(students) || students.length === 0) {
    const demoStudent = {
      student_id: createStudentId(),
      username: "demo",
      password_hash: hashPassword("demo123"),
      display_name: "Demo Student",
      department: "Computer Science",
      year_of_study: 2,
      email: "demo@student.edu",
      phone: "",
      anonymous_account: 0,
      is_active: 1,
      created_at: new Date().toISOString(),
    };

    writeStorage(STUDENT_STORAGE_KEY, [demoStudent]);
    return [demoStudent];
  }

  return students;
};

export const registerStudent = ({
  username,
  password,
  displayName,
  studentId,
  department,
  yearOfStudy,
  email,
  phone,
}) => {
  const students = getStoredStudents();
  const normalizedUsername = username.trim().toLowerCase();
  const existingStudent = students.find(
    (student) => student.username.toLowerCase() === normalizedUsername,
  );
  const existingStudentId = students.find(
    (student) => student.student_id === studentId?.trim(),
  );

  if (existingStudent) {
    throw new Error("That username is already in use.");
  }

  if (studentId && existingStudentId) {
    throw new Error("That student ID is already registered.");
  }

  const student = {
    student_id: studentId?.trim() || createStudentId(),
    username: username.trim(),
    password_hash: hashPassword(password),
    display_name: displayName?.trim() || username.trim(),
    department: department?.trim() || "",
    year_of_study: yearOfStudy ? Number(yearOfStudy) : null,
    email: email?.trim() || "",
    phone: phone?.trim() || "",
    anonymous_account: 0,
    is_active: 1,
    created_at: new Date().toISOString(),
  };

  students.push(student);
  writeStorage(STUDENT_STORAGE_KEY, students);
  setCurrentStudent(student);
  return student;
};

export const loginStudent = (username, password) => {
  const students = getStoredStudents();
  const normalizedUsername = username.trim().toLowerCase();
  const student = students.find(
    (candidate) =>
      candidate.username.toLowerCase() === normalizedUsername ||
      candidate.student_id?.toLowerCase() === normalizedUsername,
  );

  if (!student || student.password_hash !== hashPassword(password)) {
    throw new Error("Invalid username or password.");
  }

  const activeStudent = {
    ...student,
    last_login: new Date().toISOString(),
  };

  const updatedStudents = students.map((candidate) =>
    candidate.student_id === student.student_id ? activeStudent : candidate,
  );

  writeStorage(STUDENT_STORAGE_KEY, updatedStudents);
  setCurrentStudent(activeStudent);
  return activeStudent;
};

export const setCurrentStudent = (student) => {
  writeStorage(CURRENT_STUDENT_KEY, student);
};

export const getCurrentStudent = () => readStorage(CURRENT_STUDENT_KEY, null);

export const logoutStudent = () => {
  writeStorage(CURRENT_STUDENT_KEY, null);
};

export const updateStudentProfile = (updatedData) => {
  try {
    const currentStudent = getCurrentStudent();
    if (!currentStudent) {
      throw new Error("No student logged in");
    }

    // Get all students
    const students = getStoredStudents();

    // Find the student in the array
    const studentIndex = students.findIndex(
      (s) => s.student_id === currentStudent.student_id,
    );

    if (studentIndex === -1) {
      throw new Error("Student not found in database");
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
    console.error("Error updating student profile:", error);
    throw error;
  }
};

export const saveAssessmentResult = (student, result) => {
  const history = readStorage(ASSESSMENT_HISTORY_KEY, []);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    student_id: student?.student_id ?? null,
    student_name:
      student?.display_name || student?.username || "Anonymous student",
    mode: student ? "student" : "anonymous",
    taken_at: new Date().toISOString(),
    ...result,
  };

  const nextHistory = [...history, entry];
  writeStorage(ASSESSMENT_HISTORY_KEY, nextHistory);
  return entry;
};

export const saveCrisisAlert = (student, contactInfo) => {
  const alerts = readStorage(CRISIS_ALERTS_KEY, []);
  const entry = {
    alert_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    contact_info: contactInfo.trim(),
    student_id: student?.student_id ?? null,
    student_identifier: student
      ? `${student.display_name || student.username}`
      : `Anonymous ••••• ${contactInfo.slice(-4)}`,
    status: "crisis_contacted",
    category: "crisis",
    risk_level: "high",
    alert_status: "new",
    description: "Student requested crisis counselor contact",
  };

  const nextAlerts = [...alerts, entry];
  writeStorage(CRISIS_ALERTS_KEY, nextAlerts);
  return entry;
};

export const getCrisisAlerts = (student) => {
  const alerts = readStorage(CRISIS_ALERTS_KEY, []);
  if (!Array.isArray(alerts)) return [];
  if (!student) return alerts.filter((alert) => alert.student_id === null);
  return alerts.filter((alert) => alert.student_id === student.student_id);
};

export const getAssessmentHistory = (student) => {
  const history = readStorage(ASSESSMENT_HISTORY_KEY, []);

  if (!Array.isArray(history)) return [];

  if (!student) {
    return history.filter((entry) => entry.mode === "anonymous");
  }

  return history.filter((entry) => entry.student_id === student.student_id);
};

export const getLatestAssessment = (student) => {
  const history = getAssessmentHistory(student);
  return history[history.length - 1] || null;
};
