import React from 'react';
import {
  Video,
  FileText,
  Calendar,
  Shield,
  Activity,
  ArrowRight,
  User,
  Stethoscope,
  Clock,
  Lock,
  Building2
} from 'lucide-react';
import { AnimatedPatient } from './characters/AnimatedPatient';
import { AnimatedDoctor } from './characters/AnimatedDoctor';
import { AnimatedNurse } from './characters/AnimatedNurse';

/**
 * HealthcareIllustration
 * Left-side hero canvas featuring:
 * - Brand heading & 4 feature badges
 * - Floating "Today's Care" live stats card
 * - Living Animated SVG healthcare character system (Patient, Doctor, Nurse)
 * - 60fps Gaze tracking, closed-eyes on password toggle, and email lean movements
 * - Frosted glass trust bar
 */
export const HealthcareIllustration = ({
  patientExpression = 'idle',
  doctorExpression = 'idle',
  nurseExpression = 'idle',
  patientBlink = false,
  doctorBlink = false,
  nurseBlink = false,
  eyesClosed = false,
  gaze = { x: 0, y: 0 },
  faceShift = { x: 0, y: 0 },
  bodyShift = { x: 0, y: 0, rot: 0 },
  isLeaningRight = false,
  roleIntensity = { patient: 1.0, doctor: 0.85, nurse: 0.8 },
  selectedRole = 'patient',
  roleBounce = { role: null, bounceId: 0 },
  phase = 'phase4', // 'phase1' | 'phase2' | 'phase3' | 'phase4'
  className = ''
}) => {
  const isSettled = phase === 'phase4';

  return (
    <div className={`h-full w-full bg-[#FAFBFD] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden select-none ${className}`}>
      
      {/* Background Subtle Clinic Room Vector Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.45]">
        {/* Soft Window Glow on Left */}
        <div className="absolute top-16 left-0 w-24 h-48 bg-gradient-to-r from-blue-100/50 to-transparent rounded-r-3xl" />
        {/* Subtle Clinic Medical Wall Cross */}
        <div className="absolute top-44 right-14 opacity-25">
          <div className="w-10 h-3 bg-slate-300/80 rounded-sm mx-auto" />
          <div className="w-3 h-10 bg-slate-300/80 rounded-sm -mt-6.5 mx-auto" />
        </div>
        {/* Plant / Shelf Accent Shape */}
        <div className="absolute top-36 left-8 opacity-20">
          <div className="w-8 h-8 rounded-full bg-emerald-400" />
          <div className="w-12 h-2 bg-slate-400 rounded-full mt-2" />
        </div>
      </div>

      {/* Top Header & Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/25">
            C
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 tracking-tight leading-none">
              ClinicOS
            </div>
            <div className="text-[11px] font-semibold text-slate-400 mt-1">
              Smart Healthcare Management System
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mt-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-black text-slate-900 tracking-tight leading-[1.12] m-0 font-heading">
            One Platform.<br />
            Every <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">Care Journey.</span>
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-sm m-0 font-normal">
            Connected care for patients, clinicians, and hospitals. From appointments to telehealth, EMR to operations.
          </p>
        </div>

        {/* 4 Feature Pills in a Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 max-w-md mt-5">
          {/* 1. Telehealth Consultations */}
          <div className="flex flex-col items-center text-center group cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-orange-100/70 text-orange-600 flex items-center justify-center mb-1 shadow-2xs transition-transform group-hover:scale-105">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Telehealth<br />Consultations
            </span>
          </div>

          {/* 2. Digital Rx & EMR */}
          <div className="flex flex-col items-center text-center group cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-1 shadow-2xs transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Digital Rx<br />& EMR
            </span>
          </div>

          {/* 3. OPD Appointments */}
          <div className="flex flex-col items-center text-center group cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-1 shadow-2xs transition-transform group-hover:scale-105">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              OPD<br />Appointments
            </span>
          </div>

          {/* 4. Role-Based Access */}
          <div className="flex flex-col items-center text-center group cursor-default">
            <div className="w-11 h-11 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center mb-1 shadow-2xs transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              Role-Based<br />Access
            </span>
          </div>
        </div>
      </div>

      {/* Middle/Bottom Illustration Stage with Floating Card & Characters */}
      <div className="relative mt-2 sm:mt-4 w-full flex-1 flex flex-col justify-end min-h-[260px]">
        
        {/* Floating "Today's Care" Stats Widget */}
        <div
          className="absolute right-0 top-0 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_28px_rgba(15,23,42,0.08)] border border-slate-100/90 p-3 sm:p-3.5 min-w-[170px] sm:min-w-[185px] transition-transform duration-500"
          style={{
            transform: 'rotate(-3deg)'
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-800">Today's Care</span>
            {/* Orange ECG Wave matching reference image */}
            <svg width="34" height="18" viewBox="0 0 34 18" fill="none" className="shrink-0">
              <path
                d="M 1 9 L 7 9 L 11 2 L 15 16 L 19 6 L 22 11 L 25 9 L 33 9"
                stroke="#FF5510"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-bold text-slate-900">128</span>
              <span className="text-[11px] text-slate-500">Patients</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-bold text-slate-900">42</span>
              <span className="text-[11px] text-slate-500">Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-slate-900">18</span>
              <span className="text-[11px] text-slate-500">Telehealth Calls</span>
            </div>
          </div>
        </div>

        {/* Mascot Characters Stage (Grounded baseline with dynamic cursor motion) */}
        <div className="relative w-full flex items-end justify-between px-2 sm:px-4 pb-2">
          {/* 1. Purple Doctor (Middle / Background) */}
          <div className="absolute left-[38%] -bottom-1 w-[38%] max-w-[170px] transition-all duration-100 ease-out">
            <AnimatedDoctor
              expression={doctorExpression}
              isBlinking={doctorBlink}
              eyesClosed={eyesClosed}
              gaze={gaze}
              faceShift={faceShift}
              bodyShift={bodyShift}
              isLeaningRight={isLeaningRight}
              intensity={roleIntensity.doctor}
              isRoleActive={selectedRole === 'doctor'}
              isSettled={isSettled}
              isBouncing={roleBounce?.role === 'doctor'}
              bounceId={roleBounce?.role === 'doctor' ? roleBounce.bounceId : 0}
            />
          </div>

          {/* 2. Orange Patient (Front / Foreground / Largest) */}
          <div className="relative -left-2 sm:-left-3 -bottom-1 w-[46%] max-w-[190px] transition-all duration-100 ease-out">
            <AnimatedPatient
              expression={patientExpression}
              isBlinking={patientBlink}
              eyesClosed={eyesClosed}
              gaze={gaze}
              faceShift={faceShift}
              bodyShift={bodyShift}
              intensity={roleIntensity.patient}
              isRoleActive={selectedRole === 'patient'}
              isSettled={isSettled}
              isBouncing={roleBounce?.role === 'patient'}
              bounceId={roleBounce?.role === 'patient' ? roleBounce.bounceId : 0}
            />
          </div>

          {/* 3. Yellow Nurse (Right) */}
          <div className="relative -right-1 sm:-right-2 -bottom-1 w-[36%] max-w-[155px] transition-all duration-100 ease-out">
            <AnimatedNurse
              expression={nurseExpression}
              isBlinking={nurseBlink}
              eyesClosed={eyesClosed}
              gaze={gaze}
              faceShift={faceShift}
              bodyShift={bodyShift}
              intensity={roleIntensity.nurse}
              isRoleActive={selectedRole === 'admin'}
              isSettled={isSettled}
              isBouncing={roleBounce?.role === 'admin'}
              bounceId={roleBounce?.role === 'admin' ? roleBounce.bounceId : 0}
            />
          </div>
        </div>

        {/* Frosted Glass Trust Bar at Bottom */}
        <div className="backdrop-blur-md bg-white/80 border border-white/90 rounded-2xl py-2 px-3 sm:px-4 shadow-xs flex items-center justify-between text-[11px] text-slate-700 font-semibold z-30 mt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>24/7 Telehealth</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Secure & Encrypted</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Trusted by Hospitals</span>
          </div>
        </div>

      </div>

    </div>
  );
};
