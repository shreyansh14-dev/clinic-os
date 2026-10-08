export const INITIAL_DEPARTMENTS = [
  { id: 'dept-1', name: 'Cardiology', icon: 'Heart', doctorCount: 10, description: 'Heart & cardiovascular care', fee: 3000 },
  { id: 'dept-2', name: 'General Medicine', icon: 'Stethoscope', doctorCount: 10, description: 'Adult health & preventive care', fee: 1500 },
  { id: 'dept-3', name: 'Neurology', icon: 'Brain', doctorCount: 10, description: 'Brain, spine & nervous system', fee: 3500 },
  { id: 'dept-4', name: 'Dermatology', icon: 'Sparkles', doctorCount: 10, description: 'Skin, hair, & cosmetic care', fee: 2000 },
  { id: 'dept-5', name: 'Orthopedics', icon: 'Activity', doctorCount: 10, description: 'Bone, joint & musculoskeletal', fee: 2500 },
  { id: 'dept-6', name: 'Pediatrics', icon: 'Baby', doctorCount: 10, description: 'Child & infant healthcare', fee: 1800 },
  { id: 'dept-7', name: 'General Surgery', icon: 'Activity', doctorCount: 10, description: 'Laparoscopy & hernia surgery', fee: 2200 },
  { id: 'dept-8', name: 'Oncology', icon: 'Activity', doctorCount: 10, description: 'Cancer care & chemotherapy', fee: 4000 },
  { id: 'dept-9', name: 'Gynecology & Obstetrics', icon: 'Heart', doctorCount: 10, description: 'Maternity & women health', fee: 2200 },
  { id: 'dept-10', name: 'ENT (Ear, Nose, Throat)', icon: 'Activity', doctorCount: 10, description: 'Ear, sinus & throat disorders', fee: 1800 },
  { id: 'dept-11', name: 'Ophthalmology', icon: 'Eye', doctorCount: 10, description: 'Eye care & vision testing', fee: 1900 },
  { id: 'dept-12', name: 'Nephrology', icon: 'Activity', doctorCount: 10, description: 'Kidney care & dialysis unit', fee: 2800 },
  { id: 'dept-13', name: 'Gastroenterology', icon: 'Activity', doctorCount: 10, description: 'Stomach, liver & endoscopy', fee: 2600 },
  { id: 'dept-14', name: 'Pulmonology', icon: 'Lungs', doctorCount: 10, description: 'Lungs, chest & asthma support', fee: 2400 },
  { id: 'dept-15', name: 'Endocrinology', icon: 'Activity', doctorCount: 10, description: 'Diabetes & thyroid care', fee: 2300 },
  { id: 'dept-16', name: 'Emergency & Trauma', icon: 'Ambulance', doctorCount: 10, description: '24/7 ER Triage & 108 Dispatch', fee: 2000 }
];

const maleFirstNames = ['Souvik', 'Arjun', 'Kunal', 'Tuhin', 'Henry', 'Rajesh', 'Alok', 'Rohan', 'Pradeep', 'Vikramaditya', 'Arvind', 'Kaushik', 'Sanjay', 'Tarun', 'Vivek', 'Manish', 'Nikhil', 'Gaurav', 'Abhishek', 'Siddharth'];
const femaleFirstNames = ['Ananya', 'Ritu', 'Priya', 'Shalini', 'Neha', 'Meera', 'Deepa', 'Pooja', 'Kavita', 'Sunita', 'Divya', 'Swaroop', 'Smriti', 'Radhika', 'Nandini', 'Ishita', 'Sonam', 'Preeti', 'Bhavna', 'Archana'];

const lastNames = ['Sinha', 'Sharma', 'Sarkar', 'Banerjee', 'D\'Souza', 'Roy', 'Kapoor', 'Verma', 'Nambiar', 'Menon', 'Kulkarni', 'Nath', 'Joshi', 'Rao', 'Vasudevan', 'Sen', 'Mukherjee', 'Chawla', 'Bhatia', 'Malhotra', 'Gupta', 'Patel', 'Saxena'];

const titles = [
  'Senior Consultant',
  'Chief Specialist',
  'Associate Director',
  'Lead Specialist',
  'Consultant',
  'Clinical Director',
  'Principal Specialist',
  'Senior Surgeon',
  'Department Head',
  'Visiting Specialist'
];

const DEPARTMENT_AVATARS = {
  'Cardiology': ['/images/doctors/cardio_1.jpg', '/images/doctors/cardio_2.jpg', '/images/doctors/cardio_3.jpg', '/images/doctors/cardio_4.jpg'],
  'General Medicine': ['/images/doctors/ortho_1.jpg', '/images/doctors/ortho_2.jpg', '/images/doctors/ortho_3.jpg', '/images/doctors/ortho_4.jpg'],
  'Neurology': ['/images/doctors/neuro_1.jpg', '/images/doctors/neuro_2.jpg', '/images/doctors/neuro_3.jpg', '/images/doctors/neuro_4.jpg'],
  'Dermatology': ['/images/doctors/derm_1.jpg', '/images/doctors/derm_2.jpg', '/images/doctors/derm_3.jpg', '/images/doctors/derm_4.jpg'],
  'Orthopedics': ['/images/doctors/ortho_1.jpg', '/images/doctors/ortho_2.jpg', '/images/doctors/ortho_3.jpg', '/images/doctors/ortho_4.jpg'],
  'Pediatrics': ['/images/doctors/pedia_1.jpg', '/images/doctors/pedia_2.jpg', '/images/doctors/pedia_3.jpg', '/images/doctors/pedia_4.jpg'],
  'General Surgery': ['/images/doctors/indian_doc_m2.jpg', '/images/doctors/indian_doc_f2.jpg', '/images/doctors/neuro_3.jpg', '/images/doctors/indian_doc_neuro_m1.jpg'],
  'Oncology': ['/images/doctors/psych_1.jpg', '/images/doctors/psych_2.jpg', '/images/doctors/psych_3.jpg', '/images/doctors/psych_4.jpg'],
  'Gynecology & Obstetrics': ['/images/doctors/gyn_1.jpg', '/images/doctors/gyn_2.jpg', '/images/doctors/gyn_3.jpg', '/images/doctors/gyn_4.jpg'],
  'ENT (Ear, Nose, Throat)': ['/images/doctors/ent_1.jpg', '/images/doctors/ent_2.jpg', '/images/doctors/ent_3.jpg', '/images/doctors/ent_4.jpg'],
  'Ophthalmology': ['/images/doctors/eye_1.jpg', '/images/doctors/eye_2.jpg', '/images/doctors/eye_3.jpg', '/images/doctors/eye_4.jpg'],
  'Nephrology': ['/images/doctors/diab_1.jpg', '/images/doctors/diab_2.jpg', '/images/doctors/diab_3.jpg', '/images/doctors/diab_4.jpg'],
  'Gastroenterology': ['/images/doctors/indian_doc_m1.jpg', '/images/doctors/indian_doc_f1.jpg', '/images/doctors/cardio_2.jpg', '/images/doctors/pedia_1.jpg'],
  'Pulmonology': ['/images/doctors/cardio_3.jpg', '/images/doctors/neuro_1.jpg', '/images/doctors/gyn_2.jpg', '/images/doctors/eye_2.jpg'],
  'Endocrinology': ['/images/doctors/diab_1.jpg', '/images/doctors/diab_2.jpg', '/images/doctors/diab_3.jpg', '/images/doctors/diab_4.jpg'],
  'Emergency & Trauma': ['/images/doctors/indian_doc_cardio_m1.jpg', '/images/doctors/indian_doc_cardio_f1.jpg', '/images/doctors/neuro_2.jpg', '/images/doctors/gyn_1.jpg']
};

export const generate160Doctors = () => {
  const doctors = [];
  let globalDocIndex = 1;

  INITIAL_DEPARTMENTS.forEach((dept, deptIndex) => {
    const deptNum = deptIndex + 1;
    const deptAvatars = DEPARTMENT_AVATARS[dept.name] || [
      '/images/doctors/cardio_1.jpg',
      '/images/doctors/neuro_1.jpg',
      '/images/doctors/gyn_1.jpg',
      '/images/doctors/ortho_1.jpg'
    ];

    for (let i = 0; i < 10; i++) {
      const isFemale = i % 2 === 1;
      const fn = isFemale
        ? femaleFirstNames[(i * 3 + deptNum) % femaleFirstNames.length]
        : maleFirstNames[(i * 3 + deptNum) % maleFirstNames.length];
      const ln = lastNames[(i * 2 + deptNum) % lastNames.length];
      const title = titles[i % titles.length];

      const docId = `doc-${deptNum}-${i + 1}`;
      const docName = `Dr. ${fn} ${ln}`;
      const specialty = `${title} - ${dept.name}`;
      const expYears = 8 + ((i * 2 + deptNum) % 18);
      const experience = `${expYears}+ Years`;
      const rating = +(4.7 + (i * 0.03)).toFixed(2);
      const fee = dept.fee + (i % 3) * 200;
      const availability = i % 2 === 0 ? 'Mon - Fri (09:00 AM - 04:00 PM)' : 'Tue - Sat (10:00 AM - 05:00 PM)';

      // Assign authentic department-specific Indian doctor photo
      const avatar = deptAvatars[i % deptAvatars.length];

      doctors.push({
        id: docId,
        deptId: dept.id,
        name: docName,
        specialty,
        department: dept.name,
        experience,
        rating,
        fee,
        consultationFee: fee,
        availability,
        availableDays: availability,
        avatar,
        phone: `+91 987${i}5 ${deptNum}00`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}.${docId}@clinicos.com`,
        room: `OPD Block ${String.fromCharCode(65 + (i % 4))}-${101 + i}`
      });

      globalDocIndex++;
    }
  });

  return doctors;
};

export const INITIAL_DOCTORS = generate160Doctors();

export const INITIAL_PATIENTS = [
  {
    id: 'usr-pat-1',
    name: 'Shreyansh Kumar',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 91234 56789',
    email: 'patient@clinicos.com',
    address: 'Bandra West, Mumbai',
    emergencyContact: '+91 98765 00000',
    insuranceId: 'INS-99214-AB',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    admitted: false,
    diagnosis: 'Hypertension Evaluation'
  },
  {
    id: 'usr-pat-2',
    name: 'Priya Sharma',
    age: 34,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 98201 44552',
    email: 'priya.s@gmail.com',
    address: 'Andheri East, Mumbai',
    emergencyContact: '+91 98201 99887',
    insuranceId: 'HDFC-ERGO-4412',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    admitted: false,
    diagnosis: 'Type-2 Diabetes Review'
  },
  {
    id: 'usr-pat-3',
    name: 'Rajesh Malhotra',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 99300 12890',
    email: 'rajesh.m@outlook.com',
    address: 'Worli Sea Face, Mumbai',
    emergencyContact: '+91 99300 55443',
    insuranceId: 'STAR-HEALTH-8819',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    admitted: true,
    diagnosis: 'Post-CABG Cardiac Recovery'
  },
  {
    id: 'usr-pat-4',
    name: 'Ananya Sen',
    age: 26,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+91 98112 33445',
    email: 'ananya.sen@gmail.com',
    address: 'Powai, Mumbai',
    emergencyContact: '+91 98112 88990',
    insuranceId: 'ICICI-LOMB-7761',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    admitted: false,
    diagnosis: 'Dermatological Allergy'
  },
  {
    id: 'usr-pat-5',
    name: 'Vikram Patel',
    age: 46,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+91 97245 66778',
    email: 'vikram.p@yahoo.com',
    address: 'Juhu Scheme, Mumbai',
    emergencyContact: '+91 97245 11223',
    insuranceId: 'MAX-BUPA-3302',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    admitted: false,
    diagnosis: 'Lumbar Spine Spondylosis'
  },
  {
    id: 'usr-pat-6',
    name: 'Neha Deshmukh',
    age: 42,
    gender: 'Female',
    bloodGroup: 'A-',
    phone: '+91 98670 99881',
    email: 'neha.d@gmail.com',
    address: 'Thane West, Mumbai',
    emergencyContact: '+91 98670 44332',
    insuranceId: 'CARE-HEALTH-5541',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    admitted: false,
    diagnosis: 'Thyroid Dysfunction'
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    patientId: 'usr-pat-1',
    patientName: 'Shreyansh Kumar',
    doctorId: 'doc-1-1',
    doctorName: 'Dr. Souvik Sinha',
    specialty: 'Cardiology',
    date: '2026-10-09',
    time: '10:00 AM',
    type: 'In-Person',
    status: 'Pending',
    fee: 3000,
    paid: true,
    symptoms: 'Mild chest heaviness during exertion & irregular pulse'
  },
  {
    id: 'apt-102',
    patientId: 'usr-pat-2',
    patientName: 'Priya Sharma',
    doctorId: 'doc-15-1',
    doctorName: 'Dr. Priya Nair',
    specialty: 'Endocrinology',
    date: '2026-10-09',
    time: '11:30 AM',
    type: 'Telehealth',
    status: 'Pending',
    fee: 2300,
    paid: true,
    symptoms: 'Quarterly HbA1c review & insulin dose titration'
  },
  {
    id: 'apt-103',
    patientId: 'usr-pat-3',
    patientName: 'Rajesh Malhotra',
    doctorId: 'doc-1-2',
    doctorName: 'Dr. Arjun Sharma',
    specialty: 'Cardiology',
    date: '2026-10-10',
    time: '02:00 PM',
    type: 'In-Person',
    status: 'Scheduled',
    fee: 3200,
    paid: false,
    symptoms: 'Post-op 4-week echo review'
  },
  {
    id: 'apt-104',
    patientId: 'usr-pat-4',
    patientName: 'Ananya Sen',
    doctorId: 'doc-4-1',
    doctorName: 'Dr. Kunal Sarkar',
    specialty: 'Dermatology',
    date: '2026-10-11',
    time: '04:30 PM',
    type: 'In-Person',
    status: 'Rescheduled',
    fee: 2000,
    paid: true,
    symptoms: 'Contact dermatitis flare-up on palms'
  },
  {
    id: 'apt-105',
    patientId: 'usr-pat-5',
    patientName: 'Vikram Patel',
    doctorId: 'doc-5-1',
    doctorName: 'Dr. Henry D\'Souza',
    specialty: 'Orthopedics',
    date: '2026-10-08',
    time: '09:30 AM',
    type: 'In-Person',
    status: 'Completed',
    fee: 2500,
    paid: true,
    symptoms: 'L4-L5 disc protrusion follow-up'
  },
  {
    id: 'apt-106',
    patientId: 'usr-pat-6',
    patientName: 'Neha Deshmukh',
    doctorId: 'doc-2-1',
    doctorName: 'Dr. Alok Roy',
    specialty: 'General Medicine',
    date: '2026-10-12',
    time: '03:00 PM',
    type: 'Telehealth',
    status: 'Scheduled',
    fee: 1500,
    paid: true,
    symptoms: 'Hypothyroidism lethargy & weight check'
  }
];

export const INITIAL_PRESCRIPTIONS = [];
export const INITIAL_LAB_TESTS = [];

export const INITIAL_BILLS = [
  {
    id: 'INV-2026-901',
    patientId: 'usr-pat-1',
    patientName: 'Shreyansh Kumar',
    description: 'Executive Cardiac Consultation & 12-Lead ECG',
    department: 'Cardiology',
    issueDate: '2026-10-08',
    dueDate: '2026-10-15',
    totalAmount: 3500,
    status: 'Paid',
    paymentMethod: 'UPI / GPay',
    transactionId: 'TXN-98124401',
    insuranceCoverage: 0
  },
  {
    id: 'INV-2026-902',
    patientId: 'usr-pat-2',
    patientName: 'Priya Sharma',
    description: 'Comprehensive Diabetic Profile & Endocrinologist Telehealth',
    department: 'Endocrinology',
    issueDate: '2026-10-07',
    dueDate: '2026-10-14',
    totalAmount: 4200,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-55198203',
    insuranceCoverage: 0
  },
  {
    id: 'INV-2026-903',
    patientId: 'usr-pat-3',
    patientName: 'Rajesh Malhotra',
    description: 'IPD Ward Admission, Cardiac Monitor & Daily Consultant Rounds',
    department: 'Cardiology',
    issueDate: '2026-10-06',
    dueDate: '2026-10-13',
    totalAmount: 28500,
    status: 'Unpaid',
    paymentMethod: null,
    transactionId: null,
    insuranceCoverage: 20000
  },
  {
    id: 'INV-2026-904',
    patientId: 'usr-pat-4',
    patientName: 'Ananya Sen',
    description: 'Dermatological Biopsy & Patch Allergy Test',
    department: 'Dermatology',
    issueDate: '2026-10-05',
    dueDate: '2026-10-12',
    totalAmount: 2200,
    status: 'Paid',
    paymentMethod: 'NetBanking',
    transactionId: 'TXN-77123904',
    insuranceCoverage: 0
  },
  {
    id: 'INV-2026-905',
    patientId: 'usr-pat-5',
    patientName: 'Vikram Patel',
    description: 'Spine MRI Scan & Orthopedic Consultation',
    department: 'Orthopedics',
    issueDate: '2026-10-04',
    dueDate: '2026-10-11',
    totalAmount: 6800,
    status: 'Unpaid',
    paymentMethod: null,
    transactionId: null,
    insuranceCoverage: 4000
  },
  {
    id: 'INV-2026-906',
    patientId: 'usr-pat-6',
    patientName: 'Neha Deshmukh',
    description: 'Thyroid Function Panel (FT3/FT4/TSH) & Consultation',
    department: 'General Medicine',
    issueDate: '2026-10-03',
    dueDate: '2026-10-10',
    totalAmount: 1850,
    status: 'Paid',
    paymentMethod: 'Cash',
    transactionId: 'TXN-44910283',
    insuranceCoverage: 0
  }
];

export const INITIAL_VITALS = [
  { id: 'v1', patientId: 'usr-pat-1', bpSystolic: 120, bpDiastolic: 80, heartRate: 72, spo2: 98, date: '2026-08-23' }
];

export const INITIAL_MEDS_SCHEDULE = [
  {
    id: 'med-1',
    name: 'Telmisartan 40mg',
    dose: '1 Tablet',
    dosage: '1 Tablet',
    timing: 'Morning',
    time: '08:00 AM',
    instructions: 'Take with warm water after breakfast',
    purpose: 'Blood Pressure Control',
    prescribedBy: 'Dr. Souvik Sinha',
    taken: true,
    takenAt: '08:15 AM',
    stockLeft: 18,
    color: '#3B82F6'
  },
  {
    id: 'med-2',
    name: 'Pantoprazole 40mg',
    dose: '1 Capsule',
    dosage: '1 Capsule',
    timing: 'Morning',
    time: '07:30 AM',
    instructions: 'Take 30 mins before breakfast on empty stomach',
    purpose: 'Acid Reflux & Gastric Protection',
    prescribedBy: 'Dr. Souvik Sinha',
    taken: true,
    takenAt: '07:35 AM',
    stockLeft: 12,
    color: '#10B981'
  },
  {
    id: 'med-3',
    name: 'Metformin 500mg SR',
    dose: '1 Tablet',
    dosage: '1 Tablet',
    timing: 'Morning',
    time: '08:30 AM',
    instructions: 'Take immediately after breakfast',
    purpose: 'Blood Sugar Regulation',
    prescribedBy: 'Dr. Priya Nair',
    taken: false,
    takenAt: null,
    stockLeft: 24,
    color: '#8B5CF6'
  },
  {
    id: 'med-4',
    name: 'Calcium 500mg + Vitamin D3',
    dose: '1 Tablet',
    dosage: '1 Tablet',
    timing: 'Afternoon',
    time: '01:30 PM',
    instructions: 'Take with glass of water post lunch',
    purpose: 'Bone Density & Joint Health',
    prescribedBy: 'Dr. Rajesh Sundaram',
    taken: false,
    takenAt: null,
    stockLeft: 30,
    color: '#F59E0B'
  },
  {
    id: 'med-5',
    name: 'Atorvastatin 10mg',
    dose: '1 Tablet',
    dosage: '1 Tablet',
    timing: 'Night',
    time: '09:30 PM',
    instructions: 'Take post dinner before bedtime',
    purpose: 'Lipid Management & Cardiac Care',
    prescribedBy: 'Dr. Souvik Sinha',
    taken: false,
    takenAt: null,
    stockLeft: 15,
    color: '#EC4899'
  },
  {
    id: 'med-6',
    name: 'Neurobion Forte',
    dose: '1 Tablet',
    dosage: '1 Tablet',
    timing: 'Night',
    time: '09:45 PM',
    instructions: 'Take with milk or water before sleep',
    purpose: 'Nerve Health & Vitamin B-Complex',
    prescribedBy: 'Dr. Priya Nair',
    taken: false,
    takenAt: null,
    stockLeft: 22,
    color: '#06B6D4'
  }
];
export const INITIAL_BEDS = [
  { id: 'b101', ward: 'General Ward A', number: '101', status: 'Available', type: 'General' },
  { id: 'b102', ward: 'ICU Unit 1', number: '201', status: 'Occupied', patientName: 'Rahul Verma', type: 'ICU' }
];
export const INITIAL_PHARMACY_INVENTORY = [
  { id: 'p1', name: 'Paracetamol 650mg', stock: 500, price: 20 },
  { id: 'p2', name: 'Amoxicillin 500mg', stock: 300, price: 85 }
];
export const INITIAL_INSURANCE_CLAIMS = [];
export const INITIAL_VACCINES = [];
export const INITIAL_BLOOD_BANK = [
  { group: 'A+', units: 45 }, { group: 'B+', units: 60 }, { group: 'O+', units: 85 }, { group: 'AB+', units: 20 }
];
export const INITIAL_AMBULANCE_FLEET = [
  { id: 'amb-1', vehicleNo: 'MH-02-AX-1080', driverName: 'Ramesh Shinde', status: 'Available', phone: '+91 98700 11080' }
];
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-08 18:42:10',
    user: 'Hospital Authority (ADMIN)',
    action: 'Administrator authenticated into ClinicOS Authority Console',
    level: 'SUCCESS',
    ip: '192.168.1.100'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-08 17:15:33',
    user: 'Dr. Souvik Sinha (DOCTOR)',
    action: 'Approved appointment clearance for patient Shreyansh Kumar',
    level: 'INFO',
    ip: '192.168.1.104'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-08 16:50:18',
    user: 'TPA Desk (ADMIN)',
    action: 'Pre-authorized cashless insurance claim CLM-9912 (₹24,500)',
    level: 'SUCCESS',
    ip: '192.168.1.102'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-08 15:22:04',
    user: 'Billing Desk (ADMIN)',
    action: 'Settled invoice INV-2026-901 via UPI Gateway',
    level: 'INFO',
    ip: '192.168.1.105'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-08 14:10:49',
    user: 'System Sentinel (SYSTEM)',
    action: 'Automatic cryptographic verification of EMR ledger completed: 100% Valid',
    level: 'SUCCESS',
    ip: '127.0.0.1'
  },
  {
    id: 'log-6',
    timestamp: '2026-10-08 12:05:12',
    user: 'Nurse Station (STAFF)',
    action: 'Updated Bed #102 occupancy status to Reserved for Admitted Patient',
    level: 'INFO',
    ip: '192.168.1.118'
  },
  {
    id: 'log-7',
    timestamp: '2026-10-08 10:30:25',
    user: 'Emergency SOS (SYSTEM)',
    action: 'Dispatched 108 Advanced Cardiac Ambulance MH-02-AX-1080',
    level: 'WARN',
    ip: '127.0.0.1'
  }
];
