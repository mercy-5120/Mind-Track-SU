import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (two levels up)
dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

// Schema path - looks for db.sql in project root
const schemaPath = path.join(__dirname, "..", "..", "db.sql");

// console.log(" Loading .env from:", path.join(__dirname, "..", "..", ".env"));
// console.log(" Looking for db.sql at:", schemaPath);
// console.log(" db.sql exists?", fs.existsSync(schemaPath));

const dbName =
  process.env.MYSQL_DATABASE || process.env.DB_NAME || "mindtracksu";
const dbConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
  multipleStatements: true,
};

//console.log(" Database config:");
// console.log("  Host:", dbConfig.host);
// console.log("  Port:", dbConfig.port);
// console.log("  User:", dbConfig.user);
// console.log("  Password:", dbConfig.password ? "(set)" : " (empty)");
// console.log("  Database:", dbName);

let initialized = false;

const buildStaffDatabaseName = (staffId) => `mindtracksu_staff_${staffId}`;

const initializeSchema = async () => {
  if (initialized) return;

  // console.log("Initializing database schema...");

  const bootstrap = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  try {
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    // console.log(`Database '${dbName}' created or already exists`);
  } finally {
    await bootstrap.end();
  }

  const connection = await mysql.createConnection({
    ...dbConfig,
    database: dbName,
  });

  try {
    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      console.warn(
        // `Schema file not found at ${schemaPath}, skipping schema initialization`,
      );
      initialized = true;
      return;
    }

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

    // Split into individual statements
    const statements = schemaSql
      .split(";")
      .filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        // Ignore errors about duplicate tables/rows
        if (
          !err.message.includes("already exists") &&
          !err.message.includes("Duplicate") &&
          !err.message.includes("IGNORE")
        ) {
          console.warn("SQL Warning:", err.message);
        }
      }
    }

    // console.log("Database tables created successfully");

    // Ensure demo student exists with proper password
    await ensureDemoStudent(connection);

    // Create staff databases if staff accounts exist
    await ensureStaffDatabases(connection);
  } catch (error) {
    console.error("Schema initialization error:", error.message);
  } finally {
    await connection.end();
  }

  initialized = true;
};

const ensureDemoStudent = async (connection) => {
  try {
    const [existingStudent] = await connection.query(
      "SELECT * FROM students WHERE username = ?",
      ["demo"],
    );

    if (existingStudent.length === 0) {
      // Import bcrypt and hash password
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash("demo123", 10);

      await connection.query(
        `INSERT INTO students 
         (username, password_hash, display_name, department, year_of_study, email, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "demo",
          hashedPassword,
          "Demo Student",
          "Computer Science",
          2,
          "demo@student.edu",
          "1234567890",
          new Date().toISOString(),
        ],
      );
      console.log("Demo student created: demo / demo123");
    } else {
      console.log("Demo student already exists");
    }

    // Show students
    const [students] = await connection.query(
      "SELECT student_id, username, display_name, department, email FROM students",
    );
    console.log("Current students:");
    console.table(students);
  } catch (error) {
    console.warn("Demo student creation warning:", error.message);
  }
};

const ensureStaffDatabases = async (connection) => {
  try {
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
  } catch (error) {
    // Staff accounts table might not exist yet, that's fine
    console.warn("⚠️ Staff database setup warning:", error.message);
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
