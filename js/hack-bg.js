/* Hacking-style 3D background — matrix rain + wireframe grid + neural network */
(function () {
  const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEF<>{}[]/\\|_#@$&';
  const NODE_COUNT = 48;
  const GRID_SIZE = 24;
  const GRID_DEPTH = 18;

  let canvas, ctx, w, h, animId;
  let matrixDrops = [];
  let nodes = [];
  let gridOffset = 0;
  let time = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initMatrix();
    initNodes();
  }

  function initMatrix() {
    const cols = Math.ceil(w / 18);
    matrixDrops = Array.from({ length: cols }, (_, i) => ({
      x: i * 18,
      y: Math.random() * h,
      speed: 1 + Math.random() * 2.5,
      len: 8 + Math.floor(Math.random() * 20),
      chars: Array.from({ length: 30 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)])
    }));
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * w * 1.4,
      y: (Math.random() - 0.5) * h * 0.8,
      z: Math.random() * 800 + 200,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.8,
      pulse: Math.random() * Math.PI * 2
    }));
  }

  function project(x, y, z) {
    const fov = 500;
    const scale = fov / (fov + z);
    return {
      x: w / 2 + x * scale,
      y: h / 2 + y * scale,
      scale,
      z
    };
  }

  function drawMatrix() {
    ctx.font = '14px "Share Tech Mono", monospace';
    matrixDrops.forEach(col => {
      for (let i = 0; i < col.len; i++) {
        const y = col.y - i * 18;
        if (y < -20 || y > h + 20) continue;
        const alpha = Math.max(0, 1 - i / col.len);
        const char = col.chars[(Math.floor(col.y / 18) + i) % col.chars.length];
        ctx.fillStyle = i === 0
          ? `rgba(0, 255, 136, ${0.95 * alpha})`
          : `rgba(0, 240, 180, ${0.35 * alpha})`;
        ctx.fillText(char, col.x, y);
      }
      col.y += col.speed;
      if (col.y > h + col.len * 18) {
        col.y = -col.len * 18;
        col.speed = 1 + Math.random() * 2.5;
      }
    });
  }

  function drawGrid3D() {
    gridOffset += 0.6;
    const horizon = h * 0.42;

    for (let z = 0; z < GRID_DEPTH; z++) {
      const depth = z * GRID_SIZE + (gridOffset % GRID_SIZE);
      const p1 = project(0, 0, depth * 8);
      const alpha = Math.max(0, 0.45 - z / GRID_DEPTH * 0.4) * p1.scale;

      ctx.strokeStyle = `rgba(0, 255, 200, ${alpha * 0.35})`;
      ctx.lineWidth = 1;

      // horizontal lines
      for (let x = -GRID_SIZE * 2; x <= GRID_SIZE * 2; x++) {
        const left = project(x * GRID_SIZE * 2, 80, depth * 8);
        const right = project((x + 1) * GRID_SIZE * 2, 80, depth * 8);
        if (left.y < horizon) continue;
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }
    }

    // vertical perspective lines
    for (let x = -GRID_SIZE * 2; x <= GRID_SIZE * 2; x++) {
      const near = project(x * GRID_SIZE * 2, 80, 20);
      const far = project(x * GRID_SIZE * 2, 80, GRID_DEPTH * 8);
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(near.x, near.y);
      ctx.lineTo(far.x, far.y);
      ctx.stroke();
    }
  }

  function drawNetwork() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
      n.pulse += 0.04;

      if (Math.abs(n.x) > w) n.vx *= -1;
      if (Math.abs(n.y) > h * 0.5) n.vy *= -1;
      if (n.z < 100 || n.z > 900) n.vz *= -1;

      n.x += Math.sin(time * 0.001 + n.pulse) * 0.15;
      n.y += Math.cos(time * 0.0012 + n.pulse) * 0.1;
    });

    const projected = nodes.map(n => ({ ...n, p: project(n.x, n.y - 40, n.z) }));

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 220) {
          const alpha = (1 - dist / 220) * 0.35 * Math.min(a.p.scale, b.p.scale);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.p.x, a.p.y);
          ctx.lineTo(b.p.x, b.p.y);
          ctx.stroke();
        }
      }
    }

    projected.forEach(n => {
      const r = 2 + Math.sin(n.pulse) * 1.2;
      const glow = ctx.createRadialGradient(n.p.x, n.p.y, 0, n.p.x, n.p.y, r * 4);
      glow.addColorStop(0, `rgba(0, 255, 200, ${0.9 * n.p.scale})`);
      glow.addColorStop(1, 'rgba(0, 255, 200, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(n.p.x, n.p.y, r * 4 * n.p.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(200, 255, 240, ${0.95 * n.p.scale})`;
      ctx.beginPath();
      ctx.arc(n.p.x, n.p.y, r * n.p.scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawHUD() {
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
    const lines = [
      '// SYS.BMW.ENGINE.INVENTORY',
      `// NODES: ${NODE_COUNT} | GRID: ACTIVE`,
      `// T+${Math.floor(time / 60)}ms`
    ];
    lines.forEach((line, i) => {
      ctx.fillText(line, 20, h - 60 + i * 16);
    });
  }

  function frame() {
    time++;
    ctx.fillStyle = 'rgba(2, 6, 8, 0.22)';
    ctx.fillRect(0, 0, w, h);

    drawGrid3D();
    drawMatrix();
    drawNetwork();
    drawHUD();

    animId = requestAnimationFrame(frame);
  }

  function init() {
    if (document.getElementById('hack-bg-canvas')) return;

    const wrap = document.createElement('div');
    wrap.id = 'hack-bg';
    wrap.innerHTML = `
      <canvas id="hack-bg-canvas" aria-hidden="true"></canvas>
      <div class="hack-scanlines" aria-hidden="true"></div>
      <div class="hack-vignette" aria-hidden="true"></div>
      <div class="hack-grid-overlay" aria-hidden="true"></div>`;
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
