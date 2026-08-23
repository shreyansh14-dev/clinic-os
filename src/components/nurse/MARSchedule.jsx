import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pill, CheckCircle2, Clock, User, ShieldCheck } from 'lucide-react';

export const MARSchedule = () => {
  const { beds } = useApp();

  const [marList, setMarList] = useState([
    { id: 'mar-1', bedNo: 'ICU-01', patientName: 'Vedant Mane', medName: 'Inj. Ceftriaxone 1g IV', scheduledTime: '08:00 AM', status: 'Administered', nurse: 'Nurse Anjali' },
    { id: 'mar-2', bedNo: 'ICU-01', patientName: 'Vedant Mane', medName: 'Inj. Pantoprazole 40mg IV', scheduledTime: '12:00 PM', status: 'Pending', nurse: 'Nurse Anjali' },
    { id: 'mar-3', bedNo: 'PVT-101', patientName: 'Shreyansh Kumar', medName: 'Tab Telmisartan 40mg PO', scheduledTime: '09:00 AM', status: 'Administered', nurse: 'Nurse Sunita' },
    { id: 'mar-4', bedNo: 'GEN-301', patientName: 'Vedant Patekar', medName: 'Sachet Calcirol 60k Oral', scheduledTime: '02:00 PM', status: 'Pending', nurse: 'Nurse Priya' }
  ]);

  const toggleMARStatus = (id) => {
    setMarList(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Administered' ? 'Pending' : 'Administered' } : m));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Medication Administration Record (MAR)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Timestamped nurse dose verification for bedded inpatients</p>
        </div>

        <span className="badge badge-primary">Shift 1 Nursing Desk</span>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Bed #</th>
              <th>Patient Name</th>
              <th>Medication & Route</th>
              <th>Scheduled Time</th>
              <th>Assigned Nurse</th>
              <th>Administration Status</th>
            </tr>
          </thead>
          <tbody>
            {marList.map(item => (
              <tr key={item.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{item.bedNo}</strong></td>
                <td style={{ color: '#fff', fontWeight: '600' }}>{item.patientName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{item.medName}</td>
                <td><Clock size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />{item.scheduledTime}</td>
                <td>{item.nurse}</td>
                <td>
                  <button
                    className={`badge ${item.status === 'Administered' ? 'badge-success' : 'badge-warning'}`}
                    style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.75rem' }}
                    onClick={() => toggleMARStatus(item.id)}
                  >
                    {item.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
