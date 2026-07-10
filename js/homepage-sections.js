// Homepage content sections — warehouse inventory photos from local sets
const HOMEPAGE_GALLERY_SETS = [
  'set-0108', 'set-0014', 'set-0087', 'set-0052', 'set-0047',
  'set-0061', 'set-0060', 'set-0046', 'set-0050'
];

const HOMEPAGE_SECTIONS = [
  {
    tag: 'ABOUT US',
    title: 'Why Buy Used BMW Engines From bmwusedengines',
    imageAlt: 'BMW TwinPower Turbo engine cover',
    reverse: false,
    paragraphs: [
      "When your BMW needs a replacement engine, choosing the right supplier makes the difference between a quick fix and a costly comeback. At bmwusedengines, we have spent over twenty years building Europe's most trusted used BMW engine operation from our Hamburg warehouse. More than 3,100 tested units sit ready to ship — petrol, diesel, classic, and modern — and every engine carries documented proof of mechanical health before it reaches your workshop.",
      "Buying a used engine online demands transparency. That is why bmwusedengines publishes compression readings, leak-down percentages, and dyno verification for every unit in our catalog. No stock photos. No vague grading. When you order from us, you receive pictures of your actual engine, a full test report, and a 6-month mechanical warranty we honour without argument. Our return rate stays below 0.4% because our testing catches problems before dispatch.",
      "Whether you are restoring a classic E30 with an M20, replacing a failed N47 in your daily F30, or building a track car around an S54 or B58, our technical team offers free fitment consultation before you buy. We have supplied engines for over 15,000 projects since 2003 — from straightforward like-for-like swaps to complex M57 conversions in Land Rover Defenders and B58 installs in E36 shells.",
      "Unlike general salvage yards that grade engines by appearance alone, bmwusedengines sources from fleet decommissioning programmes, insurance write-offs with documented mileage, and private collections with verifiable service history. Each engine arrives dirty and unproven. It leaves tested, cleaned, photographed, and installation-ready. That process separates us from every other used BMW engine supplier in Europe.",
      "Our pricing reflects real mechanical value. A freshly painted engine with unknown internals may look cheap, but the true cost appears when your workshop finds scored bores, failed chain guides, or coolant contamination after fitting. We would rather lose a sale than ship an engine we cannot stand behind. Every member of our team drives BMW products — we understand the investment our customers make.",
      "Based in Hamburg — one of Europe's largest automotive logistics hubs — we access German fleet auctions, manufacturer service centres, and a deep network of BMW specialists across northern Europe. When a rare S38 or S85 enters our inventory, it typically sells within 48 hours because our collector and workshop mailing list receives immediate notification.",
      "Not every customer needs the newest engine. Many of our happiest buyers are classic BMW owners seeking period-correct used replacements that preserve their vehicle's character. An M20B25 with 120,000 km and uniform compression is often a better choice for an E30 restoration than a modern swap that compromises originality. We stock classic units in depth because preserving BMW heritage matters as much as pushing performance."
    ]
  },
  {
    tag: 'TESTING',
    title: 'How We Test Every Used BMW Engine',
    imageAlt: 'BMW engine on pallet in warehouse',
    reverse: true,
    paragraphs: [
      "Our testing protocol was developed over twenty years and thousands of engines. It begins the moment an engine arrives at our Hamburg facility. First, external inspection: we check for cracks in the block and head, assess sump condition, verify that all major components are present, and photograph every angle. Engines with catastrophic external damage are rejected immediately — they never enter our sales inventory.",
      "Compression testing follows. Each cylinder is tested warm with a calibrated gauge, and readings must fall within 10% of each other and within specification for the engine family. A single low cylinder triggers further investigation: borescope inspection, leak-down testing, and assessment of whether the issue is valve-related, ring-related, or indicative of head gasket failure. We document everything in a standardised report that accompanies your engine.",
      "Leak-down testing measures the percentage of compressed air escaping from each cylinder over a timed period. Healthy petrol engines typically show 5–15% leak-down; diesels run higher due to tighter tolerances. Readings above 20% on any cylinder result in either rebuild or rejection, depending on the nature and location of the leak. These numbers are not estimates — they are measured values recorded on your test certificate.",
      "The dyno run is the final gate. Your engine is mounted on our SuperFlow dynamometer, connected to fuel, cooling, and exhaust systems appropriate for its family. We verify that it starts cleanly, idles smoothly, reaches operating temperature without abnormal readings, and produces oil pressure within specification at both idle and elevated RPM. For turbocharged engines, we additionally verify boost response and check for excessive smoke under load.",
      "This process takes 4–6 hours per engine. It is not fast, and it is not cheap to operate. But it is the reason our customers install our engines and drive away without callbacks. When a workshop calls us with a question, we can reference the specific test data for their engine — not generic assurances, but the actual numbers from their unit. That level of accountability is what premium means in the engine supply business.",
      "Oil analysis is available as an optional add-on for customers who want additional confidence. A sample taken before shipment reveals bearing wear metals, fuel dilution, and coolant contamination that compression and leak-down tests alone might miss. Fleet operators ordering multiple units routinely request this service, and the data becomes part of their vehicle maintenance records for compliance and resale documentation.",
      "Our workshop floor operates six days a week with three dedicated test cells. During peak season we process up to 40 engines per week through the full protocol. Despite this volume, we have never compromised the individual attention each engine receives. No engine ships without a signed test certificate from the technician who performed the verification. Customers who wish to witness testing firsthand are welcome to visit our Hamburg facility by appointment."
    ]
  },
  {
    tag: 'CLASSICS',
    title: 'Classic & Vintage BMW Engines in Stock',
    imageAlt: 'BMW engine close-up with hoses and components',
    reverse: false,
    paragraphs: [
      "There is something irreplaceable about a well-maintained classic BMW engine. The mechanical honesty of an M20 that revs freely to 6,500 rpm. The turbine-smooth idle of an M30 straight-six that has never been apart. The motorsport pedigree of an S14 or S38 that carried BMW's racing reputation through the 1980s and 1990s. These old engines were designed in an era when BMW engineers prioritised driving feel over emissions compliance, and their character endures decades after production ended.",
      "At bmwusedengines, we are custodians of this heritage. Our classic engine inventory is not an afterthought — it is a core part of who we are. We employ technicians who learned their craft on M20 and M30 platforms before progressing to N and B series engines. Their expertise in old BMW powerplants is available to every customer who calls our workshop, whether you are rebuilding an E21 323i or sourcing an M50 for an E30 swap.",
      "The old engines in our warehouse tell stories. An M20B27 pulled from a 1989 E30 325i with 89,000 km and a complete service booklet. An M30B35 from an E34 535i that spent its life on Autobahn commutes between Munich and Stuttgart. An M57 306d3 from a decommissioned E39 fleet vehicle with documented oil changes every 10,000 km. Each engine carries history, and we document that history alongside our mechanical test results so you know exactly what you are buying.",
      "Restoration projects demand patience and precision. We support that process by offering engines in multiple condition grades: tested originals for budget-conscious builds, low-mileage units for drivers who want maximum remaining life, and fully rebuilt engines for concours restorations where every component must meet factory specification. Our rebuild programme covers M20, M50, M52, M54, S54, and M57 families with new gaskets, seals, timing components, and bearings.",
      "The photographs on our website show real engines from our warehouse — old cast-iron blocks with decades of patina, aluminium heads cleaned but not over-polished, and the honest wear of components that have done their duty and are ready to serve again. We do not hide the age of our classic inventory. We celebrate it. An engine that has run 150,000 km with consistent compression readings is a testament to BMW build quality, not a liability to be disguised with fresh paint.",
      "Classic BMW engines hold a special place in the market. Values for clean E30, E36, and E46 examples continue to rise, and the availability of quality replacement old engines decreases as donor cars are consumed. By maintaining deep stock of M10, M20, M30, M50, M52, M54, and S54 units, we ensure that the next generation of BMW owners can keep these iconic vehicles on the road. Investing in a documented old engine today protects the value of your vehicle tomorrow.",
      "We photograph every angle of every old engine in our inventory — top, bottom, front, rear, and close-ups of critical areas like the timing cover, sump, and cylinder head mating surface. These photographs are your pre-purchase inspection. Study them carefully, compare compression readings across similar listings, and ask our team to explain any detail you do not understand. An informed purchase is a successful purchase."
    ]
  },
  {
    tag: 'CATALOG',
    title: '3,100+ Used BMW Engines — Full Range',
    imageAlt: 'BMW engine block workshop inventory',
    reverse: true,
    paragraphs: [
      "Our inventory spans every significant BMW engine generation from the 1960s to the present day. Classic enthusiasts will find M10, M20, M30, and M50 units suitable for E30, E28, and E34 restorations. The M20 in particular remains one of our most requested old engines — its balance of reliability, parts availability, and tuning potential makes it the backbone of the classic BMW community. We stock M20B25 and M20B27 variants in multiple conditions, from low-mileage originals to fully rebuilt units.",
      "For the E36 and E46 generation, our M50, M52, and M54 inventory is unmatched. The M54B30 remains the gold standard for daily-driver reliability in the E46 platform, while the S54B32 serves the performance market with documented compression readings that give track builders confidence before installation. We also maintain substantial stock of M57 diesel engines — the legendary 3.0-litre inline-six diesel that has powered everything from E39 530d touring cars to Defender conversions and marine applications.",
      "The N-series generation brought turbocharging to the mainstream BMW lineup, and our N54, N55, N52, N47, and N57 stock reflects the continued demand for these platforms. N54 and N55 engines are particularly popular among F-series performance enthusiasts, while N47 and N57 diesels serve the fleet and commercial market where downtime costs money. Every diesel engine in our inventory is checked for timing chain condition, injector function, and turbocharger play before listing.",
      "Modern B-series engines represent the current state of BMW powerplant technology. Our B48, B58, and B57 inventory serves owners of current-generation 3 Series, 5 Series, X3, and X5 vehicles who face dealer replacement quotes exceeding €12,000. A tested B58 from our facility typically costs 40–60% less than dealer supply, with identical mechanical specification and our warranty backing. S55 and S58 M Performance engines cater to the F80, F82, and G-series M car market where factory power is just the starting point.",
      "What makes our catalog unique is depth within each family. We do not stock one M54 and call it a day — we stock dozens of M54 variants across different production years, mileage brackets, and condition grades. Our online catalog allows you to filter by fuel type, engine family, era, power output, and price range. Each listing shows multiple photographs of the actual engine you will receive, including close-ups of old cast-iron surfaces, timing covers, and sump conditions.",
      "Performance engines command premium prices in the market, and we believe premium prices demand premium verification. Our S54, S55, S58, S63, and S65 inventory includes documented rod bearing inspection results, VANOS function checks, and turbocharger condition assessments. For the S54 specifically — an engine notorious for rod bearing wear — we measure crank end float and inspect bearing shells on every unit before listing."
    ]
  },
  {
    tag: 'TRUST',
    title: 'Why Garages and Drivers Trust bmwusedengines',
    imageAlt: 'BMW engine workshop testing',
    reverse: false,
    paragraphs: [
      "Independent workshops across Europe recommend us because we make their lives easier. When a customer's E90 320d arrives with a seized N47, the workshop needs an engine quickly, at a fair price, with documentation that protects them if something goes wrong. We deliver all three. Our trade accounts receive priority allocation, bulk pricing, and direct access to our technical team for fitment queries. Over 200 workshops hold active accounts with us, and our repeat purchase rate among trade customers exceeds 85%.",
      "Enthusiasts choose us for expertise. Building an M57 into an E30 is not a bolt-in operation. It requires custom mounts, wiring adaptation, exhaust fabrication, and ECU programming. Our team has guided hundreds of these conversions from planning through first start. We sell complete swap kits for the most popular combinations — E30, E36, E46, E39, and Land Rover Defender — with every component needed for installation. When you buy a kit from us, you are not just buying parts; you are buying the accumulated knowledge of every swap we have completed.",
      "Our shipping operation is built for engines, not parcels. Every engine is mounted on a custom steel transport frame, secured with rated straps, wrapped in protective sheeting, and palletised for freight collection. Transit insurance covers the full purchase value. We ship to all 28 EU member states, plus the United Kingdom, Switzerland, and Norway with full customs documentation. Standard delivery to mainland Europe takes 3–5 business days. Germany receives next-day service on most orders.",
      "The 6-month mechanical warranty is not marketing language — it is a contractual commitment. If an internal component fails due to a pre-existing condition that our testing should have caught, we repair, replace, or refund. We have honoured over 200 warranty claims in our history, and every one was resolved to the customer's satisfaction. Extended warranty options are available for fleet operators who need 12-month coverage across multiple units.",
      "Our blog library of 215 technical articles demonstrates the depth of knowledge behind our sales operation. Each article contains approximately 2,500 words of genuine technical guidance on topics ranging from N47 versus N57 selection to M57 swap wiring and Euro 6 compliance for imported diesels. We publish this content because an informed customer makes better decisions, and better decisions lead to successful projects and repeat business.",
      "Customer reviews speak louder than any marketing claim. Our 99.7% satisfaction rate is based on post-delivery surveys sent to every customer within 30 days of engine receipt. We publish representative reviews on our website because authenticity matters. When a customer reports an issue, we resolve it publicly and use the feedback to improve our testing protocol. This continuous improvement cycle has reduced our warranty claim rate by 60% over the past five years."
    ]
  },
  {
    tag: 'ORDER NOW',
    title: 'How to Order Your Used BMW Engine',
    imageAlt: 'BMW engine in workshop',
    reverse: true,
    paragraphs: [
      "The path from a failed engine to a running car should be straightforward. We designed our buying process to eliminate uncertainty at every step. Begin by browsing our online catalog of 3,100+ engines. Use the filters to narrow by fuel type, engine family, era, or price range. Each listing includes multiple photographs of the actual old or modern engine you will receive, full specifications, mileage, condition grade, and pricing. When you find a candidate, contact our technical team for a free compatibility check.",
      "Our consultation takes 15 minutes and can save you thousands of euros. We verify that the engine code matches your vehicle platform, confirm that the DME generation is compatible with your body electronics, and advise on any supporting components you may need — mounts, clutch, exhaust, cooling upgrades. For swap projects, we provide a complete bill of materials and realistic labour estimate so you can budget accurately before committing.",
      "Once you confirm your order, a 30% deposit reserves the engine. We send updated photographs and the test report within 24 hours. The balance is due before dispatch. Payment options include SEPA bank transfer, credit card, and PayPal for orders under €3,000. Trade customers with approved credit accounts may use 30-day payment terms. We issue a pro-forma invoice immediately and a final invoice upon dispatch.",
      "Delivery is to kerbside on a standard pallet. You will need forklift access or an engine hoist at the delivery address. We provide tracking from the moment the freight carrier collects your engine. Upon delivery, inspect the packaging before signing — if damage is visible, note it on the delivery receipt and contact us immediately. Our transit insurance covers damage in shipping, though incidents are exceptionally rare.",
      "Installation should be performed by a qualified technician following BMW repair procedures. Use the correct oil specification, torque all fasteners to specification, bleed the cooling system completely, and perform a DME alignment if required for your engine generation. Our technical team remains available throughout your installation — call +49 176 13627363 or email flashkingpro202@gmail.com during business hours (Monday–Friday, 08:00–18:00 CET).",
      "Your BMW deserves a powerplant that matches its engineering heritage. Whether that means a numbers-matching M20 for a concours E30, a low-mileage B58 for a daily F30, or a built S54 for a track E46 M3, bmwusedengines has the inventory, the testing capability, and the technical expertise to deliver. Over 15,000 satisfied customers across Europe have trusted us with their engine projects. Browse our catalog, speak with our team, and let us help you find the perfect engine for your BMW today.",
      "Do not let a failed engine end your relationship with your BMW. The cost of a quality replacement engine is a fraction of the cost of replacing the entire vehicle, and it preserves the character, history, and driving experience that drew you to the marque in the first place. Every day a BMW sits immobile in a garage is a day of driving pleasure lost. Our team can typically identify, test, and ship a suitable replacement within one week of your enquiry. Contact us at flashkingpro202@gmail.com or +49 176 13627363 — your engine project starts here."
    ]
  },
  {
    tag: 'M57 KITS',
    title: 'M57 Diesel Engine Swap Kits',
    imageAlt: 'M57 diesel engine inventory',
    reverse: false,
    paragraphs: [
      "The BMW M57 3.0-litre inline-six diesel remains one of the most respected swap engines in Europe. Its torque, reliability, and fuel economy make it the go-to choice for E30, E36, E46 conversions, Land Rover Defenders, and specialist 4x4 builds. At bmwusedengines we stock over 400 tested M57 variants and supply complete swap kits for the most popular platforms.",
      "Our M57 kits are not generic bolt-together packages. Each kit uses engines we have personally bench-tested, mounts validated on our own project cars, and wiring adapters developed with specialist ECU tuners. E30, E36, E46, and E39 kits include the engine, custom mounts, downpipe, intercooler piping, harness adapter, and DME with immobiliser solution.",
      "The Defender conversion kit is a favourite among overland and expedition builders. The M57's 410–520 Nm of torque transforms on-road and off-road capability, while BMW refinement at cruising speed fixes one of the Defender's biggest weaknesses. Our kit includes adapter plate, clutch, mounts, custom exhaust manifold, and full wiring integration.",
      "Every M57 in our swap programme gets enhanced testing beyond our standard protocol. We inspect swirl flaps, verify turbo shaft play, test piezo injectors, and check timing chain and guide rails. Neglected M57 units can suffer swirl flap failure and chain guide wear — our testing catches these issues before they become yours.",
      "Technical support comes with every kit. Installation docs, torque specs, wiring diagrams, and phone support during the build. For workshops doing their first M57 conversion, we offer a pre-install briefing that walks through critical steps and common pitfalls. First-start success rate exceeds 97% across supervised installations.",
      "Whether you need an E46 330d replacement, a classic E30 with modern diesel power, or an expedition Defender, bmwusedengines provides the engine, hardware, and expertise to finish the job. Browse our M57 swap kits or contact our team for a platform-specific quote within 24 hours."
    ]
  },
  {
    tag: 'DIESEL',
    title: 'Used BMW Diesel Engines — N47, N57, M57, B47, B57',
    imageAlt: 'BMW diesel engine TwinPower',
    reverse: true,
    paragraphs: [
      "BMW diesel engines power millions of vehicles across Europe, and when they fail, the cost of dealer replacement can exceed the value of the vehicle. bmwusedengines specialises in tested diesel replacements at a fraction of dealer cost. Our diesel inventory spans every generation from the old M21 and M41 units through M47, M57, N47, N57, B47, and B57 — over 1,200 diesel engines in stock at any time.",
      "The N47 2.0-litre diesel remains one of the most common replacement requests for E90, E91, F30, and F20 platforms. Known for timing chain issues on early production units, the N47 requires careful inspection before purchase. Every N47 in our inventory has its timing chain, guide rails, and tensioner inspected — either physically or through acoustic analysis during the dyno run. We grade each unit clearly so buyers understand exactly what they are receiving.",
      "The N57 3.0-litre twin-turbo diesel serves the upper mid-range and SUV market with power outputs from 245 to 381 hp. These engines are popular in X5, X6, 530d, and 335d applications where performance and towing capacity matter. Our N57 stock includes both single-turbo and twin-turbo variants, with documentation of turbocharger condition, EGR system status, and AdBlue SCR system functionality for Euro 5 and Euro 6 compliance.",
      "For modern BMW diesel owners facing B47 and B57 replacement, dealer quotes frequently exceed €8,000–12,000 for the engine alone. Our tested B47 and B57 units typically range from €3,500–6,500 depending on mileage and specification, with identical mechanical function and our 6-month warranty. We handle the logistics of shipping diesel engines with all necessary emissions documentation for cross-border EU delivery.",
      "Fleet operators represent a significant portion of our diesel business. When a logistics company operates fifty F10 520d vehicles, a single engine failure is an inconvenience — but five simultaneous failures become a crisis. Our fleet programme provides priority stock allocation, consistent engine grading across multiple units, volume pricing, and dedicated account management. We have supplied fleet replacements to operators running up to 200 BMW diesel vehicles across Germany, Netherlands, and Austria.",
      "Old diesel engines also have their place in our inventory. The M57 306d2 and 306d3 units from E39 and E46 era remain popular for budget-conscious replacements and swap projects. These older diesels may lack the refinement of modern common-rail systems, but their mechanical simplicity and proven longevity make them attractive for applications where electronic complexity is undesirable. Every old diesel engine we sell is tested with the same rigour as our newest stock."
    ]
  },
  {
    tag: 'PRICING',
    title: 'Fair Prices on Tested Used BMW Engines',
    imageAlt: 'BMW engine inspection',
    reverse: false,
    paragraphs: [
      "Engine pricing is a topic surrounded by confusion. Two suppliers may list what appears to be the same M54B30 at vastly different prices, and understanding why requires knowledge of what happens between salvage yard and your garage. At bmwusedengines, our pricing directly reflects the mechanical condition, mileage, testing level, and warranty coverage of each unit. We never advertise a low price and then add hidden fees at checkout.",
      "Our entry-level engines start from approximately €450 for older high-mileage units suitable for budget builds and non-critical applications. Mid-range engines with documented compression readings and moderate mileage typically fall between €1,200 and €2,800. Premium low-mileage engines with full dyno verification and comprehensive test reports range from €3,000 to €8,000 depending on family and specification. Rare performance engines — S54, S55, S63 — command higher prices reflecting their scarcity and testing requirements.",
      "Every price displayed on our website is inclusive of testing and documentation. The test report, photographic evidence, and warranty certificate are not optional extras — they are included in every purchase. Shipping is quoted separately based on destination and engine weight, and displayed before you confirm your order. VAT is applied correctly for all EU transactions, with net pricing available for business customers with valid EU VAT numbers.",
      "Comparing our prices to dealer supply illustrates the value proposition clearly. A dealer replacement B58 engine for an F30 340i typically costs €10,000–14,000 including installation. Our tested B58 unit costs €4,500–6,500, and installation by an independent workshop adds €800–1,500 in labour. The total saving often exceeds €5,000 while delivering an engine that has been individually tested rather than sitting on a warehouse shelf as an untested exchange unit.",
      "We offer a core exchange programme that reduces the net cost of your purchase. Return your old engine — complete with block, head, and sump — and receive a credit of €150–800 depending on the family and condition. Even seized engines have value as core returns, and the programme encourages responsible recycling of engine components. Credits are applied to your account within 7 business days of core inspection.",
      "Price matching is not our policy because matching a competitor's price on an untested engine would require us to remove the testing that justifies our pricing. However, if you find a tested engine with equivalent documentation at a lower price from another European supplier, bring us the quote and we will explain the differences in testing scope, warranty terms, and included services. An informed comparison almost always confirms that our pricing represents superior value when total cost of ownership is considered."
    ]
  },
  {
    tag: 'M POWER',
    title: 'Used BMW M Performance & Turbo Engines',
    imageAlt: 'BMW M Power engine',
    reverse: true,
    paragraphs: [
      "BMW M Performance engines represent the pinnacle of the company's engineering capability. From the naturally aspirated S54 that powered the E46 M3 to the twin-turbo S63 in modern M5 and M8 models, these powerplants demand respect, proper maintenance, and careful sourcing when replacement becomes necessary. bmwusedengines maintains one of Europe's largest stocks of M Performance engines, each individually tested and documented.",
      "The S54B32 remains the most sought-after naturally aspirated M engine. Its 343 hp output, 8,000 rpm redline, and motorsport-derived architecture make it the heart of the E46 M3 — widely considered the greatest M3 ever built. Rod bearing wear is the primary concern with S54 engines, and every unit in our inventory has documented bearing inspection results. We measure crankshaft end float, inspect bearing shells, and perform oil analysis to verify internal condition before listing any S54 for sale.",
      "Turbocharged M Performance engines introduce additional complexity. The S55 in the F80 M3 and F82 M4, the S58 in current G-series M cars, and the S63 across the M5/M6/M8 range all require turbocharger condition assessment, charge air cooler inspection, and fuel system verification as part of our testing protocol. These engines produce enormous power but generate significant heat, making cooling system condition equally important to internal mechanical health.",
      "For enthusiasts building track cars or high-performance street machines, we offer both stock and enhanced engines. Stock units provide reliable baseline performance with documented factory-specification output on our dyno. Enhanced units may include upgraded rod bearings, refreshed turbos, performance intercoolers, and ECU remapping — all documented and tested before sale. We clearly distinguish between stock and enhanced specification in every listing to prevent misunderstanding.",
      "The N54 and N55 twin-scroll turbo engines, while not full M Power units, deserve mention in any performance discussion. These engines respond exceptionally well to tuning, with many owners achieving 400+ hp from software and bolt-on modifications alone. Our N54 and N55 stock serves both replacement buyers — those whose engines have suffered rod bearing or HPFP failure — and performance builders seeking a clean, tested base engine for modification. Each unit's compression, leak-down, and turbo condition are documented.",
      "Investing in a performance BMW engine is a significant financial decision. Whether you are replacing a failed S55 in your F80 M3 or building an S54-powered track weapon from scratch, the engine you choose determines the reliability and performance ceiling of your entire project. bmwusedengines provides the testing documentation, warranty protection, and technical expertise that performance builds demand. Contact our team to discuss your M Power requirements and receive recommendations tailored to your specific application and budget.",
      "Every performance engine we sell has been photographed from multiple angles, run on our dyno, and issued a test certificate before it appears in our catalog. We do not list engines speculatively or ship units that have not completed our full verification process. When you invest in an S54, S55, or S63 from bmwusedengines, you invest in certainty — the certainty that your engine will perform as documented from the first turn of the key."
    ]
  },
  {
    tag: 'CONTACT',
    title: 'Talk to a BMW Engine Specialist',
    imageAlt: 'BMW engine components',
    reverse: false,
    paragraphs: [
      "Our technical team is available Monday through Friday, 08:00 to 18:00 Central European Time, to answer your engine questions, confirm fitment compatibility, and provide quotations. Reach us by phone at +49 176 13627363 or by email at flashkingpro202@gmail.com. We respond to all enquiries within 2 hours during business hours, and most quotation requests are fulfilled within 24 hours including compression test results and updated photographs of your selected engine.",
      "When contacting us, please provide your vehicle model, year, engine code if known, VIN if available, and your delivery country. This information allows our technicians to confirm compatibility, calculate shipping costs, and identify the best engine options for your budget and requirements. For swap projects, describe your target platform and intended use — daily driver, track car, off-road conversion — so we can recommend the most suitable powerplant and supporting components.",
      "We welcome visitors to our Hamburg facility by appointment. Seeing your engine in person, witnessing the dyno test, and meeting our technical team provides confidence that no photograph or report can fully replicate. Whether you are across the street or across the continent, bmwusedengines is your partner for quality BMW engines, old and new, tested and warranted, delivered to your door. Browse our 3,100+ engine catalog today and discover why over 15,000 European customers trust us with their most important automotive projects."
    ]
  }
];

// Homepage — unique image per slot (gallery + sections never share a path)
const HOMEPAGE_GALLERY_IMAGES = allocateUniqueImages(9, 0);
const HOMEPAGE_SECTION_IMAGES = allocateUniqueImages(HOMEPAGE_SECTIONS.length, 9);

const OLD_ENGINE_GALLERY = HOMEPAGE_GALLERY_IMAGES.map((src, i) => ({
  src,
  alt: `BMW engine warehouse inventory photo ${i + 1}`
}));

function renderContentIntro() {
  const wordCount = countHomepageWords();
  const toc = HOMEPAGE_SECTIONS.map((section, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `<a href="#content-${num}" class="content-toc-link"><span class="content-toc-num">${num}</span>${section.tag}</a>`;
  }).join('');

  return `
    <section class="content-intro-section" id="engine-guide">
      <div class="container">
        <div class="content-intro-inner">
          <span class="section-tag">Buyer Guide</span>
          <h2>Everything About Buying Used BMW Engines</h2>
          <p class="content-intro-lead">A complete guide to choosing, testing, and fitting used BMW engines — written by the bmwusedengines team from 20+ years of hands-on workshop experience in Hamburg.</p>
          <div class="content-intro-meta">
            <span><strong>${HOMEPAGE_SECTIONS.length}</strong> chapters</span>
            <span><strong>${wordCount.toLocaleString()}+</strong> words</span>
            <span><strong>3,100+</strong> engines in stock</span>
          </div>
          <nav class="content-toc" aria-label="Guide chapters">${toc}</nav>
        </div>
      </div>
    </section>`;
}

function renderContentSections() {
  return HOMEPAGE_SECTIONS.map((section, i) => {
    const img = HOMEPAGE_SECTION_IMAGES[i];
    const num = String(i + 1).padStart(2, '0');
    const [lead, ...rest] = section.paragraphs;
    return `
    <section class="content-block-section${i % 2 ? ' alt-bg' : ''}" id="content-${num}">
      <div class="container content-block${section.reverse ? ' reverse' : ''}">
        <div class="content-block-image">
          <img src="${img}" alt="${section.imageAlt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
          <span class="content-block-badge">${section.tag}</span>
          <span class="content-block-number">${num}</span>
        </div>
        <div class="content-block-text">
          <span class="section-tag">${section.tag}</span>
          <h2>${section.title}</h2>
          <p class="content-lead">${lead}</p>
          ${rest.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    </section>`;
  }).join('');
}

function renderEngineGallery() {
  return `
    <section class="engine-gallery-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Warehouse</span>
          <h2>Real Used BMW Engines — Hamburg Warehouse Photos</h2>
          <p>These are actual engines from the bmwusedengines warehouse — photographed, tested, and ready to ship to your garage.</p>
        </div>
        <div class="engine-gallery-grid">
          ${OLD_ENGINE_GALLERY.map(img => `
            <div class="engine-gallery-item">
              <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function countHomepageWords() {
  let total = 0;
  HOMEPAGE_SECTIONS.forEach(s => {
    s.paragraphs.forEach(p => { total += p.split(/\s+/).length; });
  });
  return total;
}
