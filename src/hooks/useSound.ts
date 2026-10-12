import { useSyncExternalStore } from 'react';

/* A typewriter, synthesised. Nothing is downloaded: every sound is built from
   one buffer of noise and a few sine oscillators, modelled on the parts of a
   real machine that make noise. A keystroke is three events, not one: the key
   bottoming out, the type bar hitting ribbon, paper and rubber platen a few
   milliseconds later, and the escapement stepping the carriage one space.
   Every value is varied slightly on each stroke, because no two real strikes
   sound the same and identical repeats are what make synthesis sound fake.

   Sound stays off until the visitor turns it on, and the choice is
   remembered per browser. */

type Ctx = BaseAudioContext;
type Voice = (c: Ctx, out: AudioNode, t: number) => void;

const noiseFor = new WeakMap<Ctx, AudioBuffer>();
function noise(c: Ctx) {
  let buf = noiseFor.get(c);
  if (!buf) {
    buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.5), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseFor.set(c, buf);
  }
  return buf;
}

const vary = (v: number, amount: number) => v * (1 + (Math.random() * 2 - 1) * amount);

/* Filtered noise with a fast attack and exponential decay: impacts, clicks,
   the rumble of the carriage and the rustle of paper. */
function hiss(
  c: Ctx,
  out: AudioNode,
  t: number,
  o: { freq: number; dur: number; gain: number; type?: BiquadFilterType; q?: number; to?: number; attack?: number }
) {
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const filter = c.createBiquadFilter();
  filter.type = o.type ?? 'bandpass';
  filter.Q.value = o.q ?? 1;
  filter.frequency.setValueAtTime(o.freq, t);
  if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  const env = c.createGain();
  const attack = o.attack ?? 0.0005;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(o.gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + attack + o.dur);
  src.connect(filter).connect(env).connect(out);
  src.start(t, Math.random() * 0.4);
  src.stop(t + attack + o.dur + 0.02);
}

/* A decaying sine: the ring of a steel part, or the thump of the platen when
   its pitch falls as it does. */
function ring(c: Ctx, out: AudioNode, t: number, o: { freq: number; dur: number; gain: number; to?: number }) {
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(o.freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(o.gain, t + 0.0015);
  env.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + o.dur + 0.02);
}

/* ── The parts of the machine ─────────────────────────────────────────── */

/* The key lever bottoming out under the finger. */
const keyClick: Voice = (c, o, t) =>
  hiss(c, o, t, { type: 'highpass', freq: vary(2800, 0.1), dur: 0.006, gain: vary(0.16, 0.25) });

/* The escapement releasing the carriage to step one space left. */
const escapement: Voice = (c, o, t) => {
  hiss(c, o, t, { freq: vary(5600, 0.08), q: 2.5, dur: 0.004, gain: vary(0.2, 0.2) });
  ring(c, o, t, { freq: vary(4300, 0.05), dur: 0.012, gain: 0.025 });
};

/* The type slug striking ribbon, paper and rubber platen: a sharp clack over
   a low thump, with a short ring from the steel type bar. */
const slam = (c: Ctx, o: AudioNode, t: number, weight: number) => {
  // Most of a strike's energy sits between 1 and 5 kHz; the platen thump
  // underneath is felt more than heard, and too much of it turns a crisp
  // "tack" into a thud.
  hiss(c, o, t, { freq: vary(3000, 0.12), q: 0.6, dur: vary(0.02, 0.2), gain: 0.6 * weight });
  hiss(c, o, t, { type: 'highpass', freq: 4500, dur: 0.008, gain: 0.3 * weight });
  hiss(c, o, t, { type: 'lowpass', freq: 700, dur: 0.02, gain: 0.12 * weight });
  ring(c, o, t, { freq: vary(150, 0.08), to: 95, dur: 0.035, gain: 0.1 * weight });
  ring(c, o, t, { freq: vary(1870, 0.04), dur: vary(0.05, 0.3), gain: 0.05 });
  ring(c, o, t, { freq: vary(3150, 0.04), dur: vary(0.035, 0.3), gain: 0.035 });
  ring(c, o, t, { freq: vary(4890, 0.04), dur: 0.02, gain: 0.02 });
};

/* The whole type basket dropping for a capital letter. */
const shiftClunk: Voice = (c, o, t) => {
  ring(c, o, t, { freq: vary(95, 0.06), to: 70, dur: 0.06, gain: 0.18 });
  hiss(c, o, t, { type: 'lowpass', freq: 500, dur: 0.03, gain: 0.2 });
};

export const voices: Record<string, Voice> = {
  key(c, o, t) {
    keyClick(c, o, t);
    const bar = t + vary(0.012, 0.25);
    slam(c, o, bar, vary(1, 0.15));
    escapement(c, o, bar + vary(0.022, 0.2));
  },

  /* A capital: the basket shifts first, then the strike lands a touch heavier. */
  shiftKey(c, o, t) {
    shiftClunk(c, o, t);
    keyClick(c, o, t + 0.02);
    const bar = t + vary(0.034, 0.15);
    slam(c, o, bar, vary(1.15, 0.1));
    escapement(c, o, bar + vary(0.024, 0.2));
  },

  /* The space bar strikes nothing; it is a wide bar and the escapement. */
  space(c, o, t) {
    keyClick(c, o, t);
    hiss(c, o, t, { type: 'lowpass', freq: 900, dur: 0.025, gain: 0.3 });
    hiss(c, o, t + 0.004, { freq: 1600, q: 0.8, dur: 0.012, gain: 0.18 });
    ring(c, o, t, { freq: vary(115, 0.08), to: 80, dur: 0.035, gain: 0.16 });
    escapement(c, o, t + vary(0.03, 0.2));
  },

  /* Backspace walks the carriage back one step: a clunk and no strike. */
  back(c, o, t) {
    keyClick(c, o, t);
    ring(c, o, t + 0.01, { freq: vary(170, 0.08), to: 110, dur: 0.035, gain: 0.24 });
    hiss(c, o, t + 0.012, { freq: 4200, q: 2, dur: 0.004, gain: 0.14 });
  },

  /* Carriage return: the line-space lever ratchets the platen up a line, the
     carriage slides back along its rails, and it knocks into the margin stop. */
  carriage(c, o, t) {
    for (let i = 0; i < 3; i++) {
      hiss(c, o, t + i * vary(0.024, 0.1), { freq: vary(3600, 0.08), q: 4, dur: 0.005, gain: 0.16 });
    }
    ring(c, o, t + 0.01, { freq: 260, to: 180, dur: 0.03, gain: 0.1 });
    hiss(c, o, t + 0.08, { freq: 1500, to: 520, q: 1.1, dur: 0.3, gain: 0.13, attack: 0.04 });
    hiss(c, o, t + 0.08, { type: 'lowpass', freq: 300, dur: 0.3, gain: 0.08, attack: 0.05 });
    const stop = t + vary(0.36, 0.05);
    hiss(c, o, stop, { freq: 1800, q: 0.8, dur: 0.02, gain: 0.38 });
    ring(c, o, stop, { freq: 120, to: 80, dur: 0.08, gain: 0.48 });
    ring(c, o, stop, { freq: 1430, dur: 0.06, gain: 0.04 });
  },

  /* The margin bell, a few characters before the end of a line. A small struck
     bell has inharmonic partials, not octaves, and a second mode a hair sharp
     of the first makes the slow beating a real bell has. */
  bell(c, o, t) {
    const f = vary(2650, 0.01);
    hiss(c, o, t, { type: 'highpass', freq: 4000, dur: 0.003, gain: 0.08 });
    ring(c, o, t, { freq: f, dur: 1.6, gain: 0.2 });
    ring(c, o, t, { freq: f * 1.004, dur: 1.3, gain: 0.07 });
    ring(c, o, t, { freq: f * 2.52, dur: 0.9, gain: 0.08 });
    ring(c, o, t, { freq: f * 4.04, dur: 0.5, gain: 0.04 });
    ring(c, o, t, { freq: f * 5.86, dur: 0.3, gain: 0.025 });
  },

  /* The sheet ratcheted out of the platen when the letter is finished. */
  pull(c, o, t) {
    let at = t;
    for (let i = 0; i < 14; i++) {
      hiss(c, o, at, { freq: vary(3000 + i * 70, 0.05), q: 3, dur: 0.005, gain: vary(0.38, 0.2) });
      at += 0.03 - i * 0.0012;
    }
    hiss(c, o, t + 0.05, { type: 'highpass', freq: 2500, dur: 0.4, gain: 0.1, attack: 0.08 });
  },

  /* A rubber stamp pressed onto the envelope. */
  stamp(c, o, t) {
    ring(c, o, t, { freq: vary(85, 0.05), to: 60, dur: 0.1, gain: 0.48 });
    hiss(c, o, t, { type: 'lowpass', freq: 800, dur: 0.05, gain: 0.32 });
    hiss(c, o, t, { freq: 2500, q: 0.8, dur: 0.02, gain: 0.1 });
  },
};

/* ── Live playback ───────────────────────────────────────────────────── */

const STORAGE_KEY = 'sound';

let enabled = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
})();

const listeners = new Set<() => void>();

let ctx: AudioContext | null = null;
let bus: GainNode | null = null;

/* A short, dark room response: dry synthesis sounds like it is inside your
   head, and a few tens of milliseconds of reflection put it on a desk. */
function room(c: Ctx) {
  const len = Math.floor(c.sampleRate * 0.4);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.06)) * (1 - i / len);
    }
  }
  return buf;
}

function live() {
  if (!enabled || typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    // Fast typing stacks strikes on top of each other; the compressor keeps a
    // burst from clipping without flattening single keystrokes.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    comp.attack.value = 0.002;
    comp.release.value = 0.08;
    const master = ctx.createGain();
    master.gain.value = 0.85;
    comp.connect(master).connect(ctx.destination);
    const verb = ctx.createConvolver();
    verb.buffer = room(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.14;
    verb.connect(wet).connect(comp);
    bus = ctx.createGain();
    bus.connect(comp);
    bus.connect(verb);
  }
  // A context created outside a click starts suspended; the next keystroke or
  // click is a user gesture, so resuming here brings it back.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function play(voice: Voice) {
  const c = live();
  if (c && bus) voice(c, bus, c.currentTime + 0.005);
}

export const sound = {
  key: () => play(voices.key),
  shiftKey: () => play(voices.shiftKey),
  space: () => play(voices.space),
  back: () => play(voices.back),
  carriage: () => play(voices.carriage),
  bell: () => play(voices.bell),
  pull: () => play(voices.pull),
  stamp: () => play(voices.stamp),
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false
  );
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    /* Private windows can refuse storage; the choice still holds this visit. */
  }
  if (on) live();
  listeners.forEach((l) => l());
}
