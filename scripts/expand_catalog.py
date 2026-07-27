#!/usr/bin/env python3
"""Expand catalog to 3000+ products with a unique SVG image each."""
from __future__ import annotations

import hashlib
import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "catalog.json"
IMG_DIR = ROOT / "assets" / "images" / "products"

TARGET = 3200

FAMILIES = [
    {
        "slug": "antibodies",
        "name": "Antibodies",
        "prefixes": ["Anti-Human", "Monoclonal", "Polyclonal", "Phospho"],
        "targets": [
            "Beta-Amyloid",
            "Alpha-Synuclein",
            "Tau",
            "Phospho-181 Tau",
            "Phospho-199 Tau",
            "Phospho-202 Tau",
            "Phospho-231 Tau",
            "APP",
        ],
        "clones": ["6E10", "6C2", "7E7", "1H11", "2G9", "4D5", "6H10", "10C3", "AT8", "1A6", "4G11"],
    },
    {
        "slug": "peptides",
        "name": "Peptides",
        "prefixes": ["Beta-Amyloid", "Amylin", "APP Fragment", "Synthetic Peptide"],
        "targets": [
            "(1-40)",
            "(1-42)",
            "(1-43)",
            "(1-28)",
            "(25-35)",
            "Dutch Mutant",
            "Arctic Mutant",
            "Iowa Mutant",
            "N15 Labeled",
            "C13 Labeled",
            "HFIP",
            "NH4OH",
            "FITC",
            "Biotin",
        ],
        "clones": [],
    },
    {
        "slug": "proteins",
        "name": "Proteins",
        "prefixes": ["Recombinant", "Human", "Mouse", "Labeled"],
        "targets": [
            "Alpha-Synuclein",
            "Beta-Synuclein",
            "Gamma-Synuclein",
            "Tau-441",
            "Tau-352",
            "Tau-383",
            "Tau K18",
            "ApoE2",
            "ApoE3",
            "ApoE4",
            "Calmodulin",
            "Tubulin",
        ],
        "clones": ["WT", "A30P", "E46K", "A53T", "P301L", "R406W", "Desalted", "C13", "N15", "FITC"],
    },
    {
        "slug": "neurodegenerative-related-compounds",
        "name": "Neurodegenerative Related Compounds",
        "prefixes": ["Compound", "Inhibitor", "Modulator", "Probe"],
        "targets": [
            "Aggregation",
            "Kinase",
            "Protease",
            "Autophagy",
            "Mitochondrial",
            "Oxidative Stress",
            "Neuroinflammation",
        ],
        "clones": ["A", "B", "C", "D", "E", "F", "G", "H"],
    },
    {
        "slug": "coronavirus-research-tools",
        "name": "Coronavirus Research Tools",
        "prefixes": ["SARS-CoV-2", "COVID-19", "Spike", "Nucleocapsid"],
        "targets": [
            "Related Protein",
            "Related Compound",
            "Related Antibody",
            "RBD",
            "S1 Subunit",
            "S2 Subunit",
            "3CL Protease",
            "RdRp",
        ],
        "clones": ["His-tag", "Fc", "Biotin", "WT", "Omicron", "Delta"],
    },
    {
        "slug": "kits",
        "name": "Kits",
        "prefixes": ["Aggregation Kit", "Starter Kit", "Antibody Kit", "Assay Kit"],
        "targets": ["Beta-Amyloid (1-40)", "Beta-Amyloid (1-42)", "Tau", "Alpha-Synuclein", "ThT"],
        "clones": ["Standard", "Plus", "Research", "High-Sensitivity"],
    },
    {
        "slug": "preformed-fibrils",
        "name": "Preformed Fibrils",
        "prefixes": ["Preformed Fibrils", "PFF", "Fibril Complex"],
        "targets": [
            "Beta-Amyloid (1-42)",
            "Alpha-Synuclein",
            "Tau-441",
            "FITC Alpha-Synuclein",
            "FITC Tau-441",
            "ABT Complex",
        ],
        "clones": ["Standard", "Validated", "Low-Endotoxin", "Research Grade"],
    },
]

PALETTES = [
    ("#e8f4fc", "#1d4f91", "#f59e0b", "#ffffff"),
    ("#f3f4f6", "#0f766e", "#2563eb", "#f8fafc"),
    ("#fff7ed", "#9a3412", "#0ea5e9", "#fffbeb"),
    ("#ecfeff", "#155e75", "#ca8a04", "#ffffff"),
    ("#fdf2f8", "#9d174d", "#4f46e5", "#fce7f3"),
    ("#f0fdf4", "#166534", "#d97706", "#ffffff"),
    ("#eef2ff", "#312e81", "#ea580c", "#e0e7ff"),
    ("#fafaf9", "#44403c", "#0891b2", "#ffffff"),
    ("#fef3c7", "#92400e", "#0369a1", "#fffbeb"),
    ("#e0f2fe", "#075985", "#b45309", "#f0f9ff"),
]


def hue_hash(text: str) -> int:
    return int(hashlib.md5(text.encode()).hexdigest()[:8], 16)


def unique_svg(product_id: int, name: str, family: str) -> str:
    h = hue_hash(f"{product_id}-{name}-{family}")
    bg, vial, cap, label = PALETTES[h % len(PALETTES)]
    # mutate colors slightly for uniqueness
    r = (h >> 8) % 40
    g = (h >> 16) % 40
    b = (h >> 24) % 40

    def shift(hex_color: str, dr: int, dg: int, db: int) -> str:
        hex_color = hex_color.lstrip("#")
        rr = max(0, min(255, int(hex_color[0:2], 16) + dr))
        gg = max(0, min(255, int(hex_color[2:4], 16) + dg))
        bb = max(0, min(255, int(hex_color[4:6], 16) + db))
        return f"#{rr:02x}{gg:02x}{bb:02x}"

    bg = shift(bg, r - 20, g - 20, b - 20)
    vial = shift(vial, (h % 20) - 10, ((h >> 4) % 20) - 10, ((h >> 8) % 20) - 10)
    cap = shift(cap, ((h >> 12) % 30) - 15, ((h >> 16) % 30) - 15, ((h >> 20) % 30) - 15)

    count = 3 + (h % 5)  # 3..7 vials
    width = 640
    height = 400
    spacing = width / (count + 1)
    vials = []
    for i in range(count):
        cx = spacing * (i + 1)
        # slight position jitter unique per vial
        jx = ((h >> (i * 3)) % 11) - 5
        jy = ((h >> (i * 2)) % 9) - 4
        vw = 34 + ((h >> i) % 10)
        vh = 120 + ((h >> (i + 2)) % 40)
        x = cx - vw / 2 + jx
        y = 210 - vh / 2 + jy
        cap_h = 18 + (i % 3) * 2
        fill = vial if i % 2 == 0 else shift(vial, 15, -10, 8)
        cap_fill = cap if i % 2 else shift(cap, -12, 8, 15)
        vials.append(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{vw:.1f}" height="{vh:.1f}" rx="6" fill="{fill}" opacity="0.92"/>'
            f'<rect x="{x:.1f}" y="{y - cap_h:.1f}" width="{vw:.1f}" height="{cap_h}" rx="4" fill="{cap_fill}"/>'
            f'<rect x="{x + 4:.1f}" y="{y + vh * 0.35:.1f}" width="{vw - 8:.1f}" height="{vh * 0.22:.1f}" rx="2" fill="{label}" opacity="0.85"/>'
        )

    code = f"P{product_id:04d}"
    short = (name[:22] + "…") if len(name) > 22 else name
    short = (
        short.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <linearGradient id="g{product_id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="{shift(bg, 20, 10, -15)}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g{product_id})"/>
  <circle cx="{(h % 500) + 40}" cy="{(h % 120) + 30}" r="{(h % 40) + 20}" fill="{shift(cap, 40, 40, 40)}" opacity="0.18"/>
  <circle cx="{(h % 300) + 280}" cy="{(h % 90) + 280}" r="{(h % 50) + 30}" fill="{shift(vial, 30, 30, 30)}" opacity="0.12"/>
  {''.join(vials)}
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="{vial}">{code}</text>
  <text x="24" y="62" font-family="Arial, sans-serif" font-size="14" fill="#334155">{short}</text>
  <text x="24" y="380" font-family="Arial, sans-serif" font-size="12" fill="#64748b">{family} · unique image</text>
</svg>
'''


def money(n: float) -> str:
    return f"${n:,.2f}"


def price_for(i: int, family: str) -> str:
    base = {
        "antibodies": 280,
        "peptides": 190,
        "proteins": 320,
        "neurodegenerative-related-compounds": 150,
        "coronavirus-research-tools": 210,
        "kits": 450,
        "preformed-fibrils": 520,
    }[family]
    lo = base + (i % 97) * 3.5
    hi = lo * (1.4 + (i % 5) * 0.15)
    return f"{money(lo)} – {money(hi)}"


def sizes_for(family: str, i: int) -> list[str]:
    if family == "kits":
        return ["1 kit", "5 kits"]
    if family == "antibodies":
        return ["50 µg", "100 µg", "500 µg"][0 : 2 + (i % 2)]
    return ["50 µg", "100 µg", "500 µg", "1.0 mg"][0 : 2 + (i % 3)]


def build_name(family: dict, i: int) -> str:
    pref = family["prefixes"][i % len(family["prefixes"])]
    tgt = family["targets"][(i * 3) % len(family["targets"])]
    extra = ""
    if family["clones"]:
        extra = " " + family["clones"][(i * 7) % len(family["clones"])]
    # unique suffix so names never collide
    return f"{pref} {tgt}{extra} #{i:04d}"


def main() -> None:
    data = json.loads(CATALOG.read_text())
    existing = data["products"]
    categories = data["categories"]
    cat_by_slug = {c["slug"]: c for c in categories}

    # Keep originals, assign unique images
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    products = []
    used_names = set()

    def add_product(p: dict) -> None:
        pid = p["id"]
        svg = unique_svg(pid, p["name"], p["categories"][0]["name"] if p["categories"] else "Product")
        rel = f"assets/images/products/{pid}.svg"
        (ROOT / rel).write_text(svg)
        p["image"] = rel
        products.append(p)
        used_names.add(p["name"])

    next_id = max(p["id"] for p in existing) + 1
    for p in existing:
        # ensure categories present
        if not p.get("categories"):
            p["categories"] = [{"id": 88, "name": "Peptides", "slug": "peptides"}]
        add_product(dict(p))

    rng = random.Random(42)
    family_cycle = list(FAMILIES)
    i = 0
    while len(products) < TARGET:
        fam = family_cycle[i % len(family_cycle)]
        i += 1
        name = build_name(fam, i + len(products))
        while name in used_names:
            i += 1
            name = build_name(fam, i + len(products) + rng.randint(1, 50))

        top = cat_by_slug.get(fam["slug"], {"id": 0, "name": fam["name"], "slug": fam["slug"]})
        children = top.get("children") or []
        sub = children[i % len(children)] if children else None
        cats = [{"id": top["id"], "name": top["name"], "slug": top["slug"]}]
        if sub:
            cats.append({"id": sub["id"], "name": sub["name"], "slug": sub["slug"]})

        sku = f"AB-{fam['slug'][:3].upper()}-{next_id}"
        product = {
            "id": next_id,
            "name": name,
            "slug": f"{fam['slug']}-item-{next_id}",
            "sku": sku,
            "short": f"Research-grade {fam['name'].lower()} reagent for laboratories that buy research peptides and related tools. Lot-documented purity with size options.",
            "description": f"{name} is supplied for research use only. Ideal for neurodegenerative and related assay workflows. Pair with matched antibodies, kits, or preformed fibrils from the Apex Bioreagents catalog when you buy research peptides and supporting reagents.",
            "price": price_for(next_id, fam["slug"]),
            "in_stock": (next_id % 9) != 0,
            "categories": cats,
            "permalink": "",
            "sizes": sizes_for(fam["slug"], next_id),
            "type": "variable",
            "image": f"assets/images/products/{next_id}.svg",
        }
        add_product(product)
        next_id += 1

    # update category counts (approximate by product membership)
    counts: dict[str, int] = {}
    for p in products:
        for c in p["categories"]:
            counts[c["slug"]] = counts.get(c["slug"], 0) + 1

    def patch_counts(nodes):
        for n in nodes:
            if n["slug"] in counts:
                n["count"] = counts[n["slug"]]
            if n.get("children"):
                patch_counts(n["children"])

    patch_counts(categories)

    data["products"] = products
    data["categories"] = categories
    CATALOG.write_text(json.dumps(data))
    print(f"Wrote {len(products)} products with unique images in {IMG_DIR}")
    print(f"catalog size MB: {CATALOG.stat().st_size / 1e6:.2f}")


if __name__ == "__main__":
    main()
