// Web Audio API Polyphonic Sound Engine for FALS
// Zero external soundfont latency, 100% offline-ready

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.8;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Convert note name and octave into frequency (e.g., C4 = 261.63 Hz)
  public noteToFreq(note: string, octave: number = 4): number {
    const noteMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11
    };
    const semitone = noteMap[note] ?? 0;
    const midi = (octave + 1) * 12 + semitone;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Play a warm acoustic / Rhodes tone
  public playNote(noteName: string, octave: number = 4, duration: number = 1.2, delay: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = this.noteToFreq(noteName, octave);
    const startTime = this.ctx.currentTime + delay;

    // Dual oscillator: fundamental triangle + harmonic sine for warm body
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime); // 1 octave overtone chime

    // Lowpass filter for rounded warm analog paper feel
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    // Natural exponential decay envelope
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.015); // gentle attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Sub oscillator for gentle body
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = 0.2;
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    osc1.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  // Play a full chord with subtle strum delay (25ms between strings)
  public playChord(root: string, intervals: number[], octave: number = 4, strum: boolean = true) {
    const noteMapList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteMapList.indexOf(root);
    if (rootIndex === -1) return;

    intervals.forEach((interval, index) => {
      const semitoneIndex = (rootIndex + interval) % 12;
      const noteName = noteMapList[semitoneIndex];
      const noteOctave = octave + Math.floor((rootIndex + interval) / 12);
      const delay = strum ? index * 0.035 : 0;
      this.playNote(noteName, noteOctave, 1.8, delay);
    });
  }

  // Play metronome click: high wood tick for accent, normal tick for beat
  public playClick(isAccent: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency: 1200Hz for downbeat accent, 800Hz for regular beats
    const freq = isAccent ? 1200 : 750;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.04);

    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }
}

export const sound = new AudioEngine();
