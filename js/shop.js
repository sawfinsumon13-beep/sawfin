/* Shop catalog — loads 2000 engines from products.json */

const SHOP = {
  perPage: 12,
  products: [],
  filtered: [],
  page: 1,
  category: 'all',
};

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function formatEuro(n) {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const s = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${s},${String(cents).padStart(2, '0')} €`;
}

function stockClass(stock) {
  if (stock === 'Out of stock') return ' out';
  if (stock === 'Low stock') return ' low';
  return '';
}

function updateProductSeo(p) {
  const base = (window.SEO_BASE_URL || window.location.origin).replace(/\/$/, '');
  const pageUrl = `${base}/product.html?id=${p.id}`;
  const title = `${p.title} | Buy Used BMW Engine | Bavarian Engines`;
  const desc = `Buy used original BMW engine: ${p.title}. Code ${p.code}, ${p.year}, ${p.hp} HP. BMW engines for sale from Bavarian Engines Hamburg — VIN match available.`;
  const image = p.image.startsWith('http') ? p.image : `${base}/${p.image.replace(/^\//, '')}`;

  document.title = title;

  const setMeta = (attr, name, content) => {
    const sel = `meta[${attr}="${name}"]`;
    let el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', image);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = pageUrl;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: desc,
    image,
    sku: p.sku,
    brand: { '@type': 'Brand', name: 'BMW' },
    category: p.categoryLabel,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'EUR',
      availability: p.stock === 'Out of stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Bavarian Engines', url: base },
      url: pageUrl,
    },
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.productSeo = 'true';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function renderProductCard(p) {
  const thumbs = p.thumbnails.map((src, i) =>
    `<button type="button" class="product-thumb${i === 0 ? ' active' : ''}" data-src="${src}" aria-label="View image ${i + 1}">
      <img src="${src}" alt="" loading="lazy">
    </button>`
  ).join('');

  return `<article class="product-card" data-id="${p.id}" data-category="${p.category}">
    <div class="product-image-wrap">
      <span class="product-sale-badge">Sale</span>
      <a href="product.html?id=${p.id}" class="product-image-link">
        <img class="product-main-img" src="${p.image}" alt="${p.title}" loading="lazy">
      </a>
      <div class="product-thumbs">${thumbs}</div>
    </div>
    <div class="product-body">
      <div class="product-category">${p.categoryLabel}</div>
      <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
      <div class="product-price">
        <span class="price-current">${p.priceFormatted}</span>
        <span class="price-old">${p.oldPriceFormatted}</span>
      </div>
      <p class="product-stock-label${stockClass(p.stock)}">${p.stock}</p>
      <button type="button" class="btn btn-cart add-to-cart" data-id="${p.id}" ${p.stock === 'Out of stock' ? 'disabled' : ''}>Add to cart</button>
    </div>
  </article>`;
}

function applyFilter() {
  SHOP.filtered = SHOP.category === 'all'
    ? SHOP.products
    : SHOP.products.filter((p) => p.category === SHOP.category);
  SHOP.page = 1;
}

function renderPagination() {
  const total = SHOP.filtered.length;
  const pages = Math.ceil(total / SHOP.perPage) || 1;
  const start = (SHOP.page - 1) * SHOP.perPage + 1;
  const end = Math.min(SHOP.page * SHOP.perPage, total);
  const el = document.getElementById('shop-results-info');
  const pag = document.getElementById('shop-pagination');

  if (el) {
    el.innerHTML = `Showing <strong>${start}–${end}</strong> of <strong>${total}</strong> results`;
  }

  if (!pag) return;

  let html = '';
  if (SHOP.page > 1) html += `<button class="page-btn" data-page="${SHOP.page - 1}">← Prev</button>`;

  const maxButtons = 7;
  let startPage = Math.max(1, SHOP.page - 3);
  let endPage = Math.min(pages, startPage + maxButtons - 1);
  startPage = Math.max(1, endPage - maxButtons + 1);

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn${i === SHOP.page ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }

  if (SHOP.page < pages) html += `<button class="page-btn" data-page="${SHOP.page + 1}">Next →</button>`;
  pag.innerHTML = html;

  pag.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      SHOP.page = Number(btn.dataset.page);
      renderShop();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderShop() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const start = (SHOP.page - 1) * SHOP.perPage;
  const slice = SHOP.filtered.slice(start, start + SHOP.perPage);
  grid.innerHTML = slice.map(renderProductCard).join('');
  renderPagination();
  bindProductCardEvents();
}

function bindProductCardEvents() {
  document.querySelectorAll('.product-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const card = thumb.closest('.product-card');
      const main = card.querySelector('.product-main-img');
      main.src = thumb.dataset.src;
      card.querySelectorAll('.product-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => handleAddToCart(Number(btn.dataset.id)));
  });
}

function handleAddToCart(id) {
  if (typeof window.addToCart === 'function') {
    window.addToCart(id, 1);
  }
  const btn = document.querySelector(`.add-to-cart[data-id="${id}"]`);
  if (btn) {
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = 'Add to cart'; }, 1500);
  }
}

function bindFilters() {
  document.querySelectorAll('.filter-tag[data-filter]').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      SHOP.category = tag.dataset.filter;
      document.querySelectorAll('.filter-tag').forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      applyFilter();
      renderShop();
      const url = new URL(window.location);
      if (SHOP.category === 'all') url.searchParams.delete('cat');
      else url.searchParams.set('cat', SHOP.category);
      history.replaceState({}, '', url);
    });
  });
}

async function initShop() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const cat = getQueryParam('cat');
  if (cat) SHOP.category = cat;

  try {
    const res = await fetch('js/products.json');
    SHOP.products = await res.json();
    applyFilter();

    if (cat) {
      document.querySelectorAll('.filter-tag').forEach((t) => {
        t.classList.toggle('active', t.dataset.filter === cat);
      });
    }

    renderShop();
    bindFilters();
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
  } catch (err) {
    grid.innerHTML = '<p style="color:#888;">Unable to load engine catalog. Please refresh.</p>';
    console.error(err);
  }
}

async function initCategoryPage() {
  const grid = document.getElementById('category-products-grid');
  const cat = document.body.dataset.category;
  if (!grid || !cat) return;

  try {
    const res = await fetch('js/products.json');
    const all = await res.json();
    const filtered = all.filter((p) => p.category === cat).slice(0, 24);
    grid.innerHTML = filtered.map(renderProductCard).join('');
    bindProductCardEvents();
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();

    const countEl = document.getElementById('category-count');
    if (countEl) {
      countEl.textContent = all.filter((p) => p.category === cat).length;
    }
  } catch (err) {
    grid.innerHTML = '<p>Unable to load products.</p>';
  }
}

async function initProductPage() {
  const container = document.getElementById('product-detail');
  const id = Number(getQueryParam('id'));
  if (!container || !id) return;

  try {
    const res = await fetch('js/products.json');
    const all = await res.json();
    const p = all.find((x) => x.id === id);
    if (!p) {
      container.innerHTML = '<p>Product not found. <a href="shop.html">Back to shop</a></p>';
      return;
    }

    const thumbs = p.thumbnails.map((src, i) =>
      `<button type="button" class="product-thumb${i === 0 ? ' active' : ''}" data-src="${src}">
        <img src="${src}" alt="">
      </button>`
    ).join('');

    container.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-detail-gallery">
          <span class="product-sale-badge">Sale</span>
          <img id="detail-main-img" src="${p.image}" alt="${p.title}">
          <div class="product-thumbs product-thumbs-lg">${thumbs}</div>
        </div>
        <div class="product-detail-info">
          <div class="product-category">${p.categoryLabel}</div>
          <h1>${p.title}</h1>
          <p class="detail-meta">Engine Code: <strong>${p.code}</strong> · Year: ${p.year} · ${p.hp} HP · SKU: ${p.sku}</p>
          <div class="product-price" style="margin:1.25rem 0;">
            <span class="price-current" style="font-size:1.75rem;">${p.priceFormatted}</span>
            <span class="price-old">${p.oldPriceFormatted}</span>
          </div>
          <p class="product-stock-label${stockClass(p.stock)}">${p.stock}</p>
          <button class="btn btn-cart add-to-cart" data-id="${p.id}" style="width:100%;margin:1rem 0;" ${p.stock === 'Out of stock' ? 'disabled' : ''}>Add to cart</button>
          <a href="${window.SITE_WA_URL || 'https://wa.me/4915510030835'}?text=${encodeURIComponent('Hi, I am interested in ' + p.title + ' (SKU: ' + p.sku + ')')}" class="btn btn-whatsapp" style="width:100%;" target="_blank" rel="noopener">WhatsApp enquiry</a>
          <div class="detail-includes" style="margin-top:2rem;">
            <h3>What's included</h3>
            <ul>
              <li>Documented donor mileage and engine-code stamp</li>
              <li>6-month mechanical warranty</li>
              <li>Compression test figures on request</li>
              <li>Secure pallet/crate export from Hamburg</li>
            </ul>
          </div>
        </div>
      </div>`;

    container.querySelectorAll('.product-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        document.getElementById('detail-main-img').src = thumb.dataset.src;
        container.querySelectorAll('.product-thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    container.querySelector('.add-to-cart')?.addEventListener('click', () => handleAddToCart(p.id));
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    updateProductSeo(p);
  } catch (err) {
    container.innerHTML = '<p>Error loading product.</p>';
  }
}

if (window.SPA_MODE) {
  window.initShop = initShop;
  window.initCategoryPage = initCategoryPage;
  window.initProductPage = initProductPage;
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initShop();
    initCategoryPage();
    initProductPage();
  });
}

window.renderProductCard = renderProductCard;
window.bindProductCardEvents = bindProductCardEvents;
