/**
 * ClinicOS: Billing & Payment Processing Suite
 * Itemized medical invoices, insurance co-pay calculation, simulated payment gateway, and receipt printing.
 */

class BillingHub {
  constructor() {}

  renderInvoices(containerId, patientId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let invoices = window.clinicState.data.invoices || [];
    if (patientId) {
      invoices = invoices.filter(i => i.patientId === patientId);
    }

    if (invoices.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-dim);">No billing statements on record.</div>`;
      return;
    }

    container.innerHTML = invoices.map(inv => `
      <div class="glass-card" style="margin-bottom:1rem; padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}">
                ${inv.status}
              </span>
              <span style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">#${inv.id} • Issued: ${inv.date}</span>
            </div>
            <h4 style="font-size:1.15rem; color:var(--text-main); margin-top:0.35rem;">
              Medical Statement for ${inv.patientName}
            </h4>
            <p style="font-size:0.8rem; color:var(--text-dim);">Due Date: ${inv.dueDate}</p>
          </div>

          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-dim);">Total Patient Due</div>
            <div style="font-size:1.6rem; font-family:var(--font-heading); font-weight:800; color:${inv.status === 'Paid' ? 'var(--primary-light)' : '#F59E0B'};">
              $${inv.totalDue.toFixed(2)}
            </div>
          </div>
        </div>

        <!-- Itemized Line Items -->
        <div style="background:var(--bg-surface-elevated); padding:0.9rem 1.1rem; border-radius:10px; margin-top:1rem; border:1px solid var(--border-glass);">
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.5rem; letter-spacing:0.04em;">
            Itemized Clinical Services
          </div>
          ${inv.items.map(item => `
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:0.3rem 0; border-bottom:1px solid rgba(255,255,255,0.04);">
              <span style="color:var(--text-muted);">${item.desc}</span>
              <span style="color:var(--text-main); font-family:var(--font-mono); font-weight:600;">$${item.amount.toFixed(2)}</span>
            </div>
          `).join('')}

          <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:0.3rem 0; color:var(--text-dim); margin-top:0.3rem;">
            <span>Subtotal:</span>
            <span style="font-family:var(--font-mono);">$${inv.subtotal.toFixed(2)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:0.3rem 0; color:var(--primary-light);">
            <span>Insurance Coverage (Covered):</span>
            <span style="font-family:var(--font-mono);">- $${inv.insuranceCoverage.toFixed(2)}</span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="font-size:0.75rem; color:var(--text-dim);">
            ${inv.status === 'Paid' ? `Paid via <strong>${inv.paymentMethod}</strong> (Txn: ${inv.transactionId})` : 'Awaiting online settlement.'}
          </div>

          <div style="display:flex; gap:0.5rem;">
            ${inv.status !== 'Paid' ? `
              <button class="btn btn-primary btn-sm" onclick="window.billing.openPaymentModal('${inv.id}')">
                <i data-lucide="credit-card"></i> Pay Now ($${inv.totalDue.toFixed(2)})
              </button>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="window.billing.printReceipt('${inv.id}')">
                <i data-lucide="printer"></i> Download Receipt
              </button>
            `}
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  openPaymentModal(invoiceId) {
    const inv = window.clinicState.data.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    let modal = document.getElementById('payment-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'payment-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width:520px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="card-title-icon"><i data-lucide="shield-check"></i></div>
            <h3 class="modal-title">Secure Medical Payment</h3>
          </div>
          <button class="modal-close-btn" onclick="document.getElementById('payment-modal').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body">
          <div style="background:var(--bg-surface-elevated); padding:1rem; border-radius:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-dim);">Statement #${inv.id}</div>
              <div style="font-size:0.9rem; font-weight:700; color:var(--text-main);">${inv.patientName}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.72rem; color:var(--text-dim);">Amount to Pay</div>
              <div style="font-size:1.4rem; font-family:var(--font-heading); font-weight:800; color:var(--primary-light);">$${inv.totalDue.toFixed(2)}</div>
            </div>
          </div>

          <!-- Payment Options -->
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin-bottom:1.25rem;">
            <button class="btn btn-secondary btn-sm active" style="border-color:var(--primary);" onclick="window.billing.selectPayMethod('card', this)">
              <i data-lucide="credit-card"></i> Card
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.billing.selectPayMethod('applepay', this)">
              <i data-lucide="smartphone"></i> Apple Pay
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.billing.selectPayMethod('upi', this)">
              <i data-lucide="qr-code"></i> UPI / QR
            </button>
          </div>

          <div id="pay-fields-container">
            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-control" value="•••• •••• •••• 4242" placeholder="4532 0000 0000 0000">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="text" class="form-control" value="08/29" placeholder="MM/YY">
              </div>
              <div class="form-group">
                <label class="form-label">CVC / CVV</label>
                <input type="password" class="form-control" value="888" placeholder="123">
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.72rem; color:var(--text-dim); margin-top:0.5rem;">
            <i data-lucide="lock" style="width:13px; color:var(--primary-light);"></i>
            256-Bit SSL Encrypted Healthcare Payment Gateway (HIPAA Compliant)
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('payment-modal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.billing.executePayment('${inv.id}')">
            <i data-lucide="check-circle"></i> Pay $${inv.totalDue.toFixed(2)}
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  selectPayMethod(method, btn) {
    document.querySelectorAll('#payment-modal .btn-secondary').forEach(b => b.style.borderColor = 'var(--border-glass)');
    if (btn) btn.style.borderColor = 'var(--primary)';
  }

  executePayment(invoiceId) {
    window.clinicState.processPayment(invoiceId, 'Credit Card (ending in 4242)');
    document.getElementById('payment-modal').classList.remove('active');
    if (window.audioService) window.audioService.playSuccessChime();
    alert('Payment processed successfully! Digital receipt generated.');
    if (window.patientPanel) window.patientPanel.render();
  }

  printReceipt(invoiceId) {
    const inv = window.clinicState.data.invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    alert(`Downloaded Official Receipt for Statement #${inv.id} (Paid: $${inv.totalDue.toFixed(2)})`);
  }
}

window.billing = new BillingHub();
