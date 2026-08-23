import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvoicePrintModal } from '../common/InvoicePrintModal';
import { Receipt, Search, Printer, DollarSign, CheckCircle2 } from 'lucide-react';

export const SystemInvoices = () => {
  const { bills } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = bills.filter(b =>
    b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>System Financial Invoices</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete billing transactions ledger & GST compliance receipts</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search patient name, invoice ID..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice Ref</th>
              <th>Patient Particulars</th>
              <th>Service Rendered</th>
              <th>Issue Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map(bill => (
              <tr key={bill.id}>
                <td><strong style={{ color: 'var(--primary)' }}>{bill.id}</strong></td>
                <td>
                  <strong style={{ color: '#fff', display: 'block' }}>{bill.patientName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {bill.patientId}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{bill.description}</td>
                <td>{bill.issueDate}</td>
                <td><strong style={{ color: 'var(--green)', fontSize: '1rem' }}>₹{bill.totalAmount}</strong></td>
                <td>
                  <span className={`badge ${bill.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {bill.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setSelectedInvoice(bill)}>
                    <Printer size={14} /> Printable Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <InvoicePrintModal bill={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};
