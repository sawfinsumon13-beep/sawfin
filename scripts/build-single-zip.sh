#!/usr/bin/env bash
# One HTML file + images folder for Hostinger.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-/opt/cursor/artifacts}"
ZIP_NAME="bavarian-engines-single-file.zip"
STAGING="$ROOT/.single-staging"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

python3 "$ROOT/scripts/build-single-html.py"

rm -rf "$STAGING"
mkdir -p "$STAGING" "$OUT_DIR"
cp "$ROOT/bavarian-engines-all-in-one.html" "$STAGING/index.html"
cp -a "$ROOT/images" "$STAGING/"
cp "$ROOT/favicon.ico" "$ROOT/favicon.svg" "$ROOT/favicon-32.png" "$ROOT/apple-touch-icon.png" "$STAGING/" 2>/dev/null || true
cp "$ROOT/HOSTINGER_SINGLE_FILE.txt" "$STAGING/"

(cd "$STAGING" && zip -rq "$ZIP_PATH" .)
rm -rf "$STAGING"
echo "Done: $ZIP_PATH"
ls -lh "$ZIP_PATH"
