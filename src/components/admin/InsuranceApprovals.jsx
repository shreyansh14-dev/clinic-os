import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export const InsuranceApprovals = () => {
  const { insuranceClaims, approveInsuranceClaim } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>TPA Insurance Claim Approval Desk</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review pre-authorizations, policy documents & cashless claim settlements</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Claim Ref</th>
              <th>Patient Name</th>
              <th>Insurance Provider</th>
              <th>Policy Number</th>
              <th>Claimed Amount</th>
              <th>Approved Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {insuranceClaims.map(claim => (
              <tr key={claim.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{claim.id}</strong></td>
                <td style={{ color: '#fff', fontWeight: '600' }}>{claim.patientName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{claim.provider}</td>
                <td>{claim.policyNo}</td>
                <td><strong style={{ color: '#fff' }}>₹{claim.claimAmount.toLocaleString()}</strong></td>
                <td><strong style={{ color: 'var(--green)' }}>₹{claim.preApprovedAmount.toLocaleString()}</strong></td>
                <td>
                  <span className={`badge ${
                    claim.status === 'Settled' ? 'badge-success' :
                    claim.status === 'Pre-Approved' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {claim.status === 'Under Review' ? (
                    <button className="btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => approveInsuranceClaim(claim.id, claim.claimAmount)}>
                      Pre-Approve Claim
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: '700' }}>Approved</span>
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
