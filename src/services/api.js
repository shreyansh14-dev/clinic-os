const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper for fetch requests with error handling
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errData.message || 'API request failed');
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call ${endpoint} failed, falling back to local mode:`, error.message);
    return null;
  }
}

export const apiService = {
  // Auth APIs
  login: async (email, password, role, age) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, age })
    });
  },

  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Appointments
  getAppointments: async () => await request('/appointments'),
  createAppointment: async (aptData) => await request('/appointments', { method: 'POST', body: JSON.stringify(aptData) }),
  updateAppointment: async (id, data) => await request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Prescriptions
  getPrescriptions: async () => await request('/prescriptions'),
  createPrescription: async (rxData) => await request('/prescriptions', { method: 'POST', body: JSON.stringify(rxData) }),

  // Lab Tests
  getLabTests: async () => await request('/lab-tests'),
  createLabTest: async (labData) => await request('/lab-tests', { method: 'POST', body: JSON.stringify(labData) }),
  updateLabTest: async (id, data) => await request(`/lab-tests/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Bills & Payments
  getBills: async () => await request('/bills'),
  payBill: async (id, paymentMethod, transactionId) => await request(`/bills/${id}/pay`, { method: 'PATCH', body: JSON.stringify({ paymentMethod, transactionId }) }),

  // Vitals
  getVitals: async () => await request('/vitals'),
  addVital: async (vitalData) => await request('/vitals', { method: 'POST', body: JSON.stringify(vitalData) }),

  // Beds
  getBeds: async () => await request('/beds'),
  updateBed: async (id, bedData) => await request(`/beds/${id}`, { method: 'PATCH', body: JSON.stringify(bedData) }),

  // Pharmacy Inventory
  getPharmacyInventory: async () => await request('/pharmacy/inventory'),
  addPharmacyItem: async (itemData) => await request('/pharmacy/inventory', { method: 'POST', body: JSON.stringify(itemData) }),

  // Insurance Claims
  getInsuranceClaims: async () => await request('/insurance/claims'),
  submitInsuranceClaim: async (claimData) => await request('/insurance/claims', { method: 'POST', body: JSON.stringify(claimData) }),

  // Audit Logs
  getAuditLogs: async () => await request('/audit-logs'),
  addAuditLog: async (logData) => await request('/audit-logs', { method: 'POST', body: JSON.stringify(logData) }),

  // Doctors & Patients
  getDoctors: async () => await request('/doctors'),
  addDoctor: async (docData) => await request('/doctors', { method: 'POST', body: JSON.stringify(docData) }),
  getPatients: async () => await request('/patients'),

  // Telehealth Real WebRTC Signaling
  startTelehealthCall: async (callData) => await request('/telehealth/call', { method: 'POST', body: JSON.stringify(callData) }),
  getActiveTelehealthCall: async () => await request('/telehealth/active-call'),
  answerTelehealthCall: async (answerData) => await request('/telehealth/answer', { method: 'POST', body: JSON.stringify(answerData) }),
  addIceCandidate: async (candidate) => await request('/telehealth/ice-candidate', { method: 'POST', body: JSON.stringify({ candidate }) }),
  hangupTelehealthCall: async () => await request('/telehealth/hangup', { method: 'POST' })
};
