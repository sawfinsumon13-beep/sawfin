const ENGINE_CATEGORIES = [
  {
    title: 'N57 ENGINES',
    badge: '3.0L DIESEL',
  badgeType: 'diesel',
    models: '330d · 530d · X5 · X6 torque',
    image: 'https://images.unsplash.com/photo-1763836223247-e44e2753883e?w=900&q=80',
    href: '/engines?family=N57'
  },
  {
    title: 'N47 ENGINES',
    badge: '2.0L DIESEL',
    badgeType: 'diesel',
    models: '320d · 520d · 118d · X3',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80',
    href: '/engines?family=N47'
  },
  {
    title: 'M57 ENGINES',
    badge: 'SWAP READY',
    badgeType: 'swap',
    models: 'Defender & 4x4 conversions',
    image: 'https://images.unsplash.com/photo-1760713174351-4e7350ff797e?w=900&q=80',
    href: '/m57-swap-kits'
  },
  {
    title: 'B57 ENGINES',
    badge: 'EURO 6',
    badgeType: 'euro',
    models: 'G30 530d · X5 G05',
    image: 'https://images.unsplash.com/photo-1753183514957-0e50d201a6fa?w=900&q=80',
    href: '/engines?family=B57'
  },
  {
    title: 'B47 ENGINES',
    badge: 'EURO 6',
    badgeType: 'euro',
    models: 'F30 LCI · X3 · X4',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=900&q=80',
    href: '/engines?family=B47'
  },
  {
    title: 'M54 ENGINES',
    badge: 'PETROL',
    badgeType: 'petrol',
    models: 'E46 330i · E39 530i · Z3',
    image: 'https://images.unsplash.com/photo-1688701108480-0db760644684?w=900&q=80',
    href: '/engines?family=M54'
  },
  {
    title: 'M20 ENGINES',
    badge: 'CLASSIC',
    badgeType: 'classic',
    models: 'E30 restoration · E21 · E28',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80',
    href: '/engines?family=M20&era=classic'
  },
  {
    title: 'B58 ENGINES',
    badge: 'TURBO PETROL',
    badgeType: 'petrol',
    models: '340i · 440i · X3 M40i',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
    href: '/engines?family=B58'
  },
  {
    title: 'S54 ENGINES',
    badge: 'M POWER',
    badgeType: 'm',
    models: 'E46 M3 · track builds',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80',
    href: '/engines?family=S54'
  }
];

const RECENT_PURCHASES = [
  { name: 'Marco', city: 'Milan, Italy', engine: 'BMW X5 F15 30d N57D30B Engine', price: '€3,200', ago: '12 minutes ago' },
  { name: 'Thomas', city: 'Hamburg, Germany', engine: 'BMW E46 330i M54B30 Engine', price: '€1,850', ago: '28 minutes ago' },
  { name: 'James', city: 'Birmingham, UK', engine: 'BMW F30 320d N47D20C Engine', price: '€2,100', ago: '45 minutes ago' },
  { name: 'Stefan', city: 'Vienna, Austria', engine: 'BMW E39 530d M57D30 Engine', price: '€2,650', ago: '1 hour ago' },
  { name: 'Peter', city: 'Rotterdam, Netherlands', engine: 'BMW G30 530d B57D30 Engine', price: '€4,100', ago: '2 hours ago' },
  { name: 'Alexandre', city: 'Lyon, France', engine: 'BMW E46 M3 S54B32 Engine', price: '€5,800', ago: '3 hours ago' }
];

function renderHomepageContent() {
  const container = document.getElementById('homepageContent');
  if (!container) return;

  const cards = ENGINE_CATEGORIES.map(cat => `
    <a href="${cat.href}" class="category-card">
      <img class="category-card-bg" src="${cat.image}" alt="${cat.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
      <div class="category-card-overlay"></div>
      <span class="category-badge badge-${cat.badgeType}">${cat.badge}</span>
      <div class="category-card-content">
        <h3>${cat.title}</h3>
        <p>${cat.models}</p>
      </div>
    </a>
  `).join('');

  container.innerHTML = `
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Browse by Series</span>
          <h2>BMW Engine Collections</h2>
          <p>3,100+ tested engines — select your series to explore inventory, specs, and pricing.</p>
        </div>
        <div class="category-grid">${cards}</div>
      </div>
    </section>

    <section class="premium-strip">
      <div class="container premium-strip-grid">
        <div class="premium-strip-item">
          <span class="strip-number">01</span>
          <h3>Dyno-Tested</h3>
          <p>Every engine compression-tested, leak-down verified, and run on our SuperFlow dynamometer before sale.</p>
        </div>
        <div class="premium-strip-item">
          <span class="strip-number">02</span>
          <h3>6-Month Warranty</h3>
          <p>Comprehensive mechanical warranty on all tested units. Documented results included with every purchase.</p>
        </div>
        <div class="premium-strip-item">
          <span class="strip-number">03</span>
          <h3>EU-Wide Shipping</h3>
          <p>Palletised delivery to 28 countries. Transit insurance, tracking, and customs documentation included.</p>
        </div>
        <div class="premium-strip-item">
          <span class="strip-number">04</span>
          <h3>Expert Support</h3>
          <p>Free fitment consultation from certified BMW technicians. Call +49 176 13627363 for advice.</p>
        </div>
      </div>
    </section>

    <section class="classic-showcase-section">
      <div class="container">
        <div class="classic-showcase-layout">
          <div class="classic-showcase-text">
            <span class="section-tag">Classic Heritage</span>
            <h2>Old BMW Engines — Restored &amp; Ready</h2>
            <p>From M10 and M20 classics to legendary M30 straight-sixes and S54 M Power units — we stock the old engines that keep BMW history alive. Each unit is photographed, tested, and documented with compression readings you can trust.</p>
            <ul class="classic-list">
              <li>M10 · M20 · M30 — E21, E30, E28 restorations</li>
              <li>M50 · M52 · M54 — E36, E39, E46 daily drivers</li>
              <li>M57 · M47 — diesel swaps &amp; 4x4 conversions</li>
              <li>S14 · S38 · S50 · S54 — motorsport &amp; collector builds</li>
            </ul>
            <a href="/engines?era=classic" class="btn btn-primary">Browse Classic Engines</a>
          </div>
          <div class="classic-showcase-visual">
            <div class="classic-photo-stack">
              <img src="https://images.unsplash.com/photo-1688701108480-0db760644684?w=600&q=80" alt="Old BMW engine" loading="lazy">
              <img src="https://images.unsplash.com/photo-1760713174351-4e7350ff797e?w=600&q=80" alt="Vintage engine" loading="lazy">
              <img src="https://images.unsplash.com/photo-1753183514957-0e50d201a6fa?w=600&q=80" alt="Classic engine parts" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-section">
      <div class="container trust-grid">
        <div class="trust-stat">
          <strong>15,000+</strong>
          <span>Engines Sold Since 2003</span>
        </div>
        <div class="trust-stat">
          <strong>99.7%</strong>
          <span>Customer Satisfaction</span>
        </div>
        <div class="trust-stat">
          <strong>0.4%</strong>
          <span>Return Rate</span>
        </div>
        <div class="trust-stat">
          <strong>4–6 hrs</strong>
          <span>Testing Per Engine</span>
        </div>
      </div>
    </section>
  `;

  initPurchaseToast();
}

function initPurchaseToast() {
  if (document.getElementById('purchaseToast')) return;

  const toast = document.createElement('div');
  toast.id = 'purchaseToast';
  toast.className = 'purchase-toast';
  toast.innerHTML = '<div class="purchase-toast-inner"></div>';
  document.body.appendChild(toast);

  let index = 0;
  function show() {
    const p = RECENT_PURCHASES[index % RECENT_PURCHASES.length];
    toast.querySelector('.purchase-toast-inner').innerHTML = `
      <span class="purchase-dot"></span>
      <p><strong>${p.name}</strong> from ${p.city} recently purchased <em>${p.engine}</em> for <strong>${p.price}</strong> · ${p.ago}</p>
    `;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 5000);
    index++;
  }

  setTimeout(show, 4000);
  setInterval(show, 12000);
}

document.addEventListener('DOMContentLoaded', renderHomepageContent);
