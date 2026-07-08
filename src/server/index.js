import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { all, get, run, getStaffDatabaseName } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Root route
app.get("/", (req, res) => {
  res.send(
    "Backend server is running. Use /api/student/login for student login.",
  );
});

const getRequestedStaffId = (req) => {
  const rawStaffId =
    req.query.staffId ??
    req.body?.staffId ??
    req.body?.staff_id ??
    req.params.staffId;
  return rawStaffId ? Number(rawStaffId) : null;
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getLevel = (score) => {
  if (score >= 70) return "Low";
  if (score >= 40) return "Moderate";
  return "High";
};

const getRiskLevel = (score) => {
  if (score >= 70) return "low";
  if (score >= 40) return "moderate";
  return "high";
};

// Format date for MySQL (YYYY-MM-DD HH:MM:SS)
const formatMySQLDate = (date) => {
  return date.toISOString().replace("T", " ").slice(0, 19);
};

// =====================================================
// STAFF ROUTES
// =====================================================

// Get All Alerts (with contact_info from crisis_alerts)
app.get("/api/staff/alerts", async (req, res) => {
  try {
    const alerts = await all(
      `
      SELECT 
        a.alert_id, 
        a.category, 
        a.risk_level, 
        a.alert_status, 
        a.student_name, 
        a.student_identifier, 
        a.created_at,
        s.name AS assigned_staff_name, 
        s.role AS assigned_staff_role,
        c.contact_info,
        c.is_anonymous
      FROM staff_alerts a
      LEFT JOIN staff_accounts s ON a.assigned_staff_id = s.staff_id
      LEFT JOIN crisis_alerts c ON a.alert_id = c.alert_id
      ORDER BY a.created_at DESC
    `,
      [],
    );

    console.log("[GET /api/staff/alerts] Alerts found:", alerts.length);
    res.json(alerts);
  } catch (error) {
    console.error("[GET /api/staff/alerts] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Alert by ID (with contact_info from crisis_alerts)
app.get("/api/staff/alerts/:id", async (req, res) => {
  try {
    const alert = await get(
      `
      SELECT a.*, s.name AS assigned_staff_name, s.role AS assigned_staff_role,
             c.contact_info, c.is_anonymous
      FROM staff_alerts a
      LEFT JOIN staff_accounts s ON a.assigned_staff_id = s.staff_id
      LEFT JOIN crisis_alerts c ON a.alert_id = c.alert_id
      WHERE a.alert_id = ?
    `,
      [req.params.id],
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json(alert);
  } catch (error) {
    console.error("[GET /api/staff/alerts/:id] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Alert Status
app.put("/api/staff/alerts/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const alertId = req.params.id;

    console.log(
      "[PUT /api/staff/alerts/:id/status] Updating alert:",
      alertId,
      "to:",
      status,
    );

    await run("UPDATE staff_alerts SET alert_status = ? WHERE alert_id = ?", [
      status,
      alertId,
    ]);

    console.log("[PUT /api/staff/alerts/:id/status] Success");
    res.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/staff/alerts/:id/status] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get Referrals
app.get("/api/staff/referrals", async (req, res) => {
  try {
    const referrals = await all(
      `
      SELECT r.referral_id, r.referred_to, r.referral_status, r.student_name, r.notes, r.created_at, a.category, a.risk_level
      FROM referrals r
      LEFT JOIN staff_alerts a ON r.alert_id = a.alert_id
      ORDER BY r.referral_id DESC
    `,
      [],
    );
    res.json(referrals);
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create Referral
app.post("/api/staff/referrals", async (req, res) => {
  try {
    const {
      alertId,
      studentId,
      referralType,
      status,
      notes,
      referredTo,
      studentName,
    } = req.body;
    await run(
      "INSERT INTO referrals (alert_id, referred_to, referral_status, student_name, notes) VALUES (?, ?, ?, ?, ?)",
      [
        alertId ?? null,
        referredTo ?? referralType ?? "sumc_counsellor",
        status ?? "pending",
        studentName ?? (studentId ? `Student ${studentId}` : "Anonymous"),
        notes ?? "Created from staff portal",
      ],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Create referral error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Referral Status
app.put("/api/staff/referrals/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const referralId = req.params.id;

    console.log(
      "[PUT /api/staff/referrals/:id] Updating referral:",
      referralId,
      "to status:",
      status,
    );

    const existingReferral = await get(
      "SELECT * FROM referrals WHERE referral_id = ?",
      [referralId],
    );

    if (!existingReferral) {
      return res.status(404).json({ message: "Referral not found" });
    }

    await run(
      "UPDATE referrals SET referral_status = ?, notes = ? WHERE referral_id = ?",
      [status, notes || existingReferral.notes, referralId],
    );

    console.log("[PUT /api/staff/referrals/:id] Success");
    res.json({ success: true, message: "Referral updated successfully" });
  } catch (error) {
    console.error("[PUT /api/staff/referrals/:id] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/followups/:alertId", async (req, res) => {
  try {
    const followups = await all(
      `
      SELECT f.*, s.name AS staff_name
      FROM followups f
      LEFT JOIN staff_accounts s ON f.staff_id = s.staff_id
      WHERE f.alert_id = ?
      ORDER BY f.followup_id DESC
    `,
      [req.params.alertId],
    );
    res.json(followups);
  } catch (error) {
    console.error("Get followups error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/staff/followups", async (req, res) => {
  try {
    const { alertId, alert_id, staffId, staff_id, notes, followup_notes } =
      req.body;
    await run(
      "INSERT INTO followups (alert_id, staff_id, notes) VALUES (?, ?, ?)",
      [
        alertId ?? alert_id ?? null,
        staffId ?? staff_id ?? null,
        notes ?? followup_notes ?? "Follow-up created from staff portal",
      ],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Create followup error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/resources", async (req, res) => {
  try {
    const resources = await all(
      "SELECT * FROM resources ORDER BY resource_id DESC",
      [],
    );
    res.json(resources);
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/staff/messages", async (req, res) => {
  try {
    const { alertId, senderRole, recipient, content } = req.body;
    await run(
      "INSERT INTO messages (alert_id, sender_role, recipient, content) VALUES (?, ?, ?, ?)",
      [alertId, senderRole, recipient, content],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/messages/:alertId", async (req, res) => {
  try {
    const messages = await all(
      "SELECT * FROM messages WHERE alert_id = ? ORDER BY message_id DESC",
      [req.params.alertId],
    );
    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/staff/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const staff = await get("SELECT * FROM staff_accounts WHERE email = ?", [
      email,
    ]);
    if (!staff) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, staff.password_hash || "");
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const staffDatabaseName = await getStaffDatabaseName(staff.staff_id);
    res.json({ ...staff, staff_database_name: staffDatabaseName });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// STAFF CRISIS ALERT ROUTES
// =====================================================

// Get Crisis Alerts (Staff) - Direct from crisis_alerts
app.get("/api/staff/crisis-alerts", async (req, res) => {
  try {
    const alerts = await all(
      `
      SELECT 
        c.alert_id,
        c.created_at,
        c.contact_info,
        c.student_id,
        c.status,
        c.category,
        c.risk_level,
        c.alert_status,
        c.is_anonymous,
        s.display_name AS student_name
      FROM crisis_alerts c
      LEFT JOIN students s ON c.student_id = s.student_id
      ORDER BY c.created_at DESC
    `,
      [],
    );

    console.log(
      "[GET /api/staff/crisis-alerts] Crisis alerts found:",
      alerts.length,
    );
    res.json({ alerts: alerts || [] });
  } catch (error) {
    console.error("[GET /api/staff/crisis-alerts] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Crisis Alert Status (Staff)
app.put("/api/staff/crisis-alerts/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const alertId = req.params.id;

    console.log(
      "[PUT /api/staff/crisis-alerts/:id/status] Updating crisis alert:",
      alertId,
      "to:",
      status,
    );

    // Update crisis_alerts table
    await run("UPDATE crisis_alerts SET alert_status = ? WHERE alert_id = ?", [
      status,
      alertId,
    ]);

    // Also update staff_alerts table
    await run("UPDATE staff_alerts SET alert_status = ? WHERE alert_id = ?", [
      status,
      alertId,
    ]);

    console.log("[PUT /api/staff/crisis-alerts/:id/status] Success");
    res.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/staff/crisis-alerts/:id/status] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// STUDENT ROUTES
// =====================================================

// Student Registration
app.post("/api/student/register", async (req, res) => {
  try {
    const {
      username,
      password,
      display_name,
      department,
      year_of_study,
      email,
      phone,
    } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const existingStudent = await get(
      "SELECT * FROM students WHERE username = ?",
      [username],
    );

    if (existingStudent) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await run(
      `INSERT INTO students 
       (username, password_hash, display_name, department, year_of_study, email, phone, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        display_name || username,
        department || null,
        year_of_study ? parseInt(year_of_study) : null,
        email || null,
        phone || null,
        formatMySQLDate(new Date()),
      ],
    );

    const newStudent = await get("SELECT * FROM students WHERE username = ?", [
      username,
    ]);

    const { password_hash, ...studentData } = newStudent;
    res.json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ message: "Registration service unavailable." });
  }
});

// Student Login
app.post("/api/student/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const student = await get("SELECT * FROM students WHERE username = ?", [
      username,
    ]);

    if (!student) {
      console.log("[Login] Student not found:", username);
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isValid = await bcrypt.compare(password, student.password_hash || "");
    if (!isValid) {
      console.log("[Login] Invalid password for:", username);
      return res.status(401).json({ message: "Invalid username or password." });
    }

    await run("UPDATE students SET last_active = ? WHERE student_id = ?", [
      formatMySQLDate(new Date()),
      student.student_id,
    ]);

    const { password_hash, ...studentData } = student;
    console.log("[Login] Student logged in:", studentData);
    res.json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    console.error("[Login] Student login error:", error);
    res.status(500).json({ message: "Login service unavailable." });
  }
});

// Student Profile Update
app.put("/api/student/profile", async (req, res) => {
  try {
    const {
      student_id,
      display_name,
      username,
      department,
      year_of_study,
      email,
      phone,
    } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    await run(
      `UPDATE students 
       SET display_name = ?, username = ?, department = ?, year_of_study = ?, email = ?, phone = ?
       WHERE student_id = ?`,
      [
        display_name,
        username,
        department,
        year_of_study ? parseInt(year_of_study) : null,
        email,
        phone,
        student_id,
      ],
    );

    const updatedStudent = await get(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id],
    );

    const { password_hash, ...studentData } = updatedStudent;
    res.json({
      success: true,
      student: studentData,
    });
  } catch (error) {
    console.error("Student profile update error:", error);
    res.status(500).json({ message: "Profile update service unavailable." });
  }
});

// Student Logout
app.post("/api/student/logout", async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// STUDENT ASSESSMENT ROUTES
// =====================================================

// Get Student Assessment History
app.get("/api/student/assessments", async (req, res) => {
  try {
    const studentId = req.query.student_id;
    console.log("[GET /api/student/assessments] Student ID:", studentId);

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const history = await all(
      "SELECT * FROM assessments WHERE student_id = ? ORDER BY assessment_date DESC",
      [studentId],
    );

    console.log(
      "[GET /api/student/assessments] Found:",
      history.length,
      "assessments",
    );

    const formattedHistory = history.map((item) => {
      const anxietyScore = item.total_anxiety_score || 0;
      const depressionScore = item.total_depression_score || 0;
      const burnoutScore = item.total_burnout_score || 0;
      const sleepScore = item.total_sleep_score || 0;

      const overallScore = Math.round(
        (anxietyScore + depressionScore + burnoutScore + sleepScore) / 4,
      );

      return {
        id: item.assessment_id,
        student_id: item.student_id,
        student_name: item.student_name || "Student",
        mode: item.mode || "student",
        taken_at: item.completed_at || item.assessment_date,
        overallScore: overallScore,
        categories: [
          {
            name: "Anxiety",
            score: anxietyScore,
            level: getLevel(anxietyScore),
          },
          {
            name: "Depression",
            score: depressionScore,
            level: getLevel(depressionScore),
          },
          {
            name: "Burnout",
            score: burnoutScore,
            level: getLevel(burnoutScore),
          },
          {
            name: "Sleep",
            score: sleepScore,
            level: getLevel(sleepScore),
          },
        ],
        level: item.overall_risk_level || "low",
        advice: item.advice || "",
        recommendations: item.recommendations
          ? JSON.parse(item.recommendations)
          : [],
      };
    });

    res.json({ history: formattedHistory });
  } catch (error) {
    console.error("[GET /api/student/assessments] Error:", error);
    res.status(500).json({ message: "Failed to fetch history." });
  }
});

// Save Assessment Result
app.post("/api/student/assessments", async (req, res) => {
  try {
    const { student_id, result, mode } = req.body;

    console.log("[POST /api/student/assessments] Student ID:", student_id);

    if (!student_id) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const categories = result.categories || [];
    const anxietyScore =
      categories.find((c) => c.name === "Anxiety")?.score || 0;
    const depressionScore =
      categories.find((c) => c.name === "Depression")?.score || 0;
    const burnoutScore =
      categories.find((c) => c.name === "Burnout")?.score || 0;
    const sleepScore = categories.find((c) => c.name === "Sleep")?.score || 0;

    const overallScore = Math.round(
      (anxietyScore + depressionScore + burnoutScore + sleepScore) / 4,
    );

    let riskLevel = "low";
    if (overallScore >= 70) riskLevel = "low";
    else if (overallScore >= 40) riskLevel = "moderate";
    else riskLevel = "high";

    const student = await get(
      "SELECT display_name, username FROM students WHERE student_id = ?",
      [student_id],
    );
    const studentName = student?.display_name || student?.username || "Student";

    const formattedDate = formatMySQLDate(new Date());

    const insertResult = await run(
      `INSERT INTO assessments 
       (student_id, student_name, mode, anonymous_student_id, anonymous_session_token, 
        assessment_status, assessment_date, completed_at,
        total_anxiety_score, total_depression_score, total_burnout_score, total_sleep_score,
        overall_risk_level, crisis_contact_provided) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        studentName,
        mode || "student",
        null,
        null,
        "completed",
        formattedDate,
        formattedDate,
        anxietyScore,
        depressionScore,
        burnoutScore,
        sleepScore,
        riskLevel,
        0,
      ],
    );

    console.log("[POST /api/student/assessments] Insert result:", insertResult);

    res.json({
      success: true,
      entry: {
        id: insertResult.id || insertResult.insertId,
        ...result,
        overallScore: overallScore,
        taken_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[POST /api/student/assessments] Error:", error);
    res.status(500).json({
      message: "Failed to save assessment.",
      error: error.message,
    });
  }
});

// =====================================================
// STUDENT CRISIS ALERT ROUTES (UPDATED)
// =====================================================

// Get Crisis Alerts (Student)
app.get("/api/student/crisis-alerts", async (req, res) => {
  try {
    const studentId = req.query.student_id;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const alerts = await all(
      "SELECT * FROM crisis_alerts WHERE student_id = ? ORDER BY created_at DESC",
      [studentId],
    );

    res.json({ alerts: alerts || [] });
  } catch (error) {
    console.error("Get crisis alerts error:", error);
    res.status(500).json({ message: "Failed to fetch crisis alerts." });
  }
});

// Save Crisis Alert (Student) - Updated to handle anonymous
app.post("/api/student/crisis-alerts", async (req, res) => {
  try {
    const { student_id, contact_info, is_anonymous } = req.body;

    console.log("[Crisis Alert] Received request:", {
      student_id,
      contact_info,
      is_anonymous,
    });

    if (!contact_info) {
      return res.status(400).json({ message: "Contact info is required." });
    }

    const formattedDate = formatMySQLDate(new Date());

    // Get student name if student_id exists
    let studentName = "Anonymous Student";
    let studentIdentifier = `Anonymous ••••• ${contact_info.slice(-4)}`;
    let actualStudentId = student_id || null;

    if (student_id && !is_anonymous) {
      const student = await get(
        "SELECT display_name, username FROM students WHERE student_id = ?",
        [student_id],
      );
      if (student) {
        studentName =
          student.display_name || student.username || "Anonymous Student";
        studentIdentifier = `Student ••••• ${contact_info.slice(-4)}`;
        actualStudentId = student_id;
      }
    }

    // Generate unique alert ID if not provided
    const alertId = `CRISIS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Insert into crisis_alerts table
    await run(
      `INSERT INTO crisis_alerts 
       (alert_id, created_at, contact_info, student_id, status, category, risk_level, alert_status, is_anonymous) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alertId,
        formattedDate,
        contact_info,
        actualStudentId,
        "crisis_contacted",
        "crisis",
        "high",
        "new",
        is_anonymous ? 1 : 0,
      ],
    );

    // Insert into staff_alerts table for staff visibility
    await run(
      `INSERT INTO staff_alerts 
       (alert_id, category, risk_level, alert_status, student_name, student_identifier, created_at, assigned_staff_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alertId,
        "crisis",
        "high",
        "new",
        studentName,
        studentIdentifier,
        formattedDate,
        null,
      ],
    );

    console.log(
      "[Crisis Alert] Crisis alert saved successfully with ID:",
      alertId,
    );
    console.log(
      "[Crisis Alert] Student:",
      studentName,
      "Anonymous:",
      is_anonymous,
    );

    res.json({
      success: true,
      alert: {
        alert_id: alertId,
        created_at: formattedDate,
        contact_info: contact_info,
        student_id: actualStudentId,
        status: "crisis_contacted",
        category: "crisis",
        risk_level: "high",
        alert_status: "new",
        is_anonymous: is_anonymous || false,
        student_name: studentName,
      },
    });
  } catch (error) {
    console.error("[Crisis Alert] ERROR:", error);
    console.error("[Crisis Alert] Stack:", error.stack);
    res.status(500).json({
      message: "Failed to save crisis alert.",
      error: error.message,
    });
  }
});

// Update Crisis Alert Status (Student)
app.put("/api/student/crisis-alerts/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const alertId = req.params.id;

    console.log(
      "[PUT /api/student/crisis-alerts/:id/status] Updating:",
      alertId,
      "to:",
      status,
    );

    // Update crisis_alerts table
    await run("UPDATE crisis_alerts SET alert_status = ? WHERE alert_id = ?", [
      status,
      alertId,
    ]);

    // Also update staff_alerts table
    await run("UPDATE staff_alerts SET alert_status = ? WHERE alert_id = ?", [
      status,
      alertId,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/student/crisis-alerts/:id/status] Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// =====================================================
// START THE SERVER
// =====================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Student login: POST http://localhost:${PORT}/api/student/login`);
  console.log(
    `Student assessments: GET/POST http://localhost:${PORT}/api/student/assessments`,
  );
  console.log(
    `Student crisis alerts: POST http://localhost:${PORT}/api/student/crisis-alerts`,
  );
  console.log(
    `Staff crisis alerts: GET/PUT http://localhost:${PORT}/api/staff/crisis-alerts`,
  );
  console.log(
    `Staff referrals: GET/PUT http://localhost:${PORT}/api/staff/referrals`,
  );
  console.log(`Staff alerts: GET http://localhost:${PORT}/api/staff/alerts`);
});

export default app;
