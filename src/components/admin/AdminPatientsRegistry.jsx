import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarUser,
  Search,
  Plus,
  User,
  Phone,
  Mail,
  HeartPulse,
  FileText,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';

export const AdminPatientsRegistry = () => {
  const { patients, appointments, addPatient, showToast } = useApp();

  const [patientSearch, setPatientSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [selectedPatientForView, setSelectedPatientForView] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // New Patient Form State
  const [patName, setPatName] = useState('Aakash Mukherjee');
  const [patAge, setPatAge] = useState('38');
  const [patGender, setPatGender] = useState('Male');
  const [patBlood, setPatBlood] = useState('B+');
  const [patPhone, setPatPhone] = useState('+91 98300 77123');
  const [patEmail, setPatEmail] = useState('aakash.m@gmail.com');
  const [patAddress, setPatAddress] = useState('Khar West, Mumbai');
  const [patEmergency, setPatEmergency] = useState('+91 98300 99881');
  const [patInsurance, setPatInsurance] = useState('HDFC-ERGO-9921');
  const [patDiagnosis, setPatDiagnosis] = useState('Chronic Migraine & Cervical Spondylosis');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !patientSearch ||
      p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.phone?.includes(patientSearch) ||
      p.id?.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesBlood =
      bloodGroupFilter === 'All' || p.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBlood;
  });

  const handleAddPatientSubmit = (e) => {
    e.preventDefault();
    addPatient({
      name: patName,
      age: parseInt(patAge) || 30,
      gender: patGender,
      bloodGroup: patBlood,
      phone: patPhone,
      email: patEmail,
      address: patAddress,
      emergencyContact: patEmergency,
      insuranceId: patInsurance,
      diagnosis: patDiagnosis
    });
    setShowAddPatientModal(false);
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(
      (a) => a.patientId === patientId || a.patientName === selectedPatientForView?.name
    );
  };

  return (
    <div className="space-y-6 doc-anim-enter">
      {/* Header bar */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <CalendarUser className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5F2EEA] border border-purple-200">
                  3 OF 8
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Master Patient Roster &amp; EMR Records
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 m-0">
                Manage Patients &amp; Health Records
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-extrabold text-xs border-none cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-[#E9DF70]" />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search patient by Name, UHID, Phone, or Diagnosis..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#5F2EEA] focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-'].map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroupFilter(bg)}
                className={`px-3 py-1.5 rounded-xl font-bold border-none cursor-pointer text-xs transition-all whitespace-nowrap ${
                  bloodGroupFilter === bg
                    ? 'bg-[#16163B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bg === 'All' ? 'All Blood Groups' : bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 m-0">
              Active Registered Patients Directory ({filteredPatients.length})
            </h4>
            <span className="text-xs text-slate-400">
              Unique Hospital Identification (UHID) &amp; Medical Profiles
            </span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {patients.filter((p) => p.admitted).length} Currently Admitted (IPD)
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Contact &amp; Emergency</th>
                <th className="py-3 px-4">Insurance / ABHA ID</th>
                <th className="py-3 px-4">Primary Diagnosis</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((pat) => (
                <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={pat.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <strong className="text-slate-900 font-extrabold block text-xs">
                          {pat.name}
                        </strong>
                        <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          {pat.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {pat.gender || 'Male'}, {pat.age || 29} Yrs
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                      {pat.bloodGroup || 'O+'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-[11px] text-slate-800 font-bold">{pat.phone}</div>
                    <span className="text-[10px] text-slate-400 block">
                      SOS: {pat.emergencyContact || 'Not Specified'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {pat.insuranceId || 'SELF-PAY'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-medium max-w-[180px] truncate">
                    {pat.diagnosis || 'Routine Health Checkup'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPatientForView(pat)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#5F2EEA] hover:text-white text-[#5F2EEA] font-extrabold text-xs border border-purple-200 cursor-pointer transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Patient Medical Profile Detail ──────────────────────── */}
      {selectedPatientForView && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-2xl w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatientForView.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedPatientForView.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 m-0">
                      {selectedPatientForView.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-[#5F2EEA]">
                      {selectedPatientForView.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    {selectedPatientForView.gender}, {selectedPatientForView.age} Years · Blood Group: {selectedPatientForView.bloodGroup}
                  </p>
                  <p className="text-xs text-slate-400 m-0">
                    Address: {selectedPatientForView.address || 'Mumbai, Maharashtra'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatientForView(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Clinical Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                <span className="text-[10px] text-purple-700 font-bold block">Blood Group</span>
                <strong className="text-base font-black text-[#5F2EEA]">
                  {selectedPatientForView.bloodGroup}
                </strong>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <span className="text-[10px] text-blue-700 font-bold block">Insurance Policy</span>
                <strong className="text-xs font-black text-blue-900 truncate block">
                  {selectedPatientForView.insuranceId || 'None'}
                </strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-700 font-bold block">IPD Status</span>
                <strong className="text-xs font-black text-emerald-800">
                  {selectedPatientForView.admitted ? 'Admitted' : 'OPD Regular'}
                </strong>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <span className="text-[10px] text-amber-700 font-bold block">Emergency Phone</span>
                <strong className="text-xs font-black text-amber-900 truncate block">
                  {selectedPatientForView.emergencyContact || 'Active'}
                </strong>
              </div>
            </div>

            {/* Associated Appointments */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">
                Patient Appointment History ({getPatientAppointments(selectedPatientForView.id).length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getPatientAppointments(selectedPatientForView.id).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-900 block font-bold">{apt.doctorName}</strong>
                      <span className="text-[11px] text-slate-500">
                        {apt.specialty} · {apt.date} at {apt.time} ({apt.type})
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedPatientForView(null)}
                className="px-5 py-2.5 rounded-xl bg-[#16163B] text-white font-bold text-xs border-none cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Register New Patient ─────────────────────────────────── */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto doc-anim-scale">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-xl w-full p-7 space-y-5 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5F2EEA] text-white flex items-center justify-center shadow-md">
                  <CalendarUser className="w-5 h-5 text-[#E9DF70]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">Register New Patient</h3>
                  <p className="text-xs text-slate-500 m-0">Create medical profile and hospital UHID record</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={patName}
                    onChange={(e) => setPatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    required
                    value={patAge}
                    onChange={(e) => setPatAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={patGender}
                    onChange={(e) => setPatGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Blood Group</label>
                  <select
                    value={patBlood}
                    onChange={(e) => setPatBlood(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA] bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={patPhone}
                    onChange={(e) => setPatPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={patEmail}
                    onChange={(e) => setPatEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Address / City</label>
                  <input
                    type="text"
                    required
                    value={patAddress}
                    onChange={(e) => setPatAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Emergency Phone</label>
                  <input
                    type="text"
                    required
                    value={patEmergency}
                    onChange={(e) => setPatEmergency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Diagnosis / Chief Complaint</label>
                <input
                  type="text"
                  required
                  value={patDiagnosis}
                  onChange={(e) => setPatDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F2EEA]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5F2EEA] hover:bg-[#4318B4] text-white font-black text-xs border-none cursor-pointer shadow-md transition-all"
                >
                  Create Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
