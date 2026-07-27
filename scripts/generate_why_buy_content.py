#!/usr/bin/env python3
"""Generate homepage Why-Buy benefit content in batches."""

from __future__ import annotations

import json
import itertools
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "why-buy"

FAMILIES = [
    "peptides",
    "research peptides",
    "peptides for sale",
    "Beta-Amyloid peptides",
    "Amylin peptides",
    "APP-related peptides",
    "antibodies",
    "Tau antibodies",
    "Synuclein antibodies",
    "recombinant proteins",
    "Tau proteins",
    "Synuclein proteins",
    "preformed fibrils",
    "Beta-Amyloid fibrils",
    "Tau fibrils",
    "research kits",
    "Beta-Amyloid kits",
    "Tau kits",
    "neurodegenerative compounds",
    "coronavirus research tools",
]

REASONS = [
    ("Competitive pricing", "Prices are set about 10% below comparable public list pricing, so labs stretch grant budgets further."),
    ("Batch consistency", "Lot-to-lot consistency helps reduce rework when protocols are repeated across studies."),
    ("Clear SKUs & sizes", "Every listing shows SKU and size options so purchasing teams can order without guesswork."),
    ("Unique product images", "Each catalog item has its own image, making product identification faster for buyers."),
    ("Email & WhatsApp ordering", "Buy quickly by Email or WhatsApp with product, SKU, size, and quantity pre-filled."),
    ("Responsive sales support", "Sales confirms availability, totals, and payment steps before you commit."),
    ("Research-use documentation", "Documentation support helps labs keep records aligned with research-only use."),
    ("Broad neurodegeneration catalog", "Antibodies, proteins, fibrils, kits, and peptides are available in one storefront."),
    ("Ready-to-ship fibrils", "Preformed fibrils reduce preparation time before time-sensitive experiments."),
    ("Custom & bulk options", "When catalog stock is not enough, custom synthesis and bulk quotes are available."),
    ("USA-based support hours", "Reach the team during EST business hours for order and product questions."),
    ("Account for faster reorders", "Create an account to save lab details and speed follow-up purchases."),
    ("Matched reagent families", "Pair peptides with related antibodies and proteins for cleaner study design."),
    ("Transparent catalog browsing", "Filter by family and subcategory before contacting sales to buy."),
    ("Global shipping pathways", "Ordering overview and distributor resources help international teams plan delivery."),
]

ACTIONS = [
    ("Buy peptides", "section-peptides.html"),
    ("Shop catalog", "products.html"),
    ("View antibodies", "section-antibodies.html"),
    ("Shop proteins", "section-proteins.html"),
    ("Shop fibrils", "section-fibrils.html"),
    ("Shop kits", "section-kits.html"),
    ("Contact sales", "contact.html"),
    ("Ordering overview", "resources-ordering.html"),
    ("Create account", "register.html"),
    ("Custom services", "services-contract.html"),
    ("Read FAQs", "resources-faqs.html"),
    ("WhatsApp order", "https://wa.me/17867086594"),
]

ANGLES = [
    "why labs choose us",
    "buyer benefit",
    "purchase advantage",
    "value for research teams",
    "reason to order here",
    "benefit for assay programs",
    "advantage for procurement",
    "support for R&D workflows",
]

TITLE_TEMPLATES = [
    "{reason} when you buy {family}",
    "Why buy {family} from Research peptides",
    "{family}: {reason} for serious labs",
    "A smarter way to source {family}",
    "Choose us for {family} — {reason}",
    "{reason} that helps teams buy {family}",
    "What you gain when ordering {family}",
    "Research peptides benefit: {reason}",
]

SUMMARY_TEMPLATES = [
    "Labs searching for {family} get {reason_lower} plus clear next steps to purchase.",
    "If you need {family}, this benefit matters: {benefit}",
    "Teams that buy {family} here keep procurement simple while protecting study timelines.",
    "For {family}, we focus on {reason_lower} so researchers can move from browsing to ordering faster.",
]

BENEFIT_TEMPLATES = [
    "{benefit} That is one practical reason to buy {family} from our catalog.",
    "Ordering {family} through Email or WhatsApp stays straightforward while you still get {reason_lower}.",
    "Use our catalog to compare {family}, then message sales with SKU and quantity.",
    "From first quote to reorder, {reason_lower} helps labs standardize how they buy {family}.",
]


def slug_words(text: str) -> str:
    return text.lower()


def generate_items(start_id: int, count: int, batch: int) -> list[dict]:
    items: list[dict] = []
    combo = itertools.product(range(len(REASONS)), range(len(FAMILIES)), range(len(ACTIONS)), range(len(ANGLES)), range(len(TITLE_TEMPLATES)))
    # Advance generator to create diversity across batches
    skip = (batch - 1) * count
    for _ in range(skip):
        next(combo, None)

    n = start_id
    for reason_i, family_i, action_i, angle_i, title_i in combo:
        if len(items) >= count:
            break
        reason, benefit = REASONS[reason_i]
        family = FAMILIES[family_i]
        cta, href = ACTIONS[action_i]
        angle = ANGLES[angle_i]
        title = TITLE_TEMPLATES[title_i].format(reason=reason, family=family)
        # Keep titles unique-ish by appending angle token lightly when needed
        if title_i % 3 == 0:
            title = f"{title} ({angle})"
        summary = SUMMARY_TEMPLATES[(reason_i + family_i) % len(SUMMARY_TEMPLATES)].format(
            family=family,
            reason_lower=slug_words(reason),
            benefit=benefit,
        )
        body = BENEFIT_TEMPLATES[(action_i + title_i) % len(BENEFIT_TEMPLATES)].format(
            family=family,
            benefit=benefit,
            reason_lower=slug_words(reason),
        )
        items.append(
            {
                "id": n,
                "batch": batch,
                "category": reason.split()[0].lower(),
                "family": family,
                "title": title[:120],
                "summary": summary,
                "benefit": body,
                "reason": reason,
                "cta": cta,
                "href": href,
            }
        )
        n += 1
    return items


def write_batch(batch: int, count: int, start_id: int) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = generate_items(start_id=start_id, count=count, batch=batch)
    path = OUT_DIR / f"why-buy-batch-{batch}.json"
    payload = {
        "batch": batch,
        "count": len(items),
        "theme": "Why buy research peptides and related reagents from us",
        "items": items,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def merge_all() -> Path:
    files = sorted(OUT_DIR.glob("why-buy-batch-*.json"))
    items = []
    for f in files:
        data = json.loads(f.read_text(encoding="utf-8"))
        items.extend(data.get("items", []))
    # de-dupe by id
    by_id = {i["id"]: i for i in items}
    merged = sorted(by_id.values(), key=lambda x: x["id"])
    out = OUT_DIR / "why-buy-all.json"
    out.write_text(
        json.dumps(
            {
                "count": len(merged),
                "theme": "Why buy from Research peptides — benefits and advantages",
                "batches": [json.loads(f.read_text(encoding="utf-8"))["batch"] for f in files],
                "items": merged,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    return out


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--batch", type=int, required=True)
    p.add_argument("--count", type=int, required=True)
    p.add_argument("--start-id", type=int, required=True)
    args = p.parse_args()
    path = write_batch(args.batch, args.count, args.start_id)
    merged = merge_all()
    print(f"Wrote {path} ({args.count} items)")
    print(f"Merged total: {json.loads(merged.read_text())['count']} -> {merged}")
