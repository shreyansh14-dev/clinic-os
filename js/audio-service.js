/**
 * ClinicOS: Web Audio API Synthesizer
 * Generates realistic hospital monitor telemetry, call ringers, and UI audio cues.
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.isTelemetryBeepEnabled = false;
    this.initContextOnUserAction();
  }

  initContextOnUserAction() {
    const init = () => {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      document.removeEventListener('click', init);
      document.removeEventListener('keydown', init);
    };
    document.addEventListener('click', init);
    document.addEventListener('keydown', init);
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Heartbeat monitor beep (600Hz blip)
  playHeartBeep() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Telehealth incoming call ringer
  playCallRing() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.2); // C5
      playTone(659.25, 0.2, 0.2); // E5
      playTone(783.99, 0.4, 0.35); // G5
    } catch (e) {}
  }

  // Success chime (payment, booking confirmed)
  playSuccessChime() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // Alert warning tone
  playWarningAlert() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(420, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  toggleTelemetryBeep(buttonEl) {
    this.isTelemetryBeepEnabled = !this.isTelemetryBeepEnabled;
    if (this.isTelemetryBeepEnabled) {
      this.playHeartBeep();
      if (buttonEl) {
        buttonEl.classList.add('active');
        buttonEl.innerHTML = `<i data-lucide="volume-2"></i> Audio Monitor ON`;
      }
    } else {
      if (buttonEl) {
        buttonEl.classList.remove('active');
        buttonEl.innerHTML = `<i data-lucide="volume-x"></i> Audio Monitor OFF`;
      }
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

window.audioService = new AudioService();
