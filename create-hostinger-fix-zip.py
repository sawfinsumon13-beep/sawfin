#!/usr/bin/env python3
"""Create a tiny zip with .htaccess fix for Hostinger index.html/ folder issue."""

import zipfile
from pathlib import Path

OUT = Path("/workspace/HOSTINGER-FIX-404-NOW.zip")
HTACCESS = Path("/workspace/purebred-kitties-clone/.htaccess")
README = """HOSTINGER 404 FIX — UPLOAD THIS NOW
=====================================

PROBLEM: Your site files are inside public_html/index.html/ (folder)
         but links go to /products/... which looks at public_html/ (root).

PROOF:  yourdomain.com/index.html/products/male-bengal-kitten-umar.html  → works
        yourdomain.com/products/male-bengal-kitten-umar.html               → 404

FIX (2 minutes):
1. Hostinger → File Manager → public_html  (stay at ROOT, not inside index.html folder)
2. Upload this zip
3. Extract HERE (into public_html root)
4. Overwrite .htaccess when asked → YES
5. Test: yourdomain.com/products/male-bengal-kitten-umar.html

Should work immediately. Hard refresh Ctrl+F5 if needed.

PERMANENT FIX (optional, later):
Move everything FROM public_html/index.html/ UP into public_html/
Then delete the empty index.html/ folder.
"""

if __name__ == "__main__":
    # Refresh .htaccess from build script
    import importlib.util
    spec = importlib.util.spec_from_file_location("build", "/workspace/build-hostinger-site.py")
    build = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(build)
    build.write_htaccess(Path("/workspace/purebred-kitties-clone"))

    htaccess = Path("/workspace/purebred-kitties-clone/.htaccess").read_text()
    if OUT.exists():
        OUT.unlink()
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(".htaccess", htaccess)
        zf.writestr("READ-ME-FIRST.txt", README)
    print(f"Created {OUT} ({OUT.stat().st_size} bytes)")
