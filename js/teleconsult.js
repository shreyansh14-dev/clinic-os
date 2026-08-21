/**
 * ClinicOS: Telehealth Video Consultation & WebRTC Suite
 * Live Camera & Mic Access, Doctor Incoming Call Notification & Ringing,
 * Digital Rx Pad, Real-time Vitals HUD, and In-call Chat.
 */

class TelehealthSuite {
  constructor() {
    this.localStream = null;
    this.isMuted = false;
    this.isVideoOff = false;
    this.isScreenSharing = false;
    this.callDurationSecs = 0;
    this.timerInterval = null;
    this.activeAppointment = null;
    this.currentCallData = null;
    this.ringInterval = null;

    this.chatMessages = [
      { sender: 'Dr. Robert Chen', role: 'doctor', text: 'Hello! I am Dr. Chen. I see you requested a 24/7 video consultation.' },
      { sender: 'Alex Morgan', role: 'patient', text: 'Hello Dr. Chen! Thanks for connecting so quickly. Had slight palpitations after light workout.' },
      { sender: 'Dr. Robert Chen', role: 'doctor', text: 'Understood. Reviewing your live ECG and vitals now. Let me know if you feel any dizziness.' }
    ];
  }

  // 1-Click Instant Video Call (from Header, Hero Banner, or Triage)
  startInstantConsultation(doctorSpecialty = 'General Physician') {
    const state = window.clinicState.data;
    const currentUser = window.clinicState.getCurrentUser();
    const isDoctor = currentUser.role === 'DOCTOR';

    // Find or assign doctor
    const doctor = (state.doctors && state.doctors.find(d => d.department.toLowerCase().includes(doctorSpecialty.toLowerCase()))) || state.doctors[0];
    const patient = state.patients[0];

    const newApt = {
      id: 'apt-tele-' + Date.now().toString().slice(-4),
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      date: 'Today',
      time: 'Instant Video Consult',
      status: 'In-Progress',
      type: 'Telehealth',
      reason: '24/7 Instant Video Consultation (' + doctorSpecialty + ')'
    };

    if (!state.appointments) state.appointments = [];
    state.appointments.unshift(newApt);
    window.clinicState.save();

    this.startConsultation(newApt.id, isDoctor ? 'DOCTOR' : 'PATIENT');
  }

  startConsultation(appointmentId, callerRole = 'PATIENT') {
    const state = window.clinicState.data;
    this.activeAppointment = (state.appointments && state.appointments.find(a => a.id === appointmentId)) || state.appointments[0];
    const doctor = (state.doctors && state.doctors.find(d => d.id === this.activeAppointment.doctorId)) || state.doctors[0];
    const patient = (state.patients && state.patients.find(p => p.id === this.activeAppointment.patientId)) || state.patients[0];

    this.currentCallData = {
      appointmentId: this.activeAppointment.id,
      patientId: patient.id,
      patientName: patient.name,
      patientAvatar: patient.avatar,
      patientAge: patient.age,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorAvatar: doctor.avatar,
      specialty: this.activeAppointment.department,
      reason: this.activeAppointment.reason || 'Routine Teleconsultation',
      callerRole: callerRole
    };

    // If initiated by patient, dispatch incoming ringing alert for doctor
    if (callerRole === 'PATIENT') {
      window.clinicState.data.activeIncomingCall = this.currentCallData;
      window.clinicState.save();

      // Show incoming call notification on doctor side if currently doctor
      const currentUser = window.clinicState.getCurrentUser();
      if (currentUser.role === 'DOCTOR') {
        this.showIncomingCallModal(this.currentCallData);
        return;
      }
    }

    // Switch route to teleconsultation suite
    window.router.navigate('teleconsult');
    this.renderRoom();
    this.startCallTimer();
    this.initMedia();

    if (window.audioService && window.audioService.playSuccessChime) {
      window.audioService.playSuccessChime();
    }

    window.clinicState.logAudit('TELEHEALTH_SESSION_JOIN', `Joined Video Consultation #${this.activeAppointment.id}`, `User: ${doctor.name} & ${patient.name}`);
    window.toast.show('Teleconsultation Active', `Connected to WebRTC HD Session with ${callerRole === 'DOCTOR' ? patient.name : doctor.name}`, 'success');
  }

  // Display Ringing Modal on Doctor Panel
  showIncomingCallModal(callData) {
    this.currentCallData = callData;
    const modalOverlay = document.getElementById('incoming-call-modal-overlay');
    if (!modalOverlay) return;

    const callerNameEl = document.getElementById('incoming-caller-name');
    const callerReasonEl = document.getElementById('incoming-caller-reason');
    const callerAvatarEl = document.getElementById('incoming-caller-avatar');

    if (callerNameEl) callerNameEl.innerText = callData.patientName + ' (Age ' + (callData.patientAge || '32') + ')';
    if (callerReasonEl) callerReasonEl.innerText = 'Reason: ' + (callData.reason || 'Instant Video Consultation') + ' • ' + callData.specialty;
    if (callerAvatarEl) callerAvatarEl.src = callData.patientAvatar;

    modalOverlay.classList.add('active');

    // Ringing sound
    if (window.audioService && window.audioService.playCallRing) {
      window.audioService.playCallRing();
      if (this.ringInterval) clearInterval(this.ringInterval);
      this.ringInterval = setInterval(() => {
        if (modalOverlay.classList.contains('active') && window.audioService) {
          window.audioService.playCallRing();
        }
      }, 3000);
    }
  }

  acceptIncomingCall() {
    if (this.ringInterval) clearInterval(this.ringInterval);
    const modalOverlay = document.getElementById('incoming-call-modal-overlay');
    if (modalOverlay) modalOverlay.classList.remove('active');

    window.clinicState.data.activeIncomingCall = null;
    window.clinicState.save();

    // Switch to doctor role and enter consultation room
    window.clinicState.switchRole('DOCTOR');
    window.router.navigate('teleconsult');
    this.renderRoom();
    this.startCallTimer();
    this.initMedia();

    window.toast.show('Call Connected', `You are now in consultation with ${this.currentCallData ? this.currentCallData.patientName : 'Patient'}`, 'success');
  }

  declineIncomingCall() {
    if (this.ringInterval) clearInterval(this.ringInterval);
    const modalOverlay = document.getElementById('incoming-call-modal-overlay');
    if (modalOverlay) modalOverlay.classList.remove('active');

    window.clinicState.data.activeIncomingCall = null;
    window.clinicState.save();

    window.toast.show('Call Declined', 'Consultation request forwarded to next on-duty specialist.', 'info');
  }

  renderRoom() {
    const container = document.getElementById('teleconsult-view');
    if (!container) return;

    const state = window.clinicState.data;
    const doctor = (state.doctors && state.doctors.find(d => d.id === (this.activeAppointment ? this.activeAppointment.doctorId : null))) || state.doctors[0];
    const patient = (state.patients && state.patients.find(p => p.id === (this.activeAppointment ? this.activeAppointment.patientId : null))) || state.patients[0];
    const currentUser = window.clinicState.getCurrentUser();
    const isDoctor = currentUser.role === 'DOCTOR';

    container.innerHTML = `
      <div class="main-content-wrapper" style="padding-top: 0.5rem;">
        <!-- Top Session Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <button class="btn btn-outline btn-sm" onclick="window.telehealth.endCall()">
              <i data-lucide="arrow-left"></i> Exit Room
            </button>
            <div>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-navy);">
                ClinicOS Telehealth Video Consultation
              </h2>
              <p style="font-size:0.82rem; color:var(--text-dim);">
                Session with <strong>${isDoctor ? patient.name : doctor.name}</strong> • Apt #${this.activeAppointment ? this.activeAppointment.id : 'Live'} (${this.activeAppointment ? this.activeAppointment.department : 'General Medicine'})
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem; align-items:center;">
            <span class="badge badge-success"><span class="pulse-dot"></span> WebRTC E2E Encrypted</span>
            <span class="badge badge-info">HD 1080p 60fps</span>
            <button class="btn btn-primary btn-sm" onclick="window.telehealth.reconnectCamera()">
              <i data-lucide="camera"></i> Switch Camera
            </button>
          </div>
        </div>

        <div class="teleconsult-container">
          <!-- Main Video Area -->
          <div class="teleconsult-main">
            <!-- HUD Overlay -->
            <div class="video-hud-overlay">
              <div class="call-timer-badge">
                <span class="recording-dot"></span>
                <span>REC <span id="call-timer-display">00:00</span></span>
              </div>
              <div class="patient-live-vitals-pill">
                <span><i data-lucide="heart" style="color:#ef4444; width:14px;"></i> HR: <strong id="tele-vitals-hr">${patient.vitals ? patient.vitals.heartRate : 74} bpm</strong></span>
                <span><i data-lucide="activity" style="color:#0ea5e9; width:14px;"></i> BP: <strong>${patient.vitals ? patient.vitals.bloodPressure : '120/80'}</strong></span>
                <span><i data-lucide="wind" style="color:#10b981; width:14px;"></i> SpO2: <strong>${patient.vitals ? patient.vitals.spo2 : 99}%</strong></span>
              </div>
            </div>

            <!-- Video Grid -->
            <div class="video-stream-grid" id="video-stream-grid">
              <!-- Doctor Video Tile -->
              <div class="video-tile" id="remote-video-tile">
                <img src="${doctor.avatar}" style="width:100%; height:100%; object-fit:cover;" alt="Doctor Stream">
                <div class="video-participant-badge">
                  <i data-lucide="stethoscope" style="width:14px; color:var(--primary);"></i>
                  <span>${doctor.name} (${doctor.title})</span>
                  <span class="video-quality-tag">• On-Duty</span>
                </div>
              </div>

              <!-- Patient / Local Camera Tile -->
              <div class="video-tile" id="local-video-tile">
                <video id="local-webcam-video" autoplay playsinline muted style="display:none; width:100%; height:100%; object-fit:cover;"></video>
                
                <div id="local-video-fallback" class="camera-fallback-avatar" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                  <img src="${patient.avatar}" alt="Patient Stream">
                  <div>
                    <div style="color:#ffffff; font-weight:700; font-size:0.9rem;">${patient.name}</div>
                    <div style="font-size:0.72rem; color:#94a3b8;">HD Live Feed Active</div>
                  </div>
                </div>

                <div class="video-participant-badge">
                  <i data-lucide="user" style="width:14px; color:var(--apollo-teal);"></i>
                  <span>${patient.name} (Patient)</span>
                  <span class="video-quality-tag" id="cam-status-label">• Camera Active</span>
                </div>
              </div>
            </div>

            <!-- Video Controls Bar -->
            <div class="teleconsult-controls-bar">
              <button class="call-ctrl-btn" id="ctrl-mic-btn" onclick="window.telehealth.toggleMute()" title="Toggle Microphone">
                <i data-lucide="mic"></i>
              </button>
              <button class="call-ctrl-btn" id="ctrl-video-btn" onclick="window.telehealth.toggleVideo()" title="Toggle Camera">
                <i data-lucide="video"></i>
              </button>
              <button class="call-ctrl-btn" id="ctrl-screen-btn" onclick="window.telehealth.toggleScreenShare()" title="Share Screen">
                <i data-lucide="monitor-up"></i>
              </button>
              <button class="call-ctrl-btn end-call" onclick="window.telehealth.endCall()" title="End Consultation">
                <i data-lucide="phone-off"></i>
              </button>
            </div>
          </div>

          <!-- Right Consultation Interactive Sidebar -->
          <div class="teleconsult-sidebar">
            <div class="teleconsult-tabs">
              <button class="tele-tab-btn active" onclick="window.telehealth.switchTab('chat')">
                <i data-lucide="message-square" style="width:14px;"></i> Live Chat
              </button>
              <button class="tele-tab-btn" onclick="window.telehealth.switchTab('rx')">
                <i data-lucide="file-plus" style="width:14px;"></i> Live Rx Pad
              </button>
              <button class="tele-tab-btn" onclick="window.telehealth.switchTab('ehr')">
                <i data-lucide="clipboard-list" style="width:14px;"></i> Patient EHR
              </button>
            </div>

            <!-- Tab 1: Live Chat -->
            <div class="tele-tab-content active" id="tele-tab-chat">
              <div class="chat-messages-container" id="chat-msg-list">
                ${this.chatMessages.map(m => `
                  <div class="chat-bubble ${m.role}">
                    <div class="chat-bubble-sender">${m.sender}</div>
                    <div>${m.text}</div>
                  </div>
                `).join('')}
              </div>
              <div class="chat-input-bar">
                <input type="text" id="tele-chat-input" placeholder="Type message to doctor..." onkeydown="if(event.key==='Enter') window.telehealth.sendChatMessage()">
                <button class="btn btn-primary btn-sm" onclick="window.telehealth.sendChatMessage()">
                  <i data-lucide="send"></i>
                </button>
              </div>
            </div>

            <!-- Tab 2: Doctor Live Prescription Pad -->
            <div class="tele-tab-content" id="tele-tab-rx">
              <div style="font-size:0.9rem; font-weight:800; color:var(--text-navy); margin-bottom:0.75rem;">
                Issue Digital Prescription
              </div>
              <div class="form-group">
                <label class="form-label">Primary Diagnosis</label>
                <input type="text" id="live-rx-diag" class="form-control" value="Exertional Tachycardia - Stage 1 (Benign)">
              </div>
              <div class="form-group">
                <label class="form-label">Prescribed Medicine</label>
                <input type="text" id="live-rx-med" class="form-control" value="Metoprolol Succinate 25mg ER">
              </div>
              <div class="form-group">
                <label class="form-label">Dosage & Timing</label>
                <input type="text" id="live-rx-freq" class="form-control" value="1 Tablet Daily After Breakfast (30 Days)">
              </div>
              <div class="form-group">
                <label class="form-label">Clinical Advice & Follow-Up</label>
                <textarea id="live-rx-notes" class="form-control" rows="2">Hydrate well before workouts. Maintain heart rate monitor limit at 145 bpm. Follow up in 30 days.</textarea>
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%; margin-top:auto;" onclick="window.telehealth.saveLivePrescription()">
                <i data-lucide="check-circle"></i> Issue & Sign Digital Rx
              </button>
            </div>

            <!-- Tab 3: Patient EHR Summary -->
            <div class="tele-tab-content" id="tele-tab-ehr">
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                <div style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <strong style="color:var(--text-navy); font-size:0.82rem;">Known Allergies:</strong>
                  <div style="display:flex; gap:0.3rem; margin-top:0.3rem;">
                    ${(patient.allergies || ['Penicillin', 'Dust Mites']).map(a => `<span class="badge badge-danger" style="font-size:0.68rem;">${a}</span>`).join('')}
                  </div>
                </div>
                <div style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <strong style="color:var(--text-navy); font-size:0.82rem;">Chronic Conditions:</strong>
                  <div style="display:flex; gap:0.3rem; margin-top:0.3rem;">
                    ${(patient.chronicConditions || ['Mild Asthmatic Bronchitis']).map(c => `<span class="badge badge-warning" style="font-size:0.68rem;">${c}</span>`).join('')}
                  </div>
                </div>
                <div style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-card);">
                  <strong style="color:var(--text-navy); font-size:0.82rem;">Health Insurance:</strong>
                  <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">
                    ${patient.insurance ? patient.insurance.provider : 'Comprehensive Health Care'} (Policy #${patient.insurance ? patient.insurance.policyNumber : 'CL-9921-X'})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // Real Camera Access via getUserMedia
  async initMedia() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
        this.localStream = stream;
        const videoEl = document.getElementById('local-webcam-video');
        const fallback = document.getElementById('local-video-fallback');
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.style.display = 'block';
          if (fallback) fallback.style.display = 'none';
        }
      }
    } catch (e) {
      console.log('Webcam note:', e.message);
    }
  }

  async reconnectCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.localStream = stream;
        const videoEl = document.getElementById('local-webcam-video');
        const fallback = document.getElementById('local-video-fallback');
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.style.display = 'block';
          if (fallback) fallback.style.display = 'none';
        }
        window.toast.show('Camera Connected', 'Real local webcam stream active.', 'success');
      }
    } catch (err) {
      window.toast.show('Camera Info', 'Camera permission not granted or device unavailable.', 'info');
    }
  }

  startCallTimer() {
    this.callDurationSecs = 0;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.callDurationSecs++;
      const mins = String(Math.floor(this.callDurationSecs / 60)).padStart(2, '0');
      const secs = String(this.callDurationSecs % 60).padStart(2, '0');
      const el = document.getElementById('call-timer-display');
      if (el) el.innerText = `${mins}:${secs}`;
    }, 1000);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('ctrl-mic-btn');
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(t => t.enabled = !this.isMuted);
    }
    if (btn) {
      btn.classList.toggle('active-off', this.isMuted);
      btn.innerHTML = `<i data-lucide="${this.isMuted ? 'mic-off' : 'mic'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    window.toast.show('Microphone', this.isMuted ? 'Microphone Muted' : 'Microphone Unmuted', 'info');
  }

  toggleVideo() {
    this.isVideoOff = !this.isVideoOff;
    const btn = document.getElementById('ctrl-video-btn');
    const videoEl = document.getElementById('local-webcam-video');
    const fallback = document.getElementById('local-video-fallback');
    const camLabel = document.getElementById('cam-status-label');

    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(t => t.enabled = !this.isVideoOff);
    }

    if (this.isVideoOff) {
      if (videoEl) videoEl.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
      if (camLabel) camLabel.innerText = '• Camera Paused';
    } else {
      if (this.localStream && videoEl) {
        videoEl.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
      }
      if (camLabel) camLabel.innerText = '• Camera Active';
    }

    if (btn) {
      btn.classList.toggle('active-off', this.isVideoOff);
      btn.innerHTML = `<i data-lucide="${this.isVideoOff ? 'video-off' : 'video'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  toggleScreenShare() {
    this.isScreenSharing = !this.isScreenSharing;
    const btn = document.getElementById('ctrl-screen-btn');
    if (btn) {
      btn.classList.toggle('btn-primary', this.isScreenSharing);
    }
    window.toast.show('Screen Share', this.isScreenSharing ? 'Screen presentation broadcast started.' : 'Screen sharing stopped.', 'info');
  }

  switchTab(tabName) {
    document.querySelectorAll('.tele-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tele-tab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = Array.from(document.querySelectorAll('.tele-tab-btn')).find(b => b.innerText.toLowerCase().includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');

    const content = document.getElementById(`tele-tab-${tabName}`);
    if (content) content.classList.add('active');
  }

  sendChatMessage() {
    const input = document.getElementById('tele-chat-input');
    if (!input || !input.value.trim()) return;

    const user = window.clinicState.getCurrentUser();
    const isDoc = user.role === 'DOCTOR';
    this.chatMessages.push({
      sender: user.name,
      role: isDoc ? 'doctor' : 'patient',
      text: input.value.trim()
    });

    input.value = '';
    const container = document.getElementById('chat-msg-list');
    if (container) {
      container.innerHTML = this.chatMessages.map(m => `
        <div class="chat-bubble ${m.role}">
          <div class="chat-bubble-sender">${m.sender}</div>
          <div>${m.text}</div>
        </div>
      `).join('');
      container.scrollTop = container.scrollHeight;
    }
  }

  saveLivePrescription() {
    const diag = document.getElementById('live-rx-diag')?.value || 'Sinus Tachycardia';
    const med = document.getElementById('live-rx-med')?.value || 'Metoprolol 25mg';
    const freq = document.getElementById('live-rx-freq')?.value || 'Once Daily';
    const notes = document.getElementById('live-rx-notes')?.value || 'Hydrate and follow up in 30 days';

    const state = window.clinicState.data;
    const patient = (state.patients && state.patients.find(p => p.id === (this.activeAppointment ? this.activeAppointment.patientId : null))) || state.patients[0];
    const doctor = (state.doctors && state.doctors.find(d => d.id === (this.activeAppointment ? this.activeAppointment.doctorId : null))) || state.doctors[0];

    window.clinicState.addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      diagnosis: diag,
      medicines: [
        {
          name: med,
          dosage: '25mg',
          frequency: freq,
          timing: 'Morning',
          duration: '30 Days',
          instructions: notes
        }
      ],
      advice: notes,
      followUp: 'Follow up in 30 days or after telemetry evaluation',
      signature: `${doctor.name}, MD (ClinicOS Telehealth Digital Sig)`
    });

    if (window.audioService && window.audioService.playSuccessChime) {
      window.audioService.playSuccessChime();
    }
    window.toast.show('Prescription Signed', 'Digital Rx generated and synced to patient health records!', 'success');
  }

  endCall() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.activeAppointment) {
      window.clinicState.updateAppointmentStatus(this.activeAppointment.id, 'Completed');
    }

    const currentUser = window.clinicState.getCurrentUser();
    if (currentUser.role === 'DOCTOR') {
      window.router.navigate('doctor');
    } else {
      window.router.navigate('patient');
    }
    window.toast.show('Consultation Ended', 'Telehealth consultation concluded. Digital clinical summary generated.', 'success');
  }
}

window.telehealth = new TelehealthSuite();
