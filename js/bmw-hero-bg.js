(function initBmwHeroBg() {
  function mount() {
    const container = document.querySelector('.hero-bmw-bg__slides');
    if (!container || container.childElementCount) return;

    const photos = [
      'images/engines/sets/set-0108/03.webp',
      'images/engines/sets/set-0114/01.webp',
      'images/engines/sets/set-0061/04.webp',
      'images/engines/sets/set-0052/02.webp',
      'images/engines/sets/set-0046/03.webp',
      'images/engines/sets/set-0087/01.webp'
    ];

    photos.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-bmw-bg__slide';
      slide.style.backgroundImage = `url('${src}')`;
      slide.style.animationDelay = `${i * 4}s`;
      container.appendChild(slide);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
