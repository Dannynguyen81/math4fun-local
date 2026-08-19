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
