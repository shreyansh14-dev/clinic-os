import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import {
  Stethoscope, CalendarCheck, Users, FileText, CheckCircle2,
  Clock, Plus, Search, TestTube2, Calendar, Activity,
  ArrowRight, ShieldCheck, Video, VideoOff, Mic, MicOff,
  PhoneOff, PhoneCall, Send, Syringe, MapPin, Star,
  ChevronRight, IndianRupee, Sparkles, AlertCircle, Bed,
  Pill, Check, X, Eye, RefreshCw, MessageSquare, HeartPulse, User,
  Lock, FolderOpen, ClipboardCheck, AlertTriangle, Printer, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorConsole = () => {
  const {
    currentRole,
    setCurrentRole,
    activeDoctor,
    appointments,
    patients,
    prescriptions,
    labTests,
    beds,
    vitals,
    incomingCallAlert,
    activeCallSignal,
    updateAppointmentStatus,
    publishLabReport,
    updateBedStatus,
    createPrescription,
    showToast
  } = useApp();

  const [activeStepTab, setActiveStepTab] = useState(2); // Active step in the 8-step workflow
  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatientForEMR, setSelectedPatientForEMR] = useState(patients[0]?.id || null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Telehealth state & WebRTC Signaling
  const [callState, setCallState] = useState('idle'); // 'idle' | 'incoming' | 'calling' | 'connected'
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCaller, setActiveCaller] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [remoteStreamActive, setRemoteStreamActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Encrypted Telehealth Consultation Suite Initialized.', time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Treatment Plan & Notes state (Step 7)
  const [treatmentNotes, setTreatmentNotes] = useState({
    'pat-101': 'Patient undergoing PTCA recovery. Continue anti-platelets and ACE inhibitors. Repeat lipid profile at 4 weeks.',
    'pat-102': 'Bronchial asthma with seasonal exacerbation. Recommended Budesonide inhaler 200mcg BID. Keep peak flow log.',
    'pat-103': 'Type-2 Diabetes with mild neuropathy. Metformin dosage titrated. Advised strict carbohydrate counting.'
  });
  const [activeNoteText, setActiveNoteText] = useState('');
  const [selectedNotePatientId, setSelectedNotePatientId] = useState(patients[0]?.id || 'pat-101');

  // Inline prescription generator state (Step 6)
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxMeds, setRxMeds] = useState([
    { name: 'Paracetamol 650mg', dosage: '650 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
    { name: 'Amoxicillin + Clavulanate 625mg', dosage: '625 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Meals' }
  ]);
  const [rxAdvice, setRxAdvice] = useState('Drink plenty of fluids, complete prescribed antibiotic course, rest for 3 days.');
  const [rxFollowUp, setRxFollowUp] = useState('5 Days');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);

  // Synchronize Doctor Role on mount
  useEffect(() => {
    if (currentRole !== 'doctor') {
      setCurrentRole('doctor');
    }
  }, [currentRole, setCurrentRole]);

  // Audio Ringtone Chime synthesizer using Web Audio API
  const playRingtoneChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const t = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, t); // D5
      osc1.frequency.setValueAtTime(880, t + 0.16); // A5
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, t); // A4
      osc2.frequency.setValueAtTime(659.25, t + 0.16); // E5

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.75);
      osc2.stop(t + 0.75);
    } catch (e) {}
  };

  const startRingingChime = () => {
    playRingtoneChime();
    if (!ringtoneIntervalRef.current) {
      ringtoneIntervalRef.current = setInterval(playRingtoneChime, 1800);
    }
  };

  const stopRingingChime = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
  };

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // In-call duration timer
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  // Dual WebRTC Signaling (BroadcastChannel + Express REST Polling)
  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('clinic_telehealth_channel');

    broadcastChannelRef.current.onmessage = async (event) => {
      const { type, payload } = event.data;
      if (type === 'START_CALL') {
        setIncomingCall(payload);
        setActiveCaller(payload);
        setCallState('incoming');
        startRingingChime();
        showToast(`📞 INCOMING CALL: Patient ${payload.callerName} requesting video consultation!`, 'info');
      } else if (type === 'ICE_CANDIDATE' && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {}
      } else if (type === 'CALL_ENDED') {
        stopRingingChime();
        setIncomingCall(null);
        if (callState === 'connected' || callState === 'incoming') {
          showToast('Patient has ended the video consultation.');
        }
        endTelehealthCall(false);
      }
    };

    // Polling Express REST API for cross-device / different tab incoming calls
    const pollInterval = setInterval(async () => {
      if (callState === 'idle') {
        try {
          const res = await apiService.getActiveTelehealthCall();
          if (res?.activeCall?.status === 'calling') {
            setIncomingCall(res.activeCall);
            setActiveCaller(res.activeCall);
            setCallState('incoming');
            startRingingChime();
          }
        } catch (e) {}
      } else if (callState === 'incoming' || callState === 'connected') {
        try {
          const res = await apiService.getActiveTelehealthCall();
          if (!res?.activeCall) {
            stopRingingChime();
            setIncomingCall(null);
            endTelehealthCall(false);
          }
        } catch (e) {}
      }
    }, 1200);

    return () => {
      clearInterval(pollInterval);
      stopRingingChime();
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
    };
  }, [callState]);

  // Synchronize with global AppContext incoming call alert
  useEffect(() => {
    if (incomingCallAlert && callState === 'idle') {
      setIncomingCall(incomingCallAlert);
      setActiveCaller(incomingCallAlert);
      setCallState('incoming');
      startRingingChime();
    }
  }, [incomingCallAlert, callState]);

  // Accept incoming video call from patient
  const acceptIncomingCall = async (callDataToAccept) => {
    const callData = callDataToAccept || incomingCall || activeCaller;
    if (!callData) return;

    stopRingingChime();
    setIncomingCall(null);
    setActiveCaller(callData);
    setCallState('connected');
    setActiveStepTab(4); // Switch to Step 4: Examine Patient / Telehealth
    scrollToSection('doctor-telehealth-section');
    showToast(`Connecting video consultation with ${callData.callerName || 'Patient'}...`);

    try {
      // 1. Acquire Doctor's real media stream (webcam & microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(async () => {
        const videoOnly = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch(() => null);
        if (videoOnly) return videoOnly;
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#16163B';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#E9DF70';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(activeDoctor?.name || 'Dr. Souvik Sinha', 160, 230);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '16px sans-serif';
        ctx.fillText('Encrypted WebRTC Consultation Stream', 170, 265);
        return canvas.captureStream(30);
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      // Add doctor tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // Handle remote patient incoming track
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStreamActive(true);
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          apiService.addIceCandidate(event.candidate).catch(() => {});
          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'ICE_CANDIDATE',
              payload: { candidate: event.candidate }
            });
          }
        }
      };

      // 3. Process Remote Offer & Generate Answer
      if (callData.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const answerPayload = {
          answer: { type: answer.type, sdp: answer.sdp }
        };

        // Send Answer via backend API & broadcast channel
        await apiService.answerTelehealthCall(answerPayload);
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'CALL_ANSWERED',
            payload: answerPayload
          });
        }
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'System',
          text: `Encrypted WebRTC Video Consultation Connected with Patient ${callData.callerName || 'Patient'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      showToast(`Connected with ${callData.callerName || 'Patient'}! Two-way video active.`);
    } catch (err) {
      console.error('Error answering video call:', err);
      showToast('Could not initialize WebRTC video connection.', 'danger');
    }
  };

  // Decline incoming video call
  const declineIncomingCall = async () => {
    stopRingingChime();
    setIncomingCall(null);
    setCallState('idle');
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'CALL_ENDED' });
    }
    await apiService.hangupTelehealthCall().catch(() => {});
    showToast('Incoming patient video call declined.');
  };

  // End Telehealth Call
  const endTelehealthCall = async (notify = true) => {
    stopRingingChime();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setRemoteStreamActive(false);

    if (notify) {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'CALL_ENDED' });
      }
      await apiService.hangupTelehealthCall().catch(() => {});
    }

    setCallState('idle');
    setActiveCaller(null);
    setIncomingCall(null);
    showToast('Video consultation ended.');
  };

  // Doctor initiating call from queue or button
  const startTelehealthWithPatient = async (patientName, patientSymptoms) => {
    setActiveStepTab(4);
    scrollToSection('doctor-telehealth-section');
    const callerData = {
      callerName: patientName || 'Patient Shreyansh Kumar',
      symptoms: patientSymptoms || 'Chest tightness & routine follow-up'
    };
    setActiveCaller(callerData);
    setCallState('calling');
    showToast(`Initializing consultation room for ${callerData.callerName}...`);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(async () => {
        const vOnly = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch(() => null);
        if (vOnly) return vOnly;
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#16163B';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#E9DF70';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(activeDoctor?.name || 'Dr. Souvik Sinha', 160, 230);
        return canvas.captureStream(30);
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCallState('connected');
    } catch (err) {
      setCallState('connected');
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsVideoOn(track.enabled);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsAudioOn(track.enabled);
      }
    } else {
      setIsAudioOn(!isAudioOn);
    }
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: activeDoctor?.name || 'Dr. Souvik Sinha',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('rv-highlight-pulse');
      setTimeout(() => el.classList.remove('rv-highlight-pulse'), 2500);
    }
  };

  // Selected EMR Patient details
  const activeEMRPatient = patients.find(p => p.id === selectedPatientForEMR) || patients[0];
  const patientPrescriptions = prescriptions.filter(r => r.patientId === activeEMRPatient?.id);

  // Doctor KPI calculations
  const activeCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked-In' || a.status === 'In-Progress' || a.status === 'Scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const totalPatientsCount = patients.length;
  const sharedReportsCount = labTests.filter(l => l.status === 'Completed' || l.status === 'Sample Collected' || l.status === 'Pending').length;

  // Filtered appointments for Queue tab
  const filteredAppointments = (appointments || []).filter(apt => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesSearch = !searchFilter ||
      (apt.patientName && apt.patientName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (apt.reason && apt.reason.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (apt.type && apt.type.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Handle treatment note save (Step 7)
  const handleSaveTreatmentNote = () => {
    if (!activeNoteText.trim()) return;
    setTreatmentNotes(prev => ({
      ...prev,
      [selectedNotePatientId]: activeNoteText
    }));
    showToast(`Treatment plan & clinical notes updated for ${patients.find(p => p.id === selectedNotePatientId)?.name || 'Patient'}!`);
    setActiveNoteText('');
  };

  // Handle quick Rx submit (Step 6)
  const handleIssueQuickRx = (e) => {
    e.preventDefault();
    if (!rxDiagnosis.trim()) {
      showToast('Please enter clinical diagnosis for prescription.', 'warn');
      return;
    }
    const targetPatient = patients.find(p => p.id === selectedPatientForEMR) || patients[0];
    createPrescription({
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      doctorId: activeDoctor?.id || 'doc-1',
      doctorName: activeDoctor?.name || 'Dr. Souvik Sinha',
      diagnosis: rxDiagnosis,
      medications: rxMeds.filter(m => m.name.trim() !== ''),
      advice: rxAdvice,
      testsAdvised: ['Complete Blood Count (CBC)'],
      followUp: rxFollowUp
    });
    showToast(`Prescription digitally signed & dispatched to pharmacy for ${targetPatient.name}!`);
    setRxDiagnosis('');
  };

  // 8 Clinical Steps matching user flowchart
  const clinicalSteps = [
    { num: 1, label: 'Login', icon: Lock, color: '#3B82F6', targetId: 'doctor-hero-section', desc: 'Active Verified Session' },
    { num: 2, label: "View Today's Appointments", icon: Calendar, color: '#3B82F6', targetId: 'doctor-queue-section', desc: 'OPD Chamber Queue & Schedule' },
    { num: 3, label: 'Access Patient History', icon: FolderOpen, color: '#3B82F6', targetId: 'doctor-emr-section', desc: 'EMR Records & Medical History' },
    { num: 4, label: 'Examine Patient', icon: Stethoscope, color: '#3B82F6', targetId: 'doctor-telehealth-section', desc: 'Bedside & Video Teleconsultation' },
    { num: 5, label: 'Review / Approve Diagnostic Reports', icon: TestTube2, color: '#8B5CF6', targetId: 'doctor-labs-section', desc: 'Pathology Reports & Doctor Sign-Off' },
    { num: 6, label: 'Generate Prescription', icon: Pill, color: '#10B981', targetId: 'doctor-rx-section', desc: 'Digital Rx Pad & Formulary' },
    { num: 7, label: 'Update Treatment Plan & Notes', icon: ClipboardCheck, color: '#10B981', targetId: 'doctor-notes-section', desc: 'Progress Notes & Clinical Advice' },
    { num: 8, label: 'Complete Appointment', icon: CheckCircle2, color: '#10B981', targetId: 'doctor-completed-section', desc: 'Consultation Clearance & Follow-Up' }
  ];

  return (
    <div className="w-full bg-white text-[#16163B] font-['Poppins'] selection:bg-[#242454] selection:text-white relative space-y-6 pb-20">

      {/* ── Sticky Top Incoming Video Call Banner ─────────────────── */}
      {incomingCall && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-6 py-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse border border-emerald-400/50 mx-5 sm:mx-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-black shadow-sm shrink-0">
              <Video className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-md text-emerald-200">
                  Ringing Now
                </span>
                <strong className="text-sm font-extrabold text-white">
                  Incoming Patient Video Call: {incomingCall.callerName}
                </strong>
              </div>
              <span className="text-xs text-emerald-100 font-medium block mt-0.5">
                Chief Complaints: {incomingCall.symptoms || 'Video Consultation Request'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={declineIncomingCall}
              className="px-4 py-2 bg-black/25 hover:bg-black/40 text-white rounded-xl text-xs font-bold border-none cursor-pointer transition-all"
            >
              Decline
            </button>
            <button
              onClick={() => acceptIncomingCall(incomingCall)}
              className="px-5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-black border-none cursor-pointer shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Accept & Start Call</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO CLINICIAN BANNER (Designed like Patient Panel Hero)
          Deep-Indigo Background (#242454) + Doctor Workstation Theme
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-hero-section" className="w-full px-5 sm:px-8 pt-4">
        <div className="rv-hero-enter relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] p-7 md:p-10 text-white group">
          {/* Subtle Background Watermark Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
            <Stethoscope className="w-96 h-96" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={activeDoctor?.avatar || '/images/doctors/indian_doc_m1.jpg'}
                  alt={activeDoctor?.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-2 border-white/40 shadow-xl"
                />
                <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#16163B] absolute -bottom-1 -right-1 animate-pulse" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                    ONLINE &amp; CONSULTING
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-bold">
                    🕒 {currentTime}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E9DF70]/20 text-[#E9DF70] text-[11px] font-black border border-[#E9DF70]/30">
                    Room 104 · Apollo Healthcare
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white m-0">
                  {activeDoctor?.name || 'Dr. Souvik Sinha, MD'}
                </h1>

                <p className="text-xs sm:text-sm text-[#E9DF70] font-bold m-0 mt-1">
                  {activeDoctor?.specialty || 'Senior Consultant Cardiologist'} · Reg. No: NMC-984321-MH
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <strong>{activeCount} Patients Today</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <TestTube2 className="w-3.5 h-3.5 text-purple-400" />
                    <strong>{sharedReportsCount} Lab Sign-Offs</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <strong>{completedCount} Completed</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Kinetic Pink Pill Button (Matching Patient Panel Style) */}
            <div className="group self-end lg:self-auto">
              <div className="relative inline-flex items-center justify-center">
                {/* Sonar Ripple Pulse Ring Wave */}
                <div className="absolute inset-0 rounded-full border-2 border-[#E7B8D1]/60 pointer-events-none animate-pill-pulse-wave" />
                {/* Ambient Glow Aura */}
                <div className="absolute inset-0 rounded-full bg-[#E7B8D1]/40 blur-xl pointer-events-none transition-all duration-500 animate-pill-glow group-hover:blur-2xl group-hover:bg-[#E7B8D1]/70" />

                {/* Sparkling Twinkle Accents */}
                <span className="absolute -top-2.5 -left-3 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-1 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">✦</span>
                <span className="absolute -top-3 -right-2 text-[#FFDE7D] text-xs pointer-events-none select-none animate-star-twinkle-2 drop-shadow-[0_0_8px_rgba(255,222,125,0.85)]">✦</span>

                {/* Foreground Pill Button */}
                <button
                  onClick={() => {
                    confetti({ particleCount: 60, spread: 70, origin: { x: 0.85, y: 0.3 } });
                    setActiveStepTab(2);
                    scrollToSection('doctor-queue-section');
                  }}
                  className="relative z-10 inline-flex items-center gap-2 sm:gap-2.5 bg-[#E7B8D1] hover:bg-[#F2D2E4] active:scale-95 text-[#16163B] pl-2 sm:pl-2.5 pr-4 sm:pr-6 py-2 sm:py-2.5 rounded-full shadow-[0_10px_28px_-4px_rgba(231,184,209,0.65)] hover:shadow-[0_18px_40px_-4px_rgba(231,184,209,0.9)] transition-all duration-300 cursor-pointer border border-white/60 font-['Poppins'] overflow-hidden animate-main-pill-float hover:-translate-y-1 hover:scale-[1.02]"
                  title="Start Consultation Queue"
                >
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#16163B]/12 group-hover:bg-[#16163B]/20 flex items-center justify-center text-[#16163B] font-black text-xs sm:text-base">
                    →
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-[#16163B] tracking-tight whitespace-nowrap">
                    Start Consultation Queue
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 4 PASTEL CLINICAL ACTION CARDS (Matching Patient Panel)
          Soft Yellow, Mint, Soft Blush/Pink, and Pastel Blue
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Card 1: Soft Yellow - View Today's Appointments (Step 2) */}
          <div
            onClick={() => {
              setActiveStepTab(2);
              scrollToSection('doctor-queue-section');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#FEF9C3] hover:bg-[#FEF08A] border border-[#FDE047] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#EAB308] text-white flex items-center justify-center shadow-xs">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-full">
                Step 2 · Queue
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Today's Appointments</h3>
              <p className="text-xs text-amber-950 font-semibold m-0 mt-1">
                {activeCount} scheduled patients waiting in OPD chamber queue
              </p>
            </div>
            <div className="text-xs font-black text-amber-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Queue</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Mint - Examine Patient & Live Video (Step 4) */}
          <div
            onClick={() => {
              setActiveStepTab(4);
              scrollToSection('doctor-telehealth-section');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-full">
                Step 4 · Telehealth
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Examine Patient</h3>
              <p className="text-xs text-emerald-950 font-semibold m-0 mt-1">
                Live WebRTC encrypted video consult with real-time audio
              </p>
            </div>
            <div className="text-xs font-black text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Video Room</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Pink - Generate Digital Prescription (Step 6) */}
          <div
            onClick={() => {
              setActiveStepTab(6);
              scrollToSection('doctor-rx-section');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#FCE7F3] hover:bg-[#FBCFE8] border border-[#F472B6] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#DB2777] text-white flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-pink-200/80 text-pink-900 px-2.5 py-1 rounded-full">
                Step 6 · Rx
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Generate Prescription</h3>
              <p className="text-xs text-pink-950 font-semibold m-0 mt-1">
                Digital Rx with dosages, formulary drug picker &amp; pharmacy sync
              </p>
            </div>
            <div className="text-xs font-black text-pink-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Write Digital Rx</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Pastel Blue - Review Diagnostic Reports (Step 5) */}
          <div
            onClick={() => {
              setActiveStepTab(5);
              scrollToSection('doctor-labs-section');
            }}
            className="rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#7DD3FC] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
                <TestTube2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200/80 text-sky-900 px-2.5 py-1 rounded-full">
                Step 5 · Labs
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Approve Lab Reports</h3>
              <p className="text-xs text-sky-950 font-semibold m-0 mt-1">
                {sharedReportsCount} pathology &amp; radiology panels awaiting certification
              </p>
            </div>
            <div className="text-xs font-black text-sky-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Review &amp; Sign</span>
              <span>→</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE 8-STEP CLINICAL WORKFLOW FLOWCHART
          Matching User's Diagram (1: Login -> 2: Appointments -> 3: History ->
          4: Examine -> 5: Labs -> 6: Rx -> 7: Treatment -> 8: Complete)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-8">
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                  Standard Clinical Protocol
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">
                  Doctor End-to-End Clinical Journey
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold m-0 mt-0.5">
                Click any step below to jump directly to that clinical procedure
              </p>
            </div>

            <span className="text-xs font-bold text-slate-400">
              8 Standardized Steps Active
            </span>
          </div>

          {/* Flowchart Row 1: Steps 1 -> 2 -> 3 -> 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {clinicalSteps.slice(0, 4).map((s) => {
              const Icon = s.icon;
              const isActive = activeStepTab === s.num;

              return (
                <div
                  key={s.num}
                  onClick={() => {
                    setActiveStepTab(s.num);
                    scrollToSection(s.targetId);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-400/40'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      {s.num}
                    </span>
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 m-0">{s.label}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold m-0 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Connecting Flow Indicator */}
          <div className="flex items-center justify-center gap-2 py-1 text-slate-400 text-xs font-black">
            <span>↓ Diagnostic Review &amp; Rx Generation Phase ↓</span>
          </div>

          {/* Flowchart Row 2: Steps 5 -> 6 -> 7 -> 8 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {clinicalSteps.slice(4, 8).map((s) => {
              const Icon = s.icon;
              const isActive = activeStepTab === s.num;
              const isPurple = s.num === 5;
              const accentColor = isPurple ? 'purple' : 'emerald';

              return (
                <div
                  key={s.num}
                  onClick={() => {
                    setActiveStepTab(s.num);
                    scrollToSection(s.targetId);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isActive
                      ? isPurple
                        ? 'bg-purple-50/90 border-purple-500 shadow-md ring-2 ring-purple-400/40'
                        : 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow-xs ${
                      isPurple ? 'bg-purple-600' : 'bg-emerald-600'
                    }`}>
                      {s.num}
                    </span>
                    <Icon className={`w-5 h-5 ${isPurple ? 'text-purple-600' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 m-0">{s.label}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold m-0 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: STEP 2 - VIEW TODAY'S APPOINTMENTS & QUEUE
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-queue-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Step 2 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Today's Appointments &amp; Live Queue</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter patient, symptoms..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                {['All', 'Scheduled', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold border-none cursor-pointer text-xs transition-all ${
                      statusFilter === st ? 'bg-[#16163B] text-white' : 'bg-transparent text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                  <th className="pb-3 pl-2">Token</th>
                  <th className="pb-3">Patient Details</th>
                  <th className="pb-3">Chief Complaint</th>
                  <th className="pb-3">Slot Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredAppointments.map((apt, idx) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 pl-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black flex items-center justify-center text-xs">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <strong className="text-slate-900 block font-black">{apt.patientName}</strong>
                      <span className="text-[10px] text-slate-400">ID: {apt.patientId || apt.id}</span>
                    </td>
                    <td className="py-3.5 text-slate-700">{apt.reason || 'General Routine Review'}</td>
                    <td className="py-3.5 text-slate-500">{apt.date} · {apt.time}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startTelehealthWithPatient(apt.patientName, apt.reason)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 cursor-pointer flex items-center gap-1"
                          title="Call for video consultation"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video</span>
                        </button>

                        <button
                          onClick={() => {
                            const pat = patients.find(p => p.name === apt.patientName) || patients[0];
                            setSelectedPatientForRx(pat);
                          }}
                          className="px-2.5 py-1.5 bg-[#16163B] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#E9DF70]" />
                          <span>Rx</span>
                        </button>

                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, 'Completed');
                              showToast(`Consultation for ${apt.patientName} marked completed!`);
                            }}
                            className="px-2 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl border-none cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: STEP 3 - ACCESS PATIENT HISTORY & EMR
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-emr-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Step 3 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Access Patient History &amp; Longitudinal EMR</h3>
              </div>
            </div>

            <select
              value={selectedPatientForEMR}
              onChange={(e) => setSelectedPatientForEMR(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) · {p.age} Yrs</option>
              ))}
            </select>
          </div>

          {activeEMRPatient && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Demographics Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#16163B] text-[#E9DF70] text-xl font-black flex items-center justify-center">
                    {activeEMRPatient.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 m-0">{activeEMRPatient.name}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold">{activeEMRPatient.gender}, {activeEMRPatient.age} Yrs</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600 font-semibold pt-2 border-t border-slate-200">
                  <div>Blood Group: <strong className="text-rose-600">{activeEMRPatient.bloodGroup}</strong></div>
                  <div>Phone: {activeEMRPatient.phone}</div>
                  <div>ABHA: {activeEMRPatient.insuranceId || 'ABHA-99214-MH'}</div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                    Known Medical Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeEMRPatient.medicalHistory?.map((h, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 m-0">Recent Vitals Inspection</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-[9px] font-bold text-blue-700 block">Blood Pressure</span>
                    <strong className="text-base font-black text-slate-900">122/80</strong>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-[9px] font-bold text-rose-700 block">Heart Rate</span>
                    <strong className="text-base font-black text-slate-900">74 bpm</strong>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[9px] font-bold text-emerald-700 block">SpO2 Oxygen</span>
                    <strong className="text-base font-black text-slate-900">99%</strong>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-[9px] font-bold text-amber-700 block">Fasting Blood Sugar</span>
                    <strong className="text-base font-black text-slate-900">98 mg/dL</strong>
                  </div>
                </div>
              </div>

              {/* Past Prescriptions */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 overflow-y-auto max-h-56">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 m-0">Past Clinical Notes &amp; Rx</h4>
                {patientPrescriptions.length === 0 ? (
                  <p className="text-xs text-slate-400">No prior prescriptions recorded.</p>
                ) : (
                  patientPrescriptions.map(p => (
                    <div key={p.id} className="p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
                      <div className="font-extrabold text-slate-900">{p.diagnosis}</div>
                      <span className="text-[10px] text-slate-400">{p.date || 'Recent Visit'} · {p.doctorName}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: STEP 4 - EXAMINE PATIENT & LIVE TELEHEALTH VIDEO SUITE
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-telehealth-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Step 4 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Examine Patient &amp; Live Telehealth Suite</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {callState !== 'idle' ? (
                <button
                  onClick={endTelehealthCall}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Consultation</span>
                </button>
              ) : (
                <button
                  onClick={() => startTelehealthWithPatient(patients[0]?.name)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Video Examination Room</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Video Feeds (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-xl flex items-center justify-center">
                {/* Remote Patient Stream */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${!remoteStreamActive ? 'hidden' : ''}`}
                />

                {!remoteStreamActive && (
                  <div className="flex flex-col items-center justify-center text-slate-300 gap-3 p-6 text-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#242454] to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white m-0">
                        {activeCaller?.callerName || 'Patient Consultation Chamber'}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold m-0 mt-1 max-w-sm">
                        {callState === 'connected'
                          ? 'Encrypted WebRTC connection active. Receiving camera feed...'
                          : 'Ready to receive patient call or initiate consultation.'}
                      </p>
                    </div>
                    {callState === 'connected' && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                        ● Live Peer Connection Synced
                      </span>
                    )}
                  </div>
                )}

                {/* Floating Doctor PiP Camera */}
                <div className="absolute top-4 right-4 w-36 h-28 md:w-44 md:h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/40 shadow-2xl flex items-center justify-center z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                  />
                  {!isVideoOn && (
                    <div className="text-slate-400 text-xs font-bold text-center">
                      <VideoOff className="w-5 h-5 mx-auto mb-1 opacity-60" />
                      Muted
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    You ({activeDoctor?.name?.split(' ')[1] || 'Doctor'})
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20 shadow-2xl z-20">
                  <button
                    onClick={toggleVideo}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors ${
                      isVideoOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleAudio}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors ${
                      isAudioOn ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setActiveStepTab(6);
                      scrollToSection('doctor-rx-section');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-black text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe</span>
                  </button>

                  {callState !== 'idle' && (
                    <button
                      onClick={() => endTelehealthCall(true)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs border-none cursor-pointer"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* In-Call Consultation Chat & Clinical Notes */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 flex flex-col justify-between h-[380px]">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#242454]" />
                  <h4 className="text-xs font-black text-slate-900 m-0">In-Consultation Chat &amp; Log</h4>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[240px] pr-1">
                  {messages.map((m, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                        <span>{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="m-0 font-semibold text-slate-800">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={sendChatMessage} className="flex gap-2 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Type advice or message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#16163B] text-white rounded-xl border-none cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: STEP 5 - REVIEW / APPROVE DIAGNOSTIC REPORTS
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-labs-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black">
                <TestTube2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Step 5 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Review / Approve Diagnostic Reports</h3>
              </div>
            </div>

            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
              {labTests.length} Total Diagnostic Panels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labTests.map(test => {
              const isApproved = test.status === 'Approved' || test.status === 'Completed';

              return (
                <div key={test.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 m-0">{test.testName || test.name}</h4>
                      <span className="text-[11px] text-slate-500 font-semibold">Patient: {test.patientName} · Sample ID: {test.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {test.status || 'Pending Sign-Off'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                    <div>Specimen: Venous Blood · Automated Analyzer</div>
                    <div className="text-slate-900 font-bold mt-1">Status: Hemoglobin 14.2 g/dL · Normal WBC count</div>
                  </div>

                  <div className="flex justify-end pt-1">
                    {!isApproved ? (
                      <button
                        onClick={() => {
                          publishLabReport(test.id, { verifiedBy: activeDoctor?.name || 'Dr. Souvik Sinha' });
                          showToast(`Lab report for ${test.testName} approved and digitally certified!`);
                        }}
                        className="px-3.5 py-1.5 bg-[#16163B] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[#E9DF70]" />
                        <span>Approve &amp; Sign-Off</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certified by Doctor</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: STEP 6 - GENERATE PRESCRIPTION (Rx)
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-rx-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Step 6 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Generate Digital Prescription (Rx)</h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatientForRx(patients[0])}
              className="px-4 py-2 bg-[#16163B] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
              <span>Full Prescription Pad Modal</span>
            </button>
          </div>

          <form onSubmit={handleIssueQuickRx} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Diagnosis &amp; Clinical Findings *</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bronchitis / Essential Hypertension"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Follow-Up Review</label>
                <select
                  value={rxFollowUp}
                  onChange={(e) => setRxFollowUp(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="3 Days">3 Days</option>
                  <option value="5 Days">5 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                </select>
              </div>
            </div>

            {/* Medications Rows */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 block">Medications:</span>
              {rxMeds.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => {
                      const updated = [...rxMeds];
                      updated[idx].name = e.target.value;
                      setRxMeds(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={m.frequency}
                    onChange={(e) => {
                      const updated = [...rxMeds];
                      updated[idx].frequency = e.target.value;
                      setRxMeds(updated);
                    }}
                    className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center font-bold"
                  />
                  <input
                    type="text"
                    value={m.duration}
                    onChange={(e) => {
                      const updated = [...rxMeds];
                      updated[idx].duration = e.target.value;
                      setRxMeds(updated);
                    }}
                    className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center"
                  />
                  <span className="text-purple-700 font-bold text-[11px]">{m.instructions}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-500">
                Directly synchronized with Hospital Pharmacy Inventory
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#16163B] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E9DF70]" />
                <span>Sign &amp; Dispatch Prescription</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: STEP 7 - UPDATE TREATMENT PLAN & NOTES
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-notes-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Step 7 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Update Treatment Plan &amp; Clinical Progress Notes</h3>
              </div>
            </div>

            <select
              value={selectedNotePatientId}
              onChange={(e) => setSelectedNotePatientId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 block">Current Treatment Plan On File:</label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-semibold">
                {treatmentNotes[selectedNotePatientId] || 'No treatment plan logged yet. Add updated plan notes below.'}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 block">Record New Progress Notes / Plan Update:</label>
              <textarea
                rows={3}
                placeholder="Enter clinical observations, medication adjustments, dietary instructions..."
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTreatmentNote}
                  className="px-4 py-2 bg-[#16163B] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#E9DF70]" />
                  <span>Save Plan Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: STEP 8 - COMPLETE APPOINTMENT & CLEARANCE
          ───────────────────────────────────────────────────────────── */}
      <section id="doctor-completed-section" className="w-full px-5 sm:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Step 8 of 8</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">Complete Appointment &amp; Consultation Log</h3>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              {completedCount} Completed Consultations Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {appointments.filter(a => a.status === 'Completed').map(apt => (
              <div key={apt.id} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-900 font-black">{apt.patientName}</strong>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[9px] font-black">
                    Completed
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-semibold">{apt.reason || 'General Health Consultation'}</div>
                <div className="text-[10px] text-slate-400">Time: {apt.date} · {apt.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prescription Generator Modal ─────────────────────────────── */}
      {selectedPatientForRx && (
        <CreatePrescriptionModal
          patient={selectedPatientForRx}
          onClose={() => setSelectedPatientForRx(null)}
        />
      )}

      {/* ── Prominent Incoming Patient Video Call Modal ─────────────────────────────── */}
      {incomingCall && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] p-7 sm:p-8 max-w-md w-full shadow-2xl border-2 border-emerald-500/40 text-center relative overflow-hidden">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg relative z-10">
                <Video className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              ● Live Incoming Video Call
            </span>

            <h3 className="text-xl font-black text-slate-900 m-0">
              {incomingCall.callerName || 'Patient Consultation Request'}
            </h3>
            
            <p className="text-xs text-slate-500 font-semibold m-0 mt-1">
              Patient ID: <strong>{incomingCall.callerId || 'PT-101'}</strong>
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Chief Complaints / Symptoms:
              </span>
              <p className="text-xs font-bold text-slate-800 m-0">
                {incomingCall.symptoms || 'General medical review & cardiovascular consultation.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={declineIncomingCall}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-extrabold text-xs border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                onClick={() => acceptIncomingCall(incomingCall)}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Video className="w-4 h-4 animate-pulse" />
                <span>Accept &amp; Join</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorConsole;
