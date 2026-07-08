/* Shared components — header, footer, navigation */

const SITE = {
  name: 'Premium BMW Engines',
  domain: 'premiumbmwengines.com',
  email: 'flashkingpro202@gmail.com',
  phone: '+49 176 13627363',
  location: 'Hamburg, Germany'
};

const NAV_ITEMS = [
  { label: 'HOME', href: 'index.html' },
  {
    label: 'ENGINES',
    href: 'engines.html',
    dropdown: [
      { label: 'All Engines', href: 'engines.html' },
      { label: 'Petrol Engines', href: 'engines.html?fuel=petrol' },
      { label: 'Diesel Engines', href: 'engines.html?fuel=diesel' },
      { label: 'M Performance', href: 'engines.html?series=M' },
      { label: 'Classic Engines', href: 'engines.html?era=classic' },
      { label: 'Modern Engines', href: 'engines.html?era=modern' }
    ]
  },
  { label: 'M57 SWAP KITS', href: 'm57-swap-kits.html' },
  { label: 'SERVICES', href: 'services.html' },
  { label: 'ABOUT US', href: 'about.html' },
  { label: 'CONTACT US', href: 'contact.html' },
  { label: 'POLICIES', href: 'policies.html' },
  { label: 'BLOG', href: 'blog.html' },
  { label: 'REVIEWS', href: 'reviews.html' }
];

function getActivePage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

function renderHeader() {
  const active = getActivePage();
  const navLinks = NAV_ITEMS.map(item => {
    const isActive = active === item.href || (item.dropdown && item.dropdown.some(d => active === d.href.split('?')[0]));
    const dropdownHtml = item.dropdown ? `
      <div class="dropdown">
        ${item.dropdown.map(d => `<a href="${d.href}">${d.label}</a>`).join('')}
      </div>` : '';
    const arrow = item.dropdown ? '<svg viewBox="0 0 10 6" fill="currentColor"><path d="M1 1l4 4 4-4"/></svg>' : '';
    return `
      <div class="nav-item">
        <a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}${arrow}</a>
        ${dropdownHtml}
      </div>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3v18M3 12h18"/>
            </svg>
          </div>
          <span class="logo-text">PREMIUM BMW ENGINES</span>
        </a>
        <nav class="main-nav" id="mainNav">${navLinks}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="searchBtn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <a href="engines.html" class="icon-btn" aria-label="Shop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </a>
          <button class="mobile-toggle" id="mobileToggle" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
    <div class="search-modal" id="searchModal">
      <div class="search-modal-inner">
        <input type="text" id="searchInput" placeholder="Search engines, blog posts, services..." autocomplete="off">
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>`;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>
                </svg>
              </div>
              <span class="logo-text">PREMIUM BMW ENGINES</span>
            </a>
            <p>Europe's leading supplier of premium BMW engines. Over 3,000 tested units in stock — from classic M20 to modern B58 powerplants.</p>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <a href="engines.html">All Engines</a>
            <a href="engines.html?fuel=diesel">Diesel Engines</a>
            <a href="engines.html?series=M">M Performance</a>
            <a href="m57-swap-kits.html">M57 Swap Kits</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="about.html">About Us</a>
            <a href="services.html">Services</a>
            <a href="blog.html">Blog</a>
            <a href="reviews.html">Reviews</a>
            <a href="policies.html">Policies</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="mailto:${SITE.email}">${SITE.email}</a>
            <a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a>
            <a href="contact.html">Contact Form</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
          <span>${SITE.location}</span>
        </div>
      </div>
    </footer>`;
}

function initLayout() {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = renderHeader();
  if (footerEl) footerEl.innerHTML = renderFooter();

  document.getElementById('mobileToggle')?.addEventListener('click', () => {
    document.getElementById('mainNav')?.classList.toggle('mobile-open');
  });

  const searchModal = document.getElementById('searchModal');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  searchBtn?.addEventListener('click', () => {
    searchModal?.classList.add('active');
    searchInput?.focus();
  });

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchModal?.classList.remove('active');
  });

  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
  });
}

async function performSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl || !query || query.length < 2) {
    if (resultsEl) resultsEl.innerHTML = '';
    return;
  }

  resultsEl.innerHTML = '<div class="loading"><div class="spinner"></div>Searching...</div>';

  try {
    const [enginesRes, blogsRes] = await Promise.all([
      fetch('data/engines/search-index.json').then(r => r.json()).catch(() => []),
      fetch('data/blogs/index.json').then(r => r.json()).catch(() => ({ posts: [] }))
    ]);

    const q = query.toLowerCase();
    const engineResults = enginesRes.filter(e =>
      e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.series.toLowerCase().includes(q)
    ).slice(0, 8);

    const blogResults = (blogsRes.posts || []).filter(b =>
      b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    ).slice(0, 5);

    let html = '';
    engineResults.forEach(e => {
      html += `<a href="engine-detail.html?id=${e.id}" class="search-result-item">
        <strong>${e.name}</strong><span>${e.code} — €${e.price.toLocaleString()}</span></a>`;
    });
    blogResults.forEach(b => {
      html += `<a href="blog-post.html?id=${b.id}" class="search-result-item">
        <strong>${b.title}</strong><span>${b.category}</span></a>`;
    });

    resultsEl.innerHTML = html || '<div class="search-result-item"><span>No results found</span></div>';
  } catch {
    resultsEl.innerHTML = '<div class="search-result-item"><span>Search unavailable</span></div>';
  }
}

function formatPrice(price) {
  return '€' + price.toLocaleString('de-DE');
}

function renderPagination(current, total, onPage) {
  const pages = [];
  const maxVisible = 7;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  let html = `<button class="page-btn" ${current <= 1 ? 'disabled' : ''} data-page="${current - 1}">&laquo;</button>`;
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn${i === current ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn" ${current >= total ? 'disabled' : ''} data-page="${current + 1}">&raquo;</button>`;

  const container = document.getElementById('pagination');
  if (!container) return;
  container.innerHTML = html;
  container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => onPage(parseInt(btn.dataset.page)));
  });
}

document.addEventListener('DOMContentLoaded', initLayout);
