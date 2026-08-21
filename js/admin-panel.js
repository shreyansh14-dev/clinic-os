/**
 * ClinicOS 24|7: Admin Control Panel & Compliance Dashboard
 * Analytics, Staff Roster, Patient Registry, and HIPAA/ABDM Audit Trails.
 */

class AdminPanel {
  constructor() {
    this.activeSubTab = 'analytics'; // analytics | doctors | patients | audit
  }

  render() {
    const container = document.getElementById('admin-view');
    if (!container) return;

    const state = window.clinicState.data;

    container.innerHTML = `
      <div class="main-content-wrapper">
        <!-- Top Admin Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; background:var(--bg-surface); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; box-shadow:var(--shadow-card);">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--apollo-navy); color:#ffffff; display:flex; align-items:center; justify-content:center;">
              <i data-lucide="shield" style="width:24px; height:24px;"></i>
            </div>
            <div>
              <h1 style="font-size:1.6rem; font-weight:800; color:var(--apollo-navy);">Apollo Hospital Administration</h1>
              <p style="font-size:0.82rem; color:var(--text-dim);">
                HIPAA / ABDM Tier-4 Compliance • Real-Time Telehealth Node Governance
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <span class="badge badge-success"><span class="pulse-dot"></span> Core System Operational</span>
            <button class="btn btn-outline btn-sm" onclick="window.clinicState.resetToSeed(); window.toast.show('State Reset', 'Clinic database restored to default seed.', 'info'); window.adminPanel.render();">
              <i data-lucide="rotate-ccw"></i> Reset Demo Data
            </button>
          </div>
        </div>

        <div class="portal-layout">
          <!-- Admin Sidebar Nav -->
          <div class="portal-sidebar">
            <div class="portal-nav-heading">Management Console</div>
            <div class="portal-nav-link ${this.activeSubTab === 'analytics' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('analytics')">
              <i data-lucide="bar-chart-3"></i> Operations Analytics
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'doctors' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('doctors')">
              <i data-lucide="users"></i> Medical Staff Roster
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'patients' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('patients')">
              <i data-lucide="user-check"></i> Patient Directory
            </div>
            <div class="portal-nav-link ${this.activeSubTab === 'audit' ? 'active' : ''}" onclick="window.adminPanel.switchSubTab('audit')">
              <i data-lucide="shield-alert"></i> HIPAA Audit Trail
            </div>
          </div>

          <!-- Admin Body Content -->
          <div class="portal-body">
            ${this.renderSubTabContent(state)}
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

  renderSubTabContent(state) {
    if (this.activeSubTab === 'analytics') {
      return `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
            <div class="card" style="padding:1.1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Daily Teleconsults</div>
              <div style="font-size:1.6rem; font-weight:800; color:var(--apollo-navy); margin-top:0.25rem;">1,428</div>
              <div style="font-size:0.72rem; color:#10b981;">↑ 18.4% vs last week</div>
            </div>
            <div class="card" style="padding:1.1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Active Doctors Online</div>
              <div style="font-size:1.6rem; font-weight:800; color:var(--apollo-orange); margin-top:0.25rem;">184</div>
              <div style="font-size:0.72rem; color:#10b981;">100% Slot Coverage</div>
            </div>
            <div class="card" style="padding:1.1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Avg Doctor Wait Time</div>
              <div style="font-size:1.6rem; font-weight:800; color:var(--apollo-teal); margin-top:0.25rem;">1.8 min</div>
              <div style="font-size:0.72rem; color:#10b981;">Target: < 3.0 min</div>
            </div>
            <div class="card" style="padding:1.1rem;">
              <div style="font-size:0.72rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Patient Satisfaction</div>
              <div style="font-size:1.6rem; font-weight:800; color:#10b981; margin-top:0.25rem;">99.2%</div>
              <div style="font-size:0.72rem; color:#10b981;">4.95 / 5.0 Star Rating</div>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--apollo-navy); margin-bottom:1rem;">Hospital OPD & Telehealth Performance</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.82rem; color:var(--text-muted);">
                <span>General Medicine & Triage</span>
                <strong>42% of consultations</strong>
              </div>
              <div style="height:8px; background:var(--bg-subtle); border-radius:4px; overflow:hidden;">
                <div style="width:42%; height:100%; background:var(--apollo-orange);"></div>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:0.82rem; color:var(--text-muted); margin-top:0.5rem;">
                <span>Cardiology & Telemetry</span>
                <strong>28% of consultations</strong>
              </div>
              <div style="height:8px; background:var(--bg-subtle); border-radius:4px; overflow:hidden;">
                <div style="width:28%; height:100%; background:var(--apollo-blue);"></div>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:0.82rem; color:var(--text-muted); margin-top:0.5rem;">
                <span>Dermatology & Paediatrics</span>
                <strong>30% of consultations</strong>
              </div>
              <div style="height:8px; background:var(--bg-subtle); border-radius:4px; overflow:hidden;">
                <div style="width:30%; height:100%; background:var(--apollo-teal);"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'doctors') {
      const doctors = state.doctors || [];
      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h2 style="font-size:1.25rem; font-weight:800; color:var(--apollo-navy);">Medical Specialist Staff (${doctors.length})</h2>
            <button class="btn btn-primary btn-sm" onclick="window.toast.show('Staff Management', 'Add Doctor onboarding wizard opened.', 'info')">
              <i data-lucide="user-plus"></i> Onboard Doctor
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${doctors.map(d => `
              <div style="background:var(--bg-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div style="display:flex; gap:0.85rem; align-items:center;">
                  <img src="${d.avatar}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                  <div>
                    <strong style="color:var(--apollo-navy);">${d.name}</strong>
                    <div style="font-size:0.76rem; color:var(--text-dim);">${d.title} • ${d.department} • Reg #${d.regNumber || 'MCI-88219'}</div>
                  </div>
                </div>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <span class="badge badge-success">Active On-Duty</span>
                  <button class="btn btn-outline btn-sm" onclick="window.telehealth.startInstantConsultation('${d.department}')">
                    <i data-lucide="video"></i> Test Video Line
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'patients') {
      const patients = state.patients || [];
      return `
        <div class="card">
          <h2 style="font-size:1.25rem; font-weight:800; color:var(--apollo-navy); margin-bottom:1.25rem;">Registered Patient Directory (${patients.length})</h2>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${patients.map(p => `
              <div style="background:var(--bg-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div style="display:flex; gap:0.85rem; align-items:center;">
                  <img src="${p.avatar}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                  <div>
                    <strong style="color:var(--apollo-navy);">${p.name}</strong>
                    <div style="font-size:0.76rem; color:var(--text-dim);">Patient ID #${p.id} • Blood: ${p.bloodGroup} • Age: ${p.age} • ${p.email}</div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.router.navigate('patient')">
                  <i data-lucide="external-link"></i> View Portal
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeSubTab === 'audit') {
      const logs = state.auditLogs || [];
      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h2 style="font-size:1.25rem; font-weight:800; color:var(--apollo-navy);">HIPAA & ABDM Compliance Audit Trail</h2>
            <span class="badge badge-success">✓ 100% Cryptographically Sealed</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.6rem; max-height:450px; overflow-y:auto;">
            ${logs.map(l => `
              <div style="background:var(--bg-subtle); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); font-family:var(--font-mono); font-size:0.75rem;">
                <div style="display:flex; justify-content:space-between; color:var(--apollo-orange); font-weight:700;">
                  <span>${l.action}</span>
                  <span style="color:var(--text-dim);">${l.timestamp}</span>
                </div>
                <div style="color:var(--text-main); margin-top:2px;">${l.details}</div>
                <div style="color:var(--text-dim); font-size:0.68rem; margin-top:3px;">User: ${l.user} (${l.role}) • Hash: ${l.hash}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }
}

window.adminPanel = new AdminPanel();
