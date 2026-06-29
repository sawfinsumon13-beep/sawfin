#!/usr/bin/env python3
"""Ensure all HTML files use the canonical WhatsApp number."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
PHONE_DISPLAY = "+49 15510 030835"
WA_NUMBER = "4915510030835"
WA_URL = f"https://wa.me/{WA_NUMBER}"

# Legacy numbers to replace if any remain
OLD_PATTERNS = [
    ("447944470816", WA_NUMBER),
    ("+447944470816", PHONE_DISPLAY),
    ("7944470816", WA_NUMBER),
]


def sync_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in OLD_PATTERNS:
        text = text.replace(old, new)
    text = re.sub(r"https://wa\.me/\d+", WA_URL, text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = []
    skip = {"bavarian-engines-all-in-one.html"}
    for html in sorted(ROOT.glob("*.html")):
        if html.name in skip:
            continue
        if sync_file(html):
            updated.append(html.name)
    print(f"WhatsApp URL: {WA_URL}")
    print(f"Updated {len(updated)} files" + (f": {', '.join(updated[:5])}..." if updated else " (all already correct)"))


if __name__ == "__main__":
    main()
