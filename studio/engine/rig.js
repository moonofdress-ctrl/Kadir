/* Character rig: every figure is drawn in code (SVG) from one skeleton.
   Rig v2 (13 Nov 2026): adult proportions. The head is about a third of the height, then a neck, shoulders,
   arms with elbows and five-fingered hands (forward kinematics: shoulder, elbow and wrist rotate), legs with knees,
   a face with its own jaw, nose, ears and hair, two tones on skin and clothes, clothes with collars, seams, pockets, buttons.
   Living things (THINGS) keep their floating gloves. Ink-navy outline, hard paper-cut shadow. Origin of a figure is the middle of its feet.
   Everything that moves is driven by the GSAP timeline, so it is deterministic and seek-safe. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#1b1d36", SW = 7;
  const st = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;

  // Text on a figure or its prop. It sits in a "txt" group so the engine can turn it back when the figure is mirrored.
  const txt = (x, y, t, size, fill) => `<g class="txt" transform="translate(${x},${y})"><text x="0" y="0" font-size="${Math.round(size)}" text-anchor="middle" fill="${fill || INK}">${String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></g>`;

  /* A person is a set of traits. Every key is optional; a storyboard can add people of its own with a "cast" table in its header
     (the same keys), so an episode's real people need no engine change.
       build: normal | tall | broad | slight | round        jaw: oval | square | round | long | heart | soft
       nose: button | straight | long | hook | wide | pointed | round      ears: "big" | "small"     age: young | adult | middle | old
       hair, hairStyle: cowlick | slick | bun | side_part | bob | long | short | cap (with cap: colour) | bald | curly | swept | buzz | ponytail | wavy
       skin, top, topStyle: hoodie | suit | suit3 | cardigan | tee | dress | checked | opensuit | turtleneck | jacket | polo | apron | coat | scrubs | blouse
       inner (what shows under an open top), tie, apron, legs, legStyle: pants | jeans | shorts | bare, shoes, shoeStyle: sneaker | dress | hightop | flat
       extras: freckles, glasses, glasses_small, shades_up, moustache, beard, stubble, goatee, grey_temples, heavy_brows, lanyard, loud_pattern,
               bolt_pattern, watch, pearls, earrings, pocket_square, chain, wrinkles */
  const CAST = {
    BENNY: { skin: "#f3c9a5", hair: "#6b4226", hairStyle: "cowlick", top: "#e8a317", topStyle: "hoodie", inner: "#f6f1e4", legs: "#2e3a59", legStyle: "jeans", shoes: "#f4f1ea", shoeStyle: "sneaker",
      jaw: "soft", nose: "button", ears: "big", age: "adult", extras: ["freckles"] },
    CHAD: { skin: "#f0bd98", hair: "#d8b064", hairStyle: "cap", cap: "#6b3fa0", top: "#6b3fa0", topStyle: "hoodie", inner: "#f6f1e4", legs: "#8a8f6a", legStyle: "shorts", shoes: "#e0262b", shoeStyle: "hightop",
      jaw: "long", nose: "pointed", age: "young", extras: ["shades_up", "bolt_pattern"], build: "tall" },
    HAL: { skin: "#ecc4a6", hair: "#c9ced6", hairStyle: "slick", top: "#1f2a44", topStyle: "suit3", tie: "#d4a72c", legs: "#1f2a44", shoes: "#2b2b2b", shoeStyle: "dress",
      jaw: "round", nose: "round", age: "middle", extras: ["moustache", "glasses_small", "watch", "pocket_square"], build: "round" },
    MARTHA: { skin: "#dba77e", hair: "#a6522e", hairStyle: "bun", top: "#1f8a8a", topStyle: "cardigan", inner: "#bcd3e0", legs: "#bcd3e0", shoes: "#f4f1ea", shoeStyle: "flat",
      jaw: "heart", nose: "straight", age: "middle", extras: ["glasses", "chain"] },
    REGGIE: { skin: "#e8c5a9", hair: "#8d9199", hairStyle: "side_part", top: "#7a7f87", topStyle: "suit", tie: "#e0262b", legs: "#5e636b", shoes: "#2b2b2b", shoeStyle: "dress",
      jaw: "long", nose: "long", age: "middle", extras: ["heavy_brows", "lanyard"], build: "tall" },
    // Guest figures (STYLE_GUIDE, Real people): two or three public traits each, clearly cartoons, no two alike.
    ALLISON_ELLSWORTH: { skin: "#f3c9a5", hair: "#e3c27a", hairStyle: "long", top: "#ef7f6a", topStyle: "dress", legs: "#f3c9a5", legStyle: "bare", shoes: "#f4f1ea", shoeStyle: "flat",
      jaw: "heart", nose: "button", build: "slight", extras: ["earrings"] },
    STEPHEN_ELLSWORTH: { skin: "#e8bd98", hair: "#5a3a22", hairStyle: "short", top: "#4a8f7a", topStyle: "checked", legs: "#4b5a78", legStyle: "jeans", shoes: "#6b4a2e", shoeStyle: "dress",
      jaw: "square", nose: "straight", build: "broad", extras: ["beard"] },
    ROHAN_OZA: { skin: "#d9a47c", hair: "#2b2b33", hairStyle: "slick", top: "#222536", topStyle: "opensuit", legs: "#222536", shoes: "#2b2b2b", shoeStyle: "dress",
      jaw: "square", nose: "hook", extras: ["grey_temples", "stubble"] },
    RAMON_LAGUARTA: { skin: "#e8c5a9", hair: "#e4e6ea", hairStyle: "short", top: "#9aa1ae", topStyle: "suit", tie: "#1b2a55", legs: "#8a909c", shoes: "#2b2b2b", shoeStyle: "dress",
      jaw: "oval", nose: "long", age: "old", extras: [] },
    // Five in a row on a dark stage: a silhouette only (no face, no traits). Drawn by make() when the actor says "shadow": true.
    SHARK: { skin: "#232b52", hair: "#232b52", hairStyle: "side_part", top: "#232b52", topStyle: "tee", legs: "#232b52", shoes: "#1b2142", extras: [], flat: true },
  };
  // An episode's own people ("cast" in the storyboard header): added before the shots are drawn.
  function register(table) { Object.keys(table || {}).forEach((k) => { CAST[k] = Object.assign({}, CAST[k] || {}, table[k]); }); }
  // Background people: pick traits by index so crowds are varied but deterministic.
  const EXTRA_SKIN = ["#f3c9a5", "#dba77e", "#b98562", "#8a5a3c", "#f0bd98", "#e8c5a9"];
  const EXTRA_TOP = ["#3d6fb6", "#b8473d", "#4f8f5b", "#8b5fb3", "#c9892b", "#56606f", "#c95f8d"];
  const EXTRA_HAIR = ["#2b2118", "#6b4226", "#d8b064", "#8d9199", "#a6522e", "#1b1d36"];
  const EXTRA_STYLE = ["side_part", "slick", "bob", "cowlick", "bun", "bald", "short", "curly", "ponytail", "buzz"];
  function extra(i) {
    i = Math.abs(i | 0);
    return { skin: EXTRA_SKIN[i % 6], hair: EXTRA_HAIR[(i * 5 + 1) % 6], hairStyle: EXTRA_STYLE[(i * 7 + 2) % 10], top: EXTRA_TOP[(i * 3) % 7],
      topStyle: ["tee", "suit", "cardigan", "hoodie", "jacket", "polo", "blouse"][(i * 3 + 1) % 7], tie: "#e0262b", inner: "#f6f1e4", legs: ["#2e3a59", "#3b3f4a", "#6b5a45", "#4b5a78"][i % 4],
      legStyle: i % 5 === 2 ? "jeans" : "pants", shoes: ["#2b2b2b", "#f4f1ea", "#6b4a2e"][i % 3], build: ["normal", "slight", "broad", "tall", "normal", "round"][(i * 5 + 3) % 6],
      jaw: ["oval", "square", "round", "long", "heart", "soft"][(i * 7) % 6], nose: ["button", "straight", "long", "hook", "wide", "pointed", "round"][(i * 3 + 2) % 7],
      age: ["young", "adult", "middle", "old"][(i * 11 + 1) % 4], extras: i % 3 === 0 ? ["glasses"] : i % 7 === 4 ? ["beard"] : [] };
  }

  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(v * (1 - k) + 27 * k);
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join(""); };
  const tint = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(v + (255 - v) * k);
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join(""); };

  /* ---------------- Rig v2: drawing helpers ---------------- */
  let UID = 0; // clip-path ids: unique in the page and the same on every render (no randomness)
  const f1 = (v) => Math.round(v * 10) / 10;
  // A smooth path through points (Catmull-Rom as cubic Béziers), closed or open.
  function smooth(pts, closed) {
    const n = pts.length, P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) { const a = P(i - 1), b = P(i), c = P(i + 1), e = P(i + 2);
      d += ` C${f1(b[0] + (c[0] - a[0]) / 6)},${f1(b[1] + (c[1] - a[1]) / 6)} ${f1(c[0] - (e[0] - b[0]) / 6)},${f1(c[1] - (e[1] - b[1]) / 6)} ${f1(c[0])},${f1(c[1])}`; }
    return d + (closed ? "Z" : "");
  }
  // The right half of a symmetric outline (top to bottom, both ends on x = 0) made whole.
  const both = (half) => half.concat(half.slice(1, -1).reverse().map(([x, y]) => [-x, y]));
  const mv = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  const flipX = (pts) => pts.map(([x, y]) => [-x, y]);
  // A part in two tones: its colour, a shadow side on the right (the light comes from the top left), the ink outline.
  // `inside` is drawn clipped to the part (seams, patterns and pockets never spill over the edge).
  function toned(d, fill, o) {
    o = o || {}; const id = "rg" + UID++, dx = o.dx == null ? 12 : o.dx, dy = o.dy == null ? 4 : o.dy;
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${o.dark || shade(fill, 0.2)}"/>` +
      `<g clip-path="url(#${id})"><path d="${d}" fill="${fill}" transform="translate(${-dx},${-dy})"/>${o.inside || ""}</g>` +
      (o.noline ? "" : `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${o.sw || 6.5}" stroke-linejoin="round"/>`);
  }
  // The ink under a part whose fill is drawn later without an outline: joints (knees) then show no seam.
  const under = (d, w) => `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="${(w || 6.5) * 2}" stroke-linejoin="round"/>`;
  const line = (d, w, c, more) => `<path d="${d}" fill="none" stroke="${c || INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${more || ""}/>`;
  const shape = (d, fill, w, more) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w == null ? 4.5 : w}" stroke-linejoin="round" ${more || ""}/>`;
  const poly = (pts) => "M" + pts.map((p) => f1(p[0]) + "," + f1(p[1])).join(" L") + "Z";
  // A limb segment: a capsule hanging from (0, y0) to (0, y1), half-width w.
  const capsule = (w, y0, y1) => `M${f1(-w)},${f1(y0)} L${f1(-w)},${f1(y1)} A${f1(w)},${f1(w)} 0 0 0 ${f1(w)},${f1(y1)} L${f1(w)},${f1(y0)} A${f1(w)},${f1(w)} 0 0 0 ${f1(-w)},${f1(y0)}Z`;

  /* Bodies. H: height to the crown; sh: half-width at the shoulders; waist, hip: half-widths; leg: height of the hips;
     lw: half-width of a trouser leg; aw: half-width of a sleeve; hand: hand size. The head is about 186 tall: a third of a normal figure. */
  const BUILDS = {
    normal: { H: 600, sh: 84, waist: 64, hip: 66, leg: 205, lw: 25, aw: 21, hand: 1 },
    tall: { H: 650, sh: 80, waist: 58, hip: 60, leg: 245, lw: 23, aw: 19, hand: 1 },
    broad: { H: 620, sh: 106, waist: 84, hip: 80, leg: 210, lw: 30, aw: 26, hand: 1.12 },
    slight: { H: 588, sh: 70, waist: 52, hip: 60, leg: 212, lw: 21, aw: 17, hand: 0.9 },
    round: { H: 560, sh: 90, waist: 112, hip: 92, leg: 166, lw: 30, aw: 24, hand: 1.04 },
  };
  // The right half of the head, crown to chin, as [x, y below the crown].
  const JAW = {
    oval: [[0, 0], [50, 8], [72, 52], [74, 104], [62, 146], [36, 176], [0, 186]],
    square: [[0, 0], [54, 6], [76, 48], [78, 112], [74, 152], [50, 180], [0, 186]],
    round: [[0, 0], [56, 10], [80, 62], [78, 120], [56, 164], [26, 184], [0, 186]],
    long: [[0, 0], [46, 8], [66, 52], [68, 118], [58, 164], [32, 192], [0, 198]],
    heart: [[0, 0], [56, 8], [80, 58], [74, 112], [48, 156], [18, 182], [0, 188]],
    soft: [[0, 0], [54, 8], [76, 56], [76, 112], [62, 156], [34, 182], [0, 190]],
  };
  const headW = (J, y) => { for (let i = 1; i < J.length; i++) if (y <= J[i][1]) { const a = J[i - 1], b = J[i], t = (y - a[1]) / Math.max(1, b[1] - a[1]); return a[0] + (b[0] - a[0]) * t; } return 0; };
  // Landmarks of one figure (feet at 0, up is negative).
  function geo(c) {
    const B = BUILDS[c.build] || BUILDS.normal, J = JAW[c.jaw] || JAW.oval, hh = J[J.length - 1][1];
    const yT = -B.H, yC = yT + hh, yS = yC + 26, yH = -B.leg, yE = yT + 96;
    const jx = B.sh - B.aw * 0.95, jy = yS + B.aw * 0.9, R = yH + 22 - jy;
    return { B, J, hh, yT, yC, yS, yH, yE, yM: yE + 62 + (hh - 186) * 0.5, tq: 6, hw: headW(J, 100), jx, jy, R, L1: R * 0.52, L2: R * 0.48,
      hx: B.hip * 0.48, T1: B.leg * 0.48, T2: B.leg * 0.52 - 22 };
  }

  /* ---------------- hair: a back layer (behind the head) and a front layer (over it) ---------------- */
  function scallop(cx, cy, rx, ry, a0, a1, n, bump) { const out = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, k = 1 + (i % 2 ? bump : 0); out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return out; }
  function hair2(c, G) {
    const k = G.hw / 76, P = (pts) => pts.map(([x, y]) => [x * k, y + G.yT]), h = c.hair || "#2b2118", hd = shade(h, 0.3), hl = tint(h, 0.35);
    const fill = (pts, col) => `<path d="${smooth(P(pts), true)}" fill="${col || h}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    const strands = (list, col, w) => list.map((pts) => line(smooth(P(pts), false), w || 3, col || hd)).join("");
    const sheen = line(smooth(P([[-52, 16], [-34, 0], [-10, -6]]), false), 5, hl, 'opacity=".75"');
    const LONGF = [[-86, 120], [-86, 30], [-58, -6], [0, -14], [58, -6], [86, 30], [86, 120], [76, 118], [70, 60], [42, 32], [6, 22], [0, 30], [-6, 22], [-42, 32], [-70, 60], [-76, 118]];
    let back = "", front = "";
    switch (c.hairStyle) {
      case "cowlick":
        front = fill([[-80, 80], [-84, 36], [-60, 0], [-22, -18], [22, -20], [60, -4], [84, 32], [80, 80], [70, 62], [62, 42], [46, 48], [32, 32], [12, 42], [-8, 28], [-28, 42], [-46, 32], [-62, 48], [-72, 66]]) +
          fill([[-6, -12], [-20, -46], [2, -76], [34, -84], [18, -60], [16, -30], [10, -12]]) + strands([[[-40, 4], [-26, 22]], [[22, -4], [36, 16]], [[-66, 30], [-56, 46]], [[52, 10], [62, 30]]]) + sheen; break;
      case "slick":
        front = fill([[-78, 76], [-80, 30], [-54, -4], [0, -14], [54, -4], [80, 30], [78, 76], [68, 56], [50, 32], [20, 24], [-20, 24], [-50, 32], [-68, 56]]) +
          strands([[[-46, 30], [-34, 4], [-10, -6]], [[-6, 24], [6, 0], [26, -8]], [[34, 28], [48, 8], [62, 6]]], hd, 2.6) + sheen; break;
      case "side_part":
        front = fill([[-80, 78], [-82, 30], [-56, -6], [-10, -16], [40, -12], [74, 8], [84, 44], [80, 82], [70, 60], [52, 36], [20, 26], [-12, 28], [-30, 22], [-46, 32], [-62, 46], [-72, 66]]) +
          strands([[[-30, 22], [-36, 4], [-40, -12]], [[-8, 20], [18, -4]], [[28, 24], [58, 8]]]) + sheen; break;
      case "short":
        front = fill([[-78, 72], [-80, 30], [-54, -6], [0, -16], [54, -6], [80, 30], [78, 72], [70, 56], [56, 38], [30, 30], [0, 34], [-30, 30], [-56, 38], [-70, 56]]) +
          strands([[[-50, 22], [-40, 10]], [[-14, 18], [-4, 4]], [[20, 18], [30, 6]], [[50, 24], [58, 12]]], hd, 2.6) + sheen; break;
      case "buzz":
        front = fill([[-76, 66], [-77, 24], [-52, -6], [0, -10], [52, -6], [77, 24], [76, 66], [68, 50], [50, 30], [0, 26], [-50, 30], [-68, 50]]); break;
      case "swept":
        front = fill([[-80, 72], [-84, 26], [-60, -18], [-10, -32], [44, -28], [78, -6], [86, 34], [80, 72], [70, 52], [56, 24], [26, 14], [-10, 18], [-44, 26], [-66, 46], [-72, 64]]) +
          strands([[[-50, 22], [-24, -10], [20, -22]], [[-14, 16], [18, -6], [52, -12]], [[24, 14], [52, 2], [74, 10]]], hd, 2.6) + sheen; break;
      case "bun": {
        const bun = scallop(18, -34, 36, 34, 0, Math.PI * 2 * 13 / 14, 13, 0.12);
        back = fill(bun) + line(smooth(P([[6, -40], [18, -26], [30, -42]]), false), 3, hd);
        const cap = scallop(0, 70, 86, 82, Math.PI * 1.02, Math.PI * 1.98, 12, 0.06);
        front = fill(cap.concat([[72, 66], [56, 40], [30, 30], [4, 36], [-24, 28], [-50, 38], [-70, 62]])) +
          strands([[[-60, 24], [-50, 14], [-40, 24]], [[-14, 8], [-4, -2], [6, 8]], [[34, 12], [44, 2], [54, 14]], [[-84, 92], [-90, 104], [-80, 112]], [[84, 92], [90, 104], [80, 112]]], hd, 3) + sheen; break; }
      case "curly": {
        back = fill(scallop(0, 56, 106, 100, 0, Math.PI * 2 * 17 / 18, 17, 0.1), hd);
        front = fill(scallop(0, 70, 88, 84, Math.PI * 1.02, Math.PI * 1.98, 12, 0.08).concat([[70, 62], [50, 44], [20, 40], [-20, 40], [-50, 44], [-70, 62]])) + sheen; break; }
      case "bob":
        back = fill([[-84, 20], [-92, 100], [-90, 168], [-62, 186], [62, 186], [90, 168], [92, 100], [84, 20], [0, -14]], hd);
        front = fill([[-88, 96], [-88, 30], [-60, -6], [0, -16], [60, -6], [88, 30], [88, 96], [78, 92], [74, 54], [40, 50], [0, 54], [-40, 50], [-74, 54], [-78, 92]]) + sheen; break;
      case "long":
        back = fill([[-82, 20], [-94, 120], [-100, 250], [-66, 274], [66, 274], [100, 250], [94, 120], [82, 20], [0, -14]], hd) + strands([[[-80, 150], [-84, 240]], [[80, 150], [84, 240]]], shade(h, 0.45));
        front = fill(LONGF) + strands([[[-60, 70], [-70, 110]], [[60, 70], [70, 110]]]) + sheen; break;
      case "wavy":
        back = fill([[-82, 20], [-98, 90], [-88, 150], [-104, 210], [-92, 262], [-60, 278], [60, 278], [92, 262], [104, 210], [88, 150], [98, 90], [82, 20], [0, -14]], hd);
        front = fill(LONGF) + sheen; break;
      case "ponytail":
        back = fill([[46, 24], [92, 52], [108, 132], [96, 214], [78, 150], [60, 80]], hd);
        front = fill([[-78, 76], [-80, 30], [-54, -4], [0, -14], [54, -4], [80, 30], [78, 76], [68, 56], [50, 32], [20, 26], [-20, 26], [-50, 32], [-68, 56]]) + sheen; break;
      case "cap": {
        const cap = c.cap || "#3d6fb6";
        back = fill([[-74, 56], [-90, 82], [-86, 112], [-72, 98]]) + fill([[74, 56], [90, 82], [86, 112], [72, 98]]) + fill([[56, 4], [110, -10], [126, 8], [84, 30]], shade(cap, 0.25));
        front = fill([[-84, 60], [-86, 22], [-58, -14], [0, -24], [58, -14], [86, 22], [84, 60], [0, 50]], cap) + fill([[-20, 58], [0, 34], [20, 58]]) +
          strands([[[-82, 54], [0, 44], [82, 54]], [[-40, -6], [-30, 40]], [[40, -6], [30, 40]]], shade(cap, 0.3), 3) + `<circle cx="0" cy="${G.yT - 22}" r="6" fill="${shade(cap, 0.2)}" stroke="${INK}" stroke-width="4"/>`; break; }
      case "bald":
        front = fill([[-74, 54], [-84, 82], [-80, 112], [-70, 100], [-68, 70]]) + fill([[74, 54], [84, 82], [80, 112], [70, 100], [68, 70]]); break;
      default: break;
    }
    if ((c.extras || []).includes("grey_temples")) front += fill([[-80, 60], [-82, 40], [-70, 30], [-70, 66]], "#b8bcc6") + fill([[80, 60], [82, 40], [70, 30], [70, 66]], "#b8bcc6");
    return { back, front };
  }

  /* ---------------- the face ---------------- */
  const st4 = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
  const eye2 = (x, y, heavy) => `<g class="eye" transform="translate(${x},${y})">
      <g class="e-open"><ellipse rx="13" ry="13.5" fill="#fff" stroke="${INK}" stroke-width="3"/><g class="pupil"><circle r="7.5" fill="${INK}"/><circle cx="-2.6" cy="-3" r="2.4" fill="#fff"/></g>${line("M-15,-3 Q-3,-18 15,-5", 5.5)}</g>
      <g class="e-wide"><ellipse rx="15" ry="17.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/><g class="pupil"><circle r="5.2" fill="${INK}"/></g></g>
      <g class="e-half"><ellipse rx="13" ry="13.5" fill="#fff" stroke="${INK}" stroke-width="3"/><g class="pupil"><circle cy="3" r="7" fill="${INK}"/></g><path d="M-16,-18 L16,-18 L16,-1 L-16,-1Z" fill="SKIN"/>${line("M-15,-1 Q0,-4 15,-1", 5.5)}</g>
      <g class="e-happy">${line("M-14,4 Q0,-10 14,4", 5.5)}</g>
      <g class="e-blink"><ellipse rx="16" ry="17" fill="SKIN"/>${line("M-14,0 Q0,7 14,0", 5)}</g>
      <path class="brow" d="M-18,-23 Q-2,-30 18,-24" fill="none" stroke="${INK}" stroke-width="${heavy ? 10 : 7}" stroke-linecap="round"/>
    </g>`;
  // Mouths of a person: the same names as the living things' MOUTHS, smaller and with adult proportions.
  const MOUTHS2 = {
    smile: line("M-19,-4 Q0,10 19,-4", 4.5), smirk: line("M-15,3 Q4,8 20,-8", 4.5), flat: line("M-15,1 L15,1", 4.5), frown: line("M-18,7 Q0,-7 18,7", 4.5),
    wavy: line("M-20,2 Q-10,-6 0,2 Q10,10 20,2", 4.5),
    grin: `<path d="M-24,-6 L24,-6 Q21,22 0,22 Q-21,22 -24,-6Z" fill="#5a1f2b" ${st4}/><path d="M-21,-4 L21,-4 L19,4 L-19,4Z" fill="#fff"/><path d="M-11,19 Q0,9 11,19" fill="#e8707c"/>`,
    o: `<ellipse rx="9" ry="12" fill="#5a1f2b" ${st4}/>`,
    tA: `<path d="M-15,-6 Q0,-12 15,-6 Q17,16 0,17 Q-17,16 -15,-6Z" fill="#5a1f2b" ${st4}/><path d="M-8,14 Q0,5 8,14" fill="#e8707c"/>`,
    tE: `<path d="M-18,-4 L18,-4 Q16,10 0,10 Q-16,10 -18,-4Z" fill="#5a1f2b" ${st4}/><path d="M-15,-2 L15,-2 L14,3 L-14,3Z" fill="#fff"/>`,
    tO: `<ellipse rx="7.5" ry="9.5" fill="#5a1f2b" ${st4}/>`, tM: line("M-12,1 Q0,4 12,1", 4.5),
    scream: `<path d="M-22,-13 Q0,-22 22,-13 Q27,28 0,30 Q-27,28 -22,-13Z" fill="#5a1f2b" ${st4}/><path d="M-17,-11 Q0,-17 17,-11 L16,-4 L-16,-4Z" fill="#fff"/><path d="M-13,26 Q0,11 13,26" fill="#e8707c"/>`,
    teeth: `<path d="M-23,-8 L23,-8 Q25,14 0,14 Q-25,14 -23,-8Z" fill="#fff" ${st4}/>${line("M-21,3 L21,3 M-11,-7 L-11,13 M0,-7 L0,14 M11,-7 L11,13", 2.5)}`,
  };
  function nose2(kind, x, y, sk) {
    const sd = shade(sk, 0.2), P = (d) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, a, b) => `${f1(+a + x)},${f1(+b + y)}`);
    switch (kind) {
      case "straight": return `<path d="${P("M4,10 L9,36 Q10,44 0,44Z")}" fill="${sd}"/>` + line(P("M4,10 L9,36 Q11,44 1,45 Q-5,45 -8,41"), 4);
      case "long": return `<path d="${P("M4,8 L11,44 Q12,52 1,52Z")}" fill="${sd}"/>` + line(P("M4,8 L11,44 Q13,53 1,53 Q-6,53 -9,48"), 4);
      case "hook": return `<path d="${P("M2,6 Q16,22 12,42 Q8,50 0,46Z")}" fill="${sd}"/>` + line(P("M2,6 Q16,22 12,42 Q8,51 -2,47 Q-8,45 -8,40"), 4);
      case "wide": return line(P("M3,12 L5,28"), 3, sd) + line(P("M-15,40 Q-20,30 -9,28 M15,40 Q20,30 9,28 M-12,44 Q0,49 12,44"), 4);
      case "pointed": return `<path d="${P("M3,8 L17,40 L0,43Z")}" fill="${sd}"/>` + line(P("M3,8 L17,40 Q8,45 -3,42"), 4);
      case "round": return line(P("M3,14 L5,26"), 3, sd) + `<path d="${P("M-6,30 Q-12,42 -2,45 Q4,48 10,45 Q18,40 10,30 Q2,24 -6,30Z")}" fill="${sd}" stroke="${INK}" stroke-width="4"/>`;
      default: return line(P("M2,22 Q11,36 2,42 Q-4,44 -8,40"), 4) + `<circle cx="${f1(x - 2)}" cy="${f1(y + 40)}" r="2.2" fill="${INK}"/>`;
    }
  }
  // Marks on the skin: freckles, age lines, stubble and beard (under the eyes and the mouth).
  function skinMarks(c, G) {
    const ex = c.extras || [], tq = G.tq, y = G.yE, sd = shade(c.skin, 0.3); let s = "";
    if (ex.includes("freckles")) s += [-48, -38, -28, 28, 38, 48].map((x, i) => `<circle cx="${x + tq}" cy="${y + 28 + (i % 3 === 1 ? 6 : 0)}" r="2.6" fill="${sd}"/>`).join("");
    const age = c.age === "old" ? 2 : c.age === "middle" || ex.includes("wrinkles") ? 1 : 0;
    if (age) s += line(`M${tq - 23},${y + 46} Q${tq - 29},${y + 58} ${tq - 25},${f1(G.yM + 4)} M${tq + 25},${y + 46} Q${tq + 31},${y + 58} ${tq + 27},${f1(G.yM + 4)}`, 2.6, sd);
    if (age > 1) s += line(`M${tq - 24},${G.yT + 70} Q${tq},${G.yT + 64} ${tq + 24},${G.yT + 70} M${tq - 16},${G.yT + 80} Q${tq},${G.yT + 76} ${tq + 16},${G.yT + 80} M${tq - 48},${y - 2} L${tq - 55},${y - 6} M${tq - 48},${y + 5} L${tq - 55},${y + 7} M${tq + 48},${y - 2} L${tq + 55},${y - 6} M${tq + 48},${y + 5} L${tq + 55},${y + 7}`, 2.4, sd);
    if (ex.includes("beard") || ex.includes("stubble")) { const J = G.J, a = headW(J, ex.includes("beard") ? 104 : 124), b = headW(J, G.hh - 34), m = G.yM - G.yT, full = ex.includes("beard");
      const pts = [[-a, ex.includes("beard") ? 104 : 124], [-b - 1, G.hh - 34], [-30, G.hh - 4], [0, G.hh + (full ? 10 : 0)], [30, G.hh - 4], [b + 1, G.hh - 34], [a, ex.includes("beard") ? 104 : 124], [a - 14, ex.includes("beard") ? 116 : 134], [tq + 26, m - 6], [tq + 20, m + 12], [tq, m + 16], [tq - 20, m + 12], [tq - 26, m - 6], [-a + 14, ex.includes("beard") ? 116 : 134]];
      s += full ? `<path d="${smooth(mv(pts, 0, G.yT), true)}" fill="${c.hair}" stroke="${INK}" stroke-width="5"/>` + line(`M${tq - 10},${G.yM - 13} L${tq + 10},${G.yM - 13}`, 9, c.hair)
        : `<path d="${smooth(mv(pts, 0, G.yT), true)}" fill="${INK}" opacity=".09"/>`; }
    if (ex.includes("goatee")) s += `<path d="${smooth([[tq - 15, G.yM + 9], [tq - 16, G.yC - 2], [tq, G.yC + 8], [tq + 16, G.yC - 2], [tq + 15, G.yM + 9], [tq, G.yM + 13]], true)}" fill="${c.hair}" stroke="${INK}" stroke-width="4"/>`;
    return s;
  }
  // Glasses and moustache sit over the eyes and the mouth.
  function faceWear(c, G) {
    const ex = c.extras || [], tq = G.tq, y = G.yE; let s = "";
    if (ex.includes("moustache")) s += `<path d="M${tq - 25},${f1(G.yM - 5)} Q${tq - 12},${f1(G.yM - 18)} ${tq},${f1(G.yM - 12)} Q${tq + 12},${f1(G.yM - 18)} ${tq + 25},${f1(G.yM - 5)} Q${tq + 12},${f1(G.yM - 9)} ${tq},${f1(G.yM - 7)} Q${tq - 12},${f1(G.yM - 9)} ${tq - 25},${f1(G.yM - 5)}Z" fill="${c.hair}" ${st4}/>`;
    if (ex.includes("glasses")) s += `<circle cx="${tq - 30}" cy="${y}" r="20" fill="rgba(255,255,255,.18)" ${st4}/><circle cx="${tq + 30}" cy="${y}" r="20" fill="rgba(255,255,255,.18)" ${st4}/>` + line(`M${tq - 10},${y - 2} Q${tq},${y - 8} ${tq + 10},${y - 2} M${tq - 50},${y - 4} L${tq - 64},${y - 8} M${tq + 50},${y - 4} L${tq + 62},${y - 8}`, 4);
    if (ex.includes("glasses_small")) s += `<rect x="${tq - 47}" y="${y + 6}" width="32" height="15" rx="4" fill="rgba(255,255,255,.28)" ${st4}/><rect x="${tq + 15}" y="${y + 6}" width="32" height="15" rx="4" fill="rgba(255,255,255,.28)" ${st4}/>` + line(`M${tq - 15},${y + 12} L${tq + 15},${y + 12}`, 3.5);
    return s;
  }
  // Things worn on the head over the hair.
  function headWear(c, G) {
    const ex = c.extras || [], y = G.yT, k = G.hw / 76; let s = "";
    if (ex.includes("shades_up")) s += `<path d="M${-74 * k},${y + 30} L${74 * k},${y + 30} L${64 * k},${y + 52} Q${40 * k},${y + 60} ${14 * k},${y + 46} L0,${y + 38} L${-14 * k},${y + 46} Q${-40 * k},${y + 60} ${-64 * k},${y + 52}Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` + line(`M${-50 * k},${y + 38} L${-34 * k},${y + 36}`, 3, "#5d6489");
    if (ex.includes("earrings")) { const ex2 = headW(G.J, 118); s += `<circle cx="${f1(-ex2 - 4)}" cy="${G.yE + 42}" r="6" fill="#f0b429" ${st4}/><circle cx="${f1(ex2 + 2)}" cy="${G.yE + 42}" r="5" fill="#f0b429" ${st4}/>`; }
    return s;
  }
  function head2(c, G, back) {
    const J = G.J, sk = c.skin, sd = shade(sk, 0.18), hr = hair2(c, G), big = c.ears === "big" ? 1.25 : c.ears === "small" ? 0.85 : 1, ey = G.yE + 16;
    const ear = (s) => { const x = s * (headW(J, 110) - 6), k = s > 0 ? 0.82 : 1;
      return `<g transform="translate(${f1(x)},${f1(ey)}) scale(${s * k},1)"><ellipse cx="6" cy="0" rx="${f1(14 * big)}" ry="${f1(23 * big)}" fill="${s > 0 ? sd : sk}" stroke="${INK}" stroke-width="5.5"/>${line(`M${f1(4 * big)},${f1(-12 * big)} Q${f1(15 * big)},${f1(-3 * big)} ${f1(6 * big)},${f1(10 * big)}`, 3.5)}</g>`; };
    const heavy = (c.extras || []).includes("heavy_brows"), mouths = Object.keys(MOUTHS2).map((k) => `<g class="m-${k}">${MOUTHS2[k]}</g>`).join(""), tq = G.tq;
    return { back: hr.back, main: ear(-1) + ear(1) + toned(smooth(mv(both(J), 0, G.yT), true), sk, { dx: 13, dy: 3 }) + skinMarks(c, G) +
      `<g class="face">${eye2(tq - 30, G.yE, heavy)}${eye2(tq + 30, G.yE, heavy)}${nose2(c.nose, tq + 2, G.yE, sk)}
        <g class="mouth" transform="translate(${tq},${f1(G.yM)})">${mouths}</g>${faceWear(c, G)}
        <path class="sweat" d="M${tq + 62},${G.yE - 40} Q${tq + 52},${G.yE - 22} ${tq + 62},${G.yE - 16} Q${tq + 72},${G.yE - 22} ${tq + 62},${G.yE - 40}Z" fill="#7fd0f0" ${st4}/>
        <path class="tear" d="M${tq - 30},${G.yE + 14} Q${tq - 38},${G.yE + 28} ${tq - 30},${G.yE + 33} Q${tq - 22},${G.yE + 28} ${tq - 30},${G.yE + 14}Z" fill="#7fd0f0" ${st4}/>
      </g>` + (back ? backHair(c, G) : `<g class="hf">${hr.front}</g>` + headWear(c, G)) };
  }
  // Seen from behind (the listener of an over-the-shoulder shot, a figure that turns away): hair over the whole back of the head.
  function backHair(c, G) {
    const J = G.J, k = G.hw / 76, bald = c.hairStyle === "bald" || c.hairStyle === "buzz", long = /long|wavy|bob|curly/.test(c.hairStyle || ""), nape = long ? G.hh + 10 : 150;
    const half = J.filter((p) => p[1] < nape - 8).map(([x, y]) => [x * 1.07, y - 8]).concat([[headW(J, nape) * 0.9, nape], [0, nape + 8]]);
    if (c.hairStyle === "cap") return toned(smooth(mv(both([[0, -24], [58, -14], [86, 22], [84, 60], [0, 62]].map(([x, y]) => [x * k, y])), 0, G.yT), true), c.cap || "#3d6fb6", { dx: 10 });
    return bald ? "" : toned(smooth(mv(both(half), 0, G.yT), true), c.hair || "#2b2118", { dx: 12, inside: line(smooth(mv([[-30, 20], [-10, 60], [-16, 120]], 0, G.yT), false), 3, shade(c.hair || "#2b2118", 0.3)) + line(smooth(mv([[24, 16], [34, 70], [28, 126]], 0, G.yT), false), 3, shade(c.hair || "#2b2118", 0.3)) });
  }

  /* ---------------- torso and clothes ---------------- */
  const LONG_SLEEVE = { hoodie: 1, suit: 1, suit3: 1, cardigan: 1, checked: 1, opensuit: 1, turtleneck: 1, jacket: 1, coat: 1, blouse: 1 };
  function torso2(c, G, o) {
    const B = G.B, sh = B.sh, wa = B.waist, hp = B.hip, yS = G.yS, yH = G.yH, nw = 24, top = c.top || "#56606f", dk = shade(top, 0.24), lt = tint(top, 0.12), ex = c.extras || [];
    const inner = c.inner || "#f6f1e4", shirt = "#f6f1e4", sk = c.skin, style = c.topStyle || "tee";
    const d = `M${-nw},${yS - 8} L${nw},${yS - 8} C${nw + 22},${yS - 4} ${sh - 20},${yS - 2} ${sh - 6},${yS + 14} C${sh + 4},${yS + 26} ${sh + 2},${yS + 60} ${sh - 4},${yS + 84} ` +
      `C${sh - 10},${yS + 110} ${wa},${yH - 80} ${wa},${yH - 44} C${wa},${yH - 14} ${hp},${yH - 8} ${hp},${yH + 14} L${-hp},${yH + 14} C${-hp},${yH - 8} ${-wa},${yH - 14} ${-wa},${yH - 44} ` +
      `C${-wa},${yH - 80} ${-sh + 10},${yS + 110} ${-sh + 4},${yS + 84} C${-sh - 2},${yS + 60} ${-sh - 4},${yS + 26} ${-sh + 6},${yS + 14} C${-sh + 20},${yS - 2} ${-nw - 22},${yS - 4} ${-nw},${yS - 8}Z`;
    const neck = `<path d="M${-nw + 3},${G.yC - 44} L${-nw + 1},${yS + 4} L${nw - 1},${yS + 4} L${nw - 3},${G.yC - 44}Z" fill="${sk}" stroke="${INK}" stroke-width="5.5"/>` +
      `<path d="M${-nw + 3},${G.yC - 8} Q4,${G.yC + 18} ${nw - 3},${G.yC - 8} L${nw - 3},${G.yC - 30} L${-nw + 3},${G.yC - 30}Z" fill="${shade(sk, 0.22)}"/>`;
    const mir = (pts) => poly(pts) + " " + poly(flipX(pts));
    const hem = (col) => `<rect x="${-hp - 4}" y="${yH - 6}" width="${hp * 2 + 8}" height="${24}" fill="${col}"/>` + line(Array.from({ length: Math.floor(hp / 9) }, (_, i) => `M${-hp + 6 + i * 18},${yH - 4} L${-hp + 6 + i * 18},${yH + 16}`).join(" "), 2, shade(col, 0.25)) + line(`M${-hp - 4},${yH - 6} L${hp + 4},${yH - 6}`, 3.5);
    let behind = "", inside = "", over = "", lower = "";
    const tie = (to) => shape(`M-8,${yS - 2} L8,${yS - 2} L6,${yS + 12} L-6,${yS + 12}Z`, c.tie || "#e0262b", 4) + shape(`M-6,${yS + 12} L6,${yS + 12} L11,${yS + to - 14} L0,${yS + to} L-11,${yS + to - 14}Z`, c.tie || "#e0262b", 4) + line(`M-2,${yS + 24} L4,${yS + 40}`, 2.5, tint(c.tie || "#e0262b", 0.35));
    const lapels = (shirtV, tieTo) => {
      let s = `<path d="M${-nw - 2},${yS - 8} L0,${yS + 98} L${nw + 2},${yS - 8}Z" fill="${shirtV}" stroke="${INK}" stroke-width="3.5"/>`;
      if (tieTo) s += tie(tieTo);
      s += shape(mir([[-nw + 2, yS - 8], [-nw - 22, yS + 22], [-nw - 12, yS + 30], [-nw - 28, yS + 42], [-3, yS + 102], [0, yS + 98]]), lt, 4.5);
      s += shape(mir([[-nw + 1, yS - 12], [-5, yS + 8], [-nw - 8, yS + 14]]), shirt, 3.5);
      return s;
    };
    const buttonsAt = (x, ys, col) => ys.map((y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${col || INK}" stroke="${INK}" stroke-width="2"/>`).join("");
    const pocketLine = line(`M${-sh * 0.66},${yS + 62} L${-sh * 0.3},${yS + 59}`, 4) + (ex.includes("pocket_square") ? shape(`M${-sh * 0.6},${yS + 61} L${-sh * 0.52},${yS + 48} L${-sh * 0.44},${yS + 58} L${-sh * 0.38},${yS + 50} L${-sh * 0.34},${yS + 60}Z`, "#f6f1e4", 3) : "");
    const flaps = line(`M${-wa * 0.92},${yH - 30} L${-wa * 0.4},${yH - 31} M${wa * 0.4},${yH - 31} L${wa * 0.92},${yH - 30}`, 4);
    const split = shape(`M-2,${yS + 140} L${-24},${yH + 16} L24,${yH + 16}Z`, c.legs || INK, 4);
    switch (style) {
      case "hoodie":
        behind = shape(`M${-nw - 40},${yS - 2} Q${-nw - 36},${yS - 36} 0,${yS - 32} Q${nw + 36},${yS - 36} ${nw + 40},${yS - 2} Q0,${yS + 10} ${-nw - 40},${yS - 2}Z`, dk, 5.5);
        inside = shape(`M${-wa * 0.8},${yH - 88} L${wa * 0.8},${yH - 88} L${wa * 0.96},${yH - 8} L${-wa * 0.96},${yH - 8}Z`, shade(top, 0.08), 4) + line(`M${-wa * 0.8 + 6},${yH - 82} L${-wa * 0.94 + 8},${yH - 14} M${wa * 0.8 - 6},${yH - 82} L${wa * 0.94 - 8},${yH - 14}`, 2.5, dk) +
          hem(dk) + line(`M${nw + 8},${yS - 4} Q${sh - 30},${yS + 40} ${sh - 10},${yS + 86} M${-nw - 8},${yS - 4} Q${-sh + 30},${yS + 40} ${-sh + 10},${yS + 86}`, 3, dk);
        over = shape(`M${-nw - 4},${yS - 8} Q0,${yS + 16} ${nw + 4},${yS - 8}Z`, inner, 3.5) + line(`M${-nw - 10},${yS - 8} Q0,${yS + 24} ${nw + 10},${yS - 8}`, 6.5, dk) + line(`M${-nw - 10},${yS - 8} Q0,${yS + 24} ${nw + 10},${yS - 8}`, 2.5) +
          line(`M-13,${yS + 10} L-15,${yS + 76} M13,${yS + 10} L15,${yS + 76}`, 4) + `<circle cx="-15" cy="${yS + 80}" r="5" fill="${inner}" ${st4}/><circle cx="15" cy="${yS + 80}" r="5" fill="${inner}" ${st4}/>`; break;
      case "suit": case "suit3": case "opensuit": case "coat": {
        const open = style === "opensuit";
        if (style === "suit3") { over = `<path d="M${-nw - 2},${yS - 8} L0,${yS + 98} L${nw + 2},${yS - 8}Z" fill="${shade(top, 0.12)}" stroke="${INK}" stroke-width="3.5"/>` + shape(`M${-nw + 4},${yS - 8} L0,${yS + 50} L${nw - 4},${yS - 8}Z`, shirt, 3.5) + tie(58) +
            shape(`M${-nw + 4},${yS + 30} L0,${yS + 64} L${nw - 4},${yS + 30} L${nw + 2},${yS + 40} L0,${yS + 98} L${-nw - 2},${yS + 40}Z`, shade(top, 0.12), 3.5) + buttonsAt(0, [yS + 70, yS + 82, yS + 94], "#d4a72c") +
            shape(mir([[-nw + 2, yS - 8], [-nw - 22, yS + 22], [-nw - 12, yS + 30], [-nw - 28, yS + 42], [-3, yS + 102], [0, yS + 98]]), lt, 4.5) + shape(mir([[-nw + 3, yS - 12], [-6, yS + 6], [-nw - 6, yS + 12]]), shirt, 3.5); }
        else if (open) over = lapels(shirt, 0) + shape(`M-11,${yS - 8} L0,${yS + 20} L11,${yS - 8}Z`, sk, 3) + line(`M0,${yS + 28} L0,${yS + 96}`, 2.5, "#c9ced6");
        else over = lapels(shirt, 104);
        inside = flaps;
        over += buttonsAt(-4, [yS + 114, yS + 136]) + split + pocketLine;
        if (style === "coat") lower = toned(`M${-hp - 2},${yH + 4} L${hp + 2},${yH + 4} L${hp + 18},${yH + G.T1 + 30} L${-hp - 18},${yH + G.T1 + 30}Z`, top, { dx: 10, inside: line(`M0,${yH + 4} L0,${yH + G.T1 + 30}`, 4) });
        break; }
      case "cardigan":
        inside = `<path d="M${-nw - 12},${yS - 8} L${nw + 12},${yS - 8} L34,${yH + 20} L-34,${yH + 20}Z" fill="${inner}"/>` + shape(`M${-nw + 2},${yS - 8} L0,${yS + 36} L${nw - 2},${yS - 8}Z`, sk, 3.5) +
          line(`M${-nw - 12},${yS - 8} L-34,${yH + 20} M${nw + 12},${yS - 8} L34,${yH + 20}`, 5) + line(`M${-nw - 19},${yS - 6} L-41,${yH + 20} M${nw + 19},${yS - 6} L41,${yH + 20}`, 2.5, dk) +
          buttonsAt(-36, [yS + 60, yS + 96, yS + 132], tint(top, 0.5)) + shape(`M${-wa * 0.88},${yH - 70} L${-wa * 0.42},${yH - 70} L${-wa * 0.44},${yH - 36} Q${-wa * 0.66},${yH - 30} ${-wa * 0.86},${yH - 36}Z`, dk, 3.5) +
          shape(`M${wa * 0.88},${yH - 70} L${wa * 0.42},${yH - 70} L${wa * 0.44},${yH - 36} Q${wa * 0.66},${yH - 30} ${wa * 0.86},${yH - 36}Z`, dk, 3.5) + hem(dk); break;
      case "dress": {
        inside = `<rect x="${-wa - 20}" y="${yH - 58}" width="${wa * 2 + 40}" height="14" fill="${dk}"/>` + line(`M${-wa - 20},${yH - 58} L${wa + 20},${yH - 58} M${-wa - 20},${yH - 44} L${wa + 20},${yH - 44}`, 3);
        over = shape(`M${-nw - 12},${yS - 8} Q0,${yS + 42} ${nw + 12},${yS - 8}Z`, sk, 4);
        lower = toned(`M${-wa - 2},${yH - 46} L${wa + 2},${yH - 46} Q${hp + 30},${yH + G.T1 * 0.6} ${hp + 36},${yH + G.T1 + 14} Q0,${yH + G.T1 + 28} ${-hp - 36},${yH + G.T1 + 14} Q${-hp - 30},${yH + G.T1 * 0.6} ${-wa - 2},${yH - 46}Z`, top,
          { dx: 12, inside: line(`M-20,${yH - 30} L-30,${yH + G.T1 + 10} M18,${yH - 30} L28,${yH + G.T1 + 12}`, 3, dk) }); break; }
      case "checked": {
        let g = ""; for (let x = -sh; x <= sh; x += 26) g += `M${x},${yS - 20} L${x},${yH + 20} `; for (let y = yS + 6; y < yH + 20; y += 26) g += `M${-sh - 10},${y} L${sh + 10},${y} `;
        inside = line(g, 7, dk, 'opacity=".45"') + line(g.replace(/M(-?\d+)/g, (m, v) => "M" + (+v + 13)), 2, shade(top, 0.4), 'opacity=".5"') +
          shape(`M${-sh * 0.66},${yS + 50} L${-sh * 0.24},${yS + 50} L${-sh * 0.24},${yS + 84} Q${-sh * 0.45},${yS + 90} ${-sh * 0.66},${yS + 84}Z`, lt, 3.5);
        over = shape(`M-11,${yS - 8} L0,${yS + 14} L11,${yS - 8}Z`, sk, 3) + shape(mir([[-nw - 2, yS - 12], [-3, yS + 12], [-nw - 16, yS + 20]]), lt, 4) + line(`M0,${yS + 16} L0,${yH + 14}`, 3.5) + buttonsAt(-6, [yS + 40, yS + 76, yS + 112, yS + 148].filter((y) => y < yH), tint(top, 0.6)); break; }
      case "turtleneck":
        over = shape(`M${-nw - 6},${G.yC - 2} L${nw + 6},${G.yC - 2} L${nw + 10},${yS + 6} L${-nw - 10},${yS + 6}Z`, top, 5) + line(Array.from({ length: 5 }, (_, i) => `M${-nw + 2 + i * 11},${G.yC + 4} L${-nw + 2 + i * 11},${yS}`).join(" "), 2, dk);
        inside = line(`M${-sh + 18},${yS + 70} Q0,${yS + 84} ${sh - 18},${yS + 70}`, 2.5, dk, 'opacity=".6"'); break;
      case "jacket":
        inside = line(`M2,${yS - 6} L2,${yH + 16}`, 3.5, "#c9ced6") + shape(`M-4,${yS + 70} L8,${yS + 70} L8,${yS + 86} L-4,${yS + 86}Z`, "#c9ced6", 2.5) + line(`M${-wa * 0.86},${yH - 64} L${-wa * 0.5},${yH - 34} M${wa * 0.86},${yH - 64} L${wa * 0.5},${yH - 34}`, 4) + hem(dk);
        over = shape(mir([[-nw - 2, yS - 14], [-6, yS + 18], [-nw - 26, yS + 30], [-nw - 22, yS]]), lt, 4.5); break;
      case "polo":
        over = shape(mir([[-nw - 2, yS - 12], [-3, yS + 12], [-nw - 14, yS + 18]]), lt, 4) + shape(`M-7,${yS - 6} L7,${yS - 6} L7,${yS + 46} L-7,${yS + 46}Z`, lt, 3) + buttonsAt(0, [yS + 14, yS + 32], tint(top, 0.6)); break;
      case "scrubs":
        over = shape(`M${-nw - 2},${yS - 8} L0,${yS + 40} L${nw + 2},${yS - 8}Z`, sk, 4);
        inside = shape(`M${-sh * 0.66},${yS + 50} L${-sh * 0.26},${yS + 50} L${-sh * 0.26},${yS + 82} L${-sh * 0.66},${yS + 82}Z`, lt, 3.5) + line(`M${-sh * 0.36},${yS + 38} L${-sh * 0.36},${yS + 60}`, 4, "#3d6fb6"); break;
      case "apron":
        over = line(`M${-wa * 0.55},${yS + 34} L${-nw + 2},${yS - 6} M${wa * 0.55},${yS + 34} L${nw - 2},${yS - 6}`, 4) + line(Array.from({ length: 1 }, () => `M${-nw - 4},${yS - 8} Q0,${yS + 14} ${nw + 4},${yS - 8}`).join(""), 5);
        inside = toned(`M${-wa * 0.6},${yS + 34} L${wa * 0.6},${yS + 34} L${hp + 4},${yH + 20} L${-hp - 4},${yH + 20}Z`, c.apron || "#56606f", { dx: 8 }) + shape(`M${-wa * 0.4},${yH - 60} L${wa * 0.4},${yH - 60} L${wa * 0.4},${yH - 26} L${-wa * 0.4},${yH - 26}Z`, shade(c.apron || "#56606f", 0.12), 3.5);
        lower = toned(`M${-hp - 4},${yH + 4} L${hp + 4},${yH + 4} L${hp + 8},${yH + G.T1} L${-hp - 8},${yH + G.T1}Z`, c.apron || "#56606f", { dx: 8 }); break;
      case "blouse":
        over = shape(`M${-nw - 6},${yS - 8} Q0,${yS + 22} ${nw + 6},${yS - 8}Z`, sk, 3.5) + shape(`M${-nw - 8},${yS - 10} Q${-nw - 24},${yS + 14} -4,${yS + 18} Q${-nw},${yS + 4} ${-nw - 8},${yS - 10}Z`, lt, 4) +
          shape(`M${nw + 8},${yS - 10} Q${nw + 24},${yS + 14} 4,${yS + 18} Q${nw},${yS + 4} ${nw + 8},${yS - 10}Z`, lt, 4) + buttonsAt(0, [yS + 44, yS + 78, yS + 112].filter((y) => y < yH), tint(top, 0.6)); break;
      default: // tee
        over = line(`M${-nw - 6},${yS - 8} Q0,${yS + 18} ${nw + 6},${yS - 8}`, 6.5, dk) + line(`M${-nw - 6},${yS - 8} Q0,${yS + 18} ${nw + 6},${yS - 8}`, 2.5);
        inside = line(`M${-sh + 10},${yS + 20} Q${-sh + 26},${yS + 50} ${-sh + 20},${yS + 84} M${sh - 10},${yS + 20} Q${sh - 26},${yS + 50} ${sh - 20},${yS + 84}`, 2.5, dk, 'opacity=".5"');
    }
    if (ex.includes("loud_pattern")) inside += [[-52, 60, "#ffd23f"], [30, 84, "#1fb5b5"], [-18, 134, "#ffffff"], [52, 142, "#ffd23f"], [-56, 170, "#1fb5b5"], [8, 38, "#ffffff"], [40, 186, "#ffffff"]].map((p) => `<circle cx="${p[0]}" cy="${yS + p[1]}" r="10" fill="${p[2]}" stroke="${INK}" stroke-width="3"/>`).join("");
    if (ex.includes("bolt_pattern")) inside += [[-50, 70, "#ffd23f", 12], [36, 112, "#1fb5b5", -10], [-26, 150, "#ffffff", 8], [56, 40, "#ffd23f", -6]].map((p) => `<path d="M0,-18 L10,-2 L3,-2 L10,18 L-6,0 L1,0Z" transform="translate(${p[0]},${yS + p[1]}) rotate(${p[3]}) scale(1.3)" fill="${p[2]}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`).join("");
    if (ex.includes("pearls")) over += Array.from({ length: 9 }, (_, i) => { const t = i / 8, x = -nw - 6 + t * (2 * nw + 12), y = yS - 6 + Math.sin(t * Math.PI) * 22; return `<circle cx="${f1(x)}" cy="${f1(y)}" r="4.5" fill="#f6f1e4" stroke="${INK}" stroke-width="2"/>`; }).join("");
    if (ex.includes("chain")) over += line(`M${G.tq - 62},${G.yE - 4} Q${-72},${G.yC + 10} ${-12},${yS + 30} Q${0},${yS + 34} ${12},${yS + 30} Q${72},${G.yC + 10} ${G.tq + 62},${G.yE - 4}`, 3, "#c9a36b", 'stroke-dasharray="1 6"');
    if (ex.includes("lanyard")) over += line(`M${-nw + 4},${yS - 6} L-4,${yS + 84} M${nw - 4},${yS - 6} L4,${yS + 84}`, 5, "#e0262b") + shape(`M-17,${yS + 82} L17,${yS + 82} L17,${yS + 126} L-17,${yS + 126}Z`, "#f6f1e4", 4) + `<rect x="-11" y="${yS + 90}" width="12" height="14" fill="#9aa0b4"/>` + line(`M-10,${yS + 112} L11,${yS + 112} M-10,${yS + 119} L6,${yS + 119}`, 2.5, "#9aa0b4");
    if (o.pregnant) over += toned(`M${-wa - 6},${yH - 40} C${-wa - 10},${yH - 120} ${wa + 18},${yH - 128} ${wa + 18},${yH - 44} C${wa + 18},${yH + 4} ${-wa},${yH + 10} ${-wa - 6},${yH - 40}Z`, top, { dx: 14 }) + line(`M${-wa + 6},${yH - 76} Q${-wa + 20},${yH - 100} ${-wa + 40},${yH - 104}`, 4, tint(top, 0.45));
    if (o.badge != null) over += `<g transform="translate(${f1(sh * 0.46)},${yS + 70})"><circle r="30" fill="#f0b429" ${st}/>${txt(0, 12, o.badge, 34)}</g>`;
    return { behind: behind + neck, body: toned(d, top, { dx: 14, inside }), over, lower, sleeves: LONG_SLEEVE[style] ? "long" : "short" };
  }

  /* ---------------- arms and hands (drawn in the frame of the right arm: outward is +x, the arm hangs down +y) ---------------- */
  function hands2(sk, k, need) {
    const s = `fill="${sk}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"`, P = (pts) => `<path d="${smooth(pts, true)}" ${s}/>`, L = (d) => line(d, 2.5);
    const fin = (x, y, a, len) => `<rect x="-4.6" y="0" width="9.2" height="${len}" rx="4.6" transform="translate(${x},${y}) rotate(${a})" ${s}/>`;
    const H = {
      relax: P([[-13, -2], [-16, 14], [-15, 30], [-11, 44], [-2, 50], [9, 47], [15, 34], [16, 14], [13, -2]]) + L("M-5,34 L-4,47 M2,35 L3,49 M8,33 L9,45") + P([[-12, 6], [-19, 14], [-22, 28], [-17, 32], [-11, 22]]),
      open: fin(-9, 28, 16, 24) + fin(-3, 30, 6, 30) + fin(3, 30, -4, 29) + fin(9, 28, -14, 24) + fin(-12, 10, 52, 22) + P([[-14, -2], [-16, 14], [-13, 32], [0, 35], [13, 32], [16, 14], [14, -2]]),
      point: fin(5, 24, -2, 38) + P([[-14, -2], [-17, 14], [-14, 32], [0, 37], [12, 33], [16, 16], [14, -2]]) + L("M-10,30 Q-6,36 -1,33 M-4,24 Q-1,30 3,27") + P([[-14, 8], [-6, 20], [4, 22], [6, 16], [-6, 12]]),
      fist: P([[-15, -2], [-18, 14], [-15, 32], [0, 38], [15, 32], [18, 14], [15, -2]]) + L("M-9,34 L-9,28 M-1,37 L-1,30 M7,35 L7,29") + P([[-15, 8], [-6, 20], [4, 22], [6, 16], [-6, 12]]),
      flat: P([[-14, -2], [-16, 18], [-14, 46], [-5, 58], [6, 58], [14, 46], [16, 18], [14, -2]]) + L("M-6,44 L-5,57 M1,45 L1,58 M7,44 L7,56") + P([[-12, 6], [-26, 16], [-29, 24], [-22, 26], [-12, 20]]),
      grip: P([[-20, -16], [-23, 2], [-19, 18], [0, 23], [19, 18], [23, 2], [20, -16], [0, -21]]) + L("M-2,-8 L19,-8 M-2,2 L21,2 M-2,12 L18,12") + P([[-20, -10], [-8, -20], [8, -18], [6, -12], [-10, -6]]),
    };
    // only the hand shapes this figure's poses use (a whole episode is in the page at once, so every node counts)
    return Object.keys(H).filter((n) => !need || need.has(n)).map((n) => `<g class="hs hs-${n}" data-k="${n}"><g transform="scale(${k})">${H[n]}</g></g>`).join("");
  }
  function arm2(c, G, T, side, prop, need) {
    const B = G.B, aw = B.aw, L1 = f1(G.L1), L2 = f1(G.L2), top = c.top || "#56606f", sk = c.skin, long = T.sleeves === "long", dk = shade(top, 0.24), style = c.topStyle;
    const fw = aw * 0.86, bw = aw * 0.7;
    const upper = long ? toned(capsule(aw, 0, L1), top, { dx: 7, dy: 0, sw: 6 })
      : toned(capsule(aw * 0.76, 0, L1), sk, { dx: 6, dy: 0, sw: 6 }) + toned(`M${f1(-aw)},${f1(-aw * 0.2)} A${f1(aw)},${f1(aw)} 0 0 1 ${f1(aw)},${f1(-aw * 0.2)} L${f1(aw * 1.12)},${f1(L1 * 0.5)} L${f1(-aw * 1.12)},${f1(L1 * 0.5)}Z`, top, { dx: 7, dy: 0, sw: 6 });
    let fore = long ? toned(capsule(fw, 0, L2 - 4), top, { dx: 6, dy: 0, sw: 6 }) : toned(capsule(bw, 0, L2 - 2), sk, { dx: 5, dy: 0, sw: 6 });
    if (long) {
      if (/suit|coat/.test(style)) fore += shape(`M${f1(-bw)},${L2 - 10} L${f1(bw)},${L2 - 10} L${f1(bw)},${L2 + 2} L${f1(-bw)},${L2 + 2}Z`, "#f6f1e4", 3.5) + line(`M${f1(-fw)},${L2 - 12} L${f1(fw)},${L2 - 12}`, 4);
      else if (/hoodie|cardigan|jacket|turtleneck/.test(style)) fore += shape(`M${f1(-fw + 1)},${L2 - 24} L${f1(fw - 1)},${L2 - 24} L${f1(fw - 2)},${L2 - 4} L${f1(-fw + 2)},${L2 - 4}Z`, dk, 4) + line(`M-6,${L2 - 22} L-6,${L2 - 6} M2,${L2 - 22} L2,${L2 - 6} M10,${L2 - 22} L10,${L2 - 6}`, 2, shade(dk, 0.3));
      else fore += line(`M${f1(-fw)},${L2 - 16} L${f1(fw)},${L2 - 16}`, 3.5) + `<circle cx="${f1(fw * 0.4)}" cy="${L2 - 9}" r="3" fill="${tint(top, 0.6)}"/>`;
    } else fore += "";
    if (side === "l" && !long && (c.extras || []).includes("watch")) fore += shape(`M${f1(-bw - 2)},${L2 - 26} L${f1(bw + 2)},${L2 - 26} L${f1(bw + 2)},${L2 - 16} L${f1(-bw - 2)},${L2 - 16}Z`, "#d4a72c", 3);
    return `<g class="sw"><g class="ua">${upper}<g transform="translate(0,${L1})"><g class="fa"><g class="fg">${fore}<g transform="translate(0,${L2})"><g class="wr">${prop}${hands2(sk, B.hand, need)}</g></g></g></g></g></g></g>`;
  }

  /* ---------------- legs and shoes (frame of the right leg: the toe points outward, +x) ---------------- */
  const SHOE = {
    sneaker: [[-16, -24], [-19, -6], [-16, 4], [30, 4], [42, -2], [38, -14], [18, -22]],
    dress: [[-15, -20], [-18, -6], [-15, 4], [32, 4], [44, -1], [38, -12], [16, -18]],
    hightop: [[-16, -42], [-19, -6], [-16, 4], [30, 4], [42, -2], [38, -14], [14, -28], [12, -42]],
    flat: [[-14, -14], [-17, -4], [-14, 4], [30, 4], [38, -2], [32, -12], [10, -16]],
  };
  function leg2(c, G, side) {
    const B = G.B, lw = B.lw, T1 = f1(G.T1), T2 = f1(G.T2), legs = c.legs || "#2e3a59", sk = c.skin, style = c.legStyle || (c.topStyle === "dress" ? "bare" : "pants"), dk = shade(legs, 0.25);
    const part = (d, fill, inside, dx) => ({ u: under(d, 6), f: toned(d, fill, { dx: dx || 6, dy: 0, noline: true, inside }) });
    const add = (p, q) => ({ u: p.u + q.u, f: p.f + q.f });
    let th, sh;
    if (style === "bare") { th = part(capsule(lw * 0.72, -lw, T1), sk); sh = part(capsule(lw * 0.64, 0, T2 + 4), sk); }
    else if (style === "shorts") {
      th = add(part(capsule(lw * 0.7, 0, T1 + 4), sk), part(`M${f1(-lw - 3)},${-lw} L${f1(lw + 3)},${-lw} L${f1(lw + 5)},${f1(T1 + 12)} L${f1(-lw - 5)},${f1(T1 + 12)}Z`, legs,
        shape(`M${f1(lw * 0.2)},${f1(T1 * 0.35)} L${f1(lw + 6)},${f1(T1 * 0.35)} L${f1(lw + 6)},${f1(T1 * 0.8)} L${f1(lw * 0.2)},${f1(T1 * 0.8)}Z`, shade(legs, 0.1), 3.5)));
      sh = part(capsule(lw * 0.64, 0, T2 + 4), sk, shape(`M${f1(-lw)},${f1(T2 - 14)} L${f1(lw)},${f1(T2 - 14)} L${f1(lw)},${f1(T2 + 8)} L${f1(-lw)},${f1(T2 + 8)}Z`, "#f6f1e4", 3.5));
    } else {
      const jeans = style === "jeans", seam = (y0, y1, x0, x1) => jeans ? line(`M${f1(x0)},${y0} L${f1(x1)},${y1}`, 2, "#c9a36b", 'stroke-dasharray="5 5"') : line(`M2,${y0} L2,${y1}`, 2.5, dk);
      th = part(capsule(lw, -lw, T1 + 4), legs, seam(4, T1 + 6, lw * 0.55, lw * 0.5), 7);
      sh = part(`M${f1(-lw * 0.94)},${-lw} L${f1(-lw * 0.98)},${f1(T2 + 8)} L${f1(lw * 0.98)},${f1(T2 + 8)} L${f1(lw * 0.94)},${-lw}Z`, legs, seam(-4, T2, lw * 0.5, lw * 0.55));
    }
    const ss = c.shoeStyle || (/^#(2|1|3|5|6)/.test(c.shoes || "#2") ? "dress" : "sneaker"), sp = SHOE[ss] || SHOE.sneaker, shoes = c.shoes || "#2b2b2b";
    let shoe = `<path d="${smooth(sp, true)}" fill="${shoes}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    if (ss === "sneaker" || ss === "hightop") shoe += shape(`M-17,-3 L42,-3 Q42,4 34,5 L-15,5 Q-18,2 -17,-3Z`, "#f6f1e4", 3.5) + line(`M2,-18 L8,-10 M10,-19 L15,-11`, 2.5, ss === "hightop" ? "#f6f1e4" : INK);
    else if (ss === "dress") shoe += line(`M18,-12 Q28,-12 34,-6`, 3, "#ffffff", 'opacity=".45"') + line(`M-15,2 L40,2`, 2.5);
    else shoe += line(`M8,-14 Q16,-8 26,-10`, 2.5, shade(shoes, 0.3));
    const hem = style === "pants" || style === "jeans"; // trousers fall over the shoe; a bare leg or a sock goes into it
    // ink first, then the shin, then the thigh over the knee: a straight leg shows no seam, a bent one still has its outline
    return `<g class="th">${th.u}<g transform="translate(0,${T1})"><g class="sh">${sh.u}<g transform="translate(0,${T2})"><g class="ft"><g transform="translate(0,18)">${hem ? shoe : ""}</g></g></g>${sh.f}${hem ? "" : `<g transform="translate(0,${T2})"><g class="ft2"><g transform="translate(0,18)">${shoe}</g></g></g>`}</g></g>${th.f}</g>`;
  }


  const eye = (x, hy, heavy) => {
    const cy = -440 + hy;
    return `<g class="eye" transform="translate(${x},${cy})">
      <g class="e-open"><ellipse rx="30" ry="36" fill="#fff" ${st}/><g class="pupil"><circle r="14" fill="${INK}"/><circle cx="-5" cy="-6" r="5" fill="#fff"/></g></g>
      <g class="e-wide"><ellipse rx="35" ry="45" fill="#fff" ${st}/><g class="pupil"><circle r="9" fill="${INK}"/></g></g>
      <g class="e-half"><ellipse rx="30" ry="36" fill="#fff" ${st}/><g class="pupil"><circle cy="8" r="13" fill="${INK}"/></g><path d="M-34,-40 L34,-40 L34,-4 L-34,-4Z" fill="SKIN"/><path d="M-31,-4 L31,-4" ${st}/></g>
      <g class="e-happy"><path d="M-30,10 Q0,-34 30,10" fill="none" ${st} stroke-width="9"/></g>
      <g class="e-blink"><ellipse rx="33" ry="39" fill="SKIN"/><path d="M-30,4 Q0,16 30,4" fill="none" ${st}/></g>
      <path class="brow" d="M-34,-58 L34,-58" fill="none" stroke="${INK}" stroke-width="${heavy ? 17 : 11}" stroke-linecap="round"/>
    </g>`;
  };

  const MOUTHS = {
    smile: `<path d="M-34,-6 Q0,24 34,-6" fill="none" ${st}/>`,
    smirk: `<path d="M-28,6 Q8,18 38,-12" fill="none" ${st}/>`,
    flat: `<path d="M-28,2 L28,2" fill="none" ${st}/>`,
    frown: `<path d="M-32,14 Q0,-16 32,14" fill="none" ${st}/>`,
    wavy: `<path d="M-38,4 Q-19,-14 0,4 Q19,22 38,4" fill="none" ${st}/>`,
    grin: `<path d="M-48,-12 L48,-12 Q42,42 0,42 Q-42,42 -48,-12Z" fill="#5a1f2b" ${st}/><path d="M-41,-8 L41,-8 L38,8 L-38,8Z" fill="#fff"/><path d="M-22,36 Q0,16 22,36" fill="#e8707c"/>`,
    o: `<ellipse rx="20" ry="27" fill="#5a1f2b" ${st}/>`,
    tA: `<path d="M-32,-14 Q0,-26 32,-14 Q36,34 0,36 Q-36,34 -32,-14Z" fill="#5a1f2b" ${st}/><path d="M-18,30 Q0,10 18,30" fill="#e8707c"/>`,
    tE: `<path d="M-38,-8 L38,-8 Q34,22 0,22 Q-34,22 -38,-8Z" fill="#5a1f2b" ${st}/><path d="M-32,-5 L32,-5 L30,6 L-30,6Z" fill="#fff"/>`,
    tO: `<ellipse rx="15" ry="20" fill="#5a1f2b" ${st}/>`,
    tM: `<path d="M-24,2 Q0,8 24,2" fill="none" ${st}/>`,
    scream: `<path d="M-46,-26 Q0,-44 46,-26 Q56,58 0,62 Q-56,58 -46,-26Z" fill="#5a1f2b" ${st}/><path d="M-36,-22 Q0,-34 36,-22 L33,-8 L-33,-8Z" fill="#fff"/><path d="M-28,54 Q0,22 28,54" fill="#e8707c"/>`,
    teeth: `<path d="M-48,-16 L48,-16 Q52,30 0,30 Q-52,30 -48,-16Z" fill="#fff" ${st}/><path d="M-44,7 L44,7 M-24,-14 L-24,28 M0,-14 L0,30 M24,-14 L24,28" stroke="${INK}" stroke-width="5"/>`,
  };

  // brows: [rotL, rotR, dyL, dyR]; sweat / tear are optional marks.
  const FACES = {
    neutral: { eyes: "open", brows: [0, 0, 0, 0], mouth: "smile" },
    plain: { eyes: "open", brows: [0, 0, 0, 0], mouth: "flat" }, // no smile: for a real person saying something serious
    happy: { eyes: "happy", brows: [-6, 6, -6, -6], mouth: "grin" },
    shocked: { eyes: "wide", brows: [-8, 8, -20, -20], mouth: "o" },
    scared: { eyes: "wide", brows: [18, -18, -12, -12], mouth: "wavy", sweat: 1 },
    angry: { eyes: "open", brows: [22, -22, 12, 12], mouth: "frown" },
    smug: { eyes: "half", brows: [-4, 14, 0, -10], mouth: "smirk" },
    sad: { eyes: "open", brows: [16, -16, -4, -4], mouth: "frown", tear: 1 },
    confused: { eyes: "open", brows: [10, 12, 4, -20], mouth: "flat" },
    relieved: { eyes: "happy", brows: [12, -12, -6, -6], mouth: "smile", sweat: 1 },
    deadpan: { eyes: "half", brows: [0, 0, 4, 4], mouth: "flat" },
    // the loud ones, for hooks and thumbnails
    panic: { eyes: "wide", brows: [22, -22, -26, -26], mouth: "scream", sweat: 1 },
    furious: { eyes: "open", brows: [30, -30, 18, 18], mouth: "teeth" },
    crying: { eyes: "happy", brows: [22, -22, -10, -10], mouth: "scream", tear: 1 },
    greedy: { eyes: "half", brows: [-10, 20, 0, -14], mouth: "grin" },
  };

  /* Arm poses of a person: for each arm [reach out, reach down, hand, hand angle], "l" first, "r" (the side the figure faces) second.
     Reach is in arm lengths from the shoulder, outward positive; the elbow bends out and down by itself.
     Hands: relax, open, point, fist, flat (grip is used by itself when the hand holds a prop). The hand angle is where the fingers point:
     0 down, -90 outward, 180 up, 90 across the body; left out, the hand follows the forearm. */
  const POSES = {
    rest: [[0.16, 0.97, "relax"], [0.16, 0.97, "relax"]], hips: [[-0.02, 0.62, "fist", 40], [-0.02, 0.62, "fist", 40]],
    shrug: [[0.74, 0.28, "flat", -120], [0.74, 0.28, "flat", -120]], cheer: [[0.48, -0.86, "open", 175], [0.48, -0.86, "open", 175]],
    point: [[0.16, 0.97, "relax"], [0.97, -0.22, "point"]], think: [[-0.32, 0.6, "fist", 60], [-0.3, -0.24, "fist", 175]],
    facepalm: [[0.16, 0.97, "relax"], [-0.3, -0.74, "flat", 170]], hold: [[-0.32, 0.56, "fist", 10], [-0.32, 0.56, "fist", 10]],
    phone: [[0.16, 0.97, "relax"], [-0.1, 0.44, "fist", 170]], wave: [[0.16, 0.97, "relax"], [0.6, -0.66, "open", 168]],
    present: [[0.16, 0.97, "relax"], [0.9, 0.24, "flat", -105]], raise: [[0.16, 0.97, "relax"], [0.32, -0.92, "fist", 180]],
    fold: [[-0.56, 0.5, "fist", 90], [-0.56, 0.5, "fist", 90]], carry: [[0.16, 0.97, "relax"], [0.2, 0.96, "fist", 0]],
    panic: [[0.44, -0.72, "open", 165], [0.44, -0.72, "open", 165]], grab: [[0.16, 0.97, "relax"], [0.96, 0.12, "open", -95]],
    offer: [[0.16, 0.97, "relax"], [0.86, 0.4, "flat", -110]],
    // for the acts: reaching for something, giving it, both hands down on a table, hands in the lap when seated
    reach: [[0.16, 0.97, "relax"], [0.98, 0.3, "open", -80]], give: [[0.16, 0.97, "relax"], [0.95, 0.22, "flat", -100]],
    slam: [[-0.2, 0.7, "flat", 20], [-0.2, 0.7, "flat", 20]], lap: [[-0.26, 0.58, "relax", 40], [-0.26, 0.58, "relax", 40]],
  };
  // Two-bone inverse kinematics: the shoulder, elbow and wrist angles that put the wrist on the target. Pure numbers, done at build time.
  const DEG = 180 / Math.PI, nrm = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
  function solve(G, spec, grip) {
    const L1 = G.L1, L2 = G.L2, tx = spec[0] * G.R, ty = spec[1] * G.R, dist = Math.max(0.001, Math.hypot(tx, ty));
    const d = Math.max(Math.abs(L1 - L2) + 2, Math.min(L1 + L2 - 0.5, dist)), Tx = (tx * d) / dist, Ty = (ty * d) / dist;
    const p0 = Math.atan2(-Tx, Ty) * DEG, al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)))) * DEG;
    let best = null;
    for (const sg of [1, -1]) { const u = p0 + sg * al, ex = -Math.sin(u / DEG) * L1, ey = Math.cos(u / DEG) * L1; if (!best || ex + ey > best.s) best = { u, ex, ey, s: ex + ey }; }
    const pf = Math.atan2(-(Tx - best.ex), Ty - best.ey) * DEG; let u = nrm(best.u); if (u > 110) u -= 360;
    const f = nrm(pf - u), abs = spec[3];
    return { u: f1(u), f: f1(f), w: f1(grip ? -(u + f) : abs == null ? 0 : nrm(abs - (u + f))), hand: grip ? "grip" : spec[2] || "relax" };
  }
  // Hand targets of a living thing's gloves [lx, ly, rx, ry]; "r" is the hand on the side it faces.
  const GLOVE = {
    rest: [-160, -165, 160, -165], hips: [-134, -150, 134, -150], shrug: [-206, -304, 206, -304], cheer: [-196, -530, 196, -530],
    point: [-160, -165, 256, -330], think: [-160, -165, 78, -322], facepalm: [-160, -165, 36, -452], hold: [-66, -206, 66, -206],
    phone: [-160, -165, 132, -286], wave: [-160, -165, 214, -436], present: [-160, -165, 232, -250],
    raise: [-160, -165, 300, -236], fold: [62, -214, -62, -196], carry: [-160, -165, 176, -120], panic: [-150, -520, 150, -520], grab: [-160, -165, 250, -190], offer: [-160, -165, 250, -150],
  };
  // The pose a figure takes when it holds this prop and the shot does not name one.
  const PROP_POSE = { placard: "raise", briefcase: "carry", tag: "present", pen: "present", wallet: "offer", cash: "offer", magnifier: "phone", popcorn: "carry", calculator: "phone", espresso: "offer", mop: "rest", tape: "present", clipboard: "phone" };

  const PROPS = {
    phone: (o) => `<g transform="translate(0,-18) rotate(8)"><rect x="-34" y="-112" width="68" height="118" rx="12" fill="${INK}" ${st}/><rect x="-25" y="-100" width="50" height="86" rx="4" fill="${o.screen === "green" ? "#0f3b24" : "#3b0f14"}"/>
      <path d="${o.screen === "green" ? "M-20,-36 L-8,-52 L2,-44 L20,-82" : "M-20,-84 L-8,-66 L2,-74 L20,-32"}" fill="none" stroke="${o.screen === "green" ? "#46e08a" : "#ff5a4f"}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    bill: () => `<g transform="translate(6,-20) rotate(-6)"><rect x="-52" y="-136" width="104" height="140" fill="#fff" ${st}/><path d="M-36,-110 L36,-110 M-36,-90 L20,-90 M-36,-70 L28,-70" stroke="#9aa0b4" stroke-width="6" stroke-linecap="round"/><rect x="-36" y="-50" width="72" height="30" fill="#e0262b"/></g>`,
    tablet: () => `<g transform="translate(0,-26) rotate(-4)"><rect x="-86" y="-112" width="172" height="118" rx="12" fill="${INK}" ${st}/><rect x="-74" y="-100" width="148" height="94" rx="4" fill="#0f3b24"/><path d="M-62,-26 L-30,-52 L-6,-40 L26,-74 L60,-88" fill="none" stroke="#46e08a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    mug: (o) => `<g transform="translate(0,-14)"><rect x="-26" y="-62" width="52" height="60" rx="8" fill="${o.color || "#f6f1e4"}" ${st}/><path d="M26,-48 Q52,-46 50,-28 Q48,-12 26,-14" fill="none" ${st}/></g>`,
    stamp: () => `<g transform="translate(0,-8)"><rect x="-22" y="-150" width="44" height="74" rx="20" fill="#8a5a3c" ${st}/><rect x="-62" y="-80" width="124" height="46" rx="8" fill="#e0262b" ${st}/><rect x="-70" y="-38" width="140" height="22" rx="6" fill="${INK}"/></g>`,
    cash: () => `<g transform="translate(0,-16)"><rect x="-58" y="-70" width="116" height="62" rx="6" fill="#1fa85b" ${st}/><circle cx="0" cy="-39" r="17" fill="#bfe8cf" ${st}/></g>`,
    // { prop:"wallet", open:true }: the wallet hangs open and empty (a lint-free way to say "there is nothing in it")
    wallet: (o) => o && o.open ? `<g transform="translate(0,-14) rotate(-8)"><rect x="-66" y="-96" width="132" height="92" rx="12" fill="#8a5a3c" ${st}/><rect x="-52" y="-82" width="104" height="64" rx="6" fill="#3b2a1e"/><path d="M-52,-50 L52,-50" stroke="#5b4636" stroke-width="5"/><path d="M-66,-96 L-100,-60 L-66,-4" fill="#a5714d" ${st}/></g>` : `<g transform="translate(0,-14) rotate(-8)"><rect x="-40" y="-104" width="84" height="50" rx="4" fill="#1fa85b" ${st}/><rect x="-62" y="-78" width="124" height="80" rx="12" fill="#8a5a3c" ${st}/><path d="M-62,-44 L62,-44" ${st}/><circle cx="40" cy="-30" r="8" fill="#f0b429" ${st}/></g>`,
    // { prop:"tag", tag:"$52" }: a price tag on a string
    tag: (o) => `<g transform="translate(18,-30) rotate(10)"><path d="M-70,-110 L60,-110 L96,-66 L60,-22 L-70,-22Z" fill="#f6f1e4" ${st}/><circle cx="62" cy="-66" r="9" fill="${INK}"/>${txt(-14, -46, o.tag || "$", 54, "#e0262b")}</g>`,
    // popcorn: a striped bucket with kernels (Benny watching)
    popcorn: () => `<g transform="translate(0,-10)">${[-34, -10, 16, 36].map((x, i) => `<circle cx="${x}" cy="${-100 - (i % 2) * 14}" r="${20 - (i % 2) * 2}" fill="#fff4cf" ${st}/>`).join("")}<path d="M-52,-92 L52,-92 L40,0 L-40,0Z" fill="#f6f1e4" ${st}/><path d="M-26,-92 L-20,0 M2,-92 L2,0 M30,-92 L24,0" stroke="#e0262b" stroke-width="12"/></g>`,
    // calculator (Martha): a slab with a screen and a grid of keys
    calculator: () => `<g transform="translate(0,-18) rotate(6)"><rect x="-42" y="-128" width="84" height="118" rx="10" fill="#56606f" ${st}/><rect x="-32" y="-118" width="64" height="26" rx="3" fill="#bfe8cf"/>${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${-30 + c * 22}" y="${-80 + r * 22}" width="16" height="14" rx="3" fill="#f6f1e4"/>`).join("")).join("")}</g>`,
    // espresso (Hal): a tiny cup on a saucer
    espresso: () => `<g transform="translate(0,-12)"><ellipse cx="0" cy="-4" rx="40" ry="10" fill="#f6f1e4" ${st}/><path d="M-22,-8 L-18,-44 L18,-44 L22,-8Z" fill="#f6f1e4" ${st}/><path d="M18,-38 Q36,-38 34,-24 Q32,-14 20,-16" fill="none" ${st}/><path d="M-14,-44 L14,-44" stroke="#5b3a22" stroke-width="8"/></g>`,
    // mop (Benny): a pole to the floor and a grey head
    mop: () => `<g transform="translate(0,0)"><rect x="-6" y="-120" width="12" height="280" fill="#8a5a3c" ${st}/><path d="M-44,150 L44,150 L58,196 L-58,196Z" fill="#d9d3c0" ${st}/><path d="M-30,160 L-34,196 M-10,160 L-12,196 M10,160 L12,196 M30,160 L34,196" stroke="${INK}" stroke-width="4"/></g>`,
    // tape (a tailor's measuring tape): a yellow roll with the tape hanging
    tape: () => `<g transform="translate(0,-14)"><circle cx="0" cy="-40" r="34" fill="#f0b429" ${st}/><circle cx="0" cy="-40" r="12" fill="#f6f1e4" ${st}/><path d="M26,-14 Q60,10 40,56 L62,60" fill="none" stroke="#f0b429" stroke-width="16" stroke-linecap="round"/><path d="M26,-14 Q60,10 40,56 L62,60" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="4 8"/></g>`,
    // clipboard (Reggie): a board, a clip and ruled lines
    clipboard: () => `<g transform="translate(0,-14) rotate(-6)"><rect x="-54" y="-142" width="108" height="140" rx="8" fill="#a5714d" ${st}/><rect x="-42" y="-128" width="84" height="112" fill="#f6f1e4"/><path d="M-30,-100 L30,-100 M-30,-78 L30,-78 M-30,-56 L18,-56 M-30,-34 L26,-34" stroke="#9aa0b4" stroke-width="5" stroke-linecap="round"/><rect x="-22" y="-152" width="44" height="22" rx="6" fill="#c9ced6" ${st}/></g>`,
    pen: () => `<g transform="translate(0,-10) rotate(34)"><rect x="-17" y="-250" width="34" height="230" rx="8" fill="#e0262b" ${st}/><path d="M-17,-20 L17,-20 L0,22Z" fill="#f6f1e4" ${st}/><rect x="-17" y="-250" width="34" height="42" rx="8" fill="${INK}"/></g>`,
    // { prop:"placard", sign:"SELL" }: a board on a stick
    placard: (o) => `<g transform="translate(0,-10)"><rect x="-9" y="-150" width="18" height="150" fill="#8a5a3c" ${st}/><g transform="rotate(-4 0 -230)"><rect x="-130" y="-310" width="260" height="170" rx="6" fill="${o.signColor || "#f6f1e4"}" ${st}/>${txt(0, -198, o.sign || "", Math.min(84, 420 / Math.max(3, String(o.sign || "").length)))}</g></g>`,
    briefcase: () => `<g transform="translate(0,118)"><path d="M-30,-96 L-30,-118 L30,-118 L30,-96" fill="none" ${st}/><rect x="-78" y="-98" width="156" height="104" rx="12" fill="#8a5a3c" ${st}/><path d="M-78,-52 L78,-52" ${st}/><rect x="-14" y="-64" width="28" height="24" rx="5" fill="#f0b429" ${st}/></g>`,
    magnifier: () => `<g transform="translate(0,-20) rotate(-24)"><rect x="-10" y="-70" width="20" height="96" rx="8" fill="#8a5a3c" ${st}/><circle cx="0" cy="-120" r="58" fill="rgba(191,224,234,.75)" ${st}/><path d="M-26,-146 Q-6,-166 20,-158" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g>`,
  };

  /* ---- living things: a company, a market, a building or a banknote with a face and gloves ----
     No logos: a generic shape plus a written label. Each entry returns the body (origin = the middle of its base on the floor),
     where the face goes [x, y, scale], its half-width and height (for the hands), the colour behind the face,
     and whether it stands on shoes ("feet") or sits on the ground or hovers. */
  const rc = (x, y, w, h, fill, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill}" ${st}/>`;
  const lab = (o, y, w, max, fill) => (o.label ? txt(0, y, o.label, Math.min(max || 44, (w * 3.6) / Math.max(4, String(o.label).length)), fill) : "");
  // The soda family (soda, giant). Origin = the middle of the base. Everything is plain shapes with the house face and white gloves.
  const COLA = { navy: ["#243a6b", "#c9ced6"], red: ["#c8332f", "#f6f1e4"], teal: ["#2a8f8a", "#f6f1e4"] };
  function sodaBody(o, giant) {
    const shape = giant ? "can" : o.shape || "can", cola = giant ? COLA[o.color] || COLA.navy : null;
    const main = giant ? (COLA[o.color] ? cola[0] : o.color || cola[0]) : o.color || (shape === "bottle" ? "#f0c470" : shape === "plain" ? "#d7dbe3" : "#f08a7a");
    const band = giant ? cola[1] : "#f3e6c8", hw = giant ? 118 : 82, w = giant ? 150 : shape === "bottle" ? 122 : 98;
    let body = "", face, tx = hw + 56, ty = -262;
    if (shape === "bottle") {
      body = `<path d="M-96,-6 Q-110,-6 -110,-40 L-110,-226 Q-110,-300 -52,-318 L-42,-384 L42,-384 L52,-318 Q110,-300 110,-226 L110,-40 Q110,-6 96,-6Z" fill="${main}" ${st}/>` +
        `<path d="M-42,-384 L42,-384 L42,-340 L-42,-340Z" fill="rgba(255,255,255,.4)"/><path d="M-78,-290 Q-96,-262 -92,-220" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="10" stroke-linecap="round"/>` +
        rc(-110, -252, 220, 196, "#f6f1e4", 4) + `<ellipse cx="0" cy="-394" rx="38" ry="22" fill="#f6f1e4" ${st}/><path d="M-38,-394 L-70,-420 M38,-394 L70,-420" stroke="#8d8a7e" stroke-width="7" stroke-linecap="round"/>` + lab(o, -72, 96, 44);
      face = [0, -166, 0.64]; tx = 170; ty = -300;
    } else if (shape === "plain") {
      body = `<path d="M-82,-382 Q-82,-404 -58,-404 L58,-404 Q82,-404 82,-382 L82,-14 Q82,0 66,0 L-66,0 Q-82,0 -82,-14Z" fill="${main}" ${st}/><path d="M-60,-420 L60,-420 L60,-402 L-60,-402Z" fill="#c9ced6" ${st}/><path d="M-56,-340 L-56,-60" stroke="rgba(255,255,255,.7)" stroke-width="12" stroke-linecap="round"/>`;
      face = [0, -222, 0.62];
    } else {
      body = `<path d="M${-hw},-382 Q${-hw},-404 ${-hw + 24},-404 L${hw - 24},-404 Q${hw},-404 ${hw},-382 L${hw},-14 Q${hw},0 ${hw - 16},0 L${-hw + 16},0 Q${-hw},0 ${-hw},-14Z" fill="${main}" ${st}/>` +
        rc(-hw, giant ? -300 : -282, hw * 2, giant ? 56 : 122, band, 0) + `<path d="M${-hw + 22},-340 L${-hw + 22},-70" stroke="rgba(255,255,255,.35)" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M${-hw + 22},-420 L${hw - 22},-420 L${hw - 22},-402 L${-hw + 22},-402Z" fill="#c9ced6" ${st}/><ellipse cx="22" cy="-408" rx="22" ry="7" fill="#8d8a7e" ${st} stroke-width="4"/>` +
        (o.label ? txt(0, giant ? -50 : -52, o.label, Math.min(giant ? 54 : 44, (hw * 2 * 0.86) / (Math.max(3, String(o.label).length) * 0.55)), giant ? "#f6f1e4" : INK) : "");
      face = giant ? [0, -190, 0.8] : [0, -208, 0.62];
    }
    if (giant && o.coat === "lab") body += `<path d="M${-hw},-196 L${hw},-196 L${hw},-14 Q${hw},0 ${hw - 16},0 L${-hw + 16},0 Q${-hw},0 ${-hw},-14Z" fill="#f6f1e4" ${st}/><path d="M-40,-196 L0,-120 L40,-196 M0,-120 L0,-4" fill="none" ${st}/>` + rc(46, -110, 50, 44, "#e8e2cf", 4) + `<circle cx="-14" cy="-84" r="5" fill="${INK}"/><circle cx="-14" cy="-44" r="5" fill="${INK}"/>`;
    if (o.sweat) body += [[-hw - 4, -300], [hw + 6, -250], [-hw - 6, -150], [hw + 4, -120]].map((p) => `<path class="tick" d="M${p[0]},${p[1] - 28} Q${p[0] - 16},${p[1]} ${p[0]},${p[1] + 8} Q${p[0] + 16},${p[1]} ${p[0]},${p[1] - 28}Z" fill="#bfe8ff" ${st} stroke-width="4"/>`).join("");
    // a price tag on a string from the neck: face-down and blank, flipping over, or tearing a strip off
    if (o.tag != null || o.tagDown || o.tagFlip != null || o.tagTear != null) {
      const text = o.tag != null ? String(o.tag) : "", tw = Math.max(150, text.length * 40 + 80), fit = Math.min(54, (tw - 60) / Math.max(2, text.length * 0.55)), flip = o.tagFlip != null, tear = o.tagTear != null, down = !!o.tagDown || flip;
      const tagPath = `M${-tw / 2},-44 L${tw / 2 - 30},-44 L${tw / 2},0 L${tw / 2 - 30},44 L${-tw / 2},44Z`, nx = shape === "bottle" ? 30 : 40, ny = shape === "bottle" ? -384 : -404;
      const front = `<g class="tfront"${down ? ' style="opacity:0"' : ""}><path d="${tagPath}" fill="${text || !flip ? "#f6f1e4" : "#f0b429"}" ${st}/><circle cx="${tw / 2 - 28}" cy="0" r="7" fill="${INK}"/>` +
        (tear ? `<g class="tt1">${txt(-14, 16, text, fit, "#e0262b")}</g><g class="tt2" style="opacity:0">${txt(-14, 16, o.tagAfter || "", fit, "#e0262b")}</g><path class="tstrip" d="M${tw / 2 - 74},-44 L${tw / 2 - 30},-44 L${tw / 2},0 L${tw / 2 - 30},44 L${tw / 2 - 74},44Z" fill="#e8e2cf" ${st}/>` : txt(-14, 16, text, fit, "#e0262b")) + `</g>`;
      const back = down ? `<g class="tback"><path d="${tagPath}" fill="#c9a36b" ${st}/><circle cx="${tw / 2 - 28}" cy="0" r="7" fill="${INK}"/></g>` : "";
      body += `<path d="M${nx},${ny} Q${(nx + tx) / 2},${ny - 30} ${tx + 10},${ty - 40}" fill="none" stroke="${INK}" stroke-width="5"/><g class="tagg" transform="translate(${tx + tw / 2 - 20},${ty}) rotate(8)">${back}${front}</g>`;
    }
    return { w, h: 400, feet: 1, face, skin: main, body,
      play(tl, a, t0) { const q = (s) => a.el.querySelector(s), fr = q(".tfront"), bk = q(".tback");
        if (o.tagFlip != null && fr && bk) { const t = t0 + o.tagFlip; gsap.set([fr, bk], { transformOrigin: "50% 50%", smoothOrigin: false });
          tl.fromTo(bk, { scaleX: 1 }, { scaleX: 0, duration: 0.12, ease: "none", immediateRender: false }, t); tl.set(bk, { opacity: 0 }, t + 0.12); tl.set(fr, { opacity: 1 }, t + 0.12);
          tl.fromTo(fr, { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: "power1.out", immediateRender: false }, t + 0.12); }
        if (o.tagTear != null && fr) { const t = t0 + o.tagTear, s = q(".tstrip"); gsap.set(s, { transformOrigin: "50% 50%", smoothOrigin: false });
          tl.to(s, { x: 120, y: -150, rotation: 55, opacity: 0, duration: 0.9, ease: "power1.in" }, t); tl.set(q(".tt1"), { opacity: 0 }, t + 0.1); tl.set(q(".tt2"), { opacity: 1 }, t + 0.1); } } };
  }

  const THINGS = {
    // a parcel: a marketplace, a retailer, a delivery
    box(o) { const c = o.color || "#d2a56d"; return { w: 170, h: 344, feet: 1, face: [0, -212, 0.72], skin: c,
      body: rc(-170, -344, 340, 320, c, 10) + rc(-36, -344, 72, 64, shade(c, 0.2)) + rc(-140, -116, 280, 72, "#f6f1e4", 6) + lab(o, -64, 130, 46) }; },
    // a chip: a chipmaker, computing power, "AI"
    chip(o) { const c = o.color || "#2f9e6a"; let pins = ""; for (let i = 0; i < 5; i++) pins += rc(-196, -306 + i * 56, 40, 22, "#c9ced6", 4) + rc(156, -306 + i * 56, 40, 22, "#c9ced6", 4);
      return { w: 180, h: 344, feet: 1, face: [0, -214, 0.72], skin: c, body: pins + rc(-160, -344, 320, 320, shade(c, 0.28), 18) + rc(-126, -310, 252, 252, c, 10) + lab(o, -78, 110, 44, "#f6f1e4") }; },
    // an office tower: a corporation, a headquarters
    tower(o) { const c = o.color || "#9db7d1"; let w = ""; for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) w += rc(-112 + i * 84, -228 + r * 74, 56, 46, "#dff0f4", 4);
      return { w: 150, h: 540, face: [0, -410, 0.72], skin: c, body: rc(-150, -540, 300, 540, c, 8) + rc(-150, -306, 300, 58, "#f6f1e4") + lab(o, -264, 130, 42) + w }; },
    // a domed government building: a parliament, a capital, "the regulators"
    dome(o) { const c = o.color || "#f1ede2"; let col = ""; for (let i = 0; i < 6; i++) col += rc(-206 + i * 76, -250, 32, 160, "#fff", 4);
      return { w: 270, h: 580, face: [0, -424, 0.6], skin: c, body: `<path d="M-150,-330 Q-150,-530 0,-530 Q150,-530 150,-330Z" fill="${c}" ${st}/>` + rc(-14, -580, 28, 54, c, 4) + rc(-130, -344, 260, 50, c, 4) +
        rc(-240, -294, 480, 50, c, 4) + lab(o, -258, 220, 36) + rc(-220, -250, 440, 160, shade(c, 0.12)) + col + rc(-250, -92, 500, 40, c, 4) + rc(-280, -54, 560, 54, c, 4) }; },
    // a bank front
    bank(o) { const c = o.color || "#e9dfc8"; return { w: 230, h: 450, face: [0, -176, 0.74], skin: c,
      body: `<path d="M-250,-340 L0,-450 L250,-340Z" fill="${c}" ${st}/>` + rc(-240, -344, 480, 50, "#f6f1e4", 4) + txt(0, -306, o.label || "BANK", Math.min(40, 790 / Math.max(4, String(o.label || "BANK").length))) +
        rc(-200, -294, 400, 254, c) + rc(-200, -294, 54, 254, "#fff", 4) + rc(146, -294, 54, 254, "#fff", 4) + rc(-250, -42, 500, 42, c, 4) }; },
    // a factory: a manufacturer, "the supply chain"
    factory(o) { const c = o.color || "#c9705a"; return { w: 240, h: 380, face: [-20, -182, 0.72], skin: c,
      body: rc(110, -470, 64, 200, "#8a5a3c") + `<circle cx="150" cy="-512" r="30" fill="#f6f1e4" ${st}/><circle cx="196" cy="-566" r="42" fill="#f6f1e4" ${st}/>` +
        `<path d="M-230,-270 L-230,-350 L-110,-270 L-110,-350 L10,-270 L10,-350 L130,-270Z" fill="${shade(c, 0.25)}" ${st}/>` + rc(-230, -274, 460, 274, c) + rc(-230, -70, 460, 70, "#f6f1e4") + lab(o, -20, 210, 46) }; },
    // a server rack: a data center, a cloud provider's machines
    server(o) { const c = o.color || "#2c3766"; let rows = ""; for (let i = 0; i < 5; i++) rows += rc(-96, -262 + i * 46, 192, 32, "#1c2340", 6) + [0, 1, 2].map((k) => `<circle class="tick" cx="${-70 + k * 26}" cy="${-246 + i * 46}" r="7" fill="${(i + k) % 3 ? "#46e08a" : "#ffe14d"}"/>`).join("");
      return { w: 130, h: 500, feet: 1, face: [0, -372, 0.62], skin: "#44538f", body: rc(-124, -500, 248, 476, c, 14) + rc(-100, -474, 200, 190, "#44538f", 10) + rows }; },
    // a cloud: cloud computing, "the internet"
    cloud(o) { return { w: 220, h: 400, hover: 1, face: [-6, -232, 0.7], skin: "#fff",
      body: `<path d="M-230,-110 Q-262,-210 -166,-230 Q-160,-330 -46,-322 Q16,-392 112,-340 Q214,-350 216,-246 Q276,-204 232,-110Z" fill="#fff" ${st}/>` + lab(o, -134, 170, 42) }; },
    // a coin: money, a currency, an index fund
    coin(o) { const c = o.color || "#f0b429"; return { w: 168, h: 360, feet: 1, face: [0, -200, 0.72], skin: c,
      body: `<circle cx="0" cy="-190" r="168" fill="${shade(c, 0.18)}" ${st}/><circle cx="0" cy="-190" r="138" fill="${c}" ${st}/>` + lab(o, -84, 96, 36) }; },
    // a money bag: a fund, a budget, somebody's savings
    bag(o) { const c = o.color || "#c9a36b"; return { w: 170, h: 380, feet: 1, face: [0, -196, 0.7], skin: c,
      body: `<path d="M-150,-30 Q-200,-210 -72,-310 L-96,-366 Q0,-396 96,-366 L72,-310 Q200,-210 150,-30 Q0,-12 -150,-30Z" fill="${c}" ${st}/>` + rc(-84, -322, 168, 28, "#8a5a3c", 12) + lab(o, -70, 130, 44) }; },
    // a house: a household, a town, the housing market
    house(o) { const c = o.color || "#e9dfc8"; return { w: 200, h: 430, face: [0, -172, 0.66], skin: c,
      body: rc(104, -410, 46, 100, "#8a5a3c") + `<path d="M-232,-250 L0,-430 L232,-250Z" fill="${o.roof || "#c9705a"}" ${st}/>` + rc(-186, -254, 372, 254, c) + rc(-116, -70, 232, 58, "#f6f1e4", 6) + lab(o, -28, 104, 40) }; },
    // a barrel: oil, energy, a commodity
    barrel(o) { const c = o.color || "#3d4a5c"; return { w: 130, h: 350, feet: 1, face: [0, -206, 0.64], skin: c,
      body: rc(-124, -350, 248, 326, c, 28) + rc(-132, -298, 264, 20, shade(c, 0.35), 8) + rc(-132, -118, 264, 20, shade(c, 0.35), 8) + lab(o, -52, 110, 40, "#f6f1e4") }; },
    // a folded newspaper standing up: the press. The masthead is the plain-text `label`, in our own lettering (never a real masthead).
    newspaper(o) { const c = o.color || "#ece6d3", words = String(o.label || "THE DAILY").split(" "); let best = [words.join(" ")], bm = best[0].length;
      for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(" "), b = words.slice(i).join(" "); if (Math.max(a.length, b.length) < bm) { bm = Math.max(a.length, b.length); best = [a, b]; } }
      const size = Math.min(50, 300 / (bm * 0.6)); let lines = "";
      for (let i = 0; i < 4; i++) lines += `<path d="M-150,${-84 + i * 24} L${i % 2 ? 40 : 70},${-84 + i * 24}" stroke="#8d8a7e" stroke-width="8" stroke-linecap="round"/>` + `<path d="M${i % 2 ? 100 : 120},${-84 + i * 24} L150,${-84 + i * 24}" stroke="#8d8a7e" stroke-width="8" stroke-linecap="round"/>`;
      return { w: 190, h: 500, feet: 1, face: [0, -205, 0.6], skin: c,
        body: rc(-190, -500, 380, 480, c, 6) + rc(-190, -500, 190, 480, shade(c, 0.06), 6) + best.map((l, i) => txt(0, -500 + 12 + size * (0.95 + i * 1.05), l, size, INK)).join("") +
          `<path d="M-170,${-500 + 20 + best.length * size * 1.05 + 6} L170,${-500 + 20 + best.length * size * 1.05 + 6}" stroke="${INK}" stroke-width="6"/>` + lines }; },
    // a banknote: "your hundred dollars", the dollar, a paycheque
    note(o) { const c = o.color || "#cfe6c8"; return { w: 210, h: 330, hover: 1, face: [0, -206, 0.6], skin: "#bfe8cf",
      body: rc(-214, -318, 428, 228, c, 8) + `<rect x="-194" y="-298" width="388" height="188" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-204" rx="92" ry="88" fill="#bfe8cf" ${st}/>` +
        (o.label ? txt(-150, -186, o.label, 46) + txt(150, -186, o.label, 46) : "") }; },
    // soda: the drink itself, our own plain object (never a real can or bottle design: no brand fonts, fruit pictures or logos).
    // { shape: "bottle" | "can" | "plain", label, color, tag, tagDown, tagFlip: seconds, tagTear: seconds, tagAfter, sweat }
    soda(o) { return sodaBody(o, false); },
    // giant: the cola giant, a wide plain can. { color: "navy" | "red" | "teal" | "#hex", coat: "lab", label } at scale up to 3.
    giant(o) { return sodaBody(o, true); },
    // vending: a pink vending machine with its face in the glass front, cans in rows behind it
    vending(o) { const c = o.color || "#e87aa8"; let cans = ""; for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) cans += rc(-112 + i * 38, -420 + r * 60, 26, 44, ["#f08a7a", "#7fd0f0", "#f3e6c8", "#9fd8a8"][(r + i) % 4], 5);
      return { w: 190, h: 480, feet: 1, face: [0, -300, 0.7], skin: "#fbe3ec", body: rc(-190, -480, 380, 460, c, 18) + rc(-140, -440, 280, 270, "#2c3766", 8) + cans + rc(-140, -440, 280, 270, "rgba(255,255,255,.14)", 8) +
        rc(-150, -158, 300, 96, shade(c, 0.22), 8) + rc(-70, -140, 140, 54, "#1c2340", 8) + rc(-170, -450, 20, 380, shade(c, 0.25), 6) + (o.label ? txt(0, -462, o.label, 34, "#f6f1e4") : "") }; },
    // the board of directors as a meeting table with a face: THE BOARD on its edge. { open: seconds (the thick folder REVIEW opens), tip: seconds (the banker's lamp tips over) }
    the_board(o) { const c = o.color || "#8a5a3c", lamp = "#2f8f5a";
      const body = rc(-250, -100, 36, 100, shade(c, 0.3), 6) + rc(214, -100, 36, 100, shade(c, 0.3), 6) + rc(-270, -340, 540, 240, c, 10) + rc(-300, -392, 600, 56, shade(c, -0.12), 12) + rc(-240, -150, 480, 46, "#f6f1e4", 6) + txt(0, -114, o.label || "THE BOARD", 36) +
        `<g class="lamp"><path d="M190,-392 L190,-480" stroke="${INK}" stroke-width="10"/>${rc(150, -404, 80, 18, "#3d4a5c", 6)}<path d="M138,-470 L242,-470 L222,-540 L158,-540Z" fill="${lamp}" ${st}/><ellipse cx="190" cy="-470" rx="48" ry="8" fill="#b8f0a0"/></g>` +
        `<g class="fclosed">${rc(-240, -424, 190, 34, "#e8dcc0", 4)}${rc(-240, -424, 190, 10, "#c9b88a", 3)}${txt(-145, -396, "REVIEW", 22)}</g>` +
        `<g class="fopen" style="opacity:0">${rc(-262, -560, 220, 160, "#f6f1e4", 4)}<path d="M-244,-532 L-70,-532 M-244,-502 L-90,-502 M-244,-472 L-120,-472" stroke="#9aa0b4" stroke-width="6" stroke-linecap="round"/>${rc(-252, -440, 240, 42, "#e8dcc0", 4)}${txt(-132, -409, "REVIEW", 30)}</g>`;
      return { w: 300, h: 420, feet: 0, face: [0, -250, 0.74], skin: c, body,
        play(tl, a, t0) { const q = (s2) => a.el.querySelector(s2);
          if (o.open != null) { tl.set(q(".fclosed"), { opacity: 0 }, t0 + o.open); tl.set(q(".fopen"), { opacity: 1 }, t0 + o.open); gsap.set(q(".fopen"), { svgOrigin: "-150 -400", smoothOrigin: false }); tl.fromTo(q(".fopen"), { scaleY: 0.2 }, { scaleY: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t0 + o.open); }
          if (o.tip != null) { gsap.set(q(".lamp"), { svgOrigin: "190 -392", smoothOrigin: false }); tl.to(q(".lamp"), { rotation: 86, duration: 0.45, ease: "power2.in" }, t0 + o.tip); tl.to(q(".lamp"), { rotation: 78, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, t0 + o.tip + 0.45); } } }; },
    // @cfo-things
  };

  // { hat: "party" | "crown" | "hardhat" }: worn over the hair (G: the figure landmarks from geo()).
  const HATS = {
    party: (G) => { const y = G.yT; return `<path d="M-50,${y + 14} L6,${y - 112} L56,${y + 14}Z" fill="#7fd0f0" ${st}/><path d="M-28,${y - 30} L40,${y - 18} M-8,${y - 72} L24,${y - 66}" stroke="#e0262b" stroke-width="9" stroke-linecap="round"/><circle cx="6" cy="${y - 116}" r="15" fill="#e0262b" ${st}/>`; },
    crown: (G) => { const y = G.yT; return `<path d="M-66,${y + 14} L-72,${y - 58} L-36,${y - 24} L0,${y - 74} L36,${y - 24} L72,${y - 58} L66,${y + 14}Z" fill="#f0b429" ${st}/><circle cx="0" cy="${y - 8}" r="9" fill="#e0262b" ${st}/>`; },
    hardhat: (G) => { const y = G.yT; return `<path d="M-88,${y + 40} Q-92,${y - 52} 0,${y - 54} Q92,${y - 52} 88,${y + 40}Z" fill="#f0b429" ${st}/><path d="M-20,${y - 50} L-14,${y + 36} M20,${y - 50} L14,${y + 36}" stroke="#c98a12" stroke-width="6"/><rect x="-106" y="${y + 30}" width="212" height="20" rx="9" fill="#f0b429" ${st}/>`; },
  };

  // A living thing (see THINGS): the same face, gloves and timeline hooks as a person.
  function makeThing(o) {
    const T = THINGS[o.thing](o), g = document.createElementNS(NS, "g"); g.setAttribute("class", "actor cut");
    const mouths = Object.keys(MOUTHS).map((k) => `<g class="m-${k}">${MOUTHS[k]}</g>`).join(""), glove = o.glove || "#f6f1e4", lift = T.hover ? -70 : 0;
    const prop = o.prop && PROPS[o.prop] ? `<g class="prop">${PROPS[o.prop](o)}</g>` : "", hide = o.hands === false ? ' style="display:none"' : "";
    g.innerHTML = (`
      <ellipse cx="0" cy="4" rx="${Math.round(T.w * (T.hover ? 0.7 : 0.95))}" ry="${T.hover ? 14 : 20}" fill="rgba(15,18,40,.25)"/>
      <g class="torso">${T.feet ? rc(-92, -30, 84, 32, "#2b2b2b", 15) + rc(8, -30, 84, 32, "#2b2b2b", 15) : ""}</g>
      <g class="head"><g transform="translate(0,${lift})">${T.body}
        <g class="face" transform="translate(${T.face[0]},${T.face[1]}) scale(${T.face[2]}) translate(0,400)">${eye(-62, 0, false)}${eye(62, 0, false)}
          <g class="mouth" transform="translate(0,-346)">${mouths}</g>
          <path class="sweat" d="M118,-520 Q98,-486 118,-474 Q138,-486 118,-520Z" fill="#7fd0f0" ${st}/>
          <path class="tear" d="M-62,-398 Q-78,-370 -62,-360 Q-46,-370 -62,-398Z" fill="#7fd0f0" ${st}/>
        </g></g>
      </g>
      <g class="hand hl"${hide}><circle r="34" fill="${glove}" ${st}/></g>
      <g class="hand hr"${hide}>${prop}<circle r="34" fill="${glove}" ${st}/></g>`).replace(/SKIN/g, T.skin);
    const q = (s) => g.querySelector(s), qa = (s) => Array.from(g.querySelectorAll(s));
    const a = { el: g, spec: T, opts: o, head: q(".head"), torso: q(".torso"), hl: q(".hl"), hr: q(".hr"), mouth: {}, eyes: {}, blink: qa(".e-blink"),
      brows: qa(".brow"), pupils: qa(".pupil"), sweat: q(".sweat"), tear: q(".tear"), face: "neutral", pose: "rest", hk: [(T.w + 44) / 160, (T.h + lift * -1) / 580, lift] };
    Object.keys(MOUTHS).forEach((k) => { a.mouth[k] = q(".m-" + k); });
    ["open", "wide", "half", "happy"].forEach((k) => { a.eyes[k] = qa(".e-" + k); });
    return a;
  }

  // Mirrored figures keep their text readable.
  function unflip(a) { a.el.querySelectorAll(".txt").forEach((e) => e.setAttribute("transform", e.getAttribute("transform") + " scale(-1,1)")); }

  // A person (see CAST): legs, then the upper body (torso, head, both arms), which breathes, sways, turns and leans.
  function makePerson(c, o) {
    const G = geo(c), B = G.B, T = torso2(c, G, o), H = head2(c, G, o.back), g = document.createElementNS(NS, "g"); g.setAttribute("class", "actor cut");
    const prop = o.prop && PROPS[o.prop] ? `<g class="prop">${PROPS[o.prop](o)}</g>` : "";
    const need = handsNeeded(o, !!prop);
    const arm = (s) => `<g class="arm a${s} hand h${s}" transform="translate(${f1(s === "l" ? -G.jx : G.jx)},${f1(G.jy)})${s === "l" ? " scale(-1,1)" : ""}">${arm2(c, G, T, s, s === "r" ? prop : "", need[s])}</g>`;
    const leg = (s) => `<g class="leg g${s}" transform="translate(${f1(s === "l" ? -G.hx : G.hx)},${G.yH})${s === "l" ? " scale(-1,1)" : ""}">${leg2(c, G, s)}</g>`;
    g.innerHTML = (`<ellipse cx="0" cy="4" rx="${B.sh + 46}" ry="17" fill="rgba(15,18,40,.25)"/>
      <g class="body"><g class="sway"><g class="legs">${leg("l")}${leg("r")}</g>
        <g class="upper"><g class="hb">${H.back}</g><g class="torso">${T.behind}${T.body}${o.back ? "" : T.over}${T.lower}</g><g class="head">${H.main}${o.hat && HATS[o.hat] ? HATS[o.hat](G) : ""}</g>${arm("l")}${arm("r")}</g>
      </g></g>`).replace(/SKIN/g, c.skin);
    const q = (s) => g.querySelector(s), qa = (s) => Array.from(g.querySelectorAll(s));
    const armRef = (s) => { const r = q(".a" + s), hs = {}; r.querySelectorAll(".hs").forEach((e) => { hs[e.getAttribute("data-k")] = e; });
      return { root: r, sw: r.querySelector(".sw"), ua: r.querySelector(".ua"), fa: r.querySelector(".fa"), fg: r.querySelector(".fg"), wr: r.querySelector(".wr"), hs }; };
    const legRef = (s) => { const r = q(".g" + s); return { root: r, th: r.querySelector(".th"), sh: r.querySelector(".sh"), ft: r.querySelector(".ft2") || r.querySelector(".ft") }; };
    const a = { el: g, kind: "person", spec: c, G, opts: o, hf: q(".hf"), body: q(".body"), sway: q(".sway"), upper: q(".upper"), head: [q(".head"), q(".hb")], torso: q(".torso"),
      arms: { l: armRef("l"), r: armRef("r") }, legs: { l: legRef("l"), r: legRef("r") }, holds: !!prop, mouth: {}, eyes: {}, blink: qa(".e-blink"),
      brows: qa(".brow"), pupils: qa(".pupil"), sweat: q(".sweat"), tear: q(".tear"), face: "neutral", pose: "rest", neck: G.yS, hk: [1, 1, 0], bk: 0.45, pk: 0.45,
      portrait: [-118, G.yT - 34, 236, 236] }; // portrait: the square window of the head (scenes.js crops faces with it)
    a.hl = a.arms.l.root; a.hr = a.arms.r.root;
    Object.keys(MOUTHS2).forEach((k) => { a.mouth[k] = q(".m-" + k); });
    ["open", "wide", "half", "happy"].forEach((k) => { a.eyes[k] = qa(".e-" + k); });
    if (o.shadow || c.flat || o.back) q(".face").style.display = "none"; // a silhouette or a figure seen from behind: no face at all
    // a figure that turns its back carries its back view, hidden until it turns
    if (!o.back && (o.acts || []).some((x) => x && x.act === "turn")) { a.backView = makePerson(c, Object.assign({}, o, { back: true, acts: null, prop: null, badge: null }));
      a.backView.el.setAttribute("class", "bkv"); a.backView.el.style.opacity = 0; g.appendChild(a.backView.el); }
    return a;
  }

  // The hand shapes a figure will show: those of its first pose and of every pose in its acts ("relax" always, "grip" when it holds a prop).
  function handsNeeded(o, holds) {
    const need = { l: new Set(["relax"]), r: new Set([holds ? "grip" : "relax"]) };
    const add = (p) => { const P = POSES[p]; if (!P) return; need.l.add(P[0][2] || "relax"); need.r.add(holds ? "grip" : P[1][2] || "relax"); };
    add(o.pose || (o.prop ? PROP_POSE[o.prop] || "phone" : "rest")); (o.acts || []).forEach((a) => { if (a && a.pose) add(a.pose); });
    if (o.allHands) ["relax", "open", "point", "fist", "flat", "grip"].forEach((n) => { need.l.add(n); need.r.add(n); });
    return need;
  }
  // Show one hand shape (or the nearest one drawn, if a pose was added after the figure was made).
  const handName = (A, n) => (A.hs[n] ? n : A.hs.relax ? "relax" : Object.keys(A.hs)[0]);

  // A name nobody cast: a background person whose look is picked from the name (the same name always gives the same person).
  const hashName = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  function make(who, o) {
    o = o || {};
    if (o.thing && !THINGS[o.thing]) { console.warn("studio: unknown thing \"" + o.thing + "\", drawn as a box"); o = Object.assign({}, o, { thing: "box" }); }
    if (o.thing) return makeThing(o);
    return makePerson(Object.assign({}, typeof who === "string" ? CAST[who] || extra(hashName(who)) : who, o.style || {}), o);
  }

  const vis = (els, on) => [].concat(els).forEach((e) => { e.style.opacity = on ? 1 : 0; });
  const O = (els, y) => gsap.set(els, { svgOrigin: `0 ${y || 0}`, smoothOrigin: false });
  const armState = (a, name) => { const P = POSES[name] || POSES.rest; return { l: solve(a.G, P[0], false), r: solve(a.G, P[1], a.holds) }; };

  // Initial state, set directly on the elements (the timeline then changes it at cue times).
  function init(a, face, pose, look) {
    const f = FACES[face] || FACES.neutral, person = a.kind === "person", bk = a.bk || 1, pk = a.pk || 1;
    a.face = face in FACES ? face : "neutral"; a.pose = pose in POSES ? pose : "rest";
    Object.keys(a.mouth).forEach((k) => vis(a.mouth[k], k === f.mouth));
    Object.keys(a.eyes).forEach((k) => vis(a.eyes[k], k === f.eyes));
    vis(a.blink, false); vis(a.sweat, !!f.sweat); vis(a.tear, !!f.tear);
    gsap.set(a.brows[0], { rotation: f.brows[0], y: f.brows[2] * bk, transformOrigin: "50% 50%" });
    gsap.set(a.brows[1], { rotation: f.brows[1], y: f.brows[3] * bk, transformOrigin: "50% 50%" });
    gsap.set(a.pupils, { x: (look === "left" ? -9 : look === "right" ? 9 : 0) * pk, y: (look === "up" ? -8 : look === "down" ? 8 : 0) * pk });
    if (!person) {
      const p = GLOVE[a.pose] || GLOVE.rest, [kx, ky, lift] = a.hk; // things are wider or shorter than people: scale the hand targets to their size
      gsap.set(a.hl, { x: p[0] * kx, y: p[1] * ky + lift }); gsap.set(a.hr, { x: p[2] * kx, y: p[3] * ky + lift });
      // Fix the pivots before anything moves; changing a pivot later makes GSAP shift the element to compensate.
      gsap.set([a.el, a.head, a.torso], { transformOrigin: "50% 100%", smoothOrigin: false });
      return;
    }
    // Pivots (fixed once): the feet for the whole figure, the hips for the upper body, the chin for the head, each joint for its limb.
    const G = a.G; O([a.el, a.body, a.sway]); O([a.upper, a.torso], G.yH); O(a.head, G.yC + 6); if (a.hf) O(a.hf, G.yT + 40);
    ["l", "r"].forEach((s) => { const A = a.arms[s], L = a.legs[s]; O([A.sw, A.ua, A.fa, A.fg, A.wr, L.th, L.sh, L.ft]); });
    if (a.backView) init(a.backView, "neutral", "rest");
    const S = armState(a, a.pose); a.armNow = S;
    ["l", "r"].forEach((s) => { const A = a.arms[s], p = S[s], L = a.legs[s];
      gsap.set(A.ua, { rotation: p.u }); gsap.set(A.fa, { rotation: p.f }); gsap.set(A.wr, { rotation: p.w });
      const hn = handName(A, p.hand); Object.keys(A.hs).forEach((n) => { A.hs[n].style.opacity = n === hn ? 1 : 0; });
      gsap.set(L.th, { rotation: -2 }); gsap.set(L.sh, { rotation: 1 }); gsap.set(L.ft, { rotation: 1 }); }); // feet a little apart, toes out
  }

  // Change expression at time t (snap for parts, quick tween for brows).
  function face(tl, a, name, t) {
    const f = FACES[name]; if (!f) return; const bk = a.bk || 1;
    Object.keys(a.mouth).forEach((k) => tl.set(a.mouth[k], { opacity: k === f.mouth ? 1 : 0 }, t));
    Object.keys(a.eyes).forEach((k) => tl.set(a.eyes[k], { opacity: k === f.eyes ? 1 : 0 }, t));
    tl.set(a.sweat, { opacity: f.sweat ? 1 : 0 }, t); tl.set(a.tear, { opacity: f.tear ? 1 : 0 }, t);
    tl.to(a.brows[0], { rotation: f.brows[0], y: f.brows[2] * bk, duration: 0.12 }, t);
    tl.to(a.brows[1], { rotation: f.brows[1], y: f.brows[3] * bk, duration: 0.12 }, t);
    tl.fromTo(a.head, { scale: 1 }, { scale: a.kind === "person" ? 1.04 : 1.06, duration: 0.09, yoyo: true, repeat: 1, immediateRender: false }, t);
    a.face = name;
  }

  // Arms swing to a pose with the animation principles: a small move the other way first (anticipation), then the swing,
  // which overshoots a little and settles (back.out). All three joints share one ease, so a held prop stays upright all the way.
  function pose(tl, a, name, t, dur, ease) {
    if (a.kind !== "person") {
      const p = GLOVE[name] || (POSES[name] ? GLOVE.rest : null); if (!p) return; const [kx, ky, lift] = a.hk;
      tl.to(a.hl, { x: p[0] * kx, y: p[1] * ky + lift, duration: 0.28, ease: "back.out(1.7)" }, t);
      tl.to(a.hr, { x: p[2] * kx, y: p[3] * ky + lift, duration: 0.28, ease: "back.out(1.7)" }, t);
      a.pose = name; return;
    }
    if (!POSES[name]) return;
    const from = a.armNow || armState(a, a.pose), to = armState(a, name), d = dur || 0.34, k = 0.12;
    ["l", "r"].forEach((s) => { const A = a.arms[s], p = from[s], q = to[s];
      if (p.u !== q.u || p.f !== q.f || p.w !== q.w) ["u", "f", "w"].forEach((j) => { const el = j === "u" ? A.ua : j === "f" ? A.fa : A.wr, ant = p[j] - (q[j] - p[j]) * k;
        tl.fromTo(el, { rotation: p[j] }, { rotation: ant, duration: 0.08, ease: "sine.out", immediateRender: false }, t);
        tl.fromTo(el, { rotation: ant }, { rotation: q[j], duration: d, ease: ease || "back.out(1.6)", immediateRender: false }, t + 0.08); });
      if (p.hand !== q.hand) { const hn = handName(A, q.hand); Object.keys(A.hs).forEach((n) => tl.set(A.hs[n], { opacity: n === hn ? 1 : 0 }, t + 0.08 + d * 0.3)); } });
    a.armNow = to; a.pose = name;
  }

  // Lip sync from text alone: vowels pick the mouth shape, word lengths set the rhythm.
  function visemes(text, t0, d) {
    const words = text.split(/\s+/).filter(Boolean), tot = words.reduce((s, w) => s + w.length + 2, 0), out = []; let t = t0;
    for (const w of words) {
      const wd = d * (w.length + 2) / tot, v = (w.toLowerCase().match(/[aeiouy]+/g) || ["e"]).slice(0, 3), step = wd * 0.82 / v.length;
      if (/^[mbp]/i.test(w)) out.push([t, "tM"]);
      v.forEach((x, i) => out.push([t + i * step + 0.02, /[ou]/.test(x) ? "tO" : /a/.test(x) ? "tA" : "tE"]));
      out.push([t + wd * 0.86, "tM"]); t += wd;
    }
    return out;
  }

  function talk(tl, a, text, t0, d) {
    const base = (FACES[a.face] || FACES.neutral).mouth, keys = Object.keys(a.mouth), person = a.kind === "person";
    const setM = (k, t) => keys.forEach((m) => tl.set(a.mouth[m], { opacity: m === k ? 1 : 0 }, t));
    visemes(text, t0, d).forEach(([t, k]) => setM(k, t));
    setM(base, t0 + d + 0.02);
    tl.fromTo(a.head, { y: 0, rotation: 0 }, { y: person ? -5 : -12, rotation: person ? 1.4 : 0, duration: 0.13, yoyo: true, repeat: Math.max(1, Math.floor(d / 0.26) * 2 - 1), ease: "sine.inOut", immediateRender: false }, t0);
    // the hand on the facing side gestures with the words (a person bends the forearm, a living thing turns its glove)
    tl.fromTo(person ? a.arms.r.fg : a.hr, { rotation: 0 }, { rotation: person ? -9 : -10, duration: 0.2, yoyo: true, repeat: Math.max(1, Math.floor(d / 0.4) * 2 - 1), ease: "sine.inOut", immediateRender: false }, t0);
  }

  // Life between lines: blinks, a slow breath and (for people) a weight shift from foot to foot, on a fixed schedule per figure.
  function idle(tl, a, t0, t1, seed) {
    if (a.spec && a.spec.play) a.spec.play(tl, a, t0, t1); // a living thing may animate its own parts (a tag that flips)
    for (let t = t0 + 1.1 + (seed % 5) * 0.37; t < t1 - 0.2; t += 2.9 + (seed % 3) * 0.6) { tl.set(a.blink, { opacity: 1 }, t); tl.set(a.blink, { opacity: 0 }, t + 0.11); }
    const n = Math.max(1, Math.floor((t1 - t0) / 1.3));
    if (a.kind !== "person") { tl.fromTo(a.torso, { scaleY: 1 }, { scaleY: 1.022, duration: 1.3, yoyo: true, repeat: n, ease: "sine.inOut", immediateRender: false }, t0); return; }
    tl.fromTo(a.upper, { y: 0 }, { y: -3, duration: 1.3, yoyo: true, repeat: n, ease: "sine.inOut", immediateRender: false }, t0);
    const sp = 3.2 + (seed % 3) * 0.45, m = Math.max(1, Math.floor((t1 - t0) / sp)), dir = seed % 2 ? 1 : -1;
    tl.fromTo(a.sway, { rotation: -0.7 * dir }, { rotation: 0.7 * dir, duration: sp, yoyo: true, repeat: m, ease: "sine.inOut", immediateRender: false }, t0);
  }

  /* A walk (the "to" act, an entrance, an extra crossing the frame). The legs scissor along the way and the swinging leg bends its knee,
     the arms swing against the legs, the body bobs twice a stride and leans a little into the walk, the hair follows through.
     dir: +1 when the figure walks toward the side it faces, -1 when it walks away. Steps of about 0.3 s on a fixed schedule (seek-safe). */
  function walk(tl, a, t, d, dir) {
    if (a.kind !== "person" || d < 0.25) return false;
    const n = Math.max(2, Math.round(d / 0.3)), st = (d - 0.2) / n, A = 22, KN = 36, SW = 16, L = a.legs, R = a.arms, s0 = t + 0.1;
    const W = (s, w) => (s === "r" ? w : -w); // world angle into the leg's or arm's own frame (the left side is mirrored)
    const go = (el, from, to, tt, dur, ease) => tl.fromTo(el, { rotation: from }, { rotation: to, duration: dur, ease: ease || "sine.inOut", immediateRender: false }, tt);
    // into the first stride (the right leg goes forward), then stride after stride, then settle back to standing
    go(L.r.th, -2, W("r", -A), t, 0.1); go(L.l.th, -2, W("l", A), t, 0.1); go(R.r.sw, 0, W("r", SW), t, 0.1); go(R.l.sw, 0, W("l", -SW), t, 0.1);
    for (let i = 0; i < n; i++) {
      const ts = s0 + i * st, f = i % 2 ? "l" : "r", b = i % 2 ? "r" : "l";
      go(L[f].th, W(f, -A), W(f, A), ts, st, "none"); // the front foot passes under the body
      go(L[b].th, W(b, A), W(b, -A), ts, st);          // the back leg swings through, knee bent at the middle
      go(L[b].sh, 0, W(b, KN), ts, st / 2, "sine.out"); go(L[b].sh, W(b, KN), 0, ts + st / 2, st / 2, "sine.in");
      go(L[b].ft, 0, W(b, -KN * 0.6), ts, st / 2, "sine.out"); go(L[b].ft, W(b, -KN * 0.6), 0, ts + st / 2, st / 2, "sine.in");
      go(R[f].sw, W(f, SW), W(f, -SW), ts, st); go(R[b].sw, W(b, -SW), W(b, SW), ts, st);
    }
    const te = s0 + n * st;
    ["l", "r"].forEach((s) => { go(L[s].th, W(s, (n % 2 ? (s === "r" ? A : -A) : s === "r" ? -A : A)), -2, te, 0.22, "back.out(1.6)"); go(L[s].sh, 0, 1, te, 0.22); go(L[s].ft, 0, 1, te, 0.22);
      go(R[s].sw, W(s, n % 2 ? (s === "r" ? -SW : SW) : s === "r" ? SW : -SW), 0, te, 0.3, "back.out(1.4)"); });
    tl.fromTo(a.body, { y: 0 }, { y: -7, duration: st / 2, yoyo: true, repeat: n * 2 - 1, ease: "sine.out", immediateRender: false }, s0);
    tl.fromTo(a.body, { rotation: 0 }, { rotation: 3.5 * (dir || 1), duration: 0.18, ease: "sine.out", immediateRender: false }, t);
    tl.fromTo(a.body, { rotation: 3.5 * (dir || 1) }, { rotation: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, te);
    if (a.hf) tl.fromTo(a.hf, { y: 0 }, { y: 4, duration: st / 2, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, s0 + 0.06); // hair lags the bob
    return true;
  }

  /* Acts that use the whole body ("act" in a storyboard act). Each starts with a small move the other way and ends with a settle.
     sit / stand: the thighs fold toward the camera and the body drops onto a seat (hands go to the lap unless the act names a pose);
     turn: the back to the camera (and back again); lean / lean_back / upright; slam: both hands down hard on a table. */
  function act(tl, a, what, t, o) {
    if (a.kind !== "person") { if (what === "slam" || what === "lean") tl.fromTo(a.el, { rotation: 0 }, { rotation: what === "slam" ? 4 : 6, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t); return; }
    const G = a.G, L = a.legs, B = a.body;
    if (what === "sit" || what === "stand") { const down = what === "sit"; if (!!a.seated === down) return; a.seated = down;
      const k0 = down ? 1 : 0.34, k1 = down ? 0.34 : 1, y0 = down ? 0 : G.T1 * 0.66, y1 = down ? G.T1 * 0.66 : 0;
      tl.fromTo(B, { y: y0 }, { y: y0 + (down ? -8 : 10), duration: 0.1, ease: "sine.out", immediateRender: false }, t); // a little rise before sitting, a dip before standing
      tl.fromTo(B, { y: y0 + (down ? -8 : 10) }, { y: y1, duration: 0.32, ease: down ? "back.out(1.3)" : "power2.out", immediateRender: false }, t + 0.1);
      ["l", "r"].forEach((s) => { tl.fromTo(L[s].th, { scaleY: k0, rotation: down ? -2 : -9 }, { scaleY: k1, rotation: down ? -9 : -2, duration: 0.32, ease: "power2.inOut", immediateRender: false }, t + 0.1);
        tl.fromTo(L[s].sh, { scaleY: 1 / k0 }, { scaleY: 1 / k1, duration: 0.32, ease: "power2.inOut", immediateRender: false }, t + 0.1); });
      if (!(o && o.pose)) pose(tl, a, down ? "lap" : "rest", t + 0.1); return; }
    if (what === "turn") { const BV = a.backView; if (!BV) return; const on = !a.turned; a.turned = on;
      tl.fromTo([B, BV.body], { scaleX: 1 }, { scaleX: 0.08, duration: 0.1, ease: "power2.in", immediateRender: false }, t);
      tl.set(B, { opacity: on ? 0 : 1 }, t + 0.1); tl.set(BV.el, { opacity: on ? 1 : 0 }, t + 0.1);
      tl.fromTo([B, BV.body], { scaleX: 0.08 }, { scaleX: 1, duration: 0.16, ease: "back.out(1.6)", immediateRender: false }, t + 0.1); return; }
    const lean = { lean: 7, lean_back: -6, upright: 0, slam: 5 }[what]; if (lean == null) return;
    const from = a.leanNow || 0, ant = from - (lean - from) * 0.15;
    if (what === "slam") pose(tl, a, "slam", t, 0.12, "power4.in");
    tl.fromTo(B, { rotation: from }, { rotation: ant, duration: 0.08, ease: "sine.out", immediateRender: false }, t);
    tl.fromTo(B, { rotation: ant }, { rotation: lean, duration: what === "slam" ? 0.12 : 0.36, ease: what === "slam" ? "power4.in" : "back.out(1.5)", immediateRender: false }, t + 0.08);
    if (what === "slam") { tl.fromTo(B, { rotation: lean }, { rotation: 1.5, duration: 0.5, ease: "elastic.out(1, 0.5)", immediateRender: false }, t + 0.24); a.leanNow = 1.5; } else a.leanNow = lean;
  }

  const ENTER = { pop: { scale: 0.4, opacity: 0 }, slide_left: { x: -900 }, slide_right: { x: 900 }, rise: { y: 700 }, none: null };
  function enter(tl, a, how, t) {
    const from = ENTER[how === undefined ? "pop" : how]; if (!from) return;
    tl.fromTo(a.el, Object.assign({ x: 0, y: 0, scale: 1, opacity: 1 }, from), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.5)", immediateRender: false }, t);
  }

  window.Rig = { CAST, FACES, POSES, GLOVE, PROPS, PROP_POSE, THINGS, HATS, BUILDS, JAW, make, init, face, pose, talk, idle, enter, walk, act, extra, register, hashName, shade, tint, unflip, solve, geo, INK };
})();
