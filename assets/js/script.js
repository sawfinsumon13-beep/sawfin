const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
const backToTop = document.querySelector(".to-top");

if (header) {
  const handleHeaderState = () => {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  handleHeaderState();
  window.addEventListener("scroll", handleHeaderState);
}

if (navToggle && header && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (backToTop) {
  const toggleToTop = () => {
    if (window.scrollY > 420) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  };

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleToTop();
  window.addEventListener("scroll", toggleToTop);
}

const animatedElements = document.querySelectorAll("[data-animate]");
if (animatedElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
}

const statNumbers = document.querySelectorAll(".stat-number[data-target]");
if (statNumbers.length) {
  const startCounter = (element) => {
    const target = Number(element.dataset.target || "0");
    const suffix = element.dataset.suffix || "";
    const duration = 1300;
    let start = 0;
    let startTime = null;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (target - start) + start);
      element.textContent = `${current}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    window.requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  statNumbers.forEach((counter) => counterObserver.observe(counter));
}

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((faq) => faq.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

const faqSearch = document.querySelector("[data-faq-search]");
if (faqSearch) {
  faqSearch.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase().trim();
    faqItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.classList.toggle("hidden-by-search", Boolean(value) && !text.includes(value));
    });
  });
}

const blogSearch = document.querySelector("[data-blog-search]");
const blogCards = document.querySelectorAll(".blog-card");
if (blogSearch && blogCards.length) {
  blogSearch.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase().trim();
    blogCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const excerpt = card.querySelector("p")?.textContent.toLowerCase() || "";
      const category = card.dataset.category?.toLowerCase() || "";
      const matches = !value || title.includes(value) || excerpt.includes(value) || category.includes(value);
      card.classList.toggle("hidden-by-search", !matches);
    });
  });
}

document.querySelectorAll(".newsletter-form, .contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("[type='submit']");
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.textContent = "Submitted";
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = originalText || "Submit";
      submitButton.disabled = false;
      form.reset();
    }, 1400);
  });
});

const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (body) {
  body.classList.add("js-ready");
}
