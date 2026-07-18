(function () {
  "use strict";

  // 28 premium BMW car stills for the home hero cinematic slideshow
  const HERO_BMW_CARS = [
    { src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80", alt: "BMW M4 coupe in motion" },
    { src: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1920&q=80", alt: "BMW sedan front detail" },
    { src: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80", alt: "BMW performance car on road" },
    { src: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1920&q=80", alt: "BMW luxury sedan profile" },
    { src: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1920&q=80", alt: "BMW front grille close-up" },
    { src: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80", alt: "BMW coupe night lights" },
    { src: "https://images.unsplash.com/photo-1616422285623-13ff0162193b?auto=format&fit=crop&w=1920&q=80", alt: "BMW sports coupe parked" },
    { src: "https://images.unsplash.com/photo-1607603750909-40874f7e3e53?auto=format&fit=crop&w=1920&q=80", alt: "BMW classic and modern styling" },
    { src: "https://images.unsplash.com/photo-1580273916550-e323be2aeedc?auto=format&fit=crop&w=1920&q=80", alt: "BMW on mountain road" },
    { src: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1920&q=80", alt: "BMW M performance car" },
    { src: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1920&q=80", alt: "BMW luxury vehicle side view" },
    { src: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=80", alt: "BMW sedan city street" },
    { src: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1920&q=80", alt: "BMW coupe dynamic angle" },
    { src: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1920&q=80", alt: "BMW front headlights detail" },
    { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80", alt: "BMW performance road car" },
    { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80", alt: "BMW on open highway" },
    { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80", alt: "Premium sports car night shot" },
    { src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1920&q=80", alt: "BMW style coupe showroom" },
    { src: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920&q=80", alt: "BMW luxury car exterior" },
    { src: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1920&q=80", alt: "BMW sedan sunset drive" },
    { src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80", alt: "BMW red sports coupe" },
    { src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920&q=80", alt: "BMW classic muscle stance" },
    { src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=80", alt: "BMW convertible lifestyle" },
    { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80", alt: "BMW black coupe luxury" },
    { src: "https://images.unsplash.com/photo-1517524009989-f7e759f5e7e9?auto=format&fit=crop&w=1920&q=80", alt: "BMW track performance car" },
    { src: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1920&q=80", alt: "BMW modern design language" },
    { src: "https://images.unsplash.com/photo-1617814076408-0bf2588352df?auto=format&fit=crop&w=1920&q=80", alt: "BMW SUV premium presence" },
    { src: "https://images.unsplash.com/photo-1617814076165-22cd9525c0d3?auto=format&fit=crop&w=1920&q=80", alt: "BMW touring estate elegance" }
  ];

  function initHeroSlideshow() {
    const root = document.getElementById("heroCarSlideshow");
    if (!root || root.dataset.ready === "1") return;

    const track = root.querySelector("[data-hero-slides]");
    const dots = root.querySelector("[data-hero-dots]");
    if (!track) return;

    track.innerHTML = HERO_BMW_CARS.map(
      (car, index) => `
        <figure class="hero-slide${index === 0 ? " is-active" : ""}" data-hero-slide="${index}">
          <img src="${car.src}" alt="${car.alt}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
        </figure>
      `
    ).join("");

    if (dots) {
      dots.innerHTML = HERO_BMW_CARS.map(
        (_, index) =>
          `<button type="button" class="hero-slide-dot${index === 0 ? " is-active" : ""}" data-hero-dot="${index}" aria-label="Show BMW slide ${index + 1}"></button>`
      ).join("");
    }

    let current = 0;
    let timer = null;
    const INTERVAL = 4200;

    const show = (index) => {
      const slides = track.querySelectorAll("[data-hero-slide]");
      const dotButtons = dots ? dots.querySelectorAll("[data-hero-dot]") : [];
      if (!slides.length) return;
      current = ((index % slides.length) + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dotButtons.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    };

    const next = () => show(current + 1);
    const start = () => {
      stop();
      timer = window.setInterval(next, INTERVAL);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    if (dots) {
      dots.addEventListener("click", (event) => {
        const button = event.target.closest("[data-hero-dot]");
        if (!button) return;
        show(Number(button.getAttribute("data-hero-dot")));
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    // Prefetch a few upcoming slides for smoother transitions
    HERO_BMW_CARS.slice(1, 4).forEach((car) => {
      const img = new Image();
      img.src = car.src;
    });

    root.dataset.ready = "1";
    start();
  }

  window.OBE_INIT_HERO_SLIDESHOW = initHeroSlideshow;
  document.addEventListener("DOMContentLoaded", initHeroSlideshow);
})();
