(function () {
  var WHATSAPP = '13438092153';
  var EMAIL = 'kittenspurebreed@gmail.com';
  var CART_KEY = 'pk_fresh_cart_v1';
  var products = [];

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}'); }
    catch (e) { return { items: [] }; }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCount();
  }

  function updateCount() {
    var n = readCart().items.length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(n);
    });
  }

  function addItem(handle, title, option) {
    var cart = readCart();
    cart.items.push({ handle: handle, title: title, option: option || 'Reserve' });
    writeCart(cart);
    alert('Added to cart! Open Cart to checkout via WhatsApp.');
  }

  function checkout() {
    var cart = readCart();
    if (!cart.items.length) {
      alert('Your cart is empty.');
      return;
    }
    var lines = cart.items.map(function (it, i) {
      return (i + 1) + '. ' + it.title + ' (' + it.option + ')';
    });
    var msg = 'Hi! I would like to reserve:\\n\\n' + lines.join('\\n') +
      '\\n\\nEmail: ' + EMAIL;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
  }

  function renderCart() {
    var cart = readCart();
    var box = document.getElementById('cart-items');
    var empty = document.getElementById('cart-empty');
    if (!box) return;
    if (!cart.items.length) {
      box.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    box.innerHTML = cart.items.map(function (it, i) {
      return '<div class="card" style="padding:1rem;margin-bottom:.75rem"><strong>' +
        escapeHtml(it.title) + '</strong><br><span class="meta">' +
        escapeHtml(it.option) + '</span></div>';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>\"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function normalizeProduct(row) {
    if (row.handle) return row;
    return {
      handle: row.h,
      title: row.t,
      breed_label: row.b,
      image: row.i,
      url: row.u,
      price: row.p,
    };
  }

  function loadProducts(cb) {
    if (products.length) { cb(products); return; }
    fetch('/data/products.json').then(function (r) { return r.json(); }).then(function (d) {
      products = d.map(normalizeProduct);
      cb(products);
    }).catch(function () { cb([]); });
  }

  function initSearch(inputSel, outSel) {
    var input = document.querySelector(inputSel);
    var out = document.querySelector(outSel);
    if (!input || !out) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      loadProducts(function (list) {
        if (!q) { out.innerHTML = ''; return; }
        var hits = list.filter(function (p) {
          return (p.title + ' ' + (p.breed_label || '') + ' ' + p.handle).toLowerCase().indexOf(q) >= 0;
        }).slice(0, 48);
        out.innerHTML = hits.map(function (p) {
          var price = p.price ? ('$' + Number(p.price).toLocaleString()) : 'Ask';
          return '<article class="card"><a href="' + p.url + '">' +
            '<img src="' + p.image + '" alt="" loading="lazy">' +
            '<div class="card-body"><h3>' + escapeHtml(p.title) + '</h3>' +
            '<p class="meta">' + escapeHtml(p.breed_label || '') + '</p>' +
            '<p class="price">' + price + '</p></a></div></article>';
        }).join('');
      });
    });
  }

  function contact(ev) {
    ev.preventDefault();
    var f = ev.target;
    var name = f.name.value.trim();
    var email = f.email.value.trim();
    var message = f.message.value.trim();
    var msg = 'Contact from website\\nName: ' + name + '\\nEmail: ' + email + '\\n\\n' + message;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
    return false;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-reserve]');
    if (btn) {
      addItem(btn.getAttribute('data-reserve'), btn.getAttribute('data-title'), 'Reservation');
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.reserve-form');
    if (!form) return;
    e.preventDefault();
    var optionEl = form.querySelector('input[name="option"]:checked');
    addItem(form.getAttribute('data-product'), form.getAttribute('data-title'),
      optionEl ? optionEl.value : 'Reserve');
  });

  document.addEventListener('DOMContentLoaded', updateCount);

  window.PK = {
    checkout: checkout,
    renderCart: renderCart,
    initSearch: initSearch,
    contact: contact,
  };
})();
