/* Set library and world props, all drawn in code on a 1920x1080 SVG stage.
   A set returns { back, front }: `back` is drawn behind the figures, `front` in front of them.
   Figures stand on y = 900 unless the shot says otherwise.
   Add a new set by adding a function to SETS; add a prop by adding { draw, play } to PROPS. */
(function () {
  "use strict";
  const INK = "#1b1d36", SW = 7;
  const st = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
  const R = (x, y, w, h, fill, rx, more) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill}" ${more === undefined ? st : more}/>`;
  const T = (x, y, s, size, fill, anchor, more) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill || INK}" text-anchor="${anchor || "middle"}" ${more || ""}>${String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`;
  const cut = (s) => `<g class="cut">${s}</g>`;
  // Small deterministic generator, so "random" detail is the same on every render.
  const rng = (seed) => () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const SYL = ["KA", "VO", "RI", "ZU", "ME", "TO", "LA", "XI", "NE", "DU", "PA", "SO", "BRI", "GLO", "FY"];
  // Made-up six-letter names for background ticker boards; real prices never go here.
  const ticker = (r) => (SYL[Math.floor(r() * 15)] + SYL[Math.floor(r() * 12)] + SYL[Math.floor(r() * 12)]).slice(0, 6);

  function skyline(x0, x1, base, r, colors, lit) {
    let s = "", x = x0;
    while (x < x1) { const w = 50 + r() * 90, h = 70 + r() * 230, c = colors[Math.floor(r() * colors.length)];
      s += R(x, base - h, w, h + 4, c, 0, `stroke="${INK}" stroke-width="5"`);
      for (let wy = base - h + 16; wy < base - 20; wy += 34) for (let wx = x + 12; wx < x + w - 18; wx += 26) if (r() > 0.45) s += R(wx, wy, 12, 16, lit ? "#ffe14d" : "rgba(255,255,255,.55)", 0, "");
      x += w + 6; }
    return s;
  }
  const cloud = (x, y, k) => `<g class="cloud" transform="translate(${x},${y}) scale(${k || 1})"><path d="M0,40 Q-6,6 34,8 Q48,-26 92,-10 Q130,-34 160,2 Q204,0 200,40Z" fill="#fff" ${st}/></g>`;
  const plant = (x, y) => cut(`<path d="M${x},${y - 60} Q${x - 70},${y - 190} ${x - 26},${y - 250} Q${x - 6},${y - 170} ${x},${y - 60} Q${x + 10},${y - 200} ${x + 62},${y - 236} Q${x + 60},${y - 150} ${x},${y - 60} Q${x + 80},${y - 130} ${x + 112},${y - 120} Q${x + 70},${y - 70} ${x},${y - 60}Z" fill="#3f9b5a" ${st}/>` +
    `<path d="M${x - 46},${y - 66} L${x + 46},${y - 66} L${x + 34},${y} L${x - 34},${y}Z" fill="#c9705a" ${st}/>`);
  const monitor = (x, y, w, mood) => { const h = w * 0.62, up = mood !== "red", col = up ? "#46e08a" : "#ff5a4f";
    return cut(R(x, y, w, h, INK, 10) + R(x + 12, y + 12, w - 24, h - 24, up ? "#0f3b24" : "#3b0f14", 4, "") +
      `<path d="M${x + 24},${y + (up ? h - 30 : 30)} L${x + w * 0.3},${y + h * 0.5} L${x + w * 0.5},${y + h * (up ? 0.6 : 0.4)} L${x + w - 26},${y + (up ? 28 : h - 28)}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
      R(x + w / 2 - 12, y + h, 24, 26, INK, 0, "") + R(x + w / 2 - 50, y + h + 24, 100, 12, INK, 6, "")); };

  // ---- helpers for the places of the soda episode: light without gradients (stacked translucent shapes), hanging bulbs, windows ----
  const halo = (x, y, r, col, a) => `<g class="pulse">` + [1, 0.7, 0.42].map((k, i) => `<circle cx="${x}" cy="${y}" r="${Math.round(r * k)}" fill="${col}" opacity="${((a || 0.22) * (i + 1) * 0.55).toFixed(2)}"/>`).join("") + `</g>`;
  const pool = (x, y, rx, ry, col, a) => `<g class="pulse">` + [1, 0.7, 0.42].map((k, i) => `<ellipse cx="${x}" cy="${y}" rx="${Math.round(rx * k)}" ry="${Math.round(ry * k)}" fill="${col}" opacity="${((a || 0.22) * (i + 1) * 0.55).toFixed(2)}"/>`).join("") + `</g>`;
  const beam = (x, y, w0, w1, h, col, a) => `<path d="M${x - w0 / 2},${y} L${x + w0 / 2},${y} L${x + w1 / 2},${y + h} L${x - w1 / 2},${y + h}Z" fill="${col}" opacity="${a || 0.24}"/>`;
  const hang = (x, y, len, on, col) => `<g class="sway"><path d="M${x},${y} L${x},${y + len}" stroke="${INK}" stroke-width="5"/>${R(x - 14, y + len - 4, 28, 26, "#8d8a7e", 6, `stroke="${INK}" stroke-width="5"`)}<circle cx="${x}" cy="${y + len + 34}" r="22" fill="${on ? col || "#fff1b0" : "#ece6d3"}" ${st} stroke-width="5"/></g>` + (on ? halo(x, y + len + 34, 150, col || "#ffe9a0", 0.3) : "");
  const floorLine = (hz) => `<path d="M0,${hz} L1920,${hz}" ${st}/>`;
  // A window onto the city: nested svg so the skyline is cut at the frame. Night: dark towers with lit windows.
  const win = (x, y, w, h, n, seed) => { const r = rng(seed || 5);
    return cut(R(x, y, w, h, n ? "#161c3d" : "#bfe0ea", 8) + `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" overflow="hidden">${skyline(x + 6, x + w, y + h, r, n ? ["#232c54", "#2c3766", "#1c2340"] : ["#7f9fc0", "#9db7d1", "#6c88ab"], n)}</svg>` +
      `<path d="M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h * 0.5} L${x + w},${y + h * 0.5}" ${st}/>` + R(x - 14, y + h, w + 28, 22, n ? "#3a4272" : "#f6f1e4", 6)); };
  // One stage chair, tall and plain: lit (gold, with a glow behind) or dark (navy). Origin = the floor under the seat.
  const throne = (x, y, lit, k) => { k = k || 1; const c = lit ? "#e8a317" : "#2a3263", d = lit ? "#c98a10" : "#1c2340";
    return (lit ? halo(x, y - 230 * k, 260 * k, "#fff0b8", 0.3) : "") + `<g transform="translate(${x},${y}) scale(${k})"><path d="M-64,-80 L-72,0 M64,-80 L72,0" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
      R(-86, -128, 172, 54, d, 18) + R(-74, -430, 148, 310, c, 36) + R(-56, -396, 112, 86, lit ? "#ffd86b" : "#343e78", 24) + `</g>`; };

  // The view through glass walls: a dawn sky (night: the dark city) and towers.
  const glassWall = (n) => { const r = rng(44); return R(0, 0, 1920, 800, n ? "#1b2347" : "#9fb8d8", 0, "") + (n ? "" : R(0, 380, 1920, 140, "#f6c9a0", 0, "") + R(0, 520, 1920, 100, "#f2a77a", 0, "")) + skyline(0, 1920, 800, r, n ? ["#232c54", "#2c3766", "#1c2340"] : ["#8aa6c8", "#9db7d1", "#7f9fc0"], n); };

  /* ---- Palettes (13 Nov 2026): every place has one dominant colour of its own, with a day and a night look.
     A shot picks one with "opts": { "palette": "teal" }; each set has a default (SET_PALETTE). wall: the back wall; panel: the lower wall,
     cabinets, wainscot; floor; trim: mouldings and frames; accent: one object that stands out; glow: the colour of its lamps. ---- */
  const PALETTES = {
    teal: { wall: "#2f8f8a", panel: "#1f6f6c", floor: "#c9a36b", trim: "#f6f1e4", accent: "#f0b429", glow: "#fff1c0" },
    green: { wall: "#3f8f5a", panel: "#2c6b44", floor: "#8a5a3c", trim: "#e8dcc0", accent: "#e0262b", glow: "#e2ffc0" },
    blue: { wall: "#3d6fb6", panel: "#2c5490", floor: "#8a5a3c", trim: "#e8dcc0", accent: "#f0b429", glow: "#d8ecff" },
    navy: { wall: "#2c3766", panel: "#1f2a4f", floor: "#4a4060", trim: "#c9ced6", accent: "#e8a317", glow: "#ffe0a0" },
    red: { wall: "#b8473d", panel: "#8a2f2a", floor: "#5b3a22", trim: "#f3e6c8", accent: "#f0b429", glow: "#ffd9a0" },
    amber: { wall: "#e0a838", panel: "#b07818", floor: "#8a5a3c", trim: "#f6f1e4", accent: "#1f8a8a", glow: "#fff1c0" },
    violet: { wall: "#5a4a80", panel: "#43386a", floor: "#2c2646", trim: "#c9bfe0", accent: "#e8a317", glow: "#fff0b8" },
    wood: { wall: "#9a6a47", panel: "#6f452c", floor: "#4a3a2e", trim: "#e8dcc0", accent: "#1f8a5a", glow: "#ffe9b0" },
    cream: { wall: "#efe6d0", panel: "#d8c8a8", floor: "#a5814d", trim: "#f6f1e4", accent: "#e0262b", glow: "#fff6d8" },
    pink: { wall: "#e87aa8", panel: "#c95f8d", floor: "#6b4a6e", trim: "#fbe3ec", accent: "#1fb5b5", glow: "#ffe0f0" },
    mint: { wall: "#8fd0b4", panel: "#5fae90", floor: "#c9ced6", trim: "#f6f1e4", accent: "#e0262b", glow: "#efffef" },
    slate: { wall: "#56606f", panel: "#3d4a5c", floor: "#2b3242", trim: "#c9ced6", accent: "#f0b429", glow: "#fff1b0" },
    ochre: { wall: "#c9892b", panel: "#9a6418", floor: "#5b4636", trim: "#f3e6c8", accent: "#3d6fb6", glow: "#ffe9a0" },
    olive: { wall: "#7a8a3c", panel: "#5c6b2a", floor: "#5b4636", trim: "#f3e6c8", accent: "#e0262b", glow: "#fff1c0" },
    plum: { wall: "#7a3b6b", panel: "#5a2a50", floor: "#3b2a3e", trim: "#f3e6c8", accent: "#f0b429", glow: "#ffd9f0" },
  };
  // The look each set takes when the shot names no palette.
  const SET_PALETTE = { kitchen: "amber", boardroom: "wood", pitch_stage: "plum", night_office: "violet", bank: "ochre", supermarket: "mint", back_shop: "olive", desk_top: "wood",
    office: "blue", studio: "cream", trading_floor: "green", street: "blue", suburb: "green", server_room: "teal", lawn: "green", stage: "red", warehouse: "ochre", bus: "amber",
    night_city: "navy", farmers_market: "olive", car_lot: "slate", bottling_plant: "teal", living_room: "plum", corridor: "mint", design_studio: "pink", empty_hall: "slate",
    bedroom: "plum", red_carpet: "red", mall: "pink", stadium: "green", lab: "teal", scrapyard: "ochre", night_road: "navy", courtroom: "amber", stairwell: "slate", train_platform: "teal" };
  // The ambience bed each set declares (studio/tools/sounds.mjs, AMBIENCES); the mix lays it under the voice. A shot can name another with
  // "ambience": "street" (or "opts": { "ambience": ... }), or none with "ambience": false. Explainer grounds take the quietest bed (studio), so the music carries them.
  const SET_AMBIENCE = { kitchen: "room", boardroom: "office", pitch_stage: "studio", night_office: "office", bank: "room", supermarket: "shop", back_shop: "room", desk_top: "office",
    office: "office", studio: "studio", board: "studio", trading_floor: "crowd", street: "street", suburb: "outdoors", server_room: "machine", lawn: "outdoors", stage: "crowd",
    warehouse: "machine", bus: "street", night_city: "street", farmers_market: "market", car_lot: "street", bottling_plant: "machine", living_room: "room", corridor: "room",
    design_studio: "office", empty_hall: "room", bedroom: "night", red_carpet: "crowd", mall: "shop", stadium: "crowd", lab: "machine", scrapyard: "machine", night_road: "night",
    courtroom: "room", stairwell: "room", train_platform: "street", picture: "room", plain: "room",
    dark_stage: "studio", evidence_wall: "studio", timeline_road: "studio", map_table: "studio" };
  const mixHex = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b);
    return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  // The palette of a shot: its own, the set's default, then the night look (darker walls, the same lamps).
  function pal(o, def, night) {
    const P = Object.assign({}, PALETTES[o.palette] || PALETTES[def] || PALETTES.cream), N = "#141a3a";
    if (night) { P.wall = mixHex(P.wall, N, 0.55); P.panel = mixHex(P.panel, N, 0.55); P.floor = mixHex(P.floor, N, 0.5); P.trim = mixHex(P.trim, N, 0.45); }
    return P;
  }

  /* ---- Set dressing helpers: things on a back wall, a foreground the camera passes, one living detail. Cheap to write: x, y and a size. ---- */
  const D = {
    // a framed picture: a landscape, a portrait, a chart or an abstract print (no real art)
    frame(x, y, w, h, kind, P) { const t = P.trim; let inner = "";
      if (kind === "portrait") inner = `<circle cx="${x + w / 2}" cy="${y + h * 0.42}" r="${w * 0.18}" fill="#c9a36b"/><path d="M${x + w * 0.2},${y + h} Q${x + w / 2},${y + h * 0.5} ${x + w * 0.8},${y + h}Z" fill="${P.panel}"/>`;
      else if (kind === "chart") inner = `<path d="M${x + 14},${y + h - 16} L${x + w * 0.4},${y + h * 0.55} L${x + w * 0.6},${y + h * 0.7} L${x + w - 14},${y + 18}" fill="none" stroke="#1fa85b" stroke-width="6"/>`;
      else if (kind === "abstract") inner = `<circle cx="${x + w * 0.35}" cy="${y + h * 0.45}" r="${Math.min(w, h) * 0.22}" fill="${P.accent}"/>` + R(x + w * 0.45, y + h * 0.3, w * 0.4, h * 0.45, P.panel, 0, "");
      else inner = R(x, y + h * 0.55, w, h * 0.45, "#6fae7a", 0, "") + `<path d="M${x},${y + h * 0.62} L${x + w * 0.3},${y + h * 0.3} L${x + w * 0.55},${y + h * 0.58} L${x + w * 0.75},${y + h * 0.4} L${x + w},${y + h * 0.6}Z" fill="#8aa6c8"/>`;
      return cut(R(x - 10, y - 10, w + 20, h + 20, t, 4) + `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="hidden"><g transform="translate(${-x},${-y})">${R(x, y, w, h, "#dfe9ef", 0, "")}${inner}</g></svg>` + R(x, y, w, h, "none", 0, `stroke="${INK}" stroke-width="5"`)); },
    // a wall clock whose second hand moves (class secs)
    clock(x, y, r, P) { return cut(`<circle cx="${x}" cy="${y}" r="${r}" fill="${P.trim}" ${st}/><circle cx="${x}" cy="${y}" r="${r * 0.8}" fill="#fbf8ef"/>` + [0, 1, 2, 3].map((i) => `<path d="M${x},${y - r * 0.78} L${x},${y - r * 0.62}" stroke="${INK}" stroke-width="5" transform="rotate(${i * 90} ${x} ${y})"/>`).join("") +
      `<path d="M${x},${y} L${x},${y - r * 0.5} M${x},${y} L${x + r * 0.38},${y + 4}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`) + `<g class="secs" data-cx="${x}" data-cy="${y}"><path d="M${x},${y + r * 0.12} L${x},${y - r * 0.66}" stroke="#e0262b" stroke-width="3"/></g><circle cx="${x}" cy="${y}" r="5" fill="${INK}"/>`; },
    // a shelf with things on it (books, jars, boxes), seeded so it never changes
    shelf(x, y, w, P, seed) { const r = rng(seed || 3), cols = [P.accent, "#3d6fb6", "#b8473d", "#4f8f5b", "#c9892b", "#f3e6c8", P.panel]; let s = R(x, y, w, 16, P.trim, 4), cx = x + 12;
      while (cx < x + w - 40) { const k = r(), bw = k < 0.6 ? 16 + r() * 14 : 40 + r() * 30, bh = k < 0.6 ? 54 + r() * 34 : 30 + r() * 30, c = cols[Math.floor(r() * cols.length)];
        s += k < 0.85 ? R(f0(cx), f0(y - bh), f0(bw), f0(bh), c, k < 0.6 ? 3 : 8, `stroke="${INK}" stroke-width="4"`) : `<path d="M${f0(cx)},${y} Q${f0(cx + 6)},${y - 70} ${f0(cx + 30)},${y - 84} Q${f0(cx + 20)},${y - 40} ${f0(cx + 44)},${y}Z" fill="#3f9b5a" stroke="${INK}" stroke-width="4"/>`;
        cx += bw + 4 + r() * 10; }
      return cut(s); },
    // a potted plant on the floor
    plant(x, y, k, P) { k = k || 1; return cut(`<g transform="translate(${x},${y}) scale(${k})"><path d="M0,-90 Q-80,-220 -40,-300 Q-10,-200 0,-90 Q10,-250 70,-290 Q60,-180 0,-90 Q90,-170 120,-160 Q70,-100 0,-90Z" fill="#3f9b5a" ${st}/><path d="M0,-90 Q-30,-180 -60,-200 M0,-90 Q30,-190 50,-250" fill="none" stroke="#2c6b44" stroke-width="4"/>` +
      `<path d="M-56,-96 L56,-96 L42,0 L-42,0Z" fill="${P.accent}" ${st}/><path d="M-60,-96 L60,-96 L60,-74 L-60,-74Z" fill="${mixHex(P.accent, "#141a3a", 0.2)}" ${st}/></g>`); },
    // a run of cable along the wall (sags between clips)
    cable(x0, x1, y, P) { let d = `M${x0},${y}`; for (let x = x0; x < x1; x += 160) d += ` Q${x + 80},${y + 26} ${Math.min(x1, x + 160)},${y}`; return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: Math.floor((x1 - x0) / 160) + 1 }, (_, i) => R(x0 + i * 160 - 6, y - 8, 12, 16, P.trim, 3, `stroke="${INK}" stroke-width="3"`)).join(""); },
    // a window with a view: day sky with a cloud and roofs, or the night city with lit windows; something passes by (a bird, a car's lights)
    window(x, y, w, h, night, P, seed) { const r = rng(seed || 9), sky = night ? "#1b2347" : "#9fcfe6"; let v = R(x, y, w, h, sky, 0, "");
      if (!night) v += `<g class="cloud">${cloudShape(x + w * 0.15, y + h * 0.22, 0.6)}</g>`;
      for (let bx = x - 20; bx < x + w; bx += 60 + r() * 50) { const bh = h * (0.25 + r() * 0.35), bw = 50 + r() * 50; v += R(f0(bx), f0(y + h - bh), f0(bw), f0(bh), night ? "#2c3766" : "#8aa6c8", 0, `stroke="${INK}" stroke-width="3"`);
        if (night) for (let k = 0; k < 4; k++) if (r() > 0.4) v += R(f0(bx + 10 + (k % 2) * 22), f0(y + h - bh + 12 + Math.floor(k / 2) * 26), 12, 14, "#ffe14d", 0, ""); }
      v += night ? `<g class="pass"><circle cx="${x + w + 40}" cy="${y + h - 14}" r="5" fill="#fff1b0"/><circle cx="${x + w + 62}" cy="${y + h - 14}" r="5" fill="#fff1b0"/></g>` : `<g class="pass"><path d="M${x + w + 30},${y + h * 0.3} q8,-8 16,0 q8,-8 16,0" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
      return cut(R(x - 14, y - 14, w + 28, h + 28, P.trim, 6) + `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="hidden"><g transform="translate(${-x},${-y})">${v}</g></svg>` + R(x, y, w, h, "none", 0, `stroke="${INK}" stroke-width="6"`) + `<path d="M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}" stroke="${P.trim}" stroke-width="12"/>` + R(x - 24, y + h + 6, w + 48, 18, P.trim, 4)); },
    // a poster with blocks of colour and lines in place of words
    poster(x, y, w, h, P, tilt) { return cut(`<g transform="rotate(${tilt || 0} ${x + w / 2} ${y + h / 2})">${R(x, y, w, h, "#f6f1e4", 2)}${R(x + 12, y + 12, w - 24, h * 0.5, P.accent, 0, "")}<path d="M${x + 14},${y + h * 0.66} L${x + w - 14},${y + h * 0.66} M${x + 14},${y + h * 0.78} L${x + w * 0.7},${y + h * 0.78}" stroke="#9aa0b4" stroke-width="7"/></g>`) + `<circle cx="${x + w / 2}" cy="${y + 6}" r="5" fill="#e0262b" ${st} stroke-width="3"/>`; },
    // a wall lamp with its glow
    sconce(x, y, P, on) { return cut(R(x - 10, y, 20, 40, P.trim, 4) + `<path d="M${x - 34},${y - 10} L${x + 34},${y - 10} L${x + 22},${y - 50} L${x - 22},${y - 50}Z" fill="${P.accent}" ${st} stroke-width="5"/>`) + (on ? halo(x, y - 30, 120, P.glow, 0.28) : ""); },
    // an air vent, a light switch, a socket: the small things that make a wall look lived in
    vent(x, y) { return cut(R(x, y, 120, 60, "#c9ced6", 4) + [0, 1, 2, 3].map((i) => `<path d="M${x + 12},${y + 12 + i * 12} L${x + 108},${y + 12 + i * 12}" stroke="${INK}" stroke-width="3"/>`).join("")); },
    switch(x, y) { return cut(R(x, y, 34, 50, "#f6f1e4", 4) + R(x + 12, y + 14, 10, 20, "#c9ced6", 2, `stroke="${INK}" stroke-width="3"`)); },
    // steam rising from a cup or a pan (class steam: rises and fades, again and again)
    steam(x, y) { return [0, 1, 2].map((i) => `<path class="steam" d="M${x - 14 + i * 14},${y} q-10,-18 0,-36 q10,-18 0,-36" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`).join(""); },
    // a mug with steam
    mug(x, y, P) { return cut(R(x - 26, y - 56, 52, 56, P.accent, 8) + `<path d="M${x + 26},${y - 44} Q${x + 50},${y - 42} ${x + 48},${y - 24} Q${x + 46},${y - 10} ${x + 26},${y - 12}" fill="none" ${st} stroke-width="6"/>`) + D.steam(x, y - 64); },
    // foreground pieces at the edge of the frame (class fg: they drift a little faster than the room, so the room has depth)
    fgPlant(x, y, k) { return `<g class="fg">${cut(`<g transform="translate(${x},${y}) scale(${k || 1.6})"><path d="M0,0 Q-40,-160 40,-260 Q30,-120 0,0 Q50,-180 150,-210 Q90,-90 0,0 Q-120,-110 -150,-120 Q-60,-30 0,0Z" fill="#2c6b44" ${st}/><path d="M0,0 Q20,-120 40,-200 M0,0 Q70,-110 120,-170" fill="none" stroke="#1f4f33" stroke-width="5"/></g>`)}</g>`; },
    fgEdge(y, P, h) { return `<g class="fg">${cut(R(-40, y, 2000, h || 200, P.panel, 0) + `<path d="M-40,${y} L1960,${y}" stroke="${INK}" stroke-width="9"/>` + R(-40, y + 14, 2000, 12, mixHex(P.panel, "#ffffff", 0.18), 0, ""))}</g>`; },
    fgRail(y, P) { let s = `<path d="M-40,${y} L1960,${y}" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M-40,${y} L1960,${y}" stroke="${P.trim}" stroke-width="14"/>`; for (let x = 60; x < 1920; x += 240) s += R(x, y, 18, 1080 - y, P.trim, 4); return `<g class="fg">${cut(s)}</g>`; },
    fgCamera(x, y) { return `<g class="fg">${cut(`<g transform="translate(${x},${y})"><path d="M-60,0 L-140,320 M60,0 L140,320 M0,0 L0,330" stroke="${INK}" stroke-width="16"/>${R(-130, -170, 260, 150, "#3d4a5c", 18)}${R(120, -140, 90, 90, "#2b3242", 10)}<circle cx="165" cy="-95" r="30" fill="#1b2142" ${st}/>${R(-110, -150, 70, 30, "#2b3242", 6)}<circle class="tick" cx="-90" cy="-186" r="10" fill="#e0262b" ${st} stroke-width="4"/></g>`)}</g>`; },
  };
  const f0 = (v) => Math.round(v);
  const cloudShape = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k || 1})"><path d="M0,40 Q-6,6 34,8 Q48,-26 92,-10 Q130,-34 160,2 Q204,0 200,40Z" fill="#fff" ${st}/></g>`;
  // A palette wash over a set that does not take palette colours itself: the dominant hue goes on the whole back layer.
  const wash = (P, night) => `<rect x="-200" y="-200" width="2320" height="1480" fill="${P.wall}" style="mix-blend-mode:color" opacity="${night ? 0.55 : 0.45}"/>` + `<rect x="-200" y="-200" width="2320" height="1480" fill="${P.wall}" style="mix-blend-mode:multiply" opacity="${night ? 0.18 : 0.12}"/>`;

  const SETS = {
    plain(o) { return { back: R(0, 0, 1920, 1080, o.color || "#efe6d0", 0, "") }; },

    // A painted picture as the whole background: { src: "art/tent.jpg", shows: "who does what", living: "chip", dim: 0.2 }.
    // The file sits in the episode folder; the build copies it and fills in `href`. No text inside the picture: signs, tags and counters are drawn over it.
    picture(o) { const href = String(o.href || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return { back: R(0, 0, 1920, 1080, o.color || "#101226", 0, "") +
        (href ? `<image href="${href}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/>` : T(960, 560, "PICTURE MISSING: " + (o.src || "no src"), 56, "#fff")) +
        (o.dim ? R(0, 0, 1920, 1080, `rgba(11,13,30,${+o.dim})`, 0, "") : "") }; },

    studio(o) {
      const wall = o.wall || "#e9dfc8", floor = o.floor || "#cbb894"; let s = R(0, 0, 1920, 820, wall, 0, "");
      for (let x = 240; x < 1920; x += 240) s += `<path d="M${x},0 L${x},820" stroke="rgba(27,29,54,.08)" stroke-width="6"/>`;
      s += `<ellipse cx="960" cy="520" rx="780" ry="420" fill="rgba(255,255,255,.28)"/>` + R(0, 820, 1920, 260, floor, 0, "") + `<path d="M0,820 L1920,820" ${st}/>`;
      return { back: s };
    },

    board(o) {
      let s = R(0, 0, 1920, 1080, "#f6f1e4", 0, "");
      for (let x = 60; x < 1920; x += 60) s += `<path d="M${x},0 L${x},1080" stroke="rgba(31,138,138,.16)" stroke-width="3"/>`;
      for (let y = 60; y < 1080; y += 60) s += `<path d="M0,${y} L1920,${y}" stroke="rgba(31,138,138,.16)" stroke-width="3"/>`;
      if (o.title) s += T(200, 190, o.title, 84, INK, "start");
      return { back: s };
    },

    office(o) {
      const r = rng(7); let b = R(0, 0, 1920, 830, o.wall || "#e6ddc6", 0, "") + R(0, 830, 1920, 250, "#b99f7c", 0, "") + `<path d="M0,830 L1920,830" ${st}/>`;
      b += cut(R(1140, 130, 600, 430, "#bfe0ea", 8) + `<g clip-path="inset(0)">${skyline(1150, 1730, 556, r, ["#7f9fc0", "#9db7d1", "#6c88ab"])}</g>` + cloud(1230, 190, 0.7) +
        `<path d="M1440,130 L1440,560 M1140,345 L1740,345" ${st}/>` + R(1120, 556, 640, 26, "#f6f1e4", 6));
      if (o.poster !== false) b += cut(  // poster:false when a document card would cover it
        `<g transform="rotate(-3 330 300)">${R(210, 190, 250, 300, "#f6f1e4", 0)}${T(335, 300, o.poster || "DO WHAT", 54)}${T(335, 366, o.poster2 || "YOU LOVE", 54)}<path d="M250,410 L420,410" stroke="#e0262b" stroke-width="12"/></g>`);
      b += `<path d="M700,0 L700,120" ${st}/>` + cut(`<path d="M620,190 Q700,90 780,190Z" fill="#e8a317" ${st}/>`) + plant(150, 830);
      const f = cut(R(880, 720, 960, 44, "#8a5a3c", 8) + R(910, 764, 900, 316, "#a5714d", 0) + `<path d="M1360,764 L1360,1080" ${st}/>`) + monitor(980, 508, 330, o.screen) +
        cut(R(1420, 664, 60, 58, "#f6f1e4", 8) + `<path d="M1480,676 Q1510,680 1506,700 Q1502,716 1480,712" fill="none" ${st}/>`) + cut(R(1560, 696, 200, 24, INK, 8, ""));
      return { back: b, front: o.desk === false ? "" : f };
    },

    trading_floor(o) {
      const up = o.mood !== "red", r = rng(up ? 11 : 23), cg = "#46e08a", cr = "#ff5a4f";
      let b = R(0, 0, 1920, 1080, "#1c2340", 0, "") + R(70, 60, 1780, 400, "#101528", 10);
      for (let i = 0; i < 24; i++) { const x = 100 + (i % 8) * 218, y = 96 + Math.floor(i / 8) * 122, good = r() < (up ? 0.85 : 0.12), col = good ? cg : cr;
        b += `<g class="tick" data-layout-ignore>${T(x, y + 40, ticker(r), 36, "#c9cfe6", "start", 'font-family="IBM Plex Mono" font-weight="700"')}` +
          `${T(x, y + 86, (good ? "▲ " : "▼ ") + (20 + r() * 180).toFixed(1), 34, col, "start", 'font-family="IBM Plex Mono" font-weight="700"')}</g>`; }
      b += R(0, 700, 1920, 380, "#2a3152", 0, "") + `<path d="M0,700 L1920,700" ${st}/>`;
      for (let i = 0; i < 26; i++) { const x = 40 + i * 72 + r() * 20, y = 610 + (i % 2) * 34, c = Rig.extra(i * 3 + 1);
        b += `<g>${R(x, y, 62, 56, c.skin, 20, `stroke="${INK}" stroke-width="5"`)}<path d="M${x},${y + 18} Q${x + 31},${y - 16} ${x + 62},${y + 18}Z" fill="${c.hair}" stroke="${INK}" stroke-width="5"/>${R(x - 6, y + 52, 74, 60, c.top, 12, `stroke="${INK}" stroke-width="5"`)}</g>`; }
      for (let i = 0; i < 4; i++) b += cut(R(60 + i * 480, 742, 400, 30, "#5b4636", 6) + R(80 + i * 480, 772, 360, 150, "#4a3a2e", 0)) + monitor(110 + i * 480, 640, 150, up ? "green" : "red") + monitor(290 + i * 480, 650, 130, r() > 0.5 ? "green" : (up ? "green" : "red"));
      let fx = "";
      for (let i = 0; i < 46; i++) { const x = r() * 1920, y = r() * 900 - 200, c = o.party ? ["#e8a317", "#e0262b", "#46e08a", "#7fd0f0", "#f6f1e4"][i % 5] : "#f6f1e4";
        fx += `<rect class="bit" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${o.party ? 14 : 44}" height="${o.party ? 26 : 56}" fill="${c}" stroke="${INK}" stroke-width="${o.party ? 0 : 4}" transform="rotate(${(r() * 80 - 40).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
      return { back: b, front: (o.party || o.papers) ? `<g class="fx">${fx}</g>` : "" };
    },

    kitchen(o) {
      const night = !!o.night, P = pal(o, SET_PALETTE.kitchen, night); let b = R(0, 0, 1920, 1080, P.wall, 0, "");
      for (let x = 0; x < 1920; x += 96) b += `<path d="M${x},0 L${x},640" stroke="rgba(27,29,54,.10)" stroke-width="4"/>`;
      for (let y = 0; y < 640; y += 96) b += `<path d="M0,${y} L1920,${y}" stroke="rgba(27,29,54,.10)" stroke-width="4"/>`;
      const sky = night ? "#1f2a44" : "#bfe0ea";
      let win = R(900, 150, 560, 330, sky, 8);
      if (o.window === "datacenter") { win += R(980, 300, 400, 180, "#56606f", 0); for (let i = 0; i < 12; i++) win += R(1004 + (i % 6) * 62, 326 + Math.floor(i / 6) * 62, 38, 30, night ? "#ffe14d" : "#bfe0ea", 0, `stroke="${INK}" stroke-width="4"`);
        win += `<path d="M900,300 L980,300 M1380,300 L1460,300" stroke="${INK}" stroke-width="5"/>`; }
      else win += `<circle cx="1360" cy="230" r="34" fill="${night ? "#f6f1e4" : "#ffe14d"}" ${st}/>` + `<path d="M900,440 Q1040,380 1180,430 Q1320,400 1460,440 L1460,480 L900,480Z" fill="#3f9b5a" ${st}/>`;
      b += cut(win + `<path d="M1180,150 L1180,480" ${st}/>` + R(880, 476, 600, 24, "#f6f1e4", 6));
      b += cut(R(0, 640, 1920, 40, "#f6f1e4", 0) + R(0, 680, 1920, 400, P.panel, 0));
      for (let x = 480; x < 1920; x += 320) b += `<path d="M${x},680 L${x},1080" ${st}/>` + R(x + 130, 760, 60, 14, INK, 7, "");
      b += cut(R(130, 200, 300, 880, "#f6f1e4", 18) + `<path d="M130,520 L430,520" ${st}/>` + R(390, 300, 16, 120, INK, 8, "") + R(390, 580, 16, 160, INK, 8, "") +
        `<g transform="rotate(4 270 330)">${R(210, 250, 120, 150, "#fff", 0)}<path d="M228,286 L310,286 M228,312 L290,312" stroke="#9aa0b4" stroke-width="6"/>${R(228, 344, 84, 30, "#e0262b", 0, "")}</g><circle cx="270" cy="244" r="12" fill="#e8a317" ${st}/>`);
      b += cut(`<path d="M1600,640 L1600,590 Q1650,560 1700,590 L1700,640Z" fill="#e0262b" ${st}/><path d="M1700,600 Q1740,600 1736,626" fill="none" ${st}/>`);
      const f = cut(R(0, 930, 1920, 40, "#c9a36b", 0) + R(0, 970, 1920, 110, "#a5814d", 0)) +
        cut(`<g transform="rotate(-5 620 930)">${R(520, 880, 200, 64, "#fff", 0)}<path d="M544,904 L690,904" stroke="#9aa0b4" stroke-width="6"/>${R(544, 918, 80, 16, "#e0262b", 0, "")}</g>`);
      if (o.dress === "martha") b += (night ? R(0, 0, 1920, 1080, "rgba(10,12,34,.45)", 0, "") : "") + cut(R(740, 590, 600, 40, "#c99a5b", 6) + R(770, 630, 540, 26, "#e0262b", 0, "") + R(790, 656, 22, 250, "#a5714d", 0) + R(1268, 656, 22, 250, "#a5714d", 0)) + hang(1040, 0, 360, true, "#ffe0a0") + pool(1040, 940, 460, 40, "#ffe0a0", 0.22);
      if (o.fridge === "open") b += R(0, 0, 1920, 1080, "rgba(10,12,34,.62)", 0, "") + `<path d="M430,260 L1100,640 L1250,1080 L430,1080Z" fill="#fff6cf" opacity=".2"/>` + halo(300, 640, 520, "#fff6cf", 0.25) + cut(R(130, 200, 300, 880, "#fff6cf", 18) + [0, 1, 2, 3].map((i) => R(150, 340 + i * 170, 260, 12, "#c9ced6", 2)).join("") + R(170, 250, 80, 90, "#f08a7a", 10) + R(280, 270, 100, 70, "#9fd8a8", 8) + R(180, 430, 120, 100, "#7fd0f0", 10) + R(320, 450, 70, 80, "#f0c470", 8) + R(190, 600, 200, 90, "#f6f1e4", 10)) + `<path d="M130,200 L20,240 L20,1040 L130,1080Z" fill="#f6f1e4" ${st}/>`;
      return { back: b, front: o.table === false ? "" : f };
    },

    street(o) {
      const dusk = o.time === "dusk", r = rng(31), signs = o.signs || ["BANK", "CAFE", "PHARMACY", "BAKERY"], cols = ["#c9705a", "#e9dfc8", "#1f8a8a", "#e8a317", "#9db7d1"];
      let b = R(0, 0, 1920, 820, dusk ? "#f3b27a" : "#bfe0ea", 0, "") + `<circle cx="${dusk ? 1560 : 1640}" cy="${dusk ? 300 : 150}" r="76" fill="${dusk ? "#ff7a4f" : "#ffe14d"}" ${st}/>` + cloud(240, 120) + cloud(980, 80, 0.8);
      const w = 1920 / signs.length;
      signs.forEach((sg, i) => { const x = i * w + 14, top = 230 + (i % 2) * 70, c = cols[i % cols.length]; let s = R(x, top, w - 28, 600, c, 0);
        for (let wy = top + 40; wy < 500; wy += 110) for (let wx = x + 44; wx < x + w - 110; wx += 120) s += R(wx, wy, 70, 76, "#dff0f4", 4);
        s += R(x + 26, 520, w - 80, 76, "#f6f1e4", 6) + T(x + w / 2 - 14, 578, sg, 56) + R(x + 60, 640, 120, 190, "#5b4636", 6) + R(x + 220, 640, w - 330, 130, "#dff0f4", 4) +
          `<path d="M${x + 26},610 L${x + w - 54},610 L${x + w - 30},640 L${x + 2},640Z" fill="${i % 2 ? "#e0262b" : "#f6f1e4"}" ${st}/>`;
        b += cut(s); });
      b += R(0, 820, 1920, 90, "#d9cfb8", 0, "") + `<path d="M0,820 L1920,820 M0,910 L1920,910" ${st}/>` + R(0, 910, 1920, 170, "#4a4f66", 0, "");
      for (let x = 60; x < 1920; x += 260) b += R(x, 986, 150, 16, "#f6f1e4", 0, "");
      void r;
      const f = cut(R(1586, 250, 22, 640, INK, 0, "") + `<path d="M1597,250 Q1597,190 1680,190" fill="none" ${st} stroke-width="14"/>` + R(1650, 180, 90, 40, "#ffe14d", 12)) +
        cut(R(1770, 800, 90, 110, "#3d6fb6", 12) + R(1784, 826, 62, 12, INK, 6, ""));
      return { back: b, front: f };
    },

    // A street of houses with a fence: the household, the neighbourhood, an analogy that happens at home. { night }
    suburb(o) {
      const n = !!o.night, r = rng(83), cols = ["#e9dfc8", "#d9b99b", "#cfe3df", "#e6c9c0"], roofs = ["#c9705a", "#7a5a4a", "#3d6fb6", "#8a5a3c"];
      let b = R(0, 0, 1920, 760, n ? "#1f2a44" : "#bfe0ea", 0, "") + `<circle cx="1620" cy="150" r="70" fill="${n ? "#f6f1e4" : "#ffe14d"}" ${st}/>` + (n ? "" : cloud(200, 110) + cloud(900, 70, 0.8));
      for (let i = 0; i < 4; i++) { const x = 60 + i * 470, w = 330 + r() * 40, h = 250 + (i % 2) * 50, top = 700 - h, lit = n ? (r() > 0.4 ? "#ffe14d" : "#2c3766") : "#dff0f4";
        b += cut(R(x, top, w, h + 10, cols[i], 0) + `<path d="M${x - 34},${top} L${x + w / 2},${top - 150} L${x + w + 34},${top}Z" fill="${roofs[i]}" ${st}/>` +
          R(x + 40, top + 50, 80, 80, lit, 4) + R(x + w - 120, top + 50, 80, 80, n ? "#ffe14d" : "#dff0f4", 4) + R(x + w / 2 - 38, top + h - 130, 76, 140, "#8a5a3c", 6));
        b += cut(R(x + w + 54, 560, 22, 150, "#8a5a3c", 0) + `<circle cx="${x + w + 65}" cy="520" r="74" fill="${n ? "#2f6f4a" : "#3f9b5a"}" ${st}/>`); }
      b += R(0, 700, 1920, 150, n ? "#3f7f52" : "#7fbf6a", 0, "") + `<path d="M0,700 L1920,700" ${st}/>`;
      let fence = ""; for (let x = 10; x < 1920; x += 58) fence += `<path d="M${x},800 L${x},720 L${x + 20},696 L${x + 40},720 L${x + 40},800Z" fill="#f6f1e4" ${st}/>`;
      b += cut(fence + R(0, 742, 1920, 16, "#f6f1e4", 0)) + R(0, 850, 1920, 110, "#d9cfb8", 0, "") + `<path d="M0,850 L1920,850 M0,960 L1920,960" ${st}/>` + R(0, 960, 1920, 120, "#4a4f66", 0, "");
      return { back: b };
    },

    // Rows of server racks running away from the camera: the data center, "the cloud", where the money is being spent.
    server_room(o) {
      const r = rng(41); let b = R(0, 0, 1920, 1080, "#0f1326", 0, "") + `<path d="M0,1080 L1920,1080 L1180,640 L740,640Z" fill="#232c54" ${st}/><path d="M960,640 L960,1080" stroke="rgba(246,241,228,.12)" stroke-width="10"/>`;
      b += R(800, 330, 320, 312, "#141a36", 0) + R(846, 380, 228, 262, "#ffe14d", 6) + `<ellipse cx="960" cy="560" rx="330" ry="250" fill="rgba(255,225,77,.13)"/>`;
      for (let i = 3; i >= 0; i--) for (const side of [0, 1]) { const w = 300 - i * 52, x = side ? 1920 - i * 196 - w : i * 196, top = 70 + i * 86, bot = 1010 - i * 100, h = bot - top; let rack = R(x, top, w, h, i % 2 ? "#232c54" : "#1c2340", 8);
        for (let y = top + 22; y < bot - 40; y += 44 - i * 5) { rack += R(x + 16, y, w - 32, 24 - i * 3, "#101528", 4, "");
          for (let k = 0; k < 4; k++) if (r() > 0.25) rack += `<circle class="tick" cx="${x + 34 + k * (22 - i * 3)}" cy="${y + 12 - i * 1.5}" r="${6 - i}" fill="${r() > 0.3 ? "#46e08a" : r() > 0.5 ? "#ffe14d" : "#7fd0f0"}"/>`; }
        b += rack; }
      for (let i = 0; i < 5; i++) { const x = 380 + i * 290; b += `<path d="M${x},0 Q${x + 40},${120 + (i % 2) * 60} ${x + 110},0" fill="none" stroke="${["#3d6fb6", "#f0b429", "#3d6fb6", "#e0262b", "#f0b429"][i]}" stroke-width="9"/>`; }
      return { back: b };
    },

    // An open lawn under a big sky: put a living building on it (a "dome", a "bank", a "tower") and let it act.
    lawn(o) {
      const dusk = o.time === "dusk"; let b = R(0, 0, 1920, 660, dusk ? "#f3b27a" : "#bfe0ea", 0, "") + `<circle cx="1660" cy="150" r="72" fill="${dusk ? "#ff7a4f" : "#ffe14d"}" ${st}/>` + cloud(160, 120) + cloud(1100, 70, 0.8);
      const r = rng(19); for (let x = -40; x < 1960; x += 150) b += `<circle cx="${x + r() * 40}" cy="${640 - r() * 26}" r="${70 + r() * 40}" fill="#3f9b5a" ${st}/>`;
      b += R(0, 650, 1920, 430, "#7fbf6a", 0, "") + `<path d="M0,650 L1920,650" ${st}/><path d="M760,1080 L1160,1080 L1040,650 L880,650Z" fill="#e9dfc8" ${st}/>`;
      return { back: b };
    },

    // A theatre stage with a curtain and a spotlight: a reveal, a winner, a company showing off. { color }
    stage(o) {
      const c = o.color || "#7a2a4f"; let b = R(0, 0, 1920, 860, c, 0, "");
      for (let x = 60; x < 1920; x += 120) b += `<path d="M${x},0 Q${x + 26},430 ${x},860" fill="none" stroke="rgba(15,18,40,.28)" stroke-width="16"/>`;
      b += `<path d="M700,0 L1220,0 L1420,860 L500,860Z" fill="rgba(255,240,190,.20)"/>`;
      let val = ""; for (let x = -20; x < 1920; x += 240) val += `<path d="M${x},0 L${x + 240},0 L${x + 240},110 Q${x + 120},210 ${x},110Z" fill="${Rig.shade(c, 0.25)}" ${st}/>`;
      b += cut(val) + R(0, 860, 1920, 220, "#8a5a3c", 0, "") + `<path d="M0,860 L1920,860" ${st}/>` + `<ellipse cx="960" cy="940" rx="520" ry="70" fill="rgba(255,240,190,.22)"/>`;
      for (let x = 160; x < 1920; x += 320) b += `<path d="M${x},860 L${x - 40},1080" stroke="rgba(27,29,54,.22)" stroke-width="6"/>`;
      return { back: b };
    },

    // Shelves of parcels and a conveyor: a marketplace, logistics, "where your order goes".
    warehouse(o) {
      const r = rng(67), kraft = ["#d2a56d", "#c99a5b", "#e0b983", "#b9844a"]; let b = R(0, 0, 1920, 860, "#d8d0bc", 0, "") + R(0, 860, 1920, 220, "#a59f8f", 0, "") + `<path d="M0,860 L1920,860" ${st}/>`;
      for (let u = 0; u < 3; u++) { const x = 70 + u * 620; let sh = R(x, 150, 540, 660, "#8f9bb0", 0);
        for (let lv = 0; lv < 3; lv++) { const y = 150 + lv * 220; sh += R(x, y + 196, 540, 24, "#56606f", 0); let bx = x + 18;
          while (bx < x + 460) { const w = 70 + r() * 80, h = 80 + r() * 100; sh += R(bx, y + 196 - h, w, h, kraft[Math.floor(r() * 4)], 4, `stroke="${INK}" stroke-width="5"`) + R(bx + w / 2 - 9, y + 196 - h, 18, h * 0.35, "rgba(27,29,54,.18)", 0, ""); bx += w + 10; } }
        b += cut(sh); }
      for (let i = 0; i < 3; i++) b += `<path d="M${330 + i * 620},0 L${330 + i * 620},70" ${st}/>` + `<path d="M${270 + i * 620},130 Q${330 + i * 620},50 ${390 + i * 620},130Z" fill="#f0b429" ${st}/>`;
      let belt = R(0, 946, 1920, 54, "#3d4a5c", 0); for (let x = 30; x < 1920; x += 90) belt += `<circle cx="${x}" cy="1016" r="20" fill="#c9ced6" ${st}/>`;
      if (o.night) b += R(0, 0, 1920, 1080, "rgba(10,12,34,.6)", 0, "") + `<path d="M130,700 L1200,500 L1200,940 L130,730Z" fill="#fff1b0" opacity=".2"/>` + halo(130, 715, 170, "#fff1b0", 0.35) + cut(R(160, 640, 280, 200, "#e8a317", 10) + R(230, 540, 16, 110, "#56606f", 4) + R(150, 830, 300, 30, "#3d4a5c", 8) + `<circle cx="190" cy="870" r="30" fill="${INK}"/><circle cx="400" cy="870" r="30" fill="${INK}"/>`) + R(120, 700, 40, 30, "#fff1b0", 4);
      return { back: b, front: o.belt === false ? "" : cut(belt) };
    },

    // Inside a city bus: windows with the street going by, seats, straps, an ad panel. { night, ad }
    bus(o) {
      const night = !!o.night, r = rng(91), wall = night ? "#2a3152" : "#b9c7cf", rail = night ? "#3d4a5c" : "#d9dfe3", seat = night ? "#2a4a7a" : "#3d6fb6", seat2 = night ? "#223c66" : "#2f5a98";
      let b = R(0, 0, 1920, 1080, wall, 0, "");
      b += `<g class="pass">${R(-100, 100, 5000, 400, night ? "#141a36" : "#bfe0ea", 0, "")}${skyline(-100, 4900, 440, r, night ? ["#232c54", "#2c3766", "#1c2340"] : ["#7f9fc0", "#9db7d1", "#6c88ab"], night)}${R(-100, 430, 5000, 70, "#4a4f60", 0, "")}`;
      for (let x = 0; x < 4900; x += 160) b += night ? `<circle cx="${x}" cy="${380 + (x / 160 % 3) * 20}" r="9" fill="#ffe14d"/>` : R(x, 462, 70, 8, "#f6f1e4", 4, "");
      b += `</g>`;
      const wins = [[70, 450], [580, 450], [1430, 420]], ad = [1090, 280];
      b += R(0, 0, 1920, 110, rail, 0, "") + R(0, 110, 70, 400, wall, 0, "") + R(520, 110, 60, 400, wall, 0, "") + R(1030, 110, 400, 400, wall, 0, "") + R(1850, 110, 70, 400, wall, 0, "") + R(0, 490, 1920, 90, night ? "#232a47" : "#9fb0ba", 0, "");
      b += cut(wins.map((w) => R(w[0], 110, w[1], 380, "none", 14)).join("") + wins.map((w) => `<path d="M${w[0] + 60},${490} L${w[0] + 180},110 M${w[0] + 120},490 L${w[0] + 200},110" stroke="rgba(255,255,255,${night ? 0.1 : 0.28})" stroke-width="22"/>`).join(""));
      b += cut(R(ad[0], 130, ad[1], 340, "#ffe14d", 8) + T(ad[0] + ad[1] / 2, 280, o.ad || "SALE", 110, "#e0262b") + T(ad[0] + ad[1] / 2, 360, "TODAY ONLY", 40) + R(ad[0] + 40, 395, ad[1] - 80, 18, "#e0262b", 6, ""));
      b += `<path d="M0,64 L1920,64" ${st} stroke-width="12"/>`;
      for (let i = 0; i < 9; i++) { const x = 130 + i * 215; b += `<g class="sway"><path d="M${x},66 L${x},130" ${st}/><circle cx="${x}" cy="156" r="28" fill="none" stroke="#e8a317" stroke-width="12"/><circle cx="${x}" cy="156" r="28" fill="none" stroke="${INK}" stroke-width="3"/></g>`; }
      for (let i = 0; i < 4; i++) { const sx = 90 + i * 460; b += cut(R(sx, 590, 400, 230, seat, 40) + R(sx - 10, 790, 420, 70, seat2, 24)); }
      b += R(0, 850, 1920, 230, night ? "#3b3a44" : "#7a7480", 0) + `<path d="M0,900 L1920,900" stroke="#e8a317" stroke-width="10"/>`;
      for (const x of [545, 1395]) b += cut(R(x - 11, 64, 22, 790, "#e8a317", 8));
      if (night) b += R(0, 0, 1920, 1080, "rgba(10,14,40,.28)", 0, "");
      return { back: b };
    },

    // A long meeting table under a hanging lamp, wood panels and a wall calendar. { night, doors:[labels], month, tableFront }
    boardroom(o) {
      const night = !!o.night, P = pal(o, SET_PALETTE.boardroom, false), doors = (o.doors || []).slice(0, 3); let b = (o.glass ? glassWall(night) : R(0, 0, 1920, 800, P.wall, 0, "")) + R(0, 800, 1920, 280, P.floor, 0, "");
      for (let x = 0; x < 1920; x += o.glass ? 480 : 160) b += `<path d="M${x},0 L${x},800" stroke="rgba(27,29,54,${o.glass ? 0.6 : 0.22})" stroke-width="${o.glass ? 12 : 6}"/>`;
      b += `<path d="M0,560 L1920,560" stroke="rgba(27,29,54,.35)" stroke-width="10"/>` + `<path d="M0,800 L1920,800" ${st}/>`;
      if (!o.glass) b += cut(R(150, 150, 170, 200, "#f6f1e4", 6) + R(150, 150, 170, 52, "#e0262b", 6)) + T(235, 190, o.month || "NOV", 36, "#f6f1e4");
      if (!o.glass) for (let i = 0; i < 15; i++) b += R(162 + (i % 5) * 31, 218 + Math.floor(i / 5) * 40, 24, 30, i === 11 ? "#e0262b" : "rgba(27,29,54,.16)", 3, "");
      const dx = doors.length === 1 ? [960] : doors.length === 2 ? [700, 1220] : [480, 960, 1440], dw = 230;
      doors.forEach((d, i) => { const x = dx[i]; b += cut(R(x - dw / 2, 380, dw, 420, "#6f452c", 6) + R(x - dw / 2 + 24, 412, dw - 48, 150, "rgba(27,29,54,.18)", 4, "") + R(x - dw / 2 + 24, 600, dw - 48, 150, "rgba(27,29,54,.18)", 4, "") + `<circle cx="${x + dw / 2 - 30}" cy="610" r="12" fill="#f0b429" ${st}/>`) +
        cut(R(x - dw / 2, 304, dw, 56, "#f6f1e4", 6)) + T(x, 304 + 38, d, Math.min(36, (dw - 24) / (Math.max(4, String(d).length) * 0.6))); });
      for (const cx of [300, 720, 1200, 1620]) b += cut(R(cx - 70, 700, 140, 150, "#2f4a6f", 28));
      const table = cut(`<path d="M170,810 L1750,810 L1850,880 L70,880Z" fill="#c99a5b" ${st}/>` + R(70, 880, 1780, 44, "#8a5a3c", 6)) + `<ellipse cx="960" cy="960" rx="900" ry="34" fill="rgba(27,29,54,.18)"/>`;
      if (!o.tableFront) b += table;
      b += `<path d="M960,0 L960,180" ${st}/>`;
      if (night) b += R(0, 0, 1920, 1080, "rgba(10,12,34,.55)", 0, "");
      b += `<path d="M900,262 L1020,262 L${night ? 1340 : 1260},800 L${night ? 580 : 660},800Z" fill="rgba(255,240,190,${night ? 0.26 : 0.14})"/>` + cut(`<path d="M870,260 L1050,260 L1010,180 L910,180Z" fill="#e8a317" ${st}/>`) + `<ellipse cx="960" cy="266" rx="46" ry="14" fill="#fff6c8"/>`;
      if (night) doors.forEach((d, i) => { b += R(dx[i] - dw / 2 + 6, 786, dw - 12, 10, "#ffe14d", 0, ""); });
      return { back: b, front: o.tableFront ? table : "" };
    },

    night_city(o) {
      const r = rng(57); let b = R(0, 0, 1920, 1080, "#141a36", 0, "") + `<circle cx="1560" cy="190" r="70" fill="#f6f1e4" ${st}/><circle cx="1590" cy="170" r="60" fill="#141a36"/>`;
      for (let i = 0; i < 40; i++) b += `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(2 + r() * 3).toFixed(1)}" fill="#f6f1e4"/>`;
      b += skyline(-20, 1940, 830, r, ["#232c54", "#2c3766", "#1c2340"], true) + R(0, 826, 1920, 254, "#0f1326", 0, "") + `<path d="M0,826 L1920,826" ${st}/>`;
      if (o.towers) b += [[90, 380], [1450, 380]].map(([x, w]) => { let wn = ""; for (let y = 230; y < 800; y += 70) for (let i = 0; i < 5; i++) wn += R(x + 30 + i * 68, y, 34, 42, y > 560 ? "#ffe9b0" : "#44538f", 3, `stroke="${INK}" stroke-width="4"`);
        return cut(R(x, 170, w, 660, "#2c3766", 6) + wn + R(x, 700, w, 130, "rgba(255,224,160,.30)", 0, "") + R(x, 560, w, 140, "rgba(255,224,160,.16)", 0, "") + R(x, 430, w, 130, "rgba(255,224,160,.07)", 0, "")) + pool(x + w / 2, 836, 330, 30, "#ffe9b0", 0.3); }).join("");
      return { back: b };
    },

    // ---- the soda episode, batch 1 ----
    // A TV pitch stage. view: table | chairs | desk | seats | rafters | wings. night: the house is dark and one hard spotlight does the work.
    // lit_chair: 0-4 (the one lit chair); empty: true clears the audience and dims the table.
    pitch_stage(o) {
      const n = o.night !== false, v = o.view || "table", r = rng(31), P = pal(o, SET_PALETTE.pitch_stage, n), wall = P.wall, floor = P.floor, warm = "#fff0b8", lc = o.lit_chair, a = o.empty ? 0.12 : 0.22;
      const xs = v === "desk" ? [420, 760, 1030, 1300, 1640] : [380, 670, 960, 1250, 1540], ys = v === "desk" ? [980, 970, 960, 970, 980] : [940, 920, 910, 920, 940];
      const rig = (y0) => { let s = R(0, y0, 1920, 30, "#3d4a5c", 0) + R(0, y0 + 56, 1920, 20, "#3d4a5c", 0);
        for (let x = 40; x < 1920; x += 90) s += `<path d="M${x},${y0 + 30} L${x + 45},${y0 + 56} L${x + 90},${y0 + 30}" fill="none" ${st} stroke-width="5"/>`;
        for (let i = 0; i < 8; i++) s += `<g transform="translate(${150 + i * 230},${y0 + 76})">${R(-24, 0, 48, 58, "#56606f", 10)}${R(-32, 50, 64, 24, n && i === 3 ? warm : "#8d8a7e", 8)}</g>`; return cut(s); };
      let b = R(0, 0, 1920, 1080, wall, 0, ""), f = "";
      if (v === "rafters") {  // from above: the lit table is a small disc far below, a catwalk across the middle and one near the bottom
        b = R(0, 0, 1920, 1080, n ? "#0f1430" : "#2c2646", 0, "") + `<ellipse cx="960" cy="470" rx="760" ry="250" fill="${floor}" ${st}/>` + pool(960, 480, 520, 190, warm, a);
        xs.forEach((x, i) => { const cx = 960 + (i - 2) * 250, cy = 290 + Math.abs(i - 2) * 45; b += `<ellipse cx="${cx}" cy="${cy}" rx="52" ry="34" fill="${lc === i ? "#e8a317" : "#2a3263"}" ${st}/>`; });
        b += cut(`<ellipse cx="960" cy="486" rx="130" ry="40" fill="#e8dcc0" ${st}/>`);
        let cat = R(0, 770, 1920, 24, "#56606f", 0) + R(0, 660, 1920, 14, "#8d9199", 0, `stroke="${INK}" stroke-width="5"`); for (let x = 40; x < 1920; x += 160) cat += `<path d="M${x},670 L${x},770" ${st} stroke-width="8"/>`;
        b += cut(cat); for (let i = 0; i < 7; i++) b += `<path d="M${-100 + i * 330},0 L${60 + i * 330},330" stroke="#3d4a5c" stroke-width="22" stroke-linecap="round"/><path d="M${-100 + i * 330},0 L${60 + i * 330},330" stroke="${INK}" stroke-width="7" stroke-dasharray="2 30" stroke-linecap="round"/>`;
        f = cut(R(0, 960, 1920, 130, "#3d4a5c", 0) + [...Array(16)].map((_, i) => `<path d="M${i * 120 + 30},960 L${i * 120 - 30},1090" stroke="${INK}" stroke-width="6"/>`).join("") + R(0, 940, 1920, 22, "#56606f", 0));
        return { back: b, front: f };
      }
      b += R(0, 780, 1920, 300, floor, 0, "") + floorLine(780);
      for (let x = 60; x < 1920; x += 120) b += `<path d="M${x},140 Q${x + 24},460 ${x},780" fill="none" stroke="rgba(8,10,28,.35)" stroke-width="18"/>`;
      b += rig(0);
      if (v === "table") {
        b += xs.map((x, i) => throne(x, 740, false, 0.5)).join("");
        b += beam(1100, 100, 120, 600, 800, warm, a * (n ? 0.9 : 0.5)) + pool(1100, 912, 380, 64, warm, a * 1.2) +
          cut(`<path d="M1100,722 L1100,900" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M1100,722 L1100,900" stroke="#8d8a7e" stroke-width="16"/><ellipse cx="1100" cy="906" rx="120" ry="24" fill="#5b4636" ${st}/><ellipse cx="1100" cy="712" rx="210" ry="36" fill="#e8dcc0" ${st}/><ellipse cx="1060" cy="704" rx="110" ry="14" fill="rgba(255,255,255,.55)"/>`);
      } else if (v === "chairs") {
        b += xs.map((x, i) => throne(x, ys[i] + 20, lc === i, 1.15)).join("");
        if (lc != null) b += beam(xs[lc], 0, 120, 420, ys[lc], warm, a);
        f = cut(R(0, 846, 1920, 36, "#8a6a4c", 0) + R(0, 882, 1920, 200, "#5b4636", 0)) + `<path d="M0,882 L1920,882" ${st}/>`;
      } else if (v === "desk") {
        b += xs.map((x, i) => throne(x, ys[i] - 20, lc === i, 1.2)).join("");
        if (lc != null) b += beam(xs[lc], 0, 120, 460, ys[lc], warm, a);
        f = R(0, 0, 1920, 70, "#2b2230", 0) + cut(R(0, 872, 1920, 22, "#7a5a40", 0) + R(0, 894, 1920, 190, "#3b2f27", 0) + R(-30, 280, 170, 800, "#3b2f27", 0) + R(1780, 280, 170, 800, "#3b2f27", 0));
      } else if (v === "seats") {  // from the back row: the lit table far away at the bottom of the hall, rows of seat backs coming toward us
        b = R(0, 0, 1920, 1080, n ? "#121733" : "#2c2646", 0, "") + rig(0) + R(0, 420, 1920, 150, floor, 0, "") + floorLine(420) + beam(960, 60, 100, 620, 400, warm, a) + pool(960, 500, 360, 40, warm, a * 1.2) +
          cut(`<path d="M960,452 L960,500" stroke="${INK}" stroke-width="12"/><ellipse cx="960" cy="446" rx="86" ry="14" fill="#e8dcc0" ${st}/>`);
        for (let i = 0; i < 5; i++) { const y = 560 + i * 110, w = 96 + i * 22, h = 62 + i * 14;
          b += R(0, y + h * 0.55, 1920, 150, i % 2 ? "#1c2348" : "#171d3c", 0, "");
          for (let x = 30 + (i % 2) * w / 2; x < 1920; x += w + 10) { if (!o.empty && r() > 0.5) b += `<circle cx="${(x + w / 2).toFixed(0)}" cy="${y - 6}" r="${20 + i * 4}" fill="#0c1026" ${st}/>`; b += R(x, y, w, h, n ? "#34407c" : "#8a3b4d", 16); } }
      } else if (v === "wings") {  // the side corridor: a wall, cases, cables and the way out
        b = R(0, 0, 1920, 860, n ? "#1d2347" : "#5a4a80", 0, "") + R(0, 860, 1920, 220, n ? "#242b52" : "#43386a", 0, "") + floorLine(860);
        for (let x = 0; x < 1920; x += 240) b += `<path d="M${x},0 L${x},860" stroke="rgba(8,10,28,.3)" stroke-width="8"/>`;
        b += cut(R(1260, 330, 240, 530, "#6b7388", 6) + R(1292, 380, 176, 170, "#2b3358", 4) + R(1290, 640, 130, 24, "#c9ced6", 8) + `<circle cx="1470" cy="640" r="10" fill="#c9ced6" ${st}/>`) +
          cut(R(1316, 252, 188, 58, "#161c3d", 8) + R(1326, 262, 84, 38, "#e0262b", 4, "") + R(1410, 262, 84, 38, "#1fa85b", 4, "") + T(1368, 292, "EXIT", 28, "#f6f1e4") + T(1452, 292, "OUT", 28, "#f6f1e4")) + halo(1410, 280, 190, "#7ff0a8", n ? 0.3 : 0.12) +
          cut(R(80, 640, 340, 220, "#3d4a5c", 8) + R(80, 640, 340, 36, "#56606f", 8) + R(116, 700, 268, 24, "#8d9199", 4) + R(520, 700, 220, 160, "#56606f", 8));
        for (let i = 0; i < 3; i++) b += `<g class="sway"><path d="M${560 + i * 70},0 Q${540 + i * 70},170 ${600 + i * 70},300" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`;
      }
      return { back: b, front: f };
    },

    // An open-air market. { night, dawn: a pale band low in the sky }. One string of warm bulbs across the top.
    farmers_market(o) {
      const n = !!o.night, dawn = !!o.dawn, dk = n ? "#141a3a" : "#7d8aa8"; let b = R(0, 0, 1920, 870, n ? "#1d2650" : "#9fd3e8", 0, "");
      if (dawn) b += R(0, 470, 1920, 130, n ? "#3b3b78" : "#d6e2ee", 0, "") + R(0, 590, 1920, 100, "#f2a77a", 0, "") + R(0, 690, 1920, 90, "#f6c9a0", 0, "");
      b += `<path d="M0,770 Q300,650 640,730 T1300,700 T1920,740 L1920,870 L0,870Z" fill="${n ? "#2b3566" : "#8fb98f"}" ${st}/>` + R(0, 860, 1920, 220, n ? "#4b4036" : "#c9b48a", 0, "") + floorLine(860);
      [[60, 480], [1400, 1860]].forEach(([x0, x1]) => { b += `<path d="M${x0},330 L${x1},330 L${x1 - 30},430 L${x0 + 30},430Z" fill="${dk}" ${st}/>` + R(x0 + 40, 430, x1 - x0 - 80, 14, dk, 0) + R(x0 + 50, 600, x1 - x0 - 100, 260, dk, 0) + `<path d="M${x0 + 50},330 L${x0 + 50},860 M${x1 - 50},330 L${x1 - 50},860" stroke="${INK}" stroke-width="10"/>`; });
      let cl = ""; for (let i = 0; i < 9; i++) cl += `<path d="M${640 + i * 78},170 L${718 + i * 78},170 L${718 + i * 78},230 L${640 + i * 78},230Z" fill="${i % 2 ? "#f6f1e4" : "#1f8a8a"}" stroke="${INK}" stroke-width="5"/>`;
      b += cut(`<path d="M560,860 L560,200 M1380,860 L1380,200" stroke="${INK}" stroke-width="14"/><path d="M560,860 L560,200 M1380,860 L1380,200" stroke="#8d8a7e" stroke-width="6"/><path d="M520,150 L1420,150 L1500,230 L440,230Z" fill="#1f8a8a" ${st}/>` + cl);
      let tab = `<path d="M634,826 L1306,826 L1330,942 L610,942Z" fill="${n ? "#a84a52" : "#e0262b"}" ${st}/>`; for (let i = 1; i < 8; i++) tab += `<path d="M${634 + i * 84},826 L${620 + i * 88},942" stroke="rgba(246,241,228,.55)" stroke-width="10"/>`;
      b += cut(R(620, 800, 700, 28, "#d8cfb6", 6) + tab + R(1360, 830, 190, 110, "#a5714d", 6) + R(1400, 746, 190, 90, "#b9844a", 6) + R(90, 880, 150, 70, "#a5714d", 6));
      let str = `<path d="M0,170 Q960,300 1920,170" fill="none" stroke="${INK}" stroke-width="5"/>`, gl = "";
      for (let i = 1; i < 16; i++) { const t = i / 16, x = t * 1920, y = 170 + 260 * t * (1 - t) + 1; str += `<circle cx="${x.toFixed(0)}" cy="${(y + 14).toFixed(0)}" r="14" fill="${n ? "#fff1b0" : "#f6f1e4"}" ${st} stroke-width="4"/>`; if (n) gl += halo(x, y + 14, 86, "#ffe39a", 0.26); }
      return { back: b + str + gl };
    },

    // A small office after hours. dress: buyer | supplier | hal | newsroom | executive | filing | clerk. One desk lamp (green banker's lamp for hal, filing, clerk).
    night_office(o) {
      const n = o.night !== false, d = o.dress || "buyer", green = d === "hal" || d === "filing" || d === "clerk", col = green ? "#b5f0b8" : "#ffe0a0", r = rng(81), tall = d === "clerk", dy = tall ? 560 : 720;
      const P = pal(o, SET_PALETTE.night_office, n), wall = d === "hal" ? (n ? "#4a3326" : "#8a5a3c") : P.wall;
      let b = R(0, 0, 1920, 830, wall, 0, "") + R(0, 830, 1920, 250, P.floor, 0, "") + floorLine(830);
      if (d === "hal") for (let x = 0; x < 1920; x += 120) b += `<path d="M${x},0 L${x},830" stroke="rgba(27,29,54,.45)" stroke-width="7"/>`;
      if (d !== "hal" && d !== "filing") b += win(150, 150, 440, 400, n, 17);
      if (d === "hal") b += cut(R(180, 180, 260, 330, "#e8dcc0", 4) + R(210, 210, 200, 270, "#7f9fc0", 2) + R(520, 220, 180, 240, "#e8dcc0", 4) + R(548, 248, 124, 184, "#c9705a", 2));
      // the shelf unit or the wall dressing
      const sh = (x, y, w) => R(x, y, w, 18, "#8a5a3c", 4);
      if (d === "buyer") { let s = ""; for (let k = 0; k < 2; k++) { s += sh(1180, 300 + k * 170, 560); for (let i = 0; i < 6; i++) s += R(1210 + i * 88, 300 + k * 170 - 84, 52, 84, ["#f08a7a", "#7fd0f0", "#f0c470", "#9fd8a8", "#c95f8d", "#f3e6c8"][(i + k * 2) % 6], 10); } b += cut(s); }
      if (d === "supplier") { let g = ""; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) g += R(1210 + i * 66, 250 + j * 56, 56, 46, "#fff", 0, `stroke="${INK}" stroke-width="3"`); b += cut(R(1190, 180, 370, 70, "#e0262b", 4) + g + `<circle cx="${1210 + 3 * 66 + 28}" cy="${250 + 56 + 23}" r="30" fill="none" stroke="#e0262b" stroke-width="7"/>`); }
      if (d === "newsroom") b += cut(sh(1180, 460, 560) + R(1210, 360, 80, 100, "#f6f1e4", 2) + R(1300, 330, 90, 130, "#e8dcc0", 2) + R(1400, 380, 70, 80, "#f6f1e4", 2) + R(1500, 340, 80, 120, "#e8dcc0", 2));
      if (d === "executive") b += cut(R(1240, 150, 400, 270, "#2b3358", 6) + R(1260, 170, 360, 230, n ? "#1b2142" : "#9db7d1", 4) + `<path d="M1260,400 L1620,170" stroke="rgba(255,255,255,.2)" stroke-width="14"/>`);
      if (d === "filing") { let s = ""; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { s += R(120 + i * 170, 180 + j * 150, 160, 140, "#7b8499", 4) + R(170 + i * 170, 240 + j * 150, 60, 14, "#c9ced6", 4) + R(180 + i * 170, 200 + j * 150, 40, 24, "#f6f1e4", 2); } b += cut(s); let bd = sh(1180, 400, 560); for (let i = 0; i < 9; i++) bd += R(1200 + i * 58, 290, 48, 110, ["#3d6fb6", "#b8473d", "#4f8f5b", "#c9892b"][i % 4], 4); b += cut(bd + sh(1180, 240, 560) + [...Array(9)].map((_, i) => R(1200 + i * 58, 150, 48, 90, ["#4f8f5b", "#3d6fb6", "#b8473d", "#c9892b"][i % 4], 4)).join("")); }
      if (d === "clerk") b += cut(R(1240, 200, 420, 300, "#e8dcc0", 4) + [0, 1, 2].map((i) => R(1270, 240 + i * 80, 360, 14, "#8d8a7e", 4)).join("") + R(1290, 200, 60, 30, "#e0262b", 2));
      // desk (a very tall one for the clerk), lamp, pool of light
      const dx = tall ? 900 : 860, dw = tall ? 620 : 900;
      b += cut(R(dx, dy, dw, 40, "#8a5a3c", 8) + R(dx + 30, dy + 40, dw - 60, 1080 - dy - 40, "#a5714d", 0) + `<path d="M${dx + dw * 0.55},${dy + 40} L${dx + dw * 0.55},1080" ${st}/>`);
      if (tall) b += cut(R(760, 780, 120, 22, "#56606f", 6) + R(806, 800, 28, 100, "#56606f", 4));
      const lx = dx + dw - 150, ly = dy;
      if (green) b += cut(R(lx - 38, ly - 22, 76, 22, "#c9a36b", 8) + R(lx - 6, ly - 150, 12, 130, "#c9a36b", 4) + `<path d="M${lx - 80},${ly - 150} Q${lx},${ly - 220} ${lx + 80},${ly - 150}Z" fill="#1f8a5a" ${st}/>`);
      else b += cut(R(lx - 40, ly - 20, 80, 20, "#56606f", 8) + `<path d="M${lx},${ly - 20} L${lx - 60},${ly - 150} L${lx - 130},${ly - 190}" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${lx},${ly - 20} L${lx - 60},${ly - 150} L${lx - 130},${ly - 190}" fill="none" stroke="#c9ced6" stroke-width="6" stroke-linecap="round"/>` + `<path d="M${lx - 170},${ly - 190} L${lx - 84},${ly - 190} L${lx - 108},${ly - 150} L${lx - 150},${ly - 150}Z" fill="#e8a317" ${st}/>`);
      const hx = green ? lx : lx - 128, hy = green ? ly - 160 : ly - 150;
      if (n) b += beam(hx, hy, 50, green ? 380 : 330, ly - hy + 30, col, 0.22) + halo(hx, hy, 130, col, 0.3) + pool(hx - (green ? 90 : 20), ly + 12, 230, 26, col, 0.3);
      if (d === "supplier") b += cut(R(dx + 60, dy - 40, 140, 40, "#f6f1e4", 2) + R(dx + 80, dy - 76, 140, 40, "#e8dcc0", 2));
      if (d === "newsroom") b += monitor(dx + 40, dy - 210, 200, "green") + monitor(dx + 270, dy - 190, 180, "red");
      if (d === "executive") b += cut(R(1560, 400, 220, 300, "#5b3a22", 40) + R(1530, 560, 280, 160, "#6b4226", 40));
      if (d === "buyer") b += cut(R(dx + 60, dy - 30, 40, 30, "#f0c470", 6) + R(dx + 110, dy - 30, 40, 30, "#7fd0f0", 6));
      return { back: b };
    },

    // A used-car lot. { night, dress: "garage" }: chain-link, bunting and one floodlight; the garage is concrete with one overhead tube. The car is the `car` prop.
    car_lot(o) {
      const n = o.night !== false, g = o.dress === "garage", r = rng(53);
      if (g) {
        let b = R(0, 0, 1920, 860, n ? "#31364f" : "#8d9199", 0, "") + R(0, 0, 1920, 170, n ? "#454b66" : "#a7acb8", 0, "") + R(0, 860, 1920, 220, n ? "#252a40" : "#6e7280", 0, "") + floorLine(860) + `<path d="M0,170 L1920,170" ${st}/>`;
        for (let x = 140; x < 1920; x += 330) b += `<path d="M${x},868 L${x - 90},1080" stroke="#f0b429" stroke-width="10"/>`;
        [300, 960, 1620].forEach((x) => { b += cut(R(x - 70, 170, 140, 690, n ? "#585e7a" : "#b9bec9", 0) + R(x - 70, 760, 140, 100, "#f0b429", 0) + [0, 1, 2].map((i) => `<path d="M${x - 70 + i * 50},860 L${x - 20 + i * 50},760" stroke="${INK}" stroke-width="14"/>`).join("")); });
        b += R(760, 190, 400, 22, n ? "#f6fbff" : "#d8dde6", 6) + (n ? beam(960, 212, 400, 760, 650, "#d8ecff", 0.14) + halo(960, 200, 280, "#d8ecff", 0.2) + pool(960, 940, 520, 70, "#d8ecff", 0.2) : "");
        return { back: b };
      }
      let b = R(0, 0, 1920, 780, n ? "#1a2043" : "#bfe0ea", 0, "");
      if (n) for (let i = 0; i < 36; i++) b += `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 340).toFixed(0)}" r="${(2 + r() * 3).toFixed(1)}" fill="#f6f1e4"/>`;
      b += skyline(-20, 1940, 700, r, n ? ["#232c54", "#2c3766", "#1c2340"] : ["#7f9fc0", "#9db7d1", "#6c88ab"], n) + R(0, 700, 1920, 380, n ? "#2e3350" : "#8d9199", 0, "") + floorLine(700);
      for (let x = 100; x < 1920; x += 240) b += `<path d="M${x},760 L${x - 50},1080" stroke="#f6f1e4" stroke-width="9" opacity=".8"/>`;
      let fence = ""; for (let x = 40; x < 1900; x += 36) fence += `<path d="M${x},470 L${x + 160},720 M${x + 160},470 L${x},720" stroke="#8d9199" stroke-width="3"/>`;
      b += `<g opacity=".7">${fence}</g>` + `<path d="M0,470 L1920,470 M0,720 L1920,720" ${st}/>`; for (let x = 0; x < 1920; x += 480) b += R(x, 440, 18, 290, "#56606f", 4);
      let flags = `<path d="M0,170 Q960,290 1920,170" fill="none" stroke="${INK}" stroke-width="5"/>`; const cols = ["#e0262b", "#f0b429", "#7fd0f0", "#1fa85b", "#c95f8d"];
      for (let i = 1; i < 24; i++) { const t = i / 24, x = t * 1920, y = 170 + 240 * t * (1 - t); flags += `<path d="M${x - 24},${y} L${x + 24},${y} L${x},${y + 56}Z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="4"/>`; }
      b += flags + cut(R(1500, 220, 22, 500, "#56606f", 4) + R(1400, 190, 190, 46, "#3d4a5c", 8) + R(1420, 232, 150, 14, n ? "#fff1b0" : "#d8dde6", 4));
      if (n) b += beam(1495, 244, 140, 900, 560, "#fff1b0", 0.2) + halo(1495, 240, 200, "#fff1b0", 0.3) + pool(1000, 950, 560, 60, "#fff1b0", 0.2);
      return { back: b };
    },

    // A tiny bottling room: a hand-cranked line along the back (the `bottles` prop rides it at y 700), a filler with a crank wheel, pallets, a roller door. One bare bulb.
    bottling_plant(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 860, n ? "#3a3a52" : "#cdbb98", 0, "") + R(0, 860, 1920, 220, n ? "#2a2c40" : "#a59f8f", 0, "") + floorLine(860);
      for (let y = 60; y < 860; y += 90) b += `<path d="M0,${y} L1920,${y}" stroke="rgba(27,29,54,.22)" stroke-width="5"/>`;
      let door = R(100, 160, 420, 500, n ? "#6b7388" : "#b8bfcc", 6); for (let y = 190; y < 660; y += 36) door += `<path d="M100,${y} L520,${y}" stroke="${INK}" stroke-width="5"/>`;
      b += cut(door + R(100, 624, 420, 36, "#56606f", 6));
      let belt = R(0, 704, 1920, 40, "#3d4a5c", 0) + R(0, 744, 1920, 22, "#56606f", 0); for (let x = 40; x < 1920; x += 130) belt += `<path d="M${x},766 L${x},860" ${st} stroke-width="14"/>`;
      b += cut(belt);
      b += cut(R(1260, 300, 300, 260, "#c9ced6", 28) + R(1290, 270, 240, 40, "#8d9199", 10) + R(1380, 560, 60, 144, "#56606f", 4) + R(1250, 490, 320, 22, "#56606f", 6) + `<path d="M1410,512 L1410,704" stroke="#bfe8ff" stroke-width="10"/>`) +
        `<g class="spin"><circle cx="1660" cy="560" r="64" fill="none" stroke="${INK}" stroke-width="16"/><circle cx="1660" cy="560" r="64" fill="none" stroke="#c9ced6" stroke-width="7"/><path d="M1596,560 L1724,560 M1660,496 L1660,624" stroke="${INK}" stroke-width="10"/><circle cx="1724" cy="560" r="14" fill="#e0262b" ${st}/></g>` + R(1600, 540, 62, 22, "#56606f", 6);
      let pal = ""; for (let k = 0; k < 3; k++) pal += R(130, 800 - k * 52, 360, 40, "#c99a5b", 4) + R(130, 840 - k * 52, 360, 14, "#8a5a3c", 0); for (let i = 0; i < 5; i++) pal += R(150 + i * 66, 700, 52, 100, "rgba(190,230,220,.7)", 12);
      b += cut(pal) + cut(R(1500, 800, 300, 40, "#c99a5b", 4) + R(1500, 840, 300, 14, "#8a5a3c", 0));
      if (n) b += hang(900, 0, 240, true) + pool(900, 930, 480, 60, "#ffe9a0", 0.2); else b += hang(900, 0, 240, false);
      return { back: b };
    },

    // ---- batch 2 ----
    // A small living room. dress: rehearsal (stuffed toys on the sofa) | sunday (a family on the sofa, the pitch on the TV) | martha. night: the TV glow; light:"phone" adds a phone torch from below.
    living_room(o) {
      const n = !!o.night, d = o.dress || "rehearsal", sc = d === "martha" ? "#1f8a8a" : "#c95f8d", r = rng(91);
      let b = R(0, 0, 1920, 830, n ? "#2b2f55" : "#e6d5c0", 0, "") + R(0, 830, 1920, 250, n ? "#3a3354" : "#a5814d", 0, "") + floorLine(830);
      b += cut(R(150, 150, 150, 190, "#f6f1e4", 4) + R(150, 150, 150, 44, "#e0262b", 4)) + [...Array(15)].map((_, i) => R(160 + (i % 5) * 26, 206 + Math.floor(i / 5) * 40, 20, 30, i === 7 ? "#e0262b" : "rgba(27,29,54,.16)", 2, "")).join("");
      b += cut(R(560, 540, 760, 160, sc, 38) + R(500, 640, 110, 220, Rig.shade(sc, 0.18), 34) + R(1270, 640, 110, 220, Rig.shade(sc, 0.18), 34) + R(560, 690, 760, 130, Rig.shade(sc, 0.1), 30) + R(580, 820, 28, 40, INK, 0) + R(1290, 820, 28, 40, INK, 0));
      b += cut(R(300, 720, 150, 24, "#8a5a3c", 6) + R(330, 744, 90, 116, "#a5714d", 0) + R(366, 640, 18, 80, "#56606f", 4) + `<path d="M330,640 L420,640 L400,560 L350,560Z" fill="#f0e2b0" ${st}/>`);
      b += cut(R(1420, 470, 400, 260, INK, 12) + R(1440, 490, 360, 220, n ? "#7fb8ff" : "#2c3766", 4, "") + R(1480, 730, 280, 36, "#8a5a3c", 6) + R(1500, 766, 240, 90, "#a5714d", 0));
      if (d === "sunday") b += R(1500, 640, 220, 8, "#f6f1e4", 0, "") + `<path d="M1610,500 L1560,640 L1660,640Z" fill="rgba(255,240,190,.45)"/><circle cx="1610" cy="610" r="14" fill="#f3c9a5" ${st} stroke-width="3"/><rect x="1600" y="624" width="20" height="26" fill="#ef7f6a" ${st} stroke-width="3"/>`;
      if (n) b += halo(1620, 600, 470, "#7fb8ff", 0.26) + beam(1440, 600, 100, 900, 460, "#7fb8ff", 0.1);
      if (d === "rehearsal") for (let i = 0; i < 5; i++) { const x = 650 + i * 150, c = ["#c9a36b", "#f6f1e4", "#b98562", "#8d9199", "#e8a317"][i];
        b += cut(`<circle cx="${x - 30}" cy="470" r="20" fill="${c}" ${st}/><circle cx="${x + 30}" cy="470" r="20" fill="${c}" ${st}/>` + R(x - 44, 580, 88, 92, c, 30) + `<circle cx="${x}" cy="526" r="50" fill="${c}" ${st}/><circle cx="${x - 16}" cy="520" r="6" fill="${INK}"/><circle cx="${x + 16}" cy="520" r="6" fill="${INK}"/><ellipse cx="${x}" cy="540" rx="12" ry="8" fill="#3b2a1e"/>`); }
      if (d === "sunday") for (let i = 0; i < 4; i++) { const x = 650 + i * 190, c = Rig.extra(i * 2 + 3); b += cut(R(x - 50, 590, 100, 120, c.top, 24) + `<circle cx="${x}" cy="540" r="${i === 3 ? 38 : 52}" fill="${c.skin}" ${st}/><path d="M${x - 52},530 Q${x},470 ${x + 52},530Z" fill="${c.hair}" ${st}/>`); }
      if (d === "martha") b += cut(`<path d="M520,620 L640,600 L700,700 L560,830Z" fill="#e8dcc0" ${st}/>`) + cut(R(1060, 150, 220, 160, "#8a5a3c", 6) + R(1076, 166, 188, 128, "#9db7d1", 2)) + plant(1330, 830);
      if (o.light === "phone") b += beam(960, 1060, 90, 640, 760, "#eaf4ff", 0.22) + halo(960, 1060, 200, "#eaf4ff", 0.3);
      return { back: b };
    },

    // A narrow shop behind a counter. dress: pawn (glass counter, odd goods, guitars) | tailor (mannequin, cutting table, cloth) | print (small press, labels, a cracked mirror). One hanging bulb (a work lamp for tailor and print).
    back_shop(o) {
      const n = o.night !== false, d = o.dress || "pawn", P = pal(o, SET_PALETTE.back_shop, n); let b = R(0, 0, 1920, 830, P.wall, 0, "") + R(0, 830, 1920, 250, P.floor, 0, "") + floorLine(830);
      for (let x = 0; x < 1920; x += 120) b += `<path d="M${x},0 L${x},830" stroke="rgba(27,29,54,.16)" stroke-width="5"/>`;
      const shelf = (x, y, w) => R(x, y, w, 16, "#8a5a3c", 4);
      if (d === "pawn") { let s = shelf(1180, 330, 600) + shelf(1180, 500, 600); const odd = (i, y) => [R(1210 + i * 90, y - 70, 56, 70, "#c9a36b", 8), `<circle cx="${1238 + i * 90}" cy="${y - 40}" r="34" fill="#e8dcc0" ${st}/><path d="M${1238 + i * 90},${y - 40} L${1238 + i * 90},${y - 60} M${1238 + i * 90},${y - 40} L${1250 + i * 90},${y - 36}" ${st} stroke-width="4"/>`, R(1216 + i * 90, y - 110, 44, 110, "#9fd8a8", 10), R(1206 + i * 90, y - 60, 70, 60, "#7fd0f0", 6)][i % 4];
        for (let i = 0; i < 6; i++) s += odd(i, 330) + odd(i + 1, 500); b += cut(s);
        [[260, "#c9702e"], [520, "#8a3b2a"]].forEach(([x, c], i) => { b += cut(`<path d="M${x},230 L${x},560" stroke="${INK}" stroke-width="22"/><ellipse cx="${x}" cy="640" rx="80" ry="100" fill="${c}" ${st}/><circle cx="${x}" cy="640" r="26" fill="#3b2a1e" ${st}/><rect x="${x - 12}" y="${230 + i * 16}" width="24" height="${340 - i * 16}" fill="#5b4636" ${st}/>`); }); }
      if (d === "tailor") { let s = shelf(1180, 330, 600) + shelf(1180, 520, 600); for (let i = 0; i < 6; i++) s += R(1200 + i * 92, 240, 76, 90, ["#e0262b", "#2c3766", "#f0b429", "#1f8a8a", "#c95f8d", "#f6f1e4"][i], 14) + R(1210 + i * 92, 430, 76, 90, ["#1f8a8a", "#e0262b", "#2c3766", "#c95f8d", "#f0b429", "#f6f1e4"][i], 14); b += cut(s);
        b += cut(`<path d="M300,420 Q300,330 380,330 Q460,330 460,420 L440,640 L320,640Z" fill="#e8dcc0" ${st}/><circle cx="380" cy="290" r="26" fill="#e8dcc0" ${st}/><path d="M380,640 L380,830 M320,830 L440,830" ${st} stroke-width="12"/>`); }
      if (d === "print") { b += cut(R(1240, 520, 300, 310, "#56606f", 10) + R(1300, 430, 180, 100, "#3d4a5c", 8) + `<g class="spin"><circle cx="1620" cy="640" r="60" fill="none" stroke="${INK}" stroke-width="14"/><path d="M1560,640 L1680,640 M1620,580 L1620,700" stroke="${INK}" stroke-width="9"/></g>`);
        let lab = ""; for (let i = 0; i < 4; i++) lab += R(1190 + i * 6, 790 - i * 24, 180, 24, i % 2 ? "#f6f1e4" : "#f0d27a", 2); b += cut(lab);
        b += cut(R(260, 220, 300, 400, "#bfe0ea", 8) + `<path d="M330,230 L400,420 L360,520 L430,610 M400,420 L520,380" fill="none" stroke="${INK}" stroke-width="5"/>`); }
      const lampCol = d === "pawn" ? "#ffe9a0" : "#fff6d8";
      b += hang(900, 0, 250, n, lampCol) + (n ? pool(900, 905, 560, 50, lampCol, 0.18) : "");
      const f = cut(R(0, 860, 1920, 40, d === "pawn" ? "#bfe0ea" : "#c9a36b", 0) + R(0, 900, 1920, 180, "#8a5a3c", 0)) + (d === "pawn" ? `<path d="M0,860 L1920,860" ${st}/>` : `<path d="M0,860 L1920,860" ${st}/>`);
      return { back: b, front: f };
    },

    // A long institutional corridor. dress: hospital (pale green, a trolley bay) | court (wood panels, a bench, tall doors). One ceiling light (a wall sconce in court).
    corridor(o) {
      const n = o.night !== false, d = o.dress || "hospital", court = d === "court"; let b = R(0, 0, 1920, 830, court ? (n ? "#4a3326" : "#8a5a3c") : (n ? "#3a5a52" : "#cfe6d8"), 0, "") + R(0, 830, 1920, 250, n ? "#2a2c40" : "#b9b3a4", 0, "") + floorLine(830);
      if (court) for (let x = 0; x < 1920; x += 130) b += `<path d="M${x},0 L${x},830" stroke="rgba(27,29,54,.4)" stroke-width="7"/>`; else b += R(0, 560, 1920, 16, "#8fb8a6", 0, "");
      [220, 760, 1300].forEach((x) => { b += cut(R(x, court ? 200 : 300, 240, court ? 630 : 530, court ? "#6f452c" : "#e8f0ea", 6) + R(x + 24, court ? 240 : 340, 192, 160, "rgba(27,29,54,.18)", 4, "") + `<circle cx="${x + 200}" cy="640" r="11" fill="#f0b429" ${st}/>`); });
      if (court) b += cut(R(1560, 560, 300, 260, "#8a5a3c", 8) + R(1560, 540, 300, 28, "#a5714d", 8)); else b += cut(R(1590, 600, 260, 14, "#c9ced6", 4) + R(1610, 614, 14, 216, "#c9ced6", 4) + R(1816, 614, 14, 216, "#c9ced6", 4) + R(1600, 720, 240, 14, "#e0262b", 0, ""));
      if (n) { if (court) b += cut(R(1440, 380, 60, 90, "#c9a36b", 8)) + halo(1470, 420, 260, "#ffe0a0", 0.34) + beam(1470, 470, 60, 280, 360, "#ffe0a0", 0.14); else b += cut(R(660, 60, 600, 36, "#f6fbff", 8)) + beam(960, 96, 600, 1200, 740, "#e8f6ff", 0.13) + halo(960, 80, 360, "#e8f6ff", 0.24); }
      else if (!court) b += cut(R(660, 60, 600, 36, "#d8dde6", 8));
      const f = court ? "" : cut([...Array(7)].map((_, i) => R(60 + i * 160, 770, 110, 20, "#7fb8d0", 6) + R(70 + i * 160, 790, 90, 70, "#7fb8d0", 6)).join(""));
      const fc = court ? cut(R(160, 770, 700, 22, "#a5714d", 6) + R(180, 792, 660, 80, "#8a5a3c", 0)) : f;
      return { back: b, front: fc };
    },

    // A design studio at 2 a.m.: drafting table, a glowing lightbox, pinned sketches, a tall dark window. One drafting lamp.
    design_studio(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 830, n ? "#2a2c4e" : "#e6ddc6", 0, "") + R(0, 830, 1920, 250, n ? "#33304a" : "#b99f7c", 0, "") + floorLine(830) + win(1380, 120, 360, 560, n, 29);
      for (let i = 0; i < 6; i++) b += `<g transform="rotate(${(i % 3) * 4 - 4} ${200 + i * 160} 300)">${R(160 + i * 160, 180 + (i % 2) * 60, 120, 150, "#f6f1e4", 0)}<path d="M${180 + i * 160},${230 + (i % 2) * 60} Q${220 + i * 160},${200 + (i % 2) * 60} ${250 + i * 160},${290 + (i % 2) * 60}" fill="none" stroke="#3d6fb6" stroke-width="5"/></g>`;
      b += cut(R(1000, 600, 340, 24, "#8a5a3c", 6) + R(1020, 620, 300, 210, "#a5714d", 0)) + cut(R(1040, 520, 260, 90, n ? "#fff6d8" : "#e8e2cf", 8) + `<path d="M1070,590 Q1120,540 1180,580 T1280,560" fill="none" stroke="#3d6fb6" stroke-width="5"/>`);
      b += cut(`<path d="M300,650 L1100,650 L1160,760 L240,760Z" fill="#c99a5b" ${st}/>` + R(260, 760, 20, 120, "#56606f", 4) + R(1100, 760, 20, 120, "#56606f", 4) + `<path d="M600,640 L860,600" stroke="#8d9199" stroke-width="12"/>`);
      b += cut(R(620, 520, 28, 130, "#56606f", 6) + `<path d="M634,520 L760,460 L840,490" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M634,520 L760,460 L840,490" fill="none" stroke="#c9ced6" stroke-width="6" stroke-linecap="round"/><path d="M800,440 L880,480 L850,520 L790,490Z" fill="#e8a317" ${st}/>`);
      if (n) b += halo(1170, 560, 360, "#fff6d8", 0.3) + beam(840, 500, 50, 380, 160, "#ffe0a0", 0.24) + pool(600, 700, 360, 60, "#ffe0a0", 0.26) + halo(840, 500, 120, "#ffe0a0", 0.3);
      return { back: b };
    },

    // A big empty hall. dress: convention (a half-built trade stand, double doors under a banner) | gym (wall bars, folded bleachers, a mirror ball's spots). One emergency light over the doors (gym: the mirror ball's spots).
    empty_hall(o) {
      const n = o.night !== false, gym = o.dress === "gym"; let b = R(0, 0, 1920, 820, n ? (gym ? "#2c3052" : "#2a2d44") : "#cfd3dc", 0, "") + R(0, 820, 1920, 260, gym ? (n ? "#6b4a38" : "#c99a5b") : (n ? "#33364c" : "#8d9199"), 0, "") + floorLine(820);
      for (let x = 0; x < 1920; x += 160) b += `<path d="M${x},0 L${x},820" stroke="rgba(8,10,28,.18)" stroke-width="6"/>`;
      if (gym) { let w = ""; for (let x = 0; x < 340; x += 34) w += `<path d="M${120 + x},180 L${120 + x},820" stroke="#c9a36b" stroke-width="8"/>`; for (let y = 200; y < 820; y += 56) w += `<path d="M120,${y} L460,${y}" stroke="#c9a36b" stroke-width="8"/>`; b += cut(R(110, 170, 360, 660, "rgba(0,0,0,0)", 6) + w) + cut(R(1300, 560, 560, 270, "#8a5a3c", 8) + [...Array(5)].map((_, i) => R(1320 + i * 104, 580, 90, 240, "#a5714d", 4)).join(""));
        if (n) for (let i = 0; i < 9; i++) b += `<circle class="tick" cx="${300 + i * 190}" cy="${300 + (i % 3) * 170}" r="28" fill="${["#ffe14d", "#7fd0f0", "#f08a7a"][i % 3]}" opacity=".45"/>`; b += hang(1000, 0, 200, false); }
      else { b += cut(R(1000, 640, 400, 190, "#c9a36b", 6) + R(1040, 480, 14, 170, "#8d9199", 4) + R(1346, 480, 14, 170, "#8d9199", 4) + R(1040, 470, 320, 14, "#8d9199", 4) + R(1060, 520, 260, 110, "#f6f1e4", 4)) + cut(R(500, 300, 520, 530, "#4a4f6a", 8) + R(520, 330, 220, 480, "#3a3f58", 4) + R(780, 330, 220, 480, "#3a3f58", 4) + R(480, 230, 560, 70, "#f0b429", 8)) + T(760, 282, "WELCOME", 44); }
      b += cut(R(850, 60, 220, 40, "#0f5a36", 6) + T(960, 90, "EXIT", 28, "#bff7d2")) + (n && !gym ? halo(960, 80, 300, "#7ff0a8", 0.32) + beam(960, 100, 220, 760, 720, "#7ff0a8", 0.07) : "");
      return { back: b };
    },

    // ---- batch 3 ----
    // A small room with a desk and a bed. dress: teen (posters as plain shapes, a gaming chair; a phone glow on the face) | loft (brick wall, a ring light on a stand, a big window).
    bedroom(o) {
      const n = o.night !== false, loft = o.dress === "loft"; let b = R(0, 0, 1920, 830, loft ? (n ? "#5a3a3a" : "#b8624a") : (n ? "#2a2c4e" : "#e6d5c0"), 0, "") + R(0, 830, 1920, 250, n ? "#33304a" : "#a5814d", 0, "") + floorLine(830);
      if (loft) { for (let y = 0; y < 830; y += 60) for (let x = (y / 60) % 2 ? -50 : 0; x < 1920; x += 100) b += R(x, y, 96, 56, "rgba(27,29,54,.10)", 0, `stroke="rgba(27,29,54,.35)" stroke-width="3"`); b += win(1180, 120, 560, 520, n, 33); }
      else { b += cut(R(160, 150, 200, 280, "#f0b429", 4) + `<circle cx="260" cy="260" r="60" fill="#e0262b" ${st}/>`) + cut(R(420, 190, 260, 180, "#1f8a8a", 4) + `<path d="M440,350 L520,230 L580,320 L640,250 L660,350Z" fill="#f6f1e4" ${st}/>`) + cut(R(1480, 160, 220, 300, "#2c3766", 4) + `<path d="M1500,440 L1590,200 L1680,440Z" fill="#7fd0f0" ${st}/>`); }
      b += cut(R(80, 640, 560, 150, "#f6f1e4", 28) + R(80, 580, 200, 70, "#e8dcc0", 24) + R(120, 740, 520, 110, "#3d6fb6", 18) + R(60, 640, 40, 240, "#8a5a3c", 8)) + cut(R(1180, 700, 640, 36, "#8a5a3c", 6) + R(1220, 736, 40, 140, "#a5714d", 0) + R(1740, 736, 40, 140, "#a5714d", 0)) + monitor(1380, 520, 260, "green");
      if (!loft) b += cut(R(840, 560, 130, 200, "#2c3766", 40) + R(820, 720, 170, 40, "#1c2340", 14) + R(890, 760, 30, 90, "#56606f", 4) + R(840, 850, 130, 16, "#56606f", 6)) + (n ? halo(960, 760, 420, "#7fb8ff", 0.16) : "");
      else { b += cut(`<path d="M1010,880 L1010,420" stroke="${INK}" stroke-width="16"/><circle cx="1010" cy="360" r="90" fill="none" stroke="#f6f1e4" stroke-width="30"/><circle cx="1010" cy="360" r="90" fill="none" stroke="${INK}" stroke-width="5"/><path d="M930,880 L1090,880" stroke="${INK}" stroke-width="14"/>`); if (n) b += halo(1010, 360, 480, "#fff6d8", 0.3) + pool(960, 920, 520, 50, "#fff6d8", 0.14); }
      return { back: b };
    },

    // A bank. dress: vault (a round door open, steel shelves, one nearly empty) | counter (a teller window with a grille). One bulb in the vault; the teller's lamp at the counter.
    bank(o) {
      const n = o.night !== false, vault = o.dress !== "counter", P = pal(o, vault ? SET_PALETTE.bank : "green", n); let b = R(0, 0, 1920, 830, P.wall, 0, "") + R(0, 830, 1920, 250, P.floor, 0, "") + floorLine(830);
      if (vault) {
        b += cut(`<circle cx="420" cy="500" r="330" fill="#7b8499" ${st}/><circle cx="420" cy="500" r="250" fill="#56606f" ${st}/><circle cx="420" cy="500" r="60" fill="#c9ced6" ${st}/><path d="M420,260 L420,740 M180,500 L660,500 M250,330 L590,670 M590,330 L250,670" stroke="${INK}" stroke-width="12"/>`) + cut(`<path d="M720,170 L860,230 L860,830 L720,830Z" fill="#8d9199" ${st}/>`);
        let s = ""; for (let k = 0; k < 4; k++) { s += R(900, 180 + k * 160, 860, 18, "#c9ced6", 2); for (let i = 0; i < 8; i++) if (k !== 3 || i < 1) s += R(920 + i * 104, 100 + k * 160 + 14, 84, 66, k === 3 ? "#8a5a3c" : "#c9a36b", 6); }
        b += cut(R(880, 120, 900, 700, "#56606f", 8, "") + s + R(880, 120, 14, 700, "#56606f", 0) + R(1766, 120, 14, 700, "#56606f", 0));
        b += hang(1340, 0, 150, n, "#fff1b0") + (n ? pool(1340, 880, 620, 70, "#fff1b0", 0.2) : "");
      } else {
        for (let x = 100; x < 1900; x += 150) b += `<path d="M${x},60 L${x},830" stroke="rgba(27,29,54,.1)" stroke-width="6"/>`;
        let g = ""; for (let x = 520; x < 1500; x += 70) g += `<path d="M${x},360 L${x},700" stroke="${INK}" stroke-width="10"/>`;
        b += cut(R(480, 320, 1000, 420, n ? "rgba(190,224,240,.35)" : "rgba(190,224,240,.6)", 10) + g + R(480, 320, 1000, 30, "#8a5a3c", 6) + R(900, 560, 160, 30, "#56606f", 4));
        if (n) b += cut(R(1420, 600, 30, 110, "#56606f", 6) + `<path d="M1435,610 L1380,540 L1500,540Z" fill="#1f8a5a" ${st}/>`) + halo(1440, 560, 330, "#b5f0b8", 0.3) + pool(1400, 800, 360, 40, "#b5f0b8", 0.2);
        return { back: b, front: cut(R(0, 780, 1920, 50, "#c9a36b", 0) + R(0, 830, 1920, 250, "#8a5a3c", 0)) + `<path d="M0,780 L1920,780" ${st}/>` };
      }
      return { back: b };
    },

    // A red carpet between rope posts, a plain backdrop (no logos) and a press pen. Camera flashes: white bursts at the `flash` times (seconds into the shot).
    red_carpet(o) {
      const n = o.night !== false, fl = (o.flash || [0.3, 0.7, 1.2, 1.5, 2.1, 2.4, 3.0, 3.6]).join(","); let b = R(0, 0, 1920, 760, n ? "#1d2144" : "#cfd3dc", 0, "") + R(0, 760, 1920, 320, n ? "#262a46" : "#8d9199", 0, "") + floorLine(760);
      for (let x = 0; x < 1920; x += 240) b += R(x, 140, 120, 620, n ? "#2a2f58" : "#bfc6d8", 0, "") ;
      b += cut(`<path d="M600,1080 L1320,1080 L1180,760 L740,760Z" fill="#c8202c" ${st}/>`);
      [[600, 1080], [1320, 1080], [740, 760], [1180, 760]].forEach(([x, y]) => { const k = y > 900 ? 1.3 : 0.8; b += cut(R(x - 8 * k, y - 120 * k, 16 * k, 120 * k, "#e8a317", 4) + `<circle cx="${x}" cy="${y - 124 * k}" r="${16 * k}" fill="#e8a317" ${st}/>`); });
      b += `<path d="M600,956 Q660,990 740,640" fill="none" stroke="#e0262b" stroke-width="10"/><path d="M1320,956 Q1260,990 1180,640" fill="none" stroke="#e0262b" stroke-width="10"/>`;
      let pen = cut(R(1400, 700, 480, 40, "#56606f", 4)); for (let i = 0; i < 5; i++) { const x = 1440 + i * 90; pen += cut(R(x, 560, 60, 70, "#1b1d36", 14) + R(x + 6, 520, 48, 48, "#3d4a5c", 10) + `<circle cx="${x + 30}" cy="544" r="14" fill="#c9ced6" ${st} stroke-width="4"/>`); }
      b += pen;
      let burst = ""; for (let i = 0; i < 5; i++) burst += `<path d="M${1470 + i * 90},540 l-70,-60 l40,10 l-10,-50 l40,40 l40,-50 l-10,60 l60,-10z" fill="#fff" opacity=".9"/>`;
      b += `<g class="fl" data-flash="${fl}" style="opacity:0">${R(0, 0, 1920, 1080, "rgba(255,255,255,.22)", 0, "")}${burst}</g>`;
      return { back: b };
    },

    // A soda aisle. dress: aisle (a closed store, glowing fridges both sides) | shelf (one grocery shelf before opening, a stock-room door with a light). The fridges' cold light.
    supermarket(o) {
      const n = o.night !== false, shelf = o.dress === "shelf", P = pal(o, SET_PALETTE.supermarket, n); let b = R(0, 0, 1920, 840, P.wall, 0, "") + R(0, 840, 1920, 240, P.floor, 0, "") + floorLine(840);
      for (let x = 0; x < 1920; x += 160) b += `<path d="M${x},840 L${x + (x < 960 ? -60 : 60)},1080" stroke="rgba(8,10,28,.25)" stroke-width="5"/>`;
      if (!shelf) { [[0, 520], [1400, 520]].forEach(([x0, w]) => { let f = R(x0, 120, w, 720, "#56606f", 0); for (let k = 0; k < 4; k++) { f += R(x0 + 30, 170 + k * 170, w - 60, 140, n ? "#cfeaff" : "#bfe0ea", 6); for (let i = 0; i < 8; i++) f += R(x0 + 50 + i * ((w - 100) / 8), 200 + k * 170, 34, 100, ["#f08a7a", "#7fd0f0", "#f3e6c8", "#9fd8a8", "#c95f8d"][(i + k) % 5], 6); } b += cut(f); if (n) b += halo(x0 + w / 2, 450, 480, "#cfeaff", 0.2); });
        b += cut(R(520, 560, 880, 40, "#c9ced6", 6)) + cut(R(600, 440, 720, 120, "#7b8499", 6)); }
      else { b += cut(R(1280, 200, 300, 640, "#8d9199", 6) + R(1330, 260, 200, 90, "#2b3358", 4) + `<circle cx="1310" cy="560" r="12" fill="#c9ced6" ${st}/>`) + (n ? beam(1430, 270, 180, 700, 580, "#fff1b0", 0.12) + halo(1430, 300, 220, "#fff1b0", 0.3) : "");
        let s = R(240, 360, 900, 20, "#c9ced6", 2) + R(240, 560, 900, 20, "#c9ced6", 2) + R(240, 760, 900, 20, "#c9ced6", 2); for (let k = 0; k < 3; k++) for (let i = 0; i < 9; i++) s += R(260 + i * 98, 280 + k * 200, 60, 80, ["#f08a7a", "#7fd0f0", "#f3e6c8", "#9fd8a8", "#c95f8d"][(i + k) % 5], 8); b += cut(R(220, 200, 940, 680, "#56606f", 4, "") + s); }
      return { back: b };
    },

    // An empty mall: shop shutters down and a running escalator rising into the dark. The escalator's handrail strip lights.
    mall(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 860, n ? "#22264a" : "#dfe3ea", 0, "") + R(0, 860, 1920, 220, n ? "#2e3150" : "#c9ced6", 0, "") + floorLine(860);
      [[40, 400], [1440, 440]].forEach(([x, w]) => { let s = R(x, 280, w, 580, "#7b8499", 4); for (let y = 300; y < 860; y += 36) s += `<path d="M${x},${y} L${x + w},${y}" stroke="${INK}" stroke-width="4"/>`; b += cut(s + R(x, 240, w, 50, "#56606f", 4)); });
      let es = `<path d="M560,860 L1360,360 L1440,360 L1440,420 L640,920Z" fill="#56606f" ${st}/>`; for (let i = 0; i < 14; i++) es += `<path d="M${580 + i * 56},${850 - i * 35} L${620 + i * 56},${875 - i * 35}" stroke="${INK}" stroke-width="5"/>`;
      b += cut(es) + `<path d="M560,760 L1360,260" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M560,760 L1360,260" stroke="${n ? "#7fd0f0" : "#8d9199"}" stroke-width="10" stroke-linecap="round"/>` + `<path d="M1360,260 Q1500,160 1800,150" fill="none" stroke="${INK}" stroke-width="14" opacity=".4"/>`;
      if (n) b += halo(960, 510, 300, "#7fd0f0", 0.22) + halo(1300, 290, 180, "#7fd0f0", 0.2) + halo(660, 700, 180, "#7fd0f0", 0.2);
      b += `<g class="pass">${R(1500, 600, 60, 8, "#8d9199", 0, "")}</g>`;
      return { back: b };
    },

    // ---- batch 4 ----
    // A football stadium. view: field (wide: the screen and a crowd of tiny phone lights) | stands (two seats close, rows behind). Floodlight towers; the phones in the crowd.
    stadium(o) {
      const n = o.night !== false, st2 = o.view === "stands", r = rng(77); let b = R(0, 0, 1920, 1080, n ? "#141a3c" : "#9fd3e8", 0, "");
      if (n) for (let i = 0; i < 30; i++) b += `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 200).toFixed(0)}" r="${(2 + r() * 2).toFixed(1)}" fill="#f6f1e4"/>`;
      b += cut(R(660, 120, 600, 280, INK, 12) + R(680, 140, 560, 240, n ? "#2c5a7a" : "#3d6a8a", 6, "") + `<path d="M720,320 L840,230 L940,290 L1060,200 L1200,260" fill="none" stroke="#7fd0f0" stroke-width="8" opacity=".6"/>`) + (n ? halo(960, 260, 420, "#7fd0f0", 0.2) : "");
      b += `<path d="M0,500 L1920,500 L1920,1080 L0,1080Z" fill="${n ? "#1f2a52" : "#6b7388"}" ${st}/>`;
      if (!st2) { b += `<path d="M300,880 L1620,880 L1760,1080 L160,1080Z" fill="${n ? "#2b7a4a" : "#46a86a"}" ${st}/>` + `<path d="M960,880 L960,1080" stroke="#f6f1e4" stroke-width="8"/>`; for (let i = 0; i < 160; i++) { const x = 20 + r() * 1880, y = 520 + r() * 330, on = r() > 0.4; b += `<circle class="${i % 4 === 0 ? "tick" : ""}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + (y - 520) / 110).toFixed(1)}" fill="${on ? "#eaf4ff" : "#0c1026"}" opacity="${on ? 0.9 : 0.8}"/>`; } }
      else { for (let i = 0; i < 4; i++) { const y = 520 + i * 100; b += R(0, y, 1920, 90, i % 2 ? "#2a3466" : "#232c58", 0, ""); for (let x = 20 + (i % 2) * 40; x < 1920; x += 80) b += `<circle class="${(x / 80 + i) % 5 === 0 ? "tick" : ""}" cx="${x}" cy="${y + 10}" r="${10 + i * 3}" fill="${r() > 0.5 ? "#eaf4ff" : "#0c1026"}" opacity=".85"/>`; }
        b += cut([420, 1000].map((x) => R(x, 700, 300, 230, "#e0262b", 40) + R(x, 880, 300, 200, "#b81d22", 0) + R(x + 20, 560, 260, 160, "#e0262b", 40)).join("")); }
      [[120, 160], [1800, 160]].forEach(([x, y]) => { b += cut(R(x - 10, y, 20, 560, "#56606f", 4) + R(x - 90, y - 40, 180, 90, "#3d4a5c", 8) + [0, 1, 2].map((i) => `<circle cx="${x - 50 + i * 50}" cy="${y + 5}" r="16" fill="${n ? "#fff6d8" : "#d8dde6"}" ${st} stroke-width="4"/>`).join("")) + (n ? halo(x, y + 5, 300, "#fff6d8", 0.3) : ""); });
      return { back: b };
    },

    // A laboratory: benches with beakers and flasks, a fume hood, shelves of bottles. One lab lamp on an arm.
    lab(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 830, n ? "#2c3652" : "#e3ebef", 0, "") + R(0, 830, 1920, 250, n ? "#2a2f48" : "#b9c3c9", 0, "") + floorLine(830);
      for (let y = 0; y < 830; y += 80) for (let x = 0; x < 1920; x += 80) b += R(x, y, 80, 80, "rgba(0,0,0,0)", 0, `stroke="rgba(27,29,54,.1)" stroke-width="3"`);
      let sh = ""; for (let k = 0; k < 2; k++) { sh += R(160, 250 + k * 170, 560, 16, "#8a5a3c", 4); for (let i = 0; i < 7; i++) sh += R(180 + i * 76, 170 + k * 170, 48, 80, ["#1fa85b", "#e8a317", "#7fd0f0", "#c95f8d"][(i + k) % 4] + "", 10); } b += cut(sh);
      b += cut(R(1160, 150, 560, 540, "#c9ced6", 8) + R(1190, 330, 500, 300, n ? "#9fb8c8" : "#bfe0ea", 6) + R(1190, 280, 500, 40, "#8d9199", 4) + R(1230, 190, 120, 60, "#56606f", 6));
      b += cut(R(100, 640, 1000, 40, "#56606f", 6) + R(130, 680, 940, 150, "#7b8499", 0) + `<path d="M600,680 L600,830" ${st}/>`) + cut(R(1180, 700, 540, 40, "#56606f", 6) + R(1210, 740, 480, 90, "#7b8499", 0));
      const flask = (x, y, c) => cut(`<path d="M${x - 14},${y - 120} L${x + 14},${y - 120} L${x + 14},${y - 70} L${x + 50},${y - 4} Q${x + 54},${y} ${x + 46},${y} L${x - 46},${y} Q${x - 54},${y} ${x - 50},${y - 4} L${x - 14},${y - 70}Z" fill="rgba(190,232,222,.7)" ${st}/><path d="M${x - 44},${y - 12} L${x + 44},${y - 12} L${x + 24},${y - 50} L${x - 24},${y - 50}Z" fill="${c}"/>`);
      b += flask(300, 640, "#1fa85b") + flask(430, 640, "#e8a317") + flask(780, 640, "#7fd0f0") + cut(R(900, 540, 80, 100, "rgba(190,232,222,.7)", 10) + R(906, 590, 68, 44, "#c95f8d", 6, ""));
      b += cut(R(1480, 680, 40, 20, "#56606f", 6) + `<path d="M1500,680 L1440,560 L1360,520" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M1500,680 L1440,560 L1360,520" fill="none" stroke="#c9ced6" stroke-width="6" stroke-linecap="round"/><path d="M1320,500 L1400,520 L1380,560 L1330,540Z" fill="#e8a317" ${st}/>`);
      if (n) b += halo(1360, 540, 150, "#fff6d8", 0.3) + beam(1360, 540, 60, 420, 180, "#fff6d8", 0.24) + pool(1250, 710, 420, 36, "#fff6d8", 0.26);
      return { back: b };
    },

    // A scrapyard: a heap of crushed cans and drums, a crane with a magnet. One crane light from above.
    scrapyard(o) {
      const n = o.night !== false, r = rng(63); let b = R(0, 0, 1920, 860, n ? "#1d2144" : "#cfd3dc", 0, "") + R(0, 860, 1920, 220, n ? "#3a3438" : "#8a7f70", 0, "") + floorLine(860);
      b += skyline(0, 1920, 560, r, n ? ["#1c2340", "#232c54"] : ["#9db7d1", "#7f9fc0"], false);
      let heap = ""; for (let i = 0; i < 70; i++) { const x = 180 + r() * 960, y = 860 - r() * 330 * (1 - Math.abs(x - 660) / 560) - 20; if (y > 860) continue; heap += `<g transform="rotate(${(r() * 90 - 45).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})">${R(x - 30, y - 20, 60, 44, ["#9aa0b4", "#c9ced6", "#e0262b", "#7fd0f0", "#8d9199", "#3d4a5c"][i % 6], 8, `stroke="${INK}" stroke-width="5"`)}</g>`; }
      b += cut(`<path d="M120,870 Q660,330 1200,870Z" fill="#5b5f72" ${st}/>`) + heap;
      b += cut(R(1500, 180, 40, 690, "#e8a317", 4) + `<path d="M1520,200 L900,150 L880,200 L1520,260Z" fill="#e8a317" ${st}/><path d="M920,180 L920,420" stroke="${INK}" stroke-width="7"/><circle cx="920" cy="450" r="50" fill="#56606f" ${st}/>` + R(1440, 640, 160, 100, "#3d4a5c", 10) + R(1380, 860, 280, 30, "#56606f", 6));
      if (n) b += cut(R(1380, 120, 80, 50, "#3d4a5c", 8)) + beam(1420, 170, 70, 900, 700, "#fff1b0", 0.15) + halo(1420, 150, 220, "#fff1b0", 0.3) + pool(1000, 920, 540, 50, "#fff1b0", 0.16);
      return { back: b };
    },

    // The road at night. dress: highway (empty road to the horizon, a courthouse far away) | racetrack (pit wall, kerbs, grandstand shapes). Headlights (racetrack: one row of track lights).
    night_road(o) {
      const n = o.night !== false, track = o.dress === "racetrack", r = rng(71); let b = R(0, 0, 1920, 700, n ? "#161b3c" : "#bfe0ea", 0, "");
      if (n) for (let i = 0; i < 40; i++) b += `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(2 + r() * 3).toFixed(1)}" fill="#f6f1e4"/>`;
      if (!track) {
        b += `<path d="M0,700 L1920,700 L1920,1080 L0,1080Z" fill="${n ? "#1d2030" : "#6b7388"}" ${st}/>` + `<path d="M820,700 L1100,700 L1700,1080 L220,1080Z" fill="#3d4252" ${st}/>`;
        for (let i = 0; i < 6; i++) { const y = 720 + i * i * 12, h = 14 + i * 12; b += `<path d="M${960 - 6 - i * 3},${y} L${960 + 6 + i * 3},${y} L${960 + 8 + i * 5},${y + h} L${960 - 8 - i * 5},${y + h}Z" fill="#f0b429"/>`; }
        b += cut(R(900, 590, 120, 110, "#7b8499", 2) + `<path d="M890,590 L960,540 L1030,590Z" fill="#8d9199" ${st}/>` + R(940, 540, 40, 8, INK, 0, "")) + R(912, 620, 20, 28, n ? "#ffe14d" : "#bfe0ea", 0, "") + R(988, 620, 20, 28, n ? "#ffe14d" : "#bfe0ea", 0, "");
        if (n) b += beam(700, 1080, 160, 20, -420, "#fff1b0", 0.26) + beam(1220, 1080, 160, 20, -420, "#fff1b0", 0.26) + halo(700, 1060, 160, "#fff1b0", 0.3) + halo(1220, 1060, 160, "#fff1b0", 0.3);
      } else {
        b += cut(`<path d="M80,620 L420,520 L760,620 L1100,520 L1440,620 L1840,520 L1920,700 L0,700Z" fill="${n ? "#232c58" : "#9aa4c0"}" ${st}/>`); for (let i = 0; i < 80; i++) b += `<circle cx="${60 + i * 24}" cy="${590 - (i % 5) * 20 - Math.abs(Math.sin(i / 7)) * 60}" r="5" fill="${n ? "#eaf4ff" : "#d8dde6"}" opacity=".7"/>`;
        b += R(0, 700, 1920, 380, n ? "#2a2d3d" : "#6b7388", 0, "") + floorLine(700);
        for (let x = 0; x < 1920; x += 120) b += R(x, 700, 60, 30, "#e0262b", 0, "") + R(x + 60, 700, 60, 30, "#f6f1e4", 0, "");
        b += cut(R(0, 860, 1920, 220, "#c9ced6", 0) + R(0, 830, 1920, 40, "#e0262b", 0));
        for (let i = 0; i < 6; i++) b += cut(R(180 + i * 300, 80, 16, 340, "#56606f", 4) + R(140 + i * 300, 60, 96, 36, "#3d4a5c", 6)) + (n ? halo(188 + i * 300, 80, 150, "#fff6d8", 0.28) : "");
      }
      return { back: b };
    },

    // A courtroom: the judge's bench, a witness box, a jury box in shadow, plain flags. One lamp on the bench.
    courtroom(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 840, n ? "#4a3326" : "#8a5a3c", 0, "") + R(0, 840, 1920, 240, n ? "#2a2c40" : "#6f452c", 0, "") + floorLine(840);
      for (let x = 0; x < 1920; x += 140) b += `<path d="M${x},0 L${x},840" stroke="rgba(27,29,54,.4)" stroke-width="7"/>`;
      b += cut(R(580, 360, 760, 480, "#6f452c", 8) + R(560, 340, 800, 40, "#a5714d", 8) + R(600, 420, 330, 380, "rgba(27,29,54,.2)", 4, "") + R(990, 420, 330, 380, "rgba(27,29,54,.2)", 4, ""));
      b += cut(R(1440, 540, 360, 300, "#8a5a3c", 8) + R(1440, 520, 360, 30, "#a5714d", 8)) + cut(R(60, 520, 420, 320, n ? "#3a2a20" : "#6f452c", 8) + [0, 1, 2, 3].map((i) => R(90 + i * 100, 540, 80, 110, n ? "#2c1f18" : "#5b3a22", 14)).join(""));
      [[520, "#2c3766"], [1400, "#e8a317"]].forEach(([x, c]) => { b += cut(R(x, 120, 12, 700, "#c9a36b", 4) + `<path d="M${x + 12},140 Q${x + 80},120 ${x + 150},170 L${x + 150},300 Q${x + 80},270 ${x + 12},300Z" fill="${c}" ${st}/>`); });
      b += cut(R(920, 300, 80, 44, "#e8a317", 8) + R(956, 340, 10, 24, "#56606f", 2)) ;
      if (n) b += halo(960, 310, 300, "#ffe0a0", 0.32) + beam(960, 330, 80, 640, 500, "#ffe0a0", 0.14) + pool(960, 860, 520, 36, "#ffe0a0", 0.2);
      return { back: b };
    },

    // ---- batch 5 ----
    // A stairwell seen from the side, landings going down into the dark. One bulb per landing (`bulbs: n`, default 4), the bottom landing brightest.
    stairwell(o) {
      const n = o.night !== false, k = Math.max(2, Math.min(6, o.bulbs || 4)); let b = R(0, 0, 1920, 1080, n ? "#1e2240" : "#cfd3dc", 0, "") + R(0, 0, 150, 1080, n ? "#2a2f52" : "#b9bec9", 0, "") + R(1770, 0, 150, 1080, n ? "#2a2f52" : "#b9bec9", 0, "");
      const step = Math.min(210, 820 / (k - 1)), lights = [];
      for (let i = 0; i < k; i++) { const y = 150 + i * step, left = i % 2 === 0, x0 = left ? 150 : 1020, w = 750;
        b += cut(R(x0, y, w, 26, "#8d9199", 0) + R(x0, y + 26, w, 14, "#56606f", 0));
        if (i < k - 1) { const nx = left ? x0 + w : x0, ex = left ? 1770 : 150; b += cut(`<path d="M${left ? x0 + w - 330 : x0 + 330},${y + 40} L${left ? 1770 : 150},${y + step} L${left ? 1770 : 150},${y + step + 26} L${left ? x0 + w - 300 : x0 + 300},${y + 66}Z" fill="#7b8499" ${st}/>`); void nx; void ex; }
        b += `<path d="M${x0},${y} L${x0},${y - 90} M${x0 + w},${y} L${x0 + w},${y - 90}" stroke="${INK}" stroke-width="7"/>`;
        lights.push([left ? x0 + 250 : x0 + w - 250, y, i]); }
      lights.forEach(([x, y, i]) => { const bright = 0.18 + 0.2 * (i / (k - 1)); b += hang(x, y - 130, 40, n, "#fff1b0") + (n ? pool(x, y + 10, 140 + i * 40, 20 + i * 4, "#fff1b0", bright) : ""); });
      b += `<path d="M150,${150 + (k - 1) * step + 40} L1770,${150 + (k - 1) * step + 40}" ${st}/>`;
      return { back: b };
    },

    // A platform edge, a train with lit windows pulling out, a station clock (no numbers). One platform lamp.
    train_platform(o) {
      const n = o.night !== false; let b = R(0, 0, 1920, 1080, n ? "#161b3c" : "#bfe0ea", 0, "") + R(0, 700, 1920, 380, n ? "#2a2d3d" : "#8d9199", 0, "") + R(0, 960, 1920, 120, n ? "#3a3d4c" : "#a7acb8", 0, "") + R(0, 940, 1920, 20, "#f0b429", 0, "") + floorLine(700);
      let tr = R(-400, 360, 6000, 340, "#c9ced6", 24) + R(-400, 540, 6000, 40, "#e0262b", 0, ""); for (let x = -300; x < 5600; x += 300) tr += R(x, 400, 190, 130, n ? "#fff1b0" : "#7fb8d0", 14) + R(x + 230, 400, 10, 290, INK, 0, "");
      b += `<g class="pass">${cut(tr)}${[...Array(20)].map((_, i) => `<circle cx="${-200 + i * 300}" cy="700" r="40" fill="${INK}"/>`).join("")}</g>`;
      b += cut(`<circle cx="1500" cy="260" r="90" fill="#f6f1e4" ${st}/><path d="M1500,260 L1500,200 M1500,260 L1550,280" ${st} stroke-width="9"/><path d="M1500,350 L1500,700" ${st} stroke-width="14"/>`);
      b += cut(R(330, 200, 18, 560, "#56606f", 4) + R(290, 170, 100, 44, "#3d4a5c", 8)) + (n ? halo(340, 205, 340, "#fff6d8", 0.3) + beam(340, 214, 80, 460, 600, "#fff6d8", 0.12) + pool(340, 900, 380, 40, "#fff6d8", 0.2) : "");
      return { back: b };
    },

    // A desk seen from straight above: wood grain, a blotter, the pool of a lamp. Made for document cards (`doc`) and a hand stamping.
    desk_top(o) {
      const n = o.night !== false, r = rng(17), P = pal(o, SET_PALETTE.desk_top, n); let b = R(0, 0, 1920, 1080, P.wall, 0, "");
      for (let y = 20; y < 1080; y += 46) b += `<path d="M0,${y} Q${400 + r() * 400},${y + (r() * 20 - 10)} ${960 + r() * 200},${y} T1920,${y}" fill="none" stroke="rgba(27,29,54,.22)" stroke-width="${3 + (y % 3)}"/>`;
      b += cut(R(300, 130, 1320, 820, n ? "#2f4a3a" : "#3f7a5a", 14) + R(330, 160, 1260, 760, "rgba(255,255,255,.04)", 8, ""));
      b += cut(R(60, 60, 200, 60, "#c9ced6", 8) + R(1700, 900, 120, 120, "#e8dcc0", 16));
      if (n) b += pool(960, 540, 820, 470, "#ffe9b0", 0.3); else b += R(0, 0, 1920, 1080, "rgba(255,255,255,.04)", 0, "");
      return { back: b };
    },
  };

  // Static props appear with the shot; give them "at" (or a cue) to make them land later.
  function pop(tl, el, o, t0) { if (o.at == null) return; const b = el.getBBox ? null : null; void b; el.style.opacity = 0; gsap.set(el, { svgOrigin: o.x + " " + o.y, smoothOrigin: false });
    tl.fromTo(el, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)", immediateRender: false }, t0 + o.at); }

  /* ---- world props: drawn in the scene, moved by the camera ---- */
  const PROPS = {
    // { type:"bars", x, y, w, h, items:[{label, val, color, show}], title }
    bars: {
      draw(o) { const n = o.items.length, max = o.max || Math.max(...o.items.map((i) => i.val)), bw = Math.min(220, (o.w - 40) / n - 40), gap = (o.w - n * bw) / (n + 1); let s = "";
        if (o.title) s += T(o.x, o.y - 34, o.title, 58, INK, "start");
        o.items.forEach((it, i) => { const h = Math.max(8, (it.val / max) * (o.h - 90)), x = o.x + gap + i * (bw + gap), y = o.y + o.h - h;
          s += `<g class="bar cut">${R(x, y, bw, h, it.color || "#3d6fb6", 6)}</g>` + `<g class="bv">${T(x + bw / 2, y - 22, it.show || it.val, 64, it.color || INK)}</g>` + T(x + bw / 2, o.y + o.h + 62, it.label, 44, INK); });
        return s + `<path d="M${o.x},${o.y + o.h} L${o.x + o.w},${o.y + o.h}" ${st} stroke-width="9"/>`; },
      play(tl, el, o, t0) { const base = o.y + o.h; gsap.set(el.querySelectorAll(".bar"), { svgOrigin: "0 " + base, smoothOrigin: false });
        el.querySelectorAll(".bar").forEach((b, i) => tl.fromTo(b, { scaleY: 0.001 }, { scaleY: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t0 + (o.at || 0.2) + i * (o.stagger || 0.45)));
        el.querySelectorAll(".bv").forEach((b, i) => { b.style.opacity = 0; tl.fromTo(b, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, immediateRender: false }, t0 + (o.at || 0.2) + i * (o.stagger || 0.45) + 0.4); }); },
    },
    // { type:"line", x, y, w, h, pts:[numbers], color, title, label }
    line: {
      draw(o) { const max = Math.max(...o.pts), min = Math.min(...o.pts), n = o.pts.length, px = (i) => o.x + (i / (n - 1)) * o.w, py = (v) => o.y + o.h - ((v - min) / (max - min || 1)) * o.h;
        const d = o.pts.map((v, i) => (i ? "L" : "M") + px(i).toFixed(1) + "," + py(v).toFixed(1)).join(" "); let len = 0;
        for (let i = 1; i < n; i++) len += Math.hypot(px(i) - px(i - 1), py(o.pts[i]) - py(o.pts[i - 1]));
        return (o.title ? T(o.x, o.y - 40, o.title, 58, INK, "start") : "") + `<path d="M${o.x},${o.y + o.h + 20} L${o.x + o.w},${o.y + o.h + 20}" ${st}/>` +
          `<path class="ln" data-len="${len.toFixed(0)}" d="${d}" fill="none" stroke="${o.color || "#e0262b"}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len.toFixed(0)}"/>` +
          `<g class="dot"><circle cx="${px(n - 1)}" cy="${py(o.pts[n - 1])}" r="22" fill="${o.color || "#e0262b"}" ${st}/>${o.label ? T(px(n - 1) - 30, py(o.pts[n - 1]) + (o.pts[n - 1] < o.pts[0] ? 96 : -44), o.label, 78, o.color || "#e0262b", "end") : ""}</g>`; },
      play(tl, el, o, t0) { const p = el.querySelector(".ln"), len = +p.dataset.len, dot = el.querySelector(".dot"), d = o.dur || 1.6; dot.style.opacity = 0; gsap.set(dot, { transformOrigin: "50% 50%", smoothOrigin: false });
        tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease: "power1.in", immediateRender: false }, t0 + (o.at || 0.2));
        tl.fromTo(dot, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", immediateRender: false }, t0 + (o.at || 0.2) + d); },
    },
    // { type:"note", x, y, w, amount:"$100", slice:0.52, sliceLabel:"$52" }: a banknote with one part cut away
    note: {
      draw(o) { const w = o.w || 900, h = w * 0.42, cutx = o.x + w * (1 - (o.slice || 0.5));
        const body = (x0, x1, fill, id) => `<g class="${id} cut"><path d="M${x0},${o.y} L${x1},${o.y} L${x1},${o.y + h} L${x0},${o.y + h}Z" fill="${fill}" ${st}/></g>`;
        return body(o.x, cutx, "#cfe6c8", "keep") + `<g class="keept"><circle cx="${o.x + (cutx - o.x) / 2}" cy="${o.y + h / 2}" r="${h * 0.3}" fill="#bfe8cf" ${st}/>${T(o.x + (cutx - o.x) / 2, o.y + h / 2 + 34, o.amount || "$100", 100)}</g>` +
          `<g class="slice">${body(cutx, o.x + w, "#ff8f85", "sl")}${T(cutx + (o.x + w - cutx) / 2, o.y + h / 2 + 40, o.sliceLabel || "", 120, "#8f1218")}</g>` +
          `<path class="snip" d="M${cutx},${o.y - 30} L${cutx},${o.y + h + 30}" stroke="${INK}" stroke-width="7" stroke-dasharray="18 14"/>`; },
      play(tl, el, o, t0) { const s = el.querySelector(".slice"), t = t0 + (o.at || 1); gsap.set(s, { transformOrigin: "0% 100%", smoothOrigin: false });
        tl.fromTo(s, { x: 0, y: 0, rotation: 0 }, { x: 90, y: 46, rotation: 5, duration: 0.45, ease: "back.out(1.4)", immediateRender: false }, t); },
    },
    // { type:"tower", x, y, blocks:[{t, color, at}], tilt }: a stack that leans more as blocks are added (a reusable motif)
    tower: {
      draw(o) { const bw = o.bw || 300, bh = o.bh || 96; let s = `<g class="tw">` + R(o.x - bw / 2 - 50, o.y, bw + 100, 26, INK, 8, "");
        o.blocks.forEach((b, i) => { const x = o.x - bw / 2 + ((i % 2) * 2 - 1) * 14 * (i ? 1 : 0), y = o.y - (i + 1) * bh;
          s += `<g class="blk cut">${R(x, y, bw, bh - 6, b.color || "#e8a317", 10)}${T(x + bw / 2, y + bh / 2 + 18, b.t, 50)}</g>`; });
        return s + "</g>"; },
      play(tl, el, o, t0) { const tw = el.querySelector(".tw"), tilt = o.tilt || 0; gsap.set(tw, { svgOrigin: o.x + " " + o.y, smoothOrigin: false });
        el.querySelectorAll(".blk").forEach((b, i) => { const at = o.blocks[i].at; if (at == null) return; b.style.opacity = 0;
          tl.fromTo(b, { y: -700, opacity: 1 }, { y: 0, opacity: 1, duration: 0.34, ease: "bounce.out", immediateRender: false }, t0 + at); });
        if (tilt) tl.fromTo(tw, { rotation: tilt * 0.4 }, { rotation: tilt, duration: 0.9, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, t0); },
    },
    // { type:"banner", x, y, w, t, color, ink }: a cloth banner hung by two cords (x, y = top middle)
    banner: { draw(o) { const w = o.w || 700, h = o.h || 150, size = Math.min(h * 0.62, (w * 1.75) / Math.max(4, String(o.t).length));
        return cut(`<path d="M${o.x - w / 2 + 30},${o.y - 90} L${o.x - w / 2 + 30},${o.y} M${o.x + w / 2 - 30},${o.y - 90} L${o.x + w / 2 - 30},${o.y}" ${st}/>` +
          `<path d="M${o.x - w / 2},${o.y} L${o.x + w / 2},${o.y} L${o.x + w / 2 - 14},${o.y + h} Q${o.x},${o.y + h + 22} ${o.x - w / 2 + 14},${o.y + h}Z" fill="${o.color || "#3d6fb6"}" ${st}/>`) + T(o.x, o.y + h / 2 + size * 0.36, o.t, size, o.ink || "#f6f1e4"); },
      play: pop },
    // { type:"podium", x, y, t, layer:"front" }: a lectern with a plaque; put it in front so the speaker stands behind it
    podium: { draw(o) { return cut(`<path d="M${o.x - 130},${o.y - 250} L${o.x + 130},${o.y - 250} L${o.x + 104},${o.y} L${o.x - 104},${o.y}Z" fill="#8a5a3c" ${st}/>` + R(o.x - 150, o.y - 282, 300, 36, "#6f452c", 8) +
        (o.t ? `<circle cx="${o.x}" cy="${o.y - 140}" r="62" fill="#1f2a44" ${st}/>` + T(o.x, o.y - 128, o.t, Math.min(34, 200 / Math.max(3, String(o.t).length)), "#f6f1e4") : "")); }, play: pop },
    // { type:"bunting", x, y, w }: party flags
    bunting: { draw(o) { const w = o.w || 1920, x0 = o.x || 0, cols = ["#e0262b", "#f0b429", "#7fd0f0", "#1fa85b", "#c95f8d"]; let s = `<path d="M${x0},${o.y} Q${x0 + w / 2},${o.y + 70} ${x0 + w},${o.y}" fill="none" ${st}/>`;
        for (let i = 0; i < Math.floor(w / 110); i++) { const u = (i + 0.5) / Math.floor(w / 110), x = x0 + u * w, y = o.y + 70 * 4 * u * (1 - u) * 0.5; s += `<path d="M${x - 36},${y} L${x + 36},${y} L${x},${y + 78}Z" fill="${cols[i % 5]}" ${st}/>`; }
        return s; }, play: pop },
    // { type:"crates", x, y, n, t }: a pile of n labelled crates (x, y = bottom middle)
    crates: { draw(o) { const n = o.n || 3, w = o.w || 190, h = w * 0.72; let s = "", k = 0;
        for (let row = 0; k < n; row++) { const cols = Math.min(n - k, Math.max(1, Math.ceil(Math.sqrt(n)) - row)); for (let c = 0; c < cols; c++, k++) { const x = o.x - (cols * (w + 8)) / 2 + c * (w + 8), y = o.y - (row + 1) * (h + 4);
          s += `<g class="blk cut">${R(x, y, w, h, o.color || "#d2a56d", 6)}${R(x + w / 2 - 14, y, 28, h * 0.3, "rgba(27,29,54,.2)", 0, "")}${o.t ? T(x + w / 2, y + h * 0.78, o.t, Math.min(h * 0.34, (w * 1.5) / Math.max(3, String(o.t).length))) : ""}</g>`; } }
        return s; }, play: pop },
    // { type:"stall", x, y, t, price, color, layer:"front" }: a shop counter with an awning (x, y = bottom middle); in front, a figure stands behind it
    stall: { draw(o) { const c = o.color || "#e0262b"; let aw = ""; for (let i = 0; i < 6; i++) aw += `<path d="M${o.x - 240 + i * 80},${o.y - 720} L${o.x - 160 + i * 80},${o.y - 720} L${o.x - 160 + i * 80},${o.y - 650} Q${o.x - 200 + i * 80},${o.y - 618} ${o.x - 240 + i * 80},${o.y - 650}Z" fill="${i % 2 ? "#f6f1e4" : c}" ${st}/>`;
        return cut(R(o.x - 232, o.y - 700, 16, 500, "#8a5a3c", 0) + R(o.x + 216, o.y - 700, 16, 500, "#8a5a3c", 0) + aw + R(o.x - 240, o.y - 190, 480, 190, "#c99a5b", 8) + R(o.x - 260, o.y - 214, 520, 34, "#8a5a3c", 8) +
          `<g transform="rotate(-3 ${o.x} ${o.y - 100})">${R(o.x - 180, o.y - 150, 360, 96, "#f6f1e4", 6)}${T(o.x, o.y - 80, o.t || "OPEN", Math.min(64, 560 / Math.max(4, String(o.t || "OPEN").length)))}</g>`) +
          (o.price ? `<g class="cut" transform="rotate(8 ${o.x + 250} ${o.y - 330})"><path d="M${o.x + 180},${o.y - 372} L${o.x + 330},${o.y - 372} L${o.x + 366},${o.y - 330} L${o.x + 330},${o.y - 288} L${o.x + 180},${o.y - 288}Z" fill="#ffe14d" ${st}/>${T(o.x + 258, o.y - 308, o.price, 58, "#e0262b")}</g>` : ""); }, play: pop },
    // { type:"pricetag", x, y, t, rot, color }: a number that lives in the scene, tied to the thing it prices
    pricetag: { draw(o) { const w = String(o.t).length * 46 + 120; return `<g class="cut" transform="rotate(${o.rot == null ? -6 : o.rot} ${o.x} ${o.y})"><path d="M${o.x - w / 2},${o.y - 58} L${o.x + w / 2 - 40},${o.y - 58} L${o.x + w / 2},${o.y} L${o.x + w / 2 - 40},${o.y + 58} L${o.x - w / 2},${o.y + 58}Z" fill="${o.color || "#ffe14d"}" ${st}/>` +
        `<circle cx="${o.x + w / 2 - 44}" cy="${o.y}" r="11" fill="${INK}"/><g class="pt1">${T(o.x - 26, o.y + 30, o.t, 84, o.ink || "#e0262b")}</g>` +
        (o.tear != null ? `<g class="pt2" style="opacity:0">${T(o.x - 26, o.y + 30, o.after || "", 84, o.ink || "#e0262b")}</g><path class="pstrip" d="M${o.x + w / 2 - 110},${o.y - 58} L${o.x + w / 2 - 40},${o.y - 58} L${o.x + w / 2},${o.y} L${o.x + w / 2 - 40},${o.y + 58} L${o.x + w / 2 - 110},${o.y + 58}Z" fill="#e8e2cf" ${st}/>` : "") +
        (o.flip != null ? `<path class="pcov" d="M${o.x - w / 2},${o.y - 58} L${o.x + w / 2 - 40},${o.y - 58} L${o.x + w / 2},${o.y} L${o.x + w / 2 - 40},${o.y + 58} L${o.x - w / 2},${o.y + 58}Z" fill="#c9a36b" ${st}/>` : "") + `</g>`; },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const q = (s) => el.querySelector(s);
        if (o.flip != null) { const c = q(".pcov"), t = t0 + o.flip; gsap.set(c, { transformOrigin: "50% 50%", smoothOrigin: false }); tl.fromTo(c, { scaleX: 1 }, { scaleX: 0, duration: 0.14, ease: "none", immediateRender: false }, t); tl.set(c, { opacity: 0 }, t + 0.14); }
        if (o.tear != null) { const s = q(".pstrip"), t = t0 + o.tear; gsap.set(s, { transformOrigin: "50% 50%", smoothOrigin: false }); tl.to(s, { x: 120, y: -150, rotation: 55, opacity: 0, duration: 0.9, ease: "power1.in" }, t); tl.set(q(".pt1"), { opacity: 0 }, t + 0.1); tl.set(q(".pt2"), { opacity: 1 }, t + 0.1); } } },
    // { type:"cashpile", x, y, n }: n bundles of notes (x, y = bottom middle); a pile people can see instead of a number they must imagine
    cashpile: { draw(o) { const n = o.n || 6, per = Math.max(1, Math.ceil(Math.sqrt(n))); let s = "";
        for (let i = 0; i < n; i++) { const col = i % per, row = Math.floor(i / per), x = o.x - (per * 128) / 2 + col * 128 + (row % 2) * 12, y = o.y - (row + 1) * 46;
          s += `<g class="blk">${R(x, y, 120, 42, "#1fa85b", 6)}${R(x + 46, y, 28, 42, "#f6f1e4", 0, `stroke="${INK}" stroke-width="5"`)}</g>`; }
        return cut(s); }, play: pop },
    // { type:"piggy", x, y, k, state }: the channel's hidden piggy bank. Tuck one small into a corner of a scene now and then: viewers hunt for it.
    //   state: "calm" | "cracked" (bad news) | "asleep" (night) | "rich" (good news, sunglasses)
    piggy: { draw(o) { const k = o.k || 0.5, st2 = o.state || "calm", eye = st2 === "asleep" ? `<path d="M34,-92 Q44,-84 54,-92" fill="none" ${st}/>` : st2 === "rich" ? R(14, -108, 70, 26, INK, 8, "") : `<circle cx="44" cy="-92" r="9" fill="${INK}"/>`;
        return `<g class="cut" transform="translate(${o.x},${o.y}) scale(${o.flip ? -k : k},${k})">` + R(-78, -34, 30, 38, "#e58fa2", 8) + R(40, -34, 30, 38, "#e58fa2", 8) +
          `<ellipse cx="0" cy="-84" rx="112" ry="78" fill="#f4a9b8" ${st}/><path d="M-30,-150 L-4,-186 L16,-148Z" fill="#f4a9b8" ${st}/>` + R(-26, -164, 52, 12, INK, 6, "") + `<ellipse cx="104" cy="-78" rx="30" ry="24" fill="#e58fa2" ${st}/><circle cx="96" cy="-78" r="5" fill="${INK}"/><circle cx="112" cy="-78" r="5" fill="${INK}"/>` +
          `<path d="M-110,-94 Q-146,-110 -132,-76" fill="none" ${st}/>` + eye + (st2 === "cracked" ? `<path d="M-40,-158 L-22,-118 L-46,-96 L-18,-60" fill="none" ${st}/>` : "") + (st2 === "asleep" ? T(96, -170, "z", 70, INK) : "") + `</g>`; }, play: pop },
    // { type:"sign", x, y, t, size, rot, color }
    sign: {
      draw(o) { const size = o.size || 70, w = String(o.t).length * size * 0.5 + 70;
        return `<g class="cut" transform="rotate(${o.rot || -3} ${o.x} ${o.y})">${R(o.x - w / 2, o.y - size, w, size * 1.5, o.color || "#f6f1e4", 6)}${T(o.x, o.y + size * 0.14, o.t, size, o.ink || INK)}</g>`; },
      play(tl, el, o, t0) { if (o.at == null) return; el.style.opacity = 0; gsap.set(el, { svgOrigin: o.x + " " + o.y, smoothOrigin: false });
        tl.fromTo(el, { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power4.in", immediateRender: false }, t0 + o.at); },
    },

    /* { type:"tent", x, y, w, flag, ropes, frayed, tilt, crowd, night, inside, small, flap, ghost, sag, jacket, spare, poleOnly, grow:[{cue,word,k}], snap:{cue,word} }
       The anchor motif: a striped circus tent with ONE centre pole (x, y = bottom middle). */
    tent: {
      draw(o) {
        const w = o.w || 1000, x = o.x, y = o.y, night = !!o.night, small = !!o.small, c1 = night ? "#2c3766" : "#e0262b", c2 = night ? "#44538f" : "#f6f1e4", pw = Math.max(14, w * 0.016), pc = "#d9c9a3";
        const stripe = (i) => (i % 2 ? c2 : c1), bulbs = (pts, rr) => `<g class="bulbs">${pts.map((p, i) => `<circle class="bulb" cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="${rr}" fill="${i % 2 ? "#ffe14d" : "#ffb347"}" stroke="${INK}" stroke-width="3"/>`).join("")}</g>`;
        const fit = (t, mw, size) => Math.min(size, mw / (Math.max(3, String(t).length) * 0.58));
        const flag = (fx, fy, size, text) => { const fw = String(text).length * size * 0.58 + 36, fh = size * 1.5;
          return `<g class="flag"><path d="M${fx},${fy} L${fx + fw},${fy} L${fx + fw - 16},${fy + fh / 2} L${fx + fw},${fy + fh} L${fx},${fy + fh}Z" fill="#ffe14d" ${st}/>${T(fx + 12 + (fw - 36) / 2 + 6, fy + fh / 2 + size * 0.34, text, size, INK)}</g>`; };
        let s = "", crowd = "", spare = "";
        if (o.inside) {
          const apex = -60, ey = 330, wall = night ? "#1a2146" : "#8f1b22", n = 16; let can = R(x - 3000, -600, 6000, y + 1500, night ? "#232c54" : "#b81f26", 0, ""), pts = [];
          for (let i = 0; i < n; i++) { const x0 = x - 2400 + i * 300, x1 = x0 + 300, mx = (x0 + x1) / 2;
            can += R(x0, ey, 300, y + 1400 - ey, i % 2 ? (night ? "#303b70" : "#d9d2c0") : wall, 0, `stroke="${INK}" stroke-width="5"`);
            can += `<path d="M${x},${apex} L${x0},${ey} Q${mx},${ey + 34} ${x1},${ey}Z" fill="${stripe(i)}" ${st}/>`; if (x1 > -100 && x0 < 2000) pts.push([mx, ey + 22]); }
          s += `<g class="tc">${can}${night ? bulbs(pts, 9) : ""}</g>` + `<g class="fl">${R(x - 3000, y, 6000, 1100, night ? "#4a3a2e" : "#a58a62", 0, "")}<path d="M-1000,${y} L3000,${y}" ${st}/></g>`;
          const pr = o.ghost ? `<rect x="${x - pw}" y="${apex}" width="${pw * 2}" height="${y - apex}" fill="none" stroke="${INK}" stroke-width="6" stroke-dasharray="4 16" stroke-linecap="round"/>` : cut(R(x - pw, apex, pw * 2, y - apex, pc, 6) + R(x - pw * 2, y - 26, pw * 4, 26, "#8a5a3c", 8));
          s += `<g class="tt">${pr}${o.jacket ? cut(`<path d="M${x - pw * 3.4},${y - 560} Q${x},${y - 640} ${x + pw * 3.4},${y - 560} L${x + pw * 3},${y - 330} L${x - pw * 3},${y - 330}Z" fill="#1f2a44" ${st}/><path d="M${x - pw * 1.1},${y - 612} L${x},${y - 470} L${x + pw * 1.1},${y - 612}Z" fill="#f6f1e4" ${st}/><path d="M${x},${y - 590} L${x - 10},${y - 540} L${x},${y - 450} L${x + 10},${y - 540}Z" fill="#e0262b" ${st}/>`) : ""}</g>`;
          return s;
        }
        const h = w * (small ? 0.5 : 0.34), eaveY = y - h * 0.4, peakY = o.sag ? y - h * 0.84 : y - h, sag = o.sag ? h * 0.2 : 0, sc = Math.min(26, w * 0.03), n = Math.max(6, 2 * Math.round(w / 220)), ex = h * (o.jacket ? 0.42 : 0.3), top = o.poleOnly ? y - w * 0.8 : y - h - ex;
        const sw = w / n, pts = [];
        if (!o.poleOnly) {
          let walls = "", roof = "";
          for (let i = 0; i < n; i++) { const x0 = x - w / 2 + i * sw, x1 = x0 + sw, mx = (x0 + x1) / 2, cA = [(x + x0) / 2, (peakY + eaveY) / 2 + sag], cB = [(x + x1) / 2, (peakY + eaveY) / 2 + sag];
            walls += R(x0, eaveY, sw, y - eaveY, stripe(i), 0, `stroke="${INK}" stroke-width="5"`);
            roof += `<path d="M${x},${peakY} Q${cA[0]},${cA[1]} ${x0},${eaveY} Q${mx},${eaveY + sc * 2} ${x1},${eaveY} Q${cB[0]},${cB[1]} ${x},${peakY}Z" fill="${stripe(i)}" ${st}/>`; pts.push([mx, eaveY + sc * 1.2]); }
          const dw = w * 0.09, dh = (y - eaveY) * 0.9;
          const door = o.flap ? `<path d="M${x - dw},${y} L${x - dw * 0.55},${y - dh} L${x + dw * 0.55},${y - dh} L${x + dw},${y}Z" fill="#2a2142" ${st}/><path d="M${x - dw * 0.55},${y - dh} L${x - dw * 1.7},${y - dh * 0.25} L${x - dw},${y}Z" fill="${c2}" ${st}/><path d="M${x + dw * 0.55},${y - dh} L${x + dw * 1.7},${y - dh * 0.25} L${x + dw},${y}Z" fill="${c2}" ${st}/>` : `<path d="M${x},${eaveY + sc} L${x},${y}" ${st}/>`;
          const nr = o.ropes == null ? (small ? 2 : 4) : o.ropes, total = Math.max(nr, o.snap ? 2 : 0), fr = Math.min(o.frayed || 0, nr); let ropes = "";
          for (let i = 0; i < total; i++) { const side = i % 2 ? 1 : -1, j = Math.floor(i / 2), u = j * 0.28, ax = x + side * (w / 2) * (1 - u), ay = eaveY + (peakY - eaveY) * u, sx = x + side * (w / 2 + w * (0.1 + 0.07 * j)), L = (y - ay) * 0.28;
            if (o.snap && i === 1) { ropes += `<g class="taut"><path d="M${ax},${ay} L${sx},${y}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${R(sx - 7, y - 14, 14, 18, "#c9ced6", 3, `stroke="${INK}" stroke-width="4"`)}</g><g transform="translate(${ax},${ay})"><g class="whip" style="opacity:0"><path d="M0,0 Q14,${L * 0.5} 6,${L} l10,10 l-14,8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></g>`; }
            else if (i >= total - fr) ropes += `<path d="M${ax},${ay} Q${ax + side * 14},${ay + L * 0.6} ${ax + side * 6},${ay + L * 1.3} l${side * 10},12 l${-side * 14},10" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
            else ropes += `<path d="M${ax},${ay} L${sx},${y}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + R(sx - 7, y - 14, 14, 18, "#c9ced6", 3, `stroke="${INK}" stroke-width="4"`); }
          s += cut(walls) + cut(door) + cut(roof) + ropes + (night ? bulbs(pts, Math.max(5, w * 0.007)) : "");
        }
        // the pole: the whole tent hangs on it
        let pole;
        if (o.ghost) pole = `<rect x="${x - pw / 2}" y="${top}" width="${pw}" height="${y - top}" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round"/>`;
        else if (o.poleOnly) pole = cut(R(x - pw / 2, top, pw, y - top, pc, 5) + R(x - pw * 2.2, y - 22, pw * 4.4, 22, "#8a5a3c", 8));
        else pole = cut(R(x - pw / 2, top, pw, peakY + 10 - top, pc, 5));
        if (o.jacket) { const jw = Math.max(pw * 5, w * 0.07), jy = top + 4, jh = (o.poleOnly ? y : peakY) - top - 6; const jh2 = Math.min(jh, jw * 1.5);
          pole += cut(`<path d="M${x - jw / 2},${jy + 14} Q${x},${jy - 12} ${x + jw / 2},${jy + 14} L${x + jw * 0.44},${jy + jh2} L${x - jw * 0.44},${jy + jh2}Z" fill="#1f2a44" ${st}/><path d="M${x - jw * 0.14},${jy + 4} L${x},${jy + jh2 * 0.6} L${x + jw * 0.14},${jy + 4}Z" fill="#f6f1e4" ${st}/><path d="M${x},${jy + 10} L${x - 6},${jy + jh2 * 0.3} L${x},${jy + jh2 * 0.75} L${x + 6},${jy + jh2 * 0.3}Z" fill="#e0262b" ${st}/>`); }
        s += pole;
        if (o.flag) { const size = Math.max(24, Math.min(w * 0.05, 52, (w * 0.5) / (String(o.flag).length * 0.58 + 1))); s += flag(x + pw / 2, top + 2, size, o.flag); }
        s = `<g class="tt">${s}</g>`;
        if (o.spare) { const sx = Math.min(x + w * 0.58, 1790), sh = h * 0.9, size = Math.max(28, Math.min(40, w * 0.03)), bw = String(o.spare).length * size * 0.58 + 40, bx = Math.max(20 + bw / 2, Math.min(sx, 1900 - bw / 2));
          spare = cut(R(sx - pw / 2, y - sh, pw, sh, pc, 5) + R(sx - pw * 2, y - 20, pw * 4, 20, "#8a5a3c", 8)) + cut(R(bx - bw / 2, y - sh * 0.62, bw, size * 1.7, "#f6f1e4", 6) + T(bx, y - sh * 0.62 + size * 1.2, o.spare, size)); }
        if (o.crowd) { const r = rng(5 + o.crowd), cs = Math.max(12, Math.min(36, w * 0.02)), cap = Math.max(4, Math.floor((w * 0.9) / (cs * 0.8))), rows = Math.ceil(o.crowd / cap); let k = 0;
          for (let row = rows - 1; row >= 0; row--) for (let c = 0; c < cap && k < o.crowd; c++, k++) { const px = x - w * 0.45 + ((c + 0.5 + (r() - 0.5) * 0.6) / cap) * w * 0.9, py = y + 6 + (rows - 1 - row) * cs * 0.34 - (rows - 1) * cs * 0.1, e = Rig.extra(k * 7 + 3);
            crowd += `<g><rect x="${(px - cs * 0.27).toFixed(1)}" y="${(py - cs * 0.6).toFixed(1)}" width="${(cs * 0.54).toFixed(1)}" height="${(cs * 0.6).toFixed(1)}" rx="${(cs * 0.12).toFixed(1)}" fill="${e.top}" stroke="${INK}" stroke-width="2.5"/><circle cx="${px.toFixed(1)}" cy="${(py - cs * 0.82).toFixed(1)}" r="${(cs * 0.28).toFixed(1)}" fill="${e.skin}" stroke="${INK}" stroke-width="2.5"/></g>`; }
          crowd = `<g class="crowd">${crowd}</g>`; }
        return s + spare + crowd;
      },
      play(tl, el, o, t0) {
        const tt = el.querySelector(".tt"), tilt = o.tilt || 0, grow = o.grow;
        if (o.at != null && !grow) pop(tl, el, o, t0);
        if (o.inside) { const tc = el.querySelector(".tc"); gsap.set([tc, tt], { svgOrigin: o.x + " " + o.y, smoothOrigin: false, rotation: tilt });
          [tc, tt].forEach((e) => tl.fromTo(e, { rotation: tilt - 0.6 }, { rotation: tilt + 0.6, duration: 1.6, yoyo: true, repeat: 9, ease: "sine.inOut", immediateRender: false }, t0)); }
        else if (!grow) { gsap.set(tt, { svgOrigin: o.x + " " + o.y, smoothOrigin: false, rotation: tilt });
          tl.fromTo(tt, { rotation: tilt - 0.5 }, { rotation: tilt + 0.5, duration: 1.4, yoyo: true, repeat: 9, ease: "sine.inOut", immediateRender: false }, t0); }
        else gsap.set(tt, { rotation: tilt, svgOrigin: o.x + " " + o.y, smoothOrigin: false });
        el.querySelectorAll(".flag").forEach((f) => { gsap.set(f, { transformOrigin: "0% 50%", smoothOrigin: false }); tl.fromTo(f, { skewY: -4 }, { skewY: 4, duration: 0.7, yoyo: true, repeat: 17, ease: "sine.inOut", immediateRender: false }, t0); });
        el.querySelectorAll(".bulb").forEach((b, i) => tl.fromTo(b, { opacity: 1 }, { opacity: 0.35, duration: 0.5 + (i % 3) * 0.12, yoyo: true, repeat: 13, ease: "sine.inOut", immediateRender: false }, t0 + (i % 5) * 0.1));
        if (grow && grow.length) { gsap.set(el, { svgOrigin: o.x + " " + o.y, smoothOrigin: false, scale: grow[0].k * 0.55 });
          grow.forEach((g, i) => tl.fromTo(el, { scale: i ? grow[i - 1].k : grow[0].k * 0.55 }, { scale: g.k, duration: 0.3, ease: "back.out(1.7)", immediateRender: false }, t0 + (g.at || 0))); }
        if (o.snap) { const t = t0 + (o.snap.at || 0.5), taut = el.querySelector(".taut"), whip = el.querySelector(".whip");
          if (taut && whip) { gsap.set(whip, { transformOrigin: "0% 0%", smoothOrigin: false }); tl.set(taut, { opacity: 0 }, t); tl.set(whip, { opacity: 1 }, t); tl.fromTo(whip, { rotation: -85 }, { rotation: 0, duration: 0.7, ease: "elastic.out(1,0.35)", immediateRender: false }, t); } }
      },
    },

    // { type:"chair", x, y, t, dust, web }: an empty office chair with a nameplate (x, y = floor under it)
    chair: {
      draw(o) {
        const x = o.x, y = o.y, fit = Math.min(36, 150 / (Math.max(3, String(o.t || "").length) * 0.58)); let s = "", f = "";
        const tips = [[-125, -22], [-62, -12], [0, -8], [62, -12], [125, -22]];
        s += tips.map((p) => `<path d="M${x},${y - 66} L${x + p[0]},${y + p[1]}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M${x},${y - 66} L${x + p[0]},${y + p[1]}" stroke="#56606f" stroke-width="9" stroke-linecap="round"/>`).join("") + tips.map((p) => `<circle cx="${x + p[0]}" cy="${y + p[1] + 12}" r="14" fill="${INK}"/>`).join("");
        if (o.web) f += `<path d="M${x - 125},${y - 22} L${x},${y - 66} L${x + 125},${y - 22} M${x - 62},${y - 12} L${x},${y - 66} L${x + 62},${y - 12}" stroke="#9aa0b4" stroke-width="3" fill="none"/><path d="M${x - 94},${y - 44} Q${x - 62},${y - 30} ${x - 31},${y - 40} Q${x},${y - 28} ${x + 31},${y - 40} Q${x + 62},${y - 30} ${x + 94},${y - 44}M${x - 56},${y - 62} Q${x},${y - 48} ${x + 56},${y - 62}" stroke="#9aa0b4" stroke-width="3" fill="none"/><path d="M${x - 100},${y - 238} Q${x - 70},${y - 200} ${x - 20},${y - 186} M${x - 100},${y - 236} Q${x - 60},${y - 226} ${x - 30},${y - 190}" stroke="#9aa0b4" stroke-width="3" fill="none"/>`;
        const body = R(x - 13, y - 200, 26, 140, "#56606f", 4) + R(x - 112, y - 246, 224, 52, "#2f6fb0", 24) + R(x - 20, y - 268, 40, 30, "#56606f", 4) + R(x - 96, y - 470, 192, 214, "#2f6fb0", 36) +
          R(x - 82, y - 392, 164, 58, "#f6f1e4", 6) + T(x, y - 392 + 40, o.t || "", fit);
        let dust = ""; if (o.dust) for (let i = 0; i < 9; i++) dust += `<circle class="dust" cx="${x - 100 + i * 25 + (i % 3) * 7}" cy="${y - 285 - (i % 4) * 22}" r="${4 + (i % 3) * 2}" fill="#c9bfa8" stroke="${INK}" stroke-width="2"/>`;
        return cut(s + body) + f + dust;
      },
      play(tl, el, o, t0) { pop(tl, el, o, t0); el.querySelectorAll(".dust").forEach((d, i) => tl.fromTo(d, { y: 0, opacity: 1 }, { y: -26 - (i % 3) * 8, opacity: 0.25, duration: 1.1 + (i % 4) * 0.25, yoyo: true, repeat: 9, ease: "sine.inOut", immediateRender: false }, t0 + i * 0.08)); },
    },

    // { type:"jar", x, y, t, amount, level }: a glass savings jar of notes, level 0-1 is how full (x, y = bottom middle)
    jar: {
      draw(o) {
        const x = o.x, y = o.y, jh = 400, lv = Math.max(0, Math.min(1, o.level == null ? 0.9 : o.level)), full = jh - 100, rows = Math.round((lv * full) / 24); let n = "";
        for (let k = 0; k < rows; k++) n += `<g transform="rotate(${k % 2 ? 2.5 : -2.5} ${x} ${y - 24 - k * 24})">${R(x - 128 + (k % 3) * 3, y - 36 - k * 24, 252, 24, k % 2 ? "#7cc58f" : "#5fb078", 4, `stroke="${INK}" stroke-width="4"`)}<circle cx="${x + (k % 3 - 1) * 60}" cy="${y - 24 - k * 24}" r="6" fill="rgba(27,29,54,.25)"/></g>`;
        const fit = (t, mw, size) => Math.min(size, mw / (Math.max(3, String(t).length) * 0.58));
        const glass = `<path d="M${x - 92},${y - jh + 8} Q${x - 92},${y - jh + 40} ${x - 150},${y - jh + 90} L${x - 150},${y - 34} Q${x - 150},${y} ${x - 114},${y} L${x + 114},${y} Q${x + 150},${y} ${x + 150},${y - 34} L${x + 150},${y - jh + 90} Q${x + 92},${y - jh + 40} ${x + 92},${y - jh + 8}Z`;
        return cut(`<g>${n}</g>` + glass + `" fill="rgba(190,230,240,.42)" ${st}/>` + `<path d="M${x - 124},${y - jh + 120} L${x - 124},${y - 70}" stroke="rgba(255,255,255,.8)" stroke-width="12" stroke-linecap="round"/>` + R(x - 104, y - jh - 26, 208, 40, "#c9705a", 10) +
          `<g transform="rotate(-2 ${x} ${y - 190})">${R(x - 112, y - 262, 224, 130, "#f6f1e4", 4)}${T(x, y - 214, o.t || "", fit(o.t || "", 200, 36))}${o.amount ? T(x, y - 160, o.amount, fit(o.amount, 200, 52), "#1b7a45") : ""}</g>`);
      },
      play: pop,
    },

    // { type:"seesaw", x, y, w, tilt, left, right }: a playground see-saw (x, y = pivot on the floor); negative tilt = left end down
    seesaw: {
      draw(o) {
        const w = o.w || 1200, tilt = o.tilt || 0, ph = Math.max(90, (w / 2) * Math.sin(Math.abs(tilt) * Math.PI / 180) + 40), x = o.x, y = o.y, py = y - ph, fit = (t) => Math.min(48, (w * 0.4) / (Math.max(3, String(t).length) * 0.58));
        return cut(`<path d="M${x - 90},${y} L${x},${py} L${x + 90},${y}Z" fill="#8f9bb0" ${st}/>`) +
          `<g class="plank">${cut(R(x - w / 2, py - 30, w, 38, "#e8a317", 10) + R(x - w / 2 + 20, py - 78, 18, 50, INK, 6, "") + R(x + w / 2 - 38, py - 78, 18, 50, INK, 6, "") + R(x - w / 2 + 12, py - 96, 34, 22, INK, 8, "") + R(x + w / 2 - 46, py - 96, 34, 22, INK, 8, ""))}${o.left ? T(x - w / 2 + 70, py - 0, o.left, fit(o.left), INK, "start") : ""}${o.right ? T(x + w / 2 - 70, py - 0, o.right, fit(o.right), INK, "end") : ""}</g>` + `<circle cx="${x}" cy="${py - 11}" r="12" fill="#c9ced6" ${st}/>`;
      },
      play(tl, el, o, t0) { const pl = el.querySelector(".plank"), tilt = o.tilt || 0, ph = Math.max(90, ((o.w || 1200) / 2) * Math.sin(Math.abs(tilt) * Math.PI / 180) + 40); gsap.set(pl, { svgOrigin: o.x + " " + (o.y - ph - 11), smoothOrigin: false, rotation: 0 });
        tl.fromTo(pl, { rotation: 0 }, { rotation: tilt, duration: 0.9, ease: "bounce.out", immediateRender: false }, t0 + (o.at != null ? o.at : 0.3)); },
    },

    // { type:"scale", x, y, t, tilt, at }: a grocer's scale with a big dial; its pan is at y - 280, put a figure there (x, y = bottom middle)
    scale: {
      draw(o) {
        const x = o.x, y = o.y, fit = Math.min(50, 150 / (Math.max(3, String(o.t || "").length) * 0.58)); let ticks = "";
        for (let i = 0; i <= 10; i++) { const a = (-120 + i * 24) * Math.PI / 180; ticks += `<path d="M${(x + Math.sin(a) * 100).toFixed(1)},${(y - 140 - Math.cos(a) * 100).toFixed(1)} L${(x + Math.sin(a) * 120).toFixed(1)},${(y - 140 - Math.cos(a) * 120).toFixed(1)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
        return cut(R(x - 22, y - 300, 44, 60, "#56606f", 6) + R(x - 180, y - 300, 360, 26, "#c9ced6", 12) + `<path d="M${x - 230},${y} L${x - 200},${y - 262} L${x + 200},${y - 262} L${x + 230},${y}Z" fill="#e0262b" ${st}/>`) +
          cut(`<circle cx="${x}" cy="${y - 140}" r="136" fill="#f6f1e4" ${st}/>`) + ticks + T(x, y - 106, o.t || "", fit, INK) +
          `<g class="needle"><path d="M${x - 8},${y - 140} L${x},${y - 250} L${x + 8},${y - 140}Z" fill="#e0262b" ${st}/><circle cx="${x}" cy="${y - 140}" r="14" fill="${INK}"/></g>`;
      },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const nd = el.querySelector(".needle"), end = o.tilt != null ? Math.max(-100, Math.min(100, o.tilt * 6)) : 40; gsap.set(nd, { svgOrigin: o.x + " " + (o.y - 140), smoothOrigin: false, rotation: end });
        tl.fromTo(nd, { rotation: -100 }, { rotation: end, duration: 1.0, ease: "elastic.out(1,0.4)", immediateRender: false }, t0 + (o.at != null ? o.at : 0.3));
        tl.fromTo(nd, { rotation: end - 2 }, { rotation: end + 2, duration: 0.35, yoyo: true, repeat: 15, ease: "sine.inOut", immediateRender: false }, t0 + (o.at != null ? o.at : 0.3) + 1.1); },
    },

    // { type:"gate", x, y, t, closed, cue/word }: a customs boom barrier; the arm drops on the cue (x, y = floor, centre of the barrier)
    gate: {
      draw(o) {
        const x = o.x, y = o.y, px = x - 300, ay = y - 250, size = Math.min(44, 440 / (Math.max(3, String(o.t || "").length) * 0.58)), bw = String(o.t || "").length * size * 0.58 + 44; let arm = "";
        for (let i = 0; i < 6; i++) arm += R(px + 30 + i * 80, ay - 24, 80, 48, i % 2 ? "#f6f1e4" : "#e0262b", 0, `stroke="${INK}" stroke-width="5"`);
        const bx = Math.min(x + 300 - bw / 2 + 20, 1890 - bw / 2);
        return cut(R(x + 262, y - 150, 40, 150, "#56606f", 4) + R(x + 240, y - 160, 84, 18, "#56606f", 6) + R(px - 70, y - 330, 140, 330, "#3d6fb6", 8)) +
          `<g class="arm">${cut(arm + R(px - 10, ay - 40, 60, 80, "#c9ced6", 20))}</g>` + `<circle cx="${px + 20}" cy="${ay}" r="12" fill="${INK}"/>` +
          (o.t ? cut(R(x + 300 - 8, y - 520, 16, 370, "#56606f", 4) + R(bx - bw / 2, y - 620, bw, size * 1.9, "#ffe14d", 8) + T(bx, y - 620 + size * 1.32, o.t, size)) : "");
      },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const arm = el.querySelector(".arm"); gsap.set(arm, { svgOrigin: (o.x - 280) + " " + (o.y - 250), smoothOrigin: false, rotation: o.closed === false ? -72 : 0 });
        if (o.cue && o.closed !== false) tl.fromTo(arm, { rotation: -72 }, { rotation: 0, duration: 0.45, ease: "bounce.out", immediateRender: false }, t0 + (o.at || 0)); },
    },

    // { type:"highjump", x, y, w, t, mark }: a high-jump bar on two stands over a running track (x, y = floor, centre)
    highjump: {
      draw(o) {
        const x = o.x, y = o.y, w = o.w || 700, size = Math.min(40, (w * 0.8) / (Math.max(3, String(o.t || "").length) * 0.58)), msz = Math.min(46, (w * 1.2) / (Math.max(3, String(o.mark || "").length) * 0.58));
        let tr = R(-50, y - 30, 2020, 240, "#c9604a", 0) + `<path d="M-50,${y + 60} L2000,${y + 60} M-50,${y + 130} L2000,${y + 130}" stroke="#f6f1e4" stroke-width="6"/>`;
        const stand = (sx) => R(sx - 14, y - 560, 28, 560, "#c9ced6", 6) + R(sx - 60, y - 14, 120, 24, "#56606f", 8) + R(sx - 32, y - 412, 64, 12, INK, 4, "");
        return cut(tr) + cut(stand(x - w / 2) + stand(x + w / 2)) + `<g class="bar">${cut(R(x - w / 2 + 8, y - 454, w - 16, 56, "#f6f1e4", 10))}${T(x, y - 454 + 40, o.t || "", size)}</g>` +
          (o.mark ? `<path d="M${x - w / 2 - 20},${y - 520} L${x + w / 2 + 20},${y - 520}" stroke="${INK}" stroke-width="12" stroke-dasharray="26 16" stroke-linecap="round"/><path d="M${x - w / 2 - 20},${y - 520} L${x + w / 2 + 20},${y - 520}" stroke="#f6f1e4" stroke-width="6" stroke-dasharray="26 16" stroke-linecap="round"/>` + T(x, y - 548, o.mark, msz, "#f6f1e4", "middle", `stroke="${INK}" stroke-width="8" paint-order="stroke" stroke-linejoin="round"`) : "");
      },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const bar = el.querySelector(".bar"); tl.fromTo(bar, { y: 0 }, { y: 7, duration: 0.18, yoyo: true, repeat: 23, ease: "sine.inOut", immediateRender: false }, t0 + 0.2); },
    },

    // ---- the soda episode: props ----
    // { type:"investor_chair", x, y, lit }: a tall stage chair, lit (gold, with a glow) or dark (navy). Origin = the floor under the seat.
    investor_chair: { draw(o) { return throne(o.x, o.y, !!o.lit, 1.15); }, play: pop },
    // { type:"bottles", x, y, n, speed }: a row of empty glass bottles standing on y, centred on x. `speed` (pixels a second) carries them along a line; `move` also works.
    bottles: { draw(o) { const n = o.n || 6; let s = ""; for (let i = 0; i < n; i++) { const x = o.x + (i - (n - 1) / 2) * 104;
        s += `<g transform="translate(${x},${o.y})"><path d="M-26,0 L-26,-96 Q-26,-118 -11,-130 L-11,-164 L11,-164 L11,-130 Q26,-118 26,-96 L26,0Z" fill="rgba(190,232,222,.75)" ${st} stroke-width="5"/><rect x="-14" y="-176" width="28" height="14" rx="4" fill="#c9ced6" ${st} stroke-width="4"/><path d="M-16,-90 L-16,-20" stroke="rgba(255,255,255,.8)" stroke-width="7" stroke-linecap="round"/></g>`; }
      return cut(s); },
      play(tl, el, o, t0) { pop(tl, el, o, t0); if (o.speed) tl.fromTo(el, { x: 0 }, { x: o.speed * (o.dur || 6), duration: o.dur || 6, ease: "none", immediateRender: false }, t0); } },
    // { type:"car", x, y, color, sign }: a family car seen from the side, plain colours. x, y = the middle of the car on the ground. `sign`: a card on the windscreen.
    car: { draw(o) { const x = o.x, y = o.y, c = o.color || "#3d8fb0", sg = o.sign ? `<g transform="rotate(-14 ${x + 90} ${y - 150})">${R(x + 40, y - 186, 120, 62, "#f6f1e4", 4)}${T(x + 100, y - 138, o.sign, 34, "#e0262b")}</g>` : "";
      return cut(R(x - 280, y - 116, 560, 82, c, 30) + `<path d="M${x - 160},${y - 112} L${x - 100},${y - 206} L${x + 100},${y - 206} L${x + 190},${y - 112}Z" fill="${c}" ${st}/>` + `<path d="M${x - 130},${y - 122} L${x - 84},${y - 190} L${x - 10},${y - 190} L${x - 10},${y - 122}Z" fill="#bfe0ea" ${st}/><path d="M${x + 10},${y - 122} L${x + 10},${y - 190} L${x + 92},${y - 190} L${x + 160},${y - 122}Z" fill="#bfe0ea" ${st}/>` +
        R(x + 250, y - 98, 34, 26, "#ffe14d", 8) + R(x - 292, y - 80, 24, 16, "#e0262b", 6) + R(x - 270, y - 56, 540, 22, "#56606f", 8) + [-168, 168].map((dx) => `<circle cx="${x + dx}" cy="${y - 36}" r="58" fill="${INK}"/><circle cx="${x + dx}" cy="${y - 36}" r="28" fill="#c9ced6" ${st}/>`).join("")) + sg; },
      play: pop },
    // { type:"cards_fan", x, y, n, spread }: a fan of plain cards (no bank names, no numbers), pivot at x, y. They open from a pile to the fan at `at`.
    cards_fan: { draw(o) { const n = o.n || 5, cols = ["#e8a317", "#1f8a8a", "#f08a7a", "#2c3766", "#7fd0f0", "#c95f8d"]; let s = "";
        for (let i = 0; i < n; i++) s += `<g class="cd" data-a="${((i - (n - 1) / 2) * (o.spread || 16)).toFixed(1)}">${R(o.x - 8, o.y - 230, 150, 92, cols[i % 6], 10)}${R(o.x - 8, o.y - 206, 150, 18, INK, 0, "")}${R(o.x + 8, o.y - 168, 40, 26, "#f0d27a", 5, `stroke="${INK}" stroke-width="3"`)}</g>`;
        return cut(s); },
      play(tl, el, o, t0) { pop(tl, el, o, t0); el.querySelectorAll(".cd").forEach((c, i) => { gsap.set(c, { svgOrigin: o.x + " " + o.y, smoothOrigin: false }); const a = +c.dataset.a;
          tl.fromTo(c, { rotation: a * 0.1 }, { rotation: a, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, t0 + (o.at || 0.2) + i * 0.05); }); } },
    // { type:"vinegar_jar", x, y, fruit, siphon }: a big jar of cloudy amber liquid (no label), cut fruit beside it and a soda siphon. x, y = the bottom middle of the jar.
    vinegar_jar: { draw(o) { const x = o.x, y = o.y; let s = "";
        s += `<path d="M${x - 120},${y - 360} L${x + 120},${y - 360} L${x + 150},${y - 300} L${x + 150},${y - 30} Q${x + 150},${y} ${x + 120},${y} L${x - 120},${y} Q${x - 150},${y} ${x - 150},${y - 30} L${x - 150},${y - 300}Z" fill="rgba(224,176,96,.82)" ${st}/>` +
          `<path d="M${x - 150},${y - 300} L${x + 150},${y - 300}" stroke="${INK}" stroke-width="5"/>` + R(x - 130, y - 400, 260, 44, "#c9ced6", 10) + `<path d="M${x - 118},${y - 250} L${x - 118},${y - 90}" stroke="rgba(255,255,255,.6)" stroke-width="12" stroke-linecap="round"/>`;
        for (let i = 0; i < 7; i++) s += `<circle class="tick" cx="${x - 90 + (i * 53) % 180}" cy="${y - 60 - (i * 41) % 220}" r="${6 + (i % 3) * 3}" fill="rgba(255,244,207,.8)" ${st} stroke-width="3"/>`;
        if (o.fruit !== false) { s += [[x - 240, "#f08a7a"], [x - 330, "#f0c470"], [x - 280, "#9fd8a8"]].map((p, i) => `<g transform="translate(${p[0]},${y - 30 - (i === 2 ? 56 : 0)})"><circle r="40" fill="${p[1]}" ${st}/><circle r="26" fill="rgba(255,255,255,.35)"/><path d="M-40,0 L40,0 M0,-40 L0,40" stroke="${INK}" stroke-width="3"/></g>`).join(""); }
        if (o.siphon !== false) s += R(x + 214, y - 300, 84, 300, "rgba(190,232,222,.75)", 22) + R(x + 224, y - 340, 64, 46, "#c9ced6", 8) + R(x + 280, y - 360, 60, 14, "#8d9199", 6) + R(x + 224, y - 220, 64, 150, "rgba(255,255,255,.4)", 8, "");
        return cut(s); },
      play: pop },
    // { type:"briefcase", x, y }: a briefcase standing on the floor, apart from a hand (`move` slides it). x, y = the middle of its base.
    briefcase: { draw(o) { const x = o.x, y = o.y; return cut(R(x - 96, y - 140, 192, 140, "#8a5a3c", 14) + `<path d="M${x - 36},${y - 140} L${x - 36},${y - 172} L${x + 36},${y - 172} L${x + 36},${y - 140}" fill="none" ${st}/><path d="M${x - 96},${y - 84} L${x + 96},${y - 84}" ${st}/>` + R(x - 20, y - 98, 40, 28, "#f0b429", 6) + R(x - 80, y - 20, 28, 20, "#3b2a1e", 4) + R(x + 52, y - 20, 28, 20, "#3b2a1e", 4)); }, play: pop },
    // { type:"wall_calendar", x, y, circle }: a calendar page on a wall (no month, no numbers): a grid of days with one circled in red. x, y = the middle of the page. circle: 0-34.
    wall_calendar: { draw(o) { const x = o.x, y = o.y, c = o.circle == null ? -1 : o.circle; let s = R(x - 150, y - 190, 300, 380, "#f6f1e4", 6) + R(x - 150, y - 190, 300, 70, "#e0262b", 6) + `<circle cx="${x}" cy="${y - 214}" r="10" fill="${INK}"/>`;
        for (let i = 0; i < 35; i++) s += R(x - 128 + (i % 7) * 37, y - 100 + Math.floor(i / 7) * 56, 31, 46, "#fff", 0, `stroke="${INK}" stroke-width="3"`);
        const cx = x - 128 + (c % 7) * 37 + 15, cy = y - 100 + Math.floor(c / 7) * 56 + 23;
        return cut(s) + (c >= 0 ? `<ellipse class="circ" cx="${cx}" cy="${cy}" rx="28" ry="34" fill="none" stroke="#e0262b" stroke-width="8" stroke-dasharray="${Math.round(Math.PI * 62)}" stroke-dashoffset="0"/>` : ""); },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const c = el.querySelector(".circ"); if (c) { const L = Math.round(Math.PI * 62); tl.fromTo(c, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.out", immediateRender: false }, t0 + (o.at || 0.4) + 0.3); } } },

    // { type:"briefcase_tower", x, y, n, grow }: briefcases stacked into a tower that rises into the dark; they arrive one by one over `grow` seconds. x, y = the middle of the base.
    briefcase_tower: { draw(o) { const n = o.n || 8; let s = ""; for (let i = 0; i < n; i++) { const x = o.x + (i % 2 ? 10 : -10) + (i % 3 - 1) * 6, y = o.y - i * 96;
        s += `<g class="bc">${R(x - 110, y - 92, 220, 92, i % 2 ? "#8a5a3c" : "#6f452c", 12)}${R(x - 28, y - 112, 56, 22, "#8a5a3c", 6)}${R(x - 16, y - 58, 32, 22, "#f0b429", 5)}</g>`; } return cut(s); },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const d = o.grow || 2, bc = el.querySelectorAll(".bc"); bc.forEach((c, i) => { c.style.opacity = 0; tl.fromTo(c, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.22, ease: "bounce.out", immediateRender: false }, t0 + (o.at || 0.2) + (i / Math.max(1, bc.length - 1)) * d); }); } },
    // { type:"toys", x, y }: five stuffed toys in a row (bear, rabbit, dog, cat, duck), centred on x, sitting on y.
    toys: { draw(o) { const cols = ["#c9a36b", "#f6f1e4", "#b98562", "#8d9199", "#f0d27a"]; let s = ""; for (let i = 0; i < 5; i++) { const x = o.x + (i - 2) * 140, y = o.y, c = cols[i];
        const ears = [`<circle cx="${x - 34}" cy="${y - 150}" r="20" fill="${c}" ${st}/><circle cx="${x + 34}" cy="${y - 150}" r="20" fill="${c}" ${st}/>`, `<ellipse cx="${x - 22}" cy="${y - 180}" rx="14" ry="38" fill="${c}" ${st}/><ellipse cx="${x + 22}" cy="${y - 180}" rx="14" ry="38" fill="${c}" ${st}/>`, `<ellipse cx="${x - 50}" cy="${y - 118}" rx="16" ry="34" fill="${Rig.shade(c, 0.3)}" ${st}/><ellipse cx="${x + 50}" cy="${y - 118}" rx="16" ry="34" fill="${Rig.shade(c, 0.3)}" ${st}/>`, `<path d="M${x - 44},${y - 130} L${x - 36},${y - 176} L${x - 8},${y - 140}Z M${x + 44},${y - 130} L${x + 36},${y - 176} L${x + 8},${y - 140}Z" fill="${c}" ${st}/>`, `<path d="M${x - 8},${y - 156} L${x + 12},${y - 174} L${x + 24},${y - 154}Z" fill="#e8a317" ${st}/>`][i];
        s += `<g class="sway">${ears}${R(x - 46, y - 96, 92, 96, c, 30)}<circle cx="${x}" cy="${y - 118}" r="48" fill="${c}" ${st}/><circle cx="${x - 16}" cy="${y - 124}" r="6" fill="${INK}"/><circle cx="${x + 16}" cy="${y - 124}" r="6" fill="${INK}"/>${i === 4 ? `<path d="M${x - 14},${y - 104} L${x + 14},${y - 104} L${x},${y - 94}Z" fill="#e8a317" ${st} stroke-width="4"/>` : `<ellipse cx="${x}" cy="${y - 104}" rx="12" ry="8" fill="#3b2a1e"/>`}</g>`; } return cut(s); }, play: pop },
    // { type:"blanket", x, y }: a small folded baby blanket on a plastic chair. x, y = the floor under the chair.
    blanket: { draw(o) { const x = o.x, y = o.y; return cut(`<path d="M${x - 60},${y - 150} L${x - 70},${y} M${x + 60},${y - 150} L${x + 70},${y}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` + R(x - 90, y - 190, 180, 44, "#7fb8d0", 20) + R(x - 80, y - 400, 160, 214, "#7fb8d0", 30) + R(x - 74, y - 232, 148, 52, "#f6e9b0", 14) + `<path d="M${x - 50},${y - 232} L${x - 50},${y - 180} M${x},${y - 232} L${x},${y - 180} M${x + 50},${y - 232} L${x + 50},${y - 180}" stroke="#f08a7a" stroke-width="8"/>`); }, play: pop },
    // { type:"cheque", x, y, t }: a long cheque lying on a table (`move` slides it); t is the amount, or blank. x, y = the middle.
    cheque: { draw(o) { const x = o.x, y = o.y; return cut(R(x - 320, y - 90, 640, 180, "#f2ecd6", 6) + `<path d="M${x - 290},${y + 40} L${x - 40},${y + 40} M${x - 290},${y - 40} L${x - 120},${y - 40}" stroke="#9aa0b4" stroke-width="6" stroke-linecap="round"/>` + R(x + 130, y - 60, 160, 70, "#fff", 2) + (o.t ? T(x + 210, y - 8, o.t, Math.min(50, 300 / Math.max(3, String(o.t).length * 0.7)), "#1b7a45") : "") + `<path d="M${x + 60},${y + 56} Q${x + 100},${y + 20} ${x + 150},${y + 56} T${x + 260},${y + 50}" fill="none" stroke="${INK}" stroke-width="4"/>`); }, play: pop },
    // { type:"magnifier_big", x, y }: a magnifying glass bigger than a figure, hanging on a cord. x, y = the middle of the glass.
    magnifier_big: { draw(o) { const x = o.x, y = o.y; return `<g class="sway"><path d="M${x},${y - 200} L${x},0" stroke="${INK}" stroke-width="7"/>` + cut(`<circle cx="${x}" cy="${y}" r="210" fill="rgba(191,224,234,.35)" ${st} stroke-width="26"/><circle cx="${x}" cy="${y}" r="210" fill="none" stroke="#8a5a3c" stroke-width="16"/><path d="M${x - 140},${y - 100} Q${x - 100},${y - 150} ${x - 40},${y - 160}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="14" stroke-linecap="round"/><path d="M${x + 150},${y + 150} L${x + 260},${y + 260}" stroke="${INK}" stroke-width="36" stroke-linecap="round"/><path d="M${x + 150},${y + 150} L${x + 260},${y + 260}" stroke="#8a5a3c" stroke-width="22" stroke-linecap="round"/>`) + `</g>`; }, play: pop },
    // { type:"beakers", x, y }: two beakers that tip toward each other, pour, and give a puff of green smoke at `at`. x, y = the table under them.
    beakers: { draw(o) { const bk = (x, c, cls) => `<g class="${cls}"><path d="M${x - 50},${o.y - 160} L${x + 50},${o.y - 160} L${x + 44},${o.y} L${x - 44},${o.y}Z" fill="rgba(190,232,222,.7)" ${st}/><path d="M${x - 46},${o.y - 80} L${x + 46},${o.y - 80} L${x + 44},${o.y} L${x - 44},${o.y}Z" fill="${c}"/></g>`;
        let sm = ""; for (let i = 0; i < 5; i++) sm += `<circle class="pf" cx="${o.x + (i - 2) * 26}" cy="${o.y - 230}" r="${30 + (i % 3) * 8}" fill="#7fd07f" ${st} stroke-width="4" style="opacity:0"/>`;
        return cut(bk(o.x - 90, "#1fa85b", "bl") + bk(o.x + 90, "#e8a317", "br")) + sm; },
      play(tl, el, o, t0) { pop(tl, el, o, t0); const a = t0 + (o.at || 0.6), l = el.querySelector(".bl"), r = el.querySelector(".br"); gsap.set(l, { svgOrigin: (o.x - 40) + " " + o.y, smoothOrigin: false }); gsap.set(r, { svgOrigin: (o.x + 40) + " " + o.y, smoothOrigin: false });
        tl.to(l, { rotation: 28, duration: 0.4, ease: "power2.inOut" }, a); tl.to(r, { rotation: -28, duration: 0.4, ease: "power2.inOut" }, a);
        el.querySelectorAll(".pf").forEach((p, i) => { tl.fromTo(p, { opacity: 0, y: 0, scale: 0.4 }, { opacity: 0.9, y: -90 - i * 14, scale: 1.4, duration: 0.7, ease: "power1.out", immediateRender: false }, a + 0.5 + i * 0.05); tl.to(p, { opacity: 0, duration: 0.5 }, a + 1.3 + i * 0.05); }); } },
    // { type:"mirror_ball", x, y }: a mirror ball on a cord (x, y = its middle) and spots of light drifting around it.
    mirror_ball: { draw(o) { const x = o.x, y = o.y; let g = "", sp = ""; for (let i = -3; i <= 3; i++) g += `<path d="M${x + i * 24},${y - 90} L${x + i * 24},${y + 90}" stroke="${INK}" stroke-width="2.5" opacity=".6"/>`; for (let j = -3; j <= 3; j++) g += `<path d="M${x - 90},${y + j * 24} L${x + 90},${y + j * 24}" stroke="${INK}" stroke-width="2.5" opacity=".6"/>`;
        for (let i = 0; i < 12; i++) sp += `<circle class="dot" cx="${x - 500 + (i * 173) % 1000}" cy="${y - 220 + (i * 97) % 620}" r="${26 + (i % 3) * 10}" fill="${["#ffe14d", "#7fd0f0", "#f08a7a", "#9fd8a8"][i % 4]}" opacity=".5"/>`;
        return `<path d="M${x},0 L${x},${y - 100}" stroke="${INK}" stroke-width="6"/>` + sp + cut(`<circle cx="${x}" cy="${y}" r="100" fill="#c9ced6" ${st}/>` + g + `<path d="M${x - 70},${y - 60} Q${x - 40},${y - 90} ${x},${y - 94}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`); },
      play(tl, el, o, t0) { pop(tl, el, o, t0); el.querySelectorAll(".dot").forEach((d, i) => tl.fromTo(d, { x: 0, opacity: 0.2 }, { x: (i % 2 ? -1 : 1) * 160, opacity: 0.6, duration: 1.2 + (i % 4) * 0.3, yoyo: true, repeat: 12, ease: "sine.inOut", immediateRender: false }, t0)); } },
  };

  /* ---- Depth for the places Poppi used most (13 Nov 2026): eight or more things on the back wall, a foreground piece the camera passes,
     one living detail. Added on top of each set's own drawing, in its palette, and kept clear of the safe area's faces and signs. ---- */
  const cart = (x, y) => `<g class="fg">${cut(`<g transform="translate(${x},${y})"><path d="M-40,-260 L0,-260 L40,-120 L330,-120 L370,-250" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M30,-230 L360,-230 L330,-120 L50,-120Z" fill="#c9ced6" stroke="${INK}" stroke-width="8"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${70 + i * 50},-228 L${80 + i * 46},-122" stroke="${INK}" stroke-width="4"/>`).join("") + `<circle cx="90" cy="-60" r="34" fill="#3d4a5c" ${st}/><circle cx="300" cy="-60" r="34" fill="#3d4a5c" ${st}/></g>`)}</g>`;
  const shopper = (x, y, c) => `<g class="pass">${cut(`<g transform="translate(${x},${y})"><circle cx="0" cy="-250" r="34" fill="${c.skin}" ${st}/><path d="M-34,-262 Q0,-300 34,-262 Q20,-280 0,-282 Q-20,-280 -34,-262Z" fill="${c.hair}" ${st} stroke-width="5"/><path d="M-50,-210 L50,-210 L44,-80 L-44,-80Z" fill="${c.top}" ${st}/>${R(-38, -80, 30, 80, c.legs || "#2e3a59", 8)}${R(8, -80, 30, 80, c.legs || "#2e3a59", 8)}</g>`)}</g>`;
  const DRESS = {
    kitchen(o, P, n) {
      const rail = cut(R(1500, 400, 380, 14, P.trim, 6) + [1540, 1620, 1700, 1780, 1850].map((x, i) => `<path d="M${x},414 L${x},${470 + (i % 2) * 30}" stroke="${INK}" stroke-width="6"/>` + (i % 2 ? `<circle cx="${x}" cy="${508}" r="22" fill="#c9ced6" ${st} stroke-width="5"/>` : R(x - 12, 470, 24, 40, "#8a5a3c", 6, `stroke="${INK}" stroke-width="4"`))).join(""));
      return { back: D.clock(650, 200, 50, P) + D.frame(540, 330, 150, 110, "landscape", P) + D.shelf(1500, 300, 380, P, 7) + rail + D.switch(780, 500) + D.vent(1700, 40) + D.plant(1830, 640, 0.55, P) + D.steam(1650, 584),
        front: D.fgPlant(1880, 1090, 1.5) };
    },
    boardroom(o, P, n) {
      if (o.glass) return { back: D.plant(1820, 800, 0.9, P) + D.clock(1700, 120, 40, P), front: D.fgPlant(-20, 1090, 1.5) };
      return { back: D.frame(1460, 140, 170, 210, "portrait", P) + D.frame(1690, 160, 150, 120, "chart", P) + D.clock(560, 190, 46, P) + D.sconce(440, 470, P, n) + D.sconce(1480, 470, P, n) +
        D.shelf(1640, 560, 240, P, 11) + D.plant(1830, 800, 0.85, P) + D.vent(620, 40) + D.mug(1380, 812, P), front: D.fgPlant(-30, 1090, 1.5) };
    },
    pitch_stage(o, P, n) {
      const v = o.view || "table"; if (v === "rafters" || v === "seats") return {};
      const screen = (x, y) => cut(R(x - 6, y + 170, 12, 260, "#3d4a5c", 0) + R(x - 70, y + 420, 140, 18, "#3d4a5c", 6) + R(x - 110, y, 220, 170, "#1b2142", 12)) + `<g class="tick">${R(x - 94, y + 16, 188, 138, P.accent, 6, "")}${R(x - 70, y + 40, 80, 60, "#f6f1e4", 4, "")}</g>`;
      return { back: screen(160, 300) + screen(1760, 300) + D.cable(0, 1920, 772, P) + `<circle class="tick" cx="1600" cy="190" r="16" fill="#e0262b" ${st} stroke-width="5"/>` + halo(1600, 190, 70, "#ff5a4f", 0.25),
        front: v === "desk" ? "" : D.fgCamera(120, 900) };
    },
    night_office(o, P, n) {
      const d = o.dress || "buyer", dy = d === "clerk" ? 560 : 720;
      return { back: D.clock(760, 190, 44, P) + (d === "hal" ? "" : D.poster(880, 250, 120, 160, P, -3)) + D.cable(0, 860, 818, P) + D.plant(110, 830, 0.8, P) + D.switch(660, 520) + D.vent(1700, 40) + D.mug(d === "clerk" ? 1180 : 1000, dy, P) + `<circle class="tick" cx="${d === "clerk" ? 1440 : 1300}" cy="${dy - 8}" r="6" fill="#46e08a"/>`,
        front: D.fgPlant(1890, 1090, 1.4) };
    },
    bank(o, P, n) {
      const cam = `<g transform="translate(1800,70)">${cut(R(-10, 0, 20, 40, "#3d4a5c", 4) + `<path d="M-60,40 L40,40 L50,90 L-50,90Z" fill="#c9ced6" ${st}/>`)}<circle class="tick" cx="-30" cy="64" r="8" fill="#e0262b"/></g>`;
      if (o.dress === "counter") return { back: cam + D.frame(140, 140, 200, 140, "landscape", P) + D.clock(1700, 200, 46, P) + D.plant(1840, 830, 0.85, P) + D.sconce(400, 420, P, n) + D.sconce(1560, 420, P, n) + D.vent(900, 40) };
      return { back: cam + D.clock(1840, 420, 40, P) + D.cable(880, 1780, 96, P) + cut(R(1480, 760, 260, 70, "#f0b429", 4) + R(1520, 700, 180, 60, "#f0b429", 4) + `<path d="M1480,795 L1740,795 M1520,730 L1700,730" stroke="#c98a12" stroke-width="5"/>`), front: D.fgRail(980, P) };
    },
    supermarket(o, P, n) {
      const tubes = [300, 760, 1160, 1620].map((x, i) => `<g${i === 2 ? ' class="tick"' : ""}>${R(x - 120, 30, 240, 18, "#fbf8ef", 9)}</g>` + `<path d="M${x - 100},0 L${x - 100},30 M${x + 100},0 L${x + 100},30" stroke="${INK}" stroke-width="4"/>`).join("");
      const flags = [620, 800, 980, 1160, 1340].map((x, i) => cut(`<path d="M${x},90 L${x + 120},90 L${x + 120},170 L${x + 60},150 L${x},170Z" fill="${[P.accent, "#f0b429", "#3d6fb6", P.accent, "#1fa85b"][i]}" ${st} stroke-width="5"/>`)).join("") + `<path d="M600,90 L1480,90" stroke="${INK}" stroke-width="5"/>`;
      return { back: tubes + flags + (o.dress === "shelf" ? "" : shopper(1300, 560, { skin: "#dba77e", hair: "#2b2118", top: "#c95f8d" })), front: cart(-60, 1090) };
    },
    back_shop(o, P, n) {
      return { back: D.clock(760, 170, 44, P) + D.poster(990, 360, 130, 170, P, 4) + D.cable(0, 1920, 40, P) + D.vent(1660, 80) + D.frame(640, 300, 120, 150, "abstract", P) + D.switch(1100, 600) + D.plant(1840, 860, 0.7, P) };
    },
    desk_top(o, P, n) {
      const cup = cut(`<circle cx="1790" cy="190" r="70" fill="#f6f1e4" ${st}/><circle cx="1790" cy="190" r="50" fill="#5b3a22"/><path d="M1860,190 Q1900,190 1898,222" fill="none" ${st}/>`) + D.steam(1790, 120);
      const notes = cut(`<g transform="rotate(-8 140 860)">${R(80, 800, 130, 120, "#ffe14d", 2)}<path d="M100,840 L190,840 M100,866 L170,866" stroke="#9aa0b4" stroke-width="6"/></g>` + `<g transform="rotate(6 170 990)">${R(110, 940, 120, 110, "#7fd0f0", 2)}</g>`);
      const phone = cut(`<g transform="rotate(-12 1760 720)">${R(1700, 620, 120, 220, INK, 18)}</g>`) + `<g class="tick" transform="rotate(-12 1760 720)">${R(1712, 640, 96, 170, n ? "#3d6fb6" : "#7fd0f0", 8, "")}</g>`;
      const pens = cut(`<g transform="rotate(30 160 300)">${R(150, 160, 22, 220, "#e0262b", 8)}</g><g transform="rotate(42 210 320)">${R(200, 190, 20, 200, "#3d6fb6", 8)}</g>`);
      return { back: cup + notes + phone + pens };
    },
  };
  // Sets whose default look is night (they take "night": false for day).
  const NIGHT_FIRST = { pitch_stage: 1, night_office: 1, bank: 1, supermarket: 1, back_shop: 1, desk_top: 1, night_city: 1, night_road: 1 };
  // Draw a set for a shot: the set itself, its dressing in its palette, or a palette wash over a set that draws its own colours.
  function draw(name, o) {
    o = o || {}; const fn = SETS[name] || SETS.studio, out = fn(o), night = NIGHT_FIRST[name] ? o.night !== false : !!o.night;
    let back = out.back, front = out.front || "";
    if (DRESS[name] && !o.bare) { const x = DRESS[name](o, pal(o, SET_PALETTE[name], night), night); back += x.back || ""; front += x.front || ""; }
    else if (o.palette && !DRESS[name] && PALETTES[o.palette]) back += wash(pal(o, o.palette, night), night);
    return { back, front };
  }

  // Ambient motion that keeps a held shot alive.
  function animate(tl, svg, t0, t1) {
    const bits = svg.querySelectorAll(".bit"); if (bits.length) gsap.set(bits, { transformOrigin: "50% 50%", smoothOrigin: false });
    const d = t1 - t0;
    svg.querySelectorAll(".cloud").forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 60 + i * 30, duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".bit").forEach((b, i) => tl.fromTo(b, { y: -160 - (i % 7) * 60 }, { y: 760 + (i % 5) * 90, rotation: (i % 2 ? 1 : -1) * (90 + i * 7), duration: Math.max(d, 2.5) * (0.8 + (i % 4) * 0.22), ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".pass").forEach((p) => tl.fromTo(p, { x: 0 }, { x: -Math.min(110 * d, 2800), duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".sway").forEach((p, i) => { gsap.set(p, { transformOrigin: "50% 0%", smoothOrigin: false }); tl.fromTo(p, { rotation: -4 }, { rotation: 4, duration: 1.1 + (i % 3) * 0.2, yoyo: true, repeat: Math.ceil(d / 1.1) + 1, ease: "sine.inOut", immediateRender: false }, t0); });
    svg.querySelectorAll("[data-flash]").forEach((f) => String(f.getAttribute("data-flash")).split(",").forEach((s) => { const t = t0 + parseFloat(s); if (t < t1) { tl.set(f, { opacity: 1 }, t); tl.set(f, { opacity: 0 }, t + 0.09); } }));
    svg.querySelectorAll(".pulse").forEach((p, i) => tl.fromTo(p, { opacity: 1 }, { opacity: 0.62, duration: 1.3 + (i % 3) * 0.25, yoyo: true, repeat: Math.ceil(d / 1.3) + 1, ease: "sine.inOut", immediateRender: false }, t0));
    svg.querySelectorAll(".spin").forEach((p, i) => { gsap.set(p, { transformOrigin: "50% 50%", smoothOrigin: false }); tl.fromTo(p, { rotation: 0 }, { rotation: (i % 2 ? -1 : 1) * 360 * Math.max(1, d / 2.5), duration: d, ease: "none", immediateRender: false }, t0); });
    // steam rises and fades again and again; a clock's second hand steps once a second; the foreground drifts a little faster than the room (depth)
    svg.querySelectorAll(".steam").forEach((p, i) => tl.fromTo(p, { y: 0, opacity: 0.75 }, { y: -46, opacity: 0, duration: 1.8, repeat: Math.ceil(d / 1.8) + 1, ease: "none", immediateRender: false }, t0 - (i % 3) * 0.6));
    svg.querySelectorAll(".secs").forEach((p) => { gsap.set(p, { svgOrigin: p.getAttribute("data-cx") + " " + p.getAttribute("data-cy"), smoothOrigin: false }); const n = Math.max(1, Math.ceil(d)); tl.fromTo(p, { rotation: 0 }, { rotation: 6 * n, duration: n, ease: "steps(" + n + ")", immediateRender: false }, t0); });
    svg.querySelectorAll(".fg").forEach((p) => tl.fromTo(p, { x: 28 }, { x: -28, duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".tick").forEach((k, i) => { for (let t = t0 + 0.4 + (i % 6) * 0.31; t < t1; t += 1.7 + (i % 4) * 0.4) { tl.set(k, { opacity: 0.35 }, t); tl.set(k, { opacity: 1 }, t + 0.12); } });
  }

  window.Sets = { SETS, PROPS, PALETTES, SET_PALETTE, SET_AMBIENCE, DRESS, D, pal, draw, animate };
})();
