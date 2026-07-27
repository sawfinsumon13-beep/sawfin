(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav-main");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var chips = document.querySelectorAll(".filter-chip");
  var cards = document.querySelectorAll("#product-catalog .product-card");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("active");
      });
      chip.classList.add("active");
      var filter = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.style.display = "block";
      status.textContent =
        "Thank you — your inquiry has been recorded locally. Connect this form to your email or CRM backend to receive messages.";
      form.reset();
    });
  }
})();
