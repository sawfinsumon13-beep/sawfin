(function () {
  function initCheckout() {
    var cart = CartStore.getCart();
    var summary = document.getElementById("checkout-summary");
    var actions = document.getElementById("checkout-buy-actions");
    if (!summary) return;

    if (!cart.length) {
      summary.innerHTML =
        '<p>Your cart is empty.</p><a href="products.html" class="btn btn-primary">Browse products</a>';
      if (actions) actions.innerHTML = "";
      return;
    }

    var sub = CartStore.cartSubtotal(cart);
    summary.innerHTML =
      "<h2>Order summary</h2>" +
      '<ul class="checkout-lines">' +
      cart
        .map(function (row) {
          return (
            "<li><span>" +
            row.name +
            (row.size ? " (" + row.size + ")" : "") +
            " × " +
            row.qty +
            "</span><span>" +
            CartStore.formatMoney((row.unitPrice || 0) * row.qty) +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>" +
      '<p class="checkout-total"><span>Estimated total</span><strong>' +
      CartStore.formatMoney(sub) +
      "</strong></p>" +
      '<p class="checkout-fine">Final total confirmed by sales via Email or WhatsApp.</p>';

    if (actions) {
      var msg = SiteContact.cartMessage(cart);
      actions.innerHTML =
        '<p class="buy-contact-note">Click below to send your order:</p>' +
        '<div class="product-actions-row">' +
        '<a class="btn btn-primary btn-lg" href="' +
        SiteContact.mailHref("Order request — cart", msg) +
        '">Email to buy</a>' +
        '<a class="btn btn-whatsapp btn-lg" href="' +
        SiteContact.whatsappHref(msg) +
        '" target="_blank" rel="noopener">WhatsApp to buy</a></div>' +
        '<p class="buy-contact-meta">We reply with payment and shipping details.</p>';
    }
  }

  if (document.body.dataset.page === "checkout") {
    document.addEventListener("DOMContentLoaded", initCheckout);
  }
})();
