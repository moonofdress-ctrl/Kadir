#!/usr/bin/env node
/* Build studio/index.html for one episode.

   Usage: node studio/tools/build.mjs <episode_dir> [--silent]
          node studio/tools/build.mjs <episode_dir> --short L012-L020 --title "WHO PAYS THE FEE?" [--name short1]
              makes <episode_dir>/shorts/<name>/ : a vertical 1080x1920 cut of those lines, built like any episode
              (then mix, lint, look at frames and render that folder the same way).

   The storyboard may be split by chapter: storyboard.json holds the header (title, viewer, audio) and any shots,
   and every storyboard/*.json adds its "shots" in file-name order. One art director per chapter can then work at once.

   Reads <episode_dir>/storyboard.json and audio/lines.json (made from script.md if missing).
   Line lengths come from audio/<id>.wav; a missing clip is estimated from its word count (animatic mode).
   Sound: when audio/mix.wav (made by tools/mix.mjs) matches the current timing, the video plays that one track.
   Otherwise it plays the bare voice clips, which is fine for looking at pictures and not for publishing.
   Writes studio/index.html, copies the audio to studio/assets/ep/<slug>/audio/ and writes <episode_dir>/timing.json
   (line, shot and chapter times, for the QA reviewer and the YouTube description). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { mixState } from "./cues.mjs";

const TM = createRequire(import.meta.url)("../engine/timing.js");
const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function linesFromScript(md) {
  const out = []; let spoken = true;
  for (const raw of md.split(/\r?\n/)) {
    // Only chapters hold spoken lines: "## DEVICES" (MOTIF:, PLANT:, VIEWER:) and "## SELF-CHECK" are notes, and "# TITLE:" is the title.
    if (/^##\s/.test(raw)) spoken = /^##\s+CH\d/i.test(raw.trim());
    if (!spoken || /^#/.test(raw.trim())) continue;
    const m = /^([A-Z][A-Z0-9_ ]{0,20}):\s+(.+)$/.exec(raw.trim());
    if (m) out.push({ id: "L" + String(out.length + 1).padStart(3, "0"), speaker: m[1] === "N" ? "N" : m[1].trim(), text: m[2].trim() });
  }
  return out;
}

export function wavSeconds(file) {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 0, 4) !== "RIFF") throw new Error("not a WAV file: " + file);
  let p = 12, rate = 0;
  while (p + 8 <= b.length) {
    const id = b.toString("ascii", p, p + 4), size = b.readUInt32LE(p + 4);
    if (id === "fmt ") rate = b.readUInt32LE(p + 16);
    if (id === "data") return Math.min(size, b.length - p - 8) / rate;
    p += 8 + size + (size % 2);
  }
  throw new Error("no data chunk in " + file);
}

export function load(ep) {
  const story = JSON.parse(fs.readFileSync(path.join(ep, "storyboard.json"), "utf8")), parts = path.join(ep, "storyboard");
  story.shots = story.shots || [];
  if (fs.existsSync(parts)) for (const f of fs.readdirSync(parts).filter((x) => x.endsWith(".json")).sort()) {
    const more = JSON.parse(fs.readFileSync(path.join(parts, f), "utf8")); story.shots.push(...(Array.isArray(more) ? more : more.shots || [])); }
  const seen = new Set(); for (const sh of story.shots) { if (seen.has(sh.id)) throw new Error(`two shots are called ${sh.id}`); seen.add(sh.id); }
  const lj = path.join(ep, "audio", "lines.json");
  let lines;
  if (fs.existsSync(lj)) lines = JSON.parse(fs.readFileSync(lj, "utf8"));
  else if (fs.existsSync(path.join(ep, "script.md"))) lines = linesFromScript(fs.readFileSync(path.join(ep, "script.md"), "utf8"));
  else throw new Error("need audio/lines.json or script.md in " + ep);
  const durations = {};
  for (const ln of lines) { const wav = path.join(ep, "audio", ln.id + ".wav"); if (fs.existsSync(wav)) durations[ln.id] = wavSeconds(wav); }
  // Measured word timings (voice.mjs --engine elevenlabs writes audio/<id>.words.json) place subtitles and word cues exactly.
  for (const ln of lines) { const wj = path.join(ep, "audio", ln.id + ".words.json");
    if (durations[ln.id] != null && fs.existsSync(wj)) { const w = JSON.parse(fs.readFileSync(wj, "utf8")); if (w.length === TM.words(ln.text).length) ln.wt = w.map((x) => [x.a, x.b]); } }
  const total = TM.schedule(lines, story, durations);
  const ids = new Set(lines.map((l) => l.id));
  for (const s of story.shots) if (s.cue && !ids.has(s.cue)) throw new Error(`shot ${s.id} cues unknown line ${s.cue}`);
  return { story, lines, total, durations, res: TM.resolve(story, lines, total) };
}

const stamp = (t) => Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");

// Cut a vertical Short out of an episode: the lines in the range, the shots that cue on them, the same clips.
function makeShort(ep, range, title, name) {
  const { story, lines } = load(ep), [a, b] = range.split("-"), i0 = lines.findIndex((l) => l.id === a), i1 = lines.findIndex((l) => l.id === (b || a));
  if (i0 < 0 || i1 < i0) throw new Error(`--short needs a line range such as L012-L020 (got ${range})`);
  const keep = lines.slice(i0, i1 + 1), ids = new Set(keep.map((l) => l.id)), dir = path.join(ep, "shorts", name);
  let shots = story.shots.filter((s) => s.type !== "chapter" && ids.has(s.cue));
  // A Short opens on a scene (lint H1): a title card at the start is dropped, the next scene starts with the first line.
  while (shots.length > 1 && shots[0].type === "card") { shots.shift(); if (shots[0].cue === keep[0].id) { shots[0] = Object.assign({}, shots[0]); delete shots[0].word; delete shots[0].at; } }
  // The picture that was on screen when the range starts comes along, so the Short never opens on nothing.
  if (!shots.length || shots[0].cue !== keep[0].id || shots[0].word || shots[0].at) { const before = story.shots.filter((s) => s.type !== "chapter" && lines.findIndex((l) => l.id === s.cue) <= i0 && !ids.has(s.cue)).pop() || story.shots.filter((s) => s.cue === keep[0].id)[0];
    if (before && !shots.includes(before)) { const first = Object.assign({}, before, { cue: keep[0].id }); delete first.word; delete first.at; shots = [first, ...shots]; } }
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(path.join(dir, "audio"), { recursive: true });
  fs.writeFileSync(path.join(dir, "storyboard.json"), JSON.stringify({ episode: name, demo: true, vertical: true, vtitle: title || story.title || "", title: story.title, viewer: story.viewer, audio: story.audio, shots }, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "audio", "lines.json"), JSON.stringify(keep.map((l) => ({ id: l.id, speaker: l.speaker, text: l.text })), null, 2) + "\n");
  for (const l of keep) { const f = path.join(ep, "audio", l.id + ".wav"); if (fs.existsSync(f)) fs.copyFileSync(f, path.join(dir, "audio", l.id + ".wav")); }
  return dir;
}

function main() {
  const args = process.argv.slice(2), val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  let ep = path.resolve(args.find((a, i) => !a.startsWith("--") && !["--short", "--title", "--name"].includes(args[i - 1])) || "");
  if (val("--short") && fs.existsSync(path.join(ep, "storyboard.json"))) { ep = makeShort(ep, val("--short"), val("--title"), val("--name") || "short1"); console.log(`short written to ${path.relative(process.cwd(), ep)}`); }
  if (!fs.existsSync(path.join(ep, "storyboard.json"))) { console.error("usage: node studio/tools/build.mjs <episode_dir> [--silent]"); process.exit(2); }
  const silent = args.includes("--silent"), slug = path.basename(ep);
  const { story, lines, total, durations, res } = load(ep);

  const out = path.join(STUDIO, "assets", "ep", slug, "audio");
  fs.rmSync(path.join(STUDIO, "assets", "ep", slug), { recursive: true, force: true });
  // Painted pictures (set "picture"): copied beside the audio, and the page is given their address.
  for (const p of story.shots.flatMap((s) => (s.type === "split" ? s.panels || [] : [s])).filter((p) => p.set === "picture" && p.opts && p.opts.src)) {
    const from = path.join(ep, p.opts.src), to = path.join(STUDIO, "assets", "ep", slug, p.opts.src);
    if (p.opts.src.includes("..") || !fs.existsSync(from)) { console.warn(`warning: picture ${p.opts.src} (${p.id || "a split panel"}) is not in the episode folder`); continue; }
    fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); p.opts.href = `assets/ep/${slug}/${p.opts.src}`;
  }
  // Names the engine does not know: an unknown set quietly draws as "studio" and an unknown thing as a box, which hides the fault, so say so here.
  {
    const src = (f) => fs.readFileSync(path.join(STUDIO, "engine", f), "utf8");
    const names = (text, from, to) => { const a = text.indexOf(from), b = text.indexOf(to, a); return new Set([...text.slice(a, b).matchAll(/^    ([a-z_0-9]+)(?:\(o\)|: *\{)/gm)].map((m) => m[1])); };
    const setsJs = src("sets.js"), sets = names(setsJs, "const SETS = {", "const PROPS = {"), props = names(setsJs, "const PROPS = {", "// Ambient motion"), things = names(src("rig.js"), "const THINGS = {", "// { hat:");
    // engine/scenes.js adds sets with Object.assign(S.SETS, {...}) and props as S.PROPS.<name> = ...
    const scn = src("scenes.js"); for (const m of scn.matchAll(/^    ([a-z_0-9]+): \(/gm)) sets.add(m[1]); for (const m of scn.matchAll(/^  S\.PROPS\.([a-z_0-9]+) = /gm)) props.add(m[1]);
    const bad = { set: new Map(), thing: new Map(), prop: new Map() };
    const note = (k, n, id) => { if (!bad[k].has(n)) bad[k].set(n, []); if (bad[k].get(n).length < 4) bad[k].get(n).push(id); };
    for (const p of story.shots.flatMap((s) => (s.type === "split" ? s.panels || [] : [s]))) {
      if (p.set && !sets.has(p.set)) note("set", p.set, p.id || "a panel");
      for (const a of p.actors || []) if (a.thing && !things.has(a.thing)) note("thing", a.thing, p.id || "a panel");
      for (const q of p.props || []) if (q.type && !props.has(q.type)) note("prop", q.type, p.id || "a panel");
    }
    for (const k of Object.keys(bad)) if (bad[k].size) console.warn(`warning: unknown ${k} name(s), drawn as a fallback: ` + [...bad[k]].map(([n, ids]) => `${n} (${ids.join(", ")})`).join("; "));
  }
  fs.mkdirSync(out, { recursive: true });
  const tags = [], mix = silent ? null : mixState(ep, { story, lines, total, res });
  if (mix && mix.current) {
    fs.copyFileSync(path.join(ep, "audio", "mix.wav"), path.join(out, "mix.wav"));
    tags.push(`      <audio id="amix" src="assets/ep/${slug}/audio/mix.wav" data-start="0" data-duration="${total}" data-track-index="1"></audio>`);
  } else if (!silent) for (const ln of lines) {
    if (durations[ln.id] == null) continue;
    fs.copyFileSync(path.join(ep, "audio", ln.id + ".wav"), path.join(out, ln.id + ".wav"));
    tags.push(`      <audio id="a${ln.id}" src="assets/ep/${slug}/audio/${ln.id}.wav" data-start="${ln.a}" data-duration="${ln.d}" data-track-index="1"></audio>`);
  }
  const js = (o) => JSON.stringify(o).replace(/<\//g, "<\\/");
  const page = `<!doctype html>
<html lang="en" data-resolution="${story.vertical ? "portrait" : "landscape"}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${story.vertical ? 1080 : 1920}, height=${story.vertical ? 1920 : 1080}" />
    <title>${slug}</title>
    <link rel="stylesheet" href="engine/studio.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="engine/timing.js"></script>
    <script src="engine/rig.js"></script>
    <script src="engine/sets.js"></script>
    <script src="engine/scenes.js"></script>
    <script src="engine/overlays.js"></script>
    <script src="engine/core.js"></script>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${story.vertical ? 1080 : 1920}" data-height="${story.vertical ? 1920 : 1080}">
${tags.join("\n")}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      Studio.build(tl, ${js(story)}, ${js(lines)}, ${total});
      tl.set({}, {}, ${total});
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      tl.seek(0);
      Studio.preview(tl);
    </script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(STUDIO, "index.html"), page);
  const est = lines.filter((l) => l.est).length;
  fs.writeFileSync(path.join(ep, "timing.json"), JSON.stringify({
    total, estimated_lines: est,
    lines: lines.map((l) => ({ id: l.id, speaker: l.speaker, a: l.a, d: l.d })),
    shots: res.shots.map((s) => ({ id: s.id, type: s.type || "scene", t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3) })),
    chapters: res.chapters.map((c) => ({ number: c.number, title: c.title, t: +c.t.toFixed(2), stamp: stamp(c.t) })),
  }, null, 2) + "\n");
  console.log(`${slug}: ${lines.length} lines, ${res.shots.length} shots, ${stamp(total)} (${total}s)` + (est ? `, ${est} line(s) without audio (estimated)` : "") + (silent ? ", silent" : ""));
  if (!silent && !est) console.log(mix && mix.current ? `  sound: audio/mix.wav (${mix.report.lufs} LUFS)` : `  sound: bare voice clips, ${mix ? "the mix is out of date" : "no mix yet"}. Run: node studio/tools/mix.mjs ${path.relative(process.cwd(), ep)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
