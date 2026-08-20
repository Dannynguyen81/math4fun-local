import type { ElementName } from "@/game/gameData";

type MagicSfxMode = "ready" | "cast" | "counter";

type ElementTone = { primary: OscillatorType; start: number; end: number; accent: number; duration: number };

const TONES: Record<ElementName, ElementTone> = {
  "sấm": { primary: "sawtooth", start: 170, end: 830, accent: 1240, duration: 0.32 },
  "lửa": { primary: "square", start: 420, end: 130, accent: 690, duration: 0.28 },
  "nước": { primary: "sine", start: 260, end: 510, accent: 180, duration: 0.45 },
  "độc": { primary: "triangle", start: 180, end: 105, accent: 235, duration: 0.5 },
  "gió": { primary: "triangle", start: 300, end: 620, accent: 790, duration: 0.42 },
  "đất": { primary: "square", start: 118, end: 62, accent: 82, duration: 0.38 },
};

/** Plays short synthesized effects only after a player interaction; no remote audio is fetched. */
export function playElementSound(element: ElementName, enabled: boolean, mode: MagicSfxMode = "cast") {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const tone = TONES[element];
  const now = context.currentTime;
  const multiplier = mode === "counter" ? 0.62 : mode === "ready" ? 0.78 : 1;
  const length = tone.duration * (mode === "counter" ? 0.78 : 1);
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.065 * multiplier, now + 0.035);
  master.gain.exponentialRampToValueAtTime(0.0001, now + length);
  master.connect(context.destination);

  const addTone = (start: number, end: number, type: OscillatorType, offset = 0, gain = 1) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(24, start), now + offset);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(24, end), now + offset + Math.max(0.08, length - offset));
    envelope.gain.setValueAtTime(0.0001, now + offset);
    envelope.gain.exponentialRampToValueAtTime(gain, now + offset + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(now + offset);
    oscillator.stop(now + length + 0.03);
  };

  addTone(tone.start * multiplier, tone.end * multiplier, tone.primary, 0, 0.95);
  addTone(tone.accent * multiplier, tone.accent * 0.72 * multiplier, element === "nước" || element === "gió" ? "sine" : "triangle", 0.07, 0.36);
  if (element === "sấm") addTone(90, 56, "sawtooth", 0.02, 0.35);
  if (element === "đất") addTone(72, 52, "square", 0.12, 0.42);
  if (element === "độc") addTone(250, 155, "sine", 0.14, 0.25);
  void context.resume?.();
  window.setTimeout(() => void context.close?.(), (length + 0.18) * 1000);
}

/**
 * Local-only training-technique sound. Each unlocked level adds a short extra
 * synthesized layer, so the audible result grows with the Guardian technique.
 */
export function playTechniqueSound(element: ElementName, techniqueLevel: number, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const now = context.currentTime;
  const tone = TONES[element];
  const level = Math.min(4, Math.max(1, Math.floor(techniqueLevel)));
  // Technique layers are intentionally softer and shorter than the main cast cue:
  // cast → brief travel → technique impact, rather than two competing sounds.
  const duration = 0.22 + level * 0.085;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.042 + level * 0.007, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  master.connect(context.destination);

  const addPulse = (start: number, end: number, offset: number, type: OscillatorType, gain: number) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(38, start), now + offset);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(38, end), now + offset + Math.max(0.1, duration - offset - 0.04));
    envelope.gain.setValueAtTime(0.0001, now + offset);
    envelope.gain.exponentialRampToValueAtTime(gain, now + offset + 0.024);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, offset + 0.2));
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(now + offset);
    oscillator.stop(now + duration + 0.04);
  };

  const intervals = [1, 1.16, 1.34, 1.56];
  intervals.slice(0, level).forEach((interval, index) => {
    const offset = index * 0.095;
    const oscillator = index === 0 ? tone.primary : index === 3 ? "sine" : "triangle";
    addPulse(tone.start * interval, tone.end * (1 + index * 0.06), offset, oscillator, index === 0 ? 0.72 : 0.2 + index * 0.045);
  });
  if (level >= 3) addPulse(tone.accent * 0.72, tone.accent * 1.22, 0.18, "sine", 0.18);
  if (level === 4) addPulse(tone.accent * 1.08, tone.accent * 0.56, 0.3, "square", 0.2);
  void context.resume?.();
  window.setTimeout(() => void context.close?.(), (duration + 0.2) * 1000);
}

/** Boss-only result cue: a compact confirmation or warning that sits above the battle loop. */
export function playBossResultSound(correct: boolean, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context(); const now = context.currentTime;
  const master = context.createGain(); master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(0.052, now + 0.02); master.gain.exponentialRampToValueAtTime(0.0001, now + 0.32); master.connect(context.destination);
  const notes = correct ? [523, 659] : [185, 139];
  notes.forEach((frequency, index) => { const oscillator = context.createOscillator(); const envelope = context.createGain(); const start = now + index * 0.09; oscillator.type = correct ? "sine" : "triangle"; oscillator.frequency.setValueAtTime(frequency, start); oscillator.frequency.exponentialRampToValueAtTime(correct ? frequency * 1.06 : frequency * 0.78, start + 0.16); envelope.gain.setValueAtTime(0.0001, start); envelope.gain.exponentialRampToValueAtTime(index === 0 ? 0.82 : 0.58, start + 0.018); envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.2); oscillator.connect(envelope); envelope.connect(master); oscillator.start(start); oscillator.stop(start + 0.23); });
  void context.resume?.(); window.setTimeout(() => void context.close?.(), 560);
}

/** A heavier, low-pitched counterstrike that signals the Boss attack without overpowering dialogue. */
export function playBossAttackSound(element: ElementName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context(); const now = context.currentTime; const tone = TONES[element];
  const master = context.createGain(); master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(0.07, now + 0.025); master.gain.exponentialRampToValueAtTime(0.0001, now + 0.38); master.connect(context.destination);
  [tone.start * 0.48, tone.accent * 0.32].forEach((frequency, index) => { const oscillator = context.createOscillator(); const envelope = context.createGain(); const start = now + index * 0.055; oscillator.type = index === 0 ? "sawtooth" : "triangle"; oscillator.frequency.setValueAtTime(Math.max(40, frequency), start); oscillator.frequency.exponentialRampToValueAtTime(Math.max(32, frequency * 0.5), start + 0.28); envelope.gain.setValueAtTime(0.0001, start); envelope.gain.exponentialRampToValueAtTime(index === 0 ? 0.7 : 0.35, start + 0.02); envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.32); oscillator.connect(envelope); envelope.connect(master); oscillator.start(start); oscillator.stop(start + 0.35); });
  void context.resume?.(); window.setTimeout(() => void context.close?.(), 620);
}

/** A short, local-only three-note fanfare for a newly reached elemental level. */
export function playElementLevelUpSound(element: ElementName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const now = context.currentTime;
  const root = Math.max(220, Math.min(440, TONES[element].accent * 0.56));
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.09, now + 0.035);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.88);
  master.connect(context.destination);
  [1, 1.25, 1.5].forEach((interval, index) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = now + index * 0.16;
    oscillator.type = index === 2 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(root * interval, start);
    oscillator.frequency.exponentialRampToValueAtTime(root * interval * 1.04, start + 0.28);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(index === 2 ? 0.85 : 0.55, start + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.38);
  });
  void context.resume?.();
  window.setTimeout(() => void context.close?.(), 1150);
}

/** Local-only five-note fanfare that marks every fifth consecutive correct answer. */
export function playFiveStreakSound(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Context = window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.11, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);
  master.connect(context.destination);
  [392, 494, 587, 784, 988].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = now + index * 0.115;
    oscillator.type = index === 4 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(index === 4 ? 0.9 : 0.54, start + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.31);
  });
  void context.resume?.();
  window.setTimeout(() => void context.close?.(), 1180);
}
