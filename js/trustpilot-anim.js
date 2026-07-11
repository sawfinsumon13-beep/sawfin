/* Trustpilot badge animation system */
(function () {
  function animateCount(el, target, duration = 1800) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '+';
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initTrustpilotAnim() {
    const badge = document.querySelector('.hero-trustpilot');
    if (!badge || badge.dataset.animReady) return;
    badge.dataset.animReady = '1';

    badge.classList.add('tp-anim-ready');

    const stars = badge.querySelectorAll('.tp-star');
    stars.forEach((star, i) => {
      star.style.animationDelay = `${0.35 + i * 0.12}s`;
    });

    const countEl = badge.querySelector('[data-tp-count]');
    if (countEl) {
      const target = parseInt(countEl.dataset.tpCountValue || countEl.dataset.tpCount || '320', 10);
      setTimeout(() => animateCount(countEl, target), 700);
    }

    const ring = document.createElement('span');
    ring.className = 'tp-pulse-ring';
    ring.setAttribute('aria-hidden', 'true');
    badge.appendChild(ring);

    const sparkHost = document.createElement('span');
    sparkHost.className = 'tp-sparks';
    sparkHost.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'tp-spark';
      s.style.setProperty('--i', i);
      sparkHost.appendChild(s);
    }
    badge.appendChild(sparkHost);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustpilotAnim);
  } else {
    initTrustpilotAnim();
  }
})();
