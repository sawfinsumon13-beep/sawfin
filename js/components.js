/* Shared components — header, footer, navigation */

const SITE = {
  name: 'bmwusedengines',
  domain: 'bmwusedengines.com',
  email: 'flashkingpro202@gmail.com',
  phone: '+49 176 13627363',
  whatsapp: '4917613627363',
  location: 'Hamburg, Germany'
};

const NAV_ITEMS = [
  { label: 'HOME', href: '/' },
  {
    label: 'ENGINES',
    href: '/engines',
    dropdown: [
      { label: 'All Engines', href: '/engines' },
      { label: 'Petrol Engines', href: '/engines?fuel=petrol' },
      { label: 'Diesel Engines', href: '/engines?fuel=diesel' },
      { label: 'M Performance', href: '/engines?series=M' },
      { label: 'Classic Engines', href: '/engines?era=classic' },
      { label: 'Modern Engines', href: '/engines?era=modern' }
    ]
  },
  { label: 'M57 SWAP KITS', href: '/m57-swap-kits' },
  { label: 'SERVICES', href: '/services' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CONTACT US', href: '/contact' },
  { label: 'POLICIES', href: '/policies' },
  { label: 'BLOG', href: '/blog' },
  { label: 'REVIEWS', href: '/reviews' }
];

function getActivePage() {
  let path = window.location.pathname.split('/').pop() || '';
  if (!path || path === 'index.html') return '/';
  return '/' + path.replace(/\.html$/, '');
}

function renderHeader() {
  const active = getActivePage();
  const navLinks = NAV_ITEMS.map(item => {
    const isActive = active === item.href || (item.dropdown && item.dropdown.some(d => active === d.href.split('?')[0]));
    const dropdownHtml = item.dropdown ? `
      <div class="dropdown">
        ${item.dropdown.map(d => `<a href="${pageUrl(d.href)}">${d.label}</a>`).join('')}
      </div>` : '';
    const arrow = item.dropdown ? '<svg viewBox="0 0 10 6" fill="currentColor"><path d="M1 1l4 4 4-4"/></svg>' : '';
    return `
      <div class="nav-item">
        <a href="${pageUrl(item.href)}" class="nav-link${isActive ? ' active' : ''}">${item.label}${arrow}</a>
        ${dropdownHtml}
      </div>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="${pageUrl('/')}" class="logo">
          <div class="logo-icon logo-icon--bmw">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#1c69d4" stroke="#0f4fa8" stroke-width="0.5"/>
              <path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="0.6" opacity="0.5"/>
              <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="#fff" opacity="0.9"/>
              <path d="M4 4h7v7H4zM13 13h7v7h-7z" fill="#1c69d4" opacity="0.85"/>
            </svg>
          </div>
          <span class="logo-text">BMWUSEDENGINES</span>
        </a>
        <nav class="main-nav" id="mainNav">${navLinks}</nav>
        <div class="header-actions">
          <button class="mobile-toggle" id="mobileToggle" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button class="icon-btn" id="searchBtn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <a href="${pageUrl('/engines')}" class="icon-btn" aria-label="Shop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </a>
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
            <a href="${pageUrl('/')}" class="logo">
              <div class="logo-icon logo-icon--bmw">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#1c69d4" stroke="#0f4fa8" stroke-width="0.5"/>
                  <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="#fff" opacity="0.9"/>
                  <path d="M4 4h7v7H4zM13 13h7v7h-7z" fill="#1c69d4" opacity="0.85"/>
                </svg>
              </div>
              <span class="logo-text">BMWUSEDENGINES</span>
            </a>
            <p>Europe's go-to source for tested used BMW engines. 3,100+ units in stock — petrol, diesel, classic, and modern — shipped with warranty.</p>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <a href="${pageUrl('/engines')}">All Engines</a>
            <a href="${pageUrl('/engines?fuel=diesel')}">Diesel Engines</a>
            <a href="${pageUrl('/engines?series=M')}">M Performance</a>
            <a href="${pageUrl('/m57-swap-kits')}">M57 Swap Kits</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="${pageUrl('/about')}">About Us</a>
            <a href="${pageUrl('/services')}">Services</a>
            <a href="${pageUrl('/blog')}">Blog</a>
            <a href="${pageUrl('/reviews')}">Reviews</a>
            <a href="${pageUrl('/policies')}">Policies</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="mailto:${SITE.email}">${SITE.email}</a>
            <a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a>
            <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Chat</a>
            <a href="${pageUrl('/contact')}">Contact Form</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
          <span>${SITE.location}</span>
        </div>
      </div>
    </footer>`;
}

function renderWhatsAppButton() {
  const message = encodeURIComponent('Hello bmwusedengines, I would like to enquire about a BMW engine.');
  return `
    <a href="https://wa.me/${SITE.whatsapp}?text=${message}" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>`;
}

function initLayout() {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = renderHeader();
  if (footerEl) footerEl.innerHTML = renderFooter();

  if (!document.querySelector('.whatsapp-float')) {
    document.body.insertAdjacentHTML('beforeend', renderWhatsAppButton());
  }

  document.getElementById('mobileToggle')?.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    const isOpen = nav?.classList.toggle('mobile-open');
    document.body.classList.toggle('nav-open', Boolean(isOpen));
  });

  document.getElementById('mainNav')?.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      document.getElementById('mainNav')?.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
    }
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
      html += `<a href="${pageUrl(`/engine-detail?id=${e.id}`)}" class="search-result-item">
        <strong>${e.name}</strong><span>${e.code} — €${e.price.toLocaleString()}</span></a>`;
    });
    blogResults.forEach(b => {
      html += `<a href="${pageUrl(`/blog-post?id=${b.id}`)}" class="search-result-item">
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
