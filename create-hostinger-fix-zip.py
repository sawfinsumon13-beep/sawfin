#!/usr/bin/env python3
"""Create Hostinger 404 fix package: .htaccess + PHP move script + instructions."""

import importlib.util
import zipfile
from pathlib import Path

OUT = Path("/workspace/HOSTINGER-FIX-404-NOW.zip")
PHP = Path("/workspace/hostinger-move-to-root.php")
README = """HOSTINGER 404 FIX — DO THIS NOW
=================================

WHY PAGES 404:
  Your site is inside public_html/index.html/ (folder)
  Links go to /products/... but files are at /index.html/products/...

OPTION A — PHP MOVE (RECOMMENDED, works when .htaccess fails):
  1. Hostinger → File Manager → public_html (ROOT level)
  2. Upload move-to-root.php from this zip to public_html
  3. Open in browser: https://purebreedkittensforsale.com/move-to-root.php
  4. Wait for "Done" message
  5. DELETE move-to-root.php
  6. Test: https://purebreedkittensforsale.com/products/male-bengal-kitten-umar.html

OPTION B — .htaccess (if Option A not possible):
  1. Extract .htaccess from this zip into public_html root
  2. Overwrite when asked
  3. Hostinger hPanel → clear CDN/cache if available
  4. Hard refresh Ctrl+F5

OPTION C — Manual move in File Manager:
  1. Open public_html/index.html/ folder
  2. Select ALL files/folders inside (products, pages, collections, etc.)
  3. Move UP to public_html
  4. Delete empty index.html folder
  5. Test product URL

After fix, homepage: https://purebreedkittensforsale.com/
"""


def main():
    spec = importlib.util.spec_from_file_location("build", "/workspace/build-hostinger-site.py")
    build = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(build)
    build.write_htaccess(Path("/workspace/purebred-kitties-clone"))

    htaccess = Path("/workspace/purebred-kitties-clone/.htaccess").read_text()
    php = PHP.read_text()

    if OUT.exists():
        OUT.unlink()
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(".htaccess", htaccess)
        zf.writestr("move-to-root.php", php)
        zf.writestr("READ-ME-FIRST.txt", README)
    print(f"Created {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
