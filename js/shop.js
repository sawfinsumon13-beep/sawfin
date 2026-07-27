(function () {
  var catalog = null;
  var state = {
    category: "all",
    sort: "name-asc",
    search: "",
    page: 1,
    perPage: 24,
  };

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function loadCatalog() {
    return fetch("data/catalog.json")
      .then(function (r) {
        if (!r.ok) throw new Error("catalog");
        return r.json();
      })
      .then(function (data) {
        catalog = data;
        return data;
      });
  }

  function productMatchesCategory(product, slug) {
    if (!slug || slug === "all") return true;
    return product.categories.some(function (c) {
      return c.slug === slug;
    });
  }

  function sortProducts(list) {
    var sorted = list.slice();
    sorted.sort(function (a, b) {
      if (state.sort === "name-desc") return b.name.localeCompare(a.name);
      if (state.sort === "sku") return (a.sku || "").localeCompare(b.sku || "");
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }

  function filterProducts() {
    var q = state.search.trim().toLowerCase();
    return catalog.products.filter(function (p) {
      if (!productMatchesCategory(p, state.category)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.categories.some(function (c) {
          return c.name.toLowerCase().includes(q);
        })
      );
    });
  }

  function categoryTitle(slug) {
    if (!slug || slug === "all") return "All products";
    var found = catalog.categories
      .concat(
        catalog.categories.flatMap(function (c) {
          return c.children || [];
        })
      )
      .find(function (c) {
        return c.slug === slug;
      });
    if (found) return found.name;
    var fromProduct = catalog.products.find(function (p) {
      return p.categories.some(function (c) {
        return c.slug === slug;
      });
    });
    if (fromProduct) {
      var cat = fromProduct.categories.find(function (c) {
        return c.slug === slug;
      });
      if (cat) return cat.name;
    }
    return slug.replace(/-/g, " ");
  }

  function renderSidebar() {
    var aside = document.getElementById("shop-sidebar");
    if (!aside || !catalog) return;

    function link(slug, label, count, depth) {
      var active = state.category === slug ? " active" : "";
      var pad = depth ? ' style="padding-left:' + (0.5 + depth * 0.65) + 'rem"' : "";
      return (
        '<a class="sidebar-link' +
        active +
        '"' +
        pad +
        ' href="products.html?category=' +
        encodeURIComponent(slug) +
        '">' +
        label +
        (count ? ' <span class="count">' + count + "</span>" : "") +
        "</a>"
      );
    }

    function renderNodes(nodes, depth) {
      var html = "";
      nodes.forEach(function (node) {
        html += link(node.slug, node.name, node.count, depth);
        if (node.children && node.children.length) {
          html += '<div class="sidebar-children">' + renderNodes(node.children, depth + 1) + "</div>";
        }
      });
      return html;
    }

    var html = '<div class="sidebar-block"><h3>Product families</h3>';
    html += link("all", "All products", catalog.products.length, 0);
    html += renderNodes(catalog.categories, 0);
    html += "</div>";
    aside.innerHTML = html;
  }

  function productCard(p) {
    var cats = p.categories
      .map(function (c) {
        return c.name;
      })
      .slice(0, 2)
      .join(" · ");
    var sizes =
      p.sizes && p.sizes.length
        ? '<p class="product-sizes">Sizes: ' + p.sizes.join(", ") + "</p>"
        : "";
    var img = p.image
      ? '<img src="' + p.image + '" alt="" loading="lazy">'
      : '<span class="thumb-label">' + (p.categories[0] ? p.categories[0].name : "Product") + "</span>";
    return (
      '<article class="product-card shop-card">' +
      '<a href="product.html?slug=' +
      encodeURIComponent(p.slug) +
      '" class="shop-card-link">' +
      '<div class="product-image shop-thumb product-card-image">' +
      img +
      "</div>" +
      '<div class="product-body">' +
      '<p class="product-tag">' +
      cats +
      "</p>" +
      "<h3>" +
      p.name +
      "</h3>" +
      (p.sku ? '<p class="product-sku">SKU: ' + p.sku + "</p>" : "") +
      sizes +
      '<div class="product-meta"><span class="price">' +
      p.price +
      '</span><span class="' +
      (p.in_stock ? "in-stock" : "out-stock") +
      '">' +
      (p.in_stock ? "In stock" : "Request quote") +
      "</span></div></div></a></article>"
    );
  }

  function renderGrid() {
    var grid = document.getElementById("product-grid");
    var meta = document.getElementById("shop-meta");
    var title = document.getElementById("shop-title");
    if (!grid || !catalog) return;

    var filtered = sortProducts(filterProducts());
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.perPage;
    var pageItems = filtered.slice(start, start + state.perPage);

    if (title) title.textContent = categoryTitle(state.category);
    if (meta) {
      meta.textContent =
        "Showing " +
        (total ? start + 1 : 0) +
        "–" +
        Math.min(start + state.perPage, total) +
        " of " +
        total +
        " products";
    }

    grid.innerHTML = pageItems.map(productCard).join("") || '<p class="empty">No products match your filters.</p>';

    var pager = document.getElementById("shop-pager");
    if (!pager) return;
    if (pages <= 1) {
      pager.innerHTML = "";
      return;
    }
    var buttons = "";
    for (var i = 1; i <= pages; i++) {
      buttons +=
        '<button type="button" class="pager-btn' +
        (i === state.page ? " active" : "") +
        '" data-page="' +
        i +
        '">' +
        i +
        "</button>";
    }
    pager.innerHTML = buttons;
    pager.querySelectorAll(".pager-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.page = parseInt(btn.getAttribute("data-page"), 10);
        renderGrid();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function bindControls() {
    var search = document.getElementById("shop-search");
    var sort = document.getElementById("shop-sort");
    if (search) {
      search.addEventListener("input", function () {
        state.search = search.value;
        state.page = 1;
        renderGrid();
      });
    }
    if (sort) {
      sort.addEventListener("change", function () {
        state.sort = sort.value;
        renderGrid();
      });
    }
  }

  function initShop() {
    state.category = qs("category") || "all";
    state.search = qs("q") || "";
    window.SITE_ACTIVE = "products";
    renderSiteHeader();
    renderSiteFooter();

    loadCatalog()
      .then(function () {
        var search = document.getElementById("shop-search");
        if (search && state.search) search.value = state.search;
        renderSidebar();
        bindControls();
        renderGrid();
      })
      .catch(function () {
        var grid = document.getElementById("product-grid");
        if (grid) {
          grid.innerHTML =
            '<p class="empty">Could not load product catalog. Serve the site over HTTP (not file://).</p>';
        }
      });
  }

  if (document.body.dataset.page === "shop") initShop();
})();
