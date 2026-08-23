import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, Stethoscope, Plus, X, Video, ChevronRight, Phone } from 'lucide-react';

export const MyAppointments = () => {
  const { activePatient, appointments, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApt, setSelectedApt] = useState(null);

  const myAppointments = appointments;
  const filtered = filterStatus === 'All' ? myAppointments : myAppointments.filter(a => a.status === filterStatus);

  const statusClass = {
    'Confirmed & Paid': 'badge-success',
    'Scheduled':        'badge-info',
    'Completed':        'badge-success',
    'Cancelled':        'badge-danger',
    'In Progress':      'badge-warning',
  };

  const isJoinable = (status) => ['Confirmed & Paid', 'Scheduled', 'In Progress'].includes(status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 m-0">My Appointments</h2>
          <p className="text-xs text-slate-500 mt-1 m-0">All your OPD & specialist consultations</p>
        </div>
        <button
          onClick={() => navigate('/book-appointment')}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl border-none cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Book New
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
        {['All', 'Scheduled', 'Confirmed & Paid', 'Completed', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${
              filterStatus === s
                ? 'bg-slate-900 text-white'
                : 'bg-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <CalendarCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-500 mb-4">No appointments found.</p>
          <button
            onClick={() => navigate('/book-appointment')}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-extrabold rounded-xl border-none cursor-pointer"
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(apt => (
            <div
              key={apt.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => setSelectedApt(apt)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {apt.doctorAvatar
                    ? <img src={apt.doctorAvatar} alt={apt.doctorName} className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                    : <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center"><Stethoscope className="w-5 h-5 text-white" /></div>
                  }
                  <div>
                    <div className="text-sm font-black text-slate-900">{apt.doctorName}</div>
                    <div className="text-xs text-slate-500 font-medium">{apt.specialty}</div>
                  </div>
                </div>
                <span className={`badge ${statusClass[apt.status] || 'badge-info'}`}>{apt.status}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Clock className="w-3 h-3" /> {apt.date} at {apt.time}
                </div>
                {apt.reason && <div className="text-slate-500">Reason: {apt.reason}</div>}
                {apt.fee && <div className="font-bold text-slate-800">Fee: ₹{apt.fee} · {apt.paymentMethod || 'Counter'}</div>}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 border-t border-slate-100 pt-3" onClick={e => e.stopPropagation()}>
                {isJoinable(apt.status) && (
                  <button
                    onClick={() => navigate('/video-call', { state: { appointment: apt } })}
                    style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.55rem', background: 'linear-gradient(135deg,#0f172a,#1e40af)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    <Video size={13} /> Join Video Call
                  </button>
                )}
                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0.55rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    <X size={12} /> Cancel
                  </button>
                )}
                {!isJoinable(apt.status) && apt.status !== 'Scheduled' && (
                  <button
                    onClick={() => navigate('/book-appointment')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0.55rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Book Again <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedApt && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelectedApt(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {selectedApt.doctorAvatar
                ? <img src={selectedApt.doctorAvatar} alt={selectedApt.doctorName} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
                : <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Stethoscope size={24} color="#fff" /></div>
              }
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{selectedApt.doctorName}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 2 }}>{selectedApt.specialty}</div>
                <span style={{ display: 'inline-block', marginTop: 6, fontSize: '0.65rem', fontWeight: 800, padding: '2px 10px', borderRadius: 99, background: selectedApt.status === 'Confirmed & Paid' ? '#10b981' : '#3b82f6', color: '#fff' }}>
                  {selectedApt.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <div><div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</div><div style={{ color: '#0f172a', fontWeight: 800, marginTop: 2 }}>{selectedApt.date} · {selectedApt.time}</div></div>
                  <div><div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Fee Paid</div><div style={{ color: '#059669', fontWeight: 800, marginTop: 2 }}>₹{selectedApt.fee}</div></div>
                  <div><div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Payment</div><div style={{ color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{selectedApt.paymentMethod || 'Counter'}</div></div>
                  <div><div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Ref ID</div><div style={{ color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{selectedApt.id}</div></div>
                </div>
                {selectedApt.reason && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Reason for Visit</div>
                    <div style={{ color: '#0f172a', fontWeight: 600, marginTop: 4, fontSize: '0.85rem' }}>{selectedApt.reason}</div>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {isJoinable(selectedApt.status) && (
                  <button
                    onClick={() => { setSelectedApt(null); navigate('/video-call', { state: { appointment: selectedApt } }); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.85rem', background: 'linear-gradient(135deg,#0f172a,#1e40af)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,23,42,0.3)' }}
                  >
                    <Video size={16} /> Join Video Call
                  </button>
                )}
                <button
                  onClick={() => setSelectedApt(null)}
                  style={{ padding: '0.85rem 1.25rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
