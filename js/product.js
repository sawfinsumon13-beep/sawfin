(function () {
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function selectedSize() {
    var sizeEl = document.getElementById("size");
    return sizeEl ? sizeEl.value : null;
  }

  function selectedQty() {
    var qtyEl = document.getElementById("qty");
    return qtyEl ? parseInt(qtyEl.value, 10) || 1 : 1;
  }

  function pricingSnapshot(product) {
    return Pricing.lineTotal(product, selectedSize(), selectedQty());
  }

  function cartItemFromForm(product) {
    var snap = pricingSnapshot(product);
    return {
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: snap.unitLabel,
      unitPrice: snap.unit,
      image: product.image,
      qty: snap.qty,
      size: selectedSize(),
    };
  }

  function currentOrderProduct(product) {
    var snap = pricingSnapshot(product);
    return {
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: snap.unitLabel + " each · Total " + snap.totalLabel,
      unitPrice: snap.unit,
      size: selectedSize(),
      qty: snap.qty,
    };
  }

  function refreshPrice(product) {
    var snap = pricingSnapshot(product);
    var priceEl = document.getElementById("detail-price");
    var unitEl = document.getElementById("unit-price-meta");
    var totalEl = document.getElementById("line-total-meta");
    if (priceEl) priceEl.textContent = snap.totalLabel;
    if (unitEl) {
      unitEl.textContent =
        "Unit price" +
        (selectedSize() ? " (" + selectedSize() + ")" : "") +
        ": " +
        snap.unitLabel;
    }
    if (totalEl) {
      totalEl.textContent =
        "Total for qty " + snap.qty + ": " + snap.totalLabel;
    }
  }

  function refreshBuyLinks(product) {
    var wrap = document.getElementById("buy-contact-wrap");
    if (!wrap || !window.SiteContact) return;
    wrap.innerHTML = SiteContact.buyButtonsHtml(currentOrderProduct(product), {
      includeCart: true,
    });
  }

  function refreshAll(product) {
    refreshPrice(product);
    refreshBuyLinks(product);
  }

  function initProduct() {
    var slug = qs("slug");
    window.SITE_ACTIVE = "products";
    renderSiteHeader();
    renderSiteFooter();

    if (!slug) {
      document.getElementById("product-root").innerHTML = "<p>Product not found.</p>";
      return;
    }

    fetch("data/catalog.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (catalog) {
        var product = catalog.products.find(function (p) {
          return p.slug === slug;
        });
        var root = document.getElementById("product-root");
        if (!product) {
          root.innerHTML = "<p>Product not found.</p>";
          return;
        }

        document.title = product.name + " | Buy Peptides & Research Peptides";

        var sizes =
          product.sizes && product.sizes.length
            ? '<div class="form-group"><label for="size">Size</label><select id="size" name="size">' +
              product.sizes
                .map(function (s, i) {
                  return (
                    '<option value="' +
                    s +
                    '"' +
                    (i === 0 ? " selected" : "") +
                    ">" +
                    s +
                    "</option>"
                  );
                })
                .join("") +
              "</select></div>"
            : "";

        var cats = product.categories
          .map(function (c) {
            return (
              '<a href="' +
              (window.sectionHref
                ? window.sectionHref(c.slug)
                : "products.html?category=" + encodeURIComponent(c.slug)) +
              '">' +
              c.name +
              "</a>"
            );
          })
          .join(" · ");

        root.innerHTML =
          '<nav class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Products</a> / ' +
          product.name +
          "</nav>" +
          '<div class="product-detail">' +
          '<div class="product-detail-media"><div class="product-image detail-thumb">' +
          (product.image
            ? '<img src="' + product.image + '" alt="">'
            : "<span>Reagent</span>") +
          "</div></div>" +
          '<div class="product-detail-info">' +
          '<p class="product-tag">' +
          cats +
          "</p>" +
          "<h1>" +
          product.name +
          "</h1>" +
          (product.sku
            ? '<p class="product-sku">Catalog #: <strong>' + product.sku + "</strong></p>"
            : "") +
          '<p class="detail-price" id="detail-price">' +
          product.price +
          "</p>" +
          '<p class="price-breakdown" id="unit-price-meta"></p>' +
          '<p class="price-breakdown price-total-line" id="line-total-meta"></p>' +
          (product.price_note
            ? '<p class="price-note">' + product.price_note + "</p>"
            : '<p class="price-note">Priced 10% below comparable list pricing</p>') +
          (product.price
            ? '<p class="price-range-note">Catalog size range: ' + product.price + "</p>"
            : "") +
          '<p class="stock ' +
          (product.in_stock ? "in-stock" : "out-stock") +
          '">' +
          (product.in_stock
            ? "In stock — order via Email or WhatsApp"
            : "Contact us for availability") +
          "</p>" +
          '<form id="add-to-cart" class="add-to-cart">' +
          sizes +
          '<div class="form-group"><label for="qty">Quantity</label><input type="number" id="qty" name="qty" min="1" value="1"></div>' +
          '<div id="buy-contact-wrap"></div>' +
          "</form>" +
          "</div></div>" +
          '<section class="product-description section-tight">' +
          "<h2>Overview</h2>" +
          "<p>" +
          (product.short || "Research-grade reagent.") +
          "</p>" +
          (product.description && product.description !== product.short
            ? "<h3>Details</h3><p>" + product.description + "</p>"
            : "") +
          '<p class="buy-contact-meta">Questions? Call <a href="' +
          SiteContact.telHref() +
          '">' +
          SiteContact.PHONE_DISPLAY +
          '</a> or email <a href="' +
          SiteContact.mailHref() +
          '">' +
          SiteContact.EMAIL +
          "</a>.</p>" +
          "</section>";

        refreshAll(product);

        var form = document.getElementById("add-to-cart");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          CartStore.addToCart(cartItemFromForm(product));
          window.location.href = "cart.html";
        });

        ["size", "qty"].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) {
            el.addEventListener("change", function () {
              refreshAll(product);
            });
            el.addEventListener("input", function () {
              refreshAll(product);
            });
          }
        });
      });
  }

  if (document.body.dataset.page === "product") initProduct();
})();
