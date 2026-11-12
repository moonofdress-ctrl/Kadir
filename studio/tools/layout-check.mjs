#!/usr/bin/env node
/* Layout check on the real picture: finds written things that something else covers.

   Usage: node studio/tools/layout-check.mjs <episode_dir> [--t 12,208.5] [--json]

   Opens the current build in a browser, goes to the late part of every shot (when its signs and overlays
   have arrived) and asks the page what is on top at five points across each piece of text. A text that
   is covered at two or more points is reported with its time, its words and what covers it: a lamp pole
   over a sign, a tag over a sign, a head in front of a banner. The retention lint's L1 guesses the same
   from the storyboard's numbers; this looks at what was really drawn.

   It also reads the storyboard for faults a picture cannot show:
   - a counter in a shot too short for it to reach its last number.

   Exit code 1 when anything is found. Run it after every build, before QA and long before any render.
   Needs the same browser driver as stills.mjs (npm install --no-save playwright-core, in studio/). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { serve } from "./preview.mjs";
import { load } from "./build.mjs";

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), ep = args[0] && !args[0].startsWith("--") ? path.resolve(args[0]) : null;
const opt = (name) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : null; };
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
if (!ep) { console.error("usage: node studio/tools/layout-check.mjs <episode_dir> [--t 12,208.5] [--json]"); process.exit(2); }

function launch() {
  const req = createRequire(import.meta.url);
  const pf = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(Boolean);
  const installed = () => [
    ...pf.flatMap((d) => [path.join(d, "Google/Chrome/Application/chrome.exe"), path.join(d, "Microsoft/Edge/Application/msedge.exe")]),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ].find((f) => fs.existsSync(f));
  for (const name of ["playwright", "playwright-core"]) {
    let pw; try { pw = req(name); } catch { continue; }
    const exe = process.env.CHROME_PATH || (name === "playwright-core" ? installed() : null);
    return pw.chromium.launch(exe ? { executablePath: exe } : {});
  }
  throw new Error("No browser driver. Once, in studio/: npm install --no-save playwright-core");
}

// Runs in the page: every visible piece of text, and what lies on top of it.
function probe() {
  const W = innerWidth, H = innerHeight, out = [];
  const shown = (el) => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) < 0.6) return false; } return true; };
  const words = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();
  const own = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
  const els = [...document.querySelectorAll("svg text"), ...[...document.querySelectorAll("body *:not(svg):not(svg *)")].filter(own)];
  for (const el of els) {
    if (el.closest(".subs, [data-layout-ignore], script, style")) continue;
    const t = words(el); if (t.length < 2) continue;
    const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 6 || r.right < 0 || r.left > W || r.bottom < 0 || r.top > H || !shown(el)) continue;
    const unit = el.closest(".cut") || el.parentElement || el, hits = []; // .cut is the paper piece a sign's words are printed on
    for (const f of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const x = r.left + r.width * f, y = r.top + r.height * 0.5; if (x < 0 || x >= W || y < 0 || y >= H) continue;
      // the first thing at this point that is not a frame-sized holder or wash (vignette, grade, a layer's own box)
      const top = document.elementsFromPoint(x, y).find((e) => { const q = e.getBoundingClientRect(); return shown(e) && !(/^(div|svg|g|section|main|body|html)$/i.test(e.tagName) && q.width * q.height > W * H * 0.5); });
      if (!top || top === el || el.contains(top) || unit.contains(top) || top.closest(".subs")) continue;
      const tt = top.closest("svg text") || (own(top) ? top : null), holder = top.closest("[class]");
      hits.push(tt ? `text "${words(tt).slice(0, 24)}"` : `${top.tagName.toLowerCase()}${holder && holder.getAttribute("class") ? "." + String(holder.getAttribute("class")).split(/\s+/)[0] : ""}`);
    }
    if (hits.length >= 2) out.push({ text: t.slice(0, 40), by: [...new Set(hits)].slice(0, 2).join(", "), points: hits.length });
    else if (r.left < -4 || r.right > W + 4) out.push({ text: t.slice(0, 40), by: "the edge of the frame", points: 0 });
  }
  return out;
}

const { res, total } = load(ep);
const html = fs.existsSync(path.join(STUDIO, "index.html")) ? fs.readFileSync(path.join(STUDIO, "index.html"), "utf8") : "";
if (!html.includes(`<title>${path.basename(ep)}</title>`)) { console.error(`studio/index.html is not a build of ${path.basename(ep)}. Run: node studio/tools/build.mjs ${path.relative(process.cwd(), ep)}`); process.exit(2); }

const found = [];

// 1. From the storyboard: counters cut short.
for (const s of res.shots) {
  const pics = s.type === "split" ? s.panels || [] : [s], over = [...new Set([...(s.overlays || []), ...pics.flatMap((p) => p.overlays || [])])];
  for (const o of over) {
    if (o.type === "counter") { const roll = (o.at || 0) + (o.dur || o.duration || 0), len = s.t1 - s.t0; if (roll && roll + 0.8 > len) found.push({ t: s.t0, shot: s.id, what: `counter needs ${roll.toFixed(1)}s plus a hold, the shot is ${len.toFixed(1)}s` }); }
  }
}

// 2. From the picture: covered text, late in every shot.
const times = opt("t") ? opt("t").split(",").map(Number) : res.shots.filter((s) => s.type !== "card" && s.type !== "chapter").map((s) => +(s.t0 + (s.t1 - s.t0) * 0.85).toFixed(2));
const { server, port } = await serve(0), b = await launch();
try {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`http://127.0.0.1:${port}/?fit&t=0`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  await p.addStyleTag({ content: "* { pointer-events: auto !important; }" });
  const canSeek = await p.evaluate(() => !!(window.__timelines && window.__timelines.main && window.__timelines.main.seek));
  for (const t of times) {
    if (canSeek) await p.evaluate((t) => { window.__timelines.main.seek(t, false); }, t);
    else { await p.goto(`http://127.0.0.1:${port}/?fit&t=${t}`, { waitUntil: "domcontentloaded" }); await p.addStyleTag({ content: "* { pointer-events: auto !important; }" }); }
    await p.waitForTimeout(canSeek ? 60 : 900);
    const shot = res.shots.find((s) => t >= s.t0 && t < s.t1);
    for (const h of await p.evaluate(probe)) found.push({ t, shot: shot ? shot.id : "?", what: `"${h.text}" is covered by ${h.by}` });
  }
} finally { await b.close(); server.close(); }

found.sort((a, b2) => a.t - b2.t);
if (args.includes("--json")) console.log(JSON.stringify({ episode: path.basename(ep), total, checked: times.length, found }, null, 2));
else {
  console.log(`\nLayout check: ${path.basename(ep)}  (${times.length} moments looked at)\n`);
  for (const f of found) console.log(`  ${mmss(f.t).padStart(5)}  ${String(f.shot).padEnd(8)} ${f.what}`);
  console.log(`\n  ${found.length} fault(s)${found.length ? ": fix them in the storyboard, build, and run this again before QA" : ""}\n`);
}
process.exit(found.length ? 1 : 0);
