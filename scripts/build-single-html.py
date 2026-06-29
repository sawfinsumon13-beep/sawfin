#!/usr/bin/env python3
"""Build one self-contained HTML file with all pages, CSS, and JavaScript inlined."""

from __future__ import annotations

import json
import re
import base64
import argparse
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

_spec = importlib.util.spec_from_file_location(
    "generate_favicon", ROOT / "scripts" / "generate-favicon.py"
)
_favicon_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_favicon_mod)
FAVICON_LINKS = _favicon_mod.build_favicon_links()

JS_ORDER = [
    "seo-config.js",
    "seo.js",
    "cart-utils.js",
    "components.js",
    "shop.js",
    "main.js",
    "hero-slideshow.js",
    "blog.js",
    "reviews-page.js",
    "cart-page.js",
    "checkout-page.js",
]

JSON_EMBED = {
    "js/products.json": "products",
    "js/reviews-index.json": "reviews",
    "js/blog-index.json": "blog",
    "js/hero-slideshow-images.json": "heroImages",
}

SPA_ROUTER = r"""
window.SPA_MODE = true;

window.__SPA_META__ = __SPA_META_JSON__;

function spaParseHref(href) {
  const raw = (href || '').replace(/^#/, '').trim();
  if (!raw) return { route: 'index.html', search: '' };
  const [routePart, ...rest] = raw.split('?');
  const route = routePart.split('/').pop() || 'index.html';
  const search = rest.length ? '?' + rest.join('?') : '';
  return { route, search };
}

window.getQueryParam = function spaGetQueryParam(key) {
  const hash = window.location.hash.replace(/^#/, '');
  const qs = hash.includes('?') ? hash.split('?').slice(1).join('?') : window.location.search.slice(1);
  return new URLSearchParams(qs).get(key);
};

function spaRunHooks(route) {
  if (route === 'index.html') spaInitHomeFeatured();
  if (document.getElementById('products-grid')) {
    if (typeof initShop === 'function') initShop();
  }
  if (document.querySelector('[data-category]') && document.getElementById('category-products-grid')) {
    if (typeof initCategoryPage === 'function') initCategoryPage();
  }
  if (route === 'product.html' && typeof initProductPage === 'function') initProductPage();
  if (route === 'reviews.html' && typeof initReviewsPage === 'function') initReviewsPage();
  if (route === 'blog.html' && typeof initBlogListing === 'function') initBlogListing();
  if (route === 'cart.html' && typeof initCartPage === 'function') initCartPage();
  if (route === 'checkout.html' && typeof initCheckoutPage === 'function') initCheckoutPage();
  if (typeof initFaq === 'function') initFaq();
  if (typeof initVinForm === 'function') initVinForm();
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (route === 'index.html' && typeof initHeroSlideshow === 'function') initHeroSlideshow();
}

async function spaInitHomeFeatured() {
  const grid = document.getElementById('home-featured-grid');
  if (!grid || typeof renderProductCard !== 'function' || grid.dataset.loaded === '1') return;
  try {
    const products = window.__EMBED__.products;
    const sets = ['set-0108', 'set-0114', 'set-0066', 'set-0088'];
    const picks = sets.map((s) => products.find((p) => p.image.includes(s))).filter(Boolean);
    grid.innerHTML = picks.map(renderProductCard).join('');
    if (typeof bindProductCardEvents === 'function') bindProductCardEvents();
    grid.dataset.loaded = '1';
  } catch (e) {
    grid.innerHTML = '<p>Unable to load featured engines.</p>';
  }
}

window.spaNavigate = function spaNavigate(href, replace) {
  const { route, search } = spaParseHref(href);
  document.querySelectorAll('.spa-page').forEach((el) => {
    el.hidden = el.dataset.spaRoute !== route;
  });
  const meta = window.__SPA_META__[route];
  if (meta && meta.title) document.title = meta.title;
  const page = document.querySelector('.spa-page[data-spa-route="' + route + '"]');
  if (page) {
    document.body.dataset.page = page.dataset.page || '';
    if (page.dataset.category) document.body.dataset.category = page.dataset.category;
    else delete document.body.dataset.category;
  }
  const hash = '#' + route + search;
  if (replace) history.replaceState({ route }, '', hash);
  else history.pushState({ route }, '', hash);
  window.scrollTo(0, 0);
  spaRunHooks(route);
};

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
  if (a.target === '_blank') return;
  if (href.startsWith('http') && !href.includes('wa.me')) return;
  if (!href.includes('.html') && !href.startsWith('#')) return;
  e.preventDefault();
  spaNavigate(href.startsWith('#') ? href.slice(1) : href);
});

window.addEventListener('popstate', () => {
  spaNavigate(location.hash.slice(1) || 'index.html', true);
});

document.addEventListener('DOMContentLoaded', () => {
  const start = location.hash.slice(1) || 'index.html';
  spaNavigate(start, true);
});

(function spaIdScope() {
  const orig = document.getElementById.bind(document);
  document.getElementById = function spaGetElementById(id) {
    const active = document.querySelector('.spa-page:not([hidden])');
    if (active && typeof CSS !== 'undefined' && CSS.escape) {
      const inPage = active.querySelector('#' + CSS.escape(id));
      if (inPage) return inPage;
    }
    const el = orig(id);
    if (el && el.closest('.spa-page')) {
      const current = document.querySelector('.spa-page:not([hidden])');
      if (!current || !current.contains(el)) return null;
    }
    return el;
  };
})();

(function spaLocationPatch() {
  const go = (url) => {
    if (typeof url === 'string' && /\.html/.test(url) && !/^https?:/i.test(url)) {
      spaNavigate(url);
      return true;
    }
    return false;
  };
  const desc = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
  if (desc && desc.set) {
    Object.defineProperty(window.Location.prototype, 'href', {
      ...desc,
      set(value) {
        if (!go(value)) desc.set.call(this, value);
      },
    });
  }
})();
"""

FETCH_SHIM = r"""
(function () {
  const embed = window.__EMBED__ || {};
  const nativeFetch = window.fetch.bind(window);
  window.fetch = function spaFetch(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('products.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(embed.products || []) });
    }
    if (url.includes('reviews-index.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(embed.reviews || []) });
    }
    if (url.includes('blog-index.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(embed.blog || []) });
    }
    if (url.includes('hero-slideshow-images.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(embed.heroImages || []) });
    }
    return nativeFetch(input, init);
  };
})();
"""


def extract_page(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    main = re.search(r"<main[^>]*>(.*?)</main>", text, re.DOTALL)
    page = re.search(r'data-page="([^"]*)"', text)
    category = re.search(r'data-category="([^"]*)"', text)
    title = re.search(r"<title>([^<]*)</title>", text)
    return {
        "file": path.name,
        "page": page.group(1) if page else path.stem.replace("-", ""),
        "category": category.group(1) if category else "",
        "title": title.group(1) if title else path.name,
        "html": main.group(1).strip() if main else "",
    }


def escape_script(js: str) -> str:
    return js.replace("</script>", "<\\/script>")


SKIP_NAMES = {
    "bavarian-engines-all-in-one.html",
    "bavarian-engines-premium-all-in-one.html",
    "harbor-motor-exchange.html",
    "single.html",
    "mini-test.html",
    "mini.html",
    "t.html",
    "t2.html",
    "t3.html",
    "t4.html",
    "t5.html",
    "t5-nojs3.html",
}


def build(theme: str = "terminal") -> Path:
    premium = theme == "premium"
    css_name = "style-premium.css" if premium else "style.css"
    out = ROOT / ("bavarian-engines-premium-all-in-one.html" if premium else "bavarian-engines-all-in-one.html")
    css = (ROOT / "css" / css_name).read_text(encoding="utf-8")

    embed: dict = {}
    for rel, key in JSON_EMBED.items():
        embed[key] = json.loads((ROOT / rel).read_text(encoding="utf-8"))

    pages = []
    for html in sorted(ROOT.glob("*.html")):
        if html.name in SKIP_NAMES or html.name.startswith("test-js-"):
            continue
        pages.append(extract_page(html))

    spa_meta = {p["file"]: {"title": p["title"], "page": p["page"]} for p in pages}

    page_blocks = []
    for p in pages:
        hidden = '' if p["file"] == "index.html" else ' hidden'
        cat_attr = f' data-category="{p["category"]}"' if p["category"] else ""
        page_blocks.append(
            f'    <div class="spa-page" data-spa-route="{p["file"]}" data-page="{p["page"]}"{cat_attr}{hidden}>\n'
            f'      <div class="spa-main" role="main">{p["html"]}</div>\n'
            f"    </div>"
        )

    js_parts = []
    for name in JS_ORDER:
        path = ROOT / "js" / name
        if path.exists():
            js_parts.append(f"/* --- {name} --- */\n{path.read_text(encoding='utf-8')}")

    router = SPA_ROUTER.replace("__SPA_META_JSON__", json.dumps(spa_meta, ensure_ascii=True))

    embed_json = json.dumps(embed, ensure_ascii=True)
    embed_b64 = base64.b64encode(embed_json.encode("utf-8")).decode("ascii")

    head_title = spa_meta.get("index.html", {}).get("title", "Bavarian Engines")
    head_desc = "Buy used BMW engines from Bavarian Engines Hamburg. Original BMW motors for sale."

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{head_title}</title>
{FAVICON_LINKS}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,600;9..40,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
{css}
.spa-page[hidden] {{ display: none !important; }}
  </style>
</head>
<body data-page="home">
  <div id="spa-root">
{chr(10).join(page_blocks)}
  </div>
  <script>
window.__EMBED__ = JSON.parse(atob("__EMBED_B64__"));
{FETCH_SHIM}
  </script>
  <script>{escape_script(router + chr(10) + chr(10).join(js_parts))}</script>
</body>
</html>
"""

    html = html.replace("__EMBED_B64__", embed_b64)
    out.write_text(html, encoding="utf-8")
    size_mb = out.stat().st_size / (1024 * 1024)
    label = "Premium" if premium else "Standard"
    print(f"Built {out.name} ({label}): {len(pages)} pages, {size_mb:.1f} MB")
    print("Note: upload images/ folder alongside this file on Hostinger.")
    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--theme", choices=["terminal", "premium"], default="terminal")
    args = parser.parse_args()
    build(args.theme)
