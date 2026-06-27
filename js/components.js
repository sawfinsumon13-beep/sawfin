/* Shared site header, footer, and UI chrome */

const SITE = {
  phone: '+447944470816',
  wa: '447944470816',
  email: 'flashkingpro202@gmail.com',
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
        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile" onclick="window.toggleMobileNav&&window.toggleMobileNav(event)"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="search-overlay" id="search-overlay">
    <form class="search-box" id="search-form">
      <input type="search" placeholder="Search engines (e.g. N47, 530d, M57)..." aria-label="Search">
      <button type="submit" class="btn btn-primary">Search</button>
    </form>
  </div>`;
}

function renderMobileNav() {
  return `
  <button type="button" class="nav-mobile-backdrop" id="nav-mobile-backdrop" aria-hidden="true" tabindex="-1"></button>
  <nav class="nav-mobile" id="nav-mobile" aria-label="Mobile navigation" aria-hidden="true">
    <div class="nav-mobile-head">
      <span class="nav-mobile-title">// menu.nav</span>
      <button type="button" class="nav-mobile-close" id="nav-mobile-close" aria-label="Close menu">×</button>
    </div>
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
  </nav>`;
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
  <div id="google_translate_element" class="google-translate-hidden" aria-hidden="true"></div>
  <div class="lang-switcher" id="lang-switcher">
    <label for="lang-select" class="visually-hidden">Translate page</label>
    <select id="lang-select" aria-label="Translate page">
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="it">Italiano</option>
      <option value="nl">Nederlands</option>
      <option value="pl">Polski</option>
      <option value="pt">Português</option>
      <option value="da">Dansk</option>
      <option value="sv">Svenska</option>
    </select>
  </div>
  <div class="purchase-toast" id="purchase-toast" role="status" hidden>
    <button type="button" class="purchase-toast-close" aria-label="Close notification">×</button>
    <span class="purchase-toast-icon" aria-hidden="true">✓</span>
    <p class="purchase-toast-text" id="purchase-toast-text"></p>
  </div>
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

const PURCHASE_ALERTS = [
  { name: 'Lars', city: 'Brussels', country: 'Belgium', product: 'BMW F10 530d N57D30A Engine', price: '€3.500,00', ago: '5 minutes ago' },
  { name: 'Henrik', city: 'Copenhagen', country: 'Denmark', product: 'BMW 118D F20 B47D20A Engine', price: '€2.200,00', ago: '1 minute ago' },
  { name: 'Sofia', city: 'Stockholm', country: 'Sweden', product: 'BMW F30 320d N47D20C Engine', price: '€1.850,00', ago: '8 minutes ago' },
  { name: 'Marco', city: 'Milan', country: 'Italy', product: 'BMW X5 F15 30d N57D30B Engine', price: '€3.200,00', ago: '12 minutes ago' },
  { name: 'Petra', city: 'Prague', country: 'Czech Republic', product: 'BMW X3 F25 B47D20A Engine', price: '€2.450,00', ago: '3 minutes ago' },
  { name: 'David', city: 'Dublin', country: 'Ireland', product: 'BMW E90 320d N47D20C Engine', price: '€1.650,00', ago: '18 minutes ago' },
  { name: 'Antoine', city: 'Lyon', country: 'France', product: 'BMW G30 530d B57D30B Engine', price: '€4.100,00', ago: '6 minutes ago' },
  { name: 'Katarzyna', city: 'Warsaw', country: 'Poland', product: 'BMW F30 320d N47D20A Engine', price: '€1.900,00', ago: '22 minutes ago' },
];

const PURCHASE_TOAST_PAGES = new Set(['home', 'shop', 'reviews', 'cart', 'checkout', 'n47', 'n57', 'b47', 'b57', 'b58', 'm57']);

function setTranslateCookie(lang) {
  const host = window.location.hostname;
  const clear = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = clear;
  document.cookie = `${clear} domain=${host};`;
  document.cookie = `${clear} domain=.${host};`;
  if (lang && lang !== 'en') {
    const value = `googtrans=/en/${lang}; path=/;`;
    document.cookie = value;
    document.cookie = `${value} domain=${host};`;
    document.cookie = `${value} domain=.${host};`;
  }
}

function initLanguageSwitcher() {
  const select = document.getElementById('lang-select');
  if (!select) return;

  const saved = localStorage.getItem('be-lang') || 'en';
  select.value = saved;

  if (saved !== 'en' && !document.cookie.includes('googtrans')) {
    setTranslateCookie(saved);
    window.location.reload();
    return;
  }

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,de,fr,es,it,nl,pl,pt,da,sv',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.defer = true;
    document.body.appendChild(script);
  }

  select.addEventListener('change', () => {
    const lang = select.value;
    localStorage.setItem('be-lang', lang);
    setTranslateCookie(lang);
    window.location.reload();
  });
}

function renderPurchaseAlert(alert) {
  return `<strong>${alert.name}</strong> from ${alert.city}, ${alert.country} recently purchased <strong>${alert.product}</strong> for <strong>${alert.price}</strong> · ${alert.ago}`;
}

function initPurchaseToast(activePage) {
  const toast = document.getElementById('purchase-toast');
  const text = document.getElementById('purchase-toast-text');
  if (!toast || !text || !PURCHASE_TOAST_PAGES.has(activePage)) return;
  if (sessionStorage.getItem('be-purchase-toast-off') === '1') return;

  let index = Math.floor(Math.random() * PURCHASE_ALERTS.length);

  const show = () => {
    text.innerHTML = renderPurchaseAlert(PURCHASE_ALERTS[index]);
    toast.hidden = false;
    toast.classList.remove('purchase-toast--hide');
    toast.classList.add('purchase-toast--show');
  };

  const hide = () => {
    toast.classList.add('purchase-toast--hide');
    setTimeout(() => { toast.hidden = true; }, 300);
  };

  setTimeout(show, 2500);

  toast.querySelector('.purchase-toast-close')?.addEventListener('click', () => {
    sessionStorage.setItem('be-purchase-toast-off', '1');
    hide();
  });

  setInterval(() => {
    if (sessionStorage.getItem('be-purchase-toast-off') === '1') return;
    index = (index + 1) % PURCHASE_ALERTS.length;
    hide();
    setTimeout(show, 400);
  }, 12000);
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle') || document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  const backdrop = document.getElementById('nav-mobile-backdrop');
  const closeBtn = document.getElementById('nav-mobile-close');
  if (!toggle || !mobileNav) return;

  const setOpen = (open) => {
    mobileNav.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  window.toggleMobileNav = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(!mobileNav.classList.contains('open'));
  };

  if (toggle.dataset.navBound !== '1') {
    toggle.dataset.navBound = '1';
    toggle.addEventListener('click', window.toggleMobileNav);
  }

  closeBtn?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  if (!document.body.dataset.navKeysBound) {
    document.body.dataset.navKeysBound = '1';
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1100) setOpen(false);
    });
  }
}

function initSiteChrome() {
  if (document.body.dataset.chromeReady === '1') return;
  document.body.dataset.chromeReady = '1';

  const active = getActivePage();
  document.body.insertAdjacentHTML('afterbegin', renderHeader(active));
  document.body.insertAdjacentHTML('beforeend', renderFooter());
  document.body.insertAdjacentHTML('beforeend', renderMobileNav());
  if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
  else refreshCartBadge();
  initLanguageSwitcher();
  initPurchaseToast(active);

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

  initMobileNav();
}

function bootSiteChrome() {
  initSiteChrome();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSiteChrome);
} else {
  bootSiteChrome();
}
