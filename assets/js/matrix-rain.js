(function () {
  "use strict";

  function initMatrixRain() {
    if (document.getElementById("matrixRainCanvas")) return;

    const canvas = document.createElement("canvas");
    canvas.id = "matrixRainCanvas";
    canvas.className = "matrix-rain-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glyphs = "01アイウエオカキクケコｻｼｽｾｿABCDEFGHIJKLMNOPQRSTUVWXYZ$#*<>[]{}|/\\";
    const fontSize = 14;
    let columns = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const colCount = Math.ceil(width / fontSize);
      columns = Array.from({ length: colCount }, () => Math.random() * -40);
    }

    function draw() {
      frame += 1;
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < columns.length; i += 1) {
        const x = i * fontSize;
        const y = columns[i] * fontSize;
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const head = Math.random() > 0.965;
        ctx.fillStyle = head ? "#c8ffd8" : `rgba(0, 255, 102, ${0.28 + Math.random() * 0.45})`;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i] += 0.85 + (i % 5) * 0.05;
        }
      }

      if (frame % 180 === 0) {
        ctx.fillStyle = "rgba(0, 255, 102, 0.03)";
        ctx.fillRect(0, Math.random() * height, width, 2 + Math.random() * 8);
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMatrixRain, { once: true });
  } else {
    initMatrixRain();
  }

  window.OBE_INIT_MATRIX_RAIN = initMatrixRain;
})();
