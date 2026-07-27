(function () {
  var SUBNAVS = {
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

  document.addEventListener("DOMContentLoaded", function () {
    var key = window.SITE_ACTIVE;
    var host = document.getElementById("subnav-" + key);
    if (!host || !SUBNAVS[key]) return;
    var path = (location.pathname.split("/").pop() || "").toLowerCase();
    host.innerHTML = SUBNAVS[key]
      .map(function (item) {
        var file = item.href.split("/").pop().toLowerCase();
        var active = path === file ? " active" : "";
        return '<a class="' + active.trim() + '" href="' + item.href + '">' + item.name + "</a>";
      })
      .join("");
  });
})();
