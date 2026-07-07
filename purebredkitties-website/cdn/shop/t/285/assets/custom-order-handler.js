/**
 * Custom order handler for static hosting.
 * Keeps the original cart UI but sends orders via WhatsApp & email.
 */
(function () {
  var WHATSAPP_PHONE = '13438092153';
  var CONTACT_EMAIL = 'kittenspurebreed@gmail.com';

  function getProductName() {
    var h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    var title = document.title || 'Kitten';
    return title.split('|')[0].trim();
  }

  function getSelectedOption(form) {
    var selected = form.querySelector('input[name="id"]:checked');
    if (!selected) {
      selected = form.querySelector('input[name="id"]');
    }
    if (!selected) return 'Standard option';
    var label = form.querySelector('label[for="' + selected.id + '"]');
    return label ? label.textContent.trim() : selected.value;
  }

  function openWhatsApp(message) {
    var url =
      'https://api.whatsapp.com/send?phone=' +
      WHATSAPP_PHONE +
      '&text=' +
      encodeURIComponent(message);
    window.open(url, '_blank');
  }

  function handleProductOrder(form, button) {
    var productName = getProductName();
    var option = getSelectedOption(form);
    var pageUrl = window.location.href;
    var message =
      'Hello! I would like to reserve/order:\n\n' +
      'Kitten: ' +
      productName +
      '\n' +
      'Payment Option: ' +
      option +
      '\n' +
      'Page: ' +
      pageUrl +
      '\n\n' +
      'Please contact me with next steps. Thank you!';

    if (button) {
      button.disabled = true;
      var originalText = button.innerHTML;
      button.innerHTML = 'Opening WhatsApp...';
      setTimeout(function () {
        button.disabled = false;
        button.innerHTML = originalText;
      }, 3000);
    }

    openWhatsApp(message);
  }

  // Override Shopify product submit used on product pages
  window.pkSubmitProductWithFip = function (opts) {
    var form = opts && opts.form;
    var button = opts && opts.button;
    if (form) {
      handleProductOrder(form, button);
    }
  };

  document.addEventListener(
    'submit',
    function (event) {
      var form = event.target;
      if (!form || form.tagName !== 'FORM') return;

      var action = form.getAttribute('action') || '';
      if (
        form.classList.contains('product-form') ||
        action.indexOf('/cart/add') !== -1
      ) {
        event.preventDefault();
        event.stopPropagation();
        var btn = form.querySelector(
          'button[type="submit"], .cart_btn, .bottom-cart-btn'
        );
        handleProductOrder(form, btn);
      }
    },
    true
  );

  document.addEventListener(
    'click',
    function (event) {
      var target = event.target.closest(
        'button[name="checkout"], .cart__checkout, .cart_btn, .bottom-cart-btn, .new_cart-btn'
      );
      if (!target) return;

      var form = target.closest('form');
      if (form && (form.classList.contains('product-form') || (form.getAttribute('action') || '').indexOf('/cart/add') !== -1)) {
        return; // handled by submit listener
      }

      if (target.name === 'checkout' || target.classList.contains('cart__checkout')) {
        event.preventDefault();
        event.stopPropagation();
        openWhatsApp(
          'Hello! I would like to complete my order from the cart.\n\nEmail: ' +
            CONTACT_EMAIL +
            '\n\nPlease assist me with checkout. Thank you!'
        );
      }
    },
    true
  );
})();
