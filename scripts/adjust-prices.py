#!/usr/bin/env python3
"""Assign varied random prices in the €2000–€4500 range."""

from __future__ import annotations

import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "js" / "products.json"
MIN_PRICE = 2000
MAX_PRICE = 4500
SEED = 20260627


def fmt_price(euros: float) -> str:
    whole = int(euros)
    cents = int(round((euros - whole) * 100))
    return f"{whole:,}".replace(",", ".") + f",{cents:02d} €"


def random_sale_price() -> float:
    """Return a varied price between MIN and MAX (whole euros or cents)."""
    if random.random() < 0.4:
        return float(random.randint(MIN_PRICE, MAX_PRICE))
    return round(random.uniform(MIN_PRICE, MAX_PRICE), 2)


def random_old_price(sale: float) -> float:
    uplift = random.uniform(1.08, 1.22)
    old = round(sale * uplift, 2)
    if old <= sale:
        old = round(sale + random.randint(150, 450), 2)
    return old


def main() -> None:
    random.seed(SEED)
    products = json.loads(PRODUCTS.read_text(encoding="utf-8"))
    for p in products:
        price = random_sale_price()
        old = random_old_price(price)
        p["price"] = price
        p["oldPrice"] = old
        p["priceFormatted"] = fmt_price(price)
        p["oldPriceFormatted"] = fmt_price(old)

    PRODUCTS.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")

    prices = [p["price"] for p in products]
    from collections import Counter

    counts = Counter(prices)
    print(
        f"Updated {len(products)} products — "
        f"min €{min(prices):,.2f}, max €{max(prices):,.2f}, "
        f"unique prices: {len(counts)}, "
        f"most common: €{counts.most_common(1)[0][0]:,.2f} ({counts.most_common(1)[0][1]}×)"
    )


if __name__ == "__main__":
    main()
