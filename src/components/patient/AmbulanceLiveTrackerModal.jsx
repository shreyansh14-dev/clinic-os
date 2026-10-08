import React, { useState, useEffect, useRef } from 'react';
import {
  Siren, Phone, MapPin, Navigation, Clock, CheckCircle2,
  X, AlertTriangle, ShieldAlert, Radio, Volume2, VolumeX,
  Compass, Crosshair, Sparkles, LocateFixed, Activity,
  ChevronRight, Car, User, HeartPulse, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AmbulanceLiveTrackerModal = ({ isOpen, onClose, defaultCity = 'Mumbai' }) => {
  const { activePatient, showToast } = useApp();

  // Location Detection State
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(
    activePatient?.address || 'Flat 402, Sunshine Heights, Bandra West, Mumbai'
  );
  const [userCoords, setUserCoords] = useState({ lat: 19.0596, lng: 72.8295 });
  const [accuracyMeters, setAccuracyMeters] = useState(12);

  // Live Transit & Tracking State
  const [isDispatched, setIsDispatched] = useState(true);
  const [progress, setProgress] = useState(38); // 0 to 100%
  const [distanceKm, setDistanceKm] = useState(2.4);
  const [etaMinutes, setEtaMinutes] = useState(6);
  const [speedKmh, setSpeedKmh] = useState(48);
  const [trafficStatus, setTrafficStatus] = useState('Green Corridor Active');
  const [sirenSoundActive, setSirenSoundActive] = useState(false);

  // Audio Context Ref for Web Audio Emergency Siren
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // City Landmark Coordinates Lookup
  const CITY_COORDINATES = {
    'Mumbai': { name: 'Bandra West, Linking Road, Mumbai', lat: 19.0596, lng: 72.8295 },
    'Delhi NCR': { name: 'Connaught Place, Outer Circle, New Delhi', lat: 28.6315, lng: 77.2167 },
    'Bengaluru': { name: '100 Feet Road, Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
    'Hyderabad': { name: 'Road No. 12, Banjara Hills, Hyderabad', lat: 17.4156, lng: 78.4357 },
    'Chennai': { name: 'Pondy Bazaar, T. Nagar, Chennai', lat: 13.0418, lng: 80.2341 },
    'Kolkata': { name: 'Park Street, Chowringhee, Kolkata', lat: 22.5535, lng: 88.3518 },
    'Pune': { name: 'North Main Road, Koregaon Park, Pune', lat: 18.5362, lng: 73.8940 },
    'Ahmedabad': { name: 'SG Highway, Bodakdev, Ahmedabad', lat: 23.0373, lng: 72.5120 },
    'Jaipur': { name: 'Bhagwan Das Road, C-Scheme, Jaipur', lat: 26.9124, lng: 75.7873 },
    'Lucknow': { name: 'Mahatma Gandhi Marg, Hazratganj, Lucknow', lat: 26.8467, lng: 80.9462 },
    'Chandigarh': { name: 'City Centre, Sector 17, Chandigarh', lat: 30.7398, lng: 76.7827 }
  };

  // Auto-detect location when modal opens
  useEffect(() => {
    if (isOpen) {
      detectCurrentLocation();
    }
  }, [isOpen, defaultCity]);

  // Real Geolocation Detection
  const detectCurrentLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setAccuracyMeters(Math.round(accuracy) || 15);
          setLocationDetected(true);
          setIsDetectingLocation(false);

          // Reverse geocoding attempt
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const shortAddr = data.display_name.split(',').slice(0, 4).join(', ');
                setCurrentAddress(shortAddr);
                showToast(`Location detected: ${shortAddr} (±${Math.round(accuracy)}m)`);
              }
            })
            .catch(() => {
              // Fallback to City Coordinates
              const cityData = CITY_COORDINATES[defaultCity] || CITY_COORDINATES['Mumbai'];
              setCurrentAddress(cityData.name);
              showToast(`GPS calibrated for ${defaultCity}!`);
            });
        },
        (err) => {
          setIsDetectingLocation(false);
          const cityData = CITY_COORDINATES[defaultCity] || CITY_COORDINATES['Mumbai'];
          setUserCoords({ lat: cityData.lat, lng: cityData.lng });
          setCurrentAddress(cityData.name);
          setLocationDetected(true);
          showToast(`Set to ${defaultCity} Emergency Zone (GPS permission bypassed)`);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsDetectingLocation(false);
      const cityData = CITY_COORDINATES[defaultCity] || CITY_COORDINATES['Mumbai'];
      setCurrentAddress(cityData.name);
      setLocationDetected(true);
    }
  };

  // Real-time Transit Simulation Timer
  useEffect(() => {
    if (!isOpen || !isDispatched) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          setDistanceKm(0.1);
          setEtaMinutes(1);
          setTrafficStatus('Arrived at Destination Gate');
          return 100;
        }
        const next = prev + 1.2;
        const remainingRatio = Math.max(0, (100 - next) / 100);
        const dist = (remainingRatio * 3.8).toFixed(1);
        const eta = Math.max(1, Math.ceil(remainingRatio * 9));
        setDistanceKm(parseFloat(dist));
        setEtaMinutes(eta);
        setSpeedKmh(Math.floor(46 + Math.random() * 12));
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen, isDispatched]);

  // Audio Siren Simulation
  const toggleSirenSound = () => {
    if (sirenSoundActive) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }
      setSirenSoundActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        gain.gain.value = 0.05; // Soft audible volume

        // Two-tone wail
        let isHigh = false;
        const sirenTimer = setInterval(() => {
          if (!oscRef.current) {
            clearInterval(sirenTimer);
            return;
          }
          osc.frequency.setValueAtTime(isHigh ? 780 : 960, ctx.currentTime);
          isHigh = !isHigh;
        }, 500);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setSirenSoundActive(true);
      } catch (e) {
        setSirenSoundActive(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, []);

  if (!isOpen) return null;

  // SVG Transit Path Calculations
  // Route from (x1: 70, y1: 220) to (x2: 430, y2: 80)
  const startX = 70;
  const startY = 220;
  const endX = 430;
  const endY = 80;

  // Interpolated ambulance position along a curve
  const t = Math.min(1, Math.max(0, progress / 100));
  // Quadratic bezier through control point (210, 80)
  const cpX = 220;
  const cpY = 240;
  const ambX = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * endX);
  const ambY = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * endY);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn font-sans">
      <div className="bg-[#0B1120] text-slate-100 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── TOP EMERGENCY STATUS HEADER ── */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-b border-red-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white m-0 tracking-tight font-['Poppins']">
                  108 Emergency Ambulance • Live GPS Radar
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
                ALS Mobile Trauma Unit • Direct Telemetry &amp; Route Telematics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Siren Audio Toggle */}
            <button
              onClick={toggleSirenSound}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                sirenSoundActive
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Siren Sound Simulation"
            >
              {sirenSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{sirenSoundActive ? 'Siren ON' : 'Siren Audio'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── LIVE GPS LOCATION DETECTION BAR ── */}
        <div className="px-5 py-3 bg-[#111A2E] border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Crosshair className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin text-emerald-300' : ''}`} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                Detected Patient Emergency Location
              </span>
              <div className="font-bold text-white text-xs truncate mt-0.5 flex items-center gap-1.5">
                <span className="truncate">{currentAddress}</span>
                <span className="px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-300 text-[9px] font-mono shrink-0">
                  ±{accuracyMeters}m GPS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={detectCurrentLocation}
              disabled={isDetectingLocation}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isDetectingLocation ? 'Calibrating...' : 'Re-Detect GPS'}</span>
            </button>
          </div>
        </div>

        {/* ── MAIN MAP & TRANSIT MONITOR AREA ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* TACTICAL MAP CONTAINER */}
          <div className="relative w-full h-64 sm:h-80 bg-[#070D18] rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
            
            {/* Tactical Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #38BDF8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Stylized Road Network & River Geometry */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
              <defs>
                {/* Neon Glow Filters */}
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Background Secondary City Roads */}
              <path d="M 0,90 L 500,90" stroke="#1E293B" strokeWidth="3" />
              <path d="M 0,210 L 500,210" stroke="#1E293B" strokeWidth="3" />
              <path d="M 140,0 L 140,300" stroke="#1E293B" strokeWidth="3" />
              <path d="M 360,0 L 360,300" stroke="#1E293B" strokeWidth="3" />
              <path d="M 0,160 Q 250,140 500,160" stroke="#0F172A" strokeWidth="6" />

              {/* Major Highway Corridors */}
              <path d="M 40,280 L 180,20 L 460,20" stroke="#1E2942" strokeWidth="6" strokeDasharray="6,4" />
              <path d="M 50,40 L 450,260" stroke="#172554" strokeWidth="5" opacity="0.6" />

              {/* Emergency Green Corridor Transit Route */}
              <path
                d="M 70,220 Q 220,240 430,80"
                stroke="url(#route-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                filter="url(#neon-glow)"
              />

              {/* Animated Dash Pulses moving along route */}
              <path
                d="M 70,220 Q 220,240 430,80"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="10,14"
                fill="none"
                className="animate-pulse opacity-80"
              />

              {/* HOSPITAL DISPATCH DEPOT (Base Marker) */}
              <g transform="translate(70, 220)">
                <circle r="14" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                <circle r="6" fill="#EF4444" />
                <text x="-40" y="28" fill="#94A3B8" fontSize="10" fontWeight="bold">Apollo Trauma Hub</text>
              </g>

              {/* PATIENT DESTINATION (Radar Pulsing Marker) */}
              <g transform="translate(430, 80)">
                {/* Radar Rings */}
                <circle r="24" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.4" className="animate-ping" />
                <circle r="16" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2" />
                <circle r="6" fill="#10B981" />
                <text x="-50" y="-18" fill="#34D399" fontSize="11" fontWeight="900">YOUR LOCATION</text>
                <text x="-40" y="-6" fill="#A7F3D0" fontSize="9" fontWeight="bold">ETA: {etaMinutes} Mins</text>
              </g>
            </svg>

            {/* LIVE MOVING AMBULANCE VEHICLE MARKER OVERLAY */}
            <div
              className="absolute transition-all duration-1000 ease-linear pointer-events-none"
              style={{
                left: `${(ambX / 500) * 100}%`,
                top: `${(ambY / 300) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Emergency Flashing Beacon */}
                <span className="absolute -inset-3 rounded-full bg-red-600/50 animate-ping" />
                <span className="absolute -inset-1.5 rounded-full bg-red-500/70 animate-pulse" />

                {/* 108 Ambulance Badge */}
                <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-2xl border-2 border-white">
                  <Car className="w-5 h-5 animate-bounce" />
                </div>

                {/* Overhead Vehicle Label */}
                <div className="absolute bottom-full mb-1 px-2 py-0.5 rounded-md bg-[#0F172A]/90 text-white border border-red-500/60 text-[9px] font-black whitespace-nowrap shadow-md">
                  108 ICU ({distanceKm} km away)
                </div>
              </div>
            </div>

            {/* Tactical Map HUD Overlays */}
            <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 text-[11px] space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-black">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>ROUTE ACTIVE • {trafficStatus}</span>
              </div>
              <div className="text-slate-300 text-[10px]">
                Speed: <strong className="text-white">{speedKmh} km/h</strong> • Siren: <strong className="text-red-400">108 ACTIVE</strong>
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-[#0F172A]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-black block">Estimated Arrival</span>
              <div className="text-xl font-black text-[#E9DF70] leading-none mt-0.5">
                {etaMinutes} <span className="text-xs text-white">MINS</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                {distanceKm} KM Remaining
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-slate-200">
                  {progress < 30 ? 'Dispatched from Trauma Base' :
                   progress < 70 ? 'Approaching Highway Flyover • Traffic Yielding' :
                   progress < 95 ? 'Turning onto Local Sector • 2 Turns Away' :
                   'Ambulance Arrived at Your Gate!'}
                </span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">
                {Math.round(progress)}% of Route
              </span>
            </div>
          </div>

          {/* ── TRANSIT ROUTE PROGRESS BAR ── */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Trauma Dispatch Progress
              </span>
              <span className="text-red-400 font-black">
                {distanceKm <= 0.2 ? 'ARRIVING NOW' : `${distanceKm} KM Away (ETA ${etaMinutes} mins)`}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
              <span>Apollo Hospital Base</span>
              <span>Central Flyover</span>
              <span>Your Sector</span>
              <span className="text-emerald-400 font-bold">Your Doorstep</span>
            </div>
          </div>

          {/* ── DRIVER, PARAMEDIC & ICU ROSTER CARD ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Driver & Paramedic Details */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-300 font-black text-lg">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-black text-white">Ramesh Shinde</strong>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">Driver</span>
                  </div>
                  <div className="text-xs text-slate-400">Paramedic: <strong>Sister Sunita Rao (ACLS)</strong></div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Vehicle: MH-02-AX-1080 (Force ALS)</div>
                </div>
              </div>

              <a
                href="tel:9870011080"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 border-none cursor-pointer transition-all no-underline shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver</span>
              </a>
            </div>

            {/* On-Board Medical Equipment Status */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                <span className="text-slate-400 font-bold">Mobile ICU Equipment</span>
                <span className="text-emerald-400 font-black text-[10px] uppercase">Level 1 Trauma Ready</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Ventilator</span>
                  <strong className="text-emerald-400 font-mono">Hamilton T1 (Active)</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Defibrillator</span>
                  <strong className="text-emerald-400 font-mono">Biphasic Ready</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Medical O2</span>
                  <strong className="text-emerald-400 font-mono">100% Full (Dual)</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Keep your registered phone line clear. Paramedics may call upon street entry.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast('Emergency SMS sent to emergency family contact: +91 98765 43210');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition-colors"
            >
              Notify Family Contacts
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 border-none cursor-pointer shadow-md transition-colors"
            >
              Keep Tracking in Background
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
