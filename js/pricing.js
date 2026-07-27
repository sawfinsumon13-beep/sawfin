(function (global) {
  function parsePriceNumbers(priceText) {
    if (!priceText) return [];
    var matches = String(priceText).match(/\$([\d,]+(?:\.\d{2})?)/g);
    if (!matches) return [];
    return matches
      .map(function (m) {
        return parseFloat(m.replace(/[$,]/g, "")) || 0;
      })
      .filter(function (n) {
        return n > 0;
      });
  }

  function parsePriceRange(priceText) {
    var nums = parsePriceNumbers(priceText);
    if (!nums.length) return { lo: 0, hi: 0 };
    return {
      lo: Math.min.apply(null, nums),
      hi: Math.max.apply(null, nums),
    };
  }

  function sizeMagnitude(size) {
    if (!size) return 0;
    var s = String(size).toLowerCase().replace(/µ/g, "u").replace(/μ/g, "u");
    var m = s.match(/([\d.]+)\s*(ug|mg|g|ul|ml|kit|test|tests)/);
    if (!m) {
      var n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    }
    var value = parseFloat(m[1]);
    var unit = m[2];
    var mult = {
      ug: 1,
      ul: 1,
      mg: 1000,
      ml: 1000,
      g: 1000000,
      kit: 1,
      test: 1,
      tests: 1,
    }[unit] || 1;
    return value * mult;
  }

  function sortedSizes(sizes) {
    return (sizes || []).slice().sort(function (a, b) {
      return sizeMagnitude(a) - sizeMagnitude(b);
    });
  }

  function unitPriceForSize(product, size) {
    var range = parsePriceRange(product && product.price);
    var sizes = sortedSizes(product && product.sizes);
    if (!sizes.length) return range.lo || range.hi || 0;
    if (sizes.length === 1 || range.lo === range.hi) return range.lo || range.hi || 0;

    var selected = size || sizes[0];
    var idx = sizes.indexOf(selected);
    if (idx < 0) {
      // fuzzy match
      for (var i = 0; i < sizes.length; i++) {
        if (String(sizes[i]).toLowerCase() === String(selected).toLowerCase()) {
          idx = i;
          break;
        }
      }
    }
    if (idx < 0) idx = 0;
    var t = idx / (sizes.length - 1);
    return range.lo + t * (range.hi - range.lo);
  }

  function formatMoney(n) {
    var num = Number(n) || 0;
    return "$" + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function lineTotal(product, size, qty) {
    var unit = unitPriceForSize(product, size);
    var q = Math.max(1, parseInt(qty, 10) || 1);
    return {
      unit: unit,
      qty: q,
      total: unit * q,
      unitLabel: formatMoney(unit),
      totalLabel: formatMoney(unit * q),
      rangeLabel: product && product.price ? String(product.price) : "",
    };
  }

  global.Pricing = {
    parsePriceNumbers: parsePriceNumbers,
    parsePriceRange: parsePriceRange,
    sizeMagnitude: sizeMagnitude,
    sortedSizes: sortedSizes,
    unitPriceForSize: unitPriceForSize,
    formatMoney: formatMoney,
    lineTotal: lineTotal,
  };
})(window);
