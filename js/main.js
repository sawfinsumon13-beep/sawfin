(function () {
  window.updateCartCount = function () {
    var el = document.getElementById("cart-count");
    if (!el) return;
    var cart = JSON.parse(localStorage.getItem("apex_cart") || "[]");
    el.textContent = String(cart.length);
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (window.renderSiteHeader) renderSiteHeader();
    if (window.renderSiteFooter) renderSiteFooter();
    updateCartCount();

    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("nav-main");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    if (form && status) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        status.style.display = "block";
        status.textContent = "Thank you. We will respond within one business day.";
        form.reset();
      });
    }

    if (document.body.dataset.page === "home") initHome();
    if (document.body.dataset.page === "cart") initCart();
  });

  function initHome() {
    fetch("data/catalog.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (catalog) {
        var grid = document.getElementById("home-categories");
        if (!grid) return;
        grid.innerHTML = catalog.categories
          .map(function (c) {
            var img = c.image
              ? '<img src="' + c.image + '" alt="" loading="lazy">'
              : '<span class="cat-fallback">' + c.name.charAt(0) + "</span>";
            return (
              '<a class="category-card category-card-rich" href="products.html?category=' +
              encodeURIComponent(c.slug) +
              '">' +
              '<div class="category-card-img">' +
              img +
              "</div>" +
              "<h3>" +
              c.name +
              "</h3>" +
              '<p>' +
              c.count +
              " products</p></a>"
            );
          })
          .join("");

        var featured = document.getElementById("home-featured");
        if (!featured) return;
        var fibrils = catalog.products.filter(function (p) {
          return p.categories.some(function (c) {
            return c.slug === "preformed-fibrils" || c.name.indexOf("Preformed Fibrils") >= 0;
          });
        }).slice(0, 6);
        featured.innerHTML = fibrils.map(function (p) {
          var img = p.image
            ? '<div class="product-card-image"><img src="' + p.image + '" alt="" loading="lazy"></div>'
            : "";
          return (
            '<article class="product-card"><a href="product.html?slug=' +
            encodeURIComponent(p.slug) +
            '">' +
            img +
            '<div class="product-body"><p class="product-tag">Preformed fibrils</p><h3>' +
            p.name +
            "</h3><div class=\"product-meta\"><span>" +
            (p.sku || "") +
            '</span><span class="price">' +
            p.price +
            "</span></div></div></a></article>"
          );
        }).join("");
      })
      .catch(function () {});
  }

  function initCart() {
    var root = document.getElementById("cart-root");
    if (!root) return;
    var cart = JSON.parse(localStorage.getItem("apex_cart") || "[]");
    if (!cart.length) {
      root.innerHTML = '<p>Your cart is empty. <a href="products.html">Browse products</a>.</p>';
      return;
    }
    root.innerHTML =
      '<table class="cart-table"><thead><tr><th>Product</th><th>SKU</th><th>Size</th><th>Qty</th><th></th></tr></thead><tbody>' +
      cart
        .map(function (item, idx) {
          return (
            "<tr><td><a href=\"product.html?slug=" +
            encodeURIComponent(item.slug) +
            '">' +
            item.name +
            "</a></td><td>" +
            (item.sku || "—") +
            "</td><td>" +
            (item.size || "—") +
            "</td><td>" +
            item.qty +
            '</td><td><button type="button" data-idx="' +
            idx +
            '" class="cart-remove">Remove</button></td></tr>"
          );
        })
        .join("") +
      "</tbody></table>" +
      '<p><a href="contact.html" class="btn btn-primary">Request quote for cart</a></p>';

    root.querySelectorAll(".cart-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-idx"), 10);
        cart.splice(i, 1);
        localStorage.setItem("apex_cart", JSON.stringify(cart));
        initCart();
        updateCartCount();
      });
    });
  }
})();
