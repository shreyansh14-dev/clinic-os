import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Syringe,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CreditCard,
  QrCode,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  Award,
  ChevronRight,
  Heart,
  Baby,
  Truck
} from 'lucide-react';

const AVAILABLE_VACCINES = [
  {
    id: 'covid',
    name: 'COVID-19 Booster',
    doseInfo: 'Booster Dose',
    category: 'Adult & Senior',
    tagColor: 'bg-blue-600',
    bgColor: 'bg-[#EFF6FF]',
    borderColor: 'border-[#DBEAFE]',
    price: 500,
    originalPrice: 800,
    emoji: '💉',
    description: 'Precautionary booster compatible with Covishield, Covaxin, and Corbevax for enhanced neutralising antibody titers.',
    features: ['Home visit in 2 hrs', 'Cold-chain kit (2-8°C)', 'CoWIN QR Certificate'],
    suitableFor: 'Adults 18+ yrs (after 6 months from 2nd dose)',
    brands: ['Covishield (Serum Institute)', 'Covaxin (Bharat Biotech)', 'Corbevax (Biological E)']
  },
  {
    id: 'flu',
    name: 'Influenza (Flu) Vaccine',
    doseInfo: 'Seasonal Annual',
    category: 'Seasonal Protection',
    tagColor: 'bg-amber-500',
    bgColor: 'bg-[#FFF7ED]',
    borderColor: 'border-[#FFEDD5]',
    price: 350,
    originalPrice: 600,
    emoji: '🤧',
    description: 'Quadrivalent flu vaccine updated for current WHO strains, providing 1-year protection against seasonal influenza A & B.',
    features: ['Available now in Mumbai', 'Prevents respiratory flu', 'Quick 5-min administration'],
    suitableFor: 'All age groups 6 months and above',
    brands: ['FluQuadri (Sanofi)', 'Vaxiflu-4 (Zydus Cadila)', 'Influvac Tetra (Abbott)']
  },
  {
    id: 'hepb',
    name: 'Hepatitis B Vaccine',
    doseInfo: '3-Dose Series',
    category: 'Liver Protection',
    tagColor: 'bg-purple-600',
    bgColor: 'bg-[#F5F3FF]',
    borderColor: 'border-[#EDE9FE]',
    price: 650,
    originalPrice: 850,
    emoji: '🛡️',
    description: 'Recombinant Hepatitis B vaccination series inducing life-long antibodies against acute and chronic hepatitis B liver infection.',
    features: ['Full protection over 6 months', 'Auto-reminders for Doses 2 & 3', 'Pre-vaccine antibody advice'],
    suitableFor: 'Adults, healthcare workers, infants',
    brands: ['Engerix-B (GSK)', 'GeneVac-B (Serum Institute)', 'Bimmugen']
  },
  {
    id: 'baby',
    name: 'Baby & Child Immunisation',
    doseInfo: 'Govt. NHP Universal',
    category: 'Pediatric Welfare',
    tagColor: 'bg-emerald-600',
    bgColor: 'bg-[#F0FDF4]',
    borderColor: 'border-[#DCFCE7]',
    price: 0,
    originalPrice: null,
    isFree: true,
    emoji: '👶',
    description: 'Complete National Immunisation Programme package including BCG, OPV, Pentavalent (DPT+HepB+Hib), Rotavirus, PCV and MR.',
    features: ['Govt. NHP — Free of Cost', 'WHO certified cold-chain', 'Official Child Health Card issued'],
    suitableFor: 'Infants and toddlers (0 to 5 years)',
    brands: ['Govt. Central Supply (NHP Universal)', 'Private Pediatric Composite (Optional)']
  },
  {
    id: 'typhoid',
    name: 'Typhoid Conjugate (TCV)',
    doseInfo: 'Single Dose',
    category: 'Infection Prevention',
    tagColor: 'bg-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
    price: 299,
    originalPrice: 450,
    emoji: '🦠',
    description: 'High-efficacy typhoid conjugate vaccine giving strong, long-lasting immunity against Salmonella typhi for 3 to 5 years.',
    features: ['Single shot protection', 'Protects against foodborne illness', 'Pain-free intramuscular injection'],
    suitableFor: 'Children above 6 months and adults',
    brands: ['Typbar-TCV (Bharat Biotech)', 'Zyvac-TCV (Zydus)']
  },
  {
    id: 'hpv',
    name: 'HPV Cervical Cancer Vaccine',
    doseInfo: '2 or 3 Doses',
    category: 'Preventive Oncology',
    tagColor: 'bg-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    price: 1800,
    originalPrice: 2400,
    emoji: '🌸',
    description: 'Clinically proven protection against high-risk Human Papillomavirus strains responsible for cervical, vulvar, and throat cancers.',
    features: ['90%+ cancer risk reduction', 'Confidential consultation', 'Female certified nurse'],
    suitableFor: 'Females and males aged 9 to 45 years',
    brands: ['Gardasil-9 (MSD)', 'Cervavac (Serum Institute)']
  }
];

export const VaccineRegistration = () => {
  const { activePatient, showToast, registerVaccine } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected vaccine from state navigation (e.g. from dashboard click)
  const initialVaccineId = location.state?.selectedVaccineId || 'covid';
  const [selectedVaccineId, setSelectedVaccineId] = useState(initialVaccineId);

  const selectedVaccine = AVAILABLE_VACCINES.find(v => v.id === selectedVaccineId) || AVAILABLE_VACCINES[0];

  // Beneficiary details form
  const [beneficiaryType, setBeneficiaryType] = useState('self');
  const [beneficiaryName, setBeneficiaryName] = useState(activePatient?.name || 'Rahul Sharma');
  const [age, setAge] = useState(activePatient?.age || 38);
  const [gender, setGender] = useState(activePatient?.gender || 'Male');
  const [phone, setPhone] = useState(activePatient?.phone || '+91 98201 44820');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('7819-4820-9182');

  // Vaccine Dose & Brand
  const [doseType, setDoseType] = useState(selectedVaccine.id === 'covid' ? 'Booster Dose' : selectedVaccine.doseInfo);
  const [selectedBrand, setSelectedBrand] = useState(selectedVaccine.brands[0]);
  const [hasNoContraindications, setHasNoContraindications] = useState(true);

  // Mode and Schedule
  const [mode, setMode] = useState('home'); // 'home' | 'center'
  const [appointmentDate, setAppointmentDate] = useState(new Date(Date.now() + 86400000).toISOString().substring(0, 10));
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM (Mid-day)');
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Bandra West, Mumbai');
  const [pincode, setPincode] = useState('400050');

  // Confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [registrationRef, setRegistrationRef] = useState(null);

  // Update dose and brand when selected vaccine changes
  useEffect(() => {
    setDoseType(selectedVaccine.id === 'covid' ? 'Booster Dose' : selectedVaccine.doseInfo);
    setSelectedBrand(selectedVaccine.brands[0]);
  }, [selectedVaccineId]);

  // Handle beneficiary type change
  const handleBeneficiaryTypeChange = (type) => {
    setBeneficiaryType(type);
    if (type === 'self') {
      setBeneficiaryName(activePatient?.name || 'Rahul Sharma');
      setAge(activePatient?.age || 38);
      setGender(activePatient?.gender || 'Male');
      setIdType('Aadhaar Card');
    } else if (type === 'child') {
      setBeneficiaryName('Aarav Sharma (Child)');
      setAge(3);
      setGender('Male');
      setIdType('Birth Certificate');
      setIdNumber('BC-MUM-2023-901');
    } else if (type === 'senior') {
      setBeneficiaryName('Rameshwar Sharma (Father)');
      setAge(68);
      setGender('Male');
      setIdType('Aadhaar Card');
      setIdNumber('6291-3820-1190');
    } else {
      setBeneficiaryName('Sunita Sharma (Spouse)');
      setAge(35);
      setGender('Female');
      setIdType('Aadhaar Card');
      setIdNumber('8842-1920-5541');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!beneficiaryName.trim()) {
      showToast('Please enter beneficiary full name.', 'warn');
      return;
    }
    if (!hasNoContraindications) {
      showToast('Please confirm patient safety declarations.', 'warn');
      return;
    }

    const regId = `VAC-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    setRegistrationRef(regId);

    // Save in AppContext vaccines state
    registerVaccine({
      name: `${selectedVaccine.name} (${selectedBrand})`,
      beneficiary: beneficiaryName,
      dose: doseType,
      date: appointmentDate,
      timeSlot,
      mode,
      address: mode === 'home' ? address : 'ClinicOS Primary Care Booth, Bandra West',
      status: 'Scheduled',
      refId: regId
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Vaccine slot confirmed! Registration ID: ${regId}`);
    setIsConfirmed(true);
  };

  return (
    <div className="w-full space-y-6 pb-24 font-['Poppins']">

      {/* ── Top Navigation & Breadcrumbs ────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => navigate('/')}
            className="hover:underline text-slate-500 hover:text-slate-700 bg-transparent border-none p-0 cursor-pointer"
          >
            Dashboard
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/vaccines')}
            className="hover:underline text-slate-500 hover:text-slate-700 bg-transparent border-none p-0 cursor-pointer"
          >
            Vaccine Passport
          </button>
          <span>/</span>
          <span className="text-[#16163B] font-bold">Vaccine Registration</span>
        </div>
      </div>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1e1b4b] p-7 md:p-9 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Govt. & WHO Standard Verified
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E9DF70]/20 text-[#E9DF70] border border-[#E9DF70]/30 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                2-Hour Certified Nurse Home Visit Active
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white m-0 tracking-tight">
              Vaccine Registration & Slot Booking
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-2 leading-relaxed">
              Register yourself or your loved ones for COVID-19 boosters, seasonal flu, pediatric immunisation, or hepatitis vaccines. Cold-chain monitored at 2–8°C with digital certification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/vaccines')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 cursor-pointer flex items-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4 text-[#E9DF70]" />
              <span>View Past Vaccines</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CONFIRMATION RECEIPT VIEW ────────────────────────────────── */}
      {isConfirmed ? (
        <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-xl p-8 max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Registration Successful • Slot Reserved
            </span>
            <h2 className="text-2xl font-black text-slate-900 m-0 mt-2">
              Vaccine Appointment Confirmed!
            </h2>
            <p className="text-xs text-slate-500 font-medium m-0 mt-1">
              Your appointment confirmation and digital QR pass have been generated.
            </p>
          </div>

          {/* Slip Details Card */}
          <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 text-left space-y-3.5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Reference Number</span>
              <strong className="text-sm font-black text-[#16163B] font-mono">{registrationRef}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <strong className="text-slate-900">{beneficiaryName} ({age} yrs, {gender})</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Vaccine & Dose:</span>
              <strong className="text-slate-900">{selectedVaccine.name} — {doseType}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Manufacturer Brand:</span>
              <strong className="text-slate-900">{selectedBrand}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Appointment Slot:</span>
              <strong className="text-slate-900">{appointmentDate} • {timeSlot}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Service Mode:</span>
              <strong className="text-emerald-700">
                {mode === 'home' ? '🏠 Home Visit (Certified Nurse Assigned)' : '🏥 Clinic Walk-in (Priority Booth)'}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Location / Address:</span>
              <strong className="text-slate-900 max-w-[260px] text-right truncate">
                {mode === 'home' ? address : 'ClinicOS Primary Care Hub, Bandra West'}
              </strong>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Amount Paid:</span>
              <span className="text-emerald-600">
                {selectedVaccine.price === 0 ? 'FREE (Govt NHP)' : `₹${selectedVaccine.price}`}
              </span>
            </div>
          </div>

          {/* QR Verification Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-8 h-8 text-[#16163B]" />
              </div>
              <div>
                <strong className="text-xs font-black text-blue-900 block">Show this QR Pass to Vaccinator</strong>
                <span className="text-[11px] text-blue-700">Digital verification ensures lot & batch verification before administration.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/vaccines')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#16163B] hover:bg-[#242454] text-white font-extrabold text-xs border-none cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View in Vaccine Passport</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E9DF70]" />
            </button>

            <button
              onClick={() => {
                setIsConfirmed(false);
                setSelectedVaccineId('covid');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-all"
            >
              Book Another Vaccine
            </button>
          </div>
        </div>
      ) : (
        /* ── REGISTRATION FORM VIEW ─────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Vaccine Selector (8 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Select Vaccine Card */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#16163B] text-white text-xs font-black flex items-center justify-center">1</span>
                  <h3 className="text-base font-black text-slate-900 m-0">Choose Required Vaccine</h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Select 1 of {AVAILABLE_VACCINES.length} available</span>
              </div>

              {/* Vaccine Grid (Featured 4 + Additional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {AVAILABLE_VACCINES.map((vac) => {
                  const isSelected = selectedVaccineId === vac.id;
                  return (
                    <div
                      key={vac.id}
                      onClick={() => setSelectedVaccineId(vac.id)}
                      className={`rounded-[24px] p-4.5 cursor-pointer transition-all border-2 relative overflow-hidden flex flex-col justify-between ${vac.bgColor} ${
                        isSelected
                          ? 'border-[#16163B] shadow-lg scale-[1.02] ring-2 ring-[#16163B]/20'
                          : `${vac.borderColor} hover:border-slate-300 hover:shadow-sm`
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#16163B] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs">
                            {vac.emoji}
                          </div>
                          {!isSelected && (
                            <span className={`${vac.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase`}>
                              {vac.doseInfo}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-[#16163B] m-0 line-clamp-1">{vac.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium m-0 mt-1 line-clamp-2 leading-relaxed">
                          {vac.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <div>
                          <strong className="text-base font-black text-[#16163B]">
                            {vac.price === 0 ? 'FREE' : `₹${vac.price}`}
                          </strong>
                          {vac.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5 font-bold">
                              ₹{vac.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          {vac.features[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Beneficiary Details */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16163B] text-white text-xs font-black flex items-center justify-center">2</span>
                <h3 className="text-base font-black text-slate-900 m-0">Beneficiary Details (Who is this for?)</h3>
              </div>

              {/* Beneficiary Quick Switch */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'self', label: '👤 Self (Account Holder)' },
                  { id: 'child', label: '👶 Child (Under 5 yrs)' },
                  { id: 'senior', label: '👴 Senior Citizen (60+ yrs)' },
                  { id: 'other', label: '👥 Family Member' }
                ].map(b => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => handleBeneficiaryTypeChange(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                      beneficiaryType === b.id
                        ? 'bg-[#16163B] text-white border-[#16163B] shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Beneficiary Full Name *</label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Enter name as on Photo ID"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Age *</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Government Photo ID *</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID (EPIC)</option>
                    <option value="Birth Certificate">Birth Certificate (Infant / Child)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">ID Number *</label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. 7819-4820-9182"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Dose, Brand Preference & Medical Safety */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16163B] text-white text-xs font-black flex items-center justify-center">3</span>
                <h3 className="text-base font-black text-slate-900 m-0">Dose & Vaccine Formulation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Dose Requirement</label>
                  <select
                    value={doseType}
                    onChange={(e) => setDoseType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  >
                    <option value="1st Dose">1st Dose (Primary)</option>
                    <option value="2nd Dose">2nd Dose</option>
                    <option value="Booster Dose">Precautionary / Booster Dose</option>
                    <option value="Annual Seasonal">Annual Seasonal Booster</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Preferred Brand / Manufacturer</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  >
                    {selectedVaccine.brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Safety declaration */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNoContraindications}
                    onChange={(e) => setHasNoContraindications(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 mt-0.5"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    I confirm that the beneficiary does not have an active high fever, acute respiratory distress, or severe anaphylactic reaction to previous vaccine doses.
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Service Mode, Slot & Checkout (4 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Mode of Administration */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16163B] text-white text-xs font-black flex items-center justify-center">4</span>
                <h3 className="text-base font-black text-slate-900 m-0">Vaccination Mode</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setMode('home')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    mode === 'home'
                      ? 'border-[#16163B] bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xl block mb-1">🏠</span>
                    <strong className="text-xs font-black text-[#16163B] block">Home Visit</strong>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                      Certified Nurse visits with cold-box (2–8°C)
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 mt-2 block">Available in 2 hrs</span>
                </div>

                <div
                  onClick={() => setMode('center')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    mode === 'center'
                      ? 'border-[#16163B] bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xl block mb-1">🏥</span>
                    <strong className="text-xs font-black text-[#16163B] block">Clinic Walk-in</strong>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                      Fast-track priority booth at Bandra Clinic
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-blue-600 mt-2 block">Zero Queue Slot</span>
                </div>
              </div>

              {/* Date & Slot Picker */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B]"
                  >
                    <option value="08:30 AM - 10:30 AM (Early Morning)">08:30 AM - 10:30 AM (Early Morning)</option>
                    <option value="11:00 AM - 01:00 PM (Mid-day)">11:00 AM - 01:00 PM (Mid-day)</option>
                    <option value="02:00 PM - 04:00 PM (Afternoon)">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 07:00 PM (Evening)">05:00 PM - 07:00 PM (Evening)</option>
                  </select>
                </div>

                {mode === 'home' && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Home Visit Address *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat, building, landmark, area"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#16163B] resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Summary & Register Action Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#16163B] text-white rounded-[28px] p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 m-0">
                Registration Summary
              </h4>

              <div className="space-y-2 text-xs border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">{selectedVaccine.name}:</span>
                  <strong>{selectedVaccine.price === 0 ? 'FREE' : `₹${selectedVaccine.price}`}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {mode === 'home' ? 'Certified Nurse Home Visit Fee:' : 'Clinic Booth Reservation:'}
                  </span>
                  <span className="text-emerald-400 font-bold">FREE (₹0)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-300">Observation & Digital QR Pass:</span>
                  <span className="text-emerald-400 font-bold">Included</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs text-slate-300 font-bold uppercase">Total Amount:</span>
                <span className="text-2xl font-black text-[#E9DF70]">
                  {selectedVaccine.price === 0 ? 'FREE' : `₹${selectedVaccine.price}`}
                </span>
              </div>

              <button
                onClick={handleRegister}
                className="w-full py-3.5 rounded-2xl bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-black text-sm border-none cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <Syringe className="w-4 h-4" />
                <span>
                  {selectedVaccine.price === 0
                    ? 'Confirm Free NHP Registration →'
                    : `Confirm Registration • Pay ₹${selectedVaccine.price}`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant CoWIN & Digital Health QR Pass Generated</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default VaccineRegistration;
