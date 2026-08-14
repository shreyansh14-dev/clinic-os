/**
 * ClinicOS: Diagnostics & Medical Imaging Hub
 * Interactive DICOM/Radiology scan viewer, diagnostic catalog, order pipeline, and lab reports.
 */

class DiagnosticsHub {
  constructor() {
    this.activeFilter = 'All';
  }

  renderDiagnosticOrders(containerId, patientId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let orders = window.clinicState.data.diagnosticOrders || [];
    if (patientId) {
      orders = orders.filter(o => o.patientId === patientId);
    }

    if (orders.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-dim);">No diagnostic reports available yet.</div>`;
      return;
    }

    container.innerHTML = orders.map(ord => `
      <div class="glass-card" style="margin-bottom:1rem; padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge ${ord.status === 'Ready' || ord.status === 'Approved' ? 'badge-success' : 'badge-warning'}">
                ${ord.status}
              </span>
              <span style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">#${ord.id} • ${ord.orderedDate}</span>
            </div>
            <h4 style="font-size:1.1rem; color:var(--text-main); margin-top:0.35rem;">${ord.testName}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
              Requested by <strong>${ord.doctorName}</strong> for <strong>${ord.patientName}</strong>
            </p>
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.viewScanModal('${ord.id}')">
              <i data-lucide="eye"></i> View Scan / DICOM
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.diagnostics.downloadReport('${ord.id}')">
              <i data-lucide="download"></i> Lab Report PDF
            </button>
          </div>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:0.9rem 1.1rem; border-radius:10px; margin-top:1rem; border:1px solid var(--border-glass);">
          <div style="font-size:0.78rem; font-weight:700; color:var(--primary-light); margin-bottom:0.25rem;">
            Clinical Pathologist Findings:
          </div>
          <p style="font-size:0.84rem; color:var(--text-main); line-height:1.4;">
            ${ord.findings}
          </p>
          <div style="font-size:0.72rem; color:var(--text-dim); margin-top:0.4rem; text-align:right;">
            Signed by: <strong>${ord.signedBy}</strong>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  viewScanModal(orderId) {
    const ord = window.clinicState.data.diagnosticOrders.find(o => o.id === orderId);
    if (!ord) return;

    let modal = document.getElementById('scan-viewer-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'scan-viewer-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:800px; background:#040812;">
        <div class="modal-header" style="border-bottom-color:rgba(255,255,255,0.1);">
          <div>
            <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="scan" style="color:var(--secondary);"></i>
              Diagnostic Imaging & DICOM Telemetry
            </h3>
            <p style="font-size:0.75rem; color:var(--text-dim);">${ord.testName} • Patient: ${ord.patientName} (${ord.orderedDate})</p>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('scan-viewer-modal').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body" style="padding:1rem;">
          <!-- Interactive Scan Canvas / Frame -->
          <div class="scan-view-frame" style="height:380px; display:flex; align-items:center; justify-content:center; position:relative; background:#000;">
            <img id="dicom-img" src="${ord.imagingPreview}" style="max-height:100%; max-width:100%; object-fit:contain; filter:contrast(110%);" alt="Scan Preview">
            
            <div style="position:absolute; top:12px; left:12px; font-family:var(--font-mono); font-size:0.72rem; color:#06B6D4; background:rgba(0,0,0,0.7); padding:4px 8px; border-radius:4px;">
              ZOOM: 100% | CONTRAST: AUTO | RESOLUTION: 2048x1536
            </div>
          </div>

          <!-- Image Filters Controls Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; background:var(--bg-surface-elevated); padding:0.75rem 1rem; border-radius:10px;">
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.adjustFilter('invert')">
                <i data-lucide="sun-moon"></i> Invert DICOM
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.adjustFilter('contrast')">
                <i data-lucide="sliders"></i> High Contrast
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.diagnostics.adjustFilter('reset')">
                <i data-lucide="rotate-ccw"></i> Reset
              </button>
            </div>
            <span class="badge badge-success">DICOM 3.0 Verified</span>
          </div>

          <div style="margin-top:1rem; font-size:0.85rem; color:var(--text-muted);">
            <strong style="color:var(--text-main);">Clinical Report Findings:</strong> ${ord.findings}
          </div>
        </div>

        <div class="modal-footer" style="border-top-color:rgba(255,255,255,0.1);">
          <button class="btn btn-secondary" onclick="document.getElementById('scan-viewer-modal').classList.remove('active')">Close Viewer</button>
          <button class="btn btn-primary" onclick="window.diagnostics.downloadReport('${ord.id}')">
            <i data-lucide="download"></i> Download Full Radiology Report
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
    window.clinicState.logAudit('DIAGNOSTIC_VIEW_SCAN', `Inspected DICOM scan for Order #${ord.id}`, `Order: ${ord.id}`);
  }

  adjustFilter(type) {
    const img = document.getElementById('dicom-img');
    if (!img) return;

    if (type === 'invert') {
      img.style.filter = img.style.filter.includes('invert') ? 'contrast(110%)' : 'invert(100%) contrast(120%)';
    } else if (type === 'contrast') {
      img.style.filter = 'contrast(180%) brightness(95%)';
    } else if (type === 'reset') {
      img.style.filter = 'contrast(110%)';
    }
  }

  openOrderTestModal() {
    let modal = document.getElementById('order-test-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'order-test-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const patient = window.clinicState.getCurrentUser();

    modal.innerHTML = `
      <div class="modal-content" style="max-width:600px;">
        <div class="modal-header">
          <h3 class="modal-title">Book Diagnostic & Lab Test</h3>
          <button class="modal-close-btn" onclick="document.getElementById('order-test-modal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select Diagnostic Examination</label>
            <select id="sel-diag-test" class="form-control">
              ${SEED_DATA.diagnosticTests.map(t => `
                <option value="${t.id}">${t.name} — $${t.price} (${t.department}, TAT: ${t.turnaround})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Referring Doctor / Self Request</label>
            <select id="sel-diag-doc" class="form-control">
              ${SEED_DATA.doctors.map(d => `
                <option value="${d.id}">${d.name} (${d.department})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Appointment Slot</label>
            <input type="datetime-local" id="diag-slot-input" class="form-control" value="2026-08-15T10:00">
          </div>

          <div class="form-group">
            <label class="form-label">Clinical Indication / Reason for Test</label>
            <textarea id="diag-reason-input" class="form-control" rows="2" placeholder="e.g. Routine cardiovascular checkup or requested by physician"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('order-test-modal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.diagnostics.confirmOrderTest()">
            <i data-lucide="check"></i> Confirm Lab Booking
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  confirmOrderTest() {
    const testId = document.getElementById('sel-diag-test').value;
    const docId = document.getElementById('sel-diag-doc').value;
    const test = SEED_DATA.diagnosticTests.find(t => t.id === testId);
    const doctor = SEED_DATA.doctors.find(d => d.id === docId);
    const currentUser = window.clinicState.getCurrentUser();

    window.clinicState.orderDiagnosticTest({
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      testName: test.name
    });

    document.getElementById('order-test-modal').classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    alert(`Diagnostic booking confirmed for ${test.name}!`);
    if (window.patientPanel) window.patientPanel.render();
  }

  downloadReport(orderId) {
    const ord = window.clinicState.data.diagnosticOrders.find(o => o.id === orderId);
    if (!ord) return;

    window.clinicState.logAudit('REPORT_DOWNLOAD', `Downloaded Diagnostic PDF for Order #${ord.id}`, `Order: ${ord.id}`);
    alert(`Generated Clinical Report PDF for ${ord.testName} (Signed by ${ord.signedBy})`);
  }
}

window.diagnostics = new DiagnosticsHub();
