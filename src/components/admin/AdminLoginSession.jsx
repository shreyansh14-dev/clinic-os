import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Stethoscope,
  User,
  Copy,
  Check
} from 'lucide-react';

export const AdminLoginSession = () => {
  const { currentUser, setCurrentRole, logoutUser, showToast, addAuditLog } = useApp();
  const navigate = useNavigate();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const sessionToken = 'clinicos_sec_tok_' + (currentUser?.id || 'admin') + '_8f99a32c7b';

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(sessionToken);
    setCopiedToken(true);
    showToast('Admin session token copied to clipboard.');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    addAuditLog(`Admin 2FA Security status updated: ${next ? 'ENABLED' : 'DISABLED'}`, 'Hospital Admin', 'WARN');
    showToast(`Two-Factor Authentication (2FA) is now ${next ? 'Enabled' : 'Disabled'}.`);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockPassword === 'admin123' || unlockPassword === '123456' || unlockPassword === 'admin') {
      setIsLocked(false);
      setIsLockModalOpen(false);
      setUnlockPassword('');
      showToast('Console unlocked successfully.');
      addAuditLog('Admin Console unlocked via master credentials', 'Hospital Admin');
    } else {
      showToast('Invalid admin password. Try "admin123".', 'danger');
    }
  };

  const loginHistory = [
    { id: 1, timestamp: 'Today, 06:14 PM', ip: '192.168.1.100', device: 'Chrome 128 / Windows 11', location: 'Mumbai, MH', status: 'Success (Current)' },
    { id: 2, timestamp: 'Today, 09:30 AM', ip: '192.168.1.100', device: 'Chrome 128 / Windows 11', location: 'Mumbai, MH', status: 'Success' },
    { id: 3, timestamp: 'Yesterday, 08:45 PM', ip: '192.168.1.102', device: 'Safari 17 / iPad Pro', location: 'Mumbai, MH', status: 'Success' },
    { id: 4, timestamp: '06 Oct 2026, 11:20 AM', ip: '103.21.54.19', device: 'Firefox 130 / macOS', location: 'Navi Mumbai', status: 'Verified 2FA' },
  ];

  if (isLocked) {
    return (
      <div className="bg-white rounded-[32px] border border-purple-200 shadow-xl p-10 max-w-md mx-auto text-center space-y-6 my-10 doc-anim-enter">
        <div className="w-16 h-16 rounded-3xl bg-[#5F2EEA] text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
          <Lock className="w-8 h-8 text-[#E9DF70]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 m-0">Admin Terminal Locked</h3>
          <p className="text-xs text-slate-500 mt-1">
            Session is protected. Enter master administrative password to resume.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            placeholder="Enter master password (admin123)"
            value={unlockPassword}
            onChange={(e) => setUnlockPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
          >
            Unlock Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Top Banner: Active Authentication Status */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5F2EEA] to-[#804dfa] text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#E9DF70]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  AUTHENTICATED · 1
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  Tier 1 Super Administrator
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 m-0">
                Hospital Authority Login &amp; Cryptographic Session
              </h3>
              <p className="text-xs text-slate-500 max-w-xl m-0">
                Active root credentials for ClinicOS Healthcare Management Platform. Authenticated with 256-bit AES session token and ISO 27001 medical compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsLocked(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Terminal</span>
            </button>
            <button
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* 3 Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* Card 1: Session Token */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#5F2EEA]" />
                Active Session Token
              </span>
              <button
                onClick={handleCopyToken}
                className="text-[10px] font-black text-[#5F2EEA] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedToken ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 truncate font-semibold">
              {sessionToken}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Cryptographically signed via HMAC-SHA256
            </span>
          </div>

          {/* Card 2: 2FA Security Control */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Two-Factor Auth (2FA)
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  twoFactorEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {twoFactorEnabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700">Hardware / App OTP</span>
              <button
                onClick={handleToggle2FA}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-none ${
                  twoFactorEnabled
                    ? 'bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700'
                    : 'bg-[#5F2EEA] text-white hover:bg-[#4318B4]'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Protects medical clearances and billing modifications
            </span>
          </div>

          {/* Card 3: Session Expiry Policy */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Inactivity Auto-Lock
              </span>
              <span className="text-[10px] font-bold text-slate-400">HIPAA Standard</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {['15m', '30m', '1h', '8h'].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSessionTimeout(time);
                    showToast(`Session auto-lock set to ${time}`);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-black border cursor-pointer transition-all ${
                    sessionTimeout === time
                      ? 'bg-[#16163B] text-white border-[#16163B]'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Auto locks admin console when unattended
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher Shortcuts & Authentication Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Role Switcher */}
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#5F2EEA]" />
            <h4 className="text-sm font-black text-slate-900 m-0">Cross-Portal Access</h4>
          </div>
          <p className="text-xs text-slate-500 m-0">
            Admins have master clearance to switch between Doctor Workspace and Patient Portal for operational inspections.
          </p>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                setCurrentRole('doctor');
                navigate('/doctor-console');
                showToast('Switched to Doctor Workspace.');
              }}
              className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-left flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-slate-900 block group-hover:text-purple-700">
                    Switch to Doctor Console
                  </strong>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Clinical EMR, Prescriptions, Telehealth
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-purple-700">Enter &rarr;</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('patient');
                navigate('/');
                showToast('Switched to Patient Portal.');
              }}
              className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-left flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-black text-slate-900 block group-hover:text-emerald-700">
                    Switch to Patient Portal
                  </strong>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Appointments, Labs, Pharmacy, Records
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700">Enter &rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Login Audit Trail */}
        <div className="lg:col-span-2 bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900 m-0">Recent Admin Sign-Ins</h4>
                <span className="text-[11px] text-slate-400">Terminal IP &amp; Geolocation tracking</span>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Zero Unauthorized Breaches
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Timestamp</th>
                  <th className="py-2.5 px-3.5">Terminal IP</th>
                  <th className="py-2.5 px-3.5">Browser &amp; OS</th>
                  <th className="py-2.5 px-3.5">Location</th>
                  <th className="py-2.5 px-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loginHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-800">{item.timestamp}</td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600">{item.ip}</td>
                    <td className="py-3 px-3.5 text-slate-600">{item.device}</td>
                    <td className="py-3 px-3.5 text-slate-600">{item.location}</td>
                    <td className="py-3 px-3.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
