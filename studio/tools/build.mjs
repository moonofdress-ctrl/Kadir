#!/usr/bin/env node
/* Build studio/index.html for one episode.

   Usage: node studio/tools/build.mjs <episode_dir> [--silent]

   Reads <episode_dir>/storyboard.json and audio/lines.json (made from script.md if missing).
   Line lengths come from audio/<id>.wav; a missing clip is estimated from its word count (animatic mode).
   Writes studio/index.html, copies the clips to studio/assets/ep/<slug>/audio/ and writes <episode_dir>/timing.json
   (line, shot and chapter times, for the QA reviewer and the YouTube description). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const TM = createRequire(import.meta.url)("../engine/timing.js");
const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function linesFromScript(md) {
  const out = [];
  for (const raw of md.split(/\r?\n/)) {
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
  const story = JSON.parse(fs.readFileSync(path.join(ep, "storyboard.json"), "utf8"));
  const lj = path.join(ep, "audio", "lines.json");
  let lines;
  if (fs.existsSync(lj)) lines = JSON.parse(fs.readFileSync(lj, "utf8"));
  else if (fs.existsSync(path.join(ep, "script.md"))) lines = linesFromScript(fs.readFileSync(path.join(ep, "script.md"), "utf8"));
  else throw new Error("need audio/lines.json or script.md in " + ep);
  const durations = {};
  for (const ln of lines) { const wav = path.join(ep, "audio", ln.id + ".wav"); if (fs.existsSync(wav)) durations[ln.id] = wavSeconds(wav); }
  const total = TM.schedule(lines, story, durations);
  const ids = new Set(lines.map((l) => l.id));
  for (const s of story.shots) if (s.cue && !ids.has(s.cue)) throw new Error(`shot ${s.id} cues unknown line ${s.cue}`);
  return { story, lines, total, durations, res: TM.resolve(story, lines, total) };
}

const stamp = (t) => Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");

function main() {
  const args = process.argv.slice(2), ep = path.resolve(args.find((a) => !a.startsWith("--")) || "");
  if (!fs.existsSync(path.join(ep, "storyboard.json"))) { console.error("usage: node studio/tools/build.mjs <episode_dir> [--silent]"); process.exit(2); }
  const silent = args.includes("--silent"), slug = path.basename(ep);
  const { story, lines, total, durations, res } = load(ep);

  const out = path.join(STUDIO, "assets", "ep", slug, "audio");
  fs.rmSync(path.join(STUDIO, "assets", "ep", slug), { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const tags = [];
  if (!silent) for (const ln of lines) {
    if (durations[ln.id] == null) continue;
    fs.copyFileSync(path.join(ep, "audio", ln.id + ".wav"), path.join(out, ln.id + ".wav"));
    tags.push(`      <audio id="a${ln.id}" src="assets/ep/${slug}/audio/${ln.id}.wav" data-start="${ln.a}" data-duration="${ln.d}" data-track-index="1"></audio>`);
  }
  const js = (o) => JSON.stringify(o).replace(/<\//g, "<\\/");
  const page = `<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>${slug}</title>
    <link rel="stylesheet" href="engine/studio.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="engine/timing.js"></script>
    <script src="engine/rig.js"></script>
    <script src="engine/sets.js"></script>
    <script src="engine/overlays.js"></script>
    <script src="engine/core.js"></script>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
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
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
