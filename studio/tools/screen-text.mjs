#!/usr/bin/env node
/* Every word and number the picture shows, with the shot and the time, so the fact-checker can check the storyboard too.
   The script is checked before the storyboard exists; signs, price tags, counters and labels are written afterwards.

   Usage: node studio/tools/screen-text.mjs <episode_dir>      writes <episode_dir>/screen-text.md and prints the count */
import fs from "node:fs";
import path from "node:path";
import { load } from "./build.mjs";

const ep = path.resolve(process.argv[2] || "");
if (!fs.existsSync(path.join(ep, "storyboard.json"))) { console.error("usage: node studio/tools/screen-text.mjs <episode_dir>"); process.exit(2); }
const { res } = load(ep), rows = [], mmss = (t) => Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
const add = (s, where, text) => { const t = String(text == null ? "" : text).trim(); if (t) rows.push([s.id, mmss(s.t0), where, t]); };
const scan = (s, pic, tag) => {
  for (const [k, v] of Object.entries(pic.opts || {})) if (typeof v === "string" && !/^#/.test(v)) add(s, `${tag}set ${pic.set} (${k})`, v); else if (Array.isArray(v)) add(s, `${tag}set ${pic.set} (${k})`, v.join(", "));
  for (const a of pic.actors || []) { const who = a.thing ? "thing " + a.thing : a.who; add(s, `${tag}${who} label`, a.label); add(s, `${tag}${who} placard`, a.sign); add(s, `${tag}${who} price tag`, a.tag); add(s, `${tag}${who} badge`, a.badge); }
  for (const p of pic.props || []) { add(s, `${tag}${p.type}`, [p.t, p.title, p.price, p.amount, p.sliceLabel, p.label].filter((x) => x != null).join(" | "));
    for (const it of p.items || p.blocks || []) add(s, `${tag}${p.type} part`, [it.label, it.show, it.t, it.val].filter((x) => x != null).join(" | ")); }
  add(s, `${tag}panel label`, pic.label); add(s, `${tag}panel stamp`, pic.stamp);
};
for (const s of res.shots) {
  if (s.type === "card") add(s, "text card", s.text); else if (s.type === "chapter") add(s, "chapter card", s.title);
  else if (s.type === "split") s.panels.forEach((p, i) => scan(s, p, `panel ${i + 1}: `)); else scan(s, s, "");
  for (const o of s.overlays || []) add(s, o.type, o.type === "counter" ? `${o.prefix || ""}${o.to}${o.suffix || ""}${o.cap ? " | " + o.cap : ""}` : o.type === "calendar" ? [o.month, o.day, o.dow].filter(Boolean).join(" ") :
    o.type === "clock" ? [o.t, o.ap, o.tz].filter(Boolean).join(" ") : o.type === "lower_third" ? [o.name, o.role].filter(Boolean).join(" | ") : [o.source, o.date, o.by, o.name, o.handle, o.quote, o.text, o.t].filter(Boolean).join(" | "));
}
const md = `# Text on screen\n\nEvery word and number the storyboard shows. The fact-checker marks each row against \`factcheck.md\`: a row that states a fact needs a source; a made-up name or a joke is marked as such.\n\n| Shot | Time | Where | Text | Checked |\n|---|---|---|---|---|\n` +
  rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3].replace(/\|/g, "/")} | |`).join("\n") + "\n";
fs.writeFileSync(path.join(ep, "screen-text.md"), md);
console.log(`${path.basename(ep)}: ${rows.length} pieces of text on screen -> ${path.relative(process.cwd(), path.join(ep, "screen-text.md"))}`);
