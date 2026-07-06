(function () {
  var TYPED_STRINGS = [
    'cuddle buddy', 'furry soulmate', 'best friend', 'whiskered companion',
    'family member', 'playful pal', 'lap warmer', 'purring partner',
    'joy bringer', 'spirit lifter', 'heart healer', 'comfort giver',
    'snack inspector', 'keyboard sitter', 'box occupier', 'window gazer',
  ];

  function fixSlideshows() {
    document.querySelectorAll('.slideshow-track').forEach(function (track) {
      var isSecond = track.id && track.id.indexOf('second') !== -1;
      var mobile = window.matchMedia('(max-width: 1180px)').matches;
      var name = isSecond ? 'scroll-right' : 'scroll-left';
      var duration = isSecond ? (mobile ? '15000ms' : '125000ms') : (mobile ? '25000ms' : '70000ms');
      track.style.removeProperty('display');
      track.style.removeProperty('gap');
      track.style.animation = duration + ' linear 0s infinite normal none running ' + name;
    });

    var marquee = document.querySelector('.marquee-content');
    if (marquee) {
      marquee.style.animation = 'scrolling 10s linear infinite';
    }
  }

  function initTyped() {
    var target = document.querySelector('.text-type');
    if (!target || target.dataset.pkTypedInit) return;
    if (typeof Typed === 'undefined') return;
    target.dataset.pkTypedInit = '1';
    new Typed(target, {
      strings: TYPED_STRINGS,
      typeSpeed: 150,
      loop: true,
    });
  }

  function loadTyped(cb) {
    if (typeof Typed !== 'undefined') {
      cb();
      return;
    }
    var existing = document.querySelector('script[data-pk-typed]');
    if (existing) {
      existing.addEventListener('load', cb);
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/typed.js@2.0.15/dist/typed.umd.js';
    s.dataset.pkTyped = '1';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function boot() {
    fixSlideshows();
    setTimeout(fixSlideshows, 50);
    setTimeout(fixSlideshows, 400);
    setTimeout(fixSlideshows, 1500);
    window.addEventListener('load', fixSlideshows);
    setTimeout(function () {
      loadTyped(initTyped);
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('resize', fixSlideshows);
})();
