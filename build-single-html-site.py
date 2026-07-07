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
from pk_forms import build_form_pages, replace_omniform_links

CLONE = Path("/workspace/purebred-kitties-clone")
OUT = Path("/workspace/SINGLE-SITE.html")
ZIP_OUT = Path("/workspace/PUREBRED-KITTIES-SINGLE-SITE.html")

CONTACT_PHONE = "+1 3475417149"
CONTACT_PHONE_E164 = "13475417149"
CONTACT_EMAIL = "kittenspurebreed@gmail.com"
SIGNAL_URL = "https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL"
CDN = "https://purebredkitties.com"

TITLE_RE = re.compile(r"<title>([^<|]+)", re.I)
DESC_RE = re.compile(r'property="og:description" content="([^"]+)"', re.I)
IMG_RE = re.compile(r'property="og:image" content="([^"]+)"', re.I)
PRICE_RE = re.compile(r'data-price-formatted="([^"]+)"', re.I)
H1_RE = re.compile(r"<h1[^>]*>([^<]+)", re.I)


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
        "guarantees": sanitize_product_fragment(guarantees),
        "shipping": sanitize_product_fragment(shipping),
        "sidebarExtras": sanitize_product_fragment(sidebar),
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
    if not variants and price:
        variants = [{"label": f"Complete Adoption Fee - {price}", "subtitle": "One Payment, Fully Yours Instantly"}]
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


def sanitize_page_html(html: str) -> str:
    html = re.sub(r'<ul class="payment-icon-list"[^>]*>.*?</ul>', "", html, flags=re.I | re.S)
    html = re.sub(r"<div class=\"payment-icons\"[^>]*>.*?</div>", "", html, flags=re.I | re.S)
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
    insert = f"\n{spa_views}\n</div>\n<div id=\"pk-site-footer\">\n{footer_html}\n</div>\n"
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
    # Wrap main content for SPA views
    body = body.replace("<body", '<body class="pk-spa"', 1)
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


SPA_CSS = """
<style id="pk-spa-styles">
body.pk-spa{display:flex;flex-direction:column;min-height:100vh}
#pk-content-shell{flex:1;width:100%;background:#fff}
#pk-site-footer{margin-top:auto;width:100%}
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
#pk-view-page,#pk-view-collection,#pk-view-search,#pk-view-cart{padding:24px 20px 48px;max-width:1200px;margin:0 auto;width:100%}
#pk-view-collection,#pk-view-search{max-width:1400px}
#pk-page-root,#pk-product-root{min-height:200px}
#pk-page-root img{max-width:100%;height:auto}
.yas_header,.mobile_menu_sec{position:relative;z-index:100}
.mobile_menu_sec .mobile_menu{z-index:101}
.mobile_menu li a.link_child,.mobile_menu li a.h-link-child{cursor:pointer;touch-action:manipulation}
.mobile_menu li a+ul{display:none!important}
.mobile_menu li a.open_child+ul{display:flex!important;flex-direction:column!important;width:100%!important}
.mobile_menu li li a{font-size:18px!important;text-decoration:underline;text-underline-offset:5px}
.header_menu li a.h-link-child{cursor:pointer}
.header_menu li a+ul{display:none!important}
.header_menu li a.open_child+ul{display:flex!important;flex-direction:column!important}
.pk-spa-route-product .pk-btn-back{display:none}
.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.pk-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);text-decoration:none;color:inherit;display:block}
.pk-card img{width:100%;aspect-ratio:1;object-fit:cover}
.pk-card-body{padding:16px}
.pk-card h3{margin:0 0 4px;font-size:1.1rem}
.pk-card .price{color:#774C9D;font-weight:600}
#pk-search-input,#pk-search-input-2{width:100%;max-width:480px;padding:12px 16px;border:2px solid #ddd;border-radius:8px;font-size:1rem;margin-bottom:24px}
#pk-view-contact{padding:40px 20px;max-width:900px;margin:0 auto}
.pk-contact-box{background:#f9f7fc;border-radius:12px;padding:32px;line-height:2}
.pk-contact-box a{color:#774C9D;font-weight:600}
.pk-btn-back{color:#774C9D;margin-bottom:20px;display:inline-block;cursor:pointer}
.pk-btn-order{display:inline-block;background:#B8E847;color:#342A41;padding:14px 28px;border-radius:50px;font-weight:700;text-decoration:none;border:none;cursor:pointer;font-size:1rem;margin:8px 8px 8px 0}
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
#pk-product-root .fix_button-s{position:fixed;bottom:0;left:0;right:0;z-index:90;display:none}
@media(max-width:767px){
  #pk-product-root .product-gallery-wishlist{display:block;left:30px;position:absolute;top:30px;z-index:6}
  #pk-product-root .mySwiper_product_img .swiper-button-prev{left:30px}
  #pk-product-root .mySwiper_product_img .swiper-button-next{right:30px}
  #pk-product-root .fix_button-s{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;box-shadow:0 -4px 20px rgba(52,42,65,.12);gap:12px}
  #pk-product-root .fix_button-s .reserve_block{display:flex;flex:1;gap:10px}
  #pk-product-root .fix_button-s .ask-button,#pk-product-root .fix_button-s .reserve-button{flex:1;border:none;border-radius:50px;padding:14px 16px;font-weight:700;font-size:15px;cursor:pointer}
  #pk-product-root .fix_button-s .ask-button{background:#dec0fc;color:#342a41}
  #pk-product-root .fix_button-s .reserve-button{background:#f4ff73;color:#342a41;display:flex;align-items:center;justify-content:center;gap:6px}
  body.pk-spa-route-product{padding-bottom:72px}
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
<button class="pk-btn-order" id="pk-checkout-btn">Checkout via WhatsApp</button></div>
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

  function initMobileMenu(){
    document.querySelectorAll('.mobile_menu .link_child').forEach(function(el){
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
    document.documentElement.classList.remove('wait-breed-mc-loader');
    var overlay=document.querySelector('.loading-overlay');
    if(overlay) overlay.style.display='none';
  }

  function parseParts(){
    var h=(location.hash||'#/').replace(/^#/,'').replace(/^\//,'');
    return h.split('/').filter(Boolean).map(function(p){return p.replace(/\.html$/,'');});
  }

  function setRoute(cls){ document.body.className='pk-spa pk-spa-route-'+cls+(cls==='product'?' template-product':''); }

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
    var reserveSticky=root.querySelector('#pk-reserve-sticky');
    if(reserveSticky) reserveSticky.onclick=function(){ var f=root.querySelector('.product-form.bottom-text')||root.querySelector('.product-form'); if(f){ var btn=f.querySelector('.cart_btn'); openProductWhatsApp(p,getSelectedOption(f)); if(btn){btn.disabled=true;var o=btn.innerHTML;btn.innerHTML='Opening...';setTimeout(function(){btn.disabled=false;btn.innerHTML=o;},2500);} } };
    var askSticky=root.querySelector('#pk-ask-sticky');
    if(askSticky) askSticky.onclick=function(){ openProductWhatsApp(p,''); };
    var askDesktop=root.querySelector('#pk-ask-desktop');
    if(askDesktop) askDesktop.onclick=function(e){ e.preventDefault(); openProductWhatsApp(p,''); };
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

  function openProductWhatsApp(p, optionLabel){
    var msg='Hello! I would like to reserve:\n\nKitten: '+(p.heading||p.title)+'\n';
    if(optionLabel) msg+='Payment option: '+optionLabel+'\n';
    if(p.breed) msg+='Breed: '+p.breed+'\n';
    msg+='Page: '+window.location.href+'\n\nPhone/WhatsApp: +1 3475417149\nSignal: '+SIGNAL+'\nEmail: '+EMAIL;
    window.open('https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+encodeURIComponent(msg),'_blank');
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
          '<div class="content_above_variant"><h3 class="wow fadeInUp">My Adoption Fee</h3><span>Please choose the payment option which is the best for you and click "Adopt Me" button</span></div>'+
          '<div class="price_varient_add_to_cart"><form action="#/cart/add" method="post" class="product-form new_mobile_cart" id="'+formId+'m">'+mobileVariants+
            '<div class="selected_variant_price"><p>AMOUNT TO PAY</p><span id="selected_variant_price_placeholder"></span></div>'+
            '<button type="submit" class="cart_btn new_cart-btn">Adopt Me</button></form></div>'+
          '<div class="product_description active_bar for_mobile"><h3 class="sub_heading about_heading">About Me</h3><div class="about_products">'+aboutHtml+'</div></div>'+
          mobileShipping+
        '</div>'+
        '<div class="product_description active_bar"><h2 class="sub_heading about_heading">About Me</h2><div class="about_products">'+aboutHtml+'</div></div>'+
        (infoHtml?'<div class="meta_data active_bar"><h3 class="sub_heading kitty_snap">My Info</h3><div class="custom_meta_fild">'+infoHtml+'</div></div>':'')+
        (guaranteesHtml?'<div class="includes active_bar">'+guaranteesHtml+'</div>':'')+
        (familyHtml?'<div class="reco_pro">'+familyHtml+'</div>':'')+
      '</div>'+
      '<div class="product_right"><div class="right_side_bar"><div class="product_desktop">'+
        '<div class="content_above_variant"><h3>My Adoption Fee</h3><span>Choose the payment option that works best and click \'Reserve Me\'—I\'ll be snuggled in your arms before you know it!</span></div>'+
        '<div class="price_varient_add_to_cart"><form action="#/cart/add" method="post" class="product-form bottom-text" id="'+formId+'">'+desktopVariants+
          '<div class="selected_variant_price"><p>Amount Due</p><span id="selected_variant_price_placeholders"></span></div>'+
          '<button type="submit" class="cart_btn bottom-cart-btn">Reserve Me <span><svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path d="M8.5 1L10 6H15L11 9L12.5 14L8.5 11L4.5 14L6 9L2 6H7L8.5 1Z" fill="currentColor"/></svg></span></button></form></div>'+
        '<div class="btn_form"><div class="button_app"><button type="button" id="pk-ask-desktop">Ask About Me</button></div></div>'+
        sidebarExtras+
        '<div class="secu_ssl for_mobile"><span></span><p>Secure SSL-Encrypted Checkout</p></div>'+
      '</div>'+
      (shippingHtml?'<div class="shipping_details">'+shippingHtml+'</div>':'')+
      '</div></div></div></div>'+
      '<div class="fix_button-s"><div class="reserve_block"><span class="ask-button" id="pk-ask-sticky">Ask About Me</span>'+
        '<button type="button" id="pk-reserve-sticky" class="reserve-button">Reserve Me</button></div></div>';
    initProductPage(p);
  }

  function route(){
    var parts=parseParts();
    collectionList=null;
    if(parts[0]==='products'&&parts[1]){ setRoute('product'); showProduct(parts[1]); }
    else if(parts[0]==='pages'&&parts[1]){ setRoute('page'); showPage('pages/'+parts[1]); }
    else if(parts[0]==='blogs'&&parts.length>1){ setRoute('page'); showPage('blogs/'+parts.slice(1).join('/')); }
    else if(parts[0]==='blogs'){ setRoute('page'); showPage('blogs/pk-blog'); }
    else if(parts[0]==='collections'&&parts[1]){ setRoute('collection'); showCollection(parts[1]); }
    else if(parts[0]==='search'){ setRoute('search'); showGrid(document.getElementById('pk-grid-2'),decodeURIComponent((location.search.match(/q=([^&]+)/)||[])[1]||'')); }
    else if(parts[0]==='contact'){ setRoute('page'); showPage('pages/contact'); }
    else if(parts[0]==='cart'){
      if(PAGES.cart){ setRoute('page'); showPage('cart'); }
      else { setRoute('cart'); renderCart(); }
    }
    else { document.body.className='pk-spa'; }
    finishLoading();
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

  function collectionKeyword(slug){
    slug=(slug||'').replace(/-page-\d+$/,'');
    if(!slug || /^(kittens-for-sale|all-kittens-for-sale|kittens-in-the-united-states)$/.test(slug)) return '';
    return slug.replace(/-(kittens?|cats?)-for-sale.*$/,'').replace(/-for-sale.*$/,'').replace(/-/g,' ');
  }

  function showCollection(slug){
    var kw=collectionKeyword(slug);
    var titleEl=document.getElementById('pk-collection-title');
    if(titleEl) titleEl.textContent=kw?kw.replace(/\b\w/g,function(c){return c.toUpperCase();})+' Kittens':'Available Kittens';
    collectionList=CATALOG.filter(function(p){
      if(!kw) return true;
      var hay=(p.title+' '+p.handle).toLowerCase();
      return hay.indexOf(kw)!==-1 || hay.indexOf(kw.replace(/ /g,'-'))!==-1;
    });
    showGrid(document.getElementById('pk-grid'), document.getElementById('pk-search-input')?document.getElementById('pk-search-input').value:'', collectionList);
  }

  function showGrid(container, q, source){
    if(!container) return;
    q=(q||'').toLowerCase();
    var base=source||collectionList||CATALOG;
    var list=base.filter(function(p){
      if(!q) return true;
      return (p.title+' '+p.handle).toLowerCase().indexOf(q)!==-1;
    }).slice(0,120);
    container.innerHTML=list.map(function(p){
      return '<a class="pk-card" href="#/products/'+p.handle+'"><img src="'+esc(p.image)+'" alt="" loading="lazy"><div class="pk-card-body"><h3>'+esc(p.title)+'</h3>'+(p.price?'<div class="price">'+esc(p.price)+'</div>':'')+'</div></a>';
    }).join('');
  }

  function renderCart(){
    var cart=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
    var root=document.getElementById('pk-cart-root');
    if(!cart.items.length){ root.innerHTML='<p>Your cart is empty. <a href="#/collections/kittens-for-sale">Browse kittens</a></p>'; return; }
    root.innerHTML='<ul>'+cart.items.map(function(i){return '<li>'+esc(i.title)+'</li>';}).join('')+'</ul>';
  }

  var checkoutBtn=document.getElementById('pk-checkout-btn');
  if(checkoutBtn) checkoutBtn.onclick=function(){
    var cart=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
    var msg=cart.items.length?'Hello! I would like to complete my order:\n\n'+cart.items.map(function(i,n){return (n+1)+'. '+i.title;}).join('\n'):'Hello! I would like to inquire about adopting a kitten.';
    msg+='\n\nPhone/WhatsApp: +1 3475417149\nSignal: '+SIGNAL+'\nEmail: '+EMAIL;
    window.open('https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+encodeURIComponent(msg),'_blank');
  };

  document.addEventListener('click',function(e){
    var linkChild=e.target.closest('a.link_child, a.h-link-child');
    if(linkChild && (linkChild.getAttribute('href')==='#' || linkChild.getAttribute('href')==='')){
      e.preventDefault();
      if(!linkChild.closest('.mobile_menu')){
        linkChild.classList.toggle('open_child');
      }
      return;
    }
    var a=e.target.closest('a[href^="#/"]');
    if(a){
      e.preventDefault();
      location.hash=a.getAttribute('href').slice(1);
      closeMobileMenu();
    }
  });

  ['pk-search-input','pk-search-input-2'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.addEventListener('input',function(){
      var grid=id==='pk-search-input'?document.getElementById('pk-grid'):document.getElementById('pk-grid-2');
      showGrid(grid, el.value, id==='pk-search-input'?collectionList:null);
    });
  });

  initMobileMenu();
  window.addEventListener('hashchange', route);
  route();
})();
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
    print(f"Pages: {len(pages)} (info pages, blogs, cart, search)")

    head, body = get_home_shell()
    head = head.replace("</head>", SPA_CSS + HEAD_SCRIPTS + "</head>", 1)

    contact_views = SPA_VIEWS.format(
        phone=CONTACT_PHONE,
        phone_e164=CONTACT_PHONE_E164,
        signal=SIGNAL_URL,
        email=CONTACT_EMAIL,
    )

    body = inject_blog_menu(body)
    body = replace_homepage_blog_section(body)
    body = replace_omniform_links(body)
    body = strip_internal_links(body)
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

    OUT.write_text(html, encoding="utf-8")
    ZIP_OUT.write_text(html, encoding="utf-8")
    mb = OUT.stat().st_size / (1024 * 1024)
    print(f"Written {OUT} ({mb:.1f} MB, {len(catalog)} products, {len(pages)} pages embedded)")
    return OUT


if __name__ == "__main__":
    build_single_html()
