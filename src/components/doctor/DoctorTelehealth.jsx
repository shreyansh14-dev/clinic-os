import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { CreatePrescriptionModal } from './CreatePrescriptionModal';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Send, PhoneCall, Stethoscope, User, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

export const DoctorTelehealth = () => {
  const { activeDoctor, patients, showToast } = useApp();

  const [callState, setCallState] = useState('idle'); // 'idle' | 'incoming' | 'connected' | 'ended'
  const [activeCaller, setActiveCaller] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showRxModal, setShowRxModal] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Doctor Consultation Room Ready.', time: '10:00 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('clinic_telehealth_channel');
    
    broadcastChannelRef.current.onmessage = async (event) => {
      const { type, payload } = event.data;
      if (type === 'START_CALL') {
        setActiveCaller(payload);
        setCallState('incoming');
        showToast(`📞 INCOMING CALL: Patient ${payload.callerName} is calling for Telemedicine Consultation!`);
      } else if (type === 'ICE_CANDIDATE' && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {}
      } else if (type === 'CALL_ENDED') {
        endCall(false);
      }
    };

    // Polling Express Backend REST Signaling for cross-device calls
    const pollInterval = setInterval(async () => {
      if (callState === 'idle') {
        const res = await apiService.getActiveTelehealthCall();
        if (res?.activeCall?.status === 'calling') {
          setActiveCaller(res.activeCall);
          setCallState('incoming');
          showToast(`📞 INCOMING CALL: Patient ${res.activeCall.callerName} is calling!`);
        }
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
    };
  }, [callState]);

  const acceptCall = async () => {
    try {
      setCallState('connected');

      // 1. Get Doctor's real camera & microphone media stream
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

      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
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

      // 3. Set Remote Description if offer exists
      if (activeCaller?.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(activeCaller.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // 4. Send Answer via Backend REST API & BroadcastChannel
        await apiService.answerTelehealthCall({ answer: { type: answer.type, sdp: answer.sdp } });
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({ type: 'CALL_ANSWERED', payload: { answer: { type: answer.type, sdp: answer.sdp } } });
        }
      }

      showToast(`Connected with ${activeCaller?.callerName || 'Patient'}`);
    } catch (err) {
      console.error('Doctor answer call error:', err);
      showToast('Error accessing camera for video call.', 'danger');
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
    setActiveCaller(null);
    showToast('Video consultation ended.');
  };

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
    const newMsg = { sender: `Dr. ${activeDoctor?.name || 'Souvik Sinha'}`, text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'rgba(255, 85, 0, 0.15)', display: 'flex', alignItems: 'center', justify: 'center', color: '#ff5500' }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Doctor Tele-Health Video Suite
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Dr. {activeDoctor?.name || 'Souvik Sinha'} • Virtual Consultation Room 104
            </p>
          </div>
        </div>

        {callState === 'connected' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-orange" onClick={() => setShowRxModal(true)} style={{ padding: '0.65rem 1.25rem' }}>
              <FileText size={16} /> Issue Prescription
            </button>
            <button className="btn-secondary" onClick={() => endCall(true)} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.65rem 1.25rem' }}>
              <PhoneOff size={16} /> End Call
            </button>
          </div>
        )}
      </div>

      {/* Incoming Call Notification Popup Banner */}
      {callState === 'incoming' && (
        <div className="glass-card animate-pulse" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #161c28, #0d111a)', border: '2px solid #ff5500', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#ff5500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <PhoneCall size={28} className="animate-bounce" />
            </div>
            <div>
              <span className="badge badge-orange" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>INCOMING TELEMEDICINE CALL</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                {activeCaller?.callerName || 'Patient Shreyansh Kumar'} is calling...
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Click "Accept Video Call" to open your camera and connect video stream.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-orange" onClick={acceptCall} style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Video size={20} /> Accept Video Call
            </button>
            <button className="btn-secondary" onClick={() => endCall(true)} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.85rem 1.25rem' }}>
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Video & Chat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        
        {/* Left Screen Video Stream */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '480px', position: 'relative' }}>
          
          {callState === 'idle' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '1rem', padding: '3rem' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#0d111a', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff5500' }}>
                <Stethoscope size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>Doctor Telehealth Console Ready</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', marginTop: '0.35rem' }}>
                  Waiting for incoming patient call requests. When a patient initiates a video call, an alert banner will prompt you to accept.
                </p>
              </div>
            </div>
          )}

          {callState === 'connected' && (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative' }}>
              
              {/* Doctor Local Video Feed */}
              <div style={{ background: '#000000', borderRadius: '1rem', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge badge-orange" style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 10 }}>
                  Dr. {activeDoctor?.name || 'Souvik Sinha'} (You)
                </span>
              </div>

              {/* Patient Remote Video Feed */}
              <div style={{ background: '#000000', borderRadius: '1rem', overflow: 'hidden', position: 'relative', border: '2px solid #ff5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge badge-success" style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 10 }}>
                  Patient: {activeCaller?.callerName || 'Shreyansh Kumar'} (Live Stream)
                </span>
              </div>

            </div>
          )}

          {/* Media Control Bar */}
          {callState === 'connected' && (
            <div style={{ display: 'flex', itemsAlign: 'center', justifyContent: 'center', gap: '1rem', background: '#0d111a', padding: '0.85rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <button onClick={toggleVideo} className="btn-icon" style={{ background: isVideoOn ? 'var(--bg-card)' : '#ef4444', color: '#ffffff' }}>
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
              <button onClick={toggleAudio} className="btn-icon" style={{ background: isAudioOn ? 'var(--bg-card)' : '#ef4444', color: '#ffffff' }}>
                {isAudioOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button onClick={() => setShowRxModal(true)} className="btn-orange" style={{ padding: '0.5rem 1.25rem' }}>
                <FileText size={18} /> Issue Rx
              </button>
              <button onClick={() => endCall(true)} className="btn-secondary" style={{ background: '#ef4444', border: 'none', color: '#ffffff', padding: '0.5rem 1.25rem' }}>
                <PhoneOff size={18} /> End Consultation
              </button>
            </div>
          )}

        </div>

        {/* Right Live Consultation Chat Panel */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '520px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', borderBottom: '1px solid var(--border-color)', pb: '0.75rem', mb: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} style={{ color: '#ff5500' }} /> Consultation Notes & Chat
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto', pr: '0.5rem' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ background: m.sender === 'System' ? 'rgba(255,85,0,0.1)' : '#0d111a', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff5500', fontWeight: '700', fontSize: '0.72rem', mb: '0.2rem' }}>
                    <span>{m.sender}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{m.time}</span>
                  </div>
                  <div style={{ color: '#ffffff' }}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', mt: '1rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Type message to patient..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{ fontSize: '0.82rem' }}
            />
            <button type="submit" className="btn-orange" style={{ padding: '0.5rem 0.85rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

      {/* Prescription Generator Modal Trigger */}
      {showRxModal && (
        <CreatePrescriptionModal patient={patients.find(p => p.name === activeCaller?.callerName) || patients[0]} onClose={() => setShowRxModal(false)} />
      )}

    </div>
  );
};
