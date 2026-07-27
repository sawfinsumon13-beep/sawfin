(function () {
  var MEGA = {
    products: [
      {
        title: "Antibodies",
        href: "products.html?category=antibodies",
        children: [
          { name: "Beta-Amyloid Antibodies", slug: "beta-amyloid-antibodies" },
          { name: "Synuclein", slug: "synuclein-antibodies" },
          { name: "Tau", slug: "tau-antibodies" },
        ],
      },
      {
        title: "Peptides",
        href: "products.html?category=peptides",
        children: [
          { name: "Amylin", slug: "amylin" },
          {
            name: "Amyloid Precursor Protein Related Peptide",
            slug: "amyloid-precursor-protein-related-peptide",
          },
          { name: "Beta-Amyloid", slug: "beta-amyloid" },
        ],
      },
      {
        title: "Proteins",
        href: "products.html?category=proteins",
        children: [
          { name: "Apolipoprotein", slug: "apolipoprotein" },
          { name: "Chemokine", slug: "chemokine" },
          { name: "Calmodulin", slug: "calmodulin" },
          { name: "Human Plasma Proteins", slug: "human-plasma-proteins" },
          { name: "Surfactants", slug: "surfactants" },
          { name: "Synuclein", slug: "synuclein" },
          { name: "Tau", slug: "tau" },
          { name: "Tubulin", slug: "tubulin" },
        ],
      },
      {
        title: "Neurodegenerative Related Compounds",
        href: "products.html?category=neurodegenerative-related-compounds",
        children: [],
      },
      {
        title: "Coronavirus Research Tools",
        href: "products.html?category=coronavirus-research-tools",
        children: [
          {
            name: "COVID-19 / SARS-CoV-2 Related Compounds",
            slug: "covid-19-sars-cov-2-related-compounds",
          },
          {
            name: "COVID-19 / SARS-CoV-2 Related Proteins",
            slug: "covid-19-sars-cov-2-related-proteins",
          },
          {
            name: "COVID-19 / SARS-CoV-2 Related Antibodies",
            slug: "covid-19-sars-cov-2-related-antibodies",
          },
          {
            name: "COVID-19 / SARS-CoV-2 Related Kits",
            slug: "covid-19-sars-cov-2-related-kits",
          },
        ],
      },
      {
        title: "Kits",
        href: "products.html?category=kits",
        children: [
          { name: "Beta-Amyloid", slug: "beta-amyloid-kits" },
          { name: "Tau", slug: "tau-kits" },
        ],
      },
      {
        title: "Preformed Fibrils",
        href: "products.html?category=preformed-fibrils",
        children: [
          {
            name: "Beta-Amyloid Preformed Fibrils",
            slug: "beta-amyloid-preformed-fibrils-preformed-fibrils",
          },
          {
            name: "Synuclein Preformed Fibrils",
            slug: "synuclein-preformed-fibrils-preformed-fibrils",
          },
          {
            name: "Tau Preformed Fibrils",
            slug: "tau-preformed-fibrils-preformed-fibrils",
          },
          {
            name: "Preformed Fibrils Complexes",
            slug: "preformed-fibrils-complexes",
          },
        ],
      },
    ],
    services: [
      { name: "Custom Peptides & Proteins", href: "services.html#contract" },
      { name: "Lab Services", href: "services.html#custom" },
      { name: "Bulk Quote", href: "services.html#bulk" },
      { name: "Amino Acid Codes", href: "resources-amino-acids.html" },
    ],
    resources: [
      { name: "Citations", href: "resources-citations.html" },
      { name: "Blog (50 articles)", href: "blog.html" },
      { name: "International Distributors", href: "resources-distributors.html" },
      { name: "FAQs", href: "resources-faqs.html" },
      { name: "Ordering Overview", href: "resources-ordering.html" },
      { name: "Terms of Use", href: "resources-terms.html" },
    ],
    about: [
      { name: "Our Company", href: "about.html" },
      { name: "Contact Information", href: "contact.html" },
    ],
  };

  function link(path, label, activeKey) {
    var cls = activeKey && window.SITE_ACTIVE === activeKey ? " active" : "";
    return '<a href="' + path + '" class="nav-link' + cls + '">' + label + "</a>";
  }

  function dropdown(id, label, columnsHtml, activeKey) {
    var cls = activeKey && window.SITE_ACTIVE === activeKey ? " active" : "";
    return (
      '<div class="nav-dropdown">' +
      '<button type="button" class="nav-dropdown-trigger' +
      cls +
      '" aria-expanded="false" aria-controls="' +
      id +
      '">' +
      label +
      ' <span aria-hidden="true">▾</span></button>' +
      '<div class="nav-dropdown-panel" id="' +
      id +
      '">' +
      columnsHtml +
      "</div></div>"
    );
  }

  function productMegaHtml() {
    return MEGA.products
      .map(function (col) {
        var links = col.children
          .map(function (c) {
            return (
              '<a href="products.html?category=' +
              encodeURIComponent(c.slug) +
              '">' +
              c.name +
              "</a>"
            );
          })
          .join("");
        return (
          '<div class="mega-col"><a class="mega-col-title" href="' +
          col.href +
          '">' +
          col.title +
          "</a>" +
          (links ? '<div class="mega-col-links">' + links + "</div>" : "") +
          "</div>"
        );
      })
      .join("");
  }

  function simpleMega(items) {
    return (
      '<div class="mega-simple">' +
      items
        .map(function (i) {
          return '<a href="' + i.href + '">' + i.name + "</a>";
        })
        .join("") +
      "</div>"
    );
  }

  window.renderSiteHeader = function () {
    var el = document.getElementById("site-header");
    if (!el) return;

    el.innerHTML =
      '<div class="container header-inner">' +
      '<a href="index.html" class="logo"><span class="logo-mark">A</span>Apex Bioreagents</a>' +
      '<nav class="nav-main" id="nav-main" aria-label="Primary">' +
      link("index.html", "Home", "home") +
      dropdown("menu-products", "Products", '<div class="mega-grid">' + productMegaHtml() + "</div>", "products") +
      dropdown("menu-services", "Services", simpleMega(MEGA.services), "services") +
      dropdown("menu-resources", "Resources", simpleMega(MEGA.resources), "resources") +
      link("blog.html", "Blog", "blog") +
      dropdown("menu-about", "About Us", simpleMega(MEGA.about), "about") +
      "</nav>" +
      '<div class="header-actions">' +
      '<form class="header-search" action="products.html" method="get" role="search">' +
      '<input type="search" name="q" placeholder="Search products…" aria-label="Search products">' +
      '<button type="submit" aria-label="Search">🔍</button></form>' +
      '<a href="account.html" class="header-signin">Sign In</a>' +
      '<a href="cart.html" class="header-cart" aria-label="Shopping cart">🛒 <span id="cart-count">0</span></a>' +
      '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-main" aria-label="Open menu">☰</button>' +
      "</div></div>";

    document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
      var trigger = dd.querySelector(".nav-dropdown-trigger");
      var panel = dd.querySelector(".nav-dropdown-panel");
      trigger.addEventListener("click", function () {
        var open = panel.classList.toggle("open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("nav-main");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  };

  function footerList(items) {
    return (
      "<ul>" +
      items
        .map(function (i) {
          return '<li><a href="' + i.href + '">' + i.name + "</a></li>";
        })
        .join("") +
      "</ul>"
    );
  }

  window.renderSiteFooter = function () {
    var el = document.getElementById("site-footer");
    if (!el) return;

    var productLinks = MEGA.products.map(function (p) {
      return { name: p.title, href: p.href };
    });

    el.innerHTML =
      '<div class="footer-wrap">' +
      '<div class="container footer-main">' +
      '<div class="footer-columns">' +
      '<div class="footer-col"><h4>Products</h4>' +
      footerList(productLinks) +
      "</div>" +
      '<div class="footer-col"><h4>Services</h4>' +
      footerList(MEGA.services) +
      "</div>" +
      '<div class="footer-col"><h4>Resources</h4>' +
      footerList(MEGA.resources) +
      "</div>" +
      '<div class="footer-col"><h4>About</h4>' +
      footerList(MEGA.about) +
      "</div>" +
      '<div class="footer-contact-col">' +
      '<a href="index.html" class="footer-logo">Apex <span>Bioreagents</span></a>' +
      '<p class="footer-contact-lines">' +
      "ph: <a href=\"tel:+18667530747\">866.753.0747</a><br>" +
      "fax: 678.753.0746<br>" +
      'e: <a href="mailto:sales@apexbio.example">sales@apexbio.example</a>' +
      "</p>" +
      '<div class="footer-social" aria-label="Social links">' +
      '<a href="#" aria-label="LinkedIn">in</a>' +
      '<a href="#" aria-label="Bluesky">🦋</a>' +
      '<a href="#" aria-label="X">𝕏</a>' +
      '<a href="#" aria-label="YouTube">▶</a>' +
      "</div></div></div>" +
      '<div class="footer-newsletter">' +
      "<h4>Newsletter Signup</h4>" +
      '<form id="newsletter-form" class="newsletter-form">' +
      '<input type="email" name="email" placeholder="email address" required aria-label="Email address">' +
      '<button type="submit" class="btn btn-newsletter">Subscribe</button>' +
      "</form></div></div>" +
      '<div class="footer-sub"><div class="container footer-sub-inner">' +
      "<span>© 2026 Apex Bioreagents · <a href=\"sitemap.html\">Sitemap</a> · <a href=\"privacy.html\">Privacy</a> · <a href=\"resources-terms.html\">Terms &amp; Conditions</a></span>" +
      "<span>Apex Bioreagents products are for research purposes only. Not for human consumption.</span>" +
      "</div></div></div>";

    var form = document.getElementById("newsletter-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = form.email.value;
        var list = JSON.parse(localStorage.getItem("apex_newsletter") || "[]");
        list.push({ email: email, at: new Date().toISOString() });
        localStorage.setItem("apex_newsletter", JSON.stringify(list));
        form.reset();
        alert("Subscribed — thank you!");
      });
    }
  };
})();
