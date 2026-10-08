import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bed,
  User,
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export const DoctorIPDRounds = () => {
  const { beds, activeDoctor, updateBedStatus, showToast } = useApp();

  const [selectedWard, setSelectedWard] = useState('All');
  const [roundNotes, setRoundNotes] = useState({});
  const [activeNoteBedId, setActiveNoteBedId] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  // Sample admitted patient clinical records
  const admittedPatientData = {
    'bed-1': {
      patientName: 'Ramesh Patel',
      age: 58,
      gender: 'Male',
      uhid: 'UHID-2026-8819',
      admissionDate: '2026-10-04 (Day 4)',
      diagnosis: 'Acute Coronary Syndrome (Post-PTCA Monitoring)',
      consultant: activeDoctor?.name || 'Dr. Souvik Sinha',
      vitals: { bp: '128/82', pulse: '76 bpm', spo2: '98%', temp: '98.4°F' },
      diet: 'Low Sodium, Cardiac Diet',
      dischargeReadiness: 'Pending Troponin-I & Echo check'
    },
    'bed-2': {
      patientName: 'Sunita Sharma',
      age: 46,
      gender: 'Female',
      uhid: 'UHID-2026-7734',
      admissionDate: '2026-10-06 (Day 2)',
      diagnosis: 'Severe Pneumonia with Bronchospasm',
      consultant: activeDoctor?.name || 'Dr. Souvik Sinha',
      vitals: { bp: '118/74', pulse: '84 bpm', spo2: '96% on 2L O2', temp: '99.1°F' },
      diet: 'Soft High-Protein Diet',
      dischargeReadiness: 'Oxygen weaning in progress'
    },
    'bed-3': {
      patientName: 'Vikram Joshi',
      age: 64,
      gender: 'Male',
      uhid: 'UHID-2026-9021',
      admissionDate: '2026-10-02 (Day 6)',
      diagnosis: 'Congestive Heart Failure (Decompensated)',
      consultant: activeDoctor?.name || 'Dr. Souvik Sinha',
      vitals: { bp: '134/86', pulse: '72 bpm', spo2: '97%', temp: '98.6°F' },
      diet: 'Fluid Restriction 1.2L/day',
      dischargeReadiness: 'Cleared for Discharge Tomorrow'
    }
  };

  const wards = ['All', 'ICU', 'Cardiac Care Unit (CCU)', 'General Ward', 'Deluxe Private'];

  const filteredBeds = beds.filter(b => {
    if (selectedWard === 'All') return true;
    return b.ward?.toLowerCase().includes(selectedWard.toLowerCase()) || b.type?.toLowerCase().includes(selectedWard.toLowerCase());
  });

  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const totalBeds = beds.length;

  const handleSaveRoundNote = (bedId) => {
    if (!noteInput.trim()) return;
    setRoundNotes(prev => ({
      ...prev,
      [bedId]: [
        ...(prev[bedId] || []),
        {
          id: Date.now(),
          doctor: activeDoctor?.name || 'Dr. Souvik Sinha',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().substring(0, 10),
          text: noteInput
        }
      ]
    }));
    setNoteInput('');
    setActiveNoteBedId(null);
    showToast('Ward round progress note saved to patient clinical record!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 font-['Poppins']">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] rounded-[32px] p-7 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[11px] font-black uppercase tracking-wider">
              Inpatient Care · IPD Ward Rounds
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Chamber OPD &amp; Bedside Roster
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
            Ward Rounds &amp; Inpatient Roster
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1 max-w-xl">
            Monitor admitted inpatients, evaluate daily bedside vitals, record clinical round progress notes and review discharge clearance.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-[#E9DF70]">{occupiedBeds}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Admitted Inpatients</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-2xl font-black text-white">{totalBeds - occupiedBeds}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Available Beds</div>
          </div>
        </div>
      </div>

      {/* Ward Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ward Filter:
          </span>
          {wards.map(w => (
            <button
              key={w}
              onClick={() => setSelectedWard(w)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-none cursor-pointer transition-all ${
                selectedWard === w
                  ? 'bg-[#16163B] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing {filteredBeds.length} IPD Beds
        </div>
      </div>

      {/* Admitted Patients In-Depth Roster */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 m-0 flex items-center gap-2">
          <Bed className="w-5 h-5 text-purple-600" />
          <span>Active Admitted Inpatients Under Care</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filteredBeds.map(bed => {
            const extraData = admittedPatientData[bed.id] || {
              patientName: bed.patientName || 'Vacant / Prepared for Admission',
              age: 50,
              gender: 'Adult',
              uhid: 'UHID-GEN-' + bed.number,
              admissionDate: '2026-10-07',
              diagnosis: 'Observation & Diagnostic Workup',
              consultant: activeDoctor?.name || 'Dr. Souvik Sinha',
              vitals: { bp: '120/80', pulse: '72 bpm', spo2: '98%', temp: '98.6°F' },
              diet: 'Standard Hospital Diet',
              dischargeReadiness: 'Under Active Evaluation'
            };

            const isOccupied = bed.status === 'Occupied';
            const notes = roundNotes[bed.id] || [];

            return (
              <div
                key={bed.id}
                className={`bg-white rounded-[26px] border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between gap-4 ${
                  isOccupied ? 'border-purple-200/90' : 'border-slate-200 opacity-75'
                }`}
              >
                <div>
                  {/* Bed Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${
                        isOccupied ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        #{bed.number}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{bed.ward}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{bed.type} Bed</div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isOccupied
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {bed.status}
                    </span>
                  </div>

                  {isOccupied ? (
                    <div className="space-y-3 pt-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-slate-900 m-0">
                            {extraData.patientName}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500">
                            {extraData.gender}, {extraData.age} Yrs
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          {extraData.uhid} · {extraData.admissionDate}
                        </span>
                      </div>

                      {/* Primary Diagnosis */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                          Primary Diagnosis
                        </span>
                        <strong className="text-slate-800 font-extrabold">{extraData.diagnosis}</strong>
                      </div>

                      {/* Vitals Grid */}
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className="p-1.5 bg-blue-50/80 rounded-xl border border-blue-100">
                          <span className="text-[9px] font-bold text-blue-600 block">BP</span>
                          <strong className="text-[11px] font-black text-slate-900">{extraData.vitals.bp}</strong>
                        </div>
                        <div className="p-1.5 bg-rose-50/80 rounded-xl border border-rose-100">
                          <span className="text-[9px] font-bold text-rose-600 block">Pulse</span>
                          <strong className="text-[11px] font-black text-slate-900">{extraData.vitals.pulse}</strong>
                        </div>
                        <div className="p-1.5 bg-emerald-50/80 rounded-xl border border-emerald-100">
                          <span className="text-[9px] font-bold text-emerald-600 block">SpO2</span>
                          <strong className="text-[11px] font-black text-slate-900">{extraData.vitals.spo2}</strong>
                        </div>
                        <div className="p-1.5 bg-amber-50/80 rounded-xl border border-amber-100">
                          <span className="text-[9px] font-bold text-amber-600 block">Temp</span>
                          <strong className="text-[11px] font-black text-slate-900">{extraData.vitals.temp}</strong>
                        </div>
                      </div>

                      {/* Notes list if any */}
                      {notes.length > 0 && (
                        <div className="space-y-1.5 max-h-24 overflow-y-auto pt-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            Recent Round Notes ({notes.length})
                          </span>
                          {notes.map(n => (
                            <div key={n.id} className="p-2 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-slate-700">
                              <span className="text-[9px] font-bold text-purple-700">{n.time}: </span>
                              {n.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add note area */}
                      {activeNoteBedId === bed.id ? (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <textarea
                            rows={2}
                            placeholder="Enter clinical observations, medication adjustments, or diet orders..."
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => { setActiveNoteBedId(null); setNoteInput(''); }}
                              className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border-none cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveRoundNote(bed.id)}
                              className="px-3 py-1 bg-[#16163B] text-white text-xs font-black rounded-lg border-none cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400">
                      <Bed className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-600" />
                      <p className="text-xs font-bold text-slate-500 m-0">Bed Vacant &amp; Sanitized</p>
                      <p className="text-[10px] text-slate-400 m-0 mt-0.5">Ready for new emergency/OPD admission</p>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isOccupied ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveNoteBedId(bed.id);
                          setNoteInput('');
                        }}
                        className="px-3 py-1.5 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
                        <span>Round Note</span>
                      </button>

                      <button
                        onClick={() => {
                          const newStatus = bed.status === 'Occupied' ? 'Available' : 'Occupied';
                          updateBedStatus(bed.id, newStatus, null);
                          showToast(`Bed #${bed.number} marked as discharged/vacant!`);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer transition-all"
                      >
                        Clear Discharge
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        updateBedStatus(bed.id, 'Occupied', 'New Admitted Patient');
                        showToast(`Bed #${bed.number} assigned to new patient!`);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center justify-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Admit Patient Here</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DoctorIPDRounds;
