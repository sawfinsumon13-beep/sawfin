#!/usr/bin/env bash
# Package the full static site for Hostinger upload.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-/opt/cursor/artifacts}"
ZIP_NAME="bavarian-engines-website.zip"
STAGING="$ROOT/.deploy-staging"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

rm -rf "$STAGING"
mkdir -p "$STAGING" "$OUT_DIR"

echo "Copying site files..."
mkdir -p "$STAGING"
cp -a "$ROOT"/*.html "$STAGING/" 2>/dev/null || true
cp -a "$ROOT"/robots.txt "$ROOT"/sitemap.xml "$ROOT"/.htaccess "$ROOT"/HOSTINGER_SETUP.txt "$STAGING/"
cp -a "$ROOT"/css "$ROOT"/js "$ROOT"/images "$STAGING/"

echo "Creating zip ($(du -sh "$STAGING" | cut -f1))..."
rm -f "$ZIP_PATH"
(cd "$STAGING" && zip -rq "$ZIP_PATH" .)

rm -rf "$STAGING"
echo "Done: $ZIP_PATH"
ls -lh "$ZIP_PATH"
