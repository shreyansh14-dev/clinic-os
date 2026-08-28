import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Video,
  Siren,
  Heart,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Droplet,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  FlaskConical,
  Activity,
  ArrowRight,
  PhoneCall,
  Plus,
  Home,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SeniorPatientDashboard = () => {
  const {
    currentUser,
    activePatient,
    appointments,
    vitals,
    medsSchedule,
    toggleMedication,
    showToast,
    updatePatientAge
  } = useApp();

  const navigate = useNavigate();
  const patientAge = currentUser?.age || activePatient?.age || 74;

  // Senior Medicine Checklist State
  const [seniorMeds, setSeniorMeds] = useState([
    { id: 'm1', name: 'Telmisartan 40mg', purpose: 'Blood Pressure Control', time: '08:00 AM (Morning)', taken: true, takenTime: '8:15 AM', instruction: 'Take with warm water after breakfast' },
    { id: 'm2', name: 'Metformin 500mg', purpose: 'Blood Sugar Regulation', time: '08:00 AM (Morning)', taken: true, takenTime: '8:20 AM', instruction: 'Take after breakfast' },
    { id: 'm3', name: 'Calcium + Vitamin D3', purpose: 'Bone & Joint Strength', time: '01:30 PM (Afternoon)', taken: false, takenTime: null, instruction: 'Take after lunch' },
    { id: 'm4', name: 'Atorvastatin 10mg', purpose: 'Cholesterol & Heart Protection', time: '09:00 PM (Night)', taken: false, takenTime: null, instruction: 'Take before sleep' }
  ]);

  // Water Tracker
  const [waterGlasses, setWaterGlasses] = useState(5);

  // Audio Read-Aloud Voice Assistant Simulation
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTakePill = (id) => {
    setSeniorMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken;
        if (nextState) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
          showToast(`✓ Great job! Marked ${m.name} as taken.`);
        }
        return { ...m, taken: nextState, takenTime: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null };
      }
      return m;
    }));
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = `Hello ${activePatient?.name || 'Sir'}. Today is a good day. You have 2 medicines scheduled for afternoon and night. Your blood pressure is normal at 122 over 82. Press the red button if you need an emergency ambulance.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Voice read-aloud not supported in this browser.', 'info');
    }
  };

  const latestVital = vitals[0] || { bpSystolic: 122, bpDiastolic: 82, heartRate: 72, spo2: 99, glucose: 98 };
  const nextAppointment = appointments[0] || {
    doctorName: 'Dr. Arjun Sharma',
    specialty: 'Senior Cardiologist',
    date: 'Tomorrow',
    time: '11:00 AM',
    type: 'Video Consultation'
  };

  return (
    <div className="space-y-8 pb-20 font-sans text-slate-900 max-w-6xl mx-auto px-4">
      
      {/* ── Senior Welcome Header Banner ── */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-2 border-orange-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black tracking-wide shadow-sm">
              <Heart className="w-4 h-4 fill-white" />
              <span>SENIOR CARE MODE ACTIVE (AGE {patientAge} &gt; 70)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight m-0">
              Good Morning, {activePatient?.name || 'Shreyansh'}! ☀️
            </h1>
            <p className="text-base text-slate-700 font-medium m-0">
              Here is your simple daily health overview. Everything is set up for easy 1-touch use.
            </p>
          </div>

          {/* Voice Read-Aloud */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReadAloud}
              className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border cursor-pointer shadow-sm transition-all ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Volume2 className="w-5 h-5 text-orange-600" />
              <span>{isSpeaking ? 'Listening (Tap to Stop)' : '🔊 Read Aloud'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 1. HIGH-PRIORITY EMERGENCY & 1-TOUCH ASSISTANCE ROW ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 m-0">
          <Siren className="w-5 h-5 text-rose-600" />
          <span>Quick Assistance & Emergency (1-Touch)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 108 Emergency Ambulance Button */}
          <button
            onClick={() => navigate('/emergency-sos')}
            className="p-5 bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 text-white rounded-3xl shadow-lg shadow-rose-600/30 flex items-center justify-between text-left border-none cursor-pointer group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-rose-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Siren className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <div className="text-lg font-black leading-tight">108 Emergency SOS</div>
                <div className="text-xs text-rose-100 mt-1 font-semibold">Dispatch ICU Ambulance to Home</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Call Primary Doctor 1-Touch */}
          <button
            onClick={() => navigate('/video-call')}
            className="p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-3xl shadow-lg shadow-blue-600/30 flex items-center justify-between text-left border-none cursor-pointer group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <div className="text-lg font-black leading-tight">Call My Doctor</div>
                <div className="text-xs text-blue-100 mt-1 font-semibold">Start Instant Video Consultation</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Call Family Caregiver / Helpline */}
          <button
            onClick={() => {
              showToast('Calling Family Caregiver (+91 98765 00000)...');
              window.open('tel:+919876500000');
            }}
            className="p-5 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-3xl shadow-lg shadow-emerald-600/30 flex items-center justify-between text-left border-none cursor-pointer group active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <div className="text-lg font-black leading-tight">Call Family Caregiver</div>
                <div className="text-xs text-emerald-100 mt-1 font-semibold">+91 98765 00000 (Son / Daughter)</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </section>

      {/* ── 2. DAILY MEDICINE & PILL SCHEDULE (BIG ACCESSIBLE CHECKLIST) ── */}
      <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 m-0">Today's Medicine Schedule</h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Large font checklist. Tap the button after taking each pill.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/my-meds')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Full Prescription</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pill Cards */}
        <div className="space-y-3.5">
          {seniorMeds.map((med) => (
            <div
              key={med.id}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                med.taken
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                  med.taken ? 'bg-emerald-600 text-white' : 'bg-orange-100 text-orange-700 font-black'
                }`}>
                  {med.taken ? <Check className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{med.name}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {med.time}
                    </span>
                    {med.taken && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        ✓ Taken at {med.takenTime}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-600">{med.purpose}</div>
                  <div className="text-xs text-orange-700 font-bold">💡 {med.instruction}</div>
                </div>
              </div>

              {/* Action Check Button */}
              <button
                onClick={() => handleTakePill(med.id)}
                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm transition-all flex-shrink-0 ${
                  med.taken
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30 shadow-md'
                }`}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed ✓</span>
                  </>
                ) : (
                  <>
                    <Pill className="w-5 h-5" />
                    <span>I Took This Pill</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. OVERSIZED HEALTH VITALS MONITOR (CLEAR & HIGH CONTRAST) ── */}
      <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 m-0">My Health Vitals (Senior Monitor)</h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Updated today. All readings are stable.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/health-tracker')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
          >
            Full Health Log
          </button>
        </div>

        {/* 4 Oversized Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-rose-50/70 border-2 border-rose-200 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase">
              <span>Blood Pressure</span>
              <Heart className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {latestVital.bpSystolic}/{latestVital.bpDiastolic} <span className="text-sm font-bold text-slate-500">mmHg</span>
            </div>
            <div className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              ✓ Good & Normal
            </div>
          </div>

          <div className="p-5 bg-blue-50/70 border-2 border-blue-200 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase">
              <span>Heart Rate</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {latestVital.heartRate || 72} <span className="text-sm font-bold text-slate-500">BPM</span>
            </div>
            <div className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              ✓ Calm & Steady
            </div>
          </div>

          <div className="p-5 bg-purple-50/70 border-2 border-purple-200 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-700 uppercase">
              <span>Blood Sugar (Fasting)</span>
              <FlaskConical className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {latestVital.glucose || 98} <span className="text-sm font-bold text-slate-500">mg/dL</span>
            </div>
            <div className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              ✓ Normal Range
            </div>
          </div>

          <div className="p-5 bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase">
              <span>Oxygen (SpO2)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {latestVital.spo2 || 99}% <span className="text-sm font-bold text-slate-500">Level</span>
            </div>
            <div className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              ✓ Excellent
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. DOCTOR VISITS & HOME CARE SERVICES ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Appointment Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-black text-slate-900 m-0">Upcoming Doctor Consultation</h3>
            </div>
            <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">Confirmed</span>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Doctor"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200"
            />
            <div className="space-y-1">
              <div className="text-base font-black text-slate-900">{nextAppointment.doctorName}</div>
              <div className="text-xs font-bold text-orange-600">{nextAppointment.specialty}</div>
              <div className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                <span>📅 {nextAppointment.date}</span>
                <span>⏰ {nextAppointment.time}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/video-call')}
              className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer border-none flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Join Video Call</span>
            </button>
            <button
              onClick={() => navigate('/book-appointment')}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 cursor-pointer"
            >
              Reschedule
            </button>
          </div>
        </div>

        {/* Home Care & Blood Test at Home */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Home className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900 m-0">Elder Doorstep & Home Services</h3>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => navigate('/lab-tests')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Blood Test Sample at Home</div>
                  <div className="text-xs text-slate-500">Phlebotomist visits your doorstep</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div
              onClick={() => {
                showToast('Attendant Request Sent! Our care manager will call you in 5 minutes.');
              }}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Request Home Attendant / Nurse</div>
                  <div className="text-xs text-slate-500">Assisted daily living and mobility support</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Daily Hydration Helper */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplet className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-xs font-black text-slate-900">Daily Water Reminder</div>
                <div className="text-xs text-slate-600 font-semibold">{waterGlasses} of 8 glasses drank today</div>
              </div>
            </div>
            <button
              onClick={() => {
                setWaterGlasses(prev => Math.min(8, prev + 1));
                showToast('+1 Glass logged! Stay hydrated 💧');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl border-none cursor-pointer hover:bg-blue-500 shadow-sm"
            >
              + Add Glass
            </button>
          </div>
        </div>

      </section>

      {/* ── 5. SENIOR HELPLINE FOOTNOTE ── */}
      <div className="p-5 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black">24/7 Dedicated Senior Citizen Care Desk</div>
            <div className="text-xs text-slate-300">Toll-Free Hospital Helpline: <strong>1800-200-SENIOR (1800-200-7364)</strong></div>
          </div>
        </div>

        <button
          onClick={() => window.open('tel:18002007364')}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-xl border-none cursor-pointer self-start sm:self-auto shadow"
        >
          Call Helpdesk Now
        </button>
      </div>

    </div>
  );
};
