import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  Activity,
  Heart,
  ArrowRight,
  Stethoscope,
  Brain,
  Sparkles,
  Baby,
  Eye,
  UserCheck,
  Search,
  MapPin,
  Video,
  FileText,
  FlaskConical,
  Pill,
  Syringe,
  Receipt,
  Shield,
  BookOpen,
  ChevronDown,
  Droplet,
  Wind,
  PhoneCall,
  User,
  Users,
  Lock,
  X
} from 'lucide-react';
import { SeniorPatientDashboard } from './SeniorPatientDashboard';

export const PatientDashboard = () => {
  const { currentUser, activePatient, appointments, vitals, doctors } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  const patientAge = currentUser?.age || activePatient?.age || 29;

  // AGE > 70: SHOW DEDICATED SENIOR CARE INTERFACE
  if (patientAge > 70) {
    return <SeniorPatientDashboard />;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/book-appointment?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`);
  };

  // 4 Quick Access Cards matching reference image
  const quickAccessCards = [
    {
      id: 'video',
      title: 'Instant Video Consultation',
      subtitle: 'Consult with trusted doctors from home',
      accentColor: '#10B981',
      bgGradient: 'from-[#ECFDF5] via-[#E6FBF5] to-[#D1FAE5]',
      borderColor: 'border-emerald-200/80',
      iconBg: 'bg-emerald-500 text-white',
      Icon: Video,
      route: '/video-call',
      // Female doctor in white coat cutout
      doctorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=360&h=360&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      id: 'doctors',
      title: 'Find Doctors Near You',
      subtitle: 'Explore specialists in your area',
      accentColor: '#2563EB',
      bgGradient: 'from-[#EFF6FF] via-[#EBF3FE] to-[#DBEAFE]',
      borderColor: 'border-blue-200/80',
      iconBg: 'bg-blue-600 text-white',
      Icon: User,
      route: '/book-appointment',
      // Male doctor with stethoscope in lab coat
      doctorImg: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=360&h=360&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      id: 'labs',
      title: 'Lab Tests at Home',
      subtitle: 'Book lab tests with home sample collection',
      accentColor: '#EC4899',
      bgGradient: 'from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]',
      borderColor: 'border-pink-200/80',
      iconBg: 'bg-pink-500 text-white',
      Icon: FlaskConical,
      route: '/lab-tests',
      // Gloved hand with test tube / sample vial
      doctorImg: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=360&h=360&fit=crop&auto=format&q=80'
    },
    {
      id: 'records',
      title: 'Medical Records',
      subtitle: 'Access your EMR, reports and history',
      accentColor: '#F59E0B',
      bgGradient: 'from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]',
      borderColor: 'border-amber-200/80',
      iconBg: 'bg-amber-500 text-white',
      Icon: FileText,
      route: '/medical-records',
      // Clinical folder & clipboard
      doctorImg: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=360&h=360&fit=crop&auto=format&q=80'
    }
  ];

  // Upcoming appointments matching reference image
  const upcomingAppointments = [
    {
      id: 'apt-1',
      doctorName: 'Dr. Arjun Sharma',
      specialty: 'Cardiologist',
      timing: 'Today',
      timeSlot: '5:00 PM',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      id: 'apt-2',
      doctorName: 'Dr. Priya Menon',
      specialty: 'Pediatrician',
      timing: 'Tomorrow',
      timeSlot: '4:00 PM',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      id: 'apt-3',
      doctorName: 'Dr. Rajesh Kapoor',
      specialty: 'General Physician',
      timing: 'Mon, 28 Oct',
      timeSlot: '10:00 AM',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces&auto=format&q=80'
    }
  ];

  // Prescriptions matching reference image
  const myPrescriptions = [
    {
      id: 'rx-1',
      medName: 'Amlodipine 5mg',
      dosage: '1 tablet daily',
      status: 'Active',
      color: 'amber'
    },
    {
      id: 'rx-2',
      medName: 'Metformin 500mg',
      dosage: '1 tablet twice daily',
      status: 'Active',
      color: 'blue'
    },
    {
      id: 'rx-3',
      medName: 'Atorvastatin 10mg',
      dosage: '1 tablet at night',
      status: 'Active',
      color: 'rose'
    }
  ];

  // 6 Services Cards matching reference image
  const moreServices = [
    {
      id: 'meds',
      title: 'Meds Schedule',
      subtitle: 'Manage your medicines',
      Icon: Pill,
      iconColor: 'text-emerald-500',
      cardBg: 'bg-emerald-50/50 hover:bg-emerald-50',
      borderColor: 'border-emerald-100',
      arrowBg: 'bg-emerald-100 text-emerald-700',
      route: '/my-meds',
      artImg: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop&auto=format&q=80'
    },
    {
      id: 'vaccine',
      title: 'Vaccine Passport',
      subtitle: 'Track your vaccinations',
      Icon: Syringe,
      iconColor: 'text-pink-500',
      cardBg: 'bg-pink-50/50 hover:bg-pink-50',
      borderColor: 'border-pink-100',
      arrowBg: 'bg-pink-100 text-pink-700',
      route: '/vaccines',
      artImg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=120&h=120&fit=crop&auto=format&q=80'
    },
    {
      id: 'insurance',
      title: 'Insurance Claims',
      subtitle: 'Submit & track claims',
      Icon: ShieldCheck,
      iconColor: 'text-blue-500',
      cardBg: 'bg-blue-50/50 hover:bg-blue-50',
      borderColor: 'border-blue-100',
      arrowBg: 'bg-blue-100 text-blue-700',
      route: '/insurance-claims',
      artImg: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=120&h=120&fit=crop&auto=format&q=80'
    },
    {
      id: 'bills',
      title: 'Bills & Receipts',
      subtitle: 'View your medical bills',
      Icon: Receipt,
      iconColor: 'text-amber-500',
      cardBg: 'bg-amber-50/50 hover:bg-amber-50',
      borderColor: 'border-amber-100',
      arrowBg: 'bg-amber-100 text-amber-700',
      route: '/bills',
      artImg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=120&h=120&fit=crop&auto=format&q=80'
    },
    {
      id: 'articles',
      title: 'Health Articles',
      subtitle: 'Tips and expert advice',
      Icon: BookOpen,
      iconColor: 'text-indigo-500',
      cardBg: 'bg-indigo-50/50 hover:bg-indigo-50',
      borderColor: 'border-indigo-100',
      arrowBg: 'bg-indigo-100 text-indigo-700',
      route: null,
      onOpenModal: () => setActiveArticle({
        title: 'Complete Heart Health & Longevity Guide',
        content: 'Maintaining cardiovascular health requires balanced nutrition, active 30-minute daily movement, routine BP monitoring (ideal 120/80 mmHg), and preventive consultations.'
      }),
      artImg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&h=120&fit=crop&auto=format&q=80'
    },
    {
      id: 'telehealth',
      title: 'Telehealth',
      subtitle: 'Connect online',
      Icon: Video,
      iconColor: 'text-sky-500',
      cardBg: 'bg-sky-50/50 hover:bg-sky-50',
      borderColor: 'border-sky-100',
      arrowBg: 'bg-sky-100 text-sky-700',
      route: '/video-call',
      artImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&auto=format&q=80'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFBFD] font-sans pb-20 select-none">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F6F7FC] to-[#FAFBFD] border-b border-slate-100/80 pt-6 sm:pt-8 pb-10 sm:pb-12">
        
        {/* Soft Background Radial Glows */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-purple-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines, Search Bar & Highlights */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Verified Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Healthcare Network • Mumbai</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 tracking-tight leading-[1.08] font-heading m-0">
                  Care starts here<span className="text-[#5F2EEA]">.</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl leading-relaxed m-0">
                  Your health, appointments, records and care team — all in one smart platform.
                </p>
              </div>

              {/* Pill Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-full p-2 pl-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] border border-slate-200/90 flex items-center max-w-2xl gap-2 transition-all focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctors, clinics, specialities..."
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                  />
                </div>

                {/* Location Picker in Search Bar */}
                <div className="relative shrink-0 border-l border-slate-200 pl-3 pr-2 hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-transparent border-none cursor-pointer p-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{selectedCity}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isCityDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50">
                      {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune'].map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border-none transition-colors ${
                            selectedCity === city
                              ? 'bg-purple-50 text-purple-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="bg-[#5F2EEA] hover:bg-[#4E24C9] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-1.5 shadow-md shadow-purple-500/25 shrink-0 transition-transform active:scale-95 cursor-pointer border-none"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 4 Feature Highlights beneath Search */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-slate-900">24/7</div>
                    <div className="text-slate-500">Telehealth</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-slate-900">500+</div>
                    <div className="text-slate-500">Trusted Doctors</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-slate-900">Lab Tests</div>
                    <div className="text-slate-500">at Home</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="font-bold text-slate-900">Secure</div>
                    <div className="text-slate-500">Medical Records</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Doctor & Child Image with Floating Card & DNA Art */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              
              {/* Background DNA Double-Helix Vector Curve */}
              <div className="absolute -top-12 -right-8 w-72 h-72 pointer-events-none opacity-40">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                  <path
                    d="M 20 20 Q 90 90 160 30 T 180 180"
                    stroke="#818CF8"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 40 40 Q 110 110 180 50 T 160 160"
                    stroke="#C084FC"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
              </div>

              {/* Main Photo: Caring Female Doctor smiling with young patient */}
              <div className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.12)] border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
                  alt="Doctor with Young Patient"
                  className="w-full h-[320px] sm:h-[360px] object-cover object-top hover:scale-102 transition-transform duration-700"
                />

                {/* Soft Gradient Overlay at Base */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating "Video Consultation" Pill Card over image */}
                <div
                  onClick={() => navigate('/video-call')}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white p-2.5 pl-3 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all group"
                >
                  {/* Doctor Avatars Stack */}
                  <div className="flex -space-x-2 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=faces&auto=format&q=80"
                      alt="Doctor 1"
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=faces&auto=format&q=80"
                      alt="Doctor 2"
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=60&h=60&fit=crop&crop=faces&auto=format&q=80"
                      alt="Doctor 3"
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-black text-slate-900 leading-tight">Video Consultation</div>
                    <div className="text-[10px] text-slate-500 font-medium">Talk to a doctor now</div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#5F2EEA] group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-8">
        
        {/* ======================================================== */}
        {/* 2. QUICK ACCESS SECTION (4 LARGE CARDS)                  */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight m-0 font-heading">
              Quick Access
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Everything you need for your healthcare journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {quickAccessCards.map((card) => {
              const IconComp = card.Icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className={`bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-[28px] p-5 flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group min-h-[175px]`}
                >
                  <div className="relative z-10 space-y-2 max-w-[65%]">
                    <div className={`w-10 h-10 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug m-0 font-heading">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug m-0">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Circular Arrow Button */}
                  <div className="relative z-10 mt-4">
                    <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-white/80 flex items-center justify-center text-slate-600 group-hover:bg-[#5F2EEA] group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Doctor/Asset Cutout Image on Right Side of Card */}
                  <div className="absolute right-0 bottom-0 w-32 h-36 pointer-events-none overflow-hidden">
                    <img
                      src={card.doctorImg}
                      alt={card.title}
                      className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. MIDDLE 3-COLUMN DASHBOARD (APPOINTMENTS, VITALS, RX)  */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: UPCOMING APPOINTMENTS */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 m-0 font-heading">
                Upcoming Appointments
              </h3>
              <button
                onClick={() => navigate('/my-appointments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate('/my-appointments')}
                  className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={apt.avatar}
                      alt={apt.doctorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">{apt.specialty}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{apt.timing}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{apt.timeSlot}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: HEALTH SNAPSHOT (VITALS) */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 m-0 font-heading">
                  Health Snapshot
                </h3>
                <button
                  onClick={() => navigate('/health-tracker')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 m-0">
                Track your vitals and stay healthy
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {/* Vital 1: Heart Rate */}
              <div
                onClick={() => navigate('/health-tracker')}
                className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 flex flex-col justify-between hover:bg-rose-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Heart Rate</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 font-heading">72 bpm</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Vital 2: Blood Pressure */}
              <div
                onClick={() => navigate('/health-tracker')}
                className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100 flex flex-col justify-between hover:bg-blue-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Blood Pressure</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 font-heading">120/80 mmHg</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Vital 3: Blood Sugar */}
              <div
                onClick={() => navigate('/health-tracker')}
                className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between hover:bg-amber-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Droplet className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Blood Sugar</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 font-heading">98 mg/dL</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Vital 4: SpO2 */}
              <div
                onClick={() => navigate('/health-tracker')}
                className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex flex-col justify-between hover:bg-indigo-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">SpO2</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 font-heading">98 %</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: MY PRESCRIPTIONS */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 m-0 font-heading">
                My Prescriptions
              </h3>
              <button
                onClick={() => navigate('/my-meds')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {myPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  onClick={() => navigate('/my-meds')}
                  className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      rx.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                      rx.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">{rx.medName}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">{rx.dosage}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {rx.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 4. MORE HEALTHCARE SERVICES (6 CARDS IN A ROW)           */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight m-0 font-heading">
              More Healthcare Services
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Explore additional services for your complete care
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {moreServices.map((srv) => {
              const IconComp = srv.Icon;
              return (
                <div
                  key={srv.id}
                  onClick={() => {
                    if (srv.route) navigate(srv.route);
                    else if (srv.onOpenModal) srv.onOpenModal();
                  }}
                  className={`p-3.5 rounded-2xl ${srv.cardBg} border ${srv.borderColor} flex flex-col justify-between min-h-[120px] transition-all hover:-translate-y-1 hover:shadow-xs cursor-pointer group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center">
                      <IconComp className={`w-4 h-4 ${srv.iconColor}`} />
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-xs font-black text-slate-900 leading-tight m-0 font-heading">
                      {srv.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 m-0 line-clamp-1">
                      {srv.subtitle}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full bg-white shadow-2xs flex items-center justify-center text-slate-500 group-hover:bg-[#5F2EEA] group-hover:text-white transition-colors">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    {/* Small image badge */}
                    <img
                      src={srv.artImg}
                      alt={srv.title}
                      className="w-8 h-8 rounded-lg object-cover opacity-80"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Interactive Health Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                CLINICAL INSIGHT
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2 font-heading">
                {activeArticle.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                {activeArticle.content}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 bg-[#5F2EEA] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none hover:bg-[#4E24C9]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
