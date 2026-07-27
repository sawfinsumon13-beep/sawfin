(function () {
  var SECTION_HREF = {
    antibodies: "section-antibodies.html",
    "beta-amyloid-antibodies": "section-beta-amyloid-antibodies.html",
    "synuclein-antibodies": "section-synuclein-antibodies.html",
    "tau-antibodies": "section-tau-antibodies.html",
    peptides: "section-peptides.html",
    amylin: "section-amylin.html",
    "amyloid-precursor-protein-related-peptide":
      "section-amyloid-precursor-protein-related-peptide.html",
    "beta-amyloid": "section-beta-amyloid.html",
    proteins: "section-proteins.html",
    apolipoprotein: "section-apolipoprotein.html",
    chemokine: "section-chemokine.html",
    calmodulin: "section-calmodulin.html",
    "human-plasma-proteins": "section-human-plasma-proteins.html",
    surfactants: "section-surfactants.html",
    synuclein: "section-synuclein.html",
    tau: "section-tau.html",
    tubulin: "section-tubulin.html",
    "neurodegenerative-related-compounds": "section-neurodegenerative.html",
    "coronavirus-research-tools": "section-coronavirus.html",
    "covid-19-sars-cov-2-related-compounds":
      "section-covid-19-sars-cov-2-related-compounds.html",
    "covid-19-sars-cov-2-related-proteins":
      "section-covid-19-sars-cov-2-related-proteins.html",
    kits: "section-kits.html",
    "beta-amyloid-kits": "section-beta-amyloid-kits.html",
    "tau-kits": "section-tau-kits.html",
    "preformed-fibrils": "section-fibrils.html",
    "beta-amyloid-preformed-fibrils-preformed-fibrils":
      "section-beta-amyloid-preformed-fibrils-preformed-fibrils.html",
    "synuclein-preformed-fibrils-preformed-fibrils":
      "section-synuclein-preformed-fibrils-preformed-fibrils.html",
    "tau-preformed-fibrils-preformed-fibrils":
      "section-tau-preformed-fibrils-preformed-fibrils.html",
  };

  function sectionHref(slug) {
    return SECTION_HREF[slug] || "products.html?category=" + encodeURIComponent(slug);
  }
  window.sectionHref = sectionHref;

  var MEGA = {
    products: [
      {
        title: "Antibodies",
        href: sectionHref("antibodies"),
        children: [
          { name: "Beta-Amyloid Antibodies", slug: "beta-amyloid-antibodies" },
          { name: "Synuclein", slug: "synuclein-antibodies" },
          { name: "Tau", slug: "tau-antibodies" },
        ],
      },
      {
        title: "Peptides",
        href: sectionHref("peptides"),
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
        href: sectionHref("proteins"),
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
        href: sectionHref("neurodegenerative-related-compounds"),
        children: [],
      },
      {
        title: "Coronavirus Research Tools",
        href: sectionHref("coronavirus-research-tools"),
        children: [
          {
            name: "COVID-19/ Sars-Cov-2 Related Compounds",
            slug: "covid-19-sars-cov-2-related-compounds",
          },
          {
            name: "COVID-19/ Sars-Cov-2 Related Proteins",
            slug: "covid-19-sars-cov-2-related-proteins",
          },
        ],
      },
      {
        title: "Kits",
        href: sectionHref("kits"),
        children: [
          { name: "Beta-Amyloid", slug: "beta-amyloid-kits" },
          { name: "Tau", slug: "tau-kits" },
        ],
      },
      {
        title: "Preformed Fibrils",
        href: sectionHref("preformed-fibrils"),
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
        ],
      },
    ],
    services: [
      { name: "Custom Peptides & Proteins", href: "services-contract.html" },
      { name: "Lab Services", href: "services-lab.html" },
      { name: "Bulk Quote", href: "services-bulk.html" },
      { name: "Amino Acid Codes", href: "services-amino-acids.html" },
    ],
    resources: [
      { name: "Citations", href: "resources-citations.html" },
      { name: "Blogs", href: "blog.html" },
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
              '<a href="' +
              sectionHref(c.slug) +
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
    // Do not wipe a static HTML menu (homepage)
    if (el.getAttribute("data-static-header") === "true") {
      bindHeaderInteractions(el);
      return;
    }

    el.innerHTML =
      '<div class="container header-inner">' +
      '<a href="index.html" class="logo"><span class="logo-mark">R</span><span class="logo-text"><strong>Research peptides</strong><small>R&amp;D Starts Here</small></span></a>' +
      '<nav class="nav-main" id="nav-main" aria-label="Primary">' +
      dropdown("menu-products", "Products", '<div class="mega-grid">' + productMegaHtml() + "</div>", "products") +
      dropdown("menu-services", "Services", simpleMega(MEGA.services), "services") +
      dropdown("menu-resources", "Resources", simpleMega(MEGA.resources), "resources") +
      dropdown("menu-about", "About", simpleMega(MEGA.about), "about") +
      "</nav>" +
      '<div class="header-actions">' +
      '<form class="header-search" action="products.html" method="get" role="search">' +
      '<input type="search" name="q" placeholder="search" aria-label="Search products">' +
      '<button type="submit" aria-label="Search">🔍</button></form>' +
      '<a href="account.html" class="header-signin" data-auth-link>Sign In</a>' +
      '<a href="cart.html" class="header-cart" aria-label="Shopping cart">🛒 <span id="cart-count">0</span></a>' +
      '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-main" aria-label="Open menu">☰</button>' +
      "</div></div>";

    bindHeaderInteractions(el);
  };

  function bindHeaderInteractions(root) {
    root.querySelectorAll(".nav-dropdown").forEach(function (dd) {
      var trigger = dd.querySelector(".nav-dropdown-trigger");
      var panel = dd.querySelector(".nav-dropdown-panel");
      if (!trigger || !panel || trigger.dataset.bound) return;
      trigger.dataset.bound = "1";

      function open() {
        root.querySelectorAll(".nav-dropdown-panel.open").forEach(function (p) {
          if (p !== panel) p.classList.remove("open");
        });
        panel.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
      function close() {
        panel.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }

      // Hover like rPeptide mega menu
      dd.addEventListener("mouseenter", open);
      dd.addEventListener("mouseleave", close);
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        if (panel.classList.contains("open")) close();
        else open();
      });
    });

    var toggle = root.querySelector("#nav-toggle") || document.getElementById("nav-toggle");
    var nav = root.querySelector("#nav-main") || document.getElementById("nav-main");
    if (toggle && nav && !toggle.dataset.bound) {
      toggle.dataset.bound = "1";
      toggle.addEventListener("click", function () {
        var openNav = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", openNav ? "true" : "false");
      });
    }
  }

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
      '<a href="index.html" class="footer-logo">Research <span>peptides</span></a>' +
      '<p class="footer-tagline">Research peptides · Buy peptides · Peptides for sale</p>' +
      '<p class="footer-contact-lines">' +
      "ph: <a href=\"" +
      (window.SiteContact ? SiteContact.telHref() : "tel:+17867086594") +
      '">' +
      (window.SiteContact ? SiteContact.PHONE_DISPLAY : "+1 (786) 708-6594") +
      "</a><br>" +
      'e: <a href="' +
      (window.SiteContact ? SiteContact.mailHref() : "mailto:sales@researchpeptidesbio.com") +
      '">' +
      (window.SiteContact ? SiteContact.EMAIL : "sales@researchpeptidesbio.com") +
      "</a><br>" +
      '<a href="' +
      (window.SiteContact ? SiteContact.whatsappHref("Hello, I want to buy peptides and research peptides.") : "https://wa.me/17867086594") +
      '" target="_blank" rel="noopener">WhatsApp — buy peptides</a>' +
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
      "<span>Peptides, buy peptides, peptides for sale, and research peptides from Apex Bioreagents are for research purposes only. Not for human consumption.</span>" +
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
