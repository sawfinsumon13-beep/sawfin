#!/usr/bin/env python3
"""Replace favicon <link> blocks with inline BMW favicon (data URIs)."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

_spec = importlib.util.spec_from_file_location(
    "generate_favicon", ROOT / "scripts" / "generate-favicon.py"
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
build_favicon_links = _mod.build_favicon_links

FAVICON_BLOCK = re.compile(
    r"  <link rel=\"(?:icon|apple-touch-icon)\"[^>]*>\n?"
    r"(?:  <link rel=\"(?:icon|apple-touch-icon)\"[^>]*>\n?)*",
    re.MULTILINE,
)

SKIP = {"bavarian-engines-all-in-one.html"}


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    links = build_favicon_links()
    if links.strip() in text:
        return False
    new_text, n = FAVICON_BLOCK.subn(links + "\n", text, count=1)
    if n == 0 and "favicon.ico" not in text:
        new_text, n = re.subn(
            r"(  <title>[^<]*</title>)",
            r"\1\n" + links,
            text,
            count=1,
        )
    if n and new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = []
    for html in sorted(ROOT.glob("*.html")):
        if html.name in SKIP:
            continue
        if patch_file(html):
            updated.append(html.name)
    print(f"Patched {len(updated)} HTML files with inline BMW favicon")


if __name__ == "__main__":
    main()
