(function () {
  window.updateCartCount = function () {
    var el = document.getElementById("cart-count");
    if (!el) return;
    var cart = typeof CartStore !== "undefined" ? CartStore.getCart() : JSON.parse(localStorage.getItem("apex_cart") || "[]");
    var qty = cart.reduce(function (n, row) {
      return n + (row.qty || 1);
    }, 0);
    el.textContent = String(qty);
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (window.renderSiteHeader) renderSiteHeader();
    // Keep static homepage footer; rebuild footer on other pages
    var footer = document.getElementById("site-footer");
    if (window.renderSiteFooter && footer && !footer.querySelector(".footer-wrap")) {
      renderSiteFooter();
    }
    var newsletter = document.getElementById("newsletter-form");
    if (newsletter && !newsletter.dataset.bound) {
      newsletter.dataset.bound = "1";
      newsletter.addEventListener("submit", function (e) {
        e.preventDefault();
        var list = JSON.parse(localStorage.getItem("apex_newsletter") || "[]");
        list.push({ email: newsletter.email.value, at: new Date().toISOString() });
        localStorage.setItem("apex_newsletter", JSON.stringify(list));
        newsletter.reset();
        alert("Subscribed — thank you!");
      });
    }
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
        if (grid && !grid.children.length) {
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
                "<p>" +
                c.count +
                " products</p></a>"
              );
            })
            .join("");
        }

        var featured = document.getElementById("home-featured");
        if (featured) {
          var fibrils = catalog.products
            .filter(function (p) {
              return p.categories.some(function (c) {
                return (
                  c.slug === "preformed-fibrils" ||
                  c.name.indexOf("Preformed Fibrils") >= 0
                );
              });
            })
            .slice(0, 6);
          if (fibrils.length) {
            featured.innerHTML = fibrils
              .map(function (p) {
                var img = p.image
                  ? '<div class="product-card-image"><img src="' +
                    p.image +
                    '" alt="" loading="lazy"></div>'
                  : "";
                return (
                  '<article class="product-card"><a href="product.html?slug=' +
                  encodeURIComponent(p.slug) +
                  '">' +
                  img +
                  '<div class="product-body"><p class="product-tag">Preformed fibrils</p><h3>' +
                  p.name +
                  '</h3><div class="product-meta"><span>' +
                  (p.sku || "") +
                  '</span><span class="price">' +
                  p.price +
                  "</span></div></div></a></article>"
                );
              })
              .join("");
          }
        }
      })
      .catch(function () {});

    fetch("data/blog-posts.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (posts) {
        var homeBlog = document.getElementById("home-blog");
        if (!homeBlog) return;
        homeBlog.innerHTML = posts
          .slice(0, 6)
          .map(function (post) {
            return (
              '<article class="blog-card"><a href="blog-post.html?slug=' +
              encodeURIComponent(post.slug) +
              '"><div class="blog-card-image"><img src="' +
              post.image +
              '" alt="" loading="lazy"></div><div class="blog-card-body"><p class="product-tag">' +
              post.category +
              "</p><h3>" +
              post.title +
              "</h3><p>" +
              post.excerpt +
              '</p><span class="blog-read">Read article →</span></div></a></article>'
            );
          })
          .join("");
      })
      .catch(function () {});
  }

  function initCart() {
    var root = document.getElementById("cart-root");
    if (!root) return;
    var cart = CartStore.getCart();
    if (!cart.length) {
      root.innerHTML = '<p>Your cart is empty. <a href="products.html">Browse products</a> to purchase.</p>';
      return;
    }

    var sub = CartStore.cartSubtotal(cart);
    root.innerHTML =
      '<table class="cart-table"><thead><tr><th>Product</th><th>SKU</th><th>Size</th><th>Qty</th><th>Line total</th><th></th></tr></thead><tbody>' +
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
            '</td><td><input class="cart-qty-input" type="number" min="1" value="' +
            item.qty +
            '" data-idx="' +
            idx +
            '"></td><td>' +
            CartStore.formatMoney((item.unitPrice || 0) * item.qty) +
            '</td><td><button type="button" data-idx="' +
            idx +
            '" class="cart-remove">Remove</button></td></tr>"
          );
        })
        .join("") +
      "</tbody></table>" +
      '<p class="checkout-total"><span>Estimated subtotal</span><strong>' +
      CartStore.formatMoney(sub) +
      "</strong></p>" +
      '<div class="buy-contact-actions">' +
      '<p class="buy-contact-note">To buy these products, send your order via <strong>Email</strong> or <strong>WhatsApp</strong>:</p>' +
      '<div class="product-actions-row">' +
      '<a class="btn btn-primary btn-lg" href="' +
      SiteContact.mailHref("Order request — cart", SiteContact.cartMessage(cart)) +
      '">Email to buy</a>' +
      '<a class="btn btn-whatsapp btn-lg" href="' +
      SiteContact.whatsappHref(SiteContact.cartMessage(cart)) +
      '" target="_blank" rel="noopener">WhatsApp to buy</a>' +
      '<a href="products.html" class="btn btn-secondary">Continue shopping</a></div>' +
      '<p class="buy-contact-meta">Phone: <a href="' +
      SiteContact.telHref() +
      '">' +
      SiteContact.PHONE_DISPLAY +
      '</a> · Email: <a href="' +
      SiteContact.mailHref() +
      '">' +
      SiteContact.EMAIL +
      "</a></p></div>";

    root.querySelectorAll(".cart-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-idx"), 10);
        cart.splice(i, 1);
        CartStore.setCart(cart);
        initCart();
      });
    });

    root.querySelectorAll(".cart-qty-input").forEach(function (input) {
      input.addEventListener("change", function () {
        var i = parseInt(input.getAttribute("data-idx"), 10);
        cart[i].qty = Math.max(1, parseInt(input.value, 10) || 1);
        CartStore.setCart(cart);
        initCart();
      });
    });
  }
})();
