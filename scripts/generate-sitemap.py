#!/usr/bin/env python3
"""Generate sitemap.xml for all public HTML pages."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://bavarianengine.com"
OUT = ROOT / "sitemap.xml"

SKIP = {"404.html"}


def page_url(name: str) -> str:
    return BASE_URL if name == "index.html" else f"{BASE_URL}/{name}"


def priority(name: str) -> str:
    if name == "index.html":
        return "1.0"
    if name in {"shop.html", "product.html"}:
        return "0.9"
    if name.endswith("-engines.html") or name == "m57-swap-kits.html":
        return "0.85"
    if name in {"about.html", "contact.html", "services.html", "reviews.html"}:
        return "0.8"
    if name == "blog.html":
        return "0.75"
    if name.startswith("blog-"):
        return "0.7"
    return "0.5"


def main() -> None:
    pages = sorted(p.name for p in ROOT.glob("*.html") if p.name not in SKIP)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for name in pages:
        lines.append("  <url>")
        lines.append(f"    <loc>{page_url(name)}</loc>")
        lines.append(f"    <changefreq>{'weekly' if name in {'index.html', 'shop.html'} else 'monthly'}</changefreq>")
        lines.append(f"    <priority>{priority(name)}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(pages)} URLs to {OUT}")


if __name__ == "__main__":
    main()
