import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Wallet,
  Building
} from 'lucide-react';

export const PatientBills = () => {
  const { bills, payBill, showToast } = useApp();

  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI QR Code');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' | 'qr' | 'card' | 'success'

  const totalOutstanding = bills
    .filter(b => b.status === 'Unpaid')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleOpenPayModal = (bill) => {
    setSelectedBill(bill);
    setPaymentMethod('UPI QR Code');
    setPaymentStep('select');
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedBill) return;
    await payBill(selectedBill.id, paymentMethod);
    setPaymentStep('success');
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-12 bg-slate-50">
      
      {/* High-Contrast Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
            <Receipt className="w-3.5 h-3.5 text-orange-600" />
            <span>Digital Financial Ledger & Billing</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 m-0 tracking-tight">
            My Bills & Receipts
          </h2>
          <p className="text-xs md:text-sm text-slate-600 m-0">
            Bills issued by the hospital appear here for digital clearance, QR code payment & official receipt generation.
          </p>
        </div>

        {/* Total Outstanding Card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm text-right min-w-[220px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Total Outstanding Balance</span>
          <div className="text-3xl font-black text-orange-600 mt-1">₹{totalOutstanding.toLocaleString()}</div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-slate-900 m-0">Hospital Invoices ({bills.length})</h3>
          <span className="text-xs text-slate-500 font-medium">Auto-synced with SQLite Database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-black tracking-wider text-[10px]">
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Department / Particulars</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {bills.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-slate-900">{b.id}</td>
                  <td className="p-3.5 text-slate-600">{b.issueDate}</td>
                  <td className="p-3.5 font-bold text-slate-900">{b.department || 'Hospital Services'}</td>
                  <td className="p-3.5 font-black text-slate-900 text-sm">₹{b.totalAmount?.toLocaleString()}</td>
                  <td className="p-3.5">
                    {b.status === 'Paid' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200 text-[10px] inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full font-bold border border-orange-200 text-[10px] inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-orange-600" />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {b.status === 'Unpaid' ? (
                      <button
                        onClick={() => handleOpenPayModal(b)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1.5 ml-auto border-none cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Pay Bill Now</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Downloading Official Receipt for ${b.id}...`)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Payment Gateway Modal with Dynamic UPI QR Code */}
      {isPayModalOpen && selectedBill && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl relative">
            
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentStep !== 'success' ? (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-orange-200 mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>256-Bit Encrypted Payment</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 m-0">Clear Invoice #{selectedBill.id}</h3>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Total Payable Amount: <strong className="text-orange-600 text-sm font-black">₹{selectedBill.totalAmount?.toLocaleString()}</strong></p>
                </div>

                {/* All Payment Options Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-extrabold text-slate-700">Select Payment Method</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'UPI QR Code', label: 'Instant UPI QR Code', icon: QrCode, desc: 'GPay, PhonePe, Paytm, BHIM' },
                      { id: 'Credit / Debit Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                      { id: 'Net Banking', label: 'Net Banking', icon: Building, desc: 'HDFC, ICICI, SBI, Axis' },
                      { id: 'Wallets', label: 'Mobile Wallets', icon: Wallet, desc: 'Paytm Wallet, Amazon Pay' }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'bg-orange-50 border-orange-500 shadow-sm ring-1 ring-orange-500'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-slate-500'}`} />
                            <span className="text-xs font-extrabold text-slate-900">{pm.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 m-0">{pm.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic UPI QR Code Box */}
                {paymentMethod === 'UPI QR Code' && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <span className="text-xs font-black uppercase text-slate-700">Scan & Pay via any UPI App</span>
                    
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=clinicos@icici&pn=ClinicOS%20Hospital&am=${selectedBill.totalAmount}`}
                        alt="UPI Payment QR Code"
                        className="w-44 h-44 mx-auto"
                      />
                    </div>

                    <div className="text-xs text-slate-600 font-bold">
                      UPI ID: <span className="font-mono text-orange-600 font-black">clinicos@icici</span> • Amount: ₹{selectedBill.totalAmount}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Auto-Generates Official Receipt</span>
                  
                  <button
                    onClick={handleConfirmPayment}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Clear ₹{selectedBill.totalAmount}</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Payment Successful!</h3>
                  <p className="text-xs text-slate-500 mt-1">Invoice #{selectedBill.id} cleared via {paymentMethod}.</p>
                </div>

                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer"
                >
                  Done & View Receipt
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
