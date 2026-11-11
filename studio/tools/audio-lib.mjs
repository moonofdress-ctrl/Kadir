/* Audio helpers for the studio tools. Plain Node, no dependencies.
   WAV files are read and written here; any other format (MP3, M4A, FLAC, OGG) is decoded with FFmpeg.
   Everything works on { rate, ch: [Float32Array, ...] } at 48 kHz once loaded. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const RATE = 48000;
export const db = (x) => 20 * Math.log10(Math.max(x, 1e-12));
export const lin = (d) => Math.pow(10, d / 20);

/* ---------- files ---------- */

export function readWav(file) {
  const b = fs.readFileSync(file);
  if (b.length < 12 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WAVE") throw new Error("not a WAV file: " + file);
  let p = 12, fmt = null;
  while (p + 8 <= b.length) {
    const id = b.toString("ascii", p, p + 4), size = b.readUInt32LE(p + 4), at = p + 8;
    if (id === "fmt ") {
      let tag = b.readUInt16LE(at);
      if (tag === 0xfffe && size >= 26) tag = b.readUInt16LE(at + 24); // WAVE_FORMAT_EXTENSIBLE: the real format is in the sub-format
      fmt = { tag, n: b.readUInt16LE(at + 2), rate: b.readUInt32LE(at + 4), bits: b.readUInt16LE(at + 14) };
    } else if (id === "data") {
      if (!fmt) throw new Error("WAV data before format in " + file);
      const bytes = fmt.bits / 8, n = fmt.n, frames = Math.floor(Math.min(size, b.length - at) / (bytes * n));
      const ch = Array.from({ length: n }, () => new Float32Array(frames));
      const raw = b.buffer.slice(b.byteOffset + at, b.byteOffset + at + frames * n * bytes);
      if (fmt.tag === 1 && bytes === 2) { const s = new Int16Array(raw); for (let i = 0, q = 0; i < frames; i++) for (let c = 0; c < n; c++) ch[c][i] = s[q++] / 32768; }
      else if (fmt.tag === 3 && bytes === 4) { const s = new Float32Array(raw); for (let i = 0, q = 0; i < frames; i++) for (let c = 0; c < n; c++) ch[c][i] = s[q++]; }
      else if (fmt.tag === 1 || fmt.tag === 3) {
        const v = Buffer.from(raw);
        const get = fmt.tag === 3 ? (q) => v.readDoubleLE(q) : bytes === 1 ? (q) => (v[q] - 128) / 128 : bytes === 3 ? (q) => v.readIntLE(q, 3) / 8388608 : (q) => v.readInt32LE(q) / 2147483648;
        for (let i = 0, q = 0; i < frames; i++) for (let c = 0; c < n; c++, q += bytes) ch[c][i] = get(q);
      } else throw new Error(`unsupported WAV encoding (format ${fmt.tag}) in ${file}`);
      return { rate: fmt.rate, ch };
    }
    p = at + size + (size % 2);
  }
  throw new Error("no audio data in " + file);
}

// 16-bit PCM. Values outside -1..1 are clipped, so limit before writing.
export function writeWav(file, a) {
  const n = a.ch.length, frames = a.ch[0].length, out = Buffer.alloc(44 + frames * n * 2);
  out.write("RIFF", 0); out.writeUInt32LE(36 + frames * n * 2, 4); out.write("WAVEfmt ", 8);
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(n, 22); out.writeUInt32LE(a.rate, 24);
  out.writeUInt32LE(a.rate * n * 2, 28); out.writeUInt16LE(n * 2, 32); out.writeUInt16LE(16, 34);
  out.write("data", 36); out.writeUInt32LE(frames * n * 2, 40);
  const s = new Int16Array(frames * n);
  for (let i = 0, q = 0; i < frames; i++) for (let c = 0; c < n; c++) { const v = Math.round(a.ch[c][i] * 32767); s[q++] = v > 32767 ? 32767 : v < -32768 ? -32768 : v; }
  Buffer.from(s.buffer).copy(out, 44);
  fs.writeFileSync(file, out);
}

export const ffmpegBin = () => process.env.FFMPEG || "ffmpeg";
export function hasFfmpeg() { const r = spawnSync(ffmpegBin(), ["-version"], { stdio: "ignore" }); return !r.error && r.status === 0; }

// Any audio file -> { rate: 48000, ch }.
export function loadAudio(file) {
  let a;
  const head = Buffer.alloc(4); const fd = fs.openSync(file, "r"); fs.readSync(fd, head, 0, 4, 0); fs.closeSync(fd);
  if (head.toString("ascii") === "RIFF") a = readWav(file);
  else {
    if (!hasFfmpeg()) throw new Error(`${path.basename(file)} is not a WAV file and FFmpeg was not found to decode it. Install FFmpeg, or set the FFMPEG environment variable to its path.`);
    const tmp = path.join(os.tmpdir(), `studio-${process.pid}-${Date.now()}.wav`);
    const r = spawnSync(ffmpegBin(), ["-v", "error", "-y", "-i", file, "-vn", "-ar", String(RATE), "-c:a", "pcm_f32le", tmp], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`FFmpeg could not decode ${file}: ${(r.stderr || "").trim().slice(-300)}`);
    a = readWav(tmp); fs.rmSync(tmp, { force: true });
  }
  return resample(a, RATE);
}

/* ---------- sample rate ---------- */

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Windowed-sinc resampler. Rational ratios use an exact table of phases.
export function resample(a, to) {
  if (a.rate === to) return a;
  const g = gcd(a.rate, to), L = to / g, M = a.rate / g;
  const P = L <= 2048 ? L : 1024, exact = L <= 2048;
  const fc = Math.min(1, to / a.rate) * 0.94, hw = Math.ceil(14 / fc), taps = 2 * hw;
  const table = new Float32Array(P * taps);
  for (let p = 0; p < P; p++) {
    const frac = p / P; let sum = 0;
    for (let j = 0; j < taps; j++) { const d = frac - (j - hw + 1), x = Math.PI * d * fc; const v = (d === 0 ? 1 : Math.sin(x) / x) * (0.5 + 0.5 * Math.cos((Math.PI * d) / hw)); table[p * taps + j] = Math.abs(d) < hw ? v : 0; sum += table[p * taps + j]; }
    for (let j = 0; j < taps; j++) table[p * taps + j] /= sum;
  }
  const ch = a.ch.map((x) => {
    const n = Math.floor((x.length * to) / a.rate), y = new Float32Array(n), len = x.length;
    for (let i = 0; i < n; i++) {
      let c, p;
      if (exact) { const num = i * M; c = Math.floor(num / L); p = num - c * L; }
      else { const t = (i * a.rate) / to; c = Math.floor(t); p = Math.round((t - c) * P); if (p === P) { p = 0; c++; } }
      const base = p * taps, k0 = c - hw + 1; let s = 0;
      const j0 = k0 < 0 ? -k0 : 0, j1 = k0 + taps > len ? len - k0 : taps;
      for (let j = j0; j < j1; j++) s += x[k0 + j] * table[base + j];
      y[i] = s;
    }
    return y;
  });
  return { rate: to, ch };
}

export const mono = (a) => { if (a.ch.length === 1) return a.ch[0]; const n = a.ch[0].length, y = new Float32Array(n); for (const c of a.ch) for (let i = 0; i < n; i++) y[i] += c[i] / a.ch.length; return y; };

/* ---------- loudness (ITU-R BS.1770-4, 48 kHz) ---------- */

const K1 = { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [-1.69065929318241, 0.73248077421585] };
const K2 = { b: [1.0, -2.0, 1.0], a: [-1.99004745483398, 0.99007225036621] };

// Energy of each 100 ms step after K-weighting, summed over the channels.
function kEnergy(chs) {
  const hop = RATE / 10, n = chs[0].length, steps = Math.floor(n / hop), e = new Float64Array(steps);
  for (const x of chs) {
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0, u1 = 0, u2 = 0, v1 = 0, v2 = 0;
    for (let s = 0, i = 0; s < steps; s++) {
      let acc = 0;
      for (const end = i + hop; i < end; i++) {
        const x0 = x[i], y0 = K1.b[0] * x0 + K1.b[1] * x1 + K1.b[2] * x2 - K1.a[0] * y1 - K1.a[1] * y2; x2 = x1; x1 = x0; y2 = y1; y1 = y0;
        const v0 = K2.b[0] * y0 + K2.b[1] * u1 + K2.b[2] * u2 - K2.a[0] * v1 - K2.a[1] * v2; u2 = u1; u1 = y0; v2 = v1; v1 = v0;
        acc += v0 * v0;
      }
      e[s] += acc / hop;
    }
  }
  return e;
}
const lk = (ms) => -0.691 + 10 * Math.log10(Math.max(ms, 1e-12));

// Integrated loudness in LUFS of a set of channels (mono counts once; put a mono voice on both channels to measure it as it will be heard).
export function loudness(chs) {
  const e = kEnergy(chs), blocks = [];
  for (let i = 0; i + 4 <= e.length; i++) blocks.push((e[i] + e[i + 1] + e[i + 2] + e[i + 3]) / 4);
  if (!blocks.length) { let s = 0; for (const x of chs) { let a = 0; for (let i = 0; i < x.length; i++) a += x[i] * x[i]; s += a / Math.max(1, x.length); } return lk(s); } // under 0.4 s: plain level
  const abs = blocks.filter((b) => lk(b) > -70); if (!abs.length) return -Infinity;
  const rel = lk(abs.reduce((a, b) => a + b, 0) / abs.length) - 10, kept = abs.filter((b) => lk(b) > rel);
  return lk(kept.reduce((a, b) => a + b, 0) / kept.length);
}
// Loudest 400 ms of a sound: used to place short effects, where integrated loudness means little.
export function peakLoudness(chs) {
  const e = kEnergy(chs); let m = 0;
  if (e.length < 4) return loudness(chs);
  for (let i = 0; i + 4 <= e.length; i++) m = Math.max(m, (e[i] + e[i + 1] + e[i + 2] + e[i + 3]) / 4);
  return lk(m);
}

/* ---------- peaks ---------- */

export function samplePeak(chs) { let m = 0; for (const x of chs) for (let i = 0; i < x.length; i++) { const v = x[i] < 0 ? -x[i] : x[i]; if (v > m) m = v; } return m; }

// True peak in dBTP: 4x oversampling around every sample that comes near the sample peak.
export function truePeakDb(chs) {
  const sp = samplePeak(chs); if (sp === 0) return -Infinity;
  const hw = 12, taps = 2 * hw, table = new Float32Array(3 * taps);
  for (let p = 1; p <= 3; p++) { const frac = p / 4; let sum = 0; for (let j = 0; j < taps; j++) { const d = frac - (j - hw + 1), x = Math.PI * d; const v = (Math.sin(x) / x) * (0.5 + 0.5 * Math.cos((Math.PI * d) / hw)); table[(p - 1) * taps + j] = v; sum += v; } for (let j = 0; j < taps; j++) table[(p - 1) * taps + j] /= sum; }
  const thr = sp * 0.6; let m = sp;
  for (const x of chs) for (let i = hw; i < x.length - hw - 1; i++) {
    const a = x[i] < 0 ? -x[i] : x[i], b = x[i + 1] < 0 ? -x[i + 1] : x[i + 1];
    if (a < thr && b < thr) continue;
    for (let p = 0; p < 3; p++) { let s = 0; const base = p * taps, k0 = i - hw + 1; for (let j = 0; j < taps; j++) s += x[k0 + j] * table[base + j]; if (s < 0) s = -s; if (s > m) m = s; }
  }
  return db(m);
}

// Look-ahead peak limiter, in place, same gain on every channel. `ceiling` is linear.
// Returns { max_db: the deepest cut, over_1db: share of samples cut by more than 1 dB }.
export function limit(chs, ceiling, lookMs = 5, releaseMs = 60) {
  const n = chs[0].length, LA = Math.round((RATE * lookMs) / 1000), need = new Float32Array(n);
  let any = false;
  for (let i = 0; i < n; i++) { let m = 0; for (const x of chs) { const v = x[i] < 0 ? -x[i] : x[i]; if (v > m) m = v; } if (m > ceiling) { need[i] = ceiling / m; any = true; } else need[i] = 1; }
  if (!any) return { max_db: 0, over_1db: 0 };
  // sliding minimum over the next LA samples, then a moving average: the gain is already down when the peak arrives
  const mn = new Float32Array(n), dq = new Int32Array(n); let h = 0, t = 0;
  for (let i = n - 1; i >= 0; i--) { while (t > h && need[dq[t - 1]] >= need[i]) t--; dq[t++] = i; while (dq[h] > i + LA) h++; mn[i] = need[dq[h]]; }
  const rel = 1 - Math.exp(-1 / ((RATE * releaseMs) / 1000)); let sum = 0, g = 1, deep = 0, low = 1;
  // Every mn[] in the window ending at i covers sample i, so the average can never be above what sample i needs.
  for (let i = 0; i < n; i++) {
    sum += mn[i]; if (i >= LA) sum -= mn[i - LA];
    const avg = sum / Math.min(i + 1, LA); g = Math.min(avg, g + (1 - g) * rel);
    if (g < 0.9999) { if (g < 0.891) deep++; if (g < low) low = g; for (const x of chs) x[i] *= g; }
  }
  return { max_db: +(-db(low)).toFixed(1), over_1db: deep / n };
}

// Gentle compressor for the voice, in place: evens out loud syllables so the limiter has little left to do.
export function compress(x, thresholdDb, ratio = 3, attackMs = 1, releaseMs = 90) {
  const a = Math.exp(-1 / ((RATE * attackMs) / 1000)), r = Math.exp(-1 / ((RATE * releaseMs) / 1000)), thr = lin(thresholdDb), k = 1 - 1 / ratio; let env = 0;
  for (let i = 0; i < x.length; i++) { const v = x[i] < 0 ? -x[i] : x[i]; env = v > env ? a * env + (1 - a) * v : r * env + (1 - r) * v;
    if (env > thr) x[i] *= Math.pow(thr / env, k); }
}

/* ---------- silence ---------- */

// Level of each 10 ms frame, in dB.
export function frameLevels(x, ms = 10, rate = RATE) {
  const hop = Math.round((rate * ms) / 1000), n = Math.floor(x.length / hop), out = new Float32Array(n);
  for (let f = 0, i = 0; f < n; f++) { let a = 0; for (const end = i + hop; i < end; i++) a += x[i] * x[i]; out[f] = 10 * Math.log10(Math.max(a / hop, 1e-12)); }
  return out;
}
// Runs of frames below `floorDb`, as [startSec, endSec].
export function silences(x, floorDb, ms = 10, rate = RATE) {
  const lv = frameLevels(x, ms, rate), out = []; let s = -1;
  for (let f = 0; f <= lv.length; f++) { const q = f < lv.length && lv[f] < floorDb; if (q && s < 0) s = f; if (!q && s >= 0) { out.push([(s * ms) / 1000, (f * ms) / 1000]); s = -1; } }
  return out;
}
export const speechFloor = (x, rate = RATE) => { const lv = frameLevels(x, 10, rate); let m = -120; for (const v of lv) if (v > m) m = v; return Math.max(-55, m - 38); };

/* ---------- mixing ---------- */

export function addInto(dst, src, atSample, gain = 1) {
  const s0 = Math.max(0, -atSample), n = Math.min(src.length, dst.length - atSample);
  for (let i = s0; i < n; i++) dst[atSample + i] += src[i] * gain;
}
