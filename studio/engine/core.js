/* Studio engine: plays a storyboard over the narration timeline.
   Shot types: scene (default), card (word-by-word text card), chapter, split (2-4 panels).
   Shots are hard cuts. Everything is on one paused GSAP timeline, so any frame can be seeked. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg", TM = window.StudioTiming;
  let tl, L;
  const div = (cls, parent, html) => { const e = document.createElement("div"); e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const g = (parent, html, cls) => { const e = document.createElementNS(NS, "g"); if (cls) e.setAttribute("class", cls); if (html) e.innerHTML = html; parent.appendChild(e); return e; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const show = (e, t0, t1) => { e.style.opacity = 0; tl.set(e, { opacity: 1 }, t0); if (t1 != null) tl.set(e, { opacity: 0 }, t1); };
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  const CAM = {
    push_in: [{ scale: 1.0 }, { scale: 1.14 }], pull_out: [{ scale: 1.14 }, { scale: 1.0 }],
    pan_left: [{ scale: 1.1, x: 70 }, { scale: 1.1, x: -70 }], pan_right: [{ scale: 1.1, x: -70 }, { scale: 1.1, x: 70 }],
    tilt_up: [{ scale: 1.1, y: 46 }, { scale: 1.1, y: -46 }], tilt_down: [{ scale: 1.1, y: -46 }, { scale: 1.1, y: 46 }],
    still: [{ scale: 1.0 }, { scale: 1.04 }], shake: [{ scale: 1.06 }, { scale: 1.08 }],
  };

  // Scene contents: set, props, figures. `vb` crops the stage (used by split panels).
  function world(parent, s, t0, t1, vb) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", vb || "0 0 1920 1080"); svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); parent.appendChild(svg);
    const set = (Sets.SETS[s.set] || Sets.SETS.studio)(s.opts || {});
    g(svg, set.back);
    const props = (s.props || []).map((p) => ({ p, def: Sets.PROPS[p.type] })).filter((x) => x.def);
    const drawProp = (x) => { const e = g(svg, x.def.draw(x.p), "prop"), o = Object.assign({}, x.p);
      if (x.p.cue) o.at = TM.when(x.p, t0, L) - t0;
      // Parts of a prop (tower blocks, bars) can carry their own cue; turn it into seconds from the shot start.
      for (const k of Object.keys(o)) if (Array.isArray(o[k])) o[k] = o[k].map((it) => (it && it.cue ? Object.assign({}, it, { at: TM.when(it, t0, L) - t0 }) : it));
      x.def.play(tl, e, o, t0); };
    props.filter((x) => x.p.layer !== "front").forEach(drawProp);
    (s.actors || []).forEach((a, i) => {
      const x = a.x != null ? a.x : 960, k = a.scale || 1, flip = a.flip != null ? a.flip : x > 960;
      const wrap = g(svg); wrap.setAttribute("transform", `translate(${x},${a.y || 900}) scale(${flip ? -k : k},${k})`);
      const r = Rig.make(a.who, a); wrap.appendChild(r.el);
      Rig.init(r, a.face || "neutral", a.pose || (a.prop ? "phone" : "rest"), a.look);
      const tin = a.cue || a.at != null ? TM.when(a, t0, L) : t0 + 0.05 + i * 0.2;
      if (a.enter !== "none") { r.el.style.opacity = 0; tl.set(r.el, { opacity: 1 }, tin); Rig.enter(tl, r, a.enter, tin); }
      (a.acts || []).forEach((act) => { const t = TM.when(act, t0, L); if (act.face) Rig.face(tl, r, act.face, t); if (act.pose) Rig.pose(tl, r, act.pose, t); });
      (a.speaks || []).forEach((id) => { const ln = L[id]; if (ln) Rig.talk(tl, r, ln.text, ln.a, ln.d); });
      Rig.idle(tl, r, t0, t1, i * 3 + String(a.who).length);
    });
    if (set.front) g(svg, set.front);
    props.filter((x) => x.p.layer === "front").forEach(drawProp);
    Sets.animate(tl, svg, t0, t1);
    return svg;
  }

  function overlays(hud, list, t0, t1, worldEl) {
    (list || []).forEach((o, i) => {
      const def = Overlays[o.type]; if (!def) return;
      const e = def.build(o); hud.appendChild(e);
      const t = o.cue || o.at != null ? TM.when(o, t0, L) : t0 + TM.K.OV_LEAD + i * TM.K.OV_STEP;
      def.play(tl, e, o, t, { world: worldEl, t1 });
      if (o.until != null) tl.set(e, { opacity: 0 }, t0 + o.until);
    });
  }

  function scene(root, s, t0, t1, last) {
    const sh = div("shot", root); show(sh, t0, last ? null : t1);
    const w = div("world", sh); world(w, s, t0, t1);
    const m = CAM[s.camera] || CAM.still;
    tl.fromTo(w, Object.assign({ x: 0, y: 0 }, m[0]), Object.assign({ x: 0, y: 0, duration: t1 - t0, ease: "none", immediateRender: false }, m[1]), t0);
    if (s.camera === "shake") tl.fromTo(sh, { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, t0);
    if (s.grade) div("grade " + s.grade, sh);
    overlays(div("hud", sh), s.overlays, t0, t1, w);
  }

  // Word-by-word card. Words follow the narration when the card text matches the cue line from `word` on.
  function card(root, s, t0, t1, last) {
    const sh = div("shot card" + (s.small ? " small" : ""), root); show(sh, t0, last ? null : t1);
    const ws = TM.words(s.text), em = (s.emph || []).map(norm), box = div("words", sh);
    let times = null; const ln = L[s.cue];
    if (ln) { const lw = TM.lineWords(ln), st = s.word || 0;
      if (ws.every((w, i) => lw[st + i] && norm(lw[st + i].w) === norm(w))) times = ws.map((w, i) => lw[st + i].a); }
    if (!times) { const d = Math.min(Math.max(0.2, t1 - t0 - 0.35), ws.length * 0.28); times = ws.map((w, i) => t0 + 0.08 + d * i / ws.length); }
    ws.forEach((w, i) => { const sp = document.createElement("span"); sp.className = "w" + (em.includes(norm(w)) ? " em" : ""); sp.textContent = w; box.appendChild(sp); box.appendChild(document.createTextNode(" "));
      sp.style.opacity = 0; tl.fromTo(sp, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out", immediateRender: false }, Math.max(t0, times[i] - 0.03)); });
  }

  function chapter(root, s, t0, t1) {
    const sh = div("shot card chapter", root, `<div class="kick">CHAPTER ${esc(s.number || "")}</div><div class="words">${esc(s.title)}</div><div class="rule"></div>`); show(sh, t0, t1);
    tl.fromTo(sh.querySelector(".words"), { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "power3.out", immediateRender: false }, t0 + 0.05);
    tl.fromTo(sh.querySelector(".rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t0 + 0.2);
  }

  // Panels build up one by one: one short sentence, one panel.
  function split(root, s, t0, t1, last) {
    const sh = div("shot", root); show(sh, t0, last ? null : t1);
    const n = s.panels.length, w = 1920 / n;
    s.panels.forEach((p, i) => {
      const pe = div("panel", sh); pe.style.left = i * w + "px"; pe.style.width = w + "px";
      const fx = p.focus != null ? p.focus : 960; world(pe, p, t0, t1, `${fx - w / 2} 0 ${w} 1080`);
      if (p.grade) div("grade " + p.grade, pe);
      const tp = p.cue || p.at != null ? TM.when(p, t0, L) : t0 + i * (s.stagger || 0);
      if (tp > t0 + 0.01) { pe.style.opacity = 0; tl.fromTo(pe, { opacity: 1, y: 1080 }, { opacity: 1, y: 0, duration: 0.22, ease: "power3.out", immediateRender: false }, tp); }
      if (p.label) div("plabel", pe, esc(p.label));
      if (p.stamp) { const st = div("pstamp", pe, esc(p.stamp)); st.style.opacity = 0; tl.set(st, { opacity: 1 }, tp + (p.stampAt != null ? p.stampAt : 0.5));
        tl.fromTo(st, { scale: 2 }, { scale: 1, duration: 0.14, ease: "power4.in", immediateRender: false }, tp + (p.stampAt != null ? p.stampAt : 0.5)); }
    });
    overlays(div("hud", sh), s.overlays, t0, t1, null);
  }

  window.Studio = {
    build(timeline, story, lines, total) {
      tl = timeline;
      const root = document.getElementById("root"), res = TM.resolve(story, lines, total); L = res.L;
      res.shots.forEach((s, i) => { const last = i === res.shots.length - 1, f = s.type === "card" ? card : s.type === "chapter" ? chapter : s.type === "split" ? split : scene; f(root, s, s.t0, s.t1, last); });
      div("grain", root); div("vig", root);
      // Preview helper: add ?fit to the URL to scale the 1920x1080 stage to the window.
      if (/[?&]fit/.test(location.search)) { root.style.transform = "scale(" + window.innerWidth / 1920 + ")"; document.documentElement.style.cssText = document.body.style.cssText = "width:auto;height:auto"; }
      return res;
    },
    // Preview helper: ?t=12.5 shows the frame at 12.5 seconds (the render never passes a query).
    preview(timeline) { const m = /[?&]t=([\d.]+)/.exec(location.search); if (m) timeline.seek(parseFloat(m[1])); },
  };
})();
