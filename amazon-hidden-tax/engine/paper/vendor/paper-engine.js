/* Paper Trail engine: builds all six scenes from the scene JSON and the timeline.
   Deterministic and seek-safe: only opacity / x / y / scale / rotation tweens,
   no clocks, no randomness outside the seeded generator. */
(function () {
  "use strict";
  const COL = { amazon: "#c8102e", seller: "#2f6b4f", supplier: "#4a463d", loss: "#8a6d3b" };
  let tl;

  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function px(e, o) { for (const k in o) e.style[k] = typeof o[k] === "number" ? o[k] + "px" : o[k]; return e; }
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function money(v) { const a = Math.abs(v); const s = "$" + (Math.round(a * 100) % 100 === 0 ? Math.round(a) : a.toFixed(2)); return v < 0 ? "−" + s : s; }
  function unit(v, u) { const n = Math.round(v * 10) % 10 === 0 ? Math.round(v) : v.toFixed(1); return u === "%" ? n + "%" : u === "$" ? money(v) : String(n); }

  /* show e during [t0, t1); t1 null = stay */
  function win(e, t0, t1, o) {
    o = o || {}; e.style.opacity = 0;
    tl.fromTo(e, { opacity: 0, y: o.y == null ? 24 : o.y }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, t0);
    if (t1 != null) tl.to(e, { opacity: 0, duration: 0.2, ease: "none" }, t1 - 0.2);
  }
  function slam(e, t0, t1, to) {
    e.style.opacity = 0;
    tl.fromTo(e, { opacity: 0, scale: 1.5 }, { opacity: to || 1, scale: 1, duration: 0.18, ease: "power4.in" }, t0);
    if (t1 != null) tl.to(e, { opacity: 0, duration: 0.15, ease: "none" }, t1 - 0.15);
  }
  function at(e, t, vars) { tl.set(e, vars, t); }
  const end = (ts) => ts.start + ts.duration;

  function chrome(sc, data, T, stripPos) {
    el("div", "part-chip", sc, "PART " + data.part + "/6 · " + esc(data.tag));
  }
  function finish(sc) { el("div", "grain", sc); el("div", "vignette", sc); }

  function kinetic(sc, lines, tEnd) {
    lines.forEach((ln, i) => {
      const t0 = ln.t, t1 = i < lines.length - 1 ? lines[i + 1].t : tEnd;
      const w = el("div", "kin-wrap", sc);
      const n = ln.big.length, size = n <= 5 ? 360 : n <= 9 ? 250 : n <= 13 ? 190 : 150;
      px(el("div", "b", w, esc(ln.big)), { top: 560 - size, fontSize: size });
      if (ln.small) el("div", "s", w, "<span>" + esc(ln.small) + "</span>");
      slam(w, t0, t1);
    });
  }

  function receipt(sc, title, sub, rows, tIn) {
    const wrap = el("div", "rc-wrap", sc), r = el("div", "receipt fixed", wrap);
    el("div", "tex", r);
    el("div", "rc-h", r, esc(title)); el("div", "rc-sub", r, esc(sub)); el("div", "rc-hr", r);
    rows.forEach((row) => {
      if (row.hr) { el("div", "rc-hr", r); return; }
      const d = el("div", "rc-l " + (row.cls || ""), r, "<span>" + esc(row.l) + "</span><span>" + esc(row.r) + "</span>");
      d.style.opacity = 0; at(d, row.t, { opacity: 1 });
    });
    tl.fromTo(r, { y: 1000 }, { y: 0, duration: 0.6, ease: "power3.out" }, tIn);
    return r;
  }

  function bars(sc, st, ts, title, keep) {
    const sh = el("div", "sheet", sc); el("div", "tex", sh);
    el("div", "ttl", sh, esc(title));
    if (st.estimate || st.illustrative) el("div", "flag", sh, st.estimate ? "INDUSTRY ESTIMATE" : "ILLUSTRATIVE");
    const mx = Math.max(st.leftVal, st.rightVal) || 1, MAXW = 1040;
    [[st.leftVal, st.leftText, st.leftTo || "amazon", 130], [st.rightVal, st.rightText, st.rightTo || "seller", 340]].forEach((r, j) => {
      const w = Math.max(16, r[0] / mx * MAXW), c = COL[r[2]] || COL.supplier;
      px(el("div", "rl", sh, esc(r[1])), { top: r[3] });
      const b = px(el("div", "rb", sh), { top: r[3] + 54, width: w }); b.style.background = c;
      tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" }, ts.start + 0.9 + j * 0.5);
      const n = px(el("div", "rn", sh, esc(unit(r[0], st.unit || ""))), { left: 60 + w + 24, top: r[3] + 54 }); n.style.color = c;
      n.style.opacity = 0; tl.fromTo(n, { opacity: 0 }, { opacity: 1, duration: 0.2 }, ts.start + 1.5 + j * 0.5);
    });
    win(sh, ts.start + 0.3, keep ? null : end(ts));
    return sh;
  }

  function stamp(sc, text, small, pos, t0, t1) {
    const s = px(el("div", "stamp", sc, esc(text) + "<small>" + esc(small) + "</small>"), pos);
    slam(s, t0, t1, 0.92);
    return s;
  }
  function card(sc, cls, pos, k, v, d, rot) {
    const c = px(el("div", "pcard " + (cls || ""), sc), pos);
    c.innerHTML = (k ? '<div class="k">' + esc(k) + "</div>" : "") + (v ? '<div class="v">' + esc(v) + "</div>" : "") + (d ? '<div class="d">' + esc(d) + "</div>" : "");
    if (rot) c.style.transform = "rotate(" + rot + "deg)";
    return c;
  }

  function picture(sc, src, pos, t0, t1, zoom) {
    const im = px(el("img", "aiimg", sc), pos); im.src = "assets/ai/" + src; im.style.opacity = 0;
    at(im, t0, { opacity: 1 }); if (t1 != null) at(im, t1, { opacity: 0 });
    if (zoom) tl.fromTo(im, { scale: 1 }, { scale: zoom, duration: (t1 || t0 + 20) - t0, ease: "none", immediateRender: false }, t0);
    return im;
  }

  /* ---------- scene 1: hook + receipt + scissors ---------- */
  function scene1(sc, data, T, X) {
    const S = T.steps, hookEnd = S[1].start;
    const bg = el("div", "bgk kraft", sc); bg.style.opacity = 0; at(bg, hookEnd, { opacity: 1 });
    const gr = el("div", "grade", sc); at(gr, hookEnd, { opacity: 0 });
    data.steps[0]._nocap = true;
    kinetic(sc, X.kinetic["1-1"], hookEnd);
    const c = (i, k) => S[i].cues[k];
    receipt(sc, "*** CHECKOUT ***", "per $100 of seller sales · model", [
      { l: "SALE", r: "$100.00", t: c(1, "sale") }, { l: "PRODUCT+FREIGHT", r: "-28.00", t: c(1, "line") },
      { l: "REFERRAL FEE 17%", r: "-17.00", cls: "amz", t: c(2, "line") }, { l: "FBA + STORAGE", r: "-20.00", cls: "amz", t: c(3, "line") },
      { l: "SPONSORED ADS", r: "-15.00", cls: "amz", t: c(4, "line") }, { l: "RETURNS", r: "-10.00", t: c(5, "line") }, { hr: 1 },
      { l: "AMAZON TOOK", r: "$52.00", cls: "tot amz", t: c(6, "took") }, { l: "YOU KEEP", r: "$10.00", cls: "tot keep", t: c(6, "keep") },
    ], hookEnd + 0.1);
    const bill = el("div", "bill-area", sc); bill.style.opacity = 0;
    tl.fromTo(bill, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, hookEnd + 0.5);
    const parts = [{ w: .28, to: "sup", t: c(1, "line") }, { w: .17, to: "amz", t: c(2, "line") }, { w: .20, to: "amz", t: c(3, "line") },
      { w: .15, to: "amz", t: c(4, "line") }, { w: .10, to: "loss", t: c(5, "line") }, { w: .10, to: "you", t: c(6, "keep") }];
    const scs = el("div", "scissors-holder", sc);
    scs.innerHTML = '<svg class="scissors" id="sc1" viewBox="0 0 110 110"><g fill="none" stroke="#1b1a17" stroke-width="7" stroke-linecap="round"><path d="M55 8 L40 70"/><path d="M55 8 L70 70"/></g><circle cx="36" cy="86" r="16" fill="none" stroke="#c8102e" stroke-width="8"/><circle cx="74" cy="86" r="16" fill="none" stroke="#c8102e" stroke-width="8"/><circle cx="55" cy="48" r="5" fill="#1b1a17"/></svg>';
    const sci = scs.firstChild;
    let x = 0, amz = 0; const destX = { you: 0, sup: 190, loss: 500 };
    parts.forEach((p, i) => {
      const w = Math.round(p.w * 960), d = el("div", "slice", bill);
      px(d, { left: x, width: w });
      d.innerHTML = '<svg width="960" height="410" style="left:' + (-x) + 'px"><use href="#bill-art"/></svg><div class="tint"></div>';
      if (i < 5) {
        tl.fromTo(sci, { x: 840 + x + w, y: 120, opacity: 1 }, { x: 840 + x + w, y: 600, opacity: 1, duration: 0.3, ease: "none", immediateRender: false }, p.t - 0.32);
        tl.to(sci, { opacity: 0, duration: 0.1 }, p.t + 0.02);
      }
      let tx, ty = 40, rot = 0;
      if (p.to === "amz") { tx = 640 + amz * 18; ty = 20 + amz * 22; rot = -5 + amz * 4; amz++; }
      else { tx = destX[p.to]; ty = p.to === "loss" ? 80 : 40; rot = p.to === "loss" ? 9 : p.to === "sup" ? -2 : 0; }
      tl.to(d, { x: tx - x, y: ty, rotation: rot, duration: 0.5, ease: "power3.out" }, p.t);
      if (p.to === "amz") tl.to(d.querySelector(".tint"), { opacity: 0.55, duration: 0.3 }, p.t + 0.1);
      if (p.to === "loss") tl.to(d, { opacity: 0.4, duration: 0.4 }, p.t + 0.3);
      x += w;
    });
    const lab = (html, pos, color, t0, t1, size) => { const l = px(el("div", "pile-label", sc, html), pos); l.style.color = color; if (size) l.style.fontSize = size + "px"; slam(l, t0, t1); };
    lab("FACTORY $28<small>PRODUCT + FREIGHT</small>", { left: 1030, top: 650 }, "#4a463d", c(1, "line") + 0.6, null, 46);
    lab("AMAZON $17<small>REFERRAL FEE</small>", { left: 1480, top: 690 }, COL.amazon, c(2, "line") + 0.5, c(3, "line") + 0.5);
    lab("AMAZON $37<small>+ FULFILLMENT</small>", { left: 1480, top: 690 }, COL.amazon, c(3, "line") + 0.5, c(4, "line") + 0.5);
    lab("AMAZON $52<small>REFERRAL + FBA + ADS</small>", { left: 1480, top: 690 }, COL.amazon, c(4, "line") + 0.5, null);
    lab("YOU<br>$10<small>SELLER KEEPS</small>", { left: 800, top: 650 }, COL.seller, c(6, "keep") + 0.5, null);
    chrome(sc, data, T, { left: 800, bottom: 40, maxWidth: "1040px" });
    finish(sc);
  }

  /* ---------- scene 2: 10-K kinetic + 3D ad auction ---------- */
  function scene2(sc, data, T, X) {
    const S = T.steps, kEnd = S[1].start;
    const wrap = el("div", "bgk", sc); wrap.id = "three-wrap"; wrap.style.opacity = 0; at(wrap, kEnd, { opacity: 1 });
    const canvas = el("canvas", "", wrap); canvas.id = "three"; canvas.width = 1920; canvas.height = 1080;
    const over = el("div", "paper-over", sc); over.style.opacity = 0; at(over, kEnd, { opacity: 0.35 });
    const gr = el("div", "grade", sc); at(gr, kEnd, { opacity: 0 });
    data.steps[0]._nocap = true;
    kinetic(sc, X.kinetic["2-1"], kEnd);
    const render = X.toll(canvas), state = { p: 0, shot: 0 };
    render(0);
    tl.fromTo(state, { p: 0 }, { p: 1, duration: T.start + T.duration - kEnd, ease: "none", onUpdate: () => { const t = tl.time(); let sh = 0; for (let k = 2; k <= 4; k++) if (t >= S[k].start) sh = k - 1; render(state.p, sh); } }, kEnd);
    data.steps.forEach((st, i) => {
      if (i === 0) return;
      const v = card(sc, "valcard" + (st.accent === "loss" ? " red" : ""), { left: 60, top: 110 }, "", st.val, "", -1.5);
      win(v, S[i].start + 0.3, i === data.steps.length - 1 ? null : end(S[i]));
    });
    stamp(sc, "ALLEGED", "FTC + 22 STATES · NOT A RULING", { left: 1220, top: 150, background: "#faf7ef", filter: "none" }, S[3].cues.stamp, end(S[3]));
    chrome(sc, data, T, { left: 60, bottom: 50, maxWidth: "1300px" });
    finish(sc);
  }

  /* ---------- scene 3: evidence desk ---------- */
  function scene3(sc, data, T) {
    const S = T.steps, c = S[1].cues;
    el("div", "bgk desk", sc);
    bars(sc, data.steps[0], S[0], "SAME DRESS, TWO PRICES");
    const cam = el("div", "cam", sc); cam.style.opacity = 0;
    at(cam, S[1].start, { opacity: 1 }); at(cam, end(S[1]), { opacity: 0 });
    const doc = el("div", "doc", cam); el("div", "tex", doc);
    const hl = (pos) => { const h = px(el("div", "hl", doc), pos); return h; };
    const h1 = hl({ left: 437, top: 165, width: 236, height: 16 }), h2 = hl({ left: 66, top: 200, width: 403, height: 16 }), h3 = hl({ left: 442, top: 474, width: 171, height: 16 });
    card(cam, "yellow", { left: 1080, top: 120, width: 320 }, "FTC v. AMAZON", "", "Dkt. 1 · p. 9 · filed 9/26/23", 4);
    const bb = card(cam, "", { left: 1120, top: 520, width: 560 }, "BUY BOX SHARE OF SALES", "80%+", "Industry estimate. The FTC’s own figure is redacted.", -3);
    tl.fromTo(cam, { scale: 1, x: 0, y: 0 }, { scale: 2.25, x: -560, y: -170, duration: 1.3, ease: "power3.inOut", immediateRender: false }, c.zoom);
    at(cam, S[1].start, { scale: 1, x: 0, y: 0 });
    [[h1, c.hl1], [h2, c.hl2], [h3, c.hl3]].forEach((p) => tl.fromTo(p[0], { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power1.out" }, p[1]));
    tl.to(cam, { y: -900, x: -600, duration: 0.9, ease: "power2.inOut" }, c.drift);
    void bb;
    const fr = px(el("div", "frame", sc), { left: 110, top: 110 }); fr.style.transform = "rotate(-1deg)";
    picture(fr, "nessie.jpg", { left: 22, top: 22, width: 1180, height: 666 }, S[2].start, null, 1.05);
    win(fr, S[2].start + 0.3, null);
    const nm = card(sc, "", { left: 1390, top: 120, width: 440 }, "CODE NAME", "PROJECT NESSIE", "An algorithm the FTC says raised prices, then waited for rivals to follow.", 2);
    win(nm, S[2].start + 0.8, null);
    stamp(sc, "ALLEGED", "FTC: $1B+ EXTRA PROFIT", { left: 1390, top: 520, background: "#faf7ef", filter: "none", fontSize: "58px" }, S[2].cues.stamp, null);
    const rep = card(sc, "yellow", { left: 1380, top: 740, width: 460 }, "AMAZON’S RESPONSE", "", "The FTC “grossly mischaracterizes” the tool. It was scrapped.", 3);
    win(rep, S[2].cues.reply, null);
    chrome(sc, data, T, { left: 110, bottom: 60, maxWidth: "1020px" });
    finish(sc);
  }

  /* ---------- scene 4: the return receipt ---------- */
  function scene4(sc, data, T) {
    const S = T.steps, c = (i, k) => S[i].cues[k], d0 = S[0].duration;
    el("div", "bgk kraft", sc);
    picture(sc, "dress.jpg", { left: 0, top: 0, width: 1920, height: 1080 }, S[0].start, end(S[0]), 1.07);
    const cards = [["1 IN 5", "online purchases gets sent back (NRF)", 90, 130, -2, 0.08], ["FRIDAY", "Buy the dress.", 1330, 150, 2, 0.36],
      ["SATURDAY", "Wear it to a wedding.", 1330, 370, -1.5, 0.46], ["MONDAY", "Return it: “didn’t fit.”", 1330, 590, 2.5, 0.56]];
    cards.forEach((k) => { const e = card(sc, k[0] === "MONDAY" ? "red" : "", { left: k[2], top: k[3], width: 500 }, "", k[0], k[1], k[4]); win(e, S[0].start + d0 * k[5], end(S[0])); });
    const w = px(el("div", "pile-label", sc, "WARDROBING"), { left: 90, top: 820 }); w.style.color = "#faf7ef"; w.style.background = COL.amazon; w.style.padding = "10px 26px"; w.style.fontSize = "120px"; slam(w, S[0].start + d0 * 0.28, end(S[0]));
    receipt(sc, "*** RETURN ***", "one worn $100 dress", [
      { l: "REFUND TO CUSTOMER", r: "-100.00", t: c(1, "head") }, { l: "SALE REVERSED", r: "+100.00", t: c(1, "head") + 0.5 }, { hr: 1 },
      { l: "REFUND ADMIN FEE", r: "-3.40", cls: "amz", t: c(1, "line") }, { l: "FBA FEE KEPT", r: "≈-6.00", cls: "amz", t: c(2, "line") },
      { l: "RETURN PROCESSING", r: "≈-3.00", cls: "amz", t: c(3, "line") }, { l: "DRESS WRITTEN OFF", r: "-28.00", t: c(4, "line") }, { hr: 1 },
      { l: "NET LOSS", r: "-$40.40", cls: "tot amz", t: c(5, "line") },
    ], S[1].start + 0.1);
    const big = [[1, "−$3.40", "REFUND ADMIN FEE"], [2, "≈−$6", "FULFILLMENT FEE, NOT REFUNDED"], [3, "≈−$3", "RETURNS PROCESSING FEE"], [4, "−$28", "WORN DRESS, WRITTEN OFF"]];
    big.forEach((b) => { const e = el("div", "bignum", sc, '<div class="n">' + b[1] + '</div><div class="l">' + b[2] + "</div>"); slam(e, c(b[0], "line"), end(S[b[0]])); });
    const fin = el("div", "bignum", sc, '<div class="n">−$40.40</div><div class="l">= THE PROFIT FROM 4 FULL-PRICE SALES</div>'); slam(fin, c(5, "stamp"), null);
    chrome(sc, data, T, { left: 800, bottom: 50, maxWidth: "1040px" });
    finish(sc);
  }

  /* ---------- scene 5: the cash-flow corridor ---------- */
  function scene5(sc, data, T) {
    const S = T.steps;
    const gr5 = el("div", "grade", sc); gr5.style.background = "rgba(20,12,6,.45)";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "string"); svg.setAttribute("width", 1920); svg.setAttribute("height", 1080); sc.appendChild(svg);
    const dsc = ["Factory is paid long before the first sale.", "Funds release 7 days after confirmed delivery.", "Placement fee since 2024. Surcharge since 2026.", "Aged-inventory fee or low-inventory fee."];
    const cs = [];
    data.steps.forEach((st, i) => {
      const x = i === 3 ? 90 : 90 + i * 445, y = i === 3 ? 150 : 230 + (i % 2) * 60;
      if (i === 3) { picture(sc, "corridor.jpg", { left: 0, top: 0, width: 1920, height: 1080 }, S[3].start, null, 1.1); cs.forEach((c0) => at(c0, S[3].start, { opacity: 0 })); at(svg, S[3].start, { opacity: 0 }); sc.querySelectorAll(".pin").forEach((pn) => tl.set(pn, { opacity: 0 }, S[3].start + 0.31)); }
      const e = card(sc, i === 3 ? "red" : "", { left: x, top: y, width: 400, minHeight: "330px" }, st.label.replace(/^\d+\.\s*/, "").toUpperCase(), st.val, dsc[i], [-2, 1.5, -1, 2][i]);
      win(e, S[i].start + 0.3, null); cs.push(e);
      if (i > 0 && i < 3) tl.to(cs[i - 1], { opacity: 0.55, duration: 0.3 }, S[i].start + 0.3);
      if (i < 3) { el("div", "pin", sc).style.cssText = "left:" + (x + 200) + "px;top:" + (y + 6) + "px;opacity:0"; at(sc.lastChild, S[i].start + 0.3, { opacity: 1 }); }
      if (i > 0 && i < 3) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path"), px0 = 90 + (i - 1) * 445 + 200, py0 = 230 + ((i - 1) % 2) * 60 + 6;
        p.setAttribute("d", "M " + px0 + " " + py0 + " Q " + ((px0 + x + 200) / 2) + " " + (py0 + 110) + " " + (x + 200) + " " + (y + 6));
        p.setAttribute("fill", "none"); p.setAttribute("stroke", "#b3121f"); p.setAttribute("stroke-width", "4"); p.style.opacity = 0; svg.appendChild(p);
        at(p, S[i].start + 0.3, { opacity: 1 });
      }
    });
    stamp(sc, "FEE EITHER WAY", "TOO MUCH STOCK · OR TOO LITTLE", { left: 1160, top: 800, background: "#faf7ef", filter: "none", fontSize: "64px" }, S[3].cues.stamp, null);
    chrome(sc, data, T, { left: 90, bottom: 60, maxWidth: "960px" });
    finish(sc);
  }

  /* ---------- scene 6: who gets your $100 ---------- */
  function scene6(sc, data, T) {
    const S = T.steps, titles = ["WHAT IT COSTS TO REACH THE CUSTOMER (PER $100)", "AMAZON’S AVERAGE CUT OF SELLER SALES", "WHO GETS YOUR $100"];
    el("div", "bgk kraft", sc);
    data.steps.forEach((st, i) => { if (i < 2) bars(sc, st, S[i], titles[i], false); });
    const c3 = S[2].cues, area = px(el('div', 'bill-area', sc), { left: 410, top: 200, width: 1100 }); area.style.opacity = 0;
    tl.fromTo(area, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, S[2].start + 0.3);
    let bx = 0; [[0.10, 'you', -260, c3.cut1], [0.38, 'cost', 0, null], [0.52, 'amz', 260, c3.cut2]].forEach((p) => {
      const w = Math.round(p[0] * 1100), d = px(el('div', 'slice', area), { left: bx, width: w, height: 470 });
      d.innerHTML = '<svg width="1100" height="470" viewBox="0 0 960 410" preserveAspectRatio="none" style="left:' + (-bx) + 'px"><use href="#bill-art"/></svg><div class="tint"></div>';
      if (p[3] != null) tl.to(d, { x: p[2], rotation: p[1] === 'amz' ? 3 : -3, duration: 0.5, ease: 'power3.out' }, p[3]);
      if (p[1] === 'amz') tl.to(d.querySelector('.tint'), { opacity: 0.55, duration: 0.3 }, p[3] + 0.1);
      if (p[1] === 'cost') tl.to(d, { opacity: 0.45, duration: 0.4 }, c3.cut2 + 0.2);
      bx += w; });
    const fl = (html, left, color, t) => { const l = px(el('div', 'pile-label', sc, html), { left: left, top: 720 }); l.style.color = color; l.style.fontSize = '110px'; slam(l, t, null); };
    fl('SELLER $10<small>MADE THE PRODUCT</small>', 120, COL.seller, c3.cut1 + 0.4);
    fl('AMAZON $52<small>OWNS THE SHELF</small>', 1230, COL.amazon, c3.cut2 + 0.4);
    const n = el("div", "endnote", sc, "EVERY NUMBER IN THIS VIDEO IS SOURCED IN THE DESCRIPTION"); n.style.color = "#1b1a17"; n.style.bottom = "auto"; n.style.top = "120px";
    win(n, S[2].start + S[2].duration * 0.75, null);
    chrome(sc, data, T, { left: 230, bottom: 96, maxWidth: "1460px" });
    finish(sc);
  }

  function subtitles(root, subs) {
    const box = el('div', 'subs', root);
    subs.forEach((s) => { const d = el('div', 'sub', box, '<span>' + esc(s.x) + '</span>'); d.style.opacity = 0; at(d, s.a, { opacity: 1 }); at(d, s.b, { opacity: 0 }); });
  }

  window.Paper = {
    build(timeline, SCENES, T, X) {
      tl = timeline;
      const fns = [scene1, scene2, scene3, scene4, scene5, scene6];
      SCENES.forEach((data, i) => fns[i](document.getElementById("scene-" + data.scene), data, T.scenes[i], X));
      subtitles(document.getElementById('root'), X.subs);
      // deterministic 12 fps grain jitter
      let seed = 1234567; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
      const grains = document.querySelectorAll(".grain");
      for (let t = 0; t < T.total; t += 1 / 12) tl.set(grains, { x: Math.round(rnd() * 60 - 30), y: Math.round(rnd() * 60 - 30) }, t);
    },
  };
})();
