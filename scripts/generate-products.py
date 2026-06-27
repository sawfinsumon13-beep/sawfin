#!/usr/bin/env python3
"""Generate 2000 BMW engine products using real local engine photographs."""

import json
import random
from pathlib import Path

random.seed(42)

BASE = Path("/workspace")
SETS_PATH = BASE / "images/engines/image-sets.json"
OUTPUT = BASE / "js/products.json"

MODELS = {
    "n47": {
        "label": "N47 Engines For Sale",
        "codes": ["N47D20A", "N47D20B", "N47D20C", "N47D20D"],
        "cars": [
            ("E90", "320d"), ("E91", "320d"), ("F30", "320d"), ("F31", "320d"),
            ("F10", "520d"), ("F11", "520d"), ("F20", "118d"), ("F20", "120d"),
            ("F20", "125d"), ("F25", "X3 20d"), ("E87", "123d"), ("E82", "123d"),
            ("F34", "320d"), ("F36", "420d"),
        ],
        "price": (900, 3500),
    },
    "n57": {
        "label": "N57 Engines For Sale",
        "codes": ["N57D30A", "N57D30B", "N57D30C"],
        "cars": [
            ("E90", "330d"), ("F10", "530d"), ("F11", "530d"), ("F07", "530d GT"),
            ("F10", "535d"), ("F15", "X5 30d"), ("F16", "X6 30d"), ("F30", "335d"),
            ("F25", "X3 30d"), ("E70", "X5 30d"), ("E71", "X6 30d"),
        ],
        "price": (2000, 6000),
    },
    "b47": {
        "label": "B47 Engines For Sale",
        "codes": ["B47D20A", "B47D20B", "B47D30A", "B47D30B"],
        "cars": [
            ("F20", "118d"), ("F20", "120d"), ("F30", "320d"), ("F31", "320d"),
            ("F10", "520d"), ("G20", "320d"), ("F48", "X1 20d"), ("F39", "X2 20d"),
            ("G01", "X3 20d"), ("F22", "220d"),
        ],
        "price": (1500, 4500),
    },
    "b57": {
        "label": "B57 Engines For Sale",
        "codes": ["B57D30A", "B57D30B", "B57D30C"],
        "cars": [
            ("G30", "530d"), ("G31", "530d"), ("G05", "X5 30d"), ("G06", "X6 30d"),
            ("G11", "730d"), ("G12", "740d"), ("G01", "X3 30d"),
        ],
        "price": (3500, 7500),
    },
    "b58": {
        "label": "B58 Engines For Sale",
        "codes": ["B58B30A", "B58B30B", "B58B30C"],
        "cars": [
            ("F30", "340i"), ("F32", "440i"), ("F22", "M240i"), ("G20", "M340i"),
            ("F48", "X3 M40i"), ("G01", "X3 M40i"), ("F39", "X2 M35i"),
        ],
        "price": (3000, 6500),
    },
    "m57": {
        "label": "M57 Engines For Sale",
        "codes": ["M57D30", "M57TU", "M57N", "M57D30TU2"],
        "cars": [
            ("E46", "330d"), ("E60", "530d"), ("E61", "530d"), ("E60", "535d"),
            ("E53", "X5 3.0d"), ("E70", "X5 3.0d"), ("E90", "335d"), ("E83", "X3 3.0d"),
        ],
        "price": (500, 2500),
    },
}

CATEGORY_WEIGHTS = [
    ("n47", 380), ("n57", 360), ("b47", 320), ("b57", 280),
    ("b58", 180), ("m57", 480),
]


def build_category_pool():
    pool = []
    for cat, count in CATEGORY_WEIGHTS:
        pool.extend([cat] * count)
    while len(pool) < 2000:
        pool.append(random.choice(list(MODELS.keys())))
    random.shuffle(pool)
    return pool[:2000]


def fmt_price(euros):
    whole = int(euros)
    cents = int(round((euros - whole) * 100))
    s = f"{whole:,}".replace(",", ".")
    return f"{s},{cents:02d} €"


def load_image_sets():
    sets = json.loads(SETS_PATH.read_text())
    # Only sets with at least 1 local image
    return [s for s in sets if s.get("main")]


def assign_images(product_id, image_sets):
    """Each product gets 6 real engine photos from a donor set (rotated for variety)."""
    base = image_sets[(product_id - 1) % len(image_sets)]
    all_imgs = base.get("all") or [base["main"], *base.get("thumbnails", [])]
    all_imgs = [p for p in all_imgs if p][:6]

    # Pad to 6 using unique images from pool if short
    si = 0
    while len(all_imgs) < 6:
        extra = image_sets[(product_id + si) % len(image_sets)]
        for p in (extra.get("all") or [extra["main"]]):
            if p not in all_imgs:
                all_imgs.append(p)
            if len(all_imgs) >= 6:
                break
        si += 1

    # Rotate order so sibling listings look different
    rot = (product_id - 1) % len(all_imgs)
    rotated = all_imgs[rot:] + all_imgs[:rot]
    main = rotated[0]
    thumbs = rotated[1:6]
    while len(thumbs) < 5:
        thumbs.append(rotated[len(thumbs) % len(rotated)])

    return main, thumbs[:5], base.get("id", "")


def generate():
    image_sets = load_image_sets()
    if not image_sets:
        raise SystemExit("No image sets found. Run scripts/download-engine-images.py first.")

    pool = build_category_pool()
    random.shuffle(pool)
    products = []
    used_titles = set()

    for i in range(1, 2001):
        cat = pool[i - 1]
        info = MODELS[cat]
        chassis, model = random.choice(info["cars"])
        code = random.choice(info["codes"])
        year = random.randint(2006, 2022)
        hp = random.choice([143, 163, 177, 190, 218, 231, 258, 272, 286, 313, 340])

        title = f"BMW {chassis} {model} {code} Engine {year}"
        base_title = title
        n = 0
        while title in used_titles:
            n += 1
            title = f"{base_title} ({hp}Hp)" if n < 4 else f"{base_title} Unit {i}"
        used_titles.add(title)

        lo, hi = info["price"]
        old_price = random.randint(lo, hi)
        discount = random.uniform(0.08, 0.22)
        price = round(old_price * (1 - discount), 2)
        if price >= old_price:
            price = old_price - random.randint(50, 300)

        main_img, thumbs, set_id = assign_images(i, image_sets)
        stock = random.choices(
            ["In stock", "In stock", "In stock", "Low stock", "Out of stock"],
            weights=[70, 15, 10, 3, 2],
        )[0]

        products.append({
            "id": i,
            "sku": f"BE-{i:04d}",
            "category": cat,
            "categoryLabel": info["label"],
            "title": title,
            "code": code,
            "year": year,
            "hp": hp,
            "price": price,
            "oldPrice": float(old_price),
            "priceFormatted": fmt_price(price),
            "oldPriceFormatted": fmt_price(old_price),
            "stock": stock,
            "image": main_img,
            "thumbnails": thumbs,
            "imageSet": set_id,
        })

    return products


if __name__ == "__main__":
    data = generate()
    OUTPUT.write_text(json.dumps(data, separators=(",", ":")))
    print(f"Generated {len(data)} products with real engine photos")
    print(f"Sample images: {data[0]['image']}")
    print(f"Thumbs: {len(data[0]['thumbnails'])}")
