import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stethoscope, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

export const CreatePrescriptionModal = ({ patient, onClose }) => {
  const { patients, createPrescription } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState(patient ? patient.id : patients[0].id);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([
    { name: 'Paracetamol 650mg', dosage: '1 Tablet Thrice Daily', duration: '5 Days', instructions: 'After meals' }
  ]);
  const [advice, setAdvice] = useState('Drink plenty of warm water, adequate rest for 3 days.');
  const [testsAdvised, setTestsAdvised] = useState('Complete Blood Count (CBC)');

  const targetPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '1 Tablet Daily', duration: '7 Days', instructions: 'Take with water' }]);
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPrescription({
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      diagnosis: diagnosis || 'Clinical evaluation & symptom management',
      medications: medications.filter(m => m.name.trim() !== ''),
      advice,
      testsAdvised: testsAdvised ? testsAdvised.split(',').map(t => t.trim()) : []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-2xl w-full p-7 space-y-5 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#16163B] text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-5 h-5 text-[#E9DF70]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0">Issue Digital Prescription</h3>
              <p className="text-xs text-slate-500 m-0">Generate signed medical Rx with dosage & advice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center border-none cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Select Patient */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Select Patient</label>
            <select
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all cursor-pointer"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.gender}, {p.age} Yrs) — ID: {p.id}</option>
              ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Clinical Diagnosis & Findings</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
              placeholder="e.g. Acute Upper Respiratory Tract Infection / Viral Fever"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Medications List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-slate-700">Rx Prescribed Medicines</label>
              <button
                type="button"
                onClick={handleAddMedication}
                className="px-3 py-1 bg-[#EFF6FF] hover:bg-blue-100 text-[#242454] rounded-xl text-[11px] font-black border-none cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                >
                  <input
                    type="text"
                    className="sm:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                    placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                    value={med.name}
                    onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                    placeholder="Dosage (e.g. 1 Tab Thrice)"
                    value={med.dosage}
                    onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                  />
                  <input
                    type="text"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                    placeholder="Duration (5 Days)"
                    value={med.duration}
                    onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                      placeholder="After meals"
                      value={med.instructions}
                      onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border-none cursor-pointer shrink-0 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advised Lab Tests */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Advised Diagnostic Tests (Optional, comma-separated)</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
              placeholder="e.g. Complete Blood Count (CBC), Lipid Profile Panel"
              value={testsAdvised}
              onChange={(e) => setTestsAdvised(e.target.value)}
            />
          </div>

          {/* Advice */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Doctor's Advice & Clinical Instructions</label>
            <textarea
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:scale-[1.01]"
          >
            <CheckCircle2 size={16} className="text-[#E9DF70]" />
            <span>Sign & Issue Digital Prescription (Verified)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
