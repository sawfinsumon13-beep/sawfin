#!/usr/bin/env python3
"""Generate favicon assets and inline <link> snippet for HTML heads."""

from __future__ import annotations

import base64
import io
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "favicon.svg"
VERSION = "bmw2"


def build_favicon_links(indent: str = "  ") -> str:
    """Return favicon <link> tags with inline data URIs (works without external files)."""
    svg_data = SVG.read_bytes()
    svg_uri = "data:image/svg+xml;base64," + base64.b64encode(svg_data).decode("ascii")

    png32 = cairosvg.svg2png(bytestring=svg_data, output_width=32, output_height=32)
    png32_uri = "data:image/png;base64," + base64.b64encode(png32).decode("ascii")

    apple = cairosvg.svg2png(bytestring=svg_data, output_width=180, output_height=180)
    apple_uri = "data:image/png;base64," + base64.b64encode(apple).decode("ascii")

    return "\n".join(
        [
            f'{indent}<link rel="icon" type="image/png" sizes="32x32" href="{png32_uri}">',
            f'{indent}<link rel="icon" type="image/svg+xml" href="{svg_uri}">',
            f'{indent}<link rel="apple-touch-icon" href="{apple_uri}">',
            f'{indent}<link rel="icon" href="favicon.ico?v={VERSION}" sizes="any">',
            f'{indent}<link rel="icon" href="favicon.svg?v={VERSION}" type="image/svg+xml">',
            f'{indent}<link rel="icon" href="favicon-32.png?v={VERSION}" type="image/png" sizes="32x32">',
        ]
    )


def write_raster_assets() -> None:
    svg_data = SVG.read_bytes()
    for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png")]:
        (ROOT / name).write_bytes(
            cairosvg.svg2png(bytestring=svg_data, output_width=size, output_height=size)
        )

    imgs = []
    for size in (16, 32, 48, 64):
        png = cairosvg.svg2png(bytestring=svg_data, output_width=size, output_height=size)
        imgs.append(Image.open(io.BytesIO(png)).convert("RGBA"))
    imgs[0].save(ROOT / "favicon.ico", format="ICO", sizes=[(i.width, i.height) for i in imgs])


def main() -> None:
    write_raster_assets()
    snippet_path = ROOT / "scripts" / "favicon-links.html"
    snippet_path.write_text(build_favicon_links() + "\n", encoding="utf-8")
    print("Generated favicon.ico, favicon-32.png, apple-touch-icon.png")
    print(f"Wrote inline snippet: {snippet_path}")


if __name__ == "__main__":
    main()
