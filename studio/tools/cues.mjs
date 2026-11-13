/* Where sound effects fall, worked out from the storyboard with the same timing the engine uses.
   Shared by the mix tool (places the sounds), the build (is the mix still current?) and the lint.

   Automatic: stamp -> "stamp", slam -> "slam", text card -> "card", chapter card -> "chapter", document or post card -> "paper".
   By hand: add "sound": "<name>" to a shot, a panel or an overlay; "sound": false silences an automatic one.
   Names are the effects in tools/sounds.mjs: stamp, slam, card, chapter, paper, whoosh, ding, pop, tick, riser. */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const TM = createRequire(import.meta.url)("../engine/timing.js");
// Seconds from the start of an overlay to the frame where it lands (see overlays.js).
const HIT = { slam: 0.16, stamp: 0.14 }, AUTO = { stamp: "stamp", slam: "slam", doc: "paper", post: "paper" };
const RANK = ["chapter", "slam", "stamp", "riser", "ding", "whoosh", "paper", "pop", "card", "tick"];
const MIN_SPACING = 0.25;

export function soundCues(res) {
  const L = res.L, out = [];
  const push = (t, name, why) => { if (name) out.push({ t: +Math.max(0, t).toFixed(3), name, why }); };
  const pick = (o, auto) => (o.sound === false ? null : typeof o.sound === "string" ? o.sound : auto);
  const overlays = (s) => (s.overlays || []).forEach((o, i) => {
    const t = o.cue || o.at != null ? TM.when(o, s.t0, L) : s.t0 + TM.K.OV_LEAD + i * TM.K.OV_STEP;
    push(t + (HIT[o.type] || 0), pick(o, AUTO[o.type]), `${s.id} ${o.type}`);
    // a rolling counter with "tick": the first digits to settle each tick (opt-in, at most three, never closer than MIN_SPACING)
    if (o.type === "counter" && o.roll && o.sound !== false) TM.rollTicks(o, MIN_SPACING).forEach((dt, k) => push(t + dt, "tick", `${s.id} counter digit ${k + 1}`));
  });
  for (const s of res.shots) {
    if (s.type === "chapter") push(s.t0 + 0.05, pick(s, "chapter"), `${s.id} chapter`);
    else if (s.type === "card") push(s.t0, pick(s, "card"), `${s.id} card`);
    else if (s.type === "split") {
      s.panels.forEach((p, i) => {
        const tp = p.cue || p.at != null ? TM.when(p, s.t0, L) : s.t0 + i * (s.stagger || 0);
        if (typeof p.sound === "string") push(tp, p.sound, `${s.id} panel ${i + 1}`);
        if (p.stamp && p.sound !== false) push(tp + (p.stampAt != null ? p.stampAt : 0.5) + HIT.stamp, "stamp", `${s.id} panel ${i + 1} stamp`);
      });
      overlays(s);
    } else { if (typeof s.sound === "string") push(s.t0, s.sound, `${s.id} shot`); overlays(s);
      // phone messages: a soft pop for the first incoming ones (at most 3 per phone, never closer than MIN_SPACING); "sound": false on the chat silences it
      for (const p of s.props || []) if (p.type === "chat" && p.sound !== false) { let n = 0, last = -9;
        for (const m of p.messages || []) { if (m.from === "me" || m.sound === false || n >= (p.sounds || 3)) continue; const t = TM.when(m, s.t0, L); if (t - last < MIN_SPACING + 0.01) continue; push(t, "pop", `${s.id} chat message`); last = t; n++; } } }
  }
  // Effects are rare: when two land almost together, keep the more important one.
  out.sort((a, b) => a.t - b.t);
  const kept = [];
  for (const c of out) { const p = kept[kept.length - 1];
    if (p && c.t - p.t < MIN_SPACING) { if (RANK.indexOf(c.name) < RANK.indexOf(p.name)) kept[kept.length - 1] = c; }
    else kept.push(c); }
  return kept;
}

// Chapters to play a little louder: "audio": { "climax": [5, 6] } in the storyboard, else the one before the last.
export function climaxChapters(story, res) {
  const set = story.audio && story.audio.climax; if (Array.isArray(set)) return set;
  const nums = res.chapters.map((c) => c.number); return nums.length >= 3 ? [nums[nums.length - 2]] : [];
}

// A fingerprint of everything the mix depends on. If it changes, the mix is out of date.
export function mixSignature({ lines, total, story, res, clips, music }) {
  const h = crypto.createHash("sha1");
  h.update(JSON.stringify([total, lines.map((l) => [l.id, l.speaker, l.a, l.d]), soundCues(res), story.audio || null, climaxChapters(story, res), clips, music]));
  return h.digest("hex").slice(0, 16);
}

/* ---------- what the mix was made from ---------- */

const MUSIC_EXT = new Set([".mp3", ".wav", ".m4a", ".flac", ".ogg", ".aac", ".aiff"]);
export const musicFiles = (ep) => { const d = path.join(ep, "audio", "music"); return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => MUSIC_EXT.has(path.extname(f).toLowerCase())).sort().map((f) => path.join(d, f)) : []; };
export const clipStats = (ep, lines) => lines.map((l) => { const f = path.join(ep, "audio", l.id + ".wav"); return fs.existsSync(f) ? fs.statSync(f).size : 0; });
export function musicStats(ep, story) {
  const m = (story.audio || {}).music; if (m === "none" || m === "house") return [m];
  const files = musicFiles(ep); return files.length ? files.map((f) => path.basename(f) + ":" + fs.statSync(f).size) : ["house"];
}

// The mix report, with `current` telling whether it still matches the episode. null when there is no mix.
export function mixState(ep, data) {
  const jf = path.join(ep, "audio", "mix.json"), wf = path.join(ep, "audio", "mix.wav");
  if (!fs.existsSync(jf) || !fs.existsSync(wf)) return null;
  const report = JSON.parse(fs.readFileSync(jf, "utf8"));
  const sig = mixSignature({ lines: data.lines, total: data.total, story: data.story, res: data.res, clips: clipStats(ep, data.lines), music: musicStats(ep, data.story) });
  return { report, current: report.signature === sig };
}
