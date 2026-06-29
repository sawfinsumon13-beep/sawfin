#!/usr/bin/env bash
# Premium theme — one index.html + images for Hostinger.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-/opt/cursor/artifacts}"
ZIP_NAME="bavarian-engines-premium-single-file.zip"
STAGING="${TMPDIR:-/tmp}/bavarian-premium-single-$$"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

python3 "$ROOT/scripts/generate-premium-theme.py"
python3 "$ROOT/scripts/build-single-html.py" --theme premium

rm -rf "$STAGING"
mkdir -p "$STAGING" "$OUT_DIR"
cp "$ROOT/bavarian-engines-premium-all-in-one.html" "$STAGING/index.html"
cp -a "$ROOT/images" "$STAGING/"
cp "$ROOT"/favicon.ico "$ROOT"/favicon.svg "$ROOT"/favicon-32.png "$ROOT"/apple-touch-icon.png "$STAGING/" 2>/dev/null || true
cp "$ROOT/PREMIUM_HOSTINGER_SETUP.txt" "$STAGING/HOSTINGER_SINGLE_FILE.txt"

(cd "$STAGING" && zip -rq "$ZIP_PATH" .)
rm -rf "$STAGING"
echo "Done: $ZIP_PATH"
ls -lh "$ZIP_PATH"
