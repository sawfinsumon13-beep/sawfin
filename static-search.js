/**
 * Client-side product search for static hosting.
 * Requires /products-index.json generated at build time.
 */
(function () {
  var indexPromise = null;

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch('/products-index.json')
        .then(function (r) { return r.json(); })
        .catch(function () { return []; });
    }
    return indexPromise;
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || params.get('query') || '').trim();
  }

  function normalize(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ');
  }

  function searchProducts(products, query) {
    var q = normalize(query);
    if (!q) return [];
    var terms = q.split(' ').filter(Boolean);
    return products.filter(function (p) {
      var hay = normalize(p.title + ' ' + p.handle + ' ' + (p.tags || ''));
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).slice(0, 48);
  }

  function renderResults(container, products, query) {
    if (!container) return;
    if (!query) {
      container.innerHTML = '<p class="search-hint">Enter a kitten name or breed to search.</p>';
      return;
    }
    if (!products.length) {
      container.innerHTML = '<p class="search-hint">No results for “' + query.replace(/</g, '&lt;') + '”. Try another name or breed.</p>';
      return;
    }
    var html = '<div class="static-search-results"><p class="search-hint">' + products.length + ' result(s) for “' + query.replace(/</g, '&lt;') + '”</p><ul class="static-search-list">';
    products.forEach(function (p) {
      html += '<li><a href="' + p.url + '">' +
        (p.image ? '<img src="' + p.image + '" alt="" loading="lazy">' : '') +
        '<span>' + p.title.replace(/</g, '&lt;') + '</span></a></li>';
    });
    html += '</ul></div>';
    container.innerHTML = html;
  }

  function ensureResultsContainer() {
    var existing = document.getElementById('static-search-results');
    if (existing) return existing;
    var main = document.querySelector('.search-page, main, .page-content, body');
    var el = document.createElement('div');
    el.id = 'static-search-results';
    el.className = 'static-search-results-wrap';
    if (main && main.firstChild) {
      main.insertBefore(el, main.firstChild);
    } else {
      document.body.appendChild(el);
    }
    return el;
  }

  function runPageSearch() {
    var query = getQuery();
    var input = document.querySelector('.search-form input[name="q"], .search-form input[type="search"]');
    if (input && query) input.value = query;
    if (!query) return;
    loadIndex().then(function (products) {
      renderResults(ensureResultsContainer(), searchProducts(products, query), query);
    });
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') return;
    var action = form.getAttribute('action') || '';
    if (action.indexOf('/search') === -1 && !form.classList.contains('search-form')) return;
    event.preventDefault();
    var input = form.querySelector('input[name="q"], input[type="search"]');
    var q = input ? input.value.trim() : '';
    window.location.href = '/search.html?q=' + encodeURIComponent(q);
  }, true);

  document.addEventListener('DOMContentLoaded', runPageSearch);
})();
