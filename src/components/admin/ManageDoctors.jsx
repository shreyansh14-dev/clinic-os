import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stethoscope, Plus, Star, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

export const ManageDoctors = () => {
  const { doctors, departments, addDoctor } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('Dr. Shreyansh Kumar');
  const [deptId, setDeptId] = useState(departments[0].id);
  const [experience, setExperience] = useState('8+ Years');
  const [fee, setFee] = useState('2000');
  const [availability, setAvailability] = useState('Mon - Fri (10:00 AM - 05:00 PM)');
  const [email, setEmail] = useState('shreyansh.k@clinicos.com');
  const [phone, setPhone] = useState('+91 99887 76655');

  const handleSubmit = (e) => {
    e.preventDefault();
    const deptObj = departments.find(d => d.id === deptId) || departments[0];

    addDoctor({
      name,
      specialty: deptObj.name,
      deptId,
      experience,
      fee: parseFloat(fee),
      availability,
      email,
      phone
    });
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Doctor & Staff Roster</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage consultant profiles, consultation fees, and OPD schedules</p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Register New Doctor
        </button>
      </div>

      {/* Roster Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {doctors.map(doc => (
          <div key={doc.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img src={doc.avatar} alt={doc.name} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{doc.name}</h3>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{doc.specialty}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>Experience: <strong style={{ color: '#fff' }}>{doc.experience}</strong></div>
                <div>Consultation Fee: <strong style={{ color: 'var(--green)' }}>₹{doc.fee}</strong></div>
                <div>Schedule: <strong style={{ color: 'var(--amber)' }}>{doc.availability}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--amber)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Star size={14} /> {doc.rating} Rating
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{doc.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope style={{ color: 'var(--primary)' }} /> Add Specialist Doctor
              </h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Doctor Name</label>
                <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="select-field" value={deptId} onChange={e => setDeptId(e.target.value)}>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input type="number" className="input-field" value={fee} onChange={e => setFee(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input type="text" className="input-field" value={experience} onChange={e => setExperience(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">OPD Timing / Availability</label>
                  <input type="text" className="input-field" value={availability} onChange={e => setAvailability(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                <CheckCircle2 size={18} /> Save Doctor Roster Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
