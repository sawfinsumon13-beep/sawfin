(function () {
  var state = {
    items: [],
    page: 0,
    pageSize: 24,
    filter: "all",
  };

  function byFilter(items) {
    if (state.filter === "all") return items;
    return items.filter(function (item) {
      return item.category === state.filter;
    });
  }

  function render() {
    var grid = document.getElementById("why-buy-grid");
    var countEl = document.getElementById("why-buy-count");
    var moreBtn = document.getElementById("why-buy-more");
    if (!grid) return;

    var filtered = byFilter(state.items);
    var end = Math.min((state.page + 1) * state.pageSize, filtered.length);
    var slice = filtered.slice(0, end);

    if (countEl) {
      countEl.textContent =
        "Showing " + slice.length + " of " + filtered.length + " benefits";
    }

    grid.innerHTML = slice
      .map(function (item) {
        return (
          '<article class="why-buy-card">' +
          '<p class="why-buy-tag">' +
          (item.reason || "Benefit") +
          "</p>" +
          "<h3>" +
          item.title +
          "</h3>" +
          "<p>" +
          item.summary +
          "</p>" +
          '<p class="why-buy-benefit">' +
          item.benefit +
          "</p>" +
          '<a class="btn-pill-gold" href="' +
          item.href +
          '">' +
          item.cta +
          "</a>" +
          "</article>"
        );
      })
      .join("");

    if (moreBtn) {
      moreBtn.hidden = end >= filtered.length;
      moreBtn.textContent =
        end >= filtered.length
          ? "All benefits loaded"
          : "Load more benefits (" + (filtered.length - end) + " remaining)";
    }
  }

  function initFilters(items) {
    var wrap = document.getElementById("why-buy-filters");
    if (!wrap) return;
    var cats = {};
    items.forEach(function (item) {
      cats[item.category] = true;
    });
    var keys = Object.keys(cats).sort();
    wrap.innerHTML =
      '<button type="button" class="why-buy-filter is-active" data-filter="all">All</button>' +
      keys
        .map(function (cat) {
          return (
            '<button type="button" class="why-buy-filter" data-filter="' +
            cat +
            '">' +
            cat.charAt(0).toUpperCase() +
            cat.slice(1) +
            "</button>"
          );
        })
        .join("");

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      state.filter = btn.getAttribute("data-filter");
      state.page = 0;
      wrap.querySelectorAll(".why-buy-filter").forEach(function (el) {
        el.classList.toggle("is-active", el === btn);
      });
      render();
    });
  }

  function initWhyBuy() {
    var root = document.getElementById("why-buy-grid");
    if (!root) return;

    fetch("data/why-buy/why-buy-all.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        state.items = data.items || [];
        var total = document.getElementById("why-buy-total");
        if (total) total.textContent = String(state.items.length);
        initFilters(state.items);
        render();

        var moreBtn = document.getElementById("why-buy-more");
        if (moreBtn) {
          moreBtn.addEventListener("click", function () {
            state.page += 1;
            render();
          });
        }
      })
      .catch(function () {
        root.innerHTML =
          "<p>Benefits content is loading. Please refresh if this message stays.</p>";
      });
  }

  document.addEventListener("DOMContentLoaded", initWhyBuy);
})();
