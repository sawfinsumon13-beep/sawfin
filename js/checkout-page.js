/** Checkout page — billing form + order summary */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSummaryLine(p, qty) {
  return `
    <div class="checkout-summary-item">
      <img src="${escapeHtml(p.image)}" alt="">
      <div>
        <strong>${escapeHtml(p.title)}</strong>
        <span>× ${qty} · ${formatEuro(p.price * qty)}</span>
      </div>
    </div>`;
}

async function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('checkout-summary');
  if (!form || !summary) return;

  const items = getCartItems();
  updateCartBadge();

  if (!items.length) {
    if (window.SPA_MODE && typeof window.spaNavigate === 'function') {
      window.spaNavigate('cart.html');
    } else {
      window.location.href = 'cart.html';
    }
    return;
  }

  try {
    const res = await fetch('js/products.json');
    const all = await res.json();
    const map = Object.fromEntries(all.map((p) => [p.id, p]));

    let subtotal = 0;
    const lines = items
      .map((item) => {
        const p = map[item.id];
        if (!p) return '';
        subtotal += p.price * item.qty;
        return renderSummaryLine(p, item.qty);
      })
      .join('');

    summary.innerHTML = `
      <h2>Order summary</h2>
      <div class="checkout-summary-items">${lines}</div>
      <div class="checkout-summary-totals">
        <div class="checkout-summary-row"><span>Subtotal</span><span>${formatEuro(subtotal)}</span></div>
        <div class="checkout-summary-row"><span>Shipping</span><span>Quoted after VIN check</span></div>
        <div class="checkout-summary-row checkout-summary-grand"><span>Estimated total</span><strong>${formatEuro(subtotal)}</strong></div>
      </div>`;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      const phone = data.get('phone');
      const country = data.get('country');
      const lines = items.map((item) => {
        const p = map[item.id];
        return p ? `${p.title} (×${item.qty})` : '';
      }).filter(Boolean).join(', ');

      const body = `Checkout enquiry from ${name}%0AEmail: ${email}%0APhone: ${phone}%0ACountry: ${country}%0AOrder: ${encodeURIComponent(lines)}%0AEstimated total: ${encodeURIComponent(formatEuro(subtotal))}`;
      clearCart();
      window.location.href = `${window.SITE_WA_URL || 'https://wa.me/4915510030835'}?text=${body}`;
    });
  } catch (_) {
    summary.innerHTML = '<p>Unable to load order summary.</p>';
  }
}

if (window.SPA_MODE) {
  window.initCheckoutPage = initCheckoutPage;
} else {
  document.addEventListener('DOMContentLoaded', initCheckoutPage);
}
