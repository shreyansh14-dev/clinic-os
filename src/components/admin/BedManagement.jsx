import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bed, Plus, Activity, User, CheckCircle2 } from 'lucide-react';

export const BedManagement = () => {
  const { beds, updateBedStatus } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>IPD Ward & Bed Tariff Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hospital ward tariffs, live bed allocation matrix & turnover management</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Bed #</th>
              <th>Ward Category</th>
              <th>Current Occupant</th>
              <th>Attending Nursing Staff</th>
              <th>Daily Tariff</th>
              <th>Occupancy Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beds.map(bed => (
              <tr key={bed.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{bed.number}</strong></td>
                <td style={{ color: '#fff', fontWeight: '600' }}>{bed.ward}</td>
                <td>{bed.patientName || 'None'}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{bed.attendingNurse}</td>
                <td><strong style={{ color: 'var(--green)' }}>₹{bed.dailyRate}/day</strong></td>
                <td>
                  <span className={`badge ${bed.status === 'Occupied' ? 'badge-danger' : bed.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                    {bed.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {bed.status === 'Occupied' ? (
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => updateBedStatus(bed.id, 'Cleaning')}>
                      Clear Bed
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => updateBedStatus(bed.id, 'Occupied', 'pat-102', 'Vedant Mane')}>
                      Occupy Bed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
