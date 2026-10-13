import { useSyncExternalStore } from 'react';

/* A real typewriter. Every sound here is a recording of a Hermes Precisa 305
   from BigSoundBank, released CC0 (public domain): sounds 1065 and 2842 for
   the keys, 2843 for the space bar, 2844 for the margin bell, and two
   carriage returns cut from 2835. Synthesis came out glassy no matter how it
   was tuned; a recorded type bar hitting a platen does not.

   The clips sit in one small sprite that is only fetched once the visitor
   turns sound on. Each strike picks a different key recording than the last
   and nudges its pitch and level, so a run of letters never repeats exactly. */

const SPRITE_URL = '/sounds/typewriter.mp3';

type Kind = 'key' | 'space' | 'bell' | 'carriage';

/* Where each clip sits in the sprite, in seconds. Generated with the sprite;
   keep the two in step if the file is ever rebuilt. */
const SLOTS: [Kind, number, number][] = [
  ['key', 0.15, 0.31],
  ['key', 0.61, 0.31],
  ['key', 1.07, 0.31],
  ['key', 1.53, 0.31],
  ['key', 1.99, 0.31],
  ['key', 2.45, 0.31],
  ['key', 2.91, 0.31],
  ['key', 3.37, 0.31],
  ['key', 3.83, 0.31],
  ['key', 4.29, 0.31],
  ['key', 4.75, 0.31],
  ['key', 5.21, 0.31],
  ['key', 5.67, 0.31],
  ['space', 6.13, 0.36],
  ['bell', 6.64, 1.75],
  ['carriage', 8.54, 1.5],
  ['carriage', 10.19, 1.6],
];

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
let sprite: AudioBuffer | null = null;
let loading = false;
// MP3 encoders pad the start of a file with a few milliseconds of silence,
// and decoders differ on whether they strip it. The real offset is measured
// from the decoded audio instead of trusted.
let shift = 0;

function measureShift(buf: AudioBuffer) {
  const data = buf.getChannelData(0);
  const sr = buf.sampleRate;
  const first = SLOTS[0][1];
  const from = Math.max(0, Math.floor((first - 0.12) * sr));
  const to = Math.min(data.length, Math.floor((first + 0.12) * sr));
  for (let i = from; i < to; i++) {
    if (Math.abs(data[i]) > 0.02) return i / sr - (first + 0.003);
  }
  return 0;
}

function load(c: AudioContext) {
  if (sprite || loading) return;
  loading = true;
  fetch(SPRITE_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.arrayBuffer();
    })
    .then((data) => c.decodeAudioData(data))
    .then((buf) => {
      shift = measureShift(buf);
      sprite = buf;
    })
    .catch(() => {
      /* Stay silent; the next keystroke after sound is toggled tries again. */
    })
    .finally(() => {
      loading = false;
    });
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
    comp.threshold.value = -14;
    comp.ratio.value = 3;
    comp.attack.value = 0.003;
    comp.release.value = 0.1;
    bus = ctx.createGain();
    bus.gain.value = 0.9;
    bus.connect(comp).connect(ctx.destination);
  }
  // A context created outside a click starts suspended; the next keystroke or
  // click is a user gesture, so resuming here brings it back.
  if (ctx.state === 'suspended') void ctx.resume();
  load(ctx);
  return ctx;
}

const vary = (v: number, amount: number) => v * (1 + (Math.random() * 2 - 1) * amount);
const lastOf: Partial<Record<Kind, number>> = {};

function pick(kind: Kind) {
  const options = SLOTS.map((s, i) => [s, i] as const).filter(([s]) => s[0] === kind);
  let choice = options[Math.floor(Math.random() * options.length)];
  if (options.length > 1 && choice[1] === lastOf[kind]) {
    choice = options[(options.indexOf(choice) + 1) % options.length];
  }
  lastOf[kind] = choice[1];
  return choice[0];
}

function play(kind: Kind, o: { rate?: number; gain?: number; lowpass?: number; delay?: number } = {}) {
  const c = live();
  if (!c || !bus || !sprite) return;
  const [, start, dur] = pick(kind);
  const src = c.createBufferSource();
  src.buffer = sprite;
  src.playbackRate.value = o.rate ?? 1;
  const level = c.createGain();
  level.gain.value = o.gain ?? 1;
  if (o.lowpass) {
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = o.lowpass;
    src.connect(filter).connect(level);
  } else {
    src.connect(level);
  }
  level.connect(bus);
  src.start(c.currentTime + (o.delay ?? 0), Math.max(0, start + shift), dur);
}

export const sound = {
  key: () => play('key', { rate: vary(1, 0.03), gain: vary(1, 0.15) }),
  /* A capital drops the whole type basket first, so it lands heavier and a
     touch lower. */
  shiftKey: () => play('key', { rate: vary(0.92, 0.02), gain: vary(1.15, 0.08) }),
  space: () => play('space', { rate: vary(1, 0.03), gain: vary(1, 0.1) }),
  /* Backspace walks the carriage back a step and strikes nothing: a duller,
     quieter clunk than a letter. */
  back: () => play('key', { rate: vary(0.82, 0.03), gain: 0.55, lowpass: 1400 }),
  carriage: () => play('carriage', { rate: vary(1, 0.02) }),
  bell: () => play('bell', { rate: vary(1, 0.01), gain: 0.9 }),
  /* The sheet ratcheted out of the platen: the return's ratchet, quicker. */
  pull: () => play('carriage', { rate: 1.3, gain: 0.8 }),
  /* A rubber stamp: a key strike slowed right down and stripped of its click
     becomes a soft thud. */
  stamp: () => play('key', { rate: 0.5, gain: 1.3, lowpass: 600 }),
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
