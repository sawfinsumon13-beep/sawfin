#!/usr/bin/env python3
"""Download real BMW engine photos from bavarianengine.com and build image sets."""

import json
import os
import re
import hashlib
import urllib.request
from pathlib import Path

BASE = Path("/workspace")
SETS_DIR = BASE / "images/engines/sets"
MANIFEST = BASE / "images/engines/image-sets.json"
API = "https://bavarianengine.com/wp-json/wc/store/v1/products"


def fetch_all_products():
    products = []
    page = 1
    while True:
        url = f"{API}?per_page=100&page={page}"
        with urllib.request.urlopen(url, timeout=30) as r:
            batch = json.loads(r.read())
        if not batch:
            break
        products.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return products


def safe_name(url):
    name = url.split("/")[-1].split("?")[0]
    name = name.encode("ascii", "ignore").decode("ascii") or hashlib.md5(url.encode()).hexdigest()[:12]
    return re.sub(r"[^\w.\-]", "_", name)


def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            dest.write_bytes(r.read())
    except Exception as e:
        print(f"  skip {url}: {e}")


def main():
    print("Fetching products from bavarianengine.com...")
    products = fetch_all_products()
    print(f"Found {len(products)} products")

    sets = []
    for idx, p in enumerate(products, 1):
        images = p.get("images", [])
        if not images:
            continue
        set_id = f"set-{idx:04d}"
        set_dir = SETS_DIR / set_id
        paths = []
        for j, img in enumerate(images[:6]):
            url = img["src"]
            fname = safe_name(url)
            if j == 0:
                local = set_dir / f"main-{fname}"
            else:
                local = set_dir / f"thumb{j}-{fname}"
            download(url, local)
            rel = str(local.relative_to(BASE)).replace("\\", "/")
            paths.append(rel)

        if paths:
            sets.append({
                "id": set_id,
                "source": p.get("name", ""),
                "main": paths[0],
                "thumbnails": paths[1:6] if len(paths) > 1 else paths[:5],
                "all": paths[:6],
            })
            print(f"  {set_id}: {len(paths)} images — {p.get('name','')[:50]}")

    # Pad thumbnails to 5 if needed using main or duplicates from set
    for s in sets:
        while len(s["thumbnails"]) < 5:
            s["thumbnails"].append(s["thumbnails"][-1] if s["thumbnails"] else s["main"])
        s["thumbnails"] = s["thumbnails"][:5]

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(sets, indent=2))
    print(f"\nSaved {len(sets)} image sets to {MANIFEST}")


if __name__ == "__main__":
    main()
