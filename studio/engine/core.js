/* Studio engine: plays a storyboard over the narration timeline.
   Shot types: scene (default), card (word-by-word text card), chapter, split (2-4 panels).
   Shots are hard cuts. Everything is on one paused GSAP timeline, so any frame can be seeked. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg", TM = window.StudioTiming;
  let tl, L, V = false, W = 1920, DAY = []; // V: vertical 9:16 build (a Short); W: width of the picture box in pixels; DAY: daylight shots (no vignette)
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

  const FRAME = { wide: 1, medium: 1.4, close: 1.9 };

  // Scene contents: set, props, figures. `vb` crops the stage (used by split panels).
  function world(parent, s, t0, t1, vb, skip) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", vb || "0 0 1920 1080"); svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); parent.appendChild(svg);
    if (s.set && !Sets.SETS[s.set]) console.warn("studio: unknown set \"" + s.set + "\", drawn as the studio");
    const set = Sets.draw(s.set, s.opts || {}); // the set in its palette, with its dressing (engine/sets.js)
    g(svg, set.back);
    const props = (s.props || []).map((p) => ({ p, def: Sets.PROPS[p.type] })).filter((x) => x.def);
    const drawProp = (x) => { const e = g(svg, x.def.draw(x.p), "prop"), o = Object.assign({}, x.p);
      if (x.p.cue) o.at = TM.when(x.p, t0, L) - t0;
      // Parts of a prop (tower blocks, bars) can carry their own cue; turn it into seconds from the shot start.
      for (const k of Object.keys(o)) if (Array.isArray(o[k])) o[k] = o[k].map((it) => (it && it.cue ? Object.assign({}, it, { at: TM.when(it, t0, L) - t0 }) : it));
        else if (k !== "move" && o[k] && typeof o[k] === "object" && o[k].cue) o[k] = Object.assign({}, o[k], { at: TM.when(o[k], t0, L) - t0 }); // single part (tent "snap")
      x.def.play(tl, e, o, t0);
      // "move": { to: [x, y], cue/word/at, dur }: the prop travels (a parcel along the belt, a pile sliding to its new owner).
      if (x.p.move) { const m = x.p.move, tm = m.cue || m.at != null ? TM.when(m, t0, L) : t0 + 0.3;
        tl.to(e, { x: m.to[0] - (x.p.x || 0), y: (m.to[1] != null ? m.to[1] : x.p.y || 0) - (x.p.y || 0), duration: m.dur || 0.8, ease: m.ease || "power1.inOut" }, tm); } };
    if (s.extras) crowd(svg, s, t0, t1); // background people stand behind the props and signs
    props.filter((x) => x.p.layer !== "front").forEach(drawProp);
    // First every figure is made (a handover needs the receiver), then their acts go on the timeline.
    const list = s.actors || [], made = [], recv = {};
    list.forEach((a) => (a.acts || []).forEach((act) => { if (act.act === "handover" && a.prop) { const j = list.findIndex((b) => b.who === (act.with || act.to_who)); if (j >= 0) recv[j] = a; } }));
    list.forEach((a, i) => {
      if (i === skip) return;
      const x = a.x != null ? a.x : 960, k = a.scale || 1, flip = a.flip != null ? a.flip : a.thing ? false : x > 960, gv = recv[i];
      const spec = gv && !a.prop ? Object.assign({}, a, { prop: gv.prop, screen: gv.screen, sign: gv.sign, tag: gv.tag, open: gv.open, signColor: gv.signColor }) : a;
      const wrap = g(svg); wrap.setAttribute("transform", `translate(${x},${a.y || 900}) scale(${flip ? -k : k},${k})`);
      const r = Rig.make(a.who, spec); wrap.appendChild(r.el); if (flip) Rig.unflip(r);
      Rig.init(r, a.face || "neutral", a.pose || (a.prop ? Rig.PROP_POSE[a.prop] || "phone" : "rest"), a.look);
      if (gv && !a.prop) { const p = r.el.querySelector(".prop"); if (p) p.style.opacity = 0; } // the prop arrives with the handover
      made[i] = { a, r, x, k, flip };
    });
    made.forEach((m, i) => { if (!m) return; const { a, r, x, k, flip } = m, person = !a.thing, sgn = flip ? -k : k;
      const tin = a.cue || a.at != null ? TM.when(a, t0, L) : t0 + 0.05 + i * 0.2;
      // Entrance: a person with no "enter" walks in from the nearer edge; "walk" asks for it; living things pop in as before.
      const how = a.enter === undefined ? (person ? "walk" : "pop") : a.enter;
      if (how === "walk" && person) { const edge = x < 960 ? -240 : 2160, d = Math.max(0.7, Math.min(1.6, Math.abs(x - edge) / 650)), dx = (edge - x) / sgn;
        r.el.style.opacity = 0; tl.set(r.el, { opacity: 1 }, tin);
        tl.fromTo(r.el, { x: dx }, { x: 0, duration: d, ease: "none", immediateRender: false }, tin); Rig.walk(tl, r, tin, d, dx < 0 ? 1 : -1); }
      else if (how !== "none") { r.el.style.opacity = 0; tl.set(r.el, { opacity: 1 }, tin); Rig.enter(tl, r, how === "walk" ? "pop" : how, tin); }
      (a.acts || []).forEach((act) => { const t = TM.when(act, t0, L); if (act.face) Rig.face(tl, r, act.face, t); if (act.pose) Rig.pose(tl, r, act.pose, t);
        if (act.act === "handover") { const j = list.findIndex((b) => b.who === (act.with || act.to_who)), rm = made[j];
          Rig.pose(tl, r, "give", t); const p = r.el.querySelector(".prop"); if (p) tl.set(p, { opacity: 0 }, t + 0.42); Rig.pose(tl, r, "rest", t + 0.8);
          if (rm) { Rig.pose(tl, rm.r, "reach", t + 0.12); const q = rm.r.el.querySelector(".prop"); if (q) tl.set(q, { opacity: 1 }, t + 0.42); Rig.pose(tl, rm.r, Rig.PROP_POSE[a.prop] || "phone", t + 0.85); } }
        else if (act.act) Rig.act(tl, r, act.act, t, act);
        // "to": [x, y] walks the figure there (stage coordinates); "dur" sets how long it takes. A person walks; a living thing rocks.
        if (act.to) { const d = act.dur || 0.7, y0 = a.y || 900, dx = (act.to[0] - x) / sgn;
          tl.to(r.el, { x: dx, y: ((act.to[1] != null ? act.to[1] : y0) - y0) / k, duration: d, ease: act.ease || (person ? "none" : "power1.inOut") }, t);
          if (!Rig.walk(tl, r, t, d, dx >= (r.walkedTo || 0) ? 1 : -1)) { const n = Math.max(1, Math.round(d / 0.16));
            tl.fromTo(r.el, { rotation: -3 }, { rotation: 3, duration: d / n, yoyo: true, repeat: n - 1, ease: "sine.inOut", immediateRender: false }, t); tl.set(r.el, { rotation: 0 }, t + d + 0.01); }
          r.walkedTo = dx; } });
      (a.speaks || []).forEach((id) => { const ln = L[id]; if (ln) Rig.talk(tl, r, ln.text, ln.a, ln.d); });
      Rig.idle(tl, r, t0, t1, i * 3 + String(a.who).length);
    });
    if (set.front) g(svg, set.front);
    props.filter((x) => x.p.layer === "front").forEach(drawProp);
    Sets.animate(tl, svg, t0, t1);
    return svg;
  }

  /* "extras": n background people in a shot or panel: they walk across or stand and look on, smaller and a little greyer than the story's
     figures, behind them and behind every sign; most face the action, some show their back, none looks at the camera.
     Picked from the shot's id and their number, so a render never changes. A place that should look empty takes "opts": { "empty": true }. */
  let XID = 0;
  function crowd(svg, s, t0, t1) {
    const n = Math.min(14, Math.max(0, s.extras | 0)); if (!n || (s.opts && s.opts.empty)) return;
    const id = Rig.hashName(String(s.id || s.set || "x")), fid = "xg" + XID++, d = t1 - t0;
    const grp = g(svg, `<filter id="${fid}"><feColorMatrix type="saturate" values=".55"/><feComponentTransfer><feFuncR type="linear" slope=".9" intercept=".04"/><feFuncG type="linear" slope=".9" intercept=".04"/><feFuncB type="linear" slope=".9" intercept=".06"/></feComponentTransfer></filter>`, "crowd");
    grp.setAttribute("filter", `url(#${fid})`);
    const people = Array.from({ length: n }, (_, i) => { const h = (id + i * 7919) % 10007, row = (i + (h % 2)) % 3; return { i, h, row, y: 830 + row * 26 + (h % 9), k: 0.4 + row * 0.07 }; }).sort((p, q) => p.y - q.y);
    people.forEach(({ i, h, row, y, k }) => {
      const x = Math.round(((i + 0.5) * 1920) / n + ((h % 120) - 60)), walker = h % 3 === 0, dir = h % 2 ? 1 : -1, back = !walker && h % 4 === 1;
      const who = "EXTRA " + ((id + i * 31) % 997), look = x < 960 ? 1 : -1, flip = walker ? dir < 0 : look < 0;
      const wrap = g(grp); wrap.setAttribute("transform", `translate(${x},${y}) scale(${flip ? -k : k},${k})`);
      const P = h % 7 === 3 ? "fold" : "rest", r = Rig.make(who, { back, pose: P }); wrap.appendChild(r.el); if (flip) Rig.unflip(r);
      Rig.init(r, h % 5 === 0 ? "happy" : "neutral", P, look > 0 ? "right" : "left");
      if (walker) { const dist = Math.min(1100, 120 * d) / k; tl.fromTo(r.el, { x: 0 }, { x: dist, duration: d, ease: "none", immediateRender: false }, t0); Rig.walk(tl, r, t0, d + 0.3, 1); }
      Rig.idle(tl, r, t0, t1, h);
    });
  }

  function overlays(hud, list, t0, t1, worldEl) {
    (list || []).forEach((o, i) => {
      const def = Overlays[o.type]; if (!def) return;
      const e = def.build(o); hud.appendChild(e); if (V && o.x != null) e.style.left = o.x - 420 + "px";
      const t = o.cue || o.at != null ? TM.when(o, t0, L) : t0 + TM.K.OV_LEAD + i * TM.K.OV_STEP;
      def.play(tl, e, o, t, { world: worldEl, t1 });
      if (o.until != null) tl.set(e, { opacity: 0 }, t0 + o.until);
    });
  }

  // "frame": "ots": over the shoulder of the listener, aimed at the speaker. "ots": { "speaker": WHO, "listener": WHO } picks them;
  // else the speaker is the first figure that speaks and the listener the next person in the shot.
  function otsPick(s) {
    const all = (s.actors || []).map((a, i) => ({ a, i })), A = all.filter((x) => !x.a.thing), want = s.ots || {};
    const sp = all.find((x) => (x.a.who || x.a.thing) === want.speaker) || all.find((x) => (x.a.speaks || []).length) || A[0]; // a living thing may be the speaker (the listener is always a person)
    const li = A.find((x) => x !== sp && (!want.listener || x.a.who === want.listener));
    return sp ? { sp, li } : null;
  }
  // The listener seen from behind, large and dark in a lower corner: the back of the head and a shoulder. Moves with the camera.
  function otsLayer(w, li, side, t0, t1) {
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 1920 1080"); svg.setAttribute("class", "ots"); w.appendChild(svg);
    svg.innerHTML = `<filter id="otsdim${t0.toFixed(2).replace(".", "_")}"><feComponentTransfer><feFuncR type="linear" slope=".5"/><feFuncG type="linear" slope=".5"/><feFuncB type="linear" slope=".58"/></feComponentTransfer></filter>`;
    const r = Rig.make(li.a.who, Object.assign({}, li.a, { back: true, prop: null, badge: null })), K = 2.15, x = side > 0 ? 300 : 1620;
    const wrap = g(svg); wrap.setAttribute("transform", `translate(${x},${(690 - (r.G.yT + 93) * K).toFixed(0)}) scale(${K})`);
    wrap.setAttribute("filter", `url(#otsdim${t0.toFixed(2).replace(".", "_")})`); wrap.appendChild(r.el);
    Rig.init(r, "neutral", "rest"); Rig.idle(tl, r, t0, t1, 3);
  }
  // "light": the light of the shot. kind "spot" (default: { x, y, r, color, dark }, one source and darkness around it), "window" (a soft slanted
  // shaft of light from a window, { x, y, w, slant, color, dark }), "screen" (cold glow from below, { x, y, color, dark }), "neon" (two coloured
  // sources, { x, x2, y, color, color2, dark }) or "day" (bright and warm, no vignette). Screen positions, after framing.
  function light(sh, l, t0, t1) {
    const kind = l.kind || "spot", px = (v) => Math.round(v) + "px";
    if (kind === "day") { const d = div("light day", sh); d.style.background = `radial-gradient(ellipse at 50% 28%, rgba(255,246,220,.75), rgba(255,236,200,.35) 70%)`; DAY.push([t0, t1]); return; }
    if (kind === "window") {
      const x = l.x == null ? 1340 : l.x, y = l.y == null ? 80 : l.y, ww = l.w || 440, sl = l.slant == null ? 0.55 : l.slant, c = l.color || "#ffe3a8", dk = l.dark == null ? 0.42 : l.dark, dx = sl * (1080 - y);
      div("light", sh).style.background = `radial-gradient(ellipse 1300px 900px at ${px(x - dx * 0.6)} ${px(700)}, rgba(8,10,28,0) 0, rgba(8,10,28,${(dk * 0.45).toFixed(2)}) 650px, rgba(8,10,28,${dk}) 1300px)`;
      const beam = div("light beam", sh); beam.style.background = `linear-gradient(to bottom, ${c} 0%, ${c} 55%, rgba(0,0,0,0) 100%)`;
      beam.style.clipPath = `polygon(${px(x - ww / 2)} ${px(y)}, ${px(x + ww / 2)} ${px(y)}, ${px(x + ww / 2 - dx)} 1080px, ${px(x - ww / 2 - dx)} 1080px)`;
      const bar = div("light", sh); bar.style.background = "rgba(8,10,28,.28)"; // the window's cross bar, as a shadow in the shaft
      bar.style.clipPath = `polygon(${px(x - 9)} ${px(y)}, ${px(x + 9)} ${px(y)}, ${px(x + 9 - dx)} 1080px, ${px(x - 9 - dx)} 1080px)`; return;
    }
    if (kind === "screen") {
      const x = l.x == null ? 960 : l.x, y = l.y == null ? 920 : l.y, c = l.color || "#8fd8ff", dk = l.dark == null ? 0.62 : l.dark;
      div("light", sh).style.background = `radial-gradient(ellipse 980px 700px at ${px(x)} ${px(y)}, rgba(8,10,28,0) 0, rgba(8,10,28,${(dk * 0.35).toFixed(2)}) 420px, rgba(8,10,28,${dk}) 980px)`;
      const glow = div("light glow", sh); glow.style.background = `radial-gradient(ellipse 820px 560px at ${px(x)} ${px(y)}, ${c} 0, rgba(0,0,0,0) 70%)`;
      const tint = div("light tint", sh); tint.style.background = c; // everything turns a little cold
      tl.fromTo(glow, { opacity: 0.5 }, { opacity: 0.38, duration: 0.9, yoyo: true, repeat: Math.ceil((t1 - t0) / 0.9), ease: "sine.inOut", immediateRender: false }, t0); return;
    }
    if (kind === "neon") {
      const c1 = l.color || "#ff4fd8", c2 = l.color2 || "#3ff0ff", x1 = l.x == null ? 360 : l.x, x2 = l.x2 == null ? 1560 : l.x2, y = l.y == null ? 300 : l.y, dk = l.dark == null ? 0.4 : l.dark;
      div("light", sh).style.background = `radial-gradient(ellipse at 50% 50%, rgba(8,10,28,${(dk * 0.2).toFixed(2)}) 0, rgba(8,10,28,${dk}) 1100px)`;
      const g1 = div("light glow neon", sh), g2 = div("light glow neon", sh);
      g1.style.background = `radial-gradient(circle at ${px(x1)} ${px(y)}, ${c1} 0, rgba(0,0,0,0) 760px)`; g2.style.background = `radial-gradient(circle at ${px(x2)} ${px(y)}, ${c2} 0, rgba(0,0,0,0) 760px)`;
      for (let t = t0 + 0.7; t < t1 - 0.1; t += 2.3) { tl.set(g1, { opacity: 0.15 }, t); tl.set(g1, { opacity: 0.6 }, t + 0.06); } // the tube buzzes now and then
      return;
    }
    const r = l.r || 700, d = l.dark == null ? 0.72 : l.dark, at = `${l.x == null ? 960 : l.x}px ${l.y == null ? 480 : l.y}px`;
    div("light", sh).style.background = `radial-gradient(circle at ${at}, rgba(8,10,28,0) 0, rgba(8,10,28,${(d * 0.25).toFixed(2)}) ${Math.round(r * 0.45)}px, rgba(8,10,28,${d}) ${r}px)`;
    const glow = div("light glow", sh); glow.style.background = `radial-gradient(circle at ${at}, ${l.color || "#ffd9a0"} 0, rgba(0,0,0,0) ${Math.round(r * 0.75)}px)`;
  }

  function scene(root, s, t0, t1, last) {
    const sh = div("shot", root); show(sh, t0, last ? null : t1);
    const ots = s.frame === "ots" ? otsPick(s) : null;
    const w = div("world", sh), tilt = div("tilt", w), inner = div("inner", tilt); world(inner, s, t0, t1, null, ots && ots.li ? ots.li.i : -1);
    const lim = (v, h) => Math.max(-h, Math.min(h, v));
    if (ots) { // the speaker's face a third of the way in, on their own side; the listener's shoulder fills the other lower corner
      const a = ots.sp.a, sc = a.scale || 1, x = a.x != null ? a.x : 960, y = a.y || 900, k = V ? 1.5 : 1.65, side = x >= 960 ? 1 : -1, hy = a.thing ? y + (Rig.THINGS[a.thing] || Rig.THINGS.box)(a).face[1] * sc : y - 520 * sc;
      inner.style.transformOrigin = W / 2 + "px 540px";
      inner.style.transform = `scale(${k}) translate(${lim(960 - x + (230 * side) / k, 960 * (1 - 1 / k)).toFixed(1)}px, ${lim(540 - hy - 110 / k, 540 * (1 - 1 / k)).toFixed(1)}px)`;
      if (ots.li) otsLayer(w, ots.li, side, t0, t1);
    } else {
      // Shot size: "frame": "medium" or "close" moves in on the figures (or on "focus": [x, y]) so faces fill the picture.
      const box = (s.actors || []).map((a) => { const T = a.thing ? (Rig.THINGS[a.thing] || Rig.THINGS.box)({}) : null, sc = a.scale || 1, x = a.x != null ? a.x : 960, y = a.y || 900, half = (T ? T.w + 200 : 250) * sc, h = (T ? T.h + (T.hover ? 70 : 0) : 600) * sc;
        return { l: x - half, r: x + half, top: y - h, mid: y - h * (T ? 0.55 : s.frame === "close" ? 0.72 : 0.62) }; });
      const L0 = Math.min(...box.map((b) => b.l)), R0 = Math.max(...box.map((b) => b.r));
      const k = s.focus ? FRAME[s.frame] || 1 : box.length ? Math.max(1, Math.min(FRAME[s.frame] || 1, W / (R0 - L0))) : 1; // never so close that a figure is cut off
      if (k > 1 || V) { const fx = s.focus ? s.focus[0] : box.length ? (L0 + R0) / 2 : 960, fy = s.focus ? s.focus[1] : box.length ? box.reduce((p, b) => p + b.mid, 0) / box.length : 540;
        // the focus goes to the centre of the frame, but only as far as the picture still covers it (a vertical build shows a 1080-wide window of the stage)
        const hx = Math.max(0, 960 - W / 2 / k - (V ? 90 : 0)), hy = 540 * (1 - 1 / k);
        inner.style.transformOrigin = W / 2 + "px 540px"; inner.style.transform = `scale(${k.toFixed(3)}) translate(${lim(960 - fx, hx).toFixed(1)}px, ${lim(540 - fy, hy).toFixed(1)}px)`; }
    }
    // "angle": "low" looks up (power: lines meet above, the floor drops), "high" looks down (the small: lines meet below).
    if (s.angle === "low" || s.angle === "high") { const low = s.angle === "low"; tilt.style.transformOrigin = low ? "50% 100%" : "50% 0%"; tilt.style.transform = `perspective(1500px) rotateX(${low ? 13 : -13}deg) scale(1.2)`; }
    const m = CAM[s.camera] || CAM.still;
    tl.fromTo(w, Object.assign({ x: 0, y: 0 }, m[0]), Object.assign({ x: 0, y: 0, duration: t1 - t0, ease: "none", immediateRender: false }, m[1]), t0);
    if (s.camera === "shake") tl.fromTo(sh, { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, t0);
    if (s.grade) div("grade " + s.grade, sh);
    if (s.light) light(sh, s.light, t0, t1);
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
      const pe = div("panel", sh), fx = p.focus != null ? p.focus : 960;
      if (V) { const H = 1080 / n, fy = Math.max(H / 2, Math.min(1080 - H / 2, p.focusY != null ? p.focusY : 600)); // a Short stacks the panels
        Object.assign(pe.style, { left: 0, width: "1080px", top: i * H + "px", height: H + "px", bottom: "auto" }); world(pe, p, t0, t1, `${fx - 540} ${fy - H / 2} 1080 ${H}`); }
      else { pe.style.left = i * w + "px"; pe.style.width = w + "px"; world(pe, p, t0, t1, `${fx - w / 2} 0 ${w} 1080`); }
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
      tl = timeline; V = !!story.vertical; W = V ? 1080 : 1920; DAY = [];
      const root = document.getElementById("root"), res = TM.resolve(story, lines, total); L = res.L;
      if (story.cast) Rig.register(story.cast); // the episode's own people (same keys as Rig.CAST)
      let stage = root;
      if (V) { // a Short: the question on top, a square window of the stage, big subtitles below
        root.classList.add("vertical"); document.documentElement.style.cssText = document.body.style.cssText = "width:1080px;height:1920px";
        div("vtitle", root, esc(story.vtitle || story.title || "")); stage = div("vstage", root); }
      res.shots.forEach((s, i) => { const last = i === res.shots.length - 1, f = s.type === "card" ? card : s.type === "chapter" ? chapter : s.type === "split" ? split : scene; f(stage, s, s.t0, s.t1, last); });
      div("grain", stage); const vig = div("vig", stage);
      DAY.forEach(([a, b]) => { tl.set(vig, { opacity: 0 }, a); tl.set(vig, { opacity: 1 }, b); }); // daylight shots have no vignette
      const thumb = /[?&]thumb/.test(location.search);
      // Subtitles: on unless the storyboard says "subtitles": false. Text cards already show their words, so subtitles rest there.
      if (story.subtitles !== false && !thumb) { root.classList.add("subs-on"); const box = div("subs", root), cards = res.shots.filter((s) => s.type === "card" || s.type === "chapter"), max = V ? 22 : 40;
        lines.forEach((ln) => { const ws = TM.lineWords(ln), chunks = []; let cur = null;
          ws.forEach((w) => { if (cur && cards.some((s) => (s.t0 > cur.a && s.t0 <= w.a + 0.01) || (s.t1 > cur.a && s.t1 <= w.a + 0.01))) cur = null; /* a card starts or ends here */ if (!cur) { cur = { a: w.a, t: "" }; chunks.push(cur); } cur.t += (cur.t ? " " : "") + w.w; cur.b = w.b; if (cur.t.length >= max || (/[.?!…:;,]$/.test(w.w) && cur.t.length >= max * 0.55)) cur = null; });
          chunks.forEach((c, i) => { const end = i < chunks.length - 1 ? chunks[i + 1].a : ln.a + ln.d + 0.12; if (cards.some((s) => c.a >= s.t0 - 0.01 && c.a < s.t1)) return;
            show(div("sub" + (ln.speaker === "N" ? "" : " who"), box, "<span>" + esc(c.t) + "</span>"), c.a, end); }); }); }
      // Thumbnail helper: ?thumb hides the screen overlays, so the thumbnail's own text band is the only lettering on top.
      if (thumb) root.querySelectorAll(".hud").forEach((h) => { h.style.display = "none"; });
      // Preview helper: add ?fit to the URL to scale the stage to the window.
      if (/[?&]fit/.test(location.search)) { root.querySelectorAll("audio").forEach((x) => x.remove()); /* still frames need no sound; a sheet would load the mix once per frame */
        root.style.transform = "scale(" + window.innerWidth / W + ")"; document.documentElement.style.cssText = document.body.style.cssText = "width:auto;height:auto"; }
      return res;
    },
    // Preview helper: ?t=12.5 shows the frame at 12.5 seconds (the render never passes a query).
    preview(timeline) { const m = /[?&]t=([\d.]+)/.exec(location.search); if (m) timeline.seek(parseFloat(m[1])); },
  };
})();
