import React from 'react';
import { X, TestTube2, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LabReportModal = ({ test, onClose }) => {
  if (!test) return null;

  const handlePrint = () => window.print();

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-area" style={{ maxWidth: '680px', padding: '0', background: '#0d111a', color: '#f8fafc', border: '1px solid var(--border-highlight)' }}>
        <div className="no-print" style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TestTube2 style={{ color: 'var(--primary)' }} /> Diagnostic Test Report ({test.code})
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Print Report
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem', background: '#0a0d14' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>CLINIC OS DIAGNOSTICS</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Central Automated Clinical Pathology Laboratory</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${test.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.35rem 0.85rem' }}>
                {test.status.toUpperCase()}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Date: {test.orderDate}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>PATIENT NAME</span>
              <strong style={{ color: '#fff' }}>{test.patientName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>TEST NAME</span>
              <strong style={{ color: 'var(--primary)' }}>{test.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>REFERRING DOCTOR</span>
              <strong style={{ color: '#fff' }}>{test.orderedBy}</strong>
            </div>
          </div>

          {/* Results Table */}
          {test.reportData ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Observed Values & Reference Ranges</h4>
              <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(test.reportData).map(([key, val]) => (
                  key !== 'summary' && (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--bg-dark)', borderRadius: '0.5rem', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span style={{ fontWeight: '700', color: '#fff' }}>{val}</span>
                    </div>
                  )
                ))}
              </div>

              {test.reportData.summary && (
                <div style={{ marginTop: '1.25rem', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid var(--green)', padding: '1rem', borderRadius: '0.5rem', color: '#fff', fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--green)', display: 'block', marginBottom: '0.2rem' }}>Pathologist Impression:</strong>
                  {test.reportData.summary}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-card)', borderRadius: '0.75rem', color: 'var(--amber)' }}>
              <TestTube2 size={36} style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Lab Report Processing in Progress</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Specimen collected. Results will update automatically upon pathologist sign-off.</p>
            </div>
          )}

          {/* Verification stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={15} style={{ color: 'var(--green)' }} /> ISO 15189 Accredited Lab</span>
            <span>Pathologist Sign-off: Dr. R. K. Mukherjee (MD Path)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
