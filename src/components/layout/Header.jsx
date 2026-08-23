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
  Clock
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
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-xl shadow-md">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 m-0 font-heading">ClinicOS</h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-900 px-2 py-0.5 rounded-full border border-slate-300">
                SMART HOSPITAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium m-0">Digital Healthcare Platform & EMR Network</p>
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
