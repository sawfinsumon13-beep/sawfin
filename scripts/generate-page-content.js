const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PAGES_DIR = path.join(DATA_DIR, 'pages');
const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'image-sets-manifest.json'), 'utf8'));
const SET_IDS = Object.keys(manifest.sets).sort();

const ENGINE_SET_COUNT = 116;

function allocateUniqueImages(count, startIndex = 0) {
  const images = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const setNum = (idx % ENGINE_SET_COUNT) + 1;
    const imgNum = (Math.floor(idx / ENGINE_SET_COUNT) % 6) + 1;
    images.push(`images/engines/sets/set-${String(setNum).padStart(4, '0')}/${String(imgNum).padStart(2, '0')}.webp`);
  }
  return images;
}

const IMAGE_SEEDS = {
  'm57-swap-kits': 25,
  services: 35,
  about: 45,
  contact: 55,
  policies: 70
};

function countWordsFromSections(sections) {
  let total = 0;
  sections.forEach(s => s.paragraphs.forEach(p => { total += p.split(/\s+/).length; }));
  return total;
}

function countWordsFromFaq(faq, introParagraphs = []) {
  let total = 0;
  introParagraphs.forEach(p => { total += p.split(/\s+/).length; });
  faq.forEach(item => {
    total += item.q.split(/\s+/).length + item.a.split(/\s+/).length;
  });
  return total;
}

const PAGE_DEFINITIONS = {
  'm57-swap-kits': {
    sections: [
      {
        tag: 'WHY M57',
        title: 'The BMW M57 — Europe\'s Most Trusted Swap Diesel',
        imageAlt: 'M57 diesel engine on pallet in warehouse',
        reverse: false,
        paragraphs: [
          'The BMW M57 3.0-litre inline-six diesel has earned its reputation as the definitive swap engine for enthusiasts who demand torque, reliability, and refinement in a package that fits multiple platforms. Produced from 1998 through 2013 across several generations — from the early 184 hp 306D1 through the twin-turbo 286 hp 306D4 — the M57 delivers 410–520 Nm of torque across a broad rev range that transforms any vehicle it powers.',
          'At Premium BMW Engines, our M57 swap programme is built on over 400 tested diesel units in stock at any time. Every engine destined for a swap kit undergoes enhanced inspection beyond our standard protocol: swirl flap condition assessment, turbocharger shaft play measurement, piezo injector function verification, timing chain and guide rail inspection, and EGR system evaluation. We reject engines with documented swirl flap disintegration risk or chain guide wear beyond acceptable limits.',
          'What separates our swap kits from generic engine sales is integration expertise. We have completed hundreds of M57 conversions across E30, E36, E46, E39, and Land Rover Defender platforms. Each kit reflects lessons learned from real installations — mount geometry validated on project vehicles, wiring adapters developed with specialist ECU tuners, and exhaust routing proven on the dyno before we ship to customers.',
          'The M57\'s mechanical simplicity relative to modern common-rail diesels makes it attractive for applications where electronic complexity is undesirable. Pre-2006 units use a single turbocharger with vacuum-actuated wastegate control, while later 306D3 and 306D4 variants add twin-turbo sequential charging for improved response. Our technical team advises on the optimal variant for your platform, intended use, and emissions requirements before you commit to a purchase.',
          'Torque delivery defines the M57 driving experience. Unlike petrol engines that must rev to produce meaningful output, the M57 generates peak torque from 1,750 rpm — ideal for towing, off-road crawling, and relaxed Autobahn cruising. Defender conversion customers consistently report that the M57 addresses the classic Land Rover\'s primary weakness: refined, effortless highway performance without sacrificing low-speed control.',
          'Our Hamburg facility photographs every M57 engine from six angles before listing — main warehouse view, side angle showing hoses and ancillaries, rear turbo detail, stamp area close-up, wiring harness, and complete floor shot on pallet. These are the actual engines in our swap programme, not stock photography. When you receive your kit, the engine matches the images in your quotation documentation.'
        ]
      },
      {
        tag: 'KIT CONTENTS',
        title: 'What Every Premium M57 Swap Kit Includes',
        imageAlt: 'M57 swap kit engine components on pallet',
        reverse: true,
        paragraphs: [
          'A complete M57 swap kit from Premium BMW Engines is not an engine on a pallet with a handshake promise. Each kit is assembled from components we have personally validated through installation on our own project vehicles. The standard kit includes: tested M57 engine with documented compression and leak-down results, custom CNC-machined engine mounts specific to your platform, wiring harness adapter with labelled connectors, DME with immobiliser solution, downpipe or exhaust manifold, intercooler piping where applicable, and clutch assembly for manual conversions.',
          'Engine mounts are the most critical fitment component in any swap. Incorrect geometry transmits vibration, stresses exhaust flanges, and can cause sump ground contact under load. Our mounts are machined from billet aluminium with polyurethane bushings rated for diesel torque levels. Each mount design is validated on a test vehicle before entering production — we do not sell mounts that have not been physically installed and driven.',
          'Wiring integration represents 40–60% of total swap labour on most platforms. BMW engine harnesses are model-year and market-specific, with variations in sensor count, connector types, and wire colour coding. Our adapters bridge the donor engine harness to your chassis wiring without cutting factory connectors. Every wire is labelled at both ends, and pin-out documentation is included with each kit. For E30 and E36 swaps, we provide CAS immobiliser deletion or adaptation depending on your security requirements.',
          'The DME (Digital Motor Electronics) must match the engine generation and be programmed for your application. We supply remapped DME units with immobiliser solutions tested on the specific platform. E46 swaps often retain OBD-II compatibility with minimal adaptation; E30 swaps require standalone management or full EWS deletion. Our ECU programming service includes base maps optimised for your turbo configuration and fuel system.',
          'Cooling system components are platform-specific. The M57 requires a radiator with adequate capacity — we recommend aluminium upgrades for any swap producing more than 200 hp. Expansion tank routing, heater hose connections, and electric fan wiring are documented in our installation guides. Oil cooler additions are mandatory for towing applications and recommended for all Defender conversions operating in warm climates.',
          'Optional upgrades include larger intercoolers for 306D4 twin-turbo engines, upgraded fuel pumps for performance applications, stainless steel exhaust systems, and reinforced clutch assemblies rated for 500+ Nm. Our technical consultation identifies which upgrades are necessary for your intended use versus which are cosmetic — we do not upsell components that do not improve reliability or performance for your specific project.'
        ]
      },
      {
        tag: 'PLATFORMS',
        title: 'Platform-Specific M57 Conversion Guides',
        imageAlt: 'M57 engine prepared for E46 swap',
        reverse: false,
        paragraphs: [
          'The E46 is the most straightforward M57 swap platform. The engine bay was designed to accommodate inline-six diesels in factory 330d and 320d variants, meaning physical fitment requires minimal modification. Our E46 kit uses factory-style mount positions, OBD-compatible wiring adapters, and direct-fit downpipes for 306D2 and 306D3 engines. Installation typically requires 20–30 workshop hours for a competent technician with BMW experience.',
          'E36 conversions demand more fabrication but reward the effort with a lighter chassis and classic proportions. The M57 fits with our custom mount kit and steering rack clearance modifications documented in our installation guide. Gearbox options include the ZF 5HP19 automatic from E39 diesel donors or the Getrag 6-speed manual with appropriate clutch and flywheel. Cooling upgrades are essential — the E36 radiator is marginal for M57 heat rejection under sustained load.',
          'The E30 M57 swap has become a cult favourite among European enthusiasts seeking modern diesel reliability in a classic shell. Our E30 kit includes engine mounts that position the M57 correctly relative to the strut towers and steering column, a custom sump for crossmember clearance, and wiring adapters that integrate with the E30 instrument cluster where possible. Budget 40–60 hours for a first-time installer; experienced swap shops complete the work in 25–35 hours.',
          'E39 petrol-to-diesel conversions appeal to owners who want touring car practicality with diesel economy. The E39 engine bay accommodates M57 engines with our adapter kit, though gearbox selection is critical — the petrol Getrag 6-speed does not bolt to M57 diesels without adapter plates. We supply complete E39 diesel gearbox assemblies (ZF 5HP24 or Getrag 260) with matching propshaft and differential ratios.',
          'The Land Rover Defender conversion has transformed overland and expedition vehicle capability across Europe. Our Defender kit includes adapter plate, heavy-duty clutch, custom engine mounts, exhaust manifold routing around the chassis, and full wiring integration with the Defender\'s existing electrical architecture. The M57\'s 410+ Nm transforms off-road performance while delivering 8–10 L/100 km highway consumption — a combination no factory Defender engine achieves.',
          'Custom platforms are welcome. We have supplied M57 kits for marine applications, Unimog conversions, and specialist rally support vehicles. Contact our technical team with chassis dimensions, intended use, and power requirements. We provide a detailed bill of materials and realistic labour estimate within 24 hours of receiving your enquiry.'
        ]
      },
      {
        tag: 'INSTALLATION',
        title: 'Installation Support & First-Start Protocol',
        imageAlt: 'M57 engine wiring and hoses close-up',
        reverse: true,
        paragraphs: [
          'Technical support is included with every M57 swap kit purchase. Our team provides installation documentation, torque specifications, wiring diagrams, and telephone support during the installation process. For workshops undertaking their first M57 conversion, we offer a pre-installation briefing call that walks through critical steps and common pitfalls. This support has contributed to a first-start success rate exceeding 97% across all kit installations we have supervised.',
          'The installation sequence follows a proven protocol. Begin with mount installation and engine positioning — verify clearance at full suspension compression before final tightening. Install gearbox and propshaft, confirming alignment within BMW specifications. Route wiring harness along factory pathways, securing with appropriate clips every 30 cm. Connect cooling system components and bleed thoroughly before adding fuel.',
          'Pre-first-start checks are non-negotiable: oil level at maximum mark with LL-04 specification oil, coolant fill with BMW-approved coolant, fuel system primed and leak-free, battery voltage above 12.6V, all ground connections clean and tight, exhaust system secured with no leaks at manifold joints. Crank the engine without starting for 10 seconds to build oil pressure, then allow 30 seconds before attempting first start.',
          'First start should occur with the vehicle secured on level ground, bonnet open, and a fire extinguisher accessible. Idle speed should stabilise within 60 seconds; hunting or rough idle indicates wiring or sensor issues requiring diagnosis before driving. Allow the engine to reach operating temperature at idle before revving — check for coolant, oil, and fuel leaks at every junction. Initial driving should be gentle for the first 500 km to allow clutch bedding and mount settling.',
          'DME adaptation and coding vary by platform. E46 installations typically require CAS alignment and instrument cluster programming. E30 standalone installations need base map verification on the dyno. We provide ISTA-compatible coding instructions and can perform remote programming sessions for customers with BMW diagnostic equipment. Our Hamburg facility offers in-house programming by appointment.',
          'Post-installation, we remain available for troubleshooting. Common first-week issues include minor coolant seepage from hose clamps (retorque after thermal cycling), exhaust gasket settling (normal for new gaskets), and occasional DME adaptation codes that clear after drive cycles. Our warranty covers the engine and kit components; installation labour is the customer\'s responsibility unless performed at our Hamburg facility.'
        ]
      },
      {
        tag: 'ORDERING',
        title: 'How to Order Your M57 Swap Kit',
        imageAlt: 'M57 diesel engine ready for shipping on pallet',
        reverse: false,
        paragraphs: [
          'Ordering begins with a technical consultation. Contact us at flashkingpro202@gmail.com or +49 176 13627363 with your vehicle model, year, current engine (if applicable), intended use (daily driver, track, off-road, towing), and delivery country. Our technicians confirm platform compatibility, recommend the optimal M57 variant, and identify any supporting components you may need beyond the standard kit.',
          'Quotation includes itemised pricing: engine with test report, mount kit, wiring adapter, DME programming, exhaust components, and optional upgrades. Shipping is quoted separately based on destination and kit weight. A 30% deposit reserves your engine and initiates kit assembly; the balance is due before dispatch. Typical lead time from deposit to shipment is 5–10 business days depending on custom component fabrication.',
          'Every kit ships with photographic documentation of your specific engine, compression and leak-down test results, wiring pin-out diagrams, installation guide specific to your platform, torque specification sheet, and warranty certificate. Transit insurance covers the full kit value. Delivery is to kerbside on a standard pallet — forklift or engine hoist access required.',
          'We welcome facility visits by appointment. Witnessing your engine on the dyno before kit assembly provides confidence that photographs alone cannot replicate. Our Hamburg warehouse is accessible from the A7 motorway; contact us to schedule a visit during business hours (Monday–Friday, 08:00–18:00 CET).',
          'Whether you are building a daily-driver E46 diesel replacement, a classic E30 with modern torque, or an expedition Defender, our M57 programme provides the engine, hardware, and expertise to complete your project successfully. Over 500 M57 swap kits supplied across Europe since 2008 — browse our kit listings above or contact our team for a custom quotation within 24 hours.'
        ]
      }
    ]
  },

  services: {
    sections: [
      {
        tag: 'SOURCING',
        title: 'Engine Sourcing — 3,100+ Units Across Every BMW Generation',
        imageAlt: 'BMW engines on pallets in Hamburg warehouse',
        reverse: false,
        paragraphs: [
          'Premium BMW Engines maintains the largest dedicated BMW engine inventory in Europe. Our 4,200 m² Hamburg facility houses over 3,100 tested engines spanning every significant generation from the classic M10 through the latest B58 and S58 powerplants. This depth of stock means we can fulfil replacement requests within days rather than weeks, and rare units — S38, S85, early S14 — are often available when specialist suppliers have none.',
          'Our procurement network extends across Germany, Austria, Switzerland, and the Netherlands. We source specifically from fleet decommissioning programmes where service history is verifiable, insurance write-offs with documented mileage, and private collections where maintenance records accompany the engine. General salvage yards grade engines by visual appearance; we reject units that fail our incoming inspection regardless of cosmetic condition.',
          'Each engine enters our facility unproven and leaves tested, photographed, and documented. The transformation from unknown to verified is what separates Premium BMW Engines from every other supplier on the continent. Our pricing reflects genuine mechanical value — compression readings, leak-down percentages, and dyno verification — not fresh paint and marketing photography.',
          'Classic engine sourcing requires particular expertise. M20, M30, M50, and M54 units are increasingly scarce as donor cars are consumed by the restoration market. We maintain deep stock of period-correct old engines because preserving BMW\'s engineering heritage is as important as supplying modern replacements. An M20B25 with 120,000 km and uniform compression is often the right choice for an E30 restoration.',
          'Performance engine procurement follows strict criteria. S54, S55, S58, and S63 units undergo rod bearing inspection, VANOS function checks, and turbocharger condition assessment before listing. For the S54 specifically — notorious for rod bearing wear — we measure crank end float and inspect bearing shells on every unit. Performance buyers receive documentation that track builds demand.',
          'Fleet operators benefit from our volume sourcing capability. When a logistics company needs five identical N47 engines for their F10 520d fleet, we allocate units from the same production batch with consistent grading. Priority stock allocation, volume pricing, and dedicated account management are available for commercial customers running 20+ BMW vehicles.'
        ]
      },
      {
        tag: 'TESTING',
        title: 'Dyno Testing — Every Engine Verified Before Sale',
        imageAlt: 'BMW engine on pallet with hoses visible',
        reverse: true,
        paragraphs: [
          'Our testing protocol was developed over twenty years and thousands of engines. It begins with external inspection: cracks in block and head, sump condition, component completeness, and photographic documentation from six angles. Engines with catastrophic external damage are rejected immediately — they never enter our sales inventory.',
          'Compression testing follows on warm engines with calibrated gauges. Readings must fall within 10% of each other and within specification for the engine family. A single low cylinder triggers borescope inspection, leak-down testing, and assessment of whether the issue is valve-related, ring-related, or indicative of head gasket failure. Everything is documented in a standardised report accompanying your engine.',
          'Leak-down testing measures compressed air escaping from each cylinder. Healthy petrol engines typically show 5–15% leak-down; diesels run higher due to tighter tolerances. Readings above 20% on any cylinder result in rebuild or rejection. These are measured values on your test certificate — not estimates or generic assurances.',
          'The dyno run is the final gate. Engines are mounted on our SuperFlow dynamometer with appropriate fuel, cooling, and exhaust systems. We verify clean starting, smooth idle, operating temperature without abnormal readings, and oil pressure within specification at idle and elevated RPM. Turbocharged engines additionally undergo boost response verification and smoke assessment under load.',
          'This process takes 4–6 hours per engine. During peak season we process up to 40 engines per week through the full protocol. No engine ships without a signed test certificate from the technician who performed verification. Customers may witness testing at our Hamburg facility by appointment.',
          'Optional oil analysis reveals bearing wear metals, fuel dilution, and coolant contamination that compression tests alone might miss. Fleet operators ordering multiple units routinely request this service; the data becomes part of vehicle maintenance records for compliance and resale documentation.'
        ]
      },
      {
        tag: 'REBUILDS',
        title: 'Engine Rebuilds — In-House Machine Shop & Assembly',
        imageAlt: 'BMW engine block workshop inventory',
        reverse: false,
        paragraphs: [
          'Our rebuild programme covers M20, M50, M52, M54, S54, N54, N55, and M57 families with new gaskets, seals, timing components, and bearings. Machine work — boring, honing, head surfacing, crack testing — is performed in-house by technicians who specialise in BMW platforms. Rebuilt engines carry the same 6-month warranty as tested originals.',
          'Rebuild versus replace economics favour replacement when labour rates exceed €80/hour. A comprehensive S54 rebuild with new rod bearings, piston rings, valve stem seals, and timing components typically costs €8,000–12,000 in parts before machining and assembly. A tested replacement unit often represents better value — our team provides honest guidance on which path suits your budget and timeline.',
          'S54 rebuilds receive particular attention: new rod bearings (Vanos-independent or upgraded), refreshed VANOS units, valve stem seal replacement, and timing chain components. We measure crankshaft end float and inspect bearing shells before reassembly. Track-oriented customers may specify upgraded bearings and performance gaskets rated for sustained high-RPM operation.',
          'Diesel rebuilds address timing chain guides, injector seals, turbocharger cartridges, and swirl flap removal or replacement depending on customer preference. M57 rebuilds include new chain, guides, tensioner, and oil pump chain. N47 rebuilds focus on the timing chain system that defines this engine\'s reputation — we use upgraded guide materials where available.',
          'Each rebuilt engine is dyno-tested before sale with the same protocol as tested originals. Compression readings, leak-down results, and running parameters are documented. Photographs show the assembled engine from multiple angles. Rebuilt units are clearly graded and priced relative to tested originals with equivalent documentation.',
          'Core exchange credits reduce rebuild costs. Return your old engine complete with block, head, and sump; receive credit of €150–800 depending on family and condition. Even seized engines have core value. Credits apply toward rebuild services or future purchases within 7 business days of core inspection.'
        ]
      },
      {
        tag: 'SHIPPING',
        title: 'EU-Wide Shipping — Built for Engines, Not Parcels',
        imageAlt: 'BMW engine secured on transport pallet',
        reverse: true,
        paragraphs: [
          'Our shipping operation is designed specifically for engine transport. Every unit is mounted on a custom steel frame, secured with rated straps, wrapped in protective sheeting, and palletised for dedicated automotive freight. Transit insurance covers the full purchase value on all orders exceeding €2,000.',
          'Standard delivery times: Germany 1–2 business days, EU mainland 3–5 business days, UK/Switzerland/Norway 5–7 business days. Express shipping is available on request. Tracking information is provided via email upon dispatch. Free shipping applies to orders exceeding €5,000 within Germany.',
          'Delivery is to kerbside on a standard EUR pallet. Customers need forklift access or an engine hoist at the delivery address. Our logistics team prepares full customs documentation for non-EU destinations including commercial invoices, origin certificates, and emissions compliance paperwork where required.',
          'Damage in transit is exceptionally rare — less than 0.3% of shipments — but fully covered when it occurs. Inspect packaging before signing the delivery receipt; note visible damage and contact us immediately. We resolve transit claims within 5 business days with repair, replacement, or refund at our discretion.',
          'Fleet and commercial customers may arrange scheduled deliveries to workshop facilities. We coordinate with your receiving department for timed arrivals and can supply multiple engines on consolidated pallets for volume orders. Dedicated account managers handle logistics for customers ordering 5+ engines per quarter.',
          'International shipping beyond Europe is available on request. We have supplied engines to customers in Australia, South Africa, and the Middle East with appropriate export documentation. Contact our logistics team for freight quotes and lead times to your destination country.'
        ]
      },
      {
        tag: 'SUPPORT',
        title: 'Warranty, Consultation & Ongoing Technical Support',
        imageAlt: 'BMW engine components and wiring detail',
        reverse: false,
        paragraphs: [
          'Every tested engine includes a 6-month mechanical warranty covering internal components against pre-existing defects. External ancillaries — turbochargers, injectors, sensors — carry 30-day coverage. Extended warranty to 12 months is available for fleet and commercial customers. We have honoured over 200 warranty claims with 100% customer satisfaction on approved claims.',
          'Free 15-minute technical consultation is available before every purchase. We verify engine code compatibility with your platform, confirm DME generation matches your body electronics, and advise on supporting components — mounts, clutch, exhaust, cooling. For swap projects we provide a complete bill of materials and realistic labour estimate.',
          'ECU programming services include DME coding, CAS alignment, instrument cluster adaptation, and EWS deletion for track applications. Our programmers work with ISTA, INPA, and compatible aftermarket tools. Remote programming sessions are available for customers with BMW diagnostic equipment.',
          'Workshop training programmes cover BMW engine identification, diagnostic procedures, and swap installation best practices. On-site training at your facility or remote sessions via video call. Over 200 independent workshops across Europe hold active trade accounts with us.',
          'Post-installation support remains available throughout your project. Call +49 176 13627363 or email flashkingpro202@gmail.com during business hours (Monday–Friday, 08:00–18:00 CET). Our technical team references your specific test data — not generic assurances — when troubleshooting.',
          'Core exchange, trade accounts, fleet programmes, and custom solutions are available on request. Contact our team to discuss your requirements — we handle projects from single classic restorations to fleet-wide diesel replacements across hundreds of vehicles.'
        ]
      },
      {
        tag: 'FLEET & TRADE',
        title: 'Fleet Programmes, Trade Accounts & Volume Supply',
        imageAlt: 'BMW fleet engine supply warehouse',
        reverse: true,
        paragraphs: [
          'Fleet operators running 20 or more BMW vehicles face unique engine replacement challenges. Downtime costs money, consistency matters for workshop scheduling, and pricing must reflect volume. Our fleet programme provides priority stock allocation, consistent engine grading across multiple units, volume pricing tiers, and dedicated account management with a named contact who understands your operation.',
          'Trade account setup completes within 48 hours of application. We require business registration documentation, EU VAT number, and two trade references. Approved accounts receive net pricing, 30-day payment terms, and access to our trade technical hotline. Over 200 independent workshops across Europe hold active accounts with repeat purchase rates exceeding 85%.',
          'Volume orders of 5+ engines qualify for consolidated pallet shipping — significant freight savings compared to individual deliveries. We coordinate scheduled arrivals with your workshop calendar and can supply engines pre-labelled with your internal fleet numbers for inventory tracking.',
          'Commercial warranty extensions to 12 months are available for fleet customers. Claims are processed with priority routing and replacement engines allocated from reserved stock to minimise vehicle downtime. Our fleet warranty claim resolution averages 3 business days from submission to resolution.',
          'Quarterly account reviews provide inventory forecasts, pricing updates, and early notification of rare engine availability. Fleet customers sourcing S55, B58, or N57 engines benefit from advance notice when desirable units enter our testing queue — often 48 hours before public listing.'
        ]
      }
    ]
  },

  about: {
    sections: [
      {
        tag: 'OUR STORY',
        title: 'Founded in Hamburg — Two Decades of BMW Engine Excellence',
        imageAlt: 'BMW engines warehouse inventory Hamburg',
        reverse: false,
        paragraphs: [
          'Premium BMW Engines was founded in Hamburg in 2003 by a team of certified BMW master technicians who recognised that the used engine market lacked the transparency and testing rigour that BMW owners deserved. What began as a specialist workshop rebuilding classic M20 and M30 engines has grown into Europe\'s most comprehensive BMW engine supplier, with over 15,000 engines sold to customers in 28 countries.',
          'Hamburg was chosen deliberately. As one of Europe\'s largest automotive logistics hubs, the city provides direct access to German fleet auctions, manufacturer service centres, and a deep network of BMW specialists across northern Europe. Our geographic advantage means we see engines before competitors do, and we offer faster turnaround from sourcing to shipment than suppliers based in rural locations.',
          'Our 4,200 m² facility combines warehouse storage, three dedicated dyno test cells, a machine shop for rebuilds, and administrative offices. Over 40 staff work across procurement, testing, logistics, technical support, and customer service. Every member of our technical team drives BMW products — we understand the emotional and financial investment our customers make because we make the same investments ourselves.',
          'The company philosophy has never changed: we would rather lose a sale to a cheaper competitor than sell an engine we cannot stand behind. Every engine carries documented proof of mechanical condition. Our return rate is below 0.4% — not because we make returns difficult, but because our testing protocol catches problems before they reach your garage.',
          'Growth has been organic, driven by customer referrals and workshop partnerships rather than advertising. Over 200 independent workshops across Europe hold active trade accounts with us. Our repeat purchase rate among trade customers exceeds 85%. Enthusiasts choose us for expertise; workshops choose us because we make their lives easier.',
          'Today we stock over 3,100 engines at any time, publish 215 technical articles, and maintain the largest dedicated BMW engine inventory on the continent. The mission remains the same as it was in 2003: provide BMW owners with quality powerplants, honest documentation, and expert guidance for every engine project.'
        ]
      },
      {
        tag: 'FACILITY',
        title: 'Our Hamburg Warehouse & Testing Facility',
        imageAlt: 'BMW engine on pallet main warehouse view',
        reverse: true,
        paragraphs: [
          'The Hamburg facility is purpose-built for engine handling. High-bay warehouse storage accommodates over 3,000 engines on custom steel racking, with climate control preventing condensation on machined surfaces. Each engine is photographed from six angles upon arrival and again before dispatch — the photographs in our catalog are of actual inventory, not stock images.',
          'Three SuperFlow dynamometer test cells operate six days per week. Each cell is equipped with appropriate fuel systems, cooling circuits, and exhaust extraction for petrol and diesel engines from 75 hp M10 units through 750 hp S63 twin-turbo V8s. Test data is recorded digitally and attached to the engine\'s sales record permanently.',
          'The machine shop handles boring, honing, head surfacing, crack testing, and component refurbishment. CNC equipment machines custom swap mounts and adapter plates. The shop supports our rebuild programme and M57 swap kit fabrication. Quality control inspects every machined component before assembly.',
          'Logistics operates from a dedicated dispatch bay with forklift access, pallet wrapping equipment, and freight carrier coordination. Engines are never shipped loose — every unit is frame-mounted, strapped, wrapped, and insured. Average dispatch time from payment confirmation is 24–48 hours for in-stock engines.',
          'Customer visits are welcome by appointment. Seeing your engine in person, witnessing the dyno test, and meeting our technical team provides confidence that remote purchasing cannot fully replicate. We host visitors from across Europe weekly — from Milan enthusiasts collecting E46 M3 S54 engines to Rotterdam workshop owners inspecting fleet diesel stock.',
          'Environmental responsibility guides disposal practices. Engines that fail our testing protocol are dismantled for recyclable components. Core exchange programme encourages return of old engines for responsible recycling. Fluids are disposed of through licensed hazardous waste contractors.'
        ]
      },
      {
        tag: 'TEAM',
        title: 'Certified Technicians With 80+ Years Combined Experience',
        imageAlt: 'BMW engine hoses and components close-up',
        reverse: false,
        paragraphs: [
          'Our technical team includes eight certified BMW master technicians, three diesel specialists, two ECU programmers, and four dyno operators. Collective experience exceeds 80 years on BMW platforms from classic M10 carburetted engines through current B58 and S58 turbocharged units. Several team members learned their craft on M20 and M30 platforms before progressing to N and B series engines.',
          'Procurement specialists evaluate incoming engines against strict acceptance criteria. Visual inspection, initial compression checks, and documentation review occur before an engine enters the testing queue. Rejection rate at intake is approximately 35% — we prefer a smaller inventory of verified engines over a large inventory of unknowns.',
          'Customer-facing technical advisors handle fitment consultation, swap project planning, and post-installation troubleshooting. Each advisor specialises in specific engine families: classic (M10–S54), modern diesel (N47–B57), and performance (N54–S63). This specialisation ensures you speak with someone who knows your engine platform intimately.',
          'The content team publishes 215 technical articles covering buying guides, swap tutorials, maintenance schedules, and logistics advice. Each article contains approximately 2,500 words of genuine technical guidance — not SEO filler. We publish because informed customers make better decisions, and better decisions lead to successful projects.',
          'Continuous training keeps the team current with BMW\'s evolving technology. B-series engine architecture, direct injection systems, AdBlue SCR compliance, and hybrid integration are covered in quarterly internal training sessions. External courses from BMW training centres supplement in-house knowledge.',
          'Our team\'s passion extends beyond business hours. Facility project cars include an E30 M57 swap, an E46 S54 track build, and a G30 B58 daily driver. These projects validate our swap kits, test our rebuild quality, and keep technical advice grounded in hands-on experience rather than theoretical knowledge.'
        ]
      },
      {
        tag: 'VALUES',
        title: 'Quality, Transparency & Customer Trust',
        imageAlt: 'BMW TwinPower engine warehouse photo',
        reverse: true,
        paragraphs: [
          'Quality tested means every engine dyno-verified with documented compression and leak-down results before sale. We do not sell engines that have not completed our full protocol. Cosmetic condition is documented honestly — we do not hide age or wear on classic inventory. An engine with 150,000 km and consistent compression is a testament to BMW build quality, not a liability to disguise.',
          'Transparent pricing means no hidden fees. Test reports, photographic evidence, and warranty certificates are included in every purchase — not optional extras. Shipping is quoted before order confirmation. VAT is applied correctly for all EU transactions. We do not advertise low prices and add fees at checkout.',
          'Customer trust is measured by our 99.7% satisfaction rate from post-delivery surveys and 0.4% return rate. When issues occur, we resolve them publicly and use feedback to improve our testing protocol. Warranty claim rate has decreased 60% over five years through continuous improvement.',
          'Heritage preservation matters. Classic BMW engines — M20, M30, M50, S14, S38 — represent irreplaceable engineering character. We stock old engines in depth because the next generation of BMW owners deserves to keep iconic vehicles on the road. Investing in a documented old engine today protects your vehicle\'s value tomorrow.',
          'Community engagement includes sponsorship of BMW club events, technical presentations at enthusiast gatherings, and free workshop advice through our blog and telephone support. We are part of the BMW community, not merely a vendor to it.',
          'These values guide every decision from procurement through dispatch. They are why 15,000 customers across Europe trust Premium BMW Engines with their most important automotive projects.'
        ]
      },
      {
        tag: 'VISIT US',
        title: 'Visit Our Hamburg Facility or Contact Our Team',
        imageAlt: 'BMW engine floor shot on pallet',
        reverse: false,
        paragraphs: [
          'We welcome visitors to our Hamburg facility by appointment. Witness your engine on the dyno, inspect inventory in person, and meet the technicians who tested your unit. Contact flashkingpro202@gmail.com or +49 176 13627363 to schedule a visit during business hours (Monday–Friday, 08:00–18:00 CET).',
          'Cannot visit in person? We provide video calls during dyno testing, updated photographs within 24 hours of enquiry, and detailed test reports before you commit. Remote purchasing from Premium BMW Engines carries the same warranty and support as in-person sales.',
          'Trade and fleet customers may arrange dedicated account reviews at our facility. We demonstrate inventory depth, testing protocols, and logistics capabilities tailored to commercial requirements. Account setup typically completes within 48 hours of initial enquiry.',
          'Premium BMW Engines — Europe\'s leading supplier of tested BMW engines. Over 3,100 in stock, 15,000+ sold since 2003, 99.7% customer satisfaction. Browse our catalog, read our technical articles, and contact our team to start your engine project today.'
        ]
      },
      {
        tag: 'HERITAGE',
        title: 'Preserving BMW Engineering Heritage Across Europe',
        imageAlt: 'Classic BMW engine warehouse heritage',
        reverse: true,
        paragraphs: [
          'BMW\'s engineering legacy spans six decades of inline-six excellence, motorsport pedigree, and diesel innovation. Premium BMW Engines exists partly to ensure that legacy remains drivable. Every M20 we sell keeps an E30 on the road. Every documented S54 preserves an E46 M3 for the next generation of enthusiasts. This is not sentiment — it is our business mission.',
          'We sponsor BMW club events across Germany, Austria, and the Netherlands, providing technical speakers, engine display units, and workshop raffle prizes. Our technicians present at enthusiast gatherings on topics from M57 swap planning to S54 rod bearing prevention. The community we serve is the community we belong to.',
          'Educational partnerships with automotive colleges in Hamburg provide students with hands-on exposure to BMW engine testing and diagnostics. Several of our current technicians began as apprentices through these programmes. Investing in the next generation of BMW specialists ensures the expertise pool does not shrink as electrification reshapes the industry.',
          'Environmental responsibility extends to heritage preservation. Reusing a tested M54 with 120,000 km of remaining life prevents manufacturing emissions associated with new engine production. Our core exchange programme completes the cycle — old engines return for responsible recycling, new-to-you engines extend vehicle lifespans by years or decades.',
          'The classic BMW market continues to appreciate. Clean E30, E36, and E46 examples command prices that justify quality engine investment. We help owners make decisions that protect vehicle value: period-correct M20 for concours builds, refreshed M54 for driver-quality E46s, documented S54 for M3 investments. Engine choice affects resale as much as body condition.'
        ]
      }
    ]
  },

  contact: {
    layout: 'contact',
    introTitle: 'Speak With Our BMW Engine Specialists in Hamburg',
    introParagraphs: [
      'Our technical team answers engine quotes, fitment questions, and shipping enquiries Monday through Friday, 08:00–18:00 CET. Email flashkingpro202@gmail.com or call +49 176 13627363 — we respond within 2 hours during business hours.',
      'Whether you need a single M54 for an E46 restoration or a fleet of N47 diesels, our Hamburg team provides the same expert attention. Facility visits are welcome by appointment.',
      'Before contacting us, have your vehicle model, year, engine code, and delivery country ready. This allows our technicians to provide accurate compatibility advice and shipping quotes on the first response.'
    ],
    faq: [
      { q: 'How do I request an engine quote?', a: 'Email flashkingpro202@gmail.com or call +49 176 13627363 with your vehicle model, year, engine code if known, VIN, delivery country, and intended use. We respond within 2 hours during business hours with engine options, compression test results, itemised pricing, and shipping costs. Quotations are valid for 7 days. For swap projects, include photographs of your engine bay — our technicians can assess fitment feasibility from images before you commit. Multiple engine options are provided when available so you can balance budget against remaining engine life.' },
      { q: 'What information do you need for a fitment check?', a: 'Provide vehicle model, year, current engine code, and whether you need a like-for-like replacement or swap. For swaps, describe the target platform and transmission preference. Our free 15-minute consultation verifies DME compatibility, mount requirements, and supporting components before you commit. Common issues we catch include wrong DME generation for vehicle year, mismatched transmission bell housing patterns, and incompatible immobiliser systems — each can add €500–2,000 in unexpected costs if not identified before purchase.' },
      { q: 'How quickly can you ship my engine?', a: 'In-stock engines dispatch within 24–48 hours of payment confirmation. Germany: 1–2 business days. EU mainland: 3–5 business days. UK, Switzerland, Norway: 5–7 business days with customs documentation. Tracking is provided when the freight carrier collects your engine. Express delivery is available within Germany and neighbouring countries on request. Fleet orders of 3+ engines may use consolidated pallet shipping with scheduled delivery windows.' },
      { q: 'Can I inspect my engine before it ships?', a: 'Yes. We send updated photographs and test reports within 24 hours of enquiry. Video calls during dyno testing are available — many customers witness their engine run on our SuperFlow dynamometer before authorising dispatch. Visit our Hamburg facility by appointment to see your engine in person, meet the technician who tested it, and inspect inventory. Facility visits are especially valuable for high-value purchases such as S54, S55, S63, and low-mileage B58 engines.' },
      { q: 'Do you ship outside the European Union?', a: 'We ship to the UK, Switzerland, Norway, and other destinations with full customs documentation including commercial invoices and origin certificates. Contact us with your country for freight quotes and import requirements. We have successfully delivered engines to Australia and the Middle East. Post-Brexit UK shipments include all customs paperwork prepared by our logistics team. Delivery is to kerbside — forklift or engine hoist access required at the delivery address.' },
      { q: 'What are your payment terms?', a: 'A 30% deposit reserves your engine and removes it from public inventory. Balance due before dispatch. We accept SEPA bank transfer, credit cards, and PayPal for orders under €3,000. Trade accounts may apply for 30-day payment terms after credit approval — application requires business registration, EU VAT number, and two trade references. Pro-forma invoice issued on deposit; final invoice on dispatch. Deposits refundable minus 10% administration fee if cancelled before dispatch preparation begins.' },
      { q: 'How does the 6-month warranty work?', a: 'All tested engines include a 6-month mechanical warranty covering crankshaft, connecting rods, pistons, rings, bores, camshafts, valves, timing components, oil pump, and engine-mounted water pump. Submit claims to flashkingpro202@gmail.com with invoice number, photographs, diagnostic fault codes, and compression results from a qualified workshop. We assess within 5 business days. Approved claims resolved by repair reimbursement, replacement engine, or pro-rata refund. External ancillaries carry 30-day coverage.' },
      { q: 'What is your returns policy?', a: 'Returns accepted within 14 days if the engine has not been installed, modified, or run. Engine must be returned in original packaging on the transport frame. A 15% restocking fee applies unless the engine was materially misrepresented in our listing. Refunds processed within 10 business days of inspection at our Hamburg facility. Return shipping costs are the buyer\'s responsibility unless the return is due to our error. Rebuilt engines and custom swap kits are non-returnable unless defective.' },
      { q: 'Do you offer a core exchange programme?', a: 'Return your old BMW engine complete with block, head, and sump for credit of €150–800 depending on engine family and core condition. Seized engines have reduced but non-zero core value. Notify us before shipping cores — we provide return instructions and expected credit range. Credits issued within 7 business days of core inspection. Credits apply toward future purchases or are refunded on request. Cores with catastrophic block or head damage may receive minimum credit.' },
      { q: 'Can workshops open a trade account?', a: 'Yes. Over 200 independent workshops across Europe hold active trade accounts with us. Application requires business registration documentation, valid EU VAT number, and two trade references. Approved accounts receive net pricing, 30-day payment terms, priority stock allocation, and access to our trade technical hotline. Setup typically completes within 48 hours. Repeat purchase rate among trade customers exceeds 85%.' },
      { q: 'What support is available after delivery?', a: 'Technical support continues throughout your installation project. Call +49 176 13627363 or email flashkingpro202@gmail.com with your invoice number for torque specifications, wiring clarifications, cooling system bleed procedures, and DME coding assistance. Our team references your specific test data — not generic advice — when troubleshooting. Post-installation warranty claims follow the same contact channels with photographic and diagnostic evidence required.' },
      { q: 'How do I schedule a facility visit?', a: 'Contact flashkingpro202@gmail.com to book Monday through Friday, 08:00–18:00 CET. Allow 60–90 minutes for a warehouse tour, engine inspection, and technical discussion. Parking for cars and trailers available at our dispatch bay. Loading assistance provided for self-collection. Bring appropriate transport — engines on pallets require trailer or van with minimum 1.5m internal height. Located in Hamburg with access from the A7 motorway; detailed directions provided upon confirmation.' },
      { q: 'What languages do you support?', a: 'English and German fluently for all technical and commercial enquiries. French, Italian, Dutch, and Spanish with translation assistance available. Technical documentation and test reports provided in English as standard; German documentation available on request. Our team handles enquiries from all 28 EU member states plus UK, Switzerland, and Norway daily.' },
      { q: 'How do I track my order?', a: 'Tracking information is emailed when the freight carrier collects your engine from our Hamburg dispatch bay. Our logistics team can coordinate timed delivery with your workshop schedule for commercial addresses. Inspect all packaging before signing the delivery receipt — note any visible damage on the carrier\'s documentation and photograph immediately. Contact us within 24 hours of delivery for transit damage claims; insurance covers orders exceeding €2,000.' },
      { q: 'Do you supply M57 swap kits?', a: 'Yes — complete kits for E30, E36, E46, E39, and Land Rover Defender platforms. Each kit includes tested M57 engine, custom mounts, wiring adapter, DME with immobiliser solution, and exhaust components. See our M57 Swap Kits page for pricing or contact us for custom platform quotations. Technical support and installation documentation included with every kit. First-start success rate exceeds 97% across supervised installations.' }
    ]
  },

  policies: {
    layout: 'policy',
    sections: [
      {
        tag: 'WARRANTY',
        title: '6-Month Mechanical Warranty — Full Terms & Coverage',
        imageAlt: 'BMW engine warranty tested unit',
        reverse: false,
        paragraphs: [
          'All tested engines sold by Premium BMW Engines include a 6-month mechanical warranty covering internal engine components against pre-existing manufacturing defects and mechanical faults documented at the time of sale. This is a contractual commitment, not marketing language — we have honoured over 200 warranty claims with 100% satisfaction on approved claims.',
          'Covered components: crankshaft, connecting rods, pistons, piston rings, cylinder bores, camshaft(s), valves, valve springs, timing components (chain, guides, tensioner), oil pump, and water pump when engine-mounted. Coverage begins on the delivery date recorded on the freight carrier\'s proof of delivery.',
          'External components carry 30-day coverage from delivery: turbochargers, injectors, sensors, wiring looms, alternator, and starter motor when supplied attached to the engine. These components are inspected during our testing protocol but experience higher failure rates due to age and prior use.',
          'Warranty claims must be submitted in writing to flashkingpro202@gmail.com with: invoice number, photographic evidence of the fault, diagnostic fault codes (if applicable), compression test results from a qualified workshop, and description of installation and operating conditions. Our technical team assesses claims within 5 business days.',
          'Approved claims are resolved by repair at an authorised workshop (we reimburse labour at agreed rates), replacement engine of equivalent specification, or pro-rata refund based on operating time since delivery. The customer chooses the resolution method where multiple options are viable.',
          'Warranty is void if: the engine has been modified beyond standard replacement components, overheated due to incorrect installation or cooling system failure, run without proper lubrication or incorrect oil specification, used in competitive motorsport without prior written agreement, or installed by an unqualified technician not following BMW repair procedures.'
        ]
      },
      {
        tag: 'SHIPPING POLICY',
        title: 'Shipping, Delivery & Transit Insurance',
        imageAlt: 'BMW engine shipping pallet Hamburg',
        reverse: true,
        paragraphs: [
          'Engines are shipped on custom-built steel transport frames, secured with rated polyester straps, wrapped in protective VCI sheeting, and mounted on standard EUR pallets (1200×800mm). All shipments within the European Union include transit insurance for the full purchase value.',
          'Delivery times from dispatch: Germany 1–2 business days, EU mainland 3–5 business days, United Kingdom 5–7 business days (customs cleared), Switzerland and Norway 5–7 business days. Express delivery (24–48 hours) is available within Germany and to neighbouring countries on request at additional cost.',
          'Delivery is to kerbside at the address specified on the order. The freight carrier does not install, position, or unpack engines. Customer is responsible for forklift, engine hoist, or manual handling equipment at the delivery point. Engines typically weigh 150–220 kg depending on family and attached components.',
          'Shipping costs are calculated at order confirmation based on destination zone and engine weight. Prices range from €80 (Germany) to €350 (remote EU and non-EU European destinations). Free shipping on orders exceeding €5,000 within Germany. Consolidated shipping discounts apply for multi-engine orders.',
          'Tracking information is provided via email when the freight carrier collects the engine. Our logistics team is available to coordinate delivery timing with your workshop schedule. Scheduled delivery windows can be arranged with most carriers for commercial addresses.',
          'Transit damage claims: inspect packaging before signing the delivery receipt. Note any visible damage on the carrier\'s documentation and photograph the packaging and engine immediately. Contact flashkingpro202@gmail.com within 24 hours. Transit insurance covers damage occurring during freight — our claims rate is below 0.3%.'
        ]
      },
      {
        tag: 'RETURNS',
        title: 'Returns, Refunds & Core Exchange Programme',
        imageAlt: 'BMW engine core exchange return',
        reverse: false,
        paragraphs: [
          'Returns are accepted within 14 days of delivery if the engine has not been installed, modified, or run. The engine must be returned in the same condition and packaging as received, on the original transport frame. Return shipping costs are the buyer\'s responsibility unless the engine was materially misrepresented in our listing.',
          'A 15% restocking fee applies to all returns unless the return is due to our error — wrong engine shipped, test results that do not match the listing, or undocumented mechanical faults discovered on inspection before installation. The restocking fee covers re-testing, re-photography, and re-listing costs.',
          'Refunds are processed within 10 business days of receiving and inspecting the returned engine. Refund method matches the original payment method. Deposits on reserved engines are refundable minus a 10% administration fee if cancellation occurs before kit assembly or dispatch preparation begins.',
          'Core exchange programme: return your old BMW engine (complete with block, head, and sump) for credit of €150–800 depending on engine family and core condition. Seized engines have reduced but non-zero core value. Notify us before shipping cores — we provide return instructions and expected credit range.',
          'Core credits are issued within 7 business days of core inspection at our Hamburg facility. Credits apply to your account toward future purchases or are refunded on request. Cores with catastrophic damage (cracked block, destroyed head) may receive minimum credit or be rejected — we assess fairly and explain our determination.',
          'Rebuilt engines and custom swap kits are non-returnable unless materially defective. These products are assembled to order from tested components and cannot be restocked. Warranty coverage applies as described in our warranty policy.'
        ]
      },
      {
        tag: 'PAYMENT',
        title: 'Payment Terms, Deposits & Trade Accounts',
        imageAlt: 'BMW engine purchase payment terms',
        reverse: true,
        paragraphs: [
          'Payment methods: SEPA bank transfer (preferred), major credit cards (Visa, Mastercard), and PayPal for orders under €3,000. Bank transfer details are provided on the pro-forma invoice. Engine dispatch occurs after cleared funds are received — typically 1–2 business days for SEPA transfers within the EU.',
          'Deposit structure: 30% deposit reserves the engine and removes it from public inventory. Balance due before dispatch. Deposit is refundable minus 10% administration fee if you cancel before we begin dispatch preparation. Once the engine is palletised and freight booked, the deposit becomes non-refundable.',
          'Trade and commercial accounts: approved businesses may apply for 30-day payment terms after credit check. Application requires business registration, VAT number, and two trade references. Credit limits are assigned based on order history. Account customers receive net pricing and priority stock allocation.',
          'VAT: prices on our website include German VAT (19%) for EU private customers. Business customers with a valid EU VAT number purchase VAT-exempt — provide your VAT number at checkout. Non-EU European customers (UK, Switzerland, Norway) receive export pricing without German VAT.',
          'Invoicing: pro-forma invoice issued on deposit receipt, final invoice on dispatch. All invoices include engine specification, test results reference, warranty terms, and shipping details. Invoices are valid for tax and warranty purposes in all EU jurisdictions.',
          'Payment disputes are rare but handled through direct communication first. Contact flashkingpro202@gmail.com with your invoice number and concern. We resolve billing questions within 2 business days. Chargebacks without prior contact may result in account suspension.'
        ]
      },
      {
        tag: 'PRIVACY & TERMS',
        title: 'Privacy, Data Protection & Terms of Sale',
        imageAlt: 'Premium BMW Engines policies',
        reverse: false,
        paragraphs: [
          'Premium BMW Engines collects personal information (name, email, phone, delivery address) solely for processing orders, providing technical support, and communicating about your purchase. We do not sell, share, or distribute personal data to third parties except as required for shipping (freight carriers) and payment processing (banks, PayPal).',
          'Data is stored securely on EU-based servers and retained for the duration of our business relationship plus 7 years for tax and warranty purposes as required by German law. You may request access to, correction of, or deletion of your personal data by contacting flashkingpro202@gmail.com. Deletion requests are honoured except where retention is legally required.',
          'Our website uses cookies for essential functionality only — session management and preference storage. We do not use third-party tracking, advertising, or analytics cookies. No personal data is transmitted to advertising networks.',
          'Terms of sale: all engine sales are subject to availability. Specifications, mileage, and test results are accurate at the time of listing but may vary slightly between units of the same code. Photographs show the actual engine category; the specific engine shipped matches the test report provided before dispatch.',
          'Prices are listed in Euros (€) and include German VAT for EU private customers unless stated otherwise. Prices are subject to change without notice; confirmed orders are honoured at the agreed price on the pro-forma invoice. Governing law: Federal Republic of Germany. Disputes are subject to the jurisdiction of the courts in Hamburg, Germany.',
          'Questions about our policies? Contact flashkingpro202@gmail.com or +49 176 13627363. We explain our terms clearly because informed customers are satisfied customers. Policy updates are posted on this page with effective dates — check back periodically for changes.'
        ]
      },
      {
        tag: 'EXTENDED COVERAGE',
        title: 'Extended Warranty, Fleet Terms & Special Agreements',
        imageAlt: 'BMW engine extended warranty policy',
        reverse: true,
        paragraphs: [
          'Extended warranty to 12 months is available for fleet and commercial customers on request. Pricing is calculated as a percentage of engine purchase price and must be agreed before dispatch. Extended coverage follows the same claim procedures as standard warranty with priority processing for account holders.',
          'Motorsport and track use requires prior written agreement for warranty coverage. Standard warranty is void for competitive use without approval. We offer track-specific warranty packages for S54, S55, and N54 engines used in HPDE and club racing — contact us for terms.',
          'Rebuild warranty covers workmanship and installed components for 6 months from delivery. Rebuilt engines are non-returnable unless materially defective. Machine work warranty covers dimensional accuracy of bored/honed cylinders and surfaced heads for 12 months.',
          'Swap kit warranty covers engine and kit components for 6 months. Installation labour is customer responsibility. First-start support is included — telephone assistance during installation is not a warranty claim but a customer service commitment we honour for all kit purchases.',
          'Force majeure: Premium BMW Engines is not liable for delays caused by freight carrier disruption, customs processing, or events beyond our control. We communicate proactively during disruptions and offer alternative solutions where possible.'
        ]
      }
    ]
  }
};

fs.mkdirSync(PAGES_DIR, { recursive: true });

let index = [];
for (const [slug, page] of Object.entries(PAGE_DEFINITIONS)) {
  const seed = IMAGE_SEEDS[slug] || 0;
  let output;
  let wordCount;

  if (page.layout === 'contact') {
    const [heroImage] = allocateUniqueImages(1, seed);
    wordCount = countWordsFromFaq(page.faq, page.introParagraphs);
    output = {
      slug,
      layout: 'contact',
      heroImage,
      introTitle: page.introTitle,
      introParagraphs: page.introParagraphs,
      faq: page.faq,
      wordCount
    };
    index.push({ slug, wordCount, layout: 'contact' });
    console.log(`  ${slug}: ${wordCount} words, ${page.faq.length} FAQ items`);
  } else if (page.layout === 'policy') {
    const images = allocateUniqueImages(page.sections.length, seed);
    const sections = page.sections.map((s, i) => ({ ...s, image: images[i] }));
    wordCount = countWordsFromSections(sections);
    output = { slug, layout: 'policy', sections, wordCount };
    index.push({ slug, wordCount, sections: sections.length, layout: 'policy' });
    console.log(`  ${slug}: ${wordCount} words, ${sections.length} policy sections`);
  } else {
    const images = allocateUniqueImages(page.sections.length, seed);
    const sections = page.sections.map((s, i) => ({ ...s, image: images[i] }));
    wordCount = countWordsFromSections(sections);
    output = { slug, layout: 'sections', sections, wordCount };
    index.push({ slug, wordCount, sections: sections.length, layout: 'sections' });
    console.log(`  ${slug}: ${wordCount} words, ${sections.length} sections`);
  }

  fs.writeFileSync(path.join(PAGES_DIR, `${slug}.json`), JSON.stringify(output, null, 2));
}

fs.writeFileSync(path.join(PAGES_DIR, 'index.json'), JSON.stringify({ pages: index }, null, 2));
console.log(`\nGenerated ${index.length} page content files.`);
