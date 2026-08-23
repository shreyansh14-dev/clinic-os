import React from 'react';
import { useApp } from '../../context/AppContext';
import { Droplet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BloodBankManager = () => {
  const { bloodBank } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Blood Bank Inventory & Donor Registry</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hospital blood unit stock levels, emergency donor search & reservation</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {bloodBank.map(item => (
          <div key={item.group} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Droplet size={20} style={{ color: 'var(--red)' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{item.group}</h3>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: item.status === 'Critical' ? 'var(--red)' : 'var(--green)', margin: '0.2rem 0' }}>
              {item.units} Units
            </div>
            <span className={`badge ${item.status === 'Critical' ? 'badge-danger' : item.status === 'Low' ? 'badge-warning' : 'badge-success'}`}>
              {item.status} Stock
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
