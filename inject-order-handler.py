#!/usr/bin/env python3
"""Inject custom order handler script into all HTML pages."""

from pathlib import Path

ROOT = Path("/workspace/purebredkitties-website")
SCRIPT_TAG = '<script src="/cdn/shop/t/285/assets/custom-order-handler.js" defer></script>'


def main():
    updated = 0
    for path in ROOT.rglob("*.html"):
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if "custom-order-handler.js" in content:
            continue
        if "</body>" not in content:
            continue
        new_content = content.replace("</body>", f"  {SCRIPT_TAG}\n</body>", 1)
        path.write_text(new_content, encoding="utf-8")
        updated += 1
    print(f"Injected order handler into {updated} HTML files")


if __name__ == "__main__":
    main()
