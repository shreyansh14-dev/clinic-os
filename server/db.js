import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'clinic.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new sqlite3.Database(dbPath);

// Helper for promise-based db operations
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const initTables = async () => {
  db.serialize(async () => {
    // Users table for Real Auth
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        specialty TEXT,
        department TEXT,
        avatar TEXT,
        createdAt TEXT
      )
    `);

    // Departments
    await runQuery(`
      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        doctorCount INTEGER,
        description TEXT,
        fee INTEGER
      )
    `);

    // Doctors
    await runQuery(`
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        deptId TEXT NOT NULL,
        department TEXT,
        rating REAL,
        experience TEXT,
        phone TEXT,
        email TEXT,
        availableDays TEXT,
        availability TEXT,
        fee INTEGER,
        consultationFee INTEGER,
        avatar TEXT
      )
    `);

    // Patients
    await runQuery(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        bloodGroup TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        emergencyContact TEXT,
        insuranceId TEXT,
        avatar TEXT
      )
    `);

    // Appointments
    await runQuery(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        patientName TEXT,
        doctorId TEXT NOT NULL,
        doctorName TEXT NOT NULL,
        specialty TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL,
        reason TEXT,
        fee INTEGER
      )
    `);

    // Lab Tests
    await runQuery(`
      CREATE TABLE IF NOT EXISTS lab_tests (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        orderDate TEXT NOT NULL,
        status TEXT NOT NULL,
        result TEXT,
        price INTEGER
      )
    `);

    // Bills
    await runQuery(`
      CREATE TABLE IF NOT EXISTS bills (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        issueDate TEXT NOT NULL,
        department TEXT,
        totalAmount INTEGER NOT NULL,
        status TEXT NOT NULL
      )
    `);

    // Active Telehealth Video Call Signaling Session
    await runQuery(`
      CREATE TABLE IF NOT EXISTS active_call (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        callerId TEXT,
        callerName TEXT,
        doctorId TEXT,
        doctorName TEXT,
        symptoms TEXT,
        invoiceId TEXT,
        offer TEXT,
        answer TEXT,
        status TEXT,
        createdAt TEXT
      )
    `);

    // ICE Candidates queue
    await runQuery(`
      CREATE TABLE IF NOT EXISTS ice_candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate TEXT,
        createdAt TEXT
      )
    `);

    console.log('Database tables initialized.');
  });
};

export default db;
