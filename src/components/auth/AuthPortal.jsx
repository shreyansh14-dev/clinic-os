import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Mail,
  Phone,
  Stethoscope,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Database,
  KeyRound,
  Video,
  FileText,
  Clock,
  Calendar
} from 'lucide-react';

export const AuthPortal = () => {
  const { loginUser, registerUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  // Form State
  const [email, setEmail] = useState('patient@clinicos.com');
  const [password, setPassword] = useState('patient123');
  const [name, setName] = useState('');
  const [age, setAge] = useState('29');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 3 Core Supported Roles
  const rolesList = [
    { id: 'patient', label: 'Patient Portal', desc: 'Book OPD, EMR, Vitals & Real-Time Telemedicine Call', icon: User, color: 'text-orange-600 bg-orange-50', demoEmail: 'patient@clinicos.com' },
    { id: 'doctor', label: 'Doctor Console', desc: 'Patient Queue, Digital Rx & Telehealth Suite', icon: Stethoscope, color: 'text-blue-600 bg-blue-50', demoEmail: 'doctor@clinicos.com' },
    { id: 'admin', label: 'Hospital Admin', desc: 'Financial Ledger, Ward Beds & Roster Control', icon: Building2, color: 'text-purple-600 bg-purple-50', demoEmail: 'admin@clinicos.com' }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setSuccessMsg('');
    const found = rolesList.find(r => r.id === roleId);
    if (found && !isSignUp) {
      setEmail(found.demoEmail);
      setPassword(`${roleId}123`);
    }
  };

  const parsedAge = parseInt(age, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (selectedRole === 'patient') {
        if (!age || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
          throw new Error('Please enter a valid age (1 to 120).');
        }
      }

      if (isSignUp) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required registration fields');
        }
        await registerUser({
          name,
          email,
          password,
          role: selectedRole,
          age: selectedRole === 'patient' ? parsedAge : null,
          phone,
          specialty: selectedRole === 'doctor' ? (specialty || 'General Medicine') : null
        });
        setSuccessMsg('Registration successful! Entering workspace...');
      } else {
        if (!email || !password) {
          throw new Error('Please enter email and password');
        }
        await loginUser(email, password, selectedRole, selectedRole === 'patient' ? parsedAge : null);
        setSuccessMsg('Session authenticated successfully.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden font-sans text-slate-900">
      
      {/* Top Header Navbar */}
      <header className="bg-white text-slate-900 py-4 px-8 shadow-sm flex items-center justify-between z-10 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-600/30">
            C
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 m-0">
              ClinicOS
            </h1>
            <p className="text-xs text-orange-600 m-0 font-bold">Smart Healthcare Management System</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700">
          <Database className="w-3.5 h-3.5 text-orange-600" />
          <span>Database Engine: <strong className="text-slate-900 font-mono">SQLite (clinic.db)</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Features Highlight Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Centralized Digital Healthcare Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight m-0">
              Smart Clinical Operations & Telehealth
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Digitize patient records, schedule appointments, issue digital prescriptions, and conduct real-time video consultations.
            </p>
          </div>

          {/* Key Feature Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2.5">
              <Video className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-slate-800">Real WebRTC Video</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-800">Digital Rx & EMR</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">OPD Appointments</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">Role-Based Access</span>
            </div>
          </div>

          {/* Role Cards List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Workspace Role</label>
            <div className="space-y-2">
              {rolesList.map((r) => {
                const IconComp = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 border-orange-600 text-white font-bold shadow-lg shadow-orange-600/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : r.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold">{r.label}</div>
                        <div className={`text-[11px] font-normal ${isSelected ? 'text-orange-100' : 'text-slate-500'}`}>{r.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative text-slate-900">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 m-0">
                {isSignUp ? 'Create Account' : 'System Login'}
              </h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Active Workspace: <strong className="text-orange-600 uppercase font-mono">{selectedRole}</strong>
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                  !isSignUp ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${
                  isSignUp ? 'bg-orange-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Legal Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shreyansh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* AGE INPUT FOR PATIENT */}
            {selectedRole === 'patient' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age (Years) *</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="Enter patient age (e.g. 29 or 75)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={`${selectedRole}@clinicos.com`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                {selectedRole === 'doctor' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialty / Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiology"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {!isSignUp && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                  <span>Seed Credentials:</span>
                </div>
                <span className="font-mono bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded border border-orange-200 font-bold">
                  {email} / {password}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-600/30 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer border-none"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating against Database...</span>
              ) : (
                <>
                  <span>{isSignUp ? `Register & Enter Workspace` : `Sign In as ${selectedRole.toUpperCase()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="px-8 py-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        ClinicOS Smart Healthcare Management System • Node.js + Express.js • SQLite Database Engine
      </footer>
    </div>
  );
};
