/**
 * ClinicOS: Patient Panel Module
 * Comprehensive Patient Dashboard, Booking Wizard, 4D Continuous Vitals,
 * Medication Adherence, Prescriptions, Diagnostics, and Invoices.
 */

class PatientPanel {
  constructor() {
    this.activeSubTab = 'dashboard'; // dashboard | booking | vitals | prescriptions | diagnostics | billing
    this.ecgSimulator = null;
  }

  render() {
    const container = document.getElementById('patient-view');
    if (!container) return;

    const user = window.clinicState.getCurrentUser();
    const patient = window.clinicState.data.patients.find(p => p.id === user.id) || window.clinicState.data.patients[0];

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Top Greeting Banner -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.85rem;">Welcome back, ${patient.name}</h1>
            <p style="font-size:0.88rem; color:var(--text-dim);">
              Patient ID: <strong>#${patient.id}</strong> • Blood Group: <strong>${patient.bloodGroup}</strong> • Age: <strong>${patient.age} yrs</strong>
            </p>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-cyan" onclick="window.triageEngine.openTriage()">
              <i data-lucide="bot"></i> AI Symptom Triage
            </button>
            <button class="btn btn-primary" onclick="window.patientPanel.openBookingModal()">
              <i data-lucide="calendar-plus"></i> Book Appointment
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Patient Sidebar Nav -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Patient Hub</div>
            <div class="portal-nav-link ${this.activeSubTab === 'dashboard' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('dashboard')">
              <i data-lucide="layout-dashboard"></i> Overview
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'booking' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('booking')">
              <i data-lucide="stethoscope"></i> Find Specialist & Book
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'vitals' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('vitals')">
              <i data-lucide="activity"></i> 4D Continuous Vitals
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'prescriptions' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('prescriptions')">
              <i data-lucide="pill"></i> Prescriptions & Meds
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'diagnostics' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('diagnostics')">
              <i data-lucide="file-text"></i> Lab & Scan Reports
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'billing' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('billing')">
              <i data-lucide="receipt"></i> Invoices & Payments
            </div>
          </div>

          <!-- Patient Body Content -->
          <div class="portal-body">
            ${this.renderSubTabContent(patient)}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // If on vitals tab, re-init ECG canvas
    if (this.activeSubTab === 'vitals' || this.activeSubTab === 'dashboard') {
      setTimeout(() => {
        if (this.ecgSimulator) this.ecgSimulator.destroy();
        this.ecgSimulator = new ECGCanvasSimulator('patient-ecg-canvas');
      }, 50);
    }
  }

  switchSubTab(subTab) {
    this.activeSubTab = subTab;
    this.render();
  }

  renderSubTabContent(patient) {
    if (this.activeSubTab === 'dashboard') {
      return this.renderDashboardTab(patient);
    } else if (this.activeSubTab === 'booking') {
      return this.renderBookingTab();
    } else if (this.activeSubTab === 'vitals') {
      return this.renderVitalsTab(patient);
    } else if (this.activeSubTab === 'prescriptions') {
      return this.renderPrescriptionsTab(patient);
    } else if (this.activeSubTab === 'diagnostics') {
      return this.renderDiagnosticsTab(patient);
    } else if (this.activeSubTab === 'billing') {
      return this.renderBillingTab(patient);
    }
  }

  renderDashboardTab(patient) {
    const appointments = (window.clinicState.data.appointments || []).filter(a => a.patientId === patient.id && a.status === 'Confirmed');
    const reminders = (window.clinicState.data.medicationReminders || []).filter(m => m.patientId === patient.id);

    return `
      <!-- KPI Stats Row -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon"><i data-lucide="heart"></i></div>
            <span class="kpi-trend positive"><i data-lucide="trending-up" style="width:12px;"></i> Optimal</span>
          </div>
          <div class="kpi-value">${patient.vitals.heartRate} <span style="font-size:1rem; font-weight:500; color:var(--text-dim);">BPM</span></div>
          <div class="kpi-label">Resting Heart Rate</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon cyan"><i data-lucide="activity"></i></div>
            <span class="kpi-trend positive">Normal</span>
          </div>
          <div class="kpi-value">${patient.vitals.bloodPressure}</div>
          <div class="kpi-label">Blood Pressure (mmHg)</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon purple"><i data-lucide="wind"></i></div>
            <span class="kpi-trend positive">99%</span>
          </div>
          <div class="kpi-value">${patient.vitals.spo2}%</div>
          <div class="kpi-label">Blood Oxygen (SpO2)</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon amber"><i data-lucide="award"></i></div>
            <span class="badge badge-success" style="font-size:0.7rem;">Good Standing</span>
          </div>
          <div class="kpi-value">${patient.healthScore} <span style="font-size:1rem; color:var(--text-dim);">/ 100</span></div>
          <div class="kpi-label">Overall Health Score</div>
        </div>
      </div>

      <!-- Live ECG Telemetry Mini Widget -->
      <div class="ecg-screen-card" style="margin-bottom:1.5rem;">
        <div class="ecg-hud-top">
          <div style="display:flex; align-items:center; gap:0.5rem; color:var(--primary-light);">
            <span class="pulse-dot"></span>
            <strong>LEAD II CARDIAC TELEMETRY • LIVE OSCILLOSCOPE</strong>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="window.audioService.toggleTelemetryBeep(this)">
              <i data-lucide="volume-x"></i> Audio Monitor
            </button>
            <span style="font-family:var(--font-mono); color:var(--text-dim); font-size:0.75rem;">FILTER: 0.05-150Hz</span>
          </div>
        </div>
        <div class="ecg-canvas-wrapper">
          <canvas id="patient-ecg-canvas"></canvas>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem;">
        <!-- Upcoming Appointments -->
        <div class="glass-card">
          <div class="card-header">
            <div class="card-title">
              <div class="card-title-icon"><i data-lucide="calendar"></i></div>
              Upcoming Consultations
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.patientPanel.switchSubTab('booking')">
              + New Booking
            </button>
          </div>

          ${appointments.length === 0 ? `
            <div style="text-align:center; padding:1.5rem; color:var(--text-dim);">No upcoming appointments scheduled.</div>
          ` : appointments.map(apt => `
            <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.25rem;">
                  <span class="badge ${apt.isTelehealth ? 'badge-purple' : 'badge-info'}">${apt.type}</span>
                  <span style="font-size:0.75rem; color:var(--text-dim);">${apt.date} • ${apt.time}</span>
                </div>
                <h5 style="font-size:0.95rem; color:var(--text-main);">${apt.doctorName}</h5>
                <p style="font-size:0.78rem; color:var(--primary-light);">${apt.department}</p>
              </div>

              <div>
                ${apt.isTelehealth ? `
                  <button class="btn btn-primary btn-sm" onclick="window.telehealth.startConsultation('${apt.id}')">
                    <i data-lucide="video"></i> Join Telehealth Room
                  </button>
                ` : `
                  <span class="badge badge-success">Wing A - Confirmed</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Daily Medication Adherence -->
        <div class="glass-card">
          <div class="card-header">
            <div class="card-title">
              <div class="card-title-icon"><i data-lucide="check-square"></i></div>
              Daily Medication Adherence
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${reminders.map(m => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface-elevated); padding:0.75rem 1rem; border-radius:10px; border:1px solid var(--border-glass);">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <input type="checkbox" ${m.taken ? 'checked' : ''} 
                         style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;"
                         onchange="window.patientPanel.togglePill('${m.id}', this.checked)">
                  <div>
                    <div style="font-size:0.85rem; font-weight:600; color:${m.taken ? 'var(--text-dim)' : 'var(--text-main)'}; text-decoration:${m.taken ? 'line-through' : 'none'};">
                      ${m.name}
                    </div>
                    <div style="font-size:0.72rem; color:var(--text-dim);">${m.slotName} • ${m.time}</div>
                  </div>
                </div>
                <span class="badge ${m.taken ? 'badge-success' : 'badge-warning'}" style="font-size:0.7rem;">
                  ${m.taken ? 'Taken' : 'Due'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  togglePill(medId, taken) {
    const med = window.clinicState.data.medicationReminders.find(m => m.id === medId);
    if (med) {
      med.taken = taken;
      window.clinicState.persist();
      if (taken && window.audioService) window.audioService.playSuccessChime();
      this.render();
    }
  }

  renderBookingTab() {
    const doctors = window.clinicState.data.doctors || SEED_DATA.doctors;
    const depts = window.clinicState.data.departments || SEED_DATA.departments;

    return `
      <div class="glass-card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="search"></i></div>
            Find Specialist Doctors & Schedule
          </div>
        </div>

        <div class="search-filter-bar">
          <div class="search-input-wrapper">
            <i data-lucide="search"></i>
            <input type="text" id="doc-search-input" class="form-control" placeholder="Search doctor name, specialty, or condition..." oninput="window.patientPanel.filterDoctors()">
          </div>
          <select id="doc-dept-filter" class="form-control" style="width:220px;" onchange="window.patientPanel.filterDoctors()">
            <option value="All">All Departments</option>
            ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;" id="doctors-cards-grid">
          ${this.renderDoctorsGrid(doctors)}
        </div>
      </div>
    `;
  }

  renderDoctorsGrid(doctors) {
    return doctors.map(doc => `
      <div class="tilt-card" style="background:var(--bg-surface-elevated); border:1px solid var(--border-glass); border-radius:14px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; gap:0.85rem; align-items:center; margin-bottom:0.75rem;">
            <img src="${doc.avatar}" style="width:62px; height:62px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
            <div>
              <h4 style="font-size:1.05rem; color:var(--text-main);">${doc.name}</h4>
              <p style="font-size:0.78rem; color:var(--primary-light);">${doc.title}</p>
              <div style="font-size:0.72rem; color:var(--text-dim); margin-top:2px;">${doc.department}</div>
            </div>
          </div>

          <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin-bottom:0.75rem;">
            ${doc.bio}
          </p>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-top:1px solid var(--border-glass); font-size:0.78rem;">
            <span style="color:var(--text-dim);"><i data-lucide="star" style="width:13px; color:#F59E0B;"></i> <strong>${doc.rating}</strong> (${doc.reviewsCount} reviews)</span>
            <span style="color:var(--text-main); font-family:var(--font-mono); font-weight:700;">Fee: $${doc.fee}</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.85rem;">
          <button class="btn btn-outline btn-sm" onclick="window.patientPanel.openBookingModal('${doc.id}', '', true)">
            <i data-lucide="video"></i> Telehealth
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.patientPanel.openBookingModal('${doc.id}', '', false)">
            <i data-lucide="calendar"></i> In-Clinic
          </button>
        </div>
      </div>
    `).join('');
  }

  filterDoctors() {
    const q = document.getElementById('doc-search-input')?.value.toLowerCase() || '';
    const deptId = document.getElementById('doc-dept-filter')?.value || 'All';
    let docs = window.clinicState.data.doctors || SEED_DATA.doctors;

    if (deptId !== 'All') {
      docs = docs.filter(d => d.deptId === deptId);
    }
    if (q) {
      docs = docs.filter(d => d.name.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.department.toLowerCase().includes(q));
    }

    const grid = document.getElementById('doctors-cards-grid');
    if (grid) {
      grid.innerHTML = this.renderDoctorsGrid(docs);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  openBookingModal(doctorId = null, defaultNotes = '', isTelehealth = true) {
    const doctors = window.clinicState.data.doctors || SEED_DATA.doctors;
    const selectedDoc = doctorId ? doctors.find(d => d.id === doctorId) : doctors[0];

    let modal = document.getElementById('appointment-booking-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'appointment-booking-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:620px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="card-title-icon"><i data-lucide="calendar-plus"></i></div>
            <h3 class="modal-title">Schedule Clinical Consultation</h3>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('appointment-booking-modal').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select Physician</label>
            <select id="book-doc-select" class="form-control" onchange="window.patientPanel.updateDoctorSlotsInModal(this.value)">
              ${doctors.map(d => `<option value="${d.id}" ${d.id === selectedDoc.id ? 'selected' : ''}>${d.name} — ${d.department} (Fee: $${d.fee})</option>`).join('')}
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Consultation Mode</label>
              <select id="book-type-select" class="form-control">
                <option value="Teleconsultation (Video)" ${isTelehealth ? 'selected' : ''}>Telehealth Video Call (HD)</option>
                <option value="In-Clinic Consultation" ${!isTelehealth ? 'selected' : ''}>In-Clinic In-Person</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Date</label>
              <input type="date" id="book-date-input" class="form-control" value="2026-08-15">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Available Time Slot</label>
            <select id="book-slot-select" class="form-control">
              ${selectedDoc.slots.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Symptoms / Reason for Visit</label>
            <textarea id="book-symptoms-input" class="form-control" rows="2" placeholder="Briefly describe your symptoms or reason for visit...">${defaultNotes}</textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('appointment-booking-modal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.patientPanel.confirmBooking()">
            <i data-lucide="check"></i> Confirm Appointment
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  updateDoctorSlotsInModal(doctorId) {
    const doc = (window.clinicState.data.doctors || SEED_DATA.doctors).find(d => d.id === doctorId);
    const slotSelect = document.getElementById('book-slot-select');
    if (doc && slotSelect) {
      slotSelect.innerHTML = doc.slots.map(s => `<option value="${s}">${s}</option>`).join('');
    }
  }

  confirmBooking() {
    const docId = document.getElementById('book-doc-select').value;
    const doc = (window.clinicState.data.doctors || SEED_DATA.doctors).find(d => d.id === docId);
    const date = document.getElementById('book-date-input').value;
    const time = document.getElementById('book-slot-select').value;
    const type = document.getElementById('book-type-select').value;
    const symptoms = document.getElementById('book-symptoms-input').value;
    const isTelehealth = type.includes('Teleconsultation') || type.includes('Video');

    const currentUser = window.clinicState.getCurrentUser();

    window.clinicState.addAppointment({
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date,
      time,
      type,
      symptoms,
      fee: doc.fee,
      isTelehealth
    });

    document.getElementById('appointment-booking-modal').classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    this.render();
  }

  renderVitalsTab(patient) {
    return `
      <div class="glass-card" style="margin-bottom:1.5rem;">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="activity"></i></div>
            4D Continuous Health Vitals Telemetry
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.patientPanel.openAddVitalsModal('${patient.id}')">
            <i data-lucide="plus-circle"></i> Log New Vitals
          </button>
        </div>

        <div class="ecg-screen-card" style="margin-bottom:1.5rem;">
          <div class="ecg-hud-top">
            <div style="color:var(--primary-light); font-weight:700;">
              <span class="pulse-dot"></span> CONTINUOUS LEAD-II CARDIAC MONITOR
            </div>
            <div style="color:var(--text-dim);">
              HEART RATE: <strong>${patient.vitals.heartRate} BPM</strong>
            </div>
          </div>
          <div class="ecg-canvas-wrapper">
            <canvas id="patient-ecg-canvas"></canvas>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Blood Pressure</div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main);">${patient.vitals.bloodPressure} <span style="font-size:0.8rem; font-weight:400;">mmHg</span></div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Blood Glucose</div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main);">${patient.vitals.glucose} <span style="font-size:0.8rem; font-weight:400;">mg/dL</span></div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Blood Oxygen (SpO2)</div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main);">${patient.vitals.spo2} <span style="font-size:0.8rem; font-weight:400;">%</span></div>
          </div>
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <div style="font-size:0.75rem; color:var(--text-dim);">Body Temperature</div>
            <div style="font-size:1.5rem; font-weight:700; color:var(--text-main);">${patient.vitals.temperature} <span style="font-size:0.8rem; font-weight:400;">°F</span></div>
          </div>
        </div>

        <h4 style="font-size:1rem; margin-bottom:0.75rem;">Historical Vitals Logs</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date Recorded</th>
                <th>Heart Rate (BPM)</th>
                <th>Blood Pressure</th>
                <th>Blood Glucose</th>
                <th>SpO2</th>
                <th>Body Temp</th>
              </tr>
            </thead>
            <tbody>
              ${(patient.vitalsHistory || []).map(h => `
                <tr>
                  <td><strong>${h.date}</strong></td>
                  <td>${h.hr} bpm</td>
                  <td>${h.bp}</td>
                  <td>${h.glucose} mg/dL</td>
                  <td>${h.spo2}%</td>
                  <td>${h.temp} °F</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openAddVitalsModal(patientId) {
    let modal = document.getElementById('add-vitals-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-vitals-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:500px;">
        <div class="modal-header">
          <h3 class="modal-title">Log Today's Health Vitals</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-vitals-modal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Heart Rate (BPM)</label>
              <input type="number" id="vital-hr-input" class="form-control" value="74">
            </div>
            <div class="form-group">
              <label class="form-label">Blood Pressure (Systolic/Diastolic)</label>
              <input type="text" id="vital-bp-input" class="form-control" value="120/80">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Blood Glucose (mg/dL)</label>
              <input type="number" id="vital-gluc-input" class="form-control" value="95">
            </div>
            <div class="form-group">
              <label class="form-label">SpO2 Oxygen (%)</label>
              <input type="number" id="vital-spo2-input" class="form-control" value="99">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('add-vitals-modal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.patientPanel.saveNewVitals('${patientId}')">
            <i data-lucide="check"></i> Save Vitals
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  saveNewVitals(patientId) {
    const hr = parseInt(document.getElementById('vital-hr-input').value) || 72;
    const bp = document.getElementById('vital-bp-input').value || '120/80';
    const gluc = parseInt(document.getElementById('vital-gluc-input').value) || 95;
    const spo2 = parseInt(document.getElementById('vital-spo2-input').value) || 99;

    window.clinicState.updatePatientVitals(patientId, {
      heartRate: hr,
      bloodPressure: bp,
      glucose: gluc,
      spo2: spo2
    });

    document.getElementById('add-vitals-modal').classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    this.render();
  }

  renderPrescriptionsTab(patient) {
    const rxList = (window.clinicState.data.prescriptions || []).filter(r => r.patientId === patient.id);

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="pill"></i></div>
            Electronic Prescriptions & Regimens
          </div>
        </div>

        ${rxList.map(rx => `
          <div style="background:var(--bg-surface-elevated); padding:1.25rem; border-radius:14px; border:1px solid var(--border-glass); margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <span class="badge badge-success">Active Regimen</span>
                <span style="font-size:0.75rem; color:var(--text-dim); margin-left:0.5rem;">Rx #${rx.id} • Issued: ${rx.date}</span>
                <h4 style="font-size:1.1rem; color:var(--text-main); margin-top:0.25rem;">Diagnosis: ${rx.diagnosis}</h4>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.8rem; font-weight:700; color:var(--primary-light);">${rx.doctorName}</div>
                <div style="font-size:0.72rem; color:var(--text-dim);">Attending Physician</div>
              </div>
            </div>

            <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem;">
              ${rx.medicines.map(m => `
                <div style="background:rgba(255,255,255,0.03); padding:0.75rem 1rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                  <div>
                    <strong style="color:var(--text-main); font-size:0.9rem;">${m.name}</strong>
                    <div style="font-size:0.78rem; color:var(--text-muted);">${m.frequency} • ${m.timing} (${m.duration})</div>
                    <div style="font-size:0.72rem; color:var(--text-dim);">${m.instructions}</div>
                  </div>
                  <span class="badge badge-info">${m.dosage}</span>
                </div>
              `).join('')}
            </div>

            <div style="background:rgba(16, 185, 129, 0.08); padding:0.75rem 1rem; border-radius:8px; margin-top:0.75rem; font-size:0.82rem; color:var(--text-main);">
              <strong>Physician Advice:</strong> ${rx.advice}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; font-size:0.75rem; color:var(--text-dim);">
              <span>${rx.signature}</span>
              <button class="btn btn-outline btn-sm" onclick="alert('Downloading signed prescription PDF...')">
                <i data-lucide="download"></i> Download Rx PDF
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDiagnosticsTab(patient) {
    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="flask-conical"></i></div>
            Diagnostic Test Orders & Imaging Reports
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.diagnostics.openOrderTestModal()">
            <i data-lucide="plus"></i> Order New Lab Test
          </button>
        </div>
        <div id="patient-diagnostics-container"></div>
      </div>
    `;
  }

  renderBillingTab(patient) {
    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="receipt"></i></div>
            Billing Statements & Insurance Settlements
          </div>
        </div>
        <div id="patient-billing-container"></div>
      </div>
    `;
  }
}

window.patientPanel = new PatientPanel();
