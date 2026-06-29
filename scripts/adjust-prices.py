#!/usr/bin/env python3
"""Halve product prices and clamp to €2000–€4500."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "js" / "products.json"
MIN_PRICE = 2000
MAX_PRICE = 4500


def fmt_price(euros: float) -> str:
    whole = int(euros)
    cents = int(round((euros - whole) * 100))
    return f"{whole:,}".replace(",", ".") + f",{cents:02d} €"


def adjust(value: float) -> float:
    return round(max(MIN_PRICE, min(MAX_PRICE, value / 2)), 2)


def main() -> None:
    products = json.loads(PRODUCTS.read_text(encoding="utf-8"))
    for p in products:
        price = adjust(float(p["price"]))
        old = adjust(float(p.get("oldPrice", p["price"])))
        if old <= price:
            old = min(MAX_PRICE, round(price * 1.12, 2))
            if old <= price:
                old = min(MAX_PRICE, price + 150)
        p["price"] = price
        p["oldPrice"] = old
        p["priceFormatted"] = fmt_price(price)
        p["oldPriceFormatted"] = fmt_price(old)
    PRODUCTS.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    prices = [p["price"] for p in products]
    print(f"Updated {len(products)} products — min €{min(prices):,.2f}, max €{max(prices):,.2f}")


if __name__ == "__main__":
    main()
