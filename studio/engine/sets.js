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

  const SETS = {
    plain(o) { return { back: R(0, 0, 1920, 1080, o.color || "#efe6d0", 0, "") }; },

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
      const night = !!o.night; let b = R(0, 0, 1920, 1080, night ? "#c9c3d6" : "#efe6d0", 0, "");
      for (let x = 0; x < 1920; x += 96) b += `<path d="M${x},0 L${x},640" stroke="rgba(27,29,54,.10)" stroke-width="4"/>`;
      for (let y = 0; y < 640; y += 96) b += `<path d="M0,${y} L1920,${y}" stroke="rgba(27,29,54,.10)" stroke-width="4"/>`;
      const sky = night ? "#1f2a44" : "#bfe0ea";
      let win = R(900, 150, 560, 330, sky, 8);
      if (o.window === "datacenter") { win += R(980, 300, 400, 180, "#56606f", 0); for (let i = 0; i < 12; i++) win += R(1004 + (i % 6) * 62, 326 + Math.floor(i / 6) * 62, 38, 30, night ? "#ffe14d" : "#bfe0ea", 0, `stroke="${INK}" stroke-width="4"`);
        win += `<path d="M900,300 L980,300 M1380,300 L1460,300" stroke="${INK}" stroke-width="5"/>`; }
      else win += `<circle cx="1360" cy="230" r="34" fill="${night ? "#f6f1e4" : "#ffe14d"}" ${st}/>` + `<path d="M900,440 Q1040,380 1180,430 Q1320,400 1460,440 L1460,480 L900,480Z" fill="#3f9b5a" ${st}/>`;
      b += cut(win + `<path d="M1180,150 L1180,480" ${st}/>` + R(880, 476, 600, 24, "#f6f1e4", 6));
      b += cut(R(0, 640, 1920, 40, "#f6f1e4", 0) + R(0, 680, 1920, 400, "#1f8a8a", 0));
      for (let x = 480; x < 1920; x += 320) b += `<path d="M${x},680 L${x},1080" ${st}/>` + R(x + 130, 760, 60, 14, INK, 7, "");
      b += cut(R(130, 200, 300, 880, "#f6f1e4", 18) + `<path d="M130,520 L430,520" ${st}/>` + R(390, 300, 16, 120, INK, 8, "") + R(390, 580, 16, 160, INK, 8, "") +
        `<g transform="rotate(4 270 330)">${R(210, 250, 120, 150, "#fff", 0)}<path d="M228,286 L310,286 M228,312 L290,312" stroke="#9aa0b4" stroke-width="6"/>${R(228, 344, 84, 30, "#e0262b", 0, "")}</g><circle cx="270" cy="244" r="12" fill="#e8a317" ${st}/>`);
      b += cut(`<path d="M1600,640 L1600,590 Q1650,560 1700,590 L1700,640Z" fill="#e0262b" ${st}/><path d="M1700,600 Q1740,600 1736,626" fill="none" ${st}/>`);
      const f = cut(R(0, 930, 1920, 40, "#c9a36b", 0) + R(0, 970, 1920, 110, "#a5814d", 0)) +
        cut(`<g transform="rotate(-5 620 930)">${R(520, 880, 200, 64, "#fff", 0)}<path d="M544,904 L690,904" stroke="#9aa0b4" stroke-width="6"/>${R(544, 918, 80, 16, "#e0262b", 0, "")}</g>`);
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
      const night = !!o.night, doors = (o.doors || []).slice(0, 3); let b = R(0, 0, 1920, 800, "#9a6a47", 0, "") + R(0, 800, 1920, 280, "#4a3a2e", 0, "");
      for (let x = 0; x < 1920; x += 160) b += `<path d="M${x},0 L${x},800" stroke="rgba(27,29,54,.22)" stroke-width="6"/>`;
      b += `<path d="M0,560 L1920,560" stroke="rgba(27,29,54,.35)" stroke-width="10"/>` + `<path d="M0,800 L1920,800" ${st}/>`;
      b += cut(R(150, 150, 170, 200, "#f6f1e4", 6) + R(150, 150, 170, 52, "#e0262b", 6)) + T(235, 190, o.month || "NOV", 36, "#f6f1e4");
      for (let i = 0; i < 15; i++) b += R(162 + (i % 5) * 31, 218 + Math.floor(i / 5) * 40, 24, 30, i === 11 ? "#e0262b" : "rgba(27,29,54,.16)", 3, "");
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
        `<circle cx="${o.x + w / 2 - 44}" cy="${o.y}" r="11" fill="${INK}"/>${T(o.x - 26, o.y + 30, o.t, 84, o.ink || "#e0262b")}</g>`; }, play: pop },
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
  };

  // Ambient motion that keeps a held shot alive.
  function animate(tl, svg, t0, t1) {
    const bits = svg.querySelectorAll(".bit"); if (bits.length) gsap.set(bits, { transformOrigin: "50% 50%", smoothOrigin: false });
    const d = t1 - t0;
    svg.querySelectorAll(".cloud").forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 60 + i * 30, duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".bit").forEach((b, i) => tl.fromTo(b, { y: -160 - (i % 7) * 60 }, { y: 760 + (i % 5) * 90, rotation: (i % 2 ? 1 : -1) * (90 + i * 7), duration: Math.max(d, 2.5) * (0.8 + (i % 4) * 0.22), ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".pass").forEach((p) => tl.fromTo(p, { x: 0 }, { x: -Math.min(110 * d, 2800), duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".sway").forEach((p, i) => { gsap.set(p, { transformOrigin: "50% 0%", smoothOrigin: false }); tl.fromTo(p, { rotation: -4 }, { rotation: 4, duration: 1.1 + (i % 3) * 0.2, yoyo: true, repeat: Math.ceil(d / 1.1) + 1, ease: "sine.inOut", immediateRender: false }, t0); });
    svg.querySelectorAll(".tick").forEach((k, i) => { for (let t = t0 + 0.4 + (i % 6) * 0.31; t < t1; t += 1.7 + (i % 4) * 0.4) { tl.set(k, { opacity: 0.35 }, t); tl.set(k, { opacity: 1 }, t + 0.12); } });
  }

  window.Sets = { SETS, PROPS, animate };
})();
