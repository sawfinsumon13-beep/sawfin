/* Shared site header, footer, and UI chrome */

const SITE = {
  phone: '+880 1757 453611',
  wa: '8801757453611',
  email: 'sawfin@gmail.com',
};

function getActivePage() {
  return document.body.dataset.page || '';
}

function renderHeader(active) {
  const enginesActive = ['shop', 'n47', 'n57', 'b47', 'b57', 'b58', 'm57'].includes(active);
  const isActive = (p) => (active === p ? ' active' : '');

  return `
  <div class="announcement-bar">
    <div class="container">
      Free VIN match at Bavarian Engines — send your chassis number or suffix code for same-day BMW compatibility from Hamburg.
      <a href="contact.html">Request match →</a>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <span class="logo-icon" aria-hidden="true"></span>
        <span class="logo-text">Bavarian<br>Engines</span>
      </a>
      <nav class="nav-desktop" aria-label="Main navigation">
        <a href="index.html"${isActive('home')}>Home</a>
        <div class="nav-dropdown${enginesActive ? ' open' : ''}" id="engines-dropdown">
          <button class="nav-link" type="button" aria-expanded="false">Engines ▾</button>
          <div class="nav-dropdown-menu">
            <a href="shop.html">All Engines</a>
            <a href="n47-engines.html">N47 Engines</a>
            <a href="n57-engines.html">N57 Engines</a>
            <a href="b47-engines.html">B47 Engines</a>
            <a href="b57-engines.html">B57 Engines</a>
            <a href="b58-engines.html">B58 Engines</a>
            <a href="m57-engines.html">M57 Engines</a>
          </div>
        </div>
        <a href="m57-swap-kits.html"${isActive('m57-kits')}>M57 Swap Kits</a>
        <a href="services.html"${isActive('services')}>Services</a>
        <a href="about.html"${isActive('about')}>About Us</a>
        <a href="contact.html"${isActive('contact')}>Contact Us</a>
        <a href="policies.html"${isActive('policies')}>Policies</a>
        <a href="blog.html"${isActive('blog')}>Blog</a>
        <a href="reviews.html"${isActive('reviews')}>Reviews</a>
      </nav>
      <div class="header-actions">
        <button class="header-icon-btn" id="search-toggle" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <a href="cart.html" class="header-icon-btn" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-badge">0</span>
        </a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="nav-mobile" aria-label="Mobile navigation">
      <a href="index.html">Home</a>
      <a href="shop.html">All Engines</a>
      <a href="n47-engines.html">N47 Engines</a>
      <a href="n57-engines.html">N57 Engines</a>
      <a href="b47-engines.html">B47 Engines</a>
      <a href="b57-engines.html">B57 Engines</a>
      <a href="b58-engines.html">B58 Engines</a>
      <a href="m57-engines.html">M57 Engines</a>
      <a href="m57-swap-kits.html">M57 Swap Kits</a>
      <a href="services.html">Services</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact Us</a>
      <a href="policies.html">Policies</a>
      <a href="blog.html">Blog</a>
      <a href="reviews.html">Reviews</a>
      <a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">WhatsApp</a>
    </nav>
  </header>
  <div class="search-overlay" id="search-overlay">
    <form class="search-box" id="search-form">
      <input type="search" placeholder="Search engines (e.g. N47, 530d, M57)..." aria-label="Search">
      <button type="submit" class="btn btn-primary">Search</button>
    </form>
  </div>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <span class="logo-icon" aria-hidden="true"></span>
            <span class="logo-text">Bavarian<br>Engines</span>
          </a>
          <p>Hamburg BMW engine exchange. Tested motors with VIN verification, documented mileage, and 6-month warranty.</p>
        </div>
        <div class="footer-col">
          <h4>Engines</h4>
          <a href="shop.html">All Engines</a>
          <a href="n47-engines.html">N47</a>
          <a href="n57-engines.html">N57</a>
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
          <a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener">WhatsApp: ${SITE.phone}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="contact.html">Tilsiter Str. 90, Hamburg</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Bavarian Engines. All rights reserved.</span>
        <span>Tilsiter Str. 90, 22047 Hamburg, Germany</span>
      </div>
    </div>
  </footer>
  <a href="https://wa.me/${SITE.wa}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>`;
}

function getCartCountQuick() {
  try {
    const raw = JSON.parse(localStorage.getItem('be-cart') || '[]');
    if (!Array.isArray(raw) || !raw.length) return 0;
    if (typeof raw[0] === 'object' && raw[0].id != null) {
      return raw.reduce((sum, item) => sum + item.qty, 0);
    }
    return raw.length;
  } catch {
    return 0;
  }
}

function refreshCartBadge() {
  const count = typeof window.getCartCount === 'function' ? window.getCartCount() : getCartCountQuick();
  document.querySelectorAll('.cart-badge').forEach((b) => {
    b.textContent = count > 99 ? '99+' : count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderPurchaseToast() {
  return `
  <div class="purchase-toast" id="purchase-toast" role="status">
    <span class="check">✓</span>
    <strong>Henrik</strong> from Copenhagen, Denmark recently purchased
    <strong>BMW 118D F20 B47D20A Engine</strong> for €2,200 · 1 minute ago
  </div>`;
}

function initSiteChrome() {
  const active = getActivePage();
  document.body.insertAdjacentHTML('afterbegin', renderHeader(active));
  document.body.insertAdjacentHTML('beforeend', renderFooter());
  if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
  else refreshCartBadge();
  if (active === 'home') {
    document.body.insertAdjacentHTML('beforeend', renderPurchaseToast());
    setTimeout(() => {
      const toast = document.getElementById('purchase-toast');
      if (toast) toast.style.display = 'none';
    }, 8000);
  }

  const dropdown = document.getElementById('engines-dropdown');
  dropdown?.querySelector('.nav-link')?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    const btn = dropdown.querySelector('.nav-link');
    btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
  });

  document.addEventListener('click', () => dropdown?.classList.remove('open'));

  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  searchToggle?.addEventListener('click', () => searchOverlay?.classList.add('open'));
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove('open');
  });

  document.getElementById('search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input').value.trim().toLowerCase();
    if (!q) return;
    const map = { n47: 'n47-engines.html', n57: 'n57-engines.html', b47: 'b47-engines.html', b57: 'b57-engines.html', b58: 'b58-engines.html', m57: 'm57-engines.html', defender: 'm57-swap-kits.html', swap: 'm57-swap-kits.html' };
    for (const [key, url] of Object.entries(map)) {
      if (q.includes(key)) { window.location.href = url; return; }
    }
    window.location.href = 'shop.html';
  });
}

document.addEventListener('DOMContentLoaded', initSiteChrome);
