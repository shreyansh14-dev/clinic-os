import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Mail,
  Phone,
  Stethoscope,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { HealthcareIllustration } from './HealthcareIllustration';
import { LoginTransitionOverlay } from './LoginTransitionOverlay';
import { useAvatarExpressions } from './useAvatarExpressions';
import { AnimatedCloudsBackground } from './AnimatedCloudsBackground';

export const AuthPortal = () => {
  const { loginUser, registerUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  // Form State
  const [email, setEmail] = useState('patient@clinicos.com');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState('29');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation Choreography Phases
  const [phase, setPhase] = useState('phase1');
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isOverlayRetracting, setIsOverlayRetracting] = useState(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState(false);

  // Form Field Focus State ('email' | 'password' | 'submit' | null)
  const [focusState, setFocusState] = useState(null);
  const containerRef = useRef(null);

  // Avatar Expression Controller: 60fps RAF eye tracking, randomized blinking, contextual emotion
  const {
    patientBlink,
    doctorBlink,
    nurseBlink,
    eyesClosed,
    gaze,
    faceShift,
    bodyShift,
    isLeaningRight,
    patientExpression,
    doctorExpression,
    nurseExpression,
    roleIntensity
  } = useAvatarExpressions({
    focusState,
    showPassword,
    selectedRole,
    hasError: !!errorMsg,
    isSuccess: isTransitioningToDashboard,
    containerRef
  });

  // Reference Sequence Timing Choreography
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase('phase4');
      return;
    }

    // Phase 1 -> Phase 2: Start purple brand transition at 1.2s
    const t1 = setTimeout(() => {
      setPhase('phase2');
      setIsOverlayActive(true);
      setIsOverlayRetracting(false);
    }, 1200);

    // Phase 2 -> Phase 3: Retract overlay at 2.4s
    const t2 = setTimeout(() => {
      setIsOverlayRetracting(true);
      setPhase('phase3');
    }, 2400);

    // Phase 3 -> Phase 4: Settle into interactive character loop at 3.8s
    const t3 = setTimeout(() => {
      setIsOverlayActive(false);
      setIsOverlayRetracting(false);
      setPhase('phase4');
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Replay brand intro transition on demand
  const handleReplayIntro = () => {
    setPhase('phase2');
    setIsOverlayActive(true);
    setIsOverlayRetracting(false);

    setTimeout(() => {
      setIsOverlayRetracting(true);
      setPhase('phase3');
    }, 1200);

    setTimeout(() => {
      setIsOverlayActive(false);
      setIsOverlayRetracting(false);
      setPhase('phase4');
    }, 2400);
  };

  // Role Configurations
  const roles = [
    {
      id: 'patient',
      label: 'Patient',
      portalTitle: 'Patient Portal',
      desc: 'Book OPD, view EMR, check vitals & join telemedicine calls.',
      icon: User,
      demoEmail: 'patient@clinicos.com',
      demoPass: 'patient123',
      btnLabel: 'Sign in as Patient',
      accentColor: '#FF5510'
    },
    {
      id: 'doctor',
      label: 'Doctor',
      portalTitle: 'Doctor Console',
      desc: 'Patient queue, digital Rx, lab test reviews & telehealth suite.',
      icon: Stethoscope,
      demoEmail: 'doctor@clinicos.com',
      demoPass: 'doctor123',
      btnLabel: 'Sign in as Doctor',
      accentColor: '#6320EE'
    },
    {
      id: 'admin',
      label: 'Hospital Admin',
      portalTitle: 'Hospital Admin',
      desc: 'Financial ledger, ward bed allocation & hospital roster control.',
      icon: Building2,
      demoEmail: 'admin@clinicos.com',
      demoPass: 'admin123',
      btnLabel: 'Sign in as Hospital Admin',
      accentColor: '#0F172A'
    }
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setSuccessMsg('');
    const target = roles.find((r) => r.id === roleId);
    if (target && !isSignUp) {
      setEmail(target.demoEmail);
      setPassword(target.demoPass);
    }
  };

  const parsedAge = parseInt(age, 10);

  // Submit Handler with Phase 6 Transition Sequence
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (selectedRole === 'patient' && isSignUp) {
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

        // Trigger Phase 6 Login Submission Animation
        setIsTransitioningToDashboard(true);

        // Allow 550ms for smooth scale & opacity transition into dashboard
        await new Promise((resolve) => setTimeout(resolve, 550));

        await loginUser(
          email,
          password,
          selectedRole,
          selectedRole === 'patient' ? (parsedAge || 29) : null
        );
      }
    } catch (err) {
      setIsTransitioningToDashboard(false);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      setIsTransitioningToDashboard(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await loginUser(currentRoleConfig.demoEmail, currentRoleConfig.demoPass, selectedRole, 29);
    } catch (err) {
      setIsTransitioningToDashboard(false);
      setErrorMsg('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans text-slate-900 overflow-y-auto selection:bg-orange-500 selection:text-white">
      {/* Dreamy Animated Clouds Background */}
      <AnimatedCloudsBackground />

      {/* PHASE 2 & 3: Full-Screen Purple Brand Transition Overlay */}
      <LoginTransitionOverlay
        isActive={isOverlayActive}
        isRetracting={isOverlayRetracting}
      />

      {/* Main Floating Authentication Card Container */}
      <div
        ref={containerRef}
        className={`max-w-[1100px] w-full bg-white rounded-[32px] shadow-[0_24px_70px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.02)] border border-slate-100/90 overflow-hidden flex flex-col lg:flex-row relative z-10 my-auto transition-all duration-700 ease-out ${
          isTransitioningToDashboard
            ? 'scale-[1.03] opacity-0 pointer-events-none'
            : 'scale-100 opacity-100'
        }`}
      >
        {/* ======================================================== */}
        {/* LEFT PANEL: ANIMATED HEALTHCARE MASCOTS & HERO (58%)     */}
        {/* ======================================================== */}
        <div className="lg:w-[58%] w-full bg-[#FAFBFD] relative flex items-stretch overflow-hidden select-none">
          <HealthcareIllustration
            patientExpression={patientExpression}
            doctorExpression={doctorExpression}
            nurseExpression={nurseExpression}
            patientBlink={patientBlink}
            doctorBlink={doctorBlink}
            nurseBlink={nurseBlink}
            eyesClosed={eyesClosed}
            gaze={gaze}
            faceShift={faceShift}
            bodyShift={bodyShift}
            isLeaningRight={isLeaningRight}
            roleIntensity={roleIntensity}
            selectedRole={selectedRole}
            phase={phase}
          />
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: INTERACTIVE LOGIN FORM (42%)                */}
        {/* ======================================================== */}
        <div className="lg:w-[42%] w-full bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 relative">
          
          {/* Top Status Indicator & Intro Replay */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handleReplayIntro}
              title="Replay brand transition animation"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Intro</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2FBF6] border border-emerald-100 text-xs text-slate-600 font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mt-1">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {isSignUp ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-1 font-heading">
              {isSignUp ? (
                'Join ClinicOS'
              ) : (
                <>
                  Sign in to <span className="text-[#5F2EEA]">ClinicOS</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 m-0 font-medium">
              {isSignUp
                ? 'Register to access state-of-the-art clinical workflows.'
                : 'Access your workspace and continue providing better care.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Switcher ("Continue as") with Animated Sliding Indicator */}
          <div className="mt-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Continue as
            </label>
            <div className="relative grid grid-cols-3 gap-2 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
              {roles.map((r) => {
                const IconComp = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4F0FF] text-[#5F2EEA] border border-[#5F2EEA]/40 shadow-xs ring-1 ring-[#5F2EEA]/20'
                        : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/60 border border-transparent font-semibold'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Role Description Banner + Integrated Patient Age Selector */}
            <div className="p-3 bg-orange-50/70 border border-orange-100/90 rounded-2xl flex items-center justify-between transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <currentRoleConfig.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {currentRoleConfig.portalTitle}
                    </span>
                    {/* User-editable Patient Age Input */}
                    {selectedRole === 'patient' && (
                      <div className="inline-flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-orange-200/90 shadow-2xs">
                        <label htmlFor="patient-age-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer">
                          Age:
                        </label>
                        <input
                          id="patient-age-input"
                          type="number"
                          min="1"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="29"
                          aria-label="Patient Age"
                          className="w-12 text-center text-xs font-black text-orange-600 bg-orange-50/80 border border-orange-200 rounded-md py-0.5 px-1 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all font-heading"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                    {currentRoleConfig.desc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {/* Direct Patient Age Field */}
            {selectedRole === 'patient' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Age *
                </label>
                <div className="relative">
                  <span className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-xs select-none">
                    #
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-medium font-heading"
                  />
                </div>
              </div>
            )}
            {/* Optional Registration Name */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shreyansh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={`${selectedRole}@clinicos.com`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusState('email')}
                  onBlur={() => setFocusState(null)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert(`Password reset link simulated for ${email}`)}
                    className="text-xs text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusState('password')}
                  onBlur={() => setFocusState(null)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Optional Registration Details */}
            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                {selectedRole === 'doctor' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiology"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Remember Me */}
            {!isSignUp && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setFocusState('submit')}
              onMouseLeave={() => setFocusState(null)}
              className="w-full py-3 bg-[#1e222e] hover:bg-[#12151d] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? 'Create Account'
                      : currentRoleConfig.btnLabel}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider & Social Login */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[11px] text-slate-400 font-medium uppercase absolute">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 bg-white hover:bg-slate-50 active:scale-[0.99] border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.13z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Toggle */}
          <div className="text-center text-xs text-slate-500 mt-4">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-slate-900 hover:underline cursor-pointer border-none bg-transparent p-0"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-slate-900 hover:underline cursor-pointer border-none bg-transparent p-0"
                >
                  Sign up
                </button>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
