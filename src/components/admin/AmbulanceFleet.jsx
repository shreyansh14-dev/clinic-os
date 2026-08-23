import React from 'react';
import { useApp } from '../../context/AppContext';
import { Siren, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const AmbulanceFleet = () => {
  const { ambulanceFleet, dispatchAmbulance } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Emergency Ambulance Fleet & GPS Tracking</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>108 Trauma emergency dispatch, ALS ICU equipment & live driver roster</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {ambulanceFleet.map(amb => (
          <div key={amb.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{amb.vehicleNo}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>{amb.type}</span>
                </div>
                <span className={`badge ${amb.status === 'Dispatched' ? 'badge-danger' : 'badge-success'}`}>
                  {amb.status}
                </span>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                <div>Driver: <strong style={{ color: '#fff' }}>{amb.driver}</strong></div>
                <div>Location: <strong style={{ color: 'var(--amber)' }}>{amb.location}</strong></div>
              </div>
            </div>

            {amb.status === 'Available' ? (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => dispatchAmbulance(amb.id, 'Emergency Trauma Request', 'Marine Drive, Mumbai')}>
                <Siren size={16} /> Dispatch Emergency Call
              </button>
            ) : (
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled>
                In Active Transit...
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
