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

const getRequestedStaffId = (req) => {
  const rawStaffId =
    req.query.staffId ??
    req.body?.staffId ??
    req.body?.staff_id ??
    req.params.staffId;
  return rawStaffId ? Number(rawStaffId) : null;
};

app.get("/api/staff/alerts", async (req, res) => {
  try {
    const alerts = await all(
      `
      SELECT a.alert_id, a.category, a.risk_level, a.alert_status, a.student_name, a.student_identifier, a.created_at,
             s.name AS assigned_staff_name, s.role AS assigned_staff_role
      FROM staff_alerts a
      LEFT JOIN staff_accounts s ON a.assigned_staff_id = s.staff_id
      ORDER BY a.alert_id DESC
    `,
      [],
      { staffId: getRequestedStaffId(req) },
    );
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/alerts/:id", async (req, res) => {
  try {
    const alert = await get(
      `
      SELECT a.*, s.name AS assigned_staff_name, s.role AS assigned_staff_role
      FROM staff_alerts a
      LEFT JOIN staff_accounts s ON a.assigned_staff_id = s.staff_id
      WHERE a.alert_id = ?
    `,
      [req.params.id],
      { staffId: getRequestedStaffId(req) },
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/staff/alerts/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await run(
      "UPDATE staff_alerts SET alert_status = ? WHERE alert_id = ?",
      [status, req.params.id],
      { staffId: getRequestedStaffId(req) },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
      { staffId: getRequestedStaffId(req) },
    );
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
      { staffId: getRequestedStaffId(req) },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/staff/referrals/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    await run(
      "UPDATE referrals SET referral_status = ?, notes = ? WHERE referral_id = ?",
      [status, notes, req.params.id],
      { staffId: getRequestedStaffId(req) },
    );
    res.json({ success: true });
  } catch (error) {
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
      { staffId: getRequestedStaffId(req) },
    );
    res.json(followups);
  } catch (error) {
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
      { staffId: getRequestedStaffId(req) },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/resources", async (req, res) => {
  try {
    const resources = await all(
      "SELECT * FROM resources ORDER BY resource_id DESC",
      [],
      { staffId: getRequestedStaffId(req) },
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/staff/messages", async (req, res) => {
  try {
    const { alertId, senderRole, recipient, content } = req.body;
    await run(
      "INSERT INTO messages (alert_id, sender_role, recipient, content) VALUES (?, ?, ?, ?)",
      [alertId, senderRole, recipient, content],
      { staffId: getRequestedStaffId(req) },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/staff/messages/:alertId", async (req, res) => {
  try {
    const messages = await all(
      "SELECT * FROM messages WHERE alert_id = ? ORDER BY message_id DESC",
      [req.params.alertId],
      { staffId: getRequestedStaffId(req) },
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/staff/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const staff = await get("SELECT * FROM staff_accounts WHERE email = ?", [email]);
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
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/student/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Query using the 'username' column
    const student = await get(
      "SELECT * FROM students WHERE username = ?",
      [username]
    );
    
    if (!student) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, student.password_hash || "");
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Return student data (excluding password)
    const { password_hash, ...studentData } = student;
    res.json({ 
      success: true, 
      student: studentData 
    });
    
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: "Login service unavailable." });
  }
});