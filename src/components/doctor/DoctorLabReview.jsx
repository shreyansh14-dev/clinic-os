import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TestTube2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Check,
  Clock,
  Eye,
  ShieldCheck,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const DoctorLabReview = () => {
  const { labTests, activeDoctor, publishLabReport, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportModal, setSelectedReportModal] = useState(null);

  // Enriched diagnostic panels data
  const samplePanelResults = {
    'Complete Blood Count (CBC)': [
      { param: 'Hemoglobin', value: '14.2 g/dL', normal: '13.0 - 17.0', status: 'Normal' },
      { param: 'Total WBC Count', value: '11,400 /mcL', normal: '4,000 - 11,000', status: 'High', alert: true },
      { param: 'Platelet Count', value: '240,000 /mcL', normal: '150,000 - 450,000', status: 'Normal' },
      { param: 'RBC Count', value: '4.8 mil/mcL', normal: '4.5 - 5.9', status: 'Normal' },
      { param: 'ESR (Erythrocyte Sed.)', value: '28 mm/hr', normal: '0 - 15', status: 'High', alert: true }
    ],
    'Lipid Profile': [
      { param: 'Total Cholesterol', value: '235 mg/dL', normal: '< 200', status: 'High', alert: true },
      { param: 'HDL (Good)', value: '44 mg/dL', normal: '> 40', status: 'Normal' },
      { param: 'LDL (Bad)', value: '155 mg/dL', normal: '< 100', status: 'High', alert: true },
      { param: 'Triglycerides', value: '180 mg/dL', normal: '< 150', status: 'Borderline', alert: true }
    ],
    'Comprehensive Metabolic Panel (CMP)': [
      { param: 'Fasting Blood Glucose', value: '108 mg/dL', normal: '70 - 99', status: 'Pre-diabetic', alert: true },
      { param: 'Blood Urea Nitrogen', value: '16 mg/dL', normal: '7 - 20', status: 'Normal' },
      { param: 'Serum Creatinine', value: '0.9 mg/dL', normal: '0.7 - 1.3', status: 'Normal' },
      { param: 'Serum Potassium', value: '4.2 mEq/L', normal: '3.5 - 5.0', status: 'Normal' }
    ]
  };

  const filteredTests = labTests.filter(test => {
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Pending' && test.status !== 'Approved' && test.status !== 'Completed') ||
      (filterStatus === 'Approved' && (test.status === 'Approved' || test.status === 'Completed'));

    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (test.testName && test.testName.toLowerCase().includes(query)) ||
      (test.name && test.name.toLowerCase().includes(query)) ||
      (test.patientName && test.patientName.toLowerCase().includes(query)) ||
      (test.id && test.id.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = labTests.filter(t => t.status !== 'Approved' && t.status !== 'Completed').length;
  const approvedCount = labTests.filter(t => t.status === 'Approved' || t.status === 'Completed').length;

  const handleApproveReport = (testId, testName) => {
    publishLabReport(testId, {
      verifiedBy: activeDoctor?.name || 'Dr. Souvik Sinha',
      signedAt: new Date().toISOString()
    });
    showToast(`Lab report for ${testName} digitally signed & released to patient portal!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 font-['Poppins']">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] rounded-[32px] p-7 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
              Diagnostic Pathology &amp; Radiology
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Doctor Electronic Sign-Off
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
            Diagnostic &amp; Lab Reports Review
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium m-0 mt-1 max-w-xl">
            Review biochemical panels, hematology findings, radiology reports, identify abnormal critical values, and certify reports for patient records.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Awaiting Sign-Off</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-2xl font-black text-emerald-400">{approvedCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Approved &amp; Published</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, test name or sample ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            {['All', 'Pending', 'Approved'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg font-bold border-none cursor-pointer text-xs transition-all ${
                  filterStatus === st
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500">
          {filteredTests.length} Reports Found
        </div>
      </div>

      {/* Lab Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(test => {
          const testName = test.testName || test.name || 'Complete Blood Count (CBC)';
          const params = samplePanelResults[testName] || samplePanelResults['Complete Blood Count (CBC)'];
          const hasAbnormal = params.some(p => p.alert);
          const isApproved = test.status === 'Approved' || test.status === 'Completed';

          return (
            <div
              key={test.id}
              className="bg-white rounded-[26px] border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#16163B] text-white flex items-center justify-center font-black shadow-xs">
                      <TestTube2 className="w-5 h-5 text-[#E9DF70]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 m-0">{testName}</h4>
                      <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                        Patient: <strong>{test.patientName}</strong> · ID: {test.id}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {isApproved ? 'Signed & Released' : 'Pending Review'}
                  </span>
                </div>

                {/* Parameters Preview Table */}
                <div className="mt-3.5 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-200/60">
                    <span>Analyte Parameter</span>
                    <span>Result Value</span>
                    <span>Ref. Range</span>
                  </div>

                  {params.slice(0, 3).map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="font-bold text-slate-700">{p.param}</span>
                      <span className={`font-black ${p.alert ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
                        {p.value} {p.alert && '⚠️'}
                      </span>
                      <span className="text-slate-400 text-[11px]">{p.normal}</span>
                    </div>
                  ))}
                  {params.length > 3 && (
                    <div className="text-[10px] font-bold text-slate-400 text-center pt-1">
                      + {params.length - 3} more biochemical analytes
                    </div>
                  )}
                </div>

                {/* Abnormal alert warning if any */}
                {hasAbnormal && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Abnormal values detected outside reference interval.</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedReportModal({ ...test, params, testName })}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Panel</span>
                </button>

                {!isApproved ? (
                  <button
                    onClick={() => handleApproveReport(test.id, testName)}
                    className="px-4 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                  >
                    <Check className="w-3.5 h-3.5 text-[#E9DF70]" />
                    <span>Approve &amp; Sign</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified by {activeDoctor?.name?.split(' ')[1] || 'Doctor'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Full Panel Modal */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 max-w-xl w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 m-0">{selectedReportModal.testName}</h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Patient: {selectedReportModal.patientName} · Sample ID: {selectedReportModal.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-4 text-[10px] font-black uppercase text-slate-400 p-2 bg-slate-50 rounded-xl">
                <span className="col-span-2">Analyte Test</span>
                <span>Measured</span>
                <span>Reference</span>
              </div>
              {selectedReportModal.params.map((p, i) => (
                <div key={i} className={`grid grid-cols-4 p-2.5 rounded-xl text-xs font-bold items-center ${
                  p.alert ? 'bg-rose-50 text-rose-900' : 'bg-slate-50 text-slate-800'
                }`}>
                  <span className="col-span-2">{p.param}</span>
                  <span className={p.alert ? 'font-black text-rose-600' : ''}>{p.value}</span>
                  <span className="text-slate-400 text-[11px]">{p.normal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedReportModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border-none cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveReport(selectedReportModal.id, selectedReportModal.testName);
                  setSelectedReportModal(null);
                }}
                className="px-4 py-2 bg-[#16163B] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[#E9DF70]" />
                <span>Approve &amp; Sign Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorLabReview;
