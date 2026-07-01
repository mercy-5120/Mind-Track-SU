import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "..", "db.sql");

const dbName =
  process.env.MYSQL_DATABASE || process.env.DB_NAME || "mindtracksu";
const dbConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
  multipleStatements: true,
};

let initialized = false;

const buildStaffDatabaseName = (staffId) => `mindtracksu_staff_${staffId}`;

const initializeSchema = async () => {
  if (initialized) return;

  const bootstrap = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  try {
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  } finally {
    await bootstrap.end();
  }

  const connection = await mysql.createConnection({
    ...dbConfig,
    database: dbName,
  });

  try {
    const schemaSql = fs
      .readFileSync(schemaPath, "utf8")
      .replace(
        /CREATE DATABASE (?!IF NOT EXISTS)/gi,
        "CREATE DATABASE IF NOT EXISTS ",
      )
      .replace(
        /CREATE TABLE (?!IF NOT EXISTS)/gi,
        "CREATE TABLE IF NOT EXISTS ",
      )
      .replace(/INSERT INTO /gi, "INSERT IGNORE INTO ");

    await connection.query(schemaSql);
    await ensureStaffDatabases(connection);
  } finally {
    await connection.end();
  }

  initialized = true;
};

const ensureStaffDatabases = async (connection) => {
  const [staffRows] = await connection.query(
    "SELECT staff_id FROM staff_accounts",
  );

  for (const staff of staffRows) {
    const databaseName = buildStaffDatabaseName(staff.staff_id);
    await createStaffDatabase(databaseName);
    await connection.query(
      "INSERT INTO staff_database_registry (staff_id, database_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE database_name = VALUES(database_name)",
      [staff.staff_id, databaseName],
    );
  }
};

const createStaffDatabase = async (databaseName) => {
  const bootstrap = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  try {
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  } finally {
    await bootstrap.end();
  }

  const staffConnection = await mysql.createConnection({
    ...dbConfig,
    database: databaseName,
  });

  try {
    await staffConnection.query(`
      CREATE TABLE IF NOT EXISTS staff_alerts (
        alert_id INT PRIMARY KEY AUTO_INCREMENT,
        assessment_id INT,
        category VARCHAR(255) NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        alert_status ENUM('new', 'pending', 'resolved', 'closed') DEFAULT 'new',
        student_name VARCHAR(255),
        student_identifier VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS referrals (
        referral_id INT PRIMARY KEY AUTO_INCREMENT,
        alert_id INT,
        referred_to VARCHAR(255) NOT NULL,
        referral_status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
        student_name VARCHAR(255),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS followups (
        followup_id INT PRIMARY KEY AUTO_INCREMENT,
        alert_id INT,
        staff_id INT,
        notes TEXT NOT NULL,
        followup_date DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS messages (
        message_id INT PRIMARY KEY AUTO_INCREMENT,
        alert_id INT,
        sender_role VARCHAR(255) NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } finally {
    await staffConnection.end();
  }
};

const getConnection = async (staffId = null) => {
  await initializeSchema();

  if (staffId) {
    const databaseName = await getStaffDatabaseName(staffId);
    return mysql.createConnection({
      ...dbConfig,
      database: databaseName,
    });
  }

  return mysql.createConnection({
    ...dbConfig,
    database: dbName,
  });
};

const getStaffDatabaseName = async (staffId) => {
  await initializeSchema();

  const connection = await mysql.createConnection({
    ...dbConfig,
    database: dbName,
  });

  try {
    const [rows] = await connection.query(
      "SELECT database_name FROM staff_database_registry WHERE staff_id = ?",
      [staffId],
    );

    if (rows[0]?.database_name) {
      return rows[0].database_name;
    }

    const databaseName = buildStaffDatabaseName(staffId);
    await createStaffDatabase(databaseName);
    await connection.query(
      "INSERT INTO staff_database_registry (staff_id, database_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE database_name = VALUES(database_name)",
      [staffId, databaseName],
    );

    return databaseName;
  } finally {
    await connection.end();
  }
};

const all = async (sql, params = [], options = {}) => {
  const connection = await getConnection(options.staffId ?? null);
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
};

const get = async (sql, params = [], options = {}) => {
  const connection = await getConnection(options.staffId ?? null);
  try {
    const [rows] = await connection.execute(sql, params);
    return rows[0] ?? null;
  } finally {
    await connection.end();
  }
};

const run = async (sql, params = [], options = {}) => {
  const connection = await getConnection(options.staffId ?? null);
  try {
    const [result] = await connection.execute(sql, params);
    return { id: result.insertId ?? null, changes: result.affectedRows ?? 0 };
  } finally {
    await connection.end();
  }
};

initializeSchema().catch((err) =>
  console.error("MySQL schema initialization failed", err),
);

export { dbName, getStaffDatabaseName, run, get, all };
