import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, User, CheckCircle2, AlertCircle, Clock, Stethoscope } from 'lucide-react';

export const DoctorAppointments = () => {
  const { appointments, doctors, activeDoctor, updateAppointmentStatus, showToast } = useApp();

  const doctorApts = appointments.filter(
    (a) => a.doctorId === activeDoctor?.id || a.doctorName === activeDoctor?.name
  );

  const statusColors = {
    Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Confirmed & Paid': 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 m-0">Consultation Queue</h2>
            <p className="text-xs text-slate-500 m-0">{doctorApts.length} appointments assigned to you</p>
          </div>
        </div>

        {doctorApts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctorApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{apt.patientName}</div>
                    <div className="text-xs text-slate-500 font-medium">{apt.reason || 'General Consultation'}</div>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-600 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${statusColors[apt.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {apt.status}
                  </span>

                  {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'In Progress')}
                        className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-extrabold rounded-xl border-none cursor-pointer hover:bg-slate-800"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-extrabold rounded-xl border-none cursor-pointer hover:bg-emerald-700"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
