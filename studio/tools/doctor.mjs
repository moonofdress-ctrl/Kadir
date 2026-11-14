#!/usr/bin/env node
/* Checks that this PC can run the pipeline (SETUP.md). Usage: node studio/tools/doctor.mjs */
import { spawnSync } from "node:child_process";
import fs from "node:fs"; import os from "node:os"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rows = []; const ok = (name, pass, fix) => rows.push([pass ? "OK  " : "MISS", name, pass ? "" : fix]);
const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8", }); return r.status === 0 ? (r.stdout || r.stderr) : null; };
const major = +process.versions.node.split(".")[0];
ok(`Node ${process.versions.node}`, major >= 22, "install Node.js 22 LTS or newer (SETUP.md step 2)");
ok("Git", !!run("git", ["--version"]), "install Git for Windows (SETUP.md step 1)");
ok("FFmpeg", !!run(process.env.FFMPEG || "ffmpeg", ["-version"]), "winget install Gyan.FFmpeg, then reopen the shell (step 3)");
const pw = ["playwright-core", "playwright"].some(m => fs.existsSync(path.join(root, "studio", "node_modules", m)));
ok("Playwright driver in studio/", pw, "cd studio && npm install --no-save playwright-core");
const pf = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(Boolean);
const browsers = pf.flatMap(p => [path.join(p, "Google/Chrome/Application/chrome.exe"), path.join(p, "Microsoft/Edge/Application/msedge.exe")]);
ok("Chrome or Edge", !!(process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) || browsers.some(f => fs.existsSync(f)) || process.platform !== "win32", "install Chrome or set CHROME_PATH (step 4)");
const py = process.env.HYPERFRAMES_PYTHON;
ok("Scratch voice Python (HYPERFRAMES_PYTHON)", !!(py && fs.existsSync(py)), "optional: Python 3.12 + kokoro-onnx, then set HYPERFRAMES_PYTHON (SETUP.md)");
ok("ELEVENLABS_API_KEY", !!process.env.ELEVENLABS_API_KEY, "optional, voicing PC only: set the user variable (step 8)");
const qr = path.join(os.homedir(), ".kadir", "quality_reference");
const rivals = [1,2,3,4,5,6].filter(i => ["jpg","png"].some(e => fs.existsSync(path.join(qr, `rival_${i}.${e}`)))).length;
ok(`Rival frames (${rivals}/6)`, rivals === 6, `copy rival_1..6 from the backup into ${qr} (SETUP.md)`);
const branch = run("git", ["-C", root, "rev-parse", "--abbrev-ref", "HEAD"])?.trim();
const behind = run("git", ["-C", root, "rev-list", "--count", "HEAD..origin/main"])?.trim();
ok(`Branch ${branch}, ${behind ?? "?"} commits behind origin/main`, behind === "0", "git fetch origin, then merge origin/main (CLAUDE.md rule 11)");
for (const [s, n, f] of rows) console.log(`${s} ${n}${f ? "  ->  " + f : ""}`);
const miss = rows.filter(r => r[0] === "MISS" && !r[2].startsWith("optional")).length;
console.log(miss ? `\n${miss} required item(s) missing.` : "\nReady.");
process.exitCode = miss ? 1 : 0;
