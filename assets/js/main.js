(function () {
  "use strict";

  const data = window.OBE_DATA || { products: [], reviews: [], faqs: [] };
  const WHATSAPP_NUMBER = "4915510030835";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Original Bavarian Engine, I need help choosing the right old BMW engine."
  )}`;
  const STORAGE_KEYS = {
    theme: "obe_theme",
    wishlist: "obe_wishlist",
    compare: "obe_compare"
  };

  const state = {
    wishlist: new Set(loadJSON(STORAGE_KEYS.wishlist)),
    compare: new Set(loadJSON(STORAGE_KEYS.compare))
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderNavbar();
    renderFooter();
    renderGlobalWidgets();
    initTheme();
    initLoader();
    initStickyHeader();
    initBackToTop();
    initPageTransitions();
    initRevealOnScroll();
    initParallax();
    initTiltCards();
    initAccordions();
    initNewsletterForms();
    initGsapAnimations();
    initContactForm();
    routePageFeatures();
    updateCounterBadges();
    refreshCompareDrawer();
  }

  function routePageFeatures() {
    const page = document.body.dataset.page;
    if (page === "home") {
      renderFeaturedProducts();
      renderStorySectors();
      renderContentLibrary();
      renderReviews();
      renderFaqs();
    }
    if (page === "collection") {
      renderCollectionPage();
    }
    if (page === "details") {
      renderDetailsPage();
    }
    if (page === "reviews") {
      renderReviews();
      renderFaqs();
    }
  }

  function renderNavbar() {
    const mount = document.querySelector('[data-component="navbar"]');
    if (!mount) return;

    const page = document.body.dataset.page || "home";
    const engineLinks = [
      { href: "collection.html", label: "All Engines" },
      { href: "collection.html?category=N57%20Engines", label: "N57 Engines" },
      { href: "collection.html?category=N47%20Engines", label: "N47 Engines" },
      { href: "collection.html?category=M57%20Engines", label: "M57 Engines" },
      { href: "collection.html?category=B57%20Engines", label: "B57 Engines" },
      { href: "collection.html?category=B47%20Engines", label: "B47 Engines" },
      { href: "collection.html?category=B58%20Engines", label: "B58 Engines" }
    ];
    const links = [
      { href: "index.html", label: "Home", key: "home" },
      { href: "collection.html?category=M57%20Swap%20Kits", label: "M57 Swap Kits", key: "collection" },
      { href: "services.html", label: "Services", key: "services" },
      { href: "about.html", label: "About Us", key: "about" },
      { href: "contact.html", label: "Contact Us", key: "contact" },
      { href: "policies.html", label: "Policies", key: "policies" },
      { href: "blog.html", label: "Blog", key: "blog" },
      { href: "reviews.html", label: "Reviews", key: "reviews" }
    ];
    const enginesActive = page === "collection" || page === "details";

    mount.innerHTML = `
      <header id="siteHeader" class="fixed top-0 z-50 w-full border-b border-transparent bg-transparent backdrop-blur-xl">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="index.html" data-transition class="group inline-flex items-center gap-3">
            <img src="assets/images/logo-mark.svg" width="36" height="36" alt="Original Bavarian Engine logo" />
            <span class="text-sm font-semibold tracking-[0.18em] text-[var(--text)]">ORIGINAL BAVARIAN ENGINE</span>
          </a>

          <nav class="hidden items-center gap-6 lg:flex" aria-label="Primary">
            <div class="group relative">
              <a href="collection.html" data-transition class="inline-flex items-center gap-1 text-xs tracking-wide transition hover:text-[var(--accent-blue)] ${enginesActive ? "text-[var(--accent-blue)]" : "text-[var(--text)]"}" aria-label="Open engine collection">
                Engines
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 9 6 6 6-6"/></svg>
              </a>
              <div class="invisible absolute left-0 top-full z-30 mt-3 w-56 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/95 p-2 opacity-0 shadow-2xl transition duration-200 group-hover:visible group-hover:opacity-100">
                ${engineLinks
                  .map(
                    (link) => `
                  <a href="${link.href}" data-transition class="block rounded-xl px-3 py-2 text-xs tracking-wide text-[var(--text)] transition hover:bg-[var(--glass)] hover:text-[var(--accent-blue)]">${link.label}</a>
                `
                  )
                  .join("")}
              </div>
            </div>
            ${links
              .map(
                (link) => `
              <a href="${link.href}" data-transition class="text-xs tracking-wide transition hover:text-[var(--accent-blue)] ${
                page === link.key ? "text-[var(--accent-blue)]" : "text-[var(--text)]"
              }" ${page === link.key ? 'aria-current="page"' : ""}>${link.label}</a>
            `
              )
              .join("")}
          </nav>

          <div class="hidden items-center gap-2 lg:flex">
            <form data-global-search-form class="relative">
              <label for="desktopGlobalSearch" class="sr-only">Search engines</label>
              <input
                id="desktopGlobalSearch"
                data-global-search-input
                type="search"
                placeholder="Search engine code..."
                class="w-56 rounded-full border border-[var(--border)] bg-black/20 px-4 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent-blue)]"
              />
            </form>
            <button data-open-compare type="button" class="relative rounded-full border border-[var(--border)] p-2 text-[var(--text)] transition hover:border-[var(--accent-blue)]" aria-label="Open compare drawer">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3v18M16 3v18M4 8h8M12 16h8"/></svg>
              <span data-compare-count class="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full bg-[var(--accent-blue)] px-1.5 text-center text-[10px] font-semibold text-white">0</span>
            </button>
            <div class="relative rounded-full border border-[var(--border)] p-2 text-[var(--text)]" aria-label="Wishlist count">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-4.35-9.33-8.2A5.6 5.6 0 0 1 12 5.2a5.6 5.6 0 0 1 9.33 7.6C19 16.65 12 21 12 21Z"/></svg>
              <span data-wishlist-count class="absolute -right-1.5 -top-1.5 min-w-[18px] rounded-full bg-[var(--accent-blue)] px-1.5 text-center text-[10px] font-semibold text-white">0</span>
            </div>
            <button data-theme-toggle type="button" class="rounded-full border border-[var(--border)] p-2 text-[var(--text)] transition hover:border-[var(--accent-blue)]" aria-label="Toggle light and dark mode"></button>
          </div>

          <div class="flex items-center gap-2 lg:hidden">
            <button data-theme-toggle type="button" class="rounded-full border border-[var(--border)] p-2 text-[var(--text)]" aria-label="Toggle light and dark mode"></button>
            <button id="mobileMenuToggle" type="button" class="rounded-full border border-[var(--border)] p-2 text-[var(--text)]" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobileMenu">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
        <div id="mobileMenu" class="hidden border-t border-[var(--border)] bg-[var(--bg)]/95 px-4 py-4 lg:hidden">
          <form data-global-search-form class="mb-4">
            <label for="mobileGlobalSearch" class="sr-only">Search engines</label>
            <input
              id="mobileGlobalSearch"
              data-global-search-input
              type="search"
              placeholder="Search engine code..."
              class="w-full rounded-full border border-[var(--border)] bg-black/15 px-4 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent-blue)]"
            />
          </form>
          <nav class="grid gap-2 pb-2" aria-label="Mobile">
            <p class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Engine Categories</p>
            ${engineLinks
              .map(
                (link) => `
              <a href="${link.href}" data-transition class="text-sm text-[var(--text)]">${link.label}</a>
            `
              )
              .join("")}
            <hr class="my-2 border-[var(--border)]" />
            <p class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Site Menu</p>
            ${links
              .map(
                (link) => `
              <a href="${link.href}" data-transition class="text-sm tracking-wide ${
                page === link.key ? "text-[var(--accent-blue)]" : "text-[var(--text)]"
              }">${link.label}</a>
            `
              )
              .join("")}
          </nav>
          <div class="mt-3 flex items-center gap-2">
            <button data-open-compare type="button" class="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)]">
              Compare
              <span data-compare-count class="rounded-full bg-[var(--accent-blue)] px-2 py-0.5 text-xs text-white">0</span>
            </button>
            <div class="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)]">
              Wishlist
              <span data-wishlist-count class="rounded-full bg-[var(--accent-blue)] px-2 py-0.5 text-xs text-white">0</span>
            </div>
          </div>
        </div>
      </header>
    `;

    const mobileToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", function () {
        const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
        mobileToggle.setAttribute("aria-expanded", String(!expanded));
        mobileMenu.classList.toggle("hidden");
      });
    }

    document.querySelectorAll("[data-global-search-form]").forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = form.querySelector("[data-global-search-input]");
        const query = input ? input.value.trim() : "";
        const target = query ? `collection.html?query=${encodeURIComponent(query)}` : "collection.html";
        window.location.href = target;
      });
    });

    document.querySelectorAll("[data-open-compare]").forEach((button) => {
      button.addEventListener("click", openCompareDrawer);
    });
  }

  function renderFooter() {
    const mount = document.querySelector('[data-component="footer"]');
    if (!mount) return;

    mount.innerHTML = `
      <footer class="mt-20 border-t border-[var(--border)] bg-[var(--bg-elevated)]/75">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
          <div class="md:col-span-2">
            <p class="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Original Bavarian Engine</p>
            <h2 class="mt-3 text-2xl font-semibold text-[var(--text)]">Preserving BMW heritage with verified original engines.</h2>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              We source and deliver only original old BMW engines and vintage Bavarian powertrain components with documented provenance, condition reporting, and protected international shipping.
            </p>
            <ul class="mt-4 grid gap-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)] sm:grid-cols-3">
              <li class="rounded-full border border-[var(--border)] px-3 py-2 text-center">VIN Matching</li>
              <li class="rounded-full border border-[var(--border)] px-3 py-2 text-center">Global Freight</li>
              <li class="rounded-full border border-[var(--border)] px-3 py-2 text-center">Collector Support</li>
            </ul>
            <form class="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" data-newsletter-form>
              <label for="newsletterEmailFooter" class="sr-only">Email for newsletter</label>
              <input id="newsletterEmailFooter" type="email" required placeholder="Enter your email" class="w-full rounded-full border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent-blue)]" />
              <button type="submit" class="btn-primary rounded-full px-5 py-2.5 text-sm font-medium transition">Join Newsletter</button>
            </form>
            <p data-newsletter-message class="mt-3 text-xs text-[var(--muted)]" aria-live="polite"></p>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text)]">Quick Links</h3>
            <ul class="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li><a data-transition href="collection.html" class="transition hover:text-[var(--accent-blue)]">Browse Collection</a></li>
              <li><a data-transition href="services.html" class="transition hover:text-[var(--accent-blue)]">Services</a></li>
              <li><a data-transition href="engine-details.html" class="transition hover:text-[var(--accent-blue)]">Engine Details</a></li>
              <li><a data-transition href="about.html" class="transition hover:text-[var(--accent-blue)]">Our Story</a></li>
              <li><a data-transition href="reviews.html" class="transition hover:text-[var(--accent-blue)]">Reviews</a></li>
              <li><a data-transition href="contact.html" class="transition hover:text-[var(--accent-blue)]">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text)]">Direct Contact</h3>
            <ul class="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li><a href="tel:+4915510030835" class="transition hover:text-[var(--accent-blue)]">+49 15510 030835</a></li>
              <li><a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="transition hover:text-[var(--accent-blue)]">WhatsApp Chat</a></li>
              <li><a href="mailto:originalbavarianengine@gmail.com" class="transition hover:text-[var(--accent-blue)]">originalbavarianengine@gmail.com</a></li>
              <li>Worldwide shipping from Germany</li>
            </ul>
          </div>
        </div>
      </footer>
    `;
  }

  function renderGlobalWidgets() {
    if (!document.querySelector('a[data-global-whatsapp], a[data-page-whatsapp]')) {
      const whatsapp = document.createElement("a");
      whatsapp.href = WHATSAPP_URL;
      whatsapp.target = "_blank";
      whatsapp.rel = "noopener noreferrer";
      whatsapp.dataset.globalWhatsapp = "true";
      whatsapp.setAttribute("aria-label", "Chat on WhatsApp");
      whatsapp.className =
        "fixed bottom-20 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105";
      whatsapp.innerHTML =
        '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.84 11.84 0 0 0 12.05 0 11.98 11.98 0 0 0 1.8 17.95L0 24l6.22-1.63A12 12 0 0 0 12 24h.01a11.99 11.99 0 0 0 8.5-20.52Zm-8.51 18.5h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.21-3.69.97.99-3.59-.23-.37a9.96 9.96 0 1 1 8.37 4.59Zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.48.71.31 1.26.5 1.69.65.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.08-.12-.27-.2-.57-.35Z"/></svg>WhatsApp';
      document.body.append(whatsapp);
    }

    if (!document.getElementById("backToTop")) {
      const button = document.createElement("button");
      button.id = "backToTop";
      button.type = "button";
      button.className =
        "fixed bottom-6 right-6 z-40 translate-y-4 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3 text-[var(--text)] opacity-0 shadow-xl";
      button.setAttribute("aria-label", "Back to top");
      button.innerHTML =
        '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 15 6-6 6 6"/></svg>';
      document.body.append(button);
    }

    if (!document.getElementById("compareDrawer")) {
      const drawer = document.createElement("aside");
      drawer.id = "compareDrawer";
      drawer.className =
        "compare-drawer fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-[var(--border)] bg-[var(--bg)]/95 p-6 backdrop-blur-xl";
      drawer.setAttribute("aria-label", "Compare selected engines");
      drawer.innerHTML = `
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-[var(--text)]">Compare Engines</h2>
          <button id="closeCompareDrawer" type="button" class="rounded-full border border-[var(--border)] p-2 text-[var(--text)]" aria-label="Close compare drawer">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <p class="mt-2 text-sm text-[var(--muted)]">Select up to 3 original engines for a side-by-side quick review.</p>
        <div id="compareContent" class="mt-5 space-y-3"></div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button id="clearCompare" type="button" class="btn-secondary rounded-full px-4 py-2 text-sm">Clear</button>
          <a href="collection.html" data-transition class="btn-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm">Browse More</a>
        </div>
      `;
      document.body.append(drawer);
    }

    const closeButton = document.getElementById("closeCompareDrawer");
    if (closeButton) closeButton.addEventListener("click", closeCompareDrawer);
    const clearButton = document.getElementById("clearCompare");
    if (clearButton) {
      clearButton.addEventListener("click", function () {
        state.compare.clear();
        persistSet(STORAGE_KEYS.compare, state.compare);
        updateCounterBadges();
        refreshCompareDrawer();
      });
    }
  }

  function renderFeaturedProducts() {
    const mount = document.getElementById("featuredGrid");
    if (!mount) return;

    const seen = new Set();
    const featured = data.products.filter((product) => {
      if (seen.has(product.category)) return false;
      seen.add(product.category);
      return true;
    }).slice(0, 6);
    mount.innerHTML = featured.map((product) => buildProductCard(product)).join("");
    bindProductActions(mount);
    initRevealOnScroll();
  }

  function renderStorySectors() {
    if (typeof window.OBE_BUILD_STORY_SECTORS === "function") {
      window.OBE_BUILD_STORY_SECTORS();
    }

    const mount = document.getElementById("storySectorMount");
    const nav = document.getElementById("storySectorNav");
    const totalEl = document.getElementById("storySectorTotal");
    const sectors = (window.OBE_DATA && window.OBE_DATA.storySectors) || window.OBE_STORY_SECTORS || [];
    if (!mount || !sectors.length) return;

    const visibleBySector = {};
    sectors.forEach((sector) => {
      visibleBySector[sector.key] = 12;
    });

    if (totalEl) {
      const total = sectors.reduce((sum, sector) => sum + (sector.items ? sector.items.length : 0), 0);
      totalEl.textContent = `${total.toLocaleString("en-US")} content pieces across ${sectors.length} sectors`;
    }

    if (nav) {
      nav.innerHTML = sectors
        .map(
          (sector) => `
          <a href="#story-sector-${escapeHtml(sector.key)}" class="story-sector-chip whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.14em]">
            ${String(sector.index).padStart(2, "0")}. ${escapeHtml(sector.imageTag.split("—")[0].trim())}
          </a>
        `
        )
        .join("");
    }

    const ctaAttrs = function (href) {
      if (/^https?:/i.test(href)) {
        return `href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"`;
      }
      return `href="${escapeHtml(href)}" data-transition`;
    };

    const render = function () {
      mount.innerHTML = sectors
        .map((sector) => {
          const visibleLimit = visibleBySector[sector.key] || 12;
          const items = sector.items || [];
          const visibleItems = items.slice(0, visibleLimit);
          const remaining = Math.max(items.length - visibleLimit, 0);

          return `
          <article id="story-sector-${escapeHtml(sector.key)}" class="story-sector reveal">
            <div class="mx-auto max-w-4xl text-center">
              <p class="story-sector-eyebrow">${escapeHtml(sector.eyebrow)}</p>
              <h2 class="mt-4 text-3xl leading-tight text-[var(--text)] md:text-5xl">${escapeHtml(sector.headline)}</h2>
              <p class="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[var(--muted)] md:text-base">${escapeHtml(sector.intro)}</p>
            </div>

            <div class="mt-10 grid gap-5 lg:grid-cols-2">
              <div class="story-compare-card rounded-2xl p-6 md:p-8">
                <h3 class="text-lg text-[var(--text)]">${escapeHtml(sector.dealerTitle)}</h3>
                <ul class="mt-5 space-y-3 text-sm text-[var(--muted)]">
                  ${sector.dealerPoints.map((point) => `<li class="story-compare-point">${escapeHtml(point)}</li>`).join("")}
                </ul>
              </div>
              <div class="story-compare-card story-compare-card--accent rounded-2xl p-6 md:p-8">
                <h3 class="text-lg text-[var(--text)]">${escapeHtml(sector.ourTitle)}</h3>
                <ul class="mt-5 space-y-3 text-sm text-[var(--muted)]">
                  ${sector.ourPoints.map((point) => `<li class="story-compare-point story-compare-point--check">${escapeHtml(point)}</li>`).join("")}
                </ul>
                <div class="mt-7 flex flex-wrap gap-3">
                  <a ${ctaAttrs(sector.primaryCta.href)} class="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold">${escapeHtml(sector.primaryCta.label)}</a>
                  <a ${ctaAttrs(sector.secondaryCta.href)} class="btn-secondary rounded-full px-5 py-2.5 text-sm font-semibold">${escapeHtml(sector.secondaryCta.label)}</a>
                </div>
              </div>
            </div>

            <div class="mx-auto mt-12 max-w-4xl space-y-8">
              ${sector.seo
                .map(
                  (block) => `
                <div>
                  <h3 class="text-2xl text-[var(--text)] md:text-3xl">${escapeHtml(block.headline)}</h3>
                  <p class="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">${escapeHtml(block.body)}</p>
                </div>
              `
                )
                .join("")}
              <div class="flex flex-wrap gap-3">
                <a ${ctaAttrs(sector.primaryCta.href)} class="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold">${escapeHtml(sector.primaryCta.label === "Shop engines now" ? "Start with live stock" : sector.primaryCta.label)}</a>
                <a href="blog.html" data-transition class="btn-secondary rounded-full px-5 py-2.5 text-sm font-semibold">Read the long buyer's guide</a>
              </div>
            </div>

            <div class="story-sector-visual mt-10 overflow-hidden rounded-2xl">
              <aside class="story-side-essay story-side-essay--left" aria-label="Left image essay">
                <p class="story-side-kicker">Left panel · ${Number(sector.leftEssay && sector.leftEssay.wordCount).toLocaleString("en-US")} words</p>
                <h3 class="story-side-title">${escapeHtml((sector.leftEssay && sector.leftEssay.title) || "Left narrative")}</h3>
                <div class="story-side-scroll">
                  ${essayToParagraphs(sector.leftEssay && sector.leftEssay.text)}
                </div>
              </aside>
              <figure class="story-sector-figure">
                <img src="${escapeHtml(sector.image)}" alt="${escapeHtml(sector.headline)}" loading="lazy" decoding="async" width="1600" height="900" />
                <figcaption class="story-sector-tag">${escapeHtml(sector.imageTag)}</figcaption>
              </figure>
              <aside class="story-side-essay story-side-essay--right" aria-label="Right image essay">
                <p class="story-side-kicker">Right panel · ${Number(sector.rightEssay && sector.rightEssay.wordCount).toLocaleString("en-US")} words</p>
                <h3 class="story-side-title">${escapeHtml((sector.rightEssay && sector.rightEssay.title) || "Right doctrine")}</h3>
                <div class="story-side-scroll">
                  ${essayToParagraphs(sector.rightEssay && sector.rightEssay.text)}
                </div>
              </aside>
            </div>
            <p class="mt-4 text-center text-xs uppercase tracking-[0.18em] text-[var(--muted)]">${escapeHtml(sector.caption)}</p>

            <div class="mt-10">
              <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">Sector content library</p>
                  <h3 class="mt-1 text-xl text-[var(--text)]">1,500 shortened notes with images</h3>
                </div>
                <p class="text-sm text-[var(--muted)]">${items.length.toLocaleString("en-US")} pieces</p>
              </div>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                ${visibleItems
                  .map(
                    (item) => `
                  <button type="button" class="content-note-card content-note-card--openable overflow-hidden rounded-2xl text-left" data-open-note="${escapeHtml(item.id)}" aria-label="Open full note ${escapeHtml(item.id)}">
                    <div class="content-note-media">
                      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" width="640" height="400" />
                    </div>
                    <div class="p-4">
                      <div class="flex items-center justify-between gap-2">
                        <p class="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">Note ${escapeHtml(item.id.split("-").pop())}</p>
                        <span class="content-note-tag">${escapeHtml(item.tag)}</span>
                      </div>
                      <h4 class="mt-2 text-sm font-semibold leading-snug text-[var(--text)]">${escapeHtml(item.title)}</h4>
                      <p class="mt-2 text-xs leading-relaxed text-[var(--muted)]">${escapeHtml(item.summary)}</p>
                      <p class="content-note-open-label mt-3">Open full note · 1,500+ words</p>
                    </div>
                  </button>
                `
                  )
                  .join("")}
              </div>
              <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-[var(--muted)]">Showing ${visibleItems.length.toLocaleString("en-US")} of ${items.length.toLocaleString("en-US")}</p>
                ${
                  remaining
                    ? `<button type="button" class="btn-secondary rounded-full px-5 py-2.5 text-sm" data-load-story-sector="${escapeHtml(sector.key)}">Load more in this sector (${remaining.toLocaleString("en-US")} remaining)</button>`
                    : `<p class="text-sm text-[var(--muted)]">All 1,500 notes loaded for this sector.</p>`
                }
              </div>
            </div>
          </article>
        `;
        })
        .join("");

      mount.querySelectorAll("[data-load-story-sector]").forEach((button) => {
        button.addEventListener("click", function () {
          const key = button.getAttribute("data-load-story-sector");
          visibleBySector[key] = (visibleBySector[key] || 12) + 24;
          render();
          const anchor = document.getElementById(`story-sector-${key}`);
          if (anchor) {
            const library = anchor.querySelector(".mt-10:last-child") || anchor;
            library.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      });

      bindNoteCardOpeners(mount);
      initRevealOnScroll();
    };

    render();
  }

  function renderContentLibrary() {
    const grid = document.getElementById("contentLibraryGrid");
    const tabs = document.getElementById("contentSectorTabs");
    const stats = document.getElementById("contentSectorStats");
    const countEl = document.getElementById("contentLibraryCount");
    const pagination = document.getElementById("contentLibraryPagination");
    const library = Array.isArray(data.contentLibrary) ? data.contentLibrary : [];
    if (!grid || !tabs || !library.length) return;

    const sectors = [...new Set(library.map((item) => item.sector))];
    let activeSector = "all";
    let visibleLimit = 48;

    if (countEl) {
      countEl.textContent = library.length.toLocaleString("en-US");
    }

    if (stats) {
      stats.innerHTML = sectors
        .map((sector) => {
          const total = library.filter((item) => item.sector === sector).length;
          return `
            <article class="content-sector-stat reveal rounded-2xl px-4 py-3">
              <p class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">${escapeHtml(sector)}</p>
              <p class="mt-1 text-xl font-semibold text-[var(--text)]">${total.toLocaleString("en-US")}</p>
            </article>
          `;
        })
        .join("");
    }

    const renderTabs = function () {
      const options = ["all", ...sectors];
      tabs.innerHTML = options
        .map((sector) => {
          const label = sector === "all" ? "All Sectors" : sector;
          const active = sector === activeSector;
          return `
            <button type="button" data-content-sector="${escapeHtml(sector)}" class="content-sector-tab ${active ? "is-active" : ""} rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] whitespace-nowrap">
              ${escapeHtml(label)}
            </button>
          `;
        })
        .join("");

      tabs.querySelectorAll("[data-content-sector]").forEach((button) => {
        button.addEventListener("click", function () {
          activeSector = button.getAttribute("data-content-sector") || "all";
          visibleLimit = 48;
          renderTabs();
          renderGrid();
        });
      });
    };

    const renderGrid = function () {
      const filtered =
        activeSector === "all" ? library : library.filter((item) => item.sector === activeSector);
      const visible = filtered.slice(0, visibleLimit);

      grid.innerHTML = visible
        .map(
          (item) => `
          <button type="button" class="content-note-card content-note-card--openable reveal overflow-hidden rounded-2xl text-left" data-open-note="${escapeHtml(item.id)}" aria-label="Open full note ${escapeHtml(item.id)}">
            <div class="content-note-media">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" width="640" height="400" />
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between gap-2">
                <p class="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">${escapeHtml(item.sector)}</p>
                <span class="content-note-tag">${escapeHtml(item.tag)}</span>
              </div>
              <h3 class="mt-2 text-base font-semibold leading-snug text-[var(--text)]">${escapeHtml(item.title)}</h3>
              <p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">${escapeHtml(item.summary)}</p>
              <p class="content-note-open-label mt-3">Open full note · 1,500+ words</p>
            </div>
          </button>
        `
        )
        .join("");

      if (pagination) {
        if (filtered.length > visibleLimit) {
          pagination.innerHTML = `
            <p class="text-sm text-[var(--muted)]">Showing ${visible.length.toLocaleString("en-US")} of ${filtered.length.toLocaleString("en-US")} notes</p>
            <button id="loadMoreContent" type="button" class="btn-secondary rounded-full px-6 py-2.5 text-sm">
              Load More Content (${(filtered.length - visibleLimit).toLocaleString("en-US")} remaining)
            </button>
          `;
          const loadMore = document.getElementById("loadMoreContent");
          if (loadMore) {
            loadMore.addEventListener("click", function () {
              visibleLimit += 48;
              renderGrid();
            });
          }
        } else {
          pagination.innerHTML = `
            <p class="text-sm text-[var(--muted)]">Showing all ${filtered.length.toLocaleString("en-US")} notes in this view.</p>
          `;
        }
      }

      bindNoteCardOpeners(grid);
      initRevealOnScroll();
    };

    renderTabs();
    renderGrid();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function essayToParagraphs(text) {
    return String(text || "")
      .split(/\n\n+/)
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  function ensureNoteReaderModal() {
    let modal = document.getElementById("noteReaderModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "noteReaderModal";
    modal.className = "note-reader-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="note-reader-backdrop" data-close-note-reader></div>
      <div class="note-reader-panel" role="dialog" aria-modal="true" aria-labelledby="noteReaderTitle">
        <div class="note-reader-top">
          <div>
            <p id="noteReaderMeta" class="note-reader-meta"></p>
            <h2 id="noteReaderTitle" class="note-reader-title"></h2>
          </div>
          <button type="button" class="note-reader-close" data-close-note-reader aria-label="Close full note">×</button>
        </div>
        <div class="note-reader-hero">
          <img id="noteReaderImage" alt="" width="1200" height="675" />
        </div>
        <div id="noteReaderBody" class="note-reader-body"></div>
      </div>
    `;
    document.body.append(modal);

    modal.querySelectorAll("[data-close-note-reader]").forEach((el) => {
      el.addEventListener("click", closeNoteReader);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeNoteReader();
    });

    return modal;
  }

  function openNoteReader(noteId) {
    const item =
      (typeof window.OBE_FIND_STORY_NOTE === "function" && window.OBE_FIND_STORY_NOTE(noteId)) ||
      null;
    if (!item) return;

    const body =
      typeof window.OBE_BUILD_NOTE_BODY === "function"
        ? window.OBE_BUILD_NOTE_BODY(item)
        : { title: item.title, text: item.summary, wordCount: 0 };

    const modal = ensureNoteReaderModal();
    const titleEl = document.getElementById("noteReaderTitle");
    const metaEl = document.getElementById("noteReaderMeta");
    const imageEl = document.getElementById("noteReaderImage");
    const bodyEl = document.getElementById("noteReaderBody");

    if (titleEl) titleEl.textContent = body.title || item.title;
    if (metaEl) {
      metaEl.textContent = `${item.sector || item.sectorLabel || "Sector note"} · ${item.tag || "Guide"} · ${Number(
        body.wordCount || 0
      ).toLocaleString("en-US")} words · Note ${String(item.id).split("-").pop()}`;
    }
    if (imageEl) {
      imageEl.src = item.image;
      imageEl.alt = item.title;
    }
    if (bodyEl) bodyEl.innerHTML = essayToParagraphs(body.text);

    modal.hidden = false;
    document.body.classList.add("note-reader-open");
    const panel = modal.querySelector(".note-reader-panel");
    if (panel) panel.scrollTop = 0;
  }

  function closeNoteReader() {
    const modal = document.getElementById("noteReaderModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("note-reader-open");
  }

  function bindNoteCardOpeners(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-open-note]").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const noteId = button.getAttribute("data-open-note");
        if (noteId) openNoteReader(noteId);
      });
    });
  }

  function renderCollectionPage() {
    const mount = document.getElementById("collectionGrid");
    const searchInput = document.getElementById("collectionSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const resultMeta = document.getElementById("collectionMeta");
    const paginationMount = document.getElementById("collectionPagination");
    if (!mount || !searchInput || !categoryFilter || !resultMeta) return;

    const uniqueCategories = [...new Set(data.products.map((product) => product.category))];
    categoryFilter.innerHTML =
      '<option value="all">All Categories</option>' +
      uniqueCategories.map((category) => `<option value="${category}">${category}</option>`).join("");

    const queryParams = new URLSearchParams(window.location.search);
    const initialQuery = queryParams.get("query") || "";
    const initialCategory = queryParams.get("category") || "all";
    searchInput.value = initialQuery;
    categoryFilter.value = uniqueCategories.includes(initialCategory) ? initialCategory : "all";
    let visibleLimit = 24;

    const render = function () {
      const query = searchInput.value.trim().toLowerCase();
      const selectedCategory = categoryFilter.value;
      const filtered = data.products.filter((product) => {
        const inCategory = selectedCategory === "all" || product.category === selectedCategory;
        const searchableText = `${product.code} ${product.title} ${product.year} ${product.condition}`.toLowerCase();
        const inQuery = !query || searchableText.includes(query);
        return inCategory && inQuery;
      });
      const visible = filtered.slice(0, visibleLimit);

      if (!filtered.length) {
        mount.innerHTML = `
          <div class="col-span-full rounded-3xl border border-[var(--border)] p-10 text-center">
            <p class="text-xl text-[var(--text)]">No engines matched your current filters.</p>
            <p class="mt-2 text-sm text-[var(--muted)]">Try searching by engine code or reset to all categories.</p>
          </div>
        `;
      } else {
        mount.innerHTML = visible.map((product) => buildProductCard(product)).join("");
      }

      resultMeta.textContent = `${filtered.length} original engines found`;
      if (paginationMount) {
        if (filtered.length > visibleLimit) {
          paginationMount.innerHTML = `
            <button id="loadMoreEngines" type="button" class="btn-secondary rounded-full px-6 py-2.5 text-sm">
              Load More Engines (${filtered.length - visibleLimit} remaining)
            </button>
          `;
          const loadMore = document.getElementById("loadMoreEngines");
          if (loadMore) {
            loadMore.addEventListener("click", function () {
              visibleLimit += 24;
              render();
            });
          }
        } else {
          paginationMount.innerHTML = `<p class="text-sm text-[var(--muted)]">Showing all matching inventory records.</p>`;
        }
      }
      bindProductActions(mount);
      initRevealOnScroll();
    };

    searchInput.addEventListener("input", function () {
      visibleLimit = 24;
      render();
    });
    categoryFilter.addEventListener("change", function () {
      visibleLimit = 24;
      render();
    });
    render();
  }

  function renderDetailsPage() {
    const title = document.getElementById("detailTitle");
    if (!title) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = data.products.find((entry) => entry.id === id) || data.products[0];

    const price = formatPrice(product.priceEur);
    setText("detailCategory", product.category);
    setText("detailCode", product.code);
    setText("detailTitle", product.title);
    setText("detailCondition", product.condition);
    setText("detailMileage", product.mileage);
    setText("detailYear", product.year);
    setText("detailAvailability", product.availability);
    setText("detailPrice", price);
    setText("detailShipping", product.shipping);
    setText("detailConditionReport", product.conditionReport);

    const mainImage = document.getElementById("detailMainImage");
    if (mainImage) {
      mainImage.src = product.gallery[0];
      mainImage.alt = `${product.title} main view`;
    }

    const thumbs = document.getElementById("detailThumbs");
    if (thumbs) {
      thumbs.innerHTML = product.gallery
        .map(
          (image, index) => `
          <button type="button" data-gallery-image="${image}" class="overflow-hidden rounded-2xl border ${
            index === 0 ? "border-[var(--accent-blue)]" : "border-[var(--border)]"
          }">
            <img src="${image}" alt="${product.code} gallery ${index + 1}" loading="lazy" class="h-20 w-full object-cover" />
          </button>
        `
        )
        .join("");

      thumbs.querySelectorAll("[data-gallery-image]").forEach((button) => {
        button.addEventListener("click", function () {
          const selectedImage = button.getAttribute("data-gallery-image");
          if (mainImage && selectedImage) {
            mainImage.src = selectedImage;
          }
          thumbs.querySelectorAll("button").forEach((item) => item.classList.remove("border-[var(--accent-blue)]"));
          button.classList.add("border-[var(--accent-blue)]");
        });
      });
    }

    const specTable = document.getElementById("specTable");
    if (specTable) {
      const specs = [
        ["Engine Code", product.code],
        ["Displacement", product.displacement],
        ["Power", product.power],
        ["Torque", product.torque],
        ["Fuel System", product.fuelSystem],
        ["Mileage", product.mileage],
        ["Production Year", product.year]
      ];
      specTable.innerHTML = specs
        .map(
          ([label, value]) => `
          <tr class="border-b border-[var(--border)]">
            <th scope="row" class="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">${label}</th>
            <td class="px-4 py-3 text-sm text-[var(--text)]">${value}</td>
          </tr>
        `
        )
        .join("");
    }

    const compatibilityList = document.getElementById("compatibilityList");
    if (compatibilityList) {
      compatibilityList.innerHTML = product.compatibility
        .map((model) => `<li class="rounded-xl border border-[var(--border)] px-4 py-2 text-sm">${model}</li>`)
        .join("");
    }

    const quoteCode = document.getElementById("quoteEngineCode");
    if (quoteCode) quoteCode.value = product.code;

    const detailsActions = document.getElementById("detailsActions");
    if (detailsActions) {
      detailsActions.innerHTML = `
        <button type="button" data-action="wishlist" data-id="${product.id}" class="btn-secondary rounded-full px-5 py-2 text-sm">${state.wishlist.has(product.id) ? "Wishlisted" : "Add to Wishlist"}</button>
        <button type="button" data-action="compare" data-id="${product.id}" class="btn-primary rounded-full px-5 py-2 text-sm">${state.compare.has(product.id) ? "Added to Compare" : "Compare Engine"}</button>
      `;
      bindProductActions(detailsActions);
    }

    const quoteForm = document.getElementById("requestQuoteForm");
    if (quoteForm) {
      quoteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const message = document.getElementById("quoteFormMessage");
        if (message) {
          message.textContent = "Quote request sent. Our specialists will contact you shortly.";
        }
        quoteForm.reset();
      });
    }

    const relatedGrid = document.getElementById("relatedEngineGrid");
    if (relatedGrid) {
      const related = data.products.filter((entry) => entry.id !== product.id).slice(0, 3);
      relatedGrid.innerHTML = related.map((entry) => buildProductCard(entry)).join("");
      bindProductActions(relatedGrid);
      initRevealOnScroll();
    }
  }

  function renderReviews() {
    const mount = document.getElementById("reviewGrid");
    if (!mount) return;
    const page = (document.body.dataset.page || "").toLowerCase();
    const reviewItems = page === "reviews" ? data.reviews : data.reviews.slice(0, 6);
    mount.innerHTML = reviewItems
      .map(
        (review) => `
      <article class="glass-card hover-glow rounded-3xl p-6 reveal">
        <p class="text-sm text-[var(--muted)]">${"★".repeat(review.rating)}<span class="ml-2">Verified Buyer</span></p>
        <p class="mt-4 text-sm leading-relaxed text-[var(--text)]">${review.text}</p>
        <p class="mt-5 text-sm font-medium text-[var(--text)]">${review.name}</p>
        <p class="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">${review.location}</p>
      </article>
    `
      )
      .join("");
    const countMount = document.getElementById("reviewCount");
    if (countMount) {
      countMount.textContent = `${reviewItems.length} verified buyer reviews displayed`;
    }
    initRevealOnScroll();
  }

  function renderFaqs() {
    const mount = document.getElementById("faqList");
    if (!mount) return;
    mount.innerHTML = data.faqs
      .map(
        (faq, index) => `
      <article class="faq-item rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/55">
        <button
          type="button"
          data-accordion-trigger
          class="flex w-full items-center justify-between gap-5 px-5 py-4 text-left text-sm font-medium text-[var(--text)]"
          aria-expanded="false"
          aria-controls="faqContent${index}"
        >
          ${faq.question}
          <span data-accordion-icon class="text-lg text-[var(--accent-blue)]">+</span>
        </button>
        <div id="faqContent${index}" class="accordion-content px-5 pb-0">
          <p class="pb-4 text-sm leading-relaxed text-[var(--muted)]">${faq.answer}</p>
        </div>
      </article>
    `
      )
      .join("");
    initAccordions();
  }

  function bindProductActions(scope) {
    scope.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", function () {
        const id = button.getAttribute("data-id");
        const action = button.getAttribute("data-action");
        if (!id || !action) return;
        if (action === "wishlist") {
          toggleFromSet(state.wishlist, id);
          persistSet(STORAGE_KEYS.wishlist, state.wishlist);
        }
        if (action === "compare") {
          if (state.compare.has(id)) {
            state.compare.delete(id);
          } else if (state.compare.size < 3) {
            state.compare.add(id);
          }
          persistSet(STORAGE_KEYS.compare, state.compare);
          refreshCompareDrawer();
        }
        updateCounterBadges();
        refreshActionButtons(id);
      });
    });
  }

  function refreshActionButtons(id) {
    document.querySelectorAll(`[data-action="wishlist"][data-id="${id}"]`).forEach((button) => {
      button.textContent = state.wishlist.has(id) ? "Wishlisted" : "Add to Wishlist";
    });
    document.querySelectorAll(`[data-action="compare"][data-id="${id}"]`).forEach((button) => {
      button.textContent = state.compare.has(id) ? "Added to Compare" : "Compare Engine";
    });
  }

  function refreshCompareDrawer() {
    const compareContent = document.getElementById("compareContent");
    if (!compareContent) return;

    const products = data.products.filter((product) => state.compare.has(product.id));
    if (!products.length) {
      compareContent.innerHTML = `
        <div class="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
          No engines selected yet. Use "Compare Engine" on any product card.
        </div>
      `;
      return;
    }

    compareContent.innerHTML = products
      .map(
        (product) => `
      <article class="rounded-2xl border border-[var(--border)] p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-[var(--text)]">${product.code}</p>
            <p class="text-xs text-[var(--muted)]">${product.year} • ${product.mileage}</p>
            <p class="mt-1 text-xs text-[var(--muted)]">${product.condition}</p>
          </div>
          <button type="button" data-remove-compare="${product.id}" class="rounded-full border border-[var(--border)] p-1.5 text-[var(--muted)]" aria-label="Remove ${product.code} from compare">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <p class="mt-2 text-sm text-[var(--accent-blue)]">${formatPrice(product.priceEur)}</p>
      </article>
    `
      )
      .join("");

    compareContent.querySelectorAll("[data-remove-compare]").forEach((button) => {
      button.addEventListener("click", function () {
        const id = button.getAttribute("data-remove-compare");
        if (!id) return;
        state.compare.delete(id);
        persistSet(STORAGE_KEYS.compare, state.compare);
        updateCounterBadges();
        refreshCompareDrawer();
        refreshActionButtons(id);
      });
    });
  }

  function initStickyHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const onScroll = function () {
      header.classList.toggle("nav-scrolled", window.scrollY > 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  function initBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;
    const onScroll = function () {
      const visible = window.scrollY > 460;
      button.style.opacity = visible ? "1" : "0";
      button.style.transform = visible ? "translateY(0)" : "translateY(14px)";
    };
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  function initPageTransitions() {
    document.querySelectorAll("a[data-transition]").forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || anchor.target === "_blank") return;
        if (/^(mailto:|tel:|https?:\/\/)/.test(href)) return;
        event.preventDefault();
        document.body.classList.add("page-leave");
        window.setTimeout(function () {
          window.location.href = href;
        }, 210);
      });
    });
  }

  function initTheme() {
    const preferred = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
    setTheme(preferred);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", function () {
        const next = document.documentElement.classList.contains("light-mode") ? "dark" : "light";
        setTheme(next);
      });
    });
  }

  function setTheme(theme) {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.innerHTML =
        theme === "light"
          ? '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 12.79A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.79Z"/></svg>'
          : '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2.2M19.8 12H22M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/></svg>';
    });
  }

  function initLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    window.addEventListener("load", function () {
      loader.classList.add("is-loaded");
    });
  }

  function initRevealOnScroll() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((element) => observer.observe(element));
  }

  function initParallax() {
    const elements = document.querySelectorAll("[data-parallax]");
    if (!elements.length) return;

    const run = function () {
      const top = window.scrollY;
      elements.forEach((element) => {
        const factor = Number(element.getAttribute("data-parallax")) || 0.08;
        element.style.transform = `translateY(${top * factor}px)`;
      });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
  }

  function initTiltCards() {
    const cards = document.querySelectorAll("[data-tilt]");
    if (!cards.length) return;

    cards.forEach((card) => {
      const maxTilt = Number(card.getAttribute("data-tilt-max")) || 8;
      card.addEventListener("mousemove", function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
      if (trigger.dataset.bound === "true") return;
      trigger.dataset.bound = "true";
      trigger.addEventListener("click", function () {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        const panelId = trigger.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        const icon = trigger.querySelector("[data-accordion-icon]");
        if (!expanded) {
          panel.style.maxHeight = `${panel.scrollHeight + 2}px`;
          if (icon) icon.textContent = "−";
        } else {
          panel.style.maxHeight = "0";
          if (icon) icon.textContent = "+";
        }
      });
    });
  }

  function initNewsletterForms() {
    document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const message = form.parentElement ? form.parentElement.querySelector("[data-newsletter-message]") : null;
        if (message) {
          message.textContent = "Thank you for joining. You are now on the restoration insight list.";
        }
        form.reset();
      });
    });
  }

  function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const status = document.getElementById("contactFormStatus");
      if (status) {
        status.textContent = "Your message has been submitted. We will respond within one business day.";
      }
      contactForm.reset();
    });
  }

  function initGsapAnimations() {
    if (!window.gsap) return;
    const targets = document.querySelectorAll("[data-gsap-hero]");
    if (!targets.length) return;
    window.gsap.from(targets, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      stagger: 0.12
    });
  }

  function updateCounterBadges() {
    document.querySelectorAll("[data-wishlist-count]").forEach((badge) => {
      badge.textContent = String(state.wishlist.size);
    });
    document.querySelectorAll("[data-compare-count]").forEach((badge) => {
      badge.textContent = String(state.compare.size);
    });
  }

  function buildProductCard(product) {
    return `
      <article class="glass-card hover-glow reveal overflow-hidden rounded-3xl">
        <div class="relative">
          <img src="${product.image}" alt="${product.title}" loading="lazy" class="h-52 w-full object-cover" />
          <span class="absolute left-4 top-4 rounded-full border border-[var(--border)] bg-black/60 px-3 py-1 text-xs text-[var(--white-soft)]">${product.category}</span>
          <span class="absolute right-4 top-4 rounded-full border border-white/40 bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--white-soft)]">Original Unit</span>
        </div>
        <div class="space-y-3 p-5">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-semibold text-[var(--text)]">${product.code}</h3>
            <p class="text-sm font-medium text-[var(--accent-blue)]">${formatPrice(product.priceEur)}</p>
          </div>
          <p class="line-clamp-2 text-sm text-[var(--muted)]">${product.title}</p>
          <p class="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">VIN matching support available</p>
          <dl class="grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
            <div><dt class="font-medium uppercase">Condition</dt><dd>${product.condition}</dd></div>
            <div><dt class="font-medium uppercase">Mileage</dt><dd>${product.mileage}</dd></div>
            <div><dt class="font-medium uppercase">Year</dt><dd>${product.year}</dd></div>
            <div><dt class="font-medium uppercase">Availability</dt><dd>${product.availability}</dd></div>
          </dl>
          <div class="grid grid-cols-2 gap-2 pt-2">
            <button type="button" data-action="wishlist" data-id="${product.id}" class="btn-secondary rounded-full px-3 py-2 text-xs">${state.wishlist.has(product.id) ? "Wishlisted" : "Wishlist"}</button>
            <button type="button" data-action="compare" data-id="${product.id}" class="btn-secondary rounded-full px-3 py-2 text-xs">${state.compare.has(product.id) ? "Added" : "Compare"}</button>
            <a href="engine-details.html?id=${encodeURIComponent(product.id)}" data-transition class="btn-primary col-span-2 inline-flex justify-center rounded-full px-3 py-2 text-xs">View Details</a>
          </div>
        </div>
      </article>
    `;
  }

  function openCompareDrawer() {
    const drawer = document.getElementById("compareDrawer");
    if (drawer) drawer.classList.add("open");
  }

  function closeCompareDrawer() {
    const drawer = document.getElementById("compareDrawer");
    if (drawer) drawer.classList.remove("open");
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("en-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function persistSet(key, setValue) {
    localStorage.setItem(key, JSON.stringify([...setValue]));
  }

  function loadJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function toggleFromSet(setValue, id) {
    if (setValue.has(id)) {
      setValue.delete(id);
    } else {
      setValue.add(id);
    }
  }
})();
