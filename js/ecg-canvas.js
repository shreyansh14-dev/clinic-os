/**
 * ClinicOS: 4D Dynamic ECG Oscilloscope & Cardiac Waveform Simulator
 * Renders real-time P-Q-R-S-T cardiac telemetry with phosphor decay trails.
 */

class ECGCanvasSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = this.canvas.clientWidth || 600;
    this.height = this.canvas.height = this.canvas.clientHeight || 180;

    this.history = [];
    this.maxPoints = Math.floor(this.width / 2);
    this.xOffset = 0;
    this.bpm = 72;
    this.phase = 0;
    this.isRunning = true;
    this.animId = null;

    this.resizeObserver = new ResizeObserver(() => {
      this.width = this.canvas.width = this.canvas.clientWidth;
      this.height = this.canvas.height = this.canvas.clientHeight;
      this.maxPoints = Math.floor(this.width / 2);
    });
    this.resizeObserver.observe(this.canvas);

    this.start();
  }

  // Calculate synthetic P-Q-R-S-T amplitude at phase t (0 to 1)
  getCardiacSignal(t) {
    // Baseline zero
    let signal = 0;

    // P-Wave (at t ~ 0.15)
    if (t >= 0.10 && t <= 0.22) {
      const pT = (t - 0.16) / 0.06;
      signal += Math.exp(-pT * pT * 4) * 0.15;
    }
    // Q-Wave dip (at t ~ 0.28)
    else if (t >= 0.26 && t <= 0.30) {
      signal -= 0.15;
    }
    // R-Wave Spike (at t ~ 0.32)
    else if (t >= 0.30 && t <= 0.35) {
      const rT = (t - 0.325) / 0.025;
      signal += Math.exp(-rT * rT * 6) * 1.0;
    }
    // S-Wave valley (at t ~ 0.37)
    else if (t >= 0.35 && t <= 0.40) {
      signal -= 0.25;
    }
    // T-Wave (at t ~ 0.55)
    else if (t >= 0.46 && t <= 0.68) {
      const tT = (t - 0.57) / 0.11;
      signal += Math.exp(-tT * tT * 4) * 0.32;
    }

    // Add tiny micro-noise for realism
    signal += (Math.random() - 0.5) * 0.02;

    return signal;
  }

  start() {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isRunning) return;

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Advance phase according to BPM
      const beatsPerSecond = this.bpm / 60;
      const prevPhase = this.phase;
      this.phase = (this.phase + dt * beatsPerSecond) % 1.0;

      // Trigger heart sound at peak R-wave if enabled
      if (prevPhase < 0.325 && this.phase >= 0.325) {
        if (window.audioService && window.audioService.isTelemetryBeepEnabled) {
          window.audioService.playHeartBeep();
        }
      }

      const signal = this.getCardiacSignal(this.phase);
      const midY = this.height / 2;
      const yVal = midY - signal * (this.height * 0.42);

      this.history.push(yVal);
      if (this.history.length > this.maxPoints) {
        this.history.shift();
      }

      this.render();
      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 24;

    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Draw ECG Glowing Trail
    if (this.history.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#10B981';
    ctx.shadowBlur = 8;
    ctx.lineJoin = 'round';

    const step = w / this.maxPoints;
    for (let i = 0; i < this.history.length; i++) {
      const x = i * step;
      const y = this.history[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw Leading Glowing Pulse Dot
    const latestX = (this.history.length - 1) * step;
    const latestY = this.history[this.history.length - 1];

    ctx.fillStyle = '#34D399';
    ctx.shadowColor = '#34D399';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(latestX, latestY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  setBpm(newBpm) {
    this.bpm = Math.max(40, Math.min(180, newBpm));
  }

  destroy() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}

window.ECGCanvasSimulator = ECGCanvasSimulator;
