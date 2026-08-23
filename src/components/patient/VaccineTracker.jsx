import React from 'react';
import { useApp } from '../../context/AppContext';
import { Syringe, CheckCircle2, Clock, ShieldCheck, QrCode } from 'lucide-react';

export const VaccineTracker = () => {
  const { vaccines } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Immunization & Vaccine Passport</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified vaccination history, digital passports & booster schedule reminders</p>
        </div>

        <span className="badge badge-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} /> Fully Immunized
        </span>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Vaccination Log & QR Certificates</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Vaccine Description</th>
              <th>Administered Date</th>
              <th>Healthcare Provider</th>
              <th>Batch Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map(v => (
              <tr key={v.id}>
                <td><strong style={{ color: '#0f172a' }}>{v.name}</strong></td>
                <td>{v.date}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{v.provider}</td>
                <td><span className="badge badge-purple">{v.batch}</span></td>
                <td>
                  <span className={`badge ${v.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
