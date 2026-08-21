"""
ClinicOS - Database Initialization & Schema
SQLite backend for real user auth, appointments, payments, medicines, orders, vaccinations
"""
import sqlite3
import json
from werkzeug.security import generate_password_hash

DB_PATH = 'clinicos.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'patient',
            phone TEXT,
            avatar_url TEXT DEFAULT '',
            dob TEXT DEFAULT '',
            address TEXT DEFAULT '',
            blood_group TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            specialty TEXT NOT NULL,
            fee INTEGER DEFAULT 499,
            experience TEXT DEFAULT '5 years',
            rating REAL DEFAULT 4.5,
            reviews_count INTEGER DEFAULT 0,
            bio TEXT DEFAULT '',
            education TEXT DEFAULT '',
            hospital TEXT DEFAULT 'ClinicOS Central Hospital',
            available_days TEXT DEFAULT '["Mon","Tue","Wed","Thu","Fri"]',
            slots TEXT DEFAULT '["09:00 AM","10:30 AM","12:00 PM","02:00 PM","04:00 PM","05:30 PM"]',
            is_active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER REFERENCES users(id),
            doctor_id INTEGER REFERENCES doctors(id),
            appt_date TEXT,
            slot TEXT,
            status TEXT DEFAULT 'pending_payment',
            payment_status TEXT DEFAULT 'pending',
            payment_id INTEGER,
            reason TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            call_room TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER REFERENCES appointments(id),
            patient_id INTEGER REFERENCES users(id),
            amount REAL,
            method TEXT,
            txn_id TEXT UNIQUE,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS prescriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER REFERENCES appointments(id),
            doctor_id INTEGER REFERENCES doctors(id),
            patient_id INTEGER REFERENCES users(id),
            diagnosis TEXT DEFAULT '',
            medicines_json TEXT DEFAULT '[]',
            advice TEXT DEFAULT '',
            follow_up TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            generic_name TEXT DEFAULT '',
            category TEXT DEFAULT 'General',
            price REAL DEFAULT 0,
            mrp REAL DEFAULT 0,
            stock INTEGER DEFAULT 100,
            description TEXT DEFAULT '',
            manufacturer TEXT DEFAULT '',
            requires_rx INTEGER DEFAULT 0,
            image_emoji TEXT DEFAULT '💊'
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER REFERENCES users(id),
            items_json TEXT DEFAULT '[]',
            subtotal REAL DEFAULT 0,
            delivery_fee REAL DEFAULT 49,
            total REAL DEFAULT 0,
            status TEXT DEFAULT 'placed',
            address TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            txn_id TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS newborns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_id INTEGER REFERENCES users(id),
            baby_name TEXT DEFAULT '',
            dob TEXT DEFAULT '',
            gender TEXT DEFAULT '',
            birth_weight TEXT DEFAULT '',
            blood_group TEXT DEFAULT '',
            mother_name TEXT DEFAULT '',
            father_name TEXT DEFAULT '',
            delivery_place TEXT DEFAULT '',
            address TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            vaccines_json TEXT DEFAULT '[]',
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );
    ''')

    conn.commit()
    _seed(conn)
    conn.close()
    print("[DB] ClinicOS database initialized OK")

DEFAULT_VACCINE_SCHEDULE = [
    {"name": "BCG (Tuberculosis)", "ageDue": "At Birth", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "OPV-0 (Oral Polio Zero Dose)", "ageDue": "At Birth", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Hepatitis B (Birth Dose)", "ageDue": "At Birth", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Pentavalent-1 (DTP-HepB-Hib)", "ageDue": "6 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Rotavirus-1", "ageDue": "6 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "IPV-1 (Injectable Polio)", "ageDue": "6 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "PCV-1 (Pneumococcal)", "ageDue": "6 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Pentavalent-2", "ageDue": "10 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Rotavirus-2", "ageDue": "10 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Pentavalent-3", "ageDue": "14 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Rotavirus-3", "ageDue": "14 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "IPV-2", "ageDue": "14 Weeks", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "MR-1 / MMR-1 (Measles-Rubella)", "ageDue": "9 Months", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "Vitamin A Dose-1", "ageDue": "9 Months", "status": "Pending", "date": "", "batchNo": ""},
    {"name": "DTP Booster-1", "ageDue": "16-24 Months", "status": "Pending", "date": "", "batchNo": ""},
]

def _seed(conn):
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM users")
    if c.fetchone()[0] > 0:
        return  # already seeded

    print("[DB] Seeding initial data...")

    # Admin
    c.execute("INSERT INTO users (name,email,password_hash,role,phone) VALUES (?,?,?,?,?)",
              ('Admin ClinicOS','admin@clinicos.health',generate_password_hash('Admin@123'),'admin','+91 98000 00001'))

    # Doctors
    docs = [
        ('Dr. Robert Chen','robert.chen@clinicos.health','Doctor@123','+91 98001 11001',
         'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
         'Cardiology',799,'14 years',4.9,142,
         'Board-certified cardiologist specializing in interventional cardiology and cardiac arrhythmias.',
         'Harvard Medical School (MD), Stanford Cardiology Fellowship','ClinicOS Heart & Specialty Center'),
        ('Dr. Sarah Mitchell','sarah.mitchell@clinicos.health','Doctor@123','+91 98001 11002',
         'https://images.unsplash.com/photo-1594824813589-3543d8a9e224?auto=format&fit=crop&w=200&q=80',
         'Neurology',899,'11 years',4.85,98,
         'Leading researcher in neurodegenerative disorders and chronic migraine treatment.',
         'Johns Hopkins University (MD, PhD)','ClinicOS Medical Pavilion'),
        ('Dr. Marcus Vance','marcus.vance@clinicos.health','Doctor@123','+91 98001 11003',
         'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
         'Orthopedics',699,'16 years',4.92,210,
         'Specialist in minimally invasive robotic knee & hip replacement and sports trauma rehab.',
         'Columbia University College of Physicians','ClinicOS Central Hospital'),
        ('Dr. Elena Rostova','elena.rostova@clinicos.health','Doctor@123','+91 98001 11004',
         'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
         'Paediatrics',599,'9 years',4.8,156,
         'Pediatric specialist focused on child wellness, immunizations, and developmental screening.',
         'AIIMS New Delhi (MD Pediatrics)','ClinicOS Pediatric & Maternity Wing'),
        ('Dr. Aisha Patel','aisha.patel@clinicos.health','Doctor@123','+91 98001 11005',
         'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
         'Dermatology',649,'8 years',4.75,88,
         'Skin specialist in dermoscopy, laser therapy, acne and allergy treatment.',
         'KEM Hospital Mumbai (MD Dermatology)','ClinicOS Medical Pavilion'),
        ('Dr. Linda Zhao','linda.zhao@clinicos.health','Doctor@123','+91 98001 11006',
         'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
         'General Medicine',499,'12 years',4.7,320,
         'Primary care physician for preventive health, chronic disease management, and acute illness.',
         'Christian Medical College Vellore (MD)','ClinicOS Central Hospital'),
        ('Dr. Priya Nair','priya.nair@clinicos.health','Doctor@123','+91 98001 11007',
         'https://images.unsplash.com/photo-1594824813589-3543d8a9e224?auto=format&fit=crop&w=200&q=80',
         'Gynaecology',749,'10 years',4.88,175,
         "Women's health specialist focused on reproductive health and pregnancy care.",
         'Maulana Azad Medical College (MS Obstetrics)','ClinicOS Maternity Wing'),
        ('Dr. Raj Gupta','raj.gupta@clinicos.health','Doctor@123','+91 98001 11008',
         'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
         'Psychiatry',849,'13 years',4.82,112,
         'Mental health specialist for anxiety, depression, stress disorders, and therapy.',
         'NIMHANS Bangalore (MD Psychiatry)','ClinicOS Mental Health Wing'),
    ]

    for d in docs:
        name,email,pwd,phone,avatar,spec,fee,exp,rating,rev,bio,edu,hosp = d
        c.execute("INSERT INTO users (name,email,password_hash,role,phone,avatar_url) VALUES (?,?,?,?,?,?)",
                  (name,email,generate_password_hash(pwd),'doctor',phone,avatar))
        uid = c.lastrowid
        c.execute("""INSERT INTO doctors (user_id,specialty,fee,experience,rating,reviews_count,bio,education,hospital)
                     VALUES (?,?,?,?,?,?,?,?,?)""",
                  (uid,spec,fee,exp,rating,rev,bio,edu,hosp))

    # Demo patient
    c.execute("INSERT INTO users (name,email,password_hash,role,phone,blood_group) VALUES (?,?,?,?,?,?)",
              ('Alex Morgan','patient@demo.com',generate_password_hash('Patient@123'),'patient','+91 98765 43210','O+'))

    # Medicines
    meds = [
        ('Paracetamol 500mg','Acetaminophen','Pain & Fever',25,45,200,'Fever, headache, pain relief. Do not exceed 4g/day.','Cipla Ltd.',0,'💊'),
        ('Azithromycin 500mg','Azithromycin','Antibiotics',89,150,150,'Antibiotic for bacterial infections. Take full course.','Sun Pharma',1,'💊'),
        ('Metformin 500mg','Metformin HCl','Diabetes Care',35,60,120,'Type 2 diabetes management. Take with meals.','USV Ltd.',1,'🩺'),
        ('Cetirizine 10mg','Cetirizine HCl','Allergy',18,30,180,'Antihistamine for allergies, hay fever, hives.','Mankind Pharma',0,'💊'),
        ('Omeprazole 20mg','Omeprazole','Gastro Care',45,80,160,'Acid reducer for GERD, ulcers. Take before meals.','Alkem Labs',0,'💊'),
        ('Atorvastatin 10mg','Atorvastatin','Cardiac Care',55,90,140,'Cholesterol lowering medication. Take at night.','Torrent Pharma',1,'❤️'),
        ('Amlodipine 5mg','Amlodipine','Cardiac Care',48,85,130,'Calcium channel blocker for blood pressure.','Cipla Ltd.',1,'❤️'),
        ('Vitamin D3 60000 IU','Cholecalciferol','Vitamins',65,110,200,'Weekly vitamin D supplement for deficiency.','Abbott India',0,'🌟'),
        ('Montelukast 10mg','Montelukast Sodium','Respiratory',78,130,100,'Asthma and allergic rhinitis management.','MSD India',1,'💨'),
        ('Pantoprazole 40mg','Pantoprazole','Gastro Care',42,75,155,'Proton pump inhibitor for acid reflux and ulcers.','Zydus Cadila',0,'💊'),
        ('B-Complex + Vitamin C','B-Complex','Vitamins',55,95,250,'Daily B vitamins with Vitamin C for immunity.','Pfizer India',0,'🌟'),
        ('Ibuprofen 400mg','Ibuprofen','Pain & Fever',28,48,180,'NSAID for pain, fever and inflammation.','Cipla Ltd.',0,'💊'),
        ('Amoxicillin 500mg','Amoxicillin','Antibiotics',65,110,120,'Broad-spectrum antibiotic for various infections.','GSK India',1,'💊'),
        ('Clopidogrel 75mg','Clopidogrel','Cardiac Care',95,160,110,'Antiplatelet medication to prevent blood clots.','Sun Pharma',1,'❤️'),
        ('Insulin Glargine 100IU','Insulin Glargine','Diabetes Care',890,1200,60,'Long-acting insulin for type 1 and 2 diabetes.','Sanofi India',1,'🩺'),
        ('Dolo 650mg','Paracetamol 650mg','Pain & Fever',32,55,200,'Stronger paracetamol for adults with high fever.','Micro Labs',0,'💊'),
        ('Multivitamin Daily','Multivitamin','Vitamins',120,180,300,'Complete daily multivitamin for adults.','Himalaya',0,'🌟'),
        ('Aspirin 75mg','Acetylsalicylic Acid','Cardiac Care',22,40,200,'Low-dose aspirin for cardiac prophylaxis.','Bayer India',1,'❤️'),
    ]
    for m in meds:
        c.execute("""INSERT INTO medicines (name,generic_name,category,price,mrp,stock,description,manufacturer,requires_rx,image_emoji)
                     VALUES (?,?,?,?,?,?,?,?,?,?)""", m)

    conn.commit()
    print("[DB] Seed data inserted successfully.")
