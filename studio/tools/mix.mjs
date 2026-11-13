#!/usr/bin/env node
/* Mix an episode's sound: voice clips, a quiet music bed and a few soft effects, at -14 LUFS.
   Follows channel-system/FORMAT_BOOK.md section 13.

   Usage: node studio/tools/mix.mjs <episode_dir> [--tighten] [--no-music] [--no-sfx]

   Reads   <episode_dir>/audio/<id>.wav (every line needs a clip), storyboard.json, and music from <episode_dir>/audio/music/
           (MP3, WAV, M4A, FLAC, OGG; played in name order). With no music files, the house bed made in code is used.
   Writes  audio/mix.wav (48 kHz stereo), audio/mix.json (what was measured; the lint reads it) and audio/CREDITS.md if missing.
   Then run the build again: it uses mix.wav when it matches the current timing.

   --tighten  First cut dead air inside the clips: silence at both ends, and pauses over 0.3 s down to 0.22 s.
              Originals are kept in audio/raw/. This changes clip lengths, so do it before the storyboard is timed.

   Storyboard options: "audio": { "music": "house" | "none", "beds": ["steady", "calm", "uneasy"], "music_db": -19, "climax": [5, 6], "sfx": true }
   The house music has three beds (steady, calm, uneasy); they take turns by chapter unless "beds" sets the order.
   WAV files need nothing installed; other formats are decoded with FFmpeg. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "./build.mjs";
import { soundCues, climaxChapters, mixSignature, musicFiles, clipStats, musicStats } from "./cues.mjs";
import { EFFECTS, BEDS, music as houseMusic } from "./sounds.mjs";
import { RATE, db, lin, readWav, writeWav, loadAudio, mono, loudness, peakLoudness, truePeakDb, limit, compress, silences, speechFloor, addInto } from "./audio-lib.mjs";

const TARGET = -14, CEILING_TP = -1, MUSIC_DB = -19, CARD_DIP = -10, CLIMAX_DB = 3, END_RISE_DB = 5;
// How loud each effect sits, in dB relative to the voice. Rare and soft.
const SFX_DB = { stamp: -8, slam: -6, card: -15, chapter: -9, paper: -14, whoosh: -12, ding: -12, pop: -12, tick: -14, riser: -10 };

/* ---------- dead air inside clips ---------- */

function tighten(ep, lines, maxPause = 0.3, keep = 0.22) {
  let cut = 0, changed = 0;
  for (const ln of lines) {
    const file = path.join(ep, "audio", ln.id + ".wav"); if (!fs.existsSync(file)) continue;
    const a = readWav(file), x = mono(a), rate = a.rate, n = x.length, sil = silences(x, speechFloor(x, rate), 10, rate);
    const cuts = []; // [from, to) in seconds to remove
    for (const [s, e] of sil) {
      if (s <= 0.001) { if (e > 0.03) cuts.push([0, e - 0.02]); }
      else if (e >= n / rate - 0.011) { if (e - s > 0.06) cuts.push([s + 0.04, n / rate]); }
      else if (e - s > maxPause) cuts.push([s + keep / 2, e - keep / 2]);
    }
    if (!cuts.length) continue;
    const fade = Math.round(0.008 * rate), ch = a.ch.map((c) => {
      const parts = []; let p = 0;
      for (const [s, e] of cuts) { parts.push(c.subarray(p, Math.round(s * rate))); p = Math.round(e * rate); }
      parts.push(c.subarray(p));
      const out = new Float32Array(parts.reduce((m, q) => m + q.length, 0)); let o = 0;
      for (const q of parts) { // short fades at each join so the cut does not click
        const seg = Float32Array.from(q), f = Math.min(fade, seg.length >> 1);
        for (let i = 0; i < f; i++) { seg[i] *= i / f; seg[seg.length - 1 - i] *= i / f; }
        out.set(seg, o); o += seg.length;
      }
      return out;
    });
    const raw = path.join(ep, "audio", "raw"); fs.mkdirSync(raw, { recursive: true });
    if (!fs.existsSync(path.join(raw, ln.id + ".wav"))) fs.copyFileSync(file, path.join(raw, ln.id + ".wav"));
    writeWav(file, { rate, ch }); cut += (n - ch[0].length) / rate; changed++;
    // Keep measured word timings in step with the cut clip.
    const wj = path.join(ep, "audio", ln.id + ".words.json");
    if (fs.existsSync(wj)) {
      const shift = (t) => { let d = 0; for (const [s, e] of cuts) { if (t >= e) d += e - s; else if (t > s) d += t - s; } return +Math.max(0, t - d).toFixed(3); };
      const raww = path.join(raw, ln.id + ".words.json"); if (!fs.existsSync(raww)) fs.copyFileSync(wj, raww);
      fs.writeFileSync(wj, JSON.stringify(JSON.parse(fs.readFileSync(wj, "utf8")).map((w) => ({ ...w, a: shift(w.a), b: shift(w.b) }))) + "\n");
    }
  }
  console.log(changed ? `tightened ${changed} clip(s), removed ${cut.toFixed(1)}s of silence (originals in audio/raw/)` : "tighten: nothing to cut");
}

/* ---------- envelopes ---------- */

// Piecewise-linear curve from [[t, value], ...]; flat outside its ends.
const curve = (pts) => (t) => { if (!pts.length) return 0; if (t <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; return t1 === t0 ? v1 : v0 + ((v1 - v0) * (t - t0)) / (t1 - t0); } return pts[pts.length - 1][1]; };

// Tracks in order with 3 s crossfades, looped until `need` samples are filled.
function playlist(tracks, need) {
  const X = 3 * RATE, out = [new Float32Array(need), new Float32Array(need)]; let pos = 0, k = 0;
  while (pos < need) {
    const t = tracks[k % tracks.length], n = t[0].length, x = Math.min(X, n >> 2), first = pos === 0;
    for (let c = 0; c < 2; c++) for (let i = 0; i < n && pos + i < need; i++) {
      const g = (first || i >= x ? 1 : i / x) * (i >= n - x ? (n - i) / x : 1);
      out[c][pos + i] += t[c][i] * g;
    }
    pos += n - x; k++;
  }
  return out;
}

/* ---------- main ---------- */

function main() {
  const args = process.argv.slice(2), ep = path.resolve(args.find((a) => !a.startsWith("--")) || "");
  if (!fs.existsSync(path.join(ep, "storyboard.json"))) { console.error("usage: node studio/tools/mix.mjs <episode_dir> [--tighten] [--no-music] [--no-sfx]"); process.exit(2); }
  if (args.includes("--tighten")) { const pre = load(ep); tighten(ep, pre.lines); }

  const { story, lines, total, durations, res } = load(ep), cfg = story.audio || {};
  const missing = lines.filter((l) => durations[l.id] == null).map((l) => l.id);
  if (missing.length) { console.error(`no clip yet for ${missing.length} line(s): ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "..." : ""}\nThe mix needs every line. Record them, or make a scratch track: node studio/tools/voice.mjs ${path.relative(process.cwd(), ep)}`); process.exit(2); }
  const N = Math.ceil(total * RATE), at = (t) => Math.round(t * RATE);

  // 1. Voice: level each speaker to the narrator, then place every clip at its line time.
  const clips = lines.map((ln) => { const x = mono(loadAudio(path.join(ep, "audio", ln.id + ".wav"))); return { ln, x, lufs: loudness([x, x]) }; });
  const bySpeaker = {}; for (const c of clips) (bySpeaker[c.ln.speaker] = bySpeaker[c.ln.speaker] || []).push(c.lufs);
  const median = (v) => { const s = v.filter(Number.isFinite).sort((a, b) => a - b); return s.length ? s[s.length >> 1] : -23; };
  const ref = median(bySpeaker.N || clips.map((c) => c.lufs)), speakers = {};
  for (const [who, v] of Object.entries(bySpeaker)) speakers[who] = { clips: v.length, gain_db: +(ref - median(v)).toFixed(1) };
  const voice = new Float32Array(N); let edgy = 0;
  for (const c of clips) {
    const sg = speakers[c.ln.speaker].gain_db, off = Number.isFinite(c.lufs) ? ref - (c.lufs + sg) : 0; // what is left after the speaker gain
    addInto(voice, c.x, at(c.ln.a), lin(sg + Math.max(-3, Math.min(3, off * 0.7))));
    const sil = silences(c.x, speechFloor(c.x)), d = c.x.length / RATE, lead = sil.length && sil[0][0] <= 0.001 ? sil[0][1] : 0, last = sil[sil.length - 1], trail = last && last[1] >= d - 0.011 ? last[1] - last[0] : 0;
    if (lead > 0.1 || trail > 0.1) edgy++;
  }
  compress(voice, loudness([voice, voice]) + 7); // threshold 7 dB over the average level: only the loud syllables are touched
  const voiceLufs = loudness([voice, voice]);

  // 2. Dead air: pauses over a quarter of a second, outside chapter cards.
  const breaks = res.chapters.map((c) => { const i = lines.findIndex((l) => l.a > c.t); return i > 0 ? [lines[i - 1].a + lines[i - 1].d - 0.05, lines[i].a + 0.05] : [c.t, c.t + 1.5]; });
  const end = lines[lines.length - 1].a + lines[lines.length - 1].d;
  const gaps = silences(voice, speechFloor(voice)).filter(([s, e]) => e - s > 0.25 && s > lines[0].a && e < end && !breaks.some(([b0, b1]) => s >= b0 && e <= b1)).map(([s, e]) => ({ t: +s.toFixed(2), d: +(e - s).toFixed(2) }));

  const L = new Float32Array(N), R = new Float32Array(N);
  addInto(L, voice, 0); addInto(R, voice, 0);

  // 3. Music bed, well under the voice; down at chapter cards, up a little in the climax, rising under the last lines.
  const files = cfg.music === "house" || cfg.music === "none" || args.includes("--no-music") ? [] : musicFiles(ep);
  const useMusic = !(cfg.music === "none" || args.includes("--no-music")), house = useMusic && !files.length;
  let musicReport = { source: "none" }, underDb = null;
  if (useMusic) {
    let bed, drive = null;
    if (house) { // one bed per chapter, in rotation, switched under the chapter card where the music is already down; "audio": { "beds": ["calm", "uneasy"] } sets the order
      const order = (Array.isArray(cfg.beds) && cfg.beds.length ? cfg.beds : ["steady", "calm", "uneasy"]).filter((b) => BEDS[b]), cuts = res.chapters.map((c) => at(c.t + 0.5)).concat([N]), made = {};
      bed = [new Float32Array(N), new Float32Array(N)]; drive = [new Float32Array(N), new Float32Array(N)]; let from = 0; const ref = {};
      cuts.forEach((to, ci) => { const name = order[ci % order.length], m = made[name] || (made[name] = houseMusic(name)), n = m.base[0].length;
        const lv = ref[name] || (ref[name] = loudness(m.base)), fix = lin((ref[order[0]] || lv) - lv); // every bed plays at the first one's loudness
        for (let c = 0; c < 2; c++) for (let i = from; i < to; i++) { bed[c][i] = m.base[c][(i - from) % n] * fix; drive[c][i] = m.drive[c][(i - from) % n] * fix; }
        from = to; });
      musicReport.beds = cuts.map((_, ci) => order[ci % order.length]); }
    else bed = playlist(files.map((f) => { const a = loadAudio(f); return a.ch.length > 1 ? [a.ch[0], a.ch[1]] : [a.ch[0], a.ch[0]]; }), N);
    const wantDb = Number.isFinite(cfg.music_db) ? cfg.music_db : MUSIC_DB, g = lin(voiceLufs + wantDb - loudness(bed));
    const rise = Math.min(15, total * 0.2), climax = climaxChapters(story, res), chEnd = (i) => (i + 1 < res.chapters.length ? res.chapters[i + 1].t : total);
    const dips = curve(breaks.flatMap(([b0, b1]) => [[b0, 0], [b0 + 0.2, CARD_DIP], [Math.max(b0 + 0.2, b1 - 0.3), CARD_DIP], [b1 + 0.05, 0]]));
    const hot = curve(res.chapters.flatMap((c, i) => (climax.includes(c.number) ? [[c.t, 0], [c.t + 1.5, 1], [chEnd(i) - 1.5, 1], [chEnd(i), 0]] : [])));
    const ending = curve([[end - rise, 0], [end, 1]]), out = curve([[0, 0], [0.15, 1], [total - 0.6, 1], [total - 0.02, 0]]);
    const step = 480; let g0 = 0, d0 = 0;
    for (let i = 0; i < N; i += step) {
      const t = (i + step) / RATE, drv = Math.max(hot(t), ending(t)), g1 = g * lin(dips(t) + CLIMAX_DB * hot(t) + END_RISE_DB * ending(t)) * out(t), d1 = drive ? g1 * drv * 0.8 : 0, m = Math.min(step, N - i);
      for (let k = 0; k < m; k++) { const a = g0 + ((g1 - g0) * k) / step, b = d0 + ((d1 - d0) * k) / step;
        L[i + k] += bed[0][i + k] * a + (drive ? drive[0][i + k] * b : 0); R[i + k] += bed[1][i + k] * a + (drive ? drive[1][i + k] * b : 0); }
      g0 = g1; d0 = d1;
    }
    underDb = -wantDb;
    musicReport = house ? { source: "house bed (made in code)", files: [], beds: musicReport.beds } : { source: "files", files: files.map((f) => path.basename(f)) };
    musicReport.climax_chapters = climax;
  }

  // 4. Effects.
  const cues = cfg.sfx === false || args.includes("--no-sfx") ? [] : soundCues(res), kit = {};
  for (const c of cues) {
    if (!EFFECTS[c.name]) { console.error(`unknown sound "${c.name}" (${c.why}); known: ${Object.keys(EFFECTS).join(", ")}`); process.exit(2); }
    const s = kit[c.name] || (kit[c.name] = (() => { const e = EFFECTS[c.name](); return { ...e, lufs: peakLoudness([e.x, e.x]) }; })());
    const g = lin(voiceLufs + (SFX_DB[c.name] ?? -12) - s.lufs), i = at(c.t - s.anchor);
    addInto(L, s.x, i, g); addInto(R, s.x, i, g);
  }

  // 5. Loudness: gain to the target, catch the peaks, check, repeat.
  let lufs = loudness([L, R]), tp = 0, limited = { max_db: 0, over_1db: 0 }, ceiling = lin(CEILING_TP - 0.3);
  for (let pass = 0; pass < 6; pass++) {
    const g = lin(TARGET - lufs); for (let i = 0; i < N; i++) { L[i] *= g; R[i] *= g; }
    const lm = limit([L, R], ceiling); if (lm.max_db > limited.max_db) limited = lm;
    lufs = loudness([L, R]); tp = truePeakDb([L, R]);
    if (tp > CEILING_TP) ceiling *= lin(CEILING_TP - tp - 0.1);
    else if (Math.abs(lufs - TARGET) < 0.05) break;
  }

  // 6. Write.
  writeWav(path.join(ep, "audio", "mix.wav"), { rate: RATE, ch: [L, R] });
  const credits = path.join(ep, "audio", "CREDITS.md"), creditText = fs.existsSync(credits) ? fs.readFileSync(credits, "utf8") : null;
  if (creditText == null) fs.writeFileSync(credits, `# Sound credits\n\nEvery music or effect file used in this episode, where it came from and the licence. The lint fails while a row says FILL IN.\n\n| File | Source | Licence |\n|---|---|---|\n| Sound effects | Made in code by \`studio/tools/sounds.mjs\` | Our own work |\n${house ? "| House music bed | Made in code by `studio/tools/sounds.mjs` | Our own work |\n" : ""}${files.map((f) => `| ${path.basename(f)} | FILL IN | FILL IN |\n`).join("")}`);
  const text = creditText ?? fs.readFileSync(credits, "utf8");
  const uncredited = files.map((f) => path.basename(f)).filter((f) => { const row = text.split("\n").find((r) => r.includes(f)); return !row || /FILL IN/.test(row); });
  const perMin = cues.length / (total / 60), report = {
    signature: mixSignature({ lines, total, story, res, clips: clipStats(ep, lines), music: musicStats(ep, story) }),
    total, lufs: +lufs.toFixed(2), true_peak_db: +tp.toFixed(2), limiter: { max_cut_db: limited.max_db, pct_cut_over_1db: +(100 * limited.over_1db).toFixed(2) },
    voice: { speakers, clips_with_silent_edges: edgy },
    music: { ...musicReport, db_under_voice: underDb, uncredited },
    effects: { count: cues.length, per_minute: +perMin.toFixed(1), list: cues },
    dead_air: { pauses_over_250ms: gaps.length, longest: gaps.slice().sort((a, b) => b.d - a.d).slice(0, 5) },
  };
  fs.writeFileSync(path.join(ep, "audio", "mix.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(`${path.basename(ep)}: mix ${lufs.toFixed(1)} LUFS, true peak ${tp.toFixed(1)} dBTP, limiter cut up to ${limited.max_db} dB (${report.limiter.pct_cut_over_1db}% of samples by more than 1 dB)`);
  console.log(`  voice: ${Object.entries(speakers).map(([k, v]) => `${k} ${v.gain_db >= 0 ? "+" : ""}${v.gain_db} dB`).join(", ")}${edgy ? `; ${edgy} clip(s) have over 0.1s of silence at an end (--tighten cuts it)` : ""}`);
  console.log(`  music: ${musicReport.source}${files.length ? " (" + files.map((f) => path.basename(f)).join(", ") + ")" : ""}${underDb != null ? `, ${underDb} dB under the voice` : ""}${uncredited.length ? `; NOT CREDITED in audio/CREDITS.md: ${uncredited.join(", ")}` : ""}`);
  console.log(`  effects: ${cues.length} (${perMin.toFixed(1)} a minute); pauses over 0.25s: ${gaps.length}`);
  console.log(`  next: node studio/tools/build.mjs ${path.relative(process.cwd(), ep)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
