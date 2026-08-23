// Comprehensive Hospital Mock Data & Medical Roster (All 16 Departments with Multiple Specialists)
export const mockDepartments = [
  { id: 'dept-1', name: 'Cardiology', description: 'Comprehensive Heart & Cardiovascular Care, ECG & Echo Assessment', fee: 3000 },
  { id: 'dept-2', name: 'Neurology & Neurosurgery', description: 'Brain, Spinal Cord, Stroke & Neurological Care', fee: 3500 },
  { id: 'dept-3', name: 'Dermatology & Cosmetology', description: 'Skin, Hair, Acne, Laser & Aesthetic Treatments', fee: 2000 },
  { id: 'dept-4', name: 'Orthopedics & Joint Care', description: 'Bone, Fracture, Spine, Joint Replacement & Trauma', fee: 2500 },
  { id: 'dept-5', name: 'Pediatrics & Child Health', description: 'Childhood Illnesses, Growth Monitoring & Vaccines', fee: 1800 },
  { id: 'dept-6', name: 'General & Laparoscopic Surgery', description: 'Minimally Invasive Hernia, Appendix & Gallbladder Surgery', fee: 2200 },
  { id: 'dept-7', name: 'Oncology & Cancer Care', description: 'Comprehensive Cancer Screening, Chemotherapy & Tumor Care', fee: 4000 },
  { id: 'dept-8', name: 'Gynecology & Obstetrics', description: 'Maternity, Pregnancy Care & Women Wellness', fee: 2200 },
  { id: 'dept-9', name: 'ENT (Ear, Nose, Throat)', description: 'Sinus, Hearing, Throat & Voice Disorder Treatment', fee: 1800 },
  { id: 'dept-10', name: 'Ophthalmology (Eye Care)', description: 'Cataract, Vision Testing, Glaucoma & Retina Care', fee: 1900 },
  { id: 'dept-11', name: 'Nephrology & Dialysis', description: 'Kidney Health, Chronic Kidney Care & Dialysis Unit', fee: 2800 },
  { id: 'dept-12', name: 'Gastroenterology & Liver Care', description: 'Stomach, Liver, Endoscopy & Digestive Health', fee: 2600 },
  { id: 'dept-13', name: 'Pulmonology & Chest Medicine', description: 'Asthma, Lungs, Allergy & Respiratory Support', fee: 2400 },
  { id: 'dept-14', name: 'Endocrinology & Diabetes', description: 'Diabetes Management, Thyroid & Hormonal Care', fee: 2300 },
  { id: 'dept-15', name: 'Psychiatry & Behavioral Health', description: 'Mental Wellness, Stress, Anxiety & Counseling', fee: 2500 },
  { id: 'dept-16', name: 'Emergency & Trauma Triage', description: '24/7 ER Pre-Hospital Guidance, Trauma Stabilizing & Ambulance Dispatch', fee: 0 }
];

export const mockDoctors = [
  // Cardiology (dept-1)
  {
    id: 'doc-1',
    deptId: 'dept-1',
    name: 'Dr. Souvik Sinha',
    specialty: 'Senior Interventional Cardiologist',
    experience: '14+ Years',
    rating: 4.9,
    fee: 3000,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timing: '09:00 AM - 04:00 PM'
  },
  {
    id: 'doc-102',
    deptId: 'dept-1',
    name: 'Dr. Ritu Verma',
    specialty: 'Electrophysiologist & Heart Specialist',
    experience: '11+ Years',
    rating: 4.85,
    fee: 2800,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78906?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '10:00 AM - 03:00 PM'
  },
  {
    id: 'doc-103',
    deptId: 'dept-1',
    name: 'Dr. Amit Deshmukh',
    specialty: 'Pediatric Cardiologist',
    experience: '15+ Years',
    rating: 4.92,
    fee: 3200,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '02:00 PM - 06:00 PM'
  },

  // Neurology & Neurosurgery (dept-2)
  {
    id: 'doc-2',
    deptId: 'dept-2',
    name: 'Dr. Kunal Sarkar',
    specialty: 'Neurosurgeon & Stroke Specialist',
    experience: '16+ Years',
    rating: 4.95,
    fee: 3500,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 02:00 PM'
  },
  {
    id: 'doc-202',
    deptId: 'dept-2',
    name: 'Dr. Shalini Menon',
    specialty: 'Consultant Neurologist & Epilepsy Specialist',
    experience: '12+ Years',
    rating: 4.88,
    fee: 3200,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '11:00 AM - 04:00 PM'
  },

  // Dermatology & Cosmetology (dept-3)
  {
    id: 'doc-3',
    deptId: 'dept-3',
    name: 'Dr. Tuhin Banerjee',
    specialty: 'Dermatologist & Laser Surgeon',
    experience: '8+ Years',
    rating: 4.7,
    fee: 2000,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '11:00 AM - 05:00 PM'
  },
  {
    id: 'doc-302',
    deptId: 'dept-3',
    name: 'Dr. Neha Kapoor',
    specialty: 'Trichologist & Aesthetic Dermatologist',
    experience: '10+ Years',
    rating: 4.9,
    fee: 2200,
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '01:00 PM - 07:00 PM'
  },

  // Orthopedics & Joint Care (dept-4)
  {
    id: 'doc-4',
    deptId: 'dept-4',
    name: 'Dr. Henry D\'Souza',
    specialty: 'Joint Replacement & Spine Surgeon',
    experience: '12+ Years',
    rating: 4.85,
    fee: 2500,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Thu', 'Sat'],
    timing: '09:30 AM - 03:30 PM'
  },
  {
    id: 'doc-402',
    deptId: 'dept-4',
    name: 'Dr. Alok Nath',
    specialty: 'Sports Medicine & Arthroscopy Specialist',
    experience: '14+ Years',
    rating: 4.91,
    fee: 2600,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Wed', 'Fri'],
    timing: '10:00 AM - 04:00 PM'
  },

  // Pediatrics & Child Health (dept-5)
  {
    id: 'doc-5',
    deptId: 'dept-5',
    name: 'Dr. Ananya Roy',
    specialty: 'Senior Pediatrician & Child Specialist',
    experience: '10+ Years',
    rating: 4.9,
    fee: 1800,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78906?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timing: '08:30 AM - 01:30 PM'
  },
  {
    id: 'doc-502',
    deptId: 'dept-5',
    name: 'Dr. Rohan Kulkarni',
    specialty: 'Neonatologist & Pediatric Intensivist',
    experience: '13+ Years',
    rating: 4.87,
    fee: 2000,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '02:00 PM - 07:00 PM'
  },

  // General & Laparoscopic Surgery (dept-6)
  {
    id: 'doc-601',
    deptId: 'dept-6',
    name: 'Dr. Pradeep Joshi',
    specialty: 'Senior Laparoscopic & Hernia Surgeon',
    experience: '17+ Years',
    rating: 4.93,
    fee: 2200,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timing: '09:00 AM - 02:00 PM'
  },
  {
    id: 'doc-602',
    deptId: 'dept-6',
    name: 'Dr. Surbhi Gupta',
    specialty: 'General & Bariatric Surgeon',
    experience: '11+ Years',
    rating: 4.84,
    fee: 2100,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Wed', 'Fri', 'Sat'],
    timing: '11:00 AM - 04:00 PM'
  },

  // Oncology & Cancer Care (dept-7)
  {
    id: 'doc-6',
    deptId: 'dept-7',
    name: 'Dr. Vikramaditya Rao',
    specialty: 'Medical Oncologist & Cancer Specialist',
    experience: '18+ Years',
    rating: 4.98,
    fee: 4000,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 03:00 PM'
  },
  {
    id: 'doc-702',
    deptId: 'dept-7',
    name: 'Dr. Rashmi Iyer',
    specialty: 'Surgical Oncologist & Breast Cancer Specialist',
    experience: '15+ Years',
    rating: 4.94,
    fee: 3800,
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '09:30 AM - 02:30 PM'
  },

  // Gynecology & Obstetrics (dept-8)
  {
    id: 'doc-7',
    deptId: 'dept-8',
    name: 'Dr. Meera Vasudevan',
    specialty: 'Obstetrician & High-Risk Pregnancy Specialist',
    experience: '15+ Years',
    rating: 4.88,
    fee: 2200,
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '09:00 AM - 02:00 PM'
  },
  {
    id: 'doc-802',
    deptId: 'dept-8',
    name: 'Dr. Swati Agarwal',
    specialty: 'Laparoscopic Gynecologist & Infertility Specialist',
    experience: '12+ Years',
    rating: 4.89,
    fee: 2300,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78906?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '11:00 AM - 05:00 PM'
  },

  // ENT (Ear, Nose, Throat) (dept-9)
  {
    id: 'doc-901',
    deptId: 'dept-9',
    name: 'Dr. Arvind Nambiar',
    specialty: 'ENT & Endoscopic Sinus Surgeon',
    experience: '14+ Years',
    rating: 4.86,
    fee: 1800,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timing: '10:00 AM - 03:00 PM'
  },

  // Ophthalmology (Eye Care) (dept-10)
  {
    id: 'doc-1001',
    deptId: 'dept-10',
    name: 'Dr. Kaushik Sen',
    specialty: 'Cataract & Refractive Eye Surgeon',
    experience: '16+ Years',
    rating: 4.92,
    fee: 1900,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 02:00 PM'
  },

  // Nephrology & Dialysis (dept-11)
  {
    id: 'doc-1101',
    deptId: 'dept-11',
    name: 'Dr. Sanjay Mukherjee',
    specialty: 'Senior Nephrologist & Kidney Transplant Specialist',
    experience: '19+ Years',
    rating: 4.96,
    fee: 2800,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    timing: '10:30 AM - 03:30 PM'
  },

  // Gastroenterology & Liver Care (dept-12)
  {
    id: 'doc-1201',
    deptId: 'dept-12',
    name: 'Dr. Tarun Chawla',
    specialty: 'Gastroenterologist & Hepatologist',
    experience: '15+ Years',
    rating: 4.89,
    fee: 2600,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '11:00 AM - 04:00 PM'
  },

  // Pulmonology & Chest Care (dept-13)
  {
    id: 'doc-1301',
    deptId: 'dept-13',
    name: 'Dr. Deepa Kulkarni',
    specialty: 'Pulmonologist & Sleep Medicine Specialist',
    experience: '11+ Years',
    rating: 4.87,
    fee: 2400,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 02:00 PM'
  },

  // Endocrinology & Diabetes (dept-14)
  {
    id: 'doc-1401',
    deptId: 'dept-14',
    name: 'Dr. Vivek Bhatia',
    specialty: 'Diabetologist & Thyroid Specialist',
    experience: '13+ Years',
    rating: 4.9,
    fee: 2300,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timing: '10:00 AM - 03:00 PM'
  },

  // Psychiatry & Mental Health (dept-15)
  {
    id: 'doc-1501',
    deptId: 'dept-15',
    name: 'Dr. Pooja Hegde',
    specialty: 'Psychiatrist & Behavioral Therapist',
    experience: '10+ Years',
    rating: 4.93,
    fee: 2500,
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timing: '11:00 AM - 05:00 PM'
  },

  // Emergency & Trauma Triage (dept-16)
  {
    id: 'doc-8',
    deptId: 'dept-16',
    name: 'Dr. Rajesh Sharma (ER Chief)',
    specialty: 'Emergency Medicine & Trauma Chief',
    experience: '20+ Years',
    rating: 5.0,
    fee: 0,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    availableDays: ['24/7 ER Duty'],
    timing: '24/7 Immediate Triage'
  },
  {
    id: 'doc-1602',
    deptId: 'dept-16',
    name: 'Dr. Manish Malhotra',
    specialty: 'Critical Care & Ambulance Dispatch Lead',
    experience: '16+ Years',
    rating: 4.97,
    fee: 0,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    availableDays: ['24/7 ER Duty'],
    timing: '24/7 Immediate Triage'
  }
];

export const mockPatients = [
  {
    id: 'pat-101',
    name: 'Shreyansh Kumar',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'shreyansh@example.com',
    emergencyContact: '+91 98765 00000 (Spouse)',
    address: 'Bandra West, Mumbai, MH'
  }
];

export const mockAppointments = [
  {
    id: 'APT-84920',
    patientId: 'pat-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Souvik Sinha',
    specialty: 'Cardiology',
    date: '2026-08-24',
    time: '10:00 AM',
    status: 'Confirmed',
    reason: 'Follow-up Evaluation & ECG Review',
    fee: 3000
  }
];

export const mockBills = [
  {
    id: 'INV-2026-001',
    patientId: 'pat-101',
    issueDate: '2026-08-20',
    department: 'Cardiology OPD Consultation',
    items: [{ desc: 'Senior Specialist Consultation Fee', amount: 2150 }],
    totalAmount: 2150,
    status: 'Unpaid'
  },
  {
    id: 'INV-2026-002',
    patientId: 'pat-101',
    issueDate: '2026-08-15',
    department: 'Pathology Lab Diagnostics',
    items: [{ desc: 'Complete Blood Count & Lipid Profile', amount: 850 }],
    totalAmount: 850,
    status: 'Paid'
  }
];
