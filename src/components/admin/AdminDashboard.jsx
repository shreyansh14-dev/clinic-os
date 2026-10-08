import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2, Users, Stethoscope, Clock, Receipt, ShieldCheck,
  Plus, Edit2, Trash2, ArrowUpRight, Sparkles, Activity,
  FileCheck2, CalendarCheck2, Bed, Droplet, Ambulance,
  TrendingUp, AlertCircle, ChevronRight, IndianRupee, MapPin,
  CheckCircle2, Siren, ShieldAlert, Search, Filter, Phone,
  Mail, Star, Check, X, Printer, Calendar
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
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
    dispatchAmbulance,
    payBill,
    createBill,
    updateAppointmentStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'doctors' | 'beds' | 'billing' | 'insurance' | 'emergency' | 'audit'
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Doctor Roster state
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDocName, setNewDocName] = useState('Dr. Arvind Narayanan');
  const [newDocDeptId, setNewDocDeptId] = useState(departments[0]?.id || 'dept-1');
  const [newDocExp, setNewDocExp] = useState('12+ Years');
  const [newDocFee, setNewDocFee] = useState('2200');
  const [newDocSchedule, setNewDocSchedule] = useState('Mon - Fri (10:00 AM - 04:00 PM)');
  const [newDocPhone, setNewDocPhone] = useState('+91 98200 12345');
  const [newDocEmail, setNewDocEmail] = useState('arvind.n@clinicos.com');
  const [newDocAvatar, setNewDocAvatar] = useState('/images/doctors/indian_doc_m1.jpg');

  // Billing state
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [billPatientId, setBillPatientId] = useState(patients[0]?.id || 'pat-101');
  const [billDesc, setBillDesc] = useState('Executive Health Checkup & Comprehensive Diagnostics');
  const [billAmount, setBillAmount] = useState('3500');

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Operational metrics
  const totalPatients = patients.length || 142;
  const totalDoctors = doctors.length || 24;
  const pendingVisits = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length || 9;
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (b.totalAmount || 0), 0) || 847200;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / (beds.length || 1)) * 100);
  const pendingClaims = insuranceClaims.filter(c => c.status === 'Under Review').length;
  const unpaidBillsCount = bills.filter(b => b.status === 'Unpaid').length;

  // Add doctor handler
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
  };

  // Create Bill handler
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
  };

  // Filtered doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = !doctorSearch ||
      doc.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || doc.deptId === selectedDeptFilter || doc.specialty?.includes(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  // Filtered bills
  const filteredBills = bills.filter(b => {
    const matchesSearch = !invoiceSearch ||
      b.patientName?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.id?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.description?.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'All' || b.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(l =>
    !auditSearch ||
    l.user?.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.level?.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-20 font-['Poppins']">

      {/* ── Authority Hero Banner ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] p-7 md:p-8 text-white shadow-2xl doc-anim-enter">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
          <Building2 className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black tracking-wider text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>HOSPITAL AUTHORITY CONTROL PANEL</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                SYSTEM LIVE & ACTIVE
              </span>
              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                🕒 {currentTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
              Authority Dashboard & Clinical Command
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl m-0 leading-relaxed">
              Real-time clinical clearances, IPD bed allocations, physician credentials, and financial ledger governance across all departments.
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#E9DF70]" />
              <span>Apollo Multispeciality Hospital · Mumbai, MH · ClinicOS Authority Center</span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] text-xs font-black transition-all shadow-md border-none cursor-pointer hover:scale-105"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Register Doctor</span>
            </button>
            <button
              onClick={() => setShowCreateBillModal(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-md cursor-pointer hover:scale-105"
            >
              <Receipt className="w-4 h-4 text-[#A7DDC5]" />
              <span>Issue Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5 Metric KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 doc-anim-enter">
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200">
              Active EMR
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPatients}</div>
          <div className="text-xs font-bold text-slate-700">Registered Patients</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active profiles</div>
        </div>

        <div className="bg-[#F5F3FF] border border-[#EDE9FE] rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              <Stethoscope className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-purple-700 border border-purple-200">
              On Roster
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalDoctors}</div>
          <div className="text-xs font-bold text-slate-700">Doctors on Roster</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Specialists across OPD</div>
        </div>

        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-amber-700 border border-amber-200">
              Queued
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingVisits}</div>
          <div className="text-xs font-bold text-slate-700">Pending Clearances</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Awaiting verification</div>
        </div>

        <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              <IndianRupee className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-200">
              Cleared
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-xs font-bold text-slate-700">Hospital Revenue</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Digital transactions</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#FAF5FF] border border-purple-200 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center">
              <Bed className="w-4.5 h-4.5 text-purple-700" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-purple-700 border border-purple-200">
              {occupancyRate}% Full
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{occupiedBeds} / {beds.length}</div>
          <div className="text-xs font-bold text-slate-700">IPD Bed Occupancy</div>
          <div className="text-[10px] text-slate-500 mt-0.5">General & ICU units</div>
        </div>
      </div>

      {/* ── Segmented Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
        {[
          { id: 'overview',   label: 'Operational Overview',   icon: Activity,      count: pendingVisits },
          { id: 'doctors',    label: 'Doctor & Staff Roster',  icon: Stethoscope,   count: totalDoctors },
          { id: 'beds',       label: 'IPD Ward & Beds Tariff', icon: Bed,           count: occupiedBeds },
          { id: 'billing',    label: 'Financial Ledger & Bills',icon: Receipt,      count: unpaidBillsCount },
          { id: 'insurance',  label: 'TPA Insurance Desk',     icon: ShieldCheck,   count: pendingClaims },
          { id: 'emergency',  label: 'Ambulance & Blood Bank', icon: Siren,         badge: '108' },
          { id: 'audit',      label: 'Security Audit Logs',    icon: ShieldAlert,   count: auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border-none ${
                isActive
                  ? 'bg-[#16163B] text-white shadow-md scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#E9DF70]' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && !tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 1: OPERATIONAL OVERVIEW & APPROVALS QUEUE
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6 doc-anim-enter">
          {/* Live Action Queues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Approval Queue */}
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#242454] flex items-center justify-center font-bold">
                      <CalendarCheck2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Clinical Approval Queue</h3>
                      <span className="text-xs text-slate-500">Live patient appointments and diagnostic requests</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                    {pendingVisits} Queued
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {appointments.slice(0, 4).map(apt => (
                    <div key={apt.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block font-bold">{apt.patientName}</strong>
                        <span className="text-[11px] text-slate-500">{apt.doctorName} · {apt.date} at {apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status}
                        </span>
                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, 'Completed');
                              showToast(`Approved & completed visit for ${apt.patientName}`);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="px-4 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer transition-all shadow-sm"
                >
                  Manage Doctor Schedules
                </button>
              </div>
            </div>

            {/* Financial Ledger Snapshot */}
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Billing & Settlement Ledger</h3>
                      <span className="text-xs text-slate-500">Live transaction auditing & cash-flow overview</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                    ₹{totalRevenue.toLocaleString('en-IN')} Total
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {bills.slice(0, 4).map(bill => (
                    <div key={bill.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block font-bold">{bill.patientName}</strong>
                        <span className="text-[11px] text-slate-500">{bill.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">₹{bill.totalAmount}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('billing')}
                  className="px-4 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer transition-all shadow-sm"
                >
                  View Complete Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 2: DOCTOR & CONSULTANT ROSTER MANAGEMENT
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6 doc-anim-enter">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Registered Doctors & Consultants Roster</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Manage physician credentials, OPD timings, and consultation fees across all specialties
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="px-4 py-2 rounded-xl bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-[#E9DF70]" />
                <span>Register Doctor</span>
              </button>
            </div>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedDeptFilter('All')}
              className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all ${
                selectedDeptFilter === 'All' ? 'bg-[#16163B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties ({doctors.length})
            </button>
            {departments.slice(0, 8).map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs whitespace-nowrap transition-all ${
                  selectedDeptFilter === dept.id ? 'bg-[#16163B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#242454]/30 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.avatar || '/images/doctors/indian_doc_m1.jpg'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-slate-200 group-hover:ring-[#242454]/30 transition-all"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 m-0 group-hover:text-[#242454] transition-colors">
                      {doc.name}
                    </h4>
                    <span className="inline-block mt-0.5 text-[11px] font-bold text-[#242454] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#DBEAFE]">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                      ★ {doc.rating || '4.9'} · {doc.experience || '10+ Yrs'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fee:</span>
                    <strong className="text-emerald-700 font-black">₹{(doc.consultationFee || doc.fee || 1500).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Timing:</span>
                    <span className="text-slate-700 font-semibold truncate max-w-[170px]">{doc.availability || doc.timing || 'Mon-Fri 10am-4pm'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      const newFee = prompt(`Update consultation fee for ${doc.name}:`, doc.consultationFee || doc.fee || 2000);
                      if (newFee) {
                        doc.consultationFee = parseFloat(newFee);
                        doc.fee = parseFloat(newFee);
                        showToast(`Fee for ${doc.name} updated to ₹${newFee}`);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Fee</span>
                  </button>
                  <button
                    onClick={() => deleteDoctor(doc.id)}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs inline-flex items-center justify-center transition-all cursor-pointer"
                    title="Remove Doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 3: IPD WARD & BEDS TARIFF MANAGEMENT
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'beds' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6 doc-anim-enter">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">IPD Ward & Bed Allocation Matrix</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Hospital ward tariffs, live bed allocation matrix & turnover management
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black">
              {occupiedBeds} / {beds.length} Beds Occupied ({occupancyRate}%)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Bed #</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Ward Category</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Current Patient</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Daily Tariff</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Occupancy Status</th>
                  <th className="py-3 px-4 text-right font-black text-slate-500 uppercase tracking-wider text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {beds.map(bed => (
                  <tr key={bed.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 font-black">Bed #{bed.number}</strong>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{bed.ward}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900">{bed.patientName || 'None (Ready)'}</strong>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">₹{bed.dailyRate || 3500}/day</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        bed.status === 'Occupied'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {bed.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {bed.status === 'Occupied' ? (
                        <button
                          onClick={() => {
                            updateBedStatus(bed.id, 'Available');
                            showToast(`Bed #${bed.number} discharged and marked Available.`);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                        >
                          Clear & Sanitize
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateBedStatus(bed.id, 'Occupied', 'pat-101', 'Shreyansh Kumar');
                            showToast(`Bed #${bed.number} allocated to admitted patient.`);
                          }}
                          className="px-3 py-1 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-xs"
                        >
                          Allocate Bed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 4: FINANCIAL LEDGER & INVOICES
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6 doc-anim-enter">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">System Financial Invoices & Ledger</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Complete billing transactions ledger, payment status & GST receipts
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search invoice ID, patient..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                />
              </div>

              <button
                onClick={() => setShowCreateBillModal(true)}
                className="px-4 py-2 rounded-xl bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4 text-[#E9DF70]" />
                <span>Issue Invoice</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Invoice Ref</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Patient Particulars</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Service Rendered</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Total Amount</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Status</th>
                  <th className="py-3 px-4 text-right font-black text-slate-500 uppercase tracking-wider text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-blue-700">{bill.id}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{bill.patientName}</strong>
                      <span className="text-[10px] text-slate-400">ID: {bill.patientId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{bill.description}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{bill.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {bill.status === 'Unpaid' && (
                        <button
                          onClick={() => {
                            payBill(bill.id, 'Counter Cash / Card', `TXN-${Date.now()}`);
                            showToast(`Invoice ${bill.id} cleared and receipt signed.`);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-xs"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 5: TPA INSURANCE APPROVALS DESK
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'insurance' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6 doc-anim-enter">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">TPA Insurance Claim Approval Desk</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Review pre-authorizations, policy documents & cashless claim settlements
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
              {insuranceClaims.length} Total Claims Managed
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Claim Ref</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Patient Name</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Insurance Provider</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Claim Amount</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Approved Amount</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Status</th>
                  <th className="py-3 px-4 text-right font-black text-slate-500 uppercase tracking-wider text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {insuranceClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-purple-700">{claim.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{claim.patientName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{claim.provider || 'Star Health Insurance'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{claim.claimAmount?.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">₹{claim.preApprovedAmount?.toLocaleString() || claim.claimAmount?.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        claim.status === 'Pre-Approved' || claim.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {claim.status === 'Under Review' ? (
                        <button
                          onClick={() => approveInsuranceClaim(claim.id, claim.claimAmount)}
                          className="px-3 py-1 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-xs"
                        >
                          Pre-Approve
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-extrabold text-[11px] flex items-center gap-1 justify-end">
                          <Check className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 6: EMERGENCY AMBULANCE & BLOOD BANK
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'emergency' && (
        <div className="space-y-6 doc-anim-enter">
          {/* Ambulance Fleet */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">108 Emergency Ambulance Fleet & GPS Dispatch</h3>
                <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                  108 Trauma emergency dispatch, ALS ICU equipment & live driver fleet
                </p>
              </div>
              <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black">
                {ambulanceFleet.filter(a => a.status === 'Available').length} Ambulances Standing By
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ambulanceFleet.map(amb => (
                <div key={amb.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-black text-slate-900 m-0">{amb.vehicleNo}</h4>
                        <span className="text-[11px] font-bold text-[#242454]">{amb.type}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        amb.status === 'Dispatched' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                      }`}>
                        {amb.status}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div>Driver: <strong className="text-slate-800">{amb.driver}</strong></div>
                      <div>Location: <strong className="text-amber-700">{amb.location}</strong></div>
                    </div>
                  </div>

                  {amb.status === 'Available' ? (
                    <button
                      onClick={() => dispatchAmbulance(amb.id, 'Emergency Patient', 'Marine Drive, Mumbai')}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Siren className="w-4 h-4" />
                      <span>Dispatch 108 Emergency</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl text-center">
                      In Active Transit...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Blood Bank Stock */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">Blood Bank Inventory & Stock Levels</h3>
                <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                  Live hospital blood units stock levels & emergency donor reserves
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {bloodBank.map(item => (
                <div key={item.group} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shadow-2xs hover:bg-white transition-all">
                  <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
                    <Droplet className="w-4 h-4 fill-rose-600" />
                    <h4 className="text-lg font-black text-slate-900 m-0">{item.group}</h4>
                  </div>
                  <div className="text-xl font-black text-slate-900">{item.units}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Units</span>
                  <span className={`block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    item.status === 'Critical' ? 'bg-rose-100 text-rose-700' :
                    item.status === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 7: SECURITY AUDIT LOGS & COMPLIANCE
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6 doc-anim-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Security & Clinical Audit Event Trail</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Cryptographic session logs, clinical mutations & regulatory compliance events
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user, action, IP..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Timestamp</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Initiator</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Action Description</th>
                  <th className="py-3 px-4 font-black text-slate-500 uppercase tracking-wider text-[11px]">Terminal IP</th>
                  <th className="py-3 px-4 text-right font-black text-slate-500 uppercase tracking-wider text-[11px]">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.user}</td>
                    <td className="py-3.5 px-4 text-[#242454] font-semibold">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{log.ip || '192.168.1.104'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        log.level === 'WARN' ? 'bg-amber-100 text-amber-800' :
                        log.level === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.level || 'INFO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: Register New Doctor ─────────────────────────────────── */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-xl w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#16163B] text-white flex items-center justify-center shadow-md">
                  <Stethoscope className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Register Specialist Doctor</h3>
                  <p className="text-xs text-slate-500 m-0">Add Indian specialist physician to the hospital roster</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center border-none cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Arvind Narayanan"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Department</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454]"
                    value={newDocDeptId}
                    onChange={(e) => setNewDocDeptId(e.target.value)}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454]"
                    value={newDocExp}
                    onChange={(e) => setNewDocExp(e.target.value)}
                    placeholder="e.g. 12+ Years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454]"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">OPD Schedule</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454]"
                    value={newDocSchedule}
                    onChange={(e) => setNewDocSchedule(e.target.value)}
                  />
                </div>
              </div>

              {/* Indian Doctor Avatar Choice */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Select Portrait (Authentic Indian Doctor)</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { src: '/images/doctors/indian_doc_m1.jpg', label: 'Male 1' },
                    { src: '/images/doctors/indian_doc_f1.jpg', label: 'Female 1' },
                    { src: '/images/doctors/indian_doc_m2.jpg', label: 'Male 2' },
                    { src: '/images/doctors/indian_doc_f2.jpg', label: 'Female 2' },
                    { src: '/images/doctors/indian_doc_m3.jpg', label: 'Male 3' },
                    { src: '/images/doctors/indian_doc_f3.jpg', label: 'Female 3' },
                    { src: '/images/doctors/indian_doc_m4.jpg', label: 'Male 4' },
                    { src: '/images/doctors/indian_doc_f4.jpg', label: 'Female 4' },
                    { src: '/images/doctors/indian_doc_m5.jpg', label: 'Male 5' },
                    { src: '/images/doctors/indian_doc_f5.jpg', label: 'Female 5' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewDocAvatar(item.src)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 p-0.5 cursor-pointer transition-all ${
                        newDocAvatar === item.src ? 'border-[#16163B] ring-2 ring-[#E9DF70] scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.src} alt={item.label} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 size={16} className="text-[#E9DF70]" />
                <span>Register Specialist Physician</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Issue System Invoice ─────────────────────────────────── */}
      {showCreateBillModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#16163B] text-white flex items-center justify-center shadow-md">
                  <Receipt className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Issue System Invoice</h3>
                  <p className="text-xs text-slate-500 m-0">Generate hospital patient bill with GST receipt</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateBillModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Select Patient</label>
                <select
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454]"
                  value={billPatientId}
                  onChange={(e) => setBillPatientId(e.target.value)}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Clinical Service Rendered</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454]"
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  placeholder="e.g. IPD Room Tariff & Specialist Consult"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Total Amount (₹)</label>
                <input
                  type="number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454]"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 size={16} className="text-[#E9DF70]" />
                <span>Issue Official Invoice</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;
