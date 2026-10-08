import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  Building2,
  Stethoscope,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  IndianRupee,
  Clock,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export const AdminDoctorsDepartments = () => {
  const {
    doctors,
    departments,
    addDoctor,
    deleteDoctor,
    addDepartment,
    updateDepartmentFee,
    showToast
  } = useApp();

  const [activeSubView, setActiveSubView] = useState('doctors'); // 'doctors' | 'departments'

  // Doctors filtering
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Add Doctor Modal
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [docName, setDocName] = useState('Dr. Arvind Narayanan');
  const [docDeptId, setDocDeptId] = useState(departments[0]?.id || 'dept-1');
  const [docExp, setDocExp] = useState('12+ Years');
  const [docFee, setDocFee] = useState('2200');
  const [docSchedule, setDocSchedule] = useState('Mon - Fri (10:00 AM - 04:00 PM)');
  const [docPhone, setDocPhone] = useState('+91 98200 12345');
  const [docEmail, setDocEmail] = useState('arvind.n@clinicos.com');
  const [docAvatar, setDocAvatar] = useState('/images/doctors/indian_doc_m1.jpg');

  // Add Department Modal
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('Rheumatology & Autoimmune');
  const [deptDesc, setDeptDesc] = useState('Arthritis, autoimmune disorders & joint inflammation unit');
  const [deptBaseFee, setDeptBaseFee] = useState('2400');

  // Filtered doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      !doctorSearch ||
      doc.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchesDept =
      selectedDeptFilter === 'All' ||
      doc.deptId === selectedDeptFilter ||
      doc.specialty?.includes(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  const handleAddDoctorSubmit = (e) => {
    e.preventDefault();
    const deptObj = departments.find((d) => d.id === docDeptId) || departments[0];
    addDoctor({
      name: docName,
      specialty: deptObj.name,
      deptId: docDeptId,
      department: deptObj.name,
      experience: docExp,
      fee: parseFloat(docFee),
      consultationFee: parseFloat(docFee),
      availability: docSchedule,
      phone: docPhone,
      email: docEmail,
      avatar: docAvatar
    });
    setShowAddDoctorModal(false);
  };

  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    addDepartment({
      name: deptName,
      description: deptDesc,
      fee: parseFloat(deptBaseFee),
      doctorCount: 0
    });
    setShowAddDeptModal(false);
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar with Sub-tab Switcher */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Users2 className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  2 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Physician Credentials &amp; Specialty Allocations
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Manage Doctors &amp; Hospital Departments
              </h3>
            </div>
          </div>

          {/* Sub-view Switcher Pills */}
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setActiveSubView('doctors')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeSubView === 'doctors'
                  ? 'bg-[#16163B] text-white shadow-sm font-extrabold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#E9DF70]" />
              <span>Specialist Roster ({doctors.length})</span>
            </button>

            <button
              onClick={() => setActiveSubView('departments')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 transition-all ${
                activeSubView === 'departments'
                  ? 'bg-[#16163B] text-white shadow-sm font-extrabold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#E9DF70]" />
              <span>Departments &amp; Fees ({departments.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SUB-VIEW A: DOCTORS ROSTER ──────────────────────────────────── */}
      {activeSubView === 'doctors' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search doctor by name, specialty..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#5F2EEA] focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-[#E9DF70]" />
              <span>Register New Specialist Doctor</span>
            </button>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedDeptFilter('All')}
              className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all ${
                selectedDeptFilter === 'All'
                  ? 'bg-[#16163B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties ({doctors.length})
            </button>
            {departments.slice(0, 10).map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs whitespace-nowrap transition-all ${
                  selectedDeptFilter === dept.id
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.slice(0, 18).map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5F2EEA]/40 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.avatar || '/images/doctors/indian_doc_m1.jpg'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-slate-200 group-hover:ring-[#5F2EEA]/40 transition-all"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 m-0 group-hover:text-[#5F2EEA] transition-colors">
                      {doc.name}
                    </h4>
                    <span className="inline-block mt-0.5 text-[11px] font-bold text-[#5F2EEA] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                      ★ {doc.rating || '4.9'} · {doc.experience || '10+ Yrs'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fee:</span>
                    <strong className="text-emerald-700 font-black">
                      ₹{(doc.consultationFee || doc.fee || 1500).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Timing:</span>
                    <span className="text-slate-700 font-semibold truncate max-w-[170px]">
                      {doc.availability || 'Mon-Fri 10am-4pm'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      const newFee = prompt(
                        `Update consultation fee for ${doc.name}:`,
                        doc.consultationFee || doc.fee || 2000
                      );
                      if (newFee) {
                        doc.consultationFee = parseFloat(newFee);
                        doc.fee = parseFloat(newFee);
                        showToast(`Consultation fee for ${doc.name} updated to ₹${newFee}`);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Fee</span>
                  </button>
                  <button
                    onClick={() => deleteDoctor(doc.id)}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs inline-flex items-center justify-center transition-all cursor-pointer"
                    title="Remove Doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length > 18 && (
            <div className="text-center pt-2 text-xs font-bold text-slate-500">
              Showing 18 of {filteredDoctors.length} doctors. Use the specialty filters or search bar to view others.
            </div>
          )}
        </div>
      )}

      {/* ── SUB-VIEW B: DEPARTMENTS & FEE SCHEDULES ──────────────────────── */}
      {activeSubView === 'departments' && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 m-0">
                Hospital Medical Departments &amp; Base Fee Schedules
              </h4>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Standard consultation tariffs, doctor counts, and specialist allocation per division
              </p>
            </div>

            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-[#E9DF70]" />
              <span>Create New Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const deptDocs = doctors.filter(
                (d) => d.deptId === dept.id || d.department === dept.name
              );

              return (
                <div
                  key={dept.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md hover:bg-white transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5F2EEA] flex items-center justify-center font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 m-0">{dept.name}</h4>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {dept.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 m-0 leading-relaxed">
                      {dept.description || 'Specialized clinical care and patient consultations.'}
                    </p>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold">Base Tariff</span>
                        <strong className="text-emerald-700 font-black text-sm">₹{dept.fee}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] font-bold">Assigned Staff</span>
                        <strong className="text-[#5F2EEA] font-black text-sm">
                          {deptDocs.length || 10} Specialists
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        const newFee = prompt(`Update base tariff for ${dept.name}:`, dept.fee);
                        if (newFee) updateDepartmentFee(dept.id, newFee);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit Base Fee</span>
                    </button>

                    <span className="text-[11px] font-semibold text-slate-400">
                      Active OPD Division
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: Register New Doctor ──────────────────────────────────── */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-xl w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md">
                  <Stethoscope className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Register Specialist Doctor</h3>
                  <p className="text-xs text-slate-500 m-0">Add specialist physician to the hospital roster</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Doctor Full Name</label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Specialty Department</label>
                  <select
                    value={docDeptId}
                    onChange={(e) => setDocDeptId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Clinical Experience</label>
                  <input
                    type="text"
                    required
                    value={docExp}
                    onChange={(e) => setDocExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">OPD Weekly Schedule</label>
                <input
                  type="text"
                  required
                  value={docSchedule}
                  onChange={(e) => setDocSchedule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={docEmail}
                    onChange={(e) => setDocEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Confirm &amp; Add Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Create New Department ─────────────────────────────────── */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Create Hospital Department</h3>
                  <p className="text-xs text-slate-500 m-0">Add clinical division and baseline consultation tariff</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDeptSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  required
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Baseline Consultation Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={deptBaseFee}
                  onChange={(e) => setDeptBaseFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
