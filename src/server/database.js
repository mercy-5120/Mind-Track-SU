import fs from "fs";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "..", "mindtracksu.db");
const schemaPath = path.join(__dirname, "..", "db.sql");

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open database", err.message);
    return;
  }

  console.log("Connected to SQLite database");
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

const initializeSchema = async () => {
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  await new Promise((resolve, reject) => {
    db.exec(schemaSql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

initializeSchema().catch((err) => console.error("Schema init failed", err));

export { db, run, get, all };
