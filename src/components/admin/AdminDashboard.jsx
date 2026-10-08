import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InvoicePrintModal } from '../common/InvoicePrintModal';
import {
  Building2, Users, Stethoscope, Clock, Receipt, ShieldCheck,
  Plus, Trash2, Sparkles, Activity, CalendarCheck2, Bed,
  Droplet, Ambulance, TrendingUp, AlertCircle, ChevronRight,
  IndianRupee, MapPin, CheckCircle2, Siren, ShieldAlert,
  Search, Filter, Phone, Mail, Star, Check, X, Printer,
  Calendar, FileText, BarChart3, Settings, Lock, Key,
  RefreshCw, Download, FileSpreadsheet, Eye, AlertTriangle,
  UserCheck, Shield, ChevronDown, CheckSquare, ArrowRight,
  Sliders, Database, Server, Smartphone, ExternalLink, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard = () => {
  const {
    currentRole,
    setCurrentRole,
    patients,
    doctors,
    appointments,
    bills,
    labTests,
    beds,
    insuranceClaims,
    ambulanceFleet,
    bloodBank,
    auditLogs,
    departments,
    addDoctor,
    deleteDoctor,
    updateBedStatus,
    approveInsuranceClaim,
    payBill,
    createBill,
    updateAppointmentStatus,
    rescheduleAppointment,
    addAuditLog,
    showToast
  } = useApp();

  // Active step in the 8-step workflow
  const [activeStepTab, setActiveStepTab] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Modals & State for Step 2: Manage Doctors & Departments
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [newDocName, setNewDocName] = useState('Dr. Arvind Narayanan');
  const [newDocDeptId, setNewDocDeptId] = useState(departments[0]?.id || 'dept-1');
  const [newDocExp, setNewDocExp] = useState('12+ Years');
  const [newDocFee, setNewDocFee] = useState('2200');
  const [newDocSchedule, setNewDocSchedule] = useState('Mon - Fri (10:00 AM - 04:00 PM)');
  const [newDocPhone, setNewDocPhone] = useState('+91 98200 12345');
  const [newDocEmail, setNewDocEmail] = useState('arvind.n@clinicos.com');
  const [newDocAvatar, setNewDocAvatar] = useState('/images/doctors/indian_doc_m1.jpg');

  // State for Step 3: Manage Patients & Appointments
  const [patientSearch, setPatientSearch] = useState('');
  const [appointmentDirectorySearch, setAppointmentDirectorySearch] = useState('');
  const [appointmentDirectoryStatus, setAppointmentDirectoryStatus] = useState('All');

  // State for Step 4: Approve / Reschedule Appointments
  const [triageFilter, setTriageFilter] = useState('Pending');
  const [rescheduleModalAppointment, setRescheduleModalAppointment] = useState(null);
  const [rescheduleNewDate, setRescheduleNewDate] = useState(new Date(Date.now() + 86400000).toISOString().substring(0, 10));
  const [rescheduleNewTime, setRescheduleNewTime] = useState('11:30 AM');
  const [rescheduleDoctorName, setRescheduleDoctorName] = useState('');

  // State for Step 5: Manage Bills & Payments
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [billPatientId, setBillPatientId] = useState(patients[0]?.id || 'pat-101');
  const [billDesc, setBillDesc] = useState('Executive Health Checkup & Comprehensive Diagnostics');
  const [billAmount, setBillAmount] = useState('3500');

  // State for Step 6: Generate Reports
  const [reportCategory, setReportCategory] = useState('revenue');
  const [reportTimeframe, setReportTimeframe] = useState('month');
  const [isExportingReport, setIsExportingReport] = useState(false);

  // State for Step 7: Monitor Audit Logs
  const [auditSearch, setAuditSearch] = useState('');
  const [auditLevelFilter, setAuditLevelFilter] = useState('ALL');

  // State for Step 8: System Configuration
  const [hospitalName, setHospitalName] = useState('Apollo Multispeciality Hospital');
  const [facilityAddress, setFacilityAddress] = useState('Sector 7, Navi Mumbai, Maharashtra 400614');
  const [emergencyHotline, setEmergencyHotline] = useState('108 / +91 22 2771 9000');
  const [morningShiftHours, setMorningShiftHours] = useState('09:00 AM - 01:00 PM');
  const [eveningShiftHours, setEveningShiftHours] = useState('04:00 PM - 08:00 PM');
  const [maxSlotsPerDoctor, setMaxSlotsPerDoctor] = useState('25');
  const [autoApproveBookings, setAutoApproveBookings] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isBackingUpDb, setIsBackingUpDb] = useState(false);

  // Synchronize role on mount
  useEffect(() => {
    if (currentRole !== 'admin') {
      setCurrentRole('admin');
    }
  }, [currentRole, setCurrentRole]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Metrics
  const totalPatients = patients.length || 142;
  const totalDoctors = doctors.length || 24;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending' || a.status === 'Pending Approval' || !a.status);
  const scheduledAppointments = appointments.filter(a => a.status === 'Scheduled');
  const rescheduledAppointments = appointments.filter(a => a.status === 'Rescheduled');
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (b.totalAmount || 0), 0) || 847200;
  const unpaidBillsCount = bills.filter(b => b.status === 'Unpaid').length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / (beds.length || 1)) * 100);
  const pendingClaims = insuranceClaims.filter(c => c.status === 'Under Review').length;

  // Step 2: Add Doctor
  const handleAddDoctorSubmit = (e) => {
    e.preventDefault();
    const deptObj = departments.find(d => d.id === newDocDeptId) || departments[0];
    addDoctor({
      name: newDocName,
      specialty: deptObj.name,
      deptId: newDocDeptId,
      experience: newDocExp,
      fee: parseFloat(newDocFee),
      consultationFee: parseFloat(newDocFee),
      availability: newDocSchedule,
      phone: newDocPhone,
      email: newDocEmail,
      avatar: newDocAvatar
    });
    setShowAddDoctorModal(false);
    showToast(`Doctor ${newDocName} added to roster and department!`);
  };

  // Step 4: Approve appointment
  const handleApproveAppointment = (aptId) => {
    updateAppointmentStatus(aptId, 'Scheduled');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
    showToast(`Appointment ${aptId} approved & confirmed on doctor roster!`);
  };

  // Step 4: Open reschedule modal
  const handleOpenRescheduleModal = (apt) => {
    setRescheduleModalAppointment(apt);
    setRescheduleNewDate(apt.date || new Date().toISOString().substring(0, 10));
    setRescheduleNewTime(apt.time || '11:00 AM');
    setRescheduleDoctorName(apt.doctorName || doctors[0]?.name);
  };

  // Step 4: Submit reschedule
  const handleSubmitReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleModalAppointment) return;
    if (rescheduleAppointment) {
      rescheduleAppointment(
        rescheduleModalAppointment.id,
        rescheduleNewDate,
        rescheduleNewTime,
        rescheduleDoctorName
      );
    } else {
      updateAppointmentStatus(rescheduleModalAppointment.id, 'Rescheduled');
    }
    setRescheduleModalAppointment(null);
    showToast(`Appointment rescheduled to ${rescheduleNewDate} at ${rescheduleNewTime}!`);
  };

  // Step 5: Create Bill
  const handleCreateBillSubmit = (e) => {
    e.preventDefault();
    const targetPat = patients.find(p => p.id === billPatientId) || patients[0];
    createBill({
      patientId: targetPat.id,
      patientName: targetPat.name,
      description: billDesc,
      totalAmount: parseFloat(billAmount)
    });
    setShowCreateBillModal(false);
    showToast(`Invoice issued for ${targetPat.name} (₹${billAmount})`);
  };

  // Step 6: Generate & Export Report
  const handleGenerateReportPDF = () => {
    setIsExportingReport(true);
    setTimeout(() => {
      setIsExportingReport(false);
      try {
        confetti({ particleCount: 65, spread: 70 });
      } catch (e) {}
      window.print();
    }, 800);
  };

  const handleExportReportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Period\n"
      + `Total Revenue,Rs ${totalRevenue},Oct 2026\n`
      + `Total Consultations,${appointments.length},Oct 2026\n`
      + `Active Doctors,${doctors.length},Current\n`
      + `Bed Occupancy Rate,${occupancyRate}%,Current\n`
      + `Pending Insurance Claims,${pendingClaims},Current\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ClinicOS_Hospital_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Hospital executive report exported to CSV!');
  };

  // Step 8: Backup DB
  const handleRunBackup = () => {
    setIsBackingUpDb(true);
    setTimeout(() => {
      setIsBackingUpDb(false);
      addAuditLog?.('Executed manual system and database snapshot backup', 'SUPER_ADMIN', 'SUCCESS');
      showToast('Database snapshot created successfully! Stored at /backups/clinicos-snap.db');
    }, 1500);
  };

  // Filtered lists
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = !doctorSearch ||
      doc.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || doc.deptId === selectedDeptFilter || doc.specialty?.includes(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  const filteredPatients = patients.filter(p =>
    !patientSearch ||
    p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone?.includes(patientSearch)
  );

  const filteredAppointmentsDirectory = appointments.filter(a => {
    const matchesSearch = !appointmentDirectorySearch ||
      a.patientName?.toLowerCase().includes(appointmentDirectorySearch.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(appointmentDirectorySearch.toLowerCase()) ||
      a.id?.toLowerCase().includes(appointmentDirectorySearch.toLowerCase());
    const matchesStatus = appointmentDirectoryStatus === 'All' || a.status === appointmentDirectoryStatus;
    return matchesSearch && matchesStatus;
  });

  const triageAppointments = appointments.filter(a => {
    if (triageFilter === 'Pending') {
      return a.status === 'Pending' || a.status === 'Pending Approval' || !a.status;
    }
    if (triageFilter === 'Scheduled') return a.status === 'Scheduled';
    if (triageFilter === 'Rescheduled') return a.status === 'Rescheduled';
    return true;
  });

  const filteredBills = bills.filter(b => {
    const matchesSearch = !invoiceSearch ||
      b.patientName?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.id?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.description?.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'All' || b.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAuditLogs = auditLogs.filter(l => {
    const matchesSearch = !auditSearch ||
      l.user?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.level?.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesLevel = auditLevelFilter === 'ALL' || l.level === auditLevelFilter;
    return matchesSearch && matchesLevel;
  });

  // Flowchart steps matching the user's diagram
  const adminSteps = [
    { num: 1, label: 'Login', icon: Lock, targetId: 'admin-step-1', desc: 'Authority Credentials & 2FA' },
    { num: 2, label: 'Manage Doctors & Departments', icon: Users, targetId: 'admin-step-2', desc: 'Roster & Speciality Quotas' },
    { num: 3, label: 'Manage Patients & Appointments', icon: Calendar, targetId: 'admin-step-3', desc: 'Master EMR & Registry' },
    { num: 4, label: 'Approve / Reschedule Appointments', icon: CalendarCheck2, targetId: 'admin-step-4', desc: 'Triage Desk & Reschedule' },
    { num: 5, label: 'Manage Bills & Payments', icon: Receipt, targetId: 'admin-step-5', desc: 'Invoices & TPA Settlements' },
    { num: 6, label: 'Generate Reports', icon: BarChart3, targetId: 'admin-step-6', desc: 'Revenue & Occupancy Dossier' },
    { num: 7, label: 'Monitor Audit Logs', icon: ShieldAlert, targetId: 'admin-step-7', desc: 'Security Incident Stream' },
    { num: 8, label: 'System Configuration', icon: Settings, targetId: 'admin-step-8', desc: 'Hospital Operations & OP Rules' }
  ];

  return (
    <div className="w-full bg-white text-[#16163B] font-['Poppins'] selection:bg-[#242454] selection:text-white relative space-y-7 pb-24">

      {/* ─────────────────────────────────────────────────────────────
          1. HERO AUTHORITY BANNER (Matching Patient & Doctor Panel Hero)
          Deep-Indigo Background (#242454) + Admin Authority Theme
          ───────────────────────────────────────────────────────────── */}
      <section id="admin-hero-section" className="w-full px-5 sm:px-8 pt-4">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] p-7 md:p-10 text-white group">
          {/* Subtle Background Watermark Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
            <Building2 className="w-96 h-96" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              
              {/* ADMIN Icon/Avatar matching user flowchart */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-800 to-[#16163B] border-2 border-purple-400/50 shadow-2xl flex flex-col items-center justify-center text-white relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-200/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-[#E9DF70]" />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-purple-200 mt-1">
                    ADMIN
                  </span>
                </div>
                <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#16163B] absolute -bottom-1 -right-1 animate-pulse" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                    HOSPITAL CONTROL ROOM ACTIVE
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-bold">
                    🕒 {currentTime}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E9DF70]/20 text-[#E9DF70] text-[11px] font-black border border-[#E9DF70]/30">
                    Authority HQ · Executive Command
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white m-0">
                  Hospital Authority HQ · Executive Admin Workspace
                </h1>

                <p className="text-xs sm:text-sm text-[#E9DF70] font-bold m-0 mt-1">
                  Apollo Multispeciality Hospital · License: NABH-2026-MH · SuperAdmin Console
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                    <strong>{totalDoctors} Doctors on Roster</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CalendarCheck2 className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{pendingAppointments.length} Queued Clearances</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>₹{totalRevenue.toLocaleString('en-IN')} Total Revenue</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-blue-400" />
                    <strong>{occupancyRate}% Bed Occupancy</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Kinetic Pink Pill Button (Matching Patient & Doctor Panel Style) */}
            <div className="group self-end lg:self-auto">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#E7B8D1]/60 pointer-events-none animate-pill-pulse-wave" />
                <div className="absolute inset-0 rounded-full bg-[#E7B8D1]/40 blur-xl pointer-events-none transition-all duration-500 animate-pill-glow group-hover:blur-2xl group-hover:bg-[#E7B8D1]/70" />

                <span className="absolute -top-2.5 -left-3 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-1 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">✦</span>
                <span className="absolute -top-3 -right-2 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-2 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">✦</span>

                <button
                  onClick={() => {
                    confetti({ particleCount: 65, spread: 75, origin: { x: 0.85, y: 0.3 } });
                    setActiveStepTab(4);
                    scrollToSection('admin-step-4');
                  }}
                  className="relative z-10 inline-flex items-center gap-2 sm:gap-2.5 bg-[#E7B8D1] hover:bg-[#F2D2E4] active:scale-95 text-[#16163B] pl-2 sm:pl-2.5 pr-4 sm:pr-6 py-2 sm:py-2.5 rounded-full shadow-[0_10px_28px_-4px_rgba(231,184,209,0.65)] hover:shadow-[0_18px_40px_-4px_rgba(231,184,209,0.9)] transition-all duration-300 cursor-pointer border border-white/60 font-['Poppins'] overflow-hidden animate-main-pill-float hover:-translate-y-1 hover:scale-[1.02]"
                  title="Triage & Approve Appointments"
                >
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#16163B]/12 group-hover:bg-[#16163B]/20 flex items-center justify-center text-[#16163B] font-black text-xs sm:text-base">
                    →
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-[#16163B] tracking-tight whitespace-nowrap">
                    Triage & Approve Appointments
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 4 PASTEL CLINICAL ACTION CARDS (Matching Patient & Doctor Panels)
          Soft Yellow, Mint, Soft Blush/Pink, and Pastel Blue
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Card 1: Soft Yellow - Manage Doctors & Departments (Step 2) */}
          <div
            onClick={() => {
              setActiveStepTab(2);
              scrollToSection('admin-step-2');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#FEF9C3] hover:bg-[#FEF08A] border border-[#FDE047] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#EAB308] text-white flex items-center justify-center shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-full">
                2 · Doctors
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Doctors & Departments</h3>
              <p className="text-xs text-amber-950 font-semibold m-0 mt-1">
                {totalDoctors} physicians across {departments.length} clinical specialties & OPD rooms
              </p>
            </div>
            <div className="text-xs font-black text-amber-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Manage Roster</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Mint - Approve / Reschedule Appointments (Step 4) */}
          <div
            onClick={() => {
              setActiveStepTab(4);
              scrollToSection('admin-step-4');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-full">
                4 · Triage
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Approve & Reschedule</h3>
              <p className="text-xs text-emerald-950 font-semibold m-0 mt-1">
                {pendingAppointments.length} visits pending clearance, slot reallocation or reschedule
              </p>
            </div>
            <div className="text-xs font-black text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Triage Desk</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Pink - Manage Bills & Payments (Step 5) */}
          <div
            onClick={() => {
              setActiveStepTab(5);
              scrollToSection('admin-step-5');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#FCE7F3] hover:bg-[#FBCFE8] border border-[#F472B6] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#DB2777] text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-pink-200/80 text-pink-900 px-2.5 py-1 rounded-full">
                5 · Billing
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Bills & Financial Ledger</h3>
              <p className="text-xs text-pink-950 font-semibold m-0 mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')} collected · {unpaidBillsCount} unpaid invoices
              </p>
            </div>
            <div className="text-xs font-black text-pink-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Financial Ledger</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Pastel Blue - Generate Reports (Step 6) */}
          <div
            onClick={() => {
              setActiveStepTab(6);
              scrollToSection('admin-step-6');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#7DD3FC] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200/80 text-sky-900 px-2.5 py-1 rounded-full">
                6 · Reports
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Generate Reports</h3>
              <p className="text-xs text-sky-950 font-semibold m-0 mt-1">
                Executive analytics dossier, revenue breakdowns & PDF export
              </p>
            </div>
            <div className="text-xs font-black text-sky-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Generate Dossier</span>
              <span>→</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE 8-STEP ADMIN WORKFLOW FLOWCHART
          Directly Mirroring the User's Diagram:
          ADMIN Icon -> [1] Login -> [2] Manage Doctors & Depts ->
          [3] Manage Patients & Appts -> [4] Approve / Reschedule ->
          [5] Manage Bills -> [6] Generate Reports -> [7] Monitor Audit ->
          [8] System Configuration
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8">
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/50 rounded-[32px] p-6 sm:p-8 border border-purple-200/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                  Standard Hospital Authority Flowchart
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">
                  Admin Complete Operational Workflow
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                Click any module below to navigate directly to its dedicated administrative section
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>8 Standardized Features Active</span>
            </div>
          </div>

          {/* Main Diagram Area with Admin avatar on left + 2 rows of 4 cards */}
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            {/* Left ADMIN Entity Card (Mirroring User's Diagram) */}
            <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-100/80 to-purple-200/60 rounded-3xl border border-purple-300/80 shadow-xs w-full lg:w-44 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-700 text-white flex items-center justify-center shadow-md mb-2 border-2 border-white">
                <Users className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-purple-950 uppercase tracking-wider m-0">
                ADMIN
              </h4>
              <p className="text-[10px] text-purple-800 font-bold m-0 mt-0.5">
                Hospital Authority
              </p>
            </div>

            {/* Right Flowchart Grid: 2 Rows connected by sequential arrows */}
            <div className="flex-1 w-full space-y-4">
              
              {/* Row 1: Steps 1 -> 2 -> 3 -> 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 relative">
                {adminSteps.slice(0, 4).map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStepTab === step.num;
                  return (
                    <div
                      key={step.num}
                      onClick={() => {
                        setActiveStepTab(step.num);
                        scrollToSection(step.targetId);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                        isActive
                          ? 'bg-purple-100/90 border-purple-600 shadow-md ring-2 ring-purple-500/40'
                          : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center shadow-xs">
                          {step.num}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 m-0 leading-tight">
                          {step.label}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-semibold m-0 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central Connecting Flow Indicator from 4 down to 5 */}
              <div className="flex items-center justify-between px-4 py-1 text-purple-800 text-xs font-black">
                <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
                  1 to 4: Clinical & Patient Operations
                </span>
                <span className="flex items-center gap-1.5 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  <span>↓ Financial Governance, Audit &amp; System Configuration (5 to 8) ↓</span>
                </span>
                <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
                  5 to 8: Executive Governance
                </span>
              </div>

              {/* Row 2: Steps 5 -> 6 -> 7 -> 8 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 relative">
                {adminSteps.slice(4, 8).map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStepTab === step.num;
                  return (
                    <div
                      key={step.num}
                      onClick={() => {
                        setActiveStepTab(step.num);
                        scrollToSection(step.targetId);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                        isActive
                          ? 'bg-purple-100/90 border-purple-600 shadow-md ring-2 ring-purple-500/40'
                          : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center shadow-xs">
                          {step.num}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 m-0 leading-tight">
                          {step.label}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-semibold m-0 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DEDICATED FUNCTIONAL SECTIONS FOR ALL 8 FEATURES
          ───────────────────────────────────────────────────────────── */}

      {/* ═════════════════════════════════════════════════════════════
          STEP 1: LOGIN & AUTHORITY CREDENTIAL SESSION CONTROL
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-1" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                1
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  1. Login & Authority Authentication Control
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Administrative session credentials, 2-Factor Authentication (2FA), and authority permissions
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ACTIVE SESSION VALID</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Authority Profile Card */}
            <div className="bg-gradient-to-br from-slate-900 via-[#16163B] to-[#242454] text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-[#E9DF70]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white m-0">Dr. K. R. Sharma, MD</h4>
                  <p className="text-xs text-[#E9DF70] font-bold m-0 mt-0.5">Medical Director & SuperAdmin</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Security Clearance:</span>
                  <span className="font-bold text-emerald-400">Level 5 · Full Hospital Control</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Session Token:</span>
                  <span className="font-mono text-purple-300">AUTH-TK-984321-ADM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">2FA Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> FIDO2 Hardware Key
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Client Node:</span>
                  <span className="font-bold text-slate-300">192.168.1.104 (VLAN-10)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Admin session refreshed & rotated successfully.');
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>Rotate Session Token</span>
              </button>
            </div>

            {/* Credential Policies & Security Diagnostics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Key className="w-4 h-4 text-purple-600" />
                  <span>Credential Hygiene</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Password rotated 14 days ago. Zero failed login attempts in the last 24 hours. Automated session timeout set to 60 minutes of inactivity.
                </p>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High Cryptographic Entropy (256-bit AES)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Audit Engine Status</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  All administrative mutations across doctor rosters, patient records, and billing receipts are cryptographically hashed and mirrored to audit storage.
                </p>
                <div className="pt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Real-Time Telemetry Active
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NABH & HIPAA Compliance</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  Data in-transit and at-rest conforms to national healthcare data governance protocols and electronic health record standards.
                </p>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Compliance Score: 100% Certified
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                    <Smartphone className="w-4 h-4 text-purple-700" />
                    <span>Quick Role Switcher</span>
                  </div>
                  <p className="text-xs text-purple-900 leading-relaxed m-0 mt-1">
                    Need to simulate another viewpoint? Switch instantaneously to the Doctor Console or Patient Portal.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setCurrentRole('doctor');
                      showToast('Switched to Doctor Console view');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-700 text-white text-xs font-bold border-none cursor-pointer hover:bg-purple-800 transition-colors"
                  >
                    Doctor Console
                  </button>
                  <button
                    onClick={() => {
                      setCurrentRole('patient');
                      showToast('Switched to Patient Portal view');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-900 text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors"
                  >
                    Patient Portal
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 2: MANAGE DOCTORS & DEPARTMENTS
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-2" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                2
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  2. Manage Doctors & Departments
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Register physicians, allocate clinical departments, set consultation fees and OPD quotas
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all shadow-sm border-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Doctor</span>
            </button>
          </div>

          {/* Department Quotas & Capacity Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 m-0">
              Hospital Clinical Departments ({departments.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {departments.map((dept) => {
                const docCount = doctors.filter(d => d.deptId === dept.id || d.specialty?.includes(dept.name)).length;
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDeptFilter(selectedDeptFilter === dept.id ? 'All' : dept.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedDeptFilter === dept.id
                        ? 'bg-purple-50 border-purple-500 shadow-xs ring-1 ring-purple-400'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-black text-slate-900">{dept.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-200/60 text-purple-900">
                        Room {dept.room || '104'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>{docCount} Specialists</span>
                      <span className="text-purple-700 font-bold">OPD Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor by name or specialty..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-slate-500">
              <span>Filter Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Doctor & Credential</th>
                  <th className="py-3 px-4">Department & Specialty</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Consultation Fee</th>
                  <th className="py-3 px-4">OPD Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDoctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar || '/images/doctors/indian_doc_m1.jpg'}
                          alt={doc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <strong className="text-slate-900 block font-bold">{doc.name}</strong>
                          <span className="text-[10px] text-slate-400 font-semibold">{doc.email || 'doctor@clinicos.com'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black">
                        {doc.specialty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {doc.experience || '10+ Years'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      ₹{doc.fee || doc.consultationFee || 1500}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {doc.availability || 'Mon - Sat (10 AM - 05 PM)'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ON DUTY
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${doc.name} from active hospital roster?`)) {
                            deleteDoctor(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors bg-transparent border-none cursor-pointer"
                        title="Remove Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 3: MANAGE PATIENTS & MASTER APPOINTMENTS DIRECTORY
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-3" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                3
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  3. Manage Patients & Appointments
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Master Patient Index (EMR), demographic records, and hospital-wide appointments register
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                {totalPatients} Total Patients Registered
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Master Patient Directory */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Master Patient Registry</span>
                </h4>
                <div className="relative w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredPatients.map((pat) => (
                  <div
                    key={pat.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-purple-50/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={pat.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{pat.name}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          UHID: {pat.id} · Age: {pat.age || 29} Yrs · {pat.gender || 'Male'}
                        </span>
                        <span className="text-[10px] text-purple-700 font-bold">
                          Blood: {pat.bloodGroup || 'B+'} · Phone: {pat.phone || '+91 98765 43210'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`EMR History profile opened for ${pat.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-purple-800 text-[11px] font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      View EMR
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Master Appointments Register */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Appointments Register ({appointments.length})</span>
                </h4>
                <select
                  value={appointmentDirectoryStatus}
                  onChange={(e) => setAppointmentDirectoryStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Pending">Pending</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredAppointmentsDirectory.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-slate-900">{apt.patientName}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Rescheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status || 'Pending'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        Attending: {apt.doctorName || 'Dr. Souvik Sinha'} · {apt.date} at {apt.time || '10:00 AM'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Reason: {apt.symptoms || apt.type || 'Routine Consultation'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveStepTab(4);
                        scrollToSection('admin-step-4');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-800 text-[11px] font-bold hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
                    >
                      Manage Slot →
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 4: APPROVE / RESCHEDULE APPOINTMENTS DESK
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-4" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                4
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  4. Approve / Reschedule Appointments
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Triage queue, slot confirmation, date/time rescheduling, and attending physician reassignment
                </p>
              </div>
            </div>

            {/* Triage Status Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'Pending', label: 'Pending Approval', count: pendingAppointments.length },
                { id: 'Scheduled', label: 'Scheduled', count: scheduledAppointments.length },
                { id: 'Rescheduled', label: 'Rescheduled', count: rescheduledAppointments.length },
                { id: 'All', label: 'All Queues', count: appointments.length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTriageFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black border-none cursor-pointer transition-all ${
                    triageFilter === f.id
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* Triage Appointments Action Desk */}
          <div className="space-y-3">
            {triageAppointments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-semibold">
                No appointments currently matching the "{triageFilter}" filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triageAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <strong className="text-sm font-black text-slate-900 block">
                            {apt.patientName}
                          </strong>
                          <span className="text-[11px] text-slate-500 font-semibold block">
                            Attending Doctor: <strong>{apt.doctorName || 'Dr. Souvik Sinha'}</strong>
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          apt.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Rescheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {apt.status || 'Pending Approval'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Date:</span>
                          <strong className="text-slate-800">{apt.date || 'Today'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Time Slot:</span>
                          <strong className="text-slate-800">{apt.time || '10:00 AM'}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px]">Chief Complaints:</span>
                          <span className="text-slate-700 font-semibold">{apt.symptoms || apt.type || 'General OPD Consultation'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {apt.status !== 'Scheduled' && (
                        <button
                          onClick={() => handleApproveAppointment(apt.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenRescheduleModal(apt)}
                        className="flex-1 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black transition-all border border-purple-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel appointment ${apt.id} for ${apt.patientName}?`)) {
                            updateAppointmentStatus(apt.id, 'Cancelled');
                            showToast(`Appointment ${apt.id} cancelled. Slot returned to inventory.`);
                          }
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 text-xs font-bold transition-all border-none cursor-pointer"
                        title="Cancel Appointment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 5: MANAGE BILLS & PAYMENTS
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-5" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                5
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  5. Manage Bills & Payments
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Financial ledger, GST invoices, online & counter collections, and TPA insurance claim settlements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateBillModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all shadow-sm border-none cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New Invoice</span>
              </button>
            </div>
          </div>

          {/* Financial KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-black uppercase text-emerald-800 block">Total Revenue</span>
              <strong className="text-lg font-black text-emerald-900 block mt-1">₹{totalRevenue.toLocaleString('en-IN')}</strong>
              <span className="text-[10px] text-emerald-700 font-semibold">Cleared via Gateway & Cash</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-black uppercase text-amber-800 block">Pending Invoices</span>
              <strong className="text-lg font-black text-amber-900 block mt-1">{unpaidBillsCount} Invoices</strong>
              <span className="text-[10px] text-amber-700 font-semibold">Awaiting patient settlement</span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-black uppercase text-blue-800 block">TPA Insurance Claims</span>
              <strong className="text-lg font-black text-blue-900 block mt-1">{pendingClaims} Under Review</strong>
              <span className="text-[10px] text-blue-700 font-semibold">Cashless desk processing</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-black uppercase text-purple-800 block">Total Ledger Entries</span>
              <strong className="text-lg font-black text-purple-900 block mt-1">{bills.length} Invoices</strong>
              <span className="text-[10px] text-purple-700 font-semibold">Audited financial records</span>
            </div>
          </div>

          {/* Invoices Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice ID or patient name..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Status:</span>
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Invoices Ledger Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice Ref</th>
                  <th className="py-3 px-4">Patient Particulars</th>
                  <th className="py-3 px-4">Service Rendered</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{bill.id}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{bill.patientName}</strong>
                      <span className="text-[10px] text-slate-400 font-semibold">{bill.patientId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{bill.description}</td>
                    <td className="py-3.5 px-4 text-slate-500">{bill.issueDate || '2026-10-08'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{bill.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {bill.status !== 'Paid' && (
                        <button
                          onClick={() => {
                            payBill(bill.id, 'Cash / Card Counter');
                            showToast(`Invoice ${bill.id} marked as Paid!`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold border-none cursor-pointer transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceForPrint(bill)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border-none cursor-pointer transition-colors"
                      >
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TPA Insurance Pre-Approval Desk Card */}
          <div className="bg-purple-50/60 rounded-2xl border border-purple-200 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 m-0">
                  TPA Insurance Pre-Approval &amp; Cashless Claims ({insuranceClaims.length})
                </h4>
              </div>
              <span className="text-[10px] font-black text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                Star Health · HDFC Ergo · ICICI Lombard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {insuranceClaims.map(claim => (
                <div key={claim.id} className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-xs flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <strong className="text-xs font-bold text-slate-900">{claim.patientName}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        claim.status === 'Pre-Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      Policy: {claim.policyNumber} · {claim.provider}
                    </span>
                    <strong className="text-xs text-purple-900 block mt-1">Claim: ₹{claim.claimAmount}</strong>
                  </div>

                  {claim.status !== 'Pre-Approved' && (
                    <button
                      onClick={() => approveInsuranceClaim(claim.id, claim.claimAmount)}
                      className="w-full py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold border-none cursor-pointer transition-colors"
                    >
                      Approve &amp; Settle Claim
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 6: GENERATE REPORTS
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-6" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                6
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  6. Generate Reports & Hospital Analytics
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Compile executive financial dossier, OPD consultation volumes, and IPD bed occupancy metrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportReportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Ledger</span>
              </button>
              <button
                onClick={handleGenerateReportPDF}
                disabled={isExportingReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all shadow-sm border-none cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#E9DF70]" />
                <span>{isExportingReport ? 'Compiling Dossier...' : 'Generate & Print PDF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Report Selection Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Report Category
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="revenue">Hospital Revenue & Financial Ledger</option>
                <option value="consultations">Doctor OPD Consultation Productivity</option>
                <option value="occupancy">IPD Inpatient Census & Bed Occupancy</option>
                <option value="audit">Hospital Compliance & Security Audit</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Time Horizon
              </label>
              <select
                value={reportTimeframe}
                onChange={(e) => setReportTimeframe(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="today">Today (Live 24h Window)</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Current Month (October 2026)</option>
                <option value="fy">Fiscal Year 2026-27</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={() => {
                  try {
                    confetti({ particleCount: 40, spread: 50 });
                  } catch (e) {}
                  showToast(`Report generated for ${reportCategory.toUpperCase()} over ${reportTimeframe}!`);
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>Update Analytics View</span>
              </button>
            </div>
          </div>

          {/* Analytics Visual Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Revenue Stream Allocation */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center justify-between">
                <span>Revenue Streams Breakdown</span>
                <span className="text-emerald-600 font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </h4>
              <div className="space-y-2 text-xs font-medium">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">OPD Doctor Consultations</span>
                    <strong className="text-slate-900">42% (₹3,55,800)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Diagnostic Pathology & Scans</span>
                    <strong className="text-slate-900">28% (₹2,37,200)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Pharmacy & Medications</span>
                    <strong className="text-slate-900">18% (₹1,52,500)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">IPD Ward & ICU Bed Tariffs</span>
                    <strong className="text-slate-900">12% (₹1,01,700)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: OPD Departmental Volume */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center justify-between">
                <span>OPD Patient Footfall</span>
                <span className="text-purple-600 font-bold">{appointments.length * 12} Visits</span>
              </h4>
              <div className="space-y-2 text-xs font-medium">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">General Medicine</span>
                    <strong className="text-slate-900">165 Patients</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Cardiology</span>
                    <strong className="text-slate-900">142 Patients</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Pediatrics & Neonatal</span>
                    <strong className="text-slate-900">110 Patients</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Neurology & Orthopedics</span>
                    <strong className="text-slate-900">98 Patients</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 3: IPD Census & Bed Turnover */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center justify-between">
                <span>IPD Census &amp; Capacity</span>
                <span className="text-blue-600 font-bold">{occupancyRate}% Occupancy</span>
              </h4>
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600">Occupied IPD Beds:</span>
                  <strong className="text-slate-900">{occupiedBeds} of {beds.length} Units</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600">Available Empty Beds:</span>
                  <strong className="text-emerald-700">{beds.length - occupiedBeds} Ready for Admission</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600">Average Length of Stay:</span>
                  <strong className="text-slate-900">3.4 Days</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-600">Discharges This Week:</span>
                  <strong className="text-purple-700">18 Successfully Discharged</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 7: MONITOR AUDIT LOGS
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-7" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                7
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  7. Monitor Audit Logs
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Cryptographic security event stream, user authorization tracking, and compliance logs
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const csvLogs = "data:text/csv;charset=utf-8,"
                  + "Timestamp,User,Action,IP,Level\n"
                  + auditLogs.map(l => `"${l.timestamp}","${l.user}","${l.action}","${l.ip}","${l.level}"`).join("\n");
                const encodedUri = encodeURI(csvLogs);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `ClinicOS_AuditLogs_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Audit trail exported to CSV!');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-700" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          </div>

          {/* Audit Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, action, IP..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Severity Level:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'INFO', 'WARN', 'SUCCESS', 'SECURITY'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setAuditLevelFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black border-none cursor-pointer transition-all ${
                      auditLevelFilter === lvl
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Initiator / User</th>
                  <th className="py-3 px-4">System Action Description</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Security Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 text-purple-900 font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {log.ip || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        log.level === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        log.level === 'WARN' ? 'bg-amber-100 text-amber-800' :
                        log.level === 'SECURITY' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          STEP 8: SYSTEM CONFIGURATION
          ═════════════════════════════════════════════════════════════ */}
      <section id="admin-step-8" className="w-full px-5 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                8
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
                  8. System Configuration
                </h2>
                <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                  Hospital master parameters, OPD scheduling rules, maintenance mode, and database backups
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunBackup}
                disabled={isBackingUpDb}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black transition-all border border-purple-200 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-purple-700" />
                <span>{isBackingUpDb ? 'Creating Snapshot...' : '⚡ Run Instant DB Backup'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Hospital Identity & Emergency Operations */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Hospital Facility Master</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Hospital Facility Name</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Physical Facility Address</label>
                  <input
                    type="text"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Emergency 108 Dispatch Hotline</label>
                  <input
                    type="text"
                    value={emergencyHotline}
                    onChange={(e) => setEmergencyHotline(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* OPD Scheduling & Telehealth Gateway Rules */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>OPD & Telehealth Consultation Rules</span>
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Morning OPD Shift</label>
                    <input
                      type="text"
                      value={morningShiftHours}
                      onChange={(e) => setMorningShiftHours(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Evening OPD Shift</label>
                    <input
                      type="text"
                      value={eveningShiftHours}
                      onChange={(e) => setEveningShiftHours(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Max Patient Quota per Doctor Shift</label>
                  <input
                    type="number"
                    value={maxSlotsPerDoctor}
                    onChange={(e) => setMaxSlotsPerDoctor(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">Auto-Confirm Online Telehealth</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Instantly confirm video appointments without triage review</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoApproveBookings}
                    onChange={(e) => setAutoApproveBookings(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Mode & Telehealth Signaling Gateway */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 m-0 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>WebRTC Telehealth Gateway</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">STUN / TURN Relay Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                    Operational (stun:stun.l.google.com)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Audio/Video Packet Loss:</span>
                  <span className="font-bold text-slate-800">0.02% (Ultra-Low Latency)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">End-to-End Encryption:</span>
                  <span className="font-bold text-purple-800">DTLS-SRTP 256-bit</span>
                </div>
              </div>
            </div>

            {/* System Maintenance Mode Toggle */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Maintenance Mode Governance</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed m-0 mt-1">
                  Enabling maintenance mode suspends public appointment booking and routes patients to the emergency 108 helpline.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-800">
                  Status: {maintenanceMode ? 'ACTIVE (SYSTEM LOCKED)' : 'OFF (ONLINE)'}
                </span>
                <button
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    showToast(maintenanceMode ? 'Maintenance Mode Disabled. System Online!' : 'Maintenance Mode Enabled!', 'warn');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                    maintenanceMode ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  }`}
                >
                  {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => {
                showToast('All system configuration parameters saved successfully!');
              }}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow-md border-none cursor-pointer transition-all"
            >
              Save Configuration Changes
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD NEW DOCTOR (Step 2)
          ───────────────────────────────────────────────────────────── */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-black text-slate-900 m-0">Register New Doctor to Roster</h3>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Clinical Department</label>
                  <select
                    value={newDocDeptId}
                    onChange={(e) => setNewDocDeptId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={newDocExp}
                    onChange={(e) => setNewDocExp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">OPD Shift Hours</label>
                  <input
                    type="text"
                    value={newDocSchedule}
                    onChange={(e) => setNewDocSchedule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newDocEmail}
                    onChange={(e) => setNewDocEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black border-none cursor-pointer shadow-sm"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: RESCHEDULE APPOINTMENT (Step 4)
          ───────────────────────────────────────────────────────────── */}
      {rescheduleModalAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-black text-slate-900 m-0">Reschedule Appointment</h3>
              </div>
              <button
                onClick={() => setRescheduleModalAppointment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReschedule} className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] text-purple-800 font-bold block">Patient:</span>
                <strong className="text-xs text-purple-950">{rescheduleModalAppointment.patientName}</strong>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                  Current Slot: {rescheduleModalAppointment.date} at {rescheduleModalAppointment.time}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">New Consultation Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleNewDate}
                  onChange={(e) => setRescheduleNewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  value={rescheduleNewTime}
                  onChange={(e) => setRescheduleNewTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                >
                  <option value="09:00 AM">09:00 AM - Morning Slot 1</option>
                  <option value="10:00 AM">10:00 AM - Morning Slot 2</option>
                  <option value="11:30 AM">11:30 AM - Morning Slot 3</option>
                  <option value="02:00 PM">02:00 PM - Afternoon Slot 1</option>
                  <option value="04:00 PM">04:00 PM - Evening Slot 1</option>
                  <option value="05:30 PM">05:30 PM - Evening Slot 2</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reassign Attending Doctor</label>
                <select
                  value={rescheduleDoctorName}
                  onChange={(e) => setRescheduleDoctorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalAppointment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black border-none cursor-pointer shadow-sm"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CREATE NEW BILL (Step 5)
          ───────────────────────────────────────────────────────────── */}
      {showCreateBillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-black text-slate-900 m-0">Issue New Financial Invoice</h3>
              </div>
              <button
                onClick={() => setShowCreateBillModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={billPatientId}
                  onChange={(e) => setBillPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Service Particulars</label>
                <input
                  type="text"
                  required
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateBillModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black border-none cursor-pointer shadow-sm"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PRINT INVOICE RECEIPT (Step 5)
          ───────────────────────────────────────────────────────────── */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          bill={selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}

    </div>
  );
};
