const STUDENT_STORAGE_KEY = "mindtracksu_students";
const CURRENT_STUDENT_KEY = "mindtracksu_current_student";
const ASSESSMENT_HISTORY_KEY = "mindtracksu_assessment_history";

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
      anonymous_account: 0,
      is_active: 1,
      created_at: new Date().toISOString(),
    };

    writeStorage(STUDENT_STORAGE_KEY, [demoStudent]);
    return [demoStudent];
  }

  return students;
};

export const registerStudent = ({ username, password, displayName }) => {
  const students = getStoredStudents();
  const normalizedUsername = username.trim().toLowerCase();
  const existingStudent = students.find(
    (student) => student.username.toLowerCase() === normalizedUsername,
  );

  if (existingStudent) {
    throw new Error("That username is already in use.");
  }

  const student = {
    student_id: createStudentId(),
    username: username.trim(),
    password_hash: hashPassword(password),
    display_name: displayName?.trim() || username.trim(),
    department: "",
    year_of_study: null,
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
    (candidate) => candidate.username.toLowerCase() === normalizedUsername,
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

export const saveAssessmentResult = (student, result) => {
  const history = readStorage(ASSESSMENT_HISTORY_KEY, []);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    student_id: student?.student_id ?? null,
    student_name: student?.display_name || student?.username || "Anonymous student",
    mode: student ? "student" : "anonymous",
    taken_at: new Date().toISOString(),
    ...result,
  };

  const nextHistory = [...history, entry];
  writeStorage(ASSESSMENT_HISTORY_KEY, nextHistory);
  return entry;
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
