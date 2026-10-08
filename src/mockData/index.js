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
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_APPOINTMENTS = [];
export const INITIAL_PRESCRIPTIONS = [];
export const INITIAL_LAB_TESTS = [];
export const INITIAL_BILLS = [];
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
export const INITIAL_AUDIT_LOGS = [];
