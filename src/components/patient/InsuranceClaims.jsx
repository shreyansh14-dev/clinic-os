import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const InsuranceClaims = () => {
  const { activePatient, insuranceClaims, submitInsuranceClaim } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [provider, setProvider] = useState('Star Health Optima');
  const [policyNo, setPolicyNo] = useState('SH-992211');
  const [claimAmount, setClaimAmount] = useState('5000');

  const myClaims = insuranceClaims.filter(c => c.patientId === activePatient.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitInsuranceClaim({
      provider,
      policyNo,
      claimAmount: parseFloat(claimAmount),
      preApprovedAmount: 0
    });
    setShowSubmitModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>TPA Insurance & Cashless Claims</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your health insurance policies, cashless pre-authorizations & TPA settlements</p>
        </div>

        <button className="btn-primary" onClick={() => setShowSubmitModal(true)}>
          <Plus size={18} /> Submit New TPA Claim
        </button>
      </div>

      {/* Linked Policy Info Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(15, 19, 29, 0.95))', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3.2rem', height: '3.2rem', borderRadius: '1rem', background: 'var(--blue-light)', border: '1px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>LINKED POLICY</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{activePatient.insurancePolicy}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sum Insured: <strong>₹5,00,000</strong> • TPA Desk: Cashless Available</p>
          </div>
        </div>

        <span className="badge badge-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          Policy Active
        </span>
      </div>

      {/* Claims List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Claim Submission Log</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Claim Ref</th>
              <th>Insurance Provider</th>
              <th>Policy Number</th>
              <th>Claim Amount</th>
              <th>Pre-Approved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myClaims.map(claim => (
              <tr key={claim.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{claim.id}</strong></td>
                <td style={{ fontWeight: '600', color: '#0f172a' }}>{claim.provider}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{claim.policyNo}</td>
                <td><strong style={{ color: '#0f172a' }}>₹{claim.claimAmount.toLocaleString()}</strong></td>
                <td><strong style={{ color: 'var(--green)' }}>₹{claim.preApprovedAmount.toLocaleString()}</strong></td>
                <td>
                  <span className={`badge ${
                    claim.status === 'Settled' ? 'badge-success' :
                    claim.status === 'Pre-Approved' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {claim.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck style={{ color: 'var(--primary)' }} /> Submit TPA Insurance Claim
              </h3>
              <button className="btn-icon" onClick={() => setShowSubmitModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Insurance Provider</label>
                <input type="text" className="input-field" value={provider} onChange={e => setProvider(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Policy Number</label>
                <input type="text" className="input-field" value={policyNo} onChange={e => setPolicyNo(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Claim Amount (₹)</label>
                <input type="number" className="input-field" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} required />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                <CheckCircle2 size={18} /> Submit Pre-Authorization Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
