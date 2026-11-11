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
      b += cut(`<g transform="rotate(-3 330 300)">${R(210, 190, 250, 300, "#f6f1e4", 0)}${T(335, 300, o.poster || "DO WHAT", 54)}${T(335, 366, o.poster2 || "YOU LOVE", 54)}<path d="M250,410 L420,410" stroke="#e0262b" stroke-width="12"/></g>`);
      b += `<path d="M700,0 L700,120" ${st}/>` + cut(`<path d="M620,190 Q700,90 780,190Z" fill="#e8a317" ${st}/>`) + plant(150, 830);
      const f = cut(R(880, 720, 960, 44, "#8a5a3c", 8) + R(910, 764, 900, 316, "#a5714d", 0) + `<path d="M1360,764 L1360,1080" ${st}/>`) + monitor(980, 508, 330, o.screen) +
        cut(R(1420, 664, 60, 58, "#f6f1e4", 8) + `<path d="M1480,676 Q1510,680 1506,700 Q1502,716 1480,712" fill="none" ${st}/>`) + cut(R(1560, 696, 200, 24, INK, 8, ""));
      return { back: b, front: o.desk === false ? "" : f };
    },

    trading_floor(o) {
      const up = o.mood !== "red", r = rng(up ? 11 : 23), cg = "#46e08a", cr = "#ff5a4f";
      let b = R(0, 0, 1920, 1080, "#1c2340", 0, "") + R(70, 60, 1780, 400, "#101528", 10);
      for (let i = 0; i < 24; i++) { const x = 100 + (i % 8) * 218, y = 96 + Math.floor(i / 8) * 122, good = r() < (up ? 0.85 : 0.12), col = good ? cg : cr;
        b += `<g class="tick">${T(x, y + 40, ticker(r), 36, "#c9cfe6", "start", 'font-family="IBM Plex Mono" font-weight="700"')}` +
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

    night_city(o) {
      const r = rng(57); let b = R(0, 0, 1920, 1080, "#141a36", 0, "") + `<circle cx="1560" cy="190" r="70" fill="#f6f1e4" ${st}/><circle cx="1590" cy="170" r="60" fill="#141a36"/>`;
      for (let i = 0; i < 40; i++) b += `<circle cx="${(r() * 1920).toFixed(0)}" cy="${(r() * 420).toFixed(0)}" r="${(2 + r() * 3).toFixed(1)}" fill="#f6f1e4"/>`;
      b += skyline(-20, 1940, 830, r, ["#232c54", "#2c3766", "#1c2340"], true) + R(0, 826, 1920, 254, "#0f1326", 0, "") + `<path d="M0,826 L1920,826" ${st}/>`;
      return { back: b };
    },
  };

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
    // { type:"sign", x, y, t, size, rot, color }
    sign: {
      draw(o) { const size = o.size || 70, w = String(o.t).length * size * 0.5 + 70;
        return `<g class="cut" transform="rotate(${o.rot || -3} ${o.x} ${o.y})">${R(o.x - w / 2, o.y - size, w, size * 1.5, o.color || "#f6f1e4", 6)}${T(o.x, o.y + size * 0.14, o.t, size, o.ink || INK)}</g>`; },
      play(tl, el, o, t0) { if (o.at == null) return; el.style.opacity = 0; gsap.set(el, { svgOrigin: o.x + " " + o.y, smoothOrigin: false });
        tl.fromTo(el, { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power4.in", immediateRender: false }, t0 + o.at); },
    },
  };

  // Ambient motion that keeps a held shot alive.
  function animate(tl, svg, t0, t1) {
    gsap.set(svg.querySelectorAll(".bit"), { transformOrigin: "50% 50%", smoothOrigin: false });
    const d = t1 - t0;
    svg.querySelectorAll(".cloud").forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: 60 + i * 30, duration: d, ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".bit").forEach((b, i) => tl.fromTo(b, { y: -160 - (i % 7) * 60 }, { y: 760 + (i % 5) * 90, rotation: (i % 2 ? 1 : -1) * (90 + i * 7), duration: Math.max(d, 2.5) * (0.8 + (i % 4) * 0.22), ease: "none", immediateRender: false }, t0));
    svg.querySelectorAll(".tick").forEach((k, i) => { for (let t = t0 + 0.4 + (i % 6) * 0.31; t < t1; t += 1.7 + (i % 4) * 0.4) { tl.set(k, { opacity: 0.35 }, t); tl.set(k, { opacity: 1 }, t + 0.12); } });
  }

  window.Sets = { SETS, PROPS, animate };
})();
