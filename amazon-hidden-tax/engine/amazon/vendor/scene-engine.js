/* Scene engine: builds one scene from its JSON package and adds its motion to the
   root GSAP timeline. Three modes: waterfall, network, compare.
   Deterministic: no clocks, no randomness, no network. Only seek-safe properties
   (opacity, x, y, scale, scaleX, scaleY) are animated. */
(function () {
  "use strict";
  var COLORS = { amazon: "#ff9f1c", seller: "#2dd4bf", supplier: "#7c8ba1", loss: "#f43f5e", start: "#e2e8f0" };
  var W = 1920;

  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function px(e, o) { for (var k in o) e.style[k] = typeof o[k] === "number" ? o[k] + "px" : o[k]; return e; }
  function fmtNum(v) { var a = Math.abs(v); return (Math.round(a * 100) % 100 === 0) ? String(Math.round(a)) : a.toFixed(2); }
  function money(v, signed) { var s = "$" + fmtNum(v); return v < 0 ? "−" + s : (signed && v > 0 ? "+" + s : s); }
  function fmtUnit(v, unit) { return unit === "%" ? fmtNum(v) + "%" : unit === "$" ? money(v) : fmtNum(v); }

  /* Show an element only during [t0, t1): fade/slide in, fade out. */
  function window_(tl, e, t0, t1, keep) {
    tl.fromTo(e, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, t0);
    if (!keep) tl.to(e, { opacity: 0, duration: 0.25, ease: "power1.in" }, Math.max(t0 + 0.5, t1 - 0.25));
  }

  function ignore(e) { e.setAttribute("data-layout-ignore", ""); return e; }

  function chrome(scene, data, T, tl, nScenes, first) {
    el("div", "bg", scene);
    var hdr = el("div", "hdr", scene);
    ignore(el("div", "part", hdr, "PART " + data.part + " / " + nScenes));
    el("div", "tag", hdr, data.tag);
    el("h1", "title", hdr, data.title);
    if (!first) tl.fromTo(hdr, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, T.start + 0.1);

    var steps = data.steps, ts = T.steps, last = steps.length - 1;
    steps.forEach(function (st, i) {
      var t0 = ts[i].start, t1 = ts[i].start + ts[i].duration;
      var cap = el("div", "cap", scene);
      cap.style.opacity = 0;
      var chip = el("span", "chip", cap, st.label.replace(/^\d+\.\s*/, "").toUpperCase());
      if (st.accent === "loss") chip.style.background = COLORS.loss;
      el("div", "sub", cap, st.sub || "");
      window_(tl, cap, t0, t1, i === last);
      if (st.evidence) {
        var ev = el("div", "ev", scene);
        ev.style.opacity = 0;
        if (st.accent === "loss") ev.style.borderLeftColor = COLORS.loss;
        ignore(el("div", "k", ev, "EVIDENCE"));
        el("div", "doc", ev, st.evidence.doc);
        el("div", "txt", ev, st.evidence.quote || st.evidence.line || "");
        window_(tl, ev, t0 + 0.3, t1, i === last);
      }
    });
    if (data.footnote) ignore(el("div", "foot", scene, data.footnote));
    var prog = el("div", "prog", scene), bar = el("div", "bar", prog);
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: T.duration, ease: "none" }, T.start);
    if (!first) tl.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, T.start);
    tl.to(scene, { opacity: 0, duration: 0.4, ease: "power1.in" }, T.start + T.duration - 0.4);
  }

  /* ---------- waterfall ---------- */
  function waterfall(scene, data, T, tl) {
    var steps = data.steps, n = steps.length, run = 0, segs = [];
    steps.forEach(function (s) {
      var a, b;
      if (s.type === "start") { a = 0; b = s.val; run = s.val; }
      else if (s.type === "final") { a = 0; b = s.val; }
      else { a = run; b = run + s.val; run = b; }
      segs.push({ a: a, b: b, end: s.type === "final" ? s.val : run });
    });
    var vals = [0]; segs.forEach(function (g) { vals.push(g.a, g.b); });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var x0 = 170, x1 = 1750, yTop = 350, yBot = 730;
    function y(v) { return yBot - (v - lo) / (hi - lo) * (yBot - yTop); }
    var slot = (x1 - x0) / n, bw = Math.min(150, slot * 0.58);
    px(el("div", "wf-zero", scene), { left: x0 - 20, width: x1 - x0 + 40, top: y(0) });

    steps.forEach(function (s, k) {
      var g = segs[k], t0 = T.steps[k].start;
      var top = y(Math.max(g.a, g.b)), h = Math.max(6, Math.abs(y(g.a) - y(g.b)));
      var left = x0 + slot * k + (slot - bw) / 2;
      var color = COLORS[s.to] || (s.type === "start" ? COLORS.start : COLORS.supplier);
      if (s.type === "start") color = COLORS.start;
      var grows = (s.type === "cost" || g.b < 0) ? "50% 0%" : "50% 100%";
      var bar = px(el("div", "wf-bar", scene), { left: left, top: top, width: bw, height: h });
      bar.style.background = color; bar.style.transformOrigin = grows;
      tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power3.out" }, t0 + 0.15);

      var label = s.display || (s.type === "cost" ? money(s.val) : money(s.val));
      var below = s.type === "cost" || g.b < 0;
      // A cost label that would cross the zero line goes above its bar instead.
      if (s.type === "cost" && y(0) > top && top + h + 62 > y(0)) below = false;
      var v = px(el("div", "wf-val", scene, label), { left: left + bw / 2 - 110, top: below ? top + h + 10 : top - 54 });
      v.style.color = color === COLORS.start ? "#f4f6fa" : color;
      tl.fromTo(v, { opacity: 0, y: below ? -10 : 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, t0 + 0.55);
      var lb = px(el("div", "wf-lbl", scene, s.label), { left: left + bw / 2 - 105, top: 800 });
      tl.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4 }, t0 + 0.3);

      if (k < n - 1 && s.type !== "final") {
        var c = px(el("div", "wf-conn", scene), { left: left + bw, width: slot - bw, top: y(g.end) });
        tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0 + 0.8);
      }
      if (s.stats) {
        var box = px(el("div", "stats", scene), { top: 520 });
        s.stats.forEach(function (txt) { el("div", "stat", box, txt); });
        window_(tl, box, t0 + 0.4, T.steps[k].start + T.steps[k].duration, false);
      }
      if (s.callout && s.callout.boxes) {
        var co = el("div", "callout", scene);
        if (s.callout.pos === "bl") px(co, { left: x0, top: 560 }); else px(co, { right: 170, top: 300 });
        s.callout.boxes.forEach(function (b, j) {
          var bx = el("div", "co-box", co);
          bx.style.borderColor = COLORS[b.to] || COLORS.supplier;
          ignore(el("div", "t", bx, b.title));
          var big = el("div", "b", bx, b.big); big.style.color = COLORS[b.to] || "#f4f6fa";
          if (b.sub) el("div", "s", bx, b.sub);
          tl.fromTo(bx, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, t0 + 1.2 + j * 0.5);
        });
      }
    });
  }

  /* ---------- network ---------- */
  function network(scene, data, T, tl) {
    var L = data.layers, nL = L.length, cx0 = 300, cx1 = 1620;
    var NW = 330, NH = 92, nodes = [];
    function cx(i) { return nL === 1 ? W / 2 : cx0 + (cx1 - cx0) * i / (nL - 1); }
    function cy(yy) { return 330 + yy * 420; }
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "nw-svg"); svg.setAttribute("width", W); svg.setAttribute("height", 1080);
    scene.appendChild(svg);
    L.forEach(function (layer, i) {
      nodes[i] = layer.map(function (nd) {
        var x = cx(i), yy = cy(nd.y);
        var e = px(el("div", "nw-node", scene, nd.name), { left: x - NW / 2, top: yy - NH / 2 });
        var hiE = el("div", "nw-hi", e); hiE.style.opacity = 0;
        var hi2 = el("div", "nw-hi", e); hi2.style.opacity = 0;
        hi2.style.borderColor = COLORS.loss; hi2.style.background = "rgba(244, 63, 94, 0.14)";
        return { x: x, y: yy, e: e, hi: hiE, hi2: hi2 };
      });
    });
    var edges = []; // edges[i] = edges into layer i
    for (var i = 1; i < nL; i++) {
      edges[i] = [];
      nodes[i - 1].forEach(function (a) {
        nodes[i].forEach(function (b) {
          var x1 = a.x + NW / 2, x2 = b.x - NW / 2, mx = (x1 + x2) / 2;
          var d = "M" + x1 + "," + a.y + " C" + mx + "," + a.y + " " + mx + "," + b.y + " " + x2 + "," + b.y;
          var base = document.createElementNS(svgNS, "path");
          base.setAttribute("d", d); base.setAttribute("fill", "none"); base.setAttribute("stroke", "#2a3650"); base.setAttribute("stroke-width", "3");
          var hot = document.createElementNS(svgNS, "path");
          hot.setAttribute("d", d); hot.setAttribute("fill", "none"); hot.setAttribute("stroke", COLORS.amazon); hot.setAttribute("stroke-width", "4");
          hot.style.opacity = 0;
          svg.appendChild(base); svg.appendChild(hot);
          edges[i].push({ hot: hot, x1: x1, y1: a.y, x2: x2, y2: b.y });
        });
      });
    }
    tl.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.6 }, T.start + 0.3);
    nodes.forEach(function (layer, i) {
      layer.forEach(function (nd, j) {
        tl.fromTo(nd.e, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, T.start + 0.3 + i * 0.12 + j * 0.05);
      });
    });

    var prev = null;
    data.steps.forEach(function (st, k) {
      var t0 = T.steps[k].start, t1 = t0 + T.steps[k].duration, li = st.activeLayer;
      var col = st.accent === "loss" ? COLORS.loss : COLORS.amazon;
      var key = st.accent === "loss" ? "hi2" : "hi";
      if (prev && prev.li !== li) {
        nodes[prev.li].forEach(function (nd) { tl.to(nd[prev.key], { opacity: 0.3, duration: 0.3 }, t0); tl.to(nd.e, { scale: 1, duration: 0.3 }, t0); });
      } else if (prev && prev.key !== key) {
        nodes[li].forEach(function (nd) { tl.to(nd[prev.key], { opacity: 0, duration: 0.3 }, t0); });
      }
      nodes[li].forEach(function (nd) {
        tl.to(nd[key], { opacity: 1, duration: 0.4 }, t0 + 0.1);
        tl.to(nd.e, { scale: 1.05, duration: 0.4, ease: "power2.out" }, t0 + 0.1);
      });
      (edges[li] || []).forEach(function (ed, j) {
        tl.to(ed.hot, { opacity: 0.95, duration: 0.4 }, t0 + 0.1);
        var dot = px(el("div", "nw-dot", scene), { left: 0, top: 0 }); dot.style.background = col; dot.style.opacity = 0;
        tl.fromTo(dot, { x: ed.x1, y: ed.y1, opacity: 1 }, { x: ed.x2, y: ed.y2, duration: 1.1, ease: "power1.inOut" }, t0 + 0.2 + j * 0.08);
        tl.to(dot, { opacity: 0, duration: 0.2 }, t0 + 1.3 + j * 0.08);
        tl.to(ed.hot, { opacity: 0.35, duration: 0.3 }, t1 - 0.3);
      });
      var v = px(el("div", "nw-val", scene, st.val), { top: 752 });
      v.style.color = col;
      window_(tl, v, t0 + 0.3, t1, k === data.steps.length - 1);
      prev = { li: li, key: key };
    });
  }

  /* ---------- compare ---------- */
  function compare(scene, data, T, tl) {
    var X = 360, MAXW = 1100, rows = [{ y: 420 }, { y: 610 }];
    data.steps.forEach(function (st, k) {
      var t0 = T.steps[k].start, t1 = t0 + T.steps[k].duration, last = k === data.steps.length - 1;
      var unit = st.unit || data.unit || "";
      var g = el("div", "cmp-group", scene);
      px(g, { position: "absolute", left: 0, top: 0, width: W, height: 1080 });
      var mx = Math.max(st.leftVal, st.rightVal) || 1;
      [["left", st.leftVal, st.leftText, st.leftTo || "amazon"], ["right", st.rightVal, st.rightText, st.rightTo || "seller"]].forEach(function (r, j) {
        var row = rows[j], w = Math.max(14, r[1] / mx * MAXW), color = COLORS[r[3]] || COLORS.supplier;
        px(el("div", "cmp-txt", g, r[2]), { left: X, top: row.y - 52 });
        px(el("div", "cmp-track", g), { left: X, top: row.y, width: MAXW });
        var f = px(el("div", "cmp-fill", g), { left: X, top: row.y, width: w });
        f.style.background = color;
        tl.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" }, t0 + 0.4 + j * 0.45);
        var num = px(el("div", "cmp-num", g, fmtUnit(r[1], unit)), { left: X + w + 22, top: row.y });
        num.style.color = color;
        tl.fromTo(num, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0 + 1.0 + j * 0.45);
      });
      if (st.estimate || st.illustrative) {
        ignore(px(el("div", "cmp-flag", g, st.estimate ? "INDUSTRY ESTIMATE" : "ILLUSTRATIVE"), { left: X, top: 290 }));
      }
      g.style.opacity = 0;
      tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.35 }, t0);
      if (!last) tl.to(g, { opacity: 0, duration: 0.3 }, t1 - 0.3);
    });
  }

  window.SceneEngine = {
    build: function (rootId, scenes, timeline, tl) {
      var root = document.getElementById(rootId);
      scenes.forEach(function (data, i) {
        var T = timeline.scenes[i];
        var scene = document.getElementById("scene-" + data.scene);
        chrome(scene, data, T, tl, scenes.length, i === 0);
        var stage = el("div", "stage", scene);
        px(stage, { position: "absolute", left: 0, top: 0, width: W, height: 1080 });
        if (data.mode === "waterfall") waterfall(stage, data, T, tl);
        else if (data.mode === "network") network(stage, data, T, tl);
        else compare(stage, data, T, tl);
      });
      return root;
    }
  };
})();
