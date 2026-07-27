(function () {
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function cartItemFromForm(product) {
    var sizeEl = document.getElementById("size");
    return {
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.image,
      qty: parseInt(document.getElementById("qty").value, 10) || 1,
      size: sizeEl ? sizeEl.value : null,
    };
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

        document.title = product.name + " | Apex Bioreagents";

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
              '<a href="products.html?category=' +
              encodeURIComponent(c.slug) +
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
          "<p class=\"product-tag\">" +
          cats +
          "</p>" +
          "<h1>" +
          product.name +
          "</h1>" +
          (product.sku ? '<p class="product-sku">Catalog #: <strong>' + product.sku + "</strong></p>" : "") +
          '<p class="detail-price">' +
          product.price +
          "</p>" +
          '<p class="stock ' +
          (product.in_stock ? "in-stock" : "out-stock") +
          '">' +
          (product.in_stock ? "In stock — ready to ship" : "Contact us for availability") +
          "</p>" +
          '<form id="add-to-cart" class="add-to-cart">' +
          sizes +
          '<div class="form-group"><label for="qty">Quantity</label><input type="number" id="qty" name="qty" min="1" value="1"></div>' +
          '<div class="product-actions-row">' +
          '<button type="submit" class="btn btn-primary">Add to cart</button>' +
          '<button type="button" id="buy-now" class="btn btn-secondary">Buy now</button>' +
          '<a href="cart.html" class="btn btn-secondary">View cart</a>' +
          "</div></form>" +
          "</div></div>" +
          '<section class="product-description section-tight">' +
          "<h2>Overview</h2>" +
          "<p>" +
          (product.short || "Research-grade reagent.") +
          "</p>" +
          (product.description && product.description !== product.short
            ? "<h3>Details</h3><p>" + product.description + "</p>"
            : "") +
          "</section>";

        var form = document.getElementById("add-to-cart");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          CartStore.addToCart(cartItemFromForm(product));
          window.location.href = "cart.html";
        });

        document.getElementById("buy-now").addEventListener("click", function () {
          CartStore.setCart([]);
          CartStore.addToCart(cartItemFromForm(product));
          window.location.href = "checkout.html";
        });
      });
  }

  if (document.body.dataset.page === "product") initProduct();
})();
