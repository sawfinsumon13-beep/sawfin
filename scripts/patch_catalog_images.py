#!/usr/bin/env python3
"""Add image paths to existing catalog.json without re-downloading products."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_catalog import CATEGORY_IMAGES, image_for_slug, product_image  # noqa: E402
catalog_path = ROOT / "data" / "catalog.json"


def patch_tree(nodes, parent_image=None):
    for node in nodes:
        img = CATEGORY_IMAGES.get(node["slug"]) or parent_image or image_for_slug(node["slug"])
        node["image"] = img
        if node.get("children"):
            patch_tree(node["children"], img)


def main():
    data = json.loads(catalog_path.read_text())
    for product in data["products"]:
        product["image"] = product_image(product.get("categories", []))
    patch_tree(data["categories"])
    catalog_path.write_text(json.dumps(data, indent=2))
    print("Patched images on", len(data["products"]), "products")


if __name__ == "__main__":
    main()
