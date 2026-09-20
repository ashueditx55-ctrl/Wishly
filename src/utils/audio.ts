/**
 * Gentle Web Audio Synthesizer for birthday interactive feedback
 * Uses native Web Audio API oscillators and gain envelopes without external files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playKeyTapSound(frequency = 520) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Graceful fallback if audio is blocked
  }
}

export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

export function playUnlockSuccessSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + index * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.42);
    });
  } catch {}
}

export function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    // Soft air breath simulation + bell
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.4);

    // Followed by sweet chime
    setTimeout(() => {
      playKeyTapSound(880);
    }, 200);
  } catch {}
}

// Gentle birthday music box melody player
let melodyTimeout: NodeJS.Timeout | null = null;
let isMelodyPlaying = false;

const BIRTHDAY_NOTES = [
  // Happy Birthday to you
  { note: 261.63, dur: 0.35 }, // C4
  { note: 261.63, dur: 0.35 }, // C4
  { note: 293.66, dur: 0.7 },  // D4
  { note: 261.63, dur: 0.7 },  // C4
  { note: 349.23, dur: 0.7 },  // F4
  { note: 329.63, dur: 1.2 },  // E4

  // Happy Birthday to you
  { note: 261.63, dur: 0.35 },
  { note: 261.63, dur: 0.35 },
  { note: 293.66, dur: 0.7 },
  { note: 261.63, dur: 0.7 },
  { note: 392.00, dur: 0.7 },  // G4
  { note: 349.23, dur: 1.2 },  // F4

  // Happy Birthday dear friend
  { note: 261.63, dur: 0.35 },
  { note: 261.63, dur: 0.35 },
  { note: 523.25, dur: 0.7 },  // C5
  { note: 440.00, dur: 0.7 },  // A4
  { note: 349.23, dur: 0.7 },  // F4
  { note: 329.63, dur: 0.7 },  // E4
  { note: 293.66, dur: 1.0 },  // D4

  // Happy Birthday to you
  { note: 466.16, dur: 0.35 }, // Bb4
  { note: 466.16, dur: 0.35 },
  { note: 440.00, dur: 0.7 },  // A4
  { note: 349.23, dur: 0.7 },  // F4
  { note: 392.00, dur: 0.7 },  // G4
  { note: 349.23, dur: 1.5 },  // F4
];

export function toggleBirthdayMusic(startCallback?: (playing: boolean) => void) {
  if (isMelodyPlaying) {
    stopBirthdayMusic();
    startCallback?.(false);
    return false;
  } else {
    playBirthdayMusicLoop();
    startCallback?.(true);
    return true;
  }
}

export function stopBirthdayMusic() {
  isMelodyPlaying = false;
  if (melodyTimeout) {
    clearTimeout(melodyTimeout);
    melodyTimeout = null;
  }
}

export function isMusicActive(): boolean {
  return isMelodyPlaying;
}

function playBirthdayMusicLoop() {
  isMelodyPlaying = true;
  try {
    const ctx = getAudioContext();
    let currentDelay = 0;

    BIRTHDAY_NOTES.forEach((step) => {
      const noteTime = ctx.currentTime + currentDelay;
      currentDelay += step.dur;

      if (!isMelodyPlaying) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Music box bell timbre (sine + faint octave harmonic)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(step.note, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + Math.min(step.dur * 1.5, 1.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + Math.min(step.dur * 1.5, 1.2) + 0.05);
    });

    // Loop after song finishes
    melodyTimeout = setTimeout(() => {
      if (isMelodyPlaying) {
        playBirthdayMusicLoop();
      }
    }, currentDelay * 1000 + 1500);
  } catch {
    isMelodyPlaying = false;
  }
}
