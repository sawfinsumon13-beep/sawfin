#!/usr/bin/env python3
"""Apply full premium BMW dealer theme to Bavarian Engines main site."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PREMIUM = Path(__file__).parent / "style-premium.css"
if not PREMIUM.exists():
    PREMIUM = ROOT / "css" / "style-premium.css"
OVERRIDES = Path(__file__).parent / "premium-overrides.css"
STYLE = ROOT / "css" / "style.css"


def main() -> None:
    css = PREMIUM.read_text(encoding="utf-8")
    if OVERRIDES.exists():
        css += "\n" + OVERRIDES.read_text(encoding="utf-8")
    STYLE.write_text(css, encoding="utf-8")
    print(f"Wrote {STYLE} ({len(css.splitlines())} lines)")


if __name__ == "__main__":
    main()
