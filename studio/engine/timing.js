/* Timing shared by the browser engine and the Node tools (build, retention lint).
   Lines get a start `a` and a duration `d`; shots get `t0` / `t1` from the line (and word) they cue on. */
(function (root) {
  "use strict";
  const K = { LEAD: 0.2, GAP: 0.18, SKIT_GAP: 0.35, CH_GAP: 1.0, TAIL: 1.0, WPS: 157 / 60, CH_LEAD: 0.95, CH_MIN: 1.45, CARD_MIN: 0.9 };

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

  // Word timings inside a line, spread by word length.
  function lineWords(ln) {
    const ws = words(ln.text), tot = ws.reduce((s, w) => s + w.length + 2, 0); let t = ln.a;
    return ws.map((w) => { const d = ln.d * (w.length + 2) / tot, o = { w, a: +t.toFixed(3), b: +(t + d).toFixed(3) }; t += d; return o; });
  }

  // A time reference: { cue, word, at } = start of that line (or of its Nth word) plus `at` seconds; without a cue, `at` counts from `base`.
  function when(ref, base, L) {
    if (ref.cue && L[ref.cue]) { const ln = L[ref.cue]; let t = ln.a;
      if (ref.word != null) { const w = lineWords(ln)[ref.word]; if (w) t = w.a; }
      return t + (ref.at || 0); }
    return base + (ref.at || 0);
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

  const api = { K, words, estimate, schedule, lineWords, when, resolve };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.StudioTiming = api;
})(typeof window !== "undefined" ? window : globalThis);
