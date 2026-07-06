#!/usr/bin/env python3
"""
Create clean Apache-compatible copies of wget-style asset files.
Original wget files keep ? in filename; Apache looks up paths WITHOUT query string.
"""

import os
import shutil
from pathlib import Path

ROOT = Path("/workspace/purebredkitties-website")


def clean_target(path: Path) -> Path | None:
    name = path.name
    if "?" not in name:
        return None

    base, query_part = name.split("?", 1)

    # wget double extension: file.css?v=HASH.css -> file.css
    for ext in (".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"):
        if base.endswith(ext) and query_part.endswith(ext.lstrip(".")):
            return path.parent / base

    # wget images: file.svg?v=HASH&width=240 -> file.svg
    if base.count(".") >= 1:
        return path.parent / base

    return None


def main():
    created = 0
    skipped = 0
    for src in ROOT.rglob("*"):
        if not src.is_file():
            continue
        dst = clean_target(src)
        if not dst:
            continue
        if dst.exists():
            skipped += 1
            continue
        try:
            os.link(src, dst)
            created += 1
        except OSError:
            shutil.copy2(src, dst)
            created += 1

    print(f"Created {created} clean asset copies, skipped {skipped} existing")


if __name__ == "__main__":
    main()
