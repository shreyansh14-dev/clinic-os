import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabReportModal } from '../common/LabReportModal';
import { TestTube2, Plus, FileText, CheckCircle2, Clock, Search, Sparkles } from 'lucide-react';

export const DiagnosticTests = () => {
  const { activePatient, labTests, bookLabTest } = useApp();
  const [selectedReportTest, setSelectedReportTest] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const myLabTests = labTests.filter(t => t.patientId === activePatient.id);

  const availableCatalog = [
    { code: 'TEST-CBC', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 850, turnaround: '4 Hours' },
    { code: 'TEST-LIPID', name: 'Lipid Profile Panel', category: 'Biochemistry', price: 1200, turnaround: '6 Hours' },
    { code: 'TEST-THYROID', name: 'Thyroid Function Test (T3/T4/TSH)', category: 'Endocrinology', price: 1450, turnaround: '12 Hours' },
    { code: 'TEST-HBA1C', name: 'Glycated Hemoglobin (HbA1c)', category: 'Diabetology', price: 950, turnaround: '4 Hours' },
    { code: 'TEST-MRI', name: 'Brain MRI (Plain)', category: 'Radiology', price: 6500, turnaround: '24 Hours' },
    { code: 'TEST-XRAY', name: 'Digital Chest X-Ray PA', category: 'Radiology', price: 950, turnaround: '2 Hours' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Diagnostic Tests & Lab Reports</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automated laboratory order management & pathology result tracking</p>
        </div>

        <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
          <Plus size={18} /> Book New Lab Test
        </button>
      </div>

      {/* Ordered Tests List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {myLabTests.map(test => (
          <div key={test.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{test.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>{test.category} • Ref: {test.code}</span>
                </div>
                <span className={`badge ${test.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                  {test.status}
                </span>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>ORDER DATE</span>
                  <strong>{test.orderDate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>ORDERED BY</span>
                  <strong>{test.orderedBy}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>TEST FEE</span>
                  <strong style={{ color: 'var(--green)' }}>₹{test.price}</strong>
                </div>
              </div>
            </div>

            <div>
              {test.status === 'Completed' ? (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedReportTest(test)}>
                  <FileText size={16} /> View & Download Full Report
                </button>
              ) : (
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled>
                  <Clock size={16} /> Processing Specimen...
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book New Lab Test Modal */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TestTube2 style={{ color: 'var(--primary)' }} /> Select Diagnostic Test
              </h3>
              <button className="btn-icon" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {availableCatalog.map(item => (
                <div key={item.code} style={{ padding: '1rem', background: 'var(--bg-dark)', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: '700' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category} • Turnaround: {item.turnaround}</span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--green)' }}>₹{item.price}</span>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        bookLabTest(item.code, item.name, item.category, item.price);
                        setShowOrderModal(false);
                      }}
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lab Report Modal */}
      {selectedReportTest && (
        <LabReportModal test={selectedReportTest} onClose={() => setSelectedReportTest(null)} />
      )}
    </div>
  );
};
