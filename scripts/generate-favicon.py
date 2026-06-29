#!/usr/bin/env python3
"""Generate favicon.ico, favicon-32.png, and apple-touch-icon.png from favicon.svg."""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "favicon.svg"


def main() -> None:
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
    print("Generated favicon.ico, favicon-32.png, apple-touch-icon.png from favicon.svg")


if __name__ == "__main__":
    main()
