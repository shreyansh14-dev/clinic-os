/**
 * ClinicOS: Doctor Panel Module
 * Clinical Dashboard, Patient Queue, EHR Electronic Records, Digital Prescription Pad,
 * Diagnostic Approvals, and SOAP Clinical Notes.
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
    const doctor = window.clinicState.data.doctors.find(d => d.email === user.email) || window.clinicState.data.doctors[0];
    const todayAppointments = (window.clinicState.data.appointments || []).filter(a => a.doctorId === doctor.id);

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Top Doctor Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <img src="${doctor.avatar}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
            <div>
              <h1 style="font-size:1.75rem;">${doctor.name}</h1>
              <p style="font-size:0.85rem; color:var(--primary-light);">
                ${doctor.title} • <strong>${doctor.department}</strong> (Room 104)
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem; align-items:center;">
            <span class="badge badge-success"><span class="pulse-dot"></span> On-Duty / Telehealth Active</span>
            <button class="btn btn-primary" onclick="window.doctorPanel.openNewPrescriptionModal()">
              <i data-lucide="file-plus"></i> Write Prescription
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Doctor Sidebar Nav -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Doctor Workspace</div>
            <div class="portal-nav-link ${this.activeSubTab === 'queue' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('queue')">
              <i data-lucide="calendar-check"></i> Today's Queue (${todayAppointments.length})
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'ehr' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('ehr')">
              <i data-lucide="folder-heart"></i> Patient EHR Records
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'rx-builder' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('rx-builder')">
              <i data-lucide="pill"></i> Digital Rx Generator
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'diagnostics-approval' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('diagnostics-approval')">
              <i data-lucide="microscope"></i> Review Lab Diagnostics
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'soap-notes' ? 'active' : ''}" onclick="window.doctorPanel.switchSubTab('soap-notes')">
              <i data-lucide="file-edit"></i> Clinical SOAP Notes
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
      return this.renderQueueTab(doctor, appointments);
    } else if (this.activeSubTab === 'ehr') {
      return this.renderEHRTab();
    } else if (this.activeSubTab === 'rx-builder') {
      return this.renderRxBuilderTab(doctor);
    } else if (this.activeSubTab === 'diagnostics-approval') {
      return this.renderDiagnosticsApprovalTab();
    } else if (this.activeSubTab === 'soap-notes') {
      return this.renderSoapNotesTab();
    }
  }

  renderQueueTab(doctor, appointments) {
    return `
      <!-- KPI Stats -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon"><i data-lucide="users"></i></div>
            <span class="kpi-trend positive">Today</span>
          </div>
          <div class="kpi-value">${appointments.length}</div>
          <div class="kpi-label">Scheduled Patients</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon cyan"><i data-lucide="video"></i></div>
            <span class="badge badge-purple" style="font-size:0.7rem;">Virtual</span>
          </div>
          <div class="kpi-value">${appointments.filter(a => a.isTelehealth).length}</div>
          <div class="kpi-label">Telehealth Consultations</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon purple"><i data-lucide="check-circle"></i></div>
            <span class="kpi-trend positive">85%</span>
          </div>
          <div class="kpi-value">${appointments.filter(a => a.status === 'Completed').length}</div>
          <div class="kpi-label">Completed Consultations</div>
        </div>
      </div>

      <!-- Patient Queue Table -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="list-ordered"></i></div>
            Today's Appointment Queue & Clinical Actions
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Time / Mode</th>
                <th>Reported Symptoms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appointments.map(apt => `
                <tr>
                  <td>
                    <strong>${apt.patientName}</strong>
                    <div style="font-size:0.75rem; color:var(--text-dim);">ID: #${apt.patientId}</div>
                  </td>
                  <td>
                    <div style="font-weight:600; color:var(--text-main);">${apt.time}</div>
                    <span class="badge ${apt.isTelehealth ? 'badge-purple' : 'badge-info'}" style="font-size:0.7rem; margin-top:2px;">
                      ${apt.type}
                    </span>
                  </td>
                  <td style="max-width:240px; font-size:0.82rem; color:var(--text-muted);">
                    ${apt.symptoms}
                  </td>
                  <td>
                    <span class="badge ${apt.status === 'Completed' ? 'badge-success' : 'badge-warning'}">
                      ${apt.status}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                      ${apt.isTelehealth ? `
                        <button class="btn btn-primary btn-sm" onclick="window.telehealth.startConsultation('${apt.id}')">
                          <i data-lucide="video"></i> Start Video Call
                        </button>
                      ` : `
                        <button class="btn btn-secondary btn-sm" onclick="window.doctorPanel.completeInPersonVisit('${apt.id}')">
                          <i data-lucide="check"></i> Mark Done
                        </button>
                      `}
                      <button class="btn btn-outline btn-sm" onclick="window.doctorPanel.inspectPatientEHR('${apt.patientId}')">
                        <i data-lucide="user"></i> EHR
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  inspectPatientEHR(patientId) {
    this.selectedPatientId = patientId;
    this.switchSubTab('ehr');
  }

  completeInPersonVisit(aptId) {
    window.clinicState.updateAppointmentStatus(aptId, 'Completed');
    if (window.audioService) window.audioService.playSuccessChime();
    this.render();
  }

  renderEHRTab() {
    const patient = window.clinicState.data.patients.find(p => p.id === this.selectedPatientId) || window.clinicState.data.patients[0];
    const prescriptions = (window.clinicState.data.prescriptions || []).filter(r => r.patientId === patient.id);
    const diagnosticOrders = (window.clinicState.data.diagnosticOrders || []).filter(d => d.patientId === patient.id);

    return `
      <div class="glass-card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="folder-heart"></i></div>
            Electronic Health Record (EHR): ${patient.name}
          </div>
          <div style="display:flex; gap:0.5rem;">
            <select class="form-control" style="width:200px;" onchange="window.doctorPanel.inspectPatientEHR(this.value)">
              ${window.clinicState.data.patients.map(p => `<option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Demographics</div>
            <div style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-top:2px;">${patient.age} yrs • ${patient.gender} (${patient.bloodGroup})</div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">Phone: ${patient.phone}</div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Known Allergies</div>
            <div style="display:flex; gap:0.3rem; margin-top:4px; flex-wrap:wrap;">
              ${patient.allergies.map(a => `<span class="badge badge-danger" style="font-size:0.7rem;">${a}</span>`).join('')}
            </div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Chronic Conditions</div>
            <div style="display:flex; gap:0.3rem; margin-top:4px; flex-wrap:wrap;">
              ${patient.chronicConditions.map(c => `<span class="badge badge-warning" style="font-size:0.7rem;">${c}</span>`).join('')}
            </div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Insurance Provider</div>
            <div style="font-size:0.9rem; font-weight:700; color:var(--primary-light); margin-top:2px;">${patient.insurance.provider}</div>
            <div style="font-size:0.72rem; color:var(--text-dim);">Policy: ${patient.insurance.policyNumber}</div>
          </div>
        </div>

        <h4 style="font-size:1.05rem; margin-bottom:0.75rem;">Past Prescriptions History</h4>
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
          ${prescriptions.map(rx => `
            <div style="background:var(--bg-surface-elevated); padding:0.9rem 1.1rem; border-radius:10px; border:1px solid var(--border-glass);">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <strong style="color:var(--text-main);">${rx.diagnosis}</strong>
                <span style="color:var(--text-dim);">${rx.date}</span>
              </div>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.3rem;">
                ${rx.medicines.map(m => `${m.name} (${m.dosage} - ${m.frequency})`).join(' • ')}
              </div>
            </div>
          `).join('')}
        </div>

        <h4 style="font-size:1.05rem; margin-bottom:0.75rem;">Diagnostic Reports Archive</h4>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${diagnosticOrders.map(ord => `
            <div style="background:var(--bg-surface-elevated); padding:0.9rem 1.1rem; border-radius:10px; border:1px solid var(--border-glass); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:var(--text-main); font-size:0.9rem;">${ord.testName}</strong>
                <div style="font-size:0.78rem; color:var(--text-muted);">${ord.findings}</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.viewScanModal('${ord.id}')">
                <i data-lucide="eye"></i> View Scan
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRxBuilderTab(doctor) {
    const patients = window.clinicState.data.patients || SEED_DATA.patients;

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="file-plus"></i></div>
            Digital Prescription & Regimen Generator
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div class="form-group">
            <label class="form-label">Select Patient</label>
            <select id="rx-patient-select" class="form-control">
              ${patients.map(p => `<option value="${p.id}">${p.name} (ID: #${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Clinical Diagnosis</label>
            <input type="text" id="rx-diagnosis-input" class="form-control" placeholder="e.g. Mild Bronchospasm with allergic cough">
          </div>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass); margin-bottom:1rem;">
          <div style="font-size:0.85rem; font-weight:700; color:var(--primary-light); margin-bottom:0.75rem;">
            Prescribed Drug Regimen
          </div>
          <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:0.6rem; margin-bottom:0.75rem;">
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Medication Name</label>
              <input type="text" id="rx-drug-name" class="form-control" value="Levocetirizine + Montelukast">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Dosage</label>
              <input type="text" id="rx-drug-dose" class="form-control" value="10mg / 5mg">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Frequency</label>
              <input type="text" id="rx-drug-freq" class="form-control" value="Once daily (0-0-1)">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:0.75rem;">Duration</label>
              <input type="text" id="rx-drug-dur" class="form-control" value="14 Days">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Dietary & Clinical Instructions</label>
          <textarea id="rx-advice-input" class="form-control" rows="2" placeholder="e.g. Avoid cold allergens. Steam inhalation 2x daily."></textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
          <div style="font-size:0.75rem; color:var(--text-dim);">
            Signing Authority: <strong>${doctor.name}</strong> (${doctor.education})
          </div>
          <button class="btn btn-primary" onclick="window.doctorPanel.submitNewPrescription('${doctor.id}')">
            <i data-lucide="check-circle"></i> Issue & Sign Digitally
          </button>
        </div>
      </div>
    `;
  }

  submitNewPrescription(doctorId) {
    const patientId = document.getElementById('rx-patient-select').value;
    const patient = window.clinicState.data.patients.find(p => p.id === patientId);
    const doctor = window.clinicState.data.doctors.find(d => d.id === doctorId);
    const diagnosis = document.getElementById('rx-diagnosis-input').value || 'Routine Assessment';
    const drugName = document.getElementById('rx-drug-name').value || 'Telmisartan 40mg';
    const dose = document.getElementById('rx-drug-dose').value || '40mg';
    const freq = document.getElementById('rx-drug-freq').value || '1-0-0';
    const dur = document.getElementById('rx-drug-dur').value || '30 Days';
    const advice = document.getElementById('rx-advice-input').value || 'Follow prescribed timing with water.';

    window.clinicState.addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      diagnosis: diagnosis,
      medicines: [
        {
          name: drugName,
          dosage: dose,
          frequency: freq,
          timing: 'After meals',
          duration: dur,
          instructions: 'Take as directed'
        }
      ],
      advice: advice,
      followUp: 'Follow up in 2 weeks',
      signature: `${doctor.name}, MD (Digital Cryptographic Sig)`
    });

    if (window.audioService) window.audioService.playSuccessChime();
    alert(`Prescription successfully created and issued for ${patient.name}!`);
    this.switchSubTab('ehr');
  }

  renderDiagnosticsApprovalTab() {
    const orders = window.clinicState.data.diagnosticOrders || [];

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="microscope"></i></div>
            Review Diagnostic & Radiology Reports
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID / Date</th>
                <th>Patient</th>
                <th>Diagnostic Test</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(ord => `
                <tr>
                  <td><strong>#${ord.id}</strong><div style="font-size:0.72rem; color:var(--text-dim);">${ord.orderedDate}</div></td>
                  <td>${ord.patientName}</td>
                  <td>${ord.testName}</td>
                  <td><span class="badge ${ord.status === 'Ready' || ord.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${ord.status}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.viewScanModal('${ord.id}')">
                      <i data-lucide="eye"></i> Review & Sign Off
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderSoapNotesTab() {
    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="file-edit"></i></div>
            Clinical SOAP Notes Editor (Subjective, Objective, Assessment, Plan)
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label class="form-label" style="color:#38BDF8;">S - Subjective (Patient Complaints & Symptoms)</label>
            <textarea class="form-control" rows="4">Patient reports mild occasional palpitations after 30-min aerobic running. Denies chest pain, lightheadedness, or syncope.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" style="color:#34D399;">O - Objective (Physical Findings & Telemetry)</label>
            <textarea class="form-control" rows="4">BP 120/80 mmHg, Resting HR 72 bpm regular rhythm. 12-lead ECG demonstrates normal sinus rhythm without ST changes.</textarea>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
          <div class="form-group">
            <label class="form-label" style="color:#FBBF24;">A - Assessment (Clinical Impression)</label>
            <textarea class="form-control" rows="4">Benign exertional sinus tachycardia. Hypertension well-managed on Telmisartan 40mg daily.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" style="color:#C084FC;">P - Plan (Therapy & Follow-Up)</label>
            <textarea class="form-control" rows="4">Continue Telmisartan 40mg. Maintain hydration. Target exercise heart rate under 140 bpm. Repeat telemetry in 60 days.</textarea>
          </div>
        </div>

        <div style="text-align:right; margin-top:1rem;">
          <button class="btn btn-primary" onclick="alert('SOAP Clinical Note auto-saved and encrypted to EHR archive.')">
            <i data-lucide="save"></i> Save SOAP Note
          </button>
        </div>
      </div>
    `;
  }
}

window.doctorPanel = new DoctorPanel();
