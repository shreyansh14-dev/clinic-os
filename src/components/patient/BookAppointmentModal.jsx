import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Heart,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Lock,
  Receipt,
  X,
  Brain,
  Sparkles,
  Activity,
  Baby,
  Scissors,
  ShieldAlert,
  UserCheck,
  Volume2,
  Eye,
  Droplet,
  UtensilsCrossed,
  Wind,
  Syringe,
  Siren
} from 'lucide-react';

export const BookAppointmentModal = ({ onBookingComplete }) => {
  const { doctors, departments, bookAppointment, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve incoming doctor navigation state if user tapped a doctor card
  const incomingDoc = location.state?.doctor;
  const incomingDocId = location.state?.doctorId || incomingDoc?.id;
  const initialStep = location.state?.step || (incomingDoc || incomingDocId ? 2 : 1);

  // Helper to match doctor category/specialty to department ID
  const findMatchingDeptId = (doc) => {
    if (!doc) return departments[0]?.id || 'dept-1';
    if (doc.deptId) return doc.deptId;
    const cat = `${doc.category || ''} ${doc.department || ''} ${doc.specialty || ''}`.toLowerCase();
    const matched = departments.find(d => {
      const dName = (d.name || '').toLowerCase();
      if (cat.includes('ortho') && dName.includes('ortho')) return true;
      if (cat.includes('cardio') && dName.includes('cardio')) return true;
      if (cat.includes('neuro') && dName.includes('neuro')) return true;
      if (cat.includes('gyn') && dName.includes('gyn')) return true;
      if (cat.includes('derm') && dName.includes('derm')) return true;
      if (cat.includes('ent') && dName.includes('ent')) return true;
      if ((cat.includes('eye') || cat.includes('ophthal')) && dName.includes('ophthal')) return true;
      if (cat.includes('pedia') && dName.includes('pedia')) return true;
      if (cat.includes('diabet') && (dName.includes('endo') || dName.includes('nephro'))) return true;
      if (cat.includes('psych') && (dName.includes('neuro') || dName.includes('onco') || dName.includes('general med'))) return true;
      return dName.includes(cat) || cat.includes(dName);
    });
    return matched?.id || departments[0]?.id || 'dept-1';
  };

  const [step, setStep] = useState(initialStep);
  const [selectedDept, setSelectedDept] = useState(() => {
    if (incomingDoc) {
      return findMatchingDeptId(incomingDoc);
    }
    return departments[0]?.id || 'dept-1';
  });

  const currentDeptObj = departments.find(d => d.id === selectedDept) || departments[0];

  // Filter strictly by selected department ID (returns 10 doctors)
  const departmentDoctors = doctors.filter(doc => doc && doc.deptId === selectedDept);

  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    if (incomingDocId) return incomingDocId;
    return departmentDoctors[0]?.id || 'doc-1-1';
  });

  // Listen to navigation state updates (e.g. tapping doctor from dashboard)
  useEffect(() => {
    if (location.state?.doctor || location.state?.doctorId) {
      const doc = location.state.doctor;
      const docId = location.state.doctorId || doc?.id;
      if (doc) {
        setSelectedDept(findMatchingDeptId(doc));
      }
      if (docId) {
        setSelectedDoctor(docId);
      }
      setStep(location.state.step || 2);
    }
  }, [location.state]);

  const [date, setDate] = useState('2026-08-24');
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  // Payment Gateway Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI QR Code');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [bookingTxnId, setBookingTxnId] = useState(null);
  const [lastAppointment, setLastAppointment] = useState(null);

  // Normalize active doctor object from context or passed specialist doctor
  const activeDocObj = useMemo(() => {
    // 1. Try finding in context doctors by ID or by name
    let found = doctors.find(d => d.id === selectedDoctor || (incomingDoc && d.name?.toLowerCase() === incomingDoc.name?.toLowerCase()));
    if (found) return found;

    // 2. If incoming doctor matches selectedDoctor or was passed via state
    if (incomingDoc && (incomingDoc.id === selectedDoctor || !selectedDoctor)) {
      const feeNumber = typeof incomingDoc.fee === 'number'
        ? incomingDoc.fee
        : parseInt((incomingDoc.fee || '').replace(/[^0-9]/g, '')) || 1500;

      return {
        id: incomingDoc.id || 'doc-custom',
        deptId: findMatchingDeptId(incomingDoc),
        name: incomingDoc.name,
        specialty: incomingDoc.specialty,
        department: incomingDoc.department || incomingDoc.category || currentDeptObj?.name || 'Specialist Consultation',
        experience: incomingDoc.experience || incomingDoc.exp || '12+ Years',
        rating: incomingDoc.rating || '4.9',
        fee: feeNumber,
        consultationFee: feeNumber,
        avatar: incomingDoc.avatar || incomingDoc.image || '/images/doctors/indian_doc_m1.jpg',
        phone: incomingDoc.phone || '+91 98765 43210',
        email: incomingDoc.email || 'doctor@clinicos.com',
        room: incomingDoc.room || 'OPD Block A-102',
        availability: incomingDoc.availability || incomingDoc.available || 'Today (09:00 AM - 04:00 PM)'
      };
    }

    // 3. Fallback to department doctors or first doctor
    return departmentDoctors[0] || doctors[0] || {
      id: 'doc-1-1',
      name: 'Dr. Arjun Sharma',
      specialty: 'Senior Consultant - Cardiology',
      department: 'Cardiology',
      experience: '15+ Years',
      rating: '4.9',
      fee: 2000,
      avatar: '/images/doctors/cardio_1.jpg'
    };
  }, [doctors, selectedDoctor, incomingDoc, currentDeptObj, departmentDoctors]);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'
  ];

  // Medical Icons Mapping for Departments
  const getDepartmentIcon = (deptName) => {
    const name = (deptName || '').toLowerCase();
    if (name.includes('cardio')) return Heart;
    if (name.includes('general med')) return Stethoscope;
    if (name.includes('neuro')) return Brain;
    if (name.includes('derma')) return Sparkles;
    if (name.includes('ortho')) return Activity;
    if (name.includes('pedia')) return Baby;
    if (name.includes('surger')) return Scissors;
    if (name.includes('onco')) return ShieldAlert;
    if (name.includes('gyne') || name.includes('obste')) return UserCheck;
    if (name.includes('ent') || name.includes('throat')) return Volume2;
    if (name.includes('ophthal')) return Eye;
    if (name.includes('nephro')) return Droplet;
    if (name.includes('gastro')) return UtensilsCrossed;
    if (name.includes('pulmo')) return Wind;
    if (name.includes('endo')) return Syringe;
    if (name.includes('emergen') || name.includes('trauma')) return Siren;
    return Stethoscope;
  };

  const handleOpenPaymentModal = (e) => {
    e.preventDefault();
    setIsPaymentConfirmed(false);
    setIsPayModalOpen(true);
  };

  const handleCompletePaymentAndBook = async () => {
    const txn = `TXN-OPD-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setBookingTxnId(txn);
    setIsPaymentConfirmed(true);

    const newApt = {
      doctorId: activeDocObj.id,
      doctorName: activeDocObj.name,
      doctorAvatar: activeDocObj.avatar,
      specialty: activeDocObj.specialty,
      date,
      time,
      reason: reason || 'General OPD Consultation',
      fee: activeDocObj.fee,
      paymentMethod,
      transactionId: txn,
      status: 'Confirmed & Paid'
    };

    setLastAppointment(newApt);
    await bookAppointment(newApt);
    showToast(`Payment of ₹${activeDocObj.fee} Successful! Appointment Confirmed (Txn #${txn}).`);
  };

  const handleRedirectToConfirmation = () => {
    setIsPayModalOpen(false);
    if (onBookingComplete) {
      onBookingComplete(lastAppointment);
    } else {
      navigate('/booking-confirmation', { state: { appointment: lastAppointment } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-slate-900 pb-12">
      
      {/* Step Header Indicator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-slate-300">
            <Stethoscope className="w-3.5 h-3.5 text-slate-800" />
            <span>OPD Appointment Booking</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 m-0">Book Doctor Consultation</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">10 Dedicated Specialists per Department with Instant OPD Booking & Payment</p>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => {
              setStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full border-none transition-all cursor-pointer font-extrabold text-xs flex items-center space-x-1 ${
              step === 1
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-200/90 text-slate-700 hover:bg-slate-300 hover:text-slate-900 active:scale-95'
            }`}
            title="Go to Step 1: Department & Specialist Selection"
          >
            <span>1. Department (10 Specialists)</span>
          </button>
          <span className="text-slate-400 font-semibold select-none">→</span>
          <button
            type="button"
            onClick={() => {
              setStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full border-none transition-all cursor-pointer font-extrabold text-xs flex items-center space-x-1 ${
              step === 2
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-200/90 text-slate-700 hover:bg-slate-300 hover:text-slate-900 active:scale-95'
            }`}
            title="Go to Step 2: Date & Slot Selection"
          >
            <span>2. Date & Slot</span>
          </button>
          <span className="text-slate-400 font-semibold select-none">→</span>
          <button
            type="button"
            onClick={() => {
              setStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full border-none transition-all cursor-pointer font-extrabold text-xs flex items-center space-x-1 ${
              step === 3
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-200/90 text-slate-700 hover:bg-slate-300 hover:text-slate-900 active:scale-95'
            }`}
            title="Go to Step 3: Review & Payment"
          >
            <span>3. Review & Pay</span>
          </button>
        </div>
      </div>

      {/* STEP 1: Department & Specialist Selection */}
      {step === 1 && (
        <div className="space-y-6">
          
          {/* Department Picker Grid with Dedicated Icons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">1. Select Medical Department</h3>
              <span className="text-xs text-slate-500 font-bold">{departments.length} Departments Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
              {departments.map((dept) => {
                const isSelected = selectedDept === dept.id;
                const DeptIcon = getDepartmentIcon(dept.name);

                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDept(dept.id);
                      const matchingDocs = doctors.filter(doc => doc && doc.deptId === dept.id);
                      if (matchingDocs.length > 0) {
                        setSelectedDoctor(matchingDocs[0].id);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <DeptIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-900'}`} />
                        <span className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{dept.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
                        ₹{dept.fee || 2000}
                      </span>
                    </div>
                    <p className={`text-[10px] m-0 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {dept.description || 'Specialist OPD Care'}
                    </p>
                    <div className={`text-[10px] font-extrabold mt-1.5 flex items-center space-x-1 ${isSelected ? 'text-slate-300' : 'text-slate-800'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>10 Specialists Available</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctors List for Selected Department with 100% Unique Photos */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                {currentDeptObj?.name?.toUpperCase()} SPECIALISTS ({departmentDoctors.length})
              </h3>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                10 Unique Specialists Dedicated to {currentDeptObj?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departmentDoctors.map((doc) => {
                const isSelected = selectedDoctor === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc.id);
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                      isSelected
                        ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doc.id);
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/doctors/indian_doc_m1.jpg';
                        }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-slate-900 m-0 group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                            ★ {doc.rating}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-500 m-0 font-medium">Exp: {doc.experience} • Fee: ₹{doc.fee}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 flex items-center space-x-0.5">
                        <span>Select</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'}`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
            >
              <span>Next: Select Date & Time Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: Date & Slot Picker */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 m-0">2. Select Consultation Date & Time Slot</h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Doctor: <strong className="text-slate-900">{activeDocObj.name}</strong> ({activeDocObj.specialty})</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2">Select Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2">Select Time Slot *</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      time === slot
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
            >
              <span>Next: Review & Proceed to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Payment Options Trigger */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 m-0">3. Review Appointment & OPD Fee</h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Please review your booking details before proceeding to payment checkout.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
              <img
                src={activeDocObj.avatar}
                alt={activeDocObj.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/doctors/indian_doc_m1.jpg';
                }}
              />
              <div>
                <h4 className="text-base font-black text-slate-900 m-0">{activeDocObj.name}</h4>
                <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5">{activeDocObj.specialty}</p>
                <p className="text-[11px] text-slate-500 m-0">Experience: {activeDocObj.experience} • Rating: ★ {activeDocObj.rating}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-slate-500 block">Date & Time:</span>
                <span className="font-extrabold text-slate-900">{date} at {time}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Consultation Fee:</span>
                <span className="font-black text-slate-900 text-sm">₹{activeDocObj.fee}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Reason for Visit / Symptoms (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Fever, chest pain, routine health checkup..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
            >
              Back
            </button>

            <button
              onClick={handleOpenPaymentModal}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Multiple Payment Options (₹{activeDocObj.fee})</span>
            </button>
          </div>
        </div>
      )}

      {/* Multiple Payment Options Gateway Checkout Modal */}
      {isPayModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-xl p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl relative">
            
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isPaymentConfirmed ? (
              <div className="space-y-6">
                
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center space-x-1 bg-slate-100 text-slate-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-300 mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>256-Bit Encrypted Payment Checkout</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 m-0">Pay OPD Consultation Fee</h3>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">Doctor: <strong>{activeDocObj.name}</strong> • Total Payable: <strong className="text-slate-900 text-base font-black">₹{activeDocObj.fee}</strong></p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">Select Preferred Payment Method</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'UPI QR Code', label: 'Instant UPI QR Code', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                      { id: 'Credit / Debit Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay, Maestro' },
                      { id: 'Net Banking', label: 'Net Banking', icon: Building, desc: 'HDFC, ICICI, SBI, Axis, Kotak' },
                      { id: 'Wallets & PayLater', label: 'Mobile Wallets', icon: Wallet, desc: 'Paytm Wallet, Amazon Pay, LazyPay' }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'bg-slate-100 border-slate-900 shadow-sm ring-1 ring-slate-900'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                            <span className="text-xs font-extrabold text-slate-900">{pm.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 m-0">{pm.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {paymentMethod === 'UPI QR Code' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-slate-700">Scan & Pay via any UPI App</span>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=clinicos@icici&pn=ClinicOS%20Hospital&am=${activeDocObj.fee}`}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 mx-auto"
                      />
                    </div>
                    <div className="text-xs text-slate-600 font-bold">
                      UPI ID: <span className="font-mono text-slate-900 font-black">clinicos@icici</span> • Amount: ₹{activeDocObj.fee}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Auto-Generates Official Receipt</span>
                  
                  <button
                    onClick={handleCompletePaymentAndBook}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>✓ Payment Done / I Have Paid</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Appointment Confirmed & Paid!</h3>
                  <p className="text-xs text-slate-500 mt-1">Transaction ID: <strong className="text-slate-900 font-mono">{bookingTxnId}</strong></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2 font-medium">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-extrabold text-slate-900">{activeDocObj.name} ({activeDocObj.specialty})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-extrabold text-slate-900">{date} at {time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Method:</span>
                    <span className="font-extrabold text-slate-900">{paymentMethod}</span>
                  </div>
                </div>

                <button
                  onClick={handleRedirectToConfirmation}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Official Booking Confirmation & Token Receipt</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
