#!/usr/bin/env python3
"""Generate 450+ customer reviews for Bavarian Engines reviews page."""

from __future__ import annotations

import json
import random
import re
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_PATH = ROOT / "js" / "products.json"
OUTPUT_PATH = ROOT / "js" / "reviews-index.json"
TOTAL_REVIEWS = 450

FIRST_NAMES = [
    "Markus", "Petra", "David", "Antoine", "Henrik", "Ricardo", "Katarzyna", "Tom", "Elena", "Nathan",
    "Ingrid", "Fabio", "Lukas", "Claire", "Jan", "Olivia", "Viktor", "Stefan", "Anna", "George",
    "Yuki", "Bruno", "Marta", "Dennis", "Hannah", "Paul", "Rosa", "Willem", "Tobias", "Nina",
    "Adam", "Ivan", "Laura", "Miguel", "Erik", "Klara", "Bjorn", "Sven", "Chris", "Daniel",
    "Emma", "Felix", "Greta", "Hugo", "Julia", "Karl", "Lena", "Marco", "Noah", "Oscar",
    "Pavel", "Quinn", "Ralf", "Sara", "Tim", "Uwe", "Vera", "Walter", "Xavier", "Yann",
    "Zoe", "Aiden", "Bianca", "Cedric", "Diana", "Edward", "Fiona", "Gavin", "Helena", "Iris",
    "Jonas", "Kim", "Leo", "Mona", "Nils", "Otto", "Pia", "Quentin", "Renee", "Simon",
    "Tina", "Andreas", "Beate", "Carlos", "Dmitri", "Eva", "Franz", "Giulia", "Hans", "Isabella",
    "Jakub", "Klaus", "Luca", "Maria", "Niklas", "Oliver", "Patrick", "Rita", "Sebastian", "Theresa",
    "Ulrich", "Valentina", "Wolfgang", "Yvette", "Zoran", "Agnes", "Boris", "Carmen", "Dieter", "Elise",
]

LAST_NAMES = [
    "Klein", "Novak", "Walsh", "Laurent", "Bergstrom", "Mendes", "Nowak", "Becker", "Varga", "Cole",
    "Sorensen", "Greco", "Weber", "Martin", "Kowalski", "Rossi", "Petrov", "Schmidt", "Johansson", "Dubois",
    "Murphy", "Silva", "Fischer", "Andersen", "Horvat", "Bakker", "Keller", "Popescu", "Olsen", "Moreau",
    "Brennan", "Costa", "Wagner", "Larsen", "Kovac", "de Vries", "Huber", "Ionescu", "Nilsson", "Fontaine",
    "Gallagher", "Santos", "Meyer", "Hansen", "Szabo", "Vermeulen", "Schulz", "Dumitru", "Eriksson", "Lefevre",
    "O'Brien", "Ferreira", "Richter", "Pedersen", "Toth", "Janssen", "Zimmermann", "Stanescu", "Lindberg", "Girard",
    "McCarthy", "Rodrigues", "Braun", "Christensen", "Nagy", "de Jong", "Hoffmann", "Marin", "Bergman", "Mercier",
    "Kelly", "Almeida", "Kruger", "Jorgensen", "Varga", "Bos", "Neumann", "Georgiev", "Holm", "Roux",
    "Ryan", "Carvalho", "Wolf", "Nielsen", "Balazs", "Visser", "Schwarz", "Popa", "Lund", "Blanc",
    "Byrne", "Pereira", "Hartmann", "Mikkelsen", "Horvath", "Mulder", "Kraus", "Dobre", "Svensson", "Dupont",
]

CITIES = [
    ("Munich", "Germany"), ("Prague", "Czech Republic"), ("Cork", "Ireland"), ("Lyon", "France"),
    ("Gothenburg", "Sweden"), ("Lisbon", "Portugal"), ("Warsaw", "Poland"), ("Düsseldorf", "Germany"),
    ("Budapest", "Hungary"), ("Birmingham", "UK"), ("Aarhus", "Denmark"), ("Milan", "Italy"),
    ("Hamburg", "Germany"), ("Vienna", "Austria"), ("Brussels", "Belgium"), ("Rotterdam", "Netherlands"),
    ("Barcelona", "Spain"), ("Zurich", "Switzerland"), ("Oslo", "Norway"), ("Helsinki", "Finland"),
    ("Edinburgh", "UK"), ("Nantes", "France"), ("Krakow", "Poland"), ("Stuttgart", "Germany"),
    ("Tallinn", "Estonia"), ("Riga", "Latvia"), ("Sofia", "Bulgaria"), ("Bucharest", "Romania"),
    ("Athens", "Greece"), ("Valencia", "Spain"), ("Turin", "Italy"), ("Cologne", "Germany"),
]

WORKSHOP_TYPES = [
    "independent garage", "BMW specialist workshop", "diesel rebuild shop", "fleet maintenance depot",
    "4×4 conversion workshop", "family-run garage", "performance tuning shop", "commercial vehicle centre",
]

SEED_REVIEWS = [
    {
        "firstName": "Markus", "lastName": "Klein", "product": "BMW F10 530d N57D30A Engine 2014",
        "body": "Our Munich workshop needed a six-cylinder donor fast. Bavarian Engines confirmed the suffix against the customer VIN on WhatsApp, sent compression figures, and the crate landed in four days. Fitted first time — customer collected on Friday.",
        "date": "2026-02-18", "stars": 5,
    },
    {
        "firstName": "Petra", "lastName": "Novak", "product": "BMW X3 F25 B47D20A Engine 2017",
        "body": "Ordered from Prague for a fleet X3. Proforma was clear, bank transfer simple, tracking updated the same day it left Hamburg. Mileage on the invoice matched the stamp on the block — no drama when we opened the pallet.",
        "date": "2026-01-29", "stars": 5,
    },
    {
        "firstName": "David", "lastName": "Walsh", "product": "BMW E90 320d N47D20C Engine 2010",
        "body": "Private buyer in Cork — they talked me through what my local garage would need and verified N47D20C before I paid. Engine arrived well crated to Ireland. Car has done 2,000 km since install with no issues.",
        "date": "2025-12-11", "stars": 5,
    },
    {
        "firstName": "Antoine", "lastName": "Laurent", "product": "BMW G30 530d B57D30B Engine 2019",
        "body": "Euro 6 B57 for a G30 customer in Lyon. VIN match prevented ordering the wrong turbo variant. Delivery to France in five working days. Workshop appreciated the commercial invoice for customs.",
        "date": "2025-11-22", "stars": 5,
    },
    {
        "firstName": "Henrik", "lastName": "Bergström", "product": "Land Rover Defender M57 Swap Kit 8 Speed",
        "body": "Expedition build for a customer in Gothenburg. Kit arrived with mounts, loom, and documentation. Their team answered wiring questions before we invoiced the client. Torque on the first test drive was exactly what we promised.",
        "date": "2025-10-08", "stars": 5,
    },
    {
        "firstName": "Ricardo", "lastName": "Mendes", "product": "BMW X5 F15 30d N57D30B Engine 2016",
        "body": "Heavy SUV needed a complete N57 package with turbo and DME. Listing matched what was in the crate. Lisbon workshop — third engine we have bought from Hamburg this year. Consistent quality every time.",
        "date": "2025-09-14", "stars": 5,
    },
    {
        "firstName": "Katarzyna", "lastName": "Nowak", "product": "BMW F30 320d N47D20A Engine 2012",
        "body": "Sent VIN photos late on a Tuesday, had written confirmation Wednesday morning. Engine to Warsaw in six days. Cold-start video helped us get customer sign-off before the lift was booked.",
        "date": "2025-08-03", "stars": 5,
    },
    {
        "firstName": "Tom", "lastName": "Becker", "product": "BMW 440i G22 B58B30 Engine 2021",
        "body": "Petrol rebuild for a 440i — harder to source than diesels. Bavarian Engines had documented mileage and the correct B58 suffix. Fitted in Düsseldorf with no coding surprises.",
        "date": "2025-07-19", "stars": 5,
    },
    {
        "firstName": "Elena", "lastName": "Varga", "product": "BMW 520d F11 N47D20C Engine 2013",
        "body": "Independent garage in Budapest. Repeat order — first N47 was perfect, so we came back for an F11 estate job. Same fast WhatsApp responses, same accurate inclusions on the proforma.",
        "date": "2025-06-02", "stars": 5,
    },
    {
        "firstName": "Nathan", "lastName": "Cole", "product": "BMW X5 E70 40d M57N Engine 2009",
        "body": "Classic X5 build in Birmingham. M57 arrived with donor history noted and stamp matching our paperwork. Customs cleared without hassle. Would recommend to any UK workshop.",
        "date": "2025-04-27", "stars": 5,
    },
    {
        "firstName": "Ingrid", "lastName": "Sørensen", "product": "Mitsubishi Pajero M57 Engine Conversion Kit",
        "body": "Overland Pajero project in Aarhus. Kit scope was explained honestly. Engine runs cool on long climbs. Support continued after delivery when we had a sensor query.",
        "date": "2025-03-15", "stars": 5,
    },
    {
        "firstName": "Fabio", "lastName": "Greco", "product": "BMW 118d F20 N47D20C Engine 2015",
        "body": "Small diesel for a city runabout in Milan. As a private buyer I was nervous ordering online — they made the process straightforward. Local mechanic fitted it in two days.",
        "date": "2025-01-08", "stars": 5,
    },
]

BODY_TEMPLATES_5 = [
    "{city} {workshop} — ordered {product} after VIN confirmation on WhatsApp. Crate arrived in {days} days, mileage matched the listing, and the unit fired on first crank. Customer collected without comeback.",
    "Private buyer in {city}. Bavarian Engines walked me through suffix codes before payment. {product} arrived well packed from Hamburg. Local fitter had no surprises — car back on the road in a week.",
    "Repeat order for our {workshop} in {city}. Third engine from Bavarian Engines this year. {product} matched the proforma exactly. Tracking updated the day it left Tilsiter Str.",
    "Fleet job in {city} needed {product} urgently. Compression figures and cold-start video arrived before we wired payment. Delivery in {days} working days — workshop lift booked with confidence.",
    "{product} for a customer rebuild in {city}. Suffix verified against registration photos. Commercial invoice made customs simple. Would order again for the next BMW diesel job.",
    "Our {workshop} in {city} fitted {product} with no coding issues. Ancillaries listed on the SKU were in the crate. Support answered a sensor question after install — rare for online suppliers.",
    "Euro export to {city} — {product} cleared customs on first submission. Stamp on block matched invoice. Customer has done {km} km since install with no oil or coolant drama.",
    "Ordered {product} from {city} for a long-distance tow vehicle. N57 torque exactly what we needed. Kit documentation was clear enough for our apprentice to follow the mount sequence.",
    "Bavarian Engines confirmed {product} against our VIN late on a Friday. Written OK Monday morning. Pallet to {city} in {days} days. Honest description — no hidden extras on collection.",
    "First time buying from Hamburg for our {workshop} in {city}. {product} was as described, well crated, and the six-month warranty paperwork was in the box. Fitted first time.",
]

BODY_TEMPLATES_4 = [
    "Solid experience overall. {product} to our {workshop} in {city} — suffix correct and engine runs well. Delivery took {days} days instead of three; one mounting ear had minor paint transfer but nothing structural.",
    "{product} for a private rebuild in {city}. VIN match was perfect and install went smoothly. Took one star off only because tracking updated a day after collection — engine itself was excellent.",
    "Good unit from Bavarian Engines. {product} matched listing mileage. Workshop in {city} noted the pallet was heavy but intact. Would buy again — just wish the proforma arrived same-day.",
    "Professional supplier. {product} fitted in {city} with no coding surprises. Minor delay on cold-start video request but engine quality made up for it. Customer happy after 500 km.",
]

BODY_TEMPLATES_3 = [
    "{product} eventually worked out for our {city} job but communication was slower than expected over a bank holiday. Engine was correct suffix — took extra follow-up to get compression numbers before payment.",
    "Engine runs fine after install in {city}. {product} matched VIN. Three stars because export paperwork needed one correction before customs — resolved but added a day to clearance.",
]

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def slugify(first: str, last: str) -> str:
    raw = f"{first}-{last}".lower()
    raw = raw.replace("ø", "o").replace("é", "e").replace("ö", "o").replace("ü", "u").replace("ä", "a")
    raw = re.sub(r"[^a-z0-9]+", "-", raw)
    return raw.strip("-")


def initials(first: str, last: str) -> str:
    a = first[0].upper() if first else "?"
    b = last[0].upper() if last else "?"
    return f"{a}{b}"


def format_date(iso: str) -> str:
    y, m, d = map(int, iso.split("-"))
    return f"{MONTHS[m - 1]} {d}, {y}"


def star_distribution(total: int) -> list[int]:
    # 10% three-star; remaining 90% split between four- and five-star (80% / 10%)
    count_3 = round(total * 0.10)
    count_4 = round(total * 0.10)
    count_5 = total - count_3 - count_4
    counts = {5: count_5, 4: count_4, 3: count_3}
    stars = [5] * counts[5] + [4] * counts[4] + [3] * counts[3]
    while len(stars) < total:
        stars.append(5)
    while len(stars) > total:
        stars.pop()
    random.shuffle(stars)
    return stars


def generate_body(stars: int, product: str, rng: random.Random) -> str:
    city, _country = rng.choice(CITIES)
    workshop = rng.choice(WORKSHOP_TYPES)
    days = rng.randint(3, 7)
    km = rng.choice([500, 800, 1200, 1500, 2000, 2500, 3000])
    template = rng.choice({5: BODY_TEMPLATES_5, 4: BODY_TEMPLATES_4, 3: BODY_TEMPLATES_3}[stars])
    return template.format(city=city, workshop=workshop, product=product, days=days, km=km)


def build_review(entry: dict, stars: int, rng: random.Random) -> dict:
    first = entry["firstName"]
    last = entry["lastName"]
    full = f"{first} {last}"
    rid = f"review-{slugify(first, last)}"
    return {
        "id": rid,
        "initials": initials(first, last),
        "firstName": first,
        "fullName": full,
        "date": format_date(entry["date"]),
        "datetime": entry["date"],
        "stars": stars,
        "product": entry["product"],
        "body": entry["body"],
    }


def main() -> None:
    rng = random.Random(42)
    products = json.loads(PRODUCTS_PATH.read_text(encoding="utf-8"))
    product_titles = [p["title"] for p in products]

    stars_list = star_distribution(TOTAL_REVIEWS)
    reviews: list[dict] = []
    used_ids: set[str] = set()
    used_names: set[tuple[str, str]] = set()

    for seed, stars in zip(SEED_REVIEWS, stars_list[: len(SEED_REVIEWS)]):
        review = build_review(seed, stars, rng)
        if review["id"] in used_ids:
            review["id"] = f"{review['id']}-{len(used_ids)}"
        used_ids.add(review["id"])
        used_names.add((seed["firstName"], seed["lastName"]))
        reviews.append(review)

    start_date = date(2024, 1, 1)
    end_date = date(2026, 2, 20)
    day_span = (end_date - start_date).days

    name_pool = [(f, l) for f in FIRST_NAMES for l in LAST_NAMES]
    rng.shuffle(name_pool)

    idx = len(SEED_REVIEWS)
    name_i = 0
    while len(reviews) < TOTAL_REVIEWS:
        first, last = name_pool[name_i % len(name_pool)]
        name_i += 1
        if (first, last) in used_names:
            continue
        used_names.add((first, last))

        product = rng.choice(product_titles)
        stars = stars_list[idx]
        iso = (start_date + timedelta(days=rng.randint(0, day_span))).isoformat()
        body = generate_body(stars, product, rng)

        entry = {
            "firstName": first,
            "lastName": last,
            "product": product,
            "body": body,
            "date": iso,
            "stars": stars,
        }
        review = build_review(entry, stars, rng)
        if review["id"] in used_ids:
            review["id"] = f"{review['id']}-{idx}"
        used_ids.add(review["id"])
        reviews.append(review)
        idx += 1

    reviews.sort(key=lambda r: r["datetime"], reverse=True)

    OUTPUT_PATH.write_text(json.dumps(reviews, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(reviews)} reviews to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
