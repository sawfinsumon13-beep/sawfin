(function (global) {
  var STORAGE_KEY = "apex_cart";

  function parsePriceMin(priceText) {
    if (global.Pricing) {
      return Pricing.parsePriceRange(priceText).lo || 0;
    }
    if (!priceText) return 0;
    var m = String(priceText).match(/\$([\d,]+(?:\.\d{2})?)/);
    if (!m) return 0;
    return parseFloat(m[1].replace(/,/g, "")) || 0;
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (global.updateCartCount) global.updateCartCount();
  }

  function addToCart(item) {
    var cart = getCart();
    var unit = item.unitPrice != null ? item.unitPrice : parsePriceMin(item.price);
    var existing = cart.find(function (row) {
      return row.slug === item.slug && row.size === item.size;
    });
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cart.push({
        slug: item.slug,
        name: item.name,
        sku: item.sku || "",
        price: item.price || "",
        unitPrice: unit,
        qty: item.qty || 1,
        size: item.size || null,
        image: item.image || null,
      });
    }
    setCart(cart);
    return cart;
  }

  function cartSubtotal(cart) {
    return cart.reduce(function (sum, row) {
      return sum + (row.unitPrice || 0) * (row.qty || 1);
    }, 0);
  }

  function formatMoney(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  global.CartStore = {
    getCart: getCart,
    setCart: setCart,
    addToCart: addToCart,
    parsePriceMin: parsePriceMin,
    cartSubtotal: cartSubtotal,
    formatMoney: formatMoney,
  };
})(window);
