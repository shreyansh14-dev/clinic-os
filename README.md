# 🏥 ClinicOS — Complete Healthcare Management System

A **full-stack, production-ready** healthcare web application built with Python Flask + SQLite. ClinicOS offers end-to-end digital healthcare: user authentication, doctor discovery, appointment booking, UPI payment (QR-based), video consultations, medicine ordering, vaccination tracking for newborns, and prescription management.

---

## ✨ Features

| Module | What it does |
|---|---|
| 🔐 **Auth** | Register / Login (patient & doctor roles) with secure bcrypt password hashing |
| 🏥 **Dashboard** | Role-specific dashboard — patients see upcoming appointments; doctors see their queue |
| 👨‍⚕️ **Find a Doctor** | Filter by specialization (Cardiology, Neurology, Paediatrics, Dermatology…) |
| 📅 **Book Appointment** | Choose date & time slot; real-time slot availability via database check |
| 💳 **UPI Payment** | Simulated UPI QR code generated per appointment (no real API key needed) |
| 📹 **Video Call** | WebRTC peer-to-peer video consultation unlocked only after payment is confirmed |
| 💊 **Medicine Store** | Browse 18+ medicines, search/filter by category, add to cart, place delivery order |
| 🧾 **Prescriptions** | Doctors issue digital prescriptions; patients can view and download them |
| 👶 **Vaccination Tracker** | Register newborn babies, track full Indian NIS vaccine schedule (BCG → DTP Booster) |
| 👤 **Profile** | Update personal details, blood group, address — all persisted in SQLite |

---

## 🛠️ Tech Stack

- **Backend**: Python 3.12 · Flask 3.x · Flask-CORS · Werkzeug
- **Database**: SQLite (file: clinicos.db) — fully normalized schema, FK-constrained
- **Frontend**: Vanilla HTML/CSS/JS SPA (Single Page Application, no framework)
- **Payments**: UPI QR generation via qrcodejs library (no real API key)
- **Video Call**: WebRTC (browser-native, peer-to-peer)
- **Fonts**: Google Fonts — Inter

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+ installed
- pip package manager

### 2. Install Dependencies
`ash
pip install -r requirements.txt
`

### 3. Run the Server
`ash
python app.py
`

The server starts on **http://localhost:5000**

The database (clinicos.db) is automatically created and seeded with demo data on first run.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Patient | patient@demo.com | Patient@123 |
| 👨‍⚕️ Doctor | obert.chen@clinicos.health | Doctor@123 |
| 🛡️ Admin | dmin@clinicos.health | Admin@123 |

---

## 📋 User Flow

`
Register / Login  →  Dashboard  →  Find Doctor (by Specialty)
        ↓
  Choose Doctor   →  Pick Date & Slot  →  Book Appointment
        ↓
  UPI QR Payment  →  Payment Confirmed  →  Unlock Video Call
        ↓
  Post-call Doctor issues Prescription  →  Patient views Rx
`

**Medicine Order Flow:**
`
Medicine Store → Browse / Search → Add to Cart → Enter Address → Place Order
`

**Vaccination Flow:**
`
Vaccination Module → Register Newborn (name, DOB, weight, parents)
                  → Auto-assigned National Immunization Schedule
                  → Mark vaccines as completed with batch number
`

---

## 📁 Project Structure

`
clinic-os/
├── app.py              # Flask app — all API routes & server logic
├── database.py         # SQLite schema, init, seed data
├── requirements.txt    # Python dependencies
├── clinicos.db         # SQLite database (auto-created on first run)
├── templates/
│   ├── login.html      # Login / Register page (glassmorphism UI)
│   └── app.html        # Main SPA — Dashboard, Booking, Pharmacy, etc.
├── assets/             # Images and static assets
├── css/                # Stylesheets
└── js/                 # Legacy JS files (superseded by SPA)
`

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| users | All users (patients, doctors, admin) with hashed passwords |
| doctors | Doctor profiles — specialty, fee, slots, hospital, ratings |
| ppointments | Bookings with status (pending_payment → confirmed → completed) |
| payments | Payment records — txn ID, method, amount, status |
| prescriptions | Prescriptions issued by doctors with medicine list |
| medicines | 18+ medicine catalog with pricing, stock, manufacturer |
| orders | Medicine delivery orders with cart items as JSON |
| 
ewborns | Newborn registration with full vaccine schedule as JSON |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current session user |

### Doctors & Specialties
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/specialties | List all specialties |
| GET | /api/doctors | List all / filter by ?specialty= |
| GET | /api/doctors/<id> | Doctor profile + available dates |
| GET | /api/doctors/<id>/slots | Available slots for a date |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/appointments | List user's appointments |
| POST | /api/appointments/book | Book a new appointment |
| GET | /api/appointments/<id> | Appointment details |
| PUT | /api/appointments/<id>/status | Update appointment status |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/payments/initiate | Generate UPI QR data |
| POST | /api/payments/confirm | Confirm payment (updates DB) |

### Medicines & Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/medicines | List medicines (filter: ?category= ?q=) |
| GET | /api/medicine-categories | Distinct categories |
| GET | /api/orders | Patient's order history |
| POST | /api/orders | Place a medicine order |

### Prescriptions & Vaccination
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/prescriptions | Get prescriptions (role-aware) |
| POST | /api/prescriptions | Doctor issues prescription |
| GET | /api/newborns | Parent's registered newborns |
| POST | /api/newborns | Register a new baby |
| PUT | /api/newborns/<id>/vaccine | Mark a vaccine as administered |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| PUT | /api/profile | Update user profile |

---

## 🔒 Security Notes

- Passwords are hashed with **Werkzeug's** generate_password_hash (pbkdf2:sha256)
- Sessions use a server-side secret key with **Flask sessions** (HTTP-only cookie)
- @login_required decorator protects all sensitive routes
- Foreign key constraints enforced via SQLite PRAGMA foreign_keys = ON

---

## 📸 Application Screens

- **Login** — Glassmorphism login/register with role selection (Patient / Doctor)
- **Dashboard** — Stats cards, upcoming appointments, quick actions
- **Find Doctor** — Specialty grid → Doctor cards → Slot picker calendar
- **Payment** — QR code modal with UPI payment simulation
- **Video Call** — WebRTC video grid (unlocks post payment only)
- **Pharmacy** — Medicine grid with category filters and cart sidebar
- **Vaccination** — Newborn registration form + colour-coded vaccine schedule table
- **Profile** — Editable user profile with blood group and health info

---

## 📝 Notes

- **Video Call**: Uses WebRTC via the browser's native APIs. For a production deployment, integrate a TURN/STUN server (e.g., Twilio or Metered).
- **Payments**: The UPI QR is fully simulated — no money moves. For real payments, integrate Razorpay / PayU with their respective API keys.
- **Database**: The SQLite clinicos.db file is created in the project root. For production, migrate to PostgreSQL or MySQL.

---

## 📄 License

MIT License — Free to use, modify and distribute.

---

*Built with ❤️ — ClinicOS Healthcare Management Platform*
