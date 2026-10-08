import React from 'react';
import {
  Lock,
  Users2,
  CalendarUser,
  CalendarCheck2,
  Receipt,
  FileBarChart2,
  ShieldCheck,
  Settings,
  ArrowRight,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';

export const ADMIN_WORKFLOW_STEPS = [
  {
    step: 1,
    id: 'login',
    title: 'Login',
    subtitle: 'Admin Auth & Session',
    icon: Lock,
    badgeText: 'Active Session'
  },
  {
    step: 2,
    id: 'doctors-dept',
    title: 'Manage Doctors & Departments',
    subtitle: 'Roster & Fee Schedules',
    icon: Users2,
    badgeKey: 'doctorsCount'
  },
  {
    step: 3,
    id: 'patients',
    title: 'Manage Patients & Appointments',
    subtitle: 'EMR Patient Registry',
    icon: CalendarUser,
    badgeKey: 'patientsCount'
  },
  {
    step: 4,
    id: 'appointments',
    title: 'Approve / Reschedule Appointments',
    subtitle: 'OPD Queue Clearance',
    icon: CalendarCheck2,
    badgeKey: 'pendingVisits'
  },
  {
    step: 5,
    id: 'billing',
    title: 'Manage Bills & Payments',
    subtitle: 'Ledger & Receipts',
    icon: Receipt,
    badgeKey: 'billsCount'
  },
  {
    step: 6,
    id: 'reports',
    title: 'Generate Reports',
    subtitle: 'Clinical & Financial BI',
    icon: FileBarChart2,
    badgeText: '4 Reports'
  },
  {
    step: 7,
    id: 'audit',
    title: 'Monitor Audit Logs',
    subtitle: 'Security & Access Trail',
    icon: ShieldCheck,
    badgeKey: 'auditCount'
  },
  {
    step: 8,
    id: 'config',
    title: 'System Configuration',
    subtitle: 'Clinic Governance & Setup',
    icon: Settings,
    badgeText: 'Online v2.4'
  }
];

export const AdminWorkflowPipeline = ({
  activeTab,
  onSelectTab,
  metrics = {}
}) => {
  const row1 = ADMIN_WORKFLOW_STEPS.slice(0, 4);
  const row2 = ADMIN_WORKFLOW_STEPS.slice(4, 8);

  const renderCard = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    let badge = item.badgeText;
    if (item.badgeKey && metrics[item.badgeKey] !== undefined) {
      badge = metrics[item.badgeKey];
    }

    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`group relative flex-1 min-w-[170px] sm:min-w-[190px] p-4 rounded-[22px] text-left transition-all duration-200 border cursor-pointer ${
          isActive
            ? 'bg-gradient-to-b from-[#5F2EEA] to-[#4318B4] text-white shadow-xl shadow-purple-600/25 scale-[1.02] border-purple-300 ring-2 ring-purple-400/40'
            : 'bg-white hover:bg-[#FAF8FF] text-slate-800 border-purple-100/90 shadow-sm hover:shadow-md hover:border-purple-300'
        }`}
      >
        {/* Top bar: Number badge and status indicator */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-colors shadow-xs ${
              isActive
                ? 'bg-white text-[#5F2EEA]'
                : 'bg-[#EDE7FE] text-[#5F2EEA] group-hover:bg-[#5F2EEA] group-hover:text-white'
            }`}
          >
            {item.step}
          </div>

          {badge && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isActive
                  ? 'bg-white/20 text-purple-100 border-white/30'
                  : 'bg-[#F4F0FF] text-[#5F2EEA] border-purple-200 group-hover:border-purple-300'
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Central Icon Circle */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner ${
              isActive
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-gradient-to-tr from-[#F1EAFF] to-[#FAF8FF] text-[#5F2EEA] border border-purple-100'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-xs font-black leading-tight tracking-tight m-0 line-clamp-2 ${
                isActive ? 'text-white' : 'text-slate-900 group-hover:text-[#5F2EEA]'
              }`}
            >
              {item.title}
            </h4>
            <p
              className={`text-[10px] font-semibold m-0 mt-0.5 truncate ${
                isActive ? 'text-purple-200' : 'text-slate-400'
              }`}
            >
              {item.subtitle}
            </p>
          </div>
        </div>

        {/* Active pulse bottom bar */}
        {isActive && (
          <div className="absolute -bottom-1 left-6 right-6 h-1 rounded-full bg-[#E9DF70] shadow-sm animate-pulse" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#FBF9FF] via-[#F6F1FE] to-[#F1EAFF] p-5 md:p-6 rounded-[32px] border border-purple-200/80 shadow-md space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-purple-200/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 font-black">
            <CheckCircle2 className="w-5 h-5 text-[#E9DF70]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#5F2EEA] bg-white px-2 py-0.5 rounded-full border border-purple-200">
                ADMIN WORKFLOW ARCHITECTURE
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                8 Integrated Operational Modules
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 m-0">
              Interactive Clinical & Governance Control Pipeline
            </h3>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-purple-100">
          <span>Click any card to jump directly to module</span>
        </div>
      </div>

      {/* Row 1: Steps 1 to 4 */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {row1.map((item, idx) => (
            <React.Fragment key={item.id}>
              {renderCard(item)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Row connecting bridge with down arrow indicator */}
      <div className="flex items-center justify-between px-3 text-purple-400">
        <div className="h-px bg-purple-200/80 flex-1 mr-3" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#5F2EEA] border border-purple-200 text-[10px] font-black uppercase tracking-wider shadow-2xs">
          <span>Operational Flow Continues</span>
          <ArrowDown className="w-3 h-3 text-[#5F2EEA]" />
        </div>
        <div className="h-px bg-purple-200/80 flex-1 ml-3" />
      </div>

      {/* Row 2: Steps 5 to 8 */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {row2.map((item) => (
            <React.Fragment key={item.id}>
              {renderCard(item)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
