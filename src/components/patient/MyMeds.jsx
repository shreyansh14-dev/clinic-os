import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Pill,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Sparkles,
  Calendar,
  TrendingUp,
  Droplets,
  ShoppingCart,
  ShieldCheck,
  Check,
  X,
  ChevronRight,
  Trash2,
  ExternalLink,
  FileText,
  HeartPulse,
  Sun,
  Sunrise,
  Moon,
  RefreshCw,
  Bell
} from 'lucide-react';

export const MyMeds = () => {
  const {
    medsSchedule,
    toggleMedication,
    addMedication,
    deleteMedication,
    activePatient,
    prescriptions,
    showToast
  } = useApp();

  const navigate = useNavigate();

  const [activeSlotFilter, setActiveSlotFilter] = useState('All'); // 'All' | 'Morning' | 'Afternoon' | 'Night' | 'Pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refillMed, setRefillMed] = useState(null); // Medicine selected for quick refill
  const [waterGlasses, setWaterGlasses] = useState(5);

  // New Medication Form State
  const [formData, setFormData] = useState({
    name: '',
    dose: '1 Tablet',
    timing: 'Morning',
    time: '08:00 AM',
    instructions: 'Take after breakfast',
    purpose: 'General Wellness',
    prescribedBy: 'Dr. Souvik Sinha'
  });

  const takenCount = medsSchedule.filter(m => m.taken).length;
  const totalCount = medsSchedule.length;
  const progressPct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // Filtered meds
  const filteredMeds = medsSchedule.filter(med => {
    const matchesSearch = !searchQuery ||
      med.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.instructions?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeSlotFilter === 'All') return true;
    if (activeSlotFilter === 'Pending') return !med.taken;
    if (activeSlotFilter === 'Completed') return med.taken;
    return med.timing === activeSlotFilter;
  });

  // Next upcoming pending dose
  const nextPendingDose = medsSchedule.find(m => !m.taken);

  // Handle Pill Take Check
  const handleToggle = (med) => {
    const willBeTaken = !med.taken;
    toggleMedication(med.id);
    if (willBeTaken) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`✓ Marked ${med.name} as taken! Great adherence.`);
    } else {
      showToast(`Marked ${med.name} as pending.`);
    }
  };

  // Add Medication Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter the medicine name.', 'warn');
      return;
    }

    addMedication({
      name: formData.name,
      dose: formData.dose,
      dosage: formData.dose,
      timing: formData.timing,
      time: formData.time,
      instructions: formData.instructions,
      purpose: formData.purpose,
      prescribedBy: formData.prescribedBy
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      dose: '1 Tablet',
      timing: 'Morning',
      time: '08:00 AM',
      instructions: 'Take after breakfast',
      purpose: 'General Wellness',
      prescribedBy: 'Dr. Souvik Sinha'
    });
  };

  // Sync with Doctor Prescriptions
  const handleSyncPrescriptions = () => {
    if (!prescriptions || prescriptions.length === 0) {
      showToast('All active doctor prescriptions are already synchronized.', 'info');
      return;
    }

    let addedCount = 0;
    prescriptions.forEach(rx => {
      rx.medications?.forEach(m => {
        const exists = medsSchedule.some(med => med.name.toLowerCase().includes(m.name.toLowerCase()));
        if (!exists) {
          addMedication({
            name: m.name,
            dose: m.dosage || '1 Tablet',
            dosage: m.dosage || '1 Tablet',
            timing: m.instructions?.toLowerCase().includes('night') ? 'Night' : 'Morning',
            time: m.instructions?.toLowerCase().includes('night') ? '09:30 PM' : '08:00 AM',
            instructions: m.instructions || 'As advised by doctor',
            purpose: rx.diagnosis || 'Prescribed Care',
            prescribedBy: rx.doctorName || 'Dr. Souvik Sinha'
          });
          addedCount++;
        }
      });
    });

    if (addedCount > 0) {
      showToast(`✓ Synchronized ${addedCount} medicine(s) from Dr. Souvik Sinha's prescriptions!`);
    } else {
      showToast('Prescriptions already up to date!', 'info');
    }
  };

  // Refill Order Confirmation
  const handleConfirmRefill = () => {
    showToast(`Order Placed! 1-Pack of ${refillMed?.name} is on its way. Delivery in 15 mins via MediCare Express Pharmacy.`);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    setRefillMed(null);
  };

  return (
    <div className="w-full space-y-6 pb-20 font-['Poppins']">

      {/* ── Top Header & Title ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-slate-900 m-0">My Medication Tracker</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              ● Live Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold m-0 mt-1">
            Daily medicine reminders, dose schedules & 1-click pharmacy refills
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSyncPrescriptions}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-all"
            title="Sync latest prescriptions from doctor"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Rx</span>
          </button>

          <button
            onClick={() => navigate('/pharmacy-inventory')}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
            <span>Pharmacy Store</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4.5 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-extrabold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-[#E9DF70]" />
            <span>+ Add Reminder</span>
          </button>
        </div>
      </div>

      {/* ── 4 Quick Stats Adherence Strip ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Compliance Progress */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Daily Compliance
            </span>
            <div className="text-xl font-black text-slate-900">
              {takenCount} of {totalCount} Taken
            </div>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <Check className="w-3.5 h-3.5" />
              {progressPct === 100 ? 'All doses completed!' : `${totalCount - takenCount} dose(s) pending`}
            </span>
          </div>

          <div className="w-14 h-14 rounded-full bg-slate-50 border-4 border-emerald-500 flex items-center justify-center font-black text-sm text-slate-900 shrink-0">
            {progressPct}%
          </div>
        </div>

        {/* Adherence Streak */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-4.5 border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-1">
              Adherence Streak
            </span>
            <div className="text-xl font-black text-slate-900 flex items-center gap-1">
              <span>7 Days</span>
              <span className="text-base">🔥</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 block mt-0.5">
              Gold Health Tier
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Next Due Dose */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Next Due Dose
            </span>
            <div className="text-sm font-black text-slate-900 truncate max-w-[150px]">
              {nextPendingDose ? nextPendingDose.name : 'All Done Today!'}
            </div>
            <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {nextPendingDose ? `${nextPendingDose.time} (${nextPendingDose.timing})` : 'Rest well'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Pharmacy Refill
            </span>
            <div className="text-sm font-black text-slate-900 truncate max-w-[150px]">
              Pantoprazole 40mg
            </div>
            <span className="text-[11px] font-bold text-rose-600 block mt-0.5">
              12 capsules left
            </span>
          </div>
          <button
            onClick={() => setRefillMed(medsSchedule[1] || medsSchedule[0])}
            className="px-3 py-1.5 bg-[#16163B] hover:bg-[#242454] text-white font-extrabold text-[11px] rounded-xl border-none cursor-pointer shrink-0 shadow-xs transition-all hover:scale-105"
          >
            Refill
          </button>
        </div>
      </div>

      {/* ── Daily Water Tracker & Prescription Note ───────────────────── */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl p-4 border border-blue-200/70 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-xs font-black text-slate-900">Hydration with Medications</strong>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {waterGlasses} of 8 Glasses
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold m-0 mt-0.5">
              Drinking adequate warm water assists rapid absorption of oral tablets and protects gastric lining.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end md:self-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(gl => (
            <button
              key={gl}
              onClick={() => {
                setWaterGlasses(gl);
                showToast(`Logged ${gl} glasses of water today.`);
              }}
              className={`w-7 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                gl <= waterGlasses
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-300 border-slate-200 hover:border-blue-400'
              }`}
              title={`Glass ${gl}`}
            >
              <Droplets className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Time Slots & Filter Bar ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Slot Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
          {[
            { id: 'All',        label: 'All Doses',    icon: Pill, count: totalCount },
            { id: 'Morning',    label: 'Morning',      icon: Sunrise, count: medsSchedule.filter(m => m.timing === 'Morning').length },
            { id: 'Afternoon',  label: 'Afternoon',    icon: Sun, count: medsSchedule.filter(m => m.timing === 'Afternoon').length },
            { id: 'Night',      label: 'Night',        icon: Moon, count: medsSchedule.filter(m => m.timing === 'Night').length },
            { id: 'Pending',    label: 'Pending',      icon: AlertCircle, count: totalCount - takenCount },
            { id: 'Completed',  label: 'Taken',        icon: CheckCircle2, count: takenCount },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSlotFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSlotFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap border-none cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E9DF70]' : ''}`} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search medicine, purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* ── Medication List Grid ───────────────────────────────────────── */}
      {filteredMeds.length === 0 ? (
        <div className="bg-white rounded-[28px] p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 m-0">No Medications in This View</h3>
            <p className="text-xs text-slate-500 font-semibold m-0 mt-1 max-w-sm mx-auto">
              {searchQuery ? `No medicines matching "${searchQuery}".` : 'You have no scheduled doses matching this filter.'}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveSlotFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeds.map(med => (
            <div
              key={med.id}
              className={`rounded-[24px] p-5 border transition-all duration-200 shadow-xs flex flex-col justify-between gap-4 ${
                med.taken
                  ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => handleToggle(med)}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all duration-200 shrink-0 ${
                      med.taken
                        ? 'bg-emerald-600 text-white shadow-sm hover:scale-105'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-700'
                    }`}
                    title={med.taken ? 'Mark as Pending' : 'Mark as Taken'}
                  >
                    {med.taken ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-base font-black m-0 ${med.taken ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {med.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                        {med.dose || med.dosage || '1 Tablet'}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 block mt-1">
                      Target: <strong className="text-slate-700">{med.purpose || 'Health Maintenance'}</strong>
                    </span>

                    <p className="text-xs text-slate-600 font-medium m-0 mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{med.instructions}</span>
                    </p>
                  </div>
                </div>

                {/* Timing Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{med.time}</span>
                  </span>
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                    {med.timing}
                  </span>
                </div>
              </div>

              {/* Card Footer: Doctor + Status + Quick Refill */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Prescribed:</span>
                  <span className="text-[11px] text-slate-700 font-extrabold">{med.prescribedBy || 'Dr. Souvik Sinha'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Indicator */}
                  {med.taken ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Taken {med.takenAt ? `@ ${med.takenAt}` : ''}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" /> Pending Dose
                    </span>
                  )}

                  {/* Refill Button */}
                  <button
                    onClick={() => setRefillMed(med)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#16163B] font-extrabold text-[11px] rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1 transition-all"
                    title="Order refill pack"
                  >
                    <ShoppingCart className="w-3 h-3 text-emerald-600" />
                    <span>Refill</span>
                  </button>

                  {/* Delete Option */}
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-lg cursor-pointer border-none bg-transparent transition-colors"
                    title="Remove reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Medication Modal ───────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Add Medication Reminder</h3>
                  <p className="text-[11px] text-slate-500 font-semibold m-0">Synchronize daily dose with your schedule</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Medicine Name & Strength *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telmisartan 40mg or Metformin 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                  >
                    <option value="1 Tablet">1 Tablet</option>
                    <option value="2 Tablets">2 Tablets</option>
                    <option value="1 Capsule">1 Capsule</option>
                    <option value="5 ml Syrup">5 ml Syrup</option>
                    <option value="10 ml Syrup">10 ml Syrup</option>
                    <option value="2 Puffs Inhaler">2 Puffs Inhaler</option>
                    <option value="1 Sachet">1 Sachet</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Health Purpose</label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Pressure, Diabetes"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Meal / Usage Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with warm water after breakfast"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  placeholder="Dr. Souvik Sinha"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#242454]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-extrabold rounded-xl border-none cursor-pointer shadow-sm"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Refill / Pharmacy Order Drawer ───────────────────────── */}
      {refillMed && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 m-0">Express Pharmacy Refill</h3>
              </div>
              <button
                onClick={() => setRefillMed(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-black text-slate-900 m-0">{refillMed.name}</h4>
                  <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                    Strip of 15 Tablets • Genuine Batch
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900">₹85</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">15% Off MRP</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                <span>Delivery Address:</span>
                <strong className="text-slate-800">Flat 402, Bandra West, Mumbai</strong>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-700 font-extrabold">
                <span>Delivery Time:</span>
                <span>⚡ 15 Mins (MediCare Express)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRefillMed(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefill}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-none cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Place Order (₹85)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyMeds;
