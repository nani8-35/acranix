/**
 * ACRANIX Ambient Sound Engine
 * Generates an ethereal, calm, high-precision sonic atmosphere using Web Audio API.
 * 100% synthetic, zero external audio assets, ultra lightweight.
 */

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch {
      console.warn('Web Audio API not supported in this browser.');
    }
  }

  public async toggle(): Promise<boolean> {
    if (!this.ctx) {
      this.init();
    }

    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (!this.ctx || this.isPlaying) return;

    try {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3.0);

      // Warm low-pass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.masterGain.connect(this.ctx.destination);
      this.filter.connect(this.masterGain);

      // Fundamental harmonic drone (F# minor resonant frequencies: 92.5Hz, 138.59Hz, 185Hz, 277.18Hz)
      const freqs = [92.5, 138.59, 185.0, 277.18];
      this.oscillators = [];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle detuning for lush stereo-like movement
        osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

        const level = idx === 0 ? 0.4 : idx === 1 ? 0.25 : 0.15;
        gain.gain.setValueAtTime(level, this.ctx.currentTime);

        osc.connect(gain);
        gain.connect(this.filter);
        osc.start();
        this.oscillators.push(osc);
      });

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;

    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Safe cleanup
          }
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 1200);
    } catch {
      this.isPlaying = false;
    }
  }

  public modulateWithScroll(progress: number) {
    if (!this.ctx || !this.isPlaying || !this.filter) return;
    try {
      // Modulate filter cutoff between 180Hz and 650Hz based on scroll depth
      const targetCutoff = 180 + progress * 470;
      this.filter.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.2);
    } catch {
      // Safe guard
    }
  }

  public playSubtlePulse() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();

      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(554.37, this.ctx.currentTime); // C#5
      pingGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

      pingOsc.connect(pingGain);
      pingGain.connect(this.ctx.destination);

      pingOsc.start();
      pingOsc.stop(this.ctx.currentTime + 0.85);
    } catch {
      // Safe guard
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientAudioEngine();
