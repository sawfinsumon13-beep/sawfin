#!/usr/bin/env python3
"""Download missing collection pagination pages from live site."""

import re
import time
import urllib.request
from pathlib import Path

SOURCE = Path("/workspace/hosting-staging/collections")
OUT = Path("/workspace/hosting-staging/collections")
BASE = "https://purebredkitties.com/collections"
UA = "Mozilla/5.0 (compatible; PurebredKittiesMirror/1.0)"
FOLDER_COLLECTIONS = {"kittens-for-sale", "bengal-cats-for-sale", "abyssinian-kitties-for-sale"}


def max_page(html: str) -> int:
    pages = [int(p) for p in re.findall(r"page=(\d+)", html)]
    return max(pages) if pages else 1


def list_collection_sources():
    """Yield (slug, folder, source_path) for page-1 collection files only."""
    seen = set()
    for path in sorted(SOURCE.rglob("*.html")):
        if path.name.startswith("page-"):
            continue
        if re.search(r"-page-\d+\.html$", path.name):
            continue

        if path.name == "index.html" and path.parent != SOURCE:
            slug = path.parent.name
            key = ("folder", slug)
            if key not in seen:
                seen.add(key)
                yield slug, True, path
        elif path.parent == SOURCE and path.name.endswith(".html"):
            slug = path.stem
            if slug in FOLDER_COLLECTIONS:
                continue  # use folder index instead
            key = ("flat", slug)
            if key not in seen:
                seen.add(key)
                yield slug, False, path


def dest_path(slug: str, page: int, folder: bool) -> Path:
    if folder:
        d = OUT / slug
        d.mkdir(parents=True, exist_ok=True)
        return d / f"page-{page}.html"
    return OUT / f"{slug}-page-{page}.html"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def main():
    downloaded = 0
    skipped = 0
    failed = 0
    jobs = []

    for slug, folder, path in list_collection_sources():
        html = path.read_text(encoding="utf-8", errors="ignore")
        mx = max_page(html)
        for page in range(2, mx + 1):
            dst = dest_path(slug, page, folder)
            if dst.exists() and dst.stat().st_size > 10000:
                skipped += 1
                continue
            jobs.append((slug, page, folder, dst))

    print(f"Collections: {len(list(list_collection_sources()))}, jobs: {len(jobs)}, skipped: {skipped}")

    for i, (slug, page, folder, dst) in enumerate(jobs, 1):
        url = f"{BASE}/{slug}?page={page}"
        try:
            html = fetch(url)
            if len(html) < 5000:
                raise ValueError("response too small")
            dst.write_text(html, encoding="utf-8")
            downloaded += 1
            if i % 25 == 0 or i == len(jobs):
                print(f"  [{i}/{len(jobs)}] {slug} p{page} OK")
            time.sleep(0.25)
        except Exception as e:
            failed += 1
            if failed <= 5:
                print(f"  FAIL {url}: {e}")

    print(f"Done: downloaded={downloaded}, skipped={skipped}, failed={failed}")


if __name__ == "__main__":
    main()
