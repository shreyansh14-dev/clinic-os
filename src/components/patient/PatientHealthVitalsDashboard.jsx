import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Heart, Activity, Droplet, Moon, Zap, Watch, ShieldCheck,
  CheckCircle2, Circle, Clock, Flame, Pill, Plus, ArrowRight,
  TrendingUp, RefreshCw, Smartphone, Bluetooth, BatteryCharging
} from 'lucide-react';

export const PatientHealthVitalsDashboard = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [deviceBattery, setDeviceBattery] = useState(88);

  // Local interactive medication scheduling
  const [meds, setMeds] = useState([
    {
      id: 'm1',
      name: 'Metformin 500mg',
      dosage: '1 Tablet',
      instructions: 'After Breakfast',
      timeSlot: 'Morning',
      time: '08:00 AM',
      taken: true,
      takenAt: '08:15 AM',
      type: 'Sugar Control'
    },
    {
      id: 'm2',
      name: 'Vitamin D3 60,000 IU',
      dosage: '1 Capsule',
      instructions: 'With milk / breakfast',
      timeSlot: 'Morning',
      time: '08:00 AM',
      taken: true,
      takenAt: '08:15 AM',
      type: 'Bone & Immunity'
    },
    {
      id: 'm3',
      name: 'Omega-3 Fish Oil 1000mg',
      dosage: '1 Softgel',
      instructions: 'After Lunch',
      timeSlot: 'Afternoon',
      time: '01:30 PM',
      taken: true,
      takenAt: '01:45 PM',
      type: 'Heart & Joints'
    },
    {
      id: 'm4',
      name: 'Telmisartan 40mg',
      dosage: '1 Tablet',
      instructions: 'Before Dinner with water',
      timeSlot: 'Evening',
      time: '07:30 PM',
      taken: false,
      takenAt: null,
      type: 'Blood Pressure'
    },
    {
      id: 'm5',
      name: 'Atorvastatin 10mg',
      dosage: '1 Tablet',
      instructions: 'Before Bedtime',
      timeSlot: 'Night',
      time: '10:00 PM',
      taken: false,
      takenAt: null,
      type: 'Lipid Care'
    }
  ]);

  const handleToggleMed = (id) => {
    setMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken;
        if (nextState) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          showToast(`Marked ${m.name} as taken! Great adherence.`);
          return { ...m, taken: true, takenAt: nowStr };
        } else {
          showToast(`Marked ${m.name} as pending.`);
          return { ...m, taken: false, takenAt: null };
        }
      }
      return m;
    }));
  };

  const handleSyncDevices = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      setDeviceBattery(89);
      showToast('Smartwatch synced! Received 24 biometric data points.');
    }, 1200);
  };

  const takenCount = meds.filter(m => m.taken).length;
  const adherencePct = Math.round((takenCount / meds.length) * 100);

  return (
    <section className="w-full px-6 sm:px-10 pb-14 font-sans">
      <div className="rounded-[36px] bg-gradient-to-br from-[#0E1528] via-[#141C35] to-[#161D36] text-white p-6 sm:p-10 shadow-2xl border border-white/10">
        
        {/* ── TOP HEADER & LIVE TELEMETRY BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE BIOMETRIC TELEMETRY &amp; MEDICINE HUB</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white m-0 tracking-tight font-['Poppins']">
              Patient Health Vitals &amp; Device Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium m-0 mt-1">
              Synchronized with Apple Watch Ultra 2 • Continuous glucose, ECG &amp; daily prescription adherence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncDevices}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#E9DF70]' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Wearable'}</span>
            </button>

            <button
              onClick={() => navigate('/health-tracker')}
              className="px-5 py-2.5 rounded-full bg-[#E9DF70] hover:bg-[#F3E980] active:scale-95 text-[#16163B] text-xs font-extrabold flex items-center gap-2 border-none transition-all cursor-pointer font-['Poppins'] shadow-md"
            >
              <span>Full Health Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 4 CORE HEALTH STATUS METRICS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
          
          {/* Card 1: Heart Rate & ECG */}
          <div className="rounded-[26px] bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-5 flex flex-col justify-between transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">Heart Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Poppins']">72</span>
                  <span className="text-xs text-slate-400 font-bold">BPM</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
            </div>

            {/* Simulated Live ECG waveform */}
            <div className="my-3 py-1">
              <svg viewBox="0 0 100 24" className="w-full h-7 stroke-rose-400 fill-none" strokeWidth="2">
                <path d="M 0 12 L 20 12 L 25 12 L 28 4 L 32 20 L 36 2 L 40 18 L 43 12 L 70 12 L 74 6 L 78 18 L 82 12 L 100 12" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-2 border-t border-white/10">
              <span className="text-emerald-400">● Normal Sinus Rhythm</span>
              <span>HRV 64ms</span>
            </div>
          </div>

          {/* Card 2: Blood Pressure & SpO2 */}
          <div className="rounded-[26px] bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-5 flex flex-col justify-between transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Blood Pressure</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Poppins']">118/78</span>
                  <span className="text-xs text-slate-400 font-bold">mmHg</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Blood Oxygen (SpO2)</span>
                <span className="text-emerald-400 font-extrabold">99%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-2 border-t border-white/10">
              <span className="text-emerald-400">● Optimal Range</span>
              <span>Arterial Elastic</span>
            </div>
          </div>

          {/* Card 3: Blood Sugar / Glucose */}
          <div className="rounded-[26px] bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-5 flex flex-col justify-between transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Fasting Glucose</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Poppins']">96</span>
                  <span className="text-xs text-slate-400 font-bold">mg/dL</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Droplet className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="my-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Estimated HbA1c</span>
                <span className="text-[#E9DF70] font-extrabold">5.4%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E9DF70] rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-2 border-t border-white/10">
              <span className="text-emerald-400">● Non-Diabetic Safe</span>
              <span>Post-Meal: 124</span>
            </div>
          </div>

          {/* Card 4: Overall Health Score */}
          <div className="rounded-[26px] bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-5 flex flex-col justify-between transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#E9DF70] uppercase tracking-wider">Overall Vitality</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-[#E9DF70] font-['Poppins']">94</span>
                  <span className="text-xs text-slate-400 font-bold">/ 100</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#E9DF70]/20 text-[#E9DF70] flex items-center justify-center border border-[#E9DF70]/30">
                <ShieldCheck className="w-5 h-5 text-[#E9DF70]" />
              </div>
            </div>

            <div className="my-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-slate-300 font-semibold m-0 leading-tight">
                Top 5% health quartile for your age group (29 Yrs)
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pt-2 border-t border-white/10">
              <span className="text-emerald-400">● +3.2% This Week</span>
              <span>All 8 Vitals Stable</span>
            </div>
          </div>

        </div>

        {/* ── TWO-COLUMN WORKBENCH: SMARTWATCH STATS & MEDICINE SCHEDULING ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          
          {/* ── LEFT: PAIRED SMARTWATCH LIVE STATS (5 Cols) ── */}
          <div className="lg:col-span-5 rounded-[30px] bg-white/[0.04] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              
              {/* Wearable Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-md">
                    <Watch className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white m-0 font-['Poppins']">
                      Apple Watch Ultra 2
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected (Bluetooth 5.3)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-slate-200">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{deviceBattery}%</span>
                </div>
              </div>

              {/* Smartwatch Metrics 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                
                {/* Metric 1: Steps */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Daily Steps</span>
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-['Poppins']">
                    8,432 <span className="text-[11px] text-slate-400 font-medium">/ 10k</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-amber-300 rounded-full" style={{ width: '84%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">6.2 km • 84% Completed</span>
                </div>

                {/* Metric 2: Active Calories */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Active Energy</span>
                    <Zap className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-['Poppins']">
                    542 <span className="text-[11px] text-slate-400 font-medium">kcal</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '83%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Goal: 650 kcal</span>
                </div>

                {/* Metric 3: Sleep Analysis */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Sleep Score</span>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-['Poppins']">
                    7h 48m <span className="text-[11px] text-indigo-300 font-bold">(88%)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-tight">
                    Deep: 2h 15m • REM: 1h 45m
                  </span>
                </div>

                {/* Metric 4: Stress & Temp */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Stress Index</span>
                    <span className="text-emerald-400 text-xs font-black">19/100</span>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-400 font-['Poppins']">
                    Relaxed
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Skin Temp: 36.6°C Normal</span>
                </div>

              </div>

            </div>

            {/* Smartwatch Footer Actions */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Last updated: <strong className="text-white">{lastSyncTime}</strong>
              </span>
              <button
                onClick={() => showToast('Synced with Apple Health & Google Fit cloud!')}
                className="text-xs font-bold text-[#E9DF70] hover:text-[#F3E980] flex items-center gap-1.5 bg-transparent border-none cursor-pointer transition-colors"
              >
                <span>Export Health Data</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ── RIGHT: MEDICINE SCHEDULING TIMELINE (7 Cols) ── */}
          <div className="lg:col-span-7 rounded-[30px] bg-white/[0.04] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              
              {/* Medicine Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white m-0 font-['Poppins']">
                      Daily Medicine Schedule
                    </h4>
                    <span className="text-[11px] text-slate-300 font-medium">
                      Doctor-prescribed daily schedule • Real-time patient compliance
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                    {takenCount} of {meds.length} Taken ({adherencePct}%)
                  </div>
                </div>
              </div>

              {/* Medicine Interactive List */}
              <div className="space-y-3 mt-5">
                {meds.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => handleToggleMed(med.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      med.taken
                        ? 'bg-emerald-500/[0.08] border-emerald-500/30'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={med.taken ? 'text-emerald-400' : 'text-slate-500'}>
                        {med.taken ? (
                          <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-[#0E1528]" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-400 hover:text-white" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className={`text-sm font-extrabold m-0 ${med.taken ? 'text-slate-300 line-through' : 'text-white'}`}>
                            {med.name}
                          </h5>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-slate-300">
                            {med.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
                          {med.dosage} • {med.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{med.time}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold block mt-0.5 ${med.taken ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {med.taken ? `Taken at ${med.takenAt}` : 'Due Soon • Tap to take'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Medicine Footer Actions */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="text-amber-400 font-bold">🔥 14-Day Perfect Streak!</span>
                <span>• Telmisartan refill: 4 doses left</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Opening prescription refill request...');
                    navigate('/my-meds');
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                >
                  Order Refill
                </button>
                <button
                  onClick={() => navigate('/my-meds')}
                  className="px-4 py-1.5 rounded-full bg-[#E9DF70] hover:bg-[#F3E980] text-[#16163B] text-xs font-black border-none transition-all cursor-pointer"
                >
                  Manage All Meds
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
