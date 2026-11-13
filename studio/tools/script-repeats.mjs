#!/usr/bin/env node
/* Find repetition in a script before it is voiced: every spoken word costs voice credits and viewer patience.

   Usage: node studio/tools/script-repeats.mjs <episode_dir> [--min 4] [--out <file>]

   Reports, for the spoken lines of script.md (or audio/lines.json):
   R1  word runs of --min words or more (default 4) said more than once, outside the planned returning lines;
   R2  numbers said three times or more (one is the plant, one the payoff; a third is usually filler);
   R3  narration lines that open with the same two words as one of the three lines before;
   R4  narration lines over 30 words (FORMAT_BOOK 5 wants short sentences).
   Planned repeats are allowed: lines quoted in the script's RETURNING LINE and PLANT/PAYOFF notes are skipped for R1.
   Writes <episode_dir>/repeats.md with a suggestion per finding; the scriptwriter decides. Exit code is always 0. */
import fs from "node:fs";
import path from "node:path";
import { linesFromScript } from "./build.mjs";

const args = process.argv.slice(2), ep = path.resolve(args.find((a) => !a.startsWith("--")) || "");
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const sp = path.join(ep, "script.md"), lj = path.join(ep, "audio", "lines.json");
if (!fs.existsSync(sp) && !fs.existsSync(lj)) { console.error("usage: node studio/tools/script-repeats.mjs <episode_dir> [--min 4]"); process.exit(2); }
const md = fs.existsSync(sp) ? fs.readFileSync(sp, "utf8") : "";
const lines = fs.existsSync(lj) ? JSON.parse(fs.readFileSync(lj, "utf8")) : linesFromScript(md);
const MIN = +opt("min", 4);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9$%.']/g, "").replace(/\.$/, "");
const toks = (t) => t.split(/\s+/).map(norm).filter(Boolean);
// planned repeats: quoted phrases in the device notes
const planned = new Set();
for (const m of md.matchAll(/^(RETURNING LINE|PLANT[^:]*|MOTIF):.*$/gm)) for (const q of m[0].matchAll(/"([^"]+)"/g)) { const t = toks(q[1]); for (let i = 0; i + MIN <= t.length; i++) planned.add(t.slice(i, i + MIN).join(" ")); }

const runs = new Map(); // ngram -> [line ids]
lines.forEach((ln) => { const t = toks(ln.text), seen = new Set();
  for (let i = 0; i + MIN <= t.length; i++) { const g = t.slice(i, i + MIN).join(" "); if (seen.has(g)) continue; seen.add(g); if (!runs.has(g)) runs.set(g, []); runs.get(g).push(ln.id); } });
const STOP = /^(it is|this is|that is|there is|and then|one of the|in the|of the|to the|on the|at the)/;
let r1 = [...runs].filter(([g, ids]) => ids.length > 1 && !planned.has(g) && !STOP.test(g) && !/^(the|a|and|of|to|in|is|it|that|for|on|was|he|she|they|you) (the|a|and|of|to|in|is|it|that|for|on|was) /.test(g));
// merge overlapping runs said in the same lines into one phrase ("so how did poppi" + "how did poppi make" -> "so how did poppi make ...")
const groups = new Map(); for (const [g, ids] of r1) { const k = ids.join(","); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(g); }
const keep = [];
for (const [k, gs] of groups) { let ph = gs.map((g) => g.split(" "));
  for (let changed = true; changed;) { changed = false;
    outer: for (let a = 0; a < ph.length; a++) for (let b = 0; b < ph.length; b++) if (a !== b && ph[a].slice(1).join(" ") === ph[b].slice(0, MIN - 1).join(" ") && ph[a].length >= MIN) {
      const tail = ph[b].slice(MIN - 1); ph[a] = ph[a].concat(tail.length ? tail : []); ph.splice(b, 1); changed = true; break outer; } }
  for (const p of ph) keep.push([p.join(" "), k.split(",")]); }
keep.sort((a, b) => b[0].split(" ").length * b[1].length - a[0].split(" ").length * a[1].length);
r1 = keep.slice(0, 40);

const nums = new Map();
const NUMRE = /\$?\d[\d,.]*\s*(?:%|percent|million|billion|thousand|dollars?)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|thirty|forty|fifty|sixty|hundred)(?:[\s-]+(?:point|hundred|thousand|million|billion|percent|five|nine|one|two|three|four|six|seven|eight))*\s+(?:million|billion|thousand|percent|dollars)\b/gi;
lines.forEach((ln) => { for (const m of ln.text.matchAll(NUMRE)) { const k = m[0].toLowerCase().replace(/\s+/g, " ").trim().replace(/[.,;:]+$/, ""); if (/^(19|20)\d\d$/.test(k) || k.length < 2) continue; if (!nums.has(k)) nums.set(k, []); nums.get(k).push(ln.id); } });
const r2 = [...nums].filter(([, ids]) => ids.length >= 3);

const narr = lines.filter((l) => l.speaker === "N"), r3 = [];
narr.forEach((ln, i) => { const o = toks(ln.text).slice(0, 2).join(" "); if (!o) return;
  for (let j = Math.max(0, i - 3); j < i; j++) if (toks(narr[j].text).slice(0, 2).join(" ") === o) { r3.push([ln.id, narr[j].id, o]); break; } });
const r4 = narr.filter((l) => toks(l.text).length > 30).map((l) => [l.id, toks(l.text).length]);

const words = lines.reduce((n, l) => n + toks(l.text).length, 0), chars = lines.reduce((n, l) => n + l.text.length, 0);
const L = (id) => { const l = lines.find((x) => x.id === id); return `${id} (${l.speaker}): "${l.text.length > 110 ? l.text.slice(0, 107) + "..." : l.text}"`; };
let out = `# Repetition report: ${path.basename(ep)}\n\n${lines.length} lines, ${words} words, ${chars} characters. Made by \`studio/tools/script-repeats.mjs\`. Suggestions only: the scriptwriter decides, and a cut line must keep the storyboard's cue ids (edit the text, do not delete a line that a shot cues on).\n\n`;
out += `## R1 Repeated word runs (${r1.length})\nSay it once; the second time, point back to it (\"that number\", \"the same deal\") or cut it.\n\n` + (r1.map(([g, ids]) => `- "${g}" in ${ids.join(", ")}\n` + ids.map((id) => `  - ${L(id)}`).join("\n")).join("\n") || "none") + "\n\n";
out += `## R2 Numbers said three times or more (${r2.length})\nKeep the plant and the payoff; replace the rest with \"that\" or the picture.\n\n` + (r2.map(([k, ids]) => `- ${k}: ${ids.join(", ")}`).join("\n") || "none") + "\n\n";
out += `## R3 Narration lines opening like a recent one (${r3.length})\nVary the opening or merge the two lines.\n\n` + (r3.map(([a, b, o]) => `- ${a} and ${b} both open "${o}"`).join("\n") || "none") + "\n\n";
out += `## R4 Long narration lines, over 30 words (${r4.length})\nSplit or trim.\n\n` + (r4.map(([id, n]) => `- ${n} words: ${L(id)}`).join("\n") || "none") + "\n";
const dest = path.resolve(opt("out", path.join(ep, "repeats.md")));
fs.writeFileSync(dest, out);
console.log(`${path.basename(ep)}: R1 ${r1.length} repeated runs, R2 ${r2.length} numbers said 3+ times, R3 ${r3.length} same openings, R4 ${r4.length} long lines -> ${path.relative(process.cwd(), dest)}`);
