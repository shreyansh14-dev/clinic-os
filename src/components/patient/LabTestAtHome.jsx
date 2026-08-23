import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Heart,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Droplet,
  ChevronRight,
  FileText,
  CreditCard,
  Building2,
  X,
  Phone,
  QrCode,
  Building,
  Wallet,
  Lock
} from 'lucide-react';

export const LabTestAtHome = () => {
  const { activePatient, bookLabTest, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking Form State
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Bandra West, Mumbai');
  const [pincode, setPincode] = useState('400050');
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 86400000).toISOString().substring(0, 10));
  const [timeSlot, setTimeSlot] = useState('06:30 AM - 07:30 AM (Fasting Sample)');
  const [paymentOption, setPaymentOption] = useState('Pay Online (UPI / Card)');

  // Step state inside modal: 'details' | 'payment' | 'confirmed'
  const [modalStep, setModalStep] = useState('details');
  const [selectedGateway, setSelectedGateway] = useState('UPI QR Code');
  const [bookingTxnId, setBookingTxnId] = useState(null);

  // Home Diagnostic Lab Test Packages
  const packagesList = [
    {
      id: 'pkg-fullbody-1',
      category: 'Full Body Checkups',
      name: 'Comprehensive Full Body Health Screening',
      testsCount: 72,
      price: 999,
      originalPrice: 2499,
      discount: '60% OFF',
      tag: 'MOST POPULAR',
      fasting: '10-12 Hours Fasting Required',
      reportTime: '24 Hours',
      parameters: ['Complete Blood Count (CBC - 24 tests)', 'HbA1c & Fasting Blood Sugar', 'Lipid Profile (Heart Care - 8 tests)', 'Kidney Function Test (KFT - 6 tests)', 'Liver Function Test (LFT - 11 tests)', 'Thyroid Profile Total (T3, T4, TSH)', 'Urine Routine & Microscopy']
    },
    {
      id: 'pkg-sugar-1',
      category: 'Blood Sugar & Diabetes',
      name: 'HbA1c & Fasting Glucose Screening',
      testsCount: 4,
      price: 299,
      originalPrice: 699,
      discount: '57% OFF',
      tag: 'DIABETES CARE',
      fasting: '8-10 Hours Fasting Required',
      reportTime: '12 Hours',
      parameters: ['HbA1c (Glycated Hemoglobin)', 'Fasting Blood Sugar (FBS)', 'Average Blood Glucose (eAG)', 'Urine Glucose']
    },
    {
      id: 'pkg-heart-1',
      category: 'Heart & Cardiac Care',
      name: 'Healthy Heart Profile & Lipid Risk Panel',
      testsCount: 14,
      price: 599,
      originalPrice: 1499,
      discount: '60% OFF',
      tag: 'CARDIAC CHECK',
      fasting: '12 Hours Fasting Required',
      reportTime: '24 Hours',
      parameters: ['Lipid Profile Complete (Cholesterol, Triglycerides, HDL, LDL, VLDL)', 'Hs-CRP (High Sensitivity Cardiac Marker)', 'Homocysteine Level', 'Serum Electrolytes (Sodium, Potassium, Chloride)']
    },
    {
      id: 'pkg-kidney-1',
      category: 'Kidney Function (KFT)',
      name: 'Renal & Kidney Health Profile',
      testsCount: 9,
      price: 399,
      originalPrice: 899,
      discount: '55% OFF',
      tag: 'KIDNEY CARE',
      fasting: 'No Fasting Required',
      reportTime: '12 Hours',
      parameters: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'Uric Acid', 'eGFR (Kidney Filtration Rate)', 'Serum Calcium & Phosphorus', 'Urine Microalbumin']
    },
    {
      id: 'pkg-liver-1',
      category: 'Liver Function (LFT)',
      name: 'Complete Liver Function Profile',
      testsCount: 11,
      price: 399,
      originalPrice: 899,
      discount: '55% OFF',
      tag: 'LIVER CARE',
      fasting: '8 Hours Fasting Required',
      reportTime: '12 Hours',
      parameters: ['SGOT / AST', 'SGPT / ALT', 'Bilirubin Total, Direct & Indirect', 'Alkaline Phosphatase (ALP)', 'Total Protein & Albumin', 'Globulin & A/G Ratio']
    },
    {
      id: 'pkg-thyroid-1',
      category: 'Thyroid Profile',
      name: 'Thyroid Care Panel (T3, T4, TSH)',
      testsCount: 3,
      price: 349,
      originalPrice: 799,
      discount: '56% OFF',
      tag: 'THYROID CARE',
      fasting: 'No Fasting Required',
      reportTime: '12 Hours',
      parameters: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)']
    }
  ];

  const categories = ['All', 'Full Body Checkups', 'Blood Sugar & Diabetes', 'Heart & Cardiac Care', 'Kidney Function (KFT)', 'Liver Function (LFT)', 'Thyroid Profile'];

  const filteredPackages = packagesList.filter(pkg => activeCategory === 'All' || pkg.category === activeCategory);

  const handleOpenBooking = (pkg) => {
    setSelectedPackage(pkg);
    setModalStep('details');
    setIsBookingModalOpen(true);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!address.trim() || !pincode.trim()) {
      showToast('Please provide home sample collection address.', 'warn');
      return;
    }
    if (paymentOption === 'Pay Cash at Sample Pick') {
      handleFinalizeBooking('Pay Cash at Sample Pick', 'COD');
    } else {
      setModalStep('payment');
    }
  };

  const handleFinalizeBooking = async (method, txnCode = null) => {
    const bookingId = `LAB-HOME-${Math.floor(100000 + Math.random() * 900000)}`;
    const txn = txnCode || `TXN-LAB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setBookingTxnId(txn);

    await bookLabTest(bookingId, selectedPackage.name, selectedPackage.category, selectedPackage.price);
    setModalStep('confirmed');
    showToast(`Home Sample Pickup Scheduled! Booking ID: ${bookingId}`);
  };

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-12 bg-slate-50">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
            <FlaskConical className="w-3.5 h-3.5 text-blue-800" />
            <span>NABL Accredited Diagnostic Labs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 m-0 tracking-tight">
            Book Diagnostic Lab Tests at Home
          </h1>
          <p className="text-xs md:text-sm text-slate-600 m-0 leading-relaxed">
            Free home sample collection by certified phlebotomists. 100% accurate digital lab reports delivered within 24 hours.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700 pt-2">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free Home Sample Pick</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% NABL Accredited</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Smart E-Report in 24 Hrs</span>
            </div>
          </div>
        </div>

        {/* Feature Pill Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center min-w-[220px]">
          <Award className="w-8 h-8 text-blue-800 mx-auto" />
          <div className="text-sm font-black text-slate-900">100% Safe Home Sampling</div>
          <div className="text-[11px] text-slate-500">Certified Trained Phlebotomists</div>
        </div>
      </div>

      {/* Health Categories Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 m-0">Select Health Checkup Package</h2>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {filteredPackages.length} Packages Available
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-extrabold rounded-full whitespace-nowrap transition-all border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white border border-slate-200 hover:border-blue-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group practo-card-hover"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {pkg.tag}
                </span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {pkg.discount}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 m-0 group-hover:text-blue-800 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 m-0">Includes {pkg.testsCount} Essential Tests / Parameters</p>
              </div>

              {/* Fasting & Report Guarantee Pills */}
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-semibold pt-1">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{pkg.fasting}</span>
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Report in {pkg.reportTime}</span>
                </span>
              </div>

              {/* Parameters List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-extrabold text-slate-700 uppercase">Key Parameters Covered:</div>
                {pkg.parameters.map((param, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="line-clamp-1">{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & Booking Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black text-slate-900">₹{pkg.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Free Home Sample Pick</span>
              </div>

              <button
                onClick={() => handleOpenBooking(pkg)}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1.5 border-none cursor-pointer transition-all"
              >
                <span>Book Home Pick</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Home Sample Pickup Booking & Multiple Payment Options Modal */}
      {isBookingModalOpen && selectedPackage && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl relative">
            
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: Details Form */}
            {modalStep === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-blue-200 mb-2">
                    <FlaskConical className="w-3 h-3" />
                    <span>Home Sample Collection</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 m-0">{selectedPackage.name}</h3>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Total Amount: <strong className="text-blue-900 text-sm font-black">₹{selectedPackage.price}</strong> (Free Collection)</p>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block mb-1.5">Full Home Address for Sample Collection *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Street, Building No., Area, Landmark..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-800 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-800"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5">Pickup Date *</label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5">Select Morning Time Slot *</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="06:30 AM - 07:30 AM (Fasting Sample)">06:30 AM - 07:30 AM (Fasting Sample)</option>
                      <option value="07:30 AM - 08:30 AM (Fasting Sample)">07:30 AM - 08:30 AM (Fasting Sample)</option>
                      <option value="08:30 AM - 09:30 AM (Fasting Sample)">08:30 AM - 09:30 AM (Fasting Sample)</option>
                      <option value="10:00 AM - 11:30 AM (Non-Fasting)">10:00 AM - 11:30 AM (Non-Fasting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5">Payment Option</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Pay Online (UPI / Card)', 'Pay Cash at Sample Pick'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPaymentOption(opt)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer ${
                            paymentOption === opt ? 'bg-blue-50 border-blue-900 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">Total: ₹{selectedPackage.price}</span>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Proceed to Multiple Payment Options</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* STEP 2: Multiple Payment Options Checkout */}
            {modalStep === 'payment' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-blue-200 mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>256-Bit Encrypted Payment Checkout</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 m-0">{selectedPackage.name}</h3>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Total Amount Payable: <strong className="text-blue-900 text-base font-black">₹{selectedPackage.price}</strong></p>
                </div>

                {/* Gateway Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">Select Preferred Payment Gateway</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'UPI QR Code', label: 'Instant UPI QR Code', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                      { id: 'Credit / Debit Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay, Maestro' },
                      { id: 'Net Banking', label: 'Net Banking', icon: Building, desc: 'HDFC, ICICI, SBI, Axis, Kotak' },
                      { id: 'Wallets & PayLater', label: 'Mobile Wallets', icon: Wallet, desc: 'Paytm Wallet, Amazon Pay, LazyPay' }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isSelected = selectedGateway === pm.id;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setSelectedGateway(pm.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'bg-blue-50 border-blue-900 shadow-sm ring-1 ring-blue-900'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-900' : 'text-slate-500'}`} />
                            <span className="text-xs font-extrabold text-slate-900">{pm.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 m-0">{pm.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic UPI QR Code */}
                {selectedGateway === 'UPI QR Code' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-slate-700">Scan & Pay via any UPI App</span>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=clinicos@icici&pn=ClinicOS%20Diagnostics&am=${selectedPackage.price}`}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 mx-auto"
                      />
                    </div>
                    <div className="text-xs text-slate-600 font-bold">
                      UPI ID: <span className="font-mono text-blue-900 font-black">clinicos@icici</span> • Amount: ₹{selectedPackage.price}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setModalStep('details')}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => handleFinalizeBooking(selectedGateway)}
                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{selectedPackage.price} & Complete Booking</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: Confirmed Screen */}
            {modalStep === 'confirmed' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Home Sample Pickup Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">Transaction ID: <strong className="text-blue-900 font-mono">{bookingTxnId}</strong></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2 font-medium">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Package Name:</span>
                    <span className="font-extrabold text-slate-900">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Scheduled Pickup Date:</span>
                    <span className="font-extrabold text-slate-900">{pickupDate} ({timeSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Collection Address:</span>
                    <span className="font-extrabold text-slate-900 line-clamp-1">{address}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer"
                >
                  Done & View My Lab Reports
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
