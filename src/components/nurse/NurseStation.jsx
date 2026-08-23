import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bed, HeartPulse, Plus, CheckCircle2, Activity, User, AlertTriangle } from 'lucide-react';

export const NurseStation = () => {
  const { beds, updateBedStatus } = useApp();
  const [selectedBed, setSelectedBed] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Nurse Station & Inpatient Ward Matrix</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monitor inpatient bed occupancy, IV drips, SpO2 levels & bed turn-overs</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-danger">1 ICU Occupied</span>
          <span className="badge badge-success">2 Beds Free</span>
        </div>
      </div>

      {/* Bed Grid Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {beds.map(bed => (
          <div
            key={bed.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderLeft: bed.status === 'Occupied' ? '4px solid var(--red)' : bed.status === 'Available' ? '4px solid var(--green)' : '4px solid var(--amber)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Bed {bed.number}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{bed.ward}</span>
                </div>
                <span className={`badge ${
                  bed.status === 'Occupied' ? 'badge-danger' :
                  bed.status === 'Available' ? 'badge-success' : 'badge-warning'
                }`}>
                  {bed.status}
                </span>
              </div>

              {bed.status === 'Occupied' ? (
                <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <div>Patient: <strong style={{ color: 'var(--primary)' }}>{bed.patientName}</strong></div>
                  <div>Attending Nurse: <strong style={{ color: '#fff' }}>{bed.attendingNurse}</strong></div>
                  <div>SpO2 Oxygen: <strong style={{ color: 'var(--green)' }}>{bed.oxygenLevel}</strong></div>
                  {bed.ivDrip && <div>IV Drip: <strong style={{ color: 'var(--blue)' }}>{bed.ivDrip}</strong></div>}
                </div>
              ) : (
                <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Bed Ready for Admission
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              {bed.status === 'Occupied' ? (
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }} onClick={() => updateBedStatus(bed.id, 'Cleaning')}>
                  Mark for Cleaning / Discharge
                </button>
              ) : (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }} onClick={() => updateBedStatus(bed.id, 'Occupied', 'pat-103', 'Tanishq Patil')}>
                  Assign Admission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
