#!/usr/bin/env node
/* Save pictures from the engine: frames to look at, the thumbnail, and the cast's model sheets.

   node studio/tools/stills.mjs frames <episode_dir> [--t 0,3,9.5] [--every 10] [--cols 3] [--out file.jpg]
       A contact sheet of frames from the CURRENT build (run build.mjs for that episode first).
       Without --t: the first frame, one frame in the middle of every shot, and the last second.
       Writes <episode_dir>/render/frames.jpg. Agents and reviewers read this instead of opening a browser.

   node studio/tools/stills.mjs thumb <episode_dir> --white "AMAZON KEEPS" --red "$52" [--t 2] [--image art.png] [--out file.png]
       1280x720 thumbnail: the frame at --t (default 2 s, inside the first shot) or an illustration, under the text band.
       Writes <episode_dir>/thumbnail.png and thumbnail_small.png (160x90, to check it still reads).

   node studio/tools/stills.mjs sheets
       Model sheets of the cast, drawn by the rig, into channel-system/characters/sheets/.

   Needs a Chromium that Playwright can drive (`npm install --no-save playwright` and `npx playwright install chromium`, once).
   Set CHROME_PATH to use an installed Chrome or Edge instead. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { serve } from "./preview.mjs";
import { load } from "./build.mjs";

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), REPO = path.resolve(STUDIO, "..");
const args = process.argv.slice(2), cmd = args[0];
const opt = (name, def) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : def; };
const epArg = () => { const e = args.slice(1).find((a, i, all) => !a.startsWith("--") && !(all[i - 1] || "").startsWith("--")); return e ? path.resolve(e) : null; };

async function browser() {
  const req = createRequire(import.meta.url);
  for (const name of ["playwright", "playwright-core"]) {
    let pw; try { pw = req(name); } catch { continue; }
    return pw.chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  }
  throw new Error("Playwright was not found. Once, in studio/: npm install --no-save playwright  and  npx playwright install chromium\n(or set CHROME_PATH to an installed Chrome or Edge and install only playwright-core).");
}

async function shoot(url, file, width, height, scale = 1, ready = null) {
  const { server, port } = await serve(0), b = await browser();
  try {
    const p = await b.newPage({ viewport: { width, height }, deviceScaleFactor: scale }), errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${port}/${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (ready) await p.waitForSelector(ready, { timeout: 15000 });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(/sheet\.html/.test(url) ? 4500 : 1200); // a sheet is many copies of the episode: give them time to draw
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await p.screenshot({ path: file, type: /\.jpe?g$/i.test(file) ? "jpeg" : "png", ...(/\.jpe?g$/i.test(file) ? { quality: 84 } : {}) });
    if (errors.length) console.warn("page errors: " + [...new Set(errors)].join(" | "));
  } finally { await b.close(); server.close(); }
}

// The build in studio/index.html must be this episode's, or the pictures would show another one.
function currentBuild(ep) {
  const html = fs.existsSync(path.join(STUDIO, "index.html")) ? fs.readFileSync(path.join(STUDIO, "index.html"), "utf8") : "";
  if (!html.includes(`<title>${path.basename(ep)}</title>`)) throw new Error(`studio/index.html is not a build of ${path.basename(ep)}. Run: node studio/tools/build.mjs ${path.relative(process.cwd(), ep)}`);
}

async function frames() {
  const ep = epArg(); if (!ep) throw new Error("usage: node studio/tools/stills.mjs frames <episode_dir> [--t 0,3,9.5] [--every 10] [--cols 3]");
  currentBuild(ep);
  const { res, total, story } = load(ep), every = parseFloat(opt("every", "0"));
  let ts = opt("t") ? opt("t").split(",").map(Number) : every > 0 ? Array.from({ length: Math.ceil(total / every) }, (_, i) => i * every) : [0.05, ...res.shots.map((s) => (s.t0 + s.t1) / 2), total - 0.5];
  ts = [...new Set(ts.filter((t) => t >= 0 && t <= total).map((t) => +t.toFixed(2)))].sort((a, b) => a - b);
  const vert = !!story.vertical, cols = parseInt(opt("cols", vert ? "6" : "4"), 10), w = vert ? 320 : 640, fh = vert ? 569 : 360, out = path.resolve(opt("out", path.join(ep, "render", "frames.jpg")));
  // Long episodes: several sheets of at most 12 frames, so each stays readable and loads quickly.
  const pages = []; for (let i = 0; i < ts.length; i += 12) pages.push(ts.slice(i, i + 12));
  for (const [i, page] of pages.entries()) {
    const file = pages.length > 1 ? out.replace(/(\.\w+)$/, `_${String(i + 1).padStart(2, "0")}$1`) : out, rows = Math.ceil(page.length / cols);
    await shoot(`sheet.html?t=${page.join(",")}&cols=${cols}${vert ? "&v=1" : ""}`, file, cols * w + (cols - 1) * 4, rows * fh + (rows - 1) * 4);
    console.log(`${path.relative(process.cwd(), file)}: ${page.length} frames (${page[0]}s to ${page[page.length - 1]}s)`);
  }
}

async function thumb() {
  const ep = epArg(); if (!ep || (!opt("white") && !opt("red"))) throw new Error('usage: node studio/tools/stills.mjs thumb <episode_dir> --white "SUBJECT" --red "$52" [--t 2] [--image art.png]');
  const q = new URLSearchParams({ white: opt("white", ""), red: opt("red", "") }), image = opt("image");
  if ((opt("white", "") + " " + opt("red", "")).trim().split(/\s+/).length > 4) console.warn("warning: the band has more than four words (STYLE_GUIDE: four at most).");
  if (image) { const dir = path.join(STUDIO, "assets", "ep", path.basename(ep)); fs.mkdirSync(dir, { recursive: true }); const name = "thumb_src" + path.extname(image).toLowerCase(); fs.copyFileSync(path.resolve(image), path.join(dir, name)); q.set("image", `assets/ep/${path.basename(ep)}/${name}`); }
  else { currentBuild(ep); q.set("t", opt("t", "2")); }
  const out = path.resolve(opt("out", path.join(ep, "thumbnail.png")));
  await shoot("thumb.html?" + q, out, 1280, 720, 1, "body[data-ready]");
  await shoot("thumb.html?" + q, out.replace(/\.png$/i, "_small.png"), 1280, 720, 0.125, "body[data-ready]");
  console.log(`${path.relative(process.cwd(), out)} (1280x720) and ${path.basename(out).replace(/\.png$/i, "_small.png")} (160x90: check that the text and the face still read)`);
  if (!image) console.log("  It is the video's own frame, so it matches the first shot. Use --image for a richer illustration of the same scene.");
}

async function sheets() {
  const dir = path.join(REPO, "channel-system", "characters", "sheets"), src = fs.readFileSync(path.join(STUDIO, "engine", "rig.js"), "utf8");
  const names = [...src.slice(src.indexOf("const CAST = {"), src.indexOf("};", src.indexOf("const CAST = {"))).matchAll(/^\s+([A-Z][A-Z0-9_]+):/gm)].map((m) => m[1]);
  for (const n of names) await shoot(`cast.html?who=${n}`, path.join(dir, n.toLowerCase() + "_model.png"), 1920, 1080);
  await shoot("cast.html?who=ALL", path.join(dir, "cast_lineup.png"), 1920, 1080);
  console.log(`${names.length} model sheets and the line-up written to ${path.relative(process.cwd(), dir)}`);
}

const run = { frames, thumb, sheets }[cmd];
if (!run) { console.error("usage: node studio/tools/stills.mjs frames|thumb|sheets ...   (see the top of this file)"); process.exit(2); }
run().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
