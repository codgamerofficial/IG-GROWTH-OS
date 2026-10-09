// =============================================================================
// PujaHop Kolkata: Procedural Dhaak Beats & Festive Soundscape Engine
// Web Audio API Procedural Synthesis • Zero-Bandwidth Offline Rhythms
// Authentic Dhaak, Kanshi, Conch Shell (Shonkho) & Temple Bells
// =============================================================================

export type SoundscapeRhythmId =
  | 'ashtami_dhaak'
  | 'dhunuchi_naach'
  | 'sandhya_aarti'
  | 'kashful_breeze';

export interface SoundscapeRhythm {
  id: SoundscapeRhythmId;
  title: string;
  title_bn: string;
  description: string;
  defaultBpm: number;
}

export const SOUNDSCAPE_RHYTHMS: SoundscapeRhythm[] = [
  {
    id: 'ashtami_dhaak',
    title: 'Maha Ashtami Dhaaker Bol',
    title_bn: 'মহাষ্টমীর ঢাকের বোল',
    description: 'Iconic heavy resonance and metallic kanshi rhythms echoing through the pandal courtyard.',
    defaultBpm: 104,
  },
  {
    id: 'dhunuchi_naach',
    title: 'Dhunuchi Naach Frenzy',
    title_bn: 'ধুনুচি নাচের বোল',
    description: 'High-octane accelerando 6/8 folk rhythm accompanying dancing clay incense burners.',
    defaultBpm: 132,
  },
  {
    id: 'sandhya_aarti',
    title: 'Sandhya Aarti & Shonkho Dhwani',
    title_bn: 'সন্ধ্যা আরতি ও শাঁখের ধ্বনি',
    description: 'Reverent evening lamp ceremony with conch horn drone, brass bells, and rhythmic percussion.',
    defaultBpm: 84,
  },
  {
    id: 'kashful_breeze',
    title: 'Autumn Kashful Ambiance',
    title_bn: 'শরতের কাশফুলের দোলা',
    description: 'Gentle festive autumn acoustic drone with brass bells and soothing temple chimes.',
    defaultBpm: 70,
  },
];

class FestiveSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private currentRhythmId: SoundscapeRhythmId = 'ashtami_dhaak';
  private bpm = 104;
  private volume = 0.55;
  private timerId: number | null = null;
  private step = 0;

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;

    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  // Synthesis: Deep Dhaak Bass Thud (Dhaang)
  private playDhaakBass(time: number, velocity = 1.0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(145, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.12);

    gain.gain.setValueAtTime(velocity * 0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Synthesis: Dhaak High Rim Slap (Kash)
  private playDhaakRim(time: number, velocity = 0.8) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.Q.setValueAtTime(3.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.07);
  }

  // Synthesis: Bronze Kanshi Bell (Tring)
  private playKanshi(time: number, velocity = 0.7) {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(1920, time);
    osc2.frequency.setValueAtTime(2840, time);

    gain.gain.setValueAtTime(velocity * 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.26);
    osc2.stop(time + 0.26);
  }

  // Synthesis: Conch Shell Drone (Shonkho)
  private playConch(time: number, duration = 1.6) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(262, time);
    osc.frequency.linearRampToValueAtTime(272, time + duration * 0.6);
    osc.frequency.linearRampToValueAtTime(260, time + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, time);
    filter.Q.setValueAtTime(4.0, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.3);
    gain.gain.linearRampToValueAtTime(0.25, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Synthesis: Brass Temple Bell (Ghanta)
  private playTempleBell(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const freqs = [1150, 1720, 2450];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2 / (idx + 1), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      osc.stop(time + 0.65);
    });
  }

  // Step Scheduler
  private scheduleStep() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const s = this.step;

    if (this.currentRhythmId === 'ashtami_dhaak') {
      // 16-step classic Dhaak pattern
      const p = s % 16;
      if (p === 0 || p === 6 || p === 10) this.playDhaakBass(now, 1.0);
      if (p === 2 || p === 8 || p === 14) this.playDhaakRim(now, 0.85);
      if (p === 4 || p === 12) this.playKanshi(now, 0.7);
      if (p === 15) this.playDhaakBass(now, 0.6);
    } else if (this.currentRhythmId === 'dhunuchi_naach') {
      // Fast 12-step 6/8 groove
      const p = s % 12;
      if (p === 0 || p === 3 || p === 6 || p === 9) this.playDhaakBass(now, 1.0);
      if (p === 1 || p === 4 || p === 7 || p === 10) this.playDhaakRim(now, 0.7);
      if (p === 2 || p === 5 || p === 8 || p === 11) this.playKanshi(now, 0.8);
      if (p === 0 && Math.random() > 0.7) this.playTempleBell(now);
    } else if (this.currentRhythmId === 'sandhya_aarti') {
      // Reverent 16-step evening aarti
      const p = s % 16;
      if (p === 0) this.playConch(now, 1.8);
      if (p % 4 === 0) this.playTempleBell(now);
      if (p % 2 === 0) this.playKanshi(now, 0.5);
      if (p === 4 || p === 12) this.playDhaakBass(now, 0.6);
    } else if (this.currentRhythmId === 'kashful_breeze') {
      // Soothing autumn atmospheric chimes
      const p = s % 16;
      if (p === 0 || p === 8) this.playTempleBell(now);
      if (p === 4 || p === 12) this.playKanshi(now, 0.3);
      if (p === 0 && Math.random() > 0.5) this.playConch(now, 2.2);
    }

    this.step = (this.step + 1) % 64;

    const stepInterval = (60 / this.bpm) / 4 * 1000;
    this.timerId = window.setTimeout(() => this.scheduleStep(), stepInterval);
  }

  public async start(rhythmId?: SoundscapeRhythmId) {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (rhythmId) {
      this.currentRhythmId = rhythmId;
      const found = SOUNDSCAPE_RHYTHMS.find((r) => r.id === rhythmId);
      if (found) this.bpm = found.defaultBpm;
    }

    this.isPlaying = true;
    this.step = 0;
    this.scheduleStep();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(rhythmId?: SoundscapeRhythmId) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start(rhythmId);
    }
    return this.isPlaying;
  }

  public setRhythm(rhythmId: SoundscapeRhythmId) {
    this.currentRhythmId = rhythmId;
    const found = SOUNDSCAPE_RHYTHMS.find((r) => r.id === rhythmId);
    if (found) this.bpm = found.defaultBpm;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setBpm(val: number) {
    this.bpm = Math.max(50, Math.min(180, val));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentRhythmId(): SoundscapeRhythmId {
    return this.currentRhythmId;
  }

  public getBpm(): number {
    return this.bpm;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const soundscapeEngine = new FestiveSoundscapeEngine();
