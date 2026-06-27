/** Shared cart storage — used by shop, cart, and checkout pages */

const CART_KEY = 'be-cart';

function formatEuro(n) {
  const whole = Math.floor(n);
  const cents = Math.round((n - whole) * 100);
  const s = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${s},${String(cents).padStart(2, '0')} €`;
}

function productMileage(id) {
  return Math.floor(((id * 7919) % 180000) + 45000);
}

function formatMiles(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getCartItems() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length && typeof parsed[0] === 'object' && parsed[0].id != null) {
        return parsed;
      }
      const map = {};
      parsed.forEach((id) => {
        map[id] = (map[id] || 0) + 1;
      });
      return Object.entries(map).map(([id, qty]) => ({ id: Number(id), qty }));
    }
  } catch (_) {
    return [];
  }
  return [];
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
}

function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(id, qty = 1) {
  const items = getCartItems();
  const existing = items.find((item) => item.id === id);
  if (existing) existing.qty += qty;
  else items.push({ id, qty });
  saveCartItems(items);
}

function setCartQty(id, qty) {
  let items = getCartItems();
  if (qty <= 0) {
    items = items.filter((item) => item.id !== id);
  } else {
    const existing = items.find((item) => item.id === id);
    if (existing) existing.qty = qty;
    else items.push({ id, qty });
  }
  saveCartItems(items);
}

function removeFromCart(id) {
  saveCartItems(getCartItems().filter((item) => item.id !== id));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach((b) => {
    b.textContent = count > 99 ? '99+' : count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

window.formatEuro = formatEuro;
window.productMileage = productMileage;
window.formatMiles = formatMiles;
window.getCartItems = getCartItems;
window.saveCartItems = saveCartItems;
window.getCartCount = getCartCount;
window.addToCart = addToCart;
window.setCartQty = setCartQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
