import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Siren, Phone, MapPin, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

export const EmergencySOS = () => {
  const { activePatient, ambulanceFleet, dispatchAmbulance } = useApp();
  const [isDispatched, setIsDispatched] = useState(false);

  const activeAmbulance = ambulanceFleet.find(a => a.status === 'Dispatched') || ambulanceFleet[0];

  const handleTriggerAmbulance = () => {
    dispatchAmbulance(activeAmbulance.id, activePatient.name, activePatient.address);
    setIsDispatched(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 19, 29, 0.95))', border: '1px solid var(--red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Siren size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>108 Emergency Ambulance Response</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>24/7 Mobile ALS ICU Trauma Dispatch with live GPS location tracking</p>
          </div>
        </div>
      </div>

      {/* Main Action Box */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        {!isDispatched ? (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Require Immediate Medical Assistance?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Current Location: <strong>{activePatient.address}</strong> (GPS Confirmed)
            </p>

            <button
              onClick={handleTriggerAmbulance}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: '#fff',
                border: 'none',
                padding: '1.25rem 2.5rem',
                borderRadius: '1rem',
                fontWeight: '800',
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Siren size={28} /> DISPATCH EMERGENCY AMBULANCE NOW
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--green-light)', padding: '0.5rem 1rem', borderRadius: '2rem', color: 'var(--green)', fontWeight: '700', marginBottom: '1rem' }}>
              <CheckCircle2 size={20} /> Ambulance Dispatched & En-Route
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '0.85rem', border: '1px solid var(--border-highlight)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Vehicle:</span>
                <strong style={{ color: 'var(--primary)' }}>{activeAmbulance.vehicleNo} ({activeAmbulance.type})</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Driver & Paramedic:</span>
                <strong style={{ color: '#fff' }}>{activeAmbulance.driver}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Current Status / Location:</span>
                <strong style={{ color: 'var(--amber)' }}>{activeAmbulance.location}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
