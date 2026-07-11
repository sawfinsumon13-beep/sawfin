#!/usr/bin/env bash
# Package the full static site into a single ZIP for one-click download.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/downloads"
OUT_FILE="$OUT_DIR/bmwusedengines-full-site.zip"
mkdir -p "$OUT_DIR"

cd "$ROOT"
rm -f "$OUT_FILE"
zip -r "$OUT_FILE" . \
  -x './.git/*' \
  -x './downloads/*' \
  -x './node_modules/*' \
  -x './.cursor/*' \
  -x '*/.DS_Store'

echo "Created $OUT_FILE ($(du -h "$OUT_FILE" | cut -f1))"
