import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Heart, Brain, Sparkles, Activity, Baby, Stethoscope } from 'lucide-react';

export const ManageDepartments = () => {
  const { departments, doctors } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Hospital Departments & Fee Schedules</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure medical departments, standard consultation charges & OPD allocation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {departments.map(dept => {
          const deptDocs = doctors.filter(d => d.deptId === dept.id);

          return (
            <div key={dept.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>{dept.name}</h3>
                  <span className="badge badge-primary">ID: {dept.id}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{dept.description}</p>

                <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Base Fee: <strong style={{ color: 'var(--green)' }}>₹{dept.fee}</strong></span>
                  <span>Staff: <strong style={{ color: 'var(--blue)' }}>{deptDocs.length} Doctors</strong></span>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Assigned Specialists</span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {deptDocs.map(d => (
                    <span key={d.id} className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
