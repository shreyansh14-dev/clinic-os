import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AuthPortal } from './components/auth/AuthPortal';

// Patient Components
import { PatientDashboard } from './components/patient/PatientDashboard';
import { BookAppointmentModal } from './components/patient/BookAppointmentModal';
import { BookingConfirmationPage } from './components/patient/BookingConfirmationPage';
import { MyAppointments } from './components/patient/MyAppointments';
import { MedicalRecords } from './components/patient/MedicalRecords';
import { DiagnosticTests } from './components/patient/DiagnosticTests';
import { PatientBills } from './components/patient/PatientBills';
import { HealthTracker } from './components/patient/HealthTracker';
import { MyMeds } from './components/patient/MyMeds';
import { AISymptomAssistant } from './components/patient/AISymptomAssistant';
import { InsuranceClaims } from './components/patient/InsuranceClaims';
import { LabTestAtHome } from './components/patient/LabTestAtHome';
import { EmergencySOS } from './components/patient/EmergencySOS';
import { VaccineTracker } from './components/patient/VaccineTracker';
import { VaccineRegistration } from './components/patient/VaccineRegistration';
import { InpatientRoom } from './components/patient/InpatientRoom';
import { TelemedicineCall } from './components/patient/TelemedicineCall';
import { PharmacyStore } from './components/patient/PharmacyStore';

// Doctor Components
import { DoctorConsole } from './components/doctor/DoctorConsole';
import { DoctorAppointments } from './components/doctor/DoctorAppointments';
import { DoctorPatients } from './components/doctor/DoctorPatients';
import { EMRTimeline } from './components/doctor/EMRTimeline';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageDoctors } from './components/admin/ManageDoctors';
import { ManageDepartments } from './components/admin/ManageDepartments';
import { SystemInvoices } from './components/admin/SystemInvoices';
import { AuditLogs } from './components/admin/AuditLogs';
import { BedManagement } from './components/admin/BedManagement';
import { InsuranceApprovals } from './components/admin/InsuranceApprovals';
import { BloodBankManager } from './components/admin/BloodBankManager';
import { AmbulanceFleet } from './components/admin/AmbulanceFleet';

const MainRoutes = () => {
  const { currentRole, appointments } = useApp();
  const location = useLocation();
  const stateAppointment = location.state?.appointment;

  return (
    <main className="content-area">
      <Routes>
        {/* Patient Routes */}
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/book-appointment" element={<BookAppointmentModal />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationPage appointment={stateAppointment || appointments[0]} />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/lab-tests" element={<LabTestAtHome />} />
        <Route path="/medicine-store" element={<PharmacyStore />} />
        <Route path="/pharmacy-inventory" element={<PharmacyStore />} />
        <Route path="/pharmacy-store" element={<PharmacyStore />} />
        <Route path="/buy-medicines" element={<PharmacyStore />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/diagnostic-tests" element={<DiagnosticTests />} />
        <Route path="/bills" element={<PatientBills />} />
        <Route path="/insurance-claims" element={<InsuranceClaims />} />
        <Route path="/inpatient-room" element={<InpatientRoom />} />
        <Route path="/health-tracker" element={<HealthTracker />} />
        <Route path="/my-meds" element={<MyMeds />} />
        <Route path="/vaccines" element={<VaccineTracker />} />
        <Route path="/vaccine-registration" element={<VaccineRegistration />} />
        <Route path="/book-vaccine" element={<VaccineRegistration />} />
        <Route path="/register-vaccine" element={<VaccineRegistration />} />
        <Route path="/ai-assistant" element={<AISymptomAssistant />} />
        <Route path="/emergency-sos" element={<EmergencySOS />} />
        <Route path="/video-call" element={<TelemedicineCall />} />
        <Route path="/symptom-assistant" element={<AISymptomAssistant />} />

        {/* Doctor Routes */}
        <Route path="/doctor-console" element={<DoctorConsole />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/emr-timeline" element={<EMRTimeline />} />
        <Route path="/create-prescription" element={<DoctorConsole />} />
        <Route path="/ipd-rounds" element={<InpatientRoom />} />
        <Route path="/lab-tests-review" element={<DiagnosticTests />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bed-management" element={<BedManagement />} />
        <Route path="/insurance-approvals" element={<InsuranceApprovals />} />
        <Route path="/manage-doctors" element={<ManageDoctors />} />
        <Route path="/manage-departments" element={<ManageDepartments />} />
        <Route path="/system-invoices" element={<SystemInvoices />} />
        <Route path="/blood-bank" element={<BloodBankManager />} />
        <Route path="/ambulance-fleet" element={<AmbulanceFleet />} />
        <Route path="/audit-logs" element={<AuditLogs />} />

        {/* Fallback Route */}
        <Route path="*" element={<PatientDashboard />} />
      </Routes>
    </main>
  );
};

const AppContent = () => {
  const { currentUser, currentRole } = useApp();
  const location = useLocation();

  if (!currentUser || location.pathname === '/login') {
    return <AuthPortal />;
  }

  const isPatient = currentRole === 'patient';

  return (
    <div className={`app-container ${isPatient ? 'patient-portal-layout' : ''}`}>
      {!isPatient && <Sidebar />}
      <div className={`main-wrapper ${isPatient ? 'patient-main-wrapper' : ''}`}>
        <Header />
        <MainRoutes />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
