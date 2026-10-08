import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
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
  Pause,
  CheckCircle2,
  Star,
  Smartphone,
  ChevronLeft,
  X,
  Volume2,
  ShoppingBag,
  Plus,
  Minus,
  Building2,
  Truck
} from 'lucide-react';
import { SeniorPatientDashboard } from './SeniorPatientDashboard';
import { specialistDoctors } from '../../data/specialistDoctors';
import { PatientHealthVitalsDashboard } from './PatientHealthVitalsDashboard';
import { MEDICINE_CATALOG } from '../../data/medicineCatalog';
import { HealthInsurancePlansSection } from './HealthInsurancePlansSection';
import confetti from 'canvas-confetti';

export const PatientDashboard = () => {
  const { currentUser, activePatient, appointments, vitals, doctors, showToast, addToPharmacyCart } = useApp();
  const navigate = useNavigate();
  // Reference Video Brand Intro State (Opening animation from reference video)
  const [showBrandIntro, setShowBrandIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('clinicos_intro_seen');
    } catch {
      return false;
    }
  });
  const [introStep, setIntroStep] = useState(1);

  const [activeCategory, setActiveCategory] = useState('Orthopedists');
  const [activeMedCategory, setActiveMedCategory] = useState('All Deals');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [podcastSeconds, setPodcastSeconds] = useState(0);
  const podcastTimerRef = useRef(null);
  const utteranceRef = useRef(null);

  const podcastScript = "Welcome to ClinicOS HealthCast. Today's episode: Nutrition and Mental Health. Did you know that the food we eat provides the fundamental nutrients that our bodies and brains need to function properly? Over ninety percent of your body's serotonin, the key neurotransmitter for regulating mood and emotional balance, is synthesized in your gastrointestinal tract along the gut-brain axis. Maintaining a balanced diet rich in leafy greens, omega-3 fatty acids, complex carbohydrates, and probiotic nutrition helps reduce anxiety, stabilize mood swings, and optimize cognitive clarity. Nourish your mind, eat mindfully, and remember: your health is always our top priority.";

  const toggleVoicePodcast = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingPodcast) {
      window.speechSynthesis.cancel();
      if (podcastTimerRef.current) clearInterval(podcastTimerRef.current);
      setIsPlayingPodcast(false);
      showToast('Podcast audio paused.');
    } else {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(podcastScript);
      utter.rate = 0.95;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('India'))) || voices.find(v => v.lang.startsWith('en'));
      if (preferred) utter.voice = preferred;

      utter.onstart = () => {
        setIsPlayingPodcast(true);
        setPodcastSeconds(0);
        if (podcastTimerRef.current) clearInterval(podcastTimerRef.current);
        podcastTimerRef.current = setInterval(() => {
          setPodcastSeconds(prev => (prev < 42 ? prev + 1 : prev));
        }, 1000);
      };

      utter.onend = () => {
        setIsPlayingPodcast(false);
        setPodcastSeconds(0);
        if (podcastTimerRef.current) clearInterval(podcastTimerRef.current);
        showToast('Finished listening to Nutrition and Mental Health.');
      };

      utter.onerror = () => {
        setIsPlayingPodcast(false);
        if (podcastTimerRef.current) clearInterval(podcastTimerRef.current);
      };

      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsPlayingPodcast(true);
      showToast('🎙️ Now Playing: Nutrition and Mental Health Voice Podcast');
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (podcastTimerRef.current) {
        clearInterval(podcastTimerRef.current);
      }
    };
  }, []);

  const [showHeroVideoModal, setShowHeroVideoModal] = useState(false);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(true);
  const heroVideoRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);

  // Lab Test Booking Modal State
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [labBookingStep, setLabBookingStep] = useState('details'); // 'details' | 'success'
  const [collectionType, setCollectionType] = useState('home'); // 'home' | 'centre'
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 86400000).toISOString().substring(0, 10));
  const [bookingSlot, setBookingSlot] = useState('08:00 AM - 10:00 AM');
  const [bookingRefId, setBookingRefId] = useState('');

  // Pharmacy Product Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQty, setProductQty] = useState(1);
  const [showPharmacyCatalogModal, setShowPharmacyCatalogModal] = useState(false);

  // Entrance animation state — cards use rv-card-falling class, removed after anim completes
  // so hover transforms work freely (animation-fill-mode conflict resolved)
  const [cardsEntered, setCardsEntered] = useState(false);

  const patientAge = currentUser?.age || activePatient?.age || 29;

  // Scroll-reveal observer for the whole page
  const pageRef = useScrollReveal('.rv-reveal, .rv-title-reveal');

  // Handle Brand Intro Animation (~1100ms total, non-blocking with instant click-to-dismiss)
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 100);
    const t2 = setTimeout(() => setIntroStep(2), 600);
    const t3 = setTimeout(() => {
      setIntroStep(3);
      setShowBrandIntro(false);
    }, 1100);

    // Remove card-falling class after all 4 cards finish their entrance
    // Card 4 starts at 600ms delay + 700ms duration = 1300ms, +100ms buffer = 1400ms
    const tCards = setTimeout(() => setCardsEntered(true), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tCards);
    };
  }, []);

  // AGE > 70: SHOW DEDICATED SENIOR CARE INTERFACE
  if (patientAge > 70) {
    return <SeniorPatientDashboard />;
  }

  // ── SPECIALTY CATEGORIES ─────────────────────────────────────────────
  const categories = [
    { id: 'Orthopedists',   label: 'Orthopedists',   emoji: '🦴' },
    { id: 'Cardiologists',  label: 'Cardiologists',  emoji: '❤️' },
    { id: 'Neurologists',   label: 'Neurologists',   emoji: '🧠' },
    { id: 'Gynecologists',  label: 'Gynecologists',  emoji: '👶' },
    { id: 'Dermatologists', label: 'Dermatologists', emoji: '🌿' },
    { id: 'ENT Specialists',label: 'ENT Specialists',emoji: '👂' },
    { id: 'Eye Specialists',label: 'Eye Specialists',emoji: '👁️' },
    { id: 'Psychiatrists',  label: 'Psychiatrists',  emoji: '🧘' },
    { id: 'Pediatricians',  label: 'Pediatricians',  emoji: '🧒' },
    { id: 'Diabetologists', label: 'Diabetologists', emoji: '💉' },
  ];

  // ── ALL DOCTORS (80 Doctors across 10 categories, at least 8 unique doctors per category) ──
  const allDoctors = specialistDoctors;

  // Filter doctors by selected category
  const carouselDoctors = allDoctors.filter(d => d.category === activeCategory);



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
    showToast(`🛒 Added "${productName}" to your cart!`);
  };

  // Lab Tests Catalog for Section 4
  const labTestsList = [
    {
      id: 'test-imaging',
      title: 'Imaging tests',
      subtitle: 'X-rays, High-Res CT scans, and 3D Ultrasound',
      discount: '60%',
      price: 1200,
      originalPrice: 3000,
      badgeColor: '#FF7D66',
      cardBg: '#FDEAE4',
      accentColor: '#16163B',
      reportTime: '6 Hours (Digital Report + DICOM CD)',
      fasting: 'No Fasting Required (Plain X-Rays / Ultrasound) • 4h for Contrast',
      parameters: [
        'Dual-Angle Digital Chest, Spine & Abdomen X-Ray',
        'Multi-Slice Helical Scanner with Ultra-Low Radiation protocol',
        'Senior Radiologist Verified Report with Tele-Consult',
        'DICOM Cloud Link sent via WhatsApp & SMS',
        'Doorstep Mobile X-Ray & Sample Pickup Option Available'
      ],
      includes: 'Chest X-Ray • Spine Radiography • High-Resolution Ultrasound'
    },
    {
      id: 'test-mri-ct',
      title: 'MRI & CT Scan',
      subtitle: 'High-Field 1.5T/3T Whole Body MRI & 128-Slice CT',
      discount: '60%',
      price: 2400,
      originalPrice: 6000,
      badgeColor: '#3FB985',
      cardBg: '#E5F7EE',
      accentColor: '#16163B',
      reportTime: 'Same Day (Within 8 Hours)',
      fasting: '4-6 Hours Fasting for Contrast • None for Plain MRI',
      parameters: [
        'Brain, Spine, Knee & Abdominal 1.5T Silent MRI',
        '128-Slice Dual-Energy Volumetric CT Scanning',
        'High-Contrast 3D Multi-Planar Angiography',
        'NABL & NABH Accredited Advanced Scan Center',
        'Immediate Soft Copy & Comprehensive Radiologist Summary'
      ],
      includes: 'Brain MRI • 128-Slice CT Scan • Spine MRI • Contrast Screening'
    },
    {
      id: 'test-ortho',
      title: 'Orthopedists tests',
      subtitle: 'Diagnose and treat back, joint, and chronic neck pain',
      discount: '60%',
      price: 1500,
      originalPrice: 3750,
      badgeColor: '#E5B537',
      cardBg: '#FDF8DC',
      accentColor: '#16163B',
      reportTime: '12 Hours (Comprehensive Bone Health Profile)',
      fasting: 'Overnight Fasting (8-10 Hours) for Calcium & Vitamin D3 Profile',
      parameters: [
        'Dual-Energy X-ray Absorptiometry (DEXA Bone Mineral Density)',
        'Cervical & Lumbar Spine Digital Radiography',
        'Serum Vitamin D3 (25-OH) & Total Serum Calcium Profile',
        'Rheumatoid Factor (RA Quantitative) & Uric Acid Screening',
        'Comprehensive Orthopedic Assessment Checklist'
      ],
      includes: 'DEXA Bone Density • Joint X-Ray • Vitamin D3 • Calcium Profile'
    }
  ];

  // Daily Deals & Pharmacy Products for Section 4
  const pharmacyProducts = [
    {
      id: 'deal-prod-1',
      title: 'Dietary Supplement Health Products',
      brand: 'Swanson Health USA',
      category: 'Nutrition',
      rating: '★ (4.5)',
      discount: '20% Off',
      price: 799,
      originalPrice: 999,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      description: 'Daily dietary supplement loaded with zinc, essential probiotics, and bioavailable vitamins to supercharge immunity and gut wellness.',
      dosage: '1 Capsule daily after breakfast with water',
      packSize: '60 Capsules Bottle',
      inStock: true
    },
    {
      id: 'deal-prod-2',
      title: 'Nitrile Disposable gloves 100',
      brand: 'SafeGuard MedCare',
      category: 'Healthcare',
      rating: '★ (4.5)',
      discount: '15% Off',
      price: 449,
      originalPrice: 529,
      image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=300&auto=format&fit=crop&q=80',
      description: 'Medical-grade powder-free nitrile examination gloves offering superior puncture resistance, tactile sensitivity, and textured grip.',
      dosage: 'Single-use sterile protection',
      packSize: 'Pack of 100 Gloves (Size: Medium)',
      inStock: true
    },
    {
      id: 'deal-prod-3',
      title: 'Womens multi Vitamins A, Biotin- cranberry',
      brand: 'NutriLife Vitality',
      category: 'Medicine',
      rating: '★ (4.5)',
      discount: '50% Off',
      price: 449,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80',
      description: 'Specially formulated women multivitamin tablets enriched with Vitamin A, Biotin, Cranberry extract, folic acid, and iron.',
      dosage: '1 Tablet daily post lunch',
      packSize: '60 Sugar-Free Chewables',
      inStock: true
    },
    {
      id: 'deal-prod-4',
      title: 'Antibacterial Liquid Hand Soap',
      brand: 'PureHygiene Care',
      category: 'Wellness',
      rating: '★ (4.5)',
      discount: '25% Off',
      price: 199,
      originalPrice: 265,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      description: 'Dermatologist-tested antibacterial hand soap with aloe vera and moisturizing glycerin. Kills 99.9% germs while protecting skin barrier.',
      dosage: 'Apply to wet hands, lather for 20 seconds, rinse thoroughly',
      packSize: '500ml Pump Dispenser',
      inStock: true
    }
  ];

  const handleOpenLabTestModal = (test) => {
    setSelectedLabTest(test);
    setLabBookingStep('details');
  };

  const handleConfirmLabBooking = () => {
    const ref = `LBT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRefId(ref);
    setLabBookingStep('success');
    showToast(`✅ Diagnostic Test "${selectedLabTest.title}" confirmed! Ref: ${ref}`);
  };

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setProductQty(1);
  };

  const scrollToDestinationSection = (targetId, fallbackRoute, label) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('rv-highlight-pulse');
      setTimeout(() => {
        el.classList.remove('rv-highlight-pulse');
      }, 2500);
      if (label && showToast) {
        showToast(`Jumped to ${label}`);
      }
    } else if (fallbackRoute) {
      navigate(fallbackRoute);
    }
  };

  return (
    <div ref={pageRef} className="w-full bg-white text-[#16163B] font-sans selection:bg-[#242454] selection:text-white relative">
      
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
            <div className="text-white text-3xl font-extrabold tracking-tight mt-2">
              ClinicOS
            </div>
            <span className="text-xs text-slate-400 font-medium">Click anywhere to skip</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Matching Reference Frame 04 & 05)
          Exact Pixel-Perfect Hero Banner & Proportions
          ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEALTHCARE BANNER (Matching Reference Frame 04 & User Screenshot)
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEALTHCARE BANNER (Matching User Design Exactly)
          Exact "Healthcare" Dark Navy Banner with Center Doctor & Badges
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-8 pt-4 pb-2">
        <div className="rv-hero-enter relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl bg-[#161c3b] group">
          <img
            src="/images/hero-banner-exact.png"
            alt="Healthcare Banner"
            className="w-full h-auto block select-none"
          />

          {/* Interactive Clickable Hotspot for "Book Consultation" Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              confetti({ particleCount: 50, spread: 70, origin: { x: 0.88, y: 0.35 } });
              navigate('/book-appointment');
            }}
            title="Book Consultation"
            className="absolute bottom-[4.5%] right-[2.5%] w-[21%] h-[15%] rounded-full bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer border-none"
          />

          {/* Interactive Clickable Hotspots for Badges */}
          <button
            onClick={() => showToast('HbA1c monitoring and endocrinology consults active.')}
            title="Reduce HbA1c"
            className="absolute top-[48%] left-[21%] w-[18%] h-[10%] rounded-full bg-transparent hover:bg-white/10 transition-all cursor-pointer border-none"
          />
          <button
            onClick={() => showToast('Medication reduction & lifestyle management programs available.')}
            title="No more medications"
            className="absolute top-[48%] right-[20%] w-[21%] h-[10%] rounded-full bg-transparent hover:bg-white/10 transition-all cursor-pointer border-none"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 4 PASTEL SERVICE CARDS (Matching User Design Exactly)
          Soft Yellow, Mint, Soft Blush/Pink, and Pastel Blue
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-8 pb-6 pt-1">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Soft Yellow - Instant Video Consultation */}
          <div
            onClick={() => navigate('/video-call')}
            title="Instant Video Consultation"
            className={`rv-card rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-xs cursor-pointer${!cardsEntered ? ' rv-card-falling' : ''}`}
            style={!cardsEntered ? { animationDelay: '100ms' } : {}}
          >
            <img src="/images/card-video-exact.png" alt="Instant Video Consultation" className="w-full h-auto block pointer-events-none" />
          </div>

          {/* Card 2: Mint - Find Doctors near you */}
          <div
            onClick={() => scrollToDestinationSection('in-clinic-doctors-section', '/book-appointment', 'In-Clinic Doctors Roster')}
            title="Find Doctors near you"
            className={`rv-card rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-xs cursor-pointer${!cardsEntered ? ' rv-card-falling' : ''}`}
            style={!cardsEntered ? { animationDelay: '220ms' } : {}}
          >
            <img src="/images/card-doctors-exact.png" alt="Find Doctors near you" className="w-full h-auto block pointer-events-none" />
          </div>

          {/* Card 3: Pink - 24/7 Medicines */}
          <div
            onClick={() => scrollToDestinationSection('medicine-purchase-section', null, '24/7 Medicines & Daily Healthcare Deals')}
            title="24/7 Medicines"
            className={`rv-card rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-xs cursor-pointer${!cardsEntered ? ' rv-card-falling' : ''}`}
            style={!cardsEntered ? { animationDelay: '340ms' } : {}}
          >
            <img src="/images/card-medicines-exact.png" alt="24/7 Medicines" className="w-full h-auto block pointer-events-none" />
          </div>

          {/* Card 4: Pastel Blue - Lab Tests */}
          <div
            onClick={() => scrollToDestinationSection('lab-tests-section', '/lab-tests', 'Frequently Booked Diagnostic Lab Tests')}
            title="Lab Tests"
            className={`rv-card rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-xs cursor-pointer${!cardsEntered ? ' rv-card-falling' : ''}`}
            style={!cardsEntered ? { animationDelay: '460ms' } : {}}
          >
            <img src="/images/card-tests-exact.png" alt="Lab Tests" className="w-full h-auto block pointer-events-none" />
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. IN-CLINIC CONSULTATION & DOCTOR ROSTER (Frame 06 & 07)
          Matching Exact Typography, Pills, and Doctor Cards
          ───────────────────────────────────────────────────────────── */}
      <section id="in-clinic-doctors-section" className="w-full px-6 sm:px-10 pb-14 scroll-mt-24">
        
        {/* Exact Title Layout (Frame 06: Two lines, Bold Dark Indigo) */}
        <div className="mb-6 rv-title-reveal">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
            Book an appointment for an<br />in-clinic consultation
          </h2>
        </div>

        {/* Filter Pills with Emoji Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rv-pill px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'rv-pill-active bg-[#242454] text-white border-[#242454]'
                    : 'bg-[#F0F3FA] text-[#16163B] border-transparent hover:bg-[#E4E9F6]'
                }`}
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Doctor Cards Grid — At least 8 unique doctors with images per category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(carouselDoctors.length > 0 ? carouselDoctors : allDoctors.filter(d => d.category === activeCategory)).slice(0, 8).map((doc, idx) => (
            <div
              key={doc.id || idx}
              onClick={() => navigate('/book-appointment', { state: { doctor: doc, doctorId: doc.id, step: 2 } })}
              className="rv-doctor-card rv-reveal bg-white rounded-[28px] border border-slate-100 p-3 shadow-sm cursor-pointer flex flex-col transition-all hover:shadow-md"
              style={{ transitionDelay: `${(idx % 4) * 60}ms` }}
            >
              {/* Doctor Photo with Soft Grey Rounded Canvas */}
              <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-[#F1F4F8] flex items-end justify-center mb-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="rv-doctor-img w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/doctors/indian_doc_m1.jpg';
                  }}
                />
              </div>

              {/* Doctor Name & Specialty */}
              <div className="px-2 pb-2 flex flex-col flex-1">
                <h4 className="text-base font-extrabold text-[#16163B] m-0 font-['Poppins']">
                  {doc.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
                  {doc.specialty}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{doc.city}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Available: {doc.available}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mt-3 pt-2 border-t border-slate-100">
                  <span>⭐ {doc.rating} · {doc.exp}</span>
                  <span className="text-[#242454] font-bold">{doc.fee}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/book-appointment', { state: { doctor: doc, doctorId: doc.id, step: 2 } });
                  }}
                  className="mt-3 w-full rv-btn py-2 rounded-full bg-[#242454] text-white text-xs font-bold border-none cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Exact Sliding Progress Scrubber Bar (Frame 06 & 07) */}
        <div className="w-64 mx-auto mt-8 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#16163B] rounded-full transition-all duration-500 ease-out"
            style={{
              width: '33.33%',
              transform: `translateX(${Math.max(0, categories.findIndex(c => c.id === activeCategory)) * 38}%)`
            }}
          />
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FREQUENTLY BOOK LAB TESTS & DEALS (Frame 08, 09, 10, 11)
          Full-Width Deep Indigo Section (#16163B / #242454)
          ───────────────────────────────────────────────────────────── */}
      <section id="lab-tests-section" className="w-full px-6 sm:px-10 pb-14 scroll-mt-24">
        <div className="rounded-[36px] bg-[#16163B] text-white p-6 sm:p-10 shadow-2xl">
          
          {/* Top Lab Tests Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Diagnostic Lab Tests & Home Sample Pickup</span>
              </div>
              <h3 className="rv-title-reveal text-3xl font-extrabold text-white m-0 tracking-tight font-['Poppins']">
                Frequently Book<br />Lab Tests
              </h3>
            </div>
            <button
              onClick={() => navigate('/lab-tests')}
              className="rv-view-all rv-btn text-xs font-bold text-white tracking-wider flex items-center gap-2 bg-transparent border-none cursor-pointer uppercase hover:text-emerald-400 transition-colors self-start sm:self-auto"
            >
              <span>View All Lab Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Pastel Lab Test Cards (Frame 08 & 09) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1: Soft Peach (#FDEAE4) - Imaging tests */}
            <div
              onClick={() => handleOpenLabTestModal(labTestsList[0])}
              className="rv-lab-card rv-reveal rounded-[28px] bg-[#FDEAE4] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF7D66] text-white text-[11px] font-extrabold uppercase shadow-sm">
                    60%
                  </span>
                  <span className="text-[10px] font-extrabold text-[#16163B]/60 tracking-wider uppercase group-hover:text-[#16163B] transition-colors">
                    TAP TO BOOK ↗
                  </span>
                </div>
                <h4 className="text-xl font-bold m-0 font-['Poppins'] group-hover:text-rose-950 transition-colors">
                  Imaging<br />tests
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Imaging tests, such as X-rays, CT scans, and MRIs
                </p>
              </div>

              {/* Character Back Pain Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="30" r="14" fill="#FFC9BF" />
                  <path d="M42 44C30 50 35 85 45 90C55 95 70 85 70 65C70 45 55 42 42 44Z" fill="#F8B1A4" />
                  <path d="M48 68C58 68 62 76 56 82" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" />
                  <path d="M72 75L80 72M74 82L82 82" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">₹1,200</span>
                <span className="text-xs line-through text-slate-500 font-semibold">₹3,000</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full ml-1">Save ₹1,800</span>
              </div>
            </div>

            {/* Card 2: Soft Mint (#E5F7EE) - MRI & CT Scan */}
            <div
              onClick={() => handleOpenLabTestModal(labTestsList[1])}
              className="rv-lab-card rv-reveal rounded-[28px] bg-[#E5F7EE] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
              style={{ transitionDelay: '70ms' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#3FB985] text-white text-[11px] font-extrabold uppercase shadow-sm">
                    60%
                  </span>
                  <span className="text-[10px] font-extrabold text-[#16163B]/60 tracking-wider uppercase group-hover:text-[#16163B] transition-colors">
                    TAP TO BOOK ↗
                  </span>
                </div>
                <h4 className="text-xl font-bold m-0 font-['Poppins'] group-hover:text-emerald-950 transition-colors">
                  MRI &amp;<br />CT Scan
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Imaging tests, such as X-rays, CT scans, and MRIs
                </p>
              </div>

              {/* Character Headache Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="55" cy="35" r="14" fill="#FFC9BF" />
                  <path d="M40 35C40 25 55 18 68 25" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" />
                  <path d="M70 20L80 15M75 30L85 30" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
                  <path d="M45 48C35 55 40 85 55 88C68 90 75 75 75 60C75 48 58 45 45 48Z" fill="#F8B1A4" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">₹2,400</span>
                <span className="text-xs line-through text-slate-500 font-semibold">₹6,000</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full ml-1">Save ₹3,600</span>
              </div>
            </div>

            {/* Card 3: Soft Cream (#FDF8DC) - Orthopedists tests */}
            <div
              onClick={() => handleOpenLabTestModal(labTestsList[2])}
              className="rv-lab-card rv-reveal rounded-[28px] bg-[#FDF8DC] text-[#16163B] p-6 flex flex-col justify-between min-h-[260px] cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
              style={{ transitionDelay: '140ms' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#E5B537] text-white text-[11px] font-extrabold uppercase shadow-sm">
                    60%
                  </span>
                  <span className="text-[10px] font-extrabold text-[#16163B]/60 tracking-wider uppercase group-hover:text-[#16163B] transition-colors">
                    TAP TO BOOK ↗
                  </span>
                </div>
                <h4 className="text-xl font-bold m-0 font-['Poppins'] group-hover:text-amber-950 transition-colors">
                  Orthopedists<br />tests
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-2 max-w-[180px]">
                  Orthopedists can diagnose and treat various types of back and neck pain
                </p>
              </div>

              {/* Character Arm Cast Illustration (Frame 08) */}
              <div className="absolute right-4 bottom-4 w-28 h-28 opacity-90 pointer-events-none group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="30" r="14" fill="#FFC9BF" />
                  <path d="M40 44C30 50 35 85 45 90C55 95 70 85 70 65C70 45 55 42 40 44Z" fill="#F8B1A4" />
                  <path d="M40 65H65V80H40V65Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  <path d="M38 52L48 65L65 65" stroke="#475569" strokeWidth="3" />
                </svg>
              </div>

              <div className="flex items-baseline gap-2 mt-4 z-10">
                <span className="text-2xl font-extrabold text-[#16163B]">₹1,500</span>
                <span className="text-xs line-through text-slate-500 font-semibold">₹3,750</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full ml-1">Save ₹2,250</span>
              </div>
            </div>

          </div>

          {/* Bottom Deals & Medicine Purchase Sub-Section */}
          <div id="medicine-purchase-section" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-8 border-t border-white/10 scroll-mt-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                <span>24/7 Pharmacy & Daily Medicine Deals</span>
              </div>
              <h3 className="rv-title-reveal text-3xl font-extrabold text-white m-0 tracking-tight font-['Poppins']">
                Popular Medicines<br />& Healthcare Deals
              </h3>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate('/medicine-store')}
                className="px-6 py-2.5 rounded-full bg-[#E6007A] hover:bg-[#D4006E] active:scale-95 text-white font-bold text-sm border-none cursor-pointer transition-all shadow-md flex items-center gap-2 group"
              >
                <span>Full Medicine Store</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/medicine-store')}
                className="text-white hover:text-pink-300 font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 bg-transparent border-none cursor-pointer transition-colors group"
              >
                <span>SEE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Category Filter Chips for Medicines */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'All Deals', label: '🔥 All Deals (75+)' },
              { id: 'Pain & Fever', label: '🌡️ Pain & Fever' },
              { id: 'Acidity & Digestion', label: '💧 Acidity & Digestion' },
              { id: 'Heart & BP', label: '🫀 Heart & BP' },
              { id: 'Diabetes', label: '🍬 Diabetes Care' },
              { id: 'Vitamins & Immunity', label: '🍊 Vitamins & Immunity' },
              { id: 'Antibiotics', label: '💊 Antibiotics' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shrink-0 ${
                  activeMedCategory === cat.id
                    ? 'bg-[#E9DF70] text-[#16163B] border-[#E9DF70] shadow-sm font-extrabold'
                    : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dynamic Medicine Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEDICINE_CATALOG.filter(m => {
              if (activeMedCategory === 'All Deals') return true;
              if (activeMedCategory === 'Pain & Fever') return m.category.includes('Pain');
              if (activeMedCategory === 'Acidity & Digestion') return m.category.includes('Acidity');
              if (activeMedCategory === 'Heart & BP') return m.category.includes('Pressure');
              if (activeMedCategory === 'Diabetes') return m.category.includes('Diabetes');
              if (activeMedCategory === 'Vitamins & Immunity') return m.category.includes('Vitamins') || m.category.includes('Ayurveda');
              if (activeMedCategory === 'Antibiotics') return m.category.includes('Antibiotics');
              return true;
            }).slice(0, 8).map((med, idx) => (
              <div
                key={med.id}
                onClick={() => navigate('/medicine-store')}
                className="rv-lab-card rv-reveal rounded-[24px] bg-white text-[#16163B] p-4 flex flex-col justify-between shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {med.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E9DF70] text-[#16163B] text-[10px] font-extrabold">
                      {med.discount}
                    </span>
                  </div>

                  <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 relative overflow-hidden group-hover:scale-105 transition-transform">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="max-h-full object-contain mix-blend-multiply"
                    />
                    <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center gap-1">
                      <Truck className="w-2.5 h-2.5" /> 15-Min Delivery
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="truncate max-w-[130px] font-medium">{med.manufacturer}</span>
                    <span className="text-amber-500 font-bold shrink-0">★ ({med.rating})</span>
                  </div>

                  <h5 className="text-xs font-bold text-[#16163B] m-0 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {med.name}
                  </h5>

                  <p className="text-[10px] text-slate-400 font-medium mt-1 mb-0 line-clamp-1">
                    {med.genericName} • {med.packSize}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToPharmacyCart(med.id, 1);
                      showToast(`Added ${med.name} to cart!`);
                    }}
                    className="rv-add-btn px-3 py-1.5 rounded-full border border-slate-300 hover:border-[#16163B] hover:bg-[#16163B] hover:text-white text-[#16163B] font-bold text-xs cursor-pointer transition-all"
                  >
                    + Add to Cart
                  </button>
                  <div className="text-right">
                    <span className="text-xs line-through text-slate-400 mr-1">₹{med.mrp}</span>
                    <span className="text-sm font-extrabold text-[#16163B]">₹{med.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner leading to 50+ Medicine Store */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-purple-900/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9DF70] text-[#16163B] flex items-center justify-center shrink-0 font-bold">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold m-0">Need more medicine options or prescription refills?</h4>
                <p className="text-xs text-slate-300 font-medium m-0 mt-0.5">
                  Over 50+ authentic Indian medicines, antibiotics, cardiac & diabetic drugs with 15-minute express delivery.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/medicine-store')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#16163B] font-extrabold text-xs border-none cursor-pointer shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Explore All 70+ Medicines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4b. VACCINATION SECTION (Indian National Immunisation)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">

        <div className="flex items-start justify-between mb-8">
          <div className="rv-title-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5F7EE] text-[#1A7A4A] text-[11px] font-black uppercase tracking-wider mb-3">
              <Syringe className="w-3 h-3" />
              <span>Vaccination at Home</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16163B] m-0 tracking-tight font-['Poppins']">
              Protect your family<br />with timely vaccines
            </h2>
          </div>
          <button
            onClick={() => navigate('/vaccines')}
            className="rv-btn hidden sm:flex items-center gap-2 text-xs font-bold text-[#16163B] bg-transparent border-none cursor-pointer mt-2"
          >
            <span>View My Vaccine Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Vaccine Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* COVID-19 Booster */}
          <div
            onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: 'covid' } })}
            className="rv-reveal rv-doctor-card bg-[#EFF6FF] rounded-[28px] p-5 cursor-pointer relative overflow-hidden border border-[#DBEAFE] hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl">💉</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black mb-2">Booster Dose</div>
            <h4 className="text-base font-extrabold text-[#16163B] m-0 font-['Poppins']">COVID-19<br />Booster</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Covishield / Covaxin compatible</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Home visit in 2 hrs</span>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#16163B]">₹500</span>
              <span className="text-[10px] text-slate-400 font-semibold line-through">₹800</span>
            </div>
          </div>

          {/* Flu Vaccine */}
          <div
            onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: 'flu' } })}
            className="rv-reveal rv-doctor-card bg-[#FFF7ED] rounded-[28px] p-5 cursor-pointer relative overflow-hidden border border-[#FFEDD5] hover:shadow-xl hover:-translate-y-1 transition-all group"
            style={{ transitionDelay: '70ms' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl">🤧</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black mb-2">Seasonal</div>
            <h4 className="text-base font-extrabold text-[#16163B] m-0 font-['Poppins']">Influenza<br />(Flu) Vaccine</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Recommended yearly for adults</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Available now · Mumbai</span>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#16163B]">₹350</span>
              <span className="text-[10px] text-slate-400 font-semibold line-through">₹600</span>
            </div>
          </div>

          {/* Hepatitis B */}
          <div
            onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: 'hepb' } })}
            className="rv-reveal rv-doctor-card bg-[#F5F3FF] rounded-[28px] p-5 cursor-pointer relative overflow-hidden border border-[#EDE9FE] hover:shadow-xl hover:-translate-y-1 transition-all group"
            style={{ transitionDelay: '140ms' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black mb-2">3-Dose Series</div>
            <h4 className="text-base font-extrabold text-[#16163B] m-0 font-['Poppins']">Hepatitis B<br />Vaccine</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Full protection in 3 doses over 6 months</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Reminders included</span>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#16163B]">₹650</span>
              <span className="text-[10px] text-slate-400 font-semibold">per dose</span>
            </div>
          </div>

          {/* Baby Immunisation */}
          <div
            onClick={() => navigate('/vaccine-registration', { state: { selectedVaccineId: 'baby' } })}
            className="rv-reveal rv-doctor-card bg-[#F0FDF4] rounded-[28px] p-5 cursor-pointer relative overflow-hidden border border-[#DCFCE7] hover:shadow-xl hover:-translate-y-1 transition-all group"
            style={{ transitionDelay: '210ms' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl">👶</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black mb-2">NHP Free</div>
            <h4 className="text-base font-extrabold text-[#16163B] m-0 font-['Poppins']">Baby<br />Immunisation</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">BCG, OPV, DPT, Measles & more</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-600 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Govt. NHP — Free of cost</span>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-lg font-extrabold text-emerald-600">FREE</span>
              <span className="text-[10px] text-slate-400 font-semibold">National Programme</span>
            </div>
          </div>

        </div>

        {/* Vaccination Banner Strip */}
        <div className="rv-reveal rounded-[24px] bg-[#242454] text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Syringe className="w-6 h-6 text-[#E9DF70]" />
            </div>
            <div>
              <h4 className="text-base font-extrabold m-0 font-['Poppins']">View your Immunisation Passport</h4>
              <p className="text-xs text-slate-300 m-0 mt-0.5">All certificates, QR codes, and upcoming booster reminders in one place</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => navigate('/vaccine-registration')}
              className="rv-btn px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs border-none cursor-pointer transition-all shadow-md flex items-center gap-1.5"
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>Register for Vaccine</span>
            </button>
            <button
              onClick={() => navigate('/vaccines')}
              className="rv-btn px-5 py-2.5 rounded-full bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-extrabold text-xs border-none cursor-pointer transition-all shadow-md"
            >
              <span>Open Vaccine Card →</span>
            </button>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HEALTH PRIORITY ACTIVE VIDEO BANNER (Frame 12)
          "Your health is our Top priority ↗"
          Active Background Video Motion + Tap to Watch Video Modal
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-10 pb-14">
        <div
          onClick={() => setShowHeroVideoModal(true)}
          className="group relative rounded-[32px] sm:rounded-[36px] overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-center justify-center shadow-xl bg-[#0B1528] cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_rgba(233,223,112,0.22)]"
        >
          {/* Active Background Motion Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/runners-healthcare-banner.png"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.6] transition-transform duration-700 group-hover:scale-105"
          >
            <source src="/videos/healthcare-hero.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-athletes-running-on-the-track-40348-large.mp4" type="video/mp4" />
          </video>

          {/* Deep Navy/Teal Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/85 via-[#0a1a32]/50 to-[#071324]/85 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1d]/90 via-transparent to-[#060e1d]/30 pointer-events-none" />

          {/* Banner Foreground Content */}
          <div className="relative z-10 text-center px-4 sm:px-8 py-8 space-y-3 select-none">
            {/* Pill Badge: HEALTHCARE SOLUTIONS */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-black tracking-widest uppercase mb-2 shadow-lg transition-transform group-hover:scale-105 font-['Poppins']">
              <span className="w-2 h-2 rounded-full bg-[#E9DF70] animate-ping" />
              <span>HEALTHCARE SOLUTIONS</span>
            </div>

            {/* Headline: Your health is our Top priority ↗ */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white m-0 tracking-tight flex items-center justify-center flex-wrap gap-2.5 sm:gap-4 font-['Poppins'] drop-shadow-2xl">
              <span>Your health is our</span>
              <span className="text-[#E9DF70] font-black">Top priority</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHeroVideoModal(true);
                }}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#E9DF70] hover:bg-[#F5ED88] active:scale-95 text-[#16163B] flex items-center justify-center font-black text-xl sm:text-3xl shadow-xl transition-all cursor-pointer border-none transform group-hover:rotate-45 group-hover:scale-110 ml-1"
                title="Tap to Watch Video"
              >
                ↗
              </button>
            </h2>

            {/* Action Buttons Row */}
            <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
              <div className="relative inline-flex items-center justify-center group">
                {/* Sonar Ripple Pulse Ring Wave */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-[#E7B8D1]/60 pointer-events-none animate-pill-pulse-wave"
                />

                {/* Pulsing Ambient Glow Aura */}
                <div
                  className="absolute inset-0 rounded-full bg-[#E7B8D1]/40 blur-xl pointer-events-none transition-all duration-500 animate-pill-glow group-hover:blur-2xl group-hover:bg-[#E7B8D1]/70"
                />

                {/* Echo Layer 3: Center-Top Translucent Capsule */}
                <div
                  className="absolute inset-0 rounded-full bg-[#E7B8D1]/35 pointer-events-none transition-all duration-700 ease-out animate-echo-pill-center group-hover:-translate-y-4 group-hover:scale-105 group-hover:opacity-75"
                />

                {/* Echo Layer 1: Left Translucent Capsule */}
                <div
                  className="absolute inset-0 rounded-full bg-[#E7B8D1]/50 pointer-events-none transition-all duration-700 ease-out animate-echo-pill-left group-hover:scale-110 group-hover:-translate-x-10 group-hover:-translate-y-3 group-hover:opacity-90"
                />

                {/* Echo Layer 2: Right Translucent Capsule */}
                <div
                  className="absolute inset-0 rounded-full bg-[#E7B8D1]/45 pointer-events-none transition-all duration-700 ease-out animate-echo-pill-right group-hover:scale-110 group-hover:translate-x-10 group-hover:-translate-y-3 group-hover:opacity-90"
                />

                {/* Sparkling Twinkle Accents */}
                <span className="absolute -top-2.5 -left-3 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-1 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">
                  ✦
                </span>
                <span className="absolute -top-3 -right-2 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-2 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">
                  ✦
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confetti({ particleCount: 70, spread: 80 });
                    navigate('/book-appointment');
                  }}
                  className="relative z-10 inline-flex items-center gap-2 sm:gap-2.5 bg-[#E7B8D1] hover:bg-[#F2D2E4] active:scale-95 text-[#16163B] pl-2 sm:pl-2.5 pr-4 sm:pr-6 py-2 sm:py-2.5 rounded-full shadow-[0_10px_28px_-4px_rgba(231,184,209,0.65)] hover:shadow-[0_18px_40px_-4px_rgba(231,184,209,0.9)] transition-all duration-300 cursor-pointer border border-white/60 font-['Poppins'] overflow-hidden animate-main-pill-float hover:-translate-y-1 hover:scale-[1.02]"
                  title="Book Consultation"
                >
                  <div
                    className="absolute inset-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] pointer-events-none animate-pill-shimmer"
                  />
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#16163B]/12 group-hover:bg-[#16163B]/20 flex items-center justify-center text-[#16163B] transition-all duration-300 font-black text-xs sm:text-sm shadow-xs">
                    <span className="inline-block transition-transform duration-300 animate-arrow-nudge group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-[#16163B] tracking-tight whitespace-nowrap">
                    Book Consultation
                  </span>
                </button>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold border border-white/25 transition-all shadow-md group-hover:bg-[#E9DF70] group-hover:text-[#16163B] group-hover:border-[#E9DF70]">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tap to watch video</span>
              </div>
            </div>
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
          <div className="rv-bento-card rv-reveal md:col-span-6 rounded-[32px] bg-[#E9DF70] p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
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
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleVoicePodcast}
                  title={isPlayingPodcast ? "Pause Voice Podcast" : "Start Voice Podcast"}
                  className={`rv-play-btn w-12 h-12 rounded-full bg-white text-[#16163B] flex items-center justify-center shadow-md cursor-pointer border-none transition-all ${
                    isPlayingPodcast ? 'ring-4 ring-[#16163B]/20 scale-105' : 'hover:scale-105'
                  }`}
                >
                  {isPlayingPodcast ? (
                    <Pause className="w-5 h-5 fill-current text-[#16163B]" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[#16163B]" />
                  )}
                </button>

                {isPlayingPodcast && (
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/10 animate-fade-in">
                    <div className="flex items-center gap-1 h-5">
                      <span className="w-1 bg-[#16163B] rounded-full rv-sound-bar" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 bg-[#16163B] rounded-full rv-sound-bar" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 bg-[#16163B] rounded-full rv-sound-bar" style={{ animationDelay: '300ms' }} />
                      <span className="w-1 bg-[#16163B] rounded-full rv-sound-bar" style={{ animationDelay: '450ms' }} />
                      <span className="w-1 bg-[#16163B] rounded-full rv-sound-bar" style={{ animationDelay: '200ms' }} />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#16163B]">
                      {`0:${podcastSeconds < 10 ? '0' : ''}${podcastSeconds} / 0:42`}
                    </span>
                  </div>
                )}
              </div>

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
            <div className="rv-bento-card rv-reveal rounded-[32px] bg-[#233979] text-white p-6 shadow-lg flex flex-col justify-between flex-1 relative overflow-hidden" style={{ transitionDelay: '80ms' }}>
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
              <div className="rv-bento-card rv-reveal rounded-[28px] bg-[#A7DDC5] p-6 text-[#16163B] shadow-md relative overflow-hidden" style={{ transitionDelay: '100ms' }}>
                <div className="rv-stat-num text-4xl font-extrabold tracking-tight leading-none font-['Poppins']">
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
              <div className="rv-bento-card rv-reveal rounded-[28px] bg-[#E7B8D1] p-6 text-[#16163B] shadow-md relative overflow-hidden" style={{ transitionDelay: '160ms' }}>
                <div className="rv-stat-num text-4xl font-extrabold tracking-tight leading-none font-['Poppins']">
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
          <div className="rv-testimonial rv-reveal max-w-2xl mx-auto rounded-[32px] bg-white border border-slate-100 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-left">
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
          7. PATIENT HEALTH STATUS, SMARTWATCH STATS & MEDICINE SCHEDULING
          ───────────────────────────────────────────────────────────── */}
      <PatientHealthVitalsDashboard />

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
          
          <div className="rv-card rv-reveal rounded-[32px] bg-[#EBF7F2] p-6 flex flex-col justify-between shadow-sm">
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
                className="rv-btn px-4 py-2 rounded-full bg-white text-[#16163B] font-bold text-xs border-none cursor-pointer shadow-xs"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">5 min read</span>
            </div>
          </div>

          <div className="rv-card rv-reveal rounded-[32px] bg-[#F1F4F8] p-6 flex flex-col justify-between shadow-sm" style={{ transitionDelay: '80ms' }}>
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
                className="rv-btn px-4 py-2 rounded-full bg-white text-[#16163B] font-bold text-xs border-none cursor-pointer shadow-xs"
              >
                Book Consultation →
              </button>
              <span className="text-xs text-slate-400 font-semibold">4 min read</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. HEALTH INSURANCE PLANS & CASHLESS TPA COVERAGE
          Comprehensive Insurance Options, Pricing, Tiers & Instant Policy
          ───────────────────────────────────────────────────────────── */}
      <HealthInsurancePlansSection />

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5510] to-[#FF6E30] flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-orange-500/25 shrink-0">
                C
              </div>
              <span className="text-4xl sm:text-5xl font-black tracking-[-0.03em] leading-none text-white">
                ClinicOS
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-6 mt-6 border-t border-white/10 gap-2 font-medium">
            <span>© 2026 ClinicOS. All rights reserved.</span>
            <span>Desktop Experience Target: 1440px - 1920px</span>
          </div>

        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: LAB TEST BOOKING & DIAGNOSTIC DETAILS MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedLabTest && (
        <div className="fixed inset-0 z-[9999] bg-[#16163B]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div
            className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-6 sm:p-8 text-[#16163B] relative"
              style={{ backgroundColor: selectedLabTest.cardBg }}
            >
              <button
                onClick={() => setSelectedLabTest(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm cursor-pointer border-none transition-all hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-white text-[11px] font-extrabold uppercase shadow-sm"
                  style={{ backgroundColor: selectedLabTest.badgeColor }}
                >
                  {selectedLabTest.discount} OFF
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/80 text-[#16163B] text-[11px] font-bold">
                  NABL &amp; ISO 15189 Certified
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold m-0 font-['Poppins']">
                {selectedLabTest.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                {selectedLabTest.subtitle}
              </p>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-black text-[#16163B]">
                  ₹{selectedLabTest.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm line-through text-slate-500 font-semibold">
                  ₹{selectedLabTest.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full ml-1">
                  Save ₹{(selectedLabTest.originalPrice - selectedLabTest.price).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            {labBookingStep === 'details' ? (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Fasting & Report Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Turnaround Time</div>
                      <div className="text-xs font-extrabold text-slate-800">{selectedLabTest.reportTime}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Preparation Guide</div>
                      <div className="text-xs font-extrabold text-slate-800">{selectedLabTest.fasting}</div>
                    </div>
                  </div>
                </div>

                {/* Key Test Parameters */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                    What&apos;s Included in this Diagnostic Package
                  </h4>
                  <div className="space-y-2">
                    {selectedLabTest.parameters.map((param, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{param}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collection Method Picker */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                    Preferred Mode of Diagnostic
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCollectionType('home')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        collectionType === 'home'
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-black text-[#16163B] flex items-center gap-1.5">
                        <span>🏠 Home Collection</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 m-0">
                        Phlebotomist / Tech visits your doorstep in Mumbai
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionType('centre')}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        collectionType === 'centre'
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-black text-[#16163B] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Visit Scan Hub</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 m-0">
                        Priority queue token at Bandra Diagnostic Center
                      </p>
                    </button>
                  </div>
                </div>

                {/* Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Fasting)</option>
                      <option value="09:30 AM - 11:30 AM">09:30 AM - 11:30 AM (Morning)</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                      <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirmLabBooking}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#16163B] hover:bg-[#233979] text-white font-extrabold text-sm shadow-lg shadow-indigo-900/20 cursor-pointer border-none transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm &amp; Book Test (₹{selectedLabTest.price.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLabTest(null);
                      navigate('/lab-tests');
                    }}
                    className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-none transition-colors"
                  >
                    All 70+ Packages
                  </button>
                </div>

              </div>
            ) : (
              /* Success Confirmation Step */
              <div className="p-8 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Booking Confirmed
                  </span>
                  <h3 className="text-2xl font-black text-[#16163B] mt-2 font-['Poppins']">
                    Diagnostic Test Scheduled!
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Booking Reference ID: <strong className="text-slate-900 font-mono text-sm">{bookingRefId}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Test:</span>
                    <strong className="text-[#16163B]">{selectedLabTest.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Mode:</span>
                    <span className="font-bold text-indigo-700">
                      {collectionType === 'home' ? 'Doorstep Technician' : 'Visit Scan Hub'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Slot:</span>
                    <strong className="text-slate-800">{bookingDate} • {bookingSlot}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                    <span className="text-slate-600">Total Payable:</span>
                    <span className="text-emerald-700">₹{selectedLabTest.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setSelectedLabTest(null);
                      navigate('/lab-tests');
                    }}
                    className="py-3 px-6 rounded-2xl bg-[#16163B] hover:bg-[#233979] text-white font-extrabold text-xs cursor-pointer border-none transition-colors"
                  >
                    View in My Lab Tests
                  </button>
                  <button
                    onClick={() => setSelectedLabTest(null)}
                    className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-none transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: PHARMACY PRODUCT DETAIL & QUICK ORDER MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[9999] bg-[#16163B]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Image banner */}
            <div className="relative bg-slate-50 p-6 flex items-center justify-center border-b border-slate-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm cursor-pointer border-none transition-all hover:scale-105 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-[#E9DF70] text-[#16163B] text-[11px] font-black">
                {selectedProduct.discount}
              </span>

              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="h-48 max-w-xs object-contain mix-blend-multiply"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {selectedProduct.category}
                </span>
                <span className="text-amber-500 font-extrabold">{selectedProduct.rating} Verified Buyer Reviews</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#16163B] m-0 leading-snug font-['Poppins']">
                {selectedProduct.title}
              </h3>
              <p className="text-xs text-slate-400 font-bold m-0">By {selectedProduct.brand}</p>

              <p className="text-xs text-slate-600 font-medium leading-relaxed m-0">
                {selectedProduct.description}
              </p>

              {/* Dosage & Pack info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Packaging:</span>
                  <strong className="text-slate-800">{selectedProduct.packSize}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Directions:</span>
                  <span className="font-semibold text-slate-700">{selectedProduct.dosage}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                  <span>⚡ Express Delivery:</span>
                  <span>In Stock • Doorstep in 60 mins</span>
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#16163B]">
                      ₹{(selectedProduct.price * productQty).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs line-through text-slate-400">
                      ₹{(selectedProduct.originalPrice * productQty).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Save ₹{((selectedProduct.originalPrice - selectedProduct.price) * productQty).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Qty Selector */}
                <div className="flex items-center gap-2 border border-slate-200 rounded-full p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setProductQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer border-none font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-[#16163B] w-6 text-center">{productQty}</span>
                  <button
                    type="button"
                    onClick={() => setProductQty(q => q + 1)}
                    className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer border-none font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCartCount(prev => prev + productQty);
                    showToast(`🛒 Added ${productQty}x "${selectedProduct.title}" to cart!`);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#16163B] hover:bg-[#233979] text-white font-extrabold text-xs shadow-lg cursor-pointer border-none transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    showToast(`⚡ Order placed for "${selectedProduct.title}"! Express dispatch in 60 mins.`);
                    setSelectedProduct(null);
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer border-none transition-colors"
                >
                  Buy Now (COD / UPI)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: ALL DEALS & PHARMACY CATALOG MODAL
          ───────────────────────────────────────────────────────────── */}
      {showPharmacyCatalogModal && (
        <div className="fixed inset-0 z-[9999] bg-[#16163B]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div
            className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-[#16163B] text-white flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                  24/7 Online Pharmacy &amp; Wellness Store
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold m-0 mt-2 font-['Poppins']">
                  Today&apos;s Best Healthcare Deals
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  100% Genuine Certified Healthcare Products with Free 60-Min Express Delivery
                </p>
              </div>

              <button
                onClick={() => setShowPharmacyCatalogModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border-none transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MEDICINE_CATALOG.slice(0, 16).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setShowPharmacyCatalogModal(false);
                      navigate('/medicine-store');
                    }}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{prod.category}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#E9DF70] text-[#16163B] text-[10px] font-extrabold">
                          {prod.discount}
                        </span>
                      </div>
                      <div className="h-28 w-full bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <h5 className="text-xs font-bold text-[#16163B] m-0 line-clamp-2 mt-0.5 group-hover:text-blue-700 transition-colors">
                        {prod.name}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium m-0 mt-0.5 line-clamp-1">
                        {prod.genericName} • {prod.packSize}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] line-through text-slate-400 mr-1">₹{prod.mrp}</span>
                        <strong className="text-sm font-black text-[#16163B]">₹{prod.price}</strong>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToPharmacyCart(prod.id, 1);
                          showToast(`Added ${prod.name} to cart!`);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#16163B] hover:text-white text-slate-800 text-[11px] font-bold cursor-pointer border-none transition-all"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom footer button */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  Need prescription medications? Manage reminders and refills in your schedule.
                </div>
                <button
                  onClick={() => {
                    setShowPharmacyCatalogModal(false);
                    navigate('/my-meds');
                  }}
                  className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#16163B] font-bold text-xs cursor-pointer border-none transition-colors"
                >
                  Open My Medication Tracker ↗
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
