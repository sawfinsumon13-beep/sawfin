#!/usr/bin/env python3
"""
Build Hostinger-ready Purebred Kitties site — fixed product lists + cart/checkout.
"""

import json
import os
import re
import shutil
import urllib.request
import zipfile
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging")
OUTPUT_DIR = Path("/workspace/purebred-kitties-site")
OUTPUT_ZIP = Path("/workspace/purebred-kitties-site.zip")
OUTPUT_ZIP_LITE = Path("/workspace/purebred-kitties-site-lite.zip")

SKIP_DIRS = {"videos"}
EXTERNAL_CDN = "https://purebredkitties.com"
FAVICON_URL = EXTERNAL_CDN + "/cdn/shop/files/purebred_kitties_fav_icon_af099f12-929b-46f9-9f52-ab8077b3bd03_32x32.png?v=1707586342"
FAVICON_TAGS = (
    f'<link rel="icon" href="{FAVICON_URL}" type="image/png" sizes="32x32">'
    f'<link rel="shortcut icon" href="{FAVICON_URL}" type="image/png">'
    f'<link rel="apple-touch-icon" href="{FAVICON_URL}">'
)
SKIP_NAMES = {".git", "__pycache__", "agents.md"}
STATIC_CART_SRC = Path("/workspace/static-cart.js")
STATIC_SEARCH_SRC = Path("/workspace/static-search.js")
CART_DEST = "cdn/shop/t/285/assets/static-cart.js"
SEARCH_DEST = "cdn/shop/t/285/assets/static-search.js"
CART_TAG = '<script src="/cdn/shop/t/285/assets/static-cart.js"></script>'
SEARCH_TAG = '<script src="/cdn/shop/t/285/assets/static-search.js"></script>'

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
    r'<script src="/cdn/shop/t/285/assets/custom-order-handler\.js"[^>]*></script>',
]

FOLDER_COLLECTIONS = {"kittens-for-sale", "bengal-cats-for-sale", "abyssinian-kitties-for-sale"}

REMOTE_ASSETS = [
    "cdn/shop/t/285/assets/yas-cart.css",
    "cdn/shop/t/285/assets/custom.css",
    "cdn/shop/t/285/assets/custom1.css",
    "cdn/shop/t/285/assets/cart.js",
]
REMOTE_PAGES = [
    "pages/for-breeders.html",
    "search.html",
]


def ensure_remote_files():
    """Download theme assets / pages missing from staging."""
    for rel in REMOTE_ASSETS + REMOTE_PAGES:
        dest = SOURCE / rel
        if dest.exists() and dest.stat().st_size > 1000:
            continue
        url = f"{EXTERNAL_CDN}/{rel.replace('.html', '')}" if rel.endswith(".html") and rel.startswith("pages/") else f"{EXTERNAL_CDN}/{rel}"
        if rel == "search.html":
            url = f"{EXTERNAL_CDN}/search"
        if rel == "pages/for-breeders.html":
            url = f"{EXTERNAL_CDN}/pages/for-breeders"
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            print(f"Downloading {url}")
            with urllib.request.urlopen(url, timeout=60) as resp:
                dest.write_bytes(resp.read())
        except Exception as exc:
            print(f"Warning: could not download {url}: {exc}")


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
    if len(parts) == 3 and (parts[2] == "index.html" or parts[2].startswith("page-")):
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


def fix_favicon(html: str) -> str:
    """Use CDN favicon so it works even if local files are misplaced on Hostinger."""
    html = re.sub(r'<link rel="(?:shortcut )?icon"[^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link rel="apple-touch-icon"[^>]*>', '', html, flags=re.IGNORECASE)
    if FAVICON_URL not in html and "<head" in html:
        html = html.replace("<head>", "<head>" + FAVICON_TAGS, 1)
    return html


def fix_static_links(html: str) -> str:
    html = html.replace("https://purebredkitties.com/pages/partnerships", "/pages/partnerships")
    html = html.replace("https://purebredkitties.com/pages/partnerships.html", "/pages/partnerships")
    html = re.sub(r'href="/account"', 'href="/pages/contact"', html)
    html = re.sub(r'action="/contact[^"]*"', 'action="/pages/contact"', html)
    html = re.sub(r'action="/search"', 'action="/search.html"', html)
    return html


def simplify_asset_urls(text: str) -> str:
    """Remove ?v= cache-bust params so CSS/JS load without Apache rewrite rules."""
    text = re.sub(
        r'((?:href|src)=["\']/(?:cdn/shop|cdn/shopifycloud)[^"\']+?\.(?:css|js))(\?[^"\']*)"',
        r'\1"',
        text,
    )
    text = re.sub(
        r'((?:href|src)=["\']/(?:cdn/shop|cdn/shopifycloud)[^"\']+?\.(?:css|js))(\?[^"\']*)(["\'])',
        r"\1\3",
        text,
    )
    return text


def fix_css_loading(text: str) -> str:
    """Ensure stylesheets load without JavaScript (Hostinger-safe)."""
    text = re.sub(
        r'(<link[^>]+href="[^"]+\.css[^"]*"[^>]*)\smedia="print"\s+onload="this\.media=\'all\'"',
        r'\1 media="all"',
        text,
        flags=re.IGNORECASE,
    )
    return text


def externalize_theme_assets(text: str) -> str:
    """Load theme CSS/JS from live CDN — works even when Hostinger upload is in wrong folder."""
    text = text.replace('"/cdn/shop/t/285/assets/', f'"{EXTERNAL_CDN}/cdn/shop/t/285/assets/')
    text = text.replace("'/cdn/shop/t/285/assets/", f"'{EXTERNAL_CDN}/cdn/shop/t/285/assets/")
    text = text.replace('"/cdn/shopifycloud/', f'"{EXTERNAL_CDN}/cdn/shopifycloud/')
    text = text.replace("'/cdn/shopifycloud/", f"'{EXTERNAL_CDN}/cdn/shopifycloud/")
    return text


def inline_local_scripts(html: str, out_dir: Path) -> str:
    """Remove external refs to our custom scripts (now inlined in head)."""
    for rel in (CART_DEST, SEARCH_DEST):
        html = re.sub(rf'<script src="/{re.escape(rel)}[^"]*"></script>', '', html)
    return html


def externalize_cdn_urls(text: str) -> str:
    """Point /cdn/shop/files/ references to the live CDN (lite build)."""
    replacements = [
        ('"/cdn/shop/files/', f'"{EXTERNAL_CDN}/cdn/shop/files/'),
        ("'/cdn/shop/files/", f"'{EXTERNAL_CDN}/cdn/shop/files/"),
        ("(/cdn/shop/files/", f"({EXTERNAL_CDN}/cdn/shop/files/"),
        ("url(/cdn/shop/files/", f"url({EXTERNAL_CDN}/cdn/shop/files/"),
        ('url("/cdn/shop/files/', f'url("{EXTERNAL_CDN}/cdn/shop/files/'),
        ("url('/cdn/shop/files/", f"url('{EXTERNAL_CDN}/cdn/shop/files/"),
        ('"/cdn/shop/articles/', f'"{EXTERNAL_CDN}/cdn/shop/articles/'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def fix_asset_paths(html: str, externalize: bool) -> str:
    html = html.replace("../cdn/", "/cdn/")
    html = html.replace('srcset="../', 'srcset="/')
    html = re.sub(r'href="\.\./pages/', 'href="/pages/', html)
    html = re.sub(r'href="([a-z0-9-]+)\.html#', r'href="/products/\1#', html)
    if externalize:
        html = externalize_cdn_urls(html)
        html = externalize_theme_assets(html)
    return html


def inject_static_scripts(html: str) -> str:
    inject = ""
    if "pk_static_cart_v1" not in html and STATIC_CART_SRC.exists():
        inject += f"<script>{STATIC_CART_SRC.read_text(encoding='utf-8')}</script>"
    if "loadIndex" not in html and STATIC_SEARCH_SRC.exists():
        inject += f"<script>{STATIC_SEARCH_SRC.read_text(encoding='utf-8')}</script>"
    if not inject:
        return html
    if "<head" in html:
        return html.replace("<head>", "<head>" + inject, 1)
    return html.replace("</body>", inject + "</body>", 1)


def optimize_html(html: str, externalize: bool = False, rel: Path | None = None) -> str:
    for pattern in REMOVE_PATTERNS:
        html = re.sub(pattern, "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = fix_asset_paths(html, externalize)
    html = fix_static_links(html)
    html = fix_favicon(html)
    html = simplify_asset_urls(html)
    html = fix_css_loading(html)
    if rel:
        info = collection_info(rel)
        if info:
            html = fix_pagination_links(html, info[0], info[1])
    html = inject_static_scripts(html)
    html = inline_local_scripts(html, Path("."))
    html = re.sub(r">\s+<", "><", html)
    return html


def should_skip_path(rel: Path, lite: bool = False) -> bool:
    if any(part in SKIP_NAMES for part in rel.parts):
        return True
    if any(part in SKIP_DIRS for part in rel.parts):
        return True

    # Flat collection HTML shadows paginated folder index on Apache
    parts = rel.parts
    if len(parts) == 2 and parts[0] == "collections" and parts[1].endswith(".html"):
        slug = parts[1][:-5]
        if slug in FOLDER_COLLECTIONS:
            folder_index = SOURCE / "collections" / slug / "index.html"
            if folder_index.exists():
                return True

    if lite:
        rel_str = str(rel).replace("\\", "/")
        if rel_str.startswith("cdn/shop/files/"):
            return True
        if rel_str.startswith("cdn/shop/articles/"):
            return True
    return False


def build_product_index(out: Path) -> int:
    products = []
    products_dir = out / "products"
    if not products_dir.exists():
        return 0

    title_re = re.compile(r"<title>([^<|]+)", re.IGNORECASE)
    img_re = re.compile(r'"(?:https://purebredkitties\.com)?/cdn/shop/files/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*"', re.IGNORECASE)

    for html_file in sorted(products_dir.glob("*.html")):
        try:
            text = html_file.read_text(encoding="utf-8", errors="ignore")[:8000]
        except OSError:
            continue
        handle = html_file.stem
        m = title_re.search(text)
        title = m.group(1).strip() if m else handle.replace("-", " ").title()
        img_m = img_re.search(text)
        image = ""
        if img_m:
            image = img_m.group(0).strip('"').replace(EXTERNAL_CDN, "")
        products.append({
            "handle": handle,
            "title": title,
            "url": f"/products/{handle}",
            "image": image,
        })

    (out / "products-index.json").write_text(json.dumps(products, separators=(",", ":")), encoding="utf-8")
    return len(products)


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
        elif lite and src.suffix.lower() == ".css":
            raw = src.read_text(encoding="utf-8", errors="ignore")
            dst.write_text(externalize_cdn_urls(externalize_theme_assets(raw)), encoding="utf-8")
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

    cart_dst = out / CART_DEST
    cart_dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(STATIC_CART_SRC, cart_dst)
    shutil.copy2(STATIC_SEARCH_SRC, out / SEARCH_DEST)

    product_count = build_product_index(out)

    label = "LITE" if lite else "FULL"
    print(f"[{label}] HTML files: {html_count}, products indexed: {product_count}, saved {html_saved/1e6:.1f} MB bloat")
    return out


def write_htaccess(out: Path):
    content = """# Purebred Kitties - Apache / Hostinger Configuration
# MUST be in public_html root (same folder as index.html file)

DirectoryIndex index.html

Options -Indexes

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirect index.html/ folder URL to site root
  RewriteRule ^index\\.html/?$ / [R=301,L]
  RewriteRule ^index\\.html/(.*)$ /$1 [R=301,L]

  # Fallback: files wrongly extracted inside index.html/ subfolder
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{DOCUMENT_ROOT}/index.html/$1 -f
  RewriteRule ^(.+)$ index.html/$1 [L]

  # Collection pagination fallback (?page=N)
  RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]+)
  RewriteRule ^collections/([^/]+)/?$ collections/$1/page-%1.html [L]

  RewriteCond %{QUERY_STRING} (?:^|&)page=([2-9][0-9]+)
  RewriteRule ^collections/([^/]+)/?$ collections/$1-page-%1.html [L]

  # Prefer paginated collection folders over flat .html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{DOCUMENT_ROOT}/collections/$1/index.html -f
  RewriteRule ^collections/([^/]+)/?$ collections/$1/index.html [L]

  # Search URL
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^search/?$ search.html [L,QSA]

  # HTML pages without .html extension
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]
</IfModule>

# Correct MIME types
AddType text/css .css
AddType application/javascript .js
AddType image/svg+xml .svg
AddType image/webp .webp
"""
    (out / ".htaccess").write_text(content)


def write_verify_page(out: Path):
    html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Site Health Check</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;padding:0 20px}
.ok{color:#0a0}.bad{color:#c00;font-weight:bold}code{background:#f4f4f4;padding:2px 6px}</style>
</head><body>
<h1>Purebred Kitties — Upload Check</h1>
<p id="status">Testing...</p>
<ul id="results"></ul>
<h2>If CSS test fails</h2>
<ol>
<li>Open Hostinger File Manager → <code>public_html</code></li>
<li>If you see a folder named <code>index.html</code>, open it</li>
<li>Select ALL files inside → Move UP to <code>public_html</code></li>
<li>Delete the empty <code>index.html</code> folder</li>
<li>Confirm <code>public_html/index.html</code> is a FILE (not a folder)</li>
<li>Confirm <code>public_html/cdn/</code> folder exists</li>
</ol>
<script>
(function(){
  var results=document.getElementById('results');
  var status=document.getElementById('status');
  function add(ok,msg){var li=document.createElement('li');li.className=ok?'ok':'bad';li.textContent=(ok?'PASS: ':'FAIL: ')+msg;results.appendChild(li);return ok;}
  var tests=[
    ['/cdn/shop/t/285/assets/yas_css.css','Main CSS at site root'],
    ['/index.html','Homepage index.html is a file at root'],
  ];
  var passed=0;
  Promise.all(tests.map(function(t){
    return fetch(t[0],{method:'HEAD'}).then(function(r){
      if(add(r.ok,t[1]+' ('+t[0]+')')) passed++;
    }).catch(function(){add(false,t[1]+' ('+t[0]+')');});
  })).then(function(){
    status.textContent=passed===tests.length?'All checks passed — site is uploaded correctly!':'Some checks failed — follow the fix steps below.';
    status.className=passed===tests.length?'ok':'bad';
  });
})();
</script>
</body></html>"""
    (out / "verify.html").write_text(html)


def write_readme(out: Path, lite: bool):
    text = """PUREBRED KITTIES — HOSTINGER UPLOAD (READ THIS FIRST)
======================================================

IMPORTANT: Files must go directly in public_html, NOT inside a subfolder.

STEP BY STEP:
1. Hostinger → File Manager → public_html
2. DELETE everything old (select all → delete)
3. Upload purebred-kitties-site-lite.zip
4. Click ZIP → Extract → Extract files HERE (into public_html)
5. CHECK these exist in public_html (not in a subfolder):
   - index.html   (must be a FILE, not a folder)
   - .htaccess
   - cdn/         (folder)
   - collections/ (folder)
6. Open yourdomain.com/verify.html to confirm upload is correct

COMMON MISTAKE (causes unstyled plain HTML page):
  WRONG: public_html/index.html/index.html  ← folder named index.html
  RIGHT: public_html/index.html             ← file at root

Contact: kittenspurebreed@gmail.com | WhatsApp: +1 343-809-2153
"""
    if lite:
        text += "\nPhotos load from purebredkitties.com CDN (keeps ZIP smaller).\n"
    (out / "README.txt").write_text(text)
    (out / "UPLOAD-FIRST.txt").write_text(text)


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
    ensure_remote_files()
    lite_dir = stage_site(lite=True)
    write_htaccess(lite_dir)
    write_verify_page(lite_dir)
    write_readme(lite_dir, lite=True)
    make_zip(lite_dir, OUTPUT_ZIP_LITE)
    print(f"\nReady: {OUTPUT_ZIP_LITE}")


if __name__ == "__main__":
    main()
