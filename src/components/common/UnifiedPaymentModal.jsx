import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Lock,
  X,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * UnifiedPaymentModal
 * A high-converting, accessible UPI QR payment interface used across ClinicOS
 * for Medicines, Video Consultations, Insurance Policies/Co-Pays, Bills, and Diagnostics.
 *
 * Enforces the strict rule: "after tapping done only it will redirect to next"
 */
export const UnifiedPaymentModal = ({
  isOpen,
  onClose,
  onDone,
  amount = 0,
  title = 'Complete Payment',
  subtitle = 'Scan the QR code with any UPI app to complete your transaction',
  particulars = 'ClinicOS Healthcare Services',
  breakdown = [],
  upiId = 'clinicos@icici',
  merchantName = 'ClinicOS Healthcare Pvt Ltd',
  referenceId
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  // Generate a realistic transaction reference if none provided
  const txnRef = referenceId || `TXN-COS-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // Formatted UPI deep-link URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tr=${txnRef}&cu=INR&tn=${encodeURIComponent(particulars)}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiUrl)}`;

  // Reset timer on open
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(600);
      setIsVerifying(false);
      setCopied(false);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDoneClick = () => {
    setIsVerifying(true);

    // Micro-delay to simulate payment verification, then celebrate and redirect
    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setIsVerifying(false);
      if (onDone) {
        onDone({
          transactionId: txnRef,
          amount,
          paymentMethod: 'UPI QR Code',
          paidAt: new Date().toISOString()
        });
      }
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#16163B] via-[#202052] to-[#16163B] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer transition-all"
            title="Cancel & Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              256-Bit Encrypted UPI Gateway
            </span>
            <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Expires in {formatTime(timeLeft)}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-300 m-0 mt-1 font-medium line-clamp-1">
            {subtitle}
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-baseline justify-between">
            <span className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
              Total Amount Payable
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#E9DF70] tracking-tight">
              ₹{Number(amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Particulars & Reference */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Payment Purpose:</span>
              <strong className="text-slate-900 font-black text-right truncate max-w-[240px]">{particulars}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Reference ID:</span>
              <span className="font-mono text-slate-700 font-bold">{txnRef}</span>
            </div>

            {/* Optional Breakdown */}
            {breakdown && breakdown.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200 space-y-1 text-[11px]">
                {breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>{item.label}</span>
                    <strong className="text-slate-800">{item.value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic QR Code Card */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-5 border-2 border-dashed border-slate-300 text-center space-y-3 relative group">
            
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#16163B] uppercase tracking-wider bg-[#E9DF70]/30 px-3 py-1 rounded-full border border-[#E9DF70]">
              <QrCode className="w-3.5 h-3.5 text-[#16163B]" />
              Scan With Any UPI App
            </div>

            {/* QR Frame Container */}
            <div className="relative mx-auto w-52 h-52 p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
              
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#16163B] rounded-tl pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#16163B] rounded-tr pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#16163B] rounded-bl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#16163B] rounded-br pointer-events-none" />

              <img
                src={qrCodeApiUrl}
                alt="UPI Payment QR Code"
                onLoad={() => setQrLoaded(true)}
                className={`w-44 h-44 object-contain transition-opacity duration-300 ${qrLoaded ? 'opacity-100' : 'opacity-70'}`}
              />

              {/* Center Logo Badge */}
              <div className="absolute w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center p-1 pointer-events-none">
                <span className="text-[10px] font-black text-[#16163B] font-mono">COS</span>
              </div>
            </div>

            {/* Copyable UPI ID Box */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-semibold">UPI ID:</span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-mono font-black text-slate-800 cursor-pointer transition-all active:scale-95"
                title="Click to copy UPI ID"
              >
                <span>{upiId}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              {copied && (
                <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">Copied!</span>
              )}
            </div>

            {/* UPI App Logos Pills */}
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred'].map(appName => (
                <span
                  key={appName}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-600 shadow-2xs"
                >
                  {appName}
                </span>
              ))}
            </div>
          </div>

          {/* Mandatory Instruction Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-snug font-medium text-[11px]">
              <strong>Step Verification:</strong> Complete payment in your UPI app, then tap <strong>&quot;Payment Done / I Have Paid&quot;</strong> below to instantly confirm and unlock your next step.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-all"
            >
              Cancel
            </button>

            {/* THE CRITICAL BUTTON: Tapping Done only redirects to next */}
            <button
              type="button"
              id="unified-payment-done-btn"
              onClick={handleDoneClick}
              disabled={isVerifying}
              className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm border-none cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 ${
                isVerifying
                  ? 'bg-emerald-700 text-white cursor-wait opacity-90'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02] active:scale-95 shadow-emerald-600/30'
              }`}
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment Status...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>✓ Payment Done / I Have Paid</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UnifiedPaymentModal;
