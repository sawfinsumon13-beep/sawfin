const BMW_CAR_SLIDES = [
  { src: 'images/bmw-cars/bmw-01.jpg', title: 'BMW 3 Series', caption: 'The everyday BMW — popular donor for M54 and B58 engine swaps' },
  { src: 'images/bmw-cars/bmw-02.jpg', title: 'BMW M4', caption: 'M Performance platform — S55 and S58 engines in our stock' },
  { src: 'images/bmw-cars/bmw-03.jpg', title: 'BMW 5 Series', caption: 'Executive saloons — N57, B57 diesel and petrol units available' },
  { src: 'images/bmw-cars/bmw-04.jpg', title: 'BMW X5', caption: 'SUV powerplants — N57, B57 and petrol engines ready to ship' },
  { src: 'images/bmw-cars/bmw-05.jpg', title: 'BMW Sports Coupe', caption: 'Performance BMW models — tested used engines for rebuilds' },
  { src: 'images/bmw-cars/bmw-06.jpg', title: 'BMW Classic', caption: 'Heritage BMW models — M20, M50 and M54 restorations supported' },
  { src: 'images/bmw-cars/bmw-07.jpg', title: 'BMW on the Road', caption: 'Quality used BMW engines — tested in Hamburg, shipped EU-wide' }
];

function initBmwCarSlideshow() {
  const root = document.getElementById('bmwCarSlideshow');
  if (!root) return;

  let index = 0;
  let timer;

  const track = root.querySelector('.bmw-slideshow__track');
  const dotsEl = root.querySelector('.bmw-slideshow__dots');
  const thumbsEl = root.querySelector('.bmw-slideshow__thumbs');

  track.innerHTML = BMW_CAR_SLIDES.map((slide, i) => `
    <div class="bmw-slideshow__slide" data-index="${i}">
      <img src="${slide.src}" alt="${slide.title}" loading="${i === 0 ? 'eager' : 'lazy'}">
      <div class="bmw-slideshow__caption">
        <strong>${slide.title}</strong>
        <span>${slide.caption}</span>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = BMW_CAR_SLIDES.map((_, i) =>
    `<button class="bmw-slideshow__dot${i === 0 ? ' active' : ''}" type="button" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>`
  ).join('');

  thumbsEl.innerHTML = BMW_CAR_SLIDES.map((slide, i) => `
    <button class="bmw-slideshow__thumb${i === 0 ? ' active' : ''}" type="button" data-index="${i}" aria-label="View ${slide.title}">
      <img src="${slide.src}" alt="">
    </button>
  `).join('');

  function goTo(i) {
    index = (i + BMW_CAR_SLIDES.length) % BMW_CAR_SLIDES.length;
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
