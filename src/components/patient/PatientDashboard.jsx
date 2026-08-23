import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, ChevronRight, ShieldCheck, Activity,
  Heart, ArrowRight, Stethoscope, Brain, Sparkles, Baby,
  Scissors, ShieldAlert, UserCheck, Volume2, Eye, Droplet,
  UtensilsCrossed, Wind, Syringe, Siren, FlaskConical, Pill,
  Bed, Search, MapPin, Star, Phone, Video,
} from 'lucide-react';

/* ── Department config with icons + colors — no dept images (icon-only style) ── */
const DEPTS = [
  { name:'Cardiology',              icon:Heart,       color:'#ef4444', fee:3000 },
  { name:'General Medicine',        icon:Stethoscope, color:'#3b82f6', fee:1500 },
  { name:'Neurology',               icon:Brain,       color:'#8b5cf6', fee:3500 },
  { name:'Dermatology',             icon:Sparkles,    color:'#ec4899', fee:2000 },
  { name:'Orthopedics',             icon:Activity,    color:'#f97316', fee:2500 },
  { name:'Pediatrics',              icon:Baby,        color:'#10b981', fee:1800 },
  { name:'Ophthalmology',           icon:Eye,         color:'#6366f1', fee:1900 },
  { name:'Gynaecology',             icon:UserCheck,   color:'#a855f7', fee:2200 },
];

/* ── Service cards — Practo-style with clean Unsplash images ── */
const SERVICES = [
  {
    id:'video',
    title:'Instant Video Consultation',
    sub:'Connect within 60 secs',
    path:'/book-appointment',
    bg:'#dbeafe',
    img:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=320&h=220&fit=crop&crop=faces&auto=format&q=80',
    fallback:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=320&h=220&fit=crop&crop=faces',
  },
  {
    id:'opd',
    title:'Find Doctors Near You',
    sub:'Confirmed appointments',
    path:'/book-appointment',
    bg:'#d1fae5',
    img:'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=320&h=220&fit=crop&crop=faces&auto=format&q=80',
    fallback:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=320&h=220&fit=crop&crop=faces',
  },
  {
    id:'lab',
    title:'Lab Tests at Home',
    sub:'Safe & trusted diagnostics',
    path:'/lab-tests',
    bg:'#ede9fe',
    img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=320&h=220&fit=crop&auto=format&q=80',
    fallback:'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=320&h=220&fit=crop',
  },
  {
    id:'surgery',
    title:'Surgeries & IPD Care',
    sub:'Top-rated surgery centers',
    path:'/book-appointment',
    bg:'#f1f5f9',
    img:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=320&h=220&fit=crop&crop=faces&auto=format&q=80',
    fallback:'https://images.unsplash.com/photo-1551076805-e1869033e561?w=320&h=220&fit=crop',
  },
];

/* ── Top doctors section ── */
const SPECIALIST_DOCS = [
  { name:'Dr. Arjun Sharma',   spec:'Senior Cardiologist',        exp:'14+ Yrs', rating:4.9, fee:3200, img:'https://randomuser.me/api/portraits/men/32.jpg',  avail:'Today 11:00 AM' },
  { name:'Dr. Ananya Nambiar', spec:'Chief Neurologist',          exp:'18+ Yrs', rating:4.8, fee:3700, img:'https://randomuser.me/api/portraits/women/44.jpg', avail:'Today 2:30 PM'  },
  { name:'Dr. Rajesh Kapoor',  spec:'Orthopaedic Surgeon',        exp:'21+ Yrs', rating:4.9, fee:2800, img:'https://randomuser.me/api/portraits/men/67.jpg',  avail:'Tomorrow 10 AM' },
  { name:'Dr. Priya Menon',    spec:'Gynaecologist & Obstetrician',exp:'12+ Yrs', rating:4.7, fee:2400, img:'https://randomuser.me/api/portraits/women/25.jpg', avail:'Today 4:00 PM'  },
];

/* ── Health stats card ── */
const VitalCard = ({ label, value, unit, color, icon: Icon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:`${color}18` }}>
        <Icon size={14} style={{ color }} />
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
    <div className="text-[11px] font-bold" style={{ color }}>✓ Normal · {unit}</div>
  </div>
);

export const PatientDashboard = () => {
  const { activePatient, appointments, vitals, departments, doctors } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [articleModal, setArticleModal] = useState(null);

  const lv = vitals[0] || { bpSystolic:120, bpDiastolic:80, heartRate:72, spo2:98 };
  const upcoming = appointments.slice(0, 3);

  return (
    <div className="space-y-7 pb-16">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ borderRadius:12, background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0f172a 100%)', minHeight:190 }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(99,102,241,0.12)' }} />
        <div style={{ position:'absolute', bottom:-40, left:'50%', width:160, height:160, borderRadius:'50%', background:'rgba(16,185,129,0.08)' }} />

        {/* doctor image on right */}
        <img
          src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=320&h=220&fit=crop&auto=format&q=80"
          alt="Doctor"
          style={{ position:'absolute', right:0, bottom:0, height:'100%', width:280, objectFit:'cover', objectPosition:'top', opacity:0.35, borderRadius:'0 12px 12px 0' }}
        />

        <div className="relative p-7">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Verified Healthcare Network · Mumbai</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            Hello, <span style={{ color:'#a5b4fc' }}>{activePatient?.name?.split(' ')[0] || 'Shreyansh'}</span> 👋
          </h1>
          <p className="text-sm text-slate-400 mb-5 max-w-md">
            Your health, our priority. Book OPD visits, home lab tests & track vitals — all in one smart platform.
          </p>

          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.97)', borderRadius:12, padding:4, maxWidth:520, boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search doctors, specialties, clinics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border-none outline-none text-xs text-slate-800 w-full bg-transparent"
              />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 px-2 border-l border-slate-200">
              <MapPin className="w-3 h-3" /> Mumbai
            </div>
            <button
              onClick={() => navigate('/book-appointment')}
              style={{ padding:'0.5rem 1rem', background:'#0f172a', color:'#fff', fontSize:'0.75rem', fontWeight:800, borderRadius:8, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}
            >
              Search <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Practo-style Service Cards with Images ── */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3">Our Healthcare Services</h2>
        <div className="grid grid-cols-4 gap-4">
          {SERVICES.map(svc => (
            <div
              key={svc.id}
              onClick={() => navigate(svc.path)}
              style={{ borderRadius:12, overflow:'hidden', border:'1px solid #e2e8f0', cursor:'pointer', background:'#fff', transition:'all 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'; }}
            >
              {/* Colored background with image using object-fit:contain — full person visible */}
              <div style={{ background: svc.bg, height: 170, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'hidden', position:'relative' }}>
                <img
                  src={svc.img}
                  alt={svc.title}
                  onError={e => { e.target.onerror=null; e.target.src=svc.fallback; }}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',        /* ← key: full subject visible */
                    objectPosition: 'bottom center',
                    display: 'block',
                  }}
                />
              </div>
              {/* Text below */}
              <div style={{ padding:'0.9rem 1rem' }}>
                <div style={{ fontSize:'0.82rem', fontWeight:900, color:'#0f172a', lineHeight:1.3 }}>{svc.title}</div>
                <div style={{ fontSize:'0.72rem', color:'#64748b', marginTop:'0.2rem' }}>{svc.sub}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.2rem', fontSize:'0.72rem', fontWeight:700, color:'#1d4ed8', marginTop:'0.6rem' }}>
                  Book Now <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Departments with icons ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-900">Browse by Department</h2>
          <button onClick={() => navigate('/book-appointment')} className="text-xs font-bold text-blue-700 bg-transparent border-none cursor-pointer underline">
            View All 16 →
          </button>
        </div>
        <div className="grid grid-cols-8 gap-2.5">
          {DEPTS.map(d => {
            const Icon = d.icon;
            return (
              <div
                key={d.name}
                onClick={() => navigate('/book-appointment')}
                style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'all 0.15s', textAlign:'center' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                {/* Colored icon block — no external image needed */}
                <div style={{ height:64, background:`${d.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:d.color, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${d.color}44` }}>
                    <Icon size={18} style={{ color:'#fff' }} />
                  </div>
                </div>
                <div style={{ padding:'0.5rem 0.4rem 0.7rem' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:900, color:'#1e293b', lineHeight:1.3 }}>{d.name}</div>
                  <div style={{ fontSize:'0.6rem', fontWeight:700, color:d.color, marginTop:'0.2rem' }}>₹{d.fee}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Top Specialist Doctors ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-900">Top Specialist Doctors · Available Today</h2>
          <button onClick={() => navigate('/book-appointment')} className="text-xs font-bold text-blue-700 bg-transparent border-none cursor-pointer underline">
            View All 160 Doctors →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {SPECIALIST_DOCS.map(doc => (
            <div
              key={doc.name}
              onClick={() => navigate('/book-appointment')}
              style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'1rem', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <img src={doc.img} alt={doc.name} style={{ width:52, height:52, borderRadius:12, objectFit:'cover', border:'2px solid #f1f5f9', marginBottom:'0.75rem', display:'block' }} />
              <div className="text-sm font-black text-slate-900">{doc.name}</div>
              <div className="text-xs font-medium text-slate-500">{doc.spec}</div>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-slate-800">{doc.rating}</span>
                <span className="text-[10px] text-slate-400">· {doc.exp}</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Consult Fee</div>
                  <div className="text-sm font-black text-slate-900">₹{doc.fee}</div>
                </div>
                <button
                  style={{ padding:'0.3rem 0.75rem', background:'#0f172a', color:'#fff', fontSize:'0.7rem', fontWeight:800, borderRadius:8, border:'none', cursor:'pointer' }}
                  onClick={e => { e.stopPropagation(); navigate('/book-appointment'); }}
                >
                  Book
                </button>
              </div>
              <div style={{ marginTop:8, fontSize:'0.65rem', fontWeight:700, color:'#16a34a', background:'#f0fdf4', borderRadius:8, padding:'0.25rem 0.5rem' }}>
                🟢 Next: {doc.avail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Appointments + Health Vitals row ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Upcoming Appointments */}
        <div style={{ gridColumn:'span 2', background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'1.25rem' }}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div style={{ width:32, height:32, borderRadius:8, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black text-slate-900">Upcoming Appointments</span>
            </div>
            <button onClick={() => navigate('/my-appointments')} className="text-xs font-bold text-blue-700 bg-transparent border-none cursor-pointer underline">
              View All →
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&h=80&fit=crop&auto=format"
                alt="Book"
                className="w-20 h-14 rounded-xl object-cover mx-auto mb-3 opacity-50"
              />
              <p className="text-sm font-bold text-slate-500 mb-3">No appointments yet. Book your first OPD visit!</p>
              <button onClick={() => navigate('/book-appointment')} style={{ padding:'0.5rem 1.1rem', background:'#0f172a', color:'#fff', fontSize:'0.75rem', fontWeight:800, borderRadius:8, border:'none', cursor:'pointer' }}>
                Book OPD Now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map(apt => (
                <div key={apt.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12 }}>
                  <div className="flex items-center gap-3">
                    <img
                      src={apt.doctorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={apt.doctorName}
                      style={{ width:40, height:40, borderRadius:10, objectFit:'cover', border:'1px solid #e2e8f0', flexShrink:0 }}
                    />
                    <div>
                      <div className="text-sm font-black text-slate-900">{apt.doctorName}</div>
                      <div className="text-xs text-slate-500">{apt.specialty}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" /> {apt.date} · {apt.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-success">{apt.status}</span>
                    <div className="text-xs font-black text-slate-900 mt-1">₹{apt.fee}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Vitals */}
        <div className="flex flex-col gap-4">
          <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'1rem' }}>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-900" />
                <span className="text-sm font-black text-slate-900">Health Vitals</span>
              </div>
              <button onClick={() => navigate('/health-tracker')} className="text-[11px] font-bold text-blue-700 bg-transparent border-none cursor-pointer underline">Log →</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <VitalCard label="Blood Pressure" value={`${lv.bpSystolic}/${lv.bpDiastolic}`} unit="mmHg" color="#ef4444" icon={Heart} />
              <VitalCard label="Heart Rate"     value={`${lv.heartRate}`}                    unit="BPM"  color="#f59e0b" icon={Activity} />
              <VitalCard label="SpO₂ Oxygen"    value={`${lv.spo2}%`}                        unit="O₂"   color="#3b82f6" icon={Wind} />
              <VitalCard label="Temperature"    value="98.6°F"                               unit="Body" color="#10b981" icon={Syringe} />
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:12, padding:'1rem' }}>
            <div className="text-xs font-black text-white mb-1">Quick Access</div>
            {[
              { label:'📋 My Prescriptions',  path:'/medical-records' },
              { label:'💊 Meds Schedule',      path:'/my-meds' },
              { label:'🛡️ Insurance Claims',  path:'/insurance-claims' },
              { label:'🚑 108 SOS Dispatch',  path:'/emergency-sos' },
            ].map(q => (
              <button
                key={q.path}
                onClick={() => navigate(q.path)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-white bg-transparent border-none cursor-pointer text-left py-0.5"
              >
                {q.label} <ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Health Articles / Tips ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title:'Diabetes Management',
            sub:'7 lifestyle tips to control blood sugar naturally',
            img:'https://images.unsplash.com/photo-1593491205049-7f032d28cf01?w=400&h=200&fit=crop&auto=format&q=80',
            tag:'Health Tips', tagColor:'#1d4ed8', tagBg:'#dbeafe',
            body:'Managing diabetes involves a balanced diet low in refined sugars, regular 30-minute walks, monitoring blood glucose levels twice daily, getting 7–8 hours of sleep, reducing stress with meditation, staying hydrated, and scheduling quarterly HbA1c tests with your endocrinologist.',
          },
          {
            title:'Heart Health Guide',
            sub:'Know the early warning signs of cardiac events',
            img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop&auto=format&q=80',
            tag:'Cardiology', tagColor:'#dc2626', tagBg:'#fee2e2',
            body:'Early warning signs of a heart attack include chest pain or pressure, shortness of breath, pain radiating to the left arm or jaw, cold sweats, and nausea. If you experience any of these, call 108 immediately. Regular ECG screenings after age 40 and a low-sodium diet are essential preventive measures.',
          },
          {
            title:'Mental Wellness',
            sub:'How to reduce stress and improve sleep quality',
            img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop&auto=format&q=80',
            tag:'Wellness', tagColor:'#059669', tagBg:'#d1fae5',
            body:'Improving mental wellness starts with a consistent sleep schedule, limiting screen time after 9 PM, daily 10-minute mindfulness sessions, physical activity, and staying socially connected. If stress persists for more than 2 weeks, consider speaking to a licensed counsellor or psychiatrist.',
          },
        ].map(a => (
          <div
            key={a.title}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            onClick={() => setArticleModal(a)}
          >
            <img src={a.img} alt={a.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-3.5">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: a.tagColor, background: a.tagBg }}>{a.tag}</span>
              <div className="text-sm font-black text-slate-900 mt-1.5 leading-snug">{a.title}</div>
              <div className="text-xs text-slate-500 mt-1">{a.sub}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold mt-2" style={{ color: a.tagColor }}>Read Article <ChevronRight size={11} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Article Modal ── */}
      {articleModal && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
          onClick={() => setArticleModal(null)}
        >
          <div
            style={{ background:'#fff', borderRadius:16, maxWidth:560, width:'100%', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <img src={articleModal.img} alt={articleModal.title} style={{ width:'100%', height:200, objectFit:'cover' }} />
            <div style={{ padding:'1.5rem' }}>
              <span style={{ fontSize:'0.7rem', fontWeight:900, color: articleModal.tagColor, background: articleModal.tagBg, padding:'2px 10px', borderRadius:99 }}>{articleModal.tag}</span>
              <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#0f172a', margin:'0.75rem 0 0.5rem' }}>{articleModal.title}</h2>
              <p style={{ fontSize:'0.9rem', color:'#475569', lineHeight:1.7 }}>{articleModal.body}</p>
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.25rem' }}>
                <button
                  onClick={() => { setArticleModal(null); navigate('/book-appointment'); }}
                  style={{ flex:1, padding:'0.65rem', background:'#0f172a', color:'#fff', borderRadius:10, border:'none', fontWeight:800, fontSize:'0.8rem', cursor:'pointer' }}
                >Book a Consultation</button>
                <button
                  onClick={() => setArticleModal(null)}
                  style={{ padding:'0.65rem 1.25rem', background:'#f1f5f9', color:'#475569', borderRadius:10, border:'none', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
