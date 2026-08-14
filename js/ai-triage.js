/**
 * ClinicOS: ClinicoAI Smart Symptom Triage Engine
 * Intelligent multi-step symptom assessment, risk triage classification,
 * department matching, and 1-click consultation booking.
 */

class ClinicoAIEngine {
  constructor() {
    this.currentStep = 1;
    this.assessmentData = {
      category: null,
      symptoms: '',
      severity: 5,
      duration: '2-3 days',
      redFlags: []
    };
  }

  renderTriageModal() {
    const modalContent = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <div class="card-title-icon" style="background:rgba(6, 182, 212, 0.15); color:var(--secondary);">
            <i data-lucide="bot"></i>
          </div>
          <div>
            <h3 class="modal-title">ClinicoAI: Symptom Triage Assistant</h3>
            <p style="font-size:0.75rem; color:var(--text-dim);">AI-Assisted Clinical Guidance & Preliminary Triage</p>
          </div>
        </div>
        <button class="modal-close-btn" onclick="window.triageEngine.closeModal()">&times;</button>
      </div>

      <div class="modal-body" id="triage-modal-body">
        ${this.renderStepContent()}
      </div>

      <div class="modal-footer" id="triage-modal-footer">
        ${this.renderStepFooter()}
      </div>
    `;

    let modal = document.getElementById('triage-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'triage-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `<div class="modal-content" style="max-width:640px;">${modalContent}</div>`;
      document.body.appendChild(modal);
    } else {
      modal.querySelector('.modal-content').innerHTML = modalContent;
    }

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  renderStepContent() {
    if (this.currentStep === 1) {
      return `
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <h4 style="font-size:1rem; color:var(--text-main);">Step 1: Select Affected Body Area or Primary Concern</h4>
            <span class="badge badge-info">Step 1 of 3</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Choose the region that best describes where you are feeling discomfort:
          </p>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            ${SEED_DATA.aiTriageKnowledge.symptomCategories.map(cat => `
              <div class="triage-category-card ${this.assessmentData.category?.id === cat.id ? 'selected' : ''}" 
                   onclick="window.triageEngine.selectCategory('${cat.id}')"
                   style="border:1px solid ${this.assessmentData.category?.id === cat.id ? 'var(--primary)' : 'var(--border-glass)'}; 
                          background:${this.assessmentData.category?.id === cat.id ? 'rgba(16,185,129,0.1)' : 'var(--bg-surface-elevated)'}; 
                          padding:1rem; border-radius:12px; cursor:pointer; transition:var(--transition-smooth);">
                <div style="font-weight:700; font-size:0.9rem; color:var(--text-main); margin-bottom:0.3rem;">
                  ${cat.label.split('(')[0]}
                </div>
                <div style="font-size:0.75rem; color:var(--text-dim);">
                  ${cat.label.includes('(') ? '(' + cat.label.split('(')[1] : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.currentStep === 2) {
      return `
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <h4 style="font-size:1rem; color:var(--text-main);">Step 2: Describe Symptoms & Pain Intensity</h4>
            <span class="badge badge-info">Step 2 of 3</span>
          </div>

          <div class="form-group">
            <label class="form-label">Describe what you are experiencing in detail:</label>
            <textarea id="triage-symptoms-input" class="form-control" rows="3" 
                      placeholder="e.g. Experiencing mild shortness of breath and fluttering heart rate after jogging for 15 minutes...">${this.assessmentData.symptoms}</textarea>
          </div>

          <div class="form-group" style="margin-top:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label class="form-label">Pain / Discomfort Severity Level (1 - 10):</label>
              <span id="severity-display" style="font-family:var(--font-mono); font-weight:700; color:var(--primary-light);">${this.assessmentData.severity} / 10</span>
            </div>
            <input type="range" id="triage-severity-slider" min="1" max="10" value="${this.assessmentData.severity}" 
                   style="width:100%; accent-color:var(--primary); cursor:pointer;"
                   oninput="document.getElementById('severity-display').innerText = this.value + ' / 10'; window.triageEngine.assessmentData.severity = parseInt(this.value);">
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim); margin-top:2px;">
              <span>1 (Mild Discomfort)</span>
              <span>5 (Moderate Pain)</span>
              <span>10 (Severe / Unbearable)</span>
            </div>
          </div>

          <div class="form-group" style="margin-top:1rem;">
            <label class="form-label">How long have these symptoms lasted?</label>
            <select id="triage-duration-select" class="form-control" onchange="window.triageEngine.assessmentData.duration = this.value;">
              <option value="Less than 24 hours" ${this.assessmentData.duration === 'Less than 24 hours' ? 'selected' : ''}>Less than 24 hours</option>
              <option value="1 to 3 days" ${this.assessmentData.duration === '1 to 3 days' ? 'selected' : ''}>1 to 3 days</option>
              <option value="1 to 2 weeks" ${this.assessmentData.duration === '1 to 2 weeks' ? 'selected' : ''}>1 to 2 weeks</option>
              <option value="More than a month (Chronic)" ${this.assessmentData.duration === 'More than a month (Chronic)' ? 'selected' : ''}>More than a month (Chronic)</option>
            </select>
          </div>
        </div>
      `;
    }

    if (this.currentStep === 3) {
      // Calculate Assessment
      const cat = this.assessmentData.category || SEED_DATA.aiTriageKnowledge.symptomCategories[0];
      const severity = this.assessmentData.severity;
      let triageLevel = 'Low';
      let badgeClass = 'badge-success';
      let urgencyText = 'Non-Urgent / Routine Consultation';

      if (severity >= 8) {
        triageLevel = 'Urgent';
        badgeClass = 'badge-danger';
        urgencyText = 'High Priority: Prompt Medical Evaluation Recommended';
      } else if (severity >= 5) {
        triageLevel = 'Moderate';
        badgeClass = 'badge-warning';
        urgencyText = 'Moderate Priority: Schedule Evaluation within 24-48 Hours';
      }

      const recommendedDept = SEED_DATA.departments.find(d => d.id === cat.deptId) || SEED_DATA.departments[0];
      const matchedDoctor = SEED_DATA.doctors.find(d => d.deptId === cat.deptId) || SEED_DATA.doctors[0];

      return `
        <div>
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid var(--border-glow); border-radius:14px; padding:1.25rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span style="font-size:0.8rem; text-transform:uppercase; font-weight:700; color:var(--text-dim);">Triage Analysis Result</span>
              <span class="badge ${badgeClass}" style="font-size:0.82rem; padding:4px 10px;">Triage Level: ${triageLevel}</span>
            </div>
            <h3 style="font-size:1.2rem; color:var(--text-main); margin-bottom:0.35rem;">Recommended Department: ${recommendedDept.name}</h3>
            <p style="font-size:0.82rem; color:var(--text-muted);">${urgencyText}</p>
          </div>

          <div style="margin-bottom:1.25rem;">
            <h4 style="font-size:0.9rem; margin-bottom:0.6rem; color:var(--text-main);">Clinical Insights & Next Steps:</h4>
            <ul style="font-size:0.82rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.4rem;">
              <li>Symptoms reported: <strong>"${this.assessmentData.symptoms || 'General discomfort'}"</strong></li>
              <li>Reported duration: <strong>${this.assessmentData.duration}</strong> with pain rating <strong>${this.assessmentData.severity}/10</strong>.</li>
              <li>Preliminary triage recommends consulting with <strong>${matchedDoctor.name}</strong> (${matchedDoctor.title}).</li>
            </ul>
          </div>

          <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-glass); border-radius:12px; padding:1rem; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <img src="${matchedDoctor.avatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);">
              <div>
                <h5 style="font-size:0.92rem; color:var(--text-main);">${matchedDoctor.name}</h5>
                <p style="font-size:0.75rem; color:var(--primary-light);">${matchedDoctor.department} • Fee: $${matchedDoctor.fee}</p>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.triageEngine.bookWithTriage('${matchedDoctor.id}')">
              <i data-lucide="calendar"></i> 1-Click Book Now
            </button>
          </div>
        </div>
      `;
    }
  }

  renderStepFooter() {
    if (this.currentStep === 1) {
      return `
        <button class="btn btn-secondary" onclick="window.triageEngine.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window.triageEngine.nextStep()">Next: Symptoms & Severity &rarr;</button>
      `;
    }
    if (this.currentStep === 2) {
      return `
        <button class="btn btn-secondary" onclick="window.triageEngine.prevStep()">&larr; Back</button>
        <button class="btn btn-cyan" onclick="window.triageEngine.nextStep()">Analyze & Recommend &rarr;</button>
      `;
    }
    if (this.currentStep === 3) {
      return `
        <button class="btn btn-secondary" onclick="window.triageEngine.closeModal()">Close</button>
      `;
    }
  }

  selectCategory(catId) {
    this.assessmentData.category = SEED_DATA.aiTriageKnowledge.symptomCategories.find(c => c.id === catId);
    this.renderTriageModal();
  }

  nextStep() {
    if (this.currentStep === 1 && !this.assessmentData.category) {
      this.assessmentData.category = SEED_DATA.aiTriageKnowledge.symptomCategories[0];
    }
    if (this.currentStep === 2) {
      const input = document.getElementById('triage-symptoms-input');
      if (input) this.assessmentData.symptoms = input.value;
      window.clinicState.logAudit('AI_TRIAGE_RUN', `Ran triage check for category: ${this.assessmentData.category?.label}`, 'ClinicoAI');
    }
    this.currentStep++;
    this.renderTriageModal();
  }

  prevStep() {
    this.currentStep--;
    this.renderTriageModal();
  }

  openTriage() {
    this.currentStep = 1;
    this.renderTriageModal();
  }

  closeModal() {
    const modal = document.getElementById('triage-modal');
    if (modal) modal.classList.remove('active');
  }

  bookWithTriage(doctorId) {
    this.closeModal();
    if (window.patientPanel) {
      window.patientPanel.openBookingModal(doctorId, `AI Triage: ${this.assessmentData.symptoms} (Severity ${this.assessmentData.severity}/10, Duration: ${this.assessmentData.duration})`);
    }
  }
}

window.triageEngine = new ClinicoAIEngine();
