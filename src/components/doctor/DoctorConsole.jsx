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
  Pill, Check, X, Eye, RefreshCw, MessageSquare, HeartPulse, User
} from 'lucide-react';

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
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'telehealth' | 'emr' | 'labs' | 'ipd' | 'prescriptions'
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
    setActiveTab('telehealth');
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
    setActiveTab('telehealth');
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

  // Selected EMR Patient details
  const activeEMRPatient = patients.find(p => p.id === selectedPatientForEMR) || patients[0];
  const patientPrescriptions = prescriptions.filter(r => r.patientId === activeEMRPatient?.id);
  const patientVitals = vitals.filter(v => v.patientId === activeEMRPatient?.id);

  // Doctor KPI calculations
  const activeCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked-In' || a.status === 'In-Progress').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const totalPatientsCount = patients.length;
  const sharedReportsCount = labTests.filter(l => l.status === 'Completed' || l.status === 'Sample Collected').length;
  const occupiedBedsCount = beds.filter(b => b.status === 'Occupied').length;
  const earningsToday = '₹18,500';

  // Filtered appointments for Queue tab
  const filteredAppointments = (appointments || []).filter(apt => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesSearch = !searchFilter ||
      (apt.patientName && apt.patientName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (apt.type && apt.type.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 pb-20 font-['Poppins']">

      {/* ── Sticky Top Incoming Video Call Banner ─────────────────── */}
      {incomingCall && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-6 py-3.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse border border-emerald-400/50">
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

      {/* ── Doctor Hero Bar ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#16163B] via-[#242454] to-[#1a1a5e] p-7 md:p-8 text-white shadow-2xl doc-anim-enter">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-5 pointer-events-none flex items-center justify-center">
          <Stethoscope className="w-72 h-72" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={activeDoctor?.avatar || '/images/doctors/indian_doc_m1.jpg'}
                alt={activeDoctor?.name}
                className="w-18 h-18 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-xl"
              />
              <span className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#16163B] absolute -bottom-1 -right-1 doc-pulse-online" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  ONLINE & CONSULTING
                </span>
                <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                  🕒 {currentTime}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white m-0">
                {activeDoctor?.name || 'Dr. Souvik Sinha'}
              </h2>
              <p className="text-xs md:text-sm text-[#E9DF70] font-bold m-0 mt-0.5">
                {activeDoctor?.specialty || 'Senior Consultant Cardiologist'} · OPD Chamber 104
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>Apollo Hospital, Mumbai · ClinicOS Smart Healthcare Network</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedPatientForRx(patients[0])}
              className="bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-black text-xs px-4 py-3 rounded-2xl shadow-md flex items-center gap-2 border-none cursor-pointer transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Issue New Prescription</span>
            </button>
            <button
              onClick={() => startTelehealthWithPatient(patients[0]?.name)}
              className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Video className="w-4 h-4 text-[#A7DDC5]" />
              <span>Quick Telehealth</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5 Metric KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 doc-anim-enter">
        <div className="bg-[#FFF7ED] border border-amber-200/80 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">Queue Today</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeCount}</div>
          <span className="text-[11px] font-bold text-amber-700">{completedCount} completed</span>
        </div>

        <div className="bg-[#EFF6FF] border border-blue-200/80 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800">My Patients</span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPatientsCount}</div>
          <span className="text-[11px] font-bold text-blue-700">Active EMR files</span>
        </div>

        <div className="bg-[#ECFDF5] border border-emerald-200/80 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Lab Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <TestTube2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{sharedReportsCount}</div>
          <span className="text-[11px] font-bold text-emerald-700">Pending sign-off</span>
        </div>

        <div className="bg-[#FAF5FF] border border-purple-200/80 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-800">IPD Beds</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{occupiedBedsCount}</div>
          <span className="text-[11px] font-bold text-purple-700">{beds.length} Total beds</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#FDF2F8] border border-pink-200/80 rounded-[24px] p-4.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-pink-800">OPD Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{earningsToday}</div>
          <span className="text-[11px] font-bold text-pink-700">Today's billing</span>
        </div>
      </div>

      {/* ── Segmented Navigation Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
        {[
          { id: 'queue',         label: 'Consultation Queue',       icon: CalendarCheck, count: activeCount },
          { id: 'telehealth',    label: 'Live Telehealth Room',     icon: Video,         badge: callState === 'connected' ? 'LIVE' : null },
          { id: 'emr',          label: 'Patient Records & EMR',    icon: Users,         count: totalPatientsCount },
          { id: 'labs',         label: 'Lab Diagnostic Reviews',   icon: TestTube2,     count: sharedReportsCount },
          { id: 'ipd',          label: 'Inpatient IPD Rounds',     icon: Bed,           count: occupiedBedsCount },
          { id: 'prescriptions',label: 'Prescription Archive',     icon: FileText,      count: prescriptions.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border-none ${
                isActive
                  ? 'bg-[#16163B] text-white shadow-md scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#E9DF70]' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && !tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 1: CONSULTATION QUEUE & APPOINTMENTS
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-5 doc-anim-enter">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Live Consultation Queue</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Review scheduled patients, initiate video calls and record diagnoses
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patient, symptoms..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454] focus:bg-white transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                {['All', 'Scheduled', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold border-none cursor-pointer text-[11px] transition-all ${
                      statusFilter === st
                        ? 'bg-[#16163B] text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CalendarCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold">No appointments match this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100">
                    <th className="py-3 px-4 font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">Patient</th>
                    <th className="py-3 px-4 font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">Visit Time</th>
                    <th className="py-3 px-4 font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">Chief Complaints</th>
                    <th className="py-3 px-4 font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">Status</th>
                    <th className="py-3 px-4 text-right font-extrabold text-slate-500 uppercase tracking-wider text-[11px]">Clinical Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#242454] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                            {apt.patientName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <strong className="text-slate-900 font-extrabold block text-xs">{apt.patientName}</strong>
                            <span className="text-[10px] text-slate-400 font-semibold">ID: {apt.patientId || 'PT-104'} · Fee: ₹{apt.fee || 1500}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{apt.date}</div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                          <Clock className="w-3 h-3" /> {apt.time}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium max-w-xs">
                        {apt.reason || apt.symptoms || 'Regular health consultation'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => startTelehealthWithPatient(apt.patientName)}
                            className="px-2.5 py-1.5 bg-[#EFF6FF] hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-xl border border-blue-200 cursor-pointer flex items-center gap-1 transition-all"
                            title="Start Video Consultation"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>
                          <button
                            onClick={() => {
                              const patObj = patients.find(p => p.id === apt.patientId) || patients[0];
                              setSelectedPatientForRx(patObj);
                            }}
                            className="px-3 py-1.5 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-[11px] rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#E9DF70]" />
                            <span>Prescribe</span>
                          </button>
                          {apt.status === 'Scheduled' && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'Completed');
                                showToast(`Visit for ${apt.patientName} marked completed!`);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer transition-all"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 2: LIVE TELEHEALTH & VIDEO CONSULTATION SUITE
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'telehealth' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-6 doc-anim-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 m-0">Live Telehealth Consultation Suite</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  HD WebRTC Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Two-way video consultation, camera preview & real-time clinical notes
              </p>
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
                  <span>Open Video Room</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Feeds (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-xl flex items-center justify-center">
                {/* Main Display: Remote Patient's Video Feed */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${!remoteStreamActive ? 'hidden' : ''}`}
                />

                {/* Patient Connecting / Placeholder State */}
                {!remoteStreamActive && (
                  <div className="flex flex-col items-center justify-center text-slate-300 gap-3 p-6 text-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#242454] to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white m-0">
                        {activeCaller?.callerName || 'Patient Consultation Room'}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold m-0 mt-1 max-w-sm">
                        {callState === 'connected'
                          ? 'Encrypted WebRTC connection active. Receiving patient camera stream...'
                          : 'Waiting for patient video stream or incoming call...'}
                      </p>
                    </div>
                    {callState === 'connected' && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                        ● Live Peer Connection Synced
                      </span>
                    )}
                  </div>
                )}

                {/* Floating Doctor's Own PiP Camera Preview (Top Right) */}
                <div className="absolute top-4 right-4 w-36 h-28 md:w-44 md:h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/40 shadow-2xl flex items-center justify-center group z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                  />

                  {!isVideoOn && (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2">
                      <VideoOff className="w-6 h-6 opacity-60 mb-1" />
                      <span className="text-[10px] font-bold">Camera Muted</span>
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    You ({activeDoctor?.name?.split(' ')[1] || 'Doctor'})
                  </div>
                </div>

                {/* Status & Duration Badge (Top Left) */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 text-white text-[11px] font-bold border border-white/10 shadow-lg z-20">
                  <span className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                  <span>{callState === 'connected' ? `LIVE ● ${formatDuration(callDuration)}` : 'Standby / Ready'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                </div>

                {/* Video Controls Toolbar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/20 shadow-2xl z-20">
                  <button
                    onClick={toggleVideo}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors ${
                      isVideoOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-rose-500 text-white'
                    }`}
                    title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleAudio}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors ${
                      isAudioOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-rose-500 text-white'
                    }`}
                    title={isAudioOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      const pat = patients.find(p => p.name === activeCaller?.callerName) || patients[0];
                      setSelectedPatientForRx(pat);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#E9DF70] hover:bg-yellow-300 text-[#16163B] font-black text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe</span>
                  </button>

                  {callState !== 'idle' && (
                    <button
                      onClick={() => endTelehealthCall(true)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
                      title="End Consultation"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>End</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Consultation Quick Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 m-0">Patient: {activeCaller?.callerName || patients[0]?.name}</h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-0.5">Chief complaints: Chest tightness & shortness of breath upon exertion</p>
                </div>
                <button
                  onClick={() => setActiveTab('emr')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#16163B] font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Open EMR</span>
                </button>
              </div>
            </div>

            {/* In-Call Consultation Chat & Notes (1 Col) */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 flex flex-col justify-between h-[420px]">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#242454]" />
                  <h4 className="text-xs font-black text-slate-900 m-0">In-Call Consultation Chat</h4>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
                  {messages.map((m, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                        <span>{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 m-0">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={sendChatMessage} className="flex gap-2 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Type message to patient..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#242454]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#16163B] hover:bg-[#242454] text-white rounded-xl border-none cursor-pointer flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 3: PATIENT DIRECTORY & EMR TIMELINE
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'emr' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-6 doc-anim-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Electronic Medical Records (EMR / EHR)</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Longitudinal patient health records, vital stats history & diagnoses
              </p>
            </div>

            {/* Select Patient */}
            <div className="w-full sm:w-72">
              <select
                value={selectedPatientForEMR}
                onChange={(e) => setSelectedPatientForEMR(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#242454] cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id}) — {p.age} Yrs</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Patient Card */}
          {activeEMRPatient && (
            <div className="bg-gradient-to-r from-slate-50 to-[#EFF6FF] rounded-2xl p-5 border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#16163B] text-white font-black text-xl flex items-center justify-center shadow-sm">
                  {activeEMRPatient.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900 m-0">{activeEMRPatient.name}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black">
                      Blood Group: {activeEMRPatient.bloodGroup}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold m-0 mt-0.5">
                    {activeEMRPatient.gender} · {activeEMRPatient.age} Years · Phone: {activeEMRPatient.phone}
                  </p>
                  <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                    ABHA ID: {activeEMRPatient.insuranceId || 'ABHA-99214-MH'} · Address: {activeEMRPatient.address || 'Mumbai'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatientForRx(activeEMRPatient)}
                className="px-4 py-2.5 bg-[#16163B] hover:bg-[#242454] text-white font-black text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
                <span>Add Clinical Note / Rx</span>
              </button>
            </div>
          )}

          {/* Clinical Timeline & Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Past Prescriptions & Diagnoses */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Past Diagnoses & Prescriptions</h4>
              {patientPrescriptions.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-bold">
                  No previous prescriptions recorded for this patient.
                </div>
              ) : (
                patientPrescriptions.map(rx => (
                  <div key={rx.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:bg-white transition-all shadow-2xs">
                    <div className="flex justify-between items-start">
                      <strong className="text-xs font-black text-slate-900">{rx.diagnosis}</strong>
                      <span className="text-[10px] text-slate-400 font-bold">{rx.date || '2026-10-08'}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      {rx.medications?.map((m, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Pill className="w-3 h-3 text-purple-600" />
                          <span><strong>{m.name}</strong> — {m.dosage} ({m.duration})</span>
                        </div>
                      ))}
                    </div>
                    {rx.advice && (
                      <p className="text-[11px] text-slate-500 italic m-0 pt-1 border-t border-slate-200">
                        Advice: {rx.advice}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Right: Recorded Health Vitals */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Vitals & Physiological Trends</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#EFF6FF] rounded-2xl border border-blue-200 text-center">
                  <span className="text-[10px] font-black uppercase text-blue-700">Blood Pressure</span>
                  <div className="text-xl font-black text-slate-900 mt-1">120/80</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Normal Range</span>
                </div>
                <div className="p-4 bg-[#ECFDF5] rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] font-black uppercase text-emerald-700">Heart Rate</span>
                  <div className="text-xl font-black text-slate-900 mt-1">74 bpm</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Resting BPM</span>
                </div>
                <div className="p-4 bg-[#FAF5FF] rounded-2xl border border-purple-200 text-center">
                  <span className="text-[10px] font-black uppercase text-purple-700">Oxygen Saturation</span>
                  <div className="text-xl font-black text-slate-900 mt-1">99%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Optimal SpO2</span>
                </div>
                <div className="p-4 bg-[#FFF7ED] rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] font-black uppercase text-amber-700">Fasting Glucose</span>
                  <div className="text-xl font-black text-slate-900 mt-1">96 mg/dL</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Euglycemic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 4: DIAGNOSTIC LAB TESTS REVIEW
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-5 doc-anim-enter">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Diagnostic Lab Reports Awaiting Review</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Review biochemistry, pathology & radiology reports and approve for patient portal
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
              {labTests.length} Total Diagnostic Panels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labTests.map(test => (
              <div key={test.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#242454]/40 transition-all space-y-3 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 m-0">{test.testName || test.name}</h4>
                    <span className="text-[11px] text-slate-500 font-bold">Patient: {test.patientName} · Sample ID: {test.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                    test.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {test.status || 'Pending Sign-Off'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Specimen: Venous Blood</span>
                    <span>Collected: 2026-10-08</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold">
                    <span>Clinical Result: Normal Hemoglobin & WBC Count</span>
                    <span className="text-emerald-600">● In Range</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    onClick={() => {
                      publishLabReport(test.id, { verifiedBy: activeDoctor?.name || 'Dr. Souvik Sinha' });
                      showToast(`Lab report for ${test.testName} signed off!`);
                    }}
                    className="px-3.5 py-1.5 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5 text-[#E9DF70]" />
                    <span>Approve & Sign-Off</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 5: INPATIENT IPD ROUNDS & BEDS
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ipd' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-5 doc-anim-enter">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Inpatient Department (IPD) Rounds & Bed Status</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Ward rounds, admitted patient tracking and ICU occupancy
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
              {occupiedBedsCount} of {beds.length} Beds Occupied
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {beds.map(bed => (
              <div
                key={bed.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  bed.status === 'Occupied'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Bed className={`w-4 h-4 ${bed.status === 'Occupied' ? 'text-rose-600' : 'text-emerald-600'}`} />
                    <strong className="text-xs font-black text-slate-900">{bed.ward} #{bed.number}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    bed.status === 'Occupied' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold block">Patient:</span>
                  <strong className="font-extrabold">{bed.patientName || 'Vacant / Ready'}</strong>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Type: {bed.type}</span>
                  <button
                    onClick={() => {
                      const newStatus = bed.status === 'Occupied' ? 'Available' : 'Occupied';
                      updateBedStatus(bed.id, newStatus, newStatus === 'Occupied' ? 'Admitted Patient' : null);
                      showToast(`Bed #${bed.number} status updated to ${newStatus}`);
                    }}
                    className="text-[10px] font-bold text-[#16163B] underline cursor-pointer bg-transparent border-none p-0"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 6: PRESCRIPTION ARCHIVE
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-5 doc-anim-enter">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">Prescription Archive & Audit Log</h3>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Digital prescriptions issued with medicine dosages and medical instructions
              </p>
            </div>
            <button
              onClick={() => setSelectedPatientForRx(patients[0])}
              className="px-4 py-2 bg-[#16163B] hover:bg-[#242454] text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#E9DF70]" />
              <span>New Prescription</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map(rx => (
              <div key={rx.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-2 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 m-0">{rx.diagnosis}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold">Patient: {rx.patientName} (ID: {rx.patientId}) · Issued by {rx.doctorName || activeDoctor?.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {rx.date || 'Today'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                  {rx.medications?.map((m, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <strong className="block text-slate-900 text-[11px]">{m.name}</strong>
                      <span className="text-[10px] text-slate-500 block">{m.dosage} · {m.duration}</span>
                      <span className="text-[10px] text-purple-700 font-bold block">{m.instructions}</span>
                    </div>
                  ))}
                </div>

                {rx.advice && (
                  <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-xl">
                    <strong>Advice:</strong> {rx.advice}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
            {/* Ambient Pulsing Glow Rings */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-100 rounded-full blur-2xl pointer-events-none opacity-60" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-blue-100 rounded-full blur-2xl pointer-events-none opacity-60" />

            {/* Glowing Ringing Icon with Web Audio chime active */}
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

            {/* Patient Symptoms & Payment Info Card */}
            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Chief Complaints / Symptoms:
              </span>
              <p className="text-xs font-bold text-slate-800 m-0">
                {incomingCall.symptoms || 'General medical review & cardiovascular consultation.'}
              </p>
              {incomingCall.invoiceId && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">Consultation Fee:</span>
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Confirmed
                  </span>
                </div>
              )}
            </div>

            {/* Accept / Decline Action Buttons */}
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
                <span>Accept & Join</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorConsole;
