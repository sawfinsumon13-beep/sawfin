#!/usr/bin/env python3
"""Patch built site so all links work under /index.html/ on Hostinger."""

import importlib.util
import json
import os
import zipfile
from pathlib import Path

OUT = Path("/workspace/purebred-kitties-clone")
ZIP = Path("/workspace/HOSTINGER-INDEX-HTML-FIX.zip")

spec = importlib.util.spec_from_file_location("build", "/workspace/build-hostinger-site.py")
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

changed = 0
for html_file in OUT.rglob("*.html"):
    raw = html_file.read_text(encoding="utf-8", errors="ignore")
    new = build.apply_subfolder_links(raw)
    new = new.replace("fetch('/products-index.json'", "fetch('/index.html/products-index.json'")
    new = new.replace('fetch("/products-index.json"', 'fetch("/index.html/products-index.json"')
    new = new.replace("window.location.href = '/search.html", "window.location.href = '/index.html/search.html")
    if new != raw:
        html_file.write_text(new, encoding="utf-8")
        changed += 1

# Fix products-index.json URLs
idx_path = OUT / "products-index.json"
if idx_path.exists():
    products = json.loads(idx_path.read_text())
    for p in products:
        url = p.get("url", "")
        if url.startswith("/products/") and not url.startswith("/index.html/"):
            p["url"] = "/index.html" + url
    idx_path.write_text(json.dumps(products, separators=(",", ":")), encoding="utf-8")

build.build_product_index(OUT)

if ZIP.exists():
    ZIP.unlink()
count = 0
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    for root, _, files in os.walk(OUT):
        for name in files:
            full = Path(root) / name
            zf.write(full, str(full.relative_to(OUT)).replace("\\", "/"))
            count += 1

readme = """HOSTINGER FIX — UPLOAD INTO index.html FOLDER
=================================================

Your site lives in: public_html/index.html/
Links were broken because they pointed to /products/ instead of /index.html/products/

STEPS:
1. Hostinger → File Manager → public_html → open the index.html FOLDER
2. Upload HOSTINGER-INDEX-HTML-FIX.zip
3. Extract HERE (inside index.html folder) → overwrite all when asked
4. Test: purebreedkittensforsale.com/index.html/products/male-bengal-kitten-umar.html
5. Click kittens from homepage — all links should work now

NOTE: move-to-root.php was NOT uploaded (404). This fix works without PHP or .htaccess.
"""
(OUT / "UPLOAD-TO-INDEX-HTML-FOLDER.txt").write_text(readme)
print(f"Patched {changed} HTML files")
print(f"Created {ZIP} ({count} files, {ZIP.stat().st_size / 1024 / 1024:.1f} MB)")
