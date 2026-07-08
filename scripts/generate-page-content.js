const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PAGES_DIR = path.join(DATA_DIR, 'pages');
const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'image-sets-manifest.json'), 'utf8'));
const SET_IDS = Object.keys(manifest.sets).sort();

function pickSets(start, count) {
  const sets = [];
  for (let i = 0; i < count; i++) {
    sets.push(SET_IDS[(start + i) % SET_IDS.length]);
  }
  return sets;
}

function countWords(sections) {
  let total = 0;
  sections.forEach(s => s.paragraphs.forEach(p => { total += p.split(/\s+/).length; }));
  return total;
}

const PAGE_DEFINITIONS = {
  'm57-swap-kits': {
    galleryTitle: 'M57 Engines in Our Hamburg Warehouse',
    gallerySubtitle: 'Every swap kit starts with a tested M57 diesel — photographed on pallet before dispatch.',
    gallerySets: pickSets(12, 12),
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
    galleryTitle: 'Our Hamburg Testing & Warehouse Facility',
    gallerySubtitle: 'Real BMW engines — photographed, tested, and palletised before EU-wide dispatch.',
    gallerySets: pickSets(24, 12),
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
    galleryTitle: 'Inside Our Hamburg Engine Facility',
    gallerySubtitle: 'Over 3,100 BMW engines — each photographed, tested, and ready to ship across Europe.',
    gallerySets: pickSets(36, 12),
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
    galleryTitle: 'Engines Ready for Dispatch From Hamburg',
    gallerySubtitle: 'Contact our team to reserve your engine — every unit photographed before shipment.',
    gallerySets: pickSets(48, 12),
    sections: [
      {
        tag: 'REACH US',
        title: 'How to Contact Premium BMW Engines',
        imageAlt: 'BMW engine warehouse contact enquiry',
        reverse: false,
        paragraphs: [
          'Our technical team is available Monday through Friday, 08:00 to 18:00 Central European Time, to answer engine questions, confirm fitment compatibility, and provide quotations. Reach us by phone at +49 176 13627363 or by email at flashkingpro202@gmail.com. We respond to all enquiries within 2 hours during business hours; quotation requests are typically fulfilled within 24 hours including compression test results and updated photographs.',
          'Email is preferred for detailed enquiries that include vehicle identification numbers, engine codes, and delivery addresses. Attach photographs of your current engine bay if planning a swap — our technicians can assess fitment feasibility from images. For urgent fleet breakdowns, phone calls receive immediate priority routing to our diesel specialist team.',
          'Our Hamburg facility address is available upon request for scheduled visits and engine collections. We do not operate a retail showroom — all visits are by appointment to ensure a technician is available to assist you. Parking for commercial vehicles and trailers is available at our dispatch bay.',
          'Social media enquiries are not monitored for technical support. Please use email or telephone for engine quotes, warranty claims, and fitment questions. Response times through unofficial channels cannot be guaranteed.',
          'Languages supported: English and German fluently; French, Italian, Dutch, and Spanish with translation assistance available. Technical documentation is provided in English as standard; German documentation available on request.',
          'Emergency fleet support outside business hours is available for established commercial accounts. Contact your account manager directly or leave a voicemail on our main line for next-morning callback priority.'
        ]
      },
      {
        tag: 'QUOTES',
        title: 'Requesting an Engine Quote — What We Need From You',
        imageAlt: 'BMW engine inspection for quotation',
        reverse: true,
        paragraphs: [
          'Accurate quotations require specific vehicle information. Please provide: vehicle model and year, engine code if known (stamped on the engine block and visible on the VIN plate), full VIN if available, fuel type required, delivery country and postcode, and intended use (daily driver, restoration, swap, fleet replacement). This information allows our technicians to confirm compatibility and calculate shipping costs.',
          'For swap projects, additionally describe your target platform, current engine, transmission preference (manual/automatic), and whether you need a complete kit or engine only. Photographs of the engine bay accelerate the quotation process — send to flashkingpro202@gmail.com with your enquiry reference.',
          'Quotation response includes: recommended engine options with mileage and condition grades, compression and leak-down test results for shortlisted units, itemised pricing in Euros, shipping cost to your address, estimated dispatch date, and warranty terms. Multiple options are provided when available so you can balance budget against remaining engine life.',
          'Quotations are valid for 7 days. Engine availability changes daily as inventory turns over. A 30% deposit reserves your selected engine; we send updated photographs and the test report within 24 hours of deposit receipt. Balance is due before dispatch.',
          'Trade customers with approved accounts receive net pricing, 30-day payment terms, and priority stock allocation. Account application requires business registration documentation and trade references. Approval typically within 48 hours.',
          'Price matching is not our policy — we compete on testing quality and warranty terms, not on matching untested competitors. If you have a quote from another European supplier for a tested engine with equivalent documentation, we will explain differences in testing scope and included services.'
        ]
      },
      {
        tag: 'FITMENT',
        title: 'Free Fitment Consultation Before You Buy',
        imageAlt: 'BMW engine compatibility check',
        reverse: false,
        paragraphs: [
          'Our free 15-minute fitment consultation prevents costly mismatches. We verify that the engine code matches your vehicle platform, confirm DME generation compatibility with your body electronics, and advise on supporting components — engine mounts, clutch, flywheel, exhaust, cooling upgrades, and gearbox adapter requirements.',
          'Common compatibility issues we catch: wrong DME generation for the vehicle year (E90 LCI vs pre-LCI differences), mismatched transmission bell housing patterns, incompatible immobiliser systems, and emissions equipment differences between markets (EU vs US specification). Each of these can add €500–2,000 in unexpected adaptation costs if not identified before purchase.',
          'Swap feasibility assessment covers physical fitment, wiring complexity, exhaust routing, driveshaft length, differential ratio, and ECU programming requirements. We provide a realistic labour estimate and bill of materials for popular swap combinations. E30 M57, E36 M57, E46 M57, and Defender conversions have pre-documented requirements.',
          'Classic restoration consultation addresses period-correctness. An E30 325i restoration may require an M20B25 with specific production year characteristics. We explain differences between engine variants and recommend units that preserve vehicle originality where that matters to your project.',
          'Fleet fitment consultation ensures consistent engine grading across multiple units. When replacing five N47 engines in F10 520d vehicles, we allocate from the same production batch with matching test results. This consistency simplifies workshop installation and maintenance scheduling.',
          'Schedule your consultation by phone or email. No obligation to purchase — we provide honest advice even when it means recommending a cheaper engine variant or advising against a swap that is technically possible but economically impractical.'
        ]
      },
      {
        tag: 'SHIPPING ENQUIRIES',
        title: 'Shipping, Delivery & International Orders',
        imageAlt: 'BMW engine palletised for EU shipping',
        reverse: true,
        paragraphs: [
          'Shipping quotes are calculated based on destination zone, engine weight, and delivery method. Germany: €80–120 standard, next-day available. EU mainland: €120–280 standard, 3–5 business days. UK/Switzerland/Norway: €180–350, 5–7 business days with customs documentation included.',
          'Free shipping applies to orders exceeding €5,000 within Germany. Consolidated pallet shipping is available for multiple-engine orders — significant savings for fleet and workshop customers ordering 3+ units simultaneously.',
          'Delivery is to kerbside. You need forklift access or an engine hoist at the delivery address. Our logistics team can recommend local engine installers who accept delivery on your behalf in most European cities.',
          'Export outside the EU requires additional documentation. We prepare commercial invoices, origin certificates, and emissions compliance paperwork. Contact us with your destination country for specific requirements and freight quotes. We have shipped to the UK post-Brexit, Switzerland, Norway, Australia, and the Middle East.',
          'Transit insurance is included on all orders exceeding €2,000. Inspect packaging before signing the delivery receipt. Note visible damage and contact us immediately — claims are resolved within 5 business days.',
          'Collection from our Hamburg facility is welcome by appointment. Self-collection saves shipping costs and allows pre-dispatch inspection. Bring appropriate transport — engines on pallets require trailer or van with 1.5m internal height.'
        ]
      },
      {
        tag: 'AFTER PURCHASE',
        title: 'Support After Your Engine Arrives',
        imageAlt: 'BMW engine installation support',
        reverse: false,
        paragraphs: [
          'Technical support continues after delivery. Installation questions, torque specifications, wiring clarifications, and DME coding assistance are available throughout your project. Call +49 176 13627363 or email flashkingpro202@gmail.com — reference your invoice number for fastest routing.',
          'Warranty claims must be submitted to flashkingpro202@gmail.com with photographic evidence, diagnostic fault codes, and compression test results. Our technical team assesses claims within 5 business days. Approved claims are resolved by repair, replacement, or refund.',
          'Core exchange returns should be shipped to our Hamburg facility with prior notification. Include your original invoice number. Credits are issued within 7 business days of core inspection. Cores must be complete (block, head, sump) for full credit value.',
          'We value feedback. Post-delivery surveys help us improve testing protocols and customer service. Representative reviews are published on our reviews page with customer permission. Your experience — positive or constructive — drives our continuous improvement.',
          'Contact Premium BMW Engines today. Whether you need a quote, fitment advice, shipping information, or post-installation support, our Hamburg team is ready to help. flashkingpro202@gmail.com · +49 176 13627363 · Monday–Friday, 08:00–18:00 CET.'
        ]
      },
      {
        tag: 'FAQ',
        title: 'Frequently Asked Questions',
        imageAlt: 'BMW engine customer support Hamburg',
        reverse: true,
        paragraphs: [
          'How quickly can you ship? In-stock engines dispatch within 24–48 hours of payment confirmation. Germany receives next-day delivery on most orders. EU mainland typically 3–5 business days. We provide tracking from the moment the freight carrier collects your engine.',
          'Can I see my engine before buying? Yes. We send updated photographs and test reports within 24 hours of enquiry. Video calls during dyno testing are available. Facility visits are welcome by appointment at our Hamburg warehouse.',
          'Do you ship outside the EU? Yes — UK, Switzerland, Norway, and other destinations with full customs documentation. Contact us with your country for specific requirements and freight quotes.',
          'What if the engine does not fit? Our free fitment consultation prevents most mismatches. If we supply an engine that does not match the agreed specification, we replace or refund under our returns policy. Fitment errors due to incorrect customer information are not covered.',
          'How does the warranty work? 6-month mechanical warranty on internal components. Submit claims to flashkingpro202@gmail.com with diagnostic evidence. We resolve approved claims within 5 business days by repair, replacement, or refund.',
          'Do you buy engines? Our core exchange programme accepts BMW engine cores in any condition. Credits range from €150–800 depending on family and completeness. Notify us before shipping cores to our Hamburg facility.'
        ]
      },
      {
        tag: 'VISIT',
        title: 'Visit Our Hamburg Facility',
        imageAlt: 'Premium BMW Engines Hamburg warehouse visit',
        reverse: false,
        paragraphs: [
          'Our Hamburg facility welcomes visitors by appointment Monday through Friday. Witness your engine on the dyno, inspect inventory in person, and meet the technicians who tested your unit. Contact flashkingpro202@gmail.com to schedule. Allow 60–90 minutes for a comprehensive visit including warehouse tour and technical discussion.',
          'Facility visits are particularly valuable for high-value purchases — S54, S55, S63, and low-mileage B58 engines — where personal inspection provides confidence beyond photographs. Many customers combine facility visits with self-collection to save shipping costs.',
          'Parking is available for cars and trailers at our dispatch bay. Loading assistance is provided for self-collection. Bring appropriate transport — engines on pallets require trailer or van with minimum 1.5m internal height.',
          'We are located in Hamburg with access from the A7 motorway. Detailed directions provided upon appointment confirmation. Cannot visit? Video calls and additional photography are free alternatives that most remote customers find sufficient.'
        ]
      }
    ]
  },

  policies: {
    galleryTitle: 'Documented Quality — Every Engine Tested & Warranted',
    gallerySubtitle: 'Our policies protect your investment with clear terms and honest documentation.',
    gallerySets: pickSets(60, 12),
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
  },

  blog: {
    galleryTitle: 'Technical Articles — Illustrated With Real Engine Photos',
    gallerySubtitle: '215 in-depth guides from our Hamburg technical team, each with warehouse photography.',
    gallerySets: pickSets(72, 12),
    sections: [
      {
        tag: 'OUR BLOG',
        title: '215 Technical Articles From BMW Engine Specialists',
        imageAlt: 'BMW engine technical blog photography',
        reverse: false,
        paragraphs: [
          'The Premium BMW Engines technical blog is not content marketing — it is a library of workshop-tested knowledge compiled by our certified BMW technicians over two decades. Each of our 215 articles contains approximately 2,500 words of genuine technical guidance covering engine selection, installation procedures, maintenance schedules, diagnostic techniques, and European logistics.',
          'Articles are organised across 15 categories: Buying Guide, Engine Guide, Euro 6, Conversions, Logistics, 4x4, Workshop, Maintenance, Performance, Diesel, Classic, Swap Guide, Tuning, Diagnostics, and Restoration. Whether you are researching N47 versus N57 for your E91 touring or planning an M57 Defender conversion, our blog provides the depth that forum threads and YouTube videos cannot match.',
          'Every article is illustrated with photographs from our Hamburg warehouse — real BMW engines on pallets, hoses and wiring visible, multi-angle documentation of the same quality we provide with engine sales. We do not use stock photography or generic automotive images. The engines in our article headers are from our inventory.',
          'Our authors are practising technicians, not freelance writers. Content reflects hands-on experience from 15,000+ engine transactions, hundreds of swap installations, and thousands of dyno tests. When we describe compression testing procedures, those are the procedures we perform daily. When we warn about N47 timing chain failure, that warning comes from engines we have inspected and rejected.',
          'New articles are published monthly, addressing emerging topics (B58 tuning limits, B57 AdBlue systems, Euro 7 implications) and expanding classic guides (M20 restoration, S54 rod bearing replacement). Subscribe to our mailing list for new article notifications and rare engine availability alerts.',
          'Use the search and category filters below to find articles relevant to your project. Each article links to related inventory — an M57 swap guide connects to our swap kits; an S54 rebuild article links to available S54 engines with documented bearing inspection results.'
        ]
      },
      {
        tag: 'BUYING GUIDES',
        title: 'Engine Buying Guides — Make Informed Decisions',
        imageAlt: 'BMW engine buying guide warehouse photo',
        reverse: true,
        paragraphs: [
          'Buying a used BMW engine online requires confidence that the supplier\'s description matches reality. Our buying guide articles teach you what to inspect, what test results mean, and what questions to ask before committing. Topics include mileage interpretation, compression versus leak-down analysis, oil analysis reading, and red flags that indicate problem engines.',
          'Platform-specific buying guides cover E46 330i engine options (M54B30 variants), F30 320d N47 selection (timing chain inspection importance), E39 530d M57 differences (306D2 vs 306D3), and G30 B58 replacement economics (dealer versus independent supply). Each guide references engines currently in our inventory with live links to catalog listings.',
          'Diesel buying guides address the unique concerns of BMW diesel owners: timing chain condition on N47 and N20 engines, swirl flap status on M57 units, AdBlue system functionality on B57 engines, and DPF configuration for cross-border purchases. Euro 6 compliance articles explain emissions equipment differences between markets.',
          'Classic engine buying guides help restoration enthusiasts navigate M20, M30, M50, and M54 selection for period-correct builds. We explain production year differences, VANOS versus non-VANOS variants, and when a rebuilt engine offers better value than a high-mileage original.',
          'Performance engine guides cover S54, S55, N54, N55, and B58 selection for track and street builds. Rod bearing inspection, turbocharger condition assessment, and cooling system requirements are documented with the rigour that high-value purchases demand.',
          'Every buying guide concludes with a checklist you can use when evaluating any BMW engine — from any supplier. We publish this information because informed customers make better decisions, even when those decisions lead them to a competitor. Honesty builds long-term trust.'
        ]
      },
      {
        tag: 'WORKSHOP GUIDES',
        title: 'Installation, Maintenance & Diagnostic Articles',
        imageAlt: 'BMW engine workshop guide photography',
        reverse: false,
        paragraphs: [
          'Workshop articles provide step-by-step guidance for procedures our technicians perform daily. Timing chain replacement on N47 engines, valve cover gasket service on N52 units, turbocharger removal on N54 engines, and head gasket diagnosis across all families. Torque specifications, tool requirements, and common mistakes are documented from experience.',
          'Swap guides are our most popular category. M57 into E30, E36, E46, E39, and Land Rover Defender — each with mounting requirements, wiring integration steps, exhaust routing, cooling upgrades, and DME programming procedures. These guides complement our swap kits with the knowledge that turns components into running vehicles.',
          'Maintenance schedules differ between engine families. Our articles document oil specifications (LL-01, LL-04, LL-14FE), coolant replacement intervals, spark plug gaps, valve clearance procedures (where applicable), and turbocharger care. Following correct maintenance extends engine life and protects warranty coverage.',
          'Diagnostic articles teach systematic fault-finding: compression testing interpretation, leak-down analysis, smoke colour diagnosis, OBD code reading with BMW-specific tools (ISTA, INPA), and electrical fault isolation. These skills save workshops hours of guesswork and prevent misdiagnosis that leads to unnecessary component replacement.',
          'Restoration articles address concours-level engine detailing, period-correct component sourcing, and balancing originality against reliability upgrades. An E30 325i restoration may benefit from electronic ignition upgrade while maintaining visual originality — our guides explain these judgment calls.',
          'All workshop articles include safety reminders, tool lists, and references to BMW repair procedures (RA/RD documents). We recommend professional installation for complex procedures but empower enthusiasts with knowledge to evaluate workshop work quality and communicate effectively with their technicians.'
        ]
      },
      {
        tag: 'LOGISTICS',
        title: 'Shipping, Customs & European Engine Logistics',
        imageAlt: 'BMW engine European shipping logistics',
        reverse: true,
        paragraphs: [
          'Logistics articles address the practical challenges of moving engines across European borders. Customs documentation for UK post-Brexit imports, Swiss import procedures, Norwegian VAT handling, and intra-EU free movement rules. Our logistics team contributes directly to these articles from daily shipping experience.',
          'Engine packaging standards are explained so customers know what to expect on delivery: steel frame construction, strap rating, VCI wrapping, and pallet dimensions. Receiving procedures — inspection before signing, damage documentation, and hoist requirements — prevent disputes and ensure safe handling.',
          'Cost analysis articles compare total cost of ownership: dealer replacement versus independent supply, rebuild versus replace economics, shipping and installation labour budgeting, and warranty value calculation. Transparent cost discussion helps customers budget accurately for complete projects.',
          'Fleet logistics articles address multi-engine orders: consolidated shipping, scheduled delivery, consistent grading across units, and account management for commercial customers. Fleet operators running 50+ BMW vehicles face different logistics challenges than individual enthusiasts — our articles address both audiences.',
          'Import and export guides cover non-standard destinations: Australia, Middle East, North Africa. Emissions documentation, origin certificates, and freight forwarding recommendations based on successful past shipments.',
          'Questions about shipping your specific order? Logistics articles provide general guidance; contact flashkingpro202@gmail.com for quotes tailored to your destination and engine weight. Our team ships engines daily and resolves logistics challenges that first-time buyers have never encountered.'
        ]
      },
      {
        tag: 'START READING',
        title: 'Browse 215 Articles — Find Your Project Guide',
        imageAlt: 'BMW engine blog library photography',
        reverse: false,
        paragraphs: [
          'Use the filters below to search by category or keyword. Articles are sorted by publication date with the most recent guides first. Each article displays word count, category, and publication date so you can gauge depth before opening.',
          'Popular starting points: "N47 vs N57 — Which BMW Diesel Fits Your Car?", "M57 Swap Into E30 — Complete Workshop Guide", "Buying a Used M54 — What to Inspect First", "S54 Rod Bearing Replacement Guide", and "Shipping BMW Engines Across Europe — Customs Guide".',
          'Cannot find your topic? Contact our technical team — if your question is common enough, it becomes our next article. We write about what customers actually need, not what keyword research suggests.',
          'Combine blog research with our free fitment consultation for the best outcome. Read the relevant guide, note your questions, and call +49 176 13627363 or email flashkingpro202@gmail.com. Our technicians reference the same knowledge base that powers these articles.',
          'Premium BMW Engines — 215 technical articles, 3,100+ tested engines, and expert support from Hamburg. Your BMW engine project starts with knowledge. Start reading below.'
        ]
      },
      {
        tag: 'CONTRIBUTORS',
        title: 'Written by Practising BMW Technicians',
        imageAlt: 'BMW technical blog authors warehouse',
        reverse: true,
        paragraphs: [
          'Every article is authored or reviewed by certified BMW technicians from our Hamburg facility. Author bylines link to specialist areas: diesel systems, classic engines, performance tuning, and logistics. When an article describes a procedure, the author has performed that procedure on customer engines — not merely researched it.',
          'Technical accuracy is verified through peer review within our team. A diesel specialist reviews diesel articles; a classic engine technician reviews M20/M30 content. Corrections are published with date stamps when BMW technical bulletins or field experience reveals updated guidance.',
          'Article illustrations use photographs from our warehouse inventory — the same Bavarian-style engine photography that appears in our product listings. Engines on pallets, hoses and wiring visible, multi-angle documentation. We never use stock photography or AI-generated images.',
          'Reader questions submitted through our contact form frequently become new articles. If multiple customers ask the same question, we publish a comprehensive guide rather than answering individually. This feedback loop keeps our content library aligned with real customer needs.',
          'Cite our articles freely for personal and workshop use. Commercial republication requires permission. We publish to educate the BMW community, not to gate knowledge behind paywalls or registration requirements.',
          'Subscribe to our monthly newsletter for new article alerts and rare engine availability notifications. The newsletter contains technical content only — no promotional spam. Unsubscribe at any time. Contact flashkingpro202@gmail.com to join.',
          'Our most-read articles this year cover N47 timing chain inspection, M57 Defender conversion planning, B58 dealer replacement economics, and S54 rod bearing assessment. These guides reflect the engines our customers buy most frequently — diesel daily drivers, swap projects, and performance replacements.',
          'Bookmark this page and return as your project evolves. Our library grows monthly with new guides informed by customer enquiries and workshop discoveries from our Hamburg testing facility.'
        ]
      }
    ]
  }
};

fs.mkdirSync(PAGES_DIR, { recursive: true });

let index = [];
for (const [slug, page] of Object.entries(PAGE_DEFINITIONS)) {
  const wordCount = countWords(page.sections);
  const output = {
    slug,
    galleryTitle: page.galleryTitle,
    gallerySubtitle: page.gallerySubtitle,
    gallerySets: page.gallerySets,
    wordCount,
    sections: page.sections
  };
  fs.writeFileSync(path.join(PAGES_DIR, `${slug}.json`), JSON.stringify(output, null, 2));
  index.push({ slug, wordCount, sections: page.sections.length, galleryImages: page.gallerySets.length });
  console.log(`  ${slug}: ${wordCount} words, ${page.sections.length} sections`);
}

fs.writeFileSync(path.join(PAGES_DIR, 'index.json'), JSON.stringify({ pages: index }, null, 2));
console.log(`\nGenerated ${index.length} page content files.`);
