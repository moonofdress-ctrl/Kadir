      function toll(canvas) {
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(1); renderer.setSize(1920, 1080, false);
      renderer.setClearColor(0xd9c9a8);
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xd9c9a8, 30, 70);
      const camera = new THREE.PerspectiveCamera(32, 1920 / 1080, 0.1, 200);
      // deterministic paper texture (no async image loading)
      function paperTex(base, speck, n = 512, s0 = 99) {
        const c = document.createElement("canvas"); c.width = c.height = n; const g = c.getContext("2d");
        g.fillStyle = base; g.fillRect(0, 0, n, n); let s = s0;
        const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
        for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${speck},${0.03 + r() * 0.07})`; g.fillRect(r() * n, r() * n, 1 + r() * 2, 1 + r() * 2); }
        for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(${speck},0.06)`; g.beginPath(); const x0 = r() * n, y0 = r() * n; g.moveTo(x0, y0); g.lineTo(x0 + r() * 30 - 15, y0 + r() * 30 - 15); g.stroke(); }
        const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
      }
      const mat = (base, speck, rep = 1) => { const t = paperTex(base, speck); t.repeat.set(rep, rep); return new THREE.MeshToonMaterial({ map: t }); };
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), mat("#cdb88f", "60,40,20", 12));
      ground.rotation.x = -Math.PI / 2; scene.add(ground);
      const LANES = 3, LW = 3.2;
      for (let i = 0; i < LANES; i++) {
        const lane = new THREE.Mesh(new THREE.PlaneGeometry(LW - 0.3, 80), mat("#3b3833", "255,255,255", 6));
        lane.rotation.x = -Math.PI / 2; lane.position.set((i - 1) * LW, 0.01, -20); scene.add(lane);
        for (let z = -60; z < 18; z += 4) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.8), new THREE.MeshBasicMaterial({ color: 0xede6d6 }));
          d.rotation.x = -Math.PI / 2; d.position.set((i - 1) * LW + LW / 2, 0.02, z); if (i < LANES - 1) scene.add(d); }
      }
      // gantry with "SPONSORED" signs
      const post = mat("#2b2925", "255,255,255"), gz = -4;
      [-1, 1].forEach((sx) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 0.4), post); p.position.set(sx * (LW * 1.5 + 0.4), 3, gz); scene.add(p); });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(LW * 3 + 1.4, 0.5, 0.5), post); beam.position.set(0, 6, gz); scene.add(beam);
      const signCanvas = document.createElement("canvas"); signCanvas.width = 512; signCanvas.height = 160;
      const signTex = new THREE.CanvasTexture(signCanvas); signTex.colorSpace = THREE.SRGBColorSpace;
      function drawSign() {
        const g = signCanvas.getContext("2d"); g.fillStyle = "#c8102e"; g.fillRect(0, 0, 512, 160);
        g.strokeStyle = "#faf7ef"; g.lineWidth = 8; g.strokeRect(10, 10, 492, 140);
        g.fillStyle = "#faf7ef"; g.font = "96px Anton, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SPONSORED", 256, 86);
        signTex.needsUpdate = true;
      }
      drawSign();
      for (let i = 0; i < LANES; i++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.875), new THREE.MeshBasicMaterial({ map: signTex }));
        s.position.set((i - 1) * LW, 5.2, gz + 0.3); scene.add(s); }
      // barrier arms
      const arms = [];
      for (let i = 0; i < LANES; i++) {
        const pivot = new THREE.Group(); pivot.position.set((i - 1) * LW - LW / 2 + 0.25, 1.1, gz + 1.2);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(LW - 0.4, 0.18, 0.18), mat("#faf7ef", "200,16,46")); arm.position.x = (LW - 0.4) / 2; pivot.add(arm);
        for (let k = 0; k < 4; k++) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xc8102e })); st.position.x = 0.4 + k * 0.75; pivot.add(st); }
        scene.add(pivot); arms.push(pivot);
      }
      // booth
      const booth = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 1.6), mat("#ede6d6", "60,40,20")); booth.position.set(-LW * 1.5 - 1.6, 1.3, gz + 1.0); scene.add(booth);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.25, 2.1), post); roof.position.set(booth.position.x, 2.75, booth.position.z); scene.add(roof);
      // queued product boxes (kraft) per lane
      const boxMat = mat("#b98e55", "70,40,10", 1), boxes = [];
      for (let i = 0; i < LANES; i++) for (let k = 0; k < 6; k++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 1.3), boxMat); b.userData = { lane: i, k }; scene.add(b); boxes.push(b);
        const tape = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.02, 1.32), new THREE.MeshBasicMaterial({ color: 0xd9c49a })); b.add(tape);
      }
      // coins piling next to the booth
      const coinMat = new THREE.MeshToonMaterial({ color: 0xc9a227 }), coins = [];
      for (let k = 0; k < 18; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), coinMat); scene.add(c); coins.push(c); }
      scene.add(new THREE.HemisphereLight(0xfff6e6, 0x8a7350, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-8, 14, 10); scene.add(sun);

        document.fonts.ready.then(() => { drawSign(); });
        return function (p) {
        camera.position.set(9 - p * 4, 7.5 - p * 2.5, 14 - p * 4);
        camera.lookAt(0, 2.2, gz - 2 + p * 1.5);
        const WIN = 2; // the highest bidder's lane
        boxes.forEach((b) => { const { lane, k } = b.userData;
          const creep = Math.min(1.4, p * 2.2);                        // everyone rolls up to the barrier
          const pass = lane === WIN ? Math.max(0, p - 0.45) * 18 : 0;  // only the winner goes through
          b.position.set((lane - 1) * LW, 0.5, gz - 2.2 - k * 2.2 + creep + pass); });
        arms.forEach((a, i) => { const open = i === WIN ? Math.max(0, Math.min(1, (p - 0.3) * 5)) : 0; a.rotation.z = open * 1.3; });
        coins.forEach((c, k) => { const t = Math.max(0, Math.min(1, p * 2.2 - k * 0.08)); c.position.set(booth.position.x + 1.4 + (k % 3) * 0.1, 0.05 + Math.floor(k / 3) * 0.085 + (1 - t) * 4, gz + 2.4 + (k % 2) * 0.05); c.visible = t > 0; });
        renderer.render(scene, camera);
        };
      }
