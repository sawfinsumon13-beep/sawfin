#!/usr/bin/env python3
"""
Build Hostinger-ready Purebred Kitties site — ultra mode under 50MB.
All CSS/JS/images from CDN. Works on Hostinger without local /cdn/ folder.
"""

import json
import os
import re
import shutil
import urllib.request
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging")
OUTPUT_ULTRA_DIR = Path("/workspace/purebred-kitties-site-ultra")
OUTPUT_ULTRA_ZIP = Path("/workspace/purebred-kitties-site-ultra.zip")

EXTERNAL_CDN = "https://purebredkitties.com"
FAVICON_URL = EXTERNAL_CDN + "/cdn/shop/files/purebred_kitties_fav_icon_af099f12-929b-46f9-9f52-ab8077b3bd03_32x32.png?v=1707586342"
FAVICON_TAGS = (
    f'<link rel="icon" href="{FAVICON_URL}" type="image/png" sizes="32x32">'
    f'<link rel="shortcut icon" href="{FAVICON_URL}" type="image/png">'
    f'<link rel="apple-touch-icon" href="{FAVICON_URL}">'
)
CDN_CSS = (
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/font-family.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/font-family1.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas_css.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-wishlist.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-mobile-card-no-hover.css" rel="stylesheet" media="all">'
)

THEME_SCRIPT_MARKERS = (
    "yas-main-script",
    "yas-script.js",
    "yas-script-collection",
    "vendor.js",
    "lazysizes",
    "swiper",
    "pk-wishlist",
    "pk-video-click",
)

THEME_SCRIPT_URLS = (
    "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/vendor.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/lazysizes.min.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-main-script.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-script.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-wishlist.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-video-click-to-play-inline.js",
)

LOADER_FIX = (
    "<style>"
    "html.is-loaded .loading-overlay{opacity:0!important;pointer-events:none!important;visibility:hidden!important}"
    ".loading-overlay{position:fixed;top:0;left:0;z-index:99999;width:100vw;height:100%;"
    "display:flex;align-items:center;justify-content:center;background:#fff}"
    "</style>"
    "<script>"
    "(function(){function hideLoader(){document.documentElement.classList.add('is-loaded');}"
    "hideLoader();document.addEventListener('DOMContentLoaded',hideLoader);"
    "window.addEventListener('load',hideLoader);setTimeout(hideLoader,2500);})();"
    "</script>"
)

STATIC_CART_SRC = Path("/workspace/static-cart.js")
STATIC_SEARCH_SRC = Path("/workspace/static-search.js")
SKIP_DIRS = {"videos"}
SKIP_NAMES = {".git", "__pycache__", "agents.md"}
SKIP_TOP = {"cdn-shopify", "checkouts", "cdn", "policies"}

FOLDER_COLLECTIONS = {"kittens-for-sale", "bengal-cats-for-sale", "abyssinian-kitties-for-sale"}

REMOVE_PATTERNS = [
    r"<script id=\"captcha-bootstrap\">.*?</script>",
    r"<script id=\"shopify-origin-trials\".*?</script>",
    r"<script id=\"scb4127\".*?</script>",
    r"<script id=\"shopify-features\".*?</script>",
    r"<script id=\"shopify-cfh-end\".*?</script>",
    r"<script>\(function\(\)\{var wpmLoader.*?</script>",
    r"<script[^>]*>window\.Shopify\.featureAssets\s*=.*?</script>",
    r"<script[^>]*>window\.Shopify\.Pay\s*=.*?</script>",
    r"<script[^>]*>window\.Shopify\.Analytics.*?</script>",
    r"<script src=\"/cdn-shopify/extensions/[^\"]*omnisend[^\"]*\".*?</script>",
    r"<script[^>]*integrity=\"[^\"]*\"[^>]*origin_trials[^>]*>.*?</script>",
    r"<script type=\"text/javascript\" async=\"\" src=\"/cdn/shopifycloud/shopify.*?</script>",
    r'<script src="/cdn/shop/t/285/assets/custom-order-handler\.js"[^>]*></script>',
    r'<script[^>]*src="[^"]*shopifycloud[^"]*"[^>]*></script>',
    r'<script[^>]*src="[^"]*shopify[^"]*"[^>]*></script>',
    r'<link[^>]*shopifycloud[^>]*>',
    r'<link[^>]*integrity=[^>]*>',
    r'<meta id="shopify-digital-wallet"[^>]*>',
]

STYLE_STRIP = [
    r'<style id="shopify-accelerated-checkout-cart">.*?</style>',
    r"<style[^>]*>.*?</style>",
    r"<noscript[^>]*>.*?</noscript>",
]

OPTIONAL_SECTIONS = [
    r'<div id="shopify-section-template[^"]*__related"[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-template[^"]*__review_global[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-template[^"]*slider_[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-cookie-banner"[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-template[^"]*trust_section[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-template[^"]*adoption_section[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div id="shopify-section-template[^"]*yas_global[\s\S]*?(?=<div id="shopify-section|$)',
    r'<div class="collection__filters[\s\S]*?(?=data-collection-products|class="product-grid-item)',
]

BREED_ALIASES = {
    "abyssinian-kittens-for-sale": "abyssinian-kitties-for-sale",
}


def ensure_remote_files():
    for rel in ("pages/for-breeders.html", "search.html"):
        dest = SOURCE / rel
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        url = f"{EXTERNAL_CDN}/pages/for-breeders" if "for-breeders" in rel else f"{EXTERNAL_CDN}/search"
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            with urllib.request.urlopen(url, timeout=60) as resp:
                dest.write_bytes(resp.read())
        except Exception as exc:
            print(f"Warning: {url}: {exc}")


def is_city_collection(slug: str) -> bool:
    base = re.sub(r"-page-\d+$", "", slug)
    if base.startswith("kittens-in-the-united-states"):
        return False
    return "-for-sale-in-" in base


def collection_redirect(slug: str) -> str:
    base = re.sub(r"-page-\d+$", "", slug)
    base = re.sub(r"-in-[a-z0-9-]+$", "", base)
    base = BREED_ALIASES.get(base, base)
    if base in FOLDER_COLLECTIONS:
        return f"/collections/{base}/"
    return f"/collections/{base}.html"


def city_stub_html(title: str, redirect: str) -> str:
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0;url={redirect}">
<title>{title}</title>{FAVICON_TAGS}{CDN_CSS}
<script>{STATIC_CART_SRC.read_text(encoding='utf-8')}</script>
</head><body><p>Redirecting to <a href="{redirect}">{redirect}</a>...</p>
<script>location.replace("{redirect}");</script></body></html>"""


def collection_info(rel: Path) -> tuple[str, bool] | None:
    parts = rel.parts
    if parts[0] != "collections":
        return None
    if len(parts) == 2 and parts[1].endswith(".html"):
        slug = parts[1][:-5]
        if slug.endswith("-page-"):
            return None
        m = re.match(r"^(.+)-page-(\d+)$", slug)
        if m:
            return m.group(1), m.group(1) in FOLDER_COLLECTIONS
        return slug, slug in FOLDER_COLLECTIONS
    if len(parts) == 3 and (parts[2] == "index.html" or parts[2].startswith("page-")):
        return parts[1], True
    return None


def fix_pagination_links(html: str, slug: str, is_folder: bool) -> str:
    def replacer(match):
        page = match.group(1)
        if page == "1":
            return f'href="/collections/{slug}/"' if is_folder else f'href="/collections/{slug}.html"'
        if is_folder:
            return f'href="/collections/{slug}/page-{page}.html"'
        return f'href="/collections/{slug}-page-{page}.html"'

    return re.sub(
        r'href="/collections/' + re.escape(slug) + r'\?page=(\d+)(?:&amp;[^"]*|&[^"]*)?"',
        replacer,
        html,
    )


def externalize_all_urls(text: str) -> str:
    text = text.replace("../cdn/", "/cdn/")
    text = text.replace('srcset="../', 'srcset="/')
    replacements = [
        ('"/cdn/', f'"{EXTERNAL_CDN}/cdn/'),
        ("'/cdn/", f"'{EXTERNAL_CDN}/cdn/"),
        ("(/cdn/", f"({EXTERNAL_CDN}/cdn/"),
        ("url(/cdn/", f"url({EXTERNAL_CDN}/cdn/"),
        ('url("/cdn/', f'url("{EXTERNAL_CDN}/cdn/'),
        ("url('/cdn/", f"url('{EXTERNAL_CDN}/cdn/"),
        ('href="/pages/', 'href="/pages/'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    text = re.sub(r'href="/account"', 'href="/pages/contact"', text)
    text = re.sub(r'action="/contact[^"]*"', 'action="/pages/contact"', text)
    text = re.sub(r'action="/search"', 'action="/search.html"', text)
    text = text.replace("https://purebredkitties.com/pages/partnerships", "/pages/partnerships")
    return text


def fix_stylesheet_media(html: str) -> str:
    html = re.sub(
        r'(<link[^>]+rel=["\']stylesheet["\'][^>]*)\smedia=["\']print["\']\s+onload=["\']this\.media=[\'"]all[\'"]["\']',
        r'\1 media="all"',
        html,
        flags=re.I,
    )
    html = re.sub(
        r'(<link[^>]+rel=["\']stylesheet["\'][^>]*)\s+onload=["\']this\.media=[\'"]all[\'"]["\']',
        r'\1',
        html,
        flags=re.I,
    )
    return html


def is_theme_script(tag: str) -> bool:
    return any(marker in tag for marker in THEME_SCRIPT_MARKERS)


def externalize_script_tag(tag: str) -> str:
    tag = tag.replace('src="/cdn/', f'src="{EXTERNAL_CDN}/cdn/')
    tag = tag.replace("src='/cdn/", f"src='{EXTERNAL_CDN}/cdn/")
    tag = re.sub(r'\sintegrity="[^"]*"', "", tag)
    tag = re.sub(r"\sintegrity='[^']*'", "", tag)
    tag = re.sub(r'\scrossorigin="[^"]*"', "", tag)
    return tag


def strip_scripts(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        tag = match.group(0)
        if re.search(r"\bsrc\s*=", tag, re.I):
            if is_theme_script(tag):
                return externalize_script_tag(tag)
            return ""
        return ""

    return re.sub(r"<script\b[^>]*>.*?</script>", repl, html, flags=re.DOTALL | re.I)


def theme_scripts_block() -> str:
    return "".join(f'<script src="{url}"></script>' for url in THEME_SCRIPT_URLS)


def inject_head(html: str) -> str:
    html = re.sub(r'<link rel="(?:shortcut )?icon"[^>]*>', "", html, flags=re.I)
    html = re.sub(r'<link rel="apple-touch-icon"[^>]*>', "", html, flags=re.I)
    inject = FAVICON_TAGS + CDN_CSS + LOADER_FIX
    if "pk_static_cart_v1" not in html and STATIC_CART_SRC.exists():
        inject += f"<script>{STATIC_CART_SRC.read_text(encoding='utf-8')}</script>"
    if "loadIndex" not in html and STATIC_SEARCH_SRC.exists():
        inject += f"<script>{STATIC_SEARCH_SRC.read_text(encoding='utf-8')}</script>"
    if "</head>" in html:
        return html.replace("</head>", inject + "</head>", 1)
    if "<head>" in html:
        return html.replace("<head>", "<head>" + inject, 1)
    return inject + html


def inject_body_scripts(html: str) -> str:
    if not any(marker in html for marker in ("yas-main-script", "yas-script.js")):
        block = theme_scripts_block()
        if "</body>" in html:
            return html.replace("</body>", block + "</body>", 1)
        return html + block
    return html


def minify_collection_cards(html: str) -> str:
    def shrink(card: str) -> str:
        link = re.search(r'href="(/products/[^"]+)"', card)
        img = re.search(r'src="(https://purebredkitties\.com/cdn/shop/files/[^"]+)"', card)
        title = re.search(r"<h2>([^<]+)</h2>", card)
        if not link:
            return card
        src = img.group(1) if img else ""
        name = title.group(1).strip() if title else "View kitten"
        return (
            f'<div class="product-grid-item"><a class="product-card" href="{link.group(1)}">'
            f'<img src="{src}" alt="{name}" loading="lazy" width="300" height="300">'
            f'<span>{name}</span></a></div>'
        )

    return re.sub(
        r'<div\s+class="product-grid-item[\s\S]*?(?=<div\s+class="product-grid-item|$)',
        lambda m: shrink(m.group(0)),
        html,
    )


def compact_html(html: str, rel: Path | None = None) -> str:
    html = re.sub(r'\ssrcset="[^"]*"', "", html)
    html = re.sub(r'\sdata-[a-z0-9-]+="[^"]*"', "", html, flags=re.I)
    html = re.sub(r'\saria-[a-z]+="[^"]*"', "", html, flags=re.I)
    if rel and rel.parts[0] == "collections":
        html = minify_collection_cards(html)
    return html


ICON_KEEP = (
    "icon",
    "play-icon",
    "haeding_arrow",
    "arrow",
    "logo",
    "cart",
    "search",
    "menu",
    "close",
    "heart",
    "wishlist",
)


def compact_svgs(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        svg = match.group(0)
        if len(svg) <= 500:
            return svg
        head = svg[:400].lower()
        if any(marker in head for marker in ICON_KEEP):
            return svg
        open_tag = re.match(r"(<svg[^>]*>)", svg, re.I)
        return (open_tag.group(1) + "</svg>") if open_tag else "<svg></svg>"

    return re.sub(r"<svg[^>]*>.*?</svg>", repl, html, flags=re.DOTALL | re.I)


def ultra_optimize(html: str, rel: Path | None = None) -> str:
    for pattern in REMOVE_PATTERNS:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    html = strip_scripts(html)
    for pattern in STYLE_STRIP:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    for pattern in OPTIONAL_SECTIONS:
        html = re.sub(pattern, "", html, flags=re.I)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = externalize_all_urls(html)
    html = fix_stylesheet_media(html)
    if rel:
        info = collection_info(rel)
        if info:
            html = fix_pagination_links(html, info[0], info[1])
    html = inject_head(html)
    html = inject_body_scripts(html)
    html = compact_html(html, rel)
    html = compact_svgs(html)
    html = re.sub(r">\s+<", "><", html)
    return html


def should_skip(rel: Path) -> bool:
    if any(p in SKIP_NAMES for p in rel.parts):
        return True
    if any(p in SKIP_DIRS for p in rel.parts):
        return True
    if rel.parts[0] in SKIP_TOP:
        return True
    if len(rel.parts) >= 2 and rel.parts[0] == "collections" and rel.parts[1].endswith(".html"):
        slug = rel.parts[1][:-5]
        if slug in FOLDER_COLLECTIONS:
            folder_index = SOURCE / "collections" / slug / "index.html"
            if folder_index.exists():
                return True
    return False


def build_product_index(out: Path) -> int:
    products = []
    title_re = re.compile(r"<title>([^<|]+)", re.I)
    img_re = re.compile(rf'"{EXTERNAL_CDN}/cdn/shop/files/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*"', re.I)
    for html_file in sorted((out / "products").glob("*.html")):
        text = html_file.read_text(encoding="utf-8", errors="ignore")[:12000]
        handle = html_file.stem
        m = title_re.search(text)
        title = m.group(1).strip() if m else handle.replace("-", " ").title()
        img_m = img_re.search(text)
        image = img_m.group(0).strip('"') if img_m else ""
        products.append({"handle": handle, "title": title, "url": f"/products/{handle}", "image": image})
    (out / "products-index.json").write_text(json.dumps(products, separators=(",", ":")), encoding="utf-8")
    return len(products)


def stage_ultra():
    out = OUTPUT_ULTRA_DIR
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()
    html_count = 0
    stubs = 0

    for src in sorted(SOURCE.rglob("*")):
        if not src.is_file() or "?" in src.name:
            continue
        rel = src.relative_to(SOURCE)
        if should_skip(rel):
            continue
        if src.suffix.lower() != ".html":
            if rel.name in ("favicon.ico", "favicon.png"):
                shutil.copy2(src, out / rel)
            continue

        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)

        if rel.parts[0] == "collections" and len(rel.parts) == 2:
            slug = rel.stem
            if is_city_collection(slug):
                raw = src.read_text(encoding="utf-8", errors="ignore")
                tm = re.search(r"<title>([^<]+)</title>", raw, re.I)
                title = tm.group(1).strip() if tm else slug.replace("-", " ").title()
                dst.write_text(city_stub_html(title, collection_redirect(slug)), encoding="utf-8")
                stubs += 1
                html_count += 1
                continue

        raw = src.read_text(encoding="utf-8", errors="ignore")
        dst.write_text(ultra_optimize(raw, rel=rel), encoding="utf-8")
        html_count += 1

    build_product_index(out)
    print(f"HTML: {html_count} ({stubs} city stubs)")
    return out


def write_htaccess(out: Path):
    (out / ".htaccess").write_text("""DirectoryIndex index.html
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
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}/index.html/$1/index.html -f
RewriteRule ^(.+)$ index.html/$1/index.html [L]
RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]+)
RewriteRule ^collections/([^/]+)/?$ collections/$1/page-%1.html [L]
RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]+)
RewriteRule ^collections/([^/]+)/?$ collections/$1-page-%1.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}/collections/$1/index.html -f
RewriteRule ^collections/([^/]+)/?$ collections/$1/index.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^search/?$ search.html [L,QSA]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]
</IfModule>
AddType text/css .css
AddType application/javascript .js
""")


def write_readme(out: Path):
    (out / "UPLOAD-FIRST.txt").write_text("""PUREBRED KITTIES — HOSTINGER UPLOAD (FIXED BUILD)
=================================================
IMPORTANT: Extract into public_html root — NOT into an index.html/ subfolder.

1. Hostinger → File Manager → public_html
2. DELETE all old files (including any index.html/ folder)
3. Upload PUREBRED-KITTIES-UPLOAD-ONE-FILE.zip
4. Extract HERE — you should see public_html/index.html as a FILE
5. Visit yourdomain.com/verify.html (all checks should be green)
6. Visit yourdomain.com/ — full site, NOT stuck on paw prints

CSS/photos load from purebredkitties.com CDN — no local cdn/ folder needed.
Contact: kittenspurebreed@gmail.com | WhatsApp: +1 343-809-2153
""")


def write_verify(out: Path):
    (out / "verify.html").write_text(f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Verify</title></head><body>
<h1>Site Check</h1><ul id="r"></ul><script>
var t=[['{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas_css.css','CSS CDN'],['/products-index.json','Products'],['/index.html','Homepage']];
Promise.all(t.map(function(x){{return fetch(x[0],{{method:'HEAD'}}).then(function(res){{document.getElementById('r').innerHTML+='<li style=\"color:'+(res.ok?'green':'red')+'\">'+(res.ok?'OK':'FAIL')+': '+x[1]+'</li>';}});}}));
</script></body></html>""")


def make_zip(folder: Path, zip_path: Path):
    if zip_path.exists():
        zip_path.unlink()
    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, _, files in os.walk(folder):
            for name in files:
                full = Path(root) / name
                zf.write(full, str(full.relative_to(folder)).replace("\\", "/"))
                count += 1
    mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"ZIP: {zip_path.name} — {count} files, {mb:.1f} MB")
    return mb


def main():
    ensure_remote_files()
    out = stage_ultra()
    write_htaccess(out)
    write_verify(out)
    write_readme(out)
    mb = make_zip(out, OUTPUT_ULTRA_ZIP)
    one_file = Path("/workspace/PUREBRED-KITTIES-UPLOAD-ONE-FILE.zip")
    shutil.copy2(OUTPUT_ULTRA_ZIP, one_file)
    print(f"ONE-FILE: {one_file.name} — {mb:.1f} MB")
    if mb > 50:
        print(f"WARNING: {mb:.1f} MB exceeds 50MB target")
    print(f"Ready: {OUTPUT_ULTRA_ZIP}")


if __name__ == "__main__":
    main()
