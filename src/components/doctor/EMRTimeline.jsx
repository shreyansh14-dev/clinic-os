import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  User,
  Clock,
  Heart,
  ShieldCheck,
  Activity,
  Plus,
  Pill,
  TestTube2,
  AlertTriangle,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const EMRTimeline = () => {
  const { patients, prescriptions, labTests, vitals } = useApp();
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'vitals' | 'labs'

  const activePat = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patRx = prescriptions.filter(r => r.patientId === activePat?.id);
  const patLabs = labTests.filter(l => l.patientId === activePat?.id);
  const patVitals = vitals.filter(v => v.patientId === activePat?.id);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 font-['Poppins']">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] rounded-[32px] p-7 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-black uppercase tracking-wider">
              Health Information Network · EMR / EHR
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Longitudinal Clinical Record
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
            Electronic Medical Records (EMR)
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1 max-w-xl">
            Inspect verified medical history, past diagnoses, drug allergy alerts, laboratory panels and physiological vital trends.
          </p>
        </div>

        {/* Patient Selector */}
        <div className="w-full sm:w-72">
          <label className="text-[11px] font-bold text-slate-300 block mb-1">Select Patient File</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white/10 text-white border border-white/20 rounded-2xl text-xs font-bold focus:outline-none focus:bg-[#16163B] cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id} className="text-slate-900 bg-white">
                {p.name} ({p.id}) · {p.age} Yrs
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Profile Card */}
      {activePat && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#16163B] text-[#E9DF70] text-2xl font-black flex items-center justify-center shadow-md">
                {activePat.name?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 m-0">{activePat.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    Blood Group: {activePat.bloodGroup}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    ABHA: {activePat.insuranceId || 'ABHA-99214-MH'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1 flex flex-wrap items-center gap-3">
                  <span>Gender: <strong>{activePat.gender}</strong></span>
                  <span>·</span>
                  <span>Age: <strong>{activePat.age} Years</strong></span>
                  <span>·</span>
                  <span>UHID: <strong>{activePat.id}</strong></span>
                  <span>·</span>
                  <span>Phone: <strong>{activePat.phone}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/create-prescription')}
              className="px-4 py-2.5 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-[#E9DF70]" />
              <span>Write New Rx</span>
            </button>
          </div>

          {/* Medical History & Allergy Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                Chronic Conditions &amp; Medical History
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePat.medicalHistory && activePat.medicalHistory.length > 0 ? (
                  activePat.medicalHistory.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No chronic medical conditions recorded.</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100">
              <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider block mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Drug Allergies &amp; Precautions</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold">
                  Penicillin Hypersensitivity
                </span>
                <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold">
                  NSAID-induced Bronchospasm
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tabs: Timeline vs Vitals vs Labs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'timeline', label: 'Consultation Timeline & Rx', icon: FileText, count: patRx.length },
          { id: 'vitals',   label: 'Physiological Trends & Vitals', icon: Activity },
          { id: 'labs',     label: 'Diagnostic Test Reports',     icon: TestTube2, count: patLabs.length }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-none cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#16163B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Longitudinal Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {patRx.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-700 m-0">No past prescriptions recorded</h4>
              <p className="text-xs text-slate-400 m-0 mt-1">Click "Write New Rx" to record the first medical prescription for this patient.</p>
            </div>
          ) : (
            patRx.map(rx => (
              <div
                key={rx.id}
                className="bg-white rounded-[26px] border border-slate-200/90 p-5 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 m-0">{rx.diagnosis}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                      Consultant: {rx.doctorName || 'Dr. Souvik Sinha'} · Date: {rx.date || 'Today'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                    Signed &amp; Issued
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Prescribed Medications:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {rx.medications?.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                        <div className="font-extrabold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{m.dosage} · {m.duration}</div>
                        <div className="text-[10px] text-purple-700 font-bold mt-1">{m.instructions}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.advice && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                    <strong>Advice:</strong> {rx.advice}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Vitals Trends */}
      {activeTab === 'vitals' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/90 shadow-sm space-y-5">
          <h4 className="text-sm font-black text-slate-900 m-0">Recent Physiological Vitals</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <span className="text-[10px] font-black uppercase text-blue-700">Blood Pressure</span>
              <div className="text-2xl font-black text-slate-900 mt-1">122/80</div>
              <span className="text-[10px] text-emerald-600 font-bold">Optimal Range</span>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
              <span className="text-[10px] font-black uppercase text-rose-700">Heart Rate</span>
              <div className="text-2xl font-black text-slate-900 mt-1">74 bpm</div>
              <span className="text-[10px] text-emerald-600 font-bold">Sinus Rhythm</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <span className="text-[10px] font-black uppercase text-emerald-700">SpO2 Oxygen</span>
              <div className="text-2xl font-black text-slate-900 mt-1">99%</div>
              <span className="text-[10px] text-emerald-600 font-bold">Normal Saturation</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] font-black uppercase text-amber-700">Fasting Glucose</span>
              <div className="text-2xl font-black text-slate-900 mt-1">98 mg/dL</div>
              <span className="text-[10px] text-emerald-600 font-bold">Normal</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Diagnostic Tests */}
      {activeTab === 'labs' && (
        <div className="space-y-3">
          {patLabs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <TestTube2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-700 m-0">No lab reports found for this patient</h4>
            </div>
          ) : (
            patLabs.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-slate-900 m-0">{l.testName || l.name}</h4>
                  <span className="text-[11px] text-slate-400">ID: {l.id} · Specimen: Blood/Serum</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {l.status || 'Verified'}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default EMRTimeline;
