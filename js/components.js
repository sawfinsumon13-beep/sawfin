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
      { name: "Blogs", href: "resources-blogs.html" },
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
      dropdown("menu-about", "About Us", simpleMega(MEGA.about), "about") +
      "</nav>" +
      '<div class="header-actions">' +
      '<a href="cart.html" class="header-cart" aria-label="Cart">Cart <span id="cart-count">0</span></a>' +
      '<a href="contact.html" class="btn btn-secondary">Request Quote</a>' +
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

  window.renderSiteFooter = function () {
    var el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand"><a href="index.html" class="logo"><span class="logo-mark">A</span>Apex Bioreagents</a>' +
      "<p>Full-line catalog: antibodies, peptides, proteins, kits, fibrils, and research compounds for neurodegeneration and virology programs.</p></div>" +
      '<div class="footer-col"><h4>Shop</h4><ul>' +
      MEGA.products
        .map(function (p) {
          return "<li><a href=\"" + p.href + '">' + p.title + "</a></li>";
        })
        .join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Services</h4><ul>' +
      MEGA.services
        .map(function (s) {
          return '<li><a href="' + s.href + '">' + s.name + "</a></li>";
        })
        .join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Contact</h4><ul>' +
      '<li><a href="mailto:orders@apexbio.example">orders@apexbio.example</a></li>' +
      '<li><a href="tel:+18005550142">+1 (800) 555-0142</a></li>' +
      '<li><a href="contact.html">Contact form</a></li></ul></div></div>' +
      '<div class="footer-bottom"><span>© 2026 Apex Bioreagents. Demo catalog structure modeled on industry suppliers.</span>' +
      "<span>For research use only.</span></div></div>";
  };
})();
