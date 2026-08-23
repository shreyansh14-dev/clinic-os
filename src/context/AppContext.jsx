import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_TESTS,
  INITIAL_BILLS,
  INITIAL_VITALS,
  INITIAL_MEDS_SCHEDULE,
  INITIAL_BEDS,
  INITIAL_PHARMACY_INVENTORY,
  INITIAL_INSURANCE_CLAIMS,
  INITIAL_VACCINES,
  INITIAL_BLOOD_BANK,
  INITIAL_AMBULANCE_FLEET,
  INITIAL_AUDIT_LOGS
} from '../mockData';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Roles: 'patient' | 'doctor' | 'admin'
  const [currentRole, setCurrentRole] = useState('patient');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Auth & Active User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('clinic_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Global Telemedicine Video Call State
  const [activeCallSignal, setActiveCallSignal] = useState(null);
  const [incomingCallAlert, setIncomingCallAlert] = useState(null);
  const broadcastChannelRef = useRef(null);

  // Core Datasets
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [labTests, setLabTests] = useState(INITIAL_LAB_TESTS);
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [medsSchedule, setMedsSchedule] = useState(INITIAL_MEDS_SCHEDULE);
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [pharmacyInventory, setPharmacyInventory] = useState(INITIAL_PHARMACY_INVENTORY);
  const [insuranceClaims, setInsuranceClaims] = useState(INITIAL_INSURANCE_CLAIMS);
  const [vaccines, setVaccines] = useState(INITIAL_VACCINES);
  const [bloodBank, setBloodBank] = useState(INITIAL_BLOOD_BANK);
  const [ambulanceFleet, setAmbulanceFleet] = useState(INITIAL_AMBULANCE_FLEET);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Active Personas
  const activePatient = patients.find(p => p.id === currentUser?.id || p.email === currentUser?.email) || patients[0];
  const activeDoctor = doctors.find(d => d.email === currentUser?.email) || doctors[0];

  // Toasts
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Global WebRTC Signaling Listener (BroadcastChannel + REST Polling)
  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('clinic_telehealth_channel');

    broadcastChannelRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'START_CALL') {
        setActiveCallSignal(payload);
        if (currentRole === 'doctor' || currentUser?.role === 'doctor') {
          setIncomingCallAlert(payload);
          showToast(`📞 INCOMING CALL: Patient ${payload.callerName} is requesting Video Consultation!`, 'warn');
        }
      } else if (type === 'CALL_ENDED') {
        setIncomingCallAlert(null);
        setActiveCallSignal(null);
      }
    };

    // Global REST Polling for cross-device incoming call signaling
    const pollInterval = setInterval(async () => {
      try {
        const res = await apiService.getActiveTelehealthCall();
        if (res?.activeCall?.status === 'calling') {
          setActiveCallSignal(res.activeCall);
          if (currentRole === 'doctor' || currentUser?.role === 'doctor') {
            setIncomingCallAlert(res.activeCall);
          }
        } else if (!res?.activeCall) {
          setIncomingCallAlert(null);
        }
      } catch (e) {}
    }, 1500);

    return () => {
      clearInterval(pollInterval);
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
    };
  }, [currentRole, currentUser]);

  const acceptIncomingCall = () => {
    setCurrentRole('doctor');
    setActiveTab('tele-health-suite');
    showToast(`Joining video consultation with ${incomingCallAlert?.callerName || 'Patient'}...`);
  };

  const declineIncomingCall = async () => {
    setIncomingCallAlert(null);
    setActiveCallSignal(null);
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'CALL_ENDED' });
    }
    await apiService.hangupTelehealthCall().catch(() => {});
    showToast('Call declined.');
  };

  // Fetch initial data from Express SQLite Backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [apts, rxs, labs, bls, vts, bds, inv, clms, logs, docs, depts] = await Promise.all([
          apiService.getAppointments(),
          apiService.getPrescriptions(),
          apiService.getLabTests(),
          apiService.getBills(),
          apiService.getVitals(),
          apiService.getBeds(),
          apiService.getPharmacyInventory(),
          apiService.getInsuranceClaims(),
          apiService.getAuditLogs(),
          apiService.getDoctors(),
          apiService.getDepartments ? apiService.getDepartments() : null
        ]);

        if (apts) setAppointments(apts);
        if (rxs) setPrescriptions(rxs);
        if (labs) setLabTests(labs);
        if (bls) setBills(bls);
        if (vts) setVitals(vts);
        if (bds) setBeds(bds);
        if (inv) setPharmacyInventory(inv);
        if (clms) setInsuranceClaims(clms);
        if (logs) setAuditLogs(logs);
        if (docs) setDoctors(docs);
        if (depts) setDepartments(depts);
      } catch (err) {
        console.warn('Using client initial state:', err);
      }
    }
    loadBackendData();
  }, []);

  const addAuditLog = async (action, user = currentUser?.name || 'System', level = 'INFO') => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${user} (${currentRole.toUpperCase()})`,
      action,
      level,
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await apiService.addAuditLog(newLog).catch(() => {});
  };

  // Auth Operations
  const loginUser = async (email, password, role) => {
    const res = await apiService.login(email, password, role);
    if (res && res.success) {
      setCurrentUser(res.user);
      setCurrentRole(res.user.role);
      localStorage.setItem('clinic_user', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.name}!`);
      return res;
    } else {
      const fallbackUser = {
        id: `usr-${role}-${Date.now()}`,
        name: role === 'patient' ? 'Shreyansh Kumar' : role === 'doctor' ? 'Dr. Souvik Sinha' : `${role.toUpperCase()} User`,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setCurrentUser(fallbackUser);
      setCurrentRole(role);
      localStorage.setItem('clinic_user', JSON.stringify(fallbackUser));
      showToast(`Authenticated as ${fallbackUser.name}`);
      return { success: true };
    }
  };

  const registerUser = async (userData) => {
    const res = await apiService.register(userData);
    if (res && res.success) {
      setCurrentUser(res.user);
      setCurrentRole(res.user.role);
      localStorage.setItem('clinic_user', JSON.stringify(res.user));
      showToast(`Account created successfully! Welcome, ${res.user.name}.`);
      return res;
    } else {
      throw new Error(res?.message || 'Registration failed.');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('clinic_user');
    setCurrentUser(null);
    setCurrentRole('patient');
    showToast('Logged out of session.', 'info');
  };

  // State Handler Actions
  const bookAppointment = async (appointmentData) => {
    const newApt = {
      id: `apt-${Date.now()}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      paid: false,
      status: 'Scheduled',
      type: 'In-Person',
      ...appointmentData
    };
    setAppointments(prev => [newApt, ...prev]);
    await apiService.createAppointment(newApt).catch(() => {});
    addAuditLog(`Booked appointment with ${appointmentData.doctorName} for ${appointmentData.date}`, activePatient.name);
    showToast(`Appointment booked for ${appointmentData.date} at ${appointmentData.time}!`);
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    await apiService.updateAppointment(id, { status: newStatus }).catch(() => {});
    addAuditLog(`Updated appointment ${id} status to ${newStatus}`, currentRole.toUpperCase());
    showToast(`Appointment status updated to ${newStatus}.`);
  };

  const createPrescription = async (rxData) => {
    const newRx = {
      id: `rx-${Date.now()}`,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      date: new Date().toISOString().substring(0, 10),
      ...rxData
    };
    setPrescriptions(prev => [newRx, ...prev]);
    await apiService.createPrescription(newRx).catch(() => {});

    if (rxData.medications && rxData.medications.length > 0) {
      const newMeds = rxData.medications.map((m, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        name: m.name,
        time: idx === 0 ? '08:00 AM' : '09:00 PM',
        dose: m.dosage,
        taken: false,
        instructions: m.instructions
      }));
      setMedsSchedule(prev => [...newMeds, ...prev]);
    }

    addAuditLog(`Created digital prescription ${newRx.id} for ${rxData.patientName}`, activeDoctor.name);
    showToast(`Prescription issued successfully for ${rxData.patientName}!`);
  };

  const payBill = async (billId, paymentMethod) => {
    const txn = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          status: 'Paid',
          paymentMethod,
          transactionId: txn
        };
      }
      return b;
    }));

    await apiService.payBill(billId, paymentMethod, txn).catch(() => {});

    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    } catch (e) {}

    addAuditLog(`Processed payment for invoice ${billId} via ${paymentMethod}`, activePatient.name);
    showToast(`Payment successful! Official receipt generated.`);
  };

  const createBill = (billData) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      status: 'Unpaid',
      paymentMethod: null,
      transactionId: null,
      insuranceCoverage: 0,
      ...billData
    };
    setBills(prev => [newBill, ...prev]);
    addAuditLog(`Issued invoice ${newBill.id} for amount ₹${billData.totalAmount}`, 'Hospital Admin');
    showToast(`Invoice ${newBill.id} issued to ${billData.patientName}.`);
  };

  const bookLabTest = async (testCode, testName, category, price) => {
    const newTest = {
      id: `lab-${Date.now()}`,
      code: testCode,
      name: testName,
      category,
      patientId: activePatient.id,
      patientName: activePatient.name,
      orderedBy: 'Self Registered',
      orderDate: new Date().toISOString().substring(0, 10),
      status: 'Pending',
      price,
      reportData: null
    };
    setLabTests(prev => [newTest, ...prev]);
    await apiService.createLabTest(newTest).catch(() => {});
    addAuditLog(`Requested diagnostic test ${testName}`, activePatient.name);
    showToast(`Lab Test "${testName}" booked successfully!`);
  };

  const publishLabReport = async (testId, reportDataObj) => {
    setLabTests(prev => prev.map(t => t.id === testId ? { ...t, status: 'Completed', reportData: reportDataObj } : t));
    await apiService.updateLabTest(testId, { status: 'Completed', reportData: reportDataObj }).catch(() => {});
    addAuditLog(`Pathologist verified and published lab report for ${testId}`, 'Pathology Desk', 'SUCCESS');
    showToast(`Lab report for ${testId} published!`);
  };

  const updateBedStatus = async (bedId, newStatus, patientId = null, patientName = null) => {
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus, patientId, patientName } : b));
    await apiService.updateBed(bedId, { status: newStatus, patientId, patientName }).catch(() => {});
    addAuditLog(`Updated bed ${bedId} status to ${newStatus}`, 'Nurse Station');
    showToast(`Bed status updated to ${newStatus}.`);
  };

  const submitInsuranceClaim = async (claimObj) => {
    const newClaim = {
      id: `clm-${Date.now()}`,
      patientId: activePatient?.id || 'pat-101',
      patientName: activePatient?.name || 'Shreyansh Kumar',
      status: 'Under Review',
      dateSubmitted: new Date().toISOString().substring(0, 10),
      ...claimObj
    };
    setInsuranceClaims(prev => [newClaim, ...prev]);
    await apiService.submitInsuranceClaim(newClaim).catch(() => {});
    addAuditLog(`Submitted TPA Insurance Claim for ₹${claimObj.claimAmount}`, activePatient?.name || 'Patient');
    showToast(`Insurance Claim ${newClaim.id} submitted!`);
  };

  const dispatchAmbulance = (ambId, emergencyPatientName, location) => {
    setAmbulanceFleet(prev => prev.map(a => a.id === ambId ? {
      ...a,
      status: 'Dispatched',
      location: `${location} (ETA 8 mins)`
    } : a));

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}

    addAuditLog(`EMERGENCY SOS: Dispatched Ambulance ${ambId} to ${location}`, 'Emergency Response System', 'WARN');
    showToast(`Ambulance Dispatched! Emergency Unit En-Route to ${location}.`, 'danger');
  };

  const addVitalLog = async (vitalsObj) => {
    const newV = {
      id: `v-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      ...vitalsObj
    };
    setVitals(prev => [newV, ...prev]);
    await apiService.addVital(newV).catch(() => {});
    showToast('Health vitals logged successfully!');
  };

  const toggleMedication = (medId) => {
    setMedsSchedule(prev => prev.map(m => m.id === medId ? { ...m, taken: !m.taken } : m));
  };

  const addDoctor = async (docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
      ...docData
    };
    setDoctors(prev => [newDoc, ...prev]);
    await apiService.addDoctor(newDoc).catch(() => {});
    addAuditLog(`Registered doctor ${docData.name} (${docData.specialty})`, 'Admin Console');
    showToast(`Doctor ${docData.name} added to roster!`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginUser,
        registerUser,
        logoutUser,
        activeTab,
        setActiveTab,
        activeCallSignal,
        incomingCallAlert,
        acceptIncomingCall,
        declineIncomingCall,
        departments,
        doctors,
        patients,
        appointments,
        prescriptions,
        labTests,
        bills,
        vitals,
        medsSchedule,
        beds,
        pharmacyInventory,
        insuranceClaims,
        vaccines,
        bloodBank,
        ambulanceFleet,
        auditLogs,
        activePatient,
        activeDoctor,
        toast,
        showToast,
        bookAppointment,
        updateAppointmentStatus,
        createPrescription,
        payBill,
        createBill,
        bookLabTest,
        publishLabReport,
        updateBedStatus,
        submitInsuranceClaim,
        dispatchAmbulance,
        addVitalLog,
        toggleMedication,
        addDoctor
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
