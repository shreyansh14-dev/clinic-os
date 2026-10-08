import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Stethoscope,
  Video,
  FileText,
  Search,
  Filter,
  Activity,
  PhoneCall,
  Check,
  ChevronRight
} from 'lucide-react';

export const DoctorAppointments = () => {
  const { appointments, activeDoctor, updateAppointmentStatus, showToast } = useApp();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const doctorApts = appointments.filter(
    (a) => a.doctorId === activeDoctor?.id || a.doctorName === activeDoctor?.name || !a.doctorId
  );

  const filteredApts = doctorApts.filter(apt => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (apt.patientName && apt.patientName.toLowerCase().includes(query)) ||
      (apt.reason && apt.reason.toLowerCase().includes(query)) ||
      (apt.id && apt.id.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    'In-Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Confirmed & Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Checked-In': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 font-['Poppins']">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] rounded-[32px] p-7 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-black uppercase tracking-wider">
              Outpatient Department (OPD)
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Today's Consultation Schedule
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
            Consultation Queue &amp; Patient Appointments
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1 max-w-xl">
            Triage patient arrivals, examine chief complaints, initiate video consultations, and record prescriptions.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-[#E9DF70]">{doctorApts.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Total Patients</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-2xl font-black text-emerald-400">
              {doctorApts.filter(a => a.status === 'Completed').length}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Consulted</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search patient, symptoms, or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            {['All', 'Scheduled', 'In-Progress', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold border-none cursor-pointer text-xs transition-all ${
                  statusFilter === st
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500">
          {filteredApts.length} Appointments Listed
        </div>
      </div>

      {/* Appointments Cards */}
      <div className="space-y-3">
        {filteredApts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-700 m-0">No appointments found</h4>
            <p className="text-xs text-slate-400 m-0 mt-1">Check back later or adjust the filter parameters.</p>
          </div>
        ) : (
          filteredApts.map((apt, index) => {
            const isCompleted = apt.status === 'Completed';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-[24px] border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Token Number */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16163B] to-[#242454] text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#E9DF70] leading-none">Token</span>
                    <span className="text-base leading-none mt-0.5">#{index + 1}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 m-0">{apt.patientName}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusColors[apt.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {apt.status}
                      </span>
                      {apt.type && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {apt.type}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 font-semibold mt-1">
                      Reason: <strong className="text-slate-800">{apt.reason || 'General Consultation'}</strong>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apt.date || 'Today'} at {apt.time || '10:30 AM'}</span>
                      </span>
                      <span>·</span>
                      <span>ID: {apt.id}</span>
                      {apt.fee && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold">Fee: ₹{apt.fee} (Paid)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center flex-wrap gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      navigate('/doctor-console');
                    }}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 cursor-pointer flex items-center gap-1.5 transition-all"
                    title="Start Live Video Teleconsultation"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Video</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/create-prescription');
                    }}
                    className="px-3.5 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E9DF70]" />
                    <span>Write Rx</span>
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => {
                        updateAppointmentStatus(apt.id, 'Completed');
                        showToast(`Consultation for ${apt.patientName} marked completed!`);
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default DoctorAppointments;
