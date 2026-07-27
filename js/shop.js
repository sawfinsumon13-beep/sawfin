(function () {
  var catalog = null;
  var state = {
    category: "all",
    sort: "name-asc",
    search: "",
    page: 1,
    perPage: 36,
  };

  var COPY = {
    antibodies: {
      title: "Antibodies",
      blurb:
        "Reliable, high-quality reagents with batch-to-batch consistency such as Beta-Amyloid Antibodies, Alpha-Synuclein Antibodies, and Tau Antibodies to advance Alzheimer’s, Parkinson’s and neurodegenerative disease research worldwide.",
      featured: "Beta-Amyloid, Synuclein, & Tau",
    },
    peptides: {
      title: "Peptides",
      blurb:
        "Buy research peptides online — recombinant Beta-Amyloid mutant, native, fragments, labeled, and synthetic formats, plus Amylin and Amyloid Precursor Protein related peptides for Alzheimer’s and neurodegeneration programs.",
      featured: "Recombinant Beta-Amyloid Mutant, Native, Fragments, Labeled, & Synthetic",
    },
    proteins: {
      title: "Proteins",
      blurb:
        "Recombinant Tau & Synuclein wild type, fragments, labeled proteins, plus Apolipoprotein, Calmodulin, Chemokine, Human Plasma Proteins, Surfactants, and Tubulin for Parkinson’s and neurodegenerative research.",
      featured: "Recombinant Tau & Synuclein Wild Type, Fragments, & Labeled",
    },
    "neurodegenerative-related-compounds": {
      title: "Neurodegenerative Related Compounds",
      blurb:
        "Research compounds that support Alzheimer’s, Parkinson’s, and related neurodegenerative pathways — complementary tools when you buy research peptides and proteins for disease modeling.",
      featured: "Neurodegenerative assay compounds",
    },
    "coronavirus-research-tools": {
      title: "Coronavirus Research Tools",
      blurb:
        "COVID-19 / SARS-CoV-2 related compounds, proteins, antibodies, and kits for virology programs alongside neurodegeneration catalogs.",
      featured: "COVID-19 / SARS-CoV-2 compounds, proteins, antibodies & kits",
    },
    kits: {
      title: "Kits",
      blurb:
        "All-in-one kits including Beta-Amyloid aggregation kits, Beta-Amyloid and Tau starter kits, and peptide + antibody kits for Alzheimer’s, Parkinson’s and neurodegenerative disease research worldwide.",
      featured: "Beta-Amyloid & Tau",
    },
    "preformed-fibrils": {
      title: "Preformed Fibrils",
      blurb:
        "Preformed fibrils (PFFs) for Beta-Amyloid, Synuclein, Tau, and complexes — ready-to-use reagents for seeding, morphology, and propagation studies.",
      featured: "Beta-Amyloid, Synuclein, Tau, & Complexes",
    },
  };

  var TOP_ORDER = [
    "antibodies",
    "peptides",
    "proteins",
    "neurodegenerative-related-compounds",
    "coronavirus-research-tools",
    "kits",
    "preformed-fibrils",
  ];

  function catUrl(slug) {
    if (window.sectionHref) return window.sectionHref(slug);
    return catUrl(slug);
  }

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

  function findCategory(slug) {
    if (!slug || slug === "all") return null;
    function walk(nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].slug === slug) return nodes[i];
        if (nodes[i].children && nodes[i].children.length) {
          var found = walk(nodes[i].children);
          if (found) return found;
        }
      }
      return null;
    }
    return walk(catalog.categories);
  }

  function collectSlugs(node) {
    var slugs = [node.slug];
    (node.children || []).forEach(function (child) {
      slugs = slugs.concat(collectSlugs(child));
    });
    return slugs;
  }

  function productMatchesCategory(product, slug) {
    if (!slug || slug === "all") return true;
    var node = findCategory(slug);
    var allowed = node ? collectSlugs(node) : [slug];
    return product.categories.some(function (c) {
      return allowed.indexOf(c.slug) !== -1;
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

  function markCategoryBar() {
    var top = findTopParent(state.category);
    document.querySelectorAll(".category-bar a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var match = href.match(/category=([^&]+)/);
      var slug = match ? decodeURIComponent(match[1]) : "";
      a.classList.toggle("active", top === slug || state.category === slug);
    });
  }

  function findTopParent(slug) {
    if (!slug || slug === "all") return null;
    if (TOP_ORDER.indexOf(slug) !== -1) return slug;
    for (var i = 0; i < catalog.categories.length; i++) {
      var top = catalog.categories[i];
      if (collectSlugs(top).indexOf(slug) !== -1) return top.slug;
    }
    return null;
  }

  function renderHub() {
    var hub = document.getElementById("category-hub");
    var detail = document.getElementById("category-detail");
    hub.hidden = false;
    detail.hidden = true;
    document.title =
      "Products | Buy Research Peptides, Proteins, Antibodies & Fibrils | Apex Bioreagents";

    var bySlug = {};
    catalog.categories.forEach(function (c) {
      bySlug[c.slug] = c;
    });

    hub.innerHTML =
      '<header class="section-header" style="margin-bottom:2rem">' +
      '<p class="section-eyebrow">Shop by family</p>' +
      "<h2>Recombinant Peptides, Proteins, Antibodies, Fibrils &amp; more</h2>" +
      "<p>Browse every option to buy research peptides and related reagents — the same product families used by leading neurodegeneration suppliers.</p>" +
      "</header>" +
      '<div class="hub-grid">' +
      TOP_ORDER.map(function (slug) {
        var c = bySlug[slug] || { name: slug, count: 0, image: "", children: [] };
        var copy = COPY[slug] || { featured: "", blurb: "" };
        var img = c.image
          ? '<img src="' + c.image + '" alt="' + c.name + '">'
          : "";
        var kids = (c.children || [])
          .slice(0, 6)
          .map(function (ch) {
            return '<a href="' + catUrl(ch.slug) + '">' + ch.name + "</a>";
          })
          .join("");
        return (
          '<article class="hub-card">' +
          '<a class="hub-card-media" href="' +
          catUrl(slug) +
          '">' +
          img +
          "</a>" +
          '<div class="hub-card-body">' +
          '<h3><a href="' +
          catUrl(slug) +
          '">' +
          (copy.title || c.name) +
          "</a></h3>" +
          '<p class="hub-featured">' +
          (copy.featured || "") +
          "</p>" +
          "<p>" +
          (copy.blurb || "") +
          "</p>" +
          (kids ? '<div class="hub-sublinks">' + kids + "</div>" : "") +
          '<a class="btn btn-primary" href="' +
          catUrl(slug) +
          '">Shop ' +
          (slug === "neurodegenerative-related-compounds"
            ? "Compounds"
            : copy.title || c.name) +
          "</a>" +
          "</div></article>"
        );
      }).join("") +
      "</div>";

    document.querySelectorAll(".category-bar a").forEach(function (a) {
      a.classList.remove("active");
    });
  }

  function renderSidebar() {
    var aside = document.getElementById("shop-sidebar");
    if (!aside || !catalog) return;
    var topSlug = findTopParent(state.category) || state.category;
    var top = findCategory(topSlug) || { slug: topSlug, name: topSlug, children: [], count: 0 };

    function link(slug, label, count, depth) {
      var active = state.category === slug ? " active" : "";
      var pad = depth ? ' style="padding-left:' + (0.5 + depth * 0.65) + 'rem"' : "";
      return (
        '<a class="sidebar-link' +
        active +
        '"' +
        pad +
        ' href="' +
        catUrl(slug) +
        '">' +
        label +
        (count != null ? ' <span class="count">' + count + "</span>" : "") +
        "</a>"
      );
    }

    function renderNodes(nodes, depth) {
      var html = "";
      nodes.forEach(function (node) {
        html += link(node.slug, node.name, node.count, depth);
        if (node.children && node.children.length) {
          html +=
            '<div class="sidebar-children">' +
            renderNodes(node.children, depth + 1) +
            "</div>";
        }
      });
      return html;
    }

    var html = '<div class="sidebar-block"><h3>In this family</h3>';
    html += link(top.slug, "All " + top.name, top.count, 0);
    html += renderNodes(top.children || [], 1);
    html +=
      '</div><div class="sidebar-block" style="margin-top:1.5rem"><h3>All families</h3>';
    TOP_ORDER.forEach(function (slug) {
      var c = catalog.categories.find(function (x) {
        return x.slug === slug;
      });
      if (c) html += link(c.slug, c.name, c.count, 0);
    });
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
      : '<span class="thumb-label">' +
        (p.categories[0] ? p.categories[0].name : "Product") +
        "</span>";
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
      "</span></div>" +
      '<span class="shop-btn-gold">Buy / view</span>' +
      "</div></a></article>"
    );
  }

  function renderSubcats(node) {
    var bar = document.getElementById("subcat-bar");
    if (!bar) return;
    var kids = (node && node.children) || [];
    if (!kids.length) {
      bar.innerHTML = "";
      return;
    }
    bar.innerHTML = kids
      .map(function (c) {
        return (
          '<a href="products.html?category=' +
          encodeURIComponent(c.slug) +
          '"' +
          (state.category === c.slug ? ' class="active"' : "") +
          ">" +
          c.name +
          "</a>"
        );
      })
      .join("");
  }

  function renderGrid() {
    var grid = document.getElementById("product-grid");
    var meta = document.getElementById("shop-meta");
    var title = document.getElementById("shop-title");
    var desc = document.getElementById("shop-desc");
    var crumb = document.getElementById("cat-crumb");
    if (!grid || !catalog) return;

    var node = findCategory(state.category);
    var topSlug = findTopParent(state.category);
    var copy = COPY[topSlug] || COPY[state.category] || {};
    var heading = node ? node.name : copy.title || "Products";

    if (title) title.textContent = heading;
    if (crumb) crumb.textContent = heading;
    if (desc) {
      desc.textContent =
        (node && node.slug === topSlug && copy.blurb) ||
        copy.blurb ||
        "Browse reagents in this family. Buy research peptides and related catalog items with SKUs, sizes, and documentation.";
    }

    renderSubcats(node && node.children && node.children.length ? node : findCategory(topSlug));

    var filtered = sortProducts(filterProducts());
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.perPage;
    var pageItems = filtered.slice(start, start + state.perPage);

    if (meta) {
      meta.textContent =
        "Showing " +
        (total ? start + 1 : 0) +
        "–" +
        Math.min(start + state.perPage, total) +
        " of " +
        total +
        " results";
    }

    grid.innerHTML =
      pageItems.map(productCard).join("") ||
      '<p class="empty">No products match your filters.</p>';

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
        window.scrollTo({ top: 360, behavior: "smooth" });
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

  function showDetail() {
    document.getElementById("category-hub").hidden = true;
    document.getElementById("category-detail").hidden = false;
    markCategoryBar();
    renderSidebar();
    bindControls();
    renderGrid();
  }

  function initShop() {
    state.category = window.FORCE_CATEGORY || qs("category") || "all";
    state.search = qs("q") || "";
    window.SITE_ACTIVE = "products";
    renderSiteHeader();
    renderSiteFooter();

    loadCatalog()
      .then(function () {
        var search = document.getElementById("shop-search");
        if (search && state.search) search.value = state.search;
        // Section pages always show detail for their category
        if (window.FORCE_CATEGORY) {
          showDetail();
          return;
        }
        if (!state.category || state.category === "all") {
          renderHub();
        } else {
          showDetail();
        }
      })
      .catch(function () {
        var hub = document.getElementById("category-hub");
        if (hub) {
          hub.hidden = false;
          hub.innerHTML =
            "<p>Could not load product catalog. Serve the site over HTTP.</p>";
        }
      });
  }

  if (document.body.dataset.page === "shop") initShop();
})();
