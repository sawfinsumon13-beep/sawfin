#!/usr/bin/env python3
"""
Build a Hostinger-ready Purebred Kitties site (~500-800 MB instead of 3.4 GB).

Fixes:
- Strips Shopify bloat scripts from HTML (92% smaller pages)
- No video files (saves 2.4 GB; pages still show kitten photos)
- Clean Apache filenames, .htaccess, contact info, WhatsApp checkout
- Files at ZIP root — extract directly into public_html
"""

import os
import re
import shutil
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging")
if not SOURCE.exists():
    SOURCE = Path("/workspace/purebredkitties-website")

OUTPUT_DIR = Path("/workspace/purebred-kitties-site")
OUTPUT_ZIP = Path("/workspace/purebred-kitties-site.zip")
OUTPUT_ZIP_LITE = Path("/workspace/purebred-kitties-site-lite.zip")

SKIP_DIRS = {"videos"}  # 2.4 GB of kitten videos — photos still work
EXTERNALIZE_PREFIXES = (
    "/cdn/shop/files/",
    "/cdn/shop/articles/",
)
EXTERNAL_CDN = "https://purebredkitties.com"
SKIP_NAMES = {".git", "__pycache__", "agents.md"}

# Scripts that bloat HTML but aren't needed for static display
REMOVE_PATTERNS = [
    r"<script id=\"captcha-bootstrap\">.*?</script>",
    r"<script id=\"shopify-origin-trials\".*?</script>",
    r"<script id=\"scb4127\".*?</script>",
    r"<script>\(function\(\)\{var wpmLoader.*?</script>",
    r"<script[^>]*>window\.Shopify\.featureAssets\s*=.*?</script>",
    r"<script[^>]*>window\.Shopify\.Pay\s*=.*?</script>",
    r"<script[^>]*>window\.Shopify\.Analytics.*?</script>",
    r"<script src=\"/cdn-shopify/extensions/[^\"]*omnisend[^\"]*\".*?</script>",
    r"<script[^>]*integrity=\"[^\"]*\"[^>]*origin_trials[^>]*>.*?</script>",
    r"<script type=\"text/javascript\" async=\"\" src=\"/cdn/shopifycloud/shopify.*?</script>",
]


def clean_target(path: Path) -> Path | None:
    name = path.name
    if "?" not in name:
        return None
    base, query_part = name.split("?", 1)
    for ext in (".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4"):
        if base.endswith(ext) and query_part.endswith(ext.lstrip(".")):
            return path.parent / base
    if base.count(".") >= 1:
        return path.parent / base
    return None


def optimize_html(html: str, externalize: bool = False) -> str:
    for pattern in REMOVE_PATTERNS:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    if externalize:
        for prefix in EXTERNALIZE_PREFIXES:
            html = html.replace(f'"{prefix}', f'"{EXTERNAL_CDN}{prefix}')
            html = html.replace(f"('{prefix}", f"('{EXTERNAL_CDN}{prefix}")
            html = html.replace(f"({prefix}", f"({EXTERNAL_CDN}{prefix}")
            html = html.replace(f"url({prefix}", f"url({EXTERNAL_CDN}{prefix}")
    html = re.sub(r">\s+<", "><", html)
    return html


def should_skip_path(rel: Path, lite: bool = False) -> bool:
    if any(part in SKIP_NAMES for part in rel.parts):
        return True
    if any(part in SKIP_DIRS for part in rel.parts):
        return True
    if lite:
        rel_str = str(rel).replace("\\", "/")
        if rel_str.startswith("cdn/shop/files/"):
            return True
        if rel_str.startswith("cdn/shop/articles/"):
            return True
    return False


def stage_site(lite: bool = False):
    out = OUTPUT_DIR if not lite else Path("/workspace/purebred-kitties-site-lite")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()

    html_count = 0
    html_saved = 0
    copied = 0

    # Pass 1: copy non-? files (skip videos folder)
    for src in SOURCE.rglob("*"):
        rel = src.relative_to(SOURCE)
        if should_skip_path(rel, lite=lite):
            continue
        if src.is_dir():
            (out / rel).mkdir(parents=True, exist_ok=True)
            continue
        if "?" in src.name:
            continue

        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)

        if src.suffix.lower() == ".html":
            raw = src.read_text(encoding="utf-8", errors="ignore")
            opt = optimize_html(raw, externalize=lite)
            dst.write_text(opt, encoding="utf-8")
            html_count += 1
            html_saved += len(raw) - len(opt)
        else:
            shutil.copy2(src, dst)
        copied += 1

    # Pass 2: clean copies from wget-style names
    created_clean = 0
    for src in SOURCE.rglob("*"):
        if not src.is_file() or "?" not in src.name:
            continue
        rel = src.relative_to(SOURCE)
        if should_skip_path(rel, lite=lite):
            continue
        clean = clean_target(src)
        if not clean:
            continue
        clean_dst = out / clean.relative_to(SOURCE)
        if not clean_dst.exists():
            clean_dst.parent.mkdir(parents=True, exist_ok=True)
            if clean.suffix.lower() == ".html":
                raw = src.read_text(encoding="utf-8", errors="ignore")
                clean_dst.write_text(optimize_html(raw, externalize=lite), encoding="utf-8")
            else:
                shutil.copy2(src, clean_dst)
            created_clean += 1

    label = "LITE" if lite else "FULL"
    print(f"[{label}] Copied/optimized {html_count} HTML files, saved {html_saved/1e6:.1f} MB of bloat")
    print(f"[{label}] Other files: {copied - html_count}, clean assets added: {created_clean}")
    return out


def write_readme(out: Path, lite: bool = False):
    if lite:
        readme = """PUREBRED KITTIES — EASY UPLOAD VERSION (~150 MB)
================================================

Best for Hostinger web upload (under size limits).

1. Hostinger → File Manager → public_html
2. Delete old files
3. Upload this ZIP → Extract here
4. Visit your domain

Photos load from the original CDN (site looks identical).
All pages included. Contact: kittenspurebreed@gmail.com
WhatsApp: +1 343-809-2153
"""
    else:
        readme = """PUREBRED KITTIES — FULL OFFLINE VERSION (~935 MB)
======================================================

All photos stored locally. Use FTP if web upload fails.

1. Hostinger → File Manager → public_html
2. Delete old files
3. Upload this ZIP → Extract here
4. Visit your domain

Contact: kittenspurebreed@gmail.com | WhatsApp: +1 343-809-2153
"""
    (out / "README.txt").write_text(readme)


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
    mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"ZIP: {zip_path.name} — {count} files, {mb:.1f} MB")
    return mb


def verify(zip_path: Path):
    with zipfile.ZipFile(zip_path) as zf:
        names = zf.namelist()
        assert "index.html" in names
        assert ".htaccess" in names
        bad = [n for n in names if "?" in n]
        videos = [n for n in names if "/videos/" in n]
        print(f"Verify {zip_path.name}: {len(names)} files, bad={len(bad)}, videos={len(videos)}")


def main():
    full_dir = stage_site(lite=False)
    write_readme(full_dir, lite=False)
    make_zip(full_dir, OUTPUT_ZIP)
    verify(OUTPUT_ZIP)

    lite_dir = stage_site(lite=True)
    write_readme(lite_dir, lite=True)
    make_zip(lite_dir, OUTPUT_ZIP_LITE)
    verify(OUTPUT_ZIP_LITE)

    print(f"\nFULL (all photos local): {OUTPUT_ZIP}")
    print(f"LITE (easy upload):       {OUTPUT_ZIP_LITE}")


if __name__ == "__main__":
    main()
