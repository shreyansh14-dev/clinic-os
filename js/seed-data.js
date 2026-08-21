/**
 * ClinicOS: Seed Data
 * Comprehensive realistic medical datasets for Patients, Doctors, Appointments,
 * Diagnostics, Prescriptions, Invoices, Audit Logs, and AI Triage Knowledge Base.
 */

const SEED_DATA = {
  departments: [
    {
      id: 'dept-cardio',
      name: 'Cardiology',
      icon: 'heart-pulse',
      head: 'Dr. Robert Chen, MD',
      description: 'Advanced cardiovascular care, ECG telemetry, echocardiography, and hypertension management.',
      rooms: 'Wing A (Rooms 101-108)',
      doctorsCount: 4,
      color: '#10B981'
    },
    {
      id: 'dept-neuro',
      name: 'Neurology & Brain Health',
      icon: 'brain',
      head: 'Dr. Sarah Mitchell, PhD',
      description: 'Comprehensive neurological assessment, EEG, stroke recovery, and migraine clinics.',
      rooms: 'Wing B (Rooms 201-206)',
      doctorsCount: 3,
      color: '#8B5CF6'
    },
    {
      id: 'dept-ortho',
      name: 'Orthopedics & Sports Medicine',
      icon: 'bone',
      head: 'Dr. Marcus Vance, MS',
      description: 'Joint replacement, arthroscopy, fracture management, and physical rehabilitation.',
      rooms: 'Wing C (Rooms 301-308)',
      doctorsCount: 3,
      color: '#06B6D4'
    },
    {
      id: 'dept-pedia',
      name: 'Pediatrics & Neonatology',
      icon: 'baby',
      head: 'Dr. Elena Rostova, MD',
      description: 'Child wellness, pediatric immunizations, developmental screening, and acute illness care.',
      rooms: 'Wing D (Rooms 110-116)',
      doctorsCount: 4,
      color: '#F59E0B'
    },
    {
      id: 'dept-radio',
      name: 'Radiology & Diagnostic Imaging',
      icon: 'scan',
      head: 'Dr. Arthur Pendelton, MD',
      description: 'High-resolution MRI, CT Angiography, Ultrasound, and digital X-ray diagnostics.',
      rooms: 'Imaging Center (Basement 1)',
      doctorsCount: 2,
      color: '#38BDF8'
    },
    {
      id: 'dept-derma',
      name: 'Dermatology & Cosmetology',
      icon: 'sparkles',
      head: 'Dr. Aisha Patel, MD',
      description: 'Skin pathology, dermoscopy, laser therapy, acne & allergy treatment.',
      rooms: 'Wing E (Rooms 210-214)',
      doctorsCount: 2,
      color: '#EC4899'
    },
    {
      id: 'dept-onco',
      name: 'Oncology & Immunotherapy',
      icon: 'shield-alert',
      head: 'Dr. Gregory House, MD',
      description: 'Precision oncology, targeted chemotherapy, biopsy analysis, and survivorship programs.',
      rooms: 'Cancer Center (Wing F)',
      doctorsCount: 2,
      color: '#EF4444'
    },
    {
      id: 'dept-genmed',
      name: 'General Medicine & Family Practice',
      icon: 'stethoscope',
      head: 'Dr. Linda Zhao, MD',
      description: 'Primary health consultations, preventive screenings, chronic disease monitoring.',
      rooms: 'Outpatient Clinic (Ground Floor)',
      doctorsCount: 5,
      color: '#10B981'
    }
  ],

  doctors: [
    {
      id: 'doc-1',
      name: 'Dr. Robert Chen',
      title: 'Chief Cardiologist',
      deptId: 'dept-cardio',
      department: 'Cardiology',
      experience: '14 years',
      rating: 4.9,
      reviewsCount: 142,
      fee: 120,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      email: 'robert.chen@clinicos.health',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      slots: ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
      bio: 'Board-certified cardiologist specializing in interventional cardiology, cardiac arrhythmias, and preventative heart wellness.',
      education: 'Harvard Medical School (MD), Stanford Cardiology Fellowship',
      status: 'Active'
    },
    {
      id: 'doc-2',
      name: 'Dr. Sarah Mitchell',
      title: 'Senior Neurologist',
      deptId: 'dept-neuro',
      department: 'Neurology & Brain Health',
      experience: '11 years',
      rating: 4.85,
      reviewsCount: 98,
      fee: 140,
      avatar: 'https://images.unsplash.com/photo-1594824813589-3543d8a9e224?auto=format&fit=crop&w=400&q=80',
      email: 'sarah.mitchell@clinicos.health',
      availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
      slots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      bio: 'Leading researcher in neurodegenerative disorders, chronic migraine treatment, and cerebrovascular therapy.',
      education: 'Johns Hopkins University (MD, PhD)',
      status: 'Active'
    },
    {
      id: 'doc-3',
      name: 'Dr. Marcus Vance',
      title: 'Orthopedic Surgeon',
      deptId: 'dept-ortho',
      department: 'Orthopedics & Sports Medicine',
      experience: '16 years',
      rating: 4.92,
      reviewsCount: 210,
      fee: 150,
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      email: 'marcus.vance@clinicos.health',
      availableDays: ['Tue', 'Thu', 'Sat'],
      slots: ['08:30 AM', '10:00 AM', '02:30 PM', '04:00 PM'],
      bio: 'Specialist in minimally invasive robotic knee & hip replacement and sports trauma rehabilitation.',
      education: 'Columbia University College of Physicians and Surgeons',
      status: 'Active'
    },
    {
      id: 'doc-4',
      name: 'Dr. Elena Rostova',
      title: 'Pediatric Specialist',
      deptId: 'dept-pedia',
      department: 'Pediatrics & Neonatology',
      experience: '9 years',
      rating: 4.96,
      reviewsCount: 165,
      fee: 95,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      email: 'elena.rostova@clinicos.health',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'],
      bio: 'Dedicated pediatrician focused on holistic child development, early childhood immunization, and pediatric nutrition.',
      education: 'UCSF School of Medicine (MD)',
      status: 'Active'
    },
    {
      id: 'doc-5',
      name: 'Dr. Aisha Patel',
      title: 'Consultant Dermatologist',
      deptId: 'dept-derma',
      department: 'Dermatology & Cosmetology',
      experience: '8 years',
      rating: 4.88,
      reviewsCount: 88,
      fee: 110,
      avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=400&q=80',
      email: 'aisha.patel@clinicos.health',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu'],
      slots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
      bio: 'Expert in clinical dermatology, autoimmune dermatoses, skin cancer screening, and cosmetic laser treatments.',
      education: 'King’s College London (MBBS, MRCP)',
      status: 'Active'
    },
    {
      id: 'doc-6',
      name: 'Dr. Linda Zhao',
      title: 'General Practitioner',
      deptId: 'dept-genmed',
      department: 'General Medicine & Family Practice',
      experience: '12 years',
      rating: 4.9,
      reviewsCount: 310,
      fee: 80,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      email: 'linda.zhao@clinicos.health',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      slots: ['08:00 AM', '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'],
      bio: 'Primary care clinician emphasizing preventative lifestyle medicine, diabetic care, and annual health audits.',
      education: 'Yale School of Medicine (MD)',
      status: 'Active'
    }
  ],

  patients: [
    {
      id: 'pat-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      age: 34,
      gender: 'Male',
      bloodGroup: 'O+',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, San Francisco, CA',
      emergencyContact: 'Emma Morgan (Wife) - +1 (555) 987-6543',
      insurance: {
        provider: 'BlueCross Apex Health',
        policyNumber: 'BC-88942-A',
        validTill: '2027-12-31'
      },
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Mild Hypertension', 'Seasonal Asthma'],
      healthScore: 88,
      vitals: {
        heartRate: 72,
        bloodPressure: '120/80',
        systolic: 120,
        diastolic: 80,
        spo2: 99,
        glucose: 95,
        temperature: 98.6,
        lastUpdated: '10 mins ago'
      },
      vitalsHistory: [
        { date: '2026-08-10', hr: 74, bp: '122/82', spo2: 98, glucose: 98, temp: 98.4 },
        { date: '2026-08-11', hr: 70, bp: '118/78', spo2: 99, glucose: 94, temp: 98.6 },
        { date: '2026-08-12', hr: 76, bp: '125/84', spo2: 98, glucose: 102, temp: 98.7 },
        { date: '2026-08-13', hr: 71, bp: '120/80', spo2: 99, glucose: 95, temp: 98.5 },
        { date: '2026-08-14', hr: 72, bp: '120/80', spo2: 99, glucose: 95, temp: 98.6 }
      ]
    },
    {
      id: 'pat-2',
      name: 'Sophia Williams',
      email: 'sophia.w@example.com',
      age: 29,
      gender: 'Female',
      bloodGroup: 'A+',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 456-7890',
      address: '1204 Pine Ridge Way, Seattle, WA',
      emergencyContact: 'James Williams (Father) - +1 (555) 321-7654',
      insurance: {
        provider: 'Aetna Global Shield',
        policyNumber: 'AET-49102-G',
        validTill: '2027-06-30'
      },
      allergies: ['Sulfa Drugs'],
      chronicConditions: ['Migraine with Aura'],
      healthScore: 92,
      vitals: {
        heartRate: 68,
        bloodPressure: '115/75',
        systolic: 115,
        diastolic: 75,
        spo2: 99,
        glucose: 88,
        temperature: 98.4,
        lastUpdated: '1 hour ago'
      },
      vitalsHistory: [
        { date: '2026-08-10', hr: 68, bp: '116/76', spo2: 99, glucose: 90, temp: 98.4 },
        { date: '2026-08-12', hr: 70, bp: '114/74', spo2: 99, glucose: 87, temp: 98.3 },
        { date: '2026-08-14', hr: 68, bp: '115/75', spo2: 99, glucose: 88, temp: 98.4 }
      ]
    }
  ],

  appointments: [
    {
      id: 'apt-101',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-1',
      doctorName: 'Dr. Robert Chen',
      department: 'Cardiology',
      date: '2026-08-14',
      time: '10:30 AM',
      type: 'Teleconsultation (Video)',
      status: 'Confirmed', // Confirmed, Completed, Cancelled, In-Progress
      symptoms: 'Mild occasional palpitations after cardio workout; routine blood pressure check.',
      fee: 120,
      isTelehealth: true,
      meetingUrl: '#teleconsult-room'
    },
    {
      id: 'apt-102',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-2',
      doctorName: 'Dr. Sarah Mitchell',
      department: 'Neurology & Brain Health',
      date: '2026-08-18',
      time: '02:00 PM',
      type: 'In-Clinic Consultation',
      status: 'Confirmed',
      symptoms: 'Follow-up on tension headaches during work hours.',
      fee: 140,
      isTelehealth: false
    },
    {
      id: 'apt-103',
      patientId: 'pat-2',
      patientName: 'Sophia Williams',
      doctorId: 'doc-2',
      doctorName: 'Dr. Sarah Mitchell',
      department: 'Neurology & Brain Health',
      date: '2026-08-14',
      time: '01:30 PM',
      type: 'Teleconsultation (Video)',
      status: 'Confirmed',
      symptoms: 'Migraine aura frequency review and prophylaxis refill.',
      fee: 140,
      isTelehealth: true
    },
    {
      id: 'apt-104',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-6',
      doctorName: 'Dr. Linda Zhao',
      department: 'General Medicine & Family Practice',
      date: '2026-07-20',
      time: '09:00 AM',
      type: 'In-Clinic Consultation',
      status: 'Completed',
      symptoms: 'Annual comprehensive physical examination.',
      fee: 80,
      isTelehealth: false
    }
  ],

  prescriptions: [
    {
      id: 'rx-501',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-1',
      doctorName: 'Dr. Robert Chen',
      date: '2026-08-14',
      diagnosis: 'Stage 1 Essential Hypertension (Controlled)',
      medicines: [
        {
          name: 'Telmisartan Tablets',
          dosage: '40 mg',
          frequency: 'Once Daily (1-0-0)',
          timing: 'Morning after breakfast',
          duration: '30 Days',
          instructions: 'Take with a full glass of water. Monitor morning resting BP.'
        },
        {
          name: 'Coenzyme Q10 Softgels',
          dosage: '100 mg',
          frequency: 'Once Daily (0-1-0)',
          timing: 'After lunch',
          duration: '60 Days',
          instructions: 'Cardiovascular antioxidant support.'
        }
      ],
      advice: 'Maintain low-sodium dietary intake (<2g/day). Engage in 30 minutes of moderate aerobic exercise 4x weekly.',
      followUp: 'After 30 days or if systolic BP > 140 mmHg',
      signature: 'Dr. Robert Chen, MD, FACC (Digital Sig #CH-88219)'
    }
  ],

  medicationReminders: [
    {
      id: 'med-1',
      patientId: 'pat-1',
      name: 'Telmisartan 40mg',
      time: '08:00 AM',
      slotName: 'Morning',
      taken: true,
      pillCount: 28,
      refillDate: '2026-09-12'
    },
    {
      id: 'med-2',
      patientId: 'pat-1',
      name: 'CoQ10 100mg',
      time: '01:30 PM',
      slotName: 'Afternoon',
      taken: false,
      pillCount: 56,
      refillDate: '2026-10-10'
    },
    {
      id: 'med-3',
      patientId: 'pat-1',
      name: 'Omega-3 EPA/DHA 1000mg',
      time: '08:30 PM',
      slotName: 'Night',
      taken: false,
      pillCount: 42,
      refillDate: '2026-09-25'
    }
  ],

  diagnosticTests: [
    {
      id: 'diag-catalog-1',
      name: '12-Lead High-Precision ECG',
      department: 'Cardiology',
      price: 65,
      turnaround: '2 Hours',
      description: 'Comprehensive electrical cardiac rhythm mapping and ST-segment telemetry.'
    },
    {
      id: 'diag-catalog-2',
      name: 'Comprehensive Metabolic Blood Panel (CMP-14)',
      department: 'Pathology & Lab',
      price: 85,
      turnaround: '6 Hours',
      description: 'Electrolytes, liver enzymes, kidney filtration rate, fasting glucose.'
    },
    {
      id: 'diag-catalog-3',
      name: 'High-Resolution Brain MRI with Contrast',
      department: 'Radiology & Diagnostic Imaging',
      price: 340,
      turnaround: '24 Hours',
      description: 'Multi-planar 3.0 Tesla cerebral scan with volumetric vascular reconstruction.'
    },
    {
      id: 'diag-catalog-4',
      name: 'Lipid Profile & Apolipoprotein-B',
      department: 'Pathology & Lab',
      price: 55,
      turnaround: '4 Hours',
      description: 'Total cholesterol, HDL, LDL-C, Triglycerides, and atherogenic particle count.'
    },
    {
      id: 'diag-catalog-5',
      name: 'Digital Chest X-Ray (PA & Lateral View)',
      department: 'Radiology & Diagnostic Imaging',
      price: 75,
      turnaround: '1 Hour',
      description: 'High-clarity pulmonary field evaluation and cardiothoracic ratio calculation.'
    }
  ],

  diagnosticOrders: [
    {
      id: 'ord-801',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-1',
      doctorName: 'Dr. Robert Chen',
      testName: '12-Lead High-Precision ECG',
      orderedDate: '2026-08-14',
      status: 'Ready', // Sample Collected, Processing, Ready, Approved
      turnaround: 'Completed in 1.4 hrs',
      findings: 'Normal Sinus Rhythm, PR interval 158ms, QRS duration 86ms. No ischemic ST-segment depression or T-wave inversion noted.',
      reportPdf: 'ECG_Telemetry_Report_Morgan_A.pdf',
      imagingPreview: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
      signedBy: 'Dr. Robert Chen, MD'
    },
    {
      id: 'ord-802',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: 'doc-6',
      doctorName: 'Dr. Linda Zhao',
      testName: 'Comprehensive Metabolic Blood Panel (CMP-14)',
      orderedDate: '2026-08-10',
      status: 'Ready',
      turnaround: 'Completed in 3.5 hrs',
      findings: 'Glucose 95 mg/dL (Normal: 70-99). eGFR > 90 mL/min (Optimal). ALT 22 U/L, AST 19 U/L. Serum sodium 140 mEq/L.',
      reportPdf: 'Metabolic_Panel_Morgan_A.pdf',
      imagingPreview: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
      signedBy: 'Dr. Arthur Pendelton, MD (Chief Radiologist)'
    }
  ],

  invoices: [
    {
      id: 'inv-301',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      date: '2026-08-14',
      dueDate: '2026-08-20',
      items: [
        { desc: 'Telehealth Video Consultation - Dr. Robert Chen (Cardiology)', amount: 120 },
        { desc: '12-Lead High-Precision ECG Diagnostic Telemetry', amount: 65 }
      ],
      subtotal: 185,
      insuranceCoverage: 140,
      totalDue: 45,
      status: 'Paid', // Paid, Pending, Overdue
      paymentMethod: 'Apple Pay (Card ending •••• 4242)',
      paidAt: '2026-08-14 10:45 AM',
      transactionId: 'TXN-998412-AP'
    },
    {
      id: 'inv-302',
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      date: '2026-08-18',
      dueDate: '2026-08-25',
      items: [
        { desc: 'Neurology Consultation - Dr. Sarah Mitchell', amount: 140 }
      ],
      subtotal: 140,
      insuranceCoverage: 110,
      totalDue: 30,
      status: 'Pending',
      paymentMethod: 'Not Paid'
    }
  ],

  auditLogs: [
    {
      id: 'log-001',
      timestamp: '2026-08-14 10:46:12',
      user: 'alex.morgan@example.com',
      role: 'PATIENT',
      action: 'PAYMENT_SUCCESS',
      resource: 'Invoice #inv-301',
      ip: '192.168.1.104',
      details: 'Patient processed payment of $45.00 via Apple Pay (Txn #TXN-998412-AP)'
    },
    {
      id: 'log-002',
      timestamp: '2026-08-14 10:35:40',
      user: 'robert.chen@clinicos.health',
      role: 'DOCTOR',
      action: 'PRESCRIPTION_ISSUED',
      resource: 'Prescription #rx-501',
      ip: '10.0.4.18',
      details: 'Issued multi-drug regimen (Telmisartan + CoQ10) for Alex Morgan'
    },
    {
      id: 'log-003',
      timestamp: '2026-08-14 10:30:00',
      user: 'robert.chen@clinicos.health',
      role: 'DOCTOR',
      action: 'TELEHEALTH_SESSION_START',
      resource: 'Appointment #apt-101',
      ip: '10.0.4.18',
      details: 'WebRTC encrypted video room established with patient Alex Morgan'
    },
    {
      id: 'log-004',
      timestamp: '2026-08-14 09:15:22',
      user: 'admin@clinicos.health',
      role: 'ADMIN',
      action: 'DOCTOR_SCHEDULE_UPDATE',
      resource: 'Dr. Sarah Mitchell',
      ip: '10.0.1.2',
      details: 'Added extra slot at 04:30 PM for Neurology Department'
    },
    {
      id: 'log-005',
      timestamp: '2026-08-14 08:45:10',
      user: 'arthur.pendelton@clinicos.health',
      role: 'STAFF_LAB',
      action: 'DIAGNOSTIC_REPORT_UPLOAD',
      resource: 'Order #ord-801',
      ip: '10.0.8.44',
      details: 'Uploaded 12-Lead ECG telemetry report with findings and waveform metrics'
    },
    {
      id: 'log-006',
      timestamp: '2026-08-13 18:20:00',
      user: 'alex.morgan@example.com',
      role: 'PATIENT',
      action: 'APPOINTMENT_BOOKED',
      resource: 'Appointment #apt-101',
      ip: '192.168.1.104',
      details: 'Booked Cardiology Teleconsultation with Dr. Robert Chen'
    }
  ],

  aiTriageKnowledge: {
    symptomCategories: [
      { id: 'chest', label: 'Chest & Heart (Palpitations, Tightness, Shortness of Breath)', deptId: 'dept-cardio', urgency: 'High', urgencyColor: '#EF4444' },
      { id: 'head', label: 'Head & Brain (Migraine, Dizziness, Numbness, Memory)', deptId: 'dept-neuro', urgency: 'Moderate', urgencyColor: '#F59E0B' },
      { id: 'joint', label: 'Joints & Bones (Knee pain, Backache, Fracture, Muscle strain)', deptId: 'dept-ortho', urgency: 'Low', urgencyColor: '#10B981' },
      { id: 'child', label: 'Child Health (Fever in infant, Rash, Ear pain, Growth check)', deptId: 'dept-pedia', urgency: 'Moderate', urgencyColor: '#F59E0B' },
      { id: 'skin', label: 'Skin & Hair (Persistent rash, Mole change, Acne, Hives)', deptId: 'dept-derma', urgency: 'Low', urgencyColor: '#10B981' },
      { id: 'fever', label: 'General / Infection (High fever, Fatigue, Cough, Cold)', deptId: 'dept-genmed', urgency: 'Low', urgencyColor: '#10B981' }
    ],
    redFlagKeywords: ['crushing chest pain', 'loss of consciousness', 'slurred speech', 'facial drooping', 'sudden weakness', 'uncontrolled bleeding']
  },

  newborns: [
    {
      id: 'baby-001',
      parentId: 'pat-1',
      parentName: 'Alex Morgan',
      motherName: 'Elena Morgan',
      fatherName: 'Alex Morgan',
      babyName: 'Liam Morgan',
      gender: 'Male',
      dob: '2026-06-15',
      birthWeight: '3.4 kg',
      bloodGroup: 'O+',
      deliveryPlace: 'ClinicOS Central Maternity Wing',
      address: '742 Evergreen Terrace, New Delhi 110001',
      phone: '+91 98765 43210',
      registrationType: 'Online Parental Self-Registration',
      status: 'Up to Date',
      vaccines: [
        { name: 'BCG (Tuberculosis)', ageDue: 'At Birth', dateAdministered: '2026-06-15', status: 'Completed', batchNo: 'BCG-2026-X8' },
        { name: 'OPV-0 (Oral Polio)', ageDue: 'At Birth', dateAdministered: '2026-06-15', status: 'Completed', batchNo: 'OPV-0912' },
        { name: 'Hepatitis B (Birth Dose)', ageDue: 'At Birth', dateAdministered: '2026-06-15', status: 'Completed', batchNo: 'HEPB-774' },
        { name: 'Pentavalent-1 (DTP-HepB-Hib)', ageDue: '6 Weeks', dateAdministered: '2026-07-28', status: 'Completed', batchNo: 'PENTA-104' },
        { name: 'Rotavirus-1 (Diarrhea Prevention)', ageDue: '6 Weeks', dateAdministered: '2026-07-28', status: 'Completed', batchNo: 'ROTA-441' },
        { name: 'IPV-1 (Injectable Polio)', ageDue: '6 Weeks', dateAdministered: '2026-07-28', status: 'Completed', batchNo: 'IPV-882' },
        { name: 'Pentavalent-2', ageDue: '10 Weeks', dateAdministered: 'Scheduled for Aug 25', status: 'Upcoming', batchNo: '-' },
        { name: 'Rotavirus-2', ageDue: '10 Weeks', dateAdministered: 'Scheduled for Aug 25', status: 'Upcoming', batchNo: '-' },
        { name: 'Pentavalent-3', ageDue: '14 Weeks', dateAdministered: 'Due Sept 2026', status: 'Pending', batchNo: '-' },
        { name: 'MMR-1 / MR-1 (Measles-Rubella)', ageDue: '9 Months', dateAdministered: 'Due March 2027', status: 'Pending', batchNo: '-' }
      ]
    },
    {
      id: 'baby-002',
      parentId: 'pat-2',
      parentName: 'Priya Sharma',
      motherName: 'Priya Sharma',
      fatherName: 'Rohan Sharma',
      babyName: 'Aanya Sharma',
      gender: 'Female',
      dob: '2026-08-01',
      birthWeight: '3.1 kg',
      bloodGroup: 'B+',
      deliveryPlace: 'ClinicOS Healthcare Pavilion',
      address: 'Sector 14, Dwarka, New Delhi 110075',
      phone: '+91 98111 22334',
      registrationType: 'Online Parental Self-Registration',
      status: 'Due for 6 Weeks Dose',
      vaccines: [
        { name: 'BCG (Tuberculosis)', ageDue: 'At Birth', dateAdministered: '2026-08-01', status: 'Completed', batchNo: 'BCG-2026-Y2' },
        { name: 'OPV-0 (Oral Polio)', ageDue: 'At Birth', dateAdministered: '2026-08-01', status: 'Completed', batchNo: 'OPV-0934' },
        { name: 'Hepatitis B (Birth Dose)', ageDue: 'At Birth', dateAdministered: '2026-08-01', status: 'Completed', batchNo: 'HEPB-790' },
        { name: 'Pentavalent-1 (DTP-HepB-Hib)', ageDue: '6 Weeks', dateAdministered: 'Due Sept 12', status: 'Upcoming', batchNo: '-' },
        { name: 'Rotavirus-1', ageDue: '6 Weeks', dateAdministered: 'Due Sept 12', status: 'Upcoming', batchNo: '-' },
        { name: 'IPV-1 (Injectable Polio)', ageDue: '6 Weeks', dateAdministered: 'Due Sept 12', status: 'Upcoming', batchNo: '-' }
      ]
    }
  ],

  vaccineCatalog: [
    { name: 'BCG', targetDisease: 'Tuberculosis', scheduleAge: 'At Birth', type: 'Intradermal' },
    { name: 'OPV (Oral Polio Vaccine)', targetDisease: 'Poliomyelitis', scheduleAge: 'Birth, 6, 10, 14 Weeks', type: 'Oral Drops' },
    { name: 'Hepatitis B', targetDisease: 'Hepatitis B Infection', scheduleAge: 'Birth, 6, 10, 14 Weeks', type: 'Intramuscular' },
    { name: 'Pentavalent (DTP-HepB-Hib)', targetDisease: 'Diphtheria, Pertussis, Tetanus, HepB, Hib', scheduleAge: '6, 10, 14 Weeks', type: 'Intramuscular' },
    { name: 'Rotavirus Vaccine', targetDisease: 'Rotaviral Diarrhea', scheduleAge: '6, 10, 14 Weeks', type: 'Oral Drops' },
    { name: 'IPV (Inactivated Polio)', targetDisease: 'Polio Booster', scheduleAge: '6, 14 Weeks', type: 'Intradermal' },
    { name: 'PCV (Pneumococcal)', targetDisease: 'Pneumonia & Meningitis', scheduleAge: '6, 14 Weeks, 9 Months', type: 'Intramuscular' },
    { name: 'MR / MMR', targetDisease: 'Measles, Mumps, Rubella', scheduleAge: '9 Months & 16-24 Months', type: 'Subcutaneous' },
    { name: 'DTP Booster', targetDisease: 'Diphtheria, Tetanus, Pertussis', scheduleAge: '16-24 Months & 5-6 Years', type: 'Intramuscular' }
  ]
};

