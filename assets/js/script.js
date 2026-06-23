const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const counterItems = document.querySelectorAll("[data-counter]");
const yearNode = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

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
