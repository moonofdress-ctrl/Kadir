/* Timing shared by the browser engine and the Node tools (build, retention lint).
   Lines get a start `a` and a duration `d`; shots get `t0` / `t1` from the line (and word) they cue on. */
(function (root) {
  "use strict";
  // GAP and SKIT_GAP keep every pause between lines under a quarter of a second (FORMAT_BOOK 13); the only long breath is CH_GAP at a chapter card.
  const K = { LEAD: 0.2, GAP: 0.14, SKIT_GAP: 0.04, CH_GAP: 1.0, TAIL: 1.0, WPS: 157 / 60, CH_LEAD: 0.95, CH_MIN: 1.45, CARD_MIN: 0.9, OV_LEAD: 0.25, OV_STEP: 0.35 };

  const words = (text) => String(text).split(/\s+/).filter(Boolean);
  const estimate = (text) => +(words(text).length / K.WPS + 0.1).toFixed(3);

  // Give every line a start time. `durations[id]` comes from the audio files; missing ones are estimated from the word count.
  function schedule(lines, story, durations) {
    const chapterCues = new Set((story.shots || []).filter((s) => s.type === "chapter").map((s) => s.cue));
    let t = K.LEAD, prev = null;
    for (const ln of lines) {
      const narr = ln.speaker === "N";
      if (prev !== null && prev !== narr) t += K.SKIT_GAP;
      if (prev !== null && chapterCues.has(ln.id)) t += K.CH_GAP;
      const d = durations && durations[ln.id];
      ln.d = d != null ? +d.toFixed(3) : estimate(ln.text); ln.est = d == null; ln.a = +t.toFixed(3);
      t += ln.d + K.GAP; prev = narr;
    }
    return +(t - K.GAP + K.TAIL).toFixed(3);
  }

  // Word timings inside a line: measured ones (`ln.wt`, [start, end] in seconds from the clip start, from audio/<id>.words.json) when they fit, else spread by word length.
  function lineWords(ln) {
    const ws = words(ln.text);
    if (Array.isArray(ln.wt) && ln.wt.length === ws.length)
      return ws.map((w, i) => ({ w, a: +(ln.a + Math.min(ln.wt[i][0], ln.d)).toFixed(3), b: +(ln.a + Math.min(ln.wt[i][1], ln.d)).toFixed(3) }));
    const tot = ws.reduce((s, w) => s + w.length + 2, 0); let t = ln.a;
    return ws.map((w) => { const d = ln.d * (w.length + 2) / tot, o = { w, a: +t.toFixed(3), b: +(t + d).toFixed(3) }; t += d; return o; });
  }

  // A time reference: { cue, word, at } = start of that line (or of its Nth word) plus `at` seconds; without a cue, `at` counts from `base`.
  function when(ref, base, L) {
    if (ref.cue && L[ref.cue]) { const ln = L[ref.cue]; let t = ln.a;
      if (ref.word != null) { const w = lineWords(ln)[ref.word]; if (w) t = w.a; }
      return t + (ref.at || 0); }
    return base + (ref.at || 0);
  }


  // Rolling counter (overlay { type:"counter", roll:true }): one entry per character of the final number, shared by the engine and the sound cues.
  // Digits roll like a slot machine, the most significant one settles first. Times are seconds from the moment the counter appears.
  const fmtNum = (v, dec) => v.toLocaleString("en-US", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  function rollPlan(o) {
    const from = o.from || 0, to = o.to, dec = o.decimals || 0, dur = o.dur || 1.2, start = 0.1, rising = to >= from;
    const a = fmtNum(from, dec), b = fmtNum(to, dec), n = Math.max(a.length, b.length), fa = a.padStart(n, " "), fb = b.padStart(n, " ");
    const isD = (c) => c >= "0" && c <= "9", nd = fb.split("").filter((c, i) => isD(c) || isD(fa[i])).length;
    let k = 0; const cols = [];
    for (let i = 0; i < n; i++) {
      if (!isD(fb[i]) && !isD(fa[i])) { cols.push({ kind: "sep", ch: fb[i] === " " ? fa[i] : fb[i], from: fa[i] !== " ", to: fb[i] !== " " }); continue; }
      const d0 = isD(fa[i]) ? +fa[i] : 0, d1 = isD(fb[i]) ? +fb[i] : 0, cyc = Math.min(3, 1 + (nd - 1 - k)), cd = dur * (0.5 + 0.5 * (k + 1) / nd);
      const steps = (rising ? (d1 - d0 + 10) % 10 : (d0 - d1 + 10) % 10) + 10 * cyc;
      cols.push({ kind: "digit", k, d0, d1, steps, rising, from: isD(fa[i]), to: isD(fb[i]), start, dur: +cd.toFixed(3), land: +(start + cd).toFixed(3) }); k++;
    }
    // "auto" colour: green when it rises fast (a fifth or more of where it started, or from zero), red when it falls (a tenth or more); an explicit tone wins
    const base = Math.abs(from), rel = base ? Math.abs(to - from) / base : Infinity;
    const tone = o.tone && o.tone !== "auto" ? o.tone : rising ? (rel >= 0.2 && to !== from ? "green" : "") : rel >= 0.1 ? "red" : "";
    return { cols, tone, auto: !o.tone || o.tone === "auto", dur: start + dur, rising };
  }
  // Seconds (from the overlay's start) of the `tick` effects of a rolling counter: opt-in (`"tick": true` or a number), at most 3, never closer than `gap`.
  function rollTicks(o, gap) {
    if (!o.roll || !o.tick) return [];
    const max = Math.min(3, o.tick === true ? 3 : +o.tick || 0), out = [];
    rollPlan(o).cols.filter((c) => c.kind === "digit").map((c) => c.land).sort((x, y) => x - y).forEach((t) => { if (out.length < max && (!out.length || t - out[out.length - 1] >= gap + 0.01)) out.push(t); });
    return out;
  }

  function resolve(story, lines, total) {
    const L = {}; lines.forEach((l) => { L[l.id] = l; });
    const shots = story.shots.map((s, i) => { let t = when(s, 0, L); if (s.type === "chapter") t -= K.CH_LEAD; return Object.assign({}, s, { t0: i === 0 ? 0 : Math.max(0, t), _i: i }); });
    shots.sort((a, b) => a.t0 - b.t0 || a._i - b._i);
    for (let i = 1; i < shots.length; i++) { const p = shots[i - 1], min = p.type === "chapter" ? K.CH_MIN : p.type === "card" ? K.CARD_MIN : 0.4;
      if (shots[i].t0 < p.t0 + min) shots[i].t0 = +(p.t0 + min).toFixed(3); }
    shots.forEach((s, i) => { s.t1 = i < shots.length - 1 ? shots[i + 1].t0 : total; });
    const chapters = shots.filter((s) => s.type === "chapter").map((s) => ({ number: s.number, title: s.title, t: s.t0 }));
    return { shots, chapters, L };
  }

  const api = { K, words, estimate, schedule, lineWords, when, resolve, rollPlan, rollTicks };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.StudioTiming = api;
})(typeof window !== "undefined" ? window : globalThis);
