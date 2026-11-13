/* Story scenes: shot pieces that explain a story as a picture, loaded after sets.js.
   board_web   (prop)  evidence board: nodes with name strips, red strings that draw themselves, a camera that visits each node.
   timeline    (prop)  years on a road receding into depth; the camera glides from year to year.
   map_flight  (prop)  dark map, a route that draws from one city to another, a plane, a pulse at the end.
   Sets for them: evidence_wall, timeline_road, map_table (plain dark grounds; the props bring their own camera).
   Everything is timed from the timeline only: no timers, no randomness except the seeded rng(), no callbacks. */
(function () {
  "use strict";
  const INK = "#1b1d36", PAPER = "#f6f1e4", RED = "#d6282e", GOLD = "#e8a317";
  const st = `stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"`;
  const R = (x, y, w, h, fill, rx, more) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill}" ${more === undefined ? st : more}/>`;
  const T = (x, y, s, size, fill, anchor, more) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill || INK}" text-anchor="${anchor || "middle"}" ${more || ""}>${String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`;
  const cut = (s) => `<g class="cut">${s}</g>`;
  const rng = (seed) => () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const S = window.Sets, TM = window.StudioTiming;

  // A seeded face for a node: the cast's own head, cropped to a square window (no body, no hands).
  function portrait(slot) {
    const who = slot.getAttribute("data-who"), w = +slot.getAttribute("data-w"), r = window.Rig.make(who, {});
    window.Rig.init(r, "neutral", "rest");
    r.el.querySelectorAll(".hand").forEach((h) => { h.style.display = "none"; });
    const box = r.head.querySelector('rect[width="300"]'), y = parseFloat(box.getAttribute("y"));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("x", -w / 2); svg.setAttribute("y", -w / 2); svg.setAttribute("width", w); svg.setAttribute("height", w);
    svg.setAttribute("viewBox", `-195 ${y - 88} 390 390`); svg.setAttribute("overflow", "hidden");
    svg.appendChild(r.el); slot.appendChild(svg);
  }
  const faces = (el) => el.querySelectorAll(".face-slot").forEach(portrait);

  // Small flat glyphs for badges and year markers, centred on 0,0, about 160 wide.
  const GLYPH = {
    building: (c) => R(-46, -76, 92, 152, c, 4) + [-44, -4, 36].map((y) => R(-28, y - 20, 18, 22, PAPER, 0, "") + R(10, y - 20, 18, 22, PAPER, 0, "")).join("") + R(-14, 40, 28, 36, INK, 0, ""),
    can: (c) => R(-40, -66, 80, 132, c, 14) + R(-40, -30, 80, 56, PAPER, 0) + `<ellipse cx="0" cy="-66" rx="40" ry="12" fill="${PAPER}" ${st}/>`,
    coin: (c) => `<circle r="68" fill="${c}" ${st}/><circle r="48" fill="none" stroke="${INK}" stroke-width="5"/>` + T(0, 24, "$", 76, INK),
    bank: (c) => `<path d="M-84,-26 L0,-84 L84,-26Z" fill="${c}" ${st}/>` + [-56, -18, 20, 58].map((x) => R(x - 10, -18, 20, 78, PAPER, 0)).join("") + R(-90, 60, 180, 22, c, 0),
    person: (c) => `<circle cy="-34" r="34" fill="${c}" ${st}/><path d="M-62,70 Q-62,6 0,6 Q62,6 62,70Z" fill="${c}" ${st}/>`,
    plane: (c) => `<path d="M-70,6 L-14,-8 L-30,-62 L-10,-62 L34,-14 L70,-20 Q82,-16 70,-4 L36,8 L70,34 L50,34 L10,16 L-14,20 L-4,56 L-24,56 L-34,18 L-70,12Z" fill="${c}" ${st}/>`,
  };
  const glyph = (name, c) => (GLYPH[name] || GLYPH.building)(c || "#3d6fb6");

  // Plain dark grounds. `night` is accepted so the lint reads them as dark pictures.
  Object.assign(S.SETS, {
    evidence_wall: () => ({ back: R(0, 0, 1920, 1080, "#16121a", 0, ""), front: "" }),
    map_table: () => ({ back: R(0, 0, 1920, 1080, "#0c1330", 0, ""), front: "" }),
    timeline_road: (o) => { const r = rng(21); let s = R(0, 0, 1920, 1080, "#0d1230", 0, "");
      for (let i = 0; i < 46; i++) s += `<circle class="${i % 5 === 0 ? "pulse" : ""}" cx="${Math.round(r() * 1920)}" cy="${Math.round(r() * 250)}" r="${1.5 + r() * 2.5}" fill="#fff" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
      let x = 0; while (x < 1920) { const w = 60 + r() * 90, h = 40 + r() * 150; s += R(x, 300 - h, w, h + 2, "#171d44", 0, `stroke="#0a0d22" stroke-width="4"`);
        for (let wy = 300 - h + 14; wy < 288; wy += 28) for (let wx = x + 10; wx < x + w - 14; wx += 22) if (r() > 0.72) s += R(wx, wy, 9, 12, "#ffd98a", 0, ""); x += w + 4; }
      s += R(0, 300, 1920, 780, "#10142e", 0, "");
      // the road: a trapezoid from the vanishing point (960, 300) to past the bottom edge, with a centre line of dashes that grow toward us
      s += `<path d="M946,300 L974,300 L1960,1080 L-40,1080Z" fill="#262c52" ${st}/><path d="M946,300 L-40,1080 M974,300 L1960,1080" fill="none" stroke="#f6f1e4" stroke-width="5" opacity=".55" transform="translate(0,0)"/>`;
      for (let k = 0; k < 9; k++) { const a = 1 / (1 + k * 0.5), b = 1 / (1 + (k + 0.5) * 0.5), y0 = 300 + 780 * a, y1 = 300 + 780 * b, w0 = 3 + 14 * a, w1 = 3 + 14 * b;
        s += `<path d="M${960 - w0},${y0} L${960 + w0},${y0} L${960 + w1},${y1} L${960 - w1},${y1}Z" fill="#f2c94c" opacity=".85"/>`; }
      return { back: s + (o && o.glow === false ? "" : `<g class="pulse"><ellipse cx="960" cy="300" rx="420" ry="46" fill="#ffd98a" opacity=".07"/><ellipse cx="960" cy="300" rx="240" ry="26" fill="#ffd98a" opacity=".1"/></g>`), front: "" }; },
  });

  /* ------------------------------------------------------------------------------------------------
     1. Evidence board
     { type:"board_web", zoom:1.7, overview:1.4, nodes:[ {id, kind:"face"|"badge"|"doc", name, sub, who, icon, color, title, x, y, cue, word, at, focus:false} ],
       edges:[ {from, to, label, cue, word, at} ] }
     Nodes without x/y are placed in a zigzag across the board. A node lights up on its cue (the camera eases to it, the others dim and soften);
     an edge draws itself on its own cue, else just after the later of its two nodes. `overview`: seconds after the last node before the camera
     pulls back and everything lights up again (false: stay on the last node). */
  // Zigzag along the board, 360 px apart, centred on the stage; the board is wider than the picture when there are many nodes.
  function layout(nodes) {
    const n = nodes.length, gap = 360, x0 = 960 - (n - 1) * gap / 2;
    return nodes.map((nd, i) => ({ x: nd.x != null ? nd.x : Math.round(x0 + i * gap), y: nd.y != null ? nd.y : 480 + (n > 2 ? (i % 2 ? 110 : -110) : 0) }));
  }
  const overview = (pos) => { const xs = pos.map((p) => p.x), ys = pos.map((p) => p.y), w = Math.max(...xs) - Math.min(...xs) + 420, h = Math.max(...ys) - Math.min(...ys) + 520, k = Math.min(1, 1760 / w, 980 / h),
    cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2 - 20; return { x: 960 - k * cx, y: 540 - k * cy, scale: k }; };
  function nodeArt(nd) {
    const col = nd.color || (nd.kind === "face" ? "#2f3b73" : "#3d6fb6");
    const photo = R(-108, -150, 216, 202, nd.kind === "doc" ? "#fffdf6" : col, 6, `stroke="${INK}" stroke-width="5"`);
    if (nd.kind === "face") return photo + `<g class="face-slot" data-who="${nd.who || nd.name}" data-w="206" transform="translate(0,-49)"></g>`;
    if (nd.kind === "doc") return photo + T(0, -92, nd.title || "DOCUMENT", 36, RED) + [-52, -22, 8, 38].map((y, i) => R(-80, y - 10, i === 3 ? 90 : 160, 12, "#c9c3b0", 6, "")).join("") +
      `<g transform="translate(58,26) rotate(-14)"><circle r="30" fill="none" stroke="${RED}" stroke-width="6"/>${T(0, 10, "OK", 26, RED)}</g>`;
    return photo + `<g transform="translate(0,-49) scale(.95)">${glyph(nd.icon, nd.glyphColor || "#f2c94c")}</g>`;
  }
  const nodeSVG = (nd, p, i) => {
    const len = String(nd.name).length, fs = Math.max(26, Math.min(46, Math.floor(270 / (len * 0.5)))), tilt = (i % 2 ? 2.2 : -2.2);
    return `<g transform="translate(${p.x},${p.y})"><g class="nd" data-i="${i}"><g transform="rotate(${tilt})"><g class="cut">${R(-130, -170, 260, 280, PAPER, 10)}${nodeArt(nd)}` +
      (nd.sub ? T(0, 92, nd.sub, 28, "#4a4d6a") : "") + `</g><g class="cut"><g transform="rotate(${-tilt * 1.4})">${R(-150, 112, 300, 66, GOLD, 6)}${T(0, 112 + 46, nd.name, fs, INK)}</g></g>` +
      `<circle cx="0" cy="-170" r="15" fill="${RED}" ${st}/></g></g></g>`;
  };
  S.PROPS.board_web = {
    draw(o) {
      const nodes = o.nodes || [], pos = layout(nodes), id = {}; nodes.forEach((n, i) => { id[n.id || n.name] = i; });
      const r = rng(7); let cork = R(-700, -500, 3320, 2100, "#5b4129", 0, "") + R(-700, -500, 3320, 2100, "#2a1e14", 0, `opacity=".22" stroke="none"`);
      for (let i = 0; i < 340; i++) cork += `<circle cx="${Math.round(-680 + r() * 3280)}" cy="${Math.round(-480 + r() * 2060)}" r="${(2 + r() * 5).toFixed(1)}" fill="${r() > 0.5 ? "#7a5a3a" : "#3b2a1a"}" opacity=".55"/>`;
      const frame = `<rect x="-60" y="-60" width="2040" height="1200" fill="none" stroke="#3a2a1b" stroke-width="40"/>`;
      const edges = (o.edges || []).map((e, k) => { const a = pos[id[e.from]], b = pos[id[e.to]]; if (!a || !b) return "";
        const x0 = a.x, y0 = a.y - 170, x1 = b.x, y1 = b.y - 170, d = Math.hypot(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = Math.max(y0, y1) + 50 + d * 0.12, path = `M${x0},${y0} Q${cx},${cy} ${x1},${y1}`;
        const mx = 0.25 * x0 + 0.5 * cx + 0.25 * x1, my = 0.25 * y0 + 0.5 * cy + 0.25 * y1;
        return `<g class="ed" data-k="${k}"><path class="str" d="${path}" pathLength="1" fill="none" stroke="rgba(10,6,12,.45)" stroke-width="10" stroke-linecap="round" transform="translate(5,8)" stroke-dasharray="1 1"/>` +
          `<path class="str" d="${path}" pathLength="1" fill="none" stroke="${RED}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 1"/>` +
          (e.label ? `<g class="elab"><g class="cut">${R(mx - (String(e.label).length * 11 + 28), my - 24, String(e.label).length * 22 + 56, 48, PAPER, 8, `stroke="${INK}" stroke-width="5"`)}</g>${T(mx, my + 13, e.label, 36, INK)}</g>` : "") + `</g>`; }).join("");
      return `<g class="cam">${cork}${frame}${nodes.map((n, i) => nodeSVG(n, pos[i], i)).join("")}${edges}</g>`;
    },
    play(tl, el, o, t0) {
      const nodes = o.nodes || [], pos = layout(nodes), id = {}; nodes.forEach((n, i) => { id[n.id || n.name] = i; });
      faces(el);
      const cam = el.querySelector(".cam"), nd = [...el.querySelectorAll(".nd")], ed = [...el.querySelectorAll(".ed")], zoom = o.zoom || 1.7;
      // the engine turns a cue into seconds from the shot start (core.js, drawProp); a plain `at` is already that
      const tn = nodes.map((n, i) => (n.at != null ? n.at : 0.3 + i * 0.9));
      const order = nodes.map((n, i) => i).sort((a, b) => tn[a] - tn[b] || a - b), focusOrder = order.filter((i) => nodes[i].focus !== false);
      const focus = (i) => ({ x: 960 - zoom * pos[i].x, y: 540 - zoom * (pos[i].y + 4), scale: zoom });
      gsap.set(cam, Object.assign({ svgOrigin: "0 0", smoothOrigin: false }, focus(focusOrder[0] != null ? focusOrder[0] : 0)));
      const op = nodes.map(() => 0), eo = (o.edges || []).map(() => 1), blur = (v) => `blur(${v}px)`;
      nd.forEach((e) => gsap.set(e, { opacity: 0, transformOrigin: "50% 50%", smoothOrigin: false }));
      ed.forEach((e) => gsap.set(e, { opacity: 1 }));
      const setNode = (i, to, bl, t, dur) => { const f = op[i]; if (f === to && !bl) return; tl.fromTo(nd[i], { opacity: f, filter: blur(f < 1 && f > 0 ? 2.5 : 0) }, { opacity: to, filter: blur(bl), duration: dur, ease: "power2.out", immediateRender: false }, t); op[i] = to; };
      // edge times: own cue, else just after the later of its two nodes (several on the same node follow one another)
      const used = {}, te = (o.edges || []).map((e) => { if (e.at != null) return e.at;
        const a = id[e.from], b = id[e.to], m = Math.max(tn[a], tn[b]), key = tn[a] >= tn[b] ? a : b; used[key] = (used[key] || 0) + 1; return m + 0.45 + (used[key] - 1) * 0.6; });
      order.forEach((i, j) => {
        const t = t0 + tn[i];
        tl.fromTo(nd[i], { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)", immediateRender: false }, t + 0.2);
        // everyone else that is already on the board dims and softens
        nodes.forEach((n2, k) => { if (k !== i && op[k] === 1) setNode(k, 0.4, 2.5, t, 0.4); });
        op[i] = 1;
        // strings: those on the active node stay lit, the others sink back
        (o.edges || []).forEach((e, k) => { const touch = id[e.from] === i || id[e.to] === i, want = touch ? 1 : 0.25;
          if (te[k] <= tn[i] + 0.01 && eo[k] !== want) { tl.fromTo(ed[k], { opacity: eo[k] }, { opacity: want, duration: 0.4, immediateRender: false }, t); eo[k] = want; } });
      });
      // camera visits each node in the order of its time
      focusOrder.forEach((i, j) => { if (j === 0) return; const prev = tn[focusOrder[j - 1]], gap = tn[i] - prev, d = Math.max(0.25, Math.min(0.8, gap * 0.8)), f0 = focus(focusOrder[j - 1]), f1 = focus(i);
        tl.fromTo(cam, f0, Object.assign({ duration: d, ease: "power2.inOut", immediateRender: false }, f1), t0 + tn[i]); });
      // strings draw themselves, one at a time
      ed.forEach((e, k) => { const t = t0 + te[k], paths = e.querySelectorAll(".str");
        tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut", immediateRender: false }, t);
        gsap.set(paths, { strokeDashoffset: 1 });
        const lab = e.querySelector(".elab"); if (lab) { gsap.set(lab, { opacity: 0 }); tl.fromTo(lab, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)", immediateRender: false, transformOrigin: "50% 50%" }, t + 0.5); } });
      // the last move: pull back and light everything
      const last = focusOrder.length ? focusOrder[focusOrder.length - 1] : 0, tEnd = Math.max(...tn, ...te.map((x) => x + 0.6), 0) + (o.overview === undefined ? 1.4 : o.overview || 0);
      if (o.overview !== false && nodes.length > 1) { const to = t0 + tEnd;
        tl.fromTo(cam, focus(last), Object.assign({ duration: 0.9, ease: "power2.inOut", immediateRender: false }, overview(pos)), to);
        nodes.forEach((n, k) => { if (op[k] < 1) tl.fromTo(nd[k], { opacity: op[k], filter: blur(2.5) }, { opacity: 1, filter: blur(0), duration: 0.5, immediateRender: false }, to); });
        ed.forEach((e, k) => { if (eo[k] < 1) tl.fromTo(e, { opacity: eo[k] }, { opacity: 1, duration: 0.5, immediateRender: false }, to); }); }
    },
  };
})();
