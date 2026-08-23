import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pill, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export const MyMeds = () => {
  const { medsSchedule, toggleMedication } = useApp();

  const takenCount = medsSchedule.filter(m => m.taken).length;
  const progressPct = medsSchedule.length > 0 ? Math.round((takenCount / medsSchedule.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>My Medication Tracker</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily medicine reminders synchronized with doctor prescriptions</p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>DAILY COMPLIANCE</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{takenCount} of {medsSchedule.length} Taken</strong>
          </div>
          <div style={{ width: '60px', height: '60px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--green)' }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Medication List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {medsSchedule.map(med => (
          <div
            key={med.id}
            onClick={() => toggleMedication(med.id)}
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              cursor: 'pointer',
              borderLeft: med.taken ? '4px solid var(--green)' : '4px solid var(--amber)',
              background: med.taken ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ color: med.taken ? 'var(--green)' : 'var(--text-muted)' }}>
                {med.taken ? <CheckCircle2 size={26} /> : <Circle size={26} />}
              </div>

              <div>
                <h4 style={{ color: med.taken ? 'var(--text-muted)' : '#fff', fontSize: '1.1rem', fontWeight: '700', textDecoration: med.taken ? 'line-through' : 'none' }}>
                  {med.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Dosage: <strong>{med.dose}</strong> • {med.instructions}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                <Clock size={13} /> {med.time}
              </span>
              <span style={{ fontSize: '0.75rem', color: med.taken ? 'var(--green)' : 'var(--amber)', display: 'block', marginTop: '0.35rem', fontWeight: '600' }}>
                {med.taken ? 'Completed' : 'Pending Dose'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
