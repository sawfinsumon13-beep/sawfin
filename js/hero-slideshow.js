/** Hero background — premium rotating BMW engine photos */

const HERO_INTERVAL_MS = 6500;
const HERO_TRANSITION_MS = 2400;
const HERO_MODES = ['zoom-in', 'pan-left', 'pan-right', 'drift-up'];

async function initHeroSlideshow() {
  const container = document.getElementById('hero-bg');
  if (!container) return;

  const layers = container.querySelectorAll('.hero-bg-img');
  if (layers.length < 2) return;

  const captionEl = document.getElementById('hero-caption');
  const progressBar = document.getElementById('hero-progress')?.querySelector('span');

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
  let modeIndex = 0;

  const preload = (src) => {
    const img = new Image();
    img.src = src;
  };

  const clearAnimClasses = (el) => {
    el.classList.remove(
      'is-active',
      'is-exiting',
      'hero-enter-zoom-in',
      'hero-enter-pan-left',
      'hero-enter-pan-right',
      'hero-enter-drift-up',
      'hero-exit-zoom-in',
      'hero-exit-pan-left',
      'hero-exit-pan-right',
      'hero-exit-drift-up'
    );
  };

  const setCaption = (text) => {
    if (!captionEl) return;
    captionEl.classList.remove('is-visible');
    window.setTimeout(() => {
      captionEl.textContent = text || '';
      if (text) captionEl.classList.add('is-visible');
    }, 200);
  };

  const runProgress = () => {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${HERO_INTERVAL_MS}ms linear`;
      progressBar.style.width = '100%';
    });
  };

  const show = (i) => {
    const item = images[i % images.length];
    const inactive = active === 0 ? 1 : 0;
    const activeEl = layers[active];
    const nextEl = layers[inactive];
    const mode = HERO_MODES[modeIndex % HERO_MODES.length];
    modeIndex += 1;

    nextEl.src = item.src;
    nextEl.alt = item.label || 'BMW engine from Bavarian Engines Hamburg';
    nextEl.style.objectPosition = item.position || 'center 42%';

    preload(images[(i + 1) % images.length].src);

    clearAnimClasses(activeEl);
    clearAnimClasses(nextEl);

    nextEl.classList.add(`hero-enter-${mode}`);
    activeEl.classList.add('is-active', 'is-exiting', `hero-exit-${mode}`);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextEl.classList.add('is-active');
      });
    });

    setCaption(item.label);
    runProgress();

    window.setTimeout(() => {
      clearAnimClasses(activeEl);
      clearAnimClasses(nextEl);
      nextEl.classList.add('is-active');
      active = inactive;
    }, HERO_TRANSITION_MS);
  };

  layers.forEach(clearAnimClasses);
  const first = images[0];
  layers[0].src = first.src;
  layers[0].alt = first.label || '';
  layers[0].style.objectPosition = first.position || 'center 42%';
  layers[0].classList.add('is-active');
  setCaption(first.label);
  preload(images[1 % images.length].src);
  runProgress();

  window.setInterval(() => {
    index = (index + 1) % images.length;
    show(index);
  }, HERO_INTERVAL_MS);
}

if (window.SPA_MODE) {
  window.initHeroSlideshow = initHeroSlideshow;
} else {
  document.addEventListener('DOMContentLoaded', initHeroSlideshow);
}
