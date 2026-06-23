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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n57.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-e90-n57d30a-lci-engine-2011/main.webp",
      "https://bavarianengine.com/wp-content/uploads/2026/06/BMW-X6-E71-N63B44A-Engine-2011-1-2.webp"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n47.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-125d-f20-n47d20d-engine-2012/main.webp",
      "https://bavarianengine.com/wp-content/uploads/2026/06/images-7-2.jpeg"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/m57.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-231hp-m57-2009-engine/main.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-m57-swap.webp"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b57.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/540d-740d-640d-840d-3-0-b57d30b-engine/main.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-b47-b57-euro6.webp"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b47.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmwx3-x4-b47d20a-engine/main.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-b47-b57-euro6.webp"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/b58.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-f32-440i-engine-2017/main.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-b58-petrol.webp"
    ]
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
    images: [
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/home/home-m57-swap.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/m57.webp",
      "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/images/bmw-330d-231hp-m57-2009-engine/main.webp"
    ]
  }
];

const CONDITION_ROTATION = [
  "Factory Original, Compression Tested",
  "Original Block, Re-sealed",
  "Workshop Inspected, Bore Scope Verified",
  "Collector Grade, Documentation Archived"
];

const AVAILABILITY_ROTATION = ["In Stock", "In Stock", "Limited", "Reserved"];

function buildInventory() {
  const products = [];
  OBE_FAMILY_TEMPLATES.forEach((template) => {
    for (let i = 1; i <= template.count; i += 1) {
      const suffix = ["A", "B", "C", "D"][i % 4];
      const sequenceCode = String(1000 + i);
      const code = template.codeRoot === "M57SWAP" ? `${template.codeRoot}-${sequenceCode}` : `${template.codeRoot}${suffix}`;
      const year = String(template.yearBase + (i % template.yearSpan));
      const mileageValue = 62000 + ((i * 1377) % 158000);
      const priceEur = template.basePrice + (i % 18) * 170 + Math.floor(i / 7) * 30;
      const model = template.models[i % template.models.length];
      const image = template.images[i % template.images.length];
      const gallery = [
        template.images[i % template.images.length],
        template.images[(i + 1) % template.images.length],
        template.images[(i + 2) % template.images.length]
      ];

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

window.OBE_DATA = {
  products: buildInventory(),
  reviews: [
    {
      name: "Markus T.",
      location: "Stuttgart, Germany",
      text: "The N57 unit arrived exactly as documented and the compression profile matched our workshop checks.",
      rating: 5
    },
    {
      name: "Oliver J.",
      location: "Manchester, UK",
      text: "Very strong stock quality and clear communication before purchase. Fitment was accurate.",
      rating: 5
    },
    {
      name: "Leonard C.",
      location: "Zurich, Switzerland",
      text: "Premium packing, trackable freight, and great technical support during installation.",
      rating: 5
    },
    {
      name: "Sofia A.",
      location: "Stockholm, Sweden",
      text: "VIN confirmation was immediate and the engine arrived with complete handling documentation.",
      rating: 5
    },
    {
      name: "James O.",
      location: "Dublin, Ireland",
      text: "Exactly as listed. Great support before payment and the crate arrived on schedule.",
      rating: 5
    },
    {
      name: "Luc V.",
      location: "Brussels, Belgium",
      text: "Professional service. The donor details and platform guidance made ordering easy.",
      rating: 5
    }
  ],
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
