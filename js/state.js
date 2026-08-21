/**
 * ClinicOS: Central State Manager & Audit Logger
 * Manages RBAC, persistent state, subscriptions, compliance logs, and cross-panel video call events.
 */

class ClinicState {
  constructor() {
    this.storageKey = 'clinicos_state_v2';
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
        token: 'jwt_clinicos_token_pat_1'
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
      token: 'jwt_clinicos_token_pat_1'
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
        email: 'admin@clinicos.health',
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

  registerNewborn(babyData) {
    if (!this.data.newborns) this.data.newborns = [];
    
    // Generate complete standard vaccine roadmap
    const standardVaccineSchedule = [
      { name: 'BCG (Tuberculosis)', ageDue: 'At Birth', dateAdministered: babyData.birthDoseBCG ? babyData.dob : 'Pending', status: babyData.birthDoseBCG ? 'Completed' : 'Pending', batchNo: babyData.birthDoseBCG ? 'BCG-BIRTH-AUTO' : '-' },
      { name: 'OPV-0 (Oral Polio Zero Dose)', ageDue: 'At Birth', dateAdministered: babyData.birthDoseOPV ? babyData.dob : 'Pending', status: babyData.birthDoseOPV ? 'Completed' : 'Pending', batchNo: babyData.birthDoseOPV ? 'OPV-BIRTH-AUTO' : '-' },
      { name: 'Hepatitis B (Birth Dose)', ageDue: 'At Birth', dateAdministered: babyData.birthDoseHepB ? babyData.dob : 'Pending', status: babyData.birthDoseHepB ? 'Completed' : 'Pending', batchNo: babyData.birthDoseHepB ? 'HEPB-BIRTH-AUTO' : '-' },
      { name: 'Pentavalent-1 (DTP-HepB-Hib)', ageDue: '6 Weeks', dateAdministered: 'Scheduled in 6 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'Rotavirus-1 (Diarrhea Protection)', ageDue: '6 Weeks', dateAdministered: 'Scheduled in 6 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'IPV-1 (Injectable Polio)', ageDue: '6 Weeks', dateAdministered: 'Scheduled in 6 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'PCV-1 (Pneumococcal)', ageDue: '6 Weeks', dateAdministered: 'Scheduled in 6 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'Pentavalent-2', ageDue: '10 Weeks', dateAdministered: 'Scheduled in 10 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'Rotavirus-2', ageDue: '10 Weeks', dateAdministered: 'Scheduled in 10 weeks', status: 'Upcoming', batchNo: '-' },
      { name: 'Pentavalent-3', ageDue: '14 Weeks', dateAdministered: 'Scheduled in 14 weeks', status: 'Pending', batchNo: '-' },
      { name: 'Rotavirus-3', ageDue: '14 Weeks', dateAdministered: 'Scheduled in 14 weeks', status: 'Pending', batchNo: '-' },
      { name: 'IPV-2', ageDue: '14 Weeks', dateAdministered: 'Scheduled in 14 weeks', status: 'Pending', batchNo: '-' },
      { name: 'MR-1 / MMR-1 (Measles-Rubella)', ageDue: '9 Months', dateAdministered: 'Scheduled at 9 months', status: 'Pending', batchNo: '-' },
      { name: 'Vitamin A (Dose 1)', ageDue: '9 Months', dateAdministered: 'Scheduled at 9 months', status: 'Pending', batchNo: '-' },
      { name: 'DTP Booster-1', ageDue: '16-24 Months', dateAdministered: 'Scheduled at 16-24 months', status: 'Pending', batchNo: '-' }
    ];

    const newBaby = {
      id: 'baby-' + Date.now().toString().slice(-4),
      parentId: this.getCurrentUser().id || 'pat-1',
      parentName: this.getCurrentUser().name || 'Alex Morgan',
      motherName: babyData.motherName,
      fatherName: babyData.fatherName,
      babyName: babyData.babyName || `Baby of ${babyData.motherName}`,
      gender: babyData.gender,
      dob: babyData.dob,
      birthWeight: babyData.birthWeight ? `${babyData.birthWeight} kg` : '3.2 kg',
      bloodGroup: babyData.bloodGroup || 'O+',
      deliveryPlace: babyData.deliveryPlace || 'Hospital / Home',
      address: babyData.address,
      phone: babyData.phone,
      registrationType: 'Digital Self-Registration (No Door-to-Door Survey Needed)',
      status: 'Registered & Scheduled',
      vaccines: standardVaccineSchedule
    };

    this.data.newborns.unshift(newBaby);
    this.logAudit('NEWBORN_VACCINATION_REGISTER', `Registered newborn ${newBaby.babyName} (DOB: ${newBaby.dob}) for immunization program`, `Parent: ${newBaby.motherName}`);
    this.addNotification('👶 Newborn Registered for Vaccination', `${newBaby.babyName} has been enrolled in the Universal Child Immunization Program. Digital vaccine passport generated.`, 'rx');
    this.save();
    this.notify('newbornsChanged', this.data.newborns);
    return newBaby;
  }

  administerVaccine(babyId, vaccineName, batchNo, administeredBy) {
    const baby = (this.data.newborns || []).find(b => b.id === babyId);
    if (!baby) return;

    const v = (baby.vaccines || []).find(vac => vac.name.toLowerCase().includes(vaccineName.toLowerCase()));
    if (v) {
      v.status = 'Completed';
      v.dateAdministered = new Date().toISOString().split('T')[0];
      v.batchNo = batchNo || `BATCH-PED-${Date.now().toString().slice(-4)}`;
      v.administeredBy = administeredBy || this.getCurrentUser().name;
      
      this.logAudit('VACCINE_ADMINISTERED', `Administered ${v.name} to ${baby.babyName}`, `Batch #${v.batchNo}`);
      this.addNotification('Vaccine Administered', `${v.name} recorded for ${baby.babyName}. Certificate updated.`, 'rx');
      this.save();
      this.notify('newbornsChanged', this.data.newborns);
    }
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

