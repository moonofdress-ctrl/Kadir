#!/usr/bin/env node
/* Voice track: one clip per script line.
   Default: the free local Kokoro voices (through the HyperFrames CLI), a scratch track for timing and test renders.
   --engine elevenlabs: the published voices (channel-system/README.md, Voice row) through the ElevenLabs API, with
   word timings: audio/<id>.words.json ([{w, a, b}] in seconds from the clip start), which the build uses for subtitles and
   word cues, and which `mix.mjs --tighten` keeps in step. The key comes from the cloud environment's network proxy
   (ELEVENLABS_API_KEY is used when set, else a placeholder the proxy replaces). Costs one credit per character.

   Usage: node studio/tools/voice.mjs <episode_dir> [--engine elevenlabs] [--dry-run] [--force] [--only L012,L013]
   --dry-run prints how many lines and characters would be voiced, and calls nothing.

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
export const VOICES = { N: ["am_michael", 1.05], BENNY: ["am_adam", 1.0], CHAD: ["am_adam", 1.2], HAL: ["bm_george", 0.9], MARTHA: ["af_heart", 1.0], REGGIE: ["bm_george", 0.8],
  SODA: ["af_bella", 1.15], GIANT: ["bm_lewis", 0.85] }; // SODA and GIANT: the speaking objects of the Poppi episode (a can, a cola giant)

// speaker -> [ElevenLabs voice id, speed 0.7-1.2]. Narrator: Lawrence - Bright and Informative (chosen 13 Nov 2026); its own
// sample reads at 234 wpm, so it runs slower to land near the rival's 160-175 wpm. Reserves: Tyler Cruz SA7eD52NRr8WAehitVt1, Mike zfc8CJQpe8Kqyl0vvCzo.
export const EL_VOICES = { N: ["ktkP7Nsj67dw2zcplQYt", 0.9], BENNY: ["TX3LPaxmHKxFdv7VOQHJ", 1.0], SODA: ["IKne3meq5aSn9XLyUdCD", 1.05],
  GIANT: ["N2lVS1w4EtoT3dr4eOWO", 0.95], CHAD: ["bIHbv24MWmeRgasZH58o", 1.1], HAL: ["pqHfZKP75CvOlQylNhV4", 0.95], MARTHA: ["EXAVITQu4vr4xnSDxMaL", 1.0], REGGIE: ["nPczCjzI2devNBz1zQrb", 0.9] };
export const EL_MODEL = "eleven_multilingual_v2";

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
const engArg = args.indexOf("--engine"), engine = engArg >= 0 ? args[engArg + 1] : "kokoro", MAP = engine === "elevenlabs" ? EL_VOICES : VOICES;
if (!["kokoro", "elevenlabs"].includes(engine)) { console.error(`unknown engine "${engine}"; use kokoro or elevenlabs`); process.exit(2); }
const unknown = [...new Set(todo.map((l) => l.speaker).filter((s) => !MAP[s]))];
if (unknown.length) console.warn(`warning: no ${engine} voice set for ${unknown.join(", ")}; using the narrator's. Add them in studio/tools/voice.mjs.`);
if (args.includes("--dry-run")) {
  const chars = todo.reduce((n, l) => n + l.text.length, 0);
  console.log(`${path.basename(ep)}: ${todo.length} of ${lines.length} lines to voice with ${engine}, ${chars} characters${engine === "elevenlabs" ? " (= credits)" : ""}`);
  process.exit(0);
}
if (engine === "elevenlabs") { await eleven(); process.exit(0); }

// Words with their times from ElevenLabs' character alignment; words are split exactly as the engine splits them (on spaces).
function wordsFromAlignment(text, al) {
  const ch = al.characters, st = al.character_start_times_seconds, en = al.character_end_times_seconds, out = [];
  let cur = null;
  for (let i = 0; i < ch.length; i++) {
    if (/\s/.test(ch[i])) { if (cur) { out.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: "", a: st[i], b: en[i] };
    cur.w += ch[i]; cur.b = en[i];
  }
  if (cur) out.push(cur);
  return out.map((w) => ({ w: w.w, a: +w.a.toFixed(3), b: +w.b.toFixed(3) }));
}

async function eleven() {
  const key = process.env.ELEVENLABS_API_KEY || "proxy-injected"; let done = 0, chars = 0;
  for (const ln of todo) {
    const [voice, speed] = MAP[ln.speaker] || MAP.N, wav = path.join(adir, ln.id + ".wav"), mp3 = path.join(adir, ln.id + ".el.mp3");
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: ln.text, model_id: EL_MODEL, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2, speed } }) });
    if (!res.ok) { console.error(`ElevenLabs failed on ${ln.id}: ${res.status} ${(await res.text()).slice(0, 300)}`); process.exit(1); }
    const j = await res.json();
    fs.writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
    const r = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", mp3, "-ac", "1", "-ar", "48000", wav], { encoding: "utf8" });
    fs.rmSync(mp3, { force: true });
    if (r.status !== 0) { console.error(`ffmpeg failed on ${ln.id}: ${(r.stderr || "").slice(-300)}`); process.exit(1); }
    const words = wordsFromAlignment(ln.text, j.alignment || j.normalized_alignment);
    fs.writeFileSync(path.join(adir, ln.id + ".words.json"), JSON.stringify(words) + "\n");
    if (words.length !== ln.text.split(/\s+/).filter(Boolean).length) console.warn(`warning: ${ln.id} word count differs from the script; the build falls back to estimated word times for it`);
    chars += ln.text.length;
    if (++done % 20 === 0) console.log(`  ${done}/${todo.length}`);
  }
  console.log(`${path.basename(ep)}: ${lines.length} lines, ${done} clip(s) made with ElevenLabs (${chars} characters), word timings in audio/<id>.words.json`);
  if (done) console.log(`  next: node studio/tools/mix.mjs ${path.relative(process.cwd(), ep)} --tighten`);
}

let done = 0;
for (const ln of todo) {
  const [voice, speed] = MAP[ln.speaker] || MAP.N, txt = path.join(adir, ln.id + ".txt"), wav = path.join(adir, ln.id + ".wav");
  fs.writeFileSync(txt, ln.text);
  const r = spawnSync("npx", ["--yes", "hyperframes@0.9.26", "tts", txt, "-v", voice, "-s", String(speed), "-o", wav], { cwd: STUDIO, encoding: "utf8", shell: process.platform === "win32" });
  fs.rmSync(txt, { force: true });
  if (r.status !== 0 || !fs.existsSync(wav)) { console.error(`voice failed on ${ln.id}: ${((r.stderr || "") + (r.stdout || "")).trim().slice(-400)}`); process.exit(1); }
  if (++done % 20 === 0) console.log(`  ${done}/${todo.length}`);
}
console.log(`${path.basename(ep)}: ${lines.length} lines, ${done} clip(s) made with Kokoro (a scratch track, not the published voice)`);
if (done) console.log(`  next: node studio/tools/mix.mjs ${path.relative(process.cwd(), ep)} --tighten`);
