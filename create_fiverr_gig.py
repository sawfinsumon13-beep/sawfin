#!/usr/bin/env python3
"""Compose a Fiverr website-development gig image from a portrait photo."""

from __future__ import annotations

import argparse
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

try:
    from rembg import remove
except ImportError:  # pragma: no cover
    remove = None


WIDTH, HEIGHT = 1280, 769
YELLOW = (255, 204, 0)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def make_background() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), YELLOW)
    draw = ImageDraw.Draw(img)
    for x in range(0, WIDTH, 8):
        shade = 245 if x % 16 == 0 else 255
        draw.line([(x, 0), (x, HEIGHT)], fill=(shade, int(shade * 0.82), 0), width=1)
    return img


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_background_title(draw: ImageDraw.ImageDraw) -> None:
    font = load_font(92, bold=True)
    text = "WEBSITE DEVELOPMENT"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    x = (WIDTH - text_w) // 2
    y = 120
    draw.text((x + 2, y + 2), text, font=font, fill=(210, 170, 0))
    draw.text((x, y), text, font=font, fill=(235, 190, 20))


def remove_background(portrait: Image.Image) -> Image.Image:
    if remove is not None:
        output = remove(portrait.convert("RGBA"))
        if isinstance(output, bytes):
            return Image.open(BytesIO(output)).convert("RGBA")
        return output.convert("RGBA")

    portrait = portrait.convert("RGBA")
    data = portrait.getdata()
    new_data = []
    for r, g, b, a in data:
        if r >= 235 and g >= 235 and b >= 235:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    portrait.putdata(new_data)
    return portrait


def fit_portrait(portrait: Image.Image) -> Image.Image:
    banner_h = 120
    max_h = int((HEIGHT - banner_h) * 0.95)
    max_w = int(WIDTH * 0.55)
    ratio = min(max_h / portrait.height, max_w / portrait.width)
    target_w = max(1, int(portrait.width * ratio))
    target_h = max(1, int(portrait.height * ratio))
    return portrait.resize((target_w, target_h), Image.Resampling.LANCZOS)


def draw_icon(
    draw: ImageDraw.ImageDraw, x: int, y: int, size: int, label: str, bg: tuple[int, int, int]
) -> None:
    draw.rounded_rectangle([x, y, x + size, y + size], radius=18, fill=bg)
    font = load_font(size // 2, bold=True)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x + (size - tw) // 2, y + (size - th) // 2 - 4), label, font=font, fill=WHITE)


def draw_tech_icons(draw: ImageDraw.ImageDraw) -> None:
    draw_icon(draw, 90, 90, 88, "JS", (245, 190, 0))
    draw_icon(draw, 120, 250, 88, "5", (220, 74, 56))
    draw_icon(draw, WIDTH - 180, 90, 88, "L", (220, 74, 56))
    draw_icon(draw, WIDTH - 150, 250, 88, "R", (30, 30, 40))


def draw_bottom_banner(base: Image.Image) -> None:
    banner_h = 120
    draw = ImageDraw.Draw(base)
    draw.rectangle([0, HEIGHT - banner_h, WIDTH, HEIGHT], fill=BLACK)
    font = load_font(58, bold=True)
    text = "WEBSITE DEVELOPMENT"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    draw.text(
        ((WIDTH - text_w) // 2, HEIGHT - banner_h + (banner_h - text_h) // 2 - 6),
        text,
        font=font,
        fill=WHITE,
    )


def compose(photo_path: Path, output_path: Path) -> None:
    base = make_background()
    draw = ImageDraw.Draw(base)
    draw_background_title(draw)
    draw_tech_icons(draw)

    portrait = Image.open(photo_path)
    portrait = remove_background(portrait)
    portrait = fit_portrait(portrait)
    x = (WIDTH - portrait.width) // 2
    y = HEIGHT - portrait.height - 130
    base.paste(portrait, (x, y), portrait)

    draw_bottom_banner(base)
    base.save(output_path, format="PNG", optimize=True)
    print(f"Saved: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Fiverr website-development gig image.")
    parser.add_argument("photo", type=Path, help="Path to your portrait photo (PNG/JPG)")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("fiverr-website-development-gig.png"),
        help="Output image path",
    )
    args = parser.parse_args()
    if not args.photo.exists():
        raise SystemExit(f"Photo not found: {args.photo}")
    compose(args.photo, args.output)


if __name__ == "__main__":
    main()
