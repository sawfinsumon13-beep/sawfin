function makeImageSet(basePath, count) {
  const urls = [`${basePath}/main.webp`];
  for (let i = 1; i <= count; i += 1) {
    urls.push(`${basePath}/${String(i).padStart(2, "0")}.webp`);
  }
  return urls;
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

const N57_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-e90-n57d30a-lci-engine-2011", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-f30-n57d30a-engine-2014", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-335d-f30-n57d30b-engine-2015", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-530d-f10-n57d30a-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-530d-gt-f07-n57d30a-engine-2012", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f01-730d-n57d30a-engine-2010", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f06-n57-640d-xdrive-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-525d-n57d30a-engine-2010", 8),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-530d-n57d30a-engine-2010", 6),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-530d-n57d30a-engine-2015", 7),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-530d-n57d30b-engine-2012", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-x3-f25-n57d30a-engine-2017", 3),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n57.webp"
]);

const N47_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-125d-f20-n47d20d-engine-2012", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e82-123d-n47d20b-engine-2010", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e87-123d-n47d20b-engine-2008", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e90-320d-n47d20c-engine-2010", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e90-320d-n47d20c-engine-2011", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e91-320d-n47d20-engine-2011", 6),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-520d-n47d20c-engine-2011", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-520d-n47d20c-engine-2012", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f10-525d-n47d20d-engine-2012", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f30-320d-n47d20c-engine-2013", 3),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f30-320d-n47d20c-engine-2014", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f34-320d-n47d20c-engine-2015", 4),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n47.webp"
]);

const M57_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-231hp-m57-2009-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e46-330d-m57d30-engine-2002", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e60-530d-m57-engine", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e60-535d-m57d30tu2-engine-2007", 7),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e60-535d-m57-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e60-e61-m57tue-177hp-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e60-m57n-272hp-engine", 10),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-e90-335d-m57-2011-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-x3-e83-m57d30tu2-engine-2007", 7),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-x5-e53-3-0d-m57-engine-2006", 4),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/m57.webp"
]);

const B57_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/540d-740d-640d-840d-3-0-b57d30b-engine", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/730d-xdrive-g11-g12-2019-b57d30a", 6),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/740d-xdrive-2018-g11-b57d30b-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-g20-m340d-b57-engine-2021", 6),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/x5-530d-b57d30b-3-0d-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-x6-g06-m50d-b57d30s-engine-2019", 6),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-g20-330d-b57d30a-engine-2021/main.webp",
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b57.webp"
]);

const B47_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmwx3-x4-b47d20a-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/118d-f20-b47d20a-2016-lci-engine", 3),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/125d-2016-b47d30b-euro6-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/520d-f10-2014-euro6-b47d20a-engine", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/b47c20b-x1-f48-2018-engine", 4),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/f30-b47d20a-320d-2017-engine", 5),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/f10-b47d20a-2016-engine", 6),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b47.webp"
]);

const B58_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f32-440i-engine-2017", 3),
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/z4-b58b30c-3-0-2021-engine", 4),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b58.webp"
]);

const M57_SWAP_IMAGE_POOL = uniqueList([
  ...makeImageSet("https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-m57-to-300tdi-r380-conversion-kit", 6),
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-m57-swap.webp",
  "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/m57.webp"
]);

const SHARED_OLD_ENGINE_IMAGES = uniqueList([
  ...N57_IMAGE_POOL,
  ...N47_IMAGE_POOL,
  ...M57_IMAGE_POOL,
  ...B57_IMAGE_POOL,
  ...B47_IMAGE_POOL
]).slice(0, 120);

const OBE_FAMILY_TEMPLATES = [
  {
    slug: "n57",
    category: "N57 Engines",
    codeRoot: "N57D30",
    displacement: "3.0L Diesel",
    power: "258-313 hp",
    torque: "560-630 Nm",
    fuelSystem: "Common Rail Diesel",
    yearBase: 2008,
    yearSpan: 8,
    basePrice: 6400,
    count: 90,
    models: ["BMW 330d", "BMW 530d", "BMW X5", "BMW X6"],
    images: uniqueList([...N57_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(0, 40)])
  },
  {
    slug: "n47",
    category: "N47 Engines",
    codeRoot: "N47D20",
    displacement: "2.0L Diesel",
    power: "143-218 hp",
    torque: "320-450 Nm",
    fuelSystem: "Common Rail Diesel",
    yearBase: 2007,
    yearSpan: 10,
    basePrice: 5200,
    count: 90,
    models: ["BMW 320d", "BMW 520d", "BMW 118d", "BMW X3"],
    images: uniqueList([...N47_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(15, 55)])
  },
  {
    slug: "m57",
    category: "M57 Engines",
    codeRoot: "M57D30",
    displacement: "3.0L Diesel",
    power: "184-286 hp",
    torque: "390-580 Nm",
    fuelSystem: "Bosch Common Rail",
    yearBase: 2001,
    yearSpan: 10,
    basePrice: 6100,
    count: 90,
    models: ["BMW E60", "BMW E90", "BMW X5 E70", "BMW 730d"],
    images: uniqueList([...M57_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(35, 75)])
  },
  {
    slug: "b57",
    category: "B57 Engines",
    codeRoot: "B57D30",
    displacement: "3.0L Diesel",
    power: "265-400 hp",
    torque: "620-760 Nm",
    fuelSystem: "Common Rail Diesel",
    yearBase: 2016,
    yearSpan: 7,
    basePrice: 8600,
    count: 78,
    models: ["BMW G30 530d", "BMW X5 G05", "BMW 740d", "BMW 840d"],
    images: uniqueList([...B57_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(50, 95)])
  },
  {
    slug: "b47",
    category: "B47 Engines",
    codeRoot: "B47D20",
    displacement: "2.0L Diesel",
    power: "150-231 hp",
    torque: "330-500 Nm",
    fuelSystem: "Common Rail Diesel",
    yearBase: 2015,
    yearSpan: 8,
    basePrice: 6900,
    count: 78,
    models: ["BMW F30 LCI", "BMW X3 G01", "BMW X4", "BMW 320d"],
    images: uniqueList([...B47_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(20, 70)])
  },
  {
    slug: "b58",
    category: "B58 Engines",
    codeRoot: "B58B30",
    displacement: "3.0L Petrol",
    power: "326-382 hp",
    torque: "450-500 Nm",
    fuelSystem: "Direct Injection Turbo",
    yearBase: 2016,
    yearSpan: 8,
    basePrice: 9800,
    count: 78,
    models: ["BMW 340i", "BMW 440i", "BMW M140i", "BMW Supra A90"],
    images: uniqueList([...B58_IMAGE_POOL, ...SHARED_OLD_ENGINE_IMAGES.slice(60, 110)])
  },
  {
    slug: "m57-swap",
    category: "M57 Swap Kits",
    codeRoot: "M57SWAP",
    displacement: "3.0L Swap Package",
    power: "218-286 hp",
    torque: "500-580 Nm",
    fuelSystem: "Diesel Conversion Package",
    yearBase: 2004,
    yearSpan: 10,
    basePrice: 12400,
    count: 24,
    models: ["Defender Conversion", "Overland Builds", "Workshop Projects"],
    images: uniqueList([...M57_SWAP_IMAGE_POOL, ...M57_IMAGE_POOL.slice(0, 25)])
  }
];

const CONDITION_ROTATION = [
  "Factory Original, Compression Tested",
  "Original Block, Re-sealed",
  "Workshop Inspected, Bore Scope Verified",
  "Collector Grade, Documentation Archived"
];

const AVAILABILITY_ROTATION = ["In Stock", "In Stock", "Limited", "Reserved"];

function pickGallery(pool, startIndex) {
  const size = pool.length;
  const one = pool[startIndex % size];
  const two = pool[(startIndex + 1) % size];
  const three = pool[(startIndex + 2) % size];
  return uniqueList([one, two, three]);
}

function buildInventory() {
  const products = [];

  OBE_FAMILY_TEMPLATES.forEach((template) => {
    let previousImage = "";
    const pool = template.images.length ? template.images : SHARED_OLD_ENGINE_IMAGES;

    for (let i = 1; i <= template.count; i += 1) {
      const suffix = ["A", "B", "C", "D"][i % 4];
      const sequenceCode = String(1000 + i);
      const code = template.codeRoot === "M57SWAP" ? `${template.codeRoot}-${sequenceCode}` : `${template.codeRoot}${suffix}`;
      const year = String(template.yearBase + (i % template.yearSpan));
      const mileageValue = 62000 + ((i * 1377) % 158000);
      const priceEur = template.basePrice + (i % 18) * 170 + Math.floor(i / 7) * 30;
      const model = template.models[i % template.models.length];

      let image = pool[(i - 1) % pool.length];
      if (image === previousImage) {
        image = pool[i % pool.length];
      }
      previousImage = image;

      const gallery = pickGallery(pool, i - 1);

      products.push({
        id: `${template.slug}-${sequenceCode.toLowerCase()}`,
        category: template.category,
        code,
        title: `Bavarian Engine ${model} Original BMW Engine ${code}`,
        condition: CONDITION_ROTATION[i % CONDITION_ROTATION.length],
        mileage: `${new Intl.NumberFormat("en-DE").format(mileageValue)} km`,
        year,
        availability: AVAILABILITY_ROTATION[i % AVAILABILITY_ROTATION.length],
        priceEur,
        image,
        gallery,
        displacement: template.displacement,
        power: template.power,
        torque: template.torque,
        fuelSystem: template.fuelSystem,
        compatibility: [
          `${model} platform verified`,
          `${template.category} family restoration builds`,
          "VIN confirmation recommended before invoice"
        ],
        shipping:
          "Bavarian Engine crated export shipping with impact-controlled palletization, Original Bavarian Engine documentation support, and tracked worldwide BMW Engine dispatch.",
        conditionReport:
          "Original Bavarian Engine inspection log completed for this BMW Engine / Old BMW Engine unit. Additional Original BMW Engine evidence available upon request."
      });
    }
  });

  return products;
}

function buildReviews() {
  const reviewerNames = [
    "Markus T.",
    "Oliver J.",
    "Leonard C.",
    "Sofia A.",
    "James O.",
    "Luc V.",
    "Daniel R.",
    "Patrick M.",
    "Emil K.",
    "Nicolas D.",
    "Adrian B.",
    "Thomas F.",
    "Sebastian W.",
    "Milan Z.",
    "Victor H.",
    "Jan P.",
    "Robert L.",
    "Kacper N.",
    "Henri G.",
    "Stefan E."
  ];

  const reviewerLocations = [
    "Stuttgart, Germany",
    "Manchester, UK",
    "Zurich, Switzerland",
    "Stockholm, Sweden",
    "Dublin, Ireland",
    "Brussels, Belgium",
    "Hamburg, Germany",
    "Munich, Germany",
    "Vienna, Austria",
    "Copenhagen, Denmark",
    "Oslo, Norway",
    "Amsterdam, Netherlands",
    "Paris, France",
    "Milan, Italy",
    "Warsaw, Poland",
    "Prague, Czech Republic",
    "Lisbon, Portugal",
    "Barcelona, Spain",
    "Bucharest, Romania",
    "Helsinki, Finland"
  ];

  const reviewMessages = [
    "The engine arrived exactly as documented, and our workshop confirmed code and compression data without mismatch.",
    "Communication was fast, technical, and clear. We received fitment guidance before payment, which reduced project risk.",
    "Crate quality was excellent. Delivery updates were consistent, and the unit matched listing photos and mileage notes.",
    "Very professional process from enquiry to dispatch. Support team answered every compatibility question in practical detail.",
    "We purchased for a client restoration and the engine installed smoothly. Documentation quality saved us workshop time.",
    "Best Bavarian Engine for Sale experience we have had with Original Bavarian Engine. Real stock transparency and no confusion on included components.",
    "VIN verification was completed quickly, and the exact engine family match prevented expensive fitment mistakes.",
    "Packaging and export handling were excellent. We received the engine in clean condition with clear dispatch tracking.",
    "Our private collector order was handled like a workshop account. Strong support before and after delivery.",
    "The listing was honest and technically accurate. What arrived is exactly what was described in the order notes."
  ];

  const reviews = [];
  for (let i = 0; i < 60; i += 1) {
    reviews.push({
      name: reviewerNames[i % reviewerNames.length],
      location: reviewerLocations[i % reviewerLocations.length],
      text: reviewMessages[i % reviewMessages.length],
      rating: 5
    });
  }
  return reviews;
}

function buildContentLibrary() {
  const sectors = [
    {
      key: "engine-families",
      label: "Engine Families",
      titles: [
        "N57 diesel family overview",
        "N47 timing-chain era notes",
        "M57 torque-era essentials",
        "B57 modern diesel context",
        "B47 compact diesel map"
      ],
      summaries: [
        "Short family brief covering platform range, power bands, and restoration fit.",
        "Condensed guidance on common wear points and buyer checkpoints.",
        "Compact notes for workshops matching donor engines to chassis codes.",
        "Quick lineage summary for collectors comparing generation upgrades.",
        "Practical snapshot of displacement, fuel system, and service focus."
      ],
      tags: ["N57", "N47", "M57", "B57", "B47"]
    },
    {
      key: "code-verification",
      label: "Code Verification",
      titles: [
        "VIN-to-engine code match",
        "Stamped code photography tips",
        "Prefix suffix decoding quicksheet",
        "Cross-check against build sheet",
        "Avoid lookalike code traps"
      ],
      summaries: [
        "Confirm engine code against VIN before invoice to prevent fitment miss.",
        "Capture clear stamp photos and archive them with the order record.",
        "Decode family prefixes so buyers can filter inventory with confidence.",
        "Use documentation cross-checks when chassis and engine eras diverge.",
        "Spot near-identical codes that belong to incompatible power variants."
      ],
      tags: ["VIN", "Codes", "Docs", "Match", "Audit"]
    },
    {
      key: "condition-notes",
      label: "Condition Notes",
      titles: [
        "Compression snapshot guide",
        "Bore-scope highlight reel",
        "Seal and gasket visual cues",
        "Oil residue reading basics",
        "Collector-grade condition tags"
      ],
      summaries: [
        "Short condition language that keeps listings honest and scannable.",
        "Key visual cues workshops look for before committing to install.",
        "Surface evidence that helps buyers judge maintenance history fast.",
        "Mileage context paired with inspection language for clearer risk.",
        "Grade labels that separate workshop units from collector stock."
      ],
      tags: ["Inspect", "Mileage", "Seals", "Bore", "Grade"]
    },
    {
      key: "logistics-crating",
      label: "Logistics & Crating",
      titles: [
        "Export crate checklist",
        "Impact-control packing notes",
        "Freight tracking milestones",
        "Port handoff readiness",
        "Workshop delivery windows"
      ],
      summaries: [
        "Crate design and bracing notes for long-haul engine freight safety.",
        "Protect mounting points and open ports before sealed dispatch.",
        "Track each logistics milestone from pickup to destination handoff.",
        "Prepare documents and photos so customs clearance stays smooth.",
        "Align delivery windows with workshop install schedules."
      ],
      tags: ["Crate", "Freight", "Export", "Track", "Delivery"]
    },
    {
      key: "workshop-fitment",
      label: "Workshop Fitment",
      titles: [
        "Mount and accessory map",
        "Harness and ECU notes",
        "Cooling circuit prep",
        "Exhaust flange alignment",
        "First-start workshop protocol"
      ],
      summaries: [
        "Fitment notes that reduce install surprises on common BMW platforms.",
        "Electrical and sensor checkpoints before the first crank cycle.",
        "Cooling and sealing prep that protects both donor and chassis.",
        "Alignment cues for manifolds, mounts, and related hard points.",
        "Short first-start checklist for professional workshop teams."
      ],
      tags: ["Fitment", "ECU", "Cooling", "Mounts", "Start"]
    },
    {
      key: "m57-swap",
      label: "M57 Swap Kits",
      titles: [
        "M57 swap kit essentials",
        "Adapter and mount pairing",
        "Wiring loom swap notes",
        "Cooling upgrade shortlist",
        "Donor selection for swaps"
      ],
      summaries: [
        "Compact kit guidance for builders planning an M57 conversion path.",
        "Match adapters, mounts, and hardware to the target chassis family.",
        "Keep loom and sensor strategy clear before cutting or splicing.",
        "Cooling capacity notes for higher-torque diesel swap builds.",
        "Choose donor engines with documentation that supports the swap plan."
      ],
      tags: ["Swap", "M57", "Kit", "Loom", "Donor"]
    },
    {
      key: "buying-guides",
      label: "Buying Guides",
      titles: [
        "Private buyer decision ladder",
        "Workshop procurement brief",
        "Budget vs risk balance",
        "Photo evidence checklist",
        "Pre-payment question set"
      ],
      summaries: [
        "A shortened buying path from enquiry to confirmed invoice.",
        "Procurement notes for shops sourcing engines for client vehicles.",
        "Balance price, documentation quality, and install readiness.",
        "Request the right photos before committing to purchase.",
        "Ask precise technical questions that reveal true compatibility."
      ],
      tags: ["Buy", "Budget", "Photos", "Risk", "Questions"]
    },
    {
      key: "restoration",
      label: "Restoration Notes",
      titles: [
        "Collector restoration cadence",
        "Parts sequencing for rebuilds",
        "Period-correct engine choices",
        "Finish and presentation standards",
        "Archive your restoration trail"
      ],
      summaries: [
        "Short restoration notes for keeping projects on a clean timeline.",
        "Sequence parts and donor decisions to avoid costly rework loops.",
        "Choose engines that respect platform authenticity goals.",
        "Presentation standards for collector-facing project handovers.",
        "Keep a simple archive of codes, photos, and install decisions."
      ],
      tags: ["Restore", "Parts", "Period", "Finish", "Archive"]
    },
    {
      key: "compatibility",
      label: "Compatibility Maps",
      titles: [
        "Chassis-to-family matrix",
        "Year-range compatibility cues",
        "Transmission pairing notes",
        "Drivetrain layout checks",
        "Sensor generation mismatches"
      ],
      summaries: [
        "Map engine families to chassis generations in one short view.",
        "Year-range cues that catch silent incompatibility early.",
        "Transmission and flywheel pairing notes for smoother installs.",
        "Confirm drivetrain layout before ordering long-distance freight.",
        "Watch sensor generations that look similar but behave differently."
      ],
      tags: ["Chassis", "Years", "Gearbox", "AWD", "Sensors"]
    },
    {
      key: "documentation",
      label: "Documentation",
      titles: [
        "Order documentation pack",
        "Inspection log essentials",
        "Invoice and export papers",
        "Photo evidence indexing",
        "Client handover dossier"
      ],
      summaries: [
        "Keep every order backed by clean, scannable documentation.",
        "Inspection logs that travel with the engine through install.",
        "Export paperwork that supports smooth international clearance.",
        "Index photos so buyers can review condition without confusion.",
        "Handover dossiers that workshops and collectors can archive."
      ],
      tags: ["Docs", "Logs", "Invoice", "Photos", "Handover"]
    },
    {
      key: "compression",
      label: "Compression Insights",
      titles: [
        "Compression reading basics",
        "Cylinder balance signals",
        "Cold vs warm test context",
        "Leakdown companion notes",
        "When numbers need photos"
      ],
      summaries: [
        "Short compression literacy for buyers comparing used diesel units.",
        "Balance cues that matter more than a single peak number.",
        "Test context that prevents misreading healthy engines as weak.",
        "Pair compression notes with leakdown when risk is higher.",
        "Request supporting media when readings look incomplete."
      ],
      tags: ["Compression", "Cylinders", "Leakdown", "Tests", "Media"]
    },
    {
      key: "fuel-turbo",
      label: "Fuel & Turbo Systems",
      titles: [
        "Common-rail health cues",
        "Turbo shaft play watchlist",
        "Injector wear language",
        "Intake tract cleanliness",
        "Boost path inspection notes"
      ],
      summaries: [
        "Fuel-system cues that help buyers judge diesel service history.",
        "Turbo inspection points that matter before long-distance shipping.",
        "Injector language that stays clear without overclaiming condition.",
        "Intake cleanliness notes for engines with known carbon patterns.",
        "Boost path checks that protect install timelines after delivery."
      ],
      tags: ["Fuel", "Turbo", "Injectors", "Intake", "Boost"]
    },
    {
      key: "export",
      label: "Export Compliance",
      titles: [
        "HS code preparation notes",
        "Destination document set",
        "Declared value clarity",
        "Inspection photo for customs",
        "Broker-ready packing list"
      ],
      summaries: [
        "Export notes that keep international engine shipments moving.",
        "Destination paperwork checklists for common buyer regions.",
        "Clear declared values reduce avoidable clearance friction.",
        "Photo packs that support customs review when requested.",
        "Packing lists written for brokers, workshops, and collectors."
      ],
      tags: ["Export", "Customs", "HS", "Broker", "Papers"]
    },
    {
      key: "collector",
      label: "Collector Standards",
      titles: [
        "Collector acceptance criteria",
        "Originality vs usability balance",
        "Presentation photo standards",
        "Provenance language shortform",
        "Storage before install"
      ],
      summaries: [
        "Standards collectors use when judging premium used BMW engines.",
        "Balance originality goals with real-world install practicality.",
        "Photo standards that communicate condition without hype.",
        "Provenance notes kept short, factual, and verifiable.",
        "Storage guidance for engines waiting on chassis readiness."
      ],
      tags: ["Collector", "Original", "Photos", "Provenance", "Storage"]
    },
    {
      key: "mileage",
      label: "Mileage Context",
      titles: [
        "Reading mileage with condition",
        "High-mileage diesel realities",
        "Low-mileage caution notes",
        "Service history triangulation",
        "Mileage vs documentation quality"
      ],
      summaries: [
        "Mileage only makes sense when paired with inspection context.",
        "High-mileage diesels can still be strong with transparent notes.",
        "Low mileage is not automatic proof of superior mechanical health.",
        "Triangulate odometer claims with service and visual evidence.",
        "Prefer clear documentation over optimistic mileage storytelling."
      ],
      tags: ["Mileage", "Service", "Context", "Diesel", "Evidence"]
    },
    {
      key: "install-prep",
      label: "Installation Prep",
      titles: [
        "Pre-install parts basket",
        "Fluids and seal kit shortlist",
        "Bay clearance checklist",
        "Torque tool readiness",
        "Post-install break-in notes"
      ],
      summaries: [
        "Prep lists that keep install days productive and predictable.",
        "Seal and fluid shortlists commonly needed around engine swaps.",
        "Bay clearance checks before the donor unit arrives on site.",
        "Tool readiness notes for torque-critical fastening sequences.",
        "Break-in observations workshops should log after first runs."
      ],
      tags: ["Install", "Seals", "Bay", "Torque", "Break-in"]
    },
    {
      key: "platform",
      label: "Platform Matching",
      titles: [
        "E-series platform match notes",
        "F-series diesel pairing cues",
        "G-series modern diesel map",
        "X-drive platform considerations",
        "Touring and coupe fit notes"
      ],
      summaries: [
        "Platform match notes that keep chassis and engine eras aligned.",
        "F-series cues for diesel family selection and accessory fit.",
        "G-series mapping for newer diesel buyers and workshops.",
        "xDrive considerations that affect mounts, shafts, and clearances.",
        "Body-style notes where touring and coupe packaging differs."
      ],
      tags: ["E-Series", "F-Series", "G-Series", "xDrive", "Body"]
    },
    {
      key: "quality",
      label: "Quality Control",
      titles: [
        "Incoming QC gate checklist",
        "Photo QC before listing",
        "Code stamp clarity score",
        "Crate QC before dispatch",
        "Final release verification"
      ],
      summaries: [
        "QC gates that keep inventory listings accurate and trustworthy.",
        "Photo QC standards applied before engines go live online.",
        "Stamp clarity scoring that protects buyers from ambiguous codes.",
        "Crate QC before freight leaves the warehouse floor.",
        "Final release verification closing the order documentation loop."
      ],
      tags: ["QC", "Listing", "Stamps", "Crate", "Release"]
    },
    {
      key: "support",
      label: "Warranty & Support",
      titles: [
        "Pre-sale support channels",
        "WhatsApp fitment triage",
        "Post-delivery question path",
        "Workshop escalation notes",
        "Support response standards"
      ],
      summaries: [
        "Support paths designed for high-trust engine purchases.",
        "WhatsApp triage that answers fitment questions before payment.",
        "Post-delivery routes for workshops needing clarifying detail.",
        "Escalation notes when install teams need deeper technical help.",
        "Response standards that keep private and trade buyers informed."
      ],
      tags: ["Support", "WhatsApp", "Warranty", "Trade", "Help"]
    },
    {
      key: "market",
      label: "Market Insights",
      titles: [
        "Demand by engine family",
        "Seasonal sourcing patterns",
        "Collector vs workshop demand",
        "Pricing transparency notes",
        "Stock velocity signals"
      ],
      summaries: [
        "Short market notes that explain why certain families move faster.",
        "Seasonal patterns that affect sourcing and shipping timelines.",
        "Demand differences between collectors and professional workshops.",
        "Transparent pricing language without inflated urgency tactics.",
        "Stock velocity cues that help buyers act with better timing."
      ],
      tags: ["Market", "Demand", "Season", "Pricing", "Stock"]
    }
  ];

  const imagePool = uniqueList([
    ...SHARED_OLD_ENGINE_IMAGES,
    ...N57_IMAGE_POOL,
    ...N47_IMAGE_POOL,
    ...M57_IMAGE_POOL,
    ...B57_IMAGE_POOL,
    ...B47_IMAGE_POOL,
    ...B58_IMAGE_POOL,
    ...M57_SWAP_IMAGE_POOL
  ]);

  const focusWords = [
    "verified",
    "documented",
    "workshop-ready",
    "collector-safe",
    "export-ready",
    "code-matched",
    "photo-backed",
    "crate-protected",
    "platform-checked",
    "install-focused"
  ];

  const total = 5000;
  const perSector = Math.floor(total / sectors.length);
  const items = [];
  let previousImage = "";

  sectors.forEach((sector, sectorIndex) => {
    for (let i = 0; i < perSector; i += 1) {
      const globalIndex = items.length + 1;
      const titleBase = sector.titles[i % sector.titles.length];
      const summaryBase = sector.summaries[i % sector.summaries.length];
      const tag = sector.tags[i % sector.tags.length];
      const focus = focusWords[(sectorIndex + i) % focusWords.length];
      let image = imagePool[(globalIndex + sectorIndex * 17) % imagePool.length];
      if (image === previousImage) {
        image = imagePool[(globalIndex + 3) % imagePool.length];
      }
      previousImage = image;

      items.push({
        id: `cl-${String(globalIndex).padStart(4, "0")}`,
        sector: sector.label,
        sectorKey: sector.key,
        title: `${titleBase} #${String(i + 1).padStart(3, "0")}`,
        summary: `${summaryBase} Original Bavarian Engine note for Bavarian Engine for Sale, BMW Engine, Original BMW Engine, and Old BMW Engine buyers. Focus: ${focus}.`,
        image,
        tag,
        noteIndex: i + 1
      });
    }
  });

  return items;
}

window.OBE_DATA = {
  products: buildInventory(),
  reviews: buildReviews(),
  contentLibrary: buildContentLibrary(),
  faqs: [
    {
      question: "What is Original Bavarian Engine?",
      answer:
        "Original Bavarian Engine is a Bavarian Engine for Sale specialist offering VIN-matched BMW Engine, Original BMW Engine, and Old BMW Engine stock with documented crates."
    },
    {
      question: "Can I buy a Bavarian Engine for Sale online?",
      answer:
        "Yes. Browse Bavarian Engine inventory, confirm VIN match, then order a crated BMW Engine with tracking from Original Bavarian Engine."
    },
    {
      question: "Are these an Original BMW Engine or replica units?",
      answer:
        "We sell Original BMW Engine and Old BMW Engine units only — stamp-verified Bavarian Engine stock, not replica long blocks."
    },
    {
      question: "Do you ship Old BMW Engine units internationally?",
      answer:
        "Yes. Original Bavarian Engine supports European and worldwide tracked freight for every Bavarian Engine order."
    },
    {
      question: "How do I match the right BMW Engine before payment?",
      answer:
        "Share your VIN and engine code with Original Bavarian Engine. We confirm Bavarian Engine suffix fitment before invoice."
    },
    {
      question: "Why choose Original Bavarian Engine for a BMW Engine purchase?",
      answer:
        "You get Bavarian Engine for Sale transparency: stamp photos, inclusion lists, warranty language, and WhatsApp support after delivery."
    }
  ]
};

