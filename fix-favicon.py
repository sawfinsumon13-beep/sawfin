#!/usr/bin/env python3
"""Fix favicon links across all HTML pages."""

import re
from pathlib import Path

ROOT = Path("/workspace/purebredkitties-website")
OLD_FAVICON = re.compile(
    r'<link rel="shortcut icon" href="[^"]*" type="image/png">'
)
NEW_FAVICON = (
    '<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">\n'
    '    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">\n'
    '    <link rel="apple-touch-icon" href="/favicon.png">'
)


def process_file(path: Path) -> bool:
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False

    if "/favicon.png" in content:
        return False

    new_content, count = OLD_FAVICON.subn(NEW_FAVICON, content, count=1)
    if count:
        path.write_text(new_content, encoding="utf-8")
        return True
    return False


def main():
    updated = sum(1 for path in ROOT.rglob("*.html") if process_file(path))
    print(f"Updated favicon in {updated} HTML files")


if __name__ == "__main__":
    main()
