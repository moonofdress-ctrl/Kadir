/* Story scenes: shot pieces that explain a story as a picture, loaded after sets.js.
   board_web   (prop)  evidence board: nodes with name strips, red strings that draw themselves, a camera that visits each node.
   timeline    (prop)  years on a road receding into depth; the camera glides from year to year.
   map_flight  (prop)  dark map, a route that draws from one city to another, a plane, a pulse at the end.
   money_flow, split_bar, chain, chat (props): the explainer scenes (second batch), on the plain dark ground `dark_stage`.
   Sets for them: evidence_wall, timeline_road, map_table, dark_stage (plain dark grounds; the props bring their own camera).
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
    dark_stage: () => ({ back: R(0, 0, 1920, 1080, "#12152c", 0, "") + `<g class="pulse"><ellipse cx="960" cy="560" rx="900" ry="420" fill="#2a3166" opacity=".22"/><ellipse cx="960" cy="560" rx="560" ry="260" fill="#3a4488" opacity=".18"/></g>`, front: "" }),
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
    return `<g transform="translate(${p.x},${p.y})"><g class="nd" data-i="${i}" data-layout-allow-overlap><g transform="rotate(${tilt})"><g class="cut">${R(-130, -170, 260, 280, PAPER, 10)}${nodeArt(nd)}` +
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

  /* ------------------------------------------------------------------------------------------------
     2. Timeline tunnel
     { type:"timeline", years:[ {year:"2015", caption:"A kitchen, a prebiotic soda", who:"ALLISON_ELLSWORTH" | icon:"can", color, cue, word, at} ] }
     Use on "set": "timeline_road". Years stand on the road as gantries, nearer is earlier. On each year's cue the camera glides one step:
     the year it leaves slides off to the left, dim and blurred; the next lights up with its caption and its small face or glyph. */
  // Roadside billboards, alternating sides of the road; later years stand further down the road, smaller and higher.
  const side = (i) => (i % 2 ? -1 : 1);
  const yState = (i, j) => { const r = i - j;
    if (r >= 0) { const k = 1 / (1 + 1.1 * r); return { x: 960 + side(i) * 500 * k, y: 300 + 460 * k, scale: k, opacity: r === 0 ? 1 : Math.max(0.45, 0.92 - 0.16 * r), filter: "blur(0px)" }; }
    const a = -r; return { x: 960 + side(i) * (500 + 800 * a), // past signs leave on their own side of the road, never across the active one
       y: 760 + 120 * a, scale: 1 + 0.25 * a, opacity: Math.max(0.2, 0.42 - 0.08 * (a - 1)), filter: `blur(${(4 * a).toFixed(1)}px)` }; };
  const yearSVG = (y, i) => {
    const cap = y.caption ? String(y.caption) : "", fs = Math.max(30, Math.min(50, Math.floor(700 / (cap.length * 0.52)))), cw = Math.min(760, cap.length * fs * 0.52 + 70), inner = Math.round(-side(i) * 240),
      extra = y.who ? `<g transform="translate(${inner},-430)"><circle r="84" fill="${PAPER}" ${st}/><g class="face-slot" data-who="${y.who}" data-w="150"></g></g>` :
      y.icon ? `<g transform="translate(${inner},-430)"><circle r="84" fill="${PAPER}" ${st}/><g transform="scale(.75)">${glyph(y.icon, y.color || "#3d6fb6")}</g></g>` : "";
    return `<g class="yr" data-i="${i}" data-layout-allow-overlap><ellipse class="hl pulse" cx="0" cy="-260" rx="470" ry="260" fill="#ffd98a" opacity="0"/>` +
      cut(R(-168, -220, 36, 220, "#3b4678", 4) + R(132, -220, 36, 220, "#3b4678", 4) + R(-240, -410, 480, 212, "#4a5896", 14) + R(-224, -396, 448, 184, PAPER, 8, "") + T(0, -248, y.year, 150, INK)) +
      (cap ? cut(R(-cw / 2, -176, cw, 80, GOLD, 10) + T(0, -118, cap, fs, INK)) : "") + extra + `</g>`; };
  S.PROPS.timeline = {
    draw(o) { const ys = o.years || []; return ys.map((y, i) => yearSVG(y, i)).reverse().join(""); },
    play(tl, el, o, t0) {
      const ys = o.years || [], n = ys.length; if (!n) return; faces(el);
      const m = [...el.querySelectorAll(".yr")].sort((a, b) => a.getAttribute("data-i") - b.getAttribute("data-i")), ty = ys.map((y, i) => (y.at != null ? y.at : i * 1.6));
      m.forEach((e, i) => gsap.set(e, Object.assign({ svgOrigin: "0 0", smoothOrigin: false }, yState(i, 0))));
      m.forEach((e, i) => { const hl = e.querySelector(".hl"), t = t0 + ty[i];
        // the halo comes up when the year is reached, and goes when the camera leaves
        tl.fromTo(hl, { opacity: 0 }, { opacity: 0.15, duration: 0.5, immediateRender: false }, t + (i ? 0.5 : 0));
        if (i + 1 < n) tl.fromTo(hl, { opacity: 0.15 }, { opacity: 0, duration: 0.3, immediateRender: false }, t0 + ty[i + 1]); });
      for (let j = 1; j < n; j++) { const gap = ty[j] - ty[j - 1], d = Math.max(0.4, Math.min(1.1, gap * 0.8));
        m.forEach((e, i) => tl.fromTo(e, yState(i, j - 1), Object.assign({ duration: d, ease: "power2.inOut", immediateRender: false }, yState(i, j)), t0 + ty[j])); }
    },
  };

  /* ------------------------------------------------------------------------------------------------
     4. Map flight
     { type:"map_flight", map:"us"|"world"|"region", from:"dallas" | {name, lat, lon}, to:"new york" | {...}, dur:2.4, cue/word/at, label:true, follow:1.9 }
     Dark map drawn from the small outlines below (no tiles, no network). A dashed route draws from `from` to `to` with a plane on its tip, the camera
     follows it (`follow`: how close, 1.9; 1 = the whole map), and the end city gets a pulse ring and a name plate. `map`: "us" (lower 48), "world"
     (whole earth, centred between the two cities so a Pacific crossing stays in one piece) or "region" (fitted to the two cities). Known city names:
     see CITIES; any other city is given as an object. */
  const CITIES = { "dallas": [32.78, -96.8], "new york": [40.71, -74.0], "san francisco": [37.77, -122.42], "santa clara": [37.35, -121.96], "los angeles": [34.05, -118.24], "seattle": [47.61, -122.33],
    "chicago": [41.88, -87.63], "houston": [29.76, -95.37], "miami": [25.76, -80.19], "atlanta": [33.75, -84.39], "boston": [42.36, -71.06], "washington": [38.9, -77.04], "denver": [39.74, -104.99],
    "taiwan": [24.8, 121.0], "taipei": [25.03, 121.57], "hsinchu": [24.8, 120.97], "tokyo": [35.68, 139.69], "seoul": [37.57, 126.98], "shanghai": [31.23, 121.47], "shenzhen": [22.54, 114.06],
    "london": [51.51, -0.13], "paris": [48.86, 2.35], "frankfurt": [50.11, 8.68], "amsterdam": [52.37, 4.9], "dubai": [25.2, 55.27], "mumbai": [19.08, 72.88], "singapore": [1.35, 103.82], "sydney": [-33.87, 151.21],
    "sao paulo": [-23.55, -46.63], "mexico city": [19.43, -99.13], "toronto": [43.65, -79.38], "lagos": [6.52, 3.38], "cairo": [30.04, 31.24] };
  // Coarse outlines as flat lon,lat lists, closed by the drawing code. Cartoon accuracy: enough to tell the shapes apart.
  const US = [-124.7,48.4,-122.8,49,-95.2,49,-94.6,48.7,-91,48.2,-89.6,48,-84.6,46.5,-82.4,43,-83.1,42.1,-82.5,41.7,-79,42.8,-79,43.3,-76.5,43.6,-75,45,-71.5,45,-70,46.7,-69.2,47.4,-68.3,47.3,-67.8,47.1,-67.8,45.7,-67,44.9,-68.5,44.2,-70.2,43.6,-70.7,42.9,-70.9,42.4,-70,42,-70,41.7,-71.4,41.4,-72.9,41.2,-73.9,40.6,-74,40,-74.1,39.5,-75.1,38.8,-75.5,38,-75.9,37.2,-76,36.9,-75.5,35.3,-76.6,34.7,-78,33.9,-79.2,33.2,-80.9,32,-81.4,30.7,-81.3,29.9,-80.5,28.4,-80,26.8,-80.2,25.7,-80.9,25.2,-81.8,26.1,-82.7,27.7,-82.8,29,-83.7,29.9,-84.3,29.9,-85.3,29.7,-86.5,30.4,-88,30.3,-89.2,30.2,-89.4,29,-90.5,29.1,-92,29.6,-93.8,29.7,-94.7,29.3,-95.9,28.6,-97.2,27.6,-97.4,26,-99.1,26.4,-99.5,27.5,-100.7,29.1,-101.4,29.8,-102.4,29.8,-103.1,29,-104.5,29.6,-104.9,30.6,-106.5,31.8,-108.2,31.8,-108.2,31.3,-111.1,31.3,-114.8,32.5,-117.1,32.5,-117.3,33,-118.4,33.8,-119.2,34.1,-120.6,34.5,-121.9,36.6,-122.5,37.8,-123.8,39.4,-124.4,40.4,-124.1,41.8,-124.5,42.8,-124,44.6,-123.9,46.2,-124.1,47,-124.7,48.4];
  const LAND = [
    [-168,65.5,-162,70.3,-156.5,71.3,-141,69.6,-128,70.2,-115,68,-100,68,-95,72,-90,68.3,-85,69.5,-82,66.5,-88,64,-93,61,-94.5,59,-92.5,57,-85,55.3,-82,52.9,-79.5,51.5,-79,54.5,-77,56.5,-78,58.5,-77.5,62.3,-73,62,-69,59.5,-65,60.3,-61.8,57.5,-57,54,-55.7,52.2,-60,50.2,-66,50,-69,48.2,-65,48.8,-64.3,46.7,-61,45.7,-65.5,43.5,-67,44.8,-70.2,43.6,-70.9,42.4,-72.9,41.2,-74,40,-75.5,38,-76,36.9,-75.5,35.3,-78,33.9,-80.9,32,-81.3,29.9,-80,26.8,-80.2,25.7,-81.8,26.1,-82.8,29,-84.3,29.9,-88,30.3,-89.4,29,-92,29.6,-94.7,29.3,-97.2,27.6,-97.4,25.5,-97.8,22,-96.2,19,-94.5,18.2,-91,18.8,-90.4,21,-87,21.5,-88,16,-83.5,15,-83.5,11,-79.7,9.5,-77.3,8.7,-78.5,7.5,-80.5,7.3,-83,8.3,-85.7,10,-87.5,13,-91.5,14,-94.5,16,-97,15.8,-101,17.3,-105.5,20,-105.7,22.5,-109.5,26.5,-112.5,29.5,-114.7,31.7,-113.5,29,-112,26.5,-110,23,-109.5,22.9,-112,24.8,-114.3,27.8,-115.7,29.7,-116.7,32.3,-117.3,33,-120.6,34.5,-122.5,37.8,-124.4,40.4,-124.7,48.4,-127,50.5,-130,54.5,-134,58.2,-139,59.8,-146,60.8,-152,59.2,-154,57.3,-158,56.5,-163,54.8,-158,58.5,-162,60,-165,62,-161,64.5],
    [-77.5,8.6,-76,9.3,-72,12,-68,10.5,-62,10.5,-60,8.5,-57,6,-52,5,-50,1.5,-48.5,-1,-44,-2.5,-38.5,-3.7,-35,-5.5,-35.2,-9,-37.5,-12,-39,-15,-39.2,-18,-41,-22,-44,-23,-48,-26,-48.8,-28.5,-52,-33,-54.5,-34.8,-58.4,-34.5,-57,-37,-62,-39,-65,-41,-65,-45,-67.5,-46.5,-68.5,-50.5,-69,-52.5,-68,-54.8,-72,-54,-75,-50,-74,-44,-73.5,-37,-71.5,-30,-70.5,-23,-70.3,-18.5,-76,-14,-79,-8,-81.2,-5.8,-80,-2.5,-80.5,-1,-78.8,1.8,-77.4,4],
    [-9.5,38.7,-9.5,43,-1.8,43.5,-1.2,46,-4.5,48.4,-1.5,48.7,1.5,50.5,4,51.5,8,53.6,8.6,56,10,54.5,14,54,19,54.5,21,57,24,57.3,23.5,59.3,28,60.5,30,62,29,66,33,69.3,41,67.5,40,66,44,66.5,44,68.5,53,68.5,60,69,68,69,70,73,80,73,87,75,100,77,105,77.5,113,74,125,73.5,140,72.5,150,71.5,160,70,170,70,180,68.9,180,65,178.5,62.5,170,60,163.5,59.8,162,57.5,160,54,156.5,51,155.5,55.5,155.8,57.5,152,59.2,143,59.3,137,54.5,141,52.5,140.5,48.5,135.5,43.5,131,42.5,129.5,41,129.4,37,129.3,35.2,127,34.5,126.3,36.8,126,38.5,125.1,39.6,121.5,40.8,121,39,122.2,37.5,119,37.1,118.9,39,117.8,38.5,120.8,36.5,121.2,32,122,30.5,121,28,119,25,116.5,22.8,113.5,22.2,110.5,21.3,108,21.5,106.5,19.8,109,15,109.2,11.5,105,8.7,103,10.5,100.9,13.5,99.5,9.5,101.5,6.5,103.5,1.5,100.3,6,98.3,8,98.5,12,97.8,16.5,94.5,16.2,94,19,92,21.5,91,22.5,87,21.5,86.5,19.5,84,17.5,80.2,15.5,80,12.8,79.8,10.3,77.5,8.1,76.3,10,74.8,13,73,17.5,72.8,20.8,70.5,20.8,68.8,22.4,67,24.8,62,25.2,57,25.7,56.5,27,54,26.7,51.5,27.8,50,30,48,28.5,50,26.5,51.5,24.5,56,26,56.3,24.5,59.8,22.5,58.5,20.5,55,17.2,52,16,48,14,44.2,12.7,42.8,15.2,39.5,21,37,24.5,35,28.2,34.3,27.8,32.6,30,34.5,31.2,35.2,33,36,35.8,32,36.2,29,36.5,27.2,37.2,26.5,39.3,26.2,40.5,24,40.2,23,39.5,24,38,22.8,36.5,21.5,37.5,21,39.5,19.5,41.5,19,42.2,15.5,45,13.5,45.6,12.4,45.2,12.4,44,14,42.5,16.2,41.8,18.5,40.1,16.5,39.2,15.7,38,15.8,40,14.2,40.8,12.5,41.7,10.5,43.3,8.8,44.4,7.5,43.8,4,43.4,3.2,42.2,0.8,41,-0.3,39.4,-0.7,37.6,-2.2,36.7,-5.4,36,-6.3,36.7,-7.4,37.2,-8.9,37],
    [5.5,58.5,5,62,10,64.5,14,67.5,19,70,26,71,31,70,29.5,69,26,67.6,25,65.2,21.5,63.5,21,61,22.5,60,18.5,59.8,16.8,57.5,14.5,56,12.7,56.2,11.5,59,10.5,59.5,8,58],
    [-17,21,-17.4,14.7,-15,11,-13,8.5,-10,6,-7.5,4.4,-4,5.2,0,5.7,4.5,6.3,6,4.3,8.5,4.6,9.8,1,9,-1,11.5,-4.5,12.2,-6,13.5,-12,12,-17,14.5,-22.5,15.5,-27,18,-32.5,19,-34.8,22,-34,26,-34,30,-31,32.5,-28.5,32.8,-26,35,-24,35.5,-20,40,-16,40.5,-10.5,39.3,-5,41,-1.5,44,1.5,48,5,51,11.8,47,11.2,43.2,11.7,41,15,38.5,18,37,21,35.5,24,34,27,32.6,29.9,32,31.1,29,30.9,25,31.6,20,30.8,19.5,30.3,15.5,32.2,11,33.2,10.2,34.2,10.6,36.8,9,37.2,5,36.8,2,36.6,-2,35.1,-5.9,35.8,-9.7,31.5,-10.5,28.5,-13.5,27.8,-14.5,26],
    [113.5,-22,114.2,-26.5,115,-34,118,-35,123,-33.8,126,-32.3,131,-31.5,134,-32.7,137.8,-33,138,-35.5,140,-37.8,144,-38.5,146.5,-39,150,-37.5,151.2,-33.8,153.2,-28,153,-25.5,150,-22.3,146.2,-19,145.4,-14.9,143.6,-14,142.4,-10.7,141.5,-13,141.5,-17,139.5,-17.5,137,-15.5,135.5,-15,136.8,-12.2,132.5,-11.4,130,-12.5,129.2,-14.8,126.5,-14,122.5,-17.5,121,-19.5,117,-20.7],
    [-73,78.5,-60,82,-30,83.5,-20,80,-18,76,-22,70,-32,68,-40,65,-43,60,-48,61,-52,64,-54,67,-55,70.5,-60,76,-67,76],
    [-5.5,50,1.3,51.2,1.7,52.7,0,53.5,-1.5,55,-2,57.6,-4,57.7,-5,58.6,-6.2,56.5,-4.8,55,-3,54.5,-3.2,53.4,-4.7,52.8,-5.2,51.7,-3.2,51.3],
    [-10,51.7,-6,52,-6,54.8,-8,55.2,-10,54],
    [129.8,33,131,34,132,35.5,136,36.2,137.3,37.2,139.5,38,140,40.5,141.5,41.3,142,39.5,141,37,140.8,35.7,139.5,35,137,34.5,135.2,33.7,133,33.5,131.5,31.5,130.3,31.2],
    [140,42,141,45.4,145.5,43.5,143,42],
    [120,23,121,25.2,122,24.5,120.9,21.9],
    [109,1.5,111,2.2,114,4.8,117,7,119,5,117.5,1,116.5,-3.5,114,-3.5,110.5,-3,109,-0.5],
    [95.3,5.6,98,4,104,-1,106,-6,102,-4,98.5,1],
    [105.2,-6.8,114.5,-7.8,114.5,-8.5,106,-7.5],
    [120,18.5,122.2,18.5,122,14.5,124,12.8,120.5,14],
    [122,7.5,126.5,7,126,9,123,9],
    [131,-1,135,-3.5,138,-8,141,-9,147,-10,150.5,-10.5,147,-6.5,145,-4.5,141,-2.6,135,-0.8],
    [172.7,-34.5,176,-37.5,178.5,-37.7,176,-41.5,174.8,-41.2,174.5,-39.5],
    [172.7,-40.5,174.3,-41.7,172.8,-43.7,171,-44.5,168.3,-46.7,166.5,-45.8,168,-44,170.5,-42.5],
    [49.3,-12,50.5,-15.5,47,-25,45,-25.2,43.5,-22,44.5,-16.5],
    [-24,65.5,-22,66.4,-14.5,66.3,-13.6,65,-18,63.4,-22.5,63.8],
    [-85,22,-81,23,-74,20.2,-77.5,19.9,-84,21.9],
  ];
  const cityOf = (c) => { if (typeof c === "string") { const v = CITIES[c.toLowerCase()]; if (!v) { console.warn("studio: unknown city \"" + c + "\" (give it as { name, lat, lon })"); return { name: c, lat: 0, lon: 0 }; } return { name: c.replace(/\b[a-z]/g, (m) => m.toUpperCase()), lat: v[0], lon: v[1] }; } return c; };
  // The map's frame: longitudes run on an unrolled axis, so a Pacific crossing is one piece (the land is drawn three times, a whole turn apart).
  function mapFrame(o, A, B) {
    const dl = ((B.lon - A.lon + 540) % 360) - 180, cLon = A.lon + dl / 2, lonB = A.lon + dl;
    let lon0, lon1, lat0, lat1;
    if (o.map === "us") { lon0 = -127; lon1 = -65; lat0 = 23; lat1 = 50.5; }
    else if (o.map === "world") { lon0 = cLon - 180; lon1 = cLon + 180; lat0 = -58; lat1 = 78; }
    else { const w = Math.max(30, Math.abs(dl) * 1.9), h = Math.max(18, Math.abs(B.lat - A.lat) * 2.2); lon0 = cLon - w / 2; lon1 = cLon + w / 2; lat0 = (A.lat + B.lat) / 2 - h / 2; lat1 = (A.lat + B.lat) / 2 + h / 2; }
    const mid = (lat0 + lat1) / 2, kx = Math.cos(mid * Math.PI / 180), sc = Math.min(1840 / ((lon1 - lon0) * kx), 1000 / (lat1 - lat0)), cx = (lon0 + lon1) / 2;
    const proj = (lon, lat) => [960 + (lon - cx) * kx * sc, 540 - (lat - mid) * sc];
    return { proj, a: A.lon, b: lonB, sc, cx };
  }
  const poly = (pts, F, off) => { let d = ""; for (let i = 0; i < pts.length; i += 2) { const p = F.proj(pts[i] + off, pts[i + 1]); d += (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1); } return d + "Z"; };
  const bez = (P, t) => [(1 - t) * (1 - t) * P[0][0] + 2 * (1 - t) * t * P[1][0] + t * t * P[2][0], (1 - t) * (1 - t) * P[0][1] + 2 * (1 - t) * t * P[1][1] + t * t * P[2][1]];
  // A route is sampled by arc length, so the plane, the dashes and the camera agree.
  function route(P) { const N = 240, pts = [bez(P, 0)], cum = [0]; for (let i = 1; i <= N; i++) { const q = bez(P, i / N), p = pts[i - 1]; pts.push(q); cum.push(cum[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
    const L = cum[N], at = (f) => { const d = Math.max(0, Math.min(1, f)) * L; let i = 1; while (i < N && cum[i] < d) i++; const k = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1), a = pts[i - 1], b = pts[i];
      return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI }; };
    return { L, at }; }
  const ease = (u) => -(Math.cos(Math.PI * u) - 1) / 2; // sine.inOut
  const plane = () => `<g class="pl">${cut(`<g transform="scale(.62)">${GLYPH.plane(PAPER)}</g>`)}</g>`;
  const framed = (o) => { const A = cityOf(o.from), B = cityOf(o.to), F = mapFrame(o, A, B), a = F.proj(A.lon, A.lat), bb = F.proj(F.b, B.lat), d = Math.hypot(bb[0] - a[0], bb[1] - a[1]);
    const nx = -(bb[1] - a[1]) / (d || 1), ny = (bb[0] - a[0]) / (d || 1), up = ny > 0 ? -1 : 1, bow = Math.min(260, d * 0.28);
    const P = [a, [(a[0] + bb[0]) / 2 + nx * up * bow, (a[1] + bb[1]) / 2 + ny * up * bow], bb]; return { A, B, F, P, a, b: bb }; };
  S.PROPS.map_flight = {
    draw(o) {
      const { A, B, F, P, a, b } = framed(o), R0 = route(P); let land = "", grid = "";
      for (let off = -360; off <= 360; off += 360) { land += LAND.map((p) => `<path d="${poly(p, F, off)}" fill="#38457c" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`).join(""); land += `<path d="${poly(US, F, off)}" fill="#4a5ca0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`; }
      for (let lon = -540; lon <= 540; lon += 30) { const p = F.proj(lon, 80), q = F.proj(lon, -60); grid += `M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}`; }
      for (let lat = -60; lat <= 80; lat += 15) { const p = F.proj(-540, lat), q = F.proj(540, lat); grid += `M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}`; }
      let dashes = ""; const nd = Math.max(8, Math.round(R0.L / 46)); for (let i = 0; i < nd; i++) { const p = R0.at(i / nd), q = R0.at((i + 0.6) / nd); dashes += `<path class="dash" data-f="${(i / nd).toFixed(4)}" d="M${p.x.toFixed(1)},${p.y.toFixed(1)}L${q.x.toFixed(1)},${q.y.toFixed(1)}" fill="none" stroke="#ffd23f" stroke-width="9" stroke-linecap="round" opacity="0"/>`; }
      // the name plate stands beside its dot, away from the route: the end city on its own side, the start city on the other
      const w = (c) => String(c.name).length * 30 + 68, dirB = b[0] >= a[0] ? 1 : -1;
      const city = (c, p, cls, dir) => `<g class="${cls}"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="18" fill="#ffd23f" ${st}/><g transform="translate(${(p[0] + dir * (w(c) / 2 + 34)).toFixed(1)},${(p[1] + 12).toFixed(1)})"><g class="cut">${R(-w(c) / 2, -50, w(c), 62, PAPER, 10)}</g>${T(0, 0, c.name.toUpperCase(), 44, INK)}</g></g>`;
      const ring = `<g class="ring"><circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="30" fill="none" stroke="#ffd23f" stroke-width="8"/></g>`;
      return `<g class="cam"><rect x="-3000" y="-2000" width="8000" height="5200" fill="#0c1330"/>${land}<path d="${grid}" stroke="#8fa3ff" stroke-width="2" opacity=".12" fill="none"/>${dashes}${ring}${city(A, a, "cA", -dirB)}${city(B, b, "cB", dirB)}${plane()}</g>`;
    },
    play(tl, el, o, t0) {
      const { P } = framed(o), R0 = route(P), cam = el.querySelector(".cam"), pl = el.querySelector(".pl"), ring = el.querySelector(".ring"), cA = el.querySelector(".cA"), cB = el.querySelector(".cB");
      const t = o.at != null ? o.at : 0.3, dur = o.dur || 2.4, k0 = o.follow || (o.map === "world" ? 1.35 : 1.8), N = 24, camAt = (f, kk) => { const p = R0.at(f); return { x: 960 - kk * p.x, y: 540 - kk * p.y, scale: kk }; };
      const kAt = (u) => k0 - (k0 - Math.max(1.15, k0 * 0.62)) * Math.sin(Math.PI * u); // closer at the ends, wider in the middle
      gsap.set(cam, Object.assign({ svgOrigin: "0 0", smoothOrigin: false }, camAt(0, k0)));
      gsap.set(pl, { opacity: 0 }); gsap.set(cB, { opacity: 0 }); gsap.set(ring, { opacity: 0, transformOrigin: "50% 50%", smoothOrigin: false });
      gsap.set(cA, { opacity: 0 });
      tl.fromTo(cA, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.7)", immediateRender: false, transformOrigin: "50% 50%" }, t0);
      const T0 = t0 + t;
      tl.set(pl, { opacity: 1 }, T0);
      // plane and camera: short straight steps along the route, timed by the same sine ease as the draw (no callbacks)
      for (let i = 0; i < N; i++) { const u0 = i / N, u1 = (i + 1) / N, f0 = ease(u0), f1 = ease(u1), p0 = R0.at(f0), p1 = R0.at(f1), d = (u1 - u0) * dur;
        tl.fromTo(pl, { x: p0.x, y: p0.y, rotation: p0.ang }, { x: p1.x, y: p1.y, rotation: p1.ang, duration: d, ease: "none", immediateRender: false }, T0 + u0 * dur);
        tl.fromTo(cam, camAt(f0, kAt(u0)), Object.assign({ duration: d, ease: "none", immediateRender: false }, camAt(f1, kAt(u1))), T0 + u0 * dur); }
      gsap.set(pl, { x: R0.at(0).x, y: R0.at(0).y, rotation: R0.at(0).ang });
      el.querySelectorAll(".dash").forEach((d) => { const f = parseFloat(d.getAttribute("data-f")), u = Math.acos(1 - 2 * f) / Math.PI; tl.set(d, { opacity: 1 }, T0 + u * dur); });
      const arrive = T0 + dur;
      tl.fromTo(cA, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, T0 + dur * 0.6); // the city we left slides out of the picture
      tl.set(pl, { opacity: 0 }, arrive + 0.05);
      tl.fromTo(cB, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.7)", immediateRender: false, transformOrigin: "50% 50%" }, arrive);
      // the pulse repeats a few times, then rests (a finite repeat, so a seek is exact)
      tl.fromTo(ring, { opacity: 0.9, scale: 0.5 }, { opacity: 0, scale: 3.2, duration: 0.9, ease: "power1.out", repeat: 5, immediateRender: false }, arrive);
    },
  };

  /* ================================================================================================
     Second batch: explainer scenes. Each shot that uses one should carry "explains": "what it makes clear" (a note for the lint and the reviewer).
     ================================================================================================ */
  const wrapText = (t, max) => { const out = []; let cur = ""; String(t).split(/\s+/).forEach((w) => { if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }); if (cur) out.push(cur); return out; };
  const pop = (tl, e, t, d) => tl.fromTo(e, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: d || 0.25, ease: "back.out(1.7)", immediateRender: false, transformOrigin: "50% 50%" }, t);
  const hide = (e) => gsap.set(e, { opacity: 0, transformOrigin: "50% 50%", smoothOrigin: false });
  const GREEN = "#2fbf71";

  /* ------------------------------------------------------------------------------------------------
     5. Money flow
     { type:"money_flow", parties:[ {id, kind:"face"|"badge", who, name, sub, icon, color} ], flows:[ {from, to, amount, coins:true, cue, word, at} ] }
     Two to five parties in a row. Each flow is an arrow that draws itself on its cue, then bills (or coins) stream along it and its amount lands on it.
     The receiving party pops when the money arrives. Who paid whom, a fee chain. */
  function mfLayout(o) { const n = (o.parties || []).length, k = n <= 3 ? 1 : n === 4 ? 0.86 : 0.74, x0 = n <= 3 ? 480 : 230, x1 = n <= 3 ? 1440 : 1690;
    return { k, pos: o.parties.map((p, i) => ({ x: p.x != null ? p.x : Math.round(n === 1 ? 960 : n === 2 ? (i ? 1440 : 480) : n === 3 ? 400 + i * 560 : x0 + (x1 - x0) * i / (n - 1)), y: p.y != null ? p.y : 600 })) }; }
  function mfPath(o, f, L) { const ix = {}; o.parties.forEach((p, i) => { ix[p.id || p.name] = i; });
    const i = ix[f.from], j = ix[f.to], a = L.pos[i], b = L.pos[j], k = L.k, dir = b.x > a.x ? 1 : -1, near = Math.abs(i - j) === 1;
    if (near) { const y = a.y - 30 * k; return { P: [[a.x + dir * (150 * k), y], [(a.x + b.x) / 2, y], [b.x - dir * (150 * k), y]], mid: [(a.x + b.x) / 2, y - 62], i, j }; }
    const y = a.y - 190 * k, top = y - 110 - 80 * Math.abs(i - j); return { P: [[a.x, y], [(a.x + b.x) / 2, top], [b.x, y]], mid: [(a.x + b.x) / 2, (y + top) / 2 - 36], i, j }; }
  S.PROPS.money_flow = {
    draw(o) { const parties = o.parties || [], L = mfLayout(o);
      const cards = parties.map((p, i) => `<g class="pt" data-layout-allow-overlap><g transform="translate(${L.pos[i].x},${L.pos[i].y}) scale(${L.k})">${nodeSVG(Object.assign({ kind: "badge" }, p), { x: 0, y: 0 }, i)}</g></g>`).join("");
      const flows = (o.flows || []).map((f, n) => { const m = mfPath(o, f, L), P = m.P, d = `M${P[0][0]},${P[0][1]} Q${P[1][0]},${P[1][1]} ${P[2][0]},${P[2][1]}`, tx = P[2][0] - P[1][0], ty = P[2][1] - P[1][1], ang = Math.atan2(ty, tx) * 180 / Math.PI, amt = String(f.amount || "");
        const items = [0, 1, 2, 3].map(() => f.coins ? `<g class="bill"><circle r="26" fill="#f2c94c" ${st}/>${T(0, 11, "$", 32, INK)}</g>` : `<g class="bill">${R(-34, -20, 68, 40, "#7ed99b", 6)}${T(0, 11, "$", 30, INK)}</g>`).join("");
        return `<g class="fl" data-n="${n}"><path class="ln" d="${d}" pathLength="1" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="22" stroke-dasharray="1 1" transform="translate(4,6)"/><path class="ln" d="${d}" pathLength="1" fill="none" stroke="${GREEN}" stroke-width="18" stroke-linecap="round" stroke-dasharray="1 1"/>` +
          `<g class="ah" transform="translate(${P[2][0]},${P[2][1]}) rotate(${ang.toFixed(1)})"><path d="M-6,-34 L40,0 L-6,34Z" fill="${GREEN}" ${st}/></g>${items}` +
          (amt ? `<g class="am" transform="translate(${m.mid[0].toFixed(1)},${m.mid[1].toFixed(1)})"><g class="cut">${R(-(amt.length * 17 + 36), -44, amt.length * 34 + 72, 80, PAPER, 14)}</g>${T(0, 18, amt, 62, "#1a7a44")}</g>` : "") + `</g>`; }).join("");
      return cards + flows; },
    play(tl, el, o, t0) { const parties = o.parties || [], L = mfLayout(o), pts = [...el.querySelectorAll(".pt")]; faces(el);
      pts.forEach((e, i) => { hide(e); pop(tl, e, t0 + 0.15 + i * 0.18, 0.3); });
      [...el.querySelectorAll(".fl")].forEach((fe, n) => { const f = o.flows[n], t = t0 + (f.at != null ? f.at : 0.8 + n * 1.6), m = mfPath(o, f, L), R0 = route(m.P), paths = fe.querySelectorAll(".ln"), ah = fe.querySelector(".ah"), am = fe.querySelector(".am"), bills = [...fe.querySelectorAll(".bill")];
        gsap.set(paths, { strokeDashoffset: 1 }); hide(ah); if (am) hide(am); bills.forEach((b) => gsap.set(b, { opacity: 0 }));
        tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut", immediateRender: false }, t);
        pop(tl, ah, t + 0.5, 0.15); if (am) pop(tl, am, t + 0.5, 0.25);
        // the bills: one after another along the arrow, 14 short steps each (no callbacks; the same frame on every seek)
        const N = 14, dur = 1.0, gap = 0.26;
        bills.forEach((b, q) => { const T0 = t + 0.6 + q * gap; tl.set(b, { opacity: 1 }, T0);
          for (let s2 = 0; s2 < N; s2++) { const p0 = R0.at(s2 / N), p1 = R0.at((s2 + 1) / N); tl.fromTo(b, { x: p0.x, y: p0.y, rotation: (q % 2 ? -8 : 8) }, { x: p1.x, y: p1.y, duration: dur / N, ease: "none", immediateRender: false }, T0 + s2 * dur / N); }
          tl.set(b, { opacity: 0 }, T0 + dur); gsap.set(b, { x: R0.at(0).x, y: R0.at(0).y }); });
        const arrive = t + 0.6 + dur; tl.fromTo(pts[m.j], { scale: 1 }, { scale: 1.07, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false, transformOrigin: "50% 60%" }, arrive); });
    },
  };

  /* ------------------------------------------------------------------------------------------------
     6. Fund split
     { type:"split_bar", total:"$1.95B", note:"what PepsiCo paid", parts:[ {label:"Taxes", amount:"$490M", share:0.25, color, cue, word, at} ] }
     One bar for the whole amount. On each part's cue it takes its colour, slides out of the bar (down and a little sideways) and its label and amount stand under it.
     `share` is the fraction of the bar (they should add to 1). "Of every $100": total "$100", amounts "$40". */
  const PALETTE = ["#e0262b", "#2f8fd8", "#2fbf71", "#e8a317", "#8a3fb6", "#d96aa0"];
  const sbLayout = (o) => { const parts = o.parts || [], tot = parts.reduce((a, p) => a + (p.share || 0), 0) || 1; let x = 260; const W = 1400;
    return parts.map((p, i) => { const w = W * (p.share || 1 / parts.length) / tot, r = { x, w, c: x + w / 2 }; x += w; return r; }); };
  S.PROPS.split_bar = {
    draw(o) { const parts = o.parts || [], L = sbLayout(o), n = parts.length, slot = 1500 / Math.max(1, n); let s2 = "";
      s2 += T(960, 290, o.total || "", 150, PAPER) + (o.note ? T(960, 352, o.note, 46, "#aab3e8") : "");
      parts.forEach((p, i) => { const col = p.color || PALETTE[i % PALETTE.length], lx = 960 - 750 + slot * (i + 0.5), sw = String(p.label).length;
        s2 += `<g class="sp" data-i="${i}" data-layout-allow-overlap><g class="seg">${cut(R(L[i].x, 420, L[i].w, 190, col, i === 0 || i === n - 1 ? 24 : 6))}</g>` +
          `<path class="lead" d="M${L[i].c},640 L${lx},760" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
          `<g class="lab">${T(lx, 830, p.label, Math.min(66, Math.floor(slot / (sw * 0.5)) - 4), PAPER)}${p.amount ? T(lx, 908, p.amount, 72, PAPER) : ""}</g></g>`; });
      return s2; },
    play(tl, el, o, t0) { const parts = o.parts || [], n = parts.length, sp = [...el.querySelectorAll(".sp")];
      sp.forEach((e, i) => { const t = t0 + (parts[i].at != null ? parts[i].at : 1 + i * 1.3), seg = e.querySelector(".seg"), lead = e.querySelector(".lead"), lab = e.querySelector(".lab"), col = parts[i].color || PALETTE[i % PALETTE.length], dx = (i - (n - 1) / 2) * 34;
        gsap.set(seg, { fill: GOLD }); gsap.set(seg.querySelectorAll("rect"), { fill: GOLD }); hide(lab); gsap.set(lead, { opacity: 0 });
        tl.fromTo(seg.querySelectorAll("rect"), { fill: GOLD }, { fill: col, duration: 0.25, immediateRender: false }, t);
        tl.fromTo(seg, { x: 0, y: 0 }, { x: dx, y: 40, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, t + 0.1);
        tl.fromTo(lead, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t + 0.35); pop(tl, lab, t + 0.4, 0.3); });
    },
  };

  /* ------------------------------------------------------------------------------------------------
     7. Cause and effect chain
     { type:"chain", nodes:[ {text, icon, color, who, cue, word, at} ], links:["so","but","because"] }
     Three to five boxes with a picture (a glyph or a face) and a short text; links[i] is the word on the arrow between box i and box i+1
     ("so" green, "but" red, anything else gold). Boxes light one at a time on their cue; the arrow into the active box glows, the rest dim. */
  const chLayout = (n) => { const w = n <= 3 ? 400 : n === 4 ? 330 : 250, gap = Math.max(90, (1800 - n * w) / Math.max(1, n - 1)), x0 = 960 - (n * w + (n - 1) * gap) / 2; return { w, gap, x: (i) => x0 + i * (w + gap) }; };
  const linkCol = (w) => (/^(but|however|yet)$/i.test(w) ? "#e0262b" : /^(so|then|therefore)$/i.test(w) ? GREEN : GOLD);
  S.PROPS.chain = {
    draw(o) { const nodes = o.nodes || [], n = nodes.length, L = chLayout(n), fs = n <= 3 ? 48 : n === 4 ? 42 : 36, mx = Math.floor((L.w - 30) / (fs * 0.5)); let s2 = "";
      nodes.forEach((nd, i) => { const x = L.x(i), lines = wrapText(nd.text, mx).slice(0, 3), art = nd.who ? `<g class="face-slot" data-who="${nd.who}" data-w="170" transform="translate(${x + L.w / 2},500)"></g>` : `<g transform="translate(${x + L.w / 2},500) scale(${L.w / 330 + 0.35})">${glyph(nd.icon, nd.color || "#3d6fb6")}</g>`;
        s2 += `<g class="cn" data-i="${i}" data-layout-allow-overlap><rect class="gl" x="${x - 18}" y="378" width="${L.w + 36}" height="${470}" rx="34" fill="#ffd98a" opacity="0"/>` +
          cut(R(x, 396, L.w, 434, PAPER, 22) + R(x + 18, 414, L.w - 36, 190, "#dfe3f5", 12, `stroke="${INK}" stroke-width="4"`) + art + lines.map((ln, q) => T(x + L.w / 2, 672 + q * (fs + 8), ln, fs, INK)).join("")) + `</g>`;
        if (i < n - 1) { const w = String((o.links || [])[i] || "so"), c = linkCol(w), x1 = x + L.w, x2 = L.x(i + 1), y = 610, cw = Math.min(L.gap - 8, w.length * 22 + 36);
          s2 += `<g class="lk" data-i="${i}"><g class="ar"><path d="M${x1 + 6},${y} L${x2 - 40},${y}" stroke="${c}" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M${x2 - 52},${y - 34} L${x2 - 6},${y} L${x2 - 52},${y + 34}Z" fill="${c}" ${st}/></g>` +
            `<g class="cut">${R((x1 + x2) / 2 - cw / 2, y - 100, cw, 56, c, 12)}</g>${T((x1 + x2) / 2, y - 58, w.toUpperCase(), Math.min(40, Math.floor((cw - 10) / (w.length * 0.62))), "#fff")}</g>`; } });
      return s2; },
    play(tl, el, o, t0) { const nodes = o.nodes || [], n = nodes.length; faces(el);
      const cn = [...el.querySelectorAll(".cn")], lk = [...el.querySelectorAll(".lk")], tn = nodes.map((x, i) => (x.at != null ? x.at : 0.4 + i * 1.4));
      cn.forEach((e) => { hide(e); }); lk.forEach((e) => hide(e));
      const opN = nodes.map(() => 0), opL = lk.map(() => 0);
      nodes.forEach((x, i) => { const t = t0 + tn[i];
        // everything already on the table dims; the new box and the arrow into it light up
        cn.forEach((e, k) => { if (k !== i && opN[k] === 1) { tl.fromTo(e, { opacity: 1 }, { opacity: 0.45, duration: 0.3, immediateRender: false }, t); opN[k] = 0.45; } });
        lk.forEach((e, k) => { if (k !== i - 1 && opL[k] === 1) { tl.fromTo(e, { opacity: 1 }, { opacity: 0.4, duration: 0.3, immediateRender: false }, t); opL[k] = 0.4; } });
        if (i > 0) { tl.fromTo(lk[i - 1], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, t); opL[i - 1] = 1; }
        pop(tl, cn[i], t + (i > 0 ? 0.25 : 0), 0.3); opN[i] = 1;
        const gl = cn[i].querySelector(".gl"); tl.fromTo(gl, { opacity: 0 }, { opacity: 0.55, duration: 0.3, immediateRender: false }, t + 0.2);
        if (i + 1 < n) tl.fromTo(gl, { opacity: 0.55 }, { opacity: 0, duration: 0.3, immediateRender: false }, t0 + tn[i + 1]); });
    },
  };

  /* ------------------------------------------------------------------------------------------------
     8. Phone messages
     { type:"chat", name:"Contact", source:"Court filing, exhibit 12" | reconstruction:true, messages:[ {from:"them"|"me", text, cue, word, at} ], x, y, sound:false }
     ONLY for messages that are on the record (a court filing, a post, an interview): give `source` (shown on the phone) and also show it with a `source` overlay.
     A reconstruction is allowed when it says so: `"reconstruction": true` puts a RECONSTRUCTION band on the phone for the whole shot. With neither, the band is
     drawn anyway. Each message appears after a typing dot; incoming ones get a soft `pop` (max 3 per phone, set in tools/cues.mjs, `"sound": false` to silence). */
  const chatLayout = (o) => { let y = 20; const W = 400; return (o.messages || []).map((m) => { const lines = wrapText(m.text, 21), w = Math.min(W, Math.max(...lines.map((l) => l.length)) * 17 + 46), h = lines.length * 40 + 30, r = { lines, w, h, y, me: m.from === "me" }; y += h + 22; return r; }); };
  S.PROPS.chat = {
    draw(o) { const px = (o.x != null ? o.x : 960) - 260, py = o.y != null ? o.y : 90, recon = o.reconstruction || !o.source, L = chatLayout(o), top = recon ? 190 : 160, H = 900 - top - 20;
      let s2 = cut(R(px, py, 520, 900, "#0e1024", 70)) + R(px + 14, py + 14, 492, 872, "#eef0f8", 58, `stroke="none"`);
      s2 += R(px + 14, py + 14, 492, 100, "#2468a8", 58, `stroke="none"`) + R(px + 14, py + 70, 492, 44, "#2468a8", 0, `stroke="none"`) + T(px + 260, py + 82, String(o.name || "Messages").toUpperCase(), 44, "#fff");
      if (recon) s2 += R(px + 14, py + 114, 492, 56, RED, 0, `stroke="none"`) + T(px + 260, py + 154, "RECONSTRUCTION", 38, "#fff");
      else s2 += R(px + 14, py + 114, 492, 44, "#d9def2", 0, `stroke="none"`) + T(px + 260, py + 146, "SOURCE: " + String(o.source).toUpperCase().slice(0, 34), 26, "#33385e");
      s2 += `<svg x="${px + 14}" y="${py + top}" width="492" height="${H}" viewBox="0 0 492 ${H}" overflow="hidden"><g class="msgs">`;
      (o.messages || []).forEach((m, i) => { const b = L[i], x = b.me ? 492 - 24 - b.w : 24;
        s2 += `<g class="ty" data-i="${i}"><g transform="translate(${b.me ? 492 - 24 - 110 : 24},${b.y})">${R(0, 0, 110, 62, b.me ? "#bfe9cd" : "#fff", 28, `stroke="${INK}" stroke-width="4"`)}${[0, 1, 2].map((d) => `<circle class="dt" cx="${32 + d * 24}" cy="31" r="8" fill="#6b708f"/>`).join("")}</g></g>` +
          `<g class="mg" data-i="${i}"><g transform="translate(${x},${b.y})">${R(0, 0, b.w, b.h, b.me ? "#bfe9cd" : "#fff", 28, `stroke="${INK}" stroke-width="4"`)}${b.lines.map((ln, q) => `<text x="22" y="${42 + q * 40}" font-size="30" fill="${INK}" text-anchor="start" style="font-family:var(--ui);font-weight:700">${ln.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`).join("")}</g></g>`; });
      return s2 + `</g></svg>`; },
    play(tl, el, o, t0) { const msgs = o.messages || [], L = chatLayout(o), recon = o.reconstruction || !o.source, H = 900 - (recon ? 190 : 160) - 20, box = el.querySelector(".msgs");
      if (!o.reconstruction && !o.source) console.warn("studio: chat without a source is drawn as a RECONSTRUCTION (give \"source\", or \"reconstruction\": true)");
      const tys = [...el.querySelectorAll(".ty")], mgs = [...el.querySelectorAll(".mg")], tm = msgs.map((m, i) => (m.at != null ? m.at : 0.8 + i * 1.8)); let scroll = 0; gsap.set(box, { y: 0 });
      msgs.forEach((m, i) => { const t = t0 + tm[i], ty = tys[i], mg = mgs[i], dots = ty.querySelectorAll(".dt"), b = L[i], from = Math.max(t0 + (i ? tm[i - 1] + 0.1 : 0), t - 0.75);
        hide(ty); hide(mg); gsap.set(mg, { transformOrigin: b.me ? "100% 100%" : "0% 100%" }); gsap.set(ty, { transformOrigin: b.me ? "100% 100%" : "0% 100%" });
        if (t - from > 0.2) { tl.set(ty, { opacity: 1 }, from); dots.forEach((d, q) => tl.fromTo(d, { opacity: 0.25 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: Math.max(1, Math.floor((t - from) / 0.4)), ease: "none", immediateRender: false }, from + q * 0.12)); tl.set(ty, { opacity: 0 }, t); }
        tl.fromTo(mg, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)", immediateRender: false }, t);
        const need = b.y + b.h + 24 - H; if (need > scroll) { tl.fromTo(box, { y: -scroll }, { y: -need, duration: 0.3, ease: "power2.out", immediateRender: false }, t); scroll = need; } });
    },
  };
})();
