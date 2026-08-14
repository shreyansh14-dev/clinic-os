/**
 * ClinicOS: Reactive Central State Management & Audit Logger
 * Manages RBAC, persistent data store, reactive subscriptions, and compliance audit trail.
 */

class ClinicState {
  constructor() {
    this.storageKey = 'clinicos_state_v1';
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

    // Active Session (Default to Patient for friendly onboarding)
    if (!this.data.currentUser) {
      this.data.currentUser = {
        id: 'pat-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'PATIENT', // PATIENT | DOCTOR | ADMIN
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        token: 'jwt_simulated_token_pat_1_' + Date.now()
      };
    }

    // Active View / Route
    this.currentView = 'landing'; // landing | patient | doctor | admin | teleconsult
    this.activeTeleconsultAppointmentId = null;
  }

  resetToSeed() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.data.currentUser = {
      id: 'pat-1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'PATIENT',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      token: 'jwt_simulated_token_pat_1'
    };
    this.data.notifications = [
      {
        id: 'notif-1',
        title: 'Appointment Scheduled',
        message: 'Your Cardiology Telehealth call is confirmed for 10:30 AM today.',
        time: 'Just now',
        unread: true,
        type: 'appointment'
      },
      {
        id: 'notif-2',
        title: 'Diagnostic Report Ready',
        message: '12-Lead ECG Report has been signed and uploaded by Dr. Robert Chen.',
        time: '25m ago',
        unread: true,
        type: 'report'
      }
    ];
    this.persist();
  }

  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.emit('stateChanged', this.data);
  }

  // Subscribe to changes
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
    return () => {
      const arr = this.subscribers.get(event) || [];
      this.subscribers.set(event, arr.filter(cb => cb !== callback));
    };
  }

  emit(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in subscriber for event ${event}:`, err);
        }
      });
    }
  }

  // Auth & RBAC
  setCurrentUser(user) {
    this.data.currentUser = user;
    this.logAudit('USER_LOGIN', `Logged in as ${user.role} (${user.name})`, `User: ${user.email}`);
    this.persist();
    this.emit('userChanged', user);
  }

  getCurrentUser() {
    return this.data.currentUser;
  }

  switchRole(roleName) {
    if (roleName === 'PATIENT') {
      this.setCurrentUser({
        id: 'pat-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        role: 'PATIENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        token: 'jwt_pat_' + Date.now()
      });
      window.router.navigate('patient');
    } else if (roleName === 'DOCTOR') {
      this.setCurrentUser({
        id: 'doc-1',
        name: 'Dr. Robert Chen',
        email: 'robert.chen@clinicos.health',
        role: 'DOCTOR',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        token: 'jwt_doc_' + Date.now()
      });
      window.router.navigate('doctor');
    } else if (roleName === 'ADMIN') {
      this.setCurrentUser({
        id: 'admin-1',
        name: 'Dr. Marcus Vance (Admin Supervisor)',
        email: 'admin@clinicos.health',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        token: 'jwt_admin_' + Date.now()
      });
      window.router.navigate('admin');
    }
  }

  // Audit Logging
  logAudit(action, details, resource = 'System') {
    const user = this.getCurrentUser();
    const newLog = {
      id: 'log-' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 4)).toUpperCase(),
      timestamp: new Date().toLocaleString(),
      user: user ? user.email : 'anonymous@clinicos.health',
      role: user ? user.role : 'ANONYMOUS',
      action: action,
      resource: resource,
      ip: '192.168.1.' + Math.floor(100 + Math.random() * 80),
      details: details
    };

    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.persist();
    this.emit('auditLogAdded', newLog);
  }

  // Notifications
  addNotification(title, message, type = 'info') {
    const notif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      time: 'Just now',
      unread: true
    };
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.unshift(notif);
    this.persist();
    this.emit('notificationAdded', notif);
    if (window.toast) {
      window.toast.show(title, message, type);
    }
  }

  markAllNotificationsRead() {
    if (this.data.notifications) {
      this.data.notifications.forEach(n => n.unread = false);
      this.persist();
      this.emit('notificationsUpdated', this.data.notifications);
    }
  }

  // Appointments
  addAppointment(aptData) {
    const newApt = {
      id: 'apt-' + (100 + this.data.appointments.length + 1),
      ...aptData,
      status: 'Confirmed'
    };
    this.data.appointments.unshift(newApt);
    this.logAudit('APPOINTMENT_BOOK', `Booked appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.time}`, `Apt ID: ${newApt.id}`);
    this.addNotification('Appointment Booked', `Your appointment with ${newApt.doctorName} for ${newApt.date} has been confirmed.`, 'success');
    this.persist();
    return newApt;
  }

  updateAppointmentStatus(aptId, newStatus) {
    const apt = this.data.appointments.find(a => a.id === aptId);
    if (apt) {
      apt.status = newStatus;
      this.logAudit('APPOINTMENT_STATUS_UPDATE', `Updated Appointment ${aptId} status to ${newStatus}`, `Apt ID: ${aptId}`);
      this.addNotification('Appointment Update', `Appointment #${aptId} is now ${newStatus}.`, 'info');
      this.persist();
    }
  }

  // Prescriptions
  addPrescription(rxData) {
    const newRx = {
      id: 'rx-' + (500 + (this.data.prescriptions ? this.data.prescriptions.length : 0) + 1),
      date: new Date().toISOString().split('T')[0],
      ...rxData
    };
    if (!this.data.prescriptions) this.data.prescriptions = [];
    this.data.prescriptions.unshift(newRx);
    this.logAudit('PRESCRIPTION_ISSUE', `Prescription issued for ${newRx.patientName}: ${newRx.diagnosis}`, `Rx ID: ${newRx.id}`);
    this.addNotification('New Prescription Received', `Dr. ${newRx.doctorName} generated a digital prescription.`, 'success');
    this.persist();
    return newRx;
  }

  // Vitals
  updatePatientVitals(patientId, newVitals) {
    const pat = this.data.patients.find(p => p.id === patientId);
    if (pat) {
      pat.vitals = {
        ...pat.vitals,
        ...newVitals,
        lastUpdated: 'Just now'
      };
      if (!pat.vitalsHistory) pat.vitalsHistory = [];
      pat.vitalsHistory.push({
        date: new Date().toISOString().split('T')[0],
        hr: newVitals.heartRate || pat.vitals.heartRate,
        bp: newVitals.bloodPressure || pat.vitals.bloodPressure,
        spo2: newVitals.spo2 || pat.vitals.spo2,
        glucose: newVitals.glucose || pat.vitals.glucose,
        temp: newVitals.temperature || pat.vitals.temperature
      });
      this.logAudit('VITALS_UPDATE', `Logged updated vitals (HR: ${newVitals.heartRate}, BP: ${newVitals.bloodPressure})`, `Patient: ${pat.name}`);
      this.persist();
      this.emit('vitalsUpdated', pat);
    }
  }

  // Invoices & Payments
  processPayment(invoiceId, method, txnId) {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = 'Paid';
      inv.paymentMethod = method;
      inv.paidAt = new Date().toLocaleString();
      inv.transactionId = txnId || ('TXN-' + Math.floor(100000 + Math.random() * 900000));
      this.logAudit('PAYMENT_PROCESSED', `Invoice ${invoiceId} paid ($${inv.totalDue}) via ${method}`, `Inv ID: ${invoiceId}`);
      this.addNotification('Payment Confirmed', `Payment of $${inv.totalDue} for invoice #${invoiceId} was successful!`, 'success');
      this.persist();
    }
  }

  // Diagnostics
  orderDiagnosticTest(testData) {
    const newOrder = {
      id: 'ord-' + (800 + (this.data.diagnosticOrders ? this.data.diagnosticOrders.length : 0) + 1),
      orderedDate: new Date().toISOString().split('T')[0],
      status: 'Sample Collected',
      turnaround: 'Est. 2-4 Hours',
      findings: 'Specimen received in pathology lab. Processing automated biomarkers analyzer.',
      reportPdf: `Diagnostic_Report_${newOrder?.id || 'new'}.pdf`,
      imagingPreview: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
      ...testData
    };
    if (!this.data.diagnosticOrders) this.data.diagnosticOrders = [];
    this.data.diagnosticOrders.unshift(newOrder);
    this.logAudit('DIAGNOSTIC_ORDER', `Diagnostic test ${newOrder.testName} ordered for ${newOrder.patientName}`, `Order ID: ${newOrder.id}`);
    this.addNotification('Diagnostic Test Ordered', `Order #${newOrder.id} for ${newOrder.testName} is scheduled.`, 'info');
    this.persist();
    return newOrder;
  }
}

// Global Single Instance
window.clinicState = new ClinicState();
