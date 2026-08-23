import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Stethoscope, Clock, Receipt, ShieldCheck, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminDashboard = () => {
  const { patients, doctors, appointments, bills, labTests } = useApp();
  const navigate = useNavigate();
  const setActiveTab = (tab) => {
    const map = { 'system-invoices': '/system-invoices', 'manage-doctors': '/manage-doctors', 'manage-departments': '/manage-departments' };
    navigate(map[tab] || '/admin');
  };

  const totalPatients = patients.length || 15;
  const totalDoctors = doctors.length || 5;
  const pendingVisits = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length;
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Authority Control Panel Banner (Matching Presentation Slide 5 & 12) */}
      <div className="glass-card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #161c28 0%, #0d111a 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '1.25rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge badge-orange" style={{ marginBottom: '0.5rem', padding: '0.25rem 0.75rem' }}>
            Hospital Authority Control Panel
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', margin: '0.2rem 0' }}>
            Authority Dashboard
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Review care requests and manage daily hospital operations across all departments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-orange" onClick={() => setActiveTab('system-invoices')}>
            <Receipt size={18} /> Issue or Manage Bills
          </button>
          <button className="btn-secondary" style={{ background: '#ffffff', color: '#000000', border: 'none', fontWeight: '700' }} onClick={() => setActiveTab('manage-doctors')}>
            <Stethoscope size={18} /> Manage Doctors
          </button>
        </div>
      </div>

      {/* Metrics Row (Matching Slide 5 & 12: Patients 15, Doctors 27/5, Pending visits 3, Hospital Revenue ₹3,150) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Patients</span>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#38bdf8', margin: '0.2rem 0' }}>{totalPatients}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Registered Accounts</span>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Doctors</span>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#a78bfa', margin: '0.2rem 0' }}>{totalDoctors}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consultants On Roster</span>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Pending Visits</span>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ff5500', margin: '0.2rem 0' }}>{pendingVisits}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Queued for Clearance</span>
        </div>

        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Hospital Revenue</span>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#34d399', margin: '0.2rem 0' }}>₹{totalRevenue.toLocaleString()}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Collected Digital Clearance</span>
        </div>

      </div>

      {/* Action Approval Queue & Doctor Roster (Matching Slide 12 - 05 DOCTOR/ADMIN INTERFACE) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Approval Queue */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>Approval Queue</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {pendingVisits} appointment requests and {labTests.filter(t=>t.status==='Pending').length} diagnostic requests await action.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-orange" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('manage-doctors')}>
              Review Appointments
            </button>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('manage-departments')}>
              Review Diagnostic Tests
            </button>
          </div>
        </div>

        {/* Billing Overview */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>Billing & Ledger</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {bills.filter(b=>b.status==='Unpaid').length} bills awaiting patient clearance. Total collected: ₹{totalRevenue.toLocaleString()}
          </p>
          <button className="btn-orange" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('system-invoices')}>
            Issue or Manage Bills
          </button>
        </div>

      </div>

      {/* Manage Doctors Cards Grid (Matching Slide 12 Screenshot - Doctors Grid with Edit & Delete) */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Registered Doctors & Consultants Roster</h3>
          <button className="btn-orange" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('manage-doctors')}>
            <Plus size={15} /> Add Doctor
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {doctors.slice(0, 6).map((doc) => (
            <div key={doc.id} style={{ background: '#0d111a', padding: '1.25rem', borderRadius: '0.85rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img src={doc.avatar} alt={doc.name} style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff5500' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>{doc.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#ff5500', fontWeight: '700', margin: 0 }}>{doc.specialty}</p>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Consultation Fee: <strong style={{ color: '#ffffff' }}>₹{doc.consultationFee || doc.fee || 2000}</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button className="btn-orange" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', justifyContent: 'center', color: '#ef4444', borderColor: '#ef4444' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
