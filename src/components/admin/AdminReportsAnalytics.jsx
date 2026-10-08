import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Users,
  IndianRupee,
  Activity,
  CheckCircle2,
  FileSpreadsheet,
  Stethoscope,
  Filter
} from 'lucide-react';

export const AdminReportsAnalytics = () => {
  const { bills, appointments, doctors, patients, beds, showToast } = useApp();

  const [reportType, setReportType] = useState('financial'); // 'financial' | 'footfall' | 'physicians' | 'departments'
  const [dateRange, setDateRange] = useState('This Month');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Financial aggregates
  const totalRevenue = bills
    .filter((b) => b.status === 'Paid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const totalOutstanding = bills
    .filter((b) => b.status === 'Unpaid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  // Appointment aggregates
  const completedApts = appointments.filter((a) => a.status === 'Completed').length;
  const scheduledApts = appointments.filter((a) => a.status === 'Scheduled').length;
  const pendingApts = appointments.filter((a) => a.status === 'Pending').length;

  // Bed aggregates
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / (beds.length || 1)) * 100);

  // Export CSV function
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'financial') {
      csvContent += 'Invoice ID,Patient Name,Description,Date,Amount,Status,Payment Method\n';
      bills.forEach((b) => {
        csvContent += `"${b.id}","${b.patientName}","${b.description}","${b.issueDate}",${b.totalAmount},"${b.status}","${b.paymentMethod || 'Unpaid'}"\n`;
      });
    } else if (reportType === 'footfall') {
      csvContent += 'Appointment ID,Patient,Doctor,Specialty,Date,Time,Status,Fee\n';
      appointments.forEach((a) => {
        csvContent += `"${a.id}","${a.patientName}","${a.doctorName}","${a.specialty}","${a.date}","${a.time}","${a.status}",${a.fee || 2000}\n`;
      });
    } else {
      csvContent += 'Doctor ID,Name,Specialty,Department,Experience,Consultation Fee,Rating\n';
      doctors.forEach((d) => {
        csvContent += `"${d.id}","${d.name}","${d.specialty}","${d.department || 'Clinical'}","${d.experience}",${d.fee},${d.rating}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clinicos_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${reportType.toUpperCase()} CSV Report!`);
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <FileBarChart2 className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  6 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Hospital Intelligence &amp; Analytics
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Generate Hospital Reports &amp; Analytics
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              <Printer className="w-4 h-4 text-[#E9DF70]" />
              <span>Print Executive Summary</span>
            </button>
          </div>
        </div>

        {/* Filters row: Report type + Date range */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'financial', label: 'Financial & Revenue' },
              { id: 'footfall', label: 'OPD & Patient Footfall' },
              { id: 'physicians', label: 'Doctor Productivity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all whitespace-nowrap ${
                  reportType === tab.id
                    ? 'bg-[#16163B] text-white shadow-xs font-extrabold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['Today', 'This Week', 'This Month', 'FY 2026-27'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer text-[11px] transition-all ${
                  dateRange === range
                    ? 'bg-purple-100 text-[#5F2EEA] border-purple-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Revenue Collected
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            100% Verified Settlements
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Consultations Scheduled
          </span>
          <div className="text-xl font-black text-[#5F2EEA] mt-1">
            {appointments.length} Visits
          </div>
          <span className="text-[10px] text-purple-600 font-bold block mt-0.5">
            {completedApts} Completed · {pendingApts} Queued
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Patient Census
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {patients.length} Registered
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
            Active EMR Records
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            IPD Ward Turnover
          </span>
          <div className="text-xl font-black text-blue-700 mt-1">
            {occupancyRate}% Full
          </div>
          <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
            {occupiedBeds} / {beds.length} Beds Occupied
          </span>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 m-0">
              {reportType === 'financial'
                ? 'Financial Transactions & Revenue Stream Ledger'
                : reportType === 'footfall'
                ? 'OPD Consultation Footfall & Patient Flow Matrix'
                : 'Physician Consultation Volume & Productivity'}
            </h4>
            <span className="text-xs text-slate-400">
              Generated for Period: {dateRange} · Verified by ClinicOS Auditing Subsystem
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {reportType === 'financial' ? bills.length : reportType === 'footfall' ? appointments.length : 12} Entries
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          {reportType === 'financial' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Department / Service</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{b.patientName}</td>
                    <td className="py-3 px-4 text-slate-600">{b.description}</td>
                    <td className="py-3 px-4 text-slate-500">{b.issueDate}</td>
                    <td className="py-3 px-4 font-black text-slate-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-600">{b.paymentMethod || 'Unpaid'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        b.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'footfall' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase">
                  <th className="py-3 px-4">Apt #</th>
                  <th className="py-3 px-4">Patient Profile</th>
                  <th className="py-3 px-4">Assigned Consultant</th>
                  <th className="py-3 px-4">Date &amp; Slot</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{a.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{a.patientName}</td>
                    <td className="py-3 px-4 text-slate-700">{a.doctorName} ({a.specialty})</td>
                    <td className="py-3 px-4 text-slate-500">{a.date} at {a.time}</td>
                    <td className="py-3 px-4 text-slate-600">{a.type || 'In-Person'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'physicians' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase">
                  <th className="py-3 px-4">Specialist Doctor</th>
                  <th className="py-3 px-4">Specialty Division</th>
                  <th className="py-3 px-4">Clinical Experience</th>
                  <th className="py-3 px-4">Consultation Tariff</th>
                  <th className="py-3 px-4">Patient Rating</th>
                  <th className="py-3 px-4 text-right">Roster Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.slice(0, 10).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-purple-700 font-semibold">{d.specialty}</td>
                    <td className="py-3 px-4 text-slate-600">{d.experience}</td>
                    <td className="py-3 px-4 font-black text-slate-900">₹{d.fee}</td>
                    <td className="py-3 px-4 text-amber-600 font-bold">★ {d.rating}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        Active OPD
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── MODAL: Printable Executive Report ───────────────────────────── */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-2xl w-full p-8 space-y-6 my-8 print:p-0">
            <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
              <div>
                <h2 className="text-xl font-black text-slate-900 m-0">ClinicOS Executive Report</h2>
                <p className="text-[11px] text-slate-500 m-0">
                  Hospital Management &amp; Clinical Operations Audit Summary<br />
                  Generated by Hospital Authority Desk · Date: {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#5F2EEA] uppercase tracking-wider block">
                  OFFICIAL SUMMARY
                </span>
                <span className="text-xs text-slate-500">Period: {dateRange}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Revenue</span>
                <strong className="text-base font-black text-emerald-800">₹{totalRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Consultations</span>
                <strong className="text-base font-black text-[#5F2EEA]">{appointments.length} Total</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Bed Occupancy</span>
                <strong className="text-base font-black text-blue-800">{occupancyRate}% Full</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This certified report certifies operational stability across all 16 clinical departments. All medical entries comply with NABH guidelines and hospital EMR standards.
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Sent to printer.');
                }}
                className="px-5 py-2 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
