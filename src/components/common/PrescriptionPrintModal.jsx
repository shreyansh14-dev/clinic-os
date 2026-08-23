import React from 'react';
import { Printer, X, ShieldCheck, Heart, Stethoscope, Download } from 'lucide-react';

export const PrescriptionPrintModal = ({ rx, onClose }) => {
  if (!rx) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-area" style={{ maxWidth: '720px', padding: '0', background: '#0d111a', color: '#f8fafc', border: '1px solid var(--primary)' }}>
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print" style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope style={{ color: 'var(--primary)' }} /> Official Digital Prescription ({rx.id})
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Print Prescription
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{ padding: '2.5rem 2rem', background: '#0a0d14', borderRadius: '0 0 1.25rem 1.25rem' }}>
          {/* Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '2rem', height: '2rem', background: 'var(--primary)', borderRadius: '0.4rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>C</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>CLINIC OS</h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Smart Healthcare Management System</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>License: HOS-MH-2026-8891 | OPD Building, Suite 402</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{rx.doctorName}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Senior Consultant Specialist</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reg No: MMC-774910</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Date: <strong>{rx.date}</strong></p>
            </div>
          </div>

          {/* Patient Particulars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PATIENT NAME</span>
              <strong style={{ color: '#fff' }}>{rx.patientName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PATIENT ID</span>
              <strong style={{ color: '#fff' }}>{rx.patientId}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PRESCRIPTION ID</span>
              <strong style={{ color: 'var(--primary)' }}>{rx.id}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>VERIFICATION</span>
              <strong style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={14} /> Cryptographic
              </strong>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Clinical Diagnosis & Findings</h4>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 85, 0, 0.05)', borderLeft: '4px solid var(--primary)', borderRadius: '0.4rem', fontSize: '0.9rem', color: '#f8fafc' }}>
              {rx.diagnosis}
            </div>
          </div>

          {/* Rx Medication List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)', fontFamily: 'serif' }}>Rx</span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Prescribed Medications</h4>
            </div>

            <table className="custom-table" style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Medication Name</th>
                  <th>Dosage / Schedule</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rx.medications.map((m, idx) => (
                  <tr key={idx}>
                    <td><strong style={{ color: 'var(--primary)' }}>{m.name}</strong></td>
                    <td>{m.dosage}</td>
                    <td><span className="badge badge-purple">{m.duration}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{m.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Diagnostic Tests Advised */}
          {rx.testsAdvised && rx.testsAdvised.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Advised Diagnostic Tests</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {rx.testsAdvised.map((t, idx) => (
                  <span key={idx} className="badge badge-info" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    🔬 {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Doctor's Advice & Lifestyle Guidelines */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Doctor's Advice & Instructions</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              {rx.advice}
            </p>
          </div>

          {/* Digital Signature Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generated electronically by Clinic OS Healthcare Infrastructure</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Valid without physical signature under IT Act 2000 Section 4</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'cursive', fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>{rx.doctorName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.25rem' }}>Authorized Digital Stamp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
