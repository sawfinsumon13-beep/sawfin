/** Hero background — rotate BMW engine photos every second */

const HERO_INTERVAL_MS = 1000;

async function initHeroSlideshow() {
  const container = document.getElementById('hero-bg');
  if (!container) return;

  const layers = container.querySelectorAll('.hero-bg-img');
  if (layers.length < 2) return;

  let images = [];
  try {
    const res = await fetch('js/hero-slideshow-images.json');
    images = await res.json();
  } catch (_) {
    return;
  }

  if (!images.length) return;

  let index = 0;
  let active = 0;

  const preload = (src) => {
    const img = new Image();
    img.src = src;
  };

  const show = (i) => {
    const next = images[i % images.length];
    const inactive = active === 0 ? 1 : 0;
    const activeEl = layers[active];
    const nextEl = layers[inactive];

    nextEl.src = next.src;
    nextEl.alt = next.label || 'BMW engine from Bavarian Engines Hamburg';
    preload(images[(i + 1) % images.length].src);

    nextEl.classList.add('is-active');
    activeEl.classList.remove('is-active');
    active = inactive;
  };

  preload(images[1 % images.length].src);
  show(0);

  setInterval(() => {
    index = (index + 1) % images.length;
    show(index);
  }, HERO_INTERVAL_MS);
}

if (window.SPA_MODE) {
  window.initHeroSlideshow = initHeroSlideshow;
} else {
  document.addEventListener('DOMContentLoaded', initHeroSlideshow);
}
