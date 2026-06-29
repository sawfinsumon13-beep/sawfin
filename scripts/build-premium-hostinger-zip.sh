#!/usr/bin/env bash
# Package the premium-design site for Hostinger (same content, BMW blue theme).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-/opt/cursor/artifacts}"
ZIP_NAME="bavarian-engines-premium-website.zip"
STAGING="${TMPDIR:-/tmp}/bavarian-premium-staging-$$"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

python3 "$ROOT/scripts/generate-premium-theme.py"

rm -rf "$STAGING"
mkdir -p "$STAGING" "$OUT_DIR"

cp -a "$ROOT"/*.html "$STAGING/" 2>/dev/null || true
cp -a "$ROOT"/robots.txt "$ROOT"/sitemap.xml "$ROOT"/.htaccess "$STAGING/"
cp -a "$ROOT"/favicon.ico "$ROOT"/favicon.svg "$ROOT"/favicon-32.png "$ROOT"/apple-touch-icon.png "$STAGING/" 2>/dev/null || true
mkdir -p "$STAGING/css"
cp "$ROOT/css/style-premium.css" "$STAGING/css/style.css"
cp -a "$ROOT"/js "$ROOT"/images "$STAGING/"
cp "$ROOT/PREMIUM_HOSTINGER_SETUP.txt" "$STAGING/HOSTINGER_SETUP.txt"

(cd "$STAGING" && zip -rq "$ZIP_PATH" .)
rm -rf "$STAGING"
echo "Done: $ZIP_PATH"
ls -lh "$ZIP_PATH"
