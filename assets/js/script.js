const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const counterItems = document.querySelectorAll("[data-counter]");
const yearNode = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const bgCanvas = document.getElementById("bg-3d-canvas");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const init3DBackground = () => {
  if (!bgCanvas) {
    return;
  }

  const context = bgCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationId = 0;
  let rotation = 0;

  const settings = {
    depth: 1200,
    spread: 720,
    speed: 2.6,
  };

  const getParticleCount = () => {
    const screenMin = Math.min(window.innerWidth, window.innerHeight);
    if (screenMin < 520) return 38;
    if (screenMin < 900) return 58;
    return 86;
  };

  let particles = [];

  const createParticle = () => ({
    x: (Math.random() - 0.5) * settings.spread * 2,
    y: (Math.random() - 0.5) * settings.spread * 1.2,
    z: Math.random() * settings.depth + 20,
    size: Math.random() * 2 + 0.4,
    drift: Math.random() * 0.8 + 0.35,
  });

  const resizeCanvas = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = Math.floor(width * dpr);
    bgCanvas.height = Math.floor(height * dpr);
    bgCanvas.style.width = `${width}px`;
    bgCanvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: getParticleCount() }, createParticle);
  };

  const drawFrame = () => {
    context.clearRect(0, 0, width, height);
    rotation += 0.0009;
    const centerX = width / 2;
    const centerY = height / 2;
    const perspective = Math.min(width, height) * 0.95;

    for (const particle of particles) {
      particle.z -= settings.speed * particle.drift;
      if (particle.z <= 18) {
        Object.assign(particle, createParticle(), { z: settings.depth + 20 });
      }

      const rotatedX = particle.x * Math.cos(rotation) - particle.y * Math.sin(rotation);
      const rotatedY = particle.x * Math.sin(rotation) + particle.y * Math.cos(rotation);
      const scale = perspective / (perspective + particle.z);
      const x = rotatedX * scale + centerX;
      const y = rotatedY * scale + centerY;
      const radius = Math.max(0.3, particle.size * scale * 1.45);
      const alpha = Math.max(0.1, 1 - particle.z / settings.depth);

      if (x < -40 || x > width + 40 || y < -40 || y > height + 40) {
        continue;
      }

      const glow = context.createRadialGradient(x, y, 0, x, y, radius * 6);
      glow.addColorStop(0, `rgba(6,182,212,${alpha * 0.9})`);
      glow.addColorStop(1, "rgba(37,99,235,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius * 6, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = `rgba(255,255,255,${alpha})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    animationId = requestAnimationFrame(drawFrame);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (prefersReducedMotion) {
    drawFrame();
    cancelAnimationFrame(animationId);
    return;
  }

  drawFrame();
};

init3DBackground();

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (node) => {
  const target = Number(node.dataset.target || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  const render = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    node.textContent = `${prefix}${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(render);
    } else {
      node.textContent = `${prefix}${target}${suffix}`;
    }
  };

  requestAnimationFrame(render);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterItems.forEach((counter) => counterObserver.observe(counter));

const track = document.getElementById("testimonial-track");
const prevBtn = document.getElementById("prev-review");
const nextBtn = document.getElementById("next-review");
const dotsContainer = document.getElementById("slider-dots");

if (track && dotsContainer) {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let intervalId = null;

  const updateSlider = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to review ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
      startAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const moveNext = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  };

  const movePrev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  };

  const startAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(moveNext, 4500);
  };

  prevBtn?.addEventListener("click", () => {
    movePrev();
    startAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    moveNext();
    startAutoplay();
  });

  track.parentElement?.addEventListener("mouseenter", () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  track.parentElement?.addEventListener("mouseleave", startAutoplay);

  updateSlider();
  startAutoplay();
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks! Your message has been captured. I will respond quickly.";
    contactForm.reset();
  });
}
