#!/usr/bin/env python3
"""Update contact information across all website files."""

from pathlib import Path

ROOT = Path("/workspace/purebredkitties-website")
EXTENSIONS = {".html", ".css", ".js", ".json", ".xml"}

NEW_EMAIL = "kittenspurebreed@gmail.com"
NEW_PHONE_DISPLAY = "+1 343-809-2153"
NEW_PHONE_TEL = "+13438092153"
NEW_WHATSAPP_URL = "https://wa.me/13438092153"

REPLACEMENTS = [
    ("adopt@purebredkitties.com", NEW_EMAIL),
    ('"email":"adopt@purebredkitties.com"', f'"email":"{NEW_EMAIL}"'),
    ("mailto:adopt@purebredkitties.com", f"mailto:{NEW_EMAIL}"),
    ('href="tel:+8772273707"', f'href="{NEW_WHATSAPP_URL}"'),
    ("(877)227-3707", NEW_PHONE_DISPLAY),
    ("(877) 227-3707", NEW_PHONE_DISPLAY),
    ("877-227-3707", NEW_PHONE_DISPLAY.replace(" ", " ").replace("+1 ", "+1 ")),
    ('"telephone":"(877) 227-3707"', f'"telephone":"{NEW_PHONE_DISPLAY}"'),
    (
        "Call or text us at 877-227-3707 for quick support",
        f"Contact us on WhatsApp at {NEW_PHONE_DISPLAY} for quick support",
    ),
    ("(302)520-6683", NEW_PHONE_DISPLAY),
    (
        "texting either of these numbers (877) 227-3707 or (302)520-6683",
        f"contacting us on WhatsApp at {NEW_PHONE_DISPLAY}",
    ),
]

# Update WhatsApp share links to include contact phone when only text param exists
WHATSAPP_TEXT_PREFIX = 'https://api.whatsapp.com/send?text='
WHATSAPP_WITH_PHONE = f'https://api.whatsapp.com/send?phone=13438092153&text='


def process_file(path: Path) -> bool:
    try:
        data = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False

    original = data
    for old, new in REPLACEMENTS:
        data = data.replace(old, new)

    # Point generic WhatsApp share buttons to contact number
    if WHATSAPP_TEXT_PREFIX in data and "phone=13438092153" not in data:
        data = data.replace(WHATSAPP_TEXT_PREFIX, WHATSAPP_WITH_PHONE)

    if data != original:
        path.write_text(data, encoding="utf-8")
        return True
    return False


def main():
    changed = 0
    total = 0
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            continue
        total += 1
        if process_file(path):
            changed += 1
    print(f"Processed {total} files, updated {changed}")


if __name__ == "__main__":
    main()
