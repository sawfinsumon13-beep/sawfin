#!/usr/bin/env python3
"""Build a clean static Purebred Kitties site from staging product data."""

from __future__ import annotations

import html as html_lib
import json
import os
import re
import shutil
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging/products")
OUTPUT = Path("/workspace/purebred-kitties-fresh")
OUTPUT_ZIP = Path("/workspace/PUREBRED-KITTIES-FRESH-SITE.zip")

CDN = "https://purebredkitties.com"
SITE = "Purebred Kitties"
EMAIL = "kittenspurebreed@gmail.com"
WHATSAPP = "13438092153"
WHATSAPP_DISPLAY = "+1 343-809-2153"
PER_PAGE = 24

SKIP_HANDLES = set()
HERO_BG = f"{CDN}/cdn/shop/files/girl-cat-sitting-bed_0_1_1600x.png?v=1704462288"
LOGO = f"{CDN}/cdn/shop/files/purebred_kitties__trusted_plarfrom_for_reputable_breeders.png?v=1723230455"
FAVICON = f"{CDN}/cdn/shop/files/purebred_kitties_fav_icon_af099f12-929b-46f9-9f52-ab8077b3bd03_32x32.png?v=1707586342"

BREED_LABELS = {
    "sphynx": "Sphynx",
    "bengal": "Bengal",
    "maine-coon": "Maine Coon",
    "british-shorthair": "British Shorthair",
    "scottish-fold": "Scottish Fold",
    "ragdoll": "Ragdoll",
    "persian": "Persian",
    "siamese": "Siamese",
    "siberian": "Siberian",
    "devon-rex": "Devon Rex",
    "abyssinian": "Abyssinian",
    "munchkin": "Munchkin",
    "oriental": "Oriental",
    "savannah": "Savannah",
    "elf": "Elf",
    "dwelf": "Dwelf",
    "toyger": "Toyger",
    "somali": "Somali",
    "burmese": "Burmese",
    "exotic-shorthair": "Exotic Shorthair",
    "british-longhair": "British Longhair",
    "scottish-straight": "Scottish Straight",
    "kurilian-bobtail": "Kurilian Bobtail",
}


def esc(text: str) -> str:
    return html_lib.escape(str(text or ""), quote=True)


def parse_product(path: Path) -> dict | None:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    handle = path.stem
    if handle in SKIP_HANDLES:
        return None

    title = _meta(raw, "og:title") or handle.replace("-", " ").title()
    description = _meta(raw, "description") or _meta(raw, "og:description") or ""
    price_raw = _meta(raw, "og:price:amount") or ""
    price = price_raw.replace(",", "") if price_raw else ""

    breed = ""
    variants: list[dict] = []
    meta_m = re.search(r'var meta = \{"product":(\{.*?\}),"page"', raw)
    if meta_m:
        try:
            prod = json.loads(meta_m.group(1))
            breed = (prod.get("type") or "").strip()
            for v in prod.get("variants", []):
                variants.append(
                    {
                        "title": v.get("public_title") or v.get("name") or "Option",
                        "price": round((v.get("price") or 0) / 100, 2),
                    }
                )
        except json.JSONDecodeError:
            pass

    image = _meta(raw, "og:image") or ""
    if image.startswith("/"):
        image = CDN + image
    if not image or "paws_1" in image:
        image = _best_image(raw, handle) or image

    gallery = _gallery(raw, handle, image)
    h1_m = re.search(r"<h1[^>]*>([^<]+)", raw)
    name = h1_m.group(1).strip() if h1_m else title

    gender = ""
    if "-male" in handle or "kitten-male" in handle:
        gender = "Male"
    elif "-female" in handle or "kitten-female" in handle:
        gender = "Female"

    return {
        "handle": handle,
        "title": title,
        "name": name,
        "description": description,
        "price": price,
        "breed": breed,
        "breed_label": BREED_LABELS.get(breed, breed.replace("-", " ").title()),
        "gender": gender,
        "image": image,
        "gallery": gallery[:8],
        "variants": variants,
        "url": f"/products/{handle}.html",
    }


def _meta(raw: str, key: str) -> str:
    for pat in (
        rf'<meta property="{re.escape(key)}" content="([^"]*)"',
        rf'<meta name="{re.escape(key)}" content="([^"]*)"',
    ):
        m = re.search(pat, raw, re.I)
        if m:
            return m.group(1).strip()
    return ""


def _best_image(raw: str, handle: str) -> str:
    candidates = []
    for img in re.findall(
        r'(?:https://purebredkitties\.com)?(/cdn/shop/files/[^"\']+\.(?:jpg|jpeg|png|webp)[^"\']*)',
        raw,
        re.I,
    ):
        low = img.lower()
        if any(x in low for x in ("review", "medal", "icon", "logo", "banner", "paws_1", "group_")):
            continue
        if re.search(r"\d+_[a-z]", low) or handle.split("-")[0] in low:
            candidates.append(CDN + img if img.startswith("/") else img)
    return candidates[0] if candidates else ""


def _gallery(raw: str, handle: str, primary: str) -> list[str]:
    out = []
    if primary:
        out.append(primary)
    for img in re.findall(
        r'(?:https://purebredkitties\.com)?(/cdn/shop/files/[^"\']+\.(?:jpg|jpeg|png|webp)[^"\']*)',
        raw,
        re.I,
    ):
        low = img.lower()
        if any(x in low for x in ("review", "medal", "icon", "logo", "banner", "paws_1", "group_")):
            continue
        if not re.search(r"\d+_[a-z]", low):
            continue
        full = CDN + img if img.startswith("/") else img
        if full not in out:
            out.append(full)
    return out


def load_products() -> list[dict]:
    products = []
    for path in sorted(SOURCE.glob("*.html")):
        item = parse_product(path)
        if item:
            products.append(item)
    products.sort(key=lambda p: p["title"].lower())
    return products


def layout(title: str, body: str, extra_head: str = "") -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} | {SITE}</title>
<link rel="icon" href="{FAVICON}" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
{extra_head}
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/"><img src="{LOGO}" alt="{SITE}"></a>
    <nav class="nav">
      <a href="/collections/kittens-for-sale/">Kittens</a>
      <a href="/collections/breeds.html">Breeds</a>
      <a href="/pages/contact.html">Contact</a>
      <a class="btn btn-yellow" href="/collections/kittens-for-sale/">Meet Kittens</a>
      <a class="cart-link" href="/cart.html">Cart <span class="cart-count" data-cart-count>0</span></a>
    </nav>
    <button class="menu-toggle" aria-label="Menu" onclick="document.body.classList.toggle('menu-open')">☰</button>
  </div>
</header>
<main>{body}</main>
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <strong>{SITE}</strong>
      <p>Premium purebred kittens from trusted breeders.</p>
    </div>
    <div>
      <strong>Contact</strong>
      <p><a href="mailto:{EMAIL}">{EMAIL}</a><br>
      <a href="https://wa.me/{WHATSAPP}">WhatsApp {WHATSAPP_DISPLAY}</a></p>
    </div>
    <div>
      <strong>Explore</strong>
      <p><a href="/collections/kittens-for-sale/">All Kittens</a><br>
      <a href="/search.html">Search</a></p>
    </div>
  </div>
  <p class="copy">© {SITE}. All rights reserved.</p>
</footer>
<script src="/assets/site.js"></script>
</body>
</html>"""


def product_card(p: dict) -> str:
    price = f"${float(p['price']):,.0f}" if p.get("price") else "Ask"
    return f"""<article class="card">
  <a href="{esc(p['url'])}">
    <img src="{esc(p['image'])}" alt="{esc(p['title'])}" loading="lazy">
    <div class="card-body">
      <h3>{esc(p['title'])}</h3>
      <p class="meta">{esc(p.get('breed_label') or '')}{(' · ' + esc(p['gender'])) if p.get('gender') else ''}</p>
      <p class="price">{price}</p>
    </div>
  </a>
  <button class="btn btn-purple reserve-btn" data-reserve="{esc(p['handle'])}" data-title="{esc(p['title'])}">Reserve Me</button>
</article>"""


def paginate(items: list, page: int, base_url: str, flat: bool = False) -> tuple[list, str]:
    total = len(items)
    pages = max(1, (total + PER_PAGE - 1) // PER_PAGE)
    page = max(1, min(page, pages))
    start = (page - 1) * PER_PAGE
    chunk = items[start : start + PER_PAGE]

    def page_href(p: int) -> str:
        if flat:
            stem = base_url[:-5] if base_url.endswith(".html") else base_url
            return f"{stem}.html" if p == 1 else f"{stem}-page-{p}.html"
        return base_url if p == 1 else f"{base_url}page-{p}.html"

    links = []
    if page > 1:
        links.append(f'<a href="{page_href(page - 1)}">← Previous</a>')
    links.append(f"<span>Page {page} of {pages}</span>")
    if page < pages:
        links.append(f'<a href="{page_href(page + 1)}">Next →</a>')
    nav = f'<nav class="pagination">{" ".join(links)}</nav>'
    return chunk, nav


ADDON_HANDLES = {
    "sterilization",
    "pedigree-certificate",
    "breeding-rights-package",
    "fip-coverage",
    "gene-test-hcm",
}


def build_index(products: list[dict]) -> str:
    kitten_products = [p for p in products if p["handle"] not in ADDON_HANDLES]
    featured = kitten_products[:8]
    breed_counts: dict[str, int] = {}
    for p in products:
        b = p.get("breed_label") or "Other"
        breed_counts[b] = breed_counts.get(b, 0) + 1
    top_breeds = sorted(breed_counts.items(), key=lambda x: -x[1])[:12]

    cards = "".join(product_card(p) for p in featured)
    breed_links = "".join(
        f'<a class="breed-chip" href="/collections/{slugify(b)}.html">{esc(b)} ({n})</a>'
        for b, n in top_breeds
    )
    body = f"""
<section class="hero" style="background-image:url('{HERO_BG}')">
  <div class="container hero-inner">
    <h1>Find your purrfect<br><span>purebred kitties.</span></h1>
    <p class="hero-lead">Explore our premium selection of purebred kittens &amp; cats for sale from trusted breeders.</p>
    <form class="hero-search" action="/search.html" method="get">
      <input type="search" name="q" placeholder="Which breed are you looking for?" aria-label="Search">
      <button type="submit">Search</button>
    </form>
    <a class="btn btn-yellow" href="/collections/kittens-for-sale/">Browse Popular Breeds</a>
  </div>
</section>
<section class="section container">
  <h2>Featured Kittens</h2>
  <div class="grid">{cards}</div>
  <p class="center"><a class="btn btn-purple" href="/collections/kittens-for-sale/">View All Kittens</a></p>
</section>
<section class="section section-soft">
  <div class="container">
    <h2>Browse by Breed</h2>
    <div class="breed-list">{breed_links}</div>
  </div>
</section>
<section class="section container trust">
  <h2>Why families trust us</h2>
  <div class="trust-grid">
    <div><strong>Trusted Breeders</strong><p>Ethical breeders, no kitten mills.</p></div>
    <div><strong>Health Guarantee</strong><p>Vet-checked kittens with health records.</p></div>
    <div><strong>Scam Protection</strong><p>Transparent adoption process.</p></div>
    <div><strong>Lifetime Support</strong><p>We help you before and after adoption.</p></div>
  </div>
</section>"""
    return layout("Purebred Kittens & Cats for Sale", body)


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "other"


def build_all_collections(products: list[dict]) -> None:
    kitten_products = [p for p in products if p["handle"] not in ADDON_HANDLES]

    # Main kittens folder
    out = OUTPUT / "collections" / "kittens-for-sale"
    out.mkdir(parents=True, exist_ok=True)
    total_pages = max(1, (len(kitten_products) + PER_PAGE - 1) // PER_PAGE)
    for page in range(1, total_pages + 1):
        chunk, nav = paginate(kitten_products, page, "/collections/kittens-for-sale/")
        grid = "".join(product_card(p) for p in chunk)
        body = f"""<section class="section container">
  <h1>Kittens for Sale</h1>
  <p>{len(kitten_products)} kittens available</p>
  <div class="grid">{grid}</div>
  {nav}
</section>"""
        fname = "index.html" if page == 1 else f"page-{page}.html"
        (out / fname).write_text(layout("Kittens for Sale", body), encoding="utf-8")

    # Breeds index
    breeds = sorted({p.get("breed_label") or "Other" for p in kitten_products})
    links = "".join(
        f'<a class="breed-chip" href="/collections/{slugify(b)}.html">{esc(b)}</a>' for b in breeds if b
    )
    (OUTPUT / "collections" / "breeds.html").write_text(
        layout("Cat Breeds", f'<section class="section container"><h1>Cat Breeds</h1><div class="breed-list">{links}</div></section>'),
        encoding="utf-8",
    )

    # Per-breed pages
    by_breed: dict[str, list[dict]] = {}
    for p in kitten_products:
        key = p.get("breed_label") or "Other"
        by_breed.setdefault(key, []).append(p)

    for breed, items in by_breed.items():
        slug = slugify(breed)
        total_pages = max(1, (len(items) + PER_PAGE - 1) // PER_PAGE)
        for page in range(1, total_pages + 1):
            chunk, nav = paginate(items, page, f"/collections/{slug}.html", flat=True)
            grid = "".join(product_card(p) for p in chunk)
            body = f"""<section class="section container">
  <h1>{esc(breed)} Kittens</h1>
  <p>{len(items)} available</p>
  <div class="grid">{grid}</div>
  {nav}
</section>"""
            fname = f"{slug}.html" if page == 1 else f"{slug}-page-{page}.html"
            (OUTPUT / "collections" / fname).write_text(layout(f"{breed} Kittens", body), encoding="utf-8")


def build_product_pages(products: list[dict]) -> None:
    out = OUTPUT / "products"
    out.mkdir(parents=True, exist_ok=True)
    for p in products:
        imgs = p.get("gallery") or ([p["image"]] if p.get("image") else [])
        thumbs = "".join(f'<img src="{esc(u)}" alt="" loading="lazy">' for u in imgs[:6])
        price = f"${float(p['price']):,.2f}" if p.get("price") else "Contact for price"
        options = p.get("variants") or [{"title": "Reserve", "price": p.get("price") or 0}]
        opts = "".join(
            f'<label><input type="radio" name="option" value="{esc(o["title"])}" {"checked" if i==0 else ""}> '
            f'{esc(o["title"])} — ${float(o["price"]):,.0f}</label>'
            for i, o in enumerate(options)
        )
        body = f"""<section class="section container product-page">
  <div class="product-layout">
    <div class="product-gallery">{thumbs}</div>
    <div class="product-info">
      <h1>{esc(p['name'])}</h1>
      <p class="meta">{esc(p.get('breed_label') or '')}{(' · ' + esc(p['gender'])) if p.get('gender') else ''}</p>
      <p class="price-lg">{price}</p>
      <p>{esc(p.get('description') or '')}</p>
      <form class="reserve-form" data-product="{esc(p['handle'])}" data-title="{esc(p['title'])}">
        <fieldset>{opts}</fieldset>
        <button type="submit" class="btn btn-yellow">Reserve Me</button>
        <a class="btn btn-purple" href="https://wa.me/{WHATSAPP}?text=Hi,%20I%20am%20interested%20in%20{esc(p['title'])}">WhatsApp Us</a>
      </form>
    </div>
  </div>
</section>"""
        (out / f"{p['handle']}.html").write_text(layout(p["title"], body), encoding="utf-8")


def build_static_pages(products: list[dict]) -> None:
    pages = OUTPUT / "pages"
    pages.mkdir(parents=True, exist_ok=True)
    contact = f"""<section class="section container narrow">
  <h1>Contact Us</h1>
  <p>Ready to adopt? Reach out and we will help you find your perfect kitten.</p>
  <ul class="contact-list">
    <li>Email: <a href="mailto:{EMAIL}">{EMAIL}</a></li>
    <li>WhatsApp: <a href="https://wa.me/{WHATSAPP}">{WHATSAPP_DISPLAY}</a></li>
  </ul>
  <form class="contact-form" onsubmit="return PK.contact(event)">
    <label>Name<input name="name" required></label>
    <label>Email<input type="email" name="email" required></label>
    <label>Message<textarea name="message" rows="5" required></textarea></label>
    <button class="btn btn-purple" type="submit">Send via WhatsApp</button>
  </form>
</section>"""
    (pages / "contact.html").write_text(layout("Contact", contact), encoding="utf-8")

    search = """<section class="section container">
  <h1>Search Kittens</h1>
  <input id="search-input" type="search" placeholder="Search by name or breed..." autofocus>
  <div id="search-results" class="grid"></div>
</section>
<script>document.addEventListener('DOMContentLoaded',function(){PK.initSearch('#search-input','#search-results');var q=new URLSearchParams(location.search).get('q');if(q){document.getElementById('search-input').value=q;document.getElementById('search-input').dispatchEvent(new Event('input'));}});</script>"""
    (OUTPUT / "search.html").write_text(layout("Search", search), encoding="utf-8")

    cart = """<section class="section container narrow">
  <h1>Your Cart</h1>
  <div id="cart-items"></div>
  <p id="cart-empty">Your cart is empty.</p>
  <button class="btn btn-yellow" id="checkout-btn" onclick="PK.checkout()">Checkout via WhatsApp</button>
</section>
<script>document.addEventListener('DOMContentLoaded',PK.renderCart);</script>"""
    (OUTPUT / "cart.html").write_text(layout("Cart", cart), encoding="utf-8")


def write_assets(products: list[dict]) -> None:
    assets = OUTPUT / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "data").mkdir(parents=True, exist_ok=True)
    (OUTPUT / "data" / "products.json").write_text(
        json.dumps(products, separators=(",", ":")), encoding="utf-8"
    )
    shutil.copy2(Path("/workspace/purebred-kitties-fresh-assets/style.css"), assets / "style.css")
    shutil.copy2(Path("/workspace/purebred-kitties-fresh-assets/site.js"), assets / "site.js")


def write_htaccess() -> None:
    (OUTPUT / ".htaccess").write_text("""DirectoryIndex index.html
Options -Indexes
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html/?$ / [R=301,L]
RewriteRule ^index\\.html/(.*)$ /$1 [R=301,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}/index.html/$1 -f
RewriteRule ^(.+)$ index.html/$1 [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}/index.html/$1.html -f
RewriteRule ^(.+)$ index.html/$1.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^search/?$ search.html [L,QSA]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]
</IfModule>
""")


def write_readme() -> None:
    (OUTPUT / "UPLOAD-FIRST.txt").write_text(f"""PUREBRED KITTIES — BRAND NEW CLEAN SITE
========================================
This is a fresh HTML website (NOT the old Shopify mirror).

1. Hostinger → File Manager → public_html
2. DELETE all old files
3. Upload PUREBRED-KITTIES-FRESH-SITE.zip
4. Extract directly into public_html
5. Visit yourdomain.com/verify.html then yourdomain.com/

Contact: {EMAIL} | WhatsApp: {WHATSAPP_DISPLAY}
""")


def write_verify() -> None:
    (OUTPUT / "verify.html").write_text(f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Verify</title>
<link rel="stylesheet" href="/assets/style.css"></head><body><section class="section container">
<h1>Site Check</h1><ul id="r"></ul>
<script>
var tests=[
  ['/index.html','Homepage'],
  ['/assets/style.css','CSS'],
  ['/assets/site.js','JavaScript'],
  ['/data/products.json','Products data'],
  ['/collections/kittens-for-sale/','Kittens collection']
];
Promise.all(tests.map(function(t){{
  return fetch(t[0],{{method:'HEAD'}}).then(function(res){{
    document.getElementById('r').innerHTML+='<li style="color:'+(res.ok?'green':'red')+'">'+(res.ok?'OK':'FAIL')+': '+t[1]+'</li>';
  }});
}}));
</script></section></body></html>""")


def make_zip() -> float:
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, _, files in os.walk(OUTPUT):
            for name in files:
                full = Path(root) / name
                zf.write(full, str(full.relative_to(OUTPUT)).replace("\\", "/"))
    return OUTPUT_ZIP.stat().st_size / (1024 * 1024)


def main() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()

    products = load_products()
    print(f"Products loaded: {len(products)}")

    write_assets(products)
    (OUTPUT / "index.html").write_text(build_index(products), encoding="utf-8")
    build_all_collections(products)
    build_product_pages(products)
    build_static_pages(products)
    write_htaccess()
    write_readme()
    write_verify()

    mb = make_zip()
    print(f"Built {OUTPUT}")
    print(f"ZIP: {OUTPUT_ZIP.name} — {mb:.1f} MB")


if __name__ == "__main__":
    main()
