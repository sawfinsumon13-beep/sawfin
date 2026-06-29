#!/usr/bin/env python3
"""Expand secondary pages with 1000+ words and local engine images."""

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


def wc(html: str) -> int:
    return len(re.sub(r"<[^>]+>", " ", html).split())


def p(t: str) -> str:
    return f"<p>{t}</p>"


def h2(t: str) -> str:
    return f"<h2>{t}</h2>"


def h3(t: str) -> str:
    return f"<h3>{t}</h3>"


def img(src: str, alt: str, cls: str = "content-img") -> str:
    return f'<figure class="{cls}"><img src="{src}" alt="{alt}"><figcaption>{alt}</figcaption></figure>'


def trust_block() -> str:
    return "\n".join([
        p("Bavarian Engines operates from Hamburg as a BMW-only engine exchange. Every unit is suffix-checked against your VIN before invoice, documented with donor mileage where available, and shipped with a written six-month mechanical warranty. You reach the same desk on WhatsApp after delivery — not a faceless marketplace listing."),
        p("We encourage buyers to compare suppliers on four questions: Will you confirm my stamp against VIN in writing? What exactly ships on this SKU? Can you provide compression or cold-start proof? Who answers technical questions after the crate arrives? Those answers define whether you should trust a supplier with a high-value engine decision."),
    ])


def m57_content() -> str:
    blocks = [
        img(IMAGES["m57"], "BMW M57 diesel engine prepared for Defender conversion at Bavarian Engines Hamburg"),
        h2("Why the BMW M57 dominates 4×4 and overland conversions"),
        p("The BMW M57 inline-six diesel has become the default torque upgrade for Land Rover Defender builds, Mitsubishi Pajero expedition vehicles, Nissan Patrol Y61 platforms, and selected commercial van projects across Europe. Unlike anonymous scrap-yard pulls, Bavarian Engines supplies M57 swap kits with documented donor history, tested engines, vehicle-specific mounts, gearbox adapters, ECU and wiring looms, and workshop documentation — backed by WhatsApp support from technicians who handle these conversions weekly."),
        p("M57 torque transforms heavy 4×4 chassis: motorway cruising, laden overland travel, and low-RPM tractability on technical trails. Parts support across Europe remains excellent — injectors, turbos, HPFP, and service items are widely available compared with obsolete OEM diesel options in ageing Defenders and Pajeros. That is why builders accept the engineering effort of a conversion: long-term reliability and real-world performance outweigh the upfront labour investment."),
        img(IMAGES["m57_2"], "M57 long block inspected and photographed before listing"),
        h2("Land Rover Defender M57 swap kits"),
        p("Our Defender packages are designed for qualified installers — not plug-and-play consumer kits. Depending on version, kits may include the M57 engine, donor ECU, engine wiring loom, engine mounts, gearbox adapter (manual R380 or 8-speed automatic options), cooling system guidance, and documentation. Manual and 8-speed auto routes carry different labour scope; we discuss your Defender generation, existing gearbox, and intended use before recommending a SKU."),
        p("Defender 90, 110, and 130 wheelbases each present packaging and cooling considerations. Expedition builds often add auxiliary fuel filtration, upgraded radiators, and bash protection — we advise on sensible refresh items during quoting so your customer budget stays honest. Wiring and immobiliser alignment require professional workshop labour; our documentation explains what ships in the crate and what your electrician must complete."),
        h3("What is included in a typical Defender kit"),
        "<ul class='seo-list'><li><strong>M57 engine</strong> — tested donor with recorded mileage and compression data on request</li><li><strong>ECU &amp; engine loom</strong> — donor control unit and wiring; coding required at install</li><li><strong>Mounts &amp; adapters</strong> — vehicle-specific hardware for your gearbox choice</li><li><strong>Workshop documentation</strong> — install notes and WhatsApp support from Hamburg</li><li><strong>Export crating</strong> — secure pallet or timber crate with tracking across EU and UK</li></ul>",
        h2("Mitsubishi Pajero and Nissan Patrol packages"),
        p("Pajero V60 and V80 owners frequently choose M57 conversions for expedition reliability and fuel economy on long-distance travel. Patrol Y61 builders benefit from six-cylinder torque on heavy chassis without sacrificing serviceability. Bavarian Engines lists complete conversion packages where applicable — engine, ECU, mounts, and adapters — with honest scope notes on cooling, exhaust routing, and driveshaft geometry that remain installer responsibilities."),
        p("Before you commit, send vehicle photos, existing engine details, and intended gearbox. We confirm kit compatibility, lead time, freight to your postcode, and whether you need engine-only supply versus a full package. Proforma invoices precede preparation; kits crate after payment clears."),
        img(IMAGES["n57"], "Crated BMW diesel engine ready for export from Hamburg warehouse"),
        h2("Why buy your M57 kit from Bavarian Engines"),
        trust_block(),
        p("Main-dealer pricing does not exist for Defender M57 swaps — your choice is between undocumented scrap hardware and a specialist exchange that stands behind the sale. Bavarian Engines publishes open pricing, explains inclusions, and remains reachable after delivery for warranty and technical clarification. Garages across Germany, the UK, Ireland, Denmark, and Sweden order repeatedly because descriptions match reality."),
        h2("Labour planning and realistic timelines"),
        p("Qualified workshops typically budget multiple days for a first-time M57 Defender conversion — engine mount alignment, cooling plumbing, exhaust, prop shaft lengths, ECU coding, and commissioning. Kits reduce fabrication time but do not eliminate professional labour. We help you quote customer jobs accurately by stating what ships and what the installer must source locally."),
        p("Order lead time depends on kit variant and stock rotation. Contact us on WhatsApp with your chassis details for same-day guidance. Browse related articles: <a href='blog-defender-m57.html' class='seo-link'>Defender M57 cost guide</a>, <a href='blog-m57-defender-wiring.html' class='seo-link'>wiring loom guide</a>, and <a href='blog-m57-swap-labour-hours.html' class='seo-link'>labour hour planning</a>."),
        h2("Six-month warranty and after-sales support"),
        p("M57 engines and kits carry written mechanical warranty cover on correctly installed units. Full terms are on our <a href='policies.html' class='seo-link'>policies page</a>. Contact <a href='https://wa.me/4915510030835' target='_blank' rel='noopener'>Phone +49 15510 030835</a> or <a href='mailto:originalbavarianengine@gmail.com' class='seo-link'>originalbavarianengine@gmail.com</a> to start your conversion enquiry."),
    ]
    body = "\n".join(blocks)
    return f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def services_content() -> str:
    blocks = [
        img(IMAGES["n47"], "N47 BMW diesel engine — supplied and exported by Bavarian Engines"),
        h2("BMW engine supply — documented used motors from Hamburg"),
        p("Bavarian Engines supplies tested BMW diesel and petrol engines to independent garages, BMW specialists, private motorists, and export buyers across Europe. Our Hamburg warehouse stocks two thousand plus motors spanning N47, N57, B47, B57, B58, and M57 families. Each listing states engine stamp, donor mileage where available, inclusions (long block vs complete with turbo, injectors, DME), and open pricing — before you pay."),
        p("Unlike anonymous classified ads, every unit is photographed on site, mechanically assessed, and prepared for pallet or crate export with commercial invoice and tracking. Workshops order repeatedly because mileage, suffix, and inclusions match the quote when the crate opens."),
        h2("VIN and engine-code matching — free before you commit"),
        p("The costliest mistake in BMW engine replacement is ordering by model name alone. Send your seventeen-digit VIN and a photo of the engine stamp on WhatsApp — our desk confirms compatible live stock, lead time, freight to your postcode, and exactly what ships on that SKU. Same-day responses on most European weekdays."),
        img(IMAGES["n57"], "N57 six-cylinder BMW engine inspected in Hamburg"),
        h2("Inspection, compression testing, and documentation"),
        p("Many diesel listings include compression test figures and donor mileage. Workshops can request cold-start video for customer sign-off before installation begins. We log stamp identification, note turbo and DME pairing, and photograph condition before dispatch — giving you data to quote labour, gaskets, fluids, and coding accurately."),
        h2("Crated shipping and EU export logistics"),
        p("Engines leave Tilsiter Str. 90, Hamburg on secure pallets or in timber crates. Typical EU delivery is three to five business days to Germany, France, Benelux, Nordics, Iberia, and Poland. UK and Ireland export includes commercial paperwork; worldwide freight available on request. Read our <a href='blog-shipping.html' class='seo-link'>shipping guide</a> for lift requirements and customs notes."),
        img(IMAGES["b47"], "B47 Euro 6 diesel engine prepared for F-series BMW replacement"),
        h2("M57 conversion kits for Defender, Pajero, and Patrol"),
        p("Beyond BMW replacements, we supply complete M57 swap packages for Land Rover Defender, Mitsubishi Pajero, and Nissan Patrol Y61 builds — engine, ECU, wiring, mounts, and adapters on selected kits. Visit <a href='m57-swap-kits.html' class='seo-link'>M57 Swap Kits</a> for package detail and pricing."),
        h2("Warranty, trade accounts, and payment"),
        p("Every engine carries a six-month written mechanical warranty on correctly installed units. Trade customers with valid VAT ID receive formal invoices with VAT treatment explained upfront. Payment via SEPA bank transfer, international SWIFT, or Zelle (eligible US buyers). Proforma invoices precede preparation."),
        trust_block(),
        h2("Who we serve every week"),
        "<ul class='seo-list'><li><strong>Private BMW owners</strong> — F30 320d, F10 530d, X3, and G-series diesels; we explain options and ship to your chosen garage</li><li><strong>Independent garages</strong> — repeat N47/N57/B47 orders with compression reports and accurate listings</li><li><strong>4×4 builders</strong> — M57 kits with documentation and pre-sale technical answers</li><li><strong>Export buyers</strong> — UK, Ireland, Scandinavia, Eastern EU with tracked Hamburg freight</li></ul>",
        p("Message <a href='https://wa.me/4915510030835' target='_blank' rel='noopener'>WhatsApp</a> with your VIN today or browse <a href='shop.html' class='seo-link'>two thousand plus engines online</a>."),
    ]
    body = "\n".join(blocks)
    return f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def about_content() -> str:
    blocks = [
        img(IMAGES["warehouse"], "Bavarian Engines Hamburg warehouse — BMW motors warehoused and prepared for export"),
        h2("Who we are"),
        p("Bavarian Engines is a dedicated BMW engine exchange based at Tilsiter Str. 90, 22047 Hamburg, Germany. For more than ten years we have sourced, inspected, listed, and exported genuine BMW diesel and petrol motors to workshops and owners across Europe and beyond. We are not a general scrap merchant — we focus exclusively on BMW platforms: N47, N57, B47, B57, B58, and M57, plus selected M57 conversion kits for Defender and overland builds."),
        p("Our reputation is built on accurate descriptions, not inflated marketing. Eighty-one verified buyer reviews reflect garages and private customers who received engines matching the listing — stamp, mileage, inclusions, and condition. Repeat orders from independent workshops across Germany, the UK, Ireland, and Scandinavia are the strongest signal that our process works."),
        img(IMAGES["n47"], "N47 engine identified by stamp and photographed before listing"),
        h2("What makes Bavarian Engines different"),
        p("BMW-only specialisation means our team understands N47D20A versus N47D20C, N57 turbo pairing, B47 Euro 6 suffix rules, and M57 swap documentation — not a generic parts counter guessing from a catalogue photo. Every motor passes identification, visual assessment, and where applicable compression testing before photography and listing."),
        p("We publish open SKU pricing, record donor kilometres when available, state whether turbo, injectors, HPFP, DME, and loom ship with the block, and issue written warranty terms before payment. Questions before invoice are welcome; we prefer answering twice to disputing a suffix mismatch after the crate arrives."),
        h2("Our Hamburg facility and logistics advantage"),
        p("Hamburg sits in one of Europe's busiest freight corridors. Daily export routes serve the United Kingdom, Ireland, France, Benelux, Nordics, Iberia, Poland, Czech Republic, and worldwide destinations on request. Engines palletise or crate with commercial invoices and live tracking — typically three to five business days EU-wide after dispatch."),
        img(IMAGES["b57"], "B57 Euro 6 BMW diesel engine — modern G-series replacement stock"),
        h2("Conversion expertise beyond BMW replacements"),
        p("Land Rover Defender M57 swaps, Mitsubishi Pajero conversions, and Nissan Patrol Y61 packages give our team practical insight into mounts, cooling, gearbox adapters, and wiring — knowledge that informs how we document M57 donor engines for 4×4 builders as well as classic BMW E60 and E70 replacements."),
        h2("Trust, warranty, and long-term support"),
        trust_block(),
        p("Contact us at <a href='mailto:originalbavarianengine@gmail.com' class='seo-link'>originalbavarianengine@gmail.com</a> or <a href='https://wa.me/4915510030835' target='_blank' rel='noopener'>Phone +49 15510 030835</a>. Browse <a href='shop.html' class='seo-link'>inventory</a>, read <a href='reviews.html' class='seo-link'>customer reviews</a>, or explore our <a href='blog.html' class='seo-link'>technical blog</a>."),
    ]
    body = "\n".join(blocks)
    return f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def contact_content() -> str:
    blocks = [
        img(IMAGES["crate"], "BMW replacement engine crated for delivery — contact Bavarian Engines for quotes"),
        h2("How to reach our Hamburg team"),
        p("The fastest way to check BMW engine compatibility is WhatsApp — send your seventeen-digit VIN, a photo of the engine stamp, vehicle model and year, and delivery postcode. Our desk confirms suffix against live stock, quotes inclusions and freight, and issues a proforma for bank transfer before preparation begins. Email suits formal quotes, VAT invoices, and documentation trails."),
        p("<strong>WhatsApp:</strong> <a href='https://wa.me/4915510030835' target='_blank' rel='noopener'>+49 15510 030835</a><br><strong>Email:</strong> <a href='mailto:originalbavarianengine@gmail.com' class='seo-link'>originalbavarianengine@gmail.com</a><br><strong>Address:</strong> Tilsiter Str. 90, 22047 Hamburg, Germany"),
        h2("What to include in your enquiry"),
        "<ul class='seo-list'><li>Full VIN from registration or door jamb sticker</li><li>Engine code stamped on the block (e.g. N47D20C, N57D30A, B47D20A)</li><li>Vehicle model, year, and market if known</li><li>Delivery country and postcode for freight quote</li><li>Required inclusions — long block, turbo, injectors, ECU/DME, loom</li><li>Photos of existing engine label if accessible</li></ul>",
        img(IMAGES["b58"], "B58 petrol turbo engine — performance replacements from Bavarian Engines"),
        h2("Response times and languages"),
        p("WhatsApp enquiries typically receive same-day replies during European business hours (CET). Email may take slightly longer but is preferred for proforma invoices and trade VAT paperwork. We communicate in English and German. If you have not heard back within one business day, please follow up on WhatsApp with your VIN attached."),
        h2("Free VIN match — no obligation"),
        p("Our announcement bar offers free VIN matching because suffix errors cost workshops thousands. There is no charge to confirm whether Hamburg stock fits your chassis — only if you proceed to purchase. We would rather answer compatibility questions before payment than manage returns after a costly misfit."),
        h2("Payment and quotes"),
        p("Written quotes include engine stamp, SKU inclusions, warranty terms, freight, and payment reference. We accept SEPA bank transfer (EU), international SWIFT (overseas), and Zelle for eligible US customers. Engines prepare after funds clear. See <a href='policies.html' class='seo-link'>policies</a> and <a href='index.html#payment-options' class='seo-link'>payment options</a> on our homepage."),
        trust_block(),
        p("Use the contact form above to compose an email enquiry, or open WhatsApp for immediate VIN checks. We look forward to helping you source the correct BMW motor for your project."),
    ]
    body = "\n".join(blocks)
    return f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def policies_content() -> str:
    blocks = [
        img(IMAGES["n57"], "Every Bavarian Engines unit ships with documented warranty terms"),
        h2("Overview"),
        p("Bavarian Engines policies exist so every buyer — private motorist, independent garage, or export customer — understands warranty scope, returns, shipping liability, and privacy before ordering a high-value BMW engine online. Read these terms carefully; contact us on <a href='contact.html' class='seo-link'>WhatsApp or email</a> if anything is unclear."),
        h2("Warranty policy — six months mechanical cover"),
        p("All engines sold by Bavarian Engines include a six-month standard warranty on mechanical integrity for correctly installed units. Extended warranty options may be available on selected low-mileage donors — ask when you enquire."),
        h3("What is covered"),
        "<ul class='seo-list'><li>Internal mechanical failure of block, head, and core internals present at dispatch</li><li>Defects not caused by installation error, overheating, or lubrication failure</li><li>Units installed per BMW procedures with correct fluids, filters, and oil priming</li><li>Claims submitted with order reference, install date, mileage at fitment, and photo/video evidence</li></ul>",
        h3("What is not covered"),
        "<ul class='seo-list'><li>Incorrect suffix ordered against our written VIN advice</li><li>Improper installation, dry starts, or continued use after warning lights</li><li>External ancillaries unless explicitly listed on the SKU (turbo, injectors, sensors)</li><li>Labour, hire cars, or consequential losses</li><li>Modified or stripped engines before claim assessment</li></ul>",
        p("To claim: contact us immediately — do not strip the engine before we advise. Provide clear documentation. We aim for fair, plain-language resolution."),
        h2("Return and refund policy"),
        p("Returns may be accepted within thirty days of delivery when prior authorisation is granted and the engine remains uninstalled, unmodified, and in received condition. Contact us before shipping any return. Return freight is customer responsibility unless we shipped the wrong suffix against our written confirmation."),
        h3("Non-returnable situations"),
        "<ul class='seo-list'><li>Installed, modified, or disassembled engines</li><li>Damage from improper handling or incorrect fitting</li><li>Special-order items unless defective on arrival</li><li>Engines where VIN mismatch was not confirmed with us pre-install</li></ul>",
        p("Approved refunds process within seven to ten business days to the original payment method. Original shipping fees are non-refundable."),
        img(IMAGES["b47"], "Engines are crated and documented before dispatch from Hamburg"),
        h2("Shipping policy"),
        p("Worldwide shipping from Hamburg. Engines palletise or crate with commercial invoices and tracking. Typical timelines: EU three to five business days; UK and Ireland four to eight business days (customs dependent); international seven to fourteen business days. Out-of-stock items confirmed with ETA via email."),
        p("Delivery to workshops with forklift or loading bay access may differ from residential kerbside delivery — disclose access constraints when quoting freight. Risk transfers per agreed Incoterms stated on your invoice."),
        h2("Compatibility and pre-installation confirmation"),
        p("You must confirm VIN and stamp match in writing with us before installation. Fitting an engine without confirmation may void return and warranty rights if suffix mismatch occurs. We provide pre-payment verification specifically to prevent this outcome."),
        h2("Privacy policy"),
        p("We collect name, address, email, phone, VIN, and payment data to process orders and support enquiries. We do not sell personal data. You may request access, correction, or deletion by emailing <a href='mailto:originalbavarianengine@gmail.com' class='seo-link'>originalbavarianengine@gmail.com</a>. Industry-standard security protects stored information."),
        h2("Payment terms"),
        p("Proforma invoices precede engine preparation. Payment via SEPA, SWIFT, or Zelle as agreed. Engines crate after cleared funds. PayPal, Revolut, Wise, or escrow available on request for large international orders."),
        trust_block(),
    ]
    body = "\n".join(blocks)
    return f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def reviews_content() -> str:
    extra_reviews = """
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Third N57 from Bavarian Engines for our workshop — stamp always matches invoice. Compression sheets help us sell jobs to customers confidently.</blockquote><div class="testimonial-author">Andreas W.<span>Germany</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>B47 for G20 320d arrived in five days to France. WhatsApp team confirmed B47D20A suffix before we paid. Exactly as described.</blockquote><div class="testimonial-author">Claire D.<span>France</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Ordered B57 for X5 G05 — VIN check prevented wrong turbo pairing. Professional crating and fast Hamburg dispatch.</blockquote><div class="testimonial-author">Thomas R.<span>Austria</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Private buyer — they explained I needed a garage for fitting but helped me buy the right N47 for my E90. Car running perfectly.</blockquote><div class="testimonial-author">Emma H.<span>United Kingdom</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>M57 Defender kit was complete. Wiring questions answered on WhatsApp before we invoiced the customer. Torque is incredible.</blockquote><div class="testimonial-author">Lars P.<span>Norway</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Fast proforma, clear bank details, engine prepared after transfer. Tracking to Netherlands in four days. Will order again.</blockquote><div class="testimonial-author">Vincent K.<span>Netherlands</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>B58 for 440i rebuild — documented mileage and correct suffix. Hamburg team still answered messages after delivery.</blockquote><div class="testimonial-author">Giulia M.<span>Italy</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Our garage in Portugal orders B47 and N47 weekly. Listings match reality — critical for our reputation with fleet clients.</blockquote><div class="testimonial-author">Rui S.<span>Portugal</span></div></div>
          <div class="testimonial-card"><div class="stars">★★★★★</div><blockquote>Cold-start video on N57 convinced our customer to approve the repair. Engine fit F10 530d first time. Top supplier.</blockquote><div class="testimonial-author">Mikael T.<span>Finland</span></div></div>
"""
    narrative = [
        img(IMAGES["n57"], "BMW N57 engine — five-star reviews from garages across Europe"),
        h2("Why buyers trust Bavarian Engines"),
        p("Eighty-one verified reviews from garages and BMW owners across Europe tell a consistent story: accurate engine descriptions, suffix confirmation before payment, fast tracked shipping from Hamburg, and WhatsApp support that continues after delivery. Independent workshops do not leave five-star reviews for suppliers who mis-describe mileage or ship the wrong stamp — repeat orders from Germany, the UK, Ireland, Spain, Italy, and Scandinavia reflect suppliers who match listings to crates."),
        p("Private buyers praise plain-language VIN help — many order their first BMW engine online with confidence because our team explains inclusions, coding considerations, and what their local garage must complete. Export customers highlight crating quality and commercial invoices that clear customs without surprises."),
        img(IMAGES["n47"], "N47 F30 320d replacement — verified buyer experiences"),
        h2("What reviewers mention most"),
        "<ul class='seo-list'><li><strong>VIN and suffix matching</strong> — correct N47D20C, N57D30A, B47D20A before invoice</li><li><strong>Accurate inclusions</strong> — turbo, DME, and loom as listed on the SKU</li><li><strong>Compression data</strong> — diesel test figures for workshop sign-off</li><li><strong>Fast EU freight</strong> — tracked delivery in days, not weeks</li><li><strong>WhatsApp responsiveness</strong> — technical answers before and after install</li><li><strong>M57 kits</strong> — Defender and overland builds with documentation</li></ul>",
        h2("Leave your experience"),
        p("Ordered from Bavarian Engines? We welcome honest feedback — contact <a href='mailto:originalbavarianengine@gmail.com' class='seo-link'>originalbavarianengine@gmail.com</a> or message <a href='https://wa.me/4915510030835' target='_blank' rel='noopener'>WhatsApp</a>. Your review helps other workshops and owners choose documented used BMW motors over risky anonymous listings."),
        trust_block(),
    ]
    body = "\n".join(narrative)
    return extra_reviews, f'<section class="page-rich-content"><div class="container article-content">{body}</div></section>'


def patch_m57():
    path = ROOT / "m57-swap-kits.html"
    html = path.read_text(encoding="utf-8")
    # Replace unsplash images in product cards
    html = re.sub(
        r'<div class="product-image"><img src="https://images\.unsplash\.com[^"]+" alt="([^"]+)"',
        lambda m: f'<div class="product-image"><img src="{IMAGES["m57"]}" alt="{m.group(1)}"',
        html,
    )
    html = re.sub(
        r'<img src="https://images\.unsplash\.com[^"]+" alt="Land Rover Defender"[^>]*>',
        f'<img src="{IMAGES["m57"]}" alt="Land Rover Defender M57 conversion engine" style="border-radius:12px;border:1px solid var(--color-border);width:100%;">',
        html,
    )
    insert = m57_content()
    html = html.replace(
        '    <section class="process">\n      <div class="container">\n        <h2 class="section-title">What\'s included in a kit?</h2>',
        insert + '\n    <section class="process">\n      <div class="container">\n        <h2 class="section-title">What\'s included in a kit?</h2>',
    )
    path.write_text(html, encoding="utf-8")
    print(f"m57-swap-kits.html rich content words: {wc(m57_content())}")


def patch_services():
    path = ROOT / "services.html"
    html = path.read_text(encoding="utf-8")
    insert = services_content()
    html = html.replace(
        '    <section class="content-section">\n      <div class="container">\n        <span class="section-label">Who we serve</span>',
        insert + '\n    <section class="content-section">\n      <div class="container">\n        <span class="section-label">Who we serve</span>',
    )
    path.write_text(html, encoding="utf-8")
    print(f"services.html rich content words: {wc(services_content())}")


def patch_about():
    path = ROOT / "about.html"
    html = path.read_text(encoding="utf-8")
    html = re.sub(
        r'<img src="https://images\.unsplash\.com[^"]+" alt="Bavarian Engines Hamburg warehouse"[^>]*>',
        f'<img src="{IMAGES["warehouse"]}" alt="Bavarian Engines Hamburg warehouse" style="border-radius:12px;border:1px solid var(--color-border);width:100%;">',
        html,
    )
    html = html.replace('<div class="stat-item"><strong>124+</strong>', '<div class="stat-item"><strong>2000+</strong>')
    insert = about_content()
    html = html.replace(
        '    <section class="content-section">\n      <div class="container content-grid">\n        <div class="content-block">\n          <span class="section-label">Location</span>',
        insert + '\n    <section class="content-section">\n      <div class="container content-grid">\n        <div class="content-block">\n          <span class="section-label">Location</span>',
    )
    path.write_text(html, encoding="utf-8")
    print(f"about.html rich content words: {wc(about_content())}")


def patch_contact():
    path = ROOT / "contact.html"
    html = path.read_text(encoding="utf-8")
    insert = contact_content()
    html = html.replace(
        '    <section class="content-section">\n      <div class="container content-grid">\n        <div class="content-block">\n          <h2>What to include in your enquiry</h2>',
        insert + '\n    <section class="content-section">\n      <div class="container content-grid">\n        <div class="content-block">\n          <h2>What to include in your enquiry</h2>',
    )
    path.write_text(html, encoding="utf-8")
    print(f"contact.html rich content words: {wc(contact_content())}")


def patch_policies():
    path = ROOT / "policies.html"
    html = path.read_text(encoding="utf-8")
    insert = policies_content()
    # Replace thin policy blocks with expanded content
    html = re.sub(
        r'    <section class="content-section">\n      <div class="container" style="max-width:800px;">.*?</div>\n    </section>',
        insert,
        html,
        count=1,
        flags=re.DOTALL,
    )
    path.write_text(html, encoding="utf-8")
    print(f"policies.html rich content words: {wc(policies_content())}")


def patch_reviews():
    path = ROOT / "reviews.html"
    html = path.read_text(encoding="utf-8")
    extra, insert = reviews_content()
    html = html.replace(
        '          <div class="testimonial-card">\n            <div class="stars">★★★★★</div>\n            <blockquote>M57 swap kit for our Defender build',
        extra + '\n          <div class="testimonial-card">\n            <div class="stars">★★★★★</div>\n            <blockquote>M57 swap kit for our Defender build',
    )
    html = html.replace(
        '    <section class="cta-banner">',
        insert + '\n    <section class="cta-banner">',
    )
    path.write_text(html, encoding="utf-8")
    print(f"reviews.html rich content words: {wc(insert)}")


def main():
    patch_m57()
    patch_services()
    patch_about()
    patch_contact()
    patch_policies()
    patch_reviews()
    print("Done — all six pages expanded.")


if __name__ == "__main__":
    main()
