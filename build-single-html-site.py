#!/usr/bin/env python3
"""Build one self-contained HTML file with all products and key pages (SPA)."""

import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from pk_blog_posts import (
    build_blog_pages,
    desktop_blog_menu_html,
    mobile_blog_menu_html,
    render_homepage_blog_section,
)
from pk_forms import build_form_pages, replace_calendly_links, replace_omniform_links

CLONE = Path("/workspace/purebred-kitties-clone")
OUT = Path("/workspace/SINGLE-SITE.html")
ZIP_OUT = Path("/workspace/PUREBRED-KITTIES-SINGLE-SITE.html")

CONTACT_PHONE = "+1 3475417149"
CONTACT_PHONE_E164 = "13475417149"
CONTACT_EMAIL = "kittenspurebreed@gmail.com"
SIGNAL_URL = "https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL"
CDN = "https://purebredkitties.com"

HERO_BG_IMAGE = f"{CDN}/cdn/shop/files/girl-cat-sitting-bed_0_1_1600x.png?v=1704462288"
HERO_BG_MOBILE = f"{CDN}/cdn/shop/files/girl-cat-sitting-bed_0_1_1_ec69025a-ce62-42c8-9be8-d719a648467e_450x.png?v=1721985345"

THEME_COLOR_MAP = {
    "#e6f06d": "#d4c4fc",
    "#f2f6fb": "rgba(255,255,255,0.5)",
    "#f9f9ff": "rgba(255,255,255,0.55)",
    "#faf8f9": "rgba(255,255,255,0.5)",
    "#fff8f3": "rgba(255,255,255,0.5)",
    "#fff0e8": "rgba(255,255,255,0.45)",
    "#774c9d": "#6b4390",
    "#774C9D": "#6b4390",
    "#af84d4": "#9b72c8",
    "#d7d3f1": "rgba(255,255,255,0.6)",
    "#e8a87c": "#dec0fc",
    "#b8d4c8": "#cdc7ff",
    "#5a8f7b": "#774c9d",
}


def apply_site_theme(html: str) -> str:
    # Restore original hero photo if a prior build swapped it.
    html = re.sub(
        r"https://purebredkitties\.com/cdn/shop/files/image_1_27d57d81[^\"')\s]+",
        HERO_BG_IMAGE,
        html,
        flags=re.I,
    )
    for old, new in THEME_COLOR_MAP.items():
        html = html.replace(old, new)
        html = html.replace(old.upper(), new.upper())
        html = html.replace(old.lower(), new.lower())
    # Remove opaque white section backgrounds so the fixed 3D mesh layer shows through.
    html = re.sub(
        r"(#shopify-section[-\w]+[^}]*?)background\s*:\s*#fff(?:fff)?\s*;",
        r"\1background-color:transparent;",
        html,
        flags=re.I | re.S,
    )
    html = re.sub(
        r"(\.(?:steps-sec-outer|adoption_section|breed_section|slider-line|collection-sec)[^{]*\{[^}]*?)"
        r"background\s*:\s*#fff(?:fff)?\s*;",
        r"\1background-color:transparent;",
        html,
        flags=re.I | re.S,
    )
    return html

TITLE_RE = re.compile(r"<title>([^<|]+)", re.I)
DESC_RE = re.compile(r'property="og:description" content="([^"]+)"', re.I)
IMG_RE = re.compile(r'property="og:image" content="([^"]+)"', re.I)
PRICE_RE = re.compile(r'data-price-formatted="([^"]+)"', re.I)
H1_RE = re.compile(r"<h1[^>]*>([^<]+)", re.I)
PRICE_IN_TEXT_RE = re.compile(r"\$([\d,]+(?:\.\d{2})?)")
PRICE_DISCOUNT = 0.6  # 40% off → pay 60% of listed price


def reduce_prices_in_text(text: str) -> str:
    def repl(m: re.Match[str]) -> str:
        num_str = m.group(1).replace(",", "")
        val = float(num_str)
        new_val = val * PRICE_DISCOUNT
        if "." in num_str:
            return f"${new_val:,.2f}"
        return f"${round(new_val):,}"

    return PRICE_IN_TEXT_RE.sub(repl, text)


def strip_footer_social_media(html: str) -> str:
    html = re.sub(r'<div class="footer-social">.*?</div>\s*(?=</div>|<div class="footer_img-icon"|</div></div>)', "", html, flags=re.I | re.S)
    html = re.sub(r'<div class="coll_social_media"[^>]*>.*?</div>\s*</div>', "", html, flags=re.I | re.S)
    return html


def normalize_img_url(src: str) -> str:
    src = src.strip()
    if src.startswith("//"):
        src = "https:" + src
    if "_800x" not in src and re.search(r"\.(jpg|jpeg|png|webp)", src, re.I):
        src = re.sub(r"(_\d+x)?\.(jpg|jpeg|png|webp)", r"_800x.\2", src, count=1, flags=re.I)
    return src


def extract_product_images(text: str) -> list[str]:
    imgs: list[str] = []
    for m in re.finditer(r'class="product-image"[^>]*>.*?src="([^"]+)"', text, re.I | re.S):
        src = m.group(1)
        if ".mp4" in src.lower():
            continue
        src = normalize_img_url(src)
        if src not in imgs:
            imgs.append(src)
    return imgs


def extract_product_media(text: str) -> list[dict]:
    media: list[dict] = []
    wrapper_m = re.search(
        r'<div class="swiper-wrapper">(.*?)</div><div class="swiper-button-next">',
        text,
        re.I | re.S,
    )
    if not wrapper_m:
        return media
    slides = re.findall(
        r'<div class="swiper-slide">(.*?)(?=<div class="swiper-slide">|$)',
        wrapper_m.group(1),
        re.I | re.S,
    )
    for slide in slides:
        if "product-single__video" in slide or "<video" in slide.lower():
            src_m = re.search(r'<source src="([^"]+)"', slide, re.I)
            poster_m = re.search(r'poster="([^"]+)"', slide, re.I)
            if src_m:
                media.append(
                    {
                        "type": "video",
                        "src": src_m.group(1).strip(),
                        "poster": poster_m.group(1).strip() if poster_m else "",
                    }
                )
        else:
            src_m = re.search(r'src="([^"]+)"', slide, re.I)
            if src_m and ".mp4" not in src_m.group(1).lower():
                media.append({"type": "image", "src": normalize_img_url(src_m.group(1))})
    return media[:20]


def sanitize_product_fragment(html: str) -> str:
    html = re.sub(r"\s+", " ", html)
    html = re.sub(r'href="/index\.html/([^"]+?)\.html"', r'href="#/\1"', html)
    html = re.sub(r'href="/index\.html/([^"]*?)/?"', r'href="#/\1"', html)
    html = re.sub(r'href="/products/([^"]+?)\.html"', r'href="#/products/\1"', html)
    html = re.sub(r'src="\.\./\.\./cdn\.shopify\.com/', 'src="https://cdn.shopify.com/', html)
    html = re.sub(r'src="//cdn\.shopify\.com/', 'src="https://cdn.shopify.com/', html)
    html = re.sub(r"\sonclick=\"[^\"]*\"", "", html, flags=re.I)
    html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.I | re.S)
    return html.strip()


def extract_block(text: str, start: str, end: str) -> str:
    m = re.search(start + r"(.*?)" + end, text, re.I | re.S)
    return m.group(1).strip() if m else ""


def extract_info_html(text: str) -> str:
    block = extract_block(
        text,
        r'<div class="custom_meta_fild">',
        r'</div>\s*</div>\s*<div class="includes active_bar">',
    )
    return sanitize_product_fragment(block)[:12000] if block else ""


def extract_family_html(text: str) -> str:
    block = extract_block(
        text,
        r'<div class="reco_pro">',
        r'</div>\s*</div>\s*<div class="product_right">',
    )
    return sanitize_product_fragment(block)[:12000] if block else ""


def extract_product_right_bar(text: str) -> str:
    m = re.search(
        r'<div class="product_right">\s*<div class="right_side_bar">(.*)</div>\s*</div>\s*</div>\s*</div>\s*(?:<script|\n<script|</section>)',
        text,
        re.I | re.S,
    )
    return m.group(1).strip() if m else ""


def extract_sidebar_extras(right_bar: str) -> str:
    if not right_bar:
        return ""
    m = re.search(
        r'(<div class="payment_icon wow fadeInUp animated">[\s\S]*?'
        r'<div class="pay_time">[\s\S]*?</div>\s*)'
        r'</div>\s*<div class="shipping_details">',
        right_bar,
        re.I,
    )
    sidebar = m.group(1).strip() if m else ""
    if not sidebar:
        parts: list[str] = []
        payment = None
        for hit in re.finditer(
            r'<div class="payment_icon wow fadeInUp animated">[\s\S]*?</div>',
            right_bar,
            re.I,
        ):
            payment = hit.group(0)
        if payment:
            parts.append(payment)
        ssl = re.search(r'<div class="secu_ssl for_desktop">[\s\S]*?</div>', right_bar, re.I)
        if ssl:
            parts.append(ssl.group(0))
        pay = re.search(
            r'<div class="pay_time">[\s\S]*?</div>\s*(?=</div>\s*<div class="shipping_details">)',
            right_bar,
            re.I,
        )
        if pay:
            parts.append(pay.group(0))
        sidebar = "".join(parts)
    sidebar = sidebar.replace('href="/pages/adopt-now-pay-later"', 'href="#/pages/adopt-now-pay-later"')
    sidebar = sidebar.replace('href="/index.html/pages/adopt-now-pay-later.html"', 'href="#/pages/adopt-now-pay-later"')
    return sidebar


def extract_inner_div_html(text: str, class_name: str) -> str:
    m = re.search(rf'<div class="{class_name}">', text, re.I)
    if not m:
        return ""
    start = m.end()
    depth = 1
    i = start
    while i < len(text) and depth:
        next_open = text.find("<div", i)
        next_close = text.find("</div>", i)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            i = text.find(">", next_open) + 1
        else:
            depth -= 1
            if depth == 0:
                return text[start:next_close].strip()
            i = next_close + 6
    return ""


def extract_desktop_shipping(right_bar: str) -> str:
    if not right_bar:
        return ""
    return extract_inner_div_html(right_bar, "shipping_details")


def load_product_static_sections() -> dict[str, str]:
    ernest = CLONE / "products" / "male-british-shorthair-kitten-ernest.html"
    umar = CLONE / "products" / "male-bengal-kitten-umar.html"
    guarantees_src = ernest if ernest.exists() else umar
    sidebar_src = umar if umar.exists() else ernest
    if not guarantees_src.exists():
        return {"guarantees": "", "shipping": "", "sidebarExtras": ""}
    guarantees_text = guarantees_src.read_text(encoding="utf-8", errors="ignore")
    sidebar_text = sidebar_src.read_text(encoding="utf-8", errors="ignore")
    guarantees = extract_block(
        guarantees_text,
        r'<div class="includes active_bar">',
        r'</div>\s*<div class="reco_pro">',
    )
    right_bar = extract_product_right_bar(sidebar_text)
    shipping = extract_desktop_shipping(right_bar)
    sidebar = extract_sidebar_extras(right_bar)
    return {
        "guarantees": replace_omniform_links(sanitize_product_fragment(guarantees)),
        "shipping": replace_omniform_links(sanitize_product_fragment(shipping)),
        "sidebarExtras": replace_omniform_links(sanitize_product_fragment(sidebar)),
    }


def extract_product_variants(text: str) -> list[dict]:
    variants: list[dict] = []
    for m in re.finditer(
        r'class="variant-radio desktop-variant"[^>]*>.*?<label for="[^"]+">\s*(.*?)\s*</label>\s*<p>(.*?)</p>',
        text,
        re.I | re.S,
    ):
        label = re.sub(r"\s+", " ", m.group(1).strip())
        subtitle = re.sub(r"\s+", " ", m.group(2).strip())
        if label and not any(v["label"] == label for v in variants):
            variants.append({"label": label, "subtitle": subtitle})
    return variants[:3]


def infer_breed_from_handle(handle: str, breed: str) -> tuple[str, str]:
    handle_l = handle.lower()
    patterns = [
        (r"abyssinian", "abyssinian-kitties-for-sale", "Abyssinian"),
        (r"british-shorthair", "british-shorthair-kittens", "British Shorthair"),
        (r"british-longhair", "british-longhair-kittens-for-sale", "British Longhair"),
        (r"bengal", "bengal-cats-for-sale", "Bengal"),
        (r"maine-coon", "maine-coon-kittens-for-sale", "Maine Coon"),
        (r"sphynx", "sphynx-kittens-for-sale", "Sphynx"),
        (r"devon-rex", "devon-rex-kittens-for-sale", "Devon Rex"),
        (r"cornish-rex", "cornish-rex-kittens-for-sale", "Cornish Rex"),
        (r"oriental", "oriental-kitties-for-sale", "Oriental"),
        (r"persian", "persian-kittens-for-sale", "Persian"),
        (r"munchkin", "munchkin-kittens-for-sale", "Munchkin"),
        (r"scottish-fold", "scottish-fold-kittens-for-sale", "Scottish Fold"),
        (r"scottish-straight", "scottish-straight-kittens-for-sale", "Scottish Straight"),
        (r"russian-blue", "russian-blue-cat-for-sale", "Russian Blue"),
        (r"ragdoll", "ragdoll-kittens-for-sale", "Ragdoll"),
        (r"siberian", "siberian-cat-for-sale", "Siberian"),
        (r"exotic-shorthair", "exotic-shorthair-kittens-for-sale", "Exotic Shorthair"),
        (r"minuet", "minuet-kittens-for-sale", "Minuet"),
    ]
    for needle, slug, label in patterns:
        if needle in handle_l:
            return slug, breed or label
    return "", breed


def extract_product(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8", errors="ignore")
    handle = path.stem
    heading_m = re.search(r'<div class="product_title"><h1>([^<]+)</h1>', text, re.I)
    heading = heading_m.group(1).strip() if heading_m else ""
    title_m = TITLE_RE.search(text)
    title = title_m.group(1).strip() if title_m else (heading or handle.replace("-", " ").title())
    name_m = re.search(r'<div class="breadcrumbs__current">([^<]+)', text)
    name = name_m.group(1).strip() if name_m else heading.replace("Hi, I'm ", "").strip()
    breed_m = re.search(
        r'<span class="breadcrumbs__current"><a class="breadcrumbs__link" href="/index\.html/collections/([^"]+)"[^>]*aria-label="([^"]+)"',
        text,
        re.I,
    )
    breed_slug = breed_m.group(1).rstrip("/") if breed_m else ""
    breed_slug = breed_slug.replace(".html", "")
    breed = breed_m.group(2).strip() if breed_m else ""
    about_parts = re.findall(r'<div class="about_products[^"]*">\s*(.*?)\s*</div>', text, re.I | re.S)
    about = max(about_parts, key=len).strip() if about_parts else ""
    desc_m = DESC_RE.search(text)
    desc = desc_m.group(1).strip() if desc_m else ""
    media = extract_product_media(text)
    images = [m["src"] for m in media if m["type"] == "image"]
    if not images:
        images = extract_product_images(text)
    img_m = IMG_RE.search(text)
    image = images[0] if images else (img_m.group(1).strip() if img_m else "")
    if image:
        image = normalize_img_url(image)
    variants = extract_product_variants(text)
    price_m = PRICE_RE.search(text)
    price = price_m.group(1).strip() if price_m else ""
    if price:
        price = reduce_prices_in_text(price)
    variants = [{**v, "label": reduce_prices_in_text(v["label"])} for v in variants]
    if not variants and price:
        variants = [{"label": f"Complete Adoption Fee - {price}", "subtitle": "One Payment, Fully Yours Instantly"}]
    if not breed_slug:
        breed_slug, breed = infer_breed_from_handle(handle, breed)
    info_html = extract_info_html(text)
    family_html = extract_family_html(text)
    return {
        "handle": handle,
        "title": title,
        "heading": heading or f"Hi, I'm {name}",
        "name": name,
        "breed": breed,
        "breedSlug": breed_slug,
        "description": desc[:500],
        "about": about[:8000],
        "infoHtml": info_html,
        "familyHtml": family_html,
        "image": image,
        "images": images[:16],
        "media": media[:20],
        "variants": variants,
        "price": price,
    }


def build_catalog() -> list[dict]:
    files = sorted((CLONE / "products").glob("*.html"))
    catalog = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(extract_product, f): f for f in files}
        for fut in as_completed(futures):
            item = fut.result()
            if item:
                catalog.append(item)
    catalog.sort(key=lambda x: x["handle"])
    return catalog


GLOBAL_PAGE_SECTION_MARKERS = (
    "__slider_first_global_",
    "__slider_second_global_",
    "__section_collection_",
    "__related_product_new_",
    "__global_companion_",
    "__global_link_",
    "__yas_subscription_",
)


def strip_embedded_global_sections(html: str) -> str:
    """Remove homepage-global blocks accidentally embedded in cloned page HTML."""
    for marker in GLOBAL_PAGE_SECTION_MARKERS:
        pat = rf'<div id="shopify-section-template--[^"]+{re.escape(marker)}[^"]+" class="shopify-section[^"]*">'
        while True:
            m = re.search(pat, html, re.I)
            if not m:
                break
            start = m.start()
            rest = html[m.end() :]
            next_m = re.search(r'<div id="shopify-section-template--', rest, re.I)
            end = m.end() + (next_m.start() if next_m else len(rest))
            html = html[:start] + html[end:]
    return html


def sanitize_page_html(html: str) -> str:
    html = re.sub(r'<ul class="payment-icon-list"[^>]*>.*?</ul>', "", html, flags=re.I | re.S)
    html = re.sub(r"<div class=\"payment-icons\"[^>]*>.*?</div>", "", html, flags=re.I | re.S)
    html = re.sub(r"<a\s+href\s*\n\s*=\s*\"([^\"]*)\"", r'<a href="\1"', html, flags=re.I)
    html = re.sub(r'href="\s+/pages/', 'href="#/pages/', html)
    html = strip_embedded_global_sections(html)
    html = reduce_prices_in_text(html)
    return html


def extract_page(path: Path, folder: str) -> dict | None:
    html = path.read_text(encoding="utf-8", errors="ignore")
    title_m = TITLE_RE.search(html)
    title = title_m.group(1).strip().split("|")[0].strip() if title_m else path.stem.replace("-", " ").title()
    main_m = re.search(r"<main[^>]*>(.*)</main>", html, re.I | re.DOTALL)
    if not main_m:
        return None
    body = strip_internal_links(main_m.group(1))
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.I | re.DOTALL)
    body = sanitize_page_html(body)
    return {"key": f"{folder}/{path.stem}", "title": title, "html": body}


def build_pages() -> dict[str, dict]:
    pages: dict[str, dict] = {}
    for folder in ("pages", "blogs"):
        for path in sorted((CLONE / folder).glob("*.html")):
            item = extract_page(path, folder)
            if item:
                pages[item["key"]] = {
                    "title": item["title"],
                    "html": replace_omniform_links(item["html"]),
                }
    for name in ("cart", "search"):
        path = CLONE / f"{name}.html"
        if path.exists():
            item = extract_page(path, "root")
            if item:
                pages[name] = {
                    "title": item["title"],
                    "html": replace_omniform_links(item["html"]),
                }
    return pages


def strip_internal_links(html: str) -> str:
    html = re.sub(r'href="/index\.html/', 'href="#/', html)
    html = re.sub(r'href="/products/([^"]+?)\.html"', r'href="#/products/\1"', html)
    html = re.sub(r'href="/pages/([^"]+?)\.html"', r'href="#/pages/\1"', html)
    html = re.sub(r'href="/blogs/([^"]+?)\.html"', r'href="#/blogs/\1"', html)
    html = re.sub(r'href="/collections/([^"]+?)/?"', r'href="#/collections/\1"', html)
    html = re.sub(r'href="/cart\.html"', 'href="#/cart"', html)
    html = re.sub(r'href="/search\.html"', 'href="#/search"', html)
    html = re.sub(r'href="/"', 'href="#/"', html)
    html = re.sub(r'href="#/([^"]+?)\.html"', r'href="#/\1"', html)
    html = re.sub(r"window\.location\.href\s*=\s*['\"]/collections/", "window.location.href='#/collections/", html)
    html = re.sub(r"window\.location\.href\s*=\s*['\"]/index\.html/collections/", "window.location.href='#/collections/", html)
    return html


def inject_blog_menu(body: str) -> str:
    blog_li = desktop_blog_menu_html()
    body = body.replace(
        '<li><a href="/index.html/pages/protection-from-scams.html" rel="prefetch">Scam Protection</a></li>',
        blog_li + '<li><a href="/index.html/pages/protection-from-scams.html" rel="prefetch">Scam Protection</a></li>',
        1,
    )
    body = body.replace(
        '<li><a href="/index.html/pages/protection-from-scams.html" rel="prefetch" aria-label="Scam Protection">Scam Protection</a></li>',
        mobile_blog_menu_html()
        + '<li><a href="/index.html/pages/protection-from-scams.html" rel="prefetch" aria-label="Scam Protection">Scam Protection</a></li>',
        1,
    )
    body = body.replace(
        'href="/index.html/blogs/purebred-cats-care"',
        'href="#/blogs/pk-blog"',
    )
    return body


def replace_homepage_blog_section(body: str) -> str:
    start = body.find('<div class="blog_container-w">')
    if start == -1:
        raise SystemExit("Could not locate homepage blog section")
    end = body.find('<div id="shopify-section-template--21804439798011__global_companion', start)
    if end == -1:
        end = body.find('class="shopify-section global_companion-yas"', start)
    if end == -1:
        raise SystemExit("Could not locate homepage blog section end")
    return body[:start] + render_homepage_blog_section() + body[end:]


def patch_inline_scripts(html: str) -> str:
    """Remove/guard homepage scripts that break SPA routes."""
    html = re.sub(
        r"<script defer>\s*window\.addEventListener\('load'[\s\S]*?new Typed\([\s\S]*?</script>",
        "",
        html,
        flags=re.I,
    )
    html = re.sub(
        r"new Typed\(",
        "typeof Typed!=='undefined'&&new Typed(",
        html,
    )
    html = re.sub(
        r"<script>\s*\(function \(\) \{\s*const finishLoading[\s\S]*?\}\)\(\);\s*</script>",
        "<script>/* pk: legacy auto-loader disabled; cat intro handles site entry */</script>",
        html,
        count=1,
    )
    html = re.sub(
        r"document\.addEventListener\('DOMContentLoaded', function \(\) \{\s*document\.addEventListener\('click', function \(e\) \{[\s\S]*?\}\)\s*\}\)",
        "/* pk: disabled handleLeave click interceptor — breaks SPA hash navigation */",
        html,
        count=1,
    )
    return html


def restructure_layout(body: str, spa_views: str) -> str:
    """Place SPA views before footer so content appears above footer, not below."""
    body = re.sub(
        r'(<div id="pk-view-home">)',
        r'<div id="pk-content-shell">\1',
        body,
        count=1,
    )

    footer_re = re.compile(
        r'<div id="shopify-section-sections--21804441370875__footer"[\s\S]*?(?=<div id="popup-overlay")'
    )
    footer_match = footer_re.search(body)
    if not footer_match:
        raise SystemExit("Could not locate site footer block")
    footer_html = footer_match.group(0)
    body = body[: footer_match.start()] + body[footer_match.end() :]

    home_close = "</main></div>"
    pos = body.find(home_close)
    if pos == -1:
        raise SystemExit("Could not locate pk-view-home close")
    pos += len(home_close)
    insert = f"\n{spa_views}\n<div id=\"pk-site-footer\">\n{footer_html}\n</div>\n</div>\n"
    return body[:pos] + insert + body[pos:]


def get_home_shell() -> str:
    index = (CLONE / "index.html").read_text(encoding="utf-8", errors="ignore")
    # Remove injected broken onclick repairs already done
    start = index.find("<body")
    end = index.rfind("</body>")
    if start == -1 or end == -1:
        raise SystemExit("Could not parse index.html body")
    head = index[:start]
    body = index[start:end + 7]
    pk_3d_bg = (
        '<div id="pk-3d-bg" aria-hidden="true">'
        '<div class="pk-3d-orb pk-3d-orb-1"></div>'
        '<div class="pk-3d-orb pk-3d-orb-2"></div>'
        '<div class="pk-3d-orb pk-3d-orb-3"></div>'
        '<div class="pk-3d-orb pk-3d-orb-4"></div>'
        '<div class="pk-3d-mesh"></div></div>'
    )
    body = re.sub(
        r"<body[^>]*>",
        f'<body class="pk-spa pk-premium-3d">{pk_3d_bg}',
        body,
        count=1,
        flags=re.I,
    )
    body = re.sub(
        r'<div class="loading-overlay">.*?</div>',
        CAT_INTRO_HTML,
        body,
        count=1,
        flags=re.S,
    )
    # Wrap main content for SPA views
    # Wrap only homepage main content — keep header + mobile menu always visible
    body = re.sub(
        r'(<main id="MainContent">)',
        r'<div id="pk-view-home">\1',
        body,
        count=1,
    )
    body = re.sub(
        r"(</main>)",
        r"\1</div>",
        body,
        count=1,
    )
    return head, body


CAT_INTRO_HTML = """<div id="pk-cat-intro" class="pk-cat-intro loading-overlay" role="dialog" aria-modal="true" aria-label="Welcome to Purebred Kitties">
  <div class="pk-cat-intro__glow" aria-hidden="true"></div>
  <div class="pk-cat-intro__content">
    <div class="pk-cat-intro__track" aria-hidden="true">
      <svg class="pk-cat-intro__cat" viewBox="0 0 140 110" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="pk-cat-shadow" cx="70" cy="98" rx="34" ry="7" fill="rgba(0,0,0,0.35)"/>
        <g class="pk-cat-body">
          <path d="M38 58c0-18 12-30 32-30s32 12 32 30v18c0 8-6 14-14 14H52c-8 0-14-6-14-14V58z" fill="#c4b5fd"/>
          <path d="M42 30 L34 8 L48 26 Z" fill="#c4b5fd"/>
          <path d="M98 30 L106 8 L92 26 Z" fill="#c4b5fd"/>
          <path class="pk-cat-tail" d="M102 62 C128 48 138 72 118 88 C108 96 98 92 96 78" fill="#a78bfa"/>
          <circle cx="56" cy="52" r="5" fill="#1a1012"/>
          <circle cx="84" cy="52" r="5" fill="#1a1012"/>
          <circle class="pk-cat-eye-shine" cx="58" cy="50" r="1.6" fill="#fff"/>
          <circle class="pk-cat-eye-shine" cx="86" cy="50" r="1.6" fill="#fff"/>
          <path d="M68 58 L70 62 L72 58" stroke="#1a1012" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M64 66 Q70 70 76 66" stroke="#dc2626" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line class="pk-cat-whisker" x1="48" y1="60" x2="28" y2="56" stroke="#f3ecec" stroke-width="1.2" stroke-linecap="round"/>
          <line class="pk-cat-whisker" x1="48" y1="64" x2="26" y2="64" stroke="#f3ecec" stroke-width="1.2" stroke-linecap="round"/>
          <line class="pk-cat-whisker" x1="92" y1="60" x2="112" y2="56" stroke="#f3ecec" stroke-width="1.2" stroke-linecap="round"/>
          <line class="pk-cat-whisker" x1="92" y1="64" x2="114" y2="64" stroke="#f3ecec" stroke-width="1.2" stroke-linecap="round"/>
        </g>
        <g class="pk-cat-legs">
          <rect class="pk-cat-leg pk-cat-leg--1" x="50" y="74" width="10" height="18" rx="5" fill="#a78bfa"/>
          <rect class="pk-cat-leg pk-cat-leg--2" x="66" y="74" width="10" height="18" rx="5" fill="#a78bfa"/>
          <rect class="pk-cat-leg pk-cat-leg--3" x="64" y="74" width="10" height="18" rx="5" fill="#9370db"/>
          <rect class="pk-cat-leg pk-cat-leg--4" x="80" y="74" width="10" height="18" rx="5" fill="#9370db"/>
        </g>
      </svg>
    </div>
    <p class="pk-cat-intro__brand">Purebred Kitties</p>
    <p class="pk-cat-intro__tap">Click anywhere to enter</p>
  </div>
</div>"""


SITE_THEME_CSS = f"""
<style id="pk-site-theme">
:root{{
  --pk-mesh-1:#0a0909;
  --pk-mesh-2:#140c0e;
  --pk-mesh-3:#1f1014;
  --pk-mesh-4:#120809;
  --pk-glass:rgba(24,12,16,0.72);
  --pk-glass-strong:rgba(32,14,18,0.88);
  --pk-glass-border:rgba(185,28,28,0.28);
  --pk-shadow:0 12px 40px rgba(0,0,0,0.45);
  --pk-shadow-soft:0 4px 24px rgba(127,29,29,0.22);
  --pk-text:#f3ecec;
  --pk-text-muted:#c9b8b8;
  --pk-accent:#dc2626;
  --pk-accent-soft:#f87171;
  --pk-accent-alt:#991b1b;
  --pk-accent-warm:#fca5a5;
}}
@keyframes pk-float-1{{0%,100%{{transform:translate(0,0) scale(1)}}50%{{transform:translate(28px,-22px) scale(1.06)}}}}
@keyframes pk-float-2{{0%,100%{{transform:translate(0,0) scale(1)}}50%{{transform:translate(-24px,18px) scale(1.04)}}}}
@keyframes pk-float-3{{0%,100%{{transform:translate(0,0) scale(1)}}50%{{transform:translate(16px,26px) scale(1.05)}}}}
#pk-3d-bg{{
  position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
  background:linear-gradient(145deg,var(--pk-mesh-1) 0%,var(--pk-mesh-2) 28%,var(--pk-mesh-3) 62%,var(--pk-mesh-4) 100%);
}}
.pk-3d-mesh{{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%,rgba(153,27,27,0.42) 0%,transparent 55%),
    radial-gradient(ellipse 60% 45% at 85% 15%,rgba(69,10,10,0.55) 0%,transparent 50%),
    radial-gradient(ellipse 70% 55% at 50% 90%,rgba(127,29,29,0.35) 0%,transparent 55%);
}}
.pk-3d-orb{{position:absolute;border-radius:50%;filter:blur(64px);opacity:0.55}}
.pk-3d-orb-1{{width:480px;height:480px;top:-100px;right:-80px;background:radial-gradient(circle,#991b1b 0%,transparent 68%);animation:pk-float-1 20s ease-in-out infinite}}
.pk-3d-orb-2{{width:560px;height:560px;bottom:5%;left:-140px;background:radial-gradient(circle,#450a0a 0%,transparent 68%);animation:pk-float-2 24s ease-in-out infinite}}
.pk-3d-orb-3{{width:400px;height:400px;top:42%;right:12%;background:radial-gradient(circle,#b91c1c 0%,transparent 68%);animation:pk-float-3 22s ease-in-out infinite}}
.pk-3d-orb-4{{width:320px;height:320px;top:18%;left:38%;background:radial-gradient(circle,#7f1d1d 0%,transparent 70%);animation:pk-float-2 26s ease-in-out infinite reverse;opacity:0.4}}
html,body.pk-spa{{background:transparent!important;min-height:100vh}}
body.pk-spa{{color:var(--pk-text);position:relative}}
body.pk-spa > *:not(#pk-3d-bg){{position:relative;z-index:1}}
#pk-content-shell,#pk-view-home,#pk-view-page,#pk-view-product,#pk-view-collection,#pk-view-search,#pk-view-cart,#pk-view-contact{{background:transparent!important}}
#pk-product-root .product_outer,#pk-page-root{{background:transparent}}
.template-index main,#MainContent{{background:transparent!important}}
.loading-overlay{{background:rgba(10,9,9,0.94)!important;backdrop-filter:blur(12px)}}
#pk-cat-intro.pk-cat-intro{{
  position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 50% 40%,#2a1218 0%,#0a0909 55%,#000 100%)!important;
  cursor:pointer;overflow:hidden;transition:opacity .65s ease,visibility .65s ease}}
#pk-cat-intro.pk-cat-intro--out{{opacity:0;visibility:hidden;pointer-events:none}}
html.pk-cat-intro-active{{overflow:hidden}}
html.pk-cat-intro-active body{{overflow:hidden}}
.pk-cat-intro__glow{{
  position:absolute;width:420px;height:420px;border-radius:50%;
  background:radial-gradient(circle,rgba(220,38,38,0.35) 0%,transparent 70%);
  animation:pk-cat-glow 2.4s ease-in-out infinite}}
.pk-cat-intro__content{{
  position:relative;z-index:2;text-align:center;padding:24px;max-width:92vw}}
.pk-cat-intro__track{{
  width:min(280px,72vw);margin:0 auto 18px;animation:pk-cat-walk-in 1.1s cubic-bezier(.22,1,.28,1) forwards}}
.pk-cat-intro__cat{{width:100%;height:auto;display:block;animation:pk-cat-bounce 1.8s ease-in-out .9s infinite}}
.pk-cat-tail{{transform-origin:96px 78px;animation:pk-cat-tail 1.2s ease-in-out infinite}}
.pk-cat-leg--1,.pk-cat-leg--3{{transform-origin:center top;animation:pk-cat-step .55s ease-in-out infinite alternate}}
.pk-cat-leg--2,.pk-cat-leg--4{{transform-origin:center top;animation:pk-cat-step .55s ease-in-out .275s infinite alternate-reverse}}
.pk-cat-eye-shine{{animation:pk-cat-blink 3.5s infinite}}
.pk-cat-intro__brand{{
  margin:0 0 8px;font-size:clamp(1.4rem,4vw,2rem);font-weight:700;color:#f3ecec;letter-spacing:.02em;
  opacity:0;animation:pk-cat-fade-up .7s ease .55s forwards}}
.pk-cat-intro__tap{{
  margin:0;font-size:clamp(.9rem,2.5vw,1rem);color:#fca5a5;opacity:0;
  animation:pk-cat-fade-up .7s ease .85s forwards,pk-cat-pulse 1.6s ease-in-out 1.4s infinite}}
@keyframes pk-cat-walk-in{{from{{transform:translateX(-120vw) scale(.85);opacity:0}}to{{transform:translateX(0) scale(1);opacity:1}}}}
@keyframes pk-cat-bounce{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-8px)}}}}
@keyframes pk-cat-tail{{0%,100%{{transform:rotate(-6deg)}}50%{{transform:rotate(14deg)}}}}
@keyframes pk-cat-step{{from{{transform:rotate(-10deg) translateY(0)}}to{{transform:rotate(8deg) translateY(-2px)}}}}
@keyframes pk-cat-blink{{0%,46%,48%,100%{{opacity:1}}47%{{opacity:0}}}}
@keyframes pk-cat-glow{{0%,100%{{transform:scale(1);opacity:.75}}50%{{transform:scale(1.08);opacity:1}}}}
@keyframes pk-cat-fade-up{{from{{opacity:0;transform:translateY(14px)}}to{{opacity:1;transform:translateY(0)}}}}
@keyframes pk-cat-pulse{{0%,100%{{opacity:.75}}50%{{opacity:1}}}}
.yas_header .header-w,.yas_header{{
  background:rgba(18,10,12,0.82)!important;backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
  box-shadow:var(--pk-shadow-soft);border-bottom:1px solid rgba(185,28,28,0.2)}}
.yas_header .header_menu a,.yas_header .header_menu .h-link-child{{color:var(--pk-text)!important}}
.slideshow-container,.blog_container-w,.review_section_content,.collection-sec,
.global_companion-yas,.yas-global-link,.step-card-w,.faq_section,.expert_video-w,
.thumb_sec,.promise-section-yas,.include_slide,.testing-page-yas .shipping_option,
.steps-sec-outer,.steps-sec,.adoption_section,
#pk-view-collection,#pk-view-search,#pk-view-cart,#pk-view-contact{{
  background:var(--pk-glass)!important;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid var(--pk-glass-border);box-shadow:var(--pk-shadow);border-radius:20px}}
#pk-page-root .shopify-section,#pk-page-root section.shopify-section{{
  background:var(--pk-glass)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  border:1px solid var(--pk-glass-border);box-shadow:var(--pk-shadow-soft);border-radius:16px;margin-bottom:12px;color:var(--pk-text)}}
#pk-page-root,#pk-view-collection,#pk-view-search,#pk-view-cart,#pk-view-contact,#pk-view-product,#pk-view-page{{
  color:var(--pk-text)}}
#pk-page-root p,#pk-page-root li,#pk-page-root .shipping_option p,#pk-view-home p,#pk-view-home .step-card p{{
  color:var(--pk-text-muted)}}
#pk-product-root .right_side_bar,#pk-product-root .product_description,#pk-product-root .meta_data,
#pk-product-root .includes,#pk-product-root .reco_pro{{
  background:var(--pk-glass)!important;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border-radius:16px;border:1px solid var(--pk-glass-border);box-shadow:var(--pk-shadow-soft);color:var(--pk-text)}}
.main_banner_sec,.shopify-section.main_banner_sec{{
  background-image:url({HERO_BG_IMAGE})!important;
  background-size:cover!important;background-position:center!important}}
#shopify-section-template--21804439798011__71e80951-5677-4cc5-9762-e8cafc8c5e82{{
  background-image:url({HERO_BG_IMAGE})!important;
  background-size:cover!important;background-position:center!important}}
@media (max-width:768px){{
  #shopify-section-template--21804439798011__71e80951-5677-4cc5-9762-e8cafc8c5e82{{
    background-image:url({HERO_BG_MOBILE})!important;
    background-position:top!important}}}}
.hero_heading h2,.desc_label{{color:#fff!important}}
.hero_heading span,.hero_heading .text-type{{color:#fca5a5!important;text-shadow:0 2px 16px rgba(0,0,0,0.45)}}
.title_h2,.slideshow-container h2,#pk-view-home .title_h2,#pk-page-root .title_h2,#pk-page-root h1,#pk-page-root h2,#pk-page-root h3{{
  color:var(--pk-text)!important}}
.step-card .heading_four{{color:var(--pk-text)!important}}
.banner_search_form button[type="submit"]{{
  background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%)!important;color:#fff!important;
  border:1px solid #b91c1c!important;box-shadow:0 6px 20px rgba(220,38,38,0.35)!important}}
.btn_yellow,.popular_form,.meet_all_btn,.meet_all,.btn-primary-yas{{
  background:linear-gradient(135deg,#dc2626 0%,#991b1b 100%)!important;color:#fff!important;
  box-shadow:0 8px 24px rgba(127,29,29,0.4)!important;border:none!important}}
.yas_header .btn_purple,.callendar_btn,.btn_form .btn_purple{{
  background:linear-gradient(135deg,#450a0a 0%,#7f1d1d 100%)!important;color:#fff!important;
  box-shadow:0 6px 20px rgba(69,10,10,0.45)!important}}
.yas_header .btn_yellow{{
  background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)!important;color:#fff!important}}
#shopify-section-template--21804439798011__71e80951-5677-4cc5-9762-e8cafc8c5e82 form{{
  background:rgba(24,12,16,0.72)!important;backdrop-filter:blur(10px);border:1px solid rgba(185,28,28,0.35)!important}}
.pk-card,.pk-contact-box{{
  background:var(--pk-glass-strong)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  border:1px solid var(--pk-glass-border)!important;box-shadow:var(--pk-shadow)!important;color:var(--pk-text)}}
.mobile_menu{{background:rgba(10,6,7,0.94)!important;backdrop-filter:blur(24px)}}
#pk-site-footer{{position:relative;z-index:2;background:rgba(12,8,9,0.92)!important;color:var(--pk-text-muted)}}
#pk-site-footer a{{color:var(--pk-text)!important}}
</style>
"""

SITE_THEME_OVERRIDE_CSS = f"""
<style id="pk-site-theme-override">
html{{
  background:linear-gradient(145deg,var(--pk-mesh-1) 0%,var(--pk-mesh-2) 28%,var(--pk-mesh-3) 62%,var(--pk-mesh-4) 100%)!important;
  min-height:100vh}}
#pk-view-home .shopify-section:not(.main_banner_sec),
#pk-view-home [id^="shopify-section-template"]:not(.main_banner_sec),
#pk-view-home .adoption_section,
#pk-view-home .breed_section,
#pk-view-home .slider-line,
#pk-view-home .steps-sec-outer,
#pk-view-home .steps-sec,
#pk-view-home .kittys_section,
#pk-view-home .review_section,
#pk-view-home .blog_section,
#pk-view-home .faq_section,
#pk-view-home .expert_video-w,
#pk-view-home .promise-section-yas,
#pk-view-home .global_companion-yas,
#pk-page-root,
#pk-page-root .shopify-section,
#pk-page-root section.shopify-section,
#pk-page-root .testing-page-yas,
#pk-page-root .wrapper,
#pk-page-root .custom_wrapper,
#pk-page-root .steps-sec-outer,
#pk-page-root .adoption_section{{
  background-color:transparent!important}}
#pk-view-home .main_banner_sec,
#shopify-section-template--21804439798011__71e80951-5677-4cc5-9762-e8cafc8c5e82{{
  background-color:transparent!important;
  background-image:url({HERO_BG_IMAGE})!important;
  background-size:cover!important;background-position:center!important}}
@media (max-width:768px){{
  #shopify-section-template--21804439798011__71e80951-5677-4cc5-9762-e8cafc8c5e82{{
    background-image:url({HERO_BG_MOBILE})!important;background-position:top!important}}}}
#pk-view-home .step-card,
#pk-page-root .step-card{{
  background:var(--pk-glass-strong)!important;
  backdrop-filter:blur(22px)!important;-webkit-backdrop-filter:blur(22px)!important;
  box-shadow:var(--pk-shadow)!important}}
#shopify-section-template--21804439798011__71278585-4b27-4c75-baff-b73528b2890e,
#shopify-section-template--21804439798011__slider_first_global_79iWkH,
#shopify-section-template--21804439798011__d386879e-349b-4dcb-8f4a-4e7f41a2d38f{{
  background-color:transparent!important}}
.yas_header.stiky-active,
body.template-product .yas_header.stiky-active{{
  background:rgba(18,10,12,0.92)!important;backdrop-filter:blur(22px)!important;-webkit-backdrop-filter:blur(22px)!important}}
#pk-product-root .fix_button-s{{background:#1a1012!important;color:var(--pk-text)!important}}
#pk-view-collection .pk-card h3,#pk-view-search .pk-card h3{{color:var(--pk-text)!important}}
</style>
"""

SPA_CSS = """
<style id="pk-spa-styles">
body.pk-spa{min-height:100vh}
html:has(body.pk-spa){height:auto;min-height:100vh}
#pk-content-shell{width:100%;background:transparent;display:block}
#pk-site-footer{width:100%;position:relative;z-index:2}
#pk-view-product,#pk-view-contact,#pk-view-cart,#pk-view-search,#pk-view-collection,#pk-view-page{display:none!important}
.pk-spa-route-product #pk-view-product,
.pk-spa-route-contact #pk-view-contact,
.pk-spa-route-cart #pk-view-cart,
.pk-spa-route-search #pk-view-search,
.pk-spa-route-collection #pk-view-collection,
.pk-spa-route-page #pk-view-page{display:block!important}
.pk-spa-route-product #pk-view-home,
.pk-spa-route-contact #pk-view-home,
.pk-spa-route-cart #pk-view-home,
.pk-spa-route-search #pk-view-home,
.pk-spa-route-collection #pk-view-home,
.pk-spa-route-page #pk-view-home{display:none!important}
#pk-view-product{padding:0;max-width:none;width:100%;margin:0}
#pk-product-root .product_outer{width:100%}
@media(min-width:992px){
  .pk-spa-route-product .product_conatiner{display:flex!important;flex-wrap:nowrap!important;align-items:flex-start!important;gap:70px!important;max-width:1360px;margin:0 auto;padding:100px 50px;width:100%;box-sizing:border-box}
  .pk-spa-route-product .product_left{width:60%!important;flex:0 0 60%!important;min-width:0}
  .pk-spa-route-product .product_right{width:40%!important;flex:0 0 40%!important;min-width:0;display:flex!important;flex-direction:column!important}
  .pk-spa-route-product .right_side_bar{width:100%;position:sticky;top:100px}
  .pk-spa-route-product .product_desktop{display:block!important}
  .pk-spa-route-product .mobile_product.also_hidden{display:none!important}
  .pk-spa-route-product .shipping_details.for_mobile{display:none!important}
  .pk-spa-route-product .secu_ssl.for_desktop{display:flex!important}
  .pk-spa-route-product .secu_ssl.for_mobile{display:none!important}
  .pk-spa-route-product .includes.active_bar{display:block!important}
  .pk-spa-route-product .includes .prd-alt-metafield.metafield-sub{display:flex!important;flex-wrap:wrap!important}
  .pk-spa-route-product .includes.active_bar .prd-alt-metafield{display:flex!important;flex-wrap:wrap!important}
  .pk-spa-route-product .meta_data.active_bar .custom_meta_fild{display:flex!important;flex-wrap:wrap!important}
  .pk-spa-route-product .shipping_details{display:block!important;width:100%}
  .pk-spa-route-product .payment_icon,.pk-spa-route-product .pay_time{display:block!important;width:100%}
}
@media(max-width:991px){
  .pk-spa-route-product .product_conatiner{display:flex!important;flex-wrap:wrap!important;padding:20px!important;gap:24px!important}
  .pk-spa-route-product .product_left,.pk-spa-route-product .product_right{width:100%!important;flex:0 0 100%!important}
  .pk-spa-route-product .mobile_product.also_hidden{display:block!important}
  .pk-spa-route-product .shipping_details.for_mobile{display:block!important}
  .pk-spa-route-product .product_right .shipping_details{display:none!important}
  .pk-spa-route-product .includes .prd-alt-metafield.metafield-sub{display:flex!important;flex-wrap:wrap!important}
}
#pk-view-collection,#pk-view-search,#pk-view-cart{padding:24px 20px 48px;max-width:1200px;margin:0 auto;width:100%}
#pk-view-collection,#pk-view-search{max-width:1400px}
#pk-view-page{padding:0;max-width:none;width:100%;margin:0}
#pk-view-page>.pk-btn-back{margin:16px 20px 0;max-width:1360px;display:inline-block}
#pk-page-root,#pk-product-root{min-height:200px}
#pk-page-root{width:100%;overflow-x:hidden}
#pk-page-root img{max-width:100%;height:auto}
/* Info/story pages rely on yas-page.css + template-page body class; add SPA safety overrides */
#pk-page-root .promise-section-yas .our_promise_outer{position:relative;min-height:0}
#pk-page-root .promise-section-yas .our_promise_outer .our_promise_inner{position:relative!important;left:auto!important;top:auto!important;transform:none!important;margin:0 auto;padding:24px 20px}
#pk-page-root .testing-page-yas .shipping_option.kitties_story_sec{display:flex!important;flex-wrap:wrap;align-items:center}
#pk-page-root .include_slide .header_text{position:relative!important;width:50%;flex:0 0 50%;box-sizing:border-box}
#pk-page-root .include_slide .image{width:50%;flex:0 0 50%;position:relative!important;box-sizing:border-box}
#pk-page-root .vertical_left_slider{position:relative!important;max-width:100%!important;height:auto!important}
#pk-page-root .hidden-text.hidden{display:none!important}
@media(min-width:768px){
  #pk-page-root .for_desktop{display:flex!important}
  #pk-page-root .for_mobile{display:none!important}
}
@media(max-width:767px){
  #pk-page-root .for_desktop{display:none!important}
  #pk-page-root .for_mobile{display:block!important}
}
/* Blog posts — template-blog body class + full-height content flow */
body.template-blog{background:transparent}
#pk-page-root .article-page-yas,#pk-page-root .pk-blog-index{display:block;width:100%}
#pk-page-root .article-page-yas .wrapper.custom_wrapper{padding-bottom:80px}
#pk-page-root .article-page-yas .articledesc.rte{position:relative;z-index:1}
#pk-page-root .pk-blog-index{padding-bottom:80px}
.yas_header,.mobile_menu_sec{position:relative;z-index:10000!important;isolation:isolate}
.mobile_menu_sec .mobile_menu{z-index:10001}
.header_menu nav>ul{display:flex;align-items:center;gap:4px;list-style:none;margin:0;padding:0}
.header_menu li{position:relative;list-style:none}
.header_menu li a.h-link-child{cursor:pointer;touch-action:manipulation;user-select:none}
.header_menu li>ul{
  display:none!important;position:absolute;top:calc(100% + 8px);left:0;min-width:240px;
  padding:10px 0;margin:0;list-style:none;z-index:10002;
  background:rgba(18,10,12,0.97)!important;border:1px solid rgba(185,28,28,0.35);
  border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,0.55)}
.header_menu li:hover>ul,
.header_menu li>a.h-link-child.open_child+ul{display:flex!important;flex-direction:column!important}
.header_menu li>ul a{display:block;padding:10px 18px;color:var(--pk-text)!important;text-decoration:none;white-space:nowrap}
.header_menu li>ul a:hover{background:rgba(220,38,38,0.18)!important}
.mobile_menu li a.link_child,.mobile_menu li a.h-link-child{cursor:pointer;touch-action:manipulation}
.mobile_menu li a+ul{display:none!important}
.mobile_menu li a.open_child+ul{display:flex!important;flex-direction:column!important;width:100%!important}
.mobile_menu li li a{font-size:18px!important;text-decoration:underline;text-underline-offset:5px}
.header_button a,.header_items a{position:relative;z-index:10001}
.pk-spa-route-product .pk-btn-back{display:none}
.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.pk-card{background:rgba(255,255,255,0.78);border-radius:12px;overflow:hidden;box-shadow:0 12px 40px rgba(91,79,207,0.14);text-decoration:none;color:inherit;display:block;border:1px solid rgba(255,255,255,0.92)}
.pk-card img{width:100%;aspect-ratio:1;object-fit:cover}
.pk-card-body{padding:16px}
.pk-card h3{margin:0 0 4px;font-size:1.1rem}
.pk-card .price{color:#5B4FCF;font-weight:600}
#pk-search-input,#pk-search-input-2{width:100%;max-width:480px;padding:12px 16px;border:2px solid #ddd;border-radius:8px;font-size:1rem;margin-bottom:24px}
#pk-view-contact{padding:40px 20px;max-width:900px;margin:0 auto}
.pk-contact-box{background:rgba(255,255,255,0.65);border-radius:12px;padding:32px;line-height:2;border:1px solid rgba(255,255,255,0.9);box-shadow:0 12px 40px rgba(91,79,207,0.12)}
.pk-contact-box a{color:#5B4FCF;font-weight:600}
.pk-btn-back{color:#5B4FCF;margin-bottom:20px;display:inline-block;cursor:pointer}
.pk-btn-order{display:inline-block;padding:14px 28px;border-radius:50px;font-weight:700;text-decoration:none;border:none;cursor:pointer;font-size:1rem;margin:8px 8px 8px 0}
.pk-btn-order-wa{background:#25D366;color:#fff}
.pk-btn-order-email{background:#C4B5FD;color:#2a2540}
.pk-cart-checkout{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}
#pk-view-cart .pk-cart-list{list-style:none;padding:0;margin:0 0 20px}
#pk-view-cart .pk-cart-list li{padding:12px 0;border-bottom:1px solid #eee;font-size:16px;color:#342a41}
/* Product page gallery + layout helpers */
#pk-product-root .product-gallery-wishlist{display:none}
#pk-product-root .mySwiper_product_img .swiper-button-next,
#pk-product-root .mySwiper_product_img .swiper-button-prev{width:60px!important;height:60px!important;background-size:contain;background-repeat:no-repeat;background-position:center;border-radius:50px;filter:drop-shadow(0 1px 2px rgba(52,42,65,.18))}
#pk-product-root .mySwiper_product_img .swiper-button-prev{background-image:url('https://purebredkitties.com/cdn/shop/t/285/assets/icon-qaulity.png?v=145612438941284489071779897798');background-color:rgba(255,255,255,.78);transform:rotate(135deg)}
#pk-product-root .mySwiper_product_img .swiper-button-next{background-image:url('https://purebredkitties.com/cdn/shop/t/285/assets/icon-qaulity.png?v=145612438941284489071779897798');background-color:rgba(255,255,255,.78);transform:rotate(-45deg)}
#pk-product-root .mySwiper_product_img .swiper-button-next::after,
#pk-product-root .mySwiper_product_img .swiper-button-prev::after{display:none}
#pk-product-root .product-gallery-video-play{align-items:center;background:rgba(244,255,115,.96);border:0;border-radius:50%;box-shadow:0 6px 18px rgba(52,42,65,.28);color:#342a41;cursor:pointer;display:flex;height:68px;justify-content:center;left:50%;padding:0;position:absolute;top:50%;transform:translate(-50%,-50%);width:68px;z-index:4}
#pk-product-root .product-single__video.is-video-playing .product-gallery-video-play{display:none}
#pk-product-root .product-single__video{position:relative;width:100%}
#pk-product-root .product-single__video video{width:100%;max-width:586px;display:block;border-radius:51px}
#pk-product-root .pk-trustpilot-inline{display:flex;align-items:center;gap:8px;font-size:14px;color:#342a41;white-space:nowrap}
#pk-product-root .pk-trustpilot-inline .stars{color:#00b67a;font-weight:700;letter-spacing:1px}
#pk-product-root .pk-order-options{display:flex;flex-direction:column;gap:10px;width:100%;margin-top:8px}
#pk-product-root .pk-order-options button{width:100%;border:none;border-radius:50px;padding:14px 16px;font-weight:700;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
#pk-product-root .pk-order-wa{background:#25D366;color:#fff}
#pk-product-root .pk-order-email{background:#C4B5FD;color:#2a2540}
#pk-product-root .fix_button-s{position:fixed;bottom:0;left:0;right:0;z-index:90;display:none}
@media(max-width:767px){
  #pk-product-root .product-gallery-wishlist{display:block;left:30px;position:absolute;top:30px;z-index:6}
  #pk-product-root .mySwiper_product_img .swiper-button-prev{left:30px}
  #pk-product-root .mySwiper_product_img .swiper-button-next{right:30px}
  #pk-product-root .fix_button-s{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;box-shadow:0 -4px 20px rgba(52,42,65,.12);gap:12px}
  #pk-product-root .fix_button-s .order-options{display:flex;flex:1;gap:8px;min-width:0}
  #pk-product-root .fix_button-s .order-button{flex:1;border:none;border-radius:50px;padding:14px 10px;font-weight:700;font-size:13px;cursor:pointer;min-width:0}
  #pk-product-root .fix_button-s .order-button-wa{background:#25D366;color:#fff}
  #pk-product-root .fix_button-s .order-button-email{background:linear-gradient(135deg,#9B8CF8,#7c6cf0);color:#fff}
  #pk-product-root .fix_button-s .fix_button-rows{display:flex;flex-direction:column;gap:8px;width:100%}
  #pk-product-root .fix_button-s .ask-options{display:flex;flex:1;gap:8px;min-width:0}
  #pk-product-root .fix_button-s .ask-button,#pk-product-root .fix_button-s .order-button{flex:1;border:none;border-radius:50px;padding:14px 10px;font-weight:700;font-size:14px;cursor:pointer;min-width:0}
  #pk-product-root .fix_button-s .ask-button-wa{background:#25D366;color:#fff}
  #pk-product-root .fix_button-s .ask-button-email{background:#C4B5FD;color:#2a2540}
  #pk-product-root .pk-ask-options{display:flex;flex-direction:column;gap:10px;width:100%}
  #pk-product-root .pk-ask-options button{width:100%;border:none;border-radius:50px;padding:14px 16px;font-weight:700;font-size:15px;cursor:pointer}
  #pk-product-root .pk-ask-wa{background:#25D366;color:#fff}
  #pk-product-root .pk-ask-email{background:#C4B5FD;color:#2a2540}
  body.pk-spa-route-product{padding-bottom:120px}
}
</style>
"""

SPA_VIEWS = """
<div id="pk-view-product"><div id="pk-product-root"></div></div>
<div id="pk-view-page"><a class="pk-btn-back" href="#/">← Back</a><div id="pk-page-root"></div></div>
<div id="pk-view-collection"><a class="pk-btn-back" href="#/">← Back</a><h2 id="pk-collection-title">Available Kittens</h2><input id="pk-search-input" type="search" placeholder="Search by name or breed..."><div id="pk-grid" class="pk-grid"></div></div>
<div id="pk-view-search"><a class="pk-btn-back" href="#/">← Back</a><h2>Search</h2><input id="pk-search-input-2" type="search" placeholder="Search kittens..."><div id="pk-grid-2" class="pk-grid"></div></div>
<div id="pk-view-contact"><a class="pk-btn-back" href="#/">← Back</a><h2>Contact Us</h2><div class="pk-contact-box">
<p><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/{phone_e164}">{phone}</a></p>
<p><strong>Signal:</strong> <a href="{signal}" target="_blank" rel="noopener">Message on Signal</a></p>
<p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
<p>Have questions about adopting? Message us on WhatsApp or Signal and we'll help you find your perfect kitten.</p>
</div></div>
<div id="pk-view-cart"><a class="pk-btn-back" href="#/">← Back</a><h2>Your Cart</h2><div id="pk-cart-root"><p>Your cart is empty. <a href="#/collections/kittens-for-sale">Browse kittens</a></p></div>
<div class="pk-cart-checkout" id="pk-cart-checkout" style="display:none">
<button class="pk-btn-order pk-btn-order-wa" id="pk-checkout-wa" type="button">Checkout via WhatsApp</button>
<button class="pk-btn-order pk-btn-order-email" id="pk-checkout-email" type="button">Checkout via Email</button>
</div></div>
"""

SPA_JS = r"""
(function(){
  /*PK_PRODUCT_STATIC*/
  var WHATSAPP='13475417149', EMAIL='kittenspurebreed@gmail.com', SIGNAL='https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL';
  var CART_KEY='pk_static_cart_v1';
  var catalogEl=document.getElementById('pk-catalog-data');
  var pagesEl=document.getElementById('pk-pages-data');
  var CATALOG=catalogEl?JSON.parse(catalogEl.textContent):[];
  var PAGES=pagesEl?JSON.parse(pagesEl.textContent):{};
  var byHandle={}; CATALOG.forEach(function(p){byHandle[p.handle]=p;});
  var collectionList=null;
  var productSwiper=null, productThumbSwiper=null;

  function closeMobileMenu(){
    var cb=document.getElementById('menuCheckbox');
    if(cb) cb.checked=false;
  }

  function closeHeaderDropdowns(){
    document.querySelectorAll('.header_menu .h-link-child.open_child').forEach(function(el){
      el.classList.remove('open_child');
    });
  }

  function navigateHash(dest){
    if(!dest) return;
    if(dest.charAt(0)!=='#') dest='#'+dest.replace(/^\//,'');
    if(location.hash!==dest) location.hash=dest;
    else route();
    closeMobileMenu();
    closeHeaderDropdowns();
    window.scrollTo(0,0);
  }

  function initHeaderMenu(){
    /* Desktop dropdown toggles handled in document capture click handler */
  }

  function initMobileMenu(){
    document.querySelectorAll('.mobile_menu .link_child, .mobile_menu .h-link-child').forEach(function(el){
      if(el.dataset.pkBound) return;
      el.dataset.pkBound='1';
      el.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        el.classList.toggle('open_child');
      });
    });
  }

  function destroyProductSwipers(){
    if(productSwiper){ productSwiper.destroy(true,true); productSwiper=null; }
    if(productThumbSwiper){ productThumbSwiper.destroy(true,true); productThumbSwiper=null; }
  }

  function initProductSwipers(){
    destroyProductSwipers();
    var root=document.getElementById('pk-product-root');
    if(!root) return;
    var mainEl=root.querySelector('.pk-main-swiper');
    var thumbsEl=root.querySelector('.pk-thumb-swiper');
    if(!mainEl){ initSimpleGallery(); return; }
    if(typeof Swiper==='undefined'){ initSimpleGallery(); return; }
    try{
      if(thumbsEl){
        productThumbSwiper=new Swiper(thumbsEl,{slidesPerView:4,spaceBetween:10,freeMode:true,watchSlidesProgress:true,breakpoints:{768:{slidesPerView:5}}});
      }
      productSwiper=new Swiper(mainEl,{
        spaceBetween:10,
        loop:false,
        navigation:{nextEl:mainEl.querySelector('.swiper-button-next'),prevEl:mainEl.querySelector('.swiper-button-prev')},
        thumbs: productThumbSwiper?{swiper:productThumbSwiper}:undefined
      });
    }catch(e){
      initSimpleGallery();
    }
  }

  function initSimpleGallery(){
    var root=document.getElementById('pk-product-root');
    if(!root) return;
    var mainImg=root.querySelector('.pk-main-image')||root.querySelector('.pk-main-swiper .swiper-slide img');
    if(!mainImg) return;
    root.querySelectorAll('.pk-thumb-swiper .swiper-slide, .pk-thumb-btn, .pk-thumb-item').forEach(function(btn){
      btn.addEventListener('click',function(){
        var img=btn.querySelector('img');
        if(img && img.src){
          mainImg.src=img.src;
          if(productSwiper){
            var idx=parseInt(btn.getAttribute('data-idx')||'0',10);
            if(!isNaN(idx)) productSwiper.slideTo(idx);
          }
        }
        root.querySelectorAll('.pk-thumb-btn,.pk-thumb-swiper .swiper-slide,.pk-thumb-item').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
      });
    });
  }

  function finishLoading(){
    document.documentElement.classList.add('is-loaded');
    document.documentElement.classList.remove('wait-breed-mc-loader','pk-cat-intro-active');
    var overlay=document.getElementById('pk-cat-intro')||document.querySelector('.loading-overlay');
    if(overlay){
      overlay.classList.add('pk-cat-intro--out');
      setTimeout(function(){ overlay.style.display='none'; }, 650);
    }
  }

  var catIntroDone=false;
  function initCatIntro(){
    if(catIntroDone) return;
    var intro=document.getElementById('pk-cat-intro');
    if(!intro){ finishLoading(); return; }
    document.documentElement.classList.add('pk-cat-intro-active');
    intro.classList.add('pk-cat-intro--playing');
    var dismissed=false;
    function dismiss(){
      if(dismissed) return;
      dismissed=true;
      catIntroDone=true;
      finishLoading();
    }
    intro.addEventListener('click', dismiss);
    intro.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' ' || e.key==='Escape') dismiss();
    });
    setTimeout(dismiss, 5000);
  }

  function parseParts(){
    var h=(location.hash||'#/').replace(/^#/,'').replace(/^\//,'');
    return h.split('/').filter(Boolean).map(function(p){return p.replace(/\.html$/,'');});
  }

  var pageSwipers=[];
  function destroyPageSwipers(){
    pageSwipers.forEach(function(s){ try{ s.destroy(true,true); }catch(e){} });
    pageSwipers=[];
  }
  function initPageSwipers(root){
    destroyPageSwipers();
    if(!root || typeof Swiper==='undefined') return;
    root.querySelectorAll('.swiper').forEach(function(el){
      if(el.closest('#pk-product-root')) return;
      try{
        var opts;
        if(el.classList.contains('firstwipe') || el.closest('.vertical_left_slider')){
          opts={direction:'vertical',loop:true,autoplay:{delay:0,disableOnInteraction:false},speed:4500,slidesPerView:'auto',freeMode:true,allowTouchMove:false};
        }else if(el.classList.contains('firstwipemob') || el.closest('.vertical_mobile_slider')){
          opts={slidesPerView:2.2,spaceBetween:12,loop:true,speed:800};
        }else if(el.classList.contains('mySwiper_review') || el.closest('.review_block')){
          opts={slidesPerView:1,spaceBetween:16,pagination:{el:el.querySelector('.swiper-pagination'),clickable:true}};
        }else{
          opts={slidesPerView:1,spaceBetween:10,loop:true};
        }
        pageSwipers.push(new Swiper(el, opts));
      }catch(e){}
    });
  }
  function setRoute(cls,pageKind){
    var extra='';
    if(cls==='product') extra=' template-product';
    else if(cls==='page'){
      extra=' template-page';
      if(pageKind==='blog') extra+=' template-blog';
    }
    document.body.className='pk-spa pk-spa-route-'+cls+extra;
  }

  function productLoveCount(handle){
    var n=0; for(var i=0;i<(handle||'').length;i++) n+=handle.charCodeAt(i);
    return 20+(n%61);
  }

  function buildMediaSlides(p){
    var slides=(p.media&&p.media.length)?p.media:(p.images||[]).map(function(src){return{type:'image',src:src};});
    if(!slides.length && p.image) slides=[{type:'image',src:p.image}];
    return slides.map(function(item){
      if(item.type==='video'){
        return '<div class="swiper-slide"><div class="pro_img slider-video"><div class="product-single__video">'+
          '<video playsinline controls preload="metadata" poster="'+esc(item.poster||p.image||'')+'">'+
          '<source src="'+esc(item.src)+'" type="video/mp4"></video>'+
          '<button class="product-gallery-video-play" type="button" aria-label="Play video"><svg viewBox="0 0 512 512" width="34" height="34"><path d="M160 112v288l240-144-240-144z" fill="currentColor"/></svg></button>'+
          '</div></div></div>';
      }
      return '<div class="swiper-slide"><div class="pro_img"><div class="product-image"><img loading="lazy" src="'+esc(item.src)+'" alt="'+esc(p.heading||p.title)+'"></div></div></div>';
    }).join('');
  }

  function buildVariantRadios(p, cssClass, formId){
    var variants=p.variants&&p.variants.length?p.variants:(p.price?[{label:'Complete Adoption Fee - '+p.price,subtitle:'One Payment, Fully Yours Instantly'}]:[]);
    return variants.map(function(v,i){
      var id='variant_'+formId+'_'+i;
      return '<div class="variant-radio '+cssClass+'" data-variant-index="'+i+'"><div class="variant_radio_inner">'+
        '<input type="radio" id="'+id+'" name="id" value="'+i+'"'+(i===0?' checked':'')+'>'+
        '<label for="'+id+'">'+esc(v.label)+'</label><p>'+esc(v.subtitle)+'</p></div></div>';
    }).join('');
  }

  function initProductPage(p){
    destroyProductSwipers();
    var root=document.getElementById('pk-product-root');
    if(!root) return;
    var swiperEl=root.querySelector('.mySwiper_product_img');
    if(swiperEl && typeof Swiper!=='undefined'){
      try{
        productSwiper=new Swiper(swiperEl,{
          slidesPerView:1,spaceBetween:10,loop:true,
          pagination:{el:swiperEl.querySelector('.swiper-pagination'),clickable:true},
          navigation:{nextEl:swiperEl.querySelector('.swiper-button-next'),prevEl:swiperEl.querySelector('.swiper-button-prev')},
          breakpoints:{469:{slidesPerView:1.5,spaceBetween:10},659:{slidesPerView:2.5,spaceBetween:10},992:{slidesPerView:3.5,spaceBetween:10},1200:{slidesPerView:3.5,spaceBetween:10}}
        });
      }catch(e){}
    }
    root.querySelectorAll('.product-gallery-video-play').forEach(function(btn){
      btn.addEventListener('click',function(){
        var wrap=btn.closest('.product-single__video');
        var video=wrap&&wrap.querySelector('video');
        if(!video) return;
        video.play();
        wrap.classList.add('is-video-playing');
      });
    });
    root.querySelectorAll('input[name="id"]').forEach(function(radio){
      radio.addEventListener('change',function(){ updateSelectedPrice(root); });
    });
    updateSelectedPrice(root);
    var askStickyWa=root.querySelector('#pk-ask-sticky-wa');
    if(askStickyWa) askStickyWa.onclick=function(){ openProductWhatsApp(p,''); };
    var askStickyEmail=root.querySelector('#pk-ask-sticky-email');
    if(askStickyEmail) askStickyEmail.onclick=function(){ openProductEmail(p,''); };
    var askDesktopWa=root.querySelector('#pk-ask-desktop-wa');
    if(askDesktopWa) askDesktopWa.onclick=function(e){ e.preventDefault(); openProductWhatsApp(p,''); };
    var askDesktopEmail=root.querySelector('#pk-ask-desktop-email');
    if(askDesktopEmail) askDesktopEmail.onclick=function(e){ e.preventDefault(); openProductEmail(p,''); };
    root.querySelectorAll('.product_conatiner .product_description .sub_heading,.product_conatiner .meta_data .sub_heading,.product_conatiner .includes .sub_heading').forEach(function(subHeading){
      subHeading.style.cursor='pointer';
      subHeading.addEventListener('click',function(){
        var container=subHeading.closest('.product_description,.meta_data,.includes');
        if(container) container.classList.toggle('active_bar');
      });
    });
  }

  function getSelectedOption(form){
    var sel=form.querySelector('input[name="id"]:checked');
    if(!sel) return '';
    var label=form.querySelector('label[for="'+sel.id+'"]');
    return label?label.textContent.replace(/\s+/g,' ').trim():'';
  }

  function updateSelectedPrice(root){
    var sel=root.querySelector('input[name="id"]:checked');
    var priceEl=root.querySelector('#selected_variant_price_placeholders')||root.querySelector('#selected_variant_price_placeholder');
    if(!sel||!priceEl) return;
    var label=root.querySelector('label[for="'+sel.id+'"]');
    var text=label?label.textContent.replace(/\s+/g,' ').trim():'';
    var m=text.match(/\$[\d,]+(?:\.\d{2})?/);
    priceEl.textContent=m?m[0]:'';
  }

  function buildProductAskMessage(p, optionLabel){
    var msg='Hello! I have a question about:\n\nKitten: '+(p.heading||p.title)+'\n';
    if(optionLabel) msg+='Payment option: '+optionLabel+'\n';
    if(p.breed) msg+='Breed: '+p.breed+'\n';
    msg+='Page: '+window.location.href+'\n\nPhone/WhatsApp: +1 3475417149\nSignal: '+SIGNAL+'\nEmail: '+EMAIL+'\n\nPlease contact me. Thank you!';
    return msg;
  }

  function openProductWhatsApp(p, optionLabel){
    window.open('https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+encodeURIComponent(buildProductAskMessage(p, optionLabel)),'_blank');
  }

  function openProductEmail(p, optionLabel){
    var subject='Question about '+(p.heading||p.title||'kitten');
    window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(buildProductAskMessage(p, optionLabel));
  }

  function showProduct(handle){
    handle=handle.replace(/\.html$/,'');
    var p=byHandle[handle]; var root=document.getElementById('pk-product-root');
    if(!p){ root.innerHTML='<p>Product not found.</p>'; return; }
    if(p.title) document.title=p.title;
    var loves=productLoveCount(handle);
    var breedSlug=p.breedSlug||'kittens-for-sale';
    var breedLabel=p.breed||'Kittens';
    var formId='pk_'+handle.replace(/[^a-z0-9]/gi,'_');
    var shareUrl=encodeURIComponent(window.location.href.split('#')[0]+'#/products/'+handle);
    var shareText=encodeURIComponent((p.heading||p.title)+'');
    var desktopVariants=buildVariantRadios(p,'desktop-variant',formId);
    var mobileVariants=buildVariantRadios(p,'mobile_variant',formId+'m');
    var aboutHtml=p.about||('<p>'+esc(p.description)+'</p>');
    var infoHtml=p.infoHtml||'';
    var familyHtml=p.familyHtml||'';
    var guaranteesHtml=(PK_PRODUCT_STATIC&&PK_PRODUCT_STATIC.guarantees)||'';
    var shippingHtml=(PK_PRODUCT_STATIC&&PK_PRODUCT_STATIC.shipping)||'';
    var sidebarExtras=(PK_PRODUCT_STATIC&&PK_PRODUCT_STATIC.sidebarExtras)||'';
    var mobileShipping='<div class="shipping_details for_mobile">'+shippingHtml+'</div>';
    root.innerHTML=
      '<div class="product_outer"><div class="product_tab_slide">'+
        '<div class="swiper mySwiper_product_img"><div class="swiper-wrapper">'+buildMediaSlides(p)+'</div>'+
        '<div class="swiper-button-next"></div><div class="swiper-button-prev"></div><div class="swiper-pagination"></div></div></div>'+
      '<div class="product_conatiner"><div class="product_left">'+
        '<div class="breadcrum_pro"><nav class="breadcrumbs">'+
          '<a href="#/" class="breadcrumbs__link" aria-label="Home"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.333 10.833L10 4.167L16.667 10.833V16.667C16.667 17.083 16.333 17.417 15.917 17.417H4.083C3.667 17.417 3.333 17.083 3.333 16.667V10.833Z" stroke="#292D32" stroke-width="1.5"/></svg></a>'+
          '<span class="breadcrumbs__sep">→</span>'+
          '<a href="#/collections/all-kittens-for-sale" class="breadcrumbs__link">Kittens For Sale</a>'+
          '<span class="breadcrumbs__sep">→</span>'+
          '<a href="#/collections/'+esc(breedSlug)+'" class="breadcrumbs__link">'+esc(breedLabel)+'</a>'+
          '<span class="breadcrumbs__sep">→</span>'+
          '<div class="breadcrumbs__current">'+esc(p.name||'')+'</div></nav></div>'+
        '<div class="product_title"><h1>'+esc(p.heading||p.title)+'</h1></div>'+
        '<div class="text_intrested"><p><span>🔥</span><span>'+loves+' people love me</span></p></div>'+
        '<div class="wish_review_social">'+
          '<div class="social-sharing-wrapper"><div class="social-share">'+
            '<a href="https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+shareText+'%20'+shareUrl+'" target="_blank" rel="noopener" aria-label="whatsapp">WA</a>'+
            '<a href="https://www.facebook.com/sharer/sharer.php?u='+shareUrl+'" target="_blank" rel="noopener" aria-label="facebook">FB</a>'+
          '</div></div>'+
          '<div class="pipe_line pipe_line--trustpilot"></div>'+
          '<div class="trust_review trust_review_outer"><div class="pk-trustpilot-inline"><strong>Great</strong> <span class="stars">★★★★☆</span> <span>650 reviews on Trustpilot</span></div></div>'+
        '</div>'+
        '<div class="mobile_product also_hidden">'+
          '<div class="content_above_variant"><h3 class="wow fadeInUp">My Adoption Fee</h3><span>Choose your payment option, then order via WhatsApp or Email</span></div>'+
          '<div class="price_varient_add_to_cart"><form action="#/cart/add" method="post" class="product-form new_mobile_cart" id="'+formId+'m">'+mobileVariants+
            '<div class="selected_variant_price"><p>AMOUNT TO PAY</p><span id="selected_variant_price_placeholder"></span></div>'+
            '<div class="pk-order-options">'+
            '<button type="button" class="pk-order-wa" data-pk-order="whatsapp">Order via WhatsApp</button>'+
            '<button type="button" class="pk-order-email" data-pk-order="email">Order via Email</button></div></form></div>'+
          '<div class="product_description active_bar for_mobile"><h3 class="sub_heading about_heading">About Me</h3><div class="about_products">'+aboutHtml+'</div></div>'+
          mobileShipping+
        '</div>'+
        '<div class="product_description active_bar"><h2 class="sub_heading about_heading">About Me</h2><div class="about_products">'+aboutHtml+'</div></div>'+
        (infoHtml?'<div class="meta_data active_bar"><h3 class="sub_heading kitty_snap">My Info</h3><div class="custom_meta_fild">'+infoHtml+'</div></div>':'')+
        (guaranteesHtml?'<div class="includes active_bar">'+guaranteesHtml+'</div>':'')+
        (familyHtml?'<div class="reco_pro">'+familyHtml+'</div>':'')+
      '</div>'+
      '<div class="product_right"><div class="right_side_bar"><div class="product_desktop">'+
        '<div class="content_above_variant"><h3>My Adoption Fee</h3><span>Choose your payment option, then order via WhatsApp or Email</span></div>'+
        '<div class="price_varient_add_to_cart"><form action="#/cart/add" method="post" class="product-form bottom-text" id="'+formId+'">'+desktopVariants+
          '<div class="selected_variant_price"><p>Amount Due</p><span id="selected_variant_price_placeholders"></span></div>'+
          '<div class="pk-order-options">'+
          '<button type="button" class="pk-order-wa" data-pk-order="whatsapp">Order via WhatsApp</button>'+
          '<button type="button" class="pk-order-email" data-pk-order="email">Order via Email</button></div></form></div>'+
        '<div class="btn_form"><div class="button_app pk-ask-options">'+
          '<button type="button" class="pk-ask-wa" id="pk-ask-desktop-wa">Ask via WhatsApp</button>'+
          '<button type="button" class="pk-ask-email" id="pk-ask-desktop-email">Ask via Email</button>'+
        '</div></div>'+
        sidebarExtras+
        '<div class="secu_ssl for_mobile"><span></span><p>Secure SSL-Encrypted Checkout</p></div>'+
      '</div>'+
      (shippingHtml?'<div class="shipping_details">'+shippingHtml+'</div>':'')+
      '</div></div></div></div>'+
      '<div class="fix_button-s"><div class="fix_button-rows">'+
        '<div class="order-options">'+
        '<button type="button" id="pk-order-sticky-wa" class="order-button order-button-wa" data-pk-order="whatsapp">Order WhatsApp</button>'+
        '<button type="button" id="pk-order-sticky-email" class="order-button order-button-email" data-pk-order="email">Order Email</button></div>'+
        '<div class="ask-options">'+
        '<button type="button" id="pk-ask-sticky-wa" class="ask-button ask-button-wa">Ask WhatsApp</button>'+
        '<button type="button" id="pk-ask-sticky-email" class="ask-button ask-button-email">Ask Email</button></div></div></div>';
    initProductPage(p);
  }

  function route(){
    var parts=parseParts();
    collectionList=null;
    if(parts[0]==='products'&&parts[1]){ setRoute('product'); showProduct(parts[1]); }
    else if(parts[0]==='pages'&&parts[1]){ setRoute('page'); showPage('pages/'+parts[1]); }
    else if(parts[0]==='blogs'&&parts.length>1){ setRoute('page','blog'); showPage('blogs/'+parts.slice(1).join('/')); }
    else if(parts[0]==='blogs'){ setRoute('page','blog'); showPage('blogs/pk-blog'); }
    else if(parts[0]==='collections'&&parts[1]){ setRoute('collection'); showCollection(parts[1]); }
    else if(parts[0]==='search'){ setRoute('search'); showGrid(document.getElementById('pk-grid-2'),decodeURIComponent((location.search.match(/q=([^&]+)/)||[])[1]||'')); }
    else if(parts[0]==='contact'){ setRoute('page'); showPage('pages/contact'); }
    else if(parts[0]==='cart'){ setRoute('cart'); renderCart(); }
    else { document.body.className='pk-spa'; }
    closeMobileMenu();
    window.scrollTo(0,0);
  }

  function showPage(key){
    var root=document.getElementById('pk-page-root');
    var page=PAGES[key];
    if(!page){ root.innerHTML='<p>Page not found.</p>'; return; }
    if(page.title) document.title=page.title;
    root.innerHTML=page.html;
    initMobileMenu();
    initPkForms();
    initPageSwipers(root);
  }

  function initPkForms(){
    var breederForm=document.getElementById('pk-breeder-form');
    if(breederForm && !breederForm.dataset.pkBound){
      breederForm.dataset.pkBound='1';
      breederForm.addEventListener('submit',function(e){
        e.preventDefault();
        if(typeof window.pkSubmitBreederForm==='function') window.pkSubmitBreederForm(breederForm);
      });
    }
  }

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  function normalizeCollectionSlug(slug){
    return String(slug||'').replace(/\.html$/,'').replace(/\/$/,'').replace(/-page-\d+$/,'');
  }

  function normalizeBreedSlug(slug){
    return String(slug||'').replace(/\.html$/,'').replace(/\/$/,'');
  }

  var COLLECTION_ALIASES={
    'british-shorthair-and-british-longhair-kittens-for-sale':['british-shorthair-kittens','british-longhair-kittens-for-sale'],
    'scottish-fold-and-scottish-straight-kittens-for-sale':['scottish-fold-kittens-for-sale','scottish-straight-kittens-for-sale'],
    'exotic-cats-for-sale':['exotic-shorthair-kittens-for-sale']
  };

  function collectionKeyword(slug){
    slug=normalizeCollectionSlug(slug);
    if(!slug || /^(kittens-for-sale|all-kittens-for-sale|kittens-in-the-united-states)$/.test(slug)) return '';
    slug=slug.replace(/-(kittens?|kitties|cats?)-for-sale.*$/,'')
      .replace(/-for-sale.*$/,'')
      .replace(/-(kittens?|kitties|cats?)$/,'');
    return slug.replace(/-/g,' ');
  }

  function productMatchesCollection(p, slug){
    slug=normalizeCollectionSlug(slug);
    if(!slug || /^(kittens-for-sale|all-kittens-for-sale|kittens-in-the-united-states)$/.test(slug)) return true;
    var breedSlug=normalizeBreedSlug(p.breedSlug||'');
    if(breedSlug===slug) return true;
    var aliases=COLLECTION_ALIASES[slug];
    if(aliases && aliases.indexOf(breedSlug)!==-1) return true;
    var kw=collectionKeyword(slug);
    if(!kw) return true;
    var hay=(p.title+' '+p.handle+' '+(p.breed||'')+' '+breedSlug).toLowerCase();
    if(hay.indexOf(kw)!==-1 || hay.indexOf(kw.replace(/ /g,'-'))!==-1) return true;
    var tokens=kw.split(/\s+/).filter(Boolean);
    return tokens.length>0 && tokens.every(function(t){ return hay.indexOf(t)!==-1; });
  }

  function showCollection(slug){
    slug=normalizeCollectionSlug(slug);
    var kw=collectionKeyword(slug);
    var titleEl=document.getElementById('pk-collection-title');
    if(titleEl) titleEl.textContent=kw?kw.replace(/\b\w/g,function(c){return c.toUpperCase();})+' Kittens':'Available Kittens';
    collectionList=CATALOG.filter(function(p){ return productMatchesCollection(p, slug); });
    showGrid(document.getElementById('pk-grid'), document.getElementById('pk-search-input')?document.getElementById('pk-search-input').value:'', collectionList);
  }

  function showGrid(container, q, source){
    if(!container) return;
    q=(q||'').toLowerCase();
    var base=source||collectionList||CATALOG;
    var list=base.filter(function(p){
      if(!q) return true;
      return (p.title+' '+p.handle).toLowerCase().indexOf(q)!==-1;
    }).slice(0,500);
    container.innerHTML=list.map(function(p){
      return '<a class="pk-card" href="#/products/'+p.handle+'"><img src="'+esc(p.image)+'" alt="" loading="lazy"><div class="pk-card-body"><h3>'+esc(p.title)+'</h3>'+(p.price?'<div class="price">'+esc(p.price)+'</div>':'')+'</div></a>';
    }).join('');
  }

  function renderCart(){
    var cart=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
    var root=document.getElementById('pk-cart-root');
    var checkoutWrap=document.getElementById('pk-cart-checkout');
    if(!cart.items.length){
      if(root) root.innerHTML='<p>Your cart is empty. <a href="#/collections/kittens-for-sale">Browse kittens</a></p>';
      if(checkoutWrap) checkoutWrap.style.display='none';
      return;
    }
    if(root) root.innerHTML='<ul class="pk-cart-list">'+cart.items.map(function(i){
      return '<li><strong>'+esc(i.title)+'</strong>'+(i.variant_title?' <span>('+esc(i.variant_title)+')</span>':'')+'</li>';
    }).join('')+'</ul>';
    if(checkoutWrap) checkoutWrap.style.display='flex';
  }

  function bindCartCheckout(){
    var checkoutWa=document.getElementById('pk-checkout-wa');
    var checkoutEmail=document.getElementById('pk-checkout-email');
    if(checkoutWa && !checkoutWa.dataset.pkBound){
      checkoutWa.dataset.pkBound='1';
      checkoutWa.onclick=function(){
        if(typeof window.pkHandleCartCheckout==='function') window.pkHandleCartCheckout('whatsapp');
      };
    }
    if(checkoutEmail && !checkoutEmail.dataset.pkBound){
      checkoutEmail.dataset.pkBound='1';
      checkoutEmail.onclick=function(){
        if(typeof window.pkHandleCartCheckout==='function') window.pkHandleCartCheckout('email');
      };
    }
  }
  bindCartCheckout();

  document.addEventListener('click',function(e){
    var omniform=e.target.closest('a[href*="omniform1.com"]');
    if(omniform){
      e.preventDefault();
      var href=omniform.getAttribute('href')||'';
      if(href.indexOf('6403a509')!==-1 || /breeder/i.test((omniform.textContent||'')+(omniform.getAttribute('title')||''))){
        navigateHash('#/pages/breeder-application');
      }else{
        navigateHash('#/pages/adoption-application');
      }
      return;
    }
    var spaLink=e.target.closest('a[href^="#/"]');
    if(spaLink){
      e.preventDefault();
      e.stopPropagation();
      navigateHash(spaLink.getAttribute('href'));
      return;
    }
    var linkChild=e.target.closest('a.link_child, a.h-link-child');
    if(linkChild && (linkChild.getAttribute('href')==='#' || linkChild.getAttribute('href')==='')){
      e.preventDefault();
      e.stopPropagation();
      if(linkChild.closest('.mobile_menu')){
        linkChild.classList.toggle('open_child');
      } else if(linkChild.closest('.header_menu')){
        var wasOpen=linkChild.classList.contains('open_child');
        closeHeaderDropdowns();
        if(!wasOpen) linkChild.classList.add('open_child');
      }
      return;
    }
    if(!e.target.closest('.header_menu')) closeHeaderDropdowns();
  }, true);

  ['pk-search-input','pk-search-input-2'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.addEventListener('input',function(){
      var grid=id==='pk-search-input'?document.getElementById('pk-grid'):document.getElementById('pk-grid-2');
      showGrid(grid, el.value, id==='pk-search-input'?collectionList:null);
    });
  });

  initMobileMenu();
  initHeaderMenu();
  window.addEventListener('hashchange', route);
  route();
  initCatIntro();
})();
"""


HEAD_ASSETS = """
<link href="https://purebredkitties.com/cdn/shop/t/285/assets/yas-page.css" rel="stylesheet" media="all">
"""

HEAD_SCRIPTS = """
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://unpkg.com/typed.js@2.0.15/dist/typed.umd.js"></script>
"""


def build_single_html():
    print("Building product catalog...")
    catalog = build_catalog()
    print(f"Catalog: {len(catalog)} products")

    print("Building static pages...")
    pages = build_pages()
    pages.update(build_blog_pages())
    pages.update(build_form_pages())
    for key in pages:
        html_block = replace_calendly_links(replace_omniform_links(pages[key]["html"]))
        pages[key]["html"] = apply_site_theme(html_block)
    print(f"Pages: {len(pages)} (info pages, blogs, cart, search)")

    head, body = get_home_shell()
    head = head.replace(
        "</head>",
        SPA_CSS + SITE_THEME_CSS + HEAD_ASSETS + SITE_THEME_OVERRIDE_CSS + HEAD_SCRIPTS + "</head>",
        1,
    )

    contact_views = SPA_VIEWS.format(
        phone=CONTACT_PHONE,
        phone_e164=CONTACT_PHONE_E164,
        signal=SIGNAL_URL,
        email=CONTACT_EMAIL,
    )

    body = inject_blog_menu(body)
    body = replace_homepage_blog_section(body)
    body = replace_omniform_links(body)
    body = replace_calendly_links(body)
    body = strip_internal_links(body)
    body = reduce_prices_in_text(body)
    body = strip_footer_social_media(body)
    body = apply_site_theme(body)
    body = patch_inline_scripts(body)
    body = restructure_layout(body, contact_views)

    catalog_json = json.dumps(catalog, separators=(",", ":"))
    pages_json = json.dumps(pages, separators=(",", ":"))
    catalog_script = f'<script type="application/json" id="pk-catalog-data">{catalog_json}</script>\n'
    pages_script = f'<script type="application/json" id="pk-pages-data">{pages_json}</script>\n'
    spa_script = f"<script>{SPA_JS}</script>\n"

    static_sections = load_product_static_sections()
    static_js = "var PK_PRODUCT_STATIC=" + json.dumps(static_sections, separators=(",", ":")) + ";window.PK_PRODUCT_STATIC=PK_PRODUCT_STATIC;\n"
    spa_script = spa_script.replace("/*PK_PRODUCT_STATIC*/", static_js)

    cart_src = Path("/workspace/static-cart.js").read_text(encoding="utf-8")

    html = head + body
    html = html.replace(
        "</body>",
        catalog_script + pages_script + f"<script>{cart_src}</script>\n" + spa_script + "</body>",
        1,
    )
    html = replace_omniform_links(html)
    html = replace_calendly_links(html)
    html = strip_footer_social_media(html)
    html = apply_site_theme(html)

    OUT.write_text(html, encoding="utf-8")
    ZIP_OUT.write_text(html, encoding="utf-8")
    mb = OUT.stat().st_size / (1024 * 1024)
    print(f"Written {OUT} ({mb:.1f} MB, {len(catalog)} products, {len(pages)} pages embedded)")
    return OUT


if __name__ == "__main__":
    build_single_html()
