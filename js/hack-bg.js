/* 3D hacking background — hex tunnel, wireframe core, orbital rings, data streams */
(function () {
  const HEX_ROWS = 14;
  const HEX_COLS = 22;
  const RING_COUNT = 4;
  const STREAM_COUNT = 36;

  let canvas, ctx, w, h, time = 0;
  let streams = [];
  let cubeVerts = [];
  let cubeEdges = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initStreams();
    initCube();
  }

  function initStreams() {
    streams = Array.from({ length: STREAM_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1200 + 200,
      speed: 2 + Math.random() * 4,
      chars: Array.from({ length: 16 }, () => (Math.random() > 0.5 ? '1' : '0')).join('')
    }));
  }

  function initCube() {
    const s = 90;
    cubeVerts = [
      [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
      [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
    ];
    cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
  }

  function project(x, y, z, camZ = 900) {
    const scale = camZ / (camZ + z);
    return {
      x: w * 0.5 + x * scale,
      y: h * 0.46 + y * scale,
      scale,
      z
    };
  }

  function rotateY(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, y, -x * s + z * c];
  }

  function rotateX(x, y, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x, y * c - z * s, y * s + z * c];
  }

  function drawHexTunnel() {
    const scroll = (time * 1.4) % 52;
    const horizon = h * 0.38;

    for (let row = 0; row < HEX_ROWS; row++) {
      const depth = row * 52 + scroll;
      const z = depth * 2.2;
      const p = project(0, 0, z);
      const radius = 120 + row * 38 * p.scale;
      const alpha = Math.max(0, 0.55 - row / HEX_ROWS * 0.5) * p.scale;

      ctx.strokeStyle = `rgba(100, 170, 255, ${alpha * 0.45})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < 6; i++) {
        const a1 = (i / 6) * Math.PI * 2 + time * 0.0008;
        const a2 = ((i + 1) / 6) * Math.PI * 2 + time * 0.0008;
        const x1 = Math.cos(a1) * radius;
        const y1 = Math.sin(a1) * radius * 0.35 + row * 8;
        const x2 = Math.cos(a2) * radius;
        const y2 = Math.sin(a2) * radius * 0.35 + row * 8;
        const p1 = project(x1, y1, z);
        const p2 = project(x2, y2, z);
        if (p1.y < horizon && p2.y < horizon) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // radial spokes
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius * 0.35 + row * 8;
        const near = project(x, y, z);
        const far = project(x * 0.2, y * 0.2, z + 110);
        ctx.strokeStyle = `rgba(212, 183, 106, ${alpha * 0.22})`;
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }
    }
  }

  function drawWireCore() {
    const ax = time * 0.0016;
    const ay = time * 0.0011;
    const az = time * 0.0007;
    const transformed = cubeVerts.map(([x, y, z]) => {
      let p = rotateX(x, y, z, ax);
      p = rotateY(p[0], p[1], p[2], ay);
      p = rotateX(p[0], p[1], p[2], az);
      return project(p[0], p[1] - 30, p[2] + 180, 700);
    });

    cubeEdges.forEach(([a, b]) => {
      const p1 = transformed[a];
      const p2 = transformed[b];
      const alpha = 0.75 * Math.min(p1.scale, p2.scale);
      ctx.strokeStyle = `rgba(120, 180, 255, ${alpha})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#6aa8ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    transformed.forEach(p => {
      ctx.fillStyle = `rgba(212, 183, 106, ${0.9 * p.scale})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawOrbitalRings() {
    for (let r = 0; r < RING_COUNT; r++) {
      const tilt = 0.35 + r * 0.22;
      const radius = 160 + r * 55;
      const spin = time * (0.0012 + r * 0.0004);
      const points = [];

      for (let i = 0; i <= 48; i++) {
        const t = (i / 48) * Math.PI * 2;
        let x = Math.cos(t + spin) * radius;
        let y = Math.sin(t + spin) * radius * Math.sin(tilt);
        let z = Math.sin(t + spin) * radius * Math.cos(tilt) + 320 + r * 40;
        const rot = rotateY(x, y, z, time * 0.0005);
        points.push(project(rot[0], rot[1], rot[2]));
      }

      ctx.strokeStyle = `rgba(140, 190, 255, ${0.18 + r * 0.06})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
    }
  }

  function drawDataStreams() {
    ctx.font = '12px "Share Tech Mono", monospace';
    streams.forEach(s => {
      s.z -= s.speed;
      if (s.z < 50) {
        s.z = 1200 + Math.random() * 400;
        s.x = Math.random() * w;
        s.y = Math.random() * h * 0.6;
      }

      const p = project((s.x - w / 2) * 1.6, (s.y - h / 2) * 0.8, s.z, 1100);
      const alpha = Math.min(1, (1200 - s.z) / 900) * 0.55 * p.scale;
      ctx.fillStyle = `rgba(140, 190, 255, ${alpha})`;
      ctx.fillText(s.chars, p.x, p.y);

      // trail
      for (let t = 1; t < 5; t++) {
        const tp = project((s.x - w / 2) * 1.6, (s.y - h / 2) * 0.8, s.z + t * 28, 1100);
        ctx.fillStyle = `rgba(212, 183, 106, ${alpha * (1 - t / 5) * 0.35})`;
        ctx.fillText(s.chars.slice(0, 8), tp.x, tp.y);
      }
    });
  }

  function drawScanBeams() {
    const sweep = (Math.sin(time * 0.008) * 0.5 + 0.5) * w;
    const grad = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, 0);
    grad.addColorStop(0, 'rgba(0, 255, 136, 0)');
    grad.addColorStop(0.5, 'rgba(140, 190, 255, 0.07)');
    grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const hline = h * 0.46 + Math.sin(time * 0.012) * 40;
    ctx.strokeStyle = 'rgba(140, 190, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, hline);
    ctx.lineTo(w, hline);
    ctx.stroke();
  }

  function drawHUD() {
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(212, 183, 106, 0.2)';
    const lines = [
      '// BAVARIAN.ENGINE.EXCHANGE :: SECURE',
      `// HEX.TUNNEL.ACTIVE | CORE.SPIN ${Math.floor(time / 60)}`,
      '// 3D.HACK.LAYER.ONLINE'
    ];
    lines.forEach((line, i) => ctx.fillText(line, 20, h - 68 + i * 16));
  }

  function frame() {
    time++;
    ctx.fillStyle = 'rgba(10, 18, 40, 0.26)';
    ctx.fillRect(0, 0, w, h);

    drawHexTunnel();
    drawOrbitalRings();
    drawDataStreams();
    drawWireCore();
    drawScanBeams();
    drawHUD();

    requestAnimationFrame(frame);
  }

  function init() {
    if (document.getElementById('hack-bg-canvas')) return;

    const wrap = document.createElement('div');
    wrap.id = 'hack-bg';
    wrap.innerHTML = `
      <canvas id="hack-bg-canvas" aria-hidden="true"></canvas>
      <div class="hack-scanlines" aria-hidden="true"></div>
      <div class="hack-vignette" aria-hidden="true"></div>
      <div class="hack-grid-overlay hack-grid-hex" aria-hidden="true"></div>`;
    document.body.prepend(wrap);

    canvas = document.getElementById('hack-bg-canvas');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    frame();
  }

  window.HackBackground = { init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
