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
        title: `BMW ${model} Original ${code}`,
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
          "Crated export shipping with impact-controlled palletization, documentation support, and tracked worldwide dispatch.",
        conditionReport:
          "Mechanical inspection log completed. Additional visual evidence and verification notes available upon request."
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
    "Best used BMW engine sourcing experience we have had. Real stock transparency and no confusion on included components.",
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

window.OBE_DATA = {
  products: buildInventory(),
  reviews: buildReviews(),
  faqs: [
    {
      question: "Are these engines original BMW units?",
      answer:
        "Yes. We sell only original BMW engine and powertrain stock with code-level verification and listing documentation."
    },
    {
      question: "How many engines are in your inventory?",
      answer:
        "Our live inventory contains more than 500 listed engine and swap-kit records across core BMW families."
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes. We support European and worldwide shipping with crated packaging and tracked freight coordination."
    },
    {
      question: "Can private buyers order directly?",
      answer:
        "Yes. Private collectors and owners can order directly, and we also work closely with independent workshops."
    },
    {
      question: "Can I verify compatibility before payment?",
      answer:
        "Absolutely. Share your VIN and engine code, and we confirm matching options before invoice."
    },
    {
      question: "Do you offer M57 swap kits?",
      answer:
        "Yes. M57 swap kit inventory is available and can be filtered directly in the collection."
    }
  ]
};
