#!/usr/bin/env node
/* The quality reference (STYLE_GUIDE, The quality reference; FORMAT_BOOK 11, Look gate).
   Builds channel-system/brand/quality_reference.jpg: the rival's six frames on top (3 x 2), our best six below (3 x 2).
   Our frames (ours_1..6) are in channel-system/brand/quality_reference/ and in git. The rival's (rival_1..6) are NOT in git, because
   the repository is public and they are another channel's pictures: they live in %USERPROFILE%\.kadir\quality_reference\ on the
   user's PC (the user's screenshots of 13 Nov 2026), and the sheet is built on each machine (it is ignored by git). A missing frame is a grey box.

   node channel-system/brand/quality-reference.mjs                                   build the sheet from the frames there
   node channel-system/brand/quality-reference.mjs --ours <video.mp4> --t 6,42,...   first take our six frames from a render (seconds)
   node channel-system/brand/quality-reference.mjs --rival <video.mp4> --t ...       the same for the rival's, from a file the user gave
   Needs FFmpeg on the PATH. */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import os from "node:os";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)), dir = path.join(here, "quality_reference"), out = path.join(here, "quality_reference.jpg");
const shared = path.join(os.homedir(), ".kadir", "quality_reference"); // the rival's frames, outside the public repository
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ff = (a) => { const r = spawnSync("ffmpeg", ["-y", "-v", "error", ...a], { encoding: "utf8" }); if (r.status !== 0) { console.error((r.stderr || r.error || "ffmpeg failed").toString().slice(-400)); process.exit(1); } };
fs.mkdirSync(dir, { recursive: true });

for (const who of ["ours", "rival"]) {
  const video = opt("--" + who); if (!video) continue;
  const ts = String(opt("--t") || "").split(",").filter(Boolean).map(Number);
  if (ts.length !== 6) { console.error("--t needs six times in seconds, e.g. --t 6,42,234,282,330,510"); process.exit(2); }
  const to = who === "rival" ? shared : dir; fs.mkdirSync(to, { recursive: true });
  ts.forEach((t, i) => ff(["-ss", String(t), "-i", video, "-frames:v", "1", "-vf", "scale=960:540", "-q:v", "3", path.join(to, `${who}_${i + 1}.jpg`)]));
  console.log(`${who}: six frames saved in ${to}`);
}

const find = (name) => [dir, shared].flatMap((d) => [".jpg", ".png", ".jpeg", ".webp"].map((e) => path.join(d, name + e))).find((f) => fs.existsSync(f));
const W = 640, H = 360, GAP = 24, inputs = [], missing = [];
for (const name of [1, 2, 3, 4, 5, 6].map((n) => "rival_" + n).concat([1, 2, 3, 4, 5, 6].map((n) => "ours_" + n))) {
  const f = find(name);
  if (f) inputs.push("-i", f); else { missing.push(name); inputs.push("-f", "lavfi", "-i", `color=c=0x4a4d63:s=${W}x${H}:d=1`); }
}
// rival rows at y 0 and H, ours at y 2H+GAP and 3H+GAP; three columns
const pos = Array.from({ length: 12 }, (_, i) => { const block = i < 6 ? 0 : 1, k = i % 6; return `${(k % 3) * W}_${Math.floor(k / 3) * H + block * (2 * H + GAP)}`; });
const scale = Array.from({ length: 12 }, (_, i) => `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1[v${i}]`).join(";");
ff([...inputs, "-filter_complex", `${scale};${Array.from({ length: 12 }, (_, i) => `[v${i}]`).join("")}xstack=inputs=12:layout=${pos.join("|")}:fill=0xe0262b[o]`, "-map", "[o]", "-frames:v", "1", "-q:v", "3", out]);
console.log(`quality reference: ${path.relative(process.cwd(), out)} (top: rival, bottom: ours; a red line between them)${missing.length ? `; grey boxes for ${missing.join(", ")}` : ""}`);
