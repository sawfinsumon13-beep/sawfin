#!/usr/bin/env python3
"""Generate premium BMW dealer theme from the terminal base stylesheet."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "css" / "style.css"
OUT = ROOT / "css" / "style-premium.css"

REPLACEMENTS = [
    ('/* Bavarian Engines — Hacking / terminal theme */',
     '/* Bavarian Engines — Premium BMW dealer theme */'),
    ("@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');",
     "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&family=Inter:wght@400;500;600;700&display=swap');"),
    ("--color-bg: #020402;", "--color-bg: #0a0f18;"),
    ("--color-bg-elevated: #050a05;", "--color-bg-elevated: #111827;"),
    ("--color-bg-card: #071207;", "--color-bg-card: #151d2e;"),
    ("--color-bg-card-hover: #0c1a0c;", "--color-bg-card-hover: #1c2740;"),
    ("--color-border: #0d3d0d;", "--color-border: #243552;"),
    ("--color-border-bright: #1a5c1a;", "--color-border-bright: #3d5f8a;"),
    ("--color-text: #c8ffc8;", "--color-text: #eef2f8;"),
    ("--color-text-muted: #5a8a5a;", "--color-text-muted: #8fa3bf;"),
    ("--color-accent: #00ff41;", "--color-accent: #1c69d4;"),
    ("--color-accent-hover: #66ff88;", "--color-accent-hover: #3d8ae8;"),
    ("--color-accent-soft: rgba(0, 255, 65, 0.12);", "--color-accent-soft: rgba(28, 105, 212, 0.14);"),
    ("--color-accent-glow: rgba(0, 255, 65, 0.35);", "--color-accent-glow: rgba(28, 105, 212, 0.35);"),
    ("--color-accent-dim: rgba(0, 255, 65, 0.2);", "--color-accent-dim: rgba(28, 105, 212, 0.22);"),
    ("--color-success: #00ff41;", "--color-success: #22c55e;"),
    ("--color-sale: #ff3366;", "--color-sale: #ef4444;"),
    ("--color-gold: #00e5ff;", "--color-gold: #d4a853;"),
    ("--color-cyan: #00e5ff;", "--color-cyan: #38bdf8;"),
    ("--color-matrix-dark: #031503;", "--color-matrix-dark: #0d1424;"),
    ("--color-matrix-panel: #0a1a0a;", "--color-matrix-panel: #121c30;"),
    ('--font-sans: "JetBrains Mono", "Fira Code", "Courier New", monospace;',
     '--font-sans: "Inter", "DM Sans", system-ui, sans-serif;'),
    ('--font-display: "Share Tech Mono", "JetBrains Mono", monospace;',
     '--font-display: "DM Sans", "Inter", system-ui, sans-serif;'),
    ("--radius: 4px;", "--radius: 8px;"),
    ("--radius-lg: 8px;", "--radius-lg: 14px;"),
    ("--shadow: 0 0 24px rgba(0, 255, 65, 0.12);", "--shadow: 0 12px 40px rgba(0, 0, 0, 0.35);"),
    ("--glow: 0 0 14px rgba(0, 255, 65, 0.4);", "--glow: 0 0 0 1px rgba(28, 105, 212, 0.25);"),
]

COLOR_MAP = {
    "#00ff41": "#1c69d4",
    "#66ff88": "#3d8ae8",
    "#020402": "#0a0f18",
    "#050a05": "#111827",
    "#071207": "#151d2e",
    "#0c1a0c": "#1c2740",
    "#0d3d0d": "#243552",
    "#1a5c1a": "#3d5f8a",
    "#c8ffc8": "#eef2f8",
    "#5a8a5a": "#8fa3bf",
    "#00e5ff": "#38bdf8",
    "#031503": "#0d1424",
    "#0a1a0a": "#121c30",
}


def strip_terminal_effects(css: str) -> str:
    css = re.sub(
        r"body::before \{[^}]+\}\s*",
        "",
        css,
        flags=re.DOTALL,
    )
    css = re.sub(
        r"body::after \{[^}]+\}\s*",
        "",
        css,
        flags=re.DOTALL,
    )
    css = css.replace(
        """  background-image:
    linear-gradient(rgba(0, 255, 65, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.04) 1px, transparent 1px),
    radial-gradient(ellipse at 50% -20%, rgba(0, 255, 65, 0.12) 0%, transparent 50%);
  background-size: 28px 28px, 28px 28px, 100% 100%;""",
        """  background-image:
    radial-gradient(ellipse at 20% 0%, rgba(28, 105, 212, 0.18) 0%, transparent 45%),
    radial-gradient(ellipse at 100% 100%, rgba(15, 23, 42, 0.9) 0%, transparent 50%);""",
    )
    premium_logo = """
.logo-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(145deg, #1c69d4 0%, #0f4c9e 50%, #c9d6e8 100%);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 16px rgba(28, 105, 212, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
"""
    css = re.sub(r"\.logo-icon \{[^}]+\}", premium_logo.strip(), css, count=1)
    premium_header = """
.site-header {
  background: rgba(10, 15, 24, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
}
"""
    if ".site-header {" in css and "backdrop-filter" not in css.split(".site-header {", 1)[1][:200]:
        css = css.replace(
            ".site-header {",
            premium_header.strip().replace(".site-header {", ".site-header {", 1),
            1,
        )
    return css


def main() -> None:
    css = SRC.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        css = css.replace(old, new)
    for old, new in COLOR_MAP.items():
        css = css.replace(old, new)
    css = re.sub(r"rgba\(0, 255, 65, ([0-9.]+)\)", r"rgba(28, 105, 212, \1)", css)
    css = strip_terminal_effects(css)
    OUT.write_text(css, encoding="utf-8")
    print(f"Wrote {OUT.name} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
