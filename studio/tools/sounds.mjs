#!/usr/bin/env node
/* The house sound kit, made in code: a few soft effects and a quiet music bed.
   Nothing here is sampled or downloaded, so there is no licence to track. The same code gives the same files every time.

   Usage: node studio/tools/sounds.mjs            writes studio/assets/sounds/*.wav (to listen to them)
   The mix tool calls make() itself, so running this by hand is never required. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RATE, writeWav, samplePeak } from "./audio-lib.mjs";

const SR = RATE, TAU = Math.PI * 2;
const buf = (sec) => new Float32Array(Math.round(sec * SR));
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 * 2 - 1; }; }
const norm = (x, peak = 0.9) => { const m = samplePeak([x]) || 1; for (let i = 0; i < x.length; i++) x[i] *= peak / m; return x; };

// Building blocks. Each adds into `out` starting at `at` seconds.
function tone(out, at, dur, f0, f1, tau, gain, shape = 1) { // sine that glides from f0 to f1 and dies away with time constant tau
  let ph = 0; const s0 = Math.round(at * SR), n = Math.round(dur * SR);
  for (let i = 0; i < n && s0 + i < out.length; i++) { const t = i / SR, k = Math.min(1, t / (dur * shape)), f = f0 + (f1 - f0) * k; ph += (TAU * f) / SR;
    out[s0 + i] += Math.sin(ph) * Math.exp(-t / tau) * Math.min(1, i / 48) * gain; }
}
function hiss(out, at, dur, rand, env, gain, lo = 0, hi = SR / 2, sweep = null) { // noise between `lo` and `hi` Hz, shaped by env(t)
  const s0 = Math.round(at * SR), n = Math.round(dur * SR); let lp = 0, hp = 0, prev = 0;
  for (let i = 0; i < n && s0 + i < out.length; i++) { const t = i / SR, k = t / dur;
    const H = sweep ? sweep(k)[1] : hi, Lo = sweep ? sweep(k)[0] : lo, a = 1 - Math.exp((-TAU * H) / SR), b = 1 - Math.exp((-TAU * Lo) / SR);
    const w = rand(); lp += a * (w - lp); hp += b * (lp - hp); const v = Lo > 0 ? lp - hp : lp; prev = v;
    out[s0 + i] += v * env(t, k) * gain; }
}
const decay = (tau) => (t) => Math.exp(-t / tau) * Math.min(1, t * 2000);
const swell = (t, k) => Math.sin(Math.PI * Math.min(1, k)) ** 2;

/* ---------- effects: { x: samples, anchor: seconds into the file where the hit lands } ---------- */

export const EFFECTS = {
  // rubber stamp on paper
  stamp() { const x = buf(0.4), r = rng(11); tone(x, 0, 0.3, 150, 58, 0.06, 1, 0.3); hiss(x, 0, 0.12, r, decay(0.018), 0.9, 900, 3200); hiss(x, 0, 0.35, r, decay(0.09), 0.5, 0, 420); return { x: norm(x), anchor: 0 }; },
  // big text landing
  slam() { const x = buf(0.8), r = rng(12); tone(x, 0, 0.7, 115, 42, 0.18, 1, 0.25); hiss(x, 0, 0.1, r, decay(0.012), 0.8, 1000, 6000); hiss(x, 0, 0.7, r, decay(0.22), 0.7, 0, 260);
    for (let i = 0; i < x.length; i++) x[i] = Math.tanh(x[i] * 1.6); return { x: norm(x), anchor: 0 }; },
  // cut to a text card: a soft knock
  card() { const x = buf(0.2), r = rng(13); tone(x, 0, 0.18, 230, 140, 0.035, 1, 0.4); hiss(x, 0, 0.05, r, decay(0.008), 0.35, 0, 3000); return { x: norm(x), anchor: 0 }; },
  // chapter card: air drawn in, then a low hit
  chapter() { const x = buf(1.2), r = rng(14), a = 0.42; hiss(x, 0, a, r, (t, k) => k ** 3, 0.5, 0, 0, (k) => [200 + 300 * k, 500 + 1800 * k]);
    tone(x, a, 0.75, 74, 44, 0.3, 1, 0.3); hiss(x, a, 0.7, r, decay(0.25), 0.45, 0, 700); return { x: norm(x), anchor: a }; },
  // a document sliding in
  paper() { const x = buf(0.28), r = rng(15); hiss(x, 0, 0.26, r, swell, 1, 0, 0, (k) => [1800 + 1500 * k, 5000 + 3000 * k]); return { x: norm(x), anchor: 0.08 }; },
  whoosh() { const x = buf(0.5), r = rng(16); hiss(x, 0, 0.48, r, swell, 1, 0, 0, (k) => [300 + 900 * Math.sin(Math.PI * k), 900 + 2600 * Math.sin(Math.PI * k)]); return { x: norm(x), anchor: 0.22 }; },
  ding() { const x = buf(1.0); tone(x, 0, 1.0, 1318.5, 1318.5, 0.35, 1); tone(x, 0, 0.8, 3634, 3634, 0.2, 0.45); tone(x, 0, 0.5, 7125, 7125, 0.09, 0.2); return { x: norm(x), anchor: 0 }; },
  pop() { const x = buf(0.1); tone(x, 0, 0.09, 320, 760, 0.04, 1); return { x: norm(x), anchor: 0 }; },
  tick() { const x = buf(0.05), r = rng(17); tone(x, 0, 0.04, 1600, 1500, 0.008, 1); hiss(x, 0, 0.01, r, decay(0.002), 0.5, 2000, 9000); return { x: norm(x), anchor: 0 }; },
  // tension rising into a cut; the anchor is the end
  riser() { const x = buf(1.6), r = rng(18); hiss(x, 0, 1.6, r, (t, k) => k * k, 1, 0, 0, (k) => [300 + 1500 * k * k, 900 + 5000 * k * k]); tone(x, 0, 1.6, 180, 880, 9, 0.18);
    for (let i = 0; i < x.length; i++) x[i] *= (i / x.length) ** 1.5 * Math.min(1, (x.length - i) / 480); return { x: norm(x), anchor: 1.6 }; },
};

/* ---------- music: one loop in two layers ----------
   `base` is pad, bass and a plucked figure. `drive` is a pulse for the climax; it sits on the same bars, so it can fade in and out anywhere. */

const BPM = 92, BEAT = 60 / BPM, BARS = 16, LOOP = BARS * 4 * BEAT;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
// Two bars per chord, in A minor: root (MIDI), pad notes, pluck notes.
const CHORDS = [
  { root: 45, pad: [57, 60, 64, 71], arp: [69, 72, 76, 79] }, // Am(add9)
  { root: 45, pad: [57, 60, 64, 67], arp: [69, 72, 76, 79] }, // Am7
  { root: 41, pad: [57, 60, 65, 69], arp: [69, 72, 77, 81] }, // F
  { root: 41, pad: [57, 60, 64, 65], arp: [69, 72, 76, 77] }, // Fmaj7
  { root: 48, pad: [55, 60, 64, 67], arp: [67, 72, 76, 79] }, // C
  { root: 48, pad: [55, 60, 64, 69], arp: [67, 72, 76, 81] }, // C6
  { root: 43, pad: [55, 59, 62, 67], arp: [67, 71, 74, 79] }, // G
  { root: 40, pad: [55, 59, 64, 67], arp: [67, 71, 76, 79] }, // Em
];

function wrapAdd(ch, at, note, gain) { const n = ch.length; let i = Math.round(at * SR) % n; if (i < 0) i += n; for (let k = 0; k < note.length; k++) { ch[i] += note[k] * gain; if (++i === n) i = 0; } }
function padNote(f, dur) { const n = Math.round((dur + 1.6) * SR), x = new Float32Array(n), att = 0.9 * SR, rel = 1.6 * SR, hold = dur * SR; let p1 = 0, p2 = 0;
  for (let i = 0; i < n; i++) { p1 += (TAU * f * 1.0023) / SR; p2 += (TAU * f * 0.9977) / SR;
    const e = i < att ? i / att : i < hold ? 1 : Math.max(0, 1 - (i - hold) / rel), w = (p) => Math.sin(p) + 0.28 * Math.sin(2 * p) + 0.1 * Math.sin(3 * p);
    x[i] = (w(p1) + w(p2)) * 0.5 * e * e * (1 + 0.08 * Math.sin((TAU * 0.17 * i) / SR)); }
  return x; }
function pluck(f, dur, bright, rand) { // Karplus-Strong string
  const N = Math.max(2, Math.round(SR / f)), line = new Float32Array(N), n = Math.round(dur * SR), x = new Float32Array(n); let lp = 0;
  for (let i = 0; i < N; i++) { lp += bright * (rand() - lp); line[i] = lp; }
  let j = 0, prev = 0; const damp = 0.996 - 30 / (f * dur * 60 + 3000);
  for (let i = 0; i < n; i++) { const v = line[j]; x[i] = v * Math.min(1, (n - i) / 400); const nx = (v + prev) * 0.5 * damp; prev = v; line[j] = nx; if (++j === N) j = 0; }
  return x; }
function lowpassLoop(ch, f, passes = 2) { const a = 1 - Math.exp((-TAU * f) / SR); for (let p = 0; p < passes; p++) { let y = 0; for (let r = 0; r < 2; r++) for (let i = 0; i < ch.length; i++) { y += a * (ch[i] - y); if (r) ch[i] = y; } } }
function highpassLoop(ch, f) { const a = 1 - Math.exp((-TAU * f) / SR); let y = 0; for (let r = 0; r < 2; r++) for (let i = 0; i < ch.length; i++) { y += a * (ch[i] - y); if (r) ch[i] -= y; } }

export function music() {
  const n = Math.round(LOOP * SR), base = [new Float32Array(n), new Float32Array(n)], drive = [new Float32Array(n), new Float32Array(n)], r = rng(92);
  const pat = [0, 2, 1, 2, 3, 2, 1, 2];
  CHORDS.forEach((c, ci) => {
    const t0 = ci * 8 * BEAT;
    c.pad.forEach((m, k) => { const note = padNote(hz(m), 8 * BEAT - 0.4); wrapAdd(base[0], t0 - 0.45, note, k % 2 ? 0.1 : 0.16); wrapAdd(base[1], t0 - 0.45, note, k % 2 ? 0.16 : 0.1); });
    for (let bar = 0; bar < 2; bar++) {
      const tb = t0 + bar * 4 * BEAT, bass = buf(3 * BEAT); tone(bass, 0, 3 * BEAT, hz(c.root), hz(c.root), 0.9, 1); tone(bass, 0, 2 * BEAT, hz(c.root + 12), hz(c.root + 12), 0.4, 0.18);
      wrapAdd(base[0], tb, bass, 0.3); wrapAdd(base[1], tb, bass, 0.3);
      for (let e = 0; e < 8; e++) {
        const t = tb + e * BEAT * 0.5, m = c.arp[pat[(e + bar * 3) % 8]], acc = e % 4 === 0 ? 1 : e % 2 === 0 ? 0.7 : 0.5, note = pluck(hz(m), 1.1, 0.35, r), left = e % 2 === 0;
        wrapAdd(base[left ? 0 : 1], t, note, 0.2 * acc); wrapAdd(base[left ? 1 : 0], t, note, 0.08 * acc);
        wrapAdd(base[left ? 1 : 0], t + BEAT * 0.75, note, 0.07 * acc); wrapAdd(base[left ? 0 : 1], t + BEAT * 1.5, note, 0.03 * acc); // two echoes, crossing sides
        // drive layer: a muted low pulse on the eighths, a soft kick on the beats, a shaker off the beat
        const mute = pluck(hz(c.root + 12), 0.22, 0.2, r); wrapAdd(drive[0], t, mute, 0.3 * acc); wrapAdd(drive[1], t, mute, 0.3 * acc);
        if (e % 2 === 0) { const kick = buf(0.3); tone(kick, 0, 0.28, 105, 46, 0.07, 1, 0.3); wrapAdd(drive[0], t, kick, 0.34); wrapAdd(drive[1], t, kick, 0.34); }
        else { const sh = buf(0.06); hiss(sh, 0, 0.05, r, decay(0.012), 1, 5000, 11000); wrapAdd(drive[0], t, sh, 0.05); wrapAdd(drive[1], t, sh, 0.035); }
      }
    }
  });
  for (const ch of base) { lowpassLoop(ch, 2600); highpassLoop(ch, 45); }
  for (const ch of drive) { lowpassLoop(ch, 5200, 1); highpassLoop(ch, 40); }
  const pk = Math.max(samplePeak(base), 1e-9); for (const ch of base) for (let i = 0; i < n; i++) ch[i] *= 0.5 / pk;
  for (const ch of drive) for (let i = 0; i < n; i++) ch[i] *= 0.5 / pk;
  return { base, drive, loop: LOOP, bpm: BPM };
}

export const SOUNDS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "assets", "sounds");

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
  for (const [name, f] of Object.entries(EFFECTS)) writeWav(path.join(SOUNDS_DIR, name + ".wav"), { rate: SR, ch: [f().x] });
  const m = music(); writeWav(path.join(SOUNDS_DIR, "house_bed.wav"), { rate: SR, ch: m.base }); writeWav(path.join(SOUNDS_DIR, "house_bed_drive.wav"), { rate: SR, ch: m.drive });
  console.log(`wrote ${Object.keys(EFFECTS).length} effects and the house bed (${m.loop.toFixed(1)}s loop, ${m.bpm} bpm) to ${path.relative(process.cwd(), SOUNDS_DIR)}`);
}
