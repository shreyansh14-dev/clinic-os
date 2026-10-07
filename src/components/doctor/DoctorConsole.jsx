import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import {
  Stethoscope,
  CalendarCheck,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  TestTube2,
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
  Video
} from 'lucide-react';

export const DoctorConsole = () => {
  const { activeDoctor, appointments, patients, updateAppointmentStatus } = useApp();
  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const docAppointments = appointments.filter(a => a.doctorId === activeDoctor?.id || true);
  const activeCount = docAppointments.filter(a => a.status === 'Scheduled').length;
  const totalPatientsCount = patients.length;
  const sharedReportsCount = 4;

  const filteredAppointments = docAppointments.filter(apt =>
    !searchFilter ||
    apt.patientName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    apt.symptoms?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    apt.reason?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 pb-16 font-sans">
      
      {/* 1. Welcome Doctor Hero Card */}
      <div className="bg-gradient-to-r from-purple-50/70 via-white to-indigo-50/70 rounded-[28px] p-6 sm:p-7 border border-purple-100/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activeDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&auto=format&fit=crop&q=80'}
              alt={activeDoctor?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shadow-purple-500/10"
            />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">DOCTOR WORKSPACE</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Online & Active
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading m-0 mt-0.5">
              {activeDoctor?.name || 'Dr. Souvik Sinha'}
            </h2>
            <p className="text-xs text-slate-500 font-medium m-0 mt-1">
              {activeDoctor?.specialty || 'Cardiology Specialist'} • OPD Chamber 104 • ClinicOS Smart Network
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedPatientForRx(patients[0])}
          className="bg-[#5F2EEA] hover:bg-[#4E24C9] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md shadow-purple-500/20 flex items-center gap-2 border-none cursor-pointer transition-transform active:scale-95 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Issue New Prescription</span>
        </button>
      </div>

      {/* 2. Metrics Cards Row (Matching Pastel Color Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Metric 1: Active Appointments */}
        <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-amber-200/80 rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Active Appointments</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-heading">{activeCount}</div>
            <span className="text-xs text-amber-900/80 font-semibold">Scheduled for Today</span>
          </div>
        </div>

        {/* Metric 2: Total Patients */}
        <div className="bg-gradient-to-br from-[#EFF6FF] via-[#EBF3FE] to-[#DBEAFE] border border-blue-200/80 rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">My Patients</span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-heading">{totalPatientsCount}</div>
            <span className="text-xs text-blue-900/80 font-semibold">Active Patient Profiles</span>
          </div>
        </div>

        {/* Metric 3: Shared Reports */}
        <div className="bg-gradient-to-br from-[#ECFDF5] via-[#E6FBF5] to-[#D1FAE5] border border-emerald-200/80 rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Shared Test Reports</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <TestTube2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-heading">{sharedReportsCount}</div>
            <span className="text-xs text-emerald-900/80 font-semibold">Diagnostic Reports Pending Review</span>
          </div>
        </div>

      </div>

      {/* 3. Consultation Schedule & Patient Queue */}
      <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-heading m-0">
              Consultation Schedule & Patient Queue
            </h3>
            <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
              Manage live consultations, patient history and clinical notes
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by patient or reason..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Visit Date & Time</th>
                <th className="py-3 px-3">Symptoms / Reason</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAppointments.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {apt.patientName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <strong className="text-slate-900 font-black block text-xs">{apt.patientName}</strong>
                        <span className="text-[10px] text-slate-400 font-semibold">ID: {apt.patientId || 'PT-104'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{apt.date}</div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {apt.time}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {apt.reason || apt.symptoms}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => {
                          const patObj = patients.find(p => p.id === apt.patientId) || patients[0];
                          setSelectedPatientForRx(patObj);
                        }}
                        className="px-3 py-1.5 bg-[#5F2EEA] hover:bg-[#4E24C9] text-white font-bold text-[11px] rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Prescribe</span>
                      </button>
                      {apt.status === 'Scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer transition-all"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Generator Modal */}
      {selectedPatientForRx && (
        <CreatePrescriptionModal
          patient={selectedPatientForRx}
          onClose={() => setSelectedPatientForRx(null)}
        />
      )}
    </div>
  );
};
