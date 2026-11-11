#!/usr/bin/env node
/* Scratch voice track: one clip per script line with the free local Kokoro voices (through the HyperFrames CLI).
   For timing, storyboards and test renders. The published narrator is the user's decision (FORMAT_BOOK 14).

   Usage: node studio/tools/voice.mjs <episode_dir> [--force] [--only L012,L013]

   Writes audio/lines.json from script.md when it is missing, then audio/<id>.wav for every line without a clip.
   --force redoes every clip; --only redoes the listed ones. Existing recordings are never replaced otherwise.
   Needs network access the first time (the voice model is downloaded once). */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { linesFromScript } from "./build.mjs";

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// speaker -> [Kokoro voice, speed]. A speaker not listed here gets the narrator's voice and a warning.
export const VOICES = { N: ["am_michael", 1.05], BENNY: ["am_adam", 1.0], CHAD: ["am_adam", 1.2], HAL: ["bm_george", 0.9], MARTHA: ["af_heart", 1.0], REGGIE: ["bm_george", 0.8] };

const args = process.argv.slice(2), ep = path.resolve(args.find((a) => !a.startsWith("--")) || "");
if (!fs.existsSync(path.join(ep, "script.md")) && !fs.existsSync(path.join(ep, "audio", "lines.json"))) { console.error("usage: node studio/tools/voice.mjs <episode_dir> [--force] [--only L012,L013]"); process.exit(2); }
const adir = path.join(ep, "audio"), lj = path.join(adir, "lines.json"); fs.mkdirSync(adir, { recursive: true });
const fromScript = fs.existsSync(path.join(ep, "script.md")) ? linesFromScript(fs.readFileSync(path.join(ep, "script.md"), "utf8")) : null;
if (!fs.existsSync(lj)) fs.writeFileSync(lj, JSON.stringify(fromScript, null, 2) + "\n");
const lines = JSON.parse(fs.readFileSync(lj, "utf8"));
if (fromScript && JSON.stringify(fromScript.map((l) => [l.speaker, l.text])) !== JSON.stringify(lines.map((l) => [l.speaker, l.text])))
  console.warn("warning: script.md no longer matches audio/lines.json. Delete lines.json to renumber the lines (the storyboard cues on these ids), or edit it by hand.");

const onlyArg = args.indexOf("--only"), only = onlyArg >= 0 ? new Set(String(args[onlyArg + 1] || "").split(",")) : null, force = args.includes("--force");
const todo = lines.filter((l) => (only ? only.has(l.id) : force || !fs.existsSync(path.join(adir, l.id + ".wav"))));
const unknown = [...new Set(todo.map((l) => l.speaker).filter((s) => !VOICES[s]))];
if (unknown.length) console.warn(`warning: no voice set for ${unknown.join(", ")}; using the narrator's. Add them to VOICES in studio/tools/voice.mjs.`);

let done = 0;
for (const ln of todo) {
  const [voice, speed] = VOICES[ln.speaker] || VOICES.N, txt = path.join(adir, ln.id + ".txt"), wav = path.join(adir, ln.id + ".wav");
  fs.writeFileSync(txt, ln.text);
  const r = spawnSync("npx", ["--yes", "hyperframes@0.9.26", "tts", txt, "-v", voice, "-s", String(speed), "-o", wav], { cwd: STUDIO, encoding: "utf8", shell: process.platform === "win32" });
  fs.rmSync(txt, { force: true });
  if (r.status !== 0 || !fs.existsSync(wav)) { console.error(`voice failed on ${ln.id}: ${((r.stderr || "") + (r.stdout || "")).trim().slice(-400)}`); process.exit(1); }
  if (++done % 20 === 0) console.log(`  ${done}/${todo.length}`);
}
console.log(`${path.basename(ep)}: ${lines.length} lines, ${done} clip(s) made with Kokoro (a scratch track, not the published voice)`);
if (done) console.log(`  next: node studio/tools/mix.mjs ${path.relative(process.cwd(), ep)} --tighten`);
