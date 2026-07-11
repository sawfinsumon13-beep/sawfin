const WORKSHOP_SLIDES = [
  {
    src: 'images/engines/sets/set-0108/03.webp',
    title: 'Engine Inspection Bay',
    caption: 'Our technicians inspect every BMW engine on arrival — external condition, sump, and component checklist'
  },
  {
    src: 'images/engines/sets/set-0114/02.webp',
    title: 'Compression Testing',
    caption: 'Calibrated compression and leak-down tests on each cylinder before any engine is listed for sale'
  },
  {
    src: 'images/engines/sets/set-0087/04.webp',
    title: 'Component Verification',
    caption: 'Hoses, sensors, and ancillaries checked by hand — nothing ships without a signed test certificate'
  },
  {
    src: 'images/engines/sets/set-0052/01.webp',
    title: 'Warehouse Preparation',
    caption: 'Engines cleaned, photographed from every angle, and palletised for safe EU-wide delivery'
  },
  {
    src: 'images/engines/sets/set-0061/03.webp',
    title: 'Dyno Verification',
    caption: 'Live-run testing on our SuperFlow dynamometer — oil pressure, idle stability, and boost response verified'
  },
  {
    src: 'images/engines/sets/set-0047/02.webp',
    title: 'Quality Control',
    caption: 'Senior technicians sign off every unit — 4–6 hours of testing per engine, no shortcuts'
  },
  {
    src: 'images/engines/sets/set-0060/05.webp',
    title: 'Ready to Ship',
    caption: 'Tested, documented, and installation-ready — shipped from our Hamburg facility across 28 EU countries'
  }
];

function initBmwCarSlideshow() {
  const root = document.getElementById('bmwCarSlideshow');
  if (!root) return;

  const slides = WORKSHOP_SLIDES;
  let index = 0;
  let timer;

  const track = root.querySelector('.bmw-slideshow__track');
  const dotsEl = root.querySelector('.bmw-slideshow__dots');
  const thumbsEl = root.querySelector('.bmw-slideshow__thumbs');

  track.innerHTML = slides.map((slide, i) => `
    <div class="bmw-slideshow__slide" data-index="${i}">
      <img src="${slide.src}" alt="${slide.title}" loading="${i === 0 ? 'eager' : 'lazy'}">
      <div class="bmw-slideshow__caption">
        <strong>${slide.title}</strong>
        <span>${slide.caption}</span>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = slides.map((_, i) =>
    `<button class="bmw-slideshow__dot${i === 0 ? ' active' : ''}" type="button" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>`
  ).join('');

  thumbsEl.innerHTML = slides.map((slide, i) => `
    <button class="bmw-slideshow__thumb${i === 0 ? ' active' : ''}" type="button" data-index="${i}" aria-label="View ${slide.title}">
      <img src="${slide.src}" alt="">
    </button>
  `).join('');

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsEl.querySelectorAll('.bmw-slideshow__dot').forEach((d, j) => d.classList.toggle('active', j === index));
    thumbsEl.querySelectorAll('.bmw-slideshow__thumb').forEach((t, j) => t.classList.toggle('active', j === index));
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 5000);
  }

  root.querySelector('.bmw-slideshow__btn--prev')?.addEventListener('click', () => { goTo(index - 1); startAuto(); });
  root.querySelector('.bmw-slideshow__btn--next')?.addEventListener('click', () => { goTo(index + 1); startAuto(); });
  dotsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.bmw-slideshow__dot');
    if (btn) { goTo(Number(btn.dataset.index)); startAuto(); }
  });
  thumbsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.bmw-slideshow__thumb');
    if (btn) { goTo(Number(btn.dataset.index)); startAuto(); }
  });

  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', startAuto);

  startAuto();
}

document.addEventListener('DOMContentLoaded', initBmwCarSlideshow);
