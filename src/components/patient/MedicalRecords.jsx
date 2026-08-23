import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescriptionPrintModal } from '../common/PrescriptionPrintModal';
import { FileText, Printer, Stethoscope, Search, Calendar, ChevronRight } from 'lucide-react';

export const MedicalRecords = () => {
  const { activePatient, prescriptions } = useApp();
  const [selectedRx, setSelectedRx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const myPrescriptions = prescriptions.filter(r => r.patientId === activePatient.id);
  const filteredRx = myPrescriptions.filter(r =>
    r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Medical Records & Digital Prescriptions</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cryptographically signed clinical notes & electronic prescriptions</p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search diagnosis or doctor..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Prescription Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {filteredRx.map(rx => (
          <div key={rx.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{rx.doctorName}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued: {rx.date} • Ref: {rx.id}</span>
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setSelectedRx(rx)}>
                  <Printer size={14} /> Printable View
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Diagnosis</span>
                <p style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>{rx.diagnosis}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Prescribed Medications ({rx.medications.length})</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {rx.medications.map((m, idx) => (
                    <div key={idx} style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--primary)' }}>{m.name}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.dosage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Prescription Modal */}
      {selectedRx && (
        <PrescriptionPrintModal rx={selectedRx} onClose={() => setSelectedRx(null)} />
      )}
    </div>
  );
};
