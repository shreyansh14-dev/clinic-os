import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  LogOut,
  Stethoscope,
  Siren,
  ShieldCheck,
  User,
  Building2,
  Video,
  PhoneCall,
  X,
  Lock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  ChevronDown,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  FileText,
  FlaskConical,
  TestTube2,
  HeartPulse,
  Pill,
  Syringe,
  Receipt,
  Shield,
  BookOpen,
  Sparkles,
  Tag,
  ShoppingCart,
  Truck,
  Activity,
  Plus
} from 'lucide-react';
import { MEDICINE_CATALOG } from '../../data/medicineCatalog';
import { AmbulanceLiveTrackerModal } from '../patient/AmbulanceLiveTrackerModal';

export const Header = () => {
  const {
    currentRole,
    setCurrentRole,
    activePatient,
    activeDoctor,
    logoutUser,
    incomingCallAlert,
    acceptIncomingCall,
    declineIncomingCall,
    patients,
    appointments,
    showToast,
    pharmacyCart,
    addToPharmacyCart
  } = useApp();
  const logout = logoutUser;

  const navigate = useNavigate();
  const location = useLocation();

  // Doctor Clinical Header State
  const [doctorDutyStatus, setDoctorDutyStatus] = useState('Available');
  const [doctorPatientSearch, setDoctorPatientSearch] = useState('');
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false);

  // Role Authentication Security Modal State
  const [authTargetRole, setAuthTargetRole] = useState(null); // 'doctor' | 'admin'
  const [rolePassword, setRolePassword] = useState('');
  const [authError, setAuthError] = useState('');

  // 108 Emergency SOS Dispatch & Live GPS Tracker Modal State
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAmbulanceTrackerOpen, setIsAmbulanceTrackerOpen] = useState(false);
  const [sosLocation, setSosLocation] = useState('Flat 402, Sunshine Heights, Bandra West, Mumbai');
  const [sosPhone, setSosPhone] = useState('+91 91234 56789');
  const [sosDispatched, setSosDispatched] = useState(false);

  // City Selector & Live Medicine Search Options State
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [medSearchInput, setMedSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [previewMedicine, setPreviewMedicine] = useState(null);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Close search popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // NEVER REDIRECT: Just toggle search dropdown and focus input!
    setIsSearchOpen(prev => !prev);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const cartCount = Object.values(pharmacyCart || {}).reduce((acc, qty) => acc + qty, 0);

  const handleRoleSwitchClick = (targetRole) => {
    if (targetRole === currentRole) return;

    if (currentRole === 'patient' && (targetRole === 'doctor' || targetRole === 'admin')) {
      setAuthTargetRole(targetRole);
      setRolePassword('');
      setAuthError('');
    } else {
      setCurrentRole(targetRole);
      navigate('/');
    }
  };

  const handleAuthorizeRoleSwitch = (e) => {
    e.preventDefault();
    const expectedPassword = authTargetRole === 'doctor' ? 'doctor123' : 'admin123';

    if (rolePassword === expectedPassword || rolePassword === '123456' || rolePassword === 'admin') {
      setCurrentRole(authTargetRole);
      setAuthTargetRole(null);
      showToast(`Authenticated! Switched to ${authTargetRole === 'doctor' ? 'Doctor Console' : 'Hospital Admin'}.`);
      navigate('/');
    } else {
      setAuthError(`Invalid password for ${authTargetRole} portal access. Try 'doctor123' or 'admin123'.`);
    }
  };

  const handleDispatchAmbulance = (e) => {
    e.preventDefault();
    if (!sosLocation.trim() || !sosPhone.trim()) {
      showToast('Please provide location and phone number.', 'warn');
      return;
    }
    setSosDispatched(true);
    showToast('108 Emergency Ambulance Dispatched! Live GPS active.');
  };

  const getActiveUserDisplay = () => {
    if (currentRole === 'doctor') {
      return {
        name: activeDoctor?.name || 'Dr. Souvik Sinha',
        sub: 'SENIOR CARDIOLOGIST',
        avatar: activeDoctor?.avatar || '/images/doctors/indian_doc_m1.jpg'
      };
    }
    if (currentRole === 'admin') {
      return {
        name: 'Hospital Administration Desk',
        sub: 'CHIEF MEDICAL OFFICER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
    }
    return {
      name: activePatient?.name || 'Shreyansh Kumar',
      sub: 'PATIENT ACCOUNT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  };

  const userInfo = getActiveUserDisplay();

  return (
    <header className="header-container relative">
      
      {/* Incoming WebRTC Video Call Top Banner */}
      {incomingCallAlert && (
        <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between animate-pulse z-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="font-black text-sm text-emerald-400">INCOMING PATIENT VIDEO CALL: </span>
              <span className="text-xs text-slate-200">Patient <strong>{incomingCallAlert.callerName}</strong> requesting Video Consultation {incomingCallAlert.symptoms ? `(${incomingCallAlert.symptoms})` : ''}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                acceptIncomingCall();
                setCurrentRole('doctor');
                navigate('/doctor-console');
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span>Accept & Join in Doctor Console</span>
            </button>
            <button
              onClick={() => declineIncomingCall()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Global Doctor Incoming Call Ringing Modal (pops up anywhere in Doctor Workspace) */}
      {incomingCallAlert && currentRole === 'doctor' && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 sm:p-8 max-w-md w-full shadow-2xl border-2 border-emerald-500/50 text-center relative overflow-hidden">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg relative z-10">
                <Video className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              ● Ringing Now · Live Video Consultation
            </span>

            <h3 className="text-xl font-black text-slate-900 m-0">
              {incomingCallAlert.callerName || 'Patient Consultation Request'}
            </h3>
            
            <p className="text-xs text-slate-500 font-semibold m-0 mt-1">
              Patient ID: <strong>{incomingCallAlert.callerId || 'PT-101'}</strong>
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Chief Complaints / Symptoms:
              </span>
              <p className="text-xs font-bold text-slate-800 m-0">
                {incomingCallAlert.symptoms || 'General clinical review & consultation.'}
              </p>
              {incomingCallAlert.invoiceId && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">Consultation Fee:</span>
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paid &amp; Confirmed
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => declineIncomingCall()}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-extrabold text-xs border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                onClick={() => {
                  acceptIncomingCall();
                  setCurrentRole('doctor');
                  navigate('/doctor-console');
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Video className="w-4 h-4 animate-pulse" />
                <span>Accept &amp; Join</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-6 py-3.5 flex items-center justify-between bg-white border-b border-slate-200">
        
        {/* Patient Consumer Header (when currentRole === 'patient') */}
        {currentRole === 'patient' ? (
          <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Brand Logo & Location Selector */}
            <div className="flex items-center gap-3 shrink-0">
              {/* ClinicOS Brand Logo & Title matching reference */}
              <div className="rv-btn flex items-center gap-2.5 cursor-pointer rv-nav-fall" style={{ animationDelay: '0ms' }} onClick={() => navigate('/')}>
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/25 shrink-0">
                  C
                </div>
                <div>
                  <span className="text-xl font-black tracking-[-0.03em] text-slate-900 leading-none block">
                    ClinicOS
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 leading-tight block mt-0.5 hidden sm:block">
                    Smart Healthcare Management System
                  </span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-px bg-slate-200 hidden md:block mx-1" />

              {/* Select Location Dropdown */}
              <div className="relative hidden md:block">
                <div
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="rv-btn flex flex-col text-left cursor-pointer rv-nav-fall py-1 px-2 rounded-xl hover:bg-slate-100 transition-colors select-none"
                  style={{ animationDelay: '60ms' }}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold leading-none">
                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                    <span>Select City</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-1 leading-none">
                    <span>{selectedCity}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* City Selection Dropdown Popover */}
                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 block">
                      Select Delivery City
                    </span>
                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'].map(city => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityDropdownOpen(false);
                            showToast(`Delivery location set to ${city}! 15-Min delivery active.`);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none text-left ${
                            selectedCity === city
                              ? 'bg-[#16163B] text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 opacity-60" />
                            <span>{city}</span>
                          </span>
                          {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-[#E9DF70]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Search Bar with Live Medicine Options Autocomplete Dropdown */}
            <div ref={searchContainerRef} className="relative flex flex-1 max-w-xs sm:max-w-md mx-2 rv-nav-fall" style={{ animationDelay: '90ms' }}>
              <div className="relative w-full flex items-center bg-[#F8FAFC] hover:bg-slate-50 hover:shadow-md border border-slate-200/80 hover:border-[#242454]/30 rounded-full pl-1.5 pr-4 py-1 transition-all duration-300">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="w-7 h-7 rounded-full bg-[#E9DF70] hover:bg-[#ebd54c] flex items-center justify-center text-[#16163B] shrink-0 mr-2.5 shadow-sm cursor-pointer hover:scale-105 transition-transform border-none p-0"
                  title="Search medicines"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search medicines (e.g. Dolo, Pan 40, Telma)..."
                  value={medSearchInput}
                  onChange={(e) => {
                    setMedSearchInput(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setIsSearchOpen(true);
                    } else if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                    }
                  }}
                  className="w-full bg-transparent border-none text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
                />
                {medSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setMedSearchInput('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live Medicine Options Dropdown (In-Place, No Redirects) */}
              {isSearchOpen && (
                <div
                  className="absolute top-full left-0 right-0 sm:-right-20 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-fadeIn"
                  style={{ minWidth: '320px', maxWidth: '480px' }}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                    <div className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Available Medicine Options ({MEDICINE_CATALOG.length}+)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
                    {['All', 'Pain & Fever', 'Acidity', 'Heart & BP', 'Diabetes', 'Antibiotics', 'Vitamins', 'Ayurveda'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSearchCategory(cat)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border-none cursor-pointer shrink-0 transition-colors ${
                          searchCategory === cat
                            ? 'bg-[#16163B] text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Matching Results List */}
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {MEDICINE_CATALOG.filter(m => {
                      const matchesCat = searchCategory === 'All' ||
                        (searchCategory === 'Acidity' && m.category.includes('Acidity')) ||
                        (searchCategory === 'Heart & BP' && m.category.includes('Pressure')) ||
                        (searchCategory === 'Diabetes' && m.category.includes('Diabetes')) ||
                        (searchCategory === 'Pain & Fever' && m.category.includes('Pain')) ||
                        (searchCategory === 'Antibiotics' && m.category.includes('Antibiotics')) ||
                        (searchCategory === 'Vitamins' && m.category.includes('Vitamins')) ||
                        (searchCategory === 'Ayurveda' && m.category.includes('Ayurveda'));

                      const matchesQuery = !medSearchInput ||
                        m.name.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                        m.genericName.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                        m.category.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                        m.manufacturer.toLowerCase().includes(medSearchInput.toLowerCase());

                      return matchesCat && matchesQuery;
                    }).slice(0, 10).map(med => (
                      <div
                        key={med.id}
                        onClick={() => setPreviewMedicine(med)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        title="Click to preview medicine details"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {med.image ? (
                              <img
                                src={med.image}
                                alt={med.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350&auto=format&fit=crop&q=80';
                                }}
                              />
                            ) : (
                              <Pill className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="truncate">
                            <strong className="text-xs font-bold text-slate-900 group-hover:text-blue-600 block leading-tight truncate">
                              {med.name}
                            </strong>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">
                              {med.genericName} • {med.packSize}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-xs font-black text-slate-900">₹{med.price}</span>
                              <span className="text-[9px] text-slate-400 line-through">₹{med.mrp}</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-600 uppercase">
                              {med.discount}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToPharmacyCart(med.id, 1);
                              showToast(`Added ${med.name} to cart!`);
                            }}
                            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#16163B] hover:text-white text-slate-800 text-[10px] font-black cursor-pointer border-none transition-all"
                            title="Add to cart"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                      <Truck className="w-3.5 h-3.5" /> 15-Min Delivery in {selectedCity}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Click medicine to preview
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Navigation Links, Cart, SOS, & Portal Switcher */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              
              {/* Home Link */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rv-btn hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer rv-nav-fall"
                style={{ animationDelay: '120ms' }}
              >
                <span>Home</span>
              </button>

              {/* Healthcare Services Dropdown with "New" Tag */}
              <div className="relative group hidden xl:block rv-nav-fall" style={{ animationDelay: '140ms' }}>
                <div className="flex flex-col items-start cursor-pointer">
                  <span className="px-1 py-0.2 rounded-sm bg-[#FF5510] text-white text-[8px] font-black uppercase tracking-wider mb-0.5">New</span>
                  <button
                    type="button"
                    className="rv-btn flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#1D204E] transition-colors bg-transparent border-none cursor-pointer p-0"
                  >
                    <span>Healthcare Services</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
                  </button>
                </div>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50" style={{ transition: 'opacity 0.2s ease, transform 0.3s cubic-bezier(0.34,1.48,0.64,1)', transform: 'translateY(-4px)', transformOrigin: 'top' }}>
                  <button
                    onClick={() => navigate('/book-appointment')}
                    className="rv-btn w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>In-Clinic Doctors</span>
                  </button>
                  <button
                    onClick={() => navigate('/video-call')}
                    className="rv-btn w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant Telehealth</span>
                  </button>
                  <button
                    onClick={() => navigate('/pathology-worklist')}
                    className="rv-btn w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <FlaskConical className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Home Lab Tests</span>
                  </button>
                </div>
              </div>

              {/* Offer Link */}
              <button
                onClick={() => {
                  showToast('Offer applied: 60% OFF on all Lab Tests & Scans!');
                  navigate('/pathology-worklist');
                }}
                className="rv-btn hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#1D204E] transition-colors bg-transparent border-none cursor-pointer rv-nav-fall"
                style={{ animationDelay: '190ms' }}
              >
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Offer</span>
              </button>

              {/* Cart Button with Live Badge */}
              <button
                onClick={() => navigate('/pharmacy-inventory')}
                className="rv-btn relative inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#1D204E] cursor-pointer transition-colors bg-transparent border-none rv-nav-fall"
                style={{ animationDelay: '230ms' }}
              >
                <div className="relative">
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>

              {/* Login / Portal Switcher Dropdown */}
              <div className="relative group rv-nav-fall" style={{ animationDelay: '270ms' }}>
                <button
                  type="button"
                  className="rv-btn inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#1D204E] cursor-pointer transition-colors bg-transparent border-none"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Login</span>
                </button>
                {/* Switch to Doctor or Admin Portal */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">Switch Portal</div>
                  <button
                    onClick={() => handleRoleSwitchClick('doctor')}
                    className="rv-btn w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                    <span>Doctor Console</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitchClick('admin')}
                    className="rv-btn w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Hospital Admin</span>
                  </button>
                </div>
              </div>

              {/* Profile Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 rv-nav-fall" style={{ animationDelay: '310ms' }}>
                <div className="relative cursor-pointer group rv-btn">
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-sm"
                    style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900">{userInfo.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Patient Account</div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : currentRole === 'doctor' ? (
          /* Dedicated Doctor Clinical Header (Strictly Healthcare Features, Zero Consumer Features) */
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Brand Logo & Clinician Workspace Badge */}
            <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => navigate('/doctor-console')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#16163B] to-[#242454] text-white flex items-center justify-center font-black text-xl shadow-md border border-white/20">
                <Stethoscope className="w-5 h-5 text-[#E9DF70]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-black tracking-tight text-slate-900 m-0 font-heading">ClinicOS</h1>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                    PHYSICIAN WORKSPACE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold m-0">
                  {activeDoctor?.name || 'Dr. Souvik Sinha'} · {activeDoctor?.specialty || 'Senior Consultant Cardiologist'} · OPD Chamber 104
                </p>
              </div>
            </div>

            {/* Center: Clinical EMR Patient Search & Quick Rx Action */}
            <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-lg mx-2 relative">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patient by Name, UHID, Phone, ABHA ID..."
                  value={doctorPatientSearch}
                  onChange={(e) => {
                    setDoctorPatientSearch(e.target.value);
                    setIsDocSearchOpen(true);
                  }}
                  onFocus={() => setIsDocSearchOpen(true)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#16163B] focus:bg-white transition-all font-semibold"
                />

                {/* Instant Patient Search Results Popover */}
                {isDocSearchOpen && doctorPatientSearch.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fadeIn">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patient Records Found</span>
                      <button
                        onClick={() => setIsDocSearchOpen(false)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {(patients || [])
                        .filter(p =>
                          p.name.toLowerCase().includes(doctorPatientSearch.toLowerCase()) ||
                          p.phone.includes(doctorPatientSearch) ||
                          p.id.toLowerCase().includes(doctorPatientSearch.toLowerCase())
                        )
                        .slice(0, 4)
                        .map(p => (
                          <div key={p.id} className="p-2.5 bg-slate-50 hover:bg-purple-50/60 rounded-xl border border-slate-100 flex items-center justify-between text-xs transition-colors">
                            <div>
                              <strong className="text-slate-900 block font-extrabold">{p.name}</strong>
                              <span className="text-[10px] text-slate-500 font-semibold">{p.gender}, {p.age} Yrs · Phone: {p.phone} · UHID: {p.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setIsDocSearchOpen(false);
                                  navigate('/emr-timeline');
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer"
                              >
                                EMR
                              </button>
                              <button
                                onClick={() => {
                                  setIsDocSearchOpen(false);
                                  navigate('/create-prescription');
                                }}
                                className="px-2.5 py-1 bg-[#16163B] hover:bg-[#242454] text-white text-[10px] font-black rounded-lg border-none cursor-pointer"
                              >
                                Write Rx
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/create-prescription')}
                className="px-3.5 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center space-x-1.5 whitespace-nowrap border-none cursor-pointer transition-all hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>New Rx</span>
              </button>
            </div>

            {/* Right: Duty Status Toggle, Role Switcher & Profile */}
            <div className="flex items-center space-x-3 shrink-0">
              {/* Doctor Duty Status Indicator */}
              <button
                onClick={() => {
                  const nextStatus = doctorDutyStatus === 'Available' ? 'In Consultation' : doctorDutyStatus === 'In Consultation' ? 'On Break' : 'Available';
                  setDoctorDutyStatus(nextStatus);
                  showToast(`Physician status updated: ${nextStatus}`);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  doctorDutyStatus === 'Available'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : doctorDutyStatus === 'In Consultation'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Click to toggle consultation availability"
              >
                <span className={`w-2 h-2 rounded-full ${
                  doctorDutyStatus === 'Available' ? 'bg-emerald-500 animate-ping' : doctorDutyStatus === 'In Consultation' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span>{doctorDutyStatus === 'Available' ? 'Online & Available' : doctorDutyStatus}</span>
              </button>

              {/* Today's Queue Badge */}
              <div
                onClick={() => navigate('/doctor-appointments')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-black cursor-pointer hover:bg-blue-100 transition-colors"
                title="View today's consultation queue"
              >
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>OPD Queue: {(appointments || []).length} Today</span>
              </div>

              {/* Role Switcher */}
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1 text-xs font-bold">
                <button
                  onClick={() => handleRoleSwitchClick('patient')}
                  className="px-2.5 py-1 rounded-xl border-none cursor-pointer text-slate-600 hover:text-slate-900 bg-transparent flex items-center space-x-1 font-bold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient</span>
                </button>
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-extrabold flex items-center space-x-1 shadow-xs">
                  <Stethoscope className="w-3.5 h-3.5 text-[#E9DF70]" />
                  <span>Doctor</span>
                </span>
                <button
                  onClick={() => handleRoleSwitchClick('admin')}
                  className="px-2.5 py-1 rounded-xl border-none cursor-pointer text-slate-600 hover:text-slate-900 bg-transparent flex items-center space-x-1 font-bold"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Doctor Avatar & Log Out */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <img
                  src={activeDoctor?.avatar || '/images/doctors/indian_doc_m1.jpg'}
                  alt={activeDoctor?.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-300"
                />
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Hospital Admin Header */
          <div className="w-full flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/admin')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/25">
                C
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-black tracking-tight text-slate-900 m-0 font-heading">ClinicOS</h1>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#E8F1FD] text-[#1E62DC] px-2 py-0.5 rounded-full border border-[#D0E2FB]">
                    HOSPITAL AUTHORITY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium m-0">Administrative Control &amp; Bed Ledger</p>
              </div>
            </div>

            {/* Role Switcher Pills & Profile */}
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1 text-xs font-bold">
                <button
                  onClick={() => handleRoleSwitchClick('patient')}
                  className="px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 bg-transparent"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient Portal</span>
                </button>

                <button
                  onClick={() => handleRoleSwitchClick('doctor')}
                  className="px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 bg-transparent"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Console</span>
                </button>

                <button
                  onClick={() => handleRoleSwitchClick('admin')}
                  className="px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 bg-slate-900 text-white shadow-sm font-extrabold"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Admin</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <img src={userInfo.avatar} alt={userInfo.name} className="w-9 h-9 rounded-full object-cover border border-slate-300" />
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Quick Website Services Navigation Strip for Patients */}
      {currentRole === 'patient' && (
        <div className="bg-[#FAFBFD] border-b border-slate-200/70 px-6 py-2 hidden sm:flex items-center justify-between text-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Kept 15-Min Delivery Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[11px] shrink-0">
              <Truck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>15-Min Delivery in {selectedCity}</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />

            {/* 1. 108 Emergency Ambulance with Live GPS Radar Map */}
            <button
              onClick={() => setIsAmbulanceTrackerOpen(true)}
              className="px-2.5 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 font-black text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs shrink-0 animate-pulse"
              title="Track live 108 ambulance with GPS location detection and route map"
            >
              <Siren className="w-3.5 h-3.5 text-rose-600" />
              <span>🚑 108 Ambulance (Live GPS Map)</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </button>

            {/* 2. Vaccine Center & Registration */}
            <button
              onClick={() => navigate('/vaccine-registration')}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Register and schedule preventive vaccinations"
            >
              <Syringe className="w-3.5 h-3.5 text-blue-500" />
              <span>💉 Vaccine Center &amp; Registration</span>
            </button>

            {/* 3. Patient Health Vitals & Device Hub */}
            <button
              onClick={() => {
                if (location.pathname === '/') {
                  const vitalsEl = document.getElementById('patient-vitals-device-hub');
                  if (vitalsEl) {
                    vitalsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                  }
                }
                navigate('/health-vitals');
              }}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-purple-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Continuous smartwatch vitals, ECG, glucose & daily medicine hub"
            >
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>🩺 Patient Health Vitals &amp; Device Hub</span>
            </button>

            {/* 4. Medicine Store (75+) */}
            <button
              onClick={() => navigate('/medicine-store')}
              className="px-2 py-1 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Browse full catalog of 75+ branded medicines"
            >
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span>💊 Medicine Store (75+)</span>
            </button>

            {/* 5. In-Clinic Doctors */}
            <button
              onClick={() => navigate('/book-appointment')}
              className="px-2 py-1 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Book verified specialist doctors"
            >
              <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
              <span>👨‍⚕️ Book Doctor</span>
            </button>

            {/* 6. Instant Video Consult */}
            <button
              onClick={() => navigate('/video-call')}
              className="px-2 py-1 rounded-lg text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Start instant live video consultation with on-call doctor"
            >
              <Video className="w-3.5 h-3.5 text-cyan-600" />
              <span>📹 Video Consult</span>
            </button>

            {/* 7. Home Lab Tests */}
            <button
              onClick={() => navigate('/lab-tests')}
              className="px-2 py-1 rounded-lg text-slate-700 hover:text-amber-700 hover:bg-amber-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="Book at-home blood tests & diagnostic health checkups"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span>🧪 Lab Tests</span>
            </button>

            {/* 8. Medical Records */}
            <button
              onClick={() => navigate('/medical-records')}
              className="px-2 py-1 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              title="View prescriptions, clinical histories and lab reports"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>📋 Records</span>
            </button>
          </div>

          {/* Right Action: Direct Live Ambulance Radar Shortcut */}
          <div className="flex items-center gap-3 shrink-0 text-[11px] font-semibold pl-2">
            <button
              onClick={() => setIsAmbulanceTrackerOpen(true)}
              className="text-rose-600 hover:text-rose-700 hover:underline font-black bg-transparent border-none cursor-pointer flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-rose-600 animate-spin" />
              <span>Track Live Ambulance (Map) →</span>
            </button>
          </div>
        </div>
      )}


      {/* Role Authentication Modal (Required to switch to Doctor or Admin Portal) */}
      {authTargetRole && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setAuthTargetRole(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAuthorizeRoleSwitch} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 m-0">
                  Staff Authentication Required
                </h3>
                <p className="text-xs text-slate-500 m-0">
                  Please authenticate with staff credentials to enter <strong className="text-slate-900">{authTargetRole === 'doctor' ? 'Doctor Console' : 'Hospital Admin'}</strong>.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200 text-center">
                  {authError}
                </div>
              )}

              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <label className="block">Staff Access Password *</label>
                <input
                  type="password"
                  required
                  placeholder={`Enter password (e.g. ${authTargetRole === 'doctor' ? 'doctor123' : 'admin123'})`}
                  value={rolePassword}
                  onChange={(e) => setRolePassword(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthTargetRole(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer"
                >
                  Authenticate & Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 108 Emergency SOS Ambulance Modal with Location, Phone & Live GPS Tracking */}
      {isSosModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsSosModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!sosDispatched ? (
              <form onSubmit={handleDispatchAmbulance} className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black border border-red-200 mb-2">
                    <Siren className="w-4 h-4 animate-pulse" />
                    <span>24/7 National Emergency SOS Dispatch</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Dispatch 108 ICU Ambulance</h3>
                  <p className="text-xs text-slate-500 m-0 mt-1">Provide emergency location and phone number for immediate driver dispatch.</p>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block mb-1.5 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Current Emergency Location / Landmark Address *</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter exact location (e.g. Flat 402, Sunshine Heights, Bandra West)..."
                      value={sosLocation}
                      onChange={(e) => setSosLocation(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>Emergency Contact Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 Mobile Number"
                      value={sosPhone}
                      onChange={(e) => setSosPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsSosModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer flex items-center space-x-2"
                  >
                    <Siren className="w-4 h-4 animate-pulse" />
                    <span>Confirm 108 ICU Dispatch</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">108 Ambulance En Route!</h3>
                  <p className="text-xs text-slate-500 mt-1">Vehicle: <strong className="text-slate-900">MH-02-AX-1080</strong> • Driver: <strong className="text-slate-900">Ramesh Shinde (+91 98700 11080)</strong></p>
                </div>

                {/* Simulated Live GPS Map */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-black">
                      <Navigation className="w-4 h-4 animate-spin" />
                      <span>LIVE GPS TRACKING ACTIVE</span>
                    </div>
                    <span className="text-blue-400 font-black flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>ETA: 7 Mins</span>
                    </span>
                  </div>

                  <div className="h-32 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="text-center space-y-1 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto animate-bounce">
                        <Siren className="w-5 h-5" />
                      </div>
                      <div className="text-[11px] font-bold text-slate-200">Ambulance Moving Towards: {sosLocation}</div>
                      <div className="text-[10px] text-slate-400">Driver Phone: {sosPhone}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsSosModalOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-md border-none cursor-pointer"
                >
                  Close & Track on Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Medicine Detail Modal (In-Place, No Redirect) */}
      {previewMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  {previewMedicine.category}
                </span>
                <h3 className="text-base font-black text-slate-900 m-0 mt-1">{previewMedicine.name}</h3>
                <span className="text-xs text-slate-500 font-semibold">{previewMedicine.genericName}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedicine(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed m-0">
              {previewMedicine.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Manufacturer:</span>
                <strong className="text-slate-800">{previewMedicine.manufacturer}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Packaging:</span>
                <strong className="text-slate-800">{previewMedicine.packSize}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dosage Advice:</span>
                <strong className="text-slate-800">{previewMedicine.dosage}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-[10px] text-slate-400 line-through">₹{previewMedicine.mrp}</div>
                <div className="text-lg font-black text-[#16163B]">₹{previewMedicine.price}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToPharmacyCart(previewMedicine.id, 1);
                  showToast(`Added ${previewMedicine.name} to cart!`);
                  setPreviewMedicine(null);
                }}
                className="px-5 py-2.5 bg-[#16163B] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl border-none cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 108 Emergency Ambulance Live GPS Location & Radar Map Modal */}
      <AmbulanceLiveTrackerModal
        isOpen={isAmbulanceTrackerOpen}
        onClose={() => setIsAmbulanceTrackerOpen(false)}
        defaultCity={selectedCity}
      />

    </header>
  );
};
