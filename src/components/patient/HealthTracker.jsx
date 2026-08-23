import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartPulse, Plus, Activity, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const HealthTracker = () => {
  const { vitals, addVitalLog } = useApp();
  const [showLogModal, setShowLogModal] = useState(false);

  const [sys, setSys] = useState('120');
  const [dia, setDia] = useState('80');
  const [heartRate, setHeartRate] = useState('72');
  const [sugar, setSugar] = useState('98');
  const [weight, setWeight] = useState('68');
  const [height, setHeight] = useState('175');

  const handleSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const hM = parseFloat(height) / 100;
    const bmiVal = (w / (hM * hM)).toFixed(1);

    addVitalLog({
      bp: `${sys}/${dia}`,
      heartRate: parseInt(heartRate),
      sugar: parseInt(sugar),
      weight: w,
      bmi: parseFloat(bmiVal)
    });
    setShowLogModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Health Tracker & Vitals Monitoring</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Keep track of your blood pressure, heart rate, blood glucose & BMI trends</p>
        </div>

        <button className="btn-primary" onClick={() => setShowLogModal(true)}>
          <Plus size={18} /> Log New Vitals
        </button>
      </div>

      {/* Latest Vitals Highlighting Grid */}
      {vitals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Blood Pressure</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--green)', marginTop: '0.25rem' }}>{vitals[0].bp}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Normal (120/80 mmHg)</span>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Heart Rate</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--blue)', marginTop: '0.25rem' }}>{vitals[0].heartRate} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>bpm</span></h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resting Pulse Rate</span>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Blood Glucose</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--amber)', marginTop: '0.25rem' }}>{vitals[0].sugar} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mg/dL</span></h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fasting Sugar Level</span>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>BMI Index</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--purple)', marginTop: '0.25rem' }}>{vitals[0].bmi}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Weight: {vitals[0].weight} kg</span>
          </div>
        </div>
      )}

      {/* Vitals History Log Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Vitals Log History</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Log Date</th>
              <th>Blood Pressure (mmHg)</th>
              <th>Heart Rate (BPM)</th>
              <th>Fasting Sugar (mg/dL)</th>
              <th>Weight (kg)</th>
              <th>Calculated BMI</th>
            </tr>
          </thead>
          <tbody>
            {vitals.map(v => (
              <tr key={v.id}>
                <td><strong style={{ color: '#0f172a' }}>{v.date}</strong></td>
                <td><span className="badge badge-success">{v.bp}</span></td>
                <td><span className="badge badge-info">{v.heartRate} bpm</span></td>
                <td><span className="badge badge-warning">{v.sugar} mg/dL</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{v.weight} kg</td>
                <td><strong style={{ color: 'var(--purple)' }}>{v.bmi}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HeartPulse style={{ color: 'var(--primary)' }} /> Log Today's Vitals
              </h3>
              <button className="btn-icon" onClick={() => setShowLogModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Systolic BP (mmHg)</label>
                  <input type="number" className="input-field" value={sys} onChange={e => setSys(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Diastolic BP (mmHg)</label>
                  <input type="number" className="input-field" value={dia} onChange={e => setDia(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Heart Rate (BPM)</label>
                  <input type="number" className="input-field" value={heartRate} onChange={e => setHeartRate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Sugar (mg/dL)</label>
                  <input type="number" className="input-field" value={sugar} onChange={e => setSugar(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Body Weight (kg)</label>
                  <input type="number" step="0.1" className="input-field" value={weight} onChange={e => setWeight(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input type="number" className="input-field" value={height} onChange={e => setHeight(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
                Save Vitals Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
