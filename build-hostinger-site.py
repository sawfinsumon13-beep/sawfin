#!/usr/bin/env python3
"""
Build Hostinger-ready Purebred Kitties site — ultra mode under 50MB.
All CSS/JS/images from CDN. Works on Hostinger without local /cdn/ folder.
"""

import json
import os
import re
import shutil
import sys
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging")
OUTPUT_ULTRA_DIR = Path("/workspace/purebred-kitties-clone")
OUTPUT_ULTRA_ZIP = Path("/workspace/PUREBRED-KITTIES-CLONE-SITE.zip")
MAX_ZIP_MB = 10

CONTACT_PHONE_DISPLAY = "+1 3475417149"
CONTACT_PHONE_E164 = "13475417149"
CONTACT_EMAIL = "kittenspurebreed@gmail.com"
SIGNAL_URL = "https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL"

SIGNAL_FOOTER_HTML = (
    f'<div class="footer_signal foot_col"><span>'
    f'<svg fill=none height=25 viewBox="0 0 24 25"width=24 xmlns=http://www.w3.org/2000/svg>'
    f'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"fill=#726A87/>'
    f'</svg></span><a href="{SIGNAL_URL}" target="_blank" rel="noopener">Signal</a></div>'
)

CONTACT_SIGNAL_BLOCK = (
    f'<div class="middle_four first_cont"><div class="iconss wow fadeInUp animated">'
    f'<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">'
    f'<circle cx="18.5859" cy="18.687" r="18" fill="#774C9D"/>'
    f'<path d="M11 12h15v2H11v-2zm0 4h15v2H11v-2zm0 4h10v2H11v-2z" fill="white"/>'
    f'</svg></div><div class="icon_titles"><p class="call_title wow fadeInUp animated">Signal</p>'
    f'<p class="wow fadeInUp animated"><a href="{SIGNAL_URL}" target="_blank" rel="noopener">Message on Signal</a></p>'
    f'</div></div>'
)

EXTERNAL_CDN = "https://purebredkitties.com"
FAVICON_URL = EXTERNAL_CDN + "/cdn/shop/files/purebred_kitties_fav_icon_af099f12-929b-46f9-9f52-ab8077b3bd03_32x32.png?v=1707586342"
FAVICON_TAGS = (
    f'<link rel="icon" href="{FAVICON_URL}" type="image/png" sizes="32x32">'
    f'<link rel="shortcut icon" href="{FAVICON_URL}" type="image/png">'
    f'<link rel="apple-touch-icon" href="{FAVICON_URL}">'
)
CDN_CSS = (
    f'<link href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" rel="stylesheet">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/font-family.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/font-family1.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas_css.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-wishlist.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-mobile-card-no-hover.css" rel="stylesheet" media="all">'
    f'<link href="{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-product-template.css" rel="stylesheet" media="all">'
)

# custom.css / custom1.css are NOT loaded on the live site homepage and break layout
# (e.g. position:absolute on .reputable_container). Do not inject them globally.

LAYOUT_FIX = (
    "<style>"
    ":root{--desk-container:1400px}"
    ".wow,.wow.fadeInUp,.wow.animated{visibility:visible!important;opacity:1!important;"
    "animation:none!important;transform:none!important}"
    "@keyframes scroll-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}"
    "@keyframes scroll-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}"
    "@keyframes scrolling{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}"
    ".slideshow-wrapper{overflow:hidden!important;width:100%!important}"
    ".slideshow-track{display:flex!important;flex-wrap:nowrap!important;white-space:nowrap!important;width:max-content!important}"
    "#slideshow-template--21804439798011__slider_first_global_79iWkH{animation:scroll-left 70s linear infinite!important}"
    "#slideshow-template--21804439798011__slider_second_global_yebyGC{animation:scroll-right 125s linear infinite!important}"
    "@media(max-width:768px){"
    "#slideshow-template--21804439798011__slider_first_global_79iWkH{animation-duration:25s!important}"
    "#slideshow-template--21804439798011__slider_second_global_yebyGC{animation-duration:15s!important}"
    "}"
    ".reputable_breeders .reputable_container{position:static!important;transform:none!important;top:auto!important}"
    ".social-sharing-wrapper svg,.footer-social svg{width:40px!important;height:41px!important;display:inline-block!important}"
    ".footer-social,.social-sharing-wrapper{display:flex!important;gap:20px!important;align-items:center!important}"
    ".social-sharing-wrapper a{display:inline-flex!important;opacity:1!important;visibility:visible!important}"
    "</style>"
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
    "https://unpkg.com/typed.js@2.0.15/dist/typed.umd.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/vendor.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/lazysizes.min.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-main-script.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-script.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/yas-script-collection.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-wishlist.js",
    f"{EXTERNAL_CDN}/cdn/shop/t/285/assets/pk-video-click-to-play-inline.js",
)

INLINE_SCRIPT_KEEP = (
    "Typed(",
    "finishLoading",
    "is-loaded",
    "text-type",
    "lazySizes",
    "Swiper(",
    "pk-video",
    "waitForBreedMcWorldwide",
    "handleLeave",
    "handleReturn",
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
ANIMATIONS_FIX_SRC = Path("/workspace/animations-fix.js")
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
]

OPTIONAL_SECTIONS = [
    r'<div id="shopify-section-cookie-banner"[\s\S]*?(?=<div id="shopify-section|$)',
]

BREED_ALIASES = {
    "abyssinian-kittens-for-sale": "abyssinian-kitties-for-sale",
}


def fetch_url(url: str, timeout: int = 60) -> bytes | None:
    try:
        from urllib.parse import quote, urlparse, urlunparse

        parsed = urlparse(url)
        safe_path = quote(parsed.path, safe="/:%")
        safe_url = urlunparse(parsed._replace(path=safe_path))
        req = urllib.request.Request(safe_url, headers={"User-Agent": "Mozilla/5.0 (compatible; PKSiteBuilder/1.0)"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception as exc:
        print(f"Warning: fetch {url}: {exc}")
        return None


def fetch_missing_products():
    """Download product pages from live site that are missing from staging mirror."""
    products_dir = SOURCE / "products"
    products_dir.mkdir(parents=True, exist_ok=True)
    existing = {p.stem for p in products_dir.glob("*.html")}
    if len(existing) >= 4000:
        print(f"Staging already has {len(existing)} products — skipping live fetch")
        return
    missing_handles: list[str] = []
    page = 1

    while True:
        data = fetch_url(f"{EXTERNAL_CDN}/products.json?limit=250&page={page}")
        if not data:
            break
        try:
            payload = json.loads(data.decode("utf-8"))
        except json.JSONDecodeError:
            break
        items = payload.get("products") or []
        if not items:
            break
        for item in items:
            handle = item.get("handle")
            if handle and handle not in existing:
                missing_handles.append(handle)
        if len(items) < 250:
            break
        page += 1

    if not missing_handles:
        print("All live products already in staging mirror")
        return

    print(f"Fetching {len(missing_handles)} missing product pages...", flush=True)

    def download(handle: str) -> str | None:
        html = fetch_url(f"{EXTERNAL_CDN}/products/{handle}", timeout=30)
        if not html:
            return None
        text = html.decode("utf-8", errors="ignore")
        if "<html" not in text.lower():
            return None
        (products_dir / f"{handle}.html").write_text(text, encoding="utf-8")
        return handle

    fetched = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(download, h): h for h in missing_handles}
        for future in as_completed(futures):
            if future.result():
                fetched += 1
                if fetched % 100 == 0:
                    print(f"  fetched {fetched}/{len(missing_handles)}...", flush=True)

    print(f"Fetched {fetched} missing product pages from live site", flush=True)


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


def fix_html_links(html: str) -> str:
    folder_collections = {f"/collections/{s}/" for s in FOLDER_COLLECTIONS}

    def prod(m: re.Match[str]) -> str:
        return f'href="/products/{m.group(1)}.html"'

    html = re.sub(r'href="/products/([^"#?/]+?)(?<!\.html)"', prod, html)
    html = re.sub(r'href="/pages/([^"#?/]+?)(?<!\.html)"', r'href="/pages/\1.html"', html)
    html = re.sub(r'href="/blogs/([^"#?/]+?/[^"#?/]+?)(?<!\.html)"', r'href="/blogs/\1.html"', html)

    def coll(m: re.Match[str]) -> str:
        slug = m.group(1)
        if slug in FOLDER_COLLECTIONS:
            return f'href="/collections/{slug}/"'
        return f'href="/collections/{slug}.html"'

    html = re.sub(r'href="/collections/([^"#?/]+?)(?<!\.html)"', coll, html)
    for path in folder_collections:
        html = html.replace(f'href="{path.rstrip("/")}.html"', f'href="{path}"')

    html = re.sub(r'(href|action)="/cart"(?![\w.-])', r'\1="/cart.html"', html)
    html = re.sub(r'(href|action)="/search"(?![\w.-])', r'\1="/search.html"', html)
    return html


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
        ('"/cdn-shopify/', '"https://cdn.shopify.com/'),
        ("'/cdn-shopify/", "'https://cdn.shopify.com/"),
        ('src="/cdn-shopify/', 'src="https://cdn.shopify.com/'),
        ("src='/cdn-shopify/", "src='https://cdn.shopify.com/"),
        ('href="/pages/', 'href="/pages/'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    text = re.sub(r'href="/account"', 'href="/pages/contact"', text)
    text = re.sub(r'action="/contact[^"]*"', 'action="/pages/contact"', text)
    text = re.sub(r'action="/search"', 'action="/search.html"', text)
    text = text.replace("https://purebredkitties.com/pages/partnerships", "/pages/partnerships")
    return text


def strip_broken_stylesheets(html: str) -> str:
    """Remove custom.css/custom1.css links — not used on live site and breaks layout."""
    html = re.sub(
        r'<link[^>]+/assets/custom\.css[^>]*>',
        "",
        html,
        flags=re.I,
    )
    html = re.sub(
        r'<link[^>]+/assets/custom1\.css[^>]*>',
        "",
        html,
        flags=re.I,
    )
    return html


def strip_slideshow_scripts(html: str) -> str:
    """Remove inline slideshow init that sets animation:none when data-autoplay missing."""
    return re.sub(
        r"<script defer>\s*document\.addEventListener\('DOMContentLoaded',\s*function\s*\(\)\s*\{"
        r"[\s\S]*?slideshow-template[\s\S]*?</script>",
        "",
        html,
        flags=re.I,
    )


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
        if any(marker in tag for marker in INLINE_SCRIPT_KEEP):
            return tag
        return ""

    return re.sub(r"<script\b[^>]*>.*?</script>", repl, html, flags=re.DOTALL | re.I)


def theme_scripts_block() -> str:
    return "".join(f'<script src="{url}"></script>' for url in THEME_SCRIPT_URLS)


def inject_head(html: str) -> str:
    html = re.sub(r'<link rel="(?:shortcut )?icon"[^>]*>', "", html, flags=re.I)
    html = re.sub(r'<link rel="apple-touch-icon"[^>]*>', "", html, flags=re.I)
    inject = FAVICON_TAGS + CDN_CSS + LAYOUT_FIX + LOADER_FIX
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
    block = ""
    if not any(marker in html for marker in ("yas-main-script", "yas-script.js")):
        block += theme_scripts_block()
    if ANIMATIONS_FIX_SRC.exists() and html.count("fixSlideshows") < 1:
        block += f"<script>{ANIMATIONS_FIX_SRC.read_text(encoding='utf-8')}</script>"
    if block and "</body>" in html:
        return html.replace("</body>", block + "</body>", 1)
    if block:
        return html + block
    return html


SHOPIFY_THUMB_SIZE = re.compile(
    r"_(?:30|50|80|100|150|200|240|300|400|496|500|520|600)x(?=\.(?:jpg|jpeg|png|webp|gif))",
    re.I,
)


def upgrade_cdn_url(url: str, min_width: int = 800) -> str:
    if not url:
        return url
    if "/cdn/shop/" not in url and "cdn.shopify.com" not in url:
        return url
    lower = url.lower()
    if any(skip in lower for skip in ("favicon", "paws_1", "icon-qaulity", "radius-qaulity", "mark.svg")):
        return url
    url = re.sub(r"([?&])width=\d+", rf"\1width={min_width}", url)
    return SHOPIFY_THUMB_SIZE.sub(f"_{min_width}x", url)


def best_from_srcset(srcset: str) -> str | None:
    best_url = None
    best_w = 0
    for part in srcset.split(","):
        part = part.strip()
        if not part:
            continue
        bits = part.split()
        url = bits[0]
        width = 0
        if len(bits) > 1 and bits[1].endswith("w"):
            try:
                width = int(bits[1][:-1])
            except ValueError:
                width = 0
        if width >= best_w:
            best_w = width
            best_url = url
    return best_url


def fix_image_urls(html: str) -> str:
    def fix_img(match: re.Match[str]) -> str:
        tag = match.group(0)
        candidates: list[str] = []
        for attr in ("data-srcset", "srcset", "data-src", "src"):
            m = re.search(rf'\s{attr}="([^"]+)"', tag, re.I)
            if not m:
                continue
            val = m.group(1)
            if attr.endswith("srcset"):
                best = best_from_srcset(val)
                if best:
                    candidates.append(best)
            else:
                candidates.append(val)
        if not candidates:
            return tag
        best = upgrade_cdn_url(candidates[0])
        for c in candidates[1:]:
            upgraded = upgrade_cdn_url(c)
            if upgraded != c or "_30x" in c or "_50x" in c:
                best = upgraded
                break
        tag = re.sub(r'\s(?:data-srcset|srcset|data-src|src)="[^"]*"', "", tag, flags=re.I)
        tag = re.sub(r"\sclass=\"lazyload\"", "", tag, flags=re.I)
        tag = re.sub(r"\sloading=\"lazy\"", "", tag, flags=re.I)
        if re.search(r'\ssrc="', tag, re.I):
            tag = re.sub(r'\ssrc="[^"]*"', f' src="{best}"', tag, flags=re.I)
        else:
            tag = tag.replace("<img", f'<img src="{best}"', 1)
        if 'loading=' not in tag.lower():
            tag = tag.replace("<img", '<img loading="lazy"', 1)
        return tag

    html = re.sub(r"<img\b[^>]*>", fix_img, html, flags=re.I)

    def fix_url_in_text(match: re.Match[str]) -> str:
        return upgrade_cdn_url(match.group(0))

    html = re.sub(
        r"https?://(?:purebredkitties\.com|cdn\.shopify\.com)/cdn/shop/files/[^\s\"')]+",
        fix_url_in_text,
        html,
    )
    return html


def minify_collection_cards(html: str) -> str:
    def shrink(card: str) -> str:
        link = re.search(r'href="(/products/[^"]+)"', card)
        img = re.search(r'(?:data-src|src)="(https://purebredkitties\.com/cdn/shop/files/[^"]+)"', card)
        title = re.search(r"<h2>([^<]+)</h2>", card)
        if not link:
            return card
        src = upgrade_cdn_url(img.group(1)) if img else ""
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
    html = re.sub(
        r'\sdata-(?!autoplay|speed|direction|product|reserve|pk-|collection|src|srcset|sizes|image|handle|url|variant|price)[a-z0-9-]+="[^"]*"',
        "",
        html,
        flags=re.I,
    )
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
    "social",
    "youtube",
    "facebook",
    "instagram",
    "sharing",
    "pinterest",
    "tiktok",
)


def compact_svgs(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        svg = match.group(0)
        if len(svg) <= 500:
            return svg
        head = svg[:400].lower()
        if any(marker in head for marker in ICON_KEEP):
            return svg
        if 'viewbox="0 0 40 41"' in head or "height=41" in head:
            return svg
        ctx_start = max(0, match.start() - 300)
        ctx = html[ctx_start:match.end() + 80].lower()
        if any(k in ctx for k in ("social-sharing", "footer-social", "footer_img", "payment-icon")):
            return svg
        open_tag = re.match(r"(<svg[^>]*>)", svg, re.I)
        return (open_tag.group(1) + "</svg>") if open_tag else "<svg></svg>"

    return re.sub(r"<svg[^>]*>.*?</svg>", repl, html, flags=re.DOTALL | re.I)


def replace_contact_info(html: str) -> str:
    replacements = (
        ("+1 343-809-2153", CONTACT_PHONE_DISPLAY),
        ("343-809-2153", "3475417149"),
        ("13438092153", CONTACT_PHONE_E164),
        ("(877) 227-3707", CONTACT_PHONE_DISPLAY),
        ("+8772273707", f"+{CONTACT_PHONE_E164}"),
        ("8772273707", CONTACT_PHONE_E164),
    )
    for old, new in replacements:
        html = html.replace(old, new)

    html = re.sub(
        r"https://wa\.me/\d+",
        f"https://wa.me/{CONTACT_PHONE_E164}",
        html,
    )
    html = re.sub(
        r"https://api\.whatsapp\.com/send\?phone=\d+",
        f"https://api.whatsapp.com/send?phone={CONTACT_PHONE_E164}",
        html,
    )
    html = re.sub(
        r'href="tel:\+?\d+"',
        f'href="tel:+{CONTACT_PHONE_E164}"',
        html,
    )
    html = re.sub(
        r'"telephone"\s*:\s*"[^"]*"',
        f'"telephone":"{CONTACT_PHONE_DISPLAY}"',
        html,
    )
    html = html.replace(
        "texting either of these numbers +1 3475417149 or +1 3475417149",
        f"texting {CONTACT_PHONE_DISPLAY}",
    )
    return html


def inject_signal_contact(html: str) -> str:
    if 'class="footer_signal foot_col"' not in html and 'class="footer_email foot_col"' in html:
        html = re.sub(
            r'(<div class="footer_email foot_col">.*?</div>)',
            r"\1" + SIGNAL_FOOTER_HTML,
            html,
            count=1,
            flags=re.DOTALL,
        )
    if 'Message on Signal' not in html and 'Calendly.initPopupWidget' in html:
        html = re.sub(
            r'(<a href="#"[^>]*onclick="Calendly\.initPopupWidget[^"]*"[^>]*class="[^"]*callendar_btn[^"]*")',
            CONTACT_SIGNAL_BLOCK + r'\1',
            html,
            count=1,
        )
        if 'Message on Signal' not in html:
            html = html.replace(
                'Calendly.initPopupWidget',
                CONTACT_SIGNAL_BLOCK + 'Calendly.initPopupWidget',
                1,
            )
    return html


def ultra_optimize(html: str, rel: Path | None = None) -> str:
    for pattern in REMOVE_PATTERNS:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    html = strip_scripts(html)
    html = strip_slideshow_scripts(html)
    for pattern in STYLE_STRIP:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    for pattern in OPTIONAL_SECTIONS:
        html = re.sub(pattern, "", html, flags=re.I)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = re.sub(r"<noscript[^>]*>.*?</noscript>", "", html, flags=re.DOTALL | re.I)
    html = externalize_all_urls(html)
    html = strip_broken_stylesheets(html)
    html = fix_stylesheet_media(html)
    if rel:
        info = collection_info(rel)
        if info:
            html = fix_pagination_links(html, info[0], info[1])
    html = inject_head(html)
    html = inject_body_scripts(html)
    html = fix_html_links(html)
    html = fix_image_urls(html)
    html = replace_contact_info(html)
    html = inject_signal_contact(html)
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

# --- FIX: site uploaded inside public_html/index.html/ folder (Hostinger mistake) ---
RewriteCond %{REQUEST_URI} !^/index\\.html/
RewriteCond %{REQUEST_URI} !^/move-to-root\\.php
RewriteRule ^(.*)$ /index.html/$1 [L]

RewriteRule ^index\\.html/index\\.html/?$ / [R=301,L]
RewriteRule ^index\\.html/(.*)$ /$1 [R=301,L]
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
    (out / "UPLOAD-FIRST.txt").write_text(f"""PUREBRED KITTIES — EXACT CLONE (CDN ASSETS)
================================================
This is a full clone of https://purebredkitties.com/
Photos/CSS/JS load from purebredkitties.com CDN — small zip, full website.

DO NOT open files by double-clicking on your computer (file:///C:/...)
You MUST upload to Hostinger web hosting for the site to work.

1. Hostinger → File Manager → public_html
2. DELETE all old files (including index.html/ folder if present)
3. Upload PUREBRED-KITTIES-CLONE-SITE.zip
4. Extract directly into public_html (NOT inside an index.html folder)
5. Visit yourdomain.com/verify.html then yourdomain.com/

IF PAGES SHOW 404 BUT HOMEPAGE WORKS:
Your files may be inside public_html/index.html/ (folder). Upload HOSTINGER-FIX-404-NOW.zip
to public_html root and extract (overwrites .htaccess). Test a product URL again.

Contact: {CONTACT_EMAIL} | Phone/WhatsApp: {CONTACT_PHONE_DISPLAY} | Signal: {SIGNAL_URL}
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
    fetch_missing_products()
    out = stage_ultra()
    write_htaccess(out)
    write_verify(out)
    write_readme(out)
    mb = make_zip(out, OUTPUT_ULTRA_ZIP)
    print(f"CLONE ZIP: {OUTPUT_ULTRA_ZIP.name} — {mb:.1f} MB")
    if mb > MAX_ZIP_MB:
        print(f"NOTE: Full visual clone is {mb:.1f} MB (limit target {MAX_ZIP_MB} MB). All assets load from CDN.")
    print(f"Ready: {OUTPUT_ULTRA_ZIP}")


if __name__ == "__main__":
    main()
