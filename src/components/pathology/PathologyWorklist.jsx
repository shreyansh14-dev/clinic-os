import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestTube2, CheckCircle2, FileText, Clock } from 'lucide-react';

export const PathologyWorklist = () => {
  const { labTests, publishLabReport } = useApp();
  const [selectedTestId, setSelectedTestId] = useState(null);

  const pendingTests = labTests.filter(t => t.status !== 'Completed');

  const handlePublish = (testId) => {
    publishLabReport(testId, {
      hemoglobin: '13.8 g/dL (Normal)',
      wbcCount: '7,100 /uL (Normal)',
      platelets: '260,000 /uL (Normal)',
      summary: 'Specimen examined. All values within normal physiological reference ranges.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Laboratory Information System (LIS Desk)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pathology & Radiology specimen worklist, parameter entry & diagnostic verification</p>
        </div>

        <span className="badge badge-warning">{pendingTests.length} Samples Pending Verification</span>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Patient Name</th>
              <th>Test Requested</th>
              <th>Category</th>
              <th>Order Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>LIS Actions</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map(test => (
              <tr key={test.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{test.id}</strong></td>
                <td style={{ color: '#fff', fontWeight: '600' }}>{test.patientName}</td>
                <td style={{ color: '#fff' }}>{test.name}</td>
                <td><span className="badge badge-purple">{test.category}</span></td>
                <td>{test.orderDate}</td>
                <td>
                  <span className={`badge ${test.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                    {test.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {test.status !== 'Completed' ? (
                    <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => handlePublish(test.id)}>
                      <CheckCircle2 size={14} /> Verify & Publish
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: '700' }}>Published & Released</span>
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
