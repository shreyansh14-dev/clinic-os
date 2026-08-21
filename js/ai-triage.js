/**
 * ClinicOS 24|7: ClinicoAI Symptom Triage & Clinical Assistant
 * 24/7 Intelligent Diagnostic Engine with 1-click Emergency Video Consultation Escalation.
 */

class TriageEngine {
  constructor() {
    this.modalEl = null;
    this.messages = [];
    this.step = 0;
    this.selectedSpecialty = 'General Physician';
  }

  openTriage() {
    let overlay = document.getElementById('triage-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'triage-modal-overlay';
      overlay.className = 'incoming-call-overlay';
      overlay.style.display = 'flex';
      overlay.innerHTML = `
        <div class="incoming-call-modal" style="width:540px; max-width:92vw; text-align:left; padding:1.5rem; display:flex; flex-direction:column; height:580px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.75rem; margin-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <div style="width:36px; height:36px; border-radius:50%; background:var(--apollo-purple-light); color:var(--apollo-purple); display:flex; align-items:center; justify-content:center;">
                <i data-lucide="bot" style="width:20px; height:20px;"></i>
              </div>
              <div>
                <strong style="color:var(--apollo-navy); font-size:1.05rem;">Apollo ClinicoAI Triage</strong>
                <div style="font-size:0.72rem; color:#10b981; font-weight:700;">● Online 24/7 • AI Medical Assessment</div>
              </div>
            </div>
            <button onclick="window.triageEngine.closeTriage()" style="background:transparent; border:none; font-size:1.4rem; color:var(--text-dim); cursor:pointer;">&times;</button>
          </div>

          <div id="triage-chat-body" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem; padding-right:4px;"></div>

          <div id="triage-quick-options" style="display:flex; gap:0.4rem; flex-wrap:wrap; margin:0.5rem 0;"></div>

          <div style="display:flex; gap:0.5rem; border-top:1px solid var(--border-subtle); padding-top:0.75rem;">
            <input type="text" id="triage-input-field" placeholder="Describe symptoms (e.g. headache, fever, chest pain)..." class="form-control" style="border-radius:var(--radius-pill);" onkeydown="if(event.key==='Enter') window.triageEngine.sendUserMessage()">
            <button class="btn btn-primary" onclick="window.triageEngine.sendUserMessage()">
              <i data-lucide="send"></i>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    } else {
      overlay.style.display = 'flex';
    }

    this.step = 0;
    this.messages = [
      { role: 'bot', text: 'Hello! I am your Apollo 24|7 ClinicoAI assistant. How are you feeling today? You can select a common symptom below or describe what you are experiencing.' }
    ];
    this.renderChat();
    this.renderQuickChips(['Chest Pain / Palpitations', 'High Fever & Chills', 'Persistent Headache', 'Skin Rash / Allergy', 'Cough & Cold']);
    if (window.lucide) window.lucide.createIcons();
  }

  closeTriage() {
    const overlay = document.getElementById('triage-modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  renderChat() {
    const body = document.getElementById('triage-chat-body');
    if (!body) return;

    body.innerHTML = this.messages.map(m => `
      <div style="display:flex; gap:0.5rem; align-self:${m.role === 'user' ? 'flex-end' : 'flex-start'}; max-width:85%;">
        ${m.role === 'bot' ? `<div style="width:26px; height:26px; border-radius:50%; background:var(--apollo-purple-light); color:var(--apollo-purple); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.7rem;"><i data-lucide="bot" style="width:14px; height:14px;"></i></div>` : ''}
        <div style="background:${m.role === 'user' ? 'var(--apollo-orange)' : 'var(--bg-subtle)'}; color:${m.role === 'user' ? '#ffffff' : 'var(--text-main)'}; padding:0.65rem 0.95rem; border-radius:var(--radius-md); font-size:0.84rem; line-height:1.45; border:${m.role === 'user' ? 'none' : '1px solid var(--border-card)'};">
          ${m.text}
        </div>
      </div>
    `).join('');

    body.scrollTop = body.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  renderQuickChips(chips) {
    const optContainer = document.getElementById('triage-quick-options');
    if (!optContainer) return;

    optContainer.innerHTML = chips.map(c => `
      <button class="search-chip" onclick="window.triageEngine.handleChipSelect('${c}')">${c}</button>
    `).join('');
  }

  handleChipSelect(text) {
    const input = document.getElementById('triage-input-field');
    if (input) input.value = text;
    this.sendUserMessage();
  }

  sendUserMessage() {
    const input = document.getElementById('triage-input-field');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    this.messages.push({ role: 'user', text: userText });
    this.renderChat();

    // AI diagnostic response
    setTimeout(() => {
      this.processSymptomLogic(userText);
    }, 600);
  }

  processSymptomLogic(text) {
    const lower = text.toLowerCase();

    if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation') || lower.includes('flutter')) {
      this.selectedSpecialty = 'Cardiology';
      this.messages.push({
        role: 'bot',
        text: `<strong>🚨 Clinical Triage Assessment: High Priority (Cardiology)</strong><br><br>Based on your reported cardiovascular symptoms, we recommend an immediate online video evaluation with a Cardiologist.<br><br>
        <button class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="window.triageEngine.closeTriage(); window.telehealth.startInstantConsultation('Cardiology');">
          <i data-lucide="video"></i> Connect to Cardiologist Now
        </button>`
      });
      this.renderQuickChips(['Slight shortness of breath', 'No pain radiating to arm', 'Symptoms started today']);
    } else if (lower.includes('rash') || lower.includes('skin') || lower.includes('itch') || lower.includes('allergy')) {
      this.selectedSpecialty = 'Dermatology';
      this.messages.push({
        role: 'bot',
        text: `<strong>Clinical Triage Assessment: Dermatology OPD</strong><br><br>Possible contact dermatitis or allergic urticaria. Our top Dermatologists are available on video call in under 10 minutes.<br><br>
        <button class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="window.triageEngine.closeTriage(); window.telehealth.startInstantConsultation('Dermatology');">
          <i data-lucide="video"></i> Video Consult Dermatologist
        </button>`
      });
      this.renderQuickChips(['Itching is moderate', 'Started after new soap', 'No facial swelling']);
    } else {
      this.selectedSpecialty = 'General Physician';
      this.messages.push({
        role: 'bot',
        text: `<strong>Clinical Triage Assessment: General Medicine</strong><br><br>Symptoms match acute viral or seasonal changes. A General Physician can assess you right now and issue an e-prescription.<br><br>
        <button class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="window.triageEngine.closeTriage(); window.telehealth.startInstantConsultation('General Physician');">
          <i data-lucide="video"></i> Start Video Call (< 2m wait)
        </button>`
      });
      this.renderQuickChips(['Fever under 100 F', 'Feeling mild fatigue', 'Mild sore throat']);
    }

    this.renderChat();
  }
}

window.triageEngine = new TriageEngine();
