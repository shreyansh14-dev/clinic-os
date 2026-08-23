import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Search, User, Clock, Heart, ShieldCheck, Activity } from 'lucide-react';

export const EMRTimeline = () => {
  const { patients, prescriptions, labTests } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const activePat = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patRx = prescriptions.filter(r => r.patientId === activePat.id);
  const patLabs = labTests.filter(l => l.patientId === activePat.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Electronic Health Records (EHR / EMR)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Longitudinal clinical timeline, past diagnoses & diagnostic history</p>
        </div>

        <select
          className="select-field"
          style={{ width: '280px' }}
          value={selectedPatientId}
          onChange={e => setSelectedPatientId(e.target.value)}
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
          ))}
        </select>
      </div>

      {/* Patient Profile Header */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>{activePat.name}</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Gender: <strong>{activePat.gender}</strong> • Age: <strong>{activePat.age} Yrs</strong> • Blood Group: <strong style={{ color: 'var(--primary)' }}>{activePat.bloodGroup}</strong> • ABHA: {activePat.abhaId}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activePat.medicalHistory.map((h, i) => (
            <span key={i} className="badge badge-purple" style={{ padding: '0.35rem 0.75rem' }}>
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Clinical Timeline */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>Clinical Timeline & Case Notes</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {patRx.map(rx => (
            <div key={rx.id} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.75rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{rx.diagnosis}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rx.date} • {rx.doctorName}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Advice: {rx.advice}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {rx.medications.map((m, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                    {m.name} ({m.dosage})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
