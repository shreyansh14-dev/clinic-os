import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Lock, Mail, Phone, Stethoscope, Shield, ArrowRight, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { loginUser, registerUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const rolesList = [
    { id: 'patient', label: 'Patient Portal', icon: User, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { id: 'doctor', label: 'Doctor Console', icon: Stethoscope, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'nurse', label: 'Nurse Station', icon: Shield, color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
    { id: 'pharmacy', label: 'Pharmacy LIS', icon: User, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { id: 'pathology', label: 'Pathology Lab', icon: User, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { id: 'admin', label: 'Hospital Admin', icon: Shield, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' }
  ];

  const quickDemoProfiles = {
    patient: { email: 'patient@clinicos.com', password: 'patient123' },
    doctor: { email: 'doctor@clinicos.com', password: 'doctor123' },
    nurse: { email: 'nurse@clinicos.com', password: 'nurse123' },
    pharmacy: { email: 'pharmacy@clinicos.com', password: 'pharmacy123' },
    pathology: { email: 'pathology@clinicos.com', password: 'pathology123' },
    admin: { email: 'admin@clinicos.com', password: 'admin123' }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    if (quickDemoProfiles[roleId]) {
      setEmail(quickDemoProfiles[roleId].email);
      setPassword(quickDemoProfiles[roleId].password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields');
        }
        await registerUser({ name, email, password, role: selectedRole, phone });
      } else {
        if (!email || !password) {
          throw new Error('Please enter email and password');
        }
        await loginUser(email, password, selectedRole);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Stethoscope className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">ClinicOS Smart Medical Portal</h2>
              <p className="text-xs text-teal-100">Secure Hospital Management & EHR Authentication</p>
            </div>
          </div>
          
          {/* Auth Tab Switcher */}
          <div className="flex bg-teal-800/40 p-1 rounded-xl mt-4 border border-teal-500/30">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-teal-800 shadow-md' : 'text-teal-100 hover:text-white'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isSignUp ? 'bg-white text-teal-800 shadow-md' : 'text-teal-100 hover:text-white'
              }`}
            >
              New Patient / Staff Registration
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Select Portal Workspace Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {rolesList.map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/80 text-teal-900 ring-2 ring-teal-500/20 font-semibold'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Doe or Patient Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@clinicos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Quick Demo Credentials Info */}
          {!isSignUp && (
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-teal-800">
              <span>Demo Login for {selectedRole.toUpperCase()}:</span>
              <span className="font-mono bg-teal-100/80 px-2 py-0.5 rounded text-teal-900 font-semibold">
                {quickDemoProfiles[selectedRole]?.email}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:from-teal-700 hover:to-cyan-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Hospital Account' : 'Authenticate & Enter Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
