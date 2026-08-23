import React from 'react';
import { useApp } from '../../context/AppContext';
import { Pill, CheckCircle2, Clock, User, Package } from 'lucide-react';

export const DispensingQueue = () => {
  const { prescriptions, dispensePrescription } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Prescription Dispensing Queue</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Incoming digital prescriptions from OPD & IPD doctors awaiting fulfillment</p>
        </div>

        <span className="badge badge-primary">{prescriptions.length} Active Prescriptions</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {prescriptions.map(rx => (
          <div key={rx.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{rx.patientName}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>Prescription ID: {rx.id} • {rx.date}</span>
                </div>
                <span className="badge badge-info">Prescribed by {rx.doctorName}</span>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>MEDICATIONS TO DISPENSE:</span>
                {rx.medications.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                    <strong>{m.name}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.dosage} ({m.duration})</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => dispensePrescription(rx.id)}>
              <Package size={16} /> Fulfill & Dispense Prescription
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
