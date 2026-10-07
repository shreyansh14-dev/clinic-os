import React, { useState, useRef } from 'react';
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
  Play,
  CheckCircle2,
  Star,
  Smartphone,
  ChevronLeft,
  X,
  Volume2
} from 'lucide-react';
import { SeniorPatientDashboard } from './SeniorPatientDashboard';

export const PatientDashboard = () => {
  const { currentUser, activePatient, appointments, vitals, doctors, showToast } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('Obesity');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const patientAge = currentUser?.age || activePatient?.age || 29;

  // AGE > 70: SHOW DEDICATED SENIOR CARE INTERFACE
  if (patientAge > 70) {
    return <SeniorPatientDashboard />;
  }

  // Categories matching the video (00:06 - 00:10)
  const categories = [
    { id: 'Orthopedists', label: 'Orthopedists', emoji: '🦴' },
    { id: 'Obesity', label: 'Obesity', emoji: '🩺' },
    { id: 'Neck pain', label: 'Neck pain', emoji: '💆' },
    { id: 'Neurology', label: 'Neurology', emoji: '🧠' },
    { id: 'Headache', label: 'Headache', emoji: '🤕' },
    { id: 'Shoulder', label: 'Shoulder', emoji: '💪' },
    { id: 'Eye care', label: 'Eye care', emoji: '👁️' },
  ];

  // Doctors for the carousel matching video
  const carouselDoctors = [
    {
      name: 'Dr. Sherry',
      specialty: 'Gynecologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
      category: 'Obesity',
    },
    {
      name: 'Dr. Pimple Popper',
      specialty: 'Psychiatrist',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
      category: 'Obesity',
    },
    {
      name: 'Dr. Sanjana Gupta',
      specialty: 'Neurosurgeon',
      image: 'https://images.unsplash.com/photo-1594824813576-963d04732155?w=500&auto=format&fit=crop&q=80',
      category: 'Neurology',
    },
    {
      name: 'Dr. Jen Gunter',
      specialty: 'Neurologist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
      category: 'Neurology',
    },
  ];

  // Testimonials matching video
  const testimonials = [
    {
      author: 'Esther Howard',
      role: 'Patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      quote:
        'I had a great experience at this healthcare clinic. I was seen quickly, and the doctor was able to diagnose and treat my condition with immense care.',
    },
    {
      author: 'Robert Fox',
      role: 'Patient',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      quote:
        'The online video consultation connected in less than 30 seconds. The prescription was delivered to my doorstep within an hour.',
    },
  ];

  const handleAddToCart = (productName) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added ${productName} to your cart!`);
  };

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-800 font-sans pb-16 selection:bg-[#1E2050] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Matching MediCare Video 00:02 - 00:05)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8">
        <div className="relative rounded-[36px] bg-[#1D204E] text-white overflow-hidden shadow-2xl p-6 sm:p-12 min-h-[460px] md:min-h-[520px] flex flex-col justify-between">
          
          {/* Animated Ghost Watermark Marquee */}
          <div className="absolute top-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none select-none">
            <div className="animate-marquee-watermark whitespace-nowrap text-[120px] sm:text-[180px] font-black tracking-tighter uppercase text-white leading-none">
              Healthcare • Wellness • Diagnostics • Telehealth • Consultations •
            </div>
          </div>

          {/* Giant Static Headline */}
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white m-0 leading-none">
              Healthcare
            </h1>
          </div>

          {/* Central Doctor Cutout & Floating Feature Pills */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
            
            <div className="relative flex items-center justify-center">
              
              {/* Left Floating Pill (00:03 - Reduce HbA1c) */}
              <div className="hidden sm:flex absolute -left-20 sm:-left-36 md:-left-44 top-1/3 z-20 animate-float-slow items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Reduce HbA1c</span>
              </div>

              {/* Doctor Cutout in Blue Scrubs with Stethoscope */}
              <div className="relative w-52 sm:w-64 md:w-80 h-64 sm:h-80 md:h-96 flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
                  alt="Doctor with Stethoscope"
                  className="w-full h-full object-cover object-top rounded-full sm:rounded-t-full shadow-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Right Floating Pill (00:03 - No more medications) */}
              <div className="hidden sm:flex absolute -right-20 sm:-right-36 md:-right-44 top-1/2 z-20 animate-float-slow-reverse items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>No more medications</span>
              </div>

            </div>

          </div>

          {/* Bottom Row: Narrative Copy on Left, CTA Button on Right */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <p className="text-[11px] sm:text-xs text-slate-300 font-semibold tracking-wide uppercase text-center sm:text-left max-w-sm m-0 leading-relaxed">
              If you&apos;re looking for a creative and easy way to build your health, we&apos;re the perfect solution.
            </p>

            <button
              onClick={() => navigate('/book-appointment')}
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#1D204E] font-bold text-xs tracking-wide uppercase border border-white/30 backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              Book Consultation
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 4 PASTEL SERVICE CARDS (Matching Video 00:03 - 00:06)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Pastel Yellow (Instant Video Consultation) */}
          <div
            onClick={() => navigate('/video-call')}
            className="group relative rounded-[28px] bg-[#FFF4A3] p-6 flex flex-col justify-between min-h-[190px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0 leading-snug">
                Instant Video<br />Consultation
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">Connect within 60 sec</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="w-10 h-10 rounded-full bg-[#1D204E] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                <Video className="w-10 h-10 stroke-1" />
              </div>
            </div>
          </div>

          {/* Card 2: Pastel Mint (Find Doctors near you) */}
          <div
            onClick={() => navigate('/book-appointment')}
            className="group relative rounded-[28px] bg-[#C8F0D6] p-6 flex flex-col justify-between min-h-[190px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0 leading-snug">
                Find Doctors<br />near you
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">Confirmed appointments</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="w-10 h-10 rounded-full bg-[#1D204E] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                <Stethoscope className="w-10 h-10 stroke-1" />
              </div>
            </div>
          </div>

          {/* Card 3: Pastel Pink (24/7 Medicines) */}
          <div
            onClick={() => navigate('/pharmacy-inventory')}
            className="group relative rounded-[28px] bg-[#F3D0DC] p-6 flex flex-col justify-between min-h-[190px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0 leading-snug">
                24/7<br />Medicines
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">Essentials at your doorstep</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="w-10 h-10 rounded-full bg-[#1D204E] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                <Pill className="w-10 h-10 stroke-1" />
              </div>
            </div>
          </div>

          {/* Card 4: Pastel Sky (Lab Tests) */}
          <div
            onClick={() => navigate('/pathology-worklist')}
            className="group relative rounded-[28px] bg-[#B6D6F8] p-6 flex flex-col justify-between min-h-[190px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0 leading-snug">
                Lab<br />Tests
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-1">Sample pickup at your home</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="w-10 h-10 rounded-full bg-[#1D204E] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                <FlaskConical className="w-10 h-10 stroke-1" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. IN-CLINIC CONSULTATION CAROUSEL (Video 00:06 - 00:10)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0 tracking-tight">
            Book an appointment for an in-clinic consultation
          </h2>
        </div>

        {/* Filter Pills with Icons (00:06 - 00:08) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#1D204E] text-white border-[#1D204E] shadow-md scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-sm">{cat.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Doctor Cards Carousel (00:08 - 00:10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {carouselDoctors.map((doc, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/book-appointment')}
              className="group bg-white rounded-[28px] border border-slate-100 p-4 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h4 className="text-base font-extrabold text-slate-900 m-0 group-hover:text-blue-600 transition-colors">
                {doc.name}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 m-0">
                {doc.specialty}
              </p>
            </div>
          ))}
        </div>

        {/* Sliding Progress Scrubber Line (Matching Video 00:08 - 00:10) */}
        <div className="w-48 mx-auto mt-8 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#1D204E] rounded-full animate-pulse" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FREQUENTLY BOOK LAB TESTS & BEST DEALS (Video 00:11 - 00:16)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="rounded-[36px] bg-[#12163A] text-white p-6 sm:p-10 shadow-2xl">
          
          {/* Top Lab Tests Row */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">
              Frequently Book Lab Tests
            </h3>
            <button
              onClick={() => navigate('/pathology-worklist')}
              className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <span>View All Lab Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            
            {/* Lab Test Card 1: Imaging Tests (Pastel Peach) */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#F8E0DB] text-slate-900 p-6 flex flex-col justify-between min-h-[220px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-wide uppercase mb-3">
                  60% OFF
                </span>
                <h4 className="text-lg font-black m-0">Imaging tests</h4>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Imaging tests, such as X-rays, CT scans, and MRIs
                </p>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-black text-slate-900">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

            {/* Lab Test Card 2: MRI & CT Scan (Pastel Mint) */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#D8F2E5] text-slate-900 p-6 flex flex-col justify-between min-h-[220px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wide uppercase mb-3">
                  60% OFF
                </span>
                <h4 className="text-lg font-black m-0">MRI & CT Scan</h4>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  High-precision diagnostic resonance imaging
                </p>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-black text-slate-900">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

            {/* Lab Test Card 3: Orthopedists tests (Pastel Ice) */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#E2E8F8] text-slate-900 p-6 flex flex-col justify-between min-h-[220px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-wide uppercase mb-3">
                  60% OFF
                </span>
                <h4 className="text-lg font-black m-0">Orthopedists tests</h4>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Diagnose & treat back, neck, and joint inflammation
                </p>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-black text-slate-900">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

          </div>

          {/* Bottom Deals Row (Video 00:14 - 00:16) */}
          <div className="flex items-center justify-between mb-6 pt-6 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">
              Todays best deals for you!
            </h3>
            <button
              onClick={() => navigate('/pharmacy-inventory')}
              className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <span>See All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Product 1 */}
            <div className="rounded-[24px] bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nutrition</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">20% OFF</span>
                </div>
                <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center">
                  <Pill className="w-12 h-12 text-slate-700" />
                </div>
                <h5 className="text-xs font-black text-slate-900 m-0">Dietary Supplement Health Products</h5>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>(4.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900">$64.00</span>
                <button
                  onClick={() => handleAddToCart('Dietary Supplement')}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#1D204E] hover:text-white text-slate-800 font-bold text-xs transition-colors border-none cursor-pointer"
                >
                  + Add to
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="rounded-[24px] bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Healthcare</span>
                  <span className="text-[10px] text-emerald-600 font-bold">IN STOCK</span>
                </div>
                <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-blue-600" />
                </div>
                <h5 className="text-xs font-black text-slate-900 m-0">Nitrile Disposable Gloves 100</h5>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>(4.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900">$140.00</span>
                <button
                  onClick={() => handleAddToCart('Nitrile Gloves')}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#1D204E] hover:text-white text-slate-800 font-bold text-xs transition-colors border-none cursor-pointer"
                >
                  + Add to
                </button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="rounded-[24px] bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Medicine</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">50% OFF</span>
                </div>
                <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center">
                  <Droplet className="w-12 h-12 text-amber-600" />
                </div>
                <h5 className="text-xs font-black text-slate-900 m-0">Womens multi Vitamin A, Biotin</h5>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>(4.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900">$80.00</span>
                <button
                  onClick={() => handleAddToCart('Multivitamin')}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#1D204E] hover:text-white text-slate-800 font-bold text-xs transition-colors border-none cursor-pointer"
                >
                  + Add to
                </button>
              </div>
            </div>

            {/* Product 4 */}
            <div className="rounded-[24px] bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Wellness</span>
                  <span className="text-[10px] text-emerald-600 font-bold">NEW</span>
                </div>
                <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-teal-600" />
                </div>
                <h5 className="text-xs font-black text-slate-900 m-0">Antibacterial Liquid Hand Soap</h5>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>(4.5)</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900">$80.00</span>
                <button
                  onClick={() => handleAddToCart('Liquid Soap')}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#1D204E] hover:text-white text-slate-800 font-bold text-xs transition-colors border-none cursor-pointer"
                >
                  + Add to
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FITNESS VIDEO BANNER (Video 00:17 - 00:18)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="relative rounded-[36px] overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-center justify-center shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&auto=format&fit=crop&q=80"
            alt="Runners Outdoors"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          />

          <div className="relative z-10 text-center px-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Healthcare Solutions
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white m-0 tracking-tight flex items-center justify-center gap-3">
              <span>Your health is our</span>
              <span className="text-amber-300">Top priority</span>
              <button
                onClick={() => showToast('Playing health inspiration story...')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center justify-center transition-transform hover:scale-110 shadow-lg border-none cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
              </button>
            </h2>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BENTO GRID STATS & LIVE EVENTS (Video 00:19 - 00:20)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Yellow Podcast Card (Left - 7 cols) */}
          <div className="md:col-span-7 rounded-[32px] bg-[#F9EB71] p-8 flex flex-col justify-between shadow-lg">
            <div>
              <span className="inline-block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                • Podcast
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0 leading-tight">
                Nutrition and<br />Mental Health
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold max-w-sm mt-3 leading-relaxed">
                The food we eat provides the nutrients that our bodies and brains need to function properly.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => {
                  setIsPlayingPodcast(!isPlayingPodcast);
                  showToast(isPlayingPodcast ? 'Podcast paused' : 'Playing: Nutrition & Mental Health Episode');
                }}
                className="w-12 h-12 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 flex items-center justify-center shadow-md transition-all cursor-pointer border-none"
              >
                {isPlayingPodcast ? (
                  <Volume2 className="w-5 h-5 animate-bounce" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
              <div className="text-4xl opacity-80 select-none">🥦🥕🥗</div>
            </div>
          </div>

          {/* Right Bento Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            
            {/* Deep Blue Event Card */}
            <div className="rounded-[32px] bg-[#283593] text-white p-6 shadow-lg flex flex-col justify-between flex-1">
              <div>
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-blue-200 mb-1">
                  • Live Event
                </span>
                <h4 className="text-lg font-black m-0 leading-snug">
                  Healthy Habits for a Happy Heart
                </h4>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/15 text-xs text-blue-200">
                <span>Feb 28, 2026 08:00 PM</span>
                <Calendar className="w-4 h-4 text-blue-300" />
              </div>
            </div>

            {/* Bottom 2 Split Stat Blocks */}
            <div className="grid grid-cols-2 gap-5">
              
              {/* Mint Stat Card */}
              <div className="rounded-[28px] bg-[#A4E5C0] p-6 text-slate-900 shadow-md">
                <div className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                  08
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  Years Experience
                </div>
              </div>

              {/* Pink Stat Card */}
              <div className="rounded-[28px] bg-[#F2C7DA] p-6 text-slate-900 shadow-md">
                <div className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                  120k
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  Happy Customers
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. GOOGLE REVIEWS & TESTIMONIALS (Video 00:20 - 00:21)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 text-center">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0 tracking-tight">
          Our doctors and clinics have earned<br />over 5,000+ reviews on Google!
        </h3>

        <div className="flex items-center justify-center gap-1 my-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-emerald-500 text-emerald-500" />
          ))}
        </div>
        <p className="text-xs font-bold text-slate-500 mb-8">Average Google Rating is 4.8</p>

        {/* Testimonial Quote Box */}
        <div className="max-w-2xl mx-auto rounded-[32px] bg-white border border-slate-100 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-left">
          <img
            src={testimonials[activeTestimonial].avatar}
            alt={testimonials[activeTestimonial].author}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed italic m-0">
              &quot;{testimonials[activeTestimonial].quote}&quot;
            </p>
            <div className="mt-3">
              <span className="text-xs font-black text-slate-900 block">{testimonials[activeTestimonial].author}</span>
              <span className="text-[11px] text-slate-400 font-semibold">{testimonials[activeTestimonial].role}</span>
            </div>
          </div>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all ${
                activeTestimonial === i ? 'w-6 bg-[#1D204E]' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. MOBILE APP SHOWCASE (Video 00:22 - 00:24)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Yellow Phone Mockup Card */}
          <div className="rounded-[36px] bg-[#F9EB71] p-8 flex flex-col justify-between items-center shadow-lg min-h-[360px] overflow-hidden relative">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-base font-black text-slate-900 tracking-tight">MediCare App</span>
              <span className="text-xs font-bold text-slate-700">iOS & Android</span>
            </div>

            <div className="w-64 h-72 bg-white rounded-t-[32px] border-4 border-slate-900 p-4 shadow-2xl relative translate-y-6">
              <div className="w-16 h-1 bg-slate-900 rounded-full mx-auto mb-3" />
              <div className="text-[11px] font-black text-slate-900 mb-1">Dental Treatments</div>
              <div className="h-16 bg-slate-100 rounded-xl mb-2 p-2 text-[10px] text-slate-600">
                Win over Diabetes • Fast Care
              </div>
              <div className="h-16 bg-blue-50 rounded-xl p-2 text-[10px] text-blue-700 font-bold">
                Book Video Consult • In 30s
              </div>
            </div>
          </div>

          {/* Ice-Blue Download Card */}
          <div className="rounded-[36px] bg-[#E2E8F8] p-8 flex flex-col justify-between shadow-lg min-h-[360px]">
            <div>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">30+ Doctors</span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">6k Downloads</span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">4,900 Reviews</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0 leading-tight">
                Download Our Healthcare App for Easy Access
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-2 max-w-sm">
                Get appointments, track digital prescriptions, and connect with 24/7 doctors anywhere.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => showToast('Opening Apple App Store...')}
                className="px-5 py-2.5 rounded-2xl bg-black text-white font-bold text-xs flex items-center gap-2 border-none cursor-pointer hover:opacity-90"
              >
                <span> App Store</span>
              </button>
              <button
                onClick={() => showToast('Opening Google Play Store...')}
                className="px-5 py-2.5 rounded-2xl bg-black text-white font-bold text-xs flex items-center gap-2 border-none cursor-pointer hover:opacity-90"
              >
                <span>▶ Google Play</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. HEALTH ARTICLES & BLOGS (Video 00:24 - 00:25)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0 tracking-tight">
            Read top articles from health experts
          </h3>
          <button
            onClick={() => showToast('Viewing all articles...')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            <span>Read All Blogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="rounded-[32px] bg-[#EBF7F2] p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] font-bold">
                Healthy Lifestyle
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-4 mb-2">
                Your Ultimate Guide to Health and Wellness
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Learn modern preventive healthcare habits, nutritional balances, and cardio workouts designed by top cardiologists.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50">
              <button
                onClick={() => navigate('/book-appointment')}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs transition-colors border-none cursor-pointer"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">5 min read</span>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#FAF3E0] p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] font-bold">
                Dermatology
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-4 mb-2">
                Acne Care Combo & Oily Skin Cleansing Routine
              </h4>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Discover safe dermatological guidelines to revitalize your skin barrier and reduce inflammatory breakouts.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50">
              <button
                onClick={() => navigate('/book-appointment')}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs transition-colors border-none cursor-pointer"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">4 min read</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. PRESERVED PATIENT EMR VITALS & DASHBOARD FEATURES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="bg-white rounded-[36px] border border-slate-100 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 m-0 tracking-tight">
                My Health Snapshot & Active Care
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 m-0">
                Live patient vitals, scheduled consultations, and active digital prescriptions
              </p>
            </div>

            <button
              onClick={() => navigate('/medical-records')}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-[#1D204E] hover:text-white text-slate-800 font-bold text-xs transition-colors border-none cursor-pointer"
            >
              Full EMR Records →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Upcoming Appointments */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Upcoming Appointments
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Dr. Arjun Sharma</div>
                  <div className="text-[11px] text-slate-500">Cardiologist • Today 5:00 PM</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Today</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Dr. Priya Menon</div>
                  <div className="text-[11px] text-slate-500">Pediatrician • Tomorrow 4:00 PM</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Tomorrow</span>
              </div>
            </div>

            {/* Column 2: Live Health Vitals */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Health Vitals Log
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE]">
                  <div className="text-[10px] text-blue-700 font-bold">Heart Rate</div>
                  <div className="text-xl font-black text-slate-900">72 bpm</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Normal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE]">
                  <div className="text-[10px] text-purple-700 font-bold">Blood Pressure</div>
                  <div className="text-xl font-black text-slate-900">120/80</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Optimal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5]">
                  <div className="text-[10px] text-amber-700 font-bold">Blood Sugar</div>
                  <div className="text-xl font-black text-slate-900">98 mg/dL</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Fasting OK</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5]">
                  <div className="text-[10px] text-emerald-700 font-bold">SpO2 Oxygen</div>
                  <div className="text-xl font-black text-slate-900">98 %</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Normal</div>
                </div>
              </div>
            </div>

            {/* Column 3: Active Prescriptions */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Active Prescriptions
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Amlodipine 5mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet daily (Morning)</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Metformin 500mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet twice daily</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Atorvastatin 10mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet at night</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. GRAND FOOTER (Matching MediCare Video 00:26)
          ───────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-[36px] bg-[#12163A] text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Company</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('What&apos;s New')}>What&apos;s New</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('About Us')}>About</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Press Releases')}>Press</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Careers')}>Careers</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Contact Us')}>Contact</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Community</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Medicare for Business</li>
                <li className="hover:text-white cursor-pointer">Creator Report</li>
                <li className="hover:text-white cursor-pointer">Charities</li>
                <li className="hover:text-white cursor-pointer">Explore Templates</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Support</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Help Topics</li>
                <li className="hover:text-white cursor-pointer">Getting Started</li>
                <li className="hover:text-white cursor-pointer">Features & How-Tos</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Report a Violation</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Trust & Legal</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer">Privacy Notice</li>
                <li className="hover:text-white cursor-pointer">Cookie Notice</li>
                <li className="hover:text-white cursor-pointer">Trust Center</li>
              </ul>
            </div>
          </div>

          {/* Massive Pink MediCare Bottom Banner (00:26) */}
          <div className="rounded-[28px] bg-[#F3D0DC] text-[#1D204E] py-8 px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-[#1D204E] text-white flex items-center justify-center font-black text-xl shadow-md">
              M
            </div>
            <span className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              MediCare
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-6 mt-6 border-t border-white/10 gap-2">
            <span>© 2026 MediCare by ClinicOS. All rights reserved.</span>
            <span>Design &amp; Developed by MUSEMIND inspiration</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
