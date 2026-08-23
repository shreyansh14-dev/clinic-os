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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope style={{ color: 'var(--primary)' }} /> Issue Digital Prescription
          </h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Select Patient */}
          <div className="form-group">
            <label className="form-label">Select Patient</label>
            <select
              className="select-field"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.gender}, {p.age} Yrs) - {p.id}</option>
              ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div className="form-group">
            <label className="form-label">Clinical Diagnosis & Findings</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Acute Upper Respiratory Tract Infection"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Medications List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Rx Prescribed Medicines</label>
              <button type="button" className="btn-secondary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }} onClick={handleAddMedication}>
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {medications.map((med, idx) => (
                <div key={idx} style={{ background: 'var(--bg-dark)', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr auto', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Medicine Name (e.g. Amoxicillin 500mg)"
                    value={med.name}
                    onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Dosage (e.g. 1 Tab Twice Daily)"
                    value={med.dosage}
                    onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Instructions"
                    value={med.instructions}
                    onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                  />
                  <button type="button" className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleRemoveMedication(idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advised Lab Tests */}
          <div className="form-group">
            <label className="form-label">Advised Diagnostic Tests (Comma separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Complete Blood Count (CBC), Lipid Profile Panel"
              value={testsAdvised}
              onChange={(e) => setTestsAdvised(e.target.value)}
            />
          </div>

          {/* Advice */}
          <div className="form-group">
            <label className="form-label">Doctor's Advice & Instructions</label>
            <textarea
              className="textarea-field"
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}>
            <CheckCircle2 size={18} /> Sign & Issue Digital Prescription
          </button>
        </form>
      </div>
    </div>
  );
};
