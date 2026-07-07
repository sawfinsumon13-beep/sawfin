/**
 * Static cart + checkout for Apache/Hostinger hosting.
 * Mocks Shopify cart API using localStorage; checkout opens WhatsApp.
 */
(function () {
  var WHATSAPP_PHONE = '13475417149';
  var CONTACT_PHONE = '+1 3475417149';
  var CONTACT_EMAIL = 'kittenspurebreed@gmail.com';
  var SIGNAL_URL = 'https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL';

  function contactDetails() {
    return 'Phone/WhatsApp: ' + CONTACT_PHONE + '\nSignal: ' + SIGNAL_URL + '\nEmail: ' + CONTACT_EMAIL;
  }
  var CART_KEY = 'pk_static_cart_v1';
  var RESERVE_CONTEXT_KEY = 'pk_reserve_context_v1';

  function readReserveContext() {
    try {
      var raw = sessionStorage.getItem(RESERVE_CONTEXT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeReserveContext(ctx) {
    sessionStorage.setItem(RESERVE_CONTEXT_KEY, JSON.stringify(ctx));
  }

  function goToReserveForm(ctx) {
    writeReserveContext(ctx);
    window.location.hash = '/pages/reserve-kitten';
  }

  window.pkGoToReserveForm = goToReserveForm;

  window.pkGoToReserveFromCart = function () {
    var cart = readCart();
    goToReserveForm({
      source: 'cart',
      items: cart.items.slice(),
    });
  };

  window.pkPrepareProductReserve = function (opts) {
    opts = opts || {};
    var item = {
      title: opts.title || getProductName(),
      variant_title: opts.paymentOption || '',
      url: opts.url || window.location.href,
      handle: opts.handle || '',
      breed: opts.breed || '',
    };
    addToCart({
      title: item.title,
      properties: { product_title: item.variant_title },
      url: item.url,
    });
    goToReserveForm({
      source: 'product',
      items: [item],
      paymentOption: item.variant_title,
    });
  };

  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : { items: [] };
    } catch (e) {
      return { items: [] };
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCount(cart.items.length);
  }

  function updateHeaderCount(n) {
    document.querySelectorAll('[data-cart-count], .cart-count, .header__cart-count').forEach(function (el) {
      el.textContent = String(n);
    });
    var bubble = document.querySelector('.cart-link__bubble');
    if (bubble) {
      bubble.textContent = String(n);
      bubble.style.display = n > 0 ? '' : 'none';
    }
  }

  function getProductName() {
    var h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    return (document.title || 'Kitten').split('|')[0].trim();
  }

  function getSelectedOption(form) {
    var selected = form.querySelector('input[name="id"]:checked') || form.querySelector('input[name="id"]');
    if (!selected) return 'Standard option';
    var label = form.querySelector('label[for="' + selected.id + '"]');
    return label ? label.textContent.replace(/\s+/g, ' ').trim() : selected.value;
  }

  function openWhatsApp(message) {
    window.open(
      'https://api.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + encodeURIComponent(message),
      '_blank'
    );
  }

  function addToCart(payload) {
    var cart = readCart();
    var items = payload.items || [payload];
    items.forEach(function (item) {
      cart.items.push({
        id: item.id,
        quantity: item.quantity || 1,
        title: item.title || getProductName(),
        variant_title: item.properties && item.properties.product_title ? item.properties.product_title : '',
        url: window.location.href,
        price: item.price || 0,
      });
    });
    writeCart(cart);
    return { items: cart.items };
  }

  function cartJsonResponse(cart) {
    var items = cart.items.map(function (item, idx) {
      return {
        id: item.id || idx,
        quantity: item.quantity || 1,
        title: item.title || 'Kitten',
        variant_title: item.variant_title || '',
        url: item.url || '',
        line_price: item.price || 0,
        price: item.price || 0,
        image: item.image || '',
        handle: item.handle || '',
      };
    });
    var total = items.reduce(function (s, i) { return s + (i.line_price || 0); }, 0);
    return {
      items: items,
      item_count: items.length,
      total_price: total,
      attributes: {},
    };
  }

  // Mock Shopify cart API
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/cart/add.js') !== -1) {
      try {
        var body = init && init.body ? JSON.parse(init.body) : {};
        addToCart(body);
        return Promise.resolve(new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }));
      } catch (e) {
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
    }
    if (url.indexOf('/cart.js') !== -1) {
      return Promise.resolve(new Response(JSON.stringify(cartJsonResponse(readCart())), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
    if (url.indexOf('/cart/clear.js') !== -1) {
      writeCart({ items: [] });
      return Promise.resolve(new Response('{}', { status: 200 }));
    }
    if (origFetch) return origFetch.apply(this, arguments);
    return Promise.reject(new Error('Network unavailable'));
  };

  function buildReserveMessage(data, ctx) {
    var lines = ['Hello! I would like to reserve a kitten:', ''];
    var items = (ctx && ctx.items) || [];
    if (items.length) {
      items.forEach(function (item, i) {
        lines.push((i + 1) + '. ' + (item.title || 'Kitten'));
        if (item.variant_title) lines.push('   Payment option: ' + item.variant_title);
        if (item.breed) lines.push('   Breed: ' + item.breed);
        if (item.url) lines.push('   Page: ' + item.url);
        lines.push('');
      });
    } else {
      lines.push('Kitten: (see page URL below)', '');
    }
    lines.push(
      '--- Contact details ---',
      'Name: ' + (data.full_name || ''),
      'Email: ' + (data.email || ''),
      'Phone: ' + (data.phone || ''),
      'City & State: ' + (data.city_state || ''),
      'About home: ' + (data.home_info || ''),
      (data.notes ? 'Notes: ' + data.notes : ''),
      '',
      contactDetails(),
      '',
      'Page: ' + window.location.href
    );
    return lines.filter(function (l) { return l !== undefined; }).join('\n');
  }

  function handleProductOrder(form, button) {
    var productName = getProductName();
    var option = getSelectedOption(form);
    var handleMatch = (window.location.hash || '').match(/#\/products\/([^/?#]+)/);
    var handle = handleMatch ? handleMatch[1].replace(/\.html$/, '') : '';
    var pageUrl = window.location.href.split('#')[0] + (handle ? '#/products/' + handle : window.location.hash);
    window.pkPrepareProductReserve({
      title: productName,
      paymentOption: option,
      url: pageUrl,
      handle: handle,
    });
    if (button) {
      button.disabled = true;
      var original = button.innerHTML;
      button.innerHTML = 'Loading form...';
      setTimeout(function () {
        button.disabled = false;
        button.innerHTML = original;
      }, 2500);
    }
  }

  function handleCartCheckout() {
    var cart = readCart();
    if (!cart.items.length) {
      goToReserveForm({ source: 'cart', items: [] });
      return;
    }
    goToReserveForm({ source: 'cart', items: cart.items.slice() });
  }

  function collectFormData(form) {
    var data = {};
    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox' && !el.checked) return;
      if (el.type === 'radio' && !el.checked) return;
      data[el.name] = el.value;
    });
    return data;
  }

  function populateReserveForm() {
    var summary = document.getElementById('pk-reserve-summary');
    if (!summary) return;
    var ctx = readReserveContext();
    if (!ctx || !ctx.items || !ctx.items.length) {
      summary.innerHTML = '<h3>Your selection</h3><p>No kitten selected yet. <a href="#/collections/kittens-for-sale">Browse available kittens</a>.</p>';
      return;
    }
    var html = '<h3>Your selection</h3><ul>';
    ctx.items.forEach(function (item) {
      html += '<li><strong>' + (item.title || 'Kitten') + '</strong>';
      if (item.variant_title) html += '<br>Payment option: ' + item.variant_title;
      if (item.breed) html += '<br>Breed: ' + item.breed;
      html += '</li>';
    });
    html += '</ul>';
    summary.innerHTML = html;
  }

  function handleReserveForm(form, channel) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = collectFormData(form);
    var ctx = readReserveContext() || { items: [] };
    var message = buildReserveMessage(data, ctx);
    var subject = 'Kitten Reservation — ' + ((ctx.items[0] && ctx.items[0].title) || 'Purebred Kitties');

    if (channel === 'email') {
      var body = encodeURIComponent(message);
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
    } else {
      openWhatsApp(message);
    }

    var success = document.getElementById('pk-reserve-success');
    if (success) {
      form.style.display = 'none';
      var summary = document.getElementById('pk-reserve-summary');
      if (summary) summary.style.display = 'none';
      success.classList.add('active');
    }
  }

  window.pkPopulateReserveForm = populateReserveForm;
  window.pkSubmitReserveForm = handleReserveForm;

  window.pkSubmitProductWithFip = function (opts) {
    var form = opts && opts.form;
    var button = opts && opts.button;
    if (form) handleProductOrder(form, button);
    return Promise.resolve(true);
  };

  window.pkOptimisticHeaderCartCountAdd = function (n) {
    var cart = readCart();
    updateHeaderCount(cart.items.length + (n || 1));
  };

  function handleBreederForm(form) {
    var data = {};
    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox' && !el.checked) return;
      if (el.type === 'radio' && !el.checked) return;
      data[el.name] = el.value;
    });
    var lines = [
      'Hello! New Breeder Application:',
      '',
      'Kittens to list: ' + (data.kitten_quantity || ''),
      'Breed specialty: ' + (data.breed || ''),
      'Price policy: ' + (data.price_policy || ''),
      'Included at adoption: ' + (data.adoption_includes || ''),
      'Experience: ' + (data.experience || ''),
      'Cattery location: ' + (data.cattery_location || ''),
      '',
      'Full name: ' + (data.full_name || ''),
      'Email: ' + (data.email || ''),
      'Phone: ' + (data.phone || ''),
      'Marketing consent: ' + (data.marketing_consent ? 'Yes' : 'No'),
      '',
      contactDetails(),
      '',
      'Page: ' + window.location.href,
    ];
    openWhatsApp(lines.join('\n'));
    var success = document.getElementById('pk-breeder-success');
    if (success) {
      form.style.display = 'none';
      success.classList.add('active');
    }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitted — opening WhatsApp...';
    }
  }

  window.pkSubmitBreederForm = handleBreederForm;

  function handleContactForm(form) {
    var data = {};
    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox' && !el.checked) return;
      if (el.type === 'radio' && !el.checked) return;
      var key = el.name.replace(/^contact\[|\]$/g, '');
      data[key] = el.value;
    });
    var phoneEl = document.getElementById('phone');
    var phone = data.phone || data['email-2'] || (phoneEl ? phoneEl.value : '');
    var lines = [
      'Hello! New contact form submission:',
      '',
      'Name: ' + ((data.first_name || '') + ' ' + (data.last_name || '')).trim(),
      'Email: ' + (data.email || ''),
      'Phone: ' + phone,
      'Subject: ' + (data.subject || ''),
      'Message: ' + (data.message || ''),
      '',
      contactDetails(),
      '',
      'Page: ' + window.location.href,
    ];
    openWhatsApp(lines.join('\n'));
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sent — opening WhatsApp...';
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = original;
      }, 3000);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateHeaderCount(readCart().items.length);
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') return;
    var action = form.getAttribute('action') || '';
    if (action.indexOf('/contact') !== -1 || (form.classList.contains('contact-form') && form.querySelector('[name="contact[email]"]'))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleContactForm(form);
      return;
    }
    if (form.classList.contains('pk-breeder-form')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleBreederForm(form);
      return;
    }
    if (form.classList.contains('pk-reserve-form')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (form.classList.contains('product-form') || action.indexOf('/cart/add') !== -1) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var btn = form.querySelector('button[type="submit"], .cart_btn, .bottom-cart-btn');
      handleProductOrder(form, btn);
    }
    if (action.indexOf('/cart') !== -1 && form.querySelector('button[name="checkout"]')) {
      var submitter = event.submitter;
      if (!submitter || submitter.name === 'checkout') {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleCartCheckout();
      }
    }
  }, true);

  document.addEventListener('click', function (event) {
    var reserveBtn = event.target.closest('[data-pk-submit]');
    if (reserveBtn) {
      var reserveForm = reserveBtn.closest('.pk-reserve-form');
      if (reserveForm) {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleReserveForm(reserveForm, reserveBtn.getAttribute('data-pk-submit'));
      }
      return;
    }
    var target = event.target.closest('button[name="checkout"], .cart__checkout, .cart_btn, .bottom-cart-btn, .new_cart-btn, #pk-checkout-btn, #pk-cart-reserve-btn');
    if (!target) return;
    if (target.closest('form.product-form')) return;
    if (target.name === 'checkout' || target.classList.contains('cart__checkout') || target.id === 'pk-checkout-btn' || target.id === 'pk-cart-reserve-btn') {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleCartCheckout();
    }
  }, true);
})();
