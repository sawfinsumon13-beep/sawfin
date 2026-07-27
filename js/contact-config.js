(function (global) {
  var PHONE_DISPLAY = "+1 (786) 708-6594";
  var PHONE_E164 = "17867086594";
  var EMAIL = "sales@researchpeptidesbio.com";
  var WHATSAPP_URL = "https://wa.me/" + PHONE_E164;

  function telHref() {
    return "tel:+" + PHONE_E164;
  }

  function mailHref(subject, body) {
    var url = "mailto:" + EMAIL;
    var parts = [];
    if (subject) parts.push("subject=" + encodeURIComponent(subject));
    if (body) parts.push("body=" + encodeURIComponent(body));
    if (parts.length) url += "?" + parts.join("&");
    return url;
  }

  function whatsappHref(text) {
    return WHATSAPP_URL + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function orderMessage(product) {
    var lines = [
      "Hello, I want to buy this research product:",
      "",
      "Product: " + (product.name || ""),
      "SKU: " + (product.sku || "N/A"),
      "Price: " + (product.price || "N/A"),
    ];
    if (product.size) lines.push("Size: " + product.size);
    if (product.qty) lines.push("Quantity: " + product.qty);
    if (product.slug) {
      lines.push("Link: " + location.origin + location.pathname.replace(/[^/]*$/, "") + "product.html?slug=" + product.slug);
    }
    lines.push("", "Please confirm availability and payment instructions.");
    return lines.join("\n");
  }

  function cartMessage(cart) {
    var lines = ["Hello, I want to place an order for these products:", ""];
    (cart || []).forEach(function (row, i) {
      lines.push(
        i +
          1 +
          ". " +
          row.name +
          (row.sku ? " [" + row.sku + "]" : "") +
          (row.size ? " — Size: " + row.size : "") +
          " — Qty: " +
          (row.qty || 1) +
          (row.price ? " — " + row.price : "")
      );
    });
    lines.push("", "Please confirm availability, total, and payment instructions.");
    return lines.join("\n");
  }

  function buyButtonsHtml(product, opts) {
    opts = opts || {};
    var msg = orderMessage(product);
    var subject = "Order request: " + (product.name || "Research product");
    return (
      '<div class="buy-contact-actions">' +
      '<p class="buy-contact-note">To buy this product, order via <strong>Email</strong> or <strong>WhatsApp</strong>:</p>' +
      '<div class="product-actions-row">' +
      '<a class="btn btn-primary" href="' +
      mailHref(subject, msg) +
      '">Email to buy</a>' +
      '<a class="btn btn-whatsapp" href="' +
      whatsappHref(msg) +
      '" target="_blank" rel="noopener">WhatsApp to buy</a>' +
      (opts.includeCart
        ? '<button type="submit" class="btn btn-secondary">Add to cart</button>'
        : "") +
      "</div>" +
      '<p class="buy-contact-meta">Phone: <a href="' +
      telHref() +
      '">' +
      PHONE_DISPLAY +
      '</a> · Email: <a href="' +
      mailHref() +
      '">' +
      EMAIL +
      "</a></p></div>"
    );
  }

  global.SiteContact = {
    PHONE_DISPLAY: PHONE_DISPLAY,
    PHONE_E164: PHONE_E164,
    EMAIL: EMAIL,
    WHATSAPP_URL: WHATSAPP_URL,
    telHref: telHref,
    mailHref: mailHref,
    whatsappHref: whatsappHref,
    orderMessage: orderMessage,
    cartMessage: cartMessage,
    buyButtonsHtml: buyButtonsHtml,
  };
})(window);
