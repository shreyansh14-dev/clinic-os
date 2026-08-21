/**
 * ClinicOS 24|7: Main Application Orchestrator & Router
 * Manages view transitions, search autosuggestions, role switching, toasts, and notifications.
 */

class ToastService {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'info';
    let iconBg = 'var(--apollo-orange-light)';
    let iconColor = 'var(--apollo-orange)';

    if (type === 'success') {
      icon = 'check-circle';
      iconBg = 'var(--apollo-green-light)';
      iconColor = '#059669';
    } else if (type === 'danger') {
      icon = 'alert-triangle';
      iconBg = 'var(--apollo-red-light)';
      iconColor = '#dc2626';
    }

    toast.innerHTML = `
      <div style="width:32px; height:32px; border-radius:50%; background:${iconBg}; color:${iconColor}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
        <i data-lucide="${icon}" style="width:16px; height:16px;"></i>
      </div>
      <div style="flex:1;">
        <div style="font-size:0.85rem; font-weight:700; color:var(--apollo-navy);">${title}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${message}</div>
      </div>
      <button onclick="this.parentElement.remove()" style="background:transparent; border:none; color:var(--text-dim); font-size:1.1rem; cursor:pointer; padding:0 4px;">&times;</button>
    `;

    this.container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }
}

class AppRouter {
  constructor() {
    this.currentRoute = 'landing';
  }

  navigate(routeName) {
    this.currentRoute = routeName;

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));

    // Update navbar active item
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      const target = btn.getAttribute('data-route');
      if (target === routeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const targetView = document.getElementById(`${routeName}-view`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Render corresponding panel
      if (routeName === 'landing') {
        // Landing visual updates
      } else if (routeName === 'patient') {
        if (window.patientPanel) window.patientPanel.render();
      } else if (routeName === 'doctor') {
        if (window.doctorPanel) window.doctorPanel.render();
      } else if (routeName === 'admin') {
        if (window.adminPanel) window.adminPanel.render();
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }
}

class ClinicApp {
  constructor() {
    window.toast = new ToastService();
    window.router = new AppRouter();
  }

  init() {
    this.startTelemetryClock();
    this.updateNavUserBadge();
    this.renderNotificationDrawer();
    this.setupGlobalSearch();

    // Default route
    window.router.navigate('landing');

    // Subscriptions
    window.clinicState.subscribe('notificationAdded', () => {
      this.updateNotificationBadge();
      this.renderNotificationDrawer();
    });

    window.clinicState.subscribe('userChanged', () => {
      this.updateNavUserBadge();
    });
  }

  startTelemetryClock() {
    const updateTime = () => {
      const now = new Date();
      const el = document.getElementById('telemetry-clock');
      if (el) {
        el.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  updateNavUserBadge() {
    const user = window.clinicState.getCurrentUser();
    const nameEl = document.getElementById('nav-user-name');
    const roleEl = document.getElementById('nav-user-role');
    const avatarEl = document.getElementById('nav-user-avatar');

    if (nameEl) nameEl.innerText = user.name;
    if (roleEl) roleEl.innerText = user.role;
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
  }

  updateNotificationBadge() {
    const unread = (window.clinicState.data.notifications || []).filter(n => n.unread).length;
    const badge = document.getElementById('nav-notif-count');
    if (badge) {
      badge.innerText = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
  }

  renderNotificationDrawer() {
    const list = document.getElementById('drawer-notification-list');
    if (!list) return;

    const notifs = window.clinicState.data.notifications || [];
    if (notifs.length === 0) {
      list.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-dim); font-size:0.85rem;">No new notifications</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="drawer-item ${n.unread ? 'unread' : ''}">
        <div style="width:28px; height:28px; border-radius:50%; background:var(--apollo-orange-light); color:var(--apollo-orange); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i data-lucide="${n.type === 'rx' ? 'pill' : n.type === 'telehealth' ? 'video' : 'bell'}" style="width:14px; height:14px;"></i>
        </div>
        <div>
          <div style="font-size:0.82rem; font-weight:700; color:var(--apollo-navy);">${n.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.35; margin-top:2px;">${n.message}</div>
          <div style="font-size:0.68rem; color:var(--text-dim); margin-top:4px;">${n.time}</div>
        </div>
      </div>
    `).join('');

    this.updateNotificationBadge();
    if (window.lucide) window.lucide.createIcons();
  }

  toggleNotificationDrawer() {
    const drawer = document.getElementById('notification-drawer');
    if (drawer) {
      drawer.classList.toggle('active');
    }
  }

  setupGlobalSearch() {
    const input = document.getElementById('global-search-input');
    const dropdown = document.getElementById('search-dropdown-menu');
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => {
      dropdown.classList.add('active');
    });

    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.remove('active'), 250);
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length > 0) {
        dropdown.classList.add('active');
      }
    });
  }

  handleSearchChipClick(query) {
    const input = document.getElementById('global-search-input');
    if (input) input.value = query;

    if (query.toLowerCase().includes('cardio') || query.toLowerCase().includes('doctor') || query.toLowerCase().includes('physician')) {
      window.router.navigate('patient');
      if (window.patientPanel) window.patientPanel.switchSubTab('booking');
    } else if (query.toLowerCase().includes('blood') || query.toLowerCase().includes('test') || query.toLowerCase().includes('checkup')) {
      window.router.navigate('patient');
      if (window.patientPanel) window.patientPanel.switchSubTab('diagnostics');
    } else if (query.toLowerCase().includes('triage') || query.toLowerCase().includes('symptom')) {
      if (window.triageEngine) window.triageEngine.openTriage();
    } else if (query.toLowerCase().includes('med') || query.toLowerCase().includes('paracetamol')) {
      window.router.navigate('patient');
      if (window.patientPanel) window.patientPanel.switchSubTab('prescriptions');
    }
  }
}

window.app = new ClinicApp();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
