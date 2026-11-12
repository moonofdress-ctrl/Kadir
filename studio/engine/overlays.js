/* Screen overlays (HTML, not moved by the camera): counters, slams, labels, stamps, tags, lower thirds,
   calendar pages, the clock, document and post cards. Each has build(o) -> element and play(tl, el, o, t, ctx). */
(function () {
  "use strict";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const el = (cls, html) => { const e = document.createElement("div"); e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const place = (e, o, def) => { if (o.x != null) { e.style.left = o.x + "px"; e.style.top = (o.y || 0) + "px"; } else e.classList.add("pos-" + (o.pos || def)); return e; };
  const fmt = (v, dec) => v.toLocaleString("en-US", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  const slam = (tl, e, t, big) => { e.style.opacity = 0; tl.fromTo(e, { opacity: 0, scale: big ? 1.7 : 1.3 }, { opacity: 1, scale: 1, duration: big ? 0.16 : 0.22, ease: big ? "power4.in" : "back.out(1.8)", immediateRender: false }, t); };
  const shake = (tl, world, t) => { if (world) tl.fromTo(world, { x: 0 }, { x: 12, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, t); };

  const O = {
    // { type:"counter", from, to, prefix, suffix, decimals, dur, tone, cap, pos, plate }  plate:true puts a dark halo behind it, for busy backgrounds
    // (the same option works on a slam)
    counter: {
      build(o) { return place(el("counter " + (o.tone || "") + (o.plate ? " plate" : ""), `${esc(o.prefix || "")}<span class="num">${fmt(o.from || 0, o.decimals)}</span>${esc(o.suffix || "")}${o.cap ? `<span class="cap">${esc(o.cap)}</span>` : ""}`), o, "tr"); },
      // No callbacks here: a seek does not fire onUpdate, so the number is tweened as a property and formatted by a modifier.
      play(tl, e, o, t) { const num = e.querySelector(".num"); slam(tl, e, t);
        tl.fromTo(num, { textContent: o.from || 0 }, { textContent: o.to, duration: o.dur || 1.2, ease: "power2.out", immediateRender: false, modifiers: { textContent: (v) => fmt(parseFloat(v), o.decimals) } }, t + 0.1);
        tl.fromTo(e, { scale: 1 }, { scale: 1.12, duration: 0.1, yoyo: true, repeat: 1, immediateRender: false }, t + 0.1 + (o.dur || 1.2)); },
    },
    slam: { build(o) { return place(el("slam " + (o.tone || "") + (o.plate ? " plate" : ""), esc(o.t)), o, "tc"); }, play(tl, e, o, t, ctx) { slam(tl, e, t, true); shake(tl, ctx.world, t + 0.16); } },
    label: { build(o) { return place(el("label", esc(o.t)), o, "bl"); }, play(tl, e, o, t) { slam(tl, e, t); } },
    stamp: { build(o) { return place(el("stamp", esc(o.t)), o, "tr"); }, play(tl, e, o, t, ctx) { e.style.opacity = 0;
      tl.fromTo(e, { opacity: 0, scale: 2.2, rotation: -24 }, { opacity: 1, scale: 1, rotation: -9, duration: 0.14, ease: "power4.in", immediateRender: false }, t); shake(tl, ctx.world, t + 0.14); } },
    tag: { build(o) { return place(el("tag " + (o.tone || ""), esc(o.t)), o, "bl"); }, play(tl, e, o, t) { e.style.opacity = 0; tl.fromTo(e, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.2, immediateRender: false }, t); } },
    source: { build(o) { return el("source", "Source: " + esc(o.t)); }, play(tl, e, o, t) { e.style.opacity = 0; tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t); } },
    sfx: { build(o) { return place(el("sfx", esc(o.t)), o, "mc"); }, play(tl, e, o, t) { slam(tl, e, t, true); tl.to(e, { opacity: 0, duration: 0.2 }, t + 0.8); } },

    // { type:"lower_third", name, role, side }
    lower_third: {
      build(o) { return el("l3" + (o.side === "right" ? " right" : ""), `<div class="nm">${esc(o.name)}</div>${o.role ? `<div class="rl">${esc(o.role)}</div>` : ""}`); },
      play(tl, e, o, t) { const k = o.side === "right" ? 1 : -1; e.style.opacity = 0;
        tl.fromTo(e, { opacity: 0, x: 80 * k }, { opacity: 1, x: 0, duration: 0.24, ease: "power3.out", immediateRender: false }, t); },
    },

    // { type:"calendar", month, day, dow, from:{month, day}, pos }: with `from`, the old page drops away to show the new date
    calendar: {
      build(o) { const page = (p, cls) => `<div class="pg ${cls}"><div class="mo">${esc(p.month)}</div><div class="dy">${esc(p.day)}</div>${p.dow ? `<div class="dw">${esc(p.dow)}</div>` : ""}</div>`;
        const e = place(el("cal", page(o, "new") + (o.from ? page(o.from, "old") : "")), o, "tr");
        e.setAttribute("data-layout-allow-overlap", ""); // the old page covers the new one until it drops away
        const old = e.querySelector(".old"); if (old) Object.assign(old.style, { position: "absolute", left: "-7px", top: "-7px", right: "-7px", background: "#f6f1e4", border: "7px solid #1b1d36", transformOrigin: "50% 0" });
        return e; },
      play(tl, e, o, t) { slam(tl, e, t); const old = e.querySelector(".old");
        if (old) tl.fromTo(old, { y: 0, rotation: 0, opacity: 1 }, { y: 520, rotation: 28, opacity: 0, duration: 0.5, ease: "power2.in", immediateRender: false }, t + (o.flipAt || 0.7)); },
    },

    // { type:"clock", t:"9:30", ap:"AM", tz:"ET" }: keep it in every shot of a by-the-clock chapter
    clock: {
      build(o) { const m = /(\d+):(\d+)/.exec(o.t) || [0, 12, 0], h = +m[1] % 12, mi = +m[2];
        return el("clock", `<div class="face"><div class="hh" style="transform:rotate(${h * 30 + mi / 2}deg)"></div><div class="mh" style="transform:rotate(${mi * 6}deg)"></div></div><div class="tm">${esc(o.t)}${o.ap ? " " + esc(o.ap) : ""}</div><div class="tz">${esc(o.tz || "ET")}</div>`); },
      play(tl, e, o, t) { if (o.pulse === false) return; tl.fromTo(e, { scale: 1 }, { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: "0 0", immediateRender: false }, t + 0.05); },
    },

    // { type:"doc", source, date, by, quote, hl:["exact words to highlight"], x, y, w } and { type:"post", name, handle, text, date }
    doc: {
      build(o) { const post = o.type === "post", text = post ? o.text : o.quote, hl = (o.hl || []).map((h) => h.toLowerCase().split(/\s+/));
        const ws = text.split(/\s+/), mark = ws.map(() => false), norm = (w) => w.toLowerCase().replace(/[^a-z0-9$%'-]/g, "");
        hl.forEach((ph) => { for (let i = 0; i + ph.length <= ws.length; i++) if (ph.every((p, j) => norm(ws[i + j]) === norm(p))) for (let j = 0; j < ph.length; j++) mark[i + j] = true; });
        const body = ws.map((w, i) => `<span class="w${mark[i] ? " hl" : ""}">${mark[i] ? '<i class="bar"></i>' : ""}${esc(w)}</span>`).join(" ");
        const head = `<div class="hd"><span>${esc(o.source || (post ? "POST" : "DOCUMENT"))}</span><span>${esc(o.date || "")}</span></div>`;
        const e = el("doc" + (post ? " post" : ""), head + (post ? `<div class="who"><div class="av"></div><div><div class="nm">${esc(o.name)}</div><div class="hn">${esc(o.handle || "")}</div></div></div>` : (o.by ? `<div class="by">${esc(o.by)}</div>` : "")) +
          `<div class="q">${post ? "" : "“"}${body}${post ? "" : "”"}</div><div class="rule"></div><div class="rule s"></div>`);
        // x: centre of the card, y: its top, w: its width; so a figure can stand beside the card, not under it
        if (o.x != null) e.style.left = o.x + "px"; if (o.y != null) e.style.top = o.y + "px"; if (o.w) { e.style.width = o.w + "px"; e.style.marginLeft = -o.w / 2 + "px"; }
        return e; },
      play(tl, e, o, t, ctx) { e.style.opacity = 0;
        tl.fromTo(e, { opacity: 0, y: 260, rotation: 3 }, { opacity: 1, y: 0, rotation: -1.2, duration: 0.34, ease: "back.out(1.3)", immediateRender: false }, t);
        const bars = e.querySelectorAll(".bar"), t1 = t + (o.hlAt != null ? o.hlAt : 0.9);
        bars.forEach((b, i) => tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "none", immediateRender: false }, t1 + i * 0.14));
        if (o.type === "post") { const ws = e.querySelectorAll(".q .w"), d = Math.min(o.dur || 2, Math.max(0.6, ctx.t1 - t - 0.6));
          ws.forEach((w, i) => { w.style.opacity = 0; tl.set(w, { opacity: 1 }, t + 0.35 + (i / ws.length) * d); }); } },
    },
  };
  O.post = O.doc;

  window.Overlays = O;
})();
