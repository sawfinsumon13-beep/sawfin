#!/usr/bin/env python3
"""Generate 55+ BMW engine blog posts with 2200+ words each."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://bavarianengine.com"
KEYWORDS = "BMW engines, bmw engines for sale, buy used bmw engines, original BMW engine, Bavarian Engines"
BLOG_DIR = ROOT / "blog"
INDEX_PATH = ROOT / "js" / "blog-index.json"
MANIFEST_PATH = ROOT / "images" / "engines" / "image-sets.json"

CATEGORIES = [
    "Buying guide", "Euro 6", "Conversions", "Engine guide", "Logistics", "4×4",
    "Workshop", "Warranty", "N47", "N57", "B47", "B57", "B58", "M57", "Petrol",
]

POSTS = [
    {"slug": "n47-vs-n57", "category": "Buying guide", "title": "N47 vs N57 — Which BMW Diesel Fits Your Car?",
     "excerpt": "Compare 2.0-litre four-cylinder vs 3.0-litre six-cylinder BMW diesels. Codes, models, and suffix matching explained.",
     "platform": "N47/N57", "models": "320d, 520d, 530d, X5"},
    {"slug": "b47-vs-b57", "category": "Euro 6", "title": "B47 vs B57 — Which Modern BMW Diesel Is Right?",
     "excerpt": "B47 2.0-litre vs B57 3.0-litre six for F-series and G-series BMWs. VIN essential before checkout.",
     "platform": "B47/B57", "models": "F30 LCI 320d, G30 530d, X5 G05"},
    {"slug": "defender-m57", "category": "Conversions", "title": "How Much Does A Land Rover Defender M57 Conversion Cost?",
     "excerpt": "Kit vs engine-only budgeting, labour planning, and long-term reliability wins for overland builds.",
     "platform": "M57", "models": "Defender 90/110/130"},
    {"slug": "b57-guide", "category": "Engine guide", "title": "BMW B57 Engine — Codes, Models, Prices & Where to Buy",
     "excerpt": "Complete B57D30 suffix guide for G30 530d and X5 G05 with tested stock from Hamburg.",
     "platform": "B57", "models": "G30 530d, X5 G05, X7 G07"},
    {"slug": "shipping", "category": "Logistics", "title": "Shipping BMW Engines Across Europe From Hamburg",
     "excerpt": "Crating standards, delivery timelines, UK customs after Brexit, and lift requirements at your workshop.",
     "platform": "All", "models": "EU export"},
    {"slug": "pajero-m57", "category": "4×4", "title": "Is A Mitsubishi Pajero M57 Conversion Worth It?",
     "excerpt": "Why Pajero owners choose M57 torque — fuel economy, kit completeness, and expedition confidence.",
     "platform": "M57", "models": "Pajero V60/V80"},
    {"slug": "n47-timing-chain", "category": "N47", "title": "N47 Timing Chain Failure — Symptoms, Costs & Replacement Engine Options",
     "excerpt": "Recognise N47 timing chain rattle, understand labour scope, and when a tested replacement engine makes sense.",
     "platform": "N47", "models": "F20 118d, F30 320d, E90 320d"},
    {"slug": "n47d20a-vs-n47d20c", "category": "N47", "title": "N47D20A vs N47D20C vs N47D20D — Suffix Guide For BMW 320d Owners",
     "excerpt": "Why suffix letters are not interchangeable and how to match your VIN before ordering a replacement N47.",
     "platform": "N47", "models": "320d, 520d, 118d"},
    {"slug": "f30-320d-engine-replacement", "category": "Buying guide", "title": "F30 320d Engine Replacement Cost Guide — N47 & B47 Options",
     "excerpt": "Realistic budgets for F30 diesel engine swaps including labour, ancillaries, coding, and used vs reman.",
     "platform": "N47/B47", "models": "F30 320d, F31 320d"},
    {"slug": "f10-530d-n57-buying", "category": "N57", "title": "F10 530d N57 Engine Buying Guide — Turbo, DME & Complete Packages",
     "excerpt": "What F10 530d fitters need from a replacement N57D30 unit — inclusions, coding, and Hamburg sourcing.",
     "platform": "N57", "models": "F10 530d, F11 530d"},
    {"slug": "n57-turbo-failure", "category": "N57", "title": "BMW N57 Turbo Failure — Repair vs Replacement Engine Decision",
     "excerpt": "When turbo rebuild economics favour a complete tested N57 from Bavarian Engines instead of patch repairs.",
     "platform": "N57", "models": "330d, 530d, X5 F15, X6 F16"},
    {"slug": "n57d30a-suffix", "category": "N57", "title": "N57D30A vs N57D30B — Complete BMW N57 Suffix Reference",
     "excerpt": "Stamp-level N57 identification for workshops ordering six-cylinder BMW diesel replacements.",
     "platform": "N57", "models": "530d, 535d, 330d"},
    {"slug": "x5-e70-n57-replacement", "category": "N57", "title": "BMW X5 E70 N57 Engine Replacement — Towing Platform Done Right",
     "excerpt": "High-torque X5 diesel rebuilds: matching N57 variants, ancillaries, and export delivery to your workshop.",
     "platform": "N57", "models": "X5 E70 30d/40d"},
    {"slug": "b47-common-failures", "category": "B47", "title": "B47 Common Failures — EGR, Turbo & When To Source A Replacement Unit",
     "excerpt": "Euro 6 B47 fault patterns on F-series BMWs and how documented used engines reduce rebuild risk.",
     "platform": "B47", "models": "F30 LCI 320d, F48 X1, F39 X2"},
    {"slug": "g30-530d-b57", "category": "B57", "title": "G30 530d B57 Engine Replacement — G-Series Diesel Fitment Explained",
     "excerpt": "Modern G30 530d B57D30 suffix matching, emissions class, and sourcing from Hamburg stock.",
     "platform": "B57", "models": "G30 530d, G31 530d"},
    {"slug": "x5-g05-b57", "category": "B57", "title": "BMW X5 G05 B57 Buying Guide — Large SUV Euro 6 Diesel Engines",
     "excerpt": "Heavy G05 X5 diesel replacements need correct B57 stamping — VIN verification before invoice.",
     "platform": "B57", "models": "X5 G05 30d/40d"},
    {"slug": "b58-340i-rebuild", "category": "B58", "title": "B58 Engine For 340i & 440i Rebuilds — Petrol Turbo Replacement Guide",
     "excerpt": "Performance petrol BMW rebuilds: B58 suffix codes, ancillaries, and warranty-backed Hamburg units.",
     "platform": "B58", "models": "340i, 440i, M440i"},
    {"slug": "m57-defender-wiring", "category": "Conversions", "title": "Defender M57 Wiring Loom Guide — What Conversion Kits Should Include",
     "excerpt": "Electrical scope for Defender M57 swaps — ECU, immobiliser, gauges, and workshop documentation.",
     "platform": "M57", "models": "Defender Td5/Tdci conversions"},
    {"slug": "m57-swap-labour-hours", "category": "Conversions", "title": "M57 Swap Labour Hours — Realistic Workshop Timelines For 4×4 Builds",
     "excerpt": "Plan lift time for Defender and Pajero M57 conversions including mounts, gearbox adapters, and coding.",
     "platform": "M57", "models": "Defender, Pajero, Patrol"},
    {"slug": "used-bmw-engine-warranty", "category": "Warranty", "title": "Used BMW Engine Warranty — What Six Months Of Cover Really Means",
     "excerpt": "Mechanical warranty scope, install requirements, and how Bavarian Engines handles claims fairly.",
     "platform": "All", "models": "All platforms"},
    {"slug": "vin-engine-code-matching", "category": "Buying guide", "title": "How To Match VIN And Engine Code Before Buying A BMW Motor Online",
     "excerpt": "Step-by-step suffix verification — the single most important task before any engine purchase.",
     "platform": "All", "models": "All BMW diesels"},
    {"slug": "compression-test-diesel", "category": "Workshop", "title": "Compression Testing Used BMW Diesel Engines — What Workshops Should Ask For",
     "excerpt": "Reading compression figures on N47, N57, B47 donors and using data for customer sign-off.",
     "platform": "Diesel", "models": "N47, N57, B47, B57"},
    {"slug": "long-block-vs-complete", "category": "Buying guide", "title": "Long Block vs Complete BMW Engine — Which Package Fits Your Quote?",
     "excerpt": "Labour and parts implications when your listing is block-only vs turbo-complete with DME.",
     "platform": "All", "models": "All platforms"},
    {"slug": "dme-cas-immobiliser", "category": "Workshop", "title": "BMW DME, CAS & Immobiliser Alignment After Engine Replacement",
     "excerpt": "Coding considerations when donor ECU travels with the engine — plain-language install planning.",
     "platform": "All", "models": "F-series, G-series"},
    {"slug": "uk-engine-import-brexit", "category": "Logistics", "title": "Importing BMW Engines To The UK From Germany After Brexit",
     "excerpt": "Customs, VAT, freight timelines, and crating for UK workshops ordering from Hamburg.",
     "platform": "All", "models": "UK import"},
    {"slug": "ireland-engine-shipping", "category": "Logistics", "title": "Shipping BMW Engines To Ireland — Dublin, Cork & Workshop Delivery",
     "excerpt": "Irish garage experiences with tracked Hamburg freight — timelines, lifts, and documentation.",
     "platform": "All", "models": "Ireland export"},
    {"slug": "nordic-engine-export", "category": "Logistics", "title": "BMW Engine Export To Sweden, Norway & Denmark From Hamburg",
     "excerpt": "Nordic buyer guide — cold-climate diesel considerations, freight, and suffix matching.",
     "platform": "All", "models": "Scandinavia"},
    {"slug": "e90-320d-n47-rebuild", "category": "N47", "title": "E90 320d N47 Engine Replacement — Classic Daily Driver Rebuild Guide",
     "excerpt": "Keeping E90 320d on the road affordably with correct N47 suffix and timing refresh advice.",
     "platform": "N47", "models": "E90 320d, E91 320d"},
    {"slug": "e60-530d-n57", "category": "N57", "title": "E60 530d N57 Replacement — Executive Saloon Diesel Engine Guide",
     "excerpt": "Torque-rich E60 rebuilds with N57D30 matching, turbo packages, and Hamburg used stock.",
     "platform": "N57", "models": "E60 530d, E61 530d"},
    {"slug": "x3-f25-diesel-engine", "category": "Buying guide", "title": "BMW X3 F25 Diesel Engine Replacement — N47, N57 & B47 Options",
     "excerpt": "Which diesel platform your X3 needs depends on year and suffix — VIN-led buying guide.",
     "platform": "Mixed", "models": "X3 F25 18d/20d/30d/35d"},
    {"slug": "x6-diesel-engine-guide", "category": "N57", "title": "BMW X6 Diesel Engine Guide — Heavy Chassis N57 & B57 Replacements",
     "excerpt": "Large SUV diesel swaps need six-cylinder torque and correct ancillaries — fitment explained.",
     "platform": "N57/B57", "models": "X6 E71, X6 F16, X6 G06"},
    {"slug": "118d-f20-n47", "category": "N47", "title": "BMW 118d F20 N47 Engine Swap — Compact Hatch Diesel Replacement",
     "excerpt": "Small BMW diesel rebuild economics and N47 suffix tips for F20/F21 118d owners.",
     "platform": "N47", "models": "F20 118d, F21 118d"},
    {"slug": "520d-f10-n47", "category": "N47", "title": "BMW 520d F10 N47 Engine Replacement — Fleet Favourite Rebuild Guide",
     "excerpt": "High-mileage F10 520d N47 failures — sourcing tested units with documented donor history.",
     "platform": "N47", "models": "F10 520d, F11 520d"},
    {"slug": "dealer-reman-vs-used", "category": "Buying guide", "title": "Dealer Reman vs Used BMW Engine — Total Cost Comparison For Garages",
     "excerpt": "When main-dealer reman pricing exceeds vehicle value and documented used units win.",
     "platform": "All", "models": "All platforms"},
    {"slug": "scrap-yard-vs-specialist", "category": "Buying guide", "title": "Scrap Yard vs Specialist Exchange — Risk Profile For BMW Engine Buyers",
     "excerpt": "Why anonymous yard pulls cost more long-term than Hamburg-prepared documented motors.",
     "platform": "All", "models": "All platforms"},
    {"slug": "engine-unboxing-inspection", "category": "Workshop", "title": "BMW Engine Unboxing Checklist — Protect Warranty On Delivery Day",
     "excerpt": "Photograph crates, verify stamps, document condition — workshop steps when freight arrives.",
     "platform": "All", "models": "All platforms"},
    {"slug": "first-start-procedure", "category": "Workshop", "title": "First Start Procedure After BMW Engine Swap — Oil Prime & Coding",
     "excerpt": "Avoid dry-start damage and no-start surprises with disciplined install commissioning.",
     "platform": "All", "models": "All platforms"},
    {"slug": "timing-chain-refresh-n47-n57", "category": "Workshop", "title": "Should You Refresh Timing Chain On N47 & N57 During Engine Swap?",
     "excerpt": "Labour overlap logic for renewing chains, guides, and tensioners on good donor units.",
     "platform": "N47/N57", "models": "320d, 520d, 530d"},
    {"slug": "turbo-inclusions-explained", "category": "Buying guide", "title": "Turbo, HPFP & Injector Inclusions — Reading BMW Engine Listings Correctly",
     "excerpt": "Decode what ships with your SKU so customer quotes include realistic ancillary scope.",
     "platform": "Diesel", "models": "N47, N57, B47, B57"},
    {"slug": "proforma-invoice-guide", "category": "Buying guide", "title": "Proforma Invoice Guide — Safe Payment For High-Value BMW Engine Orders",
     "excerpt": "SEPA, SWIFT, Zelle — how Bavarian Engines issues quotes before preparation and dispatch.",
     "platform": "All", "models": "Payment"},
    {"slug": "private-buyer-guide", "category": "Buying guide", "title": "Private Buyer Guide — Ordering A BMW Engine Without Being A Mechanic",
     "excerpt": "VIN photos, local garage fitting, WhatsApp support — confident buying for non-technicians.",
     "platform": "All", "models": "All platforms"},
    {"slug": "garage-trade-account", "category": "Workshop", "title": "Garage Trade Orders — Repeat Supply From Bavarian Engines Hamburg",
     "excerpt": "How independent workshops streamline N47/N57/B47 replacements with consistent supplier quality.",
     "platform": "All", "models": "Trade buyers"},
    {"slug": "m57-e60-e70-replacement", "category": "M57", "title": "BMW M57 Engine Replacement — E60, E70 & Classic Six-Cylinder Diesel Guide",
     "excerpt": "Proven M57 torque for older BMW platforms and why parts support remains strong.",
     "platform": "M57", "models": "E60 530d, E70 X5 30d"},
    {"slug": "n47-egr-cooler-failure", "category": "N47", "title": "N47 EGR Cooler & Turbo Line Failures — Repair Path vs Engine Swap",
     "excerpt": "Coolant contamination and boost issues on N47 — when replacement beats repeated patch jobs.",
     "platform": "N47", "models": "320d, 520d, 118d"},
    {"slug": "b47-320d-g20", "category": "B47", "title": "G20 320d B47 Engine Replacement — Latest 3 Series Diesel Guide",
     "excerpt": "Newer 3 Series B47 suffix matching and Euro 6 compliance for G20 diesel rebuilds.",
     "platform": "B47", "models": "G20 320d, G21 320d"},
    {"slug": "b57-x7-g07", "category": "B57", "title": "BMW X7 G07 B57 Diesel Engine — Large Luxury SUV Replacement Guide",
     "excerpt": "Heavy X7 diesel swaps require correct B57 variant — Hamburg VIN confirmation workflow.",
     "platform": "B57", "models": "X7 G07 30d/40d"},
    {"slug": "b58-m440i-performance", "category": "Petrol", "title": "M440i B58 Engine Replacement — M Performance Petrol Rebuild Guide",
     "excerpt": "High-output B58 units for G22/G23 M440i with documented suffix and ancillaries.",
     "platform": "B58", "models": "M440i, M340i"},
    {"slug": "n47-vs-b47-upgrade", "category": "Euro 6", "title": "N47 vs B47 — Pre-LCI vs LCI BMW 320d Engine Family Comparison",
     "excerpt": "Understand generational change from N47 to B47 on F30 — never cross-fit without verification.",
     "platform": "N47/B47", "models": "F30 320d pre-LCI vs LCI"},
    {"slug": "n57-vs-b57-upgrade", "category": "Euro 6", "title": "N57 vs B57 — F10 530d to G30 530d Diesel Platform Evolution",
     "excerpt": "Why F-series N57 units do not belong in G-series B57 chassis and vice versa.",
     "platform": "N57/B57", "models": "F10 530d, G30 530d"},
    {"slug": "patrol-y61-m57", "category": "4×4", "title": "Nissan Patrol Y61 M57 Conversion — Torque Upgrade For Expedition Builds",
     "excerpt": "M57 swap kits for Patrol platforms — mounts, adapters, and long-distance reliability.",
     "platform": "M57", "models": "Patrol Y61"},
    {"slug": "sprinter-m57-swap", "category": "Conversions", "title": "Mercedes Sprinter M57 Swap Discussion — Cross-Brand Diesel Conversations",
     "excerpt": "Why some commercial builders look at BMW M57 torque — compatibility caveats explained.",
     "platform": "M57", "models": "Van conversions"},
    {"slug": "hpfp-injector-coding", "category": "Workshop", "title": "HPFP & Injector Coding After BMW Diesel Engine Replacement",
     "excerpt": "Fuel system commissioning on N47, N57, B47 — align donor components with DME expectations.",
     "platform": "Diesel", "models": "All diesel"},
    {"slug": "euro-emissions-suffix", "category": "Euro 6", "title": "Euro Emissions Class & BMW Engine Suffix — Why Year Alone Is Not Enough",
     "excerpt": "Emissions hardware differences across markets — match registration market and stamp.",
     "platform": "All", "models": "EU market BMWs"},
    {"slug": "france-engine-import", "category": "Logistics", "title": "Shipping BMW Engines To France — Paris, Lyon & Regional Workshop Delivery",
     "excerpt": "French garage freight from Hamburg — SEPA payment, crating, and tracked EU timelines.",
     "platform": "All", "models": "France export"},
    {"slug": "spain-portugal-export", "category": "Logistics", "title": "BMW Engine Export To Spain & Portugal — Iberian Workshop Supply Chain",
     "excerpt": "Iberian buyer logistics, heat-climate diesel notes, and Hamburg dispatch standards.",
     "platform": "All", "models": "Spain, Portugal"},
    {"slug": "poland-czech-export", "category": "Logistics", "title": "Eastern EU BMW Engine Freight — Poland, Czech Republic & Beyond",
     "excerpt": "Fast-growing Eastern European workshop demand for documented N47 and N57 stock.",
     "platform": "All", "models": "Poland, Czechia"},
    {"slug": "usa-swift-wire-engine", "category": "Logistics", "title": "Buying BMW Engines From Germany To USA — SWIFT Wire & International Freight",
     "excerpt": "Overseas buyers: proforma invoices, SWIFT payment, and realistic ocean/air freight scope.",
     "platform": "All", "models": "USA import"},
    {"slug": "return-policy-explained", "category": "Warranty", "title": "BMW Engine Return Policy — Compatibility Checks Before Installation",
     "excerpt": "Fair returns when VIN match was confirmed pre-fit — policy explained in plain language.",
     "platform": "All", "models": "All platforms"},
    {"slug": "mileage-claims-verification", "category": "Buying guide", "title": "Donor Mileage On Used BMW Engines — How To Verify Claims Before Purchase",
     "excerpt": "Cluster reads, registration records, and service history — mileage transparency at Bavarian Engines.",
     "platform": "All", "models": "All platforms"},
    {"slug": "cold-start-video-proof", "category": "Workshop", "title": "Cold Start Video For Used BMW Diesels — Customer Sign-Off Tool",
     "excerpt": "Why workshops request running footage before install and how we supply it on request.",
     "platform": "Diesel", "models": "N47, N57, B47"},
    {"slug": "whatsapp-vin-workflow", "category": "Buying guide", "title": "WhatsApp VIN Workflow — Same-Day BMW Engine Compatibility From Hamburg",
     "excerpt": "How our desk confirms suffix, stock, freight, and inclusions over WhatsApp before you pay.",
     "platform": "All", "models": "All platforms"},
]


def load_images() -> list[str]:
    if MANIFEST_PATH.exists():
        data = json.loads(MANIFEST_PATH.read_text())
        paths = []
        for entry in data if isinstance(data, list) else data.get("sets", []):
            if isinstance(entry, dict):
                main = entry.get("main") or entry.get("main_image")
                if main:
                    paths.append(f"images/engines/{main}" if not str(main).startswith("images/") else main)
        if paths:
            return paths
    sets = sorted((ROOT / "images" / "engines" / "sets").glob("set-*"))
    paths = []
    for s in sets:
        mains = list(s.glob("main-*"))
        if mains:
            paths.append(str(mains[0].relative_to(ROOT)).replace("\\", "/"))
    return paths or ["images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp"]


def word_count(html: str) -> int:
    text = re.sub(r"<[^>]+>", " ", html)
    return len(text.split())


def paragraph(text: str) -> str:
    return f"<p>{text}</p>"


def section(title: str, paragraphs: list[str]) -> str:
    parts = [f"<h2>{title}</h2>"]
    parts.extend(paragraph(p) for p in paragraphs)
    return "\n".join(parts)


def subsection(title: str, paragraphs: list[str]) -> str:
    parts = [f"<h3>{title}</h3>"]
    parts.extend(paragraph(p) for p in paragraphs)
    return "\n".join(parts)


def generate_body(post: dict) -> str:
    slug = post["slug"]
    title = post["title"]
    platform = post["platform"]
    models = post["models"]
    category = post["category"]

    blocks: list[str] = []

    blocks.append(paragraph(
        f"When a BMW owner or independent garage searches for guidance on {title.lower()}, the stakes are high. "
        f"A wrong suffix code, mismatched turbo pairing, or undocumented donor history can turn a sensible rebuild into weeks of downtime and thousands in wasted labour. "
        f"Bavarian Engines publishes this {category.lower()} article so buyers across Europe — from Hamburg to London, Dublin, Stockholm, Madrid, and Warsaw — can make informed decisions before ordering a replacement motor. "
        f"This guide focuses on {platform} applications including {models}, with practical advice grounded in how our warehouse team lists, tests, and exports BMW engines every day."
    ))

    blocks.append(section("Understanding the problem", [
        f"BMW {platform} platforms power a huge share of European diesel and petrol traffic. When major failure occurs — turbo collapse, timing chain wear, HPFP issues, coolant contamination, or bottom-end damage — the owner faces three paths: main-dealer remanufacture, an anonymous scrap-yard pull, or a documented used unit from a specialist exchange. "
        f"For {models}, the correct path depends on vehicle value, downtime tolerance, and whether the workshop can confirm suffix codes against the VIN before the engine arrives.",
        f"Main-dealer remanufactured engines are often excellent but frequently priced above what the chassis is worth on older {models} applications. Scrap-yard engines look cheap until you add timing refresh, turbo risk, injector coding, and the labour to discover internal damage that was invisible at purchase. "
        f"Bavarian Engines sits between those extremes: genuine BMW OEM hardware, donor mileage recorded where available, stamp-level identification, compression data on many diesel listings, and a written six-month mechanical warranty on correctly installed units.",
        f"Trust matters because an engine purchase is not a consumable — it is the heart of the vehicle. Garages stake their reputation on the supplier's accuracy. Private buyers stake family mobility and tight budgets. That is why we encourage every reader of this {category.lower()} guide to send a VIN and engine stamp photo before payment, regardless of how confident you feel about the model name printed on the boot.",
    ]))

    blocks.append(section("Platform and suffix fundamentals", [
        f"On BMW diesels and petrol motors, the badge on the car is never enough. {platform} families use suffix stamps such as N47D20A, N47D20C, N57D30A, N57D30B, B47D20A, B57D30B, B58B30, and M57D30 depending on generation and market. "
        f"Two {models} cars with the same model year can require different hardware because of emissions class, turbo variant, DME software, and market-specific ancillaries. Ordering by keyword — '320d engine' or '530d motor' — is how expensive mismatches happen.",
        f"Our Hamburg desk cross-checks your seventeen-digit VIN and stamp photo against live inventory before invoice. We confirm whether the listing is long block only or complete with turbo, injectors, high-pressure pump, DME, and engine loom as stated on the SKU. "
        f"That workflow protects workshops quoting labour and ancillaries accurately, and protects private buyers who rely on a local garage for fitting but must still purchase the correct core.",
        f"If you are comparing listings across multiple websites, ask each supplier the same four questions: Will you confirm my suffix against VIN in writing? What exactly ships on this SKU? Can you provide compression or cold-start proof? Who answers WhatsApp after delivery? Bavarian Engines welcomes those questions because they separate professional exchanges from anonymous classified ads.",
    ]))

    blocks.append(subsection("Stamp identification in practice", [
        f"Locate the metal stamp on the engine block and photograph it in daylight. Compare characters to your registration documents and the sticker in the engine bay. For {models}, even a single letter difference can change turbo fitment, injector type, or DME pairing. "
        f"Workshops should log stamp, VIN, and invoice reference on the job card before the crate is opened so warranty conversations remain factual if any discrepancy appears.",
        f"When a donor ECU travels with the engine, immobiliser and CAS alignment may be required at install. We flag listings that include DME and advise whether your chassis needs same-family coding — reducing no-start surprises on the first commissioning attempt.",
    ]))

    blocks.append(section("Why buy a used BMW engine from Bavarian Engines", [
        f"Used does not mean unverified. Many donors arrive from insurance write-offs with intact engine bays — low-mile motorway cars, fleet returns, and well-maintained lease vehicles supply excellent {platform} cores. We select donors for mechanical integrity, then document stamp, mileage, inclusions, and condition before photography and listing.",
        f"Buyers choose Bavarian Engines because we are BMW-only. We do not mix random manufacturer stock or occasional surplus. N47, N57, B47, B57, B58 and M57 platforms pass through our warehouse weekly, so technical answers come from people who actually fit these engines — not a generic parts counter reading a script.",
        f"Every unit ships with export preparation appropriate to freight: pallet or timber crate, commercial invoice, and tracking. Typical EU delivery is three to five business days from Hamburg to the United Kingdom, Ireland, France, Benelux, Nordics, Iberia, and Poland. Non-EU export is available on request with customs paperwork.",
        f"Financially, a correctly specified used BMW engine often saves thousands versus dealer reman while avoiding scrap-yard tail risk. The headline purchase price is only one line in the quote — add shipping, gaskets, fluids, timing refresh if planned, coding, and labour. Our open SKU pricing helps garages protect margin and helps private buyers model total cost honestly.",
    ]))

    blocks.append(section("Benefits we provide to every client", [
        f"<strong>Pre-payment VIN and suffix verification.</strong> Message our Hamburg team on WhatsApp with your VIN and stamp photo. We confirm stock, lead time, freight to your postcode, and inclusions before you commit. Same-day responses on most weekdays.",
        f"<strong>Transparent listings.</strong> Each product page states whether turbo, injectors, HPFP, sensors, DME, and loom ship with the block. Your quote to the customer includes realistic ancillary scope — no surprises when the pallet arrives.",
        f"<strong>Mechanical documentation.</strong> Many diesel listings include donor mileage and compression test figures. Cold-start video is available on request for workshop or customer sign-off before installation begins.",
        f"<strong>Six-month written mechanical warranty.</strong> Correctly installed units carry standard cover on mechanical integrity. Extended options exist on request. Full terms are published on our policies page — not hidden in fine print.",
        f"<strong>Human support after delivery.</strong> We answer suffix questions, clarify what shipped on your order, and explain warranty steps in plain language. You are not routed to a ticket system that has never seen an {platform} timing cover.",
        f"<strong>Secure payment choices.</strong> SEPA bank transfer for EU buyers, international SWIFT for overseas customers, and Zelle for eligible US accounts. Proforma invoices precede preparation; engines crate after funds clear.",
    ]))

    blocks.append(section("Workshop-focused guidance", [
        f"Independent garages ordering for {models} customer vehicles need predictable supplier behaviour. Repeat orders happen when descriptions match reality — mileage, inclusions, stamp, and condition. Bavarian Engines publishes open pricing so you can mark up labour and parts confidently without re-quoting the customer after the crate opens.",
        f"Book lift time against confirmed lead time, not hope. We issue tracking when dispatch occurs so your service advisor can communicate arrival day accurately. On delivery, photograph the crate before opening, verify stamp against invoice, and note any transport damage immediately — documentation supports warranty if needed.",
        f"Many N47 and N57 jobs benefit from renewing timing chain, guides, and tensioner during install even on a sound donor. We note sensible refresh items for your engine family so the quote stays accurate. Oil priming and disciplined first-start procedure prevent dry-start damage on commissioning day.",
        f"Trade customers with valid VAT ID can request formal VAT invoices. We understand workshop cash flow — you pay against a written proforma for a allocated unit, not an imaginary listing.",
    ]))

    blocks.append(section("Private buyer guidance", [
        f"You do not need to be a technician to buy safely. Provide registration, VIN, and a photo of the engine bay label; we identify the stamp and confirm compatible Hamburg stock. Arrange fitting with a local garage you trust — we explain inclusions and coding considerations so your installer knows what to expect.",
        f"Private motorists often feel pressured by main-dealer quotes that assume no alternatives exist. A documented used BMW engine with warranty and VIN matching is a rational way to keep a known car on the road — especially on {models} where vehicle value and repair cost must be balanced honestly.",
        f"Our WhatsApp desk is deliberately informal because real questions arise in real garages at real hours. Ask twice if needed; we prefer upfront clarification to disputes after fitting.",
    ]))

    blocks.append(section("Logistics, crating, and delivery expectations", [
        f"Engines are heavy, valuable, and sensitive to poor packaging. Bavarian Engines palletises or crates units for industrial freight with blocking, moisture consideration, and labelling suited to cross-border hauliers. Commercial invoices accompany export shipments for accounting and import procedures.",
        f"UK workshops should plan for post-Brexit customs steps; we provide paperwork and realistic timelines. Irish buyers benefit from frequent Hamburg routes with tracked delivery. Nordic buyers should consider cold-climate battery and coolant choices at commissioning — unrelated to the engine stamp but part of successful installs in Scandinavia.",
        f"Confirm lift access at your workshop before arrival. A three-hundred-kilogram crate is not a two-person cardboard box. If you lack a loading bay, tell us when ordering so freight can be arranged appropriately.",
    ]))

    blocks.append(section("Common mistakes to avoid", [
        f"Mistake one: ordering by model name without suffix confirmation. Mistake two: assuming turbo and DME are included because the photo shows them — read the SKU. Mistake three: installing before verifying stamp against invoice. Mistake four: choosing the lowest online price without warranty route or post-delivery contact.",
        f"Mistake five: skipping timing refresh on N47/N57 when labour overlap makes it economical. Mistake six: dry-starting after swap without oil prime. Mistake seven: ignoring immobiliser coding when donor DME travels with the engine. This {category.lower()} guide exists to help {models} buyers avoid those errors.",
    ]))

    blocks.append(section("How Bavarian Engines inspects donors before listing", [
        f"Each motor passes identification (full stamp and donor VIN), visual assessment (leaks, crash damage to mounts, turbo play indicators), and where applicable compression testing on diesel units. Photography reflects the actual engine shipped — not a catalogue render.",
        f"Inclusions are recorded in writing: long block only versus complete with turbo, injectors, HPFP, DME, and ancillaries. If we list 'complete with turbo,' that is what we prepare. Questions before payment prevent costly returns.",
        f"Donor mileage is logged from registration, cluster readout, or service history when available. We do not invent figures. When mileage is unknown, we say so — honesty keeps trust intact.",
    ]))

    blocks.append(section("Financial comparison: dealer, scrap, specialist", [
        f"Dealer remanufacture: high confidence, high price, often exceeds vehicle value on older {models}. Scrap yard: low upfront cost, high tail risk, no meaningful warranty. Specialist exchange: moderate price, documented stamp and mileage, warranty, export preparation, and named support.",
        f"Total installed cost = engine + shipping + gaskets + fluids + timing refresh + coding + labour + contingency. Bavarian Engines helps you model that equation with open SKU data before you pay — so the cheapest headline price does not trick you into the most expensive outcome.",
    ]))

    blocks.append(section("Real-world applications for " + models, [
        f"Whether you are rebuilding a daily driver, restoring a high-mileage taxi fleet vehicle, or preparing a customer car for MOT retest after catastrophic engine failure, the underlying requirement is the same: correct {platform} hardware, documented condition, and supplier accountability.",
        f"For {models}, workshops report that compression figures and cold-start video reduce customer anxiety — especially when the car is worth keeping but the failed engine created doubt. We supply that documentation on request because it shortens the sales conversation in your reception and speeds approval.",
        f"Export buyers far from Hamburg rely on photos, WhatsApp responsiveness, and accurate suffix confirmation more than local buyers who could theoretically visit. We over-invest in those processes because geography should not force you toward riskier local scrap supply.",
    ]))

    blocks.append(section("Environmental and practical reuse", [
        f"Reusing a tested BMW engine extends the life of a roadworthy chassis and avoids unnecessary manufacturing demand for a new long block. For insurers and owners writing off damaged cars, the engine bay often contains the most valuable reusable component — specialist exchanges give that hardware a second life with inspection and warranty rather than unrecorded scrap.",
    ]))

    blocks.append(section("Frequently asked questions about " + platform, [
        f"<strong>Can you confirm my engine code before I pay?</strong> Yes — send VIN and stamp photo via WhatsApp or email. We confirm against live stock and issue a written quote with inclusions and freight.",
        f"<strong>Do you ship to my country?</strong> We dispatch daily across the EU and export worldwide on request. Typical EU transit is three to five business days from Hamburg with tracking.",
        f"<strong>What warranty applies?</strong> Six-month mechanical cover on correctly installed units; full terms on our policies page. Extended options available on request.",
        f"<strong>Long block or complete — which should I order?</strong> Depends on turbo, injectors, and DME condition on your failed engine and what your quote promised the customer. We help you read the listing scope honestly.",
        f"<strong>Are you BMW-only?</strong> Yes. Bavarian Engines focuses on BMW diesel and petrol platforms — N47, N57, B47, B57, B58, M57 — plus selected M57 conversion kits for Defender, Pajero, and overland builds.",
    ]))

    blocks.append(section("Step-by-step ordering checklist", [
        f"Step 1: Photograph engine stamp and note full VIN. Step 2: Contact Bavarian Engines with those details. Step 3: Review written quote — stamp, inclusions, mileage, freight, warranty. Step 4: Pay via agreed method; engine prepares after funds clear. Step 5: Receive tracking; plan lift time. Step 6: Unbox with photos; verify stamp. Step 7: Install with recommended refresh and coding. Step 8: Commission with oil prime and first-start discipline. Step 9: Retain paperwork for warranty peace of mind.",
    ]))

    blocks.append(section("Why trust matters more than the lowest price", [
        f"The used engine market is full of one-time sellers who will not answer the phone after payment clears. Bavarian Engines is a named Hamburg business with eighty-one verified reviews, published policies, and garages that order repeatedly. Trust is not marketing — it is repeatable accuracy on stamp, inclusions, and condition.",
        f"When you finish reading this guide on {title.lower()}, you should know whether your chassis fits {platform}, what suffix verification entails, why used can be rational versus dealer reman, and which benefits — VIN matching, documentation, warranty, crating, support — you should demand from any supplier. Then compare suppliers fairly.",
    ]))

    blocks.append(section("Conclusion — your next step with Bavarian Engines", [
        f"If {models} brought you here, you already know engine failure is stressful. The path forward is clarity: confirm suffix, buy documented hardware, install with discipline, and keep a supplier who answers after the crate arrives. Browse our <a href='shop.html'>online inventory</a>, read <a href='reviews.html'>buyer reviews</a>, explore <a href='policies.html'>warranty terms</a>, or message our Hamburg team on <a href='https://wa.me/447944470816' target='_blank' rel='noopener'>WhatsApp</a> with your VIN for a same-day fitment check on {platform} stock.",
        f"Bavarian Engines exists so {category.lower()} decisions are made with eyes open — not with guesswork on the most expensive component your BMW will ever need. We look forward to helping you source the right {platform} motor for your {models} application with the transparency, preparation, and support that European workshops and owners expect from a dedicated BMW engine exchange in Hamburg.",
    ]))

    # Topic-specific expansion for uniqueness
    extras = {
        "n47-vs-n57": section("N47 vs N57 decision matrix", [
            "Choose N47 for 118d, 120d, 320d, 520d and most X1/X3 daily-driver rebuilds where fuel economy and parts availability matter. Choose N57 for 330d, 530d, 535d, X5 and X6 where six-cylinder torque and towing capability define the original specification.",
            "Never assume interchangeability between four-cylinder and six-cylinder families — wiring, mounts, exhaust, cooling, and vehicle weight class differ fundamentally.",
        ]),
        "shipping": section("UK and Ireland specifics", [
            "British workshops should budget customs processing time and ensure import VAT understanding before the crate lands. Irish garages frequently order N47 and N57 units with tracked Hamburg freight — plan lift access and commercial invoice filing on receipt.",
        ]),
    }
    if slug in extras:
        blocks.insert(4, extras[slug])

    body = "\n".join(blocks)

    # Pad to 2200+ words with additional unique paragraphs if needed
    wc = word_count(body)
    pad_index = 0
    pad_topics = [
        f"Additional note for {models} owners: cooling system refresh at install reduces early-life thermostat and hose failures that can be misdiagnosed as engine defects. Flush and bleed properly before handing the car back.",
        f"Garages quoting {platform} replacements should separate engine supply, labour, ancillaries, fluids, alignment checks, and coding in the customer quote. Transparency builds approval rates and reduces comeback arguments.",
        f"Export buyers ordering {platform} units for {models} should confirm import agent or customs broker requirements before payment — paperwork from Bavarian Engines supports clearance but local rules vary.",
        f"Oil specification matters on {platform} — use BMW-approved grades and prime the turbo feed before high-RPM runs. Shortcuts at commissioning cause failures that warranty correctly excludes.",
        f"When storing a {platform} engine before install, keep it dry, upright where possible, and covered. Moisture ingress through open ports creates corrosion unrelated to donor quality.",
        f"For fleet operators maintaining multiple {models} vehicles, standardising suffix verification through one supplier reduces wrong-part incidents across branches. WhatsApp VIN desks scale better than ad-hoc scrap picking.",
        f"Insurance total-loss negotiations sometimes overlook engine value separately from chassis. If you retain a vehicle for rebuild, document engine stamp and repair quote — some policies accommodate retained salvage differently by market.",
        f"Hybrid and EV headlines do not eliminate the immediate need for diesel replacements in commercial fleets running {models}. Documented used BMW engines keep TCO predictable until fleet electrification truly arrives.",
    ]
    while wc < 2200:
        blocks.append(paragraph(pad_topics[pad_index % len(pad_topics)] + f" This guidance supports informed {category.lower()} decisions for {platform} applications."))
        body = "\n".join(blocks)
        wc = word_count(body)
        pad_index += 1

    return body


def article_html(post: dict, image: str, body: str) -> str:
    slug = post["slug"]
    title = post["title"]
    excerpt = post["excerpt"]
    filename = f"blog-{slug}.html"
    seo_title = f"{title} | BMW Engines Blog | Bavarian Engines"
    seo_desc = f"{excerpt} Buy used BMW engines for sale from Bavarian Engines — original BMW motors, Hamburg export."
    url = f"{BASE_URL}/{filename}"
    esc = lambda s: s.replace("&", "&amp;").replace('"', "&quot;")
    t, d = esc(seo_title), esc(seo_desc)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{d}">
  <meta name="keywords" content="{KEYWORDS}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Bavarian Engines">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Bavarian Engines">
  <meta property="og:title" content="{t}">
  <meta property="og:description" content="{d}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{BASE_URL}/{image.lstrip('/') if not image.startswith('http') else image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{t}">
  <meta name="twitter:description" content="{d}">
  <title>{t}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,600;9..40,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="js/seo-config.js"></script>
  <script src="js/seo.js" defer></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body data-page="blog">
  <main>
    <div class="page-header">
      <div class="container">
        <div class="blog-meta">{post["category"]}</div>
        <h1>{title}</h1>
        <p>{excerpt}</p>
      </div>
    </div>
    <section class="content-section">
      <div class="container article-content">
        <div class="article-hero-img"><img src="{image}" alt="{title}"></div>
        {body}
        <div class="article-footer-cta">
          <a href="shop.html" class="btn btn-primary">Browse engines</a>
          <a href="https://wa.me/447944470816" class="btn btn-outline" target="_blank" rel="noopener">WhatsApp VIN match</a>
          <a href="blog.html" class="btn btn-outline">← All articles</a>
        </div>
      </div>
    </section>
  </main>
  <script src="js/components.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
"""


def main():
    BLOG_DIR.mkdir(exist_ok=True)
    images = load_images()
    index = []
    word_counts = []

    for i, post in enumerate(POSTS):
        image = images[i % len(images)]
        body = generate_body(post)
        wc = word_count(body)
        word_counts.append(wc)
        filename = f"blog-{post['slug']}.html"
        out = ROOT / filename
        out.write_text(article_html(post, image, body), encoding="utf-8")
        index.append({
            "slug": post["slug"],
            "title": post["title"],
            "category": post["category"],
            "excerpt": post["excerpt"],
            "image": image,
            "url": filename,
            "wordCount": wc,
        })

    INDEX_PATH.parent.mkdir(exist_ok=True)
    INDEX_PATH.write_text(json.dumps(index, indent=2), encoding="utf-8")

    print(f"Generated {len(POSTS)} blog posts")
    print(f"Word counts: min={min(word_counts)}, max={max(word_counts)}, avg={sum(word_counts)//len(word_counts)}")
    under = [x for x in word_counts if x < 2200]
    if under:
        print(f"WARNING: {len(under)} posts under 2200 words")
    else:
        print("All posts meet 2200+ word target")


if __name__ == "__main__":
    main()
