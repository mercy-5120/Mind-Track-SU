import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'mindtracksu.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database', err.message);
    return;
  }

  console.log('Connected to SQLite database');
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ id: this.lastID, changes: this.changes });
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const initializeSchema = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS staff_accounts (
      staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      assigned_group TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS staff_alerts (
      alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id INTEGER,
      category TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      alert_status TEXT DEFAULT 'new',
      assigned_staff_id INTEGER,
      student_name TEXT,
      student_identifier TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT,
      FOREIGN KEY(assigned_staff_id) REFERENCES staff_accounts(staff_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS referrals (
      referral_id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id INTEGER,
      referred_to TEXT NOT NULL,
      referral_status TEXT DEFAULT 'pending',
      student_name TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      FOREIGN KEY(alert_id) REFERENCES staff_alerts(alert_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS followups (
      followup_id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id INTEGER,
      staff_id INTEGER,
      notes TEXT NOT NULL,
      followup_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(alert_id) REFERENCES staff_alerts(alert_id),
      FOREIGN KEY(staff_id) REFERENCES staff_accounts(staff_id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS messages (
      message_id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id INTEGER,
      sender_role TEXT NOT NULL,
      recipient TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS resources (
      resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT,
      link TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    INSERT OR IGNORE INTO staff_accounts (staff_id, email, name, role, assigned_group) VALUES
      (1, 'sumc@strathmore.ac.ke', 'Jane Doe', 'sumc_counsellor', 'SUMC'),
      (2, 'peer@strathmore.ac.ke', 'Alex Kim', 'peer_counsellor', 'Peer Support')
  `);

  await run(`
    INSERT OR IGNORE INTO staff_alerts (alert_id, assessment_id, category, risk_level, alert_status, assigned_staff_id, student_name, student_identifier, created_at) VALUES
      (1, 101, 'depression', 'high', 'new', 1, 'Student A', '•••••7890', '2026-06-16 09:00:00'),
      (2, 102, 'anxiety', 'high', 'pending', 2, 'Student B', '•••••4512', '2026-06-15 11:30:00'),
      (3, 103, 'burnout', 'moderate', 'resolved', 2, 'Student C', '•••••3321', '2026-06-14 16:00:00')
  `);

  await run(`
    INSERT OR IGNORE INTO referrals (referral_id, alert_id, referred_to, referral_status, student_name, notes, created_at) VALUES
      (1, 1, 'sumc_counsellor', 'pending', 'Student A', 'Need supervised counseling follow-up', '2026-06-16 10:00:00'),
      (2, 2, 'peer_counsellor', 'accepted', 'Student B', 'Peer support assigned', '2026-06-15 12:00:00')
  `);

  await run(`
    INSERT OR IGNORE INTO resources (resource_id, title, description, type, link) VALUES
      (1, 'Crisis line guide', 'Immediate support and escalation procedures', 'guide', '/resources'),
      (2, 'Peer support training', 'Training materials for peer counsellors', 'training', '/resources'),
      (3, 'Confidentiality policy', 'How to maintain student privacy', 'policy', '/resources')
  `);
};

initializeSchema().catch((err) => console.error('Schema init failed', err));

export { db, run, get, all };