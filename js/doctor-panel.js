/**
 * ClinicOS 24|7: Doctor Workspace & Clinical Panel
 * Patient Consultation Queue, EHR Records, Digital Rx Composer, and Lab Approvals.
 */

class DoctorPanel {
  constructor() {
    this.activeSubTab = 'queue'; // queue | ehr | rx-builder | diagnostics-approval | soap-notes
    this.selectedPatientId = 'pat-1';
  }

  render() {
    const container = document.getElementById('doctor-view');
    if (!container) return;

    const user = window.clinicState.getCurrentUser();
    const state = window.clinicState.data;
    const doctor = (state.doctors && state.doctors.find(d => d.email === user.email)) || state.doctors[0];
    const todayAppointments = (state.appointments || []).filter(a => a.doctorId === doctor.id || a.type === 'Telehealth');

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Top Doctor Header Banner -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; box-shadow:var(--shadow-card);">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="position:relative;">
              <img src="${doctor.avatar}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid var(--apollo-orange);">
              <span style="position:absolute; bottom:0; right:0; width:14px; height:14px; background:#10b981; border-radius:50%; border:2px solid #ffffff;"></span>
            </div>
            <div>
              <h1 style="font-size:1.6rem; font-weight:800; color:var(--apollo-navy);">${doctor.name}</h1>
              <p style="font-size:0.85rem; color:var(--apollo-orange); font-weight:600;">
                ${doctor.title} • <strong>${doctor.department}</strong> • Apollo Telehealth OPD Active
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
            <span class="badge badge-success"><span class="pulse-dot"></span> On-Duty (Live 24/7 Queue)</span>
            <button class="btn btn-primary" onclick="window.doctorPanel.openNewPrescriptionModal()">
              <i data-lucide="file-plus"></i> New Prescription
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Doctor Sidebar Nav -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Physician Workspace</div>
            <div class="portal-nav-link ${this.activeSubTab === 'queue' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('queue')">
              <i data-lucide="calendar-check"></i> Patient Queue (${todayAppointments.length})
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'ehr' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('ehr')">
              <i data-lucide="folder-heart"></i> Patient EHR Vault
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'rx-builder' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('rx-builder')">
              <i data-lucide="pill"></i> Digital Rx Generator
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'diagnostics-approval' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('diagnostics-approval')">
              <i data-lucide="microscope"></i> Lab Diagnostics
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'soap-notes' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('soap-notes')">
              <i data-lucide="file-text"></i> SOAP Clinical Notes
            </div>
          </div>

          <!-- Doctor Body Content -->
          <div class="portal-body">
            ${this.renderSubTabContent(doctor, todayAppointments)}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  switchSubTab(subTab) {
    this.activeSubTab = subTab;
    this.render();
  }

  renderSubTabContent(doctor, appointments) {
    if (this.activeSubTab === 'queue') {
      return `
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h2 style="font-size:1.3rem; font-weight:800; color:var(--apollo-navy);">Today's Consultation Queue</h2>
              <p style="font-size:0.82rem; color:var(--text-dim);">Live patient roster with instant WebRTC video consultation</p>
            </div>
            <span class="badge badge-info">${appointments.length} Consultations Pending</span>
          </div>

          ${appointments.map(apt => {
            const patient = (window.clinicState.data.patients || []).find(p => p.id === apt.patientId) || window.clinicState.data.patients[0];
            const isCompleted = apt.status === 'Completed';

            return `
              <div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:1.25rem; flex-wrap:wrap;">
                <div style="display:flex; gap:1rem; align-items:center;">
                  <img src="${patient.avatar}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid var(--border-subtle);">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <strong style="font-size:1.05rem; color:var(--apollo-navy);">${patient.name}</strong>
                      <span class="badge badge-primary">Age ${patient.age || '32'} • ${patient.bloodGroup || 'O+'}</span>
                      <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}">${apt.status}</span>
                    </div>
                    <p style="font-size:0.8rem; color:var(--text-dim); margin-top:3px;">
                      <strong>Chief Complaint:</strong> ${apt.reason || 'Symptom Triage Follow-up'} • Slot: <strong>${apt.time}</strong>
                    </p>
                  </div>
                </div>

                <div style="display:flex; gap:0.6rem; align-items:center;">
                  <button class="btn btn-outline btn-sm" onclick="window.doctorPanel.viewPatientEHR('${patient.id}')">
                    <i data-lucide="file-text"></i> View EHR
                  </button>
                  <button class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="window.telehealth.startConsultation('${apt.id}', 'DOCTOR')">
                    <i data-lucide="video"></i> ${isCompleted ? 'Re-Join Video' : 'Start Video Call'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (this.activeSubTab === 'ehr') {
      const patient = (window.clinicState.data.patients || []).find(p => p.id === this.selectedPatientId) || window.clinicState.data.patients[0];
      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid var(--border-subtle); padding-bottom:1rem;">
            <div style="display:flex; gap:1rem; align-items:center;">
              <img src="${patient.avatar}" style="width:56px; height:56px; border-radius:50%; object-fit:cover;">
              <div>
                <h2 style="font-size:1.25rem; font-weight:800; color:var(--apollo-navy);">${patient.name} (EHR Record #${patient.id})</h2>
                <p style="font-size:0.8rem; color:var(--text-dim);">DOB: 1993-04-12 • Blood: ${patient.bloodGroup} • Phone: ${patient.phone || '+91 98765 43210'}</p>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.telehealth.startInstantConsultation('General Physician')">
              <i data-lucide="video"></i> Video Call Patient
            </button>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-bottom:1.5rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <div style="font-size:0.75rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Known Allergies</div>
              <div style="margin-top:0.4rem; display:flex; gap:0.3rem; flex-wrap:wrap;">
                ${(patient.allergies || ['Penicillin']).map(a => `<span class="badge badge-danger">${a}</span>`).join('')}
              </div>
            </div>
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <div style="font-size:0.75rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Chronic History</div>
              <div style="margin-top:0.4rem; display:flex; gap:0.3rem; flex-wrap:wrap;">
                ${(patient.chronicConditions || ['Mild Bronchitis']).map(c => `<span class="badge badge-warning">${c}</span>`).join('')}
              </div>
            </div>
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <div style="font-size:0.75rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Live Baseline Vitals</div>
              <div style="font-size:0.82rem; font-weight:700; color:var(--apollo-navy); margin-top:0.4rem;">
                HR: ${patient.vitals ? patient.vitals.heartRate : 74} bpm • BP: ${patient.vitals ? patient.vitals.bloodPressure : '120/80'} • SpO2: 99%
              </div>
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:800; color:var(--apollo-navy); margin-bottom:0.75rem;">Past Clinical Consultations</h3>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${(patient.medicalHistory || []).map(h => `
              <div style="background:var(--bg-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="font-size:0.88rem; color:var(--apollo-navy);">${h.condition || h.diagnosis}</strong>
                  <div style="font-size:0.76rem; color:var(--text-dim);">Treated by ${h.doctor || 'Dr. Robert Chen'} • ${h.date}</div>
                </div>
                <span class="badge badge-success">Resolved</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'rx-builder') {
      return `
        <div class="card" style="max-width:700px;">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--apollo-navy); margin-bottom:0.35rem;">Digital Rx Composer</h2>
          <p style="font-size:0.82rem; color:var(--text-dim); margin-bottom:1.5rem;">Generate digitally signed Apollo 24|7 e-prescriptions synced to patient app</p>

          <div class="form-group">
            <label class="form-label">Patient</label>
            <select id="doc-rx-patient" class="form-control">
              ${(window.clinicState.data.patients || []).map(p => `<option value="${p.id}">${p.name} (ID: #${p.id})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Diagnosis</label>
            <input type="text" id="doc-rx-diag" class="form-control" placeholder="e.g. Acute Viral Pharyngitis / Hypertension Stage 1" value="Acute Sinusitis with Seasonal Rhinitis">
          </div>

          <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Medication Name</label>
              <input type="text" id="doc-rx-med" class="form-control" placeholder="e.g. Augmentin 625 Duo" value="Augmentin 625 Duo Tablet">
            </div>
            <div class="form-group">
              <label class="form-label">Frequency & Duration</label>
              <input type="text" id="doc-rx-freq" class="form-control" placeholder="e.g. 1 Tablet Twice Daily (5 Days)" value="1 Tab BID after food (5 Days)">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Dietary & Clinical Instructions</label>
            <textarea id="doc-rx-notes" class="form-control" rows="3">Warm saline gargles twice daily. Maintain adequate fluid intake. Report if fever persists above 101 F.</textarea>
          </div>

          <button class="btn btn-primary" style="width:100%;" onclick="window.doctorPanel.submitPrescription()">
            <i data-lucide="check-circle"></i> Issue & Digitally Sign Rx
          </button>
        </div>
      `;
    }

    if (this.activeSubTab === 'diagnostics-approval') {
      return `
        <div class="card">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--apollo-navy); margin-bottom:0.35rem;">Diagnostic Lab Approvals</h2>
          <p style="font-size:0.82rem; color:var(--text-dim); margin-bottom:1.5rem;">Review and verify NABL certified home collection test results</p>

          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <strong style="color:var(--apollo-navy);">12-Lead Continuous ECG Report - Alex Morgan</strong>
                <div style="font-size:0.76rem; color:var(--text-dim);">Sinus Rhythm 72 bpm • PR: 140ms • QTc: 412ms (Normal)</div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <span class="badge badge-success">Verified by AI</span>
                <button class="btn btn-primary btn-sm" onclick="window.toast.show('Signed', 'ECG Report approved and synchronized to Patient Health Vault.', 'success')">
                  <i data-lucide="check"></i> Approve & Sign
                </button>
              </div>
            </div>

            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <strong style="color:var(--apollo-navy);">Comprehensive Lipid Profile - Alex Morgan</strong>
                <div style="font-size:0.76rem; color:var(--text-dim);">Total Cholesterol: 188 mg/dL • HDL: 52 mg/dL • LDL: 112 mg/dL</div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <span class="badge badge-info">Awaiting MD Sign-off</span>
                <button class="btn btn-primary btn-sm" onclick="window.toast.show('Signed', 'Lipid Profile report released to patient.', 'success')">
                  <i data-lucide="check"></i> Approve & Sign
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'soap-notes') {
      return `
        <div class="card" style="max-width:750px;">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--apollo-navy); margin-bottom:0.35rem;">Clinical SOAP Notes</h2>
          <p style="font-size:0.82rem; color:var(--text-dim); margin-bottom:1.5rem;">Structured medical encounter documentation for compliance and insurance</p>

          <div class="form-group">
            <label class="form-label">Subjective (S)</label>
            <textarea class="form-control" rows="2">Patient reports 3-day history of nasal congestion, low-grade malaise, and dry cough following air travel.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Objective (O)</label>
            <textarea class="form-control" rows="2">BP 122/82 mmHg, HR 74 bpm regular, SpO2 99% on room air, Temp 98.6 F. Pharynx mildly erythematous without exudate.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Assessment (A)</label>
            <textarea class="form-control" rows="2">Acute Viral Upper Respiratory Infection (URI) without secondary bacterial complication.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Plan (P)</label>
            <textarea class="form-control" rows="2">Supportive hydration, rest, paracetamol PRN for fever. Telehealth re-assessment if unresolved in 5 days.</textarea>
          </div>

          <button class="btn btn-primary" onclick="window.toast.show('SOAP Saved', 'Clinical SOAP encounter record encrypted and saved to HIPAA audit trail.', 'success')">
            <i data-lucide="save"></i> Save Encounter Record
          </button>
        </div>
      `;
    }

    return '';
  }

  viewPatientEHR(patientId) {
    this.selectedPatientId = patientId;
    this.switchSubTab('ehr');
  }

  openNewPrescriptionModal() {
    this.switchSubTab('rx-builder');
  }

  submitPrescription() {
    const patId = document.getElementById('doc-rx-patient')?.value || 'pat-1';
    const diag = document.getElementById('doc-rx-diag')?.value || 'General Consultation';
    const med = document.getElementById('doc-rx-med')?.value || 'Paracetamol 650mg';
    const freq = document.getElementById('doc-rx-freq')?.value || '1 Tab TDS (3 Days)';
    const notes = document.getElementById('doc-rx-notes')?.value || 'Rest and plenty of fluids.';

    const state = window.clinicState.data;
    const patient = (state.patients && state.patients.find(p => p.id === patId)) || state.patients[0];
    const user = window.clinicState.getCurrentUser();
    const doctor = (state.doctors && state.doctors.find(d => d.email === user.email)) || state.doctors[0];

    window.clinicState.addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      diagnosis: diag,
      medicines: [
        {
          name: med,
          dosage: 'Standard',
          frequency: freq,
          timing: 'After meals',
          duration: '5 Days',
          instructions: notes
        }
      ],
      advice: notes,
      followUp: 'Follow up in 5-7 days if needed',
      signature: `${doctor.name}, MD (Apollo Verified)`
    });

    if (window.audioService && window.audioService.playSuccessChime) {
      window.audioService.playSuccessChime();
    }
    window.toast.show('Rx Issued Successfully', `Prescription synchronized to ${patient.name}'s Apollo portal.`, 'success');
    this.switchSubTab('queue');
  }
}

window.doctorPanel = new DoctorPanel();
