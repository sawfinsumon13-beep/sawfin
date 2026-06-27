/* VeloCore — Main JavaScript */

// Theme
function initTheme() {
  const saved = localStorage.getItem('velocore-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('velocore-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// Header scroll
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Back to top
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Scroll reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

// FAQ accordion
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// Counter animation
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }
      }, 1000 / 60);
      observer.unobserve(el);
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// Cart (localStorage)
const Cart = {
  key: 'velocore-cart',
  get() { return JSON.parse(localStorage.getItem(this.key) || '[]'); },
  save(items) { localStorage.setItem(this.key, JSON.stringify(items)); this.updateBadge(); },
  add(product) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) existing.qty++;
    else items.push({ ...product, qty: 1 });
    this.save(items);
    showToast('Added to cart');
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  updateQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = Math.max(1, qty); this.save(items); }
  },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
  updateBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = this.count();
      el.style.display = this.count() > 0 ? 'flex' : 'none';
    });
  },
  render() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    if (!container) return;
    const items = this.get();
    if (items.length === 0) {
      container.innerHTML = '<p class="text-center" style="padding:60px 0;color:var(--text-muted)">Your cart is empty. <a href="shop.html" style="color:var(--accent)">Browse engines</a></p>';
      if (summary) summary.innerHTML = '';
      return;
    }
    container.innerHTML = items.map(item => `
      <tr>
        <td>
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <strong>${item.name}</strong>
              <div style="font-size:0.8rem;color:var(--text-muted)">${item.code}</div>
            </div>
          </div>
        </td>
        <td>€${item.price.toLocaleString()}</td>
        <td>
          <div class="qty-control">
            <button onclick="Cart.updateQty('${item.id}', ${item.qty - 1}); Cart.render()">−</button>
            <span>${item.qty}</span>
            <button onclick="Cart.updateQty('${item.id}', ${item.qty + 1}); Cart.render()">+</button>
          </div>
        </td>
        <td><strong>€${(item.price * item.qty).toLocaleString()}</strong></td>
        <td><button onclick="Cart.remove('${item.id}'); Cart.render()" style="background:none;border:none;cursor:pointer;color:#ef4444">✕</button></td>
      </tr>
    `).join('');
    const subtotal = this.total();
    const shipping = subtotal > 500 ? 0 : 49.99;
    const tax = subtotal * 0.21;
    const total = subtotal + shipping + tax;
    if (summary) {
      summary.innerHTML = `
        <h3 style="margin-bottom:20px">Order Summary</h3>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.9rem"><span>Subtotal</span><span>€${subtotal.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.9rem"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '€' + shipping.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.9rem"><span>VAT (21%)</span><span>€${tax.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.2rem;border-top:1px solid var(--border);padding-top:16px;margin:16px 0 24px"><span>Total</span><span>€${total.toFixed(2)}</span></div>
        <a href="checkout.html" class="btn btn-primary" style="width:100%">Proceed to Checkout</a>
      `;
    }
  }
};

// Wishlist
const Wishlist = {
  key: 'velocore-wishlist',
  get() { return JSON.parse(localStorage.getItem(this.key) || '[]'); },
  toggle(product) {
    let items = this.get();
    if (items.find(i => i.id === product.id)) {
      items = items.filter(i => i.id !== product.id);
      showToast('Removed from wishlist');
    } else {
      items.push(product);
      showToast('Added to wishlist');
    }
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadge();
  },
  has(id) { return this.get().some(i => i.id === id); },
  updateBadge() {
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = this.get().length;
      el.style.display = this.get().length > 0 ? 'flex' : 'none';
    });
  }
};

// Toast notification
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:12px 24px;border-radius:12px;z-index:9999;font-size:0.9rem;transition:opacity 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// Add to cart buttons
function initProductButtons() {
  document.querySelectorAll('[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.dataset.product);
      if (btn.classList.contains('wishlist-btn')) Wishlist.toggle(data);
      else Cart.add(data);
    });
  });
}

// Product gallery
function initGallery() {
  const main = document.getElementById('gallery-main');
  if (!main) return;
  document.querySelectorAll('.product-gallery-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      main.src = thumb.src;
      document.querySelectorAll('.product-gallery-thumbs img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab)?.classList.add('active');
    });
  });
}

// Search
function initSearch() {
  document.querySelectorAll('.search-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input?.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
}

// Shop filters
function initShopFilters() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  if (search) {
    const label = document.getElementById('search-label');
    if (label) label.textContent = `Results for "${search}"`;
    document.querySelectorAll('.product-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(search.toLowerCase()) ? '' : 'none';
    });
  }
  document.querySelectorAll('.filter-group select, .filter-group input').forEach(el => {
    el.addEventListener('change', filterProducts);
  });
}

function filterProducts() {
  const family = document.getElementById('filter-family')?.value || '';
  const fuel = document.getElementById('filter-fuel')?.value || '';
  const inStock = document.getElementById('filter-stock')?.checked;
  document.querySelectorAll('.product-card').forEach(card => {
    let show = true;
    if (family && card.dataset.family !== family) show = false;
    if (fuel && card.dataset.fuel !== fuel) show = false;
    if (inStock && card.dataset.stock !== 'in') show = false;
    card.style.display = show ? '' : 'none';
  });
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.innerHTML = '<div style="text-align:center;padding:40px"><h3 style="margin-bottom:12px">Message Sent!</h3><p style="color:var(--text-muted)">We\'ll get back to you within 24 hours.</p></div>';
  });
}

// Newsletter
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.innerHTML = '<p style="color:var(--accent);font-weight:600">Thank you for subscribing!</p>';
    });
  });
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initMobileMenu();
  initBackToTop();
  initReveal();
  initFAQ();
  initCounters();
  initProductButtons();
  initGallery();
  initTabs();
  initSearch();
  initShopFilters();
  initContactForm();
  initNewsletter();
  Cart.updateBadge();
  Wishlist.updateBadge();
  Cart.render();

  document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
});
