/* Cartoon engine: plays a shot list over the narration timeline.
   Shots are hard cuts; each has a background with a camera move, optional
   characters that enter and bounce while they speak, text slams and chapter
   cards. Deterministic and seek-safe: only opacity / x / y / scale / rotation. */
(function () {
  "use strict";
  let tl;
  const el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const show = (e, t0, t1) => { e.style.opacity = 0; tl.set(e, { opacity: 1 }, t0); if (t1 != null) tl.set(e, { opacity: 0 }, t1); };

  const CAM = {
    push_in: [{ scale: 1.0 }, { scale: 1.14 }], pull_out: [{ scale: 1.14 }, { scale: 1.0 }],
    pan_left: [{ scale: 1.1, x: 70 }, { scale: 1.1, x: -70 }], pan_right: [{ scale: 1.1, x: -70 }, { scale: 1.1, x: 70 }],
    tilt_up: [{ scale: 1.1, y: 50 }, { scale: 1.1, y: -50 }], tilt_down: [{ scale: 1.1, y: -50 }, { scale: 1.1, y: 50 }],
    still: [{ scale: 1.0 }, { scale: 1.04 }], shake: [{ scale: 1.06 }, { scale: 1.08 }],
  };
  const ENTER = { pop: { scale: 0.5, opacity: 0 }, slide_left: { x: -700, opacity: 1 }, slide_right: { x: 700, opacity: 1 }, rise: { y: 500, opacity: 1 } };

  function shot(root, s, t0, t1, L) {
    const sc = el("div", "shot", root); show(sc, t0, t1);
    if (s.image) {
      const bg = el("img", "bg", sc); bg.src = s.image;
      const m = CAM[s.camera] || CAM.still;
      tl.fromTo(bg, Object.assign({ x: 0, y: 0 }, m[0]), Object.assign({ x: 0, y: 0, duration: t1 - t0, ease: "none", immediateRender: false }, m[1]), t0);
      if (s.camera === "shake") tl.fromTo(sc, { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, t0);
    }
    (s.characters || []).forEach((c, i) => {
      const im = el("img", "char " + (c.pos || "left"), sc); im.src = c.image;
      const from = ENTER[c.enter] || ENTER.pop, ti = t0 + 0.05 + i * 0.25;
      im.style.opacity = 0;
      tl.fromTo(im, Object.assign({ x: 0, y: 0, scale: 1, opacity: 0 }, from), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)", immediateRender: false }, ti);
      (c.speaks || []).forEach((id) => { const ln = L[id]; if (!ln) return;
        tl.fromTo(im, { y: 0 }, { y: -18, duration: 0.14, yoyo: true, repeat: Math.max(1, Math.floor(ln.d / 0.28) * 2 - 1), ease: "sine.inOut", immediateRender: false }, ln.a); });
    });
    (s.text || []).forEach((tx, i) => {
      const cls = tx.style === "stamp" ? "stamp" : tx.style === "label" ? "label" : "slam " + (tx.pos || "top") + (tx.red ? " red" : "");
      const e = el("div", cls, sc, esc(tx.t)); const ti = t0 + (tx.at != null ? tx.at : 0.25 + i * 0.4);
      e.style.opacity = 0;
      tl.fromTo(e, { opacity: 0, scale: tx.style === "label" ? 0.9 : 1.6 }, { opacity: 1, scale: 1, duration: tx.style === "label" ? 0.25 : 0.16, ease: tx.style === "label" ? "power2.out" : "power4.in", immediateRender: false }, ti);
      if (tx.style !== "label") tl.fromTo(sc, { x: 0 }, { x: 10, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, ti + 0.16);
    });
  }

  function chapter(root, s, t0) {
    const c = el("div", "chapter", root, '<div class="n">CHAPTER ' + (s.number || "") + '</div><div class="t">' + esc(s.chapter) + "</div>");
    show(c, t0, t0 + 1.7);
    tl.fromTo(c.lastChild, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t0);
  }

  function subtitles(root, subs) {
    const box = el("div", "subs", root);
    subs.forEach((s) => { const d = el("div", "sub" + (s.who ? " who" : ""), box, "<span>" + esc(s.x) + "</span>"); show(d, s.a, s.b); });
  }

  window.Cartoon = {
    build(timeline, SHOTS, LINES, SUBS, total) {
      tl = timeline;
      const root = document.getElementById("root"), L = {};
      LINES.forEach((l) => { L[l.id] = l; });
      const vis = SHOTS.filter((s) => s.type !== "chapter");
      vis.forEach((s, i) => { const t0 = L[s.cue].a, t1 = i < vis.length - 1 ? L[vis[i + 1].cue].a : total; shot(root, s, t0, t1, L); });
      SHOTS.filter((s) => s.type === "chapter").forEach((s) => chapter(root, s, Math.max(0, L[s.cue].a - 0.0)));
      el("div", "vignette", root);
      subtitles(root, SUBS);
    },
  };
})();
