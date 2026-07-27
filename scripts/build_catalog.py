#!/usr/bin/env python3
"""Rebuild data/catalog.json from rPeptide public WooCommerce API."""
import html
import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def fetch(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.load(resp)


def strip_html(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def price_display(product: dict) -> str:
    prices = product.get("prices") or {}
    if prices.get("price_range"):
        lo = int(prices["price_range"]["min_amount"]) / 100
        hi = int(prices["price_range"]["max_amount"]) / 100
        return f"${lo:,.2f} – ${hi:,.2f}" if lo != hi else f"${lo:,.2f}"
    if prices.get("price"):
        return f"${int(prices['price']) / 100:,.2f}"
    return "Request quote"


def main():
    products = []
    page = 1
    while True:
        batch = fetch(
            f"https://www.rpeptide.com/wp-json/wc/store/products?per_page=100&page={page}"
        )
        if not batch:
            break
        products.extend(batch)
        if len(batch) < 100:
            break
        page += 1
        time.sleep(0.2)

    categories = fetch(
        "https://www.rpeptide.com/wp-json/wc/store/products/categories?per_page=100"
    )

    catalog_products = []
    for p in products:
        sizes = []
        for attr in p.get("attributes") or []:
            if attr.get("name", "").lower() == "size":
                sizes = [t["name"] for t in attr.get("terms", [])]

        catalog_products.append(
            {
                "id": p["id"],
                "name": p["name"],
                "slug": p["slug"],
                "sku": p.get("sku") or "",
                "short": strip_html(p.get("short_description", ""))[:600],
                "description": strip_html(p.get("description", "")),
                "price": price_display(p),
                "in_stock": (p.get("stock_availability") or {}).get("class")
                == "in-stock",
                "categories": [
                    {"id": c["id"], "name": c["name"], "slug": c["slug"]}
                    for c in p.get("categories", [])
                ],
                "permalink": p.get("permalink", ""),
                "sizes": sizes,
                "type": p.get("type"),
            }
        )

    by_parent: dict[int, list] = {}
    for c in categories:
        if c.get("slug") == "uncategorized":
            continue
        by_parent.setdefault(c.get("parent", 0), []).append(c)

    def build_tree(parent_id: int) -> list:
        nodes = []
        for c in sorted(by_parent.get(parent_id, []), key=lambda x: x["name"]):
            nodes.append(
                {
                    "id": c["id"],
                    "name": c["name"],
                    "slug": c["slug"],
                    "count": c.get("count", 0),
                    "image": (c.get("image") or {}).get("src"),
                    "children": build_tree(c["id"]),
                }
            )
        return nodes

    tree = build_tree(0)

    DATA.mkdir(parents=True, exist_ok=True)
    out = {"categories": tree, "products": catalog_products}
    (DATA / "catalog.json").write_text(json.dumps(out, indent=2))
    print(f"Wrote {len(catalog_products)} products, {len(tree)} top-level categories")


if __name__ == "__main__":
    main()
