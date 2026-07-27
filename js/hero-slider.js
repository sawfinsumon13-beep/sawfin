(function () {
  function initHeroSlider(root) {
    if (!root || root.dataset.sliderReady === "1") return;
    root.dataset.sliderReady = "1";

    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    if (slides.length < 2) return;

    var dotsWrap = root.querySelector(".hero-dots");
    var prev = root.querySelector(".hero-nav-prev");
    var next = root.querySelector(".hero-nav-next");
    var index = Math.max(
      0,
      slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      })
    );
    var timer = null;
    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var intervalMs = reduceMotion ? 9000 : 5500;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map(function (_, i) {
          return (
            '<button type="button" role="tab" aria-label="Show background ' +
            (i + 1) +
            '"' +
            (i === index ? ' class="is-active"' : "") +
            "></button>"
          );
        })
        .join("");
    }

    function goTo(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, intervalMs);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
        start();
      });
    }
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.addEventListener("click", function () {
          goTo(i);
          start();
        });
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    goTo(index);
    start();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
  });
})();
