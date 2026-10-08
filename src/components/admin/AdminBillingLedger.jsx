import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  IndianRupee,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  FileCheck2,
  Download,
  AlertCircle
} from 'lucide-react';

export const AdminBillingLedger = () => {
  const { bills, patients, createBill, payBill, showToast, addAuditLog } = useApp();

  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Paid' | 'Unpaid'

  // Create Bill Modal
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [billPatientId, setBillPatientId] = useState(patients[0]?.id || 'usr-pat-1');
  const [billDesc, setBillDesc] = useState('Executive Cardiac Checkup & Comprehensive Diagnostics');
  const [billAmount, setBillAmount] = useState('3500');
  const [billDept, setBillDept] = useState('Cardiology');

  // Settle Payment Modal
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');

  // Print Invoice Preview Modal
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      !invoiceSearch ||
      b.patientName?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.id?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      b.description?.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalClearedRevenue = bills
    .filter((b) => b.status === 'Paid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const totalOutstanding = bills
    .filter((b) => b.status === 'Unpaid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const handleCreateBillSubmit = (e) => {
    e.preventDefault();
    const targetPat = patients.find((p) => p.id === billPatientId) || patients[0];
    createBill({
      patientId: targetPat.id,
      patientName: targetPat.name,
      description: billDesc,
      department: billDept,
      totalAmount: parseFloat(billAmount)
    });
    setShowCreateBillModal(false);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!selectedBillForPayment) return;
    payBill(selectedBillForPayment.id, paymentMethod);
    setSelectedBillForPayment(null);
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Receipt className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  5 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Hospital Ledger &amp; Cash Reconciliation
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Manage Bills &amp; Payment Settlements
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowCreateBillModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-[#E9DF70]" />
            <span>Generate Patient Invoice</span>
          </button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Total Cleared Revenue
            </span>
            <div className="text-xl font-black text-emerald-900 mt-0.5">
              ₹{totalClearedRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {bills.filter((b) => b.status === 'Paid').length} Invoices Settled
            </span>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Outstanding Receivables
            </span>
            <div className="text-xl font-black text-rose-900 mt-0.5">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">
              {bills.filter((b) => b.status === 'Unpaid').length} Invoices Pending Due
            </span>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Total Invoices Issued
            </span>
            <div className="text-xl font-black text-[#5F2EEA] mt-0.5">
              {bills.length}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold">
              Full EMR Audit Reconciled
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice #, patient, item..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#5F2EEA] focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Paid', 'Unpaid'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all ${
                  statusFilter === tab
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'All' ? 'All Invoices' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient UHID</th>
                <th className="py-3 px-4">Bill Description</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status &amp; Channel</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="font-mono text-xs text-slate-900">{b.id}</strong>
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-slate-900 block font-bold">{b.patientName}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{b.patientId}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                    {b.description}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{b.issueDate}</td>
                  <td className="py-3 px-4">
                    <strong className="text-sm font-black text-slate-900">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border inline-block ${
                        b.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {b.status} {b.paymentMethod ? `· ${b.paymentMethod}` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'Unpaid' && (
                        <button
                          onClick={() => setSelectedBillForPayment(b)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] border-none cursor-pointer shadow-xs"
                        >
                          Record Payment
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceForPrint(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200 cursor-pointer flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Create New Bill ───────────────────────────────────────── */}
      {showCreateBillModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md">
                  <Receipt className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Generate Patient Bill</h3>
                  <p className="text-xs text-slate-500 m-0">Issue clinical charges &amp; tax invoice</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateBillModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Patient</label>
                <select
                  value={billPatientId}
                  onChange={(e) => setBillPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] bg-white font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Description</label>
                <input
                  type="text"
                  required
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Department</label>
                <input
                  type="text"
                  required
                  value={billDept}
                  onChange={(e) => setBillDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Total Billed Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateBillModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Record / Settle Payment ───────────────────────────────── */}
      {selectedBillForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 m-0">Settle &amp; Record Payment</h3>
                <p className="text-xs text-slate-500 m-0">
                  Invoice {selectedBillForPayment.id} · {selectedBillForPayment.patientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedBillForPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Amount Payable</span>
              <div className="text-2xl font-black text-emerald-900">
                ₹{selectedBillForPayment.totalAmount?.toLocaleString('en-IN')}
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Payment Gateway / Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['UPI / GPay', 'Credit Card', 'Cash Desk', 'NetBanking'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'bg-[#16163B] text-white border-[#16163B]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBillForPayment(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Printable Tax Invoice ─────────────────────────────────── */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-xl w-full p-8 space-y-6 my-8 print:p-0">
            {/* Invoice Letterhead */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
              <div>
                <h2 className="text-xl font-black text-slate-900 m-0">ClinicOS Multispeciality Hospital</h2>
                <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                  Regd. Clinical Establishment No. MH-MUM-2026-9901<br />
                  Bandra West, Mumbai - 400050 · GSTIN: 27AAAAA0000A1Z5
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">
                  TAX INVOICE / RECEIPT
                </span>
                <strong className="text-sm font-mono text-slate-900">{selectedInvoiceForPrint.id}</strong>
                <span className="text-[10px] text-slate-400 block">{selectedInvoiceForPrint.issueDate}</span>
              </div>
            </div>

            {/* Patient Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Billed To</span>
                <strong className="text-slate-900 text-sm">{selectedInvoiceForPrint.patientName}</strong>
                <span className="text-[11px] text-slate-500 block">UHID: {selectedInvoiceForPrint.patientId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                  {selectedInvoiceForPrint.status} {selectedInvoiceForPrint.paymentMethod ? `via ${selectedInvoiceForPrint.paymentMethod}` : ''}
                </span>
                {selectedInvoiceForPrint.transactionId && (
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    TXN: {selectedInvoiceForPrint.transactionId}
                  </span>
                )}
              </div>
            </div>

            {/* Line items table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-black text-[10px] uppercase">
                  <th className="py-2">Item Particulars</th>
                  <th className="py-2 text-right">Tax Rate</th>
                  <th className="py-2 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-bold text-slate-900">{selectedInvoiceForPrint.description}</td>
                  <td className="py-3 text-right text-slate-500">Exempt (0%)</td>
                  <td className="py-3 text-right font-black text-slate-900">
                    ₹{selectedInvoiceForPrint.totalAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Block */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700">Total Settlement Received</span>
              <strong className="text-lg font-black text-emerald-700">
                ₹{selectedInvoiceForPrint.totalAmount?.toLocaleString('en-IN')}
              </strong>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Sent to hospital thermal/laser printer.');
                }}
                className="px-5 py-2 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
