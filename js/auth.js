/**
 * ClinicOS: Authentication, Session Management & RBAC Guard
 * Provides 1-click Demo Logins, Login & Registration Modals, and Role Switching.
 */

class AuthManager {
  constructor() {}

  openLoginModal(defaultRole = 'PATIENT') {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:480px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="brand-icon-wrapper" style="width:32px; height:32px; font-size:0.8rem;">
              <i data-lucide="shield"></i>
            </div>
            <h3 class="modal-title">ClinicOS Portal Access</h3>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('auth-modal').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body">
          <!-- 1-Click Quick Demo Sign-In Box -->
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid var(--border-glow); padding:1rem; border-radius:12px; margin-bottom:1.25rem;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--primary-light); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em;">
              1-Click Instant Demo Login:
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.auth.quickLogin('PATIENT')">
                <i data-lucide="user"></i> Patient (Alex)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.auth.quickLogin('DOCTOR')">
                <i data-lucide="stethoscope"></i> Doctor (Dr. Chen)
              </button>
            </div>
            <div style="margin-top:0.5rem;">
              <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="window.auth.quickLogin('ADMIN')">
                <i data-lucide="shield-check"></i> Admin Supervisor
              </button>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
            <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
            <span style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">Or Login with Credentials</span>
            <div style="flex:1; height:1px; background:var(--border-subtle);"></div>
          </div>

          <form onsubmit="event.preventDefault(); window.auth.handleFormLogin();">
            <div class="form-group">
              <label class="form-label">Role Account Type</label>
              <select id="auth-role-select" class="form-control">
                <option value="PATIENT" ${defaultRole === 'PATIENT' ? 'selected' : ''}>Patient Portal</option>
                <option value="DOCTOR" ${defaultRole === 'DOCTOR' ? 'selected' : ''}>Doctor / Physician Portal</option>
                <option value="ADMIN" ${defaultRole === 'ADMIN' ? 'selected' : ''}>Administrator Portal</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Work Email / Healthcare ID</label>
              <input type="email" id="auth-email-input" class="form-control" value="alex.morgan@example.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Secure Password</label>
              <input type="password" id="auth-pass-input" class="form-control" value="••••••••••••" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:0.75rem;">
              <i data-lucide="log-in"></i> Sign In to ClinicOS
            </button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  quickLogin(role) {
    window.clinicState.switchRole(role);
    document.getElementById('auth-modal')?.classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    window.app.updateNavUserBadge();
  }

  handleFormLogin() {
    const role = document.getElementById('auth-role-select').value;
    const email = document.getElementById('auth-email-input').value;
    this.quickLogin(role);
  }
}

window.auth = new AuthManager();
