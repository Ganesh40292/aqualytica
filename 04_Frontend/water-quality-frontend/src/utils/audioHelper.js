// Web Audio API Synthesizer Helper
// Dynamically creates droplet and alert chimes on-the-fly.

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Synthesizes a clean, high-frequency water droplet splash chime.
 */
export const playSplashChime = () => {
  if (localStorage.getItem("wqms-audio-enabled") === "false") return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Osc 1: The bubble "pop" (ascending pitch)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    // Rapid sweep upwards simulates the surface tension pop of a drop
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
    
    // Osc 2: The splash resonance (reverberation drop)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(800, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.08);
      
      gainNode2.gain.setValueAtTime(0, ctx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.2);
    }, 70);
    
  } catch (err) {
    console.warn("Audio Context blocked or unsupported:", err);
  }
};

/**
 * Synthesizes a cautionary dual-tone pulsed alarm.
 */
export const playWarningChime = () => {
  if (localStorage.getItem("wqms-audio-enabled") === "false") return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // First Beep
    const playBeep = (startTime, duration) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, startTime);
      
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(225, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      // Filter out harsh highs for a cleaner industrial sound
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, startTime);
      
      osc.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(ctx.destination);
      
      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    // Double beep pattern
    playBeep(now, 0.2);
    playBeep(now + 0.25, 0.3);
    
  } catch (err) {
    console.warn("Audio Context blocked or unsupported:", err);
  }
};
