import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bed, User, Activity, Clock, ShieldCheck } from 'lucide-react';

export const InpatientRoom = () => {
  const { activePatient, beds } = useApp();

  const myBed = beds.find(b => b.patientId === activePatient.id) || beds[2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Inpatient Ward & Bed Allocation (IPD)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time admission status, attending nursing staff & ward vitals</p>
        </div>

        <span className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          Bed {myBed.number} Assigned
        </span>
      </div>

      {/* Main Room Card */}
      <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'var(--primary-light)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Bed size={32} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>HOSPITAL WARD</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{myBed.ward}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Bed Number: {myBed.number}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-dark)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>ATTENDING NURSE</span>
            <strong style={{ color: '#fff' }}>{myBed.attendingNurse}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>SPO2 OXYGEN LEVEL</span>
            <strong style={{ color: 'var(--green)' }}>{myBed.oxygenLevel || '98% Normal'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>DAILY ROOM TARIFF</span>
            <strong style={{ color: 'var(--primary)' }}>₹{myBed.dailyRate}/day</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
