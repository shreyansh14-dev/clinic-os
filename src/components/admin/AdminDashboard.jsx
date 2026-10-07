import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Stethoscope,
  Clock,
  Receipt,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Activity,
  FileCheck2,
  CalendarCheck2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { patients, doctors, appointments, bills, labTests } = useApp();
  const navigate = useNavigate();
  const setActiveTab = (tab) => {
    const map = {
      'system-invoices': '/system-invoices',
      'manage-doctors': '/manage-doctors',
      'manage-departments': '/manage-departments'
    };
    navigate(map[tab] || '/admin');
  };

  const totalPatients = patients.length || 15;
  const totalDoctors = doctors.length || 5;
  const pendingVisits = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length;
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const pendingLabRequests = labTests.filter(t => t.status === 'Pending').length;
  const unpaidBillsCount = bills.filter(b => b.status === 'Unpaid').length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-8 font-sans">
      
      {/* Authority Control Panel Hero Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Building2 className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black tracking-wide text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>HOSPITAL AUTHORITY CONTROL PANEL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
              Authority Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl m-0 leading-relaxed">
              Review care requests, allocate clinical resources, and monitor daily hospital operations across all departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('system-invoices')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5F2EEA] hover:bg-[#4E22D4] text-white text-xs font-bold transition-all shadow-md shadow-purple-500/25 border-none cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Issue or Manage Bills</span>
            </button>
            <button
              onClick={() => setActiveTab('manage-doctors')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-md cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-purple-300" />
              <span>Manage Doctors</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pastel Metric Cards (Matching ClinicOS Design Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Patients Card (Pastel Sky) */}
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(37,99,235,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-blue-700 border border-blue-200">
              Active EMR
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{totalPatients}</div>
          <div className="text-xs font-bold text-slate-700">Registered Accounts</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total registered patients</div>
        </div>

        {/* Doctors Card (Pastel Lavender) */}
        <div className="bg-[#F5F3FF] border border-[#EDE9FE] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(124,58,237,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-purple-700 border border-purple-200">
              On Roster
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{totalDoctors}</div>
          <div className="text-xs font-bold text-slate-700">Consultants On Roster</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Specialists across OPD</div>
        </div>

        {/* Pending Visits Card (Pastel Amber) */}
        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(234,88,12,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-amber-700 border border-amber-200">
              Queued
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{pendingVisits}</div>
          <div className="text-xs font-bold text-slate-700">Pending Visits</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting clinical clearance</div>
        </div>

        {/* Hospital Revenue Card (Pastel Mint) */}
        <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(5,150,105,0.04)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200">
              Cleared
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-700">Hospital Revenue</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Collected digital clearance</div>
        </div>

      </div>

      {/* Middle Row: Approval Queue & Billing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Approval Queue */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#5F2EEA]">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Approval Queue</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              <strong className="text-slate-800">{pendingVisits}</strong> appointment requests and <strong className="text-slate-800">{pendingLabRequests}</strong> diagnostic requests await administration verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('manage-doctors')}
              className="px-4 py-2 bg-[#5F2EEA] hover:bg-[#4E22D4] text-white font-bold text-xs rounded-full border-none cursor-pointer transition-all shadow-xs"
            >
              Review Appointments
            </button>
            <button
              onClick={() => setActiveTab('manage-departments')}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-full cursor-pointer transition-all"
            >
              Review Diagnostic Tests
            </button>
          </div>
        </div>

        {/* Billing Overview */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Billing & Ledger</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              <strong className="text-slate-800">{unpaidBillsCount}</strong> bills awaiting patient clearance. Total collected through digital clearance: <strong className="text-emerald-600">₹{totalRevenue.toLocaleString()}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('system-invoices')}
              className="px-4 py-2 bg-[#5F2EEA] hover:bg-[#4E22D4] text-white font-bold text-xs rounded-full border-none cursor-pointer transition-all shadow-xs"
            >
              Issue or Manage Bills
            </button>
          </div>
        </div>

      </div>

      {/* Doctor Roster Cards Grid */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 m-0">Registered Doctors & Consultants Roster</h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Manage physician credentials, specialty allocations, and consultation fees</p>
          </div>
          <button
            onClick={() => setActiveTab('manage-doctors')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5F2EEA] hover:bg-[#4E22D4] text-white font-bold text-xs border-none cursor-pointer transition-all self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Doctor</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, 6).map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-slate-100 bg-[#FAFBFD] hover:bg-white hover:border-purple-200 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs ring-2 ring-slate-100 group-hover:ring-purple-200 transition-all"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900 m-0 group-hover:text-[#5F2EEA] transition-colors">
                    {doc.name}
                  </h4>
                  <span className="inline-block mt-0.5 text-[11px] font-bold text-[#5F2EEA] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {doc.specialty}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  ₹{doc.consultationFee || doc.fee || 2000}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('manage-doctors')}
                  className="flex-1 py-1.5 px-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setActiveTab('manage-doctors')}
                  className="flex-1 py-1.5 px-3 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-[11px] inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
