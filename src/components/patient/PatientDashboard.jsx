import React, { useState, useEffect, useRef } from 'react';
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

  // Reference Video Brand Intro State (0.0s -> 0.8s dark indigo -> 1.8s settles -> homepage returns)
  const [showBrandIntro, setShowBrandIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0); // 0: start, 1: dark indigo swallow, 2: logo settle, 3: done

  const [activeCategory, setActiveCategory] = useState('Orthopedists');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const patientAge = currentUser?.age || activePatient?.age || 29;

  // Handle Brand Intro Animation (~1100ms total, non-blocking with instant click-to-dismiss)
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 100);
    const t2 = setTimeout(() => setIntroStep(2), 600);
    const t3 = setTimeout(() => {
      setIntroStep(3);
      setShowBrandIntro(false);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // AGE > 70: SHOW DEDICATED SENIOR CARE INTERFACE
  if (patientAge > 70) {
    return <SeniorPatientDashboard />;
  }

  // Categories matching the video (00:06 - 00:10)
  const categories = [
    { id: 'Orthopedists', label: 'Orthopedists', iconType: 'cast' },
    { id: 'Obesity', label: 'Obesity', iconType: 'scale' },
    { id: 'Neck pain', label: 'Neck pain', iconType: 'neck' },
    { id: 'Neurology', label: 'Neurology', iconType: 'brain' },
    { id: 'Headache', label: 'Headache', iconType: 'head' },
    { id: 'Shoulder', label: 'Shoulder', iconType: 'shoulder' },
    { id: 'Eye care', label: 'Eye care', iconType: 'eye' },
  ];

  // Doctors for the carousel matching video Frame 06 & 07
  const carouselDoctors = [
    {
      name: 'Dr. Sanjana Gupta',
      specialty: 'Neurosurgeon',
      image: 'https://images.unsplash.com/photo-1594824813576-963d04732155?w=500&auto=format&fit=crop&q=80',
      category: 'Orthopedists',
      rating: '4.9',
      exp: '12 Yrs',
      fee: '₹1,500'
    },
    {
      name: 'Dr. Jen Gunter',
      specialty: 'Neurologist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
      category: 'Neurology',
      rating: '4.8',
      exp: '9 Yrs',
      fee: '₹1,200'
    },
    {
      name: 'Dr. Sherry',
      specialty: 'Gynecologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
      category: 'Obesity',
      rating: '4.9',
      exp: '14 Yrs',
      fee: '₹1,800'
    },
    {
      name: 'Dr. Pimple Popper',
      specialty: 'Psychiatrist',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
      category: 'Headache',
      rating: '4.7',
      exp: '11 Yrs',
      fee: '₹2,000'
    },
    {
      name: 'Dr. Arjun Sharma',
      specialty: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
      category: 'Neck pain',
      rating: '5.0',
      exp: '16 Yrs',
      fee: '₹2,200'
    },
    {
      name: 'Dr. Rajesh Kapoor',
      specialty: 'General Physician',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80',
      category: 'Eye care',
      rating: '4.8',
      exp: '10 Yrs',
      fee: '₹1,000'
    }
  ];

  // Testimonials matching video Frame 13
  const testimonials = [
    {
      author: 'Esther Howard',
      role: 'Patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      quote:
        'I had a great experience at this healthcare clinic. I was seen quickly, and the doctor was able to diagnose and treat my condition.',
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
    <div className="w-full bg-white text-[#16163B] font-sans selection:bg-[#242454] selection:text-white relative">
      
      {/* ─────────────────────────────────────────────────────────────
          BRAND TRANSITION OVERLAY (Video 0.8s - 1.8s, Frame 02 & 03)
          Flat Deep-Indigo Full Screen (#20204F) with Brand Mark
          ───────────────────────────────────────────────────────────── */}
      {showBrandIntro && (
        <div
          onClick={() => setShowBrandIntro(false)}
          className={`fixed inset-0 z-[9999] bg-[#20204F] flex items-center justify-center transition-all duration-500 cursor-pointer ${
            introStep === 2 ? 'opacity-100 scale-100' : introStep === 3 ? 'opacity-0 pointer-events-none scale-105' : 'opacity-95'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4 transition-transform duration-500 transform">
            {/* Exact Stylized V Brand Mark with 2 Dots (Frame 02) */}
            <div className="relative flex items-center justify-center animate-pulse">
              <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stylized Rounded V */}
                <path
                  d="M32 20C32 13.3726 37.3726 8 44 8C50.6274 8 56 13.3726 56 20V45C56 47.7614 58.2386 50 61 50C63.7614 50 66 47.7614 66 45V20C66 13.3726 71.3726 8 78 8C84.6274 8 90 13.3726 90 20V45C90 61.5685 76.5685 75 60 75C43.4315 75 30 61.5685 30 45L32 20Z"
                  fill="#FFFFFF"
                />
                {/* Left Pink Dot */}
                <circle cx="28" cy="55" r="10" fill="#E7B8D1" />
                {/* Right Pink Dot */}
                <circle cx="92" cy="55" r="10" fill="#E7B8D1" />
              </svg>
            </div>
            <div className="text-white text-3xl font-extrabold tracking-tight mt-2 font-['Poppins']">
              ClinicOS <span className="text-[#E7B8D1] font-light">MediCare</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click anywhere to skip</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Matching Reference Frame 04 & 05)
          Exact Pixel-Perfect Hero Banner & Proportions
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8 pt-4 pb-4">
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl bg-[#242454]">
          <img
            src="/images/hero-banner-exact.png"
            alt="Healthcare Banner"
            className="w-full h-auto block select-none"
          />
          {/* Interactive Clickable Hotspot for Book Consultation */}
          <button
            onClick={() => navigate('/book-appointment')}
            title="Book Consultation"
            className="absolute bottom-[3%] right-[3%] w-[24%] sm:w-[22%] h-[14%] rounded-full bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer border-none"
          />
          {/* Interactive Clickable Hotspot for Left Pill: Reduce HbA1c */}
          <button
            onClick={() => showToast('HbA1c monitoring and endocrinology consults active.')}
            title="Reduce HbA1c"
            className="absolute top-[42%] left-[22%] sm:left-[24%] w-[16%] h-[8%] rounded-full bg-transparent hover:bg-white/10 transition-all cursor-pointer border-none"
          />
          {/* Interactive Clickable Hotspot for Right Pill: No more medications */}
          <button
            onClick={() => showToast('Lifestyle medicine and de-prescribing protocols active.')}
            title="No more medications"
            className="absolute top-[42%] right-[19%] sm:right-[21%] w-[18%] h-[8%] rounded-full bg-transparent hover:bg-white/10 transition-all cursor-pointer border-none"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 4 PASTEL SERVICE CARDS (Matching Reference Frame 04 & 05)
          Soft Yellow, Mint, Soft Blush/Pink, and Pastel Blue
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Soft Yellow - Instant Video Consultation */}
          <div
            onClick={() => navigate('/video-call')}
            title="Instant Video Consultation"
            className="group relative rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer"
          >
            <img src="/images/card-video-exact.png" alt="Instant Video Consultation" className="w-full h-auto block" />
          </div>

          {/* Card 2: Mint - Find Doctors near you */}
          <div
            onClick={() => navigate('/book-appointment')}
            title="Find Doctors near you"
            className="group relative rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer"
          >
            <img src="/images/card-doctors-exact.png" alt="Find Doctors near you" className="w-full h-auto block" />
          </div>

          {/* Card 3: Pink - 24/7 Medicines */}
          <div
            onClick={() => navigate('/pharmacy-inventory')}
            title="24/7 Medicines"
            className="group relative rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer"
          >
            <img src="/images/card-medicines-exact.png" alt="24/7 Medicines" className="w-full h-auto block" />
          </div>

          {/* Card 4: Pastel Blue - Lab Tests */}
          <div
            onClick={() => navigate('/pathology-worklist')}
            title="Lab Tests"
            className="group relative rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer"
          >
            <img src="/images/card-tests-exact.png" alt="Lab Tests" className="w-full h-auto block" />
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. IN-CLINIC CONSULTATION & DOCTOR ROSTER (Frame 06 & 07)
          Matching Exact Typography, Pills, and Doctor Cards
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        
        {/* Exact Title Layout (Frame 06: Two lines, Bold Dark Indigo) */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
            Book an appointment for an<br />in-clinic consultation
          </h2>
        </div>

        {/* Filter Pills with Illustrated Badges (Frame 06) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#242454] text-white border-[#242454] shadow-md scale-105'
                    : 'bg-[#F0F3FA] text-[#16163B] border-transparent hover:bg-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                {/* Custom Small Badge Graphic */}
                <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">
                  {cat.iconType === 'cast' ? '🩹' : cat.iconType === 'scale' ? '⚖️' : cat.iconType === 'neck' ? '💆' : cat.iconType === 'brain' ? '🧠' : cat.iconType === 'head' ? '🤕' : cat.iconType === 'shoulder' ? '💪' : '👁️'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4 Doctor Cards Grid (Frame 06) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {carouselDoctors.slice(0, 4).map((doc, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/book-appointment')}
              className="group bg-white rounded-[28px] border border-slate-100 p-3 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              {/* Doctor Cutout with Soft Grey Rounded Canvas (Frame 06) */}
              <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-[#F1F4F8] flex items-end justify-center mb-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Doctor Name & Specialty */}
              <div className="px-2 pb-2">
                <h4 className="text-base font-extrabold text-[#16163B] m-0 group-hover:text-blue-600 transition-colors font-['Poppins']">
                  {doc.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
                  {doc.specialty}
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mt-3 pt-2 border-t border-slate-100">
                  <span>⭐ {doc.rating} ({doc.exp})</span>
                  <span className="text-[#242454] font-bold">{doc.fee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exact Sliding Progress Scrubber Bar (Frame 06 & 07) */}
        <div className="w-64 mx-auto mt-8 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#16163B] rounded-full animate-pulse" />
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FREQUENTLY BOOK LAB TESTS & DEALS (Frame 08, 09, 10, 11)
          Full-Width Deep Indigo Section (#16163B / #242454)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="rounded-[36px] bg-[#16163B] text-white p-6 sm:p-10 shadow-2xl">
          
          {/* Top Lab Tests Row */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-extrabold text-white m-0 tracking-tight font-['Poppins']">
              Frequently Book<br />Lab Tests
            </h3>
            <button
              onClick={() => navigate('/pathology-worklist')}
              className="text-xs font-bold text-white hover:text-slate-200 tracking-wider flex items-center gap-2 bg-transparent border-none cursor-pointer uppercase"
            >
              <span>View All Lab Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Pastel Lab Test Cards (Frame 08 & 09) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1: Soft Peach (#FDEAE4) - Imaging tests */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#FDEAE4] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF7D66] text-white text-[11px] font-extrabold uppercase mb-3">
                  60%
                </span>
                <h4 className="text-xl font-bold m-0 font-['Poppins']">Imaging<br />tests</h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Imaging tests, such as X-rays, CT scans, and MRIs
                </p>
              </div>

              {/* Character Back Pain Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="30" r="14" fill="#FFC9BF" />
                  <path d="M42 44C30 50 35 85 45 90C55 95 70 85 70 65C70 45 55 42 42 44Z" fill="#F8B1A4" />
                  <path d="M48 68C58 68 62 76 56 82" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" />
                  <path d="M72 75L80 72M74 82L82 82" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

            {/* Card 2: Soft Mint (#E5F7EE) - MRI & CT Scan */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#E5F7EE] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#3FB985] text-white text-[11px] font-extrabold uppercase mb-3">
                  60%
                </span>
                <h4 className="text-xl font-bold m-0 font-['Poppins']">MRI &amp;<br />CT Scan</h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Imaging tests, such as X-rays, CT scans, and MRIs
                </p>
              </div>

              {/* Character Headache Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="55" cy="35" r="14" fill="#FFC9BF" />
                  <path d="M40 35C40 25 55 18 68 25" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" />
                  <path d="M70 20L80 15M75 30L85 30" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
                  <path d="M45 48C35 55 40 85 55 88C68 90 75 75 75 60C75 48 58 45 45 48Z" fill="#F8B1A4" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

            {/* Card 3: Soft Cream (#FDF8DC) - Orthopedists tests */}
            <div
              onClick={() => navigate('/pathology-worklist')}
              className="rounded-[28px] bg-[#FDF8DC] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#E5B537] text-white text-[11px] font-extrabold uppercase mb-3">
                  60%
                </span>
                <h4 className="text-xl font-bold m-0 font-['Poppins']">Orthopedists<br />tests</h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Orthopedists can diagnose and treat various types of back and neck pain
                </p>
              </div>

              {/* Character Arm Cast Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="30" r="14" fill="#FFC9BF" />
                  <path d="M40 44C30 50 35 85 45 90C55 95 70 85 70 65C70 45 55 42 40 44Z" fill="#F8B1A4" />
                  <path d="M40 65H65V80H40V65Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  <path d="M38 52L48 65L65 65" stroke="#475569" strokeWidth="3" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">$120</span>
                <span className="text-xs line-through text-slate-500 font-semibold">$140</span>
              </div>
            </div>

          </div>

          {/* Bottom Deals Sub-Section (Frame 10 & 11) */}
          <div className="flex items-center justify-between mb-8 pt-8 border-t border-white/10">
            <h3 className="text-3xl font-extrabold text-white m-0 tracking-tight font-['Poppins']">
              Todays best deals<br />for you!
            </h3>
            <button
              onClick={() => navigate('/pharmacy-inventory')}
              className="text-xs font-bold text-white hover:text-slate-200 tracking-wider flex items-center gap-2 bg-transparent border-none cursor-pointer uppercase"
            >
              <span>See All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 White Deal Cards (Frame 10 & 11) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Product 1: Swanson Dietary Supplement (Frame 10) */}
            <div className="rounded-[24px] bg-white text-[#16163B] p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-end mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#E9DF70] text-[#16163B] text-[10px] font-bold">20% Off</span>
                </div>
                <div className="h-32 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2">
                  <img
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
                    alt="Dietary Supplement"
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Nutrition</span>
                  <span className="text-amber-500 font-bold">★ (4.5)</span>
                </div>
                <h5 className="text-xs font-bold text-[#16163B] m-0 leading-snug">
                  Dietary Supplement Health Products
                </h5>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleAddToCart('Dietary Supplement')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors cursor-pointer"
                >
                  + Add to
                </button>
                <div className="text-right">
                  <span className="text-xs line-through text-slate-400 mr-1">$80.00</span>
                  <span className="text-sm font-extrabold text-[#16163B]">$64.00</span>
                </div>
              </div>
            </div>

            {/* Product 2: Nitrile Disposable Gloves (Frame 10) */}
            <div className="rounded-[24px] bg-white text-[#16163B] p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="h-32 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=300&auto=format&fit=crop&q=80"
                    alt="Nitrile Gloves"
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Healthcare</span>
                  <span className="text-amber-500 font-bold">★ (4.5)</span>
                </div>
                <h5 className="text-xs font-bold text-[#16163B] m-0 leading-snug">
                  Nitrile Disposable gloves 100
                </h5>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleAddToCart('Nitrile Gloves')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors cursor-pointer"
                >
                  + Add to
                </button>
                <span className="text-sm font-extrabold text-[#16163B]">$140.00</span>
              </div>
            </div>

            {/* Product 3: Amber Multivitamins (Frame 10) */}
            <div className="rounded-[24px] bg-white text-[#16163B] p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-end mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#E9DF70] text-[#16163B] text-[10px] font-bold">50% Off</span>
                </div>
                <div className="h-32 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2">
                  <img
                    src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80"
                    alt="Amber Multivitamins"
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Medicine</span>
                  <span className="text-amber-500 font-bold">★ (4.5)</span>
                </div>
                <h5 className="text-xs font-bold text-[#16163B] m-0 leading-snug">
                  Womens multi Vitamins A, Biotin- cranberry
                </h5>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleAddToCart('Multivitamins')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors cursor-pointer"
                >
                  + Add to
                </button>
                <div className="text-right">
                  <span className="text-xs line-through text-slate-400 mr-1">$160.00</span>
                  <span className="text-sm font-extrabold text-[#16163B]">$80.0</span>
                </div>
              </div>
            </div>

            {/* Product 4: Antibacterial Liquid Hand Soap (Frame 10) */}
            <div className="rounded-[24px] bg-white text-[#16163B] p-4 flex flex-col justify-between shadow-md">
              <div>
                <div className="h-32 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
                    alt="Antibacterial Soap"
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Wellness</span>
                  <span className="text-amber-500 font-bold">★ (4.5)</span>
                </div>
                <h5 className="text-xs font-bold text-[#16163B] m-0 leading-snug">
                  Antibacterial Liquid Hand Soap
                </h5>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleAddToCart('Hand Soap')}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors cursor-pointer"
                >
                  + Add to
                </button>
                <span className="text-sm font-extrabold text-[#16163B]">$80.0</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HEALTH PRIORITY PHOTOGRAPHIC BANNER (Frame 12)
          "Your health is our Top priority ↗"
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="relative rounded-[36px] overflow-hidden min-h-[300px] sm:min-h-[340px] flex items-center justify-center shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&auto=format&fit=crop&q=80"
            alt="Runners Outdoors in Nature"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          />

          <div className="relative z-10 text-center px-4 space-y-3">
            <div className="inline-block px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider text-slate-200 uppercase">
              Healthcare solutions
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white m-0 tracking-tight flex items-center justify-center gap-3 font-['Poppins']">
              <span>Your health is our</span>
              <span className="text-[#E9DF70]">Top priority</span>
              <button
                onClick={() => showToast('Playing health fitness story...')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] flex items-center justify-center transition-transform hover:scale-110 shadow-lg border-none cursor-pointer"
              >
                <span className="text-lg font-bold">↗</span>
              </button>
            </h2>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BENTO GRID STATS & LIVE EVENTS (Frame 13)
          Nutrition Podcast (#E9DF70), Live Event (#233979),
          08 Years Experience (#A7DDC5), 120k Happy Customers (#E7B8D1)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-14">
          
          {/* Yellow Podcast Card (Left - 6 cols) */}
          <div className="md:col-span-6 rounded-[32px] bg-[#E9DF70] p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white text-[#16163B] text-[11px] font-bold mb-3">
                • Podcast
              </span>
              <h3 className="text-3xl font-extrabold text-[#16163B] m-0 leading-tight font-['Poppins']">
                Nutrition and<br />Mental Health
              </h3>
              <p className="text-xs text-slate-800 font-medium max-w-xs mt-3 leading-relaxed">
                The food we eat provides the nutrients that our bodies and brains need to function properly.
              </p>
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => {
                  setIsPlayingPodcast(!isPlayingPodcast);
                  showToast(isPlayingPodcast ? 'Podcast paused' : 'Playing Nutrition and Mental Health Episode');
                }}
                className="w-12 h-12 rounded-full bg-white hover:bg-[#16163B] hover:text-white text-[#16163B] flex items-center justify-center shadow-md transition-all cursor-pointer border-none"
              >
                {isPlayingPodcast ? (
                  <Volume2 className="w-5 h-5 animate-bounce" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Exact Avocado & Carrot Line Art (Frame 13) */}
              <div className="w-36 h-20 text-emerald-800/60 pointer-events-none">
                <svg viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                  <ellipse cx="60" cy="35" rx="20" ry="26" />
                  <ellipse cx="60" cy="35" rx="10" ry="14" fill="#3FB985" fillOpacity="0.4" />
                  <path d="M78 45L110 35L105 45L78 45Z" fill="#F8B1A4" fillOpacity="0.5" />
                  <path d="M110 35L118 28M110 38L120 38" />
                  <path d="M25 40C25 48 35 48 35 40" strokeLinecap="round" />
                  <path d="M40 50C40 56 46 56 46 50" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Bento Column (6 cols) */}
          <div className="md:col-span-6 flex flex-col gap-5">
            
            {/* Deep Blue Live Event Card (Frame 13: #233979) */}
            <div className="rounded-[32px] bg-[#233979] text-white p-6 shadow-lg flex flex-col justify-between flex-1 relative overflow-hidden">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold mb-3">
                  • Live Event
                </span>
                <h4 className="text-2xl font-bold m-0 leading-tight font-['Poppins']">
                  Healthy Habits for a<br />Happy Heart
                </h4>
              </div>

              {/* Webinar Screen Line Art (Frame 13) */}
              <div className="absolute right-6 top-6 w-20 h-16 opacity-30 pointer-events-none">
                <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                  <rect x="10" y="8" width="60" height="40" rx="4" />
                  <circle cx="28" cy="24" r="6" />
                  <path d="M20 38C20 32 36 32 36 38" />
                  <circle cx="52" cy="24" r="6" />
                  <path d="M44 38C44 32 60 32 60 38" />
                  <line x1="5" y1="48" x2="75" y2="48" strokeWidth="3" />
                </svg>
              </div>

              <div className="flex items-center justify-end mt-6 text-xs text-blue-200">
                <span>Feb 28, 2023 08:00 PM</span>
              </div>
            </div>

            {/* Bottom 2 Split Stat Blocks (Frame 13) */}
            <div className="grid grid-cols-2 gap-5">
              
              {/* Mint Stat Card (#A7DDC5) */}
              <div className="rounded-[28px] bg-[#A7DDC5] p-6 text-[#16163B] shadow-md relative overflow-hidden">
                <div className="text-4xl font-extrabold tracking-tight leading-none font-['Poppins']">
                  08
                </div>
                <div className="text-xs font-bold text-slate-800 mt-2">
                  Years Experience
                </div>
                {/* Stethoscope Watermark */}
                <div className="absolute right-3 top-3 w-14 h-14 text-teal-800/20 pointer-events-none">
                  <Stethoscope className="w-full h-full" />
                </div>
              </div>

              {/* Pink Stat Card (#E7B8D1) */}
              <div className="rounded-[28px] bg-[#E7B8D1] p-6 text-[#16163B] shadow-md relative overflow-hidden">
                <div className="text-4xl font-extrabold tracking-tight leading-none font-['Poppins']">
                  120k
                </div>
                <div className="text-xs font-bold text-slate-800 mt-2">
                  Happy Customers
                </div>
                {/* Chat Bubble Watermark */}
                <div className="absolute right-3 top-3 w-14 h-14 text-pink-900/20 pointer-events-none">
                  <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                    <path d="M10 10H45C48 10 50 12 50 15V35C50 38 48 40 45 40H20L10 50V10Z" />
                    <circle cx="25" cy="25" r="2" fill="currentColor" />
                    <circle cx="35" cy="25" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Social Proof Heading (Frame 13) */}
        <div className="text-center pt-4">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
            Our doctors and clinics have earned<br />over 5,000+ reviews on Google!
          </h3>

          <div className="flex items-center justify-center gap-1.5 my-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-[#3FB985] text-[#3FB985]" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500 mb-8">Average Google Rating is 4.6</p>

          {/* Testimonial Quote Card (Frame 13) */}
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
                <span className="text-xs font-bold text-[#16163B] block">{testimonials[activeTestimonial].author}</span>
                <span className="text-[11px] text-slate-400 font-semibold">{testimonials[activeTestimonial].role}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PLATFORM PROMOTION & APP DOWNLOAD (Frame 14 & 15)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Yellow Phone Mockup Card (Frame 14) */}
          <div className="rounded-[36px] bg-[#E9DF70] p-8 flex flex-col justify-between items-center shadow-lg min-h-[380px] overflow-hidden relative">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-lg font-black text-[#16163B] tracking-tight font-['Poppins']">MediCare ClinicOS</span>
              <span className="text-xs font-bold text-slate-700">Web &amp; Mobile</span>
            </div>

            <div className="w-72 h-80 bg-white rounded-t-[36px] border-4 border-[#16163B] p-4 shadow-2xl relative translate-y-6">
              <div className="w-16 h-1.5 bg-[#16163B] rounded-full mx-auto mb-3" />
              <div className="text-xs font-bold text-[#16163B] mb-1">Dental Treatments • Cardiology</div>
              <div className="h-16 bg-slate-50 rounded-xl mb-2 p-2 text-[10px] text-slate-600 border border-slate-100">
                Win over Diabetes • Instant Care
              </div>
              <div className="h-16 bg-blue-50 rounded-xl p-2 text-[10px] text-blue-700 font-bold border border-blue-100">
                Book Video Consult • In 30s
              </div>
            </div>
          </div>

          {/* Ice-Blue Download Card (Frame 14) */}
          <div className="rounded-[36px] bg-[#D8E6FA] p-8 flex flex-col justify-between shadow-lg min-h-[380px]">
            <div>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">60+ Doctors</span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">6k Downloads</span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs">4,500 Reviews</span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#16163B] m-0 leading-tight font-['Poppins']">
                Download Our<br />Healthcare App for<br />Easy Access
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-3 max-w-sm">
                Get appointments, track digital prescriptions, and connect with 24/7 doctors anywhere.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => showToast('Opening Apple App Store...')}
                className="px-5 py-2.5 rounded-2xl bg-[#16163B] text-white font-bold text-xs flex items-center gap-2 border-none cursor-pointer hover:opacity-90"
              >
                <span> App Store</span>
              </button>
              <button
                onClick={() => showToast('Opening Google Play Store...')}
                className="px-5 py-2.5 rounded-2xl bg-[#16163B] text-white font-bold text-xs flex items-center gap-2 border-none cursor-pointer hover:opacity-90"
              >
                <span>▶ Google Play</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. READ TOP ARTICLES FROM HEALTH EXPERTS (Frame 14 & 15)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
            Read top articles from<br />health experts
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
              <span className="px-3 py-1 rounded-full bg-white text-[#16163B] text-[11px] font-bold border border-slate-200">
                Healthy lifestyle
              </span>
              <h4 className="text-xl font-bold text-[#16163B] mt-4 mb-2 font-['Poppins']">
                Your Ultimate Guide to Health and Wellness
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Learn modern preventive healthcare habits, nutritional balances, and cardio workouts designed by top cardiologists.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50">
              <button
                onClick={() => navigate('/book-appointment')}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors border-none cursor-pointer shadow-xs"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">5 min read</span>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#F1F4F8] p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="px-3 py-1 rounded-full bg-white text-[#16163B] text-[11px] font-bold border border-slate-200">
                Blog Topic
              </span>
              <h4 className="text-xl font-bold text-[#16163B] mt-4 mb-2 font-['Poppins']">
                Acne Care Combo of Cetaphil Oily Skin Cleanser
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Discover safe dermatological guidelines to revitalize your skin barrier and reduce inflammatory breakouts.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50">
              <button
                onClick={() => navigate('/book-appointment')}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs transition-colors border-none cursor-pointer shadow-xs"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">4 min read</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. CLINICOS FUNCTIONAL PATIENT CARE & EMR SNAPSHOT
          Preserved Features: Upcoming Appointments, Vitals, Prescriptions
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div className="bg-[#FAFBFD] rounded-[32px] border border-slate-100 p-6 sm:p-10 shadow-xs">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
                Your Health Snapshot &amp; Active Care
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 m-0">
                Connected to your real-time EMR database records
              </p>
            </div>

            <button
              onClick={() => navigate('/medical-records')}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#16163B] hover:text-white text-[#16163B] border border-slate-200 font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Full Medical Records →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Upcoming Appointments */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Upcoming Appointments
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-[#16163B]">Dr. Arjun Sharma</div>
                  <div className="text-[11px] text-slate-500">Cardiologist • Today 5:00 PM</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Today</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-[#16163B]">Dr. Priya Menon</div>
                  <div className="text-[11px] text-slate-500">Pediatrician • Tomorrow 4:00 PM</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">Tomorrow</span>
              </div>
            </div>

            {/* Column 2: Live Health Vitals */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Health Vitals Log
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-blue-700 font-bold">Heart Rate</div>
                  <div className="text-xl font-extrabold text-[#16163B]">72 bpm</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Normal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-purple-700 font-bold">Blood Pressure</div>
                  <div className="text-xl font-extrabold text-[#16163B]">120/80</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Optimal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-amber-700 font-bold">Blood Sugar</div>
                  <div className="text-xl font-extrabold text-[#16163B]">98 mg/dL</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Normal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-emerald-700 font-bold">SpO2 Oxygen</div>
                  <div className="text-xl font-extrabold text-[#16163B]">98 %</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Normal</div>
                </div>
              </div>
            </div>

            {/* Column 3: Active Prescriptions */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Active Prescriptions
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-[#16163B]">Amlodipine 5mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet daily (Morning)</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-[#16163B]">Metformin 500mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet twice daily</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold text-[#16163B]">Atorvastatin 10mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet at night</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. GRAND FOOTER (Frame 16)
          Matching Reference Multi-column Directory & Giant Pink Banner
          ───────────────────────────────────────────────────────────── */}
      <footer className="w-full px-6 sm:px-10 pb-8">
        <div className="rounded-[36px] bg-[#16163B] text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 font-['Poppins']">Company</h5>
              <ul className="space-y-2 text-xs font-medium text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('What&apos;s New')}>What&apos;s New</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('About Us')}>About</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Press Releases')}>Press</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Careers')}>Careers</li>
                <li className="hover:text-white cursor-pointer" onClick={() => showToast('Contact Us')}>Contact</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 font-['Poppins']">Community</h5>
              <ul className="space-y-2 text-xs font-medium text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Medicare for Business</li>
                <li className="hover:text-white cursor-pointer">Creator Report</li>
                <li className="hover:text-white cursor-pointer">Charities</li>
                <li className="hover:text-white cursor-pointer">Creator Profile Directory</li>
                <li className="hover:text-white cursor-pointer">Explore Templates</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 font-['Poppins']">Support</h5>
              <ul className="space-y-2 text-xs font-medium text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Help Topics</li>
                <li className="hover:text-white cursor-pointer">Getting Started</li>
                <li className="hover:text-white cursor-pointer">Linktree Pro</li>
                <li className="hover:text-white cursor-pointer">Features &amp; How-Tos</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Report a Violation</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 font-['Poppins']">Trust &amp; Legal</h5>
              <ul className="space-y-2 text-xs font-medium text-slate-300 list-none p-0 m-0">
                <li className="hover:text-white cursor-pointer">Terms &amp; Conditions</li>
                <li className="hover:text-white cursor-pointer">Privacy Notice</li>
                <li className="hover:text-white cursor-pointer">Cookie Notice</li>
                <li className="hover:text-white cursor-pointer">Trust Center</li>
                <li className="hover:text-white cursor-pointer">Cookie Preferences</li>
              </ul>
            </div>
          </div>

          {/* Exact Massive Pink Banner with Dark Indigo Brand (Frame 16) */}
          <div className="rounded-[28px] bg-[#E7B8D1] text-[#16163B] py-8 px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <svg width="48" height="38" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32 20C32 13.3726 37.3726 8 44 8C50.6274 8 56 13.3726 56 20V45C56 47.7614 58.2386 50 61 50C63.7614 50 66 47.7614 66 45V20C66 13.3726 71.3726 8 78 8C84.6274 8 90 13.3726 90 20V45C90 61.5685 76.5685 75 60 75C43.4315 75 30 61.5685 30 45L32 20Z"
                  fill="#16163B"
                />
                <circle cx="28" cy="55" r="10" fill="#FFFFFF" />
                <circle cx="92" cy="55" r="10" fill="#FFFFFF" />
              </svg>
              <span className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none font-['Poppins']">
                ClinicOS MediCare
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-6 mt-6 border-t border-white/10 gap-2 font-medium">
            <span>© 2026 ClinicOS MediCare. All rights reserved.</span>
            <span>Desktop Experience Target: 1440px - 1920px</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
