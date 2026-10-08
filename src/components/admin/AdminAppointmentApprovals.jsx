import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  X,
  Stethoscope,
  User,
  Filter,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminAppointmentApprovals = () => {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    rescheduleAppointment,
    showToast,
    addAuditLog
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled'
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('2026-10-12');
  const [rescheduleTime, setRescheduleTime] = useState('11:30 AM');
  const [rescheduleDoctor, setRescheduleDoctor] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('Patient requested alternate slot');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      !searchQuery ||
      apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (apt) => {
    updateAppointmentStatus(apt.id, 'Scheduled');
    addAuditLog(
      `Approved and scheduled appointment ${apt.id} for ${apt.patientName} with ${apt.doctorName}`,
      'Hospital Admin',
      'SUCCESS'
    );
    showToast(`Appointment for ${apt.patientName} approved and confirmed!`);
  };

  const handleOpenRescheduleModal = (apt) => {
    setSelectedAppointmentForReschedule(apt);
    setRescheduleDate(apt.date || '2026-10-12');
    setRescheduleTime(apt.time || '11:00 AM');
    setRescheduleDoctor(apt.doctorName || doctors[0]?.name);
    setRescheduleReason('Administrative OPD adjustment');
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!selectedAppointmentForReschedule) return;

    rescheduleAppointment(
      selectedAppointmentForReschedule.id,
      rescheduleDate,
      rescheduleTime,
      rescheduleDoctor
    );

    addAuditLog(
      `Rescheduled appointment ${selectedAppointmentForReschedule.id} to ${rescheduleDate} at ${rescheduleTime} (Reason: ${rescheduleReason})`,
      'Hospital Admin',
      'WARN'
    );

    showToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}!`);
    setSelectedAppointmentForReschedule(null);
  };

  const handleCancelAppointment = (apt) => {
    const reason = prompt(`Reason for cancelling appointment for ${apt.patientName}:`, 'Doctor unavailable / Emergency duty');
    if (reason !== null) {
      updateAppointmentStatus(apt.id, 'Cancelled');
      addAuditLog(
        `Cancelled appointment ${apt.id} for ${apt.patientName} (Reason: ${reason})`,
        'Hospital Admin',
        'WARN'
      );
      showToast(`Appointment ${apt.id} cancelled.`);
    }
  };

  const handleMarkCompleted = (apt) => {
    updateAppointmentStatus(apt.id, 'Completed');
    addAuditLog(
      `Consultation completed for ${apt.patientName} with ${apt.doctorName}`,
      'Hospital Admin'
    );
    showToast(`Visit for ${apt.patientName} marked Completed.`);
  };

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const rescheduledCount = appointments.filter((a) => a.status === 'Rescheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header Bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <CalendarCheck2 className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  4 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Live Consultation Booking Clearances
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Approve &amp; Reschedule Appointments Desk
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
              {pendingCount} Awaiting Approval
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
              {scheduledCount} Confirmed
            </span>
          </div>
        </div>

        {/* Search & Filter pills */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Patient name, Doctor, Specialty, or Appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#5F2EEA] focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'All', label: 'All' },
              { id: 'Pending', label: `Pending (${pendingCount})` },
              { id: 'Scheduled', label: `Scheduled (${scheduledCount})` },
              { id: 'Rescheduled', label: `Rescheduled (${rescheduledCount})` },
              { id: 'Completed', label: `Completed (${completedCount})` },
              { id: 'Cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-slate-100 p-12 text-center text-slate-400 font-bold text-xs space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="m-0">No appointments found matching current filter.</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-[24px] border border-slate-200/90 shadow-2xs hover:shadow-md p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Patient & Doctor Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5F2EEA]/10 to-purple-100 text-[#5F2EEA] flex items-center justify-center font-black text-sm shrink-0 border border-purple-200">
                  <User className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm font-extrabold text-slate-900">{apt.patientName}</strong>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {apt.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        apt.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : apt.status === 'Scheduled'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : apt.status === 'Rescheduled'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : apt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      ● {apt.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      {apt.type || 'In-Person'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#16163B] flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#5F2EEA]" />
                      {apt.doctorName}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-medium">{apt.specialty}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 m-0 max-w-xl">
                    <span className="font-bold text-slate-700">Chief Symptoms:</span> {apt.symptoms || 'General OPD follow-up and clinical consultation.'}
                  </p>
                </div>
              </div>

              {/* Center: Date & Time Schedule */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 min-w-[210px] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-[#5F2EEA]" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">Fee Status</span>
                  <span
                    className={`text-[10px] font-black ${
                      apt.paid ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {apt.paid ? '₹' + (apt.fee || 2000) + ' Paid' : 'Pay at Desk'}
                  </span>
                </div>
              </div>

              {/* Right: Operational Actions (Approve / Reschedule / Cancel / Complete) */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Approve Button (If pending) */}
                {apt.status === 'Pending' && (
                  <button
                    onClick={() => handleApprove(apt)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {/* Reschedule Button */}
                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleOpenRescheduleModal(apt)}
                    className="px-3.5 py-2 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#E9DF70]" />
                    <span>Reschedule</span>
                  </button>
                )}

                {/* Mark Completed Button */}
                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => handleMarkCompleted(apt)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Attended</span>
                  </button>
                )}

                {/* Cancel Button */}
                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelAppointment(apt)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 font-bold text-xs border border-slate-200 cursor-pointer transition-all"
                    title="Cancel Appointment"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MODAL: Reschedule Appointment ──────────────────────────────── */}
      {selectedAppointmentForReschedule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md">
                  <RotateCcw className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Reschedule Consultation</h3>
                  <p className="text-xs text-slate-500 m-0">
                    Patient: {selectedAppointmentForReschedule.patientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointmentForReschedule(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Appointment Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleTime(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        rescheduleTime === slot
                          ? 'bg-[#16163B] text-white border-[#16163B]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assigned Consultant</label>
                <select
                  value={rescheduleDoctor}
                  onChange={(e) => setRescheduleDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] bg-white"
                >
                  {doctors.slice(0, 15).map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Reason for Rescheduling</label>
                <input
                  type="text"
                  required
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppointmentForReschedule(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Save &amp; Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
