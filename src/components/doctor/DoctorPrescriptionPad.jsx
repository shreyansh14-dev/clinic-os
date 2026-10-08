import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Printer,
  Send,
  Pill,
  Sparkles,
  User,
  Activity,
  Search,
  Check
} from 'lucide-react';

export const DoctorPrescriptionPad = () => {
  const { patients, activeDoctor, createPrescription, showToast } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCode, setIcdCode] = useState('I10');
  const [medications, setMedications] = useState([
    { name: 'Paracetamol 650mg', dosage: '650 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
    { name: 'Amoxicillin + Clavulanic Acid 625mg', dosage: '625 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Meals' }
  ]);
  const [testsAdvised, setTestsAdvised] = useState('Complete Blood Count (CBC), Serum Creatinine');
  const [advice, setAdvice] = useState('Drink adequate water. Avoid spicy foods. Take complete 5-day course.');
  const [followUpDays, setFollowUpDays] = useState('5 Days');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const quickMeds = [
    { name: 'Paracetamol 650mg', dosage: '650 mg', frequency: '1-0-1', duration: '3 Days', instructions: 'After Meals' },
    { name: 'Pantoprazole 40mg', dosage: '40 mg', frequency: '1-0-0', duration: '7 Days', instructions: 'Empty Stomach (Morning)' },
    { name: 'Azithromycin 500mg', dosage: '500 mg', frequency: '1-0-0', duration: '3 Days', instructions: 'After Food' },
    { name: 'Telmisartan 40mg', dosage: '40 mg', frequency: '1-0-0', duration: '30 Days', instructions: 'Morning after breakfast' },
    { name: 'Metformin 500mg', dosage: '500 mg', frequency: '1-0-1', duration: '30 Days', instructions: 'With Meals' },
    { name: 'Cetirizine 10mg', dosage: '10 mg', frequency: '0-0-1', duration: '5 Days', instructions: 'At Bedtime' },
    { name: 'ORS Sachet', dosage: '1 sachet in 1L water', frequency: 'SOS', duration: '3 Days', instructions: 'Sip throughout day' }
  ];

  const handleAddMedication = () => {
    setMedications(prev => [
      ...prev,
      { name: '', dosage: '500 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' }
    ]);
  };

  const handleRemoveMedication = (idx) => {
    setMedications(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx, field, val) => {
    const updated = [...medications];
    updated[idx][field] = val;
    setMedications(updated);
  };

  const handleAddQuickMed = (med) => {
    setMedications(prev => [...prev, { ...med }]);
    showToast(`Added ${med.name} to Rx prescription list!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      showToast('Please enter a clinical diagnosis.', 'warn');
      return;
    }

    createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: activeDoctor?.id || 'doc-1',
      doctorName: activeDoctor?.name || 'Dr. Souvik Sinha',
      diagnosis: `${diagnosis} (${icdCode})`,
      medications: medications.filter(m => m.name.trim() !== ''),
      advice,
      testsAdvised: testsAdvised ? testsAdvised.split(',').map(t => t.trim()) : [],
      followUp: followUpDays
    });

    showToast(`Prescription successfully signed & dispatched to Pharmacy for ${selectedPatient.name}!`);
    setShowPrintPreview(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 font-['Poppins']">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] rounded-[32px] p-7 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              Clinical Pharmacology · Digital Rx Generator
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Medical Council Verified Pad
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
            Issue Digital Prescription (Rx)
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1 max-w-xl">
            Prescribe medications, dosage frequencies, diagnostic orders, and advice with seamless integration to the pharmacy dispensary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrintPreview(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-[#E9DF70]" />
            <span>Print Preview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Rx Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          {/* Patient Selection Card */}
          <div className="bg-white rounded-[26px] p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 m-0 flex items-center gap-2">
              <User className="w-4 h-4 text-[#16163B]" />
              <span>Select Patient for Prescription</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454] cursor-pointer"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id}) · {p.age} Yrs, {p.gender}</option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-blue-950">{selectedPatient.name}</div>
                    <div className="text-[11px] text-blue-700">Blood: <strong>{selectedPatient.bloodGroup}</strong> · Phone: {selectedPatient.phone}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 text-[10px] font-black">
                    ABHA Verified
                  </span>
                </div>
              )}
            </div>

            {/* Diagnosis & ICD-10 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">Clinical Diagnosis &amp; Findings *</label>
                <input
                  type="text"
                  placeholder="e.g. Essential Hypertension &amp; Dyslipidemia"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">ICD-10 Code</label>
                <select
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454]"
                >
                  <option value="I10">I10 - Essential Hypertension</option>
                  <option value="E11">E11 - Type 2 Diabetes Mellitus</option>
                  <option value="J06.9">J06.9 - Acute Upper Resp Infection</option>
                  <option value="K21">K21 - Gastro-esophageal Reflux</option>
                  <option value="M54.5">M54.5 - Low Back Pain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rx Medications List */}
          <div className="bg-white rounded-[26px] p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 m-0 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-purple-600" />
                  <span>Rx Prescribed Medications ({medications.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold m-0 mt-0.5">
                  Specify medication name, dosage strength, dosing schedule and dietary instructions
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMedication}
                className="px-3.5 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>Add Drug</span>
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((m, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Medicine name & form (e.g. Tab. Paracetamol 650mg)"
                      value={m.name}
                      onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                      required
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center border-none cursor-pointer"
                      title="Remove Medication"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Frequency</label>
                      <select
                        value={m.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <option value="1-0-1">1-0-1 (Morning - Night)</option>
                        <option value="1-0-0">1-0-0 (Morning Once)</option>
                        <option value="0-0-1">0-0-1 (Night Once)</option>
                        <option value="1-1-1">1-1-1 (Thrice a day)</option>
                        <option value="SOS">SOS (As needed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Days / 1 Month"
                        value={m.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Instructions</label>
                      <select
                        value={m.instructions}
                        onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <option value="After Food">After Food</option>
                        <option value="Before Food">Before Food</option>
                        <option value="Empty Stomach">Empty Stomach</option>
                        <option value="With Milk/Water">With Plenty of Water</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice, Diagnostics & Follow-up */}
          <div className="bg-white rounded-[26px] p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 m-0">
              Lifestyle Advice, Diagnostic Orders &amp; Follow-Up
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Recommended Lab / Diagnostic Tests</label>
              <input
                type="text"
                placeholder="e.g. Complete Blood Count (CBC), Lipid Panel, 2D Echo"
                value={testsAdvised}
                onChange={(e) => setTestsAdvised(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Dietary &amp; Clinical Advice</label>
              <textarea
                rows={2}
                placeholder="Rest advice, dietary restrictions, warning signs..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Review in:</span>
                <select
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="3 Days">3 Days</option>
                  <option value="5 Days">5 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-2xl border-none cursor-pointer flex items-center gap-2 shadow-md transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E9DF70]" />
                <span>Digitally Sign &amp; Issue Rx</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right 1 Col: Quick Formulary & Medicine Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white rounded-[26px] p-5 border border-slate-200/90 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Formulary Shortcuts</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold m-0">
              Click any standard drug formulation below to append immediately to this prescription.
            </p>

            <div className="space-y-2 pt-1 max-h-[500px] overflow-y-auto pr-1">
              {quickMeds.map((qm, i) => (
                <div
                  key={i}
                  onClick={() => handleAddQuickMed(qm)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-[#EFF6FF] border border-slate-200/80 hover:border-blue-200 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-xs font-black text-slate-900">{qm.name}</strong>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">
                      + Add
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-2">
                    <span>{qm.frequency}</span>
                    <span>·</span>
                    <span>{qm.duration}</span>
                    <span>·</span>
                    <span>{qm.instructions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="bg-gradient-to-br from-slate-900 to-[#16163B] text-white rounded-[26px] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#E9DF70] text-xs font-black">
              <Stethoscope className="w-4 h-4" />
              <span>Digital Physician Certification</span>
            </div>
            <div>
              <div className="text-sm font-black text-white">{activeDoctor?.name || 'Dr. Souvik Sinha'}</div>
              <div className="text-[11px] text-slate-300">{activeDoctor?.specialty || 'Senior Consultant Cardiologist'}</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Reg. No: NMC-984321-MH</div>
            </div>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
              ClinicOS Encrypted Digital Rx Signature Hash Active
            </div>
          </div>
        </div>
      </div>

      {/* Printable Prescription Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
              <div>
                <h2 className="text-xl font-black text-slate-900 m-0">ClinicOS Medical Care Hospital</h2>
                <p className="text-xs text-slate-500 font-bold m-0 mt-0.5">NABH Accredited Multi-Specialty Clinical Center</p>
              </div>
              <div className="text-right text-xs">
                <div className="font-black text-[#16163B]">{activeDoctor?.name || 'Dr. Souvik Sinha'}</div>
                <div className="text-slate-500">{activeDoctor?.specialty || 'Cardiologist'}</div>
              </div>
            </div>

            {/* Patient Header */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
              <div>
                <span>Patient: <strong>{selectedPatient.name}</strong></span>
                <span className="ml-4">Age/Gender: <strong>{selectedPatient.age} Yrs / {selectedPatient.gender}</strong></span>
              </div>
              <div>
                <span>Date: <strong>{new Date().toISOString().substring(0, 10)}</strong></span>
              </div>
            </div>

            <div>
              <div className="text-xs font-black text-slate-500 uppercase">Diagnosis:</div>
              <div className="text-sm font-black text-slate-900">{diagnosis || 'Clinical evaluation & management'} ({icdCode})</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span className="text-lg">℞</span> Prescribed Medications:
              </div>
              <div className="space-y-1.5 pl-3">
                {medications.map((m, i) => (
                  <div key={i} className="text-xs">
                    <strong>{i + 1}. {m.name}</strong> — {m.frequency} ({m.duration}) · <span className="italic text-slate-600">{m.instructions}</span>
                  </div>
                ))}
              </div>
            </div>

            {advice && (
              <div className="text-xs bg-slate-50 p-3 rounded-xl">
                <strong>Advice:</strong> {advice}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowPrintPreview(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowPrintPreview(false);
                }}
                className="px-5 py-2 bg-[#16163B] text-white text-xs font-black rounded-xl border-none cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#E9DF70]" />
                <span>Print Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorPrescriptionPad;
