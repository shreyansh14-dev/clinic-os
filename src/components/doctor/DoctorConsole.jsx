import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import { Stethoscope, CalendarCheck, Users, FileText, CheckCircle2, Clock, Plus, Search, TestTube2 } from 'lucide-react';

export const DoctorConsole = () => {
  const { activeDoctor, appointments, patients, updateAppointmentStatus, setActiveTab } = useApp();
  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);

  const docAppointments = appointments.filter(a => a.doctorId === activeDoctor?.id || true);
  const activeCount = docAppointments.filter(a => a.status === 'Scheduled').length;
  const totalPatientsCount = patients.length;
  const sharedReportsCount = 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Welcome Doctor Banner (Matching Presentation Slide 5 & 12) */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, #161c28 0%, #0d111a 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img src={activeDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'} alt={activeDoctor?.name} style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff5500' }} />
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Welcome back, Doctor</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>{activeDoctor?.name || 'Dr. Souvik Sinha'}</h2>
            <p style={{ fontSize: '0.85rem', color: '#ff5500', fontWeight: '600', marginTop: '0.2rem', marginBottom: 0 }}>
              {activeDoctor?.specialty || 'Cardiology Specialist'} • OPD Chamber 104
            </p>
          </div>
        </div>

        <button className="btn-orange" onClick={() => setSelectedPatientForRx(patients[0])}>
          <FileText size={18} /> Issue New Prescription
        </button>
      </div>

      {/* Metrics Row (Matching Slide 5 Screenshot: Active Appointments 0, My Patients 6, Shared Test Reports 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Active Appointments</span>
          <h3 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ff5500', margin: '0.2rem 0' }}>{activeCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scheduled for Today</span>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>My Patients</span>
          <h3 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#38bdf8', margin: '0.2rem 0' }}>{totalPatientsCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Patient Profiles</span>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Shared Test Reports</span>
          <h3 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#34d399', margin: '0.2rem 0' }}>{sharedReportsCount}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lab Reports Pending Review</span>
        </div>

      </div>

      {/* Consultation Schedule & Patient Queue */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>Consultation Schedule & Patient Queue</h3>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Visit Date & Time</th>
              <th>Symptoms / Reason</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Clinical Actions</th>
            </tr>
          </thead>
          <tbody>
            {docAppointments.map(apt => (
              <tr key={apt.id}>
                <td>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block' }}>{apt.patientName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {apt.patientId}</span>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{apt.date}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.time}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{apt.reason || apt.symptoms}</td>
                <td>
                  <span className={`badge ${apt.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                    {apt.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-orange"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={() => {
                        const patObj = patients.find(p => p.id === apt.patientId) || patients[0];
                        setSelectedPatientForRx(patObj);
                      }}
                    >
                      <FileText size={14} /> Write Prescription
                    </button>
                    {apt.status === 'Scheduled' && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                      >
                        Complete Visit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prescription Generator Modal */}
      {selectedPatientForRx && (
        <CreatePrescriptionModal patient={selectedPatientForRx} onClose={() => setSelectedPatientForRx(null)} />
      )}
    </div>
  );
};
