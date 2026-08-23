import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Stethoscope,
  User,
  ShieldCheck,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Plus,
  AlertCircle
} from 'lucide-react';

export const TelemedicineCall = () => {
  const {
    activePatient,
    doctors,
    labTests,
    payBill,
    showToast,
    addAuditLog
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const incomingAppointment = location.state?.appointment || null;

  // Booking Flow Steps: 1=Doctor Select, 2=Symptoms, 3=Payment, 4=Live Video
  // If launched from an existing appointment, jump directly to step 4
  const [bookingStep, setBookingStep] = useState(incomingAppointment ? 4 : 1);

  // Pre-fill doctor from appointment if available
  const getInitialDoctor = () => {
    if (incomingAppointment) {
      return doctors.find(d => d.name === incomingAppointment.doctorName) || {
        id: 'apt-doc',
        name: incomingAppointment.doctorName,
        specialty: incomingAppointment.specialty,
        fee: incomingAppointment.fee || 1500,
        avatar: incomingAppointment.doctorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg',
      };
    }
    return doctors[0] || null;
  };

  const [selectedDoctor, setSelectedDoctor] = useState(getInitialDoctor);
  const [symptoms, setSymptoms] = useState(incomingAppointment?.reason || '');
  const [symptomDuration, setSymptomDuration] = useState('1-3 Days');
  const [selectedLabReport, setSelectedLabReport] = useState('None');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Google Pay');

  // If from appointment, mark as already paid
  const [isPaid, setIsPaid] = useState(!!incomingAppointment);
  const [invoiceId, setInvoiceId] = useState(incomingAppointment?.id || null);

  // WebRTC Call State
  const [callState, setCallState] = useState('idle'); // 'idle' | 'calling' | 'connected'
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Encrypted Telemedicine Session Initialized.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const autoStartedRef = useRef(false);
  const startCallRef = useRef(null); // will be set after startCall is defined

  // WebRTC & BroadcastChannel setup
  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('clinic_telehealth_channel');
    
    broadcastChannelRef.current.onmessage = async (event) => {
      const { type, payload } = event.data;
      if (type === 'CALL_ANSWERED' && pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
          setCallState('connected');
          showToast(`Dr. ${selectedDoctor?.name || 'Doctor'} joined the video call!`);
        } catch (err) {
          console.warn('Error setting remote description:', err);
        }
      } else if (type === 'ICE_CANDIDATE' && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {}
      } else if (type === 'CALL_ENDED') {
        endCall(false);
      }
    };

    const pollInterval = setInterval(async () => {
      if (callState === 'calling') {
        const res = await apiService.getActiveTelehealthCall();
        if (res?.activeCall?.status === 'connected' && res?.activeCall?.answer && pcRef.current?.signalingState !== 'stable') {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(res.activeCall.answer));
            setCallState('connected');
            showToast(`Doctor accepted call! Video connection active.`);
          } catch (e) {}
        }
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
    };
  }, [callState, selectedDoctor]);

  const handlePayment = async () => {
    if (!symptoms.trim()) {
      showToast('Please describe your medical symptoms before proceeding to payment.', 'warn');
      return;
    }

    const txn = `TXN-TELE-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setInvoiceId(txn);
    setIsPaid(true);

    showToast(`Payment of ₹${(selectedDoctor?.fee || 500) + 149} Successful! Invoice ${txn} generated.`);
    setBookingStep(4); // Advance to Unlocked Telemedicine Room
  };

  const startCall = async () => {
    // Allow if already paid OR if launched directly from a confirmed appointment
    if (!isPaid && !incomingAppointment) {
      showToast('Please complete consultation payment to start the video call.', 'warn');
      return;
    }

    try {
      setCallState('calling');

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 480);
        return canvas.captureStream(30);
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallState('connected');
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          apiService.addIceCandidate(event.candidate).catch(() => {});
          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({ type: 'ICE_CANDIDATE', payload: { candidate: event.candidate } });
          }
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const callPayload = {
        callerId: activePatient?.id || 'pat-101',
        callerName: activePatient?.name || 'Shreyansh Kumar',
        doctorId: selectedDoctor?.id || 'doc-1',
        doctorName: selectedDoctor?.name || 'Dr. Souvik Sinha',
        symptoms,
        selectedLabReport,
        invoiceId,
        offer: { type: offer.type, sdp: offer.sdp }
      };

      await apiService.startTelehealthCall(callPayload);

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'START_CALL', payload: callPayload });
      }

      showToast(`Ringing ${selectedDoctor?.name || 'Doctor'}...`);
    } catch (err) {
      console.error('Telehealth call error:', err);
      showToast('Could not access camera/microphone.', 'danger');
      setCallState('idle');
    }
  };

  const endCall = async (notify = true) => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (notify && broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'CALL_ENDED' });
      await apiService.hangupTelehealthCall().catch(() => {});
    }

    setCallState('idle');
    showToast('Video consultation ended.');
  };

  // Keep startCallRef current so auto-start useEffect can call it
  startCallRef.current = startCall;

  // Auto-start camera when launched from My Appointments
  useEffect(() => {
    if (incomingAppointment && !autoStartedRef.current) {
      autoStartedRef.current = true;
      const timer = setTimeout(() => { if (startCallRef.current) startCallRef.current(); }, 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = { sender: activePatient?.name || 'Patient', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  const consultationFee = selectedDoctor?.fee || 500;
  const platformFee = 50;
  const gstTax = Math.round((consultationFee + platformFee) * 0.18);
  const totalPayable = consultationFee + platformFee + gstTax;

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 m-0">Telemedicine Consultation Wizard</h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              4-Step Verified Workflow: Doctor Selection → Symptoms & Lab Reports → Payment Checkout → Unlocked Video Room
            </p>
          </div>
        </div>

        {/* Wizard Progress Steps Indicator */}
        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold">
          <span className={`px-2.5 py-1 rounded-full ${bookingStep === 1 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1. Doctor</span>
          <span className="text-slate-300">→</span>
          <span className={`px-2.5 py-1 rounded-full ${bookingStep === 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2. Symptoms & Labs</span>
          <span className="text-slate-300">→</span>
          <span className={`px-2.5 py-1 rounded-full ${bookingStep === 3 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3. Payment</span>
          <span className="text-slate-300">→</span>
          <span className={`px-2.5 py-1 rounded-full ${bookingStep === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>4. Live Video Call</span>
        </div>
      </div>

      {/* STEP 1: Select Specialist Doctor */}
      {bookingStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 m-0">Step 1: Select Your Telemedicine Doctor</h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Choose a verified doctor specialist from our hospital roster</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map(doc => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-orange-50 border-orange-500 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border border-orange-200" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900 m-0">{doc.name}</h4>
                      <p className="text-xs text-orange-600 font-bold m-0">{doc.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Consult Fee:</span>
                    <span className="font-black text-slate-900">₹{doc.fee || 500}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setBookingStep(2)}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-2 border-none cursor-pointer"
            >
              <span>Next: Symptoms & Lab Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms & Lab Reports Attachment */}
      {bookingStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 m-0">Step 2: Pre-Consultation Intake & Medical History</h3>
              <p className="text-xs text-slate-500 m-0 mt-0.5">Consultation with {selectedDoctor?.name} ({selectedDoctor?.specialty})</p>
            </div>
            <button onClick={() => setBookingStep(1)} className="text-xs text-slate-500 underline bg-transparent border-none cursor-pointer">
              Change Doctor
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Primary Symptoms & Reason for Visit *</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Chest tightness, mild shortness of breath, elevated blood pressure for 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Symptom Duration</label>
                <select
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Today / Today Morning">Today / Today Morning</option>
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="More than 2 Weeks">More than 2 Weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Attach Existing Lab Report (EHR)</label>
                <select
                  value={selectedLabReport}
                  onChange={(e) => setSelectedLabReport(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="None">None (No Report Attached)</option>
                  {labTests.map(t => (
                    <option key={t.id} value={`${t.name} (${t.orderDate})`}>{t.name} - {t.status} ({t.orderDate})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={() => setBookingStep(1)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">
              Back
            </button>

            <button
              onClick={() => {
                if (!symptoms.trim()) {
                  showToast('Please describe your medical symptoms before proceeding.', 'warn');
                  return;
                }
                setBookingStep(3);
              }}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-2 border-none cursor-pointer"
            >
              <span>Proceed to Payment Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment Gateway Checkout */}
      {bookingStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 m-0">Step 3: Secure Payment Checkout</h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Pay consultation fee to unlock live WebRTC video consultation room</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Payment Summary Box (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">Consultation Invoice Breakdown</h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Doctor Consultation ({selectedDoctor?.name}):</span>
                  <span className="font-bold text-slate-900">₹{consultationFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Telehealth Encrypted Server Fee:</span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax (18%):</span>
                  <span className="font-bold text-slate-900">₹{gstTax}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount Payable:</span>
                  <span className="text-orange-600">₹{totalPayable}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-extrabold text-slate-700">Select Payment Gateway</label>
              
              <div className="space-y-2">
                {['UPI / Google Pay / PhonePe', 'Credit / Debit Card', 'Net Banking'].map(pm => (
                  <label
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs font-bold ${
                      paymentMethod === pm ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <span>{pm}</span>
                    </div>
                    {paymentMethod === pm && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                  </label>
                ))}
              </div>

              <button
                onClick={handlePayment}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 border-none cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalPayable} & Unlock Video Call</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STEP 4: Unlocked Telemedicine Call Room */}
      {bookingStep === 4 && (
        <div className="space-y-6">
          
          {/* Confirmed Invoice Header Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Payment Confirmed! Consultation Paid for {selectedDoctor?.name}. Invoice #{invoiceId} stored in SQLite Database.</span>
            </div>
            <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full font-black text-[10px]">VERIFIED PAID</span>
          </div>

          {/* Main Video & Chat Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Screen Video Stream (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[480px] relative overflow-hidden">
              
              {callState === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-600">
                    <Video className="w-10 h-10 animate-beacon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 m-0">Ready for Consultation with {selectedDoctor?.name}</h3>
                    <p className="text-xs text-slate-500 max-w-md mt-1">
                      Click "Start Live Video Call" to open your camera and connect WebRTC video feed with {selectedDoctor?.name}.
                    </p>
                  </div>
                  <button
                    onClick={startCall}
                    className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 border-none cursor-pointer"
                  >
                    <Video className="w-5 h-5" />
                    <span>Start Live Video Call Now</span>
                  </button>
                </div>
              )}

              {callState === 'calling' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center text-orange-600 animate-pulse">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 m-0">Calling {selectedDoctor?.name}...</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Ringing doctor console. Open Doctor Console in another tab/window to answer.
                    </p>
                  </div>
                </div>
              )}

              {(callState === 'calling' || callState === 'connected') && (
                <div className={`flex-1 grid ${callState === 'connected' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 relative`}>
                  
                  {/* Local Video Stream */}
                  <div className="bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center min-h-[300px]">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      You ({activePatient?.name})
                    </span>
                  </div>

                  {/* Remote Doctor Video Stream */}
                  {callState === 'connected' && (
                    <div className="bg-slate-950 rounded-2xl overflow-hidden relative border-2 border-orange-500 flex items-center justify-center min-h-[300px]">
                      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {selectedDoctor?.name} (Live Stream)
                      </span>
                    </div>
                  )}

                </div>
              )}

              {/* Media Control Bar */}
              {callState !== 'idle' && (
                <div className="flex items-center justify-center space-x-3 bg-slate-100 p-3 rounded-2xl border border-slate-200 mt-4">
                  <button onClick={toggleVideo} className={`p-3 rounded-xl border ${isVideoOn ? 'bg-white text-slate-800 border-slate-200' : 'bg-red-600 text-white border-red-600'}`}>
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button onClick={toggleAudio} className={`p-3 rounded-xl border ${isAudioOn ? 'bg-white text-slate-800 border-slate-200' : 'bg-red-600 text-white border-red-600'}`}>
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => endCall(true)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 border-none cursor-pointer">
                    <PhoneOff className="w-4 h-4" />
                    <span>Disconnect Call</span>
                  </button>
                </div>
              )}

            </div>

            {/* Right Consultation Chat (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[520px]">
              <div>
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span>Consultation Chat & Symptoms</span>
                </h3>

                <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-xs mb-3">
                  <div className="font-extrabold text-orange-800">Recorded Symptoms:</div>
                  <div className="text-slate-700 text-[11px] mt-0.5">{symptoms}</div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {messages.map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-orange-600 font-bold text-[10px] mb-1">
                        <span>{m.sender}</span>
                        <span className="text-slate-400">{m.time}</span>
                      </div>
                      <div className="text-slate-800">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={sendMessage} className="flex space-x-2 mt-3">
                <input
                  type="text"
                  placeholder="Type message to doctor..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button type="submit" className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl border-none cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
