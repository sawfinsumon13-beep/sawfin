#!/usr/bin/env python3
"""Apply modern redesign to Bavarian Engines main site."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
MODERN = Path(__file__).parent / "bavarian-modern.css"
STYLE = ROOT / "css" / "style.css"

NEW_HERO = """      <div class="container hero-layout">
        <div class="hero-modern">
          <span class="hero-eyebrow">Hamburg · BMW engine specialists</span>
          <h1>Used BMW engines — tested, documented, ready to ship</h1>
          <p class="hero-lead">Bavarian Engines supplies original BMW motors to workshops and owners across Europe. Every unit is suffix-verified against your VIN before dispatch.</p>
          <div class="hero-actions">
            <a href="shop.html" class="btn btn-primary">Browse 2,000+ engines</a>
            <a href="https://wa.me/4915510030835" class="btn btn-outline" style="border-color:#fff;color:#fff" target="_blank" rel="noopener">WhatsApp VIN check</a>
          </div>
          <div class="hero-stats-row">
            <div class="hero-stat"><strong>2,000+</strong><span>Motors in stock</span></div>
            <div class="hero-stat"><strong>450+</strong><span>Verified reviews</span></div>
            <div class="hero-stat"><strong>6 mo</strong><span>Warranty</span></div>
            <div class="hero-stat"><strong>EU</strong><span>Export daily</span></div>
          </div>
        </div>
        <div class="snapshot-widget">
          <h3>Why choose us</h3>
          <div class="snapshot-grid">
            <div class="snapshot-item"><strong>VIN</strong><span>Matched before pay</span></div>
            <div class="snapshot-item"><strong>6 mo</strong><span>Mechanical warranty</span></div>
            <div class="snapshot-item"><strong>EU</strong><span>Tracked shipping</span></div>
            <div class="snapshot-item"><strong>10+ yrs</strong><span>BMW-only focus</span></div>
          </div>
        </div>
      </div>"""


def main() -> None:
    premium = Path(__file__).parent / "style-premium.css"
    overrides = Path(__file__).parent / "premium-overrides.css"
    if premium.exists():
        css = premium.read_text(encoding="utf-8")
        if overrides.exists():
            css += "\n" + overrides.read_text(encoding="utf-8")
        STYLE.write_text(css, encoding="utf-8")
    else:
        STYLE.write_text(MODERN.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"Updated {STYLE}")

    index = ROOT / "index.html"
    text = index.read_text(encoding="utf-8")
    text = re.sub(
        r'<div class="container hero-layout">.*?</div>\s*</section>',
        NEW_HERO + "\n    </section>",
        text,
        count=1,
        flags=re.DOTALL,
    )
    index.write_text(text, encoding="utf-8")
    print("Updated index.html hero")

    comp = ROOT / "js" / "components.js"
    c = comp.read_text(encoding="utf-8")
    c = c.replace('<span class="nav-mobile-title">// menu.nav</span>', '<span class="nav-mobile-title">Menu</span>')
    comp.write_text(c, encoding="utf-8")
    print("Updated components.js")


if __name__ == "__main__":
    main()
