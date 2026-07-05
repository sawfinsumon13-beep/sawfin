#!/usr/bin/env python3
"""
Build Apache-ready hosting ZIP with:
- Files at ZIP root (not nested in a subfolder)
- Clean asset copies (no ? in filenames)
- .htaccess included
"""

import os
import shutil
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/purebredkitties-website")
STAGING = Path("/workspace/hosting-staging")
OUTPUT_ZIP = Path("/workspace/purebredkitties-hosting-fixed.zip")
ESSENTIAL_ZIP = Path("/workspace/essential-assets.zip")

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

        # Skip wget-style filenames; clean copies are added below
        if "?" in src.name:
            continue

        dst = STAGING / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1

    # Add clean copies from wget-style source files
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


def make_zip(folder: Path, zip_path: Path, prefix: str = ""):
    if zip_path.exists():
        zip_path.unlink()

    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, _, files in os.walk(folder):
            for name in files:
                full = Path(root) / name
                arc = prefix + str(full.relative_to(folder)).replace("\\", "/")
                zf.write(full, arc)
                count += 1
    size_mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"Created {zip_path.name}: {count} files, {size_mb:.1f} MB")
    return count


def make_essential_assets():
    """Small ZIP with theme CSS/JS that Hostinger failed to upload."""
    essential = STAGING / "_essential"
    if essential.exists():
        shutil.rmtree(essential)

    paths = [
        "cdn/shop/t/285/assets",
        "favicon.png",
        "favicon.ico",
    ]

    for rel in paths:
        src = STAGING / rel
        if src.is_dir():
            for f in src.rglob("*"):
                if f.is_file() and "?" not in f.name:
                    dst = essential / f.relative_to(STAGING)
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(f, dst)
        elif src.is_file():
            dst = essential / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)

    make_zip(essential, ESSENTIAL_ZIP)
    shutil.rmtree(essential)


def main():
    stage_site()
    make_zip(STAGING, OUTPUT_ZIP)
    make_essential_assets()
    print("\nDone!")
    print(f"  Full site:    {OUTPUT_ZIP}")
    print(f"  Essential:    {ESSENTIAL_ZIP}  (upload this if site still missing CSS)")


if __name__ == "__main__":
    main()
