#!/usr/bin/env python3
"""Build Harbor Motor Exchange — a SEPARATE website (new design + new content, same purpose)."""

from __future__ import annotations

import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "harbor-motor-exchange.html"
PRODUCTS = ROOT / "js" / "products.json"

SITE = {
    "name": "Harbor Motor Exchange",
    "short": "HME",
    "phone": "+49 176 13627363",
    "wa": "4917613627363",
    "email": "flashkingpro202@gmail.com",
    "address": "Dockside Logistics Park, 22047 Hamburg, Germany",
}

PAGES = {
    "index.html": {
        "page": "home",
        "title": "Used BMW Engines Hamburg | Harbor Motor Exchange",
        "main": """
<section class="hero-split container" style="max-width:1180px;margin:0 auto">
  <div class="hero-visual"><img src="images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp" alt="Used BMW engine prepared for export"></div>
  <div class="hero-copy">
    <span class="eyebrow">Hamburg · Since 2014</span>
    <h1>Quality-tested BMW engines, ready for your workshop</h1>
    <p class="lead">Harbor Motor Exchange sources documented used BMW power units from insured donors. Every motor is stamp-verified, mileage-logged, and cleared for export from our Hamburg facility.</p>
    <div class="hero-cta">
      <a href="#shop.html" class="btn btn-primary">Browse 2,000+ motors</a>
      <a href="https://wa.me/4917613627363" class="btn btn-outline" target="_blank" rel="noopener">WhatsApp your VIN</a>
    </div>
    <div class="hero-stats">
      <div><strong>2,000+</strong><span>Motors listed</span></div>
      <div><strong>6 mo</strong><span>Warranty</span></div>
      <div><strong>EU</strong><span>Wide shipping</span></div>
      <div><strong>VIN</strong><span>Matched</span></div>
    </div>
  </div>
</section>
<div class="wave-divider"></div>
<section class="section">
  <div class="container">
    <div class="section-title"><h2>Why workshops choose Harbor</h2><p>We are not a classifieds board — every engine passes through our Hamburg warehouse with paperwork you can show your customer.</p></div>
    <div class="feature-grid">
      <article class="feature-card"><div class="feature-icon">🔍</div><h3>Stamp verification</h3><p>Engine codes matched to your VIN before we raise an invoice. No suffix surprises on delivery day.</p></article>
      <article class="feature-card"><div class="feature-icon">📋</div><h3>Donor documentation</h3><p>Mileage records, compression figures on request, and inclusion lists that match what arrives on the pallet.</p></article>
      <article class="feature-card"><div class="feature-icon">🛡️</div><h3>Six-month cover</h3><p>Mechanical warranty on correctly installed units — terms explained in plain language before you pay.</p></article>
      <article class="feature-card"><div class="feature-icon">🚚</div><h3>Export crating</h3><p>Tracked freight across Germany, EU, UK, and Ireland. Garages in Poland, France, and Spain order weekly.</p></article>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="container">
    <div class="vin-band">
      <div><h2>Not sure which BMW engine fits?</h2><p>Send your chassis number or a photo of the engine stamp. We reply the same day with compatible stock and a written quote.</p></div>
      <form class="vin-form" id="home-vin-form"><input type="text" placeholder="VIN or engine code (e.g. B57D30A)" aria-label="VIN"><button type="submit" class="btn btn-primary">Check compatibility</button></form>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-title"><h2>Featured motors this week</h2><p>A snapshot from our live inventory — diesel and petrol BMW units.</p></div>
    <div class="products-grid" id="home-featured-grid"></div>
    <p style="text-align:center;margin-top:1.5rem"><a href="#shop.html" class="btn btn-primary">View full catalog</a></p>
  </div>
</section>""",
    },
    "shop.html": {
        "page": "shop",
        "title": "BMW Engine Catalog | Harbor Motor Exchange",
        "main": """
<div class="page-hero"><div class="container"><h1>BMW engine catalog</h1><p>Filter by family or search by model. Prices include Hamburg preparation — shipping quoted after VIN confirmation.</p></div></div>
<section class="section"><div class="container">
  <div class="shop-toolbar">
    <div class="filter-tags" id="shop-filters">
      <button class="filter-tag active" data-filter="all">All families</button>
      <button class="filter-tag" data-filter="n47">N47</button>
      <button class="filter-tag" data-filter="n57">N57</button>
      <button class="filter-tag" data-filter="b47">B47</button>
      <button class="filter-tag" data-filter="b57">B57</button>
      <button class="filter-tag" data-filter="b58">B58</button>
      <button class="filter-tag" data-filter="m57">M57</button>
    </div>
    <p id="shop-count" style="color:var(--ink-soft);font-size:0.9rem"></p>
  </div>
  <div class="products-grid" id="products-grid"></div>
  <div class="pagination" id="shop-pagination"></div>
</div></section>""",
    },
    "product.html": {
        "page": "product",
        "title": "Engine Details | Harbor Motor Exchange",
        "main": '<section class="section"><div class="container" id="product-detail"><p>Loading engine details…</p></div></section>',
    },
    "about.html": {
        "page": "about",
        "title": "About Harbor Motor Exchange | Hamburg BMW Engines",
        "main": """
<div class="page-hero"><div class="container"><h1>About Harbor Motor Exchange</h1><p>Hamburg's specialist desk for used BMW engines — built for garages who need accountability, not guesswork.</p></div></div>
<section class="section"><div class="container" style="max-width:720px">
  <p style="margin-bottom:1rem">Harbor Motor Exchange started when independent workshops told us they were tired of scrap-yard roulette. We built a BMW-only pipeline: insured donors, warehouse inspection, photography, and honest inclusion lists.</p>
  <p style="margin-bottom:1rem">Today we stock over two thousand N47, N57, B47, B57, B58, and M57 units for F-series, G-series, and conversion projects. Our team speaks suffix codes fluently — and answers the phone after your engine lands.</p>
  <p><a href="#contact.html" class="btn btn-primary">Talk to our desk</a></p>
</div></section>""",
    },
    "contact.html": {
        "page": "contact",
        "title": "Contact Harbor Motor Exchange",
        "main": """
<div class="page-hero"><div class="container"><h1>Contact our Hamburg desk</h1><p>Fastest route: WhatsApp with your VIN. We confirm fitment before you transfer funds.</p></div></div>
<section class="section"><div class="container">
  <div class="contact-grid">
    <div class="contact-card"><div class="icon">📍</div><h3>Warehouse</h3><p>Dockside Logistics Park<br>22047 Hamburg, Germany</p></div>
    <div class="contact-card"><div class="icon">💬</div><h3>WhatsApp</h3><p><a href="https://wa.me/4917613627363">+49 176 13627363</a><br>Photos & VIN checks</p></div>
    <div class="contact-card"><div class="icon">✉️</div><h3>Email</h3><p><a href="mailto:flashkingpro202@gmail.com">flashkingpro202@gmail.com</a><br>Quotes & invoices</p></div>
  </div>
  <p style="text-align:center"><a href="https://wa.me/4917613627363" class="btn btn-whatsapp" target="_blank" rel="noopener">Open WhatsApp chat</a></p>
</div></section>""",
    },
    "cart.html": {
        "page": "cart",
        "title": "Your cart | Harbor Motor Exchange",
        "main": '<section class="section"><div class="container"><h1 style="font-family:var(--font-display);margin-bottom:1.5rem">Your cart</h1><div id="cart-items"></div><div id="cart-totals" style="margin-top:2rem"></div></div></section>',
    },
}

for cat, label in [
    ("n47", "N47 diesel"),
    ("n57", "N57 six-cylinder"),
    ("b47", "B47 Euro 6"),
    ("b57", "B57 modern diesel"),
    ("b58", "B58 petrol turbo"),
    ("m57", "M57 & swaps"),
]:
    PAGES[f"{cat}-engines.html"] = {
        "page": cat,
        "title": f"{label} BMW engines | Harbor Motor Exchange",
        "main": f"""
<div class="page-hero"><div class="container"><h1>{label} BMW engines</h1><p>Curated {cat.upper()} stock from our Hamburg warehouse — suffix-matched before dispatch.</p></div></div>
<section class="section"><div class="container">
  <div class="products-grid" id="category-products-grid" data-category="{cat}"></div>
</div></section>""",
    }

# re-open dict was wrong - I need to fix the structure. PAGES dict should include category pages before the closing brace.

# Load CSS from companion file or inline minimal
CSS_PATH = Path(__file__).parent / "harbor-style.css"

CSS_INLINE = r"""
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');
:root{--bg:#f6f3ee;--bg-warm:#efe8dc;--bg-card:#fff;--bg-dark:#1a2f28;--bg-footer:#142820;--ink:#1f2937;--ink-soft:#5c6b7a;--accent:#c45c26;--accent-dark:#9a4418;--accent-soft:#f3e4d8;--forest:#2d5a47;--forest-light:#3d7a61;--border:#e2dcd2;--shadow:0 8px 32px rgba(26,47,40,.08);--shadow-lg:0 20px 50px rgba(26,47,40,.12);--radius:16px;--radius-sm:10px;--font:"Work Sans",system-ui,sans-serif;--font-display:"Fraunces",Georgia,serif;--max:1180px;--header-h:76px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:var(--font);color:var(--ink);background-color:var(--bg);background-image:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40h80M40 0v80' stroke='%23d9cfc0' stroke-width='0.6' fill='none' opacity='0.45'/%3E%3C/svg%3E");line-height:1.65}
img{max-width:100%;display:block;height:auto}a{color:var(--forest);text-decoration:none;transition:color .2s}a:hover{color:var(--accent)}ul{list-style:none}.container{width:100%;max-width:var(--max);margin:0 auto;padding:0 1.25rem}
.top-ribbon{background:var(--bg-dark);color:#d4e8df;font-size:.82rem;text-align:center;padding:.55rem 1rem}.top-ribbon a{color:#f0c9a8;font-weight:600}
.site-header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);box-shadow:0 2px 20px rgba(0,0,0,.04)}
.header-inner{display:flex;align-items:center;justify-content:space-between;min-height:var(--header-h);gap:1rem}
.brand{display:flex;align-items:center;gap:.85rem;color:var(--ink);font-weight:700}
.brand-mark{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--forest),var(--forest-light));display:grid;place-items:center;color:#fff;font-family:var(--font-display);font-size:1.1rem;box-shadow:var(--shadow)}
.brand-text strong{display:block;font-family:var(--font-display);font-size:1.05rem}.brand-text span{font-size:.72rem;color:var(--ink-soft);font-weight:500;text-transform:uppercase;letter-spacing:.08em}
.nav-main{display:flex;gap:.15rem;align-items:center}.nav-main a{padding:.5rem .85rem;border-radius:999px;font-size:.9rem;font-weight:500;color:var(--ink-soft)}.nav-main a:hover,.nav-main a.active{background:var(--accent-soft);color:var(--accent-dark)}
.header-actions{display:flex;align-items:center;gap:.5rem}.icon-btn{width:42px;height:42px;border-radius:50%;border:1px solid var(--border);background:#fff;display:grid;place-items:center;cursor:pointer;position:relative}
.cart-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;background:var(--accent);color:#fff;font-size:.65rem;font-weight:700;border-radius:999px;display:none;align-items:center;justify-content:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.75rem 1.35rem;border-radius:999px;font-weight:600;font-size:.92rem;border:none;cursor:pointer;transition:transform .15s}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(196,92,38,.35)}.btn-outline{background:#fff;border:2px solid var(--forest);color:var(--forest)}.btn-whatsapp{background:#25d366;color:#fff}
.nav-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle span{display:block;width:24px;height:2px;background:var(--ink)}
.hero-split{display:grid;grid-template-columns:1.1fr .9fr;min-height:480px;overflow:hidden;padding:0 1.25rem}
.hero-visual{position:relative;min-height:320px;border-radius:var(--radius);overflow:hidden;margin:1.5rem 0}
.hero-visual img{width:100%;height:100%;object-fit:cover;min-height:320px}
.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:2rem 0}
.eyebrow{display:inline-block;background:var(--accent-soft);color:var(--accent-dark);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;padding:.35rem .85rem;border-radius:999px;margin-bottom:1rem;width:fit-content}
.hero-copy h1{font-family:var(--font-display);font-size:clamp(1.85rem,4vw,2.8rem);line-height:1.12;color:var(--bg-dark);margin-bottom:1rem}
.hero-copy .lead{font-size:1.05rem;color:var(--ink-soft);margin-bottom:1.5rem;max-width:34rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:1.5rem}
.hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}.hero-stats div{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.85rem;text-align:center;box-shadow:var(--shadow)}
.hero-stats strong{display:block;font-family:var(--font-display);font-size:1.25rem;color:var(--forest)}.hero-stats span{font-size:.7rem;color:var(--ink-soft);text-transform:uppercase}
.section{padding:3.5rem 0}.section-alt{background:var(--bg-warm)}.section-title{text-align:center;margin-bottom:2rem}.section-title h2{font-family:var(--font-display);font-size:1.85rem;color:var(--bg-dark);margin-bottom:.5rem}.section-title p{color:var(--ink-soft);max-width:36rem;margin:0 auto}
.wave-divider{height:48px;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 48V20c150 30 300-20 450 0s300 30 450 0 300-30 450 0 300 30 450 0v28H0z' fill='%23efe8dc'/%3E%3C/svg%3E") center/cover no-repeat}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem}.feature-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow)}.feature-icon{width:48px;height:48px;border-radius:12px;background:var(--accent-soft);display:grid;place-items:center;font-size:1.3rem;margin-bottom:.75rem}.feature-card h3{font-size:1rem;margin-bottom:.4rem}
.vin-band{background:var(--forest);color:#e8f5ef;border-radius:var(--radius);padding:2rem;display:grid;grid-template-columns:1fr 1.2fr;gap:1.5rem;align-items:center}.vin-band h2{font-family:var(--font-display);font-size:1.5rem;margin-bottom:.5rem}
.vin-form{display:flex;gap:.65rem;flex-wrap:wrap}.vin-form input{flex:1;min-width:180px;padding:.85rem 1rem;border:none;border-radius:999px}
.page-hero{background:linear-gradient(135deg,var(--bg-dark),var(--forest));color:#fff;padding:2.5rem 0;text-align:center}.page-hero h1{font-family:var(--font-display);font-size:2rem;margin-bottom:.5rem}.page-hero p{color:#c5ddd3;max-width:32rem;margin:0 auto}
.shop-toolbar{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:space-between;align-items:center;margin:1.5rem 0}
.filter-tags{display:flex;flex-wrap:wrap;gap:.5rem}.filter-tag{padding:.45rem 1rem;border-radius:999px;border:1px solid var(--border);background:#fff;font-size:.85rem;font-weight:500;cursor:pointer;color:var(--ink-soft)}.filter-tag.active,.filter-tag:hover{background:var(--forest);border-color:var(--forest);color:#fff}
.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.25rem;margin-bottom:2rem}
.product-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}.product-card img{aspect-ratio:4/3;object-fit:cover;width:100%}.product-card-body{padding:1rem}.product-card h3{font-size:.92rem;line-height:1.35;margin-bottom:.4rem;min-height:2.5em}.product-meta{font-size:.78rem;color:var(--ink-soft);margin-bottom:.5rem}.price-current{font-size:1.15rem;font-weight:700;color:var(--accent-dark)}.price-old{font-size:.82rem;color:var(--ink-soft);text-decoration:line-through;margin-left:.4rem}.product-card .btn{width:100%;font-size:.82rem;padding:.55rem;margin-top:.5rem}
.pagination{display:flex;justify-content:center;gap:.35rem;flex-wrap:wrap;margin:1.5rem 0}.pagination button{min-width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:#fff;cursor:pointer;font-weight:600}.pagination button.active{background:var(--forest);color:#fff;border-color:var(--forest)}
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;margin:1.5rem 0}.contact-card{background:#fff;border-radius:var(--radius);padding:1.5rem;border:1px solid var(--border);box-shadow:var(--shadow);text-align:center}.contact-card .icon{font-size:1.75rem;margin-bottom:.5rem}.contact-card h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);margin-bottom:.4rem}
.site-footer{background:var(--bg-footer);color:#b8d4c8;padding:3rem 0 1.25rem;margin-top:2rem}.footer-grid{display:grid;grid-template-columns:1.5fr repeat(3,1fr);gap:1.5rem;margin-bottom:1.5rem}.footer-grid h4{color:#fff;font-size:.82rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem}.footer-grid a{display:block;color:#b8d4c8;font-size:.88rem;margin-bottom:.4rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:1rem;font-size:.8rem;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem}
.whatsapp-float{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9000;width:56px;height:56px;border-radius:50%;background:#25d366;display:grid;place-items:center;box-shadow:0 6px 24px rgba(37,211,102,.45)}.whatsapp-float svg{width:28px;height:28px;fill:#fff}
.spa-page[hidden]{display:none!important}
.nav-drawer{position:fixed;top:0;right:0;width:min(300px,88vw);height:100vh;background:#fff;z-index:10001;transform:translateX(100%);transition:transform .3s;padding:1.5rem;box-shadow:-8px 0 40px rgba(0,0,0,.15);overflow-y:auto}.nav-drawer.open{transform:translateX(0)}
.nav-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:10000;opacity:0;pointer-events:none;transition:opacity .3s}.nav-backdrop.open{opacity:1;pointer-events:auto}.nav-drawer a{display:block;padding:.8rem 0;border-bottom:1px solid var(--border);font-weight:600;color:var(--ink)}body.nav-open{overflow:hidden}
@media(max-width:900px){.nav-main{display:none}.nav-toggle{display:flex}.hero-split{grid-template-columns:1fr}.hero-stats{grid-template-columns:repeat(2,1fr)}.vin-band{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr 1fr}}
"""

APP_JS = r"""
const CART_KEY = 'hme-cart';
const SITE_WA = '4917613627363';

function formatEuro(n) {
  const whole = Math.floor(n), cents = Math.round((n - whole) * 100);
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + String(cents).padStart(2, '0') + ' €';
}
function getCartItems() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); updateBadge(); }
function updateBadge() {
  const n = getCartItems().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => { b.textContent = n > 99 ? '99+' : n; b.style.display = n ? 'flex' : 'none'; });
}
function addToCart(id) {
  const items = getCartItems();
  const ex = items.find(i => i.id === id);
  if (ex) ex.qty++; else items.push({ id, qty: 1 });
  saveCart(items);
}

function renderCard(p) {
  return `<article class="product-card" data-category="${p.category}">
    <a href="#product.html?id=${p.id}"><img src="${p.image}" alt="${p.title}" loading="lazy"></a>
    <div class="product-card-body">
      <h3><a href="#product.html?id=${p.id}">${p.title}</a></h3>
      <p class="product-meta">${p.code} · ${p.year} · ${p.hp} HP</p>
      <div><span class="price-current">${p.priceFormatted}</span><span class="price-old">${p.oldPriceFormatted}</span></div>
      <button class="btn btn-primary add-to-cart" data-id="${p.id}">Add to cart</button>
    </div></article>`;
}

function bindCards() {
  document.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', () => addToCart(Number(btn.dataset.id))));
}

let shop = { products: [], filtered: [], page: 1, cat: 'all' };

function initShop() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  shop.products = window.__PRODUCTS__;
  shop.filtered = shop.products;
  renderShopPage();
  document.querySelectorAll('.filter-tag').forEach(tag => tag.addEventListener('click', () => {
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    shop.cat = tag.dataset.filter;
    shop.filtered = shop.cat === 'all' ? shop.products : shop.products.filter(p => p.category === shop.cat);
    shop.page = 1;
    renderShopPage();
  }));
}

function renderShopPage() {
  const grid = document.getElementById('products-grid');
  const per = 12, total = shop.filtered.length;
  const start = (shop.page - 1) * per;
  const slice = shop.filtered.slice(start, start + per);
  grid.innerHTML = slice.map(renderCard).join('');
  bindCards();
  const count = document.getElementById('shop-count');
  if (count) count.textContent = `Showing ${start + 1}–${Math.min(start + per, total)} of ${total}`;
  const pag = document.getElementById('shop-pagination');
  if (pag) {
    const pages = Math.ceil(total / per) || 1;
    let html = '';
    for (let i = 1; i <= Math.min(pages, 8); i++) html += `<button class="${i === shop.page ? 'active' : ''}" data-p="${i}">${i}</button>`;
    pag.innerHTML = html;
    pag.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { shop.page = Number(b.dataset.p); renderShopPage(); window.scrollTo(0, 0); }));
  }
}

function initHomeFeatured() {
  const grid = document.getElementById('home-featured-grid');
  if (!grid || grid.dataset.loaded) return;
  const picks = [108, 114, 66, 88].map(n => window.__PRODUCTS__.find(p => p.image.includes('set-0' + String(n).padStart(3, '0')))).filter(Boolean);
  grid.innerHTML = picks.map(renderCard).join('');
  bindCards();
  grid.dataset.loaded = '1';
}

function initProduct() {
  const el = document.getElementById('product-detail');
  if (!el) return;
  const id = Number(new URLSearchParams((location.hash.split('?')[1] || '')).get('id'));
  const p = window.__PRODUCTS__.find(x => x.id === id);
  if (!p) { el.innerHTML = '<p>Engine not found. <a href="#shop.html">Back to catalog</a></p>'; return; }
  document.title = p.title + ' | Harbor Motor Exchange';
  el.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start">
    <img src="${p.image}" alt="${p.title}" style="border-radius:16px;width:100%">
    <div><h1 style="font-family:var(--font-display);font-size:1.6rem;margin-bottom:1rem">${p.title}</h1>
    <p style="color:var(--ink-soft);margin-bottom:1rem">${p.code} · ${p.year} · ${p.hp} HP · ${p.stock}</p>
    <p style="font-size:1.5rem;font-weight:700;color:var(--accent-dark);margin-bottom:1rem">${p.priceFormatted}</p>
    <button class="btn btn-primary add-to-cart" data-id="${p.id}" style="margin-bottom:1rem">Add to cart</button>
    <a href="https://wa.me/${SITE_WA}?text=${encodeURIComponent('Hi, interested in ' + p.title)}" class="btn btn-whatsapp" target="_blank" rel="noopener">WhatsApp enquiry</a></div></div>`;
  el.querySelector('.add-to-cart')?.addEventListener('click', () => addToCart(p.id));
}

function initCart() {
  const list = document.getElementById('cart-items');
  if (!list) return;
  const items = getCartItems();
  if (!items.length) { list.innerHTML = '<p>Your cart is empty. <a href="#shop.html">Browse engines</a></p>'; return; }
  const map = Object.fromEntries(window.__PRODUCTS__.map(p => [p.id, p]));
  list.innerHTML = items.map(i => {
    const p = map[i.id]; if (!p) return '';
    return `<div style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--border)"><img src="${p.image}" alt="" style="width:100px;border-radius:8px"><div><strong>${p.title}</strong><br>× ${i.qty} · ${formatEuro(p.price * i.qty)}</div></div>`;
  }).join('');
}

function spaNavigate(route, replace) {
  const r = (route || 'index.html').split('?')[0].replace(/^#/, '') || 'index.html';
  document.querySelectorAll('.spa-page').forEach(p => { p.hidden = p.dataset.route !== r; });
  const page = document.querySelector('.spa-page[data-route="' + r + '"]');
  if (page) document.body.dataset.page = page.dataset.page || '';
  const hash = '#' + (route || 'index.html').replace(/^#/, '');
  if (replace) history.replaceState({}, '', hash); else history.pushState({}, '', hash);
  window.scrollTo(0, 0);
  document.querySelectorAll('.nav-main a, .nav-drawer a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/^#/, '').split('?')[0];
    a.classList.toggle('active', href === r);
  });
  if (r === 'index.html') initHomeFeatured();
  if (r === 'shop.html') initShop();
  if (r === 'product.html') initProduct();
  if (r === 'cart.html') initCart();
  updateBadge();
}

document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || a.target === '_blank') return;
  if (href.includes('.html') || href.startsWith('#')) {
    e.preventDefault();
    spaNavigate(href.startsWith('#') ? href.slice(1) : href);
  }
});
window.addEventListener('popstate', () => spaNavigate(location.hash.slice(1) || 'index.html', true));

function initChrome() {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="top-ribbon">Need a VIN match today? <a href="https://wa.me/${SITE_WA}">WhatsApp our Hamburg desk</a></div>
  <header class="site-header"><div class="container header-inner">
    <a href="#index.html" class="brand"><span class="brand-mark">H</span><span class="brand-text"><strong>Harbor Motor Exchange</strong><span>Used BMW Engines</span></span></a>
    <nav class="nav-main" aria-label="Main">
      <a href="#index.html">Home</a><a href="#shop.html">Catalog</a><a href="#about.html">About</a><a href="#contact.html">Contact</a>
    </nav>
    <div class="header-actions">
      <a href="#cart.html" class="icon-btn" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg><span class="cart-badge">0</span></a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div></header>
  <div class="nav-backdrop" id="nav-backdrop"></div>
  <nav class="nav-drawer" id="nav-drawer"><a href="#index.html">Home</a><a href="#shop.html">Catalog</a><a href="#about.html">About</a><a href="#contact.html">Contact</a><a href="#cart.html">Cart</a></nav>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="site-footer"><div class="container footer-grid">
    <div><strong style="color:#fff;font-family:var(--font-display);font-size:1.1rem">Harbor Motor Exchange</strong><p style="margin-top:.5rem;font-size:.88rem">Pre-owned BMW engines cleared through Hamburg. Stamp-verified units for workshops across Europe.</p></div>
    <div><h4>Catalog</h4><a href="#shop.html">All engines</a><a href="#shop.html">Diesel N47/N57</a><a href="#shop.html">Petrol B58</a></div>
    <div><h4>Company</h4><a href="#about.html">About us</a><a href="#contact.html">Contact</a></div>
    <div><h4>Reach us</h4><a href="https://wa.me/${SITE_WA}">+49 176 13627363</a><a href="mailto:flashkingpro202@gmail.com">Email desk</a></div>
  </div><div class="container footer-bottom"><span>© 2026 Harbor Motor Exchange</span><span>22047 Hamburg, Germany</span></div></footer>
  <a href="https://wa.me/${SITE_WA}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>`);
  const toggle = () => { document.getElementById('nav-drawer').classList.toggle('open'); document.getElementById('nav-backdrop').classList.toggle('open'); document.body.classList.toggle('nav-open'); };
  document.getElementById('nav-toggle')?.addEventListener('click', toggle);
  document.getElementById('nav-backdrop')?.addEventListener('click', toggle);
  document.getElementById('home-vin-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = e.target.querySelector('input')?.value.trim();
    if (v) window.open('https://wa.me/' + SITE_WA + '?text=' + encodeURIComponent('VIN check: ' + v), '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  spaNavigate(location.hash.slice(1) || 'index.html', true);
});
"""


def escape_script(js: str) -> str:
    return js.replace("</script>", "<\\/script>")


def build() -> None:
    products = json.loads(PRODUCTS.read_text(encoding="utf-8"))
    products_b64 = base64.b64encode(json.dumps(products).encode()).decode()

    css = CSS_PATH.read_text(encoding="utf-8") if CSS_PATH.exists() else CSS_INLINE

    page_html = []
    for route, data in PAGES.items():
        hidden = "" if route == "index.html" else " hidden"
        page_html.append(
            f'    <div class="spa-page" data-route="{route}" data-page="{data["page"]}"{hidden}>\n'
            f'      <main>{data["main"]}</main>\n    </div>'
        )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Harbor Motor Exchange — used BMW engines from Hamburg. VIN-verified N47, N57, B47, B57, B58 and M57 motors for workshops across Europe.">
  <title>Harbor Motor Exchange | Used BMW Engines Hamburg</title>
  <link rel="icon" href="favicon.ico" sizes="any">
  <style>
{css}
  </style>
</head>
<body data-page="home">
  <div id="spa-root">
{chr(10).join(page_html)}
  </div>
  <script>
window.__PRODUCTS__ = JSON.parse(atob("{products_b64}"));
{APP_JS}
  </script>
</body>
</html>"""

    OUT.write_text(html, encoding="utf-8")
    mb = OUT.stat().st_size / (1024 * 1024)
    print(f"Built {OUT.name}: {len(PAGES)} pages, {mb:.1f} MB")
    print("Upload harbor-motor-exchange.html + images/ folder to Hostinger.")


if __name__ == "__main__":
    build()
