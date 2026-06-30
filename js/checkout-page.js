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

function collectOrderDetails(form, items, map, subtotal) {
  if (!form.reportValidity()) return null;

  const data = new FormData(form);
  const orderLines = items
    .map((item) => {
      const p = map[item.id];
      return p ? `${p.title} (SKU: ${p.sku}, ×${item.qty})` : '';
    })
    .filter(Boolean);

  return {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    country: String(data.get('country') || '').trim(),
    address: String(data.get('address') || '').trim(),
    vin: String(data.get('vin') || '').trim(),
    orderLines,
    subtotal,
  };
}

function formatOrderMessage(details) {
  const lines = [
    'New Bavarian Engines order enquiry',
    '',
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone / WhatsApp: ${details.phone}`,
    `Country: ${details.country}`,
  ];

  if (details.address) lines.push(`Address: ${details.address}`);
  if (details.vin) lines.push(`VIN: ${details.vin}`);

  lines.push('', 'Order:', ...details.orderLines.map((line) => `- ${line}`));
  lines.push('', `Estimated total: ${formatEuro(details.subtotal)} (shipping quoted after VIN check)`);

  return lines.join('\n');
}

function placeOrder(channel, details) {
  const message = formatOrderMessage(details);
  clearCart();

  if (channel === 'whatsapp') {
    window.location.href = `${window.SITE_WA_URL || 'https://wa.me/4915510030835'}?text=${encodeURIComponent(message)}`;
    return;
  }

  const siteEmail = window.SITE_EMAIL || 'originalbavarianengine@gmail.com';
  const subject = encodeURIComponent('Bavarian Engines — Order enquiry');
  const body = encodeURIComponent(message);
  window.location.href = `mailto:${siteEmail}?subject=${subject}&body=${body}`;
}

async function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('checkout-summary');
  const whatsappBtn = document.getElementById('checkout-whatsapp');
  const emailBtn = document.getElementById('checkout-email');
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

  let productMap = {};
  let subtotal = 0;

  try {
    const res = await fetch('js/products.json');
    const all = await res.json();
    productMap = Object.fromEntries(all.map((p) => [p.id, p]));

    const lines = items
      .map((item) => {
        const p = productMap[item.id];
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
  } catch (_) {
    summary.innerHTML = '<p>Unable to load order summary.</p>';
    return;
  }

  form.addEventListener('submit', (e) => e.preventDefault());

  const handlePlaceOrder = (channel) => {
    const details = collectOrderDetails(form, items, productMap, subtotal);
    if (!details) return;
    placeOrder(channel, details);
  };

  if (whatsappBtn) whatsappBtn.addEventListener('click', () => handlePlaceOrder('whatsapp'));
  if (emailBtn) emailBtn.addEventListener('click', () => handlePlaceOrder('email'));
}

if (window.SPA_MODE) {
  window.initCheckoutPage = initCheckoutPage;
} else {
  document.addEventListener('DOMContentLoaded', initCheckoutPage);
}
