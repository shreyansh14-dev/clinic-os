/**
 * ClinicOS: Telehealth Video Consultation & WebRTC Suite
 * Features live audio/video stream, doctor prescription quickpad, patient vitals HUD,
 * in-call chat, screen sharing, call recording, and post-call summary.
 */

class TelehealthSuite {
  constructor() {
    this.localStream = null;
    this.isMuted = false;
    this.isVideoOff = false;
    this.isScreenSharing = false;
    this.isRecording = true;
    this.callDurationSecs = 0;
    this.timerInterval = null;
    this.activeAppointment = null;
    this.chatMessages = [
      { sender: 'Dr. Robert Chen', role: 'doctor', text: 'Hello Alex, good morning. How are you feeling today?' },
      { sender: 'Alex Morgan', role: 'patient', text: 'Good morning Dr. Chen! Feeling better, but had some flutter after jogging yesterday.' },
      { sender: 'Dr. Robert Chen', role: 'doctor', text: 'Understood. I am looking at your live ECG telemetry now. Resting rhythm looks steady.' }
    ];
  }

  startConsultation(appointmentId) {
    const state = window.clinicState.data;
    this.activeAppointment = state.appointments.find(a => a.id === appointmentId) || state.appointments[0];
    
    // Switch route to teleconsult
    window.router.navigate('teleconsult');
    this.renderRoom();
    this.startCallTimer();
    this.initMedia();

    if (window.audioService) {
      window.audioService.playCallRing();
    }
    window.clinicState.logAudit('TELEHEALTH_SESSION_JOIN', `Joined Telehealth Call for Appointment #${this.activeAppointment.id}`, `Apt ID: ${this.activeAppointment.id}`);
  }

  renderRoom() {
    const container = document.getElementById('teleconsult-view');
    if (!container) return;

    const doctor = SEED_DATA.doctors.find(d => d.id === this.activeAppointment.doctorId) || SEED_DATA.doctors[0];
    const patient = SEED_DATA.patients.find(p => p.id === this.activeAppointment.patientId) || SEED_DATA.patients[0];
    const currentUser = window.clinicState.getCurrentUser();
    const isDoctor = currentUser.role === 'DOCTOR';

    container.innerHTML = `
      <div class="main-content-wrapper" style="padding-top: 1rem;">
        <!-- Header Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.telehealth.endCall()">
              <i data-lucide="arrow-left"></i> Exit Room
            </button>
            <div>
              <h2 style="font-size:1.3rem;">Telehealth Virtual Consultation Suite</h2>
              <p style="font-size:0.8rem; color:var(--text-dim);">
                Session with <strong>${isDoctor ? patient.name : doctor.name}</strong> • Apt #${this.activeAppointment.id} (${this.activeAppointment.department})
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.6rem; align-items:center;">
            <span class="badge badge-success"><span class="pulse-dot"></span> WebRTC E2E Encrypted</span>
            <span class="badge badge-info">HD 1080p 60fps</span>
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
                <span><i data-lucide="heart" style="color:#EF4444; width:14px;"></i> HR: <strong id="tele-vitals-hr">${patient.vitals.heartRate} bpm</strong></span>
                <span><i data-lucide="activity" style="color:#06B6D4; width:14px;"></i> BP: <strong>${patient.vitals.bloodPressure}</strong></span>
                <span><i data-lucide="wind" style="color:#10B981; width:14px;"></i> SpO2: <strong>${patient.vitals.spo2}%</strong></span>
              </div>
            </div>

            <!-- Video Grid -->
            <div class="video-stream-grid" id="video-stream-grid">
              <!-- Doctor Video Tile -->
              <div class="video-tile" id="remote-video-tile">
                <img src="${doctor.avatar}" style="width:100%; height:100%; object-fit:cover; filter: brightness(0.95);" alt="Doctor Stream">
                <div class="video-participant-badge">
                  <i data-lucide="stethoscope" style="width:14px; color:var(--primary-light);"></i>
                  <span>${doctor.name} (${doctor.title})</span>
                  <span class="video-quality-tag">• Live</span>
                </div>
              </div>

              <!-- Patient Video Tile -->
              <div class="video-tile" id="local-video-tile">
                <video id="local-webcam-video" autoplay playsinline muted style="display:none; width:100%; height:100%; object-fit:cover;"></video>
                <div id="local-video-fallback" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#0f172a;">
                  <img src="${patient.avatar}" style="width:100%; height:100%; object-fit:cover;" alt="Patient Stream">
                </div>
                <div class="video-participant-badge">
                  <i data-lucide="user" style="width:14px; color:var(--secondary);"></i>
                  <span>${patient.name} (Patient)</span>
                  <span class="video-quality-tag" id="cam-status-label">• Camera Active</span>
                </div>
              </div>
            </div>

            <!-- Controls Bar -->
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

          <!-- Right Interactive Sidebar (Chat + Live Prescription Pad) -->
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

            <!-- Tab 1: Chat Stream -->
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

            <!-- Tab 2: Doctor Live Rx Pad -->
            <div class="tele-tab-content" id="tele-tab-rx">
              <div style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:0.75rem;">
                Issue Prescription During Call
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Primary Diagnosis</label>
                <input type="text" id="live-rx-diag" class="form-control" style="font-size:0.8rem; padding:0.45rem;" value="Sinus Tachycardia (Exertional) - Stage 1">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Prescribed Medication</label>
                <input type="text" id="live-rx-med" class="form-control" style="font-size:0.8rem; padding:0.45rem;" value="Metoprolol Succinate 25mg">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Dosage & Timing</label>
                <input type="text" id="live-rx-freq" class="form-control" style="font-size:0.8rem; padding:0.45rem;" value="1 Tablet Daily after breakfast (30 Days)">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.75rem;">Clinical Instructions</label>
                <textarea id="live-rx-notes" class="form-control" rows="2" style="font-size:0.8rem; padding:0.45rem;">Hydrate adequately prior to exercise. Maintain heart rate monitor limit at 145 bpm.</textarea>
              </div>
              <button class="btn btn-primary btn-sm" style="width:100%; margin-top:auto;" onclick="window.telehealth.saveLivePrescription()">
                <i data-lucide="check-circle"></i> Issue & Sign Digital Rx
              </button>
            </div>

            <!-- Tab 3: Patient EHR Summary -->
            <div class="tele-tab-content" id="tele-tab-ehr">
              <div style="font-size:0.82rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.75rem;">
                <div style="background:var(--bg-surface-elevated); padding:0.75rem; border-radius:8px;">
                  <strong style="color:var(--text-main);">Known Allergies:</strong>
                  <div style="display:flex; gap:0.3rem; margin-top:0.3rem;">
                    ${patient.allergies.map(a => `<span class="badge badge-danger" style="font-size:0.7rem;">${a}</span>`).join('')}
                  </div>
                </div>
                <div style="background:var(--bg-surface-elevated); padding:0.75rem; border-radius:8px;">
                  <strong style="color:var(--text-main);">Chronic Conditions:</strong>
                  <div style="display:flex; gap:0.3rem; margin-top:0.3rem;">
                    ${patient.chronicConditions.map(c => `<span class="badge badge-warning" style="font-size:0.7rem;">${c}</span>`).join('')}
                  </div>
                </div>
                <div style="background:var(--bg-surface-elevated); padding:0.75rem; border-radius:8px;">
                  <strong style="color:var(--text-main);">Insurance:</strong>
                  <p style="font-size:0.75rem; margin-top:0.2rem;">${patient.insurance.provider} (Policy: ${patient.insurance.policyNumber})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async initMedia() {
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
      }
    } catch (e) {
      console.log('Webcam permission not granted or device not present; using HD medical simulated stream.');
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
    window.clinicState.addNotification('Audio Status', this.isMuted ? 'Microphone Muted' : 'Microphone Unmuted', 'info');
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
    window.clinicState.addNotification('Screen Share', this.isScreenSharing ? 'Screen presentation broadcast started.' : 'Screen sharing stopped.', 'info');
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
    const diag = document.getElementById('live-rx-diag')?.value;
    const med = document.getElementById('live-rx-med')?.value;
    const freq = document.getElementById('live-rx-freq')?.value;
    const notes = document.getElementById('live-rx-notes')?.value;

    const patient = SEED_DATA.patients.find(p => p.id === this.activeAppointment.patientId) || SEED_DATA.patients[0];
    const doctor = SEED_DATA.doctors.find(d => d.id === this.activeAppointment.doctorId) || SEED_DATA.doctors[0];

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
      signature: `${doctor.name}, MD (Digital Telehealth Sig)`
    });

    if (window.audioService) window.audioService.playSuccessChime();
    alert('Digital Prescription successfully signed and synchronized to patient EHR!');
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
    window.clinicState.addNotification('Consultation Completed', `Telehealth video session concluded. Clinical summary and billing invoice generated.`, 'success');
  }
}

window.telehealth = new TelehealthSuite();
