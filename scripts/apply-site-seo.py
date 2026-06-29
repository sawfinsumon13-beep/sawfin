#!/usr/bin/env python3
"""Apply SEO meta tags, Open Graph, and keywords across all HTML pages."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://bavarianengine.com"
KEYWORDS = "BMW engines, bmw engines for sale, buy used bmw engines, original BMW engine, Bavarian Engines"
OG_IMAGE = f"{BASE_URL}/images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp"

FAVICON_LINKS = """  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">"""

PAGE_SEO: dict[str, dict[str, str]] = {
    "index.html": {
        "title": "BMW Engines For Sale | Buy Used Original BMW Engines | Bavarian Engines",
        "description": "Buy used BMW engines from Bavarian Engines Hamburg. 2000+ original BMW engines for sale — N47, N57, B47, B57, B58 & M57. VIN verified, 6-month warranty, EU export.",
    },
    "shop.html": {
        "title": "BMW Engines For Sale — Shop 2000+ Used Motors | Bavarian Engines",
        "description": "Shop BMW engines for sale at Bavarian Engines. Buy used original BMW engines with suffix verification, documented mileage, and tracked shipping across Europe.",
    },
    "n47-engines.html": {
        "title": "N47 BMW Engines For Sale | Buy Used N47 Diesel | Bavarian Engines",
        "description": "Buy used N47 BMW engines for sale — 320d, 520d, 118d & X3. Original BMW N47 motors from Bavarian Engines with VIN match and EU export.",
    },
    "n57-engines.html": {
        "title": "N57 BMW Engines For Sale | Buy Used N57 Six-Cylinder | Bavarian Engines",
        "description": "N57 BMW engines for sale — 530d, 330d, X5 & X6. Buy used original BMW N57 diesel engines from Bavarian Engines Hamburg.",
    },
    "b47-engines.html": {
        "title": "B47 BMW Engines For Sale | Buy Used Euro 6 Diesel | Bavarian Engines",
        "description": "B47 BMW engines for sale for F30 LCI, G20 & X3. Buy used original BMW B47 motors — Bavarian Engines VIN verification.",
    },
    "b57-engines.html": {
        "title": "B57 BMW Engines For Sale | Buy Used G30 & X5 Engines | Bavarian Engines",
        "description": "Buy used B57 BMW engines for sale — G30 530d, X5 G05, X7. Original BMW B57 diesel units from Bavarian Engines.",
    },
    "b58-engines.html": {
        "title": "B58 BMW Engines For Sale | Buy Used Petrol Turbo | Bavarian Engines",
        "description": "B58 BMW engines for sale — 340i, 440i, M Performance. Buy used original BMW B58 petrol engines from Bavarian Engines.",
    },
    "m57-engines.html": {
        "title": "M57 BMW Engines For Sale | Buy Used Diesel & Swap Motors | Bavarian Engines",
        "description": "M57 BMW engines for sale for E60, E70, Defender & 4×4 swaps. Buy used original BMW M57 engines from Bavarian Engines.",
    },
    "m57-swap-kits.html": {
        "title": "M57 Swap Kits For Sale | BMW Engine Conversions | Bavarian Engines",
        "description": "Land Rover Defender & 4×4 M57 conversion kits. Buy used BMW M57 engines and swap packages from Bavarian Engines Hamburg.",
    },
    "services.html": {
        "title": "BMW Engine Services — VIN Match & Export | Bavarian Engines",
        "description": "Bavarian Engines services: VIN verification, compression tests, EU export crating, and support when you buy used BMW engines.",
    },
    "about.html": {
        "title": "About Bavarian Engines — Original BMW Engine Exchange Hamburg",
        "description": "Bavarian Engines — 10+ years supplying buy used BMW engines for sale. Original BMW motors, VIN verified, warehoused in Hamburg.",
    },
    "contact.html": {
        "title": "Contact Bavarian Engines — Buy BMW Engines For Sale",
        "description": "Contact Bavarian Engines to buy used BMW engines. WhatsApp VIN match, quotes for original BMW engines for sale, Hamburg export.",
    },
    "policies.html": {
        "title": "Warranty & Policies | Buy Used BMW Engines | Bavarian Engines",
        "description": "Bavarian Engines warranty, returns, and privacy policies for customers who buy used original BMW engines for sale.",
    },
    "blog.html": {
        "title": "BMW Engine Blog — Buying Guides | Bavarian Engines",
        "description": "Expert guides on buy used BMW engines, suffix codes, shipping, and original BMW engine selection from Bavarian Engines.",
    },
    "reviews.html": {
        "title": "BMW Engine Reviews — Customer Feedback | Bavarian Engines",
        "description": "450+ verified reviews from workshops and owners who bought BMW engines for sale from Bavarian Engines across Europe.",
    },
    "cart.html": {
        "title": "Cart | BMW Engines For Sale | Bavarian Engines",
        "description": "Your Bavarian Engines cart — buy used original BMW engines with VIN verification before checkout.",
    },
    "checkout.html": {
        "title": "Checkout | Buy Used BMW Engines | Bavarian Engines",
        "description": "Complete your BMW engine order at Bavarian Engines — original BMW motors for sale with Hamburg export.",
    },
    "product.html": {
        "title": "BMW Engine Details | Buy Used Original Motor | Bavarian Engines",
        "description": "View specifications and buy used original BMW engines for sale from Bavarian Engines — VIN match available.",
    },
}


def blog_seo(filename: str, title: str, excerpt: str) -> dict[str, str]:
    slug = filename.replace("blog-", "").replace(".html", "")
    return {
        "title": f"{title} | BMW Engines Blog | Bavarian Engines",
        "description": f"{excerpt} Buy used BMW engines for sale from Bavarian Engines — original BMW motors, Hamburg export.",
    }


def build_head_block(filename: str, title: str, description: str) -> str:
    url = BASE_URL if filename == "index.html" else f"{BASE_URL}/{filename}"
    esc = lambda s: s.replace("&", "&amp;").replace('"', "&quot;")
    t, d = esc(title), esc(description)
    return f"""  <meta name="description" content="{d}">
  <meta name="keywords" content="{KEYWORDS}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Bavarian Engines">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Bavarian Engines">
  <meta property="og:title" content="{t}">
  <meta property="og:description" content="{d}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{t}">
  <meta name="twitter:description" content="{d}">
  <meta name="twitter:image" content="{OG_IMAGE}">
  <title>{t}</title>
{FAVICON_LINKS}"""


def add_favicons(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "favicon.ico" in text:
        return False
    new_text, n = re.subn(
        r"(  <title>[^<]*</title>)",
        r"\1\n" + FAVICON_LINKS,
        text,
        count=1,
    )
    if n and new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def update_html(path: Path, title: str, description: str) -> bool:
    text = path.read_text(encoding="utf-8")
    block = build_head_block(path.name, title, description)
    new_text, n = re.subn(
        r"  <meta name=\"description\"[^>]*>\s*<title>[^<]*</title>",
        block,
        text,
        count=1,
    )
    if n == 0:
        new_text, n = re.subn(
            r"  <title>[^<]*</title>",
            block,
            text,
            count=1,
        )
    if "js/seo-config.js" not in new_text:
        new_text = new_text.replace(
            '  <link rel="stylesheet" href="css/style.css">',
            '  <script src="js/seo-config.js"></script>\n  <script src="js/seo.js" defer></script>\n  <link rel="stylesheet" href="css/style.css">',
        )
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = 0
    blog_index = json.loads((ROOT / "js" / "blog-index.json").read_text(encoding="utf-8"))
    blog_map = {f"blog-{p['slug']}.html": p for p in blog_index}

    for html in sorted(ROOT.glob("*.html")):
        name = html.name
        if name in PAGE_SEO:
            seo = PAGE_SEO[name]
        elif name in blog_map:
            p = blog_map[name]
            seo = blog_seo(name, p["title"], p["excerpt"])
        elif name.startswith("blog-"):
            seo = {
                "title": f"BMW Engine Guide | Bavarian Engines Blog",
                "description": f"Buy used BMW engines for sale — original BMW motors from Bavarian Engines Hamburg. Expert BMW engine guides.",
            }
        else:
            continue
        if update_html(html, seo["title"], seo["description"]):
            updated += 1
            print(f"Updated {name}")

    fav_added = 0
    for html in sorted(ROOT.glob("*.html")):
        if html.name == "bavarian-engines-all-in-one.html":
            continue
        if add_favicons(html):
            fav_added += 1

    print(f"Done — {updated} pages updated, {fav_added} favicons added")


if __name__ == "__main__":
    main()
