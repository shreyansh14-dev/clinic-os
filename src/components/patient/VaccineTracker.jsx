import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Syringe, CheckCircle2, Clock, ShieldCheck, QrCode,
  ChevronRight, Bell, ArrowRight, Calendar, MapPin, Star
} from 'lucide-react';

const VACCINES = [
  { id: 1, name: 'Covishield (COVID-19)',   date: '12 Jan 2022', dose: '1st Dose', provider: 'Apollo Hospital, Mumbai',    batch: 'CV-4521-A', status: 'Completed', nextDue: null },
  { id: 2, name: 'Covaxin (COVID-19)',      date: '14 Feb 2022', dose: '2nd Dose', provider: 'Max Healthcare, Delhi',      batch: 'CX-8811-B', status: 'Completed', nextDue: null },
  { id: 3, name: 'COVID-19 Booster',        date: '10 Aug 2022', dose: 'Booster',  provider: 'Govt. Vaccination Centre',   batch: 'BT-0032-C', status: 'Completed', nextDue: null },
  { id: 4, name: 'Influenza (Flu)',          date: '01 Jun 2023', dose: 'Annual',   provider: 'ClinicOS Home Visit, Pune',  batch: 'FL-2244-D', status: 'Completed', nextDue: 'Jun 2024' },
  { id: 5, name: 'Hepatitis B (Dose 3)',    date: '20 Sep 2023', dose: '3rd Dose', provider: 'Fortis Hospital, Bengaluru', batch: 'HB-9931-E', status: 'Completed', nextDue: null },
  { id: 6, name: 'Tdap (Tetanus-Diphtheria)',date: 'Pending',    dose: 'Booster',  provider: '—',                          batch: '—',         status: 'Due',       nextDue: 'Dec 2024' },
];

const EXPLORE = [
  { vacId: 'covid', emoji: '💉', name: 'COVID-19 Booster', tag: 'Booster', tagColor: 'bg-blue-600',    price: '₹500',  original: '₹800', city: 'Pan India', note: 'Covishield / Covaxin' },
  { vacId: 'flu', emoji: '🤧', name: 'Influenza (Flu)',  tag: 'Seasonal', tagColor: 'bg-amber-500',  price: '₹350',  original: '₹600', city: 'Pan India', note: 'Yearly recommended' },
  { vacId: 'hepb', emoji: '🛡️', name: 'Hepatitis B',      tag: '3-Dose',   tagColor: 'bg-purple-600', price: '₹650',  original: null,   city: 'Pan India', note: 'Per dose · 6 months' },
  { vacId: 'baby', emoji: '👶', name: 'Baby Immunisation',tag: 'NHP Free', tagColor: 'bg-emerald-600',price: 'FREE',  original: null,   city: 'Pan India', note: 'BCG, OPV, DPT, Measles' },
  { vacId: 'typhoid', emoji: '🦠', name: 'Typhoid (Vi-PS)',  tag: 'Single',   tagColor: 'bg-rose-600',   price: '₹299',  original: '₹450', city: 'Pan India', note: 'Valid 3 years' },
  { vacId: 'hpv', emoji: '🌙', name: 'HPV Cancer Protection', tag: 'Cancer Prev', tagColor: 'bg-indigo-600', price: '₹1,800', original: '₹2,400', city: 'Pan India', note: 'Gardasil-9 / Cervavac' },
];

export const VaccineTracker = () => {
  const { vaccines: ctxVaccines } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my');

  const allVaccines = ctxVaccines?.length ? ctxVaccines.map(v => ({
    id: v.id, name: v.name, date: v.date, dose: '—', provider: v.provider,
    batch: v.batch, status: v.status, nextDue: null
  })) : VACCINES;

  const completed = allVaccines.filter(v => v.status === 'Completed').length;
  const due       = allVaccines.filter(v => v.status !== 'Completed').length;

  return (
    <div className="w-full space-y-6 pb-16">

      {/* ── Hero Passport Card ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-40 opacity-5 pointer-events-none flex items-center justify-center">
          <Syringe className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DF70]/20 text-[#E9DF70] text-[11px] font-black tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IMMUNISATION PASSPORT · INDIA</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white m-0">
              Vaccination Record
            </h2>
            <p className="text-sm text-slate-300 m-0">
              {completed} vaccines completed · {due} due soon
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>{completed} Completed</span>
              </div>
              {due > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Clock className="w-4 h-4" />
                  <span>{due} Due Soon</span>
                </div>
              )}
              <button
                onClick={() => navigate('/vaccine-registration')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] text-xs font-black border-none cursor-pointer shadow-md transition-all hover:scale-105"
              >
                <Syringe className="w-3.5 h-3.5" />
                <span>Register for Vaccine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <QrCode className="w-16 h-16 text-[#16163B]" />
            </div>
            <span className="text-[11px] text-slate-400 font-semibold text-center">
              Scan for Digital<br />Vaccine Certificate
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-100 pb-0">
        {[
          { id: 'my',       label: 'My Vaccines' },
          { id: 'schedule', label: 'Schedule & Due' },
          { id: 'explore',  label: 'Explore Vaccines' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-xs font-extrabold rounded-t-xl border-b-2 transition-all cursor-pointer border-l-0 border-r-0 border-t-0 ${
              activeTab === tab.id
                ? 'text-[#242454] border-b-[#242454] bg-white'
                : 'text-slate-400 border-b-transparent bg-transparent hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── My Vaccines Tab ─────────────────────────────────────────── */}
      {activeTab === 'my' && (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 m-0">Vaccination Log & QR Certificates</h3>
            <p className="text-xs text-slate-500 m-0 mt-1">All doses administered and verified through ClinicOS network</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Vaccine</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Dose</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Provider</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Batch No.</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Next Due</th>
                </tr>
              </thead>
              <tbody>
                {allVaccines.map((v, i) => (
                  <tr key={v.id || i} className="border-b border-slate-50 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-extrabold text-slate-900">{v.name}</td>
                    <td className="px-4 py-4 text-slate-600 font-semibold">{v.dose}</td>
                    <td className="px-4 py-4 text-slate-600 font-semibold">{v.date}</td>
                    <td className="px-4 py-4 text-slate-500">{v.provider}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-100">{v.batch}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold border ${
                        v.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 font-semibold">{v.nextDue || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Schedule Tab ─────────────────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Upcoming Banner */}
          <div className="rounded-[24px] bg-amber-50 border border-amber-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-900 m-0">Influenza Booster due in June 2024</h4>
              <p className="text-xs text-amber-700 m-0 mt-0.5">Annual flu vaccine recommended every year before monsoon season in India</p>
            </div>
            <button
              onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: 'flu' } })}
              className="ml-auto shrink-0 px-4 py-2 rounded-full bg-amber-500 text-white font-bold text-xs border-none cursor-pointer hover:bg-amber-600 transition-colors shadow-sm"
            >
              Book Now →
            </button>
          </div>

          {/* Childhood Schedule */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-slate-900 m-0 mb-4">India Childhood Immunisation Schedule (NHP)</h3>
            <div className="space-y-3">
              {[
                { age: 'Birth',      vaccines: 'BCG, OPV-0, Hepatitis B-1',                   status: 'completed' },
                { age: '6 Weeks',    vaccines: 'DTwP-1, OPV-1, IPV-1, Hib-1, Rotavirus-1, PCV-1', status: 'completed' },
                { age: '10 Weeks',   vaccines: 'DTwP-2, OPV-2, IPV-2, Hib-2, Rotavirus-2',   status: 'completed' },
                { age: '14 Weeks',   vaccines: 'DTwP-3, OPV-3, IPV-3, Hib-3, Rotavirus-3, PCV-2', status: 'completed' },
                { age: '6 Months',   vaccines: 'Hepatitis B-3, OPV-4',                         status: 'completed' },
                { age: '9 Months',   vaccines: 'Measles (MR-1)',                                status: 'completed' },
                { age: '12 Months',  vaccines: 'Hepatitis A-1, Varicella-1',                   status: 'completed' },
                { age: '15 Months',  vaccines: 'MMR-1, Varicella-2, PCV Booster',              status: 'due' },
                { age: '18 Months',  vaccines: 'DTwP Booster, OPV Booster, Hib Booster',      status: 'upcoming' },
                { age: '5 Years',    vaccines: 'DTwP Booster (2nd), OPV Booster (2nd)',        status: 'upcoming' },
                { age: '10–12 Yrs',  vaccines: 'Tdap, HPV (2 doses)',                          status: 'upcoming' },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
                  row.status === 'completed' ? 'bg-emerald-50 border-emerald-100'
                  : row.status === 'due'     ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      row.status === 'completed' ? 'bg-emerald-500 text-white'
                      : row.status === 'due'     ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                    }`}>
                      {row.status === 'completed' ? '✓' : row.status === 'due' ? '!' : '○'}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block">{row.age}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{row.vaccines}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    row.status === 'completed' ? 'text-emerald-700 bg-emerald-100'
                    : row.status === 'due'     ? 'text-amber-700 bg-amber-100'
                    : 'text-slate-500 bg-slate-100'
                  }`}>
                    {row.status === 'completed' ? 'Done' : row.status === 'due' ? 'Due Soon' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Explore Tab ─────────────────────────────────────────────── */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPLORE.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              style={{ transition: 'all 0.3s cubic-bezier(0.34,1.48,0.64,1)' }}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-sm">
                    {v.emoji}
                  </div>
                  <span className={`${v.tagColor} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>
                    {v.tag}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 m-0 font-['Poppins']">{v.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">{v.note}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-2">
                  <MapPin className="w-3 h-3" />
                  <span>{v.city}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xl font-extrabold text-[#16163B]">{v.price}</span>
                  {v.original && <span className="text-[11px] text-slate-400 line-through ml-2">{v.original}</span>}
                </div>
                <button
                  onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: v.vacId } })}
                  className="px-4 py-2 rounded-full bg-[#242454] hover:bg-[#16163B] text-white text-xs font-bold border-none cursor-pointer transition-all hover:scale-105 shadow-xs"
                >
                  Book →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
