#!/usr/bin/env python3
"""
Build ONE complete Apache-ready hosting ZIP.
Extract directly into public_html — no extra fix steps needed.
"""

import os
import shutil
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/purebredkitties-website")
STAGING = Path("/workspace/hosting-staging")
OUTPUT_ZIP = Path("/workspace/purebredkitties-complete-hosting.zip")

SKIP_NAMES = {".git", "__pycache__", "agents.md"}


def clean_target(path: Path) -> Path | None:
    name = path.name
    if "?" not in name:
        return None

    base, query_part = name.split("?", 1)
    for ext in (".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"):
        if base.endswith(ext) and query_part.endswith(ext.lstrip(".")):
            return path.parent / base
    if base.count(".") >= 1:
        return path.parent / base
    return None


def stage_site():
    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir()

    created_clean = 0
    copied = 0

    for src in SOURCE.rglob("*"):
        rel = src.relative_to(SOURCE)
        if any(part in SKIP_NAMES for part in rel.parts):
            continue
        if src.is_dir():
            (STAGING / rel).mkdir(parents=True, exist_ok=True)
            continue

        if "?" in src.name:
            continue

        dst = STAGING / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1

    for src in SOURCE.rglob("*"):
        if not src.is_file() or "?" not in src.name:
            continue
        rel = src.relative_to(SOURCE)
        if any(part in SKIP_NAMES for part in rel.parts):
            continue
        clean = clean_target(src)
        if not clean:
            continue
        clean_dst = STAGING / clean.relative_to(SOURCE)
        if not clean_dst.exists():
            clean_dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, clean_dst)
            created_clean += 1

    print(f"Staged {copied} files, added {created_clean} clean asset copies")
    return copied


def make_zip(folder: Path, zip_path: Path):
    if zip_path.exists():
        zip_path.unlink()

    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, _, files in os.walk(folder):
            for name in files:
                full = Path(root) / name
                arc = str(full.relative_to(folder)).replace("\\", "/")
                zf.write(full, arc)
                count += 1
    size_mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"Created {zip_path.name}: {count} files, {size_mb:.1f} MB")
    return count


def verify_zip(zip_path: Path):
    bad = 0
    has_htaccess = False
    has_index = False
    has_css = False
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if "?" in name:
                bad += 1
            if name == ".htaccess":
                has_htaccess = True
            if name == "index.html":
                has_index = True
            if name == "cdn/shop/t/285/assets/yas_css.css":
                has_css = True
    print(f"Verify: index={has_index} htaccess={has_htaccess} css={has_css} bad_names={bad}")
    if bad or not (has_index and has_htaccess and has_css):
        raise SystemExit("ZIP verification failed!")


def main():
    stage_site()
    make_zip(STAGING, OUTPUT_ZIP)
    verify_zip(OUTPUT_ZIP)
    print(f"\nReady: {OUTPUT_ZIP}")


if __name__ == "__main__":
    main()
