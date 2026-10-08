/**
 * Unified Telehealth Signaling Bridge
 * Synchronizes WebRTC offers, answers, ICE candidates, call status,
 * and real-time 1:1 chat between Patient and Doctor across tabs,
 * windows, and devices.
 */

import { apiService } from '../services/api';

const CHANNEL_NAME = 'clinic_telehealth_channel';
const STORAGE_CALL_KEY = 'clinic_active_telehealth_call';
const STORAGE_ANSWER_KEY = 'clinic_active_telehealth_answer';
const STORAGE_CHAT_KEY = 'clinic_telehealth_chat_event';
const STORAGE_ENDED_KEY = 'clinic_telehealth_call_ended';

class TelehealthSignalingBridge {
  constructor() {
    this.channel = null;
    this.subscribers = new Set();
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    try {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        if (event.data) {
          this.notifySubscribers(event.data.type, event.data.payload);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported, using storage fallback:', e);
    }

    // Storage event listener for cross-tab synchronization
    window.addEventListener('storage', (event) => {
      if (!event.newValue) return;

      try {
        if (event.key === STORAGE_CALL_KEY) {
          const callData = JSON.parse(event.newValue);
          this.notifySubscribers('START_CALL', callData);
        } else if (event.key === STORAGE_ANSWER_KEY) {
          const answerData = JSON.parse(event.newValue);
          this.notifySubscribers('CALL_ANSWERED', answerData);
        } else if (event.key === STORAGE_CHAT_KEY) {
          const chatData = JSON.parse(event.newValue);
          this.notifySubscribers('CHAT_MESSAGE', chatData);
        } else if (event.key === STORAGE_ENDED_KEY) {
          this.notifySubscribers('CALL_ENDED', null);
        }
      } catch (err) {
        console.warn('Error parsing storage event in telehealth signaling:', err);
      }
    });

    // Custom event listener for same-tab updates
    window.addEventListener('clinic_telehealth_signal', (event) => {
      if (event.detail) {
        this.notifySubscribers(event.detail.type, event.detail.payload);
      }
    });
  }

  notifySubscribers(type, payload) {
    this.subscribers.forEach((callback) => {
      try {
        callback({ type, payload });
      } catch (err) {
        console.error('Error in telehealth signal subscriber:', err);
      }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Get current pending call from localStorage if any
  getActiveCall() {
    try {
      const raw = localStorage.getItem(STORAGE_CALL_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  // Get current answer from localStorage if any
  getActiveAnswer() {
    try {
      const raw = localStorage.getItem(STORAGE_ANSWER_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  // Start Call (Patient -> Doctor)
  async startCall(callPayload) {
    try {
      localStorage.setItem(STORAGE_CALL_KEY, JSON.stringify(callPayload));
      localStorage.removeItem(STORAGE_ANSWER_KEY);
      localStorage.removeItem(STORAGE_ENDED_KEY);
    } catch (e) {}

    // Dispatch locally
    window.dispatchEvent(
      new CustomEvent('clinic_telehealth_signal', {
        detail: { type: 'START_CALL', payload: callPayload }
      })
    );

    // Broadcast across tabs
    if (this.channel) {
      this.channel.postMessage({ type: 'START_CALL', payload: callPayload });
    }

    // Send to backend REST API
    apiService.startTelehealthCall(callPayload).catch(() => {});
  }

  // Answer Call (Doctor -> Patient)
  async answerCall(answerPayload) {
    try {
      localStorage.setItem(STORAGE_ANSWER_KEY, JSON.stringify(answerPayload));
      localStorage.removeItem(STORAGE_ENDED_KEY);
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent('clinic_telehealth_signal', {
        detail: { type: 'CALL_ANSWERED', payload: answerPayload }
      })
    );

    if (this.channel) {
      this.channel.postMessage({ type: 'CALL_ANSWERED', payload: answerPayload });
    }

    apiService.answerTelehealthCall(answerPayload).catch(() => {});
  }

  // Send ICE Candidate
  async sendIceCandidate(candidate) {
    const payload = { candidate };

    if (this.channel) {
      this.channel.postMessage({ type: 'ICE_CANDIDATE', payload });
    }

    apiService.addIceCandidate(candidate).catch(() => {});
  }

  // Send 1:1 Chat Message
  sendChatMessage(message) {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify({ ...message, _ts: Date.now() }));
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent('clinic_telehealth_signal', {
        detail: { type: 'CHAT_MESSAGE', payload: message }
      })
    );

    if (this.channel) {
      this.channel.postMessage({ type: 'CHAT_MESSAGE', payload: message });
    }
  }

  // End Call
  async endCall() {
    try {
      localStorage.removeItem(STORAGE_CALL_KEY);
      localStorage.removeItem(STORAGE_ANSWER_KEY);
      localStorage.setItem(STORAGE_ENDED_KEY, JSON.stringify({ timestamp: Date.now() }));
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent('clinic_telehealth_signal', {
        detail: { type: 'CALL_ENDED', payload: null }
      })
    );

    if (this.channel) {
      this.channel.postMessage({ type: 'CALL_ENDED' });
    }

    apiService.hangupTelehealthCall().catch(() => {});
  }
}

export const telehealthBridge = new TelehealthSignalingBridge();
