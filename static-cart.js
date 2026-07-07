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

  function openEmail(subject, body) {
    window.location.href =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function readFormData(form) {
    var data = {};
    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      if (!el.name) return;
      if (el.type === 'checkbox' && !el.checked) return;
      if (el.type === 'radio' && !el.checked) return;
      data[el.name] = el.value;
    });
    return data;
  }

  function buildAppointmentMessage(data) {
    return [
      'New appointment request — Personalized Adoption Support',
      '',
      'Full name: ' + (data.full_name || ''),
      'Email: ' + (data.email || ''),
      'Phone / WhatsApp: ' + (data.phone || ''),
      'Preferred date: ' + (data.preferred_date || ''),
      'Preferred time: ' + (data.preferred_time || ''),
      'Time zone: ' + (data.timezone || ''),
      '',
      'Discussion notes:',
      data.notes || '',
      '',
      contactDetails(),
      '',
      'Page: ' + window.location.href,
    ].join('\n');
  }

  function handleAppointmentForm(form, channel) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = readFormData(form);
    var message = buildAppointmentMessage(data);
    var subject = 'Appointment Request — ' + (data.full_name || 'Adoption Support Call');
    if (channel === 'email') openEmail(subject, message);
    else openWhatsApp('Hello! ' + message);
    var success = document.getElementById('pk-appointment-success');
    if (success) {
      form.style.display = 'none';
      success.classList.add('active');
    }
  }

  window.pkSubmitAppointmentForm = handleAppointmentForm;

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

  function handleProductOrder(form, button) {
    var productName = getProductName();
    var option = getSelectedOption(form);
    var message =
      'Hello! I would like to reserve/order:\n\n' +
      'Kitten: ' + productName + '\n' +
      (option && option !== 'Standard option' ? 'Payment option: ' + option + '\n' : '') +
      'Page: ' + window.location.href + '\n\n' +
      contactDetails() + '\n\n' +
      'Please contact me with next steps. Thank you!';

    if (button) {
      button.disabled = true;
      var original = button.innerHTML;
      button.innerHTML = 'Opening WhatsApp...';
      setTimeout(function () {
        button.disabled = false;
        button.innerHTML = original;
      }, 3000);
    }
    openWhatsApp(message);
  }

  function handleCartCheckout() {
    var cart = readCart();
    if (!cart.items.length) {
      openWhatsApp(
        'Hello! I would like to inquire about adopting a kitten.\n\n' + contactDetails()
      );
      return;
    }
    var lines = cart.items.map(function (item, i) {
      return (i + 1) + '. ' + item.title + (item.variant_title ? ' (' + item.variant_title + ')' : '') + '\n   ' + item.url;
    });
    openWhatsApp(
      'Hello! I would like to complete my order:\n\n' +
      lines.join('\n') +
      '\n\n' + contactDetails() +
      '\n\nPlease assist me with checkout. Thank you!'
    );
  }

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
    var submitBtn = event.target.closest('[data-pk-submit]');
    if (submitBtn) {
      var form = submitBtn.closest('form');
      if (form && form.classList.contains('pk-appointment-form')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        handleAppointmentForm(form, submitBtn.getAttribute('data-pk-submit'));
        return;
      }
    }
    var calendlyLink = event.target.closest('a[href*="calendly.com"], .callendar_btn');
    if (calendlyLink) {
      var href = calendlyLink.getAttribute('href') || '';
      var onclick = calendlyLink.getAttribute('onclick') || '';
      if (href.indexOf('calendly.com') !== -1 || onclick.indexOf('Calendly') !== -1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.hash = '#/pages/book-appointment';
        return;
      }
    }
    var target = event.target.closest('button[name="checkout"], .cart__checkout, .cart_btn, .bottom-cart-btn, .new_cart-btn');
    if (!target) return;
    if (target.closest('form.product-form')) return;
    if (target.name === 'checkout' || target.classList.contains('cart__checkout')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      handleCartCheckout();
    }
  }, true);
})();
