(function () {
  const page = document.body.dataset.page || "";
  const posts = window.BLOG_POSTS || [];

  const navigation = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "services.html", label: "Services", page: "services" },
    { href: "case-studies.html", label: "Case Studies", page: "case-studies" },
    { href: "blog.html", label: "Blog", page: "blog" },
    { href: "about.html", label: "About Us", page: "about" },
    { href: "faq.html", label: "FAQ", page: "faq" },
    { href: "contact.html", label: "Contact", page: "contact" }
  ];

  const headerRoot = document.getElementById("site-header");
  const footerRoot = document.getElementById("site-footer");
  if (headerRoot) {
    headerRoot.innerHTML = `
      <header class="top-nav">
        <div class="container nav-inner">
          <a class="brand" href="index.html" aria-label="Ethereum Recovery Service home">
            <span class="brand-dot" aria-hidden="true"></span>
            <span>Ethereum Recovery Service</span>
          </a>
          <button class="icon-btn mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle navigation menu">☰</button>
          <nav class="nav-links" id="nav-links" aria-label="Main navigation">
            ${navigation
              .map(
                (item) =>
                  `<a href="${item.href}" data-page="${item.page}" class="${
                    item.page === page ? "active" : ""
                  }">${item.label}</a>`
              )
              .join("")}
          </nav>
          <div class="nav-actions">
            <button id="theme-toggle" class="icon-btn" aria-label="Toggle dark mode">◐</button>
            <a class="btn btn-primary" href="contact.html">Request Consultation</a>
          </div>
        </div>
      </header>
    `;
  }

  if (footerRoot) {
    footerRoot.innerHTML = `
      <footer class="footer">
        <div class="container footer-inner">
          <section>
            <h3>Ethereum Recovery Service</h3>
            <p>
              Professional digital asset recovery consultation and blockchain investigation guidance for Ethereum users.
            </p>
            <p class="form-note">
              We provide educational and investigative consultation only. No guaranteed recovery claims.
            </p>
          </section>
          <section>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="services.html">Services</a></li>
              <li><a href="case-studies.html">Case Studies</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </section>
          <section>
            <h4>Newsletter</h4>
            <p>Get practical Ethereum safety updates and investigation education.</p>
            <form class="newsletter-form" data-newsletter-form>
              <input type="email" name="email" placeholder="Email address" required />
              <button class="btn btn-secondary" type="submit">Subscribe</button>
            </form>
            <p class="form-status" data-newsletter-status aria-live="polite"></p>
          </section>
        </div>
        <div class="container footer-bottom">
          <span>© <span id="current-year"></span> Ethereum Recovery Service</span>
          <span><a href="legal.html">Legal & Disclaimer</a> · Privacy focused</span>
        </div>
      </footer>
      <button class="btn btn-primary live-chat" id="live-chat-btn" aria-label="Open live chat">
        Live Chat
      </button>
    `;
  }

  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("ers-theme");
  if (storedTheme) {
    document.body.dataset.theme = storedTheme;
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
      if (nextTheme === "dark") {
        delete document.body.dataset.theme;
      } else {
        document.body.dataset.theme = "light";
      }
      localStorage.setItem("ers-theme", nextTheme);
    });
  }

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const liveChatBtn = document.getElementById("live-chat-btn");
  if (liveChatBtn) {
    liveChatBtn.addEventListener("click", () => {
      window.alert(
        "Live chat is currently in secure triage mode. Please submit your case through the consultation form for protected review."
      );
    });
  }

  function initRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function initConsultationForm() {
    const form = document.getElementById("consultation-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent =
        "Your consultation request was submitted securely for initial review. A specialist will contact you shortly.";
      form.reset();
    });
  }

  function initNewsletterForms() {
    const forms = document.querySelectorAll("[data-newsletter-form]");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.parentElement.querySelector("[data-newsletter-status]");
        if (status) {
          status.textContent = "Subscribed. Watch your inbox for Ethereum safety updates.";
        }
        form.reset();
      });
    });
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderBlogCards(data) {
    return data
      .map(
        (post) => `
        <article class="blog-card reveal">
          <div class="blog-meta">
            <span class="badge">${escapeHtml(post.category)}</span>
            <span>${post.readingTime} min read</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.summary)}</p>
          <a class="btn btn-secondary" href="blog-post.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
        </article>
      `
      )
      .join("");
  }

  function initBlogIndex() {
    if (page !== "blog") return;

    const list = document.getElementById("blog-list");
    const summary = document.getElementById("blog-results-summary");
    const searchInput = document.getElementById("blog-search");
    const categoryRoot = document.getElementById("blog-categories");
    if (!list || !summary || !searchInput || !categoryRoot) return;

    const categories = ["All", ...new Set(posts.map((post) => post.category))];
    let activeCategory = "All";
    let searchTerm = "";

    function renderCategories() {
      categoryRoot.innerHTML = categories
        .map(
          (category) => `
          <button class="category-pill ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(
            category
          )}">
            ${escapeHtml(category)}
          </button>
        `
        )
        .join("");
    }

    function filterPosts() {
      const term = searchTerm.trim().toLowerCase();
      return posts.filter((post) => {
        const categoryMatch = activeCategory === "All" || post.category === activeCategory;
        if (!categoryMatch) return false;
        if (!term) return true;
        const haystack = `${post.title} ${post.summary} ${post.keywords.join(" ")}`.toLowerCase();
        return haystack.includes(term);
      });
    }

    function render() {
      const filtered = filterPosts();
      summary.textContent = `${filtered.length} article${filtered.length === 1 ? "" : "s"} found`;
      list.innerHTML = renderBlogCards(filtered);
      initRevealAnimations();
    }

    renderCategories();
    render();

    categoryRoot.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const chosen = target.dataset.category;
      if (!chosen) return;
      activeCategory = chosen;
      renderCategories();
      render();
    });

    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;
      render();
    });
  }

  function initHomeBlogPreview() {
    if (page !== "home") return;
    const root = document.getElementById("home-blog-preview");
    if (!root) return;
    root.innerHTML = renderBlogCards(posts.slice(0, 3));
    initRevealAnimations();
  }

  function initBlogPost() {
    if (page !== "blog-post") return;

    const content = document.getElementById("article-content");
    if (!content) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const post = posts.find((entry) => entry.slug === slug);

    if (!post) {
      content.innerHTML = `
        <h1>Article Not Found</h1>
        <p>The article you requested is unavailable. Browse the blog archive for available educational guides.</p>
        <a class="btn btn-secondary" href="blog.html">Back to Blog</a>
      `;
      return;
    }

    document.title = `${post.title} | Ethereum Recovery Service Blog`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", post.summary);
    }

    content.innerHTML = `
      <p class="eyebrow">${escapeHtml(post.category)}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="blog-meta">
        <span class="badge">${post.readingTime} min read</span>
        <span>Approx. ${post.wordCount} words</span>
        <span>Updated ${post.updatedAt}</span>
      </div>
      <p>${escapeHtml(post.intro)}</p>

      ${post.sections
        .map(
          (section) => `
        <h2>${escapeHtml(section.h2)}</h2>
        <h3>${escapeHtml(section.h3a)}</h3>
        <p>${escapeHtml(section.p1)}</p>
        <h3>${escapeHtml(section.h3b)}</h3>
        <p>${escapeHtml(section.p2)}</p>
      `
        )
        .join("")}

      <h2>Frequently Asked Questions</h2>
      ${post.faq
        .map(
          (item) => `
        <details class="faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>
      `
        )
        .join("")}

      <section class="cta-inline">
        <h2>${escapeHtml(post.ctaTitle)}</h2>
        <p>${escapeHtml(post.ctaBody)}</p>
        <a class="btn btn-primary" href="contact.html">Request Consultation</a>
      </section>
    `;
  }

  initRevealAnimations();
  initConsultationForm();
  initNewsletterForms();
  initBlogIndex();
  initHomeBlogPreview();
  initBlogPost();
})();
