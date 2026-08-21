/**
 * ClinicOS: Patient Portal & Health Hub
 * Comprehensive Patient Dashboard, Find Doctors & Video Consult, Newborn & Child Vaccination Portal,
 * Vitals Monitor, Digital Prescriptions, Lab Reports, and Billing.
 */

class PatientPanel {
  constructor() {
    this.activeSubTab = 'dashboard'; // dashboard | booking | vaccination | vitals | prescriptions | diagnostics | billing
    this.selectedBabyId = 'baby-001';
    this.ecgSimulator = null;
  }

  render() {
    const container = document.getElementById('patient-view');
    if (!container) return;

    const user = window.clinicState.getCurrentUser();
    const state = window.clinicState.data;
    const patient = (state.patients && state.patients.find(p => p.id === user.id)) || state.patients[0];
    const babyCount = (state.newborns || []).length;

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Top Patient Greeting Card -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; box-shadow:var(--shadow-card);">
          <div style="display:flex; align-items:center; gap:1rem;">
            <img src="${patient.avatar}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
            <div>
              <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-navy);">Welcome back, ${patient.name}</h1>
              <p style="font-size:0.82rem; color:var(--text-dim);">
                ClinicOS Patient ID: <strong>#${patient.id}</strong> • Blood Group: <strong>${patient.bloodGroup}</strong> • Age: <strong>${patient.age} yrs</strong>
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-outline-orange" onclick="window.patientPanel.switchSubTab('vaccination')">
              <i data-lucide="baby"></i> Newborn Vaccination (${babyCount})
            </button>
            <button class="btn btn-primary" onclick="window.telehealth.startInstantConsultation('General Physician')">
              <i data-lucide="video"></i> Instant 24/7 Video Consult
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Patient Sidebar Nav -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Patient Health Hub</div>
            <div class="portal-nav-link ${this.activeSubTab === 'dashboard' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('dashboard')">
              <i data-lucide="layout-dashboard"></i> Overview & Appointments
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'vaccination' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('vaccination')">
              <i data-lucide="baby"></i> Newborn Vaccination
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'booking' ? 'active' : ''}" onclick="window.patientPanel.switchSubTab('booking')">
              <i data-lucide="stethoscope"></i> Find Doctors & Video Call
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

    if (this.activeSubTab === 'vitals' || this.activeSubTab === 'dashboard') {
      setTimeout(() => {
        if (this.ecgSimulator && this.ecgSimulator.destroy) this.ecgSimulator.destroy();
        if (window.ECGCanvasSimulator) {
          this.ecgSimulator = new ECGCanvasSimulator('patient-ecg-canvas');
        }
      }, 50);
    }
  }

  switchSubTab(subTab) {
    this.activeSubTab = subTab;
    this.render();
  }

  renderSubTabContent(patient) {
    const state = window.clinicState.data;
    const appointments = (state.appointments || []).filter(a => a.patientId === patient.id || a.patientId === 'pat-1');
    const prescriptions = (state.prescriptions || []).filter(p => p.patientId === patient.id || p.patientId === 'pat-1');
    const diagnostics = state.diagnostics || [];
    const newborns = state.newborns || [];

    // ══ SUBTAB: NEWBORN & CHILD VACCINATION REGISTRATION ══
    if (this.activeSubTab === 'vaccination') {
      const selectedBaby = newborns.find(b => b.id === this.selectedBabyId) || newborns[0];

      return `
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <!-- Top Info Banner -->
          <div style="background:linear-gradient(135deg, #02475b 0%, #002d3d 100%); border-radius:var(--radius-lg); padding:1.5rem; color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:0.4rem; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#34d399; font-size:0.72rem; font-weight:700; padding:3px 10px; border-radius:var(--radius-pill); margin-bottom:0.4rem;">
                <span class="pulse-dot"></span> UNIVERSAL DIGITAL NEWBORN IMMUNIZATION
              </div>
              <h2 style="color:#ffffff; font-size:1.45rem; font-weight:800;">Digital Newborn Baby Vaccination Portal</h2>
              <p style="color:#cbd5e1; font-size:0.84rem; max-width:620px; line-height:1.45; margin-top:2px;">
                Register newborn babies online from hospital or home in 2 minutes. Generates automated lifelong vaccination roadmap, reminders, and digital QR-verified immunization passport. Eliminates manual door-to-door paper surveys!
              </p>
            </div>

            <button class="btn btn-primary" onclick="window.patientPanel.openNewbornRegistrationModal()">
              <i data-lucide="plus-circle"></i> + Register New Baby
            </button>
          </div>

          <!-- Registered Babies Selector Tabs -->
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-dim);">Select Registered Child:</span>
            ${newborns.map(b => `
              <button class="btn ${b.id === (selectedBaby ? selectedBaby.id : '') ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="window.patientPanel.selectBaby('${b.id}')">
                <i data-lucide="baby"></i> ${b.babyName} (${b.gender})
              </button>
            `).join('')}
          </div>

          ${selectedBaby ? `
            <!-- Child Details & Immunization Overview Card -->
            <div class="card" style="border-left:4px solid var(--primary);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid var(--border-subtle); padding-bottom:1rem; margin-bottom:1.25rem;">
                <div style="display:flex; gap:1rem; align-items:center;">
                  <div style="width:54px; height:54px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                    👶
                  </div>
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-navy);">${selectedBaby.babyName}</h3>
                      <span class="badge badge-primary">ID #${selectedBaby.id}</span>
                      <span class="badge badge-success">✓ Digital Vault Active</span>
                    </div>
                    <p style="font-size:0.8rem; color:var(--text-dim); margin-top:2px;">
                      DOB: <strong>${selectedBaby.dob}</strong> • Gender: <strong>${selectedBaby.gender}</strong> • Birth Weight: <strong>${selectedBaby.birthWeight}</strong> • Blood: <strong>${selectedBaby.bloodGroup}</strong>
                    </p>
                  </div>
                </div>

                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-outline btn-sm" onclick="window.patientPanel.downloadVaccineCertificate('${selectedBaby.id}')">
                    <i data-lucide="file-check"></i> Download Vaccine Passport (PDF)
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="window.patientPanel.bookHomeVaccination('${selectedBaby.id}')">
                    <i data-lucide="home"></i> Book Doorstep Nurse Dose
                  </button>
                </div>
              </div>

              <!-- Parent & Registration Info Bar -->
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-bottom:1.5rem;">
                <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Parents</div>
                  <div style="font-size:0.85rem; font-weight:700; color:var(--text-navy); margin-top:2px;">
                    Mother: ${selectedBaby.motherName} • Father: ${selectedBaby.fatherName}
                  </div>
                </div>

                <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Delivery Center / Hospital</div>
                  <div style="font-size:0.85rem; font-weight:700; color:var(--text-navy); margin-top:2px;">
                    ${selectedBaby.deliveryPlace}
                  </div>
                </div>

                <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Assigned Primary Care Address</div>
                  <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">
                    ${selectedBaby.address} • Ph: ${selectedBaby.phone}
                  </div>
                </div>
              </div>

              <!-- Vaccination Schedule Table / Roadmap -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-navy);">
                  National Universal Immunization Schedule & History
                </h4>
                <span class="badge badge-info">
                  ${(selectedBaby.vaccines || []).filter(v => v.status === 'Completed').length} / ${(selectedBaby.vaccines || []).length} Doses Administered
                </span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                ${(selectedBaby.vaccines || []).map((v, i) => {
                  const isDone = v.status === 'Completed';
                  const isUpcoming = v.status === 'Upcoming';

                  return `
                    <div style="background:var(--bg-subtle); padding:0.85rem 1.1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                      <div style="display:flex; align-items:center; gap:0.85rem;">
                        <div style="width:32px; height:32px; border-radius:50%; background:${isDone ? 'var(--apollo-green-light)' : isUpcoming ? 'var(--primary-light)' : 'var(--border-subtle)'}; color:${isDone ? '#059669' : isUpcoming ? 'var(--primary)' : 'var(--text-dim)'}; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem;">
                          ${isDone ? '✓' : i + 1}
                        </div>
                        <div>
                          <strong style="color:var(--text-navy); font-size:0.9rem;">${v.name}</strong>
                          <div style="font-size:0.76rem; color:var(--text-dim);">Due Age: <strong>${v.ageDue}</strong> • ${v.dateAdministered} ${v.batchNo !== '-' ? `(Batch #${v.batchNo})` : ''}</div>
                        </div>
                      </div>

                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span class="badge ${isDone ? 'badge-success' : isUpcoming ? 'badge-warning' : 'badge-primary'}">${v.status}</span>
                        ${!isDone ? `
                          <button class="btn btn-outline btn-sm" onclick="window.patientPanel.bookVaccineSlot('${selectedBaby.id}', '${v.name}')">
                            <i data-lucide="calendar"></i> Book Slot
                          </button>
                        ` : `
                          <span style="font-size:0.75rem; color:#059669; font-weight:700;">Stamped by MD ✓</span>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : `
            <div class="card" style="text-align:center; padding:3rem;">
              <p style="color:var(--text-dim);">No newborn registered yet. Click "Register New Baby" above to start!</p>
            </div>
          `}
        </div>
      `;
    }

    if (this.activeSubTab === 'dashboard') {
      return `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <!-- 24x7 Quick Video Call Banner -->
          <div style="background:linear-gradient(135deg, var(--primary) 0%, #ff7a38 100%); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; box-shadow:var(--shadow-orange);">
            <div>
              <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; background:rgba(0,0,0,0.15); padding:2px 8px; border-radius:var(--radius-pill); display:inline-block; margin-bottom:0.35rem;">
                ⚡ Average Wait Time: < 2 Minutes
              </div>
              <h3 style="color:#ffffff; font-size:1.25rem; font-weight:800;">Consult a ClinicOS Doctor via Video Now</h3>
              <p style="color:#fff3ec; font-size:0.82rem; margin-top:2px;">Get instant digital prescription and fast medicine doorstep delivery.</p>
            </div>
            <button class="btn btn-secondary btn-sm" style="background:#ffffff; color:var(--primary); border:none; font-weight:800; padding:0.65rem 1.25rem;" onclick="window.telehealth.startInstantConsultation('General Physician')">
              <i data-lucide="video"></i> Start Video Call
            </button>
          </div>

          <!-- Quick Vitals Bar -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
            <div class="card" style="padding:1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Heart Rate</div>
              <div style="font-size:1.4rem; font-weight:800; color:var(--text-navy); margin-top:0.25rem;">
                <span style="color:#ef4444;">❤️</span> ${patient.vitals ? patient.vitals.heartRate : 74} <span style="font-size:0.75rem; font-weight:600; color:var(--text-dim);">bpm</span>
              </div>
              <div style="font-size:0.7rem; color:#10b981; margin-top:2px;">● Normal Sinus</div>
            </div>

            <div class="card" style="padding:1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Blood Pressure</div>
              <div style="font-size:1.4rem; font-weight:800; color:var(--text-navy); margin-top:0.25rem;">
                <span style="color:#0ea5e9;">📊</span> ${patient.vitals ? patient.vitals.bloodPressure : '120/80'} <span style="font-size:0.75rem; font-weight:600; color:var(--text-dim);">mmHg</span>
              </div>
              <div style="font-size:0.7rem; color:#10b981; margin-top:2px;">● Optimal</div>
            </div>

            <div class="card" style="padding:1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Oxygen (SpO2)</div>
              <div style="font-size:1.4rem; font-weight:800; color:var(--text-navy); margin-top:0.25rem;">
                <span style="color:#10b981;">💨</span> ${patient.vitals ? patient.vitals.spo2 : 99} <span style="font-size:0.75rem; font-weight:600; color:var(--text-dim);">%</span>
              </div>
              <div style="font-size:0.7rem; color:#10b981; margin-top:2px;">● Excellent</div>
            </div>

            <div class="card" style="padding:1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Body Temp</div>
              <div style="font-size:1.4rem; font-weight:800; color:var(--text-navy); margin-top:0.25rem;">
                <span style="color:#f59e0b;">🌡️</span> ${patient.vitals ? patient.vitals.temperature : '98.6'} <span style="font-size:0.75rem; font-weight:600; color:var(--text-dim);">°F</span>
              </div>
              <div style="font-size:0.7rem; color:#10b981; margin-top:2px;">● Normal</div>
            </div>
          </div>

          <!-- Appointments List -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-navy);">Your Scheduled Appointments</h2>
              <button class="btn btn-outline btn-sm" onclick="window.patientPanel.switchSubTab('booking')">
                <i data-lucide="plus"></i> Book New
              </button>
            </div>

            ${appointments.length === 0 ? `
              <div class="card" style="text-align:center; padding:2rem; color:var(--text-dim);">
                No upcoming appointments. Click above to book an instant video consultation!
              </div>
            ` : appointments.map(apt => {
              const doc = (state.doctors && state.doctors.find(d => d.id === apt.doctorId)) || state.doctors[0];
              const isCompleted = apt.status === 'Completed';

              return `
                <div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:1.25rem; margin-bottom:0.85rem; flex-wrap:wrap;">
                  <div style="display:flex; gap:1rem; align-items:center;">
                    <img src="${doc.avatar}" style="width:52px; height:52px; border-radius:50%; object-fit:cover;">
                    <div>
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <strong style="font-size:1.05rem; color:var(--text-navy);">${doc.name}</strong>
                        <span class="badge badge-primary">${apt.department}</span>
                        <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}">${apt.status}</span>
                      </div>
                      <p style="font-size:0.8rem; color:var(--text-dim); margin-top:2px;">
                        Date: <strong>${apt.date}</strong> at <strong>${apt.time}</strong> • Reason: ${apt.reason || 'Clinical Consultation'}
                      </p>
                    </div>
                  </div>

                  <div style="display:flex; gap:0.5rem;">
                    <button class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="window.telehealth.startConsultation('${apt.id}', 'PATIENT')">
                      <i data-lucide="video"></i> ${isCompleted ? 'Re-Join Call' : 'Join Video Call'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'booking') {
      const doctors = state.doctors || [];
      return `
        <div>
          <div style="margin-bottom:1.5rem;">
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-navy);">Find a Specialist Doctor</h2>
            <p style="font-size:0.82rem; color:var(--text-dim);">Consult online via instant video call in 15 minutes or schedule an in-clinic visit</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${doctors.map(doc => `
              <div class="doctor-consult-card">
                <div class="doc-info-left">
                  <div class="doc-avatar-wrap">
                    <img src="${doc.avatar}" class="doc-avatar-img" alt="${doc.name}">
                    <span class="doc-verified-badge"><i data-lucide="check" style="width:10px; height:10px;"></i></span>
                  </div>
                  <div>
                    <h3 class="doc-name">${doc.name}</h3>
                    <div class="doc-spec">${doc.title} • ${doc.department}</div>
                    <div class="doc-exp">⭐ 4.9 (420+ Reviews) • 14+ Years Experience • ClinicOS Pavilion</div>
                    <div style="margin-top:0.35rem;">
                      <span class="badge badge-success"><span class="pulse-dot"></span> Next Available: in 10 mins</span>
                    </div>
                  </div>
                </div>

                <div class="doc-action-right">
                  <div class="doc-fee-tag">₹ 799 <span style="font-size:0.75rem; color:var(--text-dim); font-weight:500;">/ Consultation</span></div>
                  <div class="doc-btn-group">
                    <button class="btn btn-outline-orange btn-sm" onclick="window.patientPanel.bookSlot('${doc.id}', '${doc.name}', '${doc.department}')">
                      <i data-lucide="calendar"></i> Book Slot
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.telehealth.startInstantConsultation('${doc.department}')">
                      <i data-lucide="video"></i> Video Consult Now
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'vitals') {
      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <h2 style="font-size:1.3rem; font-weight:800; color:var(--text-navy);">4D Continuous Vitals & ECG Telemetry</h2>
              <p style="font-size:0.82rem; color:var(--text-dim);">Live bio-sensor signal telemetry synchronized with ClinicOS Clinical Cloud</p>
            </div>
            <span class="badge badge-success"><span class="pulse-dot"></span> Live Telemetry Active</span>
          </div>

          <div style="background:#02121a; border-radius:var(--radius-lg); padding:1rem; margin-bottom:1.5rem;">
            <canvas id="patient-ecg-canvas" width="800" height="200" style="width:100%; height:200px; display:block;"></canvas>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <strong style="color:var(--text-navy); font-size:0.88rem;">Cardiac Rhythm Assessment</strong>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.3rem;">Normal Sinus Rhythm (NSR). No ST-segment elevation or ectopic premature ventricular contractions.</p>
            </div>
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <strong style="color:var(--text-navy); font-size:0.88rem;">Respiratory Quality</strong>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.3rem;">Respiration rate steady at 16 breaths/min with blood oxygen saturation consistently at 99%.</p>
            </div>
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
              <strong style="color:var(--text-navy); font-size:0.88rem;">Telemetry Export</strong>
              <button class="btn btn-outline btn-sm" style="margin-top:0.5rem; width:100%;" onclick="window.toast.show('Exported', '12-Lead ECG telemetry report downloaded in PDF format.', 'success')">
                <i data-lucide="download"></i> Download ECG PDF
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'prescriptions') {
      return `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-navy);">Your Digital Prescriptions</h2>
              <p style="font-size:0.82rem; color:var(--text-dim);">Digitally signed e-prescriptions with 1-click pharmacy order delivery</p>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${prescriptions.map(rx => `
              <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.75rem; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
                  <div>
                    <strong style="font-size:1.05rem; color:var(--text-navy);">${rx.diagnosis || 'Clinical Diagnosis'}</strong>
                    <div style="font-size:0.78rem; color:var(--text-dim);">Prescribed by <strong>${rx.doctorName}</strong> on ${rx.date || 'Recent'}</div>
                  </div>
                  <span class="badge badge-success">✓ Digitally Signed & Active</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.25rem;">
                  ${(rx.medicines || []).map(m => `
                    <div style="background:var(--bg-subtle); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong style="color:var(--text-navy); font-size:0.88rem;">${m.name}</strong>
                        <div style="font-size:0.76rem; color:var(--text-dim);">${m.dosage || 'Standard'} • ${m.frequency} • ${m.duration || '30 Days'}</div>
                      </div>
                      <button class="btn btn-outline-orange btn-sm" onclick="window.toast.show('Added to Cart', '${m.name} added to ClinicOS Pharmacy delivery cart.', 'success')">
                        <i data-lucide="shopping-cart"></i> Order Medicine
                      </button>
                    </div>
                  `).join('')}
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:var(--text-dim);">
                  <div>Advice: <em>${rx.advice || 'Follow medication schedule strictly.'}</em></div>
                  <button class="btn btn-outline btn-sm" onclick="window.toast.show('Downloading', 'Official signed prescription PDF downloaded.', 'info')">
                    <i data-lucide="download"></i> Download Rx PDF
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'diagnostics') {
      return `
        <div>
          <div style="margin-bottom:1.25rem;">
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-navy);">Diagnostic Reports & Home Lab Tests</h2>
            <p style="font-size:0.82rem; color:var(--text-dim);">NABL certified blood and pathology reports with automated health vault upload</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${diagnostics.map(d => `
              <div class="card" style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
                <div>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <strong style="font-size:1.05rem; color:var(--text-navy);">${d.testName || d.name}</strong>
                    <span class="badge badge-success">NABL Verified</span>
                  </div>
                  <p style="font-size:0.78rem; color:var(--text-dim); margin-top:2px;">
                    Date: ${d.date || 'Recent'} • Sample: Blood / Serum • Lab: ClinicOS Central Diagnostic Hub
                  </p>
                </div>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-outline btn-sm" onclick="window.toast.show('PDF Downloaded', 'Diagnostic report downloaded.', 'success')">
                    <i data-lucide="download"></i> Download Report
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="window.telehealth.startInstantConsultation('General Physician')">
                    <i data-lucide="video"></i> Consult Doctor on Report
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'billing') {
      return `
        <div class="card">
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--text-navy); margin-bottom:0.35rem;">Invoices & Payment Receipts</h2>
          <p style="font-size:0.82rem; color:var(--text-dim); margin-bottom:1.5rem;">Official healthcare invoices for insurance reimbursement and tax exemption</p>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <strong style="color:var(--text-navy);">Invoice #INV-2026-8831 (Telehealth Video Consultation)</strong>
                <div style="font-size:0.76rem; color:var(--text-dim);">Dr. Robert Chen (Cardiology) • Paid via UPI • GSTIN: 27AABCC8821F1Z5</div>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <strong style="font-size:1.1rem; color:var(--text-navy);">₹ 799.00</strong>
                <span class="badge badge-success">Paid ✓</span>
                <button class="btn btn-outline btn-sm" onclick="window.toast.show('Downloaded', 'GST Tax invoice downloaded.', 'info')">
                  <i data-lucide="download"></i> Receipt
                </button>
              </div>
            </div>

            <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <strong style="color:var(--text-navy);">Invoice #INV-2026-8794 (ClinicOS ProHealth Full Body Package)</strong>
                <div style="font-size:0.76rem; color:var(--text-dim);">Home Sample Collection • Health Insurance Reimbursable</div>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <strong style="font-size:1.1rem; color:var(--text-navy);">₹ 1,499.00</strong>
                <span class="badge badge-success">Paid ✓</span>
                <button class="btn btn-outline btn-sm" onclick="window.toast.show('Downloaded', 'Tax invoice downloaded.', 'info')">
                  <i data-lucide="download"></i> Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  selectBaby(babyId) {
    this.selectedBabyId = babyId;
    this.render();
  }

  openNewbornRegistrationModal() {
    let overlay = document.getElementById('newborn-reg-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'newborn-reg-modal-overlay';
      overlay.className = 'incoming-call-overlay';
      overlay.style.display = 'flex';
      overlay.innerHTML = `
        <div class="incoming-call-modal" style="width:620px; max-width:92vw; text-align:left; padding:2rem; max-height:88vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.85rem; margin-bottom:1.25rem;">
            <div>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-navy);">👶 Register Newborn for Vaccination</h2>
              <p style="font-size:0.78rem; color:var(--text-dim); margin-top:2px;">
                Instant online enrollment — replaces manual door-to-door surveys with digital health passport
              </p>
            </div>
            <button onclick="document.getElementById('newborn-reg-modal-overlay').style.display='none'" style="background:transparent; border:none; font-size:1.4rem; color:var(--text-dim); cursor:pointer;">&times;</button>
          </div>

          <form id="newborn-reg-form" onsubmit="event.preventDefault(); window.patientPanel.handleNewbornFormSubmit();">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Mother's Full Name *</label>
                <input type="text" id="reg-mother-name" class="form-control" placeholder="e.g. Elena Morgan" required value="Elena Morgan">
              </div>
              <div class="form-group">
                <label class="form-label">Father's Full Name *</label>
                <input type="text" id="reg-father-name" class="form-control" placeholder="e.g. Alex Morgan" required value="Alex Morgan">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Baby's Name (or Temporary Name)</label>
                <input type="text" id="reg-baby-name" class="form-control" placeholder="e.g. Liam Morgan" value="Baby Boy Morgan">
              </div>
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select id="reg-baby-gender" class="form-control">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth *</label>
                <input type="date" id="reg-baby-dob" class="form-control" required value="2026-08-15">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Birth Weight (kg)</label>
                <input type="number" step="0.1" id="reg-birth-weight" class="form-control" placeholder="e.g. 3.2" value="3.3">
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select id="reg-blood-group" class="form-control">
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Place</label>
                <input type="text" id="reg-delivery-place" class="form-control" value="ClinicOS Central Maternity">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Residential Address & Pincode (For automatic PHC & Nurse allocation) *</label>
              <input type="text" id="reg-address" class="form-control" placeholder="House No, Street, Landmark, Pincode" required value="Flat 402, Green Valley Apartments, New Delhi 110001">
            </div>

            <div class="form-group">
              <label class="form-label">Primary Mobile / WhatsApp Number (For vaccination reminder alerts) *</label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="+91 98765 43210" required value="+91 98765 43210">
            </div>

            <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md); margin-bottom:1.25rem; border:1px solid var(--border-card);">
              <strong style="font-size:0.82rem; color:var(--text-navy);">Birth Dose Immunization Status (Given at Hospital):</strong>
              <div style="display:flex; gap:1.25rem; margin-top:0.4rem; font-size:0.8rem; color:var(--text-muted);">
                <label><input type="checkbox" id="reg-dose-bcg" checked> BCG Received</label>
                <label><input type="checkbox" id="reg-dose-opv" checked> OPV-0 Received</label>
                <label><input type="checkbox" id="reg-dose-hepb" checked> Hep-B Birth Dose</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">
              <i data-lucide="check-circle-2"></i> Enroll Baby & Generate Digital Vaccine Passport
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(overlay);
    } else {
      overlay.style.display = 'flex';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  handleNewbornFormSubmit() {
    const mother = document.getElementById('reg-mother-name')?.value || 'Mother';
    const father = document.getElementById('reg-father-name')?.value || 'Father';
    const babyName = document.getElementById('reg-baby-name')?.value || `Baby of ${mother}`;
    const gender = document.getElementById('reg-baby-gender')?.value || 'Male';
    const dob = document.getElementById('reg-baby-dob')?.value || new Date().toISOString().split('T')[0];
    const weight = document.getElementById('reg-birth-weight')?.value || '3.2';
    const blood = document.getElementById('reg-blood-group')?.value || 'O+';
    const place = document.getElementById('reg-delivery-place')?.value || 'ClinicOS Hospital';
    const address = document.getElementById('reg-address')?.value || 'New Delhi';
    const phone = document.getElementById('reg-phone')?.value || '+91 98765 43210';
    const doseBCG = document.getElementById('reg-dose-bcg')?.checked;
    const doseOPV = document.getElementById('reg-dose-opv')?.checked;
    const doseHepB = document.getElementById('reg-dose-hepb')?.checked;

    const newBaby = window.clinicState.registerNewborn({
      motherName: mother,
      fatherName: father,
      babyName: babyName,
      gender: gender,
      dob: dob,
      birthWeight: weight,
      bloodGroup: blood,
      deliveryPlace: place,
      address: address,
      phone: phone,
      birthDoseBCG: doseBCG,
      birthDoseOPV: doseOPV,
      birthDoseHepB: doseHepB
    });

    const modal = document.getElementById('newborn-reg-modal-overlay');
    if (modal) modal.style.display = 'none';

    if (window.audioService && window.audioService.playSuccessChime) {
      window.audioService.playSuccessChime();
    }

    this.selectedBabyId = newBaby.id;
    window.toast.show('Newborn Registered!', `Digital immunization passport active for ${newBaby.babyName}. Lifelong schedule mapped.`, 'success');
    this.render();
  }

  downloadVaccineCertificate(babyId) {
    const state = window.clinicState.data;
    const baby = (state.newborns || []).find(b => b.id === babyId) || state.newborns[0];
    window.toast.show('Passport Downloaded', `Digital QR-Verified Vaccination Passport for ${baby.babyName} downloaded (PDF).`, 'success');
  }

  bookHomeVaccination(babyId) {
    const state = window.clinicState.data;
    const baby = (state.newborns || []).find(b => b.id === babyId) || state.newborns[0];
    window.toast.show('Doorstep Nurse Booked', `A certified pediatric nurse visit is scheduled at ${baby.address} for next dose.`, 'success');
  }

  bookVaccineSlot(babyId, vaccineName) {
    window.toast.show('Dose Slot Scheduled', `Vaccination appointment confirmed for ${vaccineName}. Reminder alert synced.`, 'success');
  }

  bookSlot(doctorId, doctorName, department) {
    const newApt = {
      id: 'apt-' + Date.now().toString().slice(-4),
      patientId: 'pat-1',
      patientName: 'Alex Morgan',
      doctorId: doctorId,
      doctorName: doctorName,
      department: department,
      date: 'Tomorrow',
      time: '10:30 AM',
      status: 'Confirmed',
      type: 'Telehealth',
      reason: 'Scheduled Video Consultation (' + department + ')'
    };

    window.clinicState.addAppointment(newApt);
    window.toast.show('Appointment Confirmed', `Scheduled video consultation with ${doctorName} for tomorrow 10:30 AM.`, 'success');
    this.switchSubTab('dashboard');
  }
}

window.patientPanel = new PatientPanel();
