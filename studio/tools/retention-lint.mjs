#!/usr/bin/env node
/* Retention lint: checks an episode's script, storyboard and sound mix against the measured targets in
   channel-system/FORMAT_BOOK.md (sections 3-4, 8, 11-13). Run it before voice, before render and in QA.
   G1-G5 check that pictures carry a joke; P4-P5, D1, K1-K2, W1-W2, S2-S3 and H7-H8 hold the targets measured against
   the rival's video on the same story (research/paper_billions_spy_video_comparison.md, section 9); the sound checks (A1-A7) read audio/mix.json, written by tools/mix.mjs.

   Usage: node studio/tools/retention-lint.mjs <episode_dir> [--json]
   Exit code 1 when any check FAILS. WARN does not fail the run. Checks that need a long video
   are reported as n/a for short pieces (demos, tests). */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { load } from "./build.mjs";
import { mixState } from "./cues.mjs";

const TM = createRequire(import.meta.url)("../engine/timing.js");

const args = process.argv.slice(2), ep = path.resolve(args.find((a) => !a.startsWith("--")) || "");
let data;
try { data = load(ep); } catch (e) { console.error(String(e.message || e)); process.exit(2); }
const { story, lines, total, res } = data, shots = res.shots;
const rows = [];
const add = (id, name, status, got, want) => rows.push({ id, name, status, got: String(got), want });
// grade(value, pass?, warn?) -> PASS / WARN / FAIL
const g = (ok, soft) => (ok ? "PASS" : soft ? "WARN" : "FAIL");
const need = (min, id, name, fn) => { if (total < min) add(id, name, "n/a", "short piece", "longer video"); else fn(); };
const mmss = (t) => Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0");
const refTime = (r, s) => (r.cue || r.at != null ? TM.when(r, s.t0, res.L) : s.t0 + 0.3);

const isCard = (s) => s.type === "card" || s.type === "chapter";
const actorsOf = (s) => (s.type === "split" ? s.panels.flatMap((p) => p.actors || []) : s.actors || []);
const isSkit = (s) => actorsOf(s).some((a) => (a.speaks || []).length);
// Chapters as [start, end] spans; a short piece is one chapter.
const chEnds = [0, ...res.chapters.map((c) => c.t), total], spans = chEnds.slice(1).map((t, i) => [chEnds[i], t]), nCh = spans.length;
const inSpan = (t, sp) => t >= sp[0] - 0.01 && t < sp[1] - 0.01;
// A place: the "place" tag when a dressed set reads as somewhere else, the picture's file, or the set's name.
const placeOf = (p) => p.place || (p.set === "picture" ? (p.opts || {}).src : p.set) || "plain";
// A dark picture: one light source, a night grade or a night set.
const isDark = (p) => !!p.light || p.grade === "night" || p.set === "night_city" || !!(p.opts || {}).night || (p.opts || {}).time === "night";
// Everything a viewer has to read in a picture, apart from subtitles and a by-the-clock corner clock.
const WORD_PROPS = ["sign", "banner", "pricetag", "podium", "crates"], DATA_PROPS = ["bars", "line", "calendar", "note", "doc", "post"];
const readsOf = (p) => (p.props || []).filter((x) => (WORD_PROPS.includes(x.type) && x.t) || DATA_PROPS.includes(x.type)).length
  + (p.actors || []).filter((a) => a.label || a.sign || a.tag || a.badge != null).length
  + (p.overlays || []).filter((o) => o.type !== "clock").length + (p.label ? 1 : 0);

// Every moment the picture changes: cuts, panel reveals, overlays, entrances, expression changes, prop cues, spoken lines.
const beats = new Set();
for (const s of shots) {
  beats.add(s.t0);
  for (const o of s.overlays || []) beats.add(refTime(o, s));
  for (const p of s.panels || []) beats.add(refTime(p, s));
  for (const p of [...(s.props || []), ...(s.panels || []).flatMap((x) => x.props || [])]) if (p.at != null || p.cue) beats.add(refTime(p, s));
  for (const a of actorsOf(s)) { if (a.cue || a.at != null) beats.add(refTime(a, s)); for (const x of a.acts || []) beats.add(refTime(x, s)); for (const id of a.speaks || []) if (res.L[id]) beats.add(res.L[id].a); }
}
const bt = [...beats].filter((t) => t <= total).sort((a, b) => a - b); bt.push(total);
let maxGap = 0, gapAt = 0; for (let i = 1; i < bt.length; i++) if (bt[i] - bt[i - 1] > maxGap) { maxGap = bt[i] - bt[i - 1]; gapAt = bt[i - 1]; }

/* ---- hook (FORMAT_BOOK 3) ---- */
add("H1", "Opens on a scene, not a card or logo", g(!isCard(shots[0])), shots[0].type || "scene", "scene");
const bigNum = shots.flatMap((s) => (s.overlays || []).filter((o) => (o.type === "counter" || (o.type === "slam" && /\d/.test(o.t))) && refTime(o, s) <= 30));
add("H2", "The big number on screen in the first 30s", g(bigNum.length > 0, true), bigNum.length ? "yes" : "none", "one counter or number slam by 0:30");
const hookEnd = Math.min(50, total), setups = shots.filter((s) => s.t0 < hookEnd).reduce((n, s) => n + (s.type === "split" ? s.panels.length : 1), 0), per = hookEnd / setups;
add("H3", "New picture every ~3s in the first 50s", g(per <= 3.6, per <= 4.3), `${setups} setups, one per ${per.toFixed(1)}s`, "one per 3.5s or faster");
need(45, "H4", "Title question on a card by 0:45", () => { const c = shots.find((s) => s.type === "card" && /\?\s*$/.test(s.text) && s.t0 <= 45); add("H4", "Title question on a card by 0:45", g(!!c), c ? mmss(c.t0) : "none", "question card by 0:45"); });
need(40, "H5", "First character line by 0:25", () => { const k = shots.find(isSkit); add("H5", "First character line by 0:25", g(k && k.t0 <= 25, k && k.t0 <= 40), k ? mmss(k.t0) : "none", "by 0:25"); });
need(120, "H6", "Anchor motif planted in the first minute", () => { const m = shots.find((s) => s.motif && s.t0 <= 60); add("H6", "Anchor motif planted in the first minute", g(!!m), m ? `${m.motif} at ${mmss(m.t0)}` : "none", "a shot with \"motif\" by 1:00"); });

need(120, "H7", "The story's person, close and named, by 0:12", () => { const named = (s) => (s.overlays || []).some((o) => o.type === "lower_third") || actorsOf(s).some((a) => !a.thing && a.label);
  const near = (s) => (s.frame === "close" || s.frame === "medium") && named(s), c = shots.find((s) => s.t0 <= 12 && near(s)), late = shots.find((s) => s.t0 <= 20 && near(s));
  add("H7", "The story's person, close and named, by 0:12", g(!!c, !!late), c ? mmss(c.t0) : late ? mmss(late.t0) : "none", "a \"medium\" or \"close\" shot with a name strip by 0:12"); });
need(120, "H8", "No chapter card, chart or lesson before 0:45", () => { const chart = (p) => [...(p.props || []), ...(p.overlays || [])].some((x) => x.type === "bars" || x.type === "line");
  const early = shots.filter((s) => s.t0 < 45 && (s.type === "chapter" || (s.type === "split" ? s.panels.some(chart) : chart(s)))).map((s) => s.id + " " + mmss(s.t0));
  add("H8", "No chapter card, chart or lesson before 0:45", g(early.length === 0), early.length ? early.join(", ") : "ok", "the opening sets up the mystery; chapter cards and charts start after 0:45"); });

/* ---- pace (FORMAT_BOOK 11) ---- */
const avg = total / shots.length;
add("P1", "Average shot length", g(avg <= 3.5, avg <= 4.2), avg.toFixed(1) + "s", "3.5s or less (the rival: 3.4s; our first episode: 4.7s)");
add("P2", "Longest stretch with nothing new on screen", g(maxGap <= 6, maxGap <= 8), `${maxGap.toFixed(1)}s at ${mmss(gapAt)}`, "6s or less");
const sc = shots.filter((s) => !isCard(s) && s.type !== "split"); let rep = 0; for (let i = 1; i < sc.length; i++) if ((sc[i].camera || "still") === (sc[i - 1].camera || "still")) rep++;
const still = sc.filter((s) => !s.camera || s.camera === "still").length;
add("P3", "Camera varies between shots", g(rep === 0 && still <= sc.length * 0.25, true), `${rep} repeats, ${still}/${sc.length} still`, "no move twice in a row; under 25% still");

need(30, "P4", "12 or more shots in the first 30s", () => { const n = shots.filter((s) => s.t0 < 30).length; add("P4", "12 or more shots in the first 30s", g(n >= 12, n >= 10), n + " shots", "12 or more (the rival: 12 cuts)"); });
need(120, "P5", "Few shots longer than 10s", () => { const longShots = shots.filter((s) => s.t1 - s.t0 > 10);
  add("P5", "Few shots longer than 10s", g(longShots.length <= nCh, longShots.length <= nCh * 2), longShots.length ? `${longShots.length}: ${longShots.slice(0, 6).map((s) => s.id).join(", ")}` : "none", `${nCh} or fewer (one a chapter)`); });

/* ---- text cards (FORMAT_BOOK 11) ---- */
const cards = shots.filter(isCard), cardSec = cards.reduce((n, s) => n + s.t1 - s.t0, 0);
need(60, "C1", "A text card about every 20s", () => { const gap = total / Math.max(1, cards.length); add("C1", "A text card about every 20s", g(gap <= 25, gap <= 40), `${cards.length} cards, one per ${gap.toFixed(0)}s`, "one per 25s or faster (reference: 19s)"); });
need(60, "C2", "Cards take 8-16% of the runtime", () => { const p = 100 * cardSec / total; add("C2", "Cards take 8-16% of the runtime", g(p >= 8 && p <= 16, true), p.toFixed(1) + "%", "8-16% (reference: 13%)"); });
const longCard = cards.filter((s) => s.t1 - s.t0 > 5.5);
add("C3", "No card longer than 5.5s", g(longCard.length === 0, true), longCard.length ? longCard.map((s) => s.id).join(", ") : "ok", "5.5s or less");

/* ---- skits (FORMAT_BOOK 6) ---- */
const voiced = lines.filter((l) => l.speaker !== "N");
need(120, "S1", "A character speaks every 30s", () => { const k = voiced.map((l) => l.a); let m = 0, at = 0; [0, ...k, total].forEach((t, i, a) => { if (i && t - a[i - 1] > m) { m = t - a[i - 1]; at = a[i - 1]; } });
  add("S1", "A character speaks every 30s", g(m <= 45, m <= 65), `${shots.filter(isSkit).length} skits, longest gap ${m.toFixed(0)}s at ${mmss(at)}`, "no gap over 45s (the rival: one every 28s)"); });
need(120, "S2", "Dialogue is a quarter of the words", () => { const w = (ls) => ls.reduce((n, l) => n + l.text.split(/\s+/).filter(Boolean).length, 0), p = 100 * w(voiced) / Math.max(1, w(lines));
  add("S2", "Dialogue is a quarter of the words", g(p >= 25, p >= 17), p.toFixed(0) + "%", "25% or more (the rival: about a third; our first episode: 9%)"); });
need(300, "S3", "Two skits or more in every chapter", () => { const k = shots.filter(isSkit).map((s) => s.t0), thin = spans.map((sp, i) => [i + 1, k.filter((t) => inSpan(t, sp)).length]).filter((x) => x[1] < 2);
  add("S3", "Two skits or more in every chapter", g(thin.length === 0, thin.length <= 1), thin.length ? thin.map((x) => `CH${x[0]}: ${x[1]}`).join(", ") : "ok", "2 or more in each chapter"); });

/* ---- story devices (FORMAT_BOOK 12) ---- */
const motifs = {}; shots.forEach((s) => { if (s.motif) (motifs[s.motif] = motifs[s.motif] || []).push(s.t0); });
need(300, "M1", "Anchor motif keeps returning", () => { const want = Math.max(4, Math.round(total / 130)), best = Object.entries(motifs).sort((a, b) => b[1].length - a[1].length)[0];
  const late = best && best[1].some((t) => t >= total - 75);
  add("M1", "Anchor motif keeps returning", g(best && best[1].length >= want && late, best && best[1].length >= want - 2), best ? `${best[0]}: ${best[1].length} times${late ? "" : ", missing from the ending"}` : "none", `${want}+ times, including the last 75s`); });
need(300, "M2", "Opening images pay off late", () => { const cb = shots.filter((s) => s.callback && s.t0 >= total * 0.5).length; add("M2", "Opening images pay off late", g(cb >= 2, cb >= 1), `${cb} callbacks in the second half`, "2 or more shots with \"callback\""); });
need(120, "M3", "Viewer stand-in keeps appearing", () => { const v = story.viewer, vs = shots.filter((s) => actorsOf(s).some((a) => a.who === v)).map((s) => s.t0), want = Math.max(2, Math.round(total / 200));
  const end = vs.some((t) => t >= total - 45);
  add("M3", "Viewer stand-in keeps appearing", g(v && vs.length >= want && end, v && vs.length >= want), v ? `${v}: ${vs.length} shots${end ? "" : ", not in the last 45s"}` : "no \"viewer\" set", `${want}+ shots and the ending`); });
need(300, "M4", "Colour grade follows the mood", () => { const n = new Set(shots.map((s) => s.grade).filter(Boolean)).size; add("M4", "Colour grade follows the mood", g(n >= 3, true), `${n} grades used`, "3 or more"); });
need(600, "M5", "6-9 chapters of 1-3 minutes", () => { const ch = res.chapters.map((c) => c.t), n = ch.length + 1; const ends = [0, ...ch, total], bad = ends.slice(1).map((t, i) => t - ends[i]).filter((d) => d < 40 || d > 200).length;
  add("M5", "6-9 chapters of 1-3 minutes", g(n >= 6 && n <= 9 && bad === 0, true), `${n} chapters, ${bad} outside 40-200s`, "6-9 chapters"); });
const quotes = lines.filter((l) => l.speaker === "N" && /["“]/.test(l.text)).length, ev = shots.flatMap((s) => s.overlays || []).filter((o) => ["doc", "post", "lower_third"].includes(o.type)).length;
add("E1", "Quotes shown as evidence", g(ev >= quotes, true), `${ev} evidence overlays for ${quotes} quoted lines`, "a doc, post or lower third per quote");

/* ---- ending (FORMAT_BOOK 8) ---- */
need(300, "X1", "Last shot is a callback", () => { const s = shots[shots.length - 1]; add("X1", "Last shot is a callback", g(!!(s.callback || s.motif)), s.callback || s.motif || "none", "\"callback\" or \"motif\" on the last shot"); });

/* ---- script (FORMAT_BOOK 4, 5, 7, 8, 13) ---- */
const narr = lines.filter((l) => l.speaker === "N"), all = lines.map((l) => l.text).join(" "), low = all.toLowerCase();
const banned = ["in today's video", "let's dive in", "buckle up", "without further ado", "welcome back", "subscribe", "smash that", "like button", "hit the bell", "stay tuned"].filter((b) => low.includes(b));
add("T1", "No intro phrases or calls to action", g(banned.length === 0), banned.length ? banned.join(", ") : "none", "none");
const advice = /\b(you should (buy|sell)|buy now|sell now|guaranteed (return|profit))\b/i.test(all);
add("T2", "No financial advice wording", g(!advice), advice ? "found" : "none", "none");
const sents = narr.flatMap((l) => l.text.split(/(?<=[.!?])\s+/)).filter(Boolean), sl = sents.map((s) => s.split(/\s+/).length), meanLen = sl.reduce((a, b) => a + b, 0) / Math.max(1, sl.length), long = sl.filter((n) => n > 25).length;
add("T3", "Short spoken sentences", g(meanLen <= 15 && long <= sl.length * 0.05, true), `average ${meanLen.toFixed(1)} words, ${long} over 25`, "average 15 or less");
need(240, "T4", "Viewer addressed directly", () => { const n = narr.filter((l) => /\byou(r|'re|'ve)?\b/i.test(l.text)).length, want = Math.max(3, Math.round(total / 240)); add("T4", "Viewer addressed directly", g(n >= want, true), `${n} lines`, `${want} or more lines with you/your`); });
need(story.demo ? Infinity : 45, "T5", "Title question spoken by 0:45", () => { const t = story.title || ""; const key = t.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter((w) => w.length > 3 && !/d/.test(w)); // figures are spoken in words, so they are not matched
  const hit = lines.find((l) => l.a <= 45 && key.length && key.every((w) => l.text.toLowerCase().includes(w)));
  add("T5", "Title question spoken by 0:45", g(!!hit, !key.length), hit ? mmss(hit.a) : key.length ? "not found" : "no title set", "the title's words in a line by 0:45"); });
// The promise and the chain (FORMAT_BOOK 4): the script says what it will answer and how the causes connect.
const scriptFile = path.join(ep, "script.md");
if (fs.existsSync(scriptFile) && !story.demo) { const md = fs.readFileSync(scriptFile, "utf8"), blk = (/^##\s+PROMISE\s*$([\s\S]*?)(?=^##\s)/m.exec(md) || [])[1] || "";
  const val = (k) => ((new RegExp("^" + k + ":[ \\t]*(.*)$", "m").exec(blk) || [])[1] || "").trim(), links = val("CHAIN").split(/->|→/).map((x) => x.trim()).filter(Boolean).length;
  const ok = val("QUESTION") && val("ANSWER") && links >= 4;
  add("T6", "The promise and the chain are written", g(ok, !!blk), blk ? `question ${val("QUESTION") ? "yes" : "missing"}, answer ${val("ANSWER") ? "yes" : "missing"}, ${links} links in the chain` : "no ## PROMISE block", "QUESTION, ANSWER and a CHAIN of 4-7 causes in script.md"); }
const wc = lines.reduce((n, l) => n + l.text.split(/\s+/).filter(Boolean).length, 0), wpm = wc / (total / 60), est = lines.some((l) => l.est);
need(120, "V1", "Speaking pace", () => add("V1", "Speaking pace", g(wpm >= 148 && wpm <= 166, true), `${wpm.toFixed(0)} wpm${est ? " (estimated, no audio yet)" : ""}`, "150-165 wpm (reference: 157)"));
if (!story.demo) add("V2", "Length 12-15 minutes", g(total >= 690 && total <= 915, true), mmss(total), "11:30-15:15");

/* ---- every shot is a small joke (FORMAT_BOOK 11) ---- */
// Scenes and split panels, each with what is in it.
const pictures = shots.flatMap((s) => (isCard(s) ? [] : s.type === "split" ? s.panels.map((p) => ({ ...p, t0: s.t0 })) : [s]));
const TEXT_PROPS = ["sign", "banner", "pricetag", "stall", "podium", "crates"];
const busy = (a) => a.thing || a.prop || a.hat || a.badge != null || (a.pose && a.pose !== "rest") || (a.acts || []).length > 0;
const painted = (p) => p.set === "picture"; // a painted picture says what is in it with "shows" and "living"
const alive = pictures.filter((p) => (p.props || []).length || (p.actors || []).some(busy) || (painted(p) && (p.opts || {}).shows)).length, share = alive / Math.max(1, pictures.length);
add("G1", "Pictures show something happening", g(share >= 0.85, share >= 0.7), `${alive} of ${pictures.length} (${Math.round(share * 100)}%)`, "85% or more with a prop, a living thing or a figure doing something");
need(60, "G2", "Companies and institutions are living things", () => { const n = pictures.filter((p) => (p.actors || []).some((a) => a.thing) || (painted(p) && (p.opts || {}).living)).length, want = Math.max(2, Math.round(total / 45));
  add("G2", "Companies and institutions are living things", g(n >= want, true), `${n} pictures`, `${want} or more (one every 45s)`); });
const skits = shots.filter(isSkit), near = skits.filter((s) => s.frame === "medium" || s.frame === "close" || s.type === "split").length;
if (skits.length) add("G3", "Faces fill the frame in skits", g(near >= skits.length * 0.6, true), `${near} of ${skits.length} skits`, "60% or more with \"frame\": \"medium\" or \"close\"");
need(60, "G4", "Facts are written inside the scene", () => { const n = pictures.reduce((k, p) => k + (p.props || []).filter((x) => TEXT_PROPS.includes(x.type) && (x.t || x.type === "stall")).length + (p.actors || []).filter((a) => a.label || a.sign || a.tag || a.badge != null).length, 0), want = Math.round(total / 45);
  add("G4", "Facts are written inside the scene", g(n >= want, true), `${n} signs, tags, labels and badges`, `${want} or more (one every 45s), inside W1's limit`); });
need(180, "G5", "The hidden piggy bank", () => { const n = pictures.filter((p) => (p.props || []).some((x) => x.type === "piggy")).length, lo = Math.max(1, Math.floor(total / 180)), hi = Math.ceil(total / 45);
  add("G5", "The hidden piggy bank", g(n >= lo && n <= hi, true), `${n} pictures`, `${lo} to ${hi}: there to be found, not to be noticed`); });
{ const pp = pictures.filter(painted), missing = pp.filter((p) => !(p.opts && p.opts.src && fs.existsSync(path.join(ep, p.opts.src)))), blind = pp.filter((p) => !(p.opts || {}).shows);
  if (pp.length) add("G6", "Painted pictures are in the folder and described", g(!missing.length && !blind.length, !missing.length), `${pp.length} pictures, ${missing.length} missing, ${blind.length} without "shows"`, "every file in the episode folder, each with a one-line \"shows\""); }

/* ---- places, light and how much there is to read (FORMAT_BOOK 11, measured against the rival) ---- */
const sceneShots = shots.filter((s) => !isCard(s)), sceneSec = sceneShots.reduce((n, s) => n + s.t1 - s.t0, 0);
need(120, "D1", "Half of the picture time is dark and lit", () => { const d = sceneShots.filter((s) => (s.type === "split" ? s.panels.some(isDark) : isDark(s))).reduce((n, s) => n + s.t1 - s.t0, 0), p = 100 * d / Math.max(1, sceneSec);
  add("D1", "Half of the picture time is dark and lit", g(p >= 50, p >= 35), p.toFixed(0) + "%", "50% or more with a \"light\" or a night look (the rival: 60%; our first episode: 25%)"); });
{ const visits = spans.map((sp) => { const seq = sceneShots.filter((s) => inSpan(s.t0, sp)).flatMap((s) => (s.type === "split" ? s.panels.map(placeOf) : [placeOf(s)])), v = {}; seq.forEach((p, i) => { if (i === 0 || seq[i - 1] !== p) v[p] = (v[p] || 0) + 1; }); return v; });
  need(120, "K1", "Six or more places in every chapter", () => { const all = new Set(visits.flatMap((v) => Object.keys(v))), thin = visits.map((v, i) => [i + 1, Object.keys(v).length]).filter((x) => x[1] < 6);
    add("K1", "Six or more places in every chapter", g(thin.length === 0, thin.length <= Math.ceil(nCh / 3)), `${all.size} places in all${thin.length ? "; " + thin.map((x) => `CH${x[0]}: ${x[1]}`).join(", ") : ""}`, "6 or more in each chapter (the rival: about 70 in all; our first episode: 11)"); });
  need(120, "K2", "No place more than three times a chapter", () => { const over = visits.flatMap((v, i) => Object.entries(v).filter((e) => e[1] > 3).map((e) => `CH${i + 1} ${e[0]} x${e[1]}`));
    add("K2", "No place more than three times a chapter", g(over.length === 0, over.length <= 2), over.length ? over.slice(0, 5).join(", ") + (over.length > 5 ? ` (+${over.length - 5} more)` : "") : "ok", "a place returns at most 3 times in a chapter"); }); }
need(120, "W1", "Two pictures in three have nothing to read", () => { const n = pictures.filter((p) => readsOf(p) > 0).length, p = 100 * n / Math.max(1, pictures.length);
  add("W1", "Two pictures in three have nothing to read", g(p <= 34, p <= 48), `${n} of ${pictures.length} carry text (${p.toFixed(0)}%)`, "a third or fewer (our first episode: 80%)"); });
need(120, "W2", "One thing to read at a time", () => { const many = shots.filter((s) => !isCard(s) && s.type !== "split" && readsOf(s) > 1), p = many.length / Math.max(1, sceneShots.length);
  add("W2", "One thing to read at a time", g(p <= 0.05, p <= 0.15), many.length ? `${many.length} shots with two or more: ${many.slice(0, 6).map((s) => s.id).join(", ")}` : "ok", "one label or one number in a shot"); });

/* ---- layout: written things that sit on top of each other (an early, rough version of the HyperFrames check) ---- */
{ const rig = {}; try { new Function("window", "document", fs.readFileSync(new URL("../engine/rig.js", import.meta.url), "utf8"))(rig, {}); } catch { /* no rig: skip thing sizes */ }
  const THINGS = (rig.Rig || {}).THINGS || {}, len = (t) => String(t == null ? "" : t).length;
  // rough boxes [left, top, right, bottom] of everything that carries text, and of figures (which hide what is behind them)
  const propBox = (p) => { const x = p.x || 0, y = p.y || 0;
    if (p.type === "sign") { const sz = p.size || 70, w = len(p.t) * sz * 0.5 + 70; return [x - w / 2, y - sz, x + w / 2, y + sz * 0.5]; }
    if (p.type === "banner") { const w = p.w || 700, h = p.h || 150; return [x - w / 2, y, x + w / 2, y + h]; }
    if (p.type === "pricetag") { const w = len(p.t) * 46 + 120; return [x - w / 2, y - 58, x + w / 2, y + 58]; }
    if (p.type === "crates" && p.t) { const n = p.n || 3, w = p.w || 190, c = Math.ceil(Math.sqrt(n)); return [x - (c * w) / 2, y - c * w * 0.72, x + (c * w) / 2, y]; }
    return null; };
  const actorBox = (a) => { const T = a.thing && THINGS[a.thing] ? THINGS[a.thing]({}) : null, k = a.scale || 1, x = a.x != null ? a.x : 960, y = a.y || 900, hw = (T ? T.w : 150) * k, h = (T ? T.h : 600) * k; return [x - hw, y - h, x + hw, y]; };
  const hit = (a, b) => { const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]); return w > 0 && h > 0 ? (w * h) / ((a[2] - a[0]) * (a[3] - a[1])) : 0; };
  const bad = [];
  shots.forEach((s) => (s.type === "split" ? s.panels : isCard(s) ? [] : [s]).forEach((pic) => {
    const texts = (pic.props || []).map((p) => ({ p, b: propBox(p) })).filter((x) => x.b), figs = (pic.actors || []).map(actorBox);
    texts.forEach((t, i) => { const off = t.b[0] < 60 || t.b[2] > 1860 || t.b[1] < 20;
      const covered = t.p.layer !== "front" && figs.some((f) => hit(t.b, f) > 0.35), clash = texts.some((u, j) => j > i && hit(t.b, u.b) > 0.2);
      if (off || covered || clash) bad.push(`${s.id} ${t.p.type} "${String(t.p.t).slice(0, 14)}" ${off ? "off the edge" : covered ? "behind a figure" : "on another text"}`); }); }));
  add("L1", "Written props are readable", g(bad.length === 0, true), bad.length ? bad.slice(0, 4).join("; ") + (bad.length > 4 ? ` (+${bad.length - 4} more)` : "") : "ok", "no sign, banner, tag or crate label off the edge, behind a figure or on another text"); }

/* ---- sound (FORMAT_BOOK 13) ---- */
if (est) add("A1", "Sound mix", "n/a", "voice not recorded yet", "every line recorded");
else {
  const mix = mixState(ep, data), run = "run node studio/tools/mix.mjs";
  add("A1", "Sound mix is made and up to date", g(mix && mix.current, !mix && story.demo), mix ? (mix.current ? "ok" : "out of date") : "no mix", run);
  if (mix && mix.current) { const m = mix.report;
    add("A2", "Loudness -14 LUFS", g(Math.abs(m.lufs + 14) <= 0.5), m.lufs + " LUFS", "-14.5 to -13.5");
    add("A3", "Peaks under -1 dBTP", g(m.true_peak_db <= -0.9), m.true_peak_db + " dBTP", "-1 or lower");
    const u = m.music.db_under_voice;
    add("A4", "Quiet music bed under the voice", g(u != null && u >= 17 && u <= 22, true), u == null ? "no music" : `${u} dB under (${m.music.source})`, "18-20 dB under the voice");
    add("A5", "Music is credited", g(m.music.uncredited.length === 0), m.music.uncredited.length ? m.music.uncredited.join(", ") : "ok", "source and licence in audio/CREDITS.md");
    const allow = Math.max(2, Math.round(total / 75)), dp = m.dead_air.pauses_over_250ms, worst = m.dead_air.longest[0];
    add("A6", "No dead air in the voice", g(dp <= allow, true), `${dp} pauses over 0.25s${worst ? `, longest ${worst.d}s at ${mmss(worst.t)}` : ""}`, `${allow} or fewer (mix.mjs --tighten cuts them)`);
    add("A7", "Effects are rare", g(m.effects.per_minute <= 8 || m.effects.count <= 4, true), `${m.effects.count} (${m.effects.per_minute} a minute)`, "8 a minute or fewer");
  }
}

if (args.includes("--json")) console.log(JSON.stringify({ episode: path.basename(ep), total, rows }, null, 2));
else {
  const mark = { PASS: "ok  ", WARN: "WARN", FAIL: "FAIL", "n/a": "n/a " };
  console.log(`\nRetention lint: ${path.basename(ep)}  (${mmss(total)}, ${shots.length} shots, ${wc} words${est ? ", timing estimated" : ""})\n`);
  for (const r of rows) console.log(`  ${mark[r.status]}  ${r.id.padEnd(3)} ${r.name.padEnd(44)} ${r.got}${r.status === "PASS" || r.status === "n/a" ? "" : "   -> want " + r.want}`);
  const f = rows.filter((r) => r.status === "FAIL").length, w = rows.filter((r) => r.status === "WARN").length;
  console.log(`\n  ${f} failed, ${w} warnings, ${rows.filter((r) => r.status === "PASS").length} passed\n`);
}
process.exit(rows.some((r) => r.status === "FAIL") ? 1 : 0);
