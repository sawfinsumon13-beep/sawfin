/* Real BMW engine photos for hero background slideshow */
(function initBmwHeroBg() {
  const container = document.querySelector('.hero-bmw-bg__slides');
  if (!container) return;

  const photos = [
    'images/engines/sets/set-0108/01.webp',
    'images/engines/sets/set-0114/02.webp',
    'images/engines/sets/set-0087/03.webp',
    'images/engines/sets/set-0052/04.webp',
    'images/engines/sets/set-0047/01.webp',
    'images/engines/sets/set-0061/02.webp'
  ];

  photos.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-bmw-bg__slide';
    slide.style.backgroundImage = `url('${src}')`;
    slide.style.animationDelay = `${i * 4}s`;
    container.appendChild(slide);
  });
})();
