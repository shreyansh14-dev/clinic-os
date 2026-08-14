/**
 * ClinicOS: Main Application Orchestrator & Router
 * Manages view switching, toast alerts, notification drawer, telemetry ticker, and UI sync.
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
    let iconBg = 'rgba(6, 182, 212, 0.15)';
    let iconColor = 'var(--secondary)';

    if (type === 'success') {
      icon = 'check';
      iconBg = 'rgba(16, 185, 129, 0.15)';
      iconColor = 'var(--primary-light)';
    } else if (type === 'danger') {
      icon = 'alert-triangle';
      iconBg = 'rgba(239, 68, 68, 0.15)';
      iconColor = '#F87171';
    }

    toast.innerHTML = `
      <div class="toast-icon" style="background:${iconBg}; color:${iconColor};">
        <i data-lucide="${icon}" style="width:14px; height:14px;"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button onclick="this.parentElement.remove()" style="color:var(--text-dim); font-size:1.1rem; line-height:1; cursor:pointer;">&times;</button>
    `;

    this.container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('removing');
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

    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));

    // Update nav items active state
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
        window.app.initLandingVisuals();
      } else if (routeName === 'patient') {
        window.patientPanel.render();
      } else if (routeName === 'doctor') {
        window.doctorPanel.render();
      } else if (routeName === 'admin') {
        window.adminPanel.render();
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }
}

class ClinicApp {
  constructor() {
    window.toast = new ToastService();
    window.router = new AppRouter();
    this.bio3dVisualizer = null;
  }

  init() {
    this.startTelemetryClock();
    this.updateNavUserBadge();
    this.renderNotificationDrawer();
    this.setupEventListeners();

    // Start Global Fullscreen 3D DNA & Particle Visualizer
    setTimeout(() => {
      if (!this.bio3dVisualizer) {
        this.bio3dVisualizer = new Bio3DVisualizer('global-3d-background');
      }
    }, 50);

    // Default route
    window.router.navigate('landing');

    // Subscribe to state notifications
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
        el.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC+5:30';
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  initLandingVisuals() {
    // 3D visualizer is already globally active
  }

  updateNavUserBadge() {
    const user = window.clinicState.getCurrentUser();
    const avatarEl = document.getElementById('nav-user-avatar');
    const nameEl = document.getElementById('nav-user-name');
    const roleEl = document.getElementById('nav-user-role');

    if (avatarEl) avatarEl.src = user.avatar;
    if (nameEl) nameEl.innerText = user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] || '');
    if (roleEl) roleEl.innerText = user.role;

    // Update demo role pills
    document.querySelectorAll('.demo-role-btn').forEach(btn => {
      const role = btn.getAttribute('data-role');
      btn.classList.toggle('active', role === user.role);
    });

    this.updateNotificationBadge();
  }

  updateNotificationBadge() {
    const notifs = window.clinicState.data.notifications || [];
    const unreadCount = notifs.filter(n => n.unread).length;
    const badgeEl = document.getElementById('nav-notif-count');
    if (badgeEl) {
      badgeEl.innerText = unreadCount;
      badgeEl.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
  }

  toggleNotificationDrawer() {
    const drawer = document.getElementById('notification-drawer');
    if (drawer) {
      drawer.classList.toggle('active');
    }
  }

  renderNotificationDrawer() {
    const notifs = window.clinicState.data.notifications || [];
    const container = document.getElementById('drawer-notification-list');
    if (!container) return;

    if (notifs.length === 0) {
      container.innerHTML = `<div style="padding:1.5rem; text-align:center; font-size:0.82rem; color:var(--text-dim);">No notifications</div>`;
      return;
    }

    container.innerHTML = notifs.map(n => `
      <div class="drawer-item ${n.unread ? 'unread' : ''}" onclick="window.app.clickNotification('${n.id}')">
        <div style="font-size:1.1rem; color:var(--primary-light);">
          <i data-lucide="${n.type === 'appointment' ? 'calendar' : n.type === 'report' ? 'file-text' : 'bell'}"></i>
        </div>
        <div style="flex:1;">
          <div class="drawer-item-title">${n.title}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">${n.message}</div>
          <div class="drawer-item-time">${n.time}</div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  clickNotification(id) {
    const notif = window.clinicState.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
      window.clinicState.persist();
      this.updateNotificationBadge();
      this.renderNotificationDrawer();
    }
  }

  setupEventListeners() {
    // Close drawer on click outside
    document.addEventListener('click', (e) => {
      const drawer = document.getElementById('notification-drawer');
      const btn = document.getElementById('notif-bell-btn');
      if (drawer && drawer.classList.contains('active')) {
        if (!drawer.contains(e.target) && !btn.contains(e.target)) {
          drawer.classList.remove('active');
        }
      }
    });
  }
}

// Instantiate on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ClinicApp();
  window.app.init();
});
