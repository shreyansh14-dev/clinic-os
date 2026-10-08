import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Clock,
  IndianRupee,
  Video,
  Bell,
  Database,
  Save,
  ShieldCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AdminSystemConfig = () => {
  const {
    doctors,
    departments,
    patients,
    appointments,
    bills,
    beds,
    auditLogs,
    showToast,
    addAuditLog
  } = useApp();

  // Hospital Profile State
  const [hospitalName, setHospitalName] = useState('Apollo Multispeciality Hospital - ClinicOS Hub');
  const [regNo, setRegNo] = useState('MH-MUM-2026-9901-CL');
  const [nabhAccreditation, setNabhAccreditation] = useState('NABH-CENTRAL-2026-A+');
  const [helpline, setHelpline] = useState('+91 22 2654 3210 / 108 SOS');
  const [address, setAddress] = useState('Bandra West, Mumbai, Maharashtra - 400050');

  // Operational Settings
  const [morningShift, setMorningShift] = useState('08:30 AM - 01:00 PM');
  const [eveningShift, setEveningShift] = useState('04:00 PM - 08:30 PM');
  const [slotDuration, setSlotDuration] = useState('20 Mins');

  // Billing Settings
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [taxRate, setTaxRate] = useState('18% GST');
  const [currencySymbol, setCurrencySymbol] = useState('₹ INR');

  // Communication & Telehealth
  const [telehealthRecording, setTelehealthRecording] = useState(true);
  const [smsGateway, setSmsGateway] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Maintenance Mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addAuditLog(
      `Updated Hospital System Configuration & Governance metadata`,
      'Hospital Admin',
      'SUCCESS'
    );
    showToast('Hospital System Configuration saved successfully!');
  };

  const handleDownloadBackup = () => {
    const backupData = {
      version: 'ClinicOS v2.4',
      exportTimestamp: new Date().toISOString(),
      hospitalName,
      registration: regNo,
      data: {
        doctorsCount: doctors.length,
        departmentsCount: departments.length,
        patientsCount: patients.length,
        appointmentsCount: appointments.length,
        billsCount: bills.length,
        bedsCount: beds.length,
        auditLogsCount: auditLogs.length,
        patients,
        appointments,
        bills,
        departments,
        beds
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clinicos_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('Created and downloaded full cryptographic JSON database backup', 'Hospital Admin');
    showToast('Full system backup downloaded successfully!');
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Settings className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  8 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Core Clinic Infrastructure &amp; Governance
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Hospital System Configuration &amp; Policies
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5F2EEA] font-extrabold text-xs border border-purple-200 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Full Database JSON Backup</span>
            </button>

            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              <Save className="w-4 h-4 text-[#E9DF70]" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Hospital Profile */}
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#5F2EEA]" />
            <h4 className="text-sm font-black text-slate-900 m-0">
              Hospital Profile &amp; Regulatory Licensure
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Hospital Entity Name</label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">State Clinical Establishment Reg No.</label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#5F2EEA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">NABH Quality Accreditation</label>
              <input
                type="text"
                required
                value={nabhAccreditation}
                onChange={(e) => setNabhAccreditation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">24/7 Emergency &amp; Ambulance Helpline</label>
              <input
                type="text"
                required
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Hospital Campus Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical OPD Shifts & Billing Config */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Operational Shifts */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-[#5F2EEA]" />
              <h4 className="text-sm font-black text-slate-900 m-0">OPD Consultation Shifts</h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Morning OPD Hours</label>
                <input
                  type="text"
                  value={morningShift}
                  onChange={(e) => setMorningShift(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Evening OPD Hours</label>
                <input
                  type="text"
                  value={eveningShift}
                  onChange={(e) => setEveningShift(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Standard Slot Duration</label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA] bg-white"
                >
                  <option value="15 Mins">15 Minutes (Express OPD)</option>
                  <option value="20 Mins">20 Minutes (Standard Consultation)</option>
                  <option value="30 Mins">30 Minutes (Comprehensive Review)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Tax & Billing Config */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-black text-slate-900 m-0">Tax &amp; Financial Ledger Settings</h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Hospital GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Applicable Tax Tariff</label>
                <input
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Currency Notation</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Telehealth & Notifications Toggles */}
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Video className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-black text-slate-900 m-0">
              Telemedicine &amp; Gateway Communication
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="text-xs font-extrabold text-slate-900 block">Auto Telehealth Recording</strong>
                <span className="text-[10px] text-slate-400 font-semibold">Stores consultation video securely</span>
              </div>
              <button
                type="button"
                onClick={() => setTelehealthRecording(!telehealthRecording)}
                className={`w-12 h-6 rounded-full transition-colors p-1 border-none cursor-pointer flex items-center ${
                  telehealthRecording ? 'bg-[#5F2EEA] justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="text-xs font-extrabold text-slate-900 block">SMS Notification Gateway</strong>
                <span className="text-[10px] text-slate-400 font-semibold">Sends appointment OTPs &amp; reminders</span>
              </div>
              <button
                type="button"
                onClick={() => setSmsGateway(!smsGateway)}
                className={`w-12 h-6 rounded-full transition-colors p-1 border-none cursor-pointer flex items-center ${
                  smsGateway ? 'bg-[#5F2EEA] justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="text-xs font-extrabold text-slate-900 block">WhatsApp EMR Reports</strong>
                <span className="text-[10px] text-slate-400 font-semibold">Sends lab PDFs to verified phone</span>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappNotifications(!whatsappNotifications)}
                className={`w-12 h-6 rounded-full transition-colors p-1 border-none cursor-pointer flex items-center ${
                  whatsappNotifications ? 'bg-[#5F2EEA] justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance Mode Caution */}
        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block">
                Hospital Maintenance Mode
              </strong>
              <p className="text-[11px] text-slate-600 m-0">
                When enabled, patient appointment bookings are placed on hold while clinical database maintenance runs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !maintenanceMode;
              setMaintenanceMode(next);
              showToast(next ? 'System placed in Maintenance Mode.' : 'Maintenance Mode deactivated.', next ? 'warn' : 'success');
              addAuditLog(`Maintenance Mode toggle changed: ${next ? 'ON' : 'OFF'}`, 'Hospital Admin', 'WARN');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border transition-all ${
              maintenanceMode
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {maintenanceMode ? 'Active (Turn Off)' : 'Enable Maintenance'}
          </button>
        </div>
      </form>
    </div>
  );
};
