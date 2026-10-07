import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export const Header = () => {
  const {
    currentRole,
    setCurrentRole,
    activePatient,
    activeDoctor,
    logoutUser,
    incomingCallAlert,
    showToast
  } = useApp();
  const logout = logoutUser;

  const navigate = useNavigate();
  const location = useLocation();

  // Role Authentication Security Modal State
  const [authTargetRole, setAuthTargetRole] = useState(null); // 'doctor' | 'admin'
  const [rolePassword, setRolePassword] = useState('');
  const [authError, setAuthError] = useState('');

  // 108 Emergency SOS Dispatch Modal State
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosLocation, setSosLocation] = useState('Flat 402, Sunshine Heights, Bandra West, Mumbai');
  const [sosPhone, setSosPhone] = useState('+91 91234 56789');
  const [sosDispatched, setSosDispatched] = useState(false);

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
        avatar: activeDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
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
      
      {/* Incoming WebRTC Video Call Alert */}
      {incomingCallAlert && currentRole === 'doctor' && (
        <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="font-black text-sm">INCOMING TELEHEALTH CALL: </span>
              <span className="text-xs text-slate-300">Patient <strong>{incomingCallAlert.callerName}</strong> requesting Video Consultation ({incomingCallAlert.symptoms})</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/doctor-console')}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center space-x-1"
          >
            <Video className="w-4 h-4" />
            <span>Accept & Join Call</span>
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-6 py-3.5 flex items-center justify-between bg-white border-b border-slate-200">
        
        {/* Patient Consumer Header (when currentRole === 'patient') */}
        {currentRole === 'patient' ? (
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/25">
                C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 leading-none font-heading">ClinicOS</span>
                  <span className="text-[10px] font-black tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200">
                    SMART HOSPITAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium m-0 leading-none mt-1">Digital Healthcare Platform & EMR Network</p>
              </div>
            </div>

            {/* Center: Consumer Healthcare Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
              <button
                onClick={() => navigate('/book-appointment')}
                className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
              >
                Find Doctors
              </button>

              {/* Appointments Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
                >
                  <span>Appointments</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <button
                    onClick={() => navigate('/book-appointment')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <CalendarPlus className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Book Appointment</span>
                  </button>
                  <button
                    onClick={() => navigate('/my-appointments')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <CalendarCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>My Appointments</span>
                  </button>
                </div>
              </div>

              {/* Lab Tests Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
                >
                  <span>Lab Tests</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <button
                    onClick={() => navigate('/lab-tests')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <FlaskConical className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Lab Tests at Home</span>
                  </button>
                  <button
                    onClick={() => navigate('/diagnostic-tests')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <TestTube2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>My Lab Reports</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate('/medical-records')}
                className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
              >
                Medical Records
              </button>

              {/* Health Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
                >
                  <span>Health</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <button
                    onClick={() => navigate('/health-tracker')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Health Vitals Log</span>
                  </button>
                  <button
                    onClick={() => navigate('/my-meds')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Pill className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Meds Schedule</span>
                  </button>
                  <button
                    onClick={() => navigate('/vaccines')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Syringe className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Vaccine Passport</span>
                  </button>
                </div>
              </div>

              {/* More Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 font-bold text-xs"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <button
                    onClick={() => navigate('/bills')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Receipt className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Bills & Receipts</span>
                  </button>
                  <button
                    onClick={() => navigate('/insurance-claims')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Insurance Claims</span>
                  </button>
                  <button
                    onClick={() => navigate('/video-call')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Telehealth</span>
                  </button>
                  <button
                    onClick={() => navigate('/symptom-assistant')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Health Articles</span>
                  </button>
                </div>
              </div>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Location Picker */}
              <div className="relative group hidden sm:block">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Mumbai</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Search Icon Trigger */}
              <button
                type="button"
                onClick={() => navigate('/book-appointment')}
                title="Search Doctors & Specialties"
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer bg-white transition-all"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* 108 SOS Ambulance Trigger Button */}
              <button
                onClick={() => {
                  setSosDispatched(false);
                  setIsSosModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF2E70] to-[#FF453A] hover:opacity-95 text-white font-black text-xs rounded-full shadow-xs flex items-center gap-1.5 border-none cursor-pointer whitespace-nowrap transition-transform hover:scale-105"
              >
                <Siren className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>108 SOS Ambulance</span>
              </button>

              {/* Patient Portal Badge / Switcher */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Patient Portal</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {/* Switch to Doctor or Admin Portal */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">Switch Portal</div>
                  <button
                    onClick={() => handleRoleSwitchClick('doctor')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                    <span>Doctor Console</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitchClick('admin')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none text-left"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Hospital Admin</span>
                  </button>
                </div>
              </div>

              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => showToast('No new notifications')}
                className="relative p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer border-none bg-transparent"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 border border-white" />
              </button>

              {/* Profile Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="relative cursor-pointer group">
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-2xs"
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
        ) : (
          /* Clinical Staff Header (Doctor & Admin) */
          <div className="w-full flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/25">
                C
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-black tracking-tight text-slate-900 m-0 font-heading">ClinicOS</h1>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#E8F1FD] text-[#1E62DC] px-2 py-0.5 rounded-full border border-[#D0E2FB]">
                    SMART HOSPITAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium m-0">Digital Healthcare Platform & EMR Network</p>
              </div>
            </div>

            {/* Search Bar & 108 SOS Dispatch Trigger Button */}
            <div className="hidden md:flex items-center space-x-3 flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search doctors, clinics, specialties..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={() => {
                  setSosDispatched(false);
                  setIsSosModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center space-x-1.5 whitespace-nowrap border-none cursor-pointer"
              >
                <Siren className="w-4 h-4 text-white animate-pulse" />
                <span>108 SOS Ambulance</span>
              </button>
            </div>

            {/* Role Switcher Pills & Profile */}
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center space-x-1 text-xs font-bold">
                <button
                  onClick={() => handleRoleSwitchClick('patient')}
                  className={`px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 ${
                    currentRole === 'patient'
                      ? 'bg-slate-900 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient Portal</span>
                </button>

                <button
                  onClick={() => handleRoleSwitchClick('doctor')}
                  className={`px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 ${
                    currentRole === 'doctor'
                      ? 'bg-slate-900 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Console</span>
                </button>

                <button
                  onClick={() => handleRoleSwitchClick('admin')}
                  className={`px-3 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center space-x-1.5 ${
                    currentRole === 'admin'
                      ? 'bg-slate-900 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Admin</span>
                </button>
              </div>

              <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 relative border-none bg-transparent cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-slate-900 absolute top-2 right-2 border border-white"></span>
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <img src={userInfo.avatar} alt={userInfo.name} className="w-9 h-9 rounded-full object-cover border border-slate-300" />
                <div className="hidden lg:block">
                  <div className="text-xs font-black text-slate-900 m-0">{userInfo.name}</div>
                  <div className="text-[9px] font-black text-slate-700 tracking-wider m-0">{userInfo.sub}</div>
                </div>

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

    </header>
  );
};
