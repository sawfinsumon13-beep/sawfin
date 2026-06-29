#!/usr/bin/env python3
"""Rewrite secondary pages with unique, beautifully structured content."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

IMAGES = {
    "m57": "images/engines/sets/set-0088/main-BMW-330D-231Hp-M57-2009-Engine-2.webp",
    "m57_2": "images/engines/sets/set-0087/main-BMW-330D-231Hp-M57-2009-Engine-1.webp",
    "n57": "images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp",
    "n47": "images/engines/sets/set-0114/main-BMW-F30-320d-N47D20C-Engine-2014-1.webp",
    "b47": "images/engines/sets/set-0066/main-BMW-118D-F20-B47D20A-2016-LCI-Engine.webp",
    "b57": "images/engines/sets/set-0052/main-BMW-X6-G06-M50d-B57D30S-Engine-2019-2.webp",
    "b58": "images/engines/sets/set-0018/main-BMW-G23-M440i-B58-Engine-1.webp",
    "warehouse": "images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp",
    "crate": "images/engines/sets/set-0114/main-BMW-F30-320d-N47D20C-Engine-2014-1.webp",
}


def dedupe_paragraphs(html: str) -> str:
    """Remove consecutive duplicate <p> blocks."""
    prev = None
    while prev != html:
        prev = html
        html = re.sub(
            r"(<p>[^<]+</p>)\s*\1+",
            r"\1",
            html,
            flags=re.DOTALL,
        )
    return html


def remove_rich_content(html: str) -> str:
    return re.sub(
        r"\s*<section class=\"page-rich-content\">.*?</section>\s*",
        "\n",
        html,
        flags=re.DOTALL,
    )


def split_block(img: str, alt: str, label: str, title: str, body: str, checks: list[str], reverse: bool = False) -> str:
    items = "".join(f"<li>{c}</li>" for c in checks)
    mod = " detail-split--reverse" if reverse else ""
    return f"""
    <div class="detail-split{mod}">
      <div class="detail-split-media">
        <img src="{img}" alt="{alt}">
        <span class="detail-split-badge">{label}</span>
      </div>
      <div class="detail-split-body">
        <span class="section-label">{label}</span>
        <h2>{title}</h2>
        {body}
        <ul class="check-list">{items}</ul>
      </div>
    </div>"""


def audience_card(icon: str, title: str, body: str, link: str, link_text: str) -> str:
    return f"""
          <article class="audience-card">
            <div class="audience-card-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{body}</p>
            <a href="{link}" class="topic-link">{link_text}</a>
          </article>"""


def services_deep_content() -> str:
    blocks = [
        split_block(
            IMAGES["n47"], "N47 BMW diesel engine prepared in Hamburg",
            "Engine supply", "Documented BMW motors from our Hamburg warehouse",
            "<p>We stock two thousand plus N47, N57, B47, B57, B58 and M57 units with open pricing, donor mileage, and explicit inclusions on every SKU. Workshops reorder because what we list is what arrives in the crate.</p>",
            ["Photographed on site before listing", "Long block or complete packages stated upfront", "Six-month mechanical warranty included"],
        ),
        split_block(
            IMAGES["n57"], "N57 engine inspection",
            "VIN matching", "Free suffix verification before you pay",
            "<p>Ordering by model badge alone is the fastest route to a costly return. Send your VIN and a stamp photo on WhatsApp — we confirm live stock, lead time, freight, and exactly what ships.</p>",
            ["Same-day replies on most EU weekdays", "Written confirmation before invoice", "Prevents N47D20A vs N47D20C mismatches"],
            reverse=True,
        ),
        split_block(
            IMAGES["b47"], "B47 Euro 6 diesel engine",
            "Inspection", "Compression data and cold-start proof",
            "<p>Many diesel listings include compression figures and donor photography. Request cold-start video when your customer needs sign-off before the lift is booked.</p>",
            ["Stamp logged against donor records", "Turbo and DME pairing noted on listing", "Condition photos shared on request"],
        ),
        split_block(
            IMAGES["crate"], "Crated BMW engine for export",
            "Logistics", "Tracked export from Tilsiter Str. 90",
            "<p>Engines leave Hamburg on secure pallets or in timber crates with commercial invoices. Typical EU delivery is three to five business days; UK, Ireland and worldwide freight on request.</p>",
            ["Lift access and kerbside notes captured at quote", "Customs paperwork for non-EU buyers", "Live tracking shared at dispatch"],
            reverse=True,
        ),
    ]
    audience = [
        audience_card("🚗", "Private BMW owners", "Failed N47 in an F30 or N57 in an F10? We explain inclusions plainly and ship to your chosen garage.", "shop.html", "Browse engines →"),
        audience_card("🔧", "Independent garages", "Repeat N47, N57 and B47 orders with compression sheets that help you sell jobs confidently.", "contact.html", "Open trade enquiry →"),
        audience_card("🏔️", "4×4 builders", "M57 Defender and overland packages with mounts, wiring scope, and pre-sale technical answers.", "m57-swap-kits.html", "View M57 kits →"),
        audience_card("🌍", "Export buyers", "UK, Ireland, Scandinavia and Eastern EU — tracked Hamburg freight with VAT invoices for trade.", "blog-shipping.html", "Shipping guide →"),
    ]
    extras = """
    <section class="value-pillars">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label">Beyond the sale</span>
          <h2>Support that continues after dispatch</h2>
          <p>Buying an engine is not a one-click commodity purchase. These are the details our Hamburg desk handles every week.</p>
        </div>
        <div class="value-pillars-grid">
          <article class="value-pillar"><strong>Coding guidance</strong><p>When a donor DME travels with the engine, we explain immobiliser and CAS considerations so your electrician knows the scope before the crate lands.</p></article>
          <article class="value-pillar"><strong>First-start checklist</strong><p>Oil priming, coolant bleeding, and sensible refresh items for N47 and N57 timing systems — practical notes, not generic disclaimers.</p></article>
          <article class="value-pillar"><strong>Trade invoicing</strong><p>VAT-registered workshops receive formal invoices with engine stamp, inclusions, freight line, and payment reference on one document.</p></article>
          <article class="value-pillar"><strong>Warranty routing</strong><p>Claims start with photos and your order reference — we explain steps in plain language because warranty only works when the process is clear.</p></article>
        </div>
      </div>
    </section>"""
    return f"""
    <section class="detail-splits">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label">What we deliver</span>
          <h2>Services built for workshops and owners</h2>
          <p>Every service below is handled in-house at Bavarian Engines — not outsourced to a marketplace middleman.</p>
        </div>
        {"".join(blocks)}
      </div>
    </section>
    <section class="audience-showcase">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label">Who we serve</span>
          <h2>Buyers we help every week</h2>
        </div>
        <div class="audience-grid">
          {"".join(audience)}
        </div>
      </div>
    </section>
    {extras}"""


def about_deep_content() -> str:
    blocks = [
        split_block(
            IMAGES["warehouse"], "Bavarian Engines Hamburg warehouse",
            "Our story", "Ten years as a BMW-only engine exchange",
            "<p>Bavarian Engines operates from Tilsiter Str. 90, 22047 Hamburg. We source, inspect, photograph, and export genuine BMW diesel and petrol motors — not general scrap stock.</p>",
            ["N47, N57, B47, B57, B58 and M57 focus", "Eighty-one verified buyer reviews published", "Repeat orders from garages across Europe"],
        ),
        split_block(
            IMAGES["n47"], "N47 engine stamp identification",
            "Quality standard", "Identification before photography",
            "<p>Every motor is suffix-stamped, mileage-logged where available, and assessed for core condition before it appears online. We would rather decline a donor than mis-describe one.</p>",
            ["Compression testing on many diesel units", "Turbo and ECU inclusions written on SKU", "Human WhatsApp support after delivery"],
            reverse=True,
        ),
        split_block(
            IMAGES["b57"], "Modern B57 BMW diesel engine",
            "Logistics hub", "Hamburg export advantage",
            "<p>Our location sits on major EU freight corridors. Daily routes serve the UK, Ireland, France, Benelux, Nordics, Iberia, Poland and worldwide destinations on request.</p>",
            ["Three to five day typical EU delivery", "Commercial invoices and tracking included", "Crating suited to workshop delivery"],
        ),
    ]
    return f"""
    <section class="detail-splits">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label">Inside Bavarian Engines</span>
          <h2>What stands behind every listing</h2>
        </div>
        {"".join(blocks)}
      </div>
    </section>
    <section class="value-pillars">
      <div class="container">
        <div class="value-pillars-grid value-pillars-grid--3">
          <article class="value-pillar"><strong>Photography honesty</strong><p>Listings use photos of the actual engine you receive — not catalogue renders or stock art from unrelated donors.</p></article>
          <article class="value-pillar"><strong>Reuse with accountability</strong><p>Insurance write-offs with intact engine bays give sound BMW hardware a second life — inspected, documented, and warrantied.</p></article>
          <article class="value-pillar"><strong>Conversion insight</strong><p>Defender M57 and overland kit experience informs how we document swap engines — mounts, loom scope, and cooling notes included.</p></article>
        </div>
      </div>
    </section>"""


def contact_deep_content() -> str:
    return f"""
    <section class="detail-splits">
      <div class="container">
        {split_block(
            IMAGES["crate"], "Crated BMW engine ready for delivery",
            "Fastest route", "WhatsApp VIN checks with same-day replies",
            "<p>Send your seventeen-digit VIN, engine stamp photo, model year, and delivery postcode. We confirm compatible stock, inclusions, freight, and issue a proforma before preparation begins.</p>",
            ["English and German support", "No charge for compatibility checks", "Proforma before any preparation"],
        )}
        {split_block(
            IMAGES["b58"], "B58 petrol turbo engine",
            "Formal quotes", "Email for invoices and trade paperwork",
            "<p>Email suits VAT invoices, export documentation, and enquiries where you need a paper trail. Include the same VIN details and we mirror the WhatsApp workflow with written quotes.</p>",
            ["SEPA, SWIFT and Zelle options explained", "VAT invoices for registered workshops", "Payment reference on every proforma"],
            reverse=True,
        )}
      </div>
    </section>
    <section class="contact-facts">
      <div class="container">
        <div class="contact-facts-grid">
          <div class="contact-fact"><strong>WhatsApp</strong><a href="https://wa.me/4917613627363" target="_blank" rel="noopener">+49 176 13627363</a></div>
          <div class="contact-fact"><strong>Email</strong><a href="mailto:flashkingpro202@gmail.com">flashkingpro202@gmail.com</a></div>
          <div class="contact-fact"><strong>Warehouse</strong><span>Tilsiter Str. 90, 22047 Hamburg</span></div>
          <div class="contact-fact"><strong>Hours</strong><span>Mon–Fri, CET business hours</span></div>
        </div>
      </div>
    </section>"""


def policies_deep_content() -> str:
    return """
    <section class="policy-cards">
      <div class="container">
        <div class="policy-cards-grid">
          <article class="policy-card" id="warranty">
            <h3>Warranty</h3>
            <p>Six-month mechanical cover on correctly installed units. Contact us before stripping any engine for a claim.</p>
          </article>
          <article class="policy-card" id="returns">
            <h3>Returns</h3>
            <p>Uninstalled returns may be accepted within thirty days when authorised. Confirm VIN match before fitting.</p>
          </article>
          <article class="policy-card" id="shipping">
            <h3>Shipping</h3>
            <p>EU delivery typically three to five business days from Hamburg. Incoterms stated on your invoice.</p>
          </article>
          <article class="policy-card" id="privacy">
            <h3>Privacy</h3>
            <p>VIN and contact data are used only to fulfil orders. We never sell personal data.</p>
          </article>
        </div>
      </div>
    </section>
    <section class="policy-details">
      <div class="container">
        <article class="policy-detail">
          <span class="section-label">Warranty</span>
          <h2>Six-month mechanical cover</h2>
          <p>All engines include standard warranty on mechanical integrity when installed correctly with proper fluids, filters, and oil priming.</p>
          <div class="policy-columns">
            <div>
              <h4>Covered</h4>
              <ul class="check-list"><li>Internal failure of block, head and core internals at dispatch</li><li>Defects not caused by install error or overheating</li><li>Claims with order reference, install date and evidence</li></ul>
            </div>
            <div>
              <h4>Not covered</h4>
              <ul class="check-list"><li>Suffix mismatch against our written VIN advice</li><li>Improper installation or continued use after warnings</li><li>Labour, hire cars and consequential losses</li></ul>
            </div>
          </div>
        </article>
        <article class="policy-detail">
          <span class="section-label">Returns</span>
          <h2>Fair returns when compatibility is confirmed pre-install</h2>
          <p>Returns within thirty days when authorised and the engine remains unmodified. Return freight is customer responsibility unless we confirmed the wrong suffix in writing.</p>
        </article>
        <article class="policy-detail">
          <span class="section-label">Shipping</span>
          <h2>Worldwide freight from Hamburg</h2>
          <p>Engines travel on pallets or in timber crates with commercial invoices and tracking. UK and Ireland typically four to eight business days depending on customs.</p>
        </article>
        <article class="policy-detail">
          <span class="section-label">Payment</span>
          <h2>Proforma before preparation</h2>
          <p>SEPA, SWIFT and Zelle as agreed. PayPal, Revolut, Wise or escrow available on request for large international orders.</p>
        </article>
      </div>
    </section>"""


def m57_deep_content() -> str:
    blocks = [
        split_block(
            IMAGES["m57"], "BMW M57 engine for Defender conversion",
            "Why M57", "Torque and parts support for 4×4 builds",
            "<p>The M57 inline-six is the default upgrade for Defender, Pajero and Patrol projects where modern diesel tractability matters more than plug-and-play simplicity.</p>",
            ["Proven six-cylinder torque for heavy chassis", "Wide European parts availability", "Documented donor history on every kit"],
        ),
        split_block(
            IMAGES["m57_2"], "M57 long block inspection",
            "Defender kits", "Engine, ECU, loom and mounts — scope stated upfront",
            "<p>Our Defender packages are built for qualified installers. We discuss wheelbase, gearbox choice, and cooling route before recommending a SKU — not after your customer has paid.</p>",
            ["Manual R380 and auto routes quoted separately", "Wiring and immobiliser scope documented", "WhatsApp support from technicians who fit these weekly"],
            reverse=True,
        ),
    ]
    return f"""
    <section class="detail-splits">
      <div class="container">
        <div class="section-header-center">
          <span class="section-label">Conversion supply</span>
          <h2>M57 packages for serious builds</h2>
        </div>
        {"".join(blocks)}
      </div>
    </section>"""


def patch_file(path: Path, insert_before: str, new_content: str, also_remove: list[str] | None = None, marker: str = "detail-splits") -> None:
    html = path.read_text(encoding="utf-8")
    if marker and f'<section class="{marker}">' in html:
        html = remove_rich_content(html)
        html = dedupe_paragraphs(html)
        path.write_text(html, encoding="utf-8")
        print(f"Skipped {path.name} (already has {marker} sections); cleaned duplicates")
        return
    html = remove_rich_content(html)
    for pattern in also_remove or []:
        html = re.sub(pattern, "\n", html, flags=re.DOTALL)
    html = dedupe_paragraphs(html)
    anchor = insert_before if insert_before in html else insert_before.lstrip()
    if anchor not in html:
        raise SystemExit(f"Anchor not found in {path.name}")
    html = html.replace(anchor, new_content + "\n" + anchor, 1)
    html = dedupe_paragraphs(html)
    path.write_text(html, encoding="utf-8")
    print(f"Updated {path.name}")


def main() -> None:
    patch_file(
        ROOT / "services.html",
        '<section class="cta-banner">',
        services_deep_content(),
        also_remove=[
            r'\s*<section class="content-section">\s*<div class="container">\s*<span class="section-label">Who we serve</span>.*?</section>\s*',
        ],
    )

    patch_file(
        ROOT / "about.html",
        '    <section class="content-section">\n      <div class="container content-grid">\n        <div class="content-block">\n          <span class="section-label">Location</span>',
        about_deep_content(),
    )

    patch_file(
        ROOT / "contact.html",
        "  </main>",
        contact_deep_content() + """
    <section class="cta-banner">
      <div class="container">
        <div class="cta-inner">
          <h2>Send your VIN for a free match</h2>
          <p>WhatsApp is fastest — we typically reply the same business day with compatible stock and freight.</p>
          <div class="cta-buttons">
            <a href="https://wa.me/4917613627363" class="btn btn-primary" target="_blank" rel="noopener">WhatsApp +49 176 13627363</a>
            <a href="shop.html" class="btn btn-outline">Browse engines</a>
          </div>
        </div>
      </div>
    </section>
""",
        also_remove=[
            r'\s*<section class="content-section">\s*<div class="container content-grid">\s*<div class="content-block">\s*<h2>What to include in your enquiry</h2>.*?</section>\s*',
        ],
    )

    patch_file(
        ROOT / "policies.html",
        '<section class="cta-banner">',
        policies_deep_content(),
    )

    patch_file(
        ROOT / "m57-swap-kits.html",
        '    <section class="process">\n      <div class="container">\n        <h2 class="section-title">What\'s included in a kit?</h2>',
        m57_deep_content(),
    )

    # Safety pass on all HTML
    for path in ROOT.glob("*.html"):
        text = dedupe_paragraphs(path.read_text(encoding="utf-8"))
        if text != path.read_text(encoding="utf-8"):
            path.write_text(text, encoding="utf-8")
            print(f"Deduped {path.name}")

    print("Secondary pages rewritten.")


if __name__ == "__main__":
    main()
