import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, CheckCircle2, CreditCard, ShieldCheck, DollarSign, Wallet } from 'lucide-react';

export const InvoicePrintModal = ({ bill, onClose }) => {
  const { payBill } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bill) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payBill(bill.id, selectedMethod);
      setIsProcessing(false);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content printable-area" style={{ maxWidth: '680px', padding: '0', background: '#0d111a', color: '#f8fafc', border: '1px solid var(--border-highlight)' }}>
        {/* Top Control Bar */}
        <div className="no-print" style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Receipt & Invoice ({bill.id})
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handlePrint}>
              <Printer size={16} /> Print Receipt
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: '2rem', background: '#0a0d14' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>CLINIC OS BILLING</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN: 27AAAAA0000A1Z5 | ClinicOS Healthcare Pvt Ltd</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${bill.status === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                {bill.status.toUpperCase()}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Issue Date: {bill.issueDate}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Date: {bill.dueDate}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BILLED TO</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700' }}>{bill.patientName}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ID: {bill.patientId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INVOICE REF</span>
              <h4 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: '700' }}>{bill.id}</h4>
              {bill.transactionId && (
                <p style={{ fontSize: '0.78rem', color: 'var(--green)' }}>Txn: {bill.transactionId}</p>
              )}
            </div>
          </div>

          {/* Line Item Breakdown */}
          <table className="custom-table" style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Tax (5%)</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600', color: '#fff' }}>{bill.description}</td>
                <td style={{ textAlign: 'right' }}>₹{bill.tax}</td>
                <td style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: '700' }}>₹{bill.amount}</td>
              </tr>
            </tbody>
          </table>

          {/* Total Calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '0.75rem', width: '260px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>Base Amount:</span>
                <span>₹{bill.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-color)' }}>
                <span>GST Tax (5%):</span>
                <span>₹{bill.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                <span>Total Payable:</span>
                <span style={{ color: 'var(--primary)' }}>₹{bill.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Interactive Payment Section if Unpaid */}
          {bill.status === 'Unpaid' ? (
            <div className="no-print" style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-highlight)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>Select Payment Method</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {['Credit Card', 'UPI / QR', 'Net Banking'].map(method => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.6rem',
                      border: selectedMethod === method ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: selectedMethod === method ? 'var(--primary-light)' : 'var(--bg-dark)',
                      color: selectedMethod === method ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button
                className="btn-primary"
                onClick={handlePayNow}
                disabled={isProcessing}
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              >
                {isProcessing ? 'Processing Secure Payment...' : `Pay ₹${bill.totalAmount} via ${selectedMethod}`}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--green-light)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem', borderRadius: '0.75rem', color: 'var(--green)' }}>
              <CheckCircle2 size={20} />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Payment Completed Successfully</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Paid via {bill.paymentMethod} • Reference ID: {bill.transactionId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
