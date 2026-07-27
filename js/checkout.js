(function () {
  function initCheckout() {
    var cart = CartStore.getCart();
    var summary = document.getElementById("checkout-summary");
    if (!summary) return;

    if (!cart.length) {
      summary.innerHTML =
        "<p>Your cart is empty.</p><a href=\"products.html\" class=\"btn btn-primary\">Browse products</a>";
      return;
    }

    var sub = CartStore.cartSubtotal(cart);
    summary.innerHTML =
      "<h2>Order summary</h2>" +
      "<ul class=\"checkout-lines\">" +
      cart
        .map(function (row) {
          return (
            "<li><span>" +
            row.name +
            (row.size ? " (" + row.size + ")" : "") +
            " × " +
            row.qty +
            '</span><span>' +
            CartStore.formatMoney((row.unitPrice || 0) * row.qty) +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>" +
      '<p class="checkout-total"><span>Estimated total</span><strong>' +
      CartStore.formatMoney(sub) +
      "</strong></p>" +
      "<p class=\"checkout-fine\">Final tax, shipping, and institutional PO adjustments applied on confirmation.</p>";

    var form = document.getElementById("checkout-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var orderId = "AB-" + Date.now().toString(36).toUpperCase();
      var order = {
        id: orderId,
        cart: cart,
        total: sub,
        customer: {
          first: form.first.value,
          last: form.last.value,
          org: form.org.value,
          email: form.email.value,
        },
        placedAt: new Date().toISOString(),
      };
      localStorage.setItem("apex_last_order", JSON.stringify(order));
      CartStore.setCart([]);
      window.location.href = "order-confirmation.html?order=" + encodeURIComponent(orderId);
    });
  }

  if (document.body.dataset.page === "checkout") {
    document.addEventListener("DOMContentLoaded", initCheckout);
  }
})();
