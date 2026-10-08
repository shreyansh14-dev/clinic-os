import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, CheckCircle2, Clock, AlertCircle, CreditCard, QrCode, Receipt, Sparkles } from 'lucide-react';
import { UnifiedPaymentModal } from '../common/UnifiedPaymentModal';
import confetti from 'canvas-confetti';

export const InsuranceClaims = () => {
  const { activePatient, insuranceClaims, submitInsuranceClaim, showToast } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [provider, setProvider] = useState('Star Health Optima');
  const [policyNo, setPolicyNo] = useState('SH-992211');
  const [claimAmount, setClaimAmount] = useState('5000');

  // Unified QR Payment Modal State
  const [payModalConfig, setPayModalConfig] = useState(null);
  const [paidReceipt, setPaidReceipt] = useState(null);

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
    showToast('TPA Claim Submitted! Pre-authorization processing initiated.');
  };

  const handleOpenPremiumPayment = () => {
    setPayModalConfig({
      amount: 1299,
      title: 'Health Insurance Premium Renewal',
      subtitle: `${activePatient.insurancePolicy} • 100% Cashless Network`,
      particulars: `Premium Renewal: ${activePatient.insurancePolicy}`,
      breakdown: [
        { label: 'Policy Holder', value: activePatient.name },
        { label: 'Policy Number', value: activePatient.insurancePolicy },
        { label: 'Annual Premium', value: '₹1,299' },
        { label: 'GST on Health Insurance (18%)', value: 'Included' }
      ],
      type: 'premium'
    });
  };

  const handleOpenCoPay = (claim) => {
    const copayAmount = Math.round(claim.claimAmount * 0.1) || 500;
    setPayModalConfig({
      amount: copayAmount,
      title: `Co-Pay Settlement for Claim #${claim.id}`,
      subtitle: `${claim.provider} (${claim.policyNo})`,
      particulars: `Co-Pay Settlement: Claim #${claim.id}`,
      breakdown: [
        { label: 'Claim Reference', value: claim.id },
        { label: 'Total Claim Amount', value: `₹${claim.claimAmount.toLocaleString()}` },
        { label: 'TPA Approved Amount', value: `₹${(claim.preApprovedAmount || claim.claimAmount).toLocaleString()}` },
        { label: 'Co-Payment Due (10%)', value: `₹${copayAmount}` }
      ],
      type: 'copay',
      claimId: claim.id
    });
  };

  const handlePaymentDone = (paymentDetails) => {
    const txn = paymentDetails?.transactionId || `TXN-INS-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setPaidReceipt({
      txn,
      type: payModalConfig?.type,
      title: payModalConfig?.title,
      amount: payModalConfig?.amount,
      paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setPayModalConfig(null);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    showToast(`Payment of ₹${payModalConfig?.amount} Verified! Transaction #${txn} recorded.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>TPA Insurance & Cashless Claims</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Manage health insurance policies, QR code premium payments & cashless TPA settlements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenPremiumPayment}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.85rem', padding: '0.6rem 1rem' }}
          >
            <CreditCard size={16} /> Pay Policy Premium (₹1,299)
          </button>

          <button className="btn-primary" onClick={() => setShowSubmitModal(true)}>
            <Plus size={18} /> Submit New TPA Claim
          </button>
        </div>
      </div>

      {/* Linked Policy Info Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(15, 19, 29, 0.95))', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3.2rem', height: '3.2rem', borderRadius: '1rem', background: 'var(--blue-light)', border: '1px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>LINKED ACTIVE POLICY</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0' }}>{activePatient.insurancePolicy}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Sum Insured: <strong>₹5,00,000</strong> • TPA Desk: Cashless Active</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleOpenPremiumPayment}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '0.75rem',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <QrCode size={14} color="#E9DF70" /> Pay Premium / Renewal
          </button>

          <span className="badge badge-success" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            Policy Active
          </span>
        </div>
      </div>

      {/* Claims List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Claim Submission Log</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Click Settle Co-Pay to pay via UPI QR</span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Claim Ref</th>
              <th>Insurance Provider</th>
              <th>Policy Number</th>
              <th>Claim Amount</th>
              <th>Pre-Approved</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
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
                <td style={{ textAlign: 'right' }}>
                  {claim.status === 'Settled' ? (
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={14} /> Settled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenCoPay(claim)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: '#16163B',
                        color: '#fff',
                        borderRadius: '0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <QrCode size={13} color="#E9DF70" /> Settle Co-Pay
                    </button>
                  )}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
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

      {/* Dynamic UPI QR Payment Gateway for Insurance */}
      {payModalConfig && (
        <UnifiedPaymentModal
          isOpen={!!payModalConfig}
          onClose={() => setPayModalConfig(null)}
          onDone={handlePaymentDone}
          amount={payModalConfig.amount}
          title={payModalConfig.title}
          subtitle={payModalConfig.subtitle}
          particulars={payModalConfig.particulars}
          breakdown={payModalConfig.breakdown}
        />
      )}

      {/* Verified Payment Receipt Modal */}
      {paidReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid #a7f3d0' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Payment Verified!
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
              Your insurance payment has been reconciled with the TPA desk.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1rem', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment For:</span>
                <strong style={{ color: '#0f172a' }}>{paidReceipt.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>{paidReceipt.txn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <strong style={{ color: '#059669', fontWeight: '800' }}>₹{paidReceipt.amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Time:</span>
                <span style={{ color: '#0f172a' }}>{paidReceipt.paidAt}</span>
              </div>
            </div>

            <button
              onClick={() => setPaidReceipt(null)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              Done &amp; Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default InsuranceClaims;
