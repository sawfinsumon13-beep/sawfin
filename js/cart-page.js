/** Cart page — product list + totals sidebar */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCartRow(p, qty) {
  const lineTotal = p.price * qty;
  const lineOld = p.oldPrice * qty;
  const savings = lineOld - lineTotal;
  const miles = formatMiles(productMileage(p.id));

  return `
    <article class="cart-row" data-id="${p.id}">
      <div class="cart-row-product">
        <a href="product.html?id=${p.id}" class="cart-row-image">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy">
        </a>
        <div class="cart-row-details">
          <a href="product.html?id=${p.id}" class="cart-row-title">${escapeHtml(p.title)}</a>
          <div class="cart-row-prices">
            <span class="price-old">${escapeHtml(p.oldPriceFormatted)}</span>
            <span class="price-current">${escapeHtml(p.priceFormatted)}</span>
          </div>
          <ul class="cart-row-meta">
            <li>Engine Code: ${escapeHtml(p.code)}</li>
            <li>Power: ${p.hp}HP</li>
            <li>Make: BMW</li>
            <li>Mileage: ${miles} miles</li>
          </ul>
          <p class="cart-row-note">Please contact us to confirm if it fits your vehicle.</p>
          <div class="cart-row-actions">
            <div class="qty-control" aria-label="Quantity">
              <button type="button" class="qty-btn qty-minus" data-id="${p.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${qty}</span>
              <button type="button" class="qty-btn qty-plus" data-id="${p.id}" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="cart-remove-btn" data-id="${p.id}" aria-label="Remove item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="cart-row-total">
        <strong>${formatEuro(lineTotal)}</strong>
        ${savings > 0 ? `<span class="cart-row-save">Save ${formatEuro(savings)}</span>` : ''}
      </div>
    </article>`;
}

function renderCartTotals(subtotal, discount = 0) {
  const total = Math.max(0, subtotal - discount);
  const el = document.getElementById('cart-totals');
  if (!el) return;

  el.innerHTML = `
    <h2>Cart totals</h2>
    <details class="cart-coupon">
      <summary>Add coupons</summary>
      <div class="cart-coupon-body">
        <input type="text" id="coupon-code" placeholder="Coupon code" aria-label="Coupon code">
        <button type="button" class="btn btn-outline btn-sm" id="apply-coupon">Apply</button>
        <p class="cart-coupon-hint" id="coupon-message">Enter a code at checkout — VIN match enquiries welcome on WhatsApp.</p>
      </div>
    </details>
    ${discount > 0 ? `<div class="cart-totals-line"><span>Discount</span><span>−${formatEuro(discount)}</span></div>` : ''}
    <div class="cart-totals-estimated">
      <span>Estimated total</span>
      <strong id="cart-grand-total">${formatEuro(total)}</strong>
    </div>
    <a href="checkout.html" class="btn btn-checkout" id="checkout-btn">Proceed to Checkout</a>
    <a href="shop.html" class="cart-continue-link">← Continue shopping</a>`;
}

function bindCartEvents(products) {
  document.querySelectorAll('.qty-minus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = getCartItems().find((i) => i.id === id);
      if (item) setCartQty(id, item.qty - 1);
      initCartPage();
    });
  });

  document.querySelectorAll('.qty-plus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = getCartItems().find((i) => i.id === id);
      if (item) setCartQty(id, item.qty + 1);
      initCartPage();
    });
  });

  document.querySelectorAll('.cart-remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.id));
      initCartPage();
    });
  });

  document.getElementById('apply-coupon')?.addEventListener('click', () => {
    const msg = document.getElementById('coupon-message');
    const code = document.getElementById('coupon-code')?.value.trim().toUpperCase();
    if (msg) {
      msg.textContent = code === 'BAVARIAN10'
        ? 'Coupon noted — 10% workshop discount applied at checkout review.'
        : 'Invalid coupon. Contact us on WhatsApp for fleet pricing.';
      msg.classList.toggle('cart-coupon-ok', code === 'BAVARIAN10');
    }
  });
}

async function initCartPage() {
  const list = document.getElementById('cart-items');
  if (!list) return;

  const items = getCartItems();
  updateCartBadge();

  if (!items.length) {
    list.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="shop.html" class="btn btn-primary">Browse engines</a>
      </div>`;
    renderCartTotals(0);
    const btn = document.getElementById('checkout-btn');
    if (btn) {
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled', 'true');
      btn.removeAttribute('href');
    }
    return;
  }

  try {
    const res = await fetch('js/products.json');
    const all = await res.json();
    const map = Object.fromEntries(all.map((p) => [p.id, p]));

    let subtotal = 0;
    const rows = items
      .map((item) => {
        const p = map[item.id];
        if (!p) return '';
        subtotal += p.price * item.qty;
        return renderCartRow(p, item.qty);
      })
      .join('');

    list.innerHTML = rows;
    renderCartTotals(subtotal);
    bindCartEvents(all);
  } catch (_) {
    list.innerHTML = '<p class="cart-error">Unable to load cart. Please refresh.</p>';
  }
}

if (window.SPA_MODE) {
  window.initCartPage = initCartPage;
} else {
  document.addEventListener('DOMContentLoaded', initCartPage);
}
