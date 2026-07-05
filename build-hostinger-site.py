#!/usr/bin/env python3
"""
Build Hostinger-ready Purebred Kitties site — fixed product lists + cart/checkout.
"""

import os
import re
import shutil
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging")
OUTPUT_DIR = Path("/workspace/purebred-kitties-site")
OUTPUT_ZIP = Path("/workspace/purebred-kitties-site.zip")
OUTPUT_ZIP_LITE = Path("/workspace/purebred-kitties-site-lite.zip")

SKIP_DIRS = {"videos"}
EXTERNAL_CDN = "https://purebredkitties.com"
SKIP_NAMES = {".git", "__pycache__", "agents.md"}
STATIC_CART_SRC = Path("/workspace/static-cart.js")
CART_DEST = "cdn/shop/t/285/assets/static-cart.js"
CART_TAG = '<script src="/cdn/shop/t/285/assets/static-cart.js"></script>'

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

FOLDER_COLLECTIONS = {"kittens-for-sale", "bengal-cats-for-sale", "abyssinian-kitties-for-sale"}


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


def collection_info(rel: Path) -> tuple[str, bool] | None:
    parts = rel.parts
    if parts[0] != "collections":
        return None
    if len(parts) == 2 and parts[1].endswith(".html"):
        slug = parts[1][:-5]
        if slug.endswith("-page-"):
            return None
        m = re.match(r"^(.+)-page-(\d+)$", slug)
        if m:
            return m.group(1), m.group(1) in FOLDER_COLLECTIONS
        return slug, slug in FOLDER_COLLECTIONS
    if len(parts) == 3 and parts[2] in ("index.html",) or parts[2].startswith("page-"):
        return parts[1], True
    return None


def fix_pagination_links(html: str, slug: str, is_folder: bool) -> str:
    def replacer(match):
        page = match.group(1)
        if page == "1":
            return f'href="/collections/{slug}/"' if is_folder else f'href="/collections/{slug}.html"'
        if is_folder:
            return f'href="/collections/{slug}/page-{page}.html"'
        return f'href="/collections/{slug}-page-{page}.html"'

    html = re.sub(
        r'href="/collections/' + re.escape(slug) + r'\?page=(\d+)(?:&amp;[^"]*|&[^"]*)?"',
        replacer,
        html,
    )
    return html


def fix_asset_paths(html: str, externalize: bool) -> str:
    html = html.replace("../cdn/", "/cdn/")
    html = html.replace('srcset="../', 'srcset="/')
    html = re.sub(r'href="\.\./pages/', 'href="/pages/', html)
    html = re.sub(r'href="([a-z0-9-]+)\.html#', r'href="/products/\1#', html)

    if externalize:
        for pattern in (
            r'"/cdn/shop/files/',
            r"'/cdn/shop/files/",
            r"\(/cdn/shop/files/",
            r"url\(/cdn/shop/files/",
            r'url\("/cdn/shop/files/',
            r"url\('/cdn/shop/files/",
        ):
            html = html.replace(pattern, pattern.replace("/cdn/shop/files/", EXTERNAL_CDN + "/cdn/shop/files/"))
        html = html.replace('"/cdn/shop/articles/', f'"{EXTERNAL_CDN}/cdn/shop/articles/')
    return html


def inject_static_cart(html: str) -> str:
    if "static-cart.js" in html:
        return html
    if "<head" in html and CART_TAG not in html:
        return html.replace("<head>", "<head>" + CART_TAG, 1)
    return html.replace("</body>", CART_TAG + "</body>", 1)


def optimize_html(html: str, externalize: bool = False, rel: Path | None = None) -> str:
    for pattern in REMOVE_PATTERNS:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = fix_asset_paths(html, externalize)
    if rel:
        info = collection_info(rel)
        if info:
            html = fix_pagination_links(html, info[0], info[1])
    html = inject_static_cart(html)
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
            opt = optimize_html(raw, externalize=lite, rel=rel)
            dst.write_text(opt, encoding="utf-8")
            html_count += 1
            html_saved += len(raw) - len(opt)
        else:
            shutil.copy2(src, dst)
        copied += 1

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
                clean_dst.write_text(optimize_html(raw, externalize=lite, rel=clean.relative_to(SOURCE)), encoding="utf-8")
            else:
                shutil.copy2(src, clean_dst)
            created_clean = 1

    cart_dst = out / CART_DEST
    cart_dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(STATIC_CART_SRC, cart_dst)

    label = "LITE" if lite else "FULL"
    print(f"[{label}] HTML files: {html_count}, saved {html_saved/1e6:.1f} MB bloat")
    return out


def write_htaccess(out: Path):
    htaccess = SOURCE / ".htaccess"
    extra = """
  # Collection pagination fallback (?page=N)
  RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]*)
  RewriteCond %{DOCUMENT_ROOT}/collections/$1-page-%1.html -f
  RewriteRule ^collections/([^/]+)/?$ collections/$1-page-%1.html [L]

  RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]*)
  RewriteCond %{DOCUMENT_ROOT}/collections/$1/page-%1.html -f
  RewriteRule ^collections/([^/]+)/?$ collections/$1/page-%1.html [L]
"""
    if htaccess.exists():
        content = htaccess.read_text()
        if "Collection pagination fallback" not in content:
            content = content.replace("</IfModule>", extra + "</IfModule>", 1)
        (out / ".htaccess").write_text(content)
    else:
        (out / ".htaccess").write_text("DirectoryIndex index.html\n")


def write_readme(out: Path, lite: bool):
    text = """PUREBRED KITTIES — READY TO UPLOAD
===================================
1. Hostinger → File Manager → public_html
2. Delete old files
3. Upload ZIP → Extract here
4. Visit your domain

Fixed: full product lists (all pages), cart + WhatsApp checkout.
Contact: kittenspurebreed@gmail.com | WhatsApp: +1 343-809-2153
"""
    if lite:
        text += "\nPhotos load from CDN (smaller upload size).\n"
    (out / "README.txt").write_text(text)


def make_zip(folder: Path, zip_path: Path):
    if zip_path.exists():
        zip_path.unlink()
    count = 0
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, _, files in os.walk(folder):
            for name in files:
                full = Path(root) / name
                zf.write(full, str(full.relative_to(folder)).replace("\\", "/"))
                count += 1
    mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"ZIP: {zip_path.name} — {count} files, {mb:.1f} MB")


def main():
    lite_dir = stage_site(lite=True)
    write_htaccess(lite_dir)
    write_readme(lite_dir, lite=True)
    make_zip(lite_dir, OUTPUT_ZIP_LITE)
    print(f"\nReady: {OUTPUT_ZIP_LITE}")


if __name__ == "__main__":
    main()
