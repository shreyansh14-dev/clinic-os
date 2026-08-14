/**
 * ClinicOS: Administrator Panel Module
 * Executive Analytics, Doctor & Department Control, Master Appointment Management,
 * Security Audit Log Explorer, and System Configuration.
 */

class AdminPanel {
  constructor() {
    this.activeSubTab = 'analytics'; // analytics | doctors | appointments | audit-logs | settings
    this.auditFilter = 'ALL';
  }

  render() {
    const container = document.getElementById('admin-view');
    if (!container) return;

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Admin Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.85rem;">ClinicOS Administration Control Center</h1>
            <p style="font-size:0.85rem; color:var(--text-dim);">
              Executive Hospital Operations, Role-Based Access Control (RBAC), and Compliance Audit
            </p>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <button class="btn btn-secondary" onclick="window.adminPanel.exportAuditLogs('csv')">
              <i data-lucide="download"></i> Export Audit CSV
            </button>
            <button class="btn btn-primary" onclick="window.adminPanel.openAddDoctorModal()">
              <i data-lucide="user-plus"></i> Add New Doctor
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Admin Sidebar -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Admin Operations</div>
            <div class="portal-nav-link ${this.activeSubTab === 'analytics' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('analytics')">
              <i data-lucide="bar-chart-3"></i> Operations Analytics
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'doctors' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('doctors')">
              <i data-lucide="users"></i> Doctors & Specialties
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'appointments' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('appointments')">
              <i data-lucide="calendar"></i> Master Appointments
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'audit-logs' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('audit-logs')">
              <i data-lucide="shield-check"></i> Security Audit Logs
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'settings' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('settings')">
              <i data-lucide="settings"></i> System Configuration
            </div>
          </div>

          <!-- Admin Body Content -->
          <div class="portal-body">
            ${this.renderSubTabContent()}
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

  renderSubTabContent() {
    if (this.activeSubTab === 'analytics') {
      return this.renderAnalyticsTab();
    } else if (this.activeSubTab === 'doctors') {
      return this.renderDoctorsTab();
    } else if (this.activeSubTab === 'appointments') {
      return this.renderAppointmentsTab();
    } else if (this.activeSubTab === 'audit-logs') {
      return this.renderAuditLogsTab();
    } else if (this.activeSubTab === 'settings') {
      return this.renderSettingsTab();
    }
  }

  renderAnalyticsTab() {
    const doctors = window.clinicState.data.doctors || SEED_DATA.doctors;
    const appointments = window.clinicState.data.appointments || SEED_DATA.appointments;
    const invoices = window.clinicState.data.invoices || SEED_DATA.invoices;

    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalDue, 0) + 14850;

    return `
      <!-- KPI Row -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon"><i data-lucide="dollar-sign"></i></div>
            <span class="kpi-trend positive">+14.2%</span>
          </div>
          <div class="kpi-value">$${totalRevenue.toLocaleString()}</div>
          <div class="kpi-label">Total Monthly Revenue</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon cyan"><i data-lucide="user-check"></i></div>
            <span class="kpi-trend positive">98.4%</span>
          </div>
          <div class="kpi-value">${doctors.length} Active</div>
          <div class="kpi-label">Physicians on Duty</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon purple"><i data-lucide="clock"></i></div>
            <span class="kpi-trend positive">-35% Wait</span>
          </div>
          <div class="kpi-value">4.2 min</div>
          <div class="kpi-label">Avg. Patient Wait Time</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-icon amber"><i data-lucide="bot"></i></div>
            <span class="badge badge-success">96.8% Acc</span>
          </div>
          <div class="kpi-value">1,420</div>
          <div class="kpi-label">AI Triage Consultations</div>
        </div>
      </div>

      <!-- Department Distribution & Turnaround -->
      <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:1.5rem;">
        <div class="glass-card">
          <div class="card-header">
            <div class="card-title">
              <div class="card-title-icon"><i data-lucide="activity"></i></div>
              Department Patient Load & Throughput
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            ${SEED_DATA.departments.slice(0, 5).map((d, idx) => {
              const percentages = [85, 72, 64, 58, 45];
              const pct = percentages[idx] || 50;
              return `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                    <span style="font-weight:600; color:var(--text-main);">${d.name}</span>
                    <span style="color:var(--primary-light); font-family:var(--font-mono);">${pct}% Capacity</span>
                  </div>
                  <div style="background:var(--bg-surface-elevated); height:8px; border-radius:4px; overflow:hidden;">
                    <div style="background:var(--primary-gradient); width:${pct}%; height:100%; border-radius:4px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-card">
          <div class="card-header">
            <div class="card-title">
              <div class="card-title-icon"><i data-lucide="check-circle-2"></i></div>
              Diagnostic Turnaround
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div style="background:var(--bg-surface-elevated); padding:0.9rem; border-radius:10px; border:1px solid var(--border-glass);">
              <div style="font-size:0.78rem; color:var(--text-dim);">12-Lead ECG Analysis</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--primary-light);">1.4 Hours (Target: < 2h)</div>
            </div>
            <div style="background:var(--bg-surface-elevated); padding:0.9rem; border-radius:10px; border:1px solid var(--border-glass);">
              <div style="font-size:0.78rem; color:var(--text-dim);">High-Res Brain MRI</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--secondary);">18.2 Hours (Target: < 24h)</div>
            </div>
            <div style="background:var(--bg-surface-elevated); padding:0.9rem; border-radius:10px; border:1px solid var(--border-glass);">
              <div style="font-size:0.78rem; color:var(--text-dim);">Metabolic Blood Panels</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--accent-purple);">3.1 Hours (Target: < 6h)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDoctorsTab() {
    const doctors = window.clinicState.data.doctors || SEED_DATA.doctors;

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="users"></i></div>
            Medical Staff & Doctor Roster
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.adminPanel.openAddDoctorModal()">
            <i data-lucide="plus"></i> Add Physician
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Experience / Rating</th>
                <th>Consultation Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${doctors.map(doc => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <img src="${doc.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
                      <div>
                        <strong>${doc.name}</strong>
                        <div style="font-size:0.75rem; color:var(--text-dim);">${doc.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>${doc.department}</td>
                  <td>
                    <div>${doc.experience}</div>
                    <div style="font-size:0.75rem; color:#F59E0B;">★ ${doc.rating} (${doc.reviewsCount})</div>
                  </td>
                  <td><strong style="font-family:var(--font-mono);">$${doc.fee}</strong></td>
                  <td><span class="badge badge-success">${doc.status || 'Active'}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="alert('Editing profile for ${doc.name}...')">
                      <i data-lucide="edit"></i> Edit
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

  renderAppointmentsTab() {
    const appointments = window.clinicState.data.appointments || SEED_DATA.appointments;

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="calendar"></i></div>
            Global Appointment Controller
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Apt ID</th>
                <th>Patient</th>
                <th>Physician / Dept</th>
                <th>Date & Time</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${appointments.map(apt => `
                <tr>
                  <td><strong style="font-family:var(--font-mono);">#${apt.id}</strong></td>
                  <td>${apt.patientName}</td>
                  <td>
                    <strong>${apt.doctorName}</strong>
                    <div style="font-size:0.75rem; color:var(--primary-light);">${apt.department}</div>
                  </td>
                  <td>${apt.date} • ${apt.time}</td>
                  <td><span class="badge ${apt.isTelehealth ? 'badge-purple' : 'badge-info'}">${apt.type}</span></td>
                  <td><span class="badge ${apt.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}">${apt.status}</span></td>
                  <td>
                    <div style="display:flex; gap:0.3rem;">
                      <button class="btn btn-secondary btn-sm" onclick="window.adminPanel.rescheduleAppointment('${apt.id}')">Reschedule</button>
                      <button class="btn btn-danger btn-sm" onclick="window.adminPanel.cancelAppointment('${apt.id}')">Cancel</button>
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

  rescheduleAppointment(aptId) {
    const newTime = prompt('Enter new appointment time slot (e.g. 03:30 PM):', '03:30 PM');
    if (newTime) {
      const apt = window.clinicState.data.appointments.find(a => a.id === aptId);
      if (apt) {
        apt.time = newTime;
        window.clinicState.logAudit('APPOINTMENT_RESCHEDULED', `Admin rescheduled Apt #${aptId} to ${newTime}`, `Apt #${aptId}`);
        window.clinicState.persist();
        if (window.audioService) window.audioService.playSuccessChime();
        this.render();
      }
    }
  }

  cancelAppointment(aptId) {
    if (confirm(`Are you sure you want to cancel appointment #${aptId}?`)) {
      window.clinicState.updateAppointmentStatus(aptId, 'Cancelled');
      if (window.audioService) window.audioService.playWarningAlert();
      this.render();
    }
  }

  renderAuditLogsTab() {
    let logs = window.clinicState.data.auditLogs || [];
    if (this.auditFilter !== 'ALL') {
      logs = logs.filter(l => l.role === this.auditFilter);
    }

    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="shield-check"></i></div>
            Compliance & Security Audit Trail
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <select class="form-control" style="width:160px;" onchange="window.adminPanel.filterAudit(this.value)">
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin Only</option>
              <option value="DOCTOR">Doctor Only</option>
              <option value="PATIENT">Patient Only</option>
            </select>
            <button class="btn btn-secondary btn-sm" onclick="window.adminPanel.exportAuditLogs('csv')">
              <i data-lucide="download"></i> CSV
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Log ID / Timestamp</th>
                <th>Actor & Role</th>
                <th>Action Performed</th>
                <th>Resource Target</th>
                <th>IP Address</th>
                <th>Audit Details</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(log => `
                <tr>
                  <td>
                    <strong style="font-family:var(--font-mono); font-size:0.75rem;">${log.id}</strong>
                    <div style="font-size:0.72rem; color:var(--text-dim);">${log.timestamp}</div>
                  </td>
                  <td>
                    <strong>${log.user}</strong>
                    <div><span class="badge ${log.role === 'ADMIN' ? 'badge-danger' : log.role === 'DOCTOR' ? 'badge-purple' : 'badge-info'}" style="font-size:0.65rem;">${log.role}</span></div>
                  </td>
                  <td><span class="badge badge-success" style="font-family:var(--font-mono); font-size:0.72rem;">${log.action}</span></td>
                  <td><strong style="color:var(--primary-light);">${log.resource}</strong></td>
                  <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${log.ip}</span></td>
                  <td style="font-size:0.8rem; color:var(--text-muted); max-width:280px;">${log.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  filterAudit(role) {
    this.auditFilter = role;
    this.render();
  }

  exportAuditLogs(format) {
    const logs = window.clinicState.data.auditLogs || [];
    if (format === 'csv') {
      let csvContent = 'data:text/csv;charset=utf-8,ID,Timestamp,User,Role,Action,Resource,IP,Details\n';
      logs.forEach(l => {
        csvContent += `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.resource}","${l.ip}","${l.details}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ClinicOS_Audit_Trail_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  openAddDoctorModal() {
    let modal = document.getElementById('add-doctor-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-doctor-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:580px;">
        <div class="modal-header">
          <h3 class="modal-title">Onboard New Medical Practitioner</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-doctor-modal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Full Name & Title</label>
            <input type="text" id="new-doc-name" class="form-control" placeholder="Dr. Jonathan Reed, MD">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">Department</label>
              <select id="new-doc-dept" class="form-control">
                ${SEED_DATA.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Consultation Fee ($)</label>
              <input type="number" id="new-doc-fee" class="form-control" value="110">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Medical Credentials & Education</label>
            <input type="text" id="new-doc-edu" class="form-control" placeholder="Stanford School of Medicine">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('add-doctor-modal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.adminPanel.confirmAddDoctor()">
            <i data-lucide="check"></i> Add Doctor to Roster
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  confirmAddDoctor() {
    const name = document.getElementById('new-doc-name').value || 'Dr. Jonathan Reed';
    const dept = document.getElementById('new-doc-dept').value;
    const fee = parseInt(document.getElementById('new-doc-fee').value) || 110;
    const edu = document.getElementById('new-doc-edu').value || 'Medical Board Certified';

    const newDoc = {
      id: 'doc-' + (window.clinicState.data.doctors.length + 1),
      name,
      title: 'Attending Physician',
      deptId: 'dept-genmed',
      department: dept,
      experience: '10 years',
      rating: 5.0,
      reviewsCount: 1,
      fee,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@clinicos.health`,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      bio: 'Board-certified specialist dedicated to comprehensive patient care.',
      education: edu,
      status: 'Active'
    };

    window.clinicState.data.doctors.push(newDoc);
    window.clinicState.logAudit('DOCTOR_ONBOARD', `Onboarded new physician: ${name} to ${dept}`, `Doctor ID: ${newDoc.id}`);
    window.clinicState.persist();

    document.getElementById('add-doctor-modal').classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    alert(`Physician ${name} has been added successfully!`);
    this.render();
  }

  renderSettingsTab() {
    return `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-title-icon"><i data-lucide="settings"></i></div>
            Hospital System Parameters & Security Config
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
          <div class="form-group">
            <label class="form-label">Healthcare Facility Name</label>
            <input type="text" class="form-control" value="ClinicOS Smart Medical Center">
          </div>
          <div class="form-group">
            <label class="form-label">Emergency Hotline Telemetry</label>
            <input type="text" class="form-control" value="+1 (800) 555-CLINIC">
          </div>
          <div class="form-group">
            <label class="form-label">WebRTC Video Bitrate Target</label>
            <input type="text" class="form-control" value="2500 kbps (1080p 60fps)">
          </div>
          <div class="form-group">
            <label class="form-label">Audit Retention Period</label>
            <input type="text" class="form-control" value="7 Years (HIPAA Standard)">
          </div>
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-danger btn-sm" onclick="if(confirm('Reset all clinic data to seed factory defaults?')) { window.clinicState.resetToSeed(); location.reload(); }">
            <i data-lucide="refresh-ccw"></i> Factory Reset Database
          </button>
          <button class="btn btn-primary" onclick="alert('System configuration updated and signed.')">
            <i data-lucide="save"></i> Save Configuration
          </button>
        </div>
      </div>
    `;
  }
}

window.adminPanel = new AdminPanel();
