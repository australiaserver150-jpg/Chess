
class SoundService {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public getEnabled() {
    return this.enabled;
  }

  private async resumeContext() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public playMove() {
    if (!this.enabled || !this.context) return;
    this.resumeContext();
    
    const t = this.context.currentTime;
    
    // Short buffer for a tight, professional sound (no long tails)
    const duration = 0.1;
    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Layer 1: The "Crisp" Contact
    // Starts high to define the "touch", decays instantly.
    const source1 = this.context.createBufferSource();
    source1.buffer = buffer;
    
    const filter1 = this.context.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(3000, t);
    filter1.frequency.exponentialRampToValueAtTime(100, t + 0.04);
    filter1.Q.value = 0.5; // Very dry, no ringing/echo
    
    const gain1 = this.context.createGain();
    gain1.gain.setValueAtTime(0.25, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

    source1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.context.destination);
    source1.start(t);

    // Layer 2: The "Soft Wood" Body
    // Lower frequency for the weight, slight attack to simulate "sliding/soft" landing.
    const source2 = this.context.createBufferSource();
    source2.buffer = buffer;
    
    const filter2 = this.context.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(500, t);
    filter2.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    filter2.Q.value = 0.6; // Low resonance to ensure "no echo"
    
    const gain2 = this.context.createGain();
    // 10ms attack softens the blow (less mechanical click, more wood feel)
    gain2.gain.setValueAtTime(0, t); 
    gain2.gain.linearRampToValueAtTime(0.8, t + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    source2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(this.context.destination);
    source2.start(t);
  }

  public playCapture() {
    if (!this.enabled || !this.context) return;
    this.resumeContext();
    // Louder, sharper "crack" for capture
    this.playClick(800, 1, 0.08, 0.7); 
  }

  public playCheck() {
    if (!this.enabled || !this.context) return;
    this.resumeContext();
    
    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.4);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Generic game end (Draw, Stalemate)
  public playDrawSound() {
    if (!this.enabled || !this.context) return;
    this.resumeContext();
    const t = this.context.currentTime;

    // Simple, neutral chord
    [400, 500, 600].forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.connect(gain);
      gain.connect(this.context!.destination);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  // WIN: Fanfare + Applause + Pops
  public playWinSound() {
    if (!this.enabled || !this.context) return;
    this.resumeContext();
    
    const t = this.context.currentTime;
    
    // 1. Victory Fanfare (Bright, Ascending)
    this.playVictoryFanfare(t);
    
    // 2. Applause (Crowd clapping)
    this.playApplause(t + 0.4, 4); // Start slightly after fanfare, last 4s
    
    // 3. Party Pops / Corks
    this.playCelebrationPops(t);
  }

  private playVictoryFanfare(startTime: number) {
    // C Major 9th Arpeggio, fast and bright
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; 
    
    notes.forEach((freq, i) => {
        const osc = this.context!.createOscillator();
        const gain = this.context!.createGain();
        
        // Triangle wave for a brighter, trumpet-like tone
        osc.type = 'triangle'; 
        osc.frequency.value = freq;
        
        const noteStart = startTime + i * 0.08;
        
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 2.0);
        
        osc.connect(gain);
        gain.connect(this.context!.destination);
        
        osc.start(noteStart);
        osc.stop(noteStart + 2.0);
    });
  }

  private playApplause(startTime: number, duration: number) {
    // Generate a single buffer of noise to reuse
    const bufferSize = this.context!.sampleRate * 0.2; // 200ms burst per clap
    const buffer = this.context!.createBuffer(1, bufferSize, this.context!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
    }

    // Create a density of claps over the duration
    const totalClaps = duration * 15; // 15 "beats" per second approx

    for (let i = 0; i < totalClaps; i++) {
         const time = startTime + (Math.random() * duration);
         // Bunch claps slightly to simulate rhythm or chaotic crowd
         // Create multiple "hands" for this timestamp
         const hands = 1 + Math.floor(Math.random() * 3); 
         for (let h=0; h<hands; h++) {
             this.triggerClapBurst(time + (Math.random() * 0.05), buffer);
         }
    }
  }

  private triggerClapBurst(time: number, buffer: AudioBuffer) {
      const source = this.context!.createBufferSource();
      source.buffer = buffer;
      
      const filter = this.context!.createBiquadFilter();
      filter.type = 'bandpass';
      // Vary center frequency to simulate different hand sizes
      filter.frequency.value = 800 + Math.random() * 600; 
      filter.Q.value = 1;

      const gain = this.context!.createGain();
      gain.gain.setValueAtTime(0, time);
      // Fast attack, fast decay
      const vol = 0.05 + Math.random() * 0.05;
      gain.gain.linearRampToValueAtTime(vol, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.context!.destination);
      
      source.start(time);
  }

  private playCelebrationPops(startTime: number) {
      // 5-6 pops scattered
      for(let i=0; i<6; i++) {
          const time = startTime + 0.2 + (Math.random() * 1.5);
          const osc = this.context!.createOscillator();
          const gain = this.context!.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600 + Math.random() * 200, time);
          osc.frequency.exponentialRampToValueAtTime(100, time + 0.1); // Pitch drop pop
          
          gain.gain.setValueAtTime(0.1, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
          
          osc.connect(gain);
          gain.connect(this.context!.destination);
          
          osc.start(time);
          osc.stop(time + 0.1);
      }
  }

  // Generic helper for mechanical clicks
  private playClick(filterFreq: number, q: number, duration: number, volume: number = 0.5) {
    if (!this.context) return;
    const t = this.context.currentTime;
    
    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);
    filter.Q.value = q;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    noise.start(t);
  }
}

export const soundService = new SoundService();
