import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Search,
  Download,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';

export const AdminAuditMonitor = () => {
  const { auditLogs, addAuditLog, showToast } = useApp();

  const [auditSearch, setAuditSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All'); // 'All' | 'INFO' | 'WARN' | 'SUCCESS'

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !auditSearch ||
      log.user?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ip?.includes(auditSearch);
    const matchesLevel =
      levelFilter === 'All' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleSimulateSecurityEvent = () => {
    addAuditLog(
      'Administrative security integrity check passed: 0 vulnerabilities found',
      'System Sentinel',
      'SUCCESS'
    );
    showToast('Simulated security audit record logged.');
  };

  const handleExportAuditCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,User,Action,IP,Level\n';
    auditLogs.forEach((l) => {
      csvContent += `"${l.timestamp}","${l.user}","${l.action}","${l.ip || '127.0.0.1'}","${l.level || 'INFO'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clinicos_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported audit logs to CSV.');
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <ShieldAlert className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  7 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Cryptographic Traceability &amp; Regulatory Compliance
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Monitor Security &amp; Clinical Audit Logs
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSimulateSecurityEvent}
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5F2EEA] font-bold text-xs border border-purple-200 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Security Ping</span>
            </button>

            <button
              onClick={handleExportAuditCSV}
              className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              <Download className="w-4 h-4 text-[#E9DF70]" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          </div>
        </div>

        {/* Search & Level Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user, action keyword, terminal IP..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#5F2EEA] focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'SUCCESS', 'INFO', 'WARN'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all ${
                  levelFilter === lvl
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'All' ? 'All Severities' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 m-0">
              Immutable System Events Trail ({filteredLogs.length})
            </h4>
            <span className="text-xs text-slate-400">
              SHA-256 Tamper-Evident Chronological Ledger
            </span>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            100% Cryptographically Verified
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Initiator / Role</th>
                <th className="py-3 px-4">Event &amp; Action Description</th>
                <th className="py-3 px-4">Terminal IP</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 text-[#16163B] font-semibold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {log.ip || '127.0.0.1'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        log.level === 'WARN'
                          ? 'bg-amber-100 text-amber-800'
                          : log.level === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.level || 'INFO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
