/* Character rig: every figure is drawn in code (SVG) from one skeleton.
   House look: squircle head (about 45% of the height), block body, floating mitten hands,
   ink-navy outline, hard paper-cut shadow. Origin of a figure is the middle of its feet.
   Everything that moves is driven by the GSAP timeline, so it is deterministic and seek-safe. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#1b1d36", SW = 7;
  const st = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;

  // Text on a figure or its prop. It sits in a "txt" group so the engine can turn it back when the figure is mirrored.
  const txt = (x, y, t, size, fill) => `<g class="txt" transform="translate(${x},${y})"><text x="0" y="0" font-size="${Math.round(size)}" text-anchor="middle" fill="${fill || INK}">${String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></g>`;

  const CAST = {
    BENNY: { skin: "#f3c9a5", hair: "#6b4226", hairStyle: "cowlick", top: "#e8a317", topStyle: "hoodie", legs: "#2e3a59", shoes: "#f4f1ea", extras: ["freckles"] },
    CHAD: { skin: "#f0bd98", hair: "#d8b064", hairStyle: "cap", cap: "#6b3fa0", top: "#6b3fa0", topStyle: "hoodie", legs: "#8a8f6a", shoes: "#e0262b", extras: ["shades_up"], build: "tall" },
    HAL: { skin: "#ecc4a6", hair: "#c9ced6", hairStyle: "slick", top: "#1f2a44", topStyle: "suit", tie: "#d4a72c", legs: "#1f2a44", shoes: "#2b2b2b", extras: ["moustache", "glasses_small"], build: "round" },
    MARTHA: { skin: "#dba77e", hair: "#a6522e", hairStyle: "bun", top: "#1f8a8a", topStyle: "cardigan", legs: "#bcd3e0", shoes: "#f4f1ea", extras: ["glasses"] },
    REGGIE: { skin: "#e8c5a9", hair: "#8d9199", hairStyle: "side_part", top: "#7a7f87", topStyle: "suit", tie: "#e0262b", legs: "#5e636b", shoes: "#2b2b2b", extras: ["heavy_brows", "lanyard"], build: "tall" },
  };
  // Background people: pick a palette by index so crowds are varied but deterministic.
  const EXTRA_SKIN = ["#f3c9a5", "#dba77e", "#b98562", "#8a5a3c", "#f0bd98", "#e8c5a9"];
  const EXTRA_TOP = ["#3d6fb6", "#b8473d", "#4f8f5b", "#8b5fb3", "#c9892b", "#56606f", "#c95f8d"];
  const EXTRA_HAIR = ["#2b2118", "#6b4226", "#d8b064", "#8d9199", "#a6522e", "#1b1d36"];
  const EXTRA_STYLE = ["side_part", "slick", "bob", "cowlick", "bun", "bald"];
  function extra(i) {
    return { skin: EXTRA_SKIN[i % 6], hair: EXTRA_HAIR[(i * 5 + 1) % 6], hairStyle: EXTRA_STYLE[(i * 7 + 2) % 6], top: EXTRA_TOP[(i * 3) % 7],
      topStyle: ["tee", "suit", "cardigan", "hoodie"][(i * 3 + 1) % 4], tie: "#e0262b", legs: "#2e3a59", shoes: "#2b2b2b", extras: i % 3 === 0 ? ["glasses"] : [] };
  }

  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(v * (1 - k) + 27 * k);
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join(""); };

  const BUILD = { normal: { tw: 92, bw: 122, top: -300, head: 0 }, round: { tw: 112, bw: 152, top: -292, head: 8 }, tall: { tw: 84, bw: 106, top: -332, head: -32 } };

  function hair(c, hy) {
    const h = c.hair, y = (v) => v + hy, p = (d, fill) => `<path d="${d}" fill="${fill || h}" ${st}/>`;
    switch (c.hairStyle) {
      case "cowlick": return p(`M-152,${y(-462)} Q-166,${y(-580)} 0,${y(-580)} Q166,${y(-580)} 152,${y(-462)} Q96,${y(-524)} 18,${y(-514)} Q-64,${y(-506)} -152,${y(-462)}Z`) +
        p(`M-22,${y(-574)} Q-46,${y(-652)} 34,${y(-668)} Q8,${y(-622)} 46,${y(-580)}Z`);
      case "slick": return p(`M-152,${y(-470)} Q-156,${y(-584)} 0,${y(-582)} Q156,${y(-584)} 152,${y(-470)} Q118,${y(-536)} 0,${y(-540)} Q-118,${y(-536)} -152,${y(-470)}Z`);
      case "bun": return `<circle cx="58" cy="${y(-604)}" r="46" fill="${h}" ${st}/>` +
        p(`M-152,${y(-458)} Q-162,${y(-582)} 0,${y(-582)} Q162,${y(-582)} 152,${y(-458)} Q112,${y(-530)} 0,${y(-526)} Q-112,${y(-530)} -152,${y(-458)}Z`);
      case "side_part": return p(`M-152,${y(-462)} Q-160,${y(-584)} 12,${y(-582)} Q156,${y(-578)} 152,${y(-482)} Q62,${y(-552)} -58,${y(-522)} Q-112,${y(-506)} -152,${y(-462)}Z`);
      case "bob": return p(`M-158,${y(-330)} Q-176,${y(-590)} 0,${y(-586)} Q176,${y(-590)} 158,${y(-330)} L118,${y(-330)} Q134,${y(-500)} 0,${y(-520)} Q-134,${y(-500)} -118,${y(-330)}Z`);
      case "cap": return p(`M148,${y(-528)} Q226,${y(-524)} 232,${y(-492)} Q186,${y(-482)} 148,${y(-494)}Z`, c.cap) +
        p(`M-154,${y(-492)} Q-156,${y(-596)} 0,${y(-596)} Q156,${y(-596)} 154,${y(-492)}Z`, c.cap) + p(`M-150,${y(-492)} Q-120,${y(-462)} -92,${y(-490)}Z`);
      default: return "";
    }
  }

  function clothes(c, B) {
    const d = shade(c.top, 0.22), t = B.top;
    switch (c.topStyle) {
      case "hoodie": return `<path d="M-64,-150 L64,-150 L78,-92 L-78,-92Z" fill="${d}" ${st}/>` +
        `<path d="M-22,${t + 14} L-26,${t + 78} M22,${t + 14} L26,${t + 78}" fill="none" ${st}/><circle cx="-26" cy="${t + 84}" r="7" fill="#f6f1e4" ${st}/><circle cx="26" cy="${t + 84}" r="7" fill="#f6f1e4" ${st}/>`;
      case "suit": return `<path d="M-34,${t + 2} L0,${t + 96} L34,${t + 2}Z" fill="#f6f1e4" ${st}/>` +
        `<path d="M-12,${t + 14} L12,${t + 14} L18,${t + 96} L0,${t + 118} L-18,${t + 96}Z" fill="${c.tie || "#e0262b"}" ${st}/>` +
        `<path d="M-34,${t + 2} L-58,${t + 52} L0,${t + 96} M34,${t + 2} L58,${t + 52} L0,${t + 96}" fill="none" ${st}/><circle cx="0" cy="-128" r="6" fill="${INK}"/>`;
      case "cardigan": return `<path d="M-30,${t + 2} L30,${t + 2} L26,-74 L-26,-74Z" fill="#eef3f5" ${st}/><circle cx="-42" cy="-190" r="6" fill="${INK}"/><circle cx="-44" cy="-140" r="6" fill="${INK}"/>`;
      default: return `<path d="M-40,${t + 4} Q0,${t + 36} 40,${t + 4}" fill="none" ${st}/>`;
    }
  }

  function extras(c, hy) {
    const y = (v) => v + hy; let s = "";
    for (const e of c.extras || []) {
      if (e === "freckles") s += [-98, -84, -70, 70, 84, 98].map((x, i) => `<circle cx="${x}" cy="${y(-386 + (i % 3 === 1 ? 10 : 0))}" r="4" fill="${shade(c.skin, 0.35)}"/>`).join("");
      if (e === "glasses") s += `<circle cx="-62" cy="${y(-440)}" r="46" fill="rgba(255,255,255,.18)" ${st}/><circle cx="62" cy="${y(-440)}" r="46" fill="rgba(255,255,255,.18)" ${st}/><path d="M-16,${y(-444)} L16,${y(-444)}" ${st}/>`;
      if (e === "glasses_small") s += `<rect x="-98" y="${y(-432)}" width="72" height="34" rx="8" fill="rgba(255,255,255,.25)" ${st}/><rect x="26" y="${y(-432)}" width="72" height="34" rx="8" fill="rgba(255,255,255,.25)" ${st}/><path d="M-26,${y(-418)} L26,${y(-418)}" ${st}/>`;
      if (e === "moustache") s += `<path d="M-46,${y(-372)} Q-22,${y(-392)} 0,${y(-378)} Q22,${y(-392)} 46,${y(-372)} Q22,${y(-366)} 0,${y(-370)} Q-22,${y(-366)} -46,${y(-372)}Z" fill="${c.hair}" ${st}/>`;
      if (e === "shades_up") s += `<path d="M-104,${y(-520)} L104,${y(-520)} L92,${y(-488)} Q62,${y(-478)} 30,${y(-492)} L0,${y(-506)} L-30,${y(-492)} Q-62,${y(-478)} -92,${y(-488)}Z" fill="${INK}" ${st}/>`;
      if (e === "lanyard") s += `<path d="M-30,-300 L0,-196 L30,-300" fill="none" stroke="#e0262b" stroke-width="7"/><rect x="-22" y="-200" width="44" height="56" rx="6" fill="#f6f1e4" ${st}/>`;
    }
    return s;
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

  // hand targets [lx, ly, rx, ry]; "r" is the hand on the side the figure faces.
  const POSES = {
    rest: [-160, -165, 160, -165], hips: [-134, -150, 134, -150], shrug: [-206, -304, 206, -304], cheer: [-196, -530, 196, -530],
    point: [-160, -165, 256, -330], think: [-160, -165, 78, -322], facepalm: [-160, -165, 36, -452], hold: [-66, -206, 66, -206],
    phone: [-160, -165, 132, -286], wave: [-160, -165, 214, -436], present: [-160, -165, 232, -250],
    raise: [-160, -165, 300, -236], carry: [-160, -165, 176, -120], panic: [-150, -520, 150, -520], grab: [-160, -165, 250, -190], offer: [-160, -165, 250, -150],
  };
  // The pose a figure takes when it holds this prop and the shot does not name one.
  const PROP_POSE = { placard: "raise", briefcase: "carry", tag: "present", pen: "present", wallet: "offer", cash: "offer", magnifier: "phone" };

  const PROPS = {
    phone: (o) => `<g transform="translate(0,-18) rotate(8)"><rect x="-34" y="-112" width="68" height="118" rx="12" fill="${INK}" ${st}/><rect x="-25" y="-100" width="50" height="86" rx="4" fill="${o.screen === "green" ? "#0f3b24" : "#3b0f14"}"/>
      <path d="${o.screen === "green" ? "M-20,-36 L-8,-52 L2,-44 L20,-82" : "M-20,-84 L-8,-66 L2,-74 L20,-32"}" fill="none" stroke="${o.screen === "green" ? "#46e08a" : "#ff5a4f"}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    bill: () => `<g transform="translate(6,-20) rotate(-6)"><rect x="-52" y="-136" width="104" height="140" fill="#fff" ${st}/><path d="M-36,-110 L36,-110 M-36,-90 L20,-90 M-36,-70 L28,-70" stroke="#9aa0b4" stroke-width="6" stroke-linecap="round"/><rect x="-36" y="-50" width="72" height="30" fill="#e0262b"/></g>`,
    tablet: () => `<g transform="translate(0,-26) rotate(-4)"><rect x="-86" y="-112" width="172" height="118" rx="12" fill="${INK}" ${st}/><rect x="-74" y="-100" width="148" height="94" rx="4" fill="#0f3b24"/><path d="M-62,-26 L-30,-52 L-6,-40 L26,-74 L60,-88" fill="none" stroke="#46e08a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    mug: (o) => `<g transform="translate(0,-14)"><rect x="-26" y="-62" width="52" height="60" rx="8" fill="${o.color || "#f6f1e4"}" ${st}/><path d="M26,-48 Q52,-46 50,-28 Q48,-12 26,-14" fill="none" ${st}/></g>`,
    stamp: () => `<g transform="translate(0,-8)"><rect x="-22" y="-150" width="44" height="74" rx="20" fill="#8a5a3c" ${st}/><rect x="-62" y="-80" width="124" height="46" rx="8" fill="#e0262b" ${st}/><rect x="-70" y="-38" width="140" height="22" rx="6" fill="${INK}"/></g>`,
    cash: () => `<g transform="translate(0,-16)"><rect x="-58" y="-70" width="116" height="62" rx="6" fill="#1fa85b" ${st}/><circle cx="0" cy="-39" r="17" fill="#bfe8cf" ${st}/></g>`,
    wallet: () => `<g transform="translate(0,-14) rotate(-8)"><rect x="-40" y="-104" width="84" height="50" rx="4" fill="#1fa85b" ${st}/><rect x="-62" y="-78" width="124" height="80" rx="12" fill="#8a5a3c" ${st}/><path d="M-62,-44 L62,-44" ${st}/><circle cx="40" cy="-30" r="8" fill="#f0b429" ${st}/></g>`,
    // { prop:"tag", tag:"$52" }: a price tag on a string
    tag: (o) => `<g transform="translate(18,-30) rotate(10)"><path d="M-70,-110 L60,-110 L96,-66 L60,-22 L-70,-22Z" fill="#f6f1e4" ${st}/><circle cx="62" cy="-66" r="9" fill="${INK}"/>${txt(-14, -46, o.tag || "$", 54, "#e0262b")}</g>`,
    pen: () => `<g transform="translate(0,-10) rotate(34)"><rect x="-17" y="-250" width="34" height="230" rx="8" fill="#e0262b" ${st}/><path d="M-17,-20 L17,-20 L0,22Z" fill="#f6f1e4" ${st}/><rect x="-17" y="-250" width="34" height="42" rx="8" fill="${INK}"/></g>`,
    // { prop:"placard", sign:"SELL" }: a board on a stick
    placard: (o) => `<g transform="translate(0,-10)"><rect x="-9" y="-150" width="18" height="150" fill="#8a5a3c" ${st}/><g transform="rotate(-4 0 -230)"><rect x="-130" y="-310" width="260" height="170" rx="6" fill="${o.signColor || "#f6f1e4"}" ${st}/>${txt(0, -198, o.sign || "", Math.min(84, 420 / Math.max(3, String(o.sign || "").length)))}</g></g>`,
    briefcase: () => `<g transform="translate(0,34)"><path d="M-30,-96 L-30,-118 L30,-118 L30,-96" fill="none" ${st}/><rect x="-78" y="-98" width="156" height="104" rx="12" fill="#8a5a3c" ${st}/><path d="M-78,-52 L78,-52" ${st}/><rect x="-14" y="-64" width="28" height="24" rx="5" fill="#f0b429" ${st}/></g>`,
    magnifier: () => `<g transform="translate(0,-20) rotate(-24)"><rect x="-10" y="-70" width="20" height="96" rx="8" fill="#8a5a3c" ${st}/><circle cx="0" cy="-120" r="58" fill="rgba(191,224,234,.75)" ${st}/><path d="M-26,-146 Q-6,-166 20,-158" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g>`,
  };

  /* ---- living things: a company, a market, a building or a banknote with a face and gloves ----
     No logos: a generic shape plus a written label. Each entry returns the body (origin = the middle of its base on the floor),
     where the face goes [x, y, scale], its half-width and height (for the hands), the colour behind the face,
     and whether it stands on shoes ("feet") or sits on the ground or hovers. */
  const rc = (x, y, w, h, fill, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${fill}" ${st}/>`;
  const lab = (o, y, w, max, fill) => (o.label ? txt(0, y, o.label, Math.min(max || 44, (w * 3.6) / Math.max(4, String(o.label).length)), fill) : "");
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
    // a banknote: "your hundred dollars", the dollar, a paycheque
    note(o) { const c = o.color || "#cfe6c8"; return { w: 210, h: 330, hover: 1, face: [0, -206, 0.6], skin: "#bfe8cf",
      body: rc(-214, -318, 428, 228, c, 8) + `<rect x="-194" y="-298" width="388" height="188" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-204" rx="92" ry="88" fill="#bfe8cf" ${st}/>` +
        (o.label ? txt(-150, -186, o.label, 46) + txt(150, -186, o.label, 46) : "") }; },
  };

  // { hat: "party" | "crown" | "hardhat" }
  const HATS = {
    party: (y) => `<path d="M-64,${y - 548} L8,${y - 720} L84,${y - 548}Z" fill="#7fd0f0" ${st}/><path d="M-36,${y - 612} L52,${y - 596} M-12,${y - 668} L30,${y - 660}" stroke="#e0262b" stroke-width="10" stroke-linecap="round"/><circle cx="8" cy="${y - 724}" r="18" fill="#e0262b" ${st}/>`,
    crown: (y) => `<path d="M-104,${y - 548} L-112,${y - 660} L-56,${y - 606} L0,${y - 690} L56,${y - 606} L112,${y - 660} L104,${y - 548}Z" fill="#f0b429" ${st}/><circle cx="0" cy="${y - 586}" r="12" fill="#e0262b" ${st}/>`,
    hardhat: (y) => `<path d="M-146,${y - 520} Q-150,${y - 660} 0,${y - 660} Q150,${y - 660} 146,${y - 520}Z" fill="#f0b429" ${st}/><rect x="-172" y="${y - 536}" width="344" height="28" rx="12" fill="#f0b429" ${st}/>`,
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
    const a = { el: g, spec: T, head: q(".head"), torso: q(".torso"), hl: q(".hl"), hr: q(".hr"), mouth: {}, eyes: {}, blink: qa(".e-blink"),
      brows: qa(".brow"), pupils: qa(".pupil"), sweat: q(".sweat"), tear: q(".tear"), face: "neutral", pose: "rest", hk: [(T.w + 44) / 160, (T.h + lift * -1) / 580, lift] };
    Object.keys(MOUTHS).forEach((k) => { a.mouth[k] = q(".m-" + k); });
    ["open", "wide", "half", "happy"].forEach((k) => { a.eyes[k] = qa(".e-" + k); });
    return a;
  }

  // Mirrored figures keep their text readable.
  function unflip(a) { a.el.querySelectorAll(".txt").forEach((e) => e.setAttribute("transform", e.getAttribute("transform") + " scale(-1,1)")); }

  function make(who, o) {
    o = o || {};
    if (o.thing && THINGS[o.thing]) return makeThing(o);
    const c = Object.assign({}, typeof who === "string" ? (CAST[who] || extra(who.length)) : who, o.style || {});
    const B = BUILD[c.build || "normal"], hy = B.head, dk = shade(c.top, 0.22);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "actor cut");
    const eyeL = eye(-62, hy, (c.extras || []).includes("heavy_brows")), eyeR = eye(62, hy, (c.extras || []).includes("heavy_brows"));
    const mouths = Object.keys(MOUTHS).map((k) => `<g class="m-${k}">${MOUTHS[k]}</g>`).join("");
    const prop = o.prop && PROPS[o.prop] ? `<g class="prop">${PROPS[o.prop](o)}</g>` : "";
    g.innerHTML = (`
      <ellipse cx="0" cy="4" rx="150" ry="20" fill="rgba(15,18,40,.25)"/>
      <g class="torso">
        <rect x="-70" y="-84" width="56" height="74" rx="14" fill="${c.legs}" ${st}/><rect x="14" y="-84" width="56" height="74" rx="14" fill="${c.legs}" ${st}/>
        <rect x="-92" y="-30" width="84" height="32" rx="15" fill="${c.shoes}" ${st}/><rect x="8" y="-30" width="84" height="32" rx="15" fill="${c.shoes}" ${st}/>
        <path d="M${-B.tw},${B.top} Q0,${B.top - 24} ${B.tw},${B.top} L${B.bw},-98 Q${B.bw},-70 ${B.bw - 26},-70 L${-B.bw + 26},-70 Q${-B.bw},-70 ${-B.bw},-98Z" fill="${c.top}" ${st}/>
        <path d="M${B.bw - 44},-74 L${B.bw - 26},-74 Q${B.bw - 4},-76 ${B.bw - 4},-98 L${B.tw + 0},${B.top + 12} Q${B.tw + 6},-180 ${B.bw - 44},-74Z" fill="${dk}" opacity=".55"/>
        ${clothes(c, B)}
        ${o.badge != null ? `<g transform="translate(${B.tw - 26},${B.top + 104})"><circle r="40" fill="#f0b429" ${st}/>${txt(0, 15, o.badge, 44)}</g>` : ""}
      </g>
      <g class="head">
        ${c.topStyle === "hoodie" ? `<ellipse cx="0" cy="${B.top + 2}" rx="${B.tw + 22}" ry="34" fill="${dk}" ${st}/>` : ""}
        <circle cx="-150" cy="${-420 + hy}" r="24" fill="${c.skin}" ${st}/><circle cx="150" cy="${-420 + hy}" r="24" fill="${c.skin}" ${st}/>
        <rect x="-150" y="${-562 + hy}" width="300" height="262" rx="84" fill="${c.skin}" ${st}/>
        <path d="M92,${-308 + hy} Q150,${-312 + hy} 146,${-390 + hy} L146,${-470 + hy} Q136,${-330 + hy} 20,${-304 + hy}Z" fill="${shade(c.skin, 0.2)}" opacity=".5"/>
        ${hair(c, hy)}${o.hat && HATS[o.hat] ? HATS[o.hat](hy) : ""}
        <g class="face">${eyeL}${eyeR}
          <path d="M-6,${-404 + hy} Q10,${-392 + hy} -4,${-384 + hy}" fill="none" ${st}/>
          <g class="mouth" transform="translate(0,${-346 + hy})">${mouths}</g>
          <path class="sweat" d="M118,${-520 + hy} Q98,${-486 + hy} 118,${-474 + hy} Q138,${-486 + hy} 118,${-520 + hy}Z" fill="#7fd0f0" ${st}/>
          <path class="tear" d="M-62,${-398 + hy} Q-78,${-370 + hy} -62,${-360 + hy} Q-46,${-370 + hy} -62,${-398 + hy}Z" fill="#7fd0f0" ${st}/>
          ${extras(c, hy)}
        </g>
      </g>
      <g class="hand hl"><circle r="36" fill="${c.skin}" ${st}/></g>
      <g class="hand hr">${prop}<circle r="36" fill="${c.skin}" ${st}/></g>`).replace(/SKIN/g, c.skin);
    const q = (s) => g.querySelector(s), qa = (s) => Array.from(g.querySelectorAll(s));
    const a = { el: g, spec: c, head: q(".head"), torso: q(".torso"), hl: q(".hl"), hr: q(".hr"), mouth: {}, eyes: {}, blink: qa(".e-blink"),
      brows: qa(".brow"), pupils: qa(".pupil"), sweat: q(".sweat"), tear: q(".tear"), face: "neutral", pose: "rest", neck: B.top, hk: [1, 1, 0] };
    Object.keys(MOUTHS).forEach((k) => { a.mouth[k] = q(".m-" + k); });
    ["open", "wide", "half", "happy"].forEach((k) => { a.eyes[k] = qa(".e-" + k); });
    return a;
  }

  const vis = (els, on) => [].concat(els).forEach((e) => { e.style.opacity = on ? 1 : 0; });

  // Initial state, set directly on the elements (the timeline then changes it at cue times).
  function init(a, face, pose, look) {
    const f = FACES[face] || FACES.neutral, p = POSES[pose] || POSES.rest;
    a.face = face in FACES ? face : "neutral"; a.pose = pose in POSES ? pose : "rest";
    Object.keys(a.mouth).forEach((k) => vis(a.mouth[k], k === f.mouth));
    Object.keys(a.eyes).forEach((k) => vis(a.eyes[k], k === f.eyes));
    vis(a.blink, false); vis(a.sweat, !!f.sweat); vis(a.tear, !!f.tear);
    gsap.set(a.brows[0], { rotation: f.brows[0], y: f.brows[2], transformOrigin: "50% 50%" });
    gsap.set(a.brows[1], { rotation: f.brows[1], y: f.brows[3], transformOrigin: "50% 50%" });
    gsap.set(a.pupils, { x: look === "left" ? -9 : look === "right" ? 9 : 0, y: look === "up" ? -8 : look === "down" ? 8 : 0 });
    const [kx, ky, lift] = a.hk; // things are wider or shorter than people: scale the hand targets to their size
    gsap.set(a.hl, { x: p[0] * kx, y: p[1] * ky + lift }); gsap.set(a.hr, { x: p[2] * kx, y: p[3] * ky + lift });
    // Fix the pivots before anything moves; changing a pivot later makes GSAP shift the element to compensate.
    gsap.set([a.el, a.head, a.torso], { transformOrigin: "50% 100%", smoothOrigin: false });
  }

  // Change expression at time t (snap for parts, quick tween for brows).
  function face(tl, a, name, t) {
    const f = FACES[name]; if (!f) return;
    Object.keys(a.mouth).forEach((k) => tl.set(a.mouth[k], { opacity: k === f.mouth ? 1 : 0 }, t));
    Object.keys(a.eyes).forEach((k) => tl.set(a.eyes[k], { opacity: k === f.eyes ? 1 : 0 }, t));
    tl.set(a.sweat, { opacity: f.sweat ? 1 : 0 }, t); tl.set(a.tear, { opacity: f.tear ? 1 : 0 }, t);
    tl.to(a.brows[0], { rotation: f.brows[0], y: f.brows[2], duration: 0.12 }, t);
    tl.to(a.brows[1], { rotation: f.brows[1], y: f.brows[3], duration: 0.12 }, t);
    tl.fromTo(a.head, { scale: 1 }, { scale: 1.06, duration: 0.09, yoyo: true, repeat: 1, immediateRender: false }, t);
    a.face = name;
  }

  function pose(tl, a, name, t) {
    const p = POSES[name]; if (!p) return;
    const [kx, ky, lift] = a.hk;
    tl.to(a.hl, { x: p[0] * kx, y: p[1] * ky + lift, duration: 0.28, ease: "back.out(1.7)" }, t);
    tl.to(a.hr, { x: p[2] * kx, y: p[3] * ky + lift, duration: 0.28, ease: "back.out(1.7)" }, t);
    a.pose = name;
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
    const base = (FACES[a.face] || FACES.neutral).mouth, keys = Object.keys(a.mouth);
    const setM = (k, t) => keys.forEach((m) => tl.set(a.mouth[m], { opacity: m === k ? 1 : 0 }, t));
    visemes(text, t0, d).forEach(([t, k]) => setM(k, t));
    setM(base, t0 + d + 0.02);
    tl.fromTo(a.head, { y: 0 }, { y: -12, duration: 0.13, yoyo: true, repeat: Math.max(1, Math.floor(d / 0.26) * 2 - 1), ease: "sine.inOut", immediateRender: false }, t0);
    tl.fromTo(a.hr, { rotation: 0 }, { rotation: -10, duration: 0.2, yoyo: true, repeat: Math.max(1, Math.floor(d / 0.4) * 2 - 1), ease: "sine.inOut", immediateRender: false }, t0);
  }

  // Life between lines: blinks and a slow breath, on a fixed schedule per figure.
  function idle(tl, a, t0, t1, seed) {
    for (let t = t0 + 1.1 + (seed % 5) * 0.37; t < t1 - 0.2; t += 2.9 + (seed % 3) * 0.6) { tl.set(a.blink, { opacity: 1 }, t); tl.set(a.blink, { opacity: 0 }, t + 0.11); }
    const n = Math.max(1, Math.floor((t1 - t0) / 1.3));
    tl.fromTo(a.torso, { scaleY: 1 }, { scaleY: 1.022, duration: 1.3, yoyo: true, repeat: n, ease: "sine.inOut", immediateRender: false }, t0);
  }

  const ENTER = { pop: { scale: 0.4, opacity: 0 }, slide_left: { x: -900 }, slide_right: { x: 900 }, rise: { y: 700 }, none: null };
  function enter(tl, a, how, t) {
    const from = ENTER[how === undefined ? "pop" : how]; if (!from) return;
    tl.fromTo(a.el, Object.assign({ x: 0, y: 0, scale: 1, opacity: 1 }, from), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.5)", immediateRender: false }, t);
  }

  window.Rig = { CAST, FACES, POSES, PROPS, PROP_POSE, THINGS, HATS, make, init, face, pose, talk, idle, enter, extra, shade, unflip, INK };
})();
