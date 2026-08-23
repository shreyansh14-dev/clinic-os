import { runQuery, getQuery, initTables } from './db.js';

export const seedDatabase = async () => {
  await initTables();

  // Clear & Re-seed to ensure all 160 doctors get 100% unique photo URLs
  await runQuery('DELETE FROM doctors').catch(() => {});
  await runQuery('DELETE FROM departments').catch(() => {});

  console.log('Seeding ClinicOS database with 160 doctors across 16 departments (Unique Photos)...');

  // Seed Users
  const userCount = await getQuery('SELECT count(*) as count FROM users').catch(() => null);
  if (!userCount || userCount.count === 0) {
    const users = [
      {
        id: 'usr-pat-1',
        name: 'Shreyansh Kumar',
        email: 'patient@clinicos.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91 91234 56789',
        specialty: null,
        department: null,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-doc-1',
        name: 'Dr. Souvik Sinha',
        email: 'doctor@clinicos.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+91 98765 43210',
        specialty: 'Cardiology',
        department: 'Cardiology',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      }
    ];

    for (const u of users) {
      await runQuery(
        `INSERT INTO users (id, name, email, password, role, phone, specialty, department, avatar, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.password, u.role, u.phone, u.specialty, u.department, u.avatar, u.createdAt]
      ).catch(() => {});
    }
  }

  // Seed 16 Departments
  const departments = [
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

  for (const d of departments) {
    await runQuery(
      `INSERT INTO departments (id, name, icon, doctorCount, description, fee)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.id, d.name, d.icon, d.doctorCount, d.description, d.fee]
    ).catch(() => {});
  }

  // Seed 160 Doctors (10 Per Department) with 100% UNIQUE Photos
  const maleFirstNames = ['Souvik', 'Arjun', 'Kunal', 'Tuhin', 'Henry', 'Rajesh', 'Alok', 'Rohan', 'Pradeep', 'Vikramaditya', 'Arvind', 'Kaushik', 'Sanjay', 'Tarun', 'Vivek', 'Manish', 'Nikhil', 'Gaurav', 'Abhishek', 'Siddharth'];
  const femaleFirstNames = ['Ananya', 'Ritu', 'Priya', 'Shalini', 'Neha', 'Meera', 'Deepa', 'Pooja', 'Kavita', 'Sunita', 'Divya', 'Swaroop', 'Smriti', 'Radhika', 'Nandini', 'Ishita', 'Sonam', 'Preeti', 'Bhavna', 'Archana'];
  const lastNames = ['Sinha', 'Sharma', 'Sarkar', 'Banerjee', 'D\'Souza', 'Roy', 'Kapoor', 'Verma', 'Nambiar', 'Menon', 'Kulkarni', 'Nath', 'Joshi', 'Rao', 'Vasudevan', 'Sen', 'Mukherjee', 'Chawla', 'Bhatia', 'Malhotra', 'Gupta', 'Patel', 'Saxena'];
  const titles = ['Senior Consultant', 'Chief Specialist', 'Associate Director', 'Lead Specialist', 'Consultant', 'Clinical Director', 'Principal Specialist', 'Senior Surgeon', 'Department Head', 'Visiting Specialist'];

  let globalDocIdx = 1;

  for (const dept of departments) {
    const deptNum = parseInt(dept.id.replace('dept-', ''));
    for (let idx = 0; idx < 10; idx++) {
      const isFemale = idx % 2 === 1;
      const fn = isFemale
        ? femaleFirstNames[(idx * 3 + deptNum) % femaleFirstNames.length]
        : maleFirstNames[(idx * 3 + deptNum) % maleFirstNames.length];
      const ln = lastNames[(idx * 2 + deptNum) % lastNames.length];
      const title = titles[idx % titles.length];

      const docId = `doc-${deptNum}-${idx + 1}`;
      const docName = `Dr. ${fn} ${ln}`;
      const spec = `${title} - ${dept.name}`;
      const exp = `${8 + (idx * 2) % 15}+ Years`;
      const rating = +(4.7 + (idx * 0.03)).toFixed(2);
      const fee = dept.fee + (idx % 3) * 200;
      const avail = idx % 2 === 0 ? 'Mon - Fri (09:00 AM - 04:00 PM)' : 'Tue - Sat (10:00 AM - 05:00 PM)';
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${docId}@clinicos.com`;

      const portraitIndex = (globalDocIdx * 7) % 99 + 1;
      const avatar = isFemale
        ? `https://randomuser.me/api/portraits/med/women/${portraitIndex}.jpg`
        : `https://randomuser.me/api/portraits/med/men/${portraitIndex}.jpg`;

      await runQuery(
        `INSERT INTO doctors (id, name, specialty, deptId, department, rating, experience, phone, email, availableDays, availability, fee, consultationFee, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [docId, docName, spec, dept.id, dept.name, rating, exp, `+91 987${idx}5 ${deptNum}00`, email, avail, avail, fee, fee, avatar]
      ).catch(() => {});

      globalDocIdx++;
    }
  }

  console.log('Database successfully seeded with 160 doctors with 100% unique photos!');
};
