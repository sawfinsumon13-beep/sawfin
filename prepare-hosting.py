#!/usr/bin/env python3
"""Convert mirrored Purebred Kitties site to hosting-ready relative paths."""

import os
import re
from pathlib import Path

ROOT = Path("/workspace/purebredkitties-website")
EXTENSIONS = {".html", ".css", ".js", ".json", ".xml", ".svg", ".webmanifest"}

REPLACEMENTS = [
    ("https://purebredkitties.com/", "/"),
    ("http://purebredkitties.com/", "/"),
    ("//purebredkitties.com/", "/"),
    ("https://cdn.shopify.com/", "/cdn-shopify/"),
    ("http://cdn.shopify.com/", "/cdn-shopify/"),
    ("//cdn.shopify.com/", "/cdn-shopify/"),
]

# Fix wget-encoded query strings in filenames referenced in HTML
WGET_ENCODED = [
    ("%3Fv=", "?v="),
    ("%3F", "?"),
    ("&amp;width=", "&width="),
]


def process_file(path: Path) -> bool:
    try:
        data = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False

    original = data
    for old, new in REPLACEMENTS:
        data = data.replace(old, new)
    for old, new in WGET_ENCODED:
        data = data.replace(old, new)

    if data != original:
        path.write_text(data, encoding="utf-8")
        return True
    return False


def main():
    changed = 0
    total = 0
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in EXTENSIONS and path.suffix not in {"", ".htm"}:
            continue
        total += 1
        if process_file(path):
            changed += 1
    print(f"Processed {total} files, updated {changed}")


if __name__ == "__main__":
    main()
