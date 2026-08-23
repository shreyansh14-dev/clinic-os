import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, FileText, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';

export const DoctorPatients = () => {
  const { patients, prescriptions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Patient Directory & Medical History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search registered patient records, emergency contacts & allergy details</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search patient name, phone..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {filteredPatients.map(pat => {
          const patientRxCount = prescriptions.filter(r => r.patientId === pat.id).length;

          return (
            <div key={pat.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{pat.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pat.gender}, {pat.age} Yrs • ID: {pat.id}</span>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                    Blood Group: {pat.bloodGroup}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} style={{ color: 'var(--primary)' }} /> {pat.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} style={{ color: 'var(--blue)' }} /> {pat.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--amber)' }} /> {pat.address}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Known Medical History & Allergies</span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {pat.medicalHistory.map((h, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{patientRxCount} Issued Prescriptions</span>
                <button
                  className="btn-primary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => setSelectedPatientForRx(pat)}
                >
                  <FileText size={14} /> New Prescription
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPatientForRx && (
        <CreatePrescriptionModal patient={selectedPatientForRx} onClose={() => setSelectedPatientForRx(null)} />
      )}
    </div>
  );
};
