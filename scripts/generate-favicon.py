#!/usr/bin/env python3
"""Generate favicon.ico, favicon-32.png, and apple-touch-icon.png from site branding."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GREEN = (0, 255, 65, 255)
DARK = (2, 4, 2, 255)
BLACK = (0, 0, 0, 255)


def rgba(size: int) -> list[list[tuple[int, int, int, int]]]:
    pixels = [[DARK for _ in range(size)] for _ in range(size)]
    cx = cy = (size - 1) / 2
    radius = size * 0.38
    border = size * 0.04
    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist = (dx * dx + dy * dy) ** 0.5
            if dist > radius + border:
                continue
            if dist > radius:
                pixels[y][x] = GREEN
                continue
            angle = (math_atan2(dy, dx) + 3.14159265) / (2 * 3.14159265)
            quadrant = int(angle * 4) % 4
            pixels[y][x] = GREEN if quadrant in (0, 2) else DARK
    return pixels


def math_atan2(y: float, x: float) -> float:
    import math
    return math.atan2(y, x)


def write_png(path: Path, size: int) -> None:
    raw = rgba(size)
    rows = []
    for row in raw:
        rows.append(b"\x00" + bytes(ch for px in row for ch in px))
    data = zlib.compress(b"".join(rows), 9)

    def chunk(tag: bytes, payload: bytes) -> bytes:
        crc = zlib.crc32(tag + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", data) + chunk(b"IEND", b"")
    path.write_bytes(png)


def write_ico(path: Path, sizes: list[int]) -> None:
    images: list[bytes] = []
    for size in sizes:
        raw = rgba(size)
        # BGRA bottom-up for ICO
        bmp = bytearray()
        and_mask_row = ((size + 31) // 32) * 4
        for y in range(size - 1, -1, -1):
            for x in range(size):
                r, g, b, a = raw[y][x]
                bmp.extend([b, g, r, a])
            bmp.extend(b"\x00" * (and_mask_row * 8 // size if size else 0))
        # Simpler: store as PNG inside ICO (modern Windows/browsers support it)
        png_path = path.parent / f".tmp-{size}.png"
        write_png(png_path, size)
        images.append(png_path.read_bytes())
        png_path.unlink(missing_ok=True)

    header = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = bytearray()
    data_blob = bytearray()
    for size, png in zip(sizes, images):
        w = 0 if size >= 256 else size
        h = 0 if size >= 256 else size
        entries.extend(struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(png), offset))
        data_blob.extend(png)
        offset += len(png)
    path.write_bytes(header + bytes(entries) + bytes(data_blob))


def main() -> None:
    write_png(ROOT / "favicon-32.png", 32)
    write_png(ROOT / "apple-touch-icon.png", 180)
    write_ico(ROOT / "favicon.ico", [16, 32, 48])
    print("Generated favicon.ico, favicon-32.png, apple-touch-icon.png")


if __name__ == "__main__":
    main()
