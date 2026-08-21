/**
 * ClinicOS 24|7: Central State Manager & Audit Logger
 * Manages RBAC, persistent state, subscriptions, compliance logs, and cross-panel video call events.
 */

class ClinicState {
  constructor() {
    this.storageKey = 'clinicos_apollo_state_v1';
    this.subscribers = new Map();
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored ClinicOS state, re-seeding:', e);
        this.resetToSeed();
      }
    } else {
      this.resetToSeed();
    }

    if (!this.data.currentUser) {
      this.data.currentUser = {
        id: 'pat-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'PATIENT', // PATIENT | DOCTOR | ADMIN
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        token: 'jwt_apollo_token_pat_1'
      };
    }
  }

  resetToSeed() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.data.currentUser = {
      id: 'pat-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'PATIENT',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      token: 'jwt_apollo_token_pat_1'
    };
    this.data.notifications = [
      {
        id: 'notif-1',
        title: 'Instant Video Consultation Ready',
        message: 'Top General Physicians are online now. Average wait time < 2 mins.',
        time: 'Just now',
        unread: true,
        type: 'telehealth'
      },
      {
        id: 'notif-2',
        title: 'Full Body Checkup Confirmed',
        message: 'Home sample collection scheduled with certified phlebotomist for tomorrow 8:00 AM.',
        time: '30m ago',
        unread: true,
        type: 'report'
      }
    ];
    this.data.auditLogs = this.data.auditLogs || [];
    this.data.activeIncomingCall = null;
    this.save();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Storage quota exceeded or error saving state', e);
    }
  }

  getCurrentUser() {
    return this.data.currentUser;
  }

  switchRole(role) {
    if (role === 'PATIENT') {
      this.data.currentUser = {
        id: 'pat-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'PATIENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
      };
    } else if (role === 'DOCTOR') {
      const doc = this.data.doctors[0];
      this.data.currentUser = {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        role: 'DOCTOR',
        avatar: doc.avatar
      };
    } else if (role === 'ADMIN') {
      this.data.currentUser = {
        id: 'adm-1',
        name: 'Administrator Sarah Connor',
        email: 'admin@clinicos247.com',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      };
    }

    this.save();
    this.notify('userChanged', this.data.currentUser);

    // Update UI role buttons
    document.querySelectorAll('.demo-role-btn').forEach(btn => {
      if (btn.getAttribute('data-role') === role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.toast) {
      window.toast.show('Role Switched', `Active Profile: ${this.data.currentUser.name} (${role})`, 'info');
    }

    // Auto navigate to role workspace
    if (role === 'PATIENT') window.router.navigate('patient');
    if (role === 'DOCTOR') {
      window.router.navigate('doctor');
      // If there is an active incoming call, display the incoming ringing modal!
      if (this.data.activeIncomingCall && window.telehealth) {
        setTimeout(() => {
          window.telehealth.showIncomingCallModal(this.data.activeIncomingCall);
        }, 200);
      }
    }
    if (role === 'ADMIN') window.router.navigate('admin');
  }

  addAppointment(apt) {
    if (!this.data.appointments) this.data.appointments = [];
    this.data.appointments.unshift(apt);
    this.logAudit('APPOINTMENT_CREATE', `Booked appointment #${apt.id} with ${apt.doctorName}`, `Dept: ${apt.department}`);
    this.save();
    this.notify('appointmentsChanged', this.data.appointments);
  }

  updateAppointmentStatus(id, newStatus) {
    const apt = (this.data.appointments || []).find(a => a.id === id);
    if (apt) {
      apt.status = newStatus;
      this.logAudit('APPOINTMENT_UPDATE', `Updated status of #${id} to ${newStatus}`, `Patient ID: ${apt.patientId}`);
      this.save();
      this.notify('appointmentsChanged', this.data.appointments);
    }
  }

  addPrescription(rx) {
    if (!this.data.prescriptions) this.data.prescriptions = [];
    const newRx = {
      id: 'rx-' + Date.now().toString().slice(-4),
      date: new Date().toISOString().split('T')[0],
      ...rx
    };
    this.data.prescriptions.unshift(newRx);
    this.logAudit('PRESCRIPTION_ISSUED', `Issued digital prescription #${newRx.id} for ${rx.patientName}`, `Diagnosis: ${rx.diagnosis}`);
    this.addNotification('New Prescription Issued', `Dr. ${rx.doctorName} signed a new prescription for you.`, 'rx');
    this.save();
    this.notify('prescriptionsChanged', this.data.prescriptions);
    return newRx;
  }

  addNotification(title, message, type = 'info') {
    if (!this.data.notifications) this.data.notifications = [];
    const notif = {
      id: 'notif-' + Date.now().toString().slice(-4),
      title,
      message,
      time: 'Just now',
      unread: true,
      type
    };
    this.data.notifications.unshift(notif);
    this.save();
    this.notify('notificationAdded', notif);
  }

  markAllNotificationsRead() {
    if (this.data.notifications) {
      this.data.notifications.forEach(n => n.unread = false);
      this.save();
      this.notify('notificationsUpdated');
    }
  }

  logAudit(action, details, target) {
    if (!this.data.auditLogs) this.data.auditLogs = [];
    const log = {
      id: 'AUDIT-' + Date.now().toString().slice(-5),
      timestamp: new Date().toISOString(),
      user: this.getCurrentUser().name,
      role: this.getCurrentUser().role,
      action: action,
      details: details,
      target: target || 'N/A',
      ip: '127.0.0.1 (WebRTC Safe)',
      hash: 'sha256_' + Math.random().toString(36).substring(2, 12)
    };
    this.data.auditLogs.unshift(log);
    this.save();
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  notify(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => cb(payload));
    }
  }
}

window.clinicState = new ClinicState();
