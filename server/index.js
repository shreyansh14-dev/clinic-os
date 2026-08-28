import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { runQuery, getQuery, allQuery } from './db.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize & seed DB on server launch
seedDatabase().catch(err => console.error('Failed to seed database:', err));

// =============================
// AUTH & USERS API
// =============================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role, age } = req.body;
    let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    let params = [email, password];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    const user = await getQuery(sql, params);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
    }

    const userAge = age ? parseInt(age) : (user.age || (role === 'patient' ? 29 : null));

    // Return token & user payload
    const token = `token-${user.id}-${Date.now()}`;
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: userAge,
      phone: user.phone,
      specialty: user.specialty,
      department: user.department,
      avatar: user.avatar
    };

    // Update patient table age if patient
    if (user.role === 'patient' && userAge) {
      await runQuery('UPDATE patients SET age = ? WHERE email = ?', [userAge, user.email]).catch(() => {});
    }

    // Log login action
    await runQuery(
      `INSERT INTO audit_logs (id, timestamp, user, action, level, ip) VALUES (?, ?, ?, ?, ?, ?)`,
      [`log-${Date.now()}`, new Date().toISOString().replace('T', ' ').substring(0, 19), `${user.name} (${user.role.toUpperCase()})`, `Logged in (Age: ${userAge || 'N/A'})`, 'INFO', req.ip || '127.0.0.1']
    );

    res.json({ success: true, token, user: userPayload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, department, age } = req.body;
    const existing = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const id = `usr-${role.substring(0, 3)}-${Date.now()}`;
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const createdAt = new Date().toISOString();
    const parsedAge = age ? parseInt(age) : (role === 'patient' ? 29 : null);

    await runQuery(
      `INSERT INTO users (id, name, email, password, role, phone, specialty, department, avatar, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, password, role || 'patient', phone || '', specialty || '', department || '', avatar, createdAt]
    );

    // If registering as a patient, also create in patients table with age
    if (role === 'patient' || !role) {
      await runQuery(
        `INSERT INTO patients (id, name, age, gender, bloodGroup, phone, email, address, emergencyContact, insuranceId, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [`pat-${Date.now()}`, name, parsedAge || 29, 'Other', 'O+', phone || '', email, 'India', 'Primary Contact', 'INS-NEW', avatar]
      );
    }

    const token = `token-${id}-${Date.now()}`;
    const userPayload = { id, name, email, role: role || 'patient', age: parsedAge, phone, avatar };

    res.json({ success: true, token, user: userPayload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await allQuery('SELECT id, name, email, role, phone, specialty, department, avatar FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================
// CORE CLINICAL DATA ENDPOINTS
// =============================
app.get('/api/departments', async (req, res) => {
  const data = await allQuery('SELECT * FROM departments');
  res.json(data);
});

app.get('/api/doctors', async (req, res) => {
  const data = await allQuery('SELECT * FROM doctors');
  res.json(data);
});

app.post('/api/doctors', async (req, res) => {
  try {
    const d = req.body;
    const id = `doc-${Date.now()}`;
    await runQuery(
      `INSERT INTO doctors (id, name, specialty, department, rating, experience, phone, email, availableDays, consultationFee, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, d.name, d.specialty, d.department, d.rating || 5.0, d.experience || '5+ Years', d.phone, d.email, d.availableDays || 'Mon - Fri', d.consultationFee || 2000, d.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80']
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients', async (req, res) => {
  const data = await allQuery('SELECT * FROM patients');
  res.json(data);
});

// Appointments
app.get('/api/appointments', async (req, res) => {
  const data = await allQuery('SELECT * FROM appointments ORDER BY date DESC, time DESC');
  res.json(data);
});

app.post('/api/appointments', async (req, res) => {
  try {
    const a = req.body;
    const id = `apt-${Date.now()}`;
    await runQuery(
      `INSERT INTO appointments (id, patientId, patientName, doctorId, doctorName, department, date, time, type, status, paid, fee, symptoms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, a.patientId, a.patientName, a.doctorId, a.doctorName, a.department || 'General Medicine', a.date, a.time, a.type || 'In-Person', 'Scheduled', a.paid ? 1 : 0, a.fee || 1500, a.symptoms || '']
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { status, paid } = req.body;
    let sql = 'UPDATE appointments SET ';
    let params = [];
    if (status !== undefined) {
      sql += 'status = ?, ';
      params.push(status);
    }
    if (paid !== undefined) {
      sql += 'paid = ?, ';
      params.push(paid ? 1 : 0);
    }
    sql = sql.slice(0, -2) + ' WHERE id = ?';
    params.push(req.params.id);

    await runQuery(sql, params);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prescriptions
app.get('/api/prescriptions', async (req, res) => {
  const rows = await allQuery('SELECT * FROM prescriptions ORDER BY date DESC');
  const parsed = rows.map(r => ({
    ...r,
    medications: typeof r.medications === 'string' ? JSON.parse(r.medications) : r.medications
  }));
  res.json(parsed);
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const r = req.body;
    const id = `rx-${Date.now()}`;
    const medsJson = JSON.stringify(r.medications || []);
    await runQuery(
      `INSERT INTO prescriptions (id, doctorId, doctorName, patientId, patientName, date, diagnosis, icdCode, medications, instructions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, r.doctorId, r.doctorName, r.patientId, r.patientName, r.date || new Date().toISOString().substring(0, 10), r.diagnosis, r.icdCode || '', medsJson, r.instructions || '', 'Issued']
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lab Tests
app.get('/api/lab-tests', async (req, res) => {
  const rows = await allQuery('SELECT * FROM lab_tests ORDER BY orderDate DESC');
  const parsed = rows.map(r => ({
    ...r,
    reportData: r.reportData && typeof r.reportData === 'string' ? JSON.parse(r.reportData) : r.reportData
  }));
  res.json(parsed);
});

app.post('/api/lab-tests', async (req, res) => {
  try {
    const l = req.body;
    const id = `lab-${Date.now()}`;
    await runQuery(
      `INSERT INTO lab_tests (id, code, name, category, patientId, patientName, orderedBy, orderDate, status, price, reportData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, l.code || 'TEST-GEN', l.name, l.category || 'General', l.patientId, l.patientName, l.orderedBy || 'Doctor', new Date().toISOString().substring(0, 10), 'Pending', l.price || 1000, null]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/lab-tests/:id', async (req, res) => {
  try {
    const { status, reportData } = req.body;
    const reportJson = reportData ? JSON.stringify(reportData) : null;
    await runQuery(
      'UPDATE lab_tests SET status = ?, reportData = ? WHERE id = ?',
      [status || 'Completed', reportJson, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bills
app.get('/api/bills', async (req, res) => {
  const rows = await allQuery('SELECT * FROM bills ORDER BY issueDate DESC');
  const parsed = rows.map(r => ({
    ...r,
    items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items
  }));
  res.json(parsed);
});

app.patch('/api/bills/:id/pay', async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const txn = transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    await runQuery(
      'UPDATE bills SET status = "Paid", paymentMethod = ?, transactionId = ? WHERE id = ?',
      [paymentMethod || 'Credit Card', txn, req.params.id]
    );
    res.json({ success: true, transactionId: txn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vitals
app.get('/api/vitals', async (req, res) => {
  const rows = await allQuery('SELECT * FROM vitals ORDER BY date DESC');
  res.json(rows);
});

app.post('/api/vitals', async (req, res) => {
  try {
    const v = req.body;
    const id = `v-${Date.now()}`;
    await runQuery(
      `INSERT INTO vitals (id, patientId, date, heartRate, bpSystolic, bpDiastolic, spo2, glucose, temp, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, v.patientId || 'pat-101', v.date || new Date().toISOString().substring(0, 10), v.heartRate || 72, v.bpSystolic || 120, v.bpDiastolic || 80, v.spo2 || 98, v.glucose || 100, v.temp || 98.6, v.weight || 70]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Beds
app.get('/api/beds', async (req, res) => {
  const rows = await allQuery('SELECT * FROM beds');
  res.json(rows);
});

app.patch('/api/beds/:id', async (req, res) => {
  try {
    const { status, patientId, patientName } = req.body;
    await runQuery(
      'UPDATE beds SET status = ?, patientId = ?, patientName = ? WHERE id = ?',
      [status, patientId || null, patientName || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pharmacy Inventory
app.get('/api/pharmacy/inventory', async (req, res) => {
  const rows = await allQuery('SELECT * FROM pharmacy_inventory');
  res.json(rows);
});

app.post('/api/pharmacy/inventory', async (req, res) => {
  try {
    const p = req.body;
    const id = `ph-${Date.now()}`;
    await runQuery(
      `INSERT INTO pharmacy_inventory (id, name, category, stock, unit, price, expiryDate, batchNo, reorderLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, p.name, p.category, p.stock || 100, p.unit || 'Tablets', p.price || 50, p.expiryDate || '2027-12-31', p.batchNo || `BAT-${Date.now()}`, p.reorderLevel || 30]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insurance Claims
app.get('/api/insurance/claims', async (req, res) => {
  const rows = await allQuery('SELECT * FROM insurance_claims ORDER BY dateSubmitted DESC');
  res.json(rows);
});

app.post('/api/insurance/claims', async (req, res) => {
  try {
    const c = req.body;
    const id = `clm-${Date.now()}`;
    await runQuery(
      `INSERT INTO insurance_claims (id, patientId, patientName, policyNumber, tpaProvider, claimAmount, preApprovedAmount, status, dateSubmitted, diagnosis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, c.patientId || 'pat-101', c.patientName || 'Shreyansh Kumar', c.policyNumber || 'POL-999', c.tpaProvider || 'Star Health', c.claimAmount || 5000, 0, 'Under Review', new Date().toISOString().substring(0, 10), c.diagnosis || 'General Treatment']
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Logs
app.get('/api/audit-logs', async (req, res) => {
  const rows = await allQuery('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
  res.json(rows);
});

app.post('/api/audit-logs', async (req, res) => {
  try {
    const l = req.body;
    const id = `log-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await runQuery(
      `INSERT INTO audit_logs (id, timestamp, user, action, level, ip) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, timestamp, l.user || 'System', l.action, l.level || 'INFO', req.ip || '127.0.0.1']
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Blood Bank & Ambulance Fleet
app.get('/api/blood-bank', async (req, res) => {
  const rows = await allQuery('SELECT * FROM blood_bank');
  res.json(rows);
});

app.get('/api/ambulance-fleet', async (req, res) => {
  const rows = await allQuery('SELECT * FROM ambulance_fleet');
  res.json(rows);
});

// =============================
// TELEHEALTH WEBRTC SIGNALING API
// =============================
let activeCallState = null;
let callCandidates = [];

app.get('/api/telehealth/active-call', (req, res) => {
  res.json({ activeCall: activeCallState, candidates: callCandidates });
});

app.post('/api/telehealth/call', (req, res) => {
  activeCallState = {
    id: `call-${Date.now()}`,
    callerId: req.body.callerId || 'pat-101',
    callerName: req.body.callerName || 'Shreyansh Kumar',
    doctorId: req.body.doctorId || 'doc-1',
    offer: req.body.offer || null,
    status: 'calling',
    timestamp: new Date().toISOString()
  };
  callCandidates = [];
  res.json({ success: true, activeCall: activeCallState });
});

app.post('/api/telehealth/answer', (req, res) => {
  if (activeCallState) {
    activeCallState.answer = req.body.answer || null;
    activeCallState.status = 'connected';
  }
  res.json({ success: true, activeCall: activeCallState });
});

app.post('/api/telehealth/ice-candidate', (req, res) => {
  if (req.body.candidate) {
    callCandidates.push(req.body.candidate);
  }
  res.json({ success: true });
});

app.post('/api/telehealth/hangup', (req, res) => {
  activeCallState = null;
  callCandidates = [];
  res.json({ success: true });
});

// Health Check for Render zero-downtime health monitors
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// =============================
// SERVE PRODUCTION FRONTEND (DIST)
// =============================
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback for client-side routing (React Router) - Express 5 compatible
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ClinicOS Express Server running on port ${PORT}`);
});
