(function () {
  "use strict";

  const SECTOR_IMAGE_BASE = "assets/images/sectors";

  const STORY_SECTOR_DEFS = [
    {
      key: "dealer-vs-verified",
      eyebrow: "Why buyers purchase from Original Bavarian Engine",
      headline: "Save Against Dealer Crate Prices — Without Gambling on a Mystery Engine.",
      intro:
        "Most BMW owners are not hunting theory. They need a cost-saving path that cuts downtime, protects residual value, and starts with VIN-matched stock documented from Germany.",
      dealerTitle: "Typical dealer path",
      dealerPoints: [
        "Long lead times on new crate engines",
        "Invoice that often exceeds residual value",
        "Generic advice — not stamp-level matching",
        "Car sits while parts are allocated"
      ],
      ourTitle: "Original Bavarian Engine path",
      ourPoints: [
        "Used BMW engines for sale with live photos & inclusions",
        "Free VIN & engine-code match before you pay",
        "Documented condition notes on eligible internals",
        "Crated EU shipping coordinated from Germany"
      ],
      seo: [
        {
          headline: "The purchase decision most BMW owners actually face.",
          body:
            "When a timing-chain collapse, turbo failure, or bottom-end noise grounds a 320d, 520d, 530d, X3, or X5, owners weigh dealer crates against transparent used stock. The winning path is the one that confirms code fit, shows real media, and ships on a schedule a workshop can plan around."
        },
        {
          headline: "Keywords buyers type when they are ready to spend.",
          body:
            "Searches for N47, N57, B47, B57, B58, and M57 are purchase intent, not browsing. This sector organizes short, image-backed answers so buyers can move from enquiry to a VIN-matched crate without noise."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-01-hamburg-stock.webp`,
      imageTag: "Germany — Documented Stock",
      caption: "From quote-check to a VIN-matched crate — the purchase path buyers actually need.",
      primaryCta: { href: "collection.html", label: "Shop engines now" },
      secondaryCta: { href: "contact.html", label: "Check my VIN" }
    },
    {
      key: "export-crating",
      eyebrow: "Logistics sector for serious buyers",
      headline: "Export Crating That Protects the Engine You Just Verified.",
      intro:
        "A correct code match means nothing if freight damages the unit. This sector focuses on bracing, sealing, and tracked handoff so workshops receive installable stock.",
      dealerTitle: "Typical freight path",
      dealerPoints: [
        "Soft packaging with unclear bracing",
        "Missing photo proof before dispatch",
        "Vague ETA windows that slip install days",
        "Open ports left unprotected in transit"
      ],
      ourTitle: "Crated dispatch path",
      ourPoints: [
        "Impact-controlled pallet and crate standards",
        "Dispatch photos archived with the order",
        "Tracked milestones from pickup to delivery",
        "Ports sealed and mounts protected before exit"
      ],
      seo: [
        {
          headline: "Why crating quality is part of the engine price.",
          body:
            "International BMW engine buyers pay for mechanical condition and arrival condition. Short logistics notes in this sector compress crate checklists into scannable guidance with real warehouse imagery."
        },
        {
          headline: "What workshops ask before booking a bay.",
          body:
            "Delivery windows, crate dimensions, and unloading notes matter as much as horsepower figures. Buyers use this sector to align freight with install capacity."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-02-export-crate.webp`,
      imageTag: "Export — Crate Ready",
      caption: "Protected packing turns a verified purchase into a reliable workshop arrival.",
      primaryCta: { href: "services.html", label: "Review shipping support" },
      secondaryCta: { href: "contact.html", label: "Ask freight timing" }
    },
    {
      key: "stamp-codes",
      eyebrow: "Code verification sector",
      headline: "Stamp-Level Matching Beats Brochure Guesswork.",
      intro:
        "Lookalike codes create expensive installs. This sector trains buyers to demand stamp photos, decode prefixes, and refuse ambiguous listings.",
      dealerTitle: "Guesswork path",
      dealerPoints: [
        "Family name only — no stamp evidence",
        "Suffix differences ignored until install",
        "Photos cropped away from castings",
        "Compatibility assumed from model badge"
      ],
      ourTitle: "Stamp-verified path",
      ourPoints: [
        "Code photography requested and archived",
        "Prefix and suffix explained before invoice",
        "VIN cross-check offered free of charge",
        "Mismatches stopped before payment clears"
      ],
      seo: [
        {
          headline: "How stamp clarity protects residual value.",
          body:
            "A wrong diesel family can erase the savings of buying used. Short verification notes keep the focus on castings, documents, and platform era — not marketing labels."
        },
        {
          headline: "N57, N47, M57, B57 — intent words that need proof.",
          body:
            "Buyers searching these codes want evidence. This sector pairs concise checkpoints with imagery so proof becomes the default, not an afterthought."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-03-code-stamp.webp`,
      imageTag: "Codes — Stamp Evidence",
      caption: "If the stamp is unclear, the purchase is not ready.",
      primaryCta: { href: "contact.html", label: "Send my engine code" },
      secondaryCta: { href: "collection.html", label: "Browse by family" }
    },
    {
      key: "vin-matching",
      eyebrow: "VIN intelligence sector",
      headline: "Match the Chassis Before You Fall in Love With the Photos.",
      intro:
        "Beautiful media cannot fix an incompatible donor. VIN matching turns browsing into a controlled procurement step for private owners and trade accounts.",
      dealerTitle: "Photo-first path",
      dealerPoints: [
        "Buy from images alone",
        "Discover loom or mount conflicts later",
        "Rush returns across borders",
        "Lose workshop days to reverse logistics"
      ],
      ourTitle: "VIN-first path",
      ourPoints: [
        "Share VIN and target code early",
        "Receive compatible shortlists before invoice",
        "Reduce loom, sensor, and mount surprises",
        "Protect install calendars with fewer reworks"
      ],
      seo: [
        {
          headline: "VIN questions that separate serious stock from listings.",
          body:
            "Year, gearbox, drivetrain, and emissions hardware change the right answer. This sector compresses those questions into short cards buyers can send on WhatsApp."
        },
        {
          headline: "Private buyers and workshops use the same gate.",
          body:
            "Whether the car is a daily 520d or a collector project, VIN confirmation is the gate that keeps savings real."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-04-vin-match.webp`,
      imageTag: "VIN — Match First",
      caption: "Compatibility is a document workflow, not a hope.",
      primaryCta: { href: "contact.html", label: "Check my VIN" },
      secondaryCta: { href: "https://wa.me/4915510030835", label: "WhatsApp fitment" }
    },
    {
      key: "live-inventory",
      eyebrow: "Live stock sector",
      headline: "Shop Engines That Exist — Not Waiting-List Promises.",
      intro:
        "Availability language should mean a unit you can reserve. This sector organizes inventory-style notes so buyers can move quickly on real stock.",
      dealerTitle: "Allocation path",
      dealerPoints: [
        "Indefinite factory lead times",
        "Price revisions mid-wait",
        "Limited photos until deposit",
        "Substitution without clear notice"
      ],
      ourTitle: "Live stock path",
      ourPoints: [
        "Listed units with visible media",
        "Clear inclusions and condition language",
        "Reservation after compatibility confirm",
        "Trade and private buyers on the same catalog"
      ],
      seo: [
        {
          headline: "Why live photos change negotiation quality.",
          body:
            "Buyers compare angles, labels, and accessories before they talk price. Short stock notes keep that comparison organized across families."
        },
        {
          headline: "From shortlist to crate without mystery substitutions.",
          body:
            "When stock is real, the conversation stays technical: code, mileage context, shipping window — not excuses."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-05-engine-stand.webp`,
      imageTag: "Stock — On the Stand",
      caption: "Reserve what you can verify, then ship what you reserved.",
      primaryCta: { href: "collection.html", label: "Start with live stock" },
      secondaryCta: { href: "blog.html", label: "Read buyer guidance" }
    },
    {
      key: "turbo-fuel",
      eyebrow: "Fuel & turbo sector",
      headline: "Read the Boost Path Before You Commit the Workshop.",
      intro:
        "Common-rail and turbo health decide whether a used diesel saves money or creates a second invoice. This sector shortens the inspection language buyers need.",
      dealerTitle: "Ignore-the-air-path",
      dealerPoints: [
        "No turbo shaft commentary",
        "Injector history left blank",
        "Intake condition never mentioned",
        "Boost leaks discovered on first start"
      ],
      ourTitle: "Boost-aware path",
      ourPoints: [
        "Turbo and fuel cues called out early",
        "Photo requests aimed at wear points",
        "Honest language without overclaiming",
        "Install teams briefed before the bay opens"
      ],
      seo: [
        {
          headline: "Fuel-system cues that belong in every enquiry.",
          body:
            "Buyers searching N47 and N57 failures often fear chain and turbo issues together. Short cards here keep both topics visible and practical."
        },
        {
          headline: "A clean intake photo can save a wasted freight fee.",
          body:
            "Visual evidence of the air and fuel path is part of modern used-engine diligence — not optional trivia."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-06-turbo-fuel.webp`,
      imageTag: "Systems — Turbo & Fuel",
      caption: "Air and fuel evidence belongs beside the stamp photo.",
      primaryCta: { href: "collection.html", label: "Browse diesel families" },
      secondaryCta: { href: "contact.html", label: "Ask a systems question" }
    },
    {
      key: "compression",
      eyebrow: "Compression insight sector",
      headline: "Numbers Need Context — Or They Mislead Everyone.",
      intro:
        "A single compression figure without balance, temperature, or media is marketing, not diligence. This sector teaches short, useful reading habits.",
      dealerTitle: "Single-number path",
      dealerPoints: [
        "One peak value presented as proof",
        "No cylinder balance discussion",
        "Cold and warm tests mixed casually",
        "Leakdown ignored on high-risk units"
      ],
      ourTitle: "Context-first path",
      ourPoints: [
        "Balance and test context requested",
        "Media paired with readings when needed",
        "Risk language kept plain and calm",
        "Workshops get usable notes, not slogans"
      ],
      seo: [
        {
          headline: "How private buyers should ask for compression evidence.",
          body:
            "The right questions are short. This sector packages them so WhatsApp and email enquiries stay precise."
        },
        {
          headline: "When leakdown should join the conversation.",
          body:
            "Higher-mileage or noisy units deserve paired tests. Buyers learn the trigger points without reading a textbook."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-07-compression.webp`,
      imageTag: "Inspect — Compression Context",
      caption: "Healthy engines look honest on paper and in photos.",
      primaryCta: { href: "contact.html", label: "Request inspection notes" },
      secondaryCta: { href: "reviews.html", label: "See buyer outcomes" }
    },
    {
      key: "m57-swap",
      eyebrow: "M57 swap sector",
      headline: "Swap Kits Succeed When the Plan Is As Clear As the Donor.",
      intro:
        "M57 conversions fail on missing adapters, loom strategy, and cooling capacity — not on enthusiasm. This sector organizes kit-minded content for builders.",
      dealerTitle: "Parts-scatter path",
      dealerPoints: [
        "Donor bought before kit map exists",
        "Mounts and adapters sourced late",
        "Wiring discovered mid-install",
        "Cooling underspecified for torque"
      ],
      ourTitle: "Kit-planned path",
      ourPoints: [
        "Donor and kit thinking in one conversation",
        "Mount and adapter pairing discussed early",
        "Loom notes before irreversible cuts",
        "Cooling shortlists matched to the build"
      ],
      seo: [
        {
          headline: "What M57 swap buyers search when budgets are real.",
          body:
            "Kit, loom, mounts, and donor condition dominate serious threads. Short cards keep those threads out of chaos."
        },
        {
          headline: "Document the swap like a workshop job, not a forum myth.",
          body:
            "Builders who archive decisions finish faster. This sector models that discipline in compact form."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-08-swap-kit.webp`,
      imageTag: "Swap — Kit Essentials",
      caption: "Plan the hardware path before the donor leaves the warehouse.",
      primaryCta: { href: "collection.html?category=M57%20Swap%20Kits", label: "View M57 swap kits" },
      secondaryCta: { href: "contact.html", label: "Plan my conversion" }
    },
    {
      key: "restoration",
      eyebrow: "Restoration sector",
      headline: "Period-Correct Powertrains for Projects That Will Be Judged.",
      intro:
        "Collectors do not only need horsepower — they need lineage that survives scrutiny. This sector shortens restoration decision notes.",
      dealerTitle: "Whatever-fits path",
      dealerPoints: [
        "Modern substitutions without disclosure",
        "Finish standards undefined",
        "Parts sequencing chaotic",
        "No archive for future buyers"
      ],
      ourTitle: "Collector-aware path",
      ourPoints: [
        "Originality goals discussed up front",
        "Presentation standards kept visible",
        "Sequencing notes that reduce rework",
        "Photo and code archives for provenance"
      ],
      seo: [
        {
          headline: "Restoration buyers search differently than daily drivers.",
          body:
            "They ask about era, finish, and documentation density. This sector answers in short, image-led cards."
        },
        {
          headline: "A clean archive raises the value of the finished car.",
          body:
            "Codes, photos, and install decisions become part of the asset — not leftover chat history."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-09-restoration.webp`,
      imageTag: "Restore — Period Correct",
      caption: "Choose engines that respect the story the chassis is telling.",
      primaryCta: { href: "about.html", label: "Our sourcing standard" },
      secondaryCta: { href: "collection.html", label: "Browse collector stock" }
    },
    {
      key: "freight-windows",
      eyebrow: "Delivery timing sector",
      headline: "Align the Crate With the Bay — Not the Other Way Around.",
      intro:
        "Missed delivery windows idle technicians and inflate project cost. This sector focuses on timing language buyers and workshops can share.",
      dealerTitle: "Vague-ETA path",
      dealerPoints: [
        "Wide windows that slip quietly",
        "No unloading guidance",
        "Weekend arrivals with no contacts",
        "Install teams left guessing"
      ],
      ourTitle: "Schedule-aware path",
      ourPoints: [
        "Milestone updates buyers can forward",
        "Unloading notes for workshop teams",
        "Destination constraints captured early",
        "Fewer idle hours waiting on freight"
      ],
      seo: [
        {
          headline: "Timing is a technical specification for engine orders.",
          body:
            "Serious buyers treat ETA like torque specs — something to verify. Short cards here keep that habit sharp."
        },
        {
          headline: "Night freight and wet docks still need clear ownership.",
          body:
            "Who receives, who signs, who stores overnight — answered before the truck moves."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-10-freight.webp`,
      imageTag: "Freight — Timed Handoff",
      caption: "A verified engine still needs a verified arrival plan.",
      primaryCta: { href: "services.html", label: "See logistics support" },
      secondaryCta: { href: "contact.html", label: "Share my delivery constraints" }
    },
    {
      key: "compatibility-maps",
      eyebrow: "Compatibility sector",
      headline: "Chassis Maps Stop Expensive Almost-Fits.",
      intro:
        "E, F, and G platforms punish assumptions. This sector organizes compatibility notes so buyers filter before they freight.",
      dealerTitle: "Badge-match path",
      dealerPoints: [
        "Model name treated as proof",
        "Drivetrain layout ignored",
        "Sensor generations mixed",
        "Gearbox pairing discovered too late"
      ],
      ourTitle: "Platform-map path",
      ourPoints: [
        "Chassis generation checked early",
        "xDrive and RWD differences surfaced",
        "Sensor and loom eras discussed",
        "Transmission pairing notes shared"
      ],
      seo: [
        {
          headline: "Compatibility is a matrix, not a single yes.",
          body:
            "Year ranges, body styles, and emissions packs change outcomes. Short cards keep the matrix usable."
        },
        {
          headline: "Touring, coupe, and SAV packaging still matter.",
          body:
            "Clearance and accessory differences are real. Buyers get reminders before crates move."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-11-compatibility.webp`,
      imageTag: "Platform — Compatibility",
      caption: "Map the chassis, then choose the long-block.",
      primaryCta: { href: "contact.html", label: "Send chassis details" },
      secondaryCta: { href: "collection.html", label: "Filter engine families" }
    },
    {
      key: "documentation",
      eyebrow: "Documentation sector",
      headline: "If It Is Not Written Down, It Will Be Relitigated.",
      intro:
        "High-trust engine sales run on dossiers: photos, codes, invoices, and handover notes. This sector compresses documentation habits into buyer-ready cards.",
      dealerTitle: "Verbal-promise path",
      dealerPoints: [
        "Details trapped in chat scrolls",
        "Photos unindexed and incomplete",
        "Export papers assembled late",
        "Handover leaves workshops guessing"
      ],
      ourTitle: "Dossier path",
      ourPoints: [
        "Order packs that travel with the unit",
        "Indexed photo evidence",
        "Export-aware paperwork habits",
        "Client handover notes workshops keep"
      ],
      seo: [
        {
          headline: "Documentation density is a pricing feature.",
          body:
            "Buyers pay more gladly when risk is visible and controlled. Short notes explain which papers matter most."
        },
        {
          headline: "Archives protect the next owner too.",
          body:
            "Collector and trade sales both benefit when the story of the engine is portable."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-12-documentation.webp`,
      imageTag: "Docs — Evidence Pack",
      caption: "Paper and photos are part of the mechanical delivery.",
      primaryCta: { href: "policies.html", label: "Read process policies" },
      secondaryCta: { href: "contact.html", label: "Request a sample dossier" }
    },
    {
      key: "collector-standards",
      eyebrow: "Collector standards sector",
      headline: "Acceptance Criteria for Engines That Will Be Shown, Not Hidden.",
      intro:
        "Collector purchases need presentation, originality balance, and storage discipline. This sector keeps those standards short and visual.",
      dealerTitle: "Workshop-only path",
      dealerPoints: [
        "Cosmetic indifference",
        "No originality conversation",
        "Storage guidance missing",
        "Presentation photos inconsistent"
      ],
      ourTitle: "Collector path",
      ourPoints: [
        "Acceptance criteria stated plainly",
        "Originality vs usability balanced",
        "Photo standards kept consistent",
        "Storage notes before install delays"
      ],
      seo: [
        {
          headline: "Collectors buy confidence as much as displacement.",
          body:
            "They want provenance language that stays factual. This sector models that tone across 1,500 short notes."
        },
        {
          headline: "Showroom lighting belongs in the listing culture.",
          body:
            "How an engine is photographed signals how it was handled. Imagery here reinforces that expectation."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-13-collector.webp`,
      imageTag: "Collector — Acceptance",
      caption: "Standards first, then the crate leaves the building.",
      primaryCta: { href: "collection.html", label: "Browse premium stock" },
      secondaryCta: { href: "about.html", label: "Why collectors choose us" }
    },
    {
      key: "mileage-context",
      eyebrow: "Mileage context sector",
      headline: "Mileage Is a Clue — Never the Whole Verdict.",
      intro:
        "High-mileage diesels can be strong; low-mileage units can still hide risk. This sector teaches triangulation with service and visual evidence.",
      dealerTitle: "Odometer-only path",
      dealerPoints: [
        "Low miles treated as automatic quality",
        "High miles dismissed without inspection",
        "Service history ignored",
        "Optimistic stories replacing documents"
      ],
      ourTitle: "Triangulated path",
      ourPoints: [
        "Mileage paired with condition language",
        "Service clues requested early",
        "Visual evidence weighted heavily",
        "Calm pricing talks rooted in proof"
      ],
      seo: [
        {
          headline: "How to read mileage on N47 and N57 candidates.",
          body:
            "Buyers get short heuristics instead of fear narratives — useful for both private and trade decisions."
        },
        {
          headline: "Evidence beats folklore in used diesel markets.",
          body:
            "This sector keeps folklore out of the checkout path."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-14-mileage.webp`,
      imageTag: "Mileage — With Context",
      caption: "Ask what the number cannot tell you — then ask for photos.",
      primaryCta: { href: "blog.html", label: "Read the long buyer guide" },
      secondaryCta: { href: "contact.html", label: "Review a candidate" }
    },
    {
      key: "install-prep",
      eyebrow: "Installation prep sector",
      headline: "Prep the Bay So the Crate Becomes Progress, Not Chaos.",
      intro:
        "Seals, fluids, tools, and clearance decide whether install day feels professional. This sector is a short-form prep library for workshops and capable private owners.",
      dealerTitle: "Open-the-crate-and-see path",
      dealerPoints: [
        "Missing seal kits mid-job",
        "Torque tools not ready",
        "Bay clearance discovered late",
        "Break-in notes never logged"
      ],
      ourTitle: "Prep-list path",
      ourPoints: [
        "Parts baskets outlined early",
        "Seal and fluid shortlists shared",
        "Bay and tool readiness checkpoints",
        "First-run observations encouraged"
      ],
      seo: [
        {
          headline: "Install prep is where used-engine savings are protected.",
          body:
            "A perfect donor still fails a messy bay. Short cards keep teams aligned before the hoist moves."
        },
        {
          headline: "Private owners deserve workshop-grade checklists.",
          body:
            "Clarity reduces panic purchases of the wrong gaskets at 9pm."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-15-install-prep.webp`,
      imageTag: "Install — Bay Ready",
      caption: "Stage the work, then welcome the crate.",
      primaryCta: { href: "services.html", label: "See install support" },
      secondaryCta: { href: "contact.html", label: "Get a prep shortlist" }
    },
    {
      key: "platform-eras",
      eyebrow: "Platform era sector",
      headline: "E, F, and G Eras Are Not Interchangeable Languages.",
      intro:
        "Platform era literacy prevents almost-right purchases. This sector maps era cues into short, image-backed notes for faster filtering.",
      dealerTitle: "Era-blind path",
      dealerPoints: [
        "Cross-era assumptions",
        "Accessory mismatches ignored",
        "Emissions hardware surprises",
        "Body-style packaging overlooked"
      ],
      ourTitle: "Era-literate path",
      ourPoints: [
        "E / F / G cues called out clearly",
        "Accessory and sensor eras discussed",
        "Drivetrain layout checked",
        "Body-style notes when packaging differs"
      ],
      seo: [
        {
          headline: "Buyers search platform codes as hard as engine codes.",
          body:
            "E90, F10, G30 and their SAV cousins appear in the same intent cluster. This sector meets that intent with structure."
        },
        {
          headline: "Era literacy shortens every WhatsApp thread.",
          body:
            "Fewer photos requested twice. Fewer wrong shortlists. Faster invoices on the right units."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-16-platform.webp`,
      imageTag: "Eras — Platform Match",
      caption: "Speak the chassis language before you speak price.",
      primaryCta: { href: "collection.html", label: "Match my platform" },
      secondaryCta: { href: "contact.html", label: "Confirm era fit" }
    },
    {
      key: "quality-control",
      eyebrow: "Quality control sector",
      headline: "QC Gates Are How Trust Scales Beyond One Happy Buyer.",
      intro:
        "Incoming checks, photo QC, stamp clarity, and crate release are the quiet systems behind a premium catalog. This sector makes those gates visible.",
      dealerTitle: "Ship-and-hope path",
      dealerPoints: [
        "Listing photos unreviewed",
        "Stamp clarity never scored",
        "Crate QC skipped under time pressure",
        "Release without final verification"
      ],
      ourTitle: "Gated path",
      ourPoints: [
        "Incoming QC language buyers can understand",
        "Photo standards before go-live",
        "Stamp clarity treated as a release item",
        "Final verification closes the loop"
      ],
      seo: [
        {
          headline: "Visible QC is a marketing asset, not a back-office secret.",
          body:
            "Buyers reward process they can picture. Short cards and imagery make the process legible."
        },
        {
          headline: "Release verification prevents expensive inbox archaeology.",
          body:
            "When the dossier is complete at dispatch, post-sale questions shrink."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-17-quality.webp`,
      imageTag: "QC — Release Gate",
      caption: "No gate skipped, no story invented after the fact.",
      primaryCta: { href: "about.html", label: "See how we work" },
      secondaryCta: { href: "reviews.html", label: "Read verified outcomes" }
    },
    {
      key: "support-warranty",
      eyebrow: "Support sector",
      headline: "Fast Technical Support Is Part of the Product.",
      intro:
        "Engines are high-trust purchases. Response quality before and after payment decides whether buyers return or warn their network.",
      dealerTitle: "Ticket-black-hole path",
      dealerPoints: [
        "Slow answers on fitment",
        "Post-delivery silence",
        "No trade escalation route",
        "Generic scripts instead of codes"
      ],
      ourTitle: "Specialist path",
      ourPoints: [
        "WhatsApp and email fitment triage",
        "Pre-sale questions welcomed",
        "Post-delivery clarification routes",
        "Workshop escalation taken seriously"
      ],
      seo: [
        {
          headline: "Support channels buyers actually use when money is on the line.",
          body:
            "Phone, mail, and WhatsApp appear in the same urgent moment. This sector explains what to send for a fast answer."
        },
        {
          headline: "Warranty language should be calm and specific.",
          body:
            "Short cards avoid hype while still describing protection and process."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-18-support.webp`,
      imageTag: "Support — Specialist Desk",
      caption: "Ask early. Ask precisely. Get a technical answer.",
      primaryCta: { href: "contact.html", label: "Contact specialists" },
      secondaryCta: { href: "https://wa.me/4915510030835", label: "Open WhatsApp" }
    },
    {
      key: "market-velocity",
      eyebrow: "Market insight sector",
      headline: "Know Which Families Move — And Why Timing Matters.",
      intro:
        "Demand shifts across N47, N57, M57, B47, and B57. This sector gives short market notes so buyers act with timing literacy, not panic.",
      dealerTitle: "Urgency-hype path",
      dealerPoints: [
        "Fake scarcity language",
        "No family-level demand context",
        "Seasonal patterns ignored",
        "Price opacity dressed as exclusivity"
      ],
      ourTitle: "Transparent-market path",
      ourPoints: [
        "Family demand notes in plain English",
        "Seasonal freight realities mentioned",
        "Collector vs workshop demand separated",
        "Pricing talks without theatrical urgency"
      ],
      seo: [
        {
          headline: "Stock velocity is a signal, not a threat.",
          body:
            "When a family moves fast, documentation quality still wins. Short insights keep buyers rational."
        },
        {
          headline: "Warehouse depth should be visible in the story you tell.",
          body:
            "Imagery of real aisles and crates supports trust better than countdown timers."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-19-market-stock.webp`,
      imageTag: "Market — Live Depth",
      caption: "Read the market calmly, then reserve the right unit.",
      primaryCta: { href: "collection.html", label: "Inspect live depth" },
      secondaryCta: { href: "blog.html", label: "Market reading notes" }
    },
    {
      key: "first-start",
      eyebrow: "First-start sector",
      headline: "The Last Bolt and the First Idle Are Part of the Purchase Story.",
      intro:
        "A successful first start is the emotional finish line for owners and the professional proof for workshops. This sector captures readiness and break-in discipline.",
      dealerTitle: "Hope-it-fires path",
      dealerPoints: [
        "Fluids rushed or mismatched",
        "Sensor basics skipped",
        "No break-in observation plan",
        "Issues discovered without a log"
      ],
      ourTitle: "First-idle path",
      ourPoints: [
        "Pre-start checklists kept short",
        "Sensor and fluid gates visible",
        "Break-in notes encouraged",
        "Support still reachable after idle"
      ],
      seo: [
        {
          headline: "First-start content is where anxiety converts to trust.",
          body:
            "Buyers want to picture the finish. This sector gives them that picture with practical steps attached."
        },
        {
          headline: "Workshops log the idle; owners remember the relief.",
          body:
            "Both audiences are served when the final sector stays specific and calm."
        }
      ],
      image: `${SECTOR_IMAGE_BASE}/sector-20-first-start.webp`,
      imageTag: "Finish — First Idle",
      caption: "Tighten the process until the first idle sounds like confidence.",
      primaryCta: { href: "collection.html", label: "Start with live stock" },
      secondaryCta: { href: "contact.html", label: "Plan my install path" }
    }
  ];

  const FOCUS_WORDS = [
    "verified",
    "documented",
    "workshop-ready",
    "collector-safe",
    "export-ready",
    "code-matched",
    "photo-backed",
    "crate-protected",
    "platform-checked",
    "install-focused",
    "stamp-clear",
    "vin-aligned",
    "freight-timed",
    "qc-gated",
    "support-led"
  ];

  const TITLE_FRAGMENTS = [
    "buyer checkpoint",
    "workshop note",
    "short field guide",
    "decision card",
    "risk filter",
    "photo request",
    "fitment cue",
    "shipping reminder",
    "documentation tip",
    "install brief"
  ];

  const SUMMARY_FRAGMENTS = [
    "Keep the decision scannable and evidence-led.",
    "Use this note before you request a quote.",
    "Share with your workshop to align expectations.",
    "Pair with stamp and VIN photos for faster answers.",
    "Treat this as a gate, not a slogan.",
    "Compress a long forum thread into one action.",
    "Protect install timing with clearer questions.",
    "Prefer proof over optimistic mileage stories.",
    "Make freight and fitment part of the same plan.",
    "Archive the answer with your order dossier."
  ];

  function uniqueImages(list) {
    return [...new Set(list.filter(Boolean))];
  }

  function catalogImagePool() {
    const fromProducts =
      window.OBE_DATA && Array.isArray(window.OBE_DATA.products)
        ? window.OBE_DATA.products.map((product) => product.image)
        : [];
    const sectorImages = STORY_SECTOR_DEFS.map((sector) => sector.image);
    return uniqueImages([...sectorImages, ...fromProducts]);
  }

  function buildSectorItems(sector, sectorIndex, count, imagePool) {
    const items = [];
    const pool = imagePool.length ? imagePool : sectorImagesFallback(sector);
    let previousImage = "";

    for (let i = 1; i <= count; i += 1) {
      const titleBit = TITLE_FRAGMENTS[(sectorIndex + i) % TITLE_FRAGMENTS.length];
      const summaryBit = SUMMARY_FRAGMENTS[(sectorIndex * 3 + i) % SUMMARY_FRAGMENTS.length];
      const focus = FOCUS_WORDS[(sectorIndex + i) % FOCUS_WORDS.length];
      let image = pool[(sectorIndex * 37 + i) % pool.length];
      if (image === previousImage) {
        image = pool[(sectorIndex * 37 + i + 5) % pool.length];
      }
      previousImage = image;

      items.push({
        id: `${sector.key}-${String(i).padStart(4, "0")}`,
        sectorKey: sector.key,
        sectorLabel: sector.eyebrow,
        title: `${sector.headline.split("—")[0].trim()} ${titleBit} #${String(i).padStart(4, "0")}`,
        summary: `${summaryBit} Focus: ${focus} guidance inside the ${sector.key.replace(/-/g, " ")} sector.`,
        image,
        tag: focus
      });
    }

    return items;
  }

  function sectorImagesFallback(sector) {
    return [sector.image];
  }

  function countWords(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function buildImageSideEssay(sector, side, minWords) {
    const isLeft = side === "left";
    const title = isLeft
      ? `${sector.imageTag.split("—")[0].trim()} · Field Narrative (Left Panel)`
      : `${sector.imageTag.split("—")[0].trim()} · Buyer Doctrine (Right Panel)`;

    const themes = isLeft
      ? [
          "workshop reality",
          "crate-side inspection",
          "owner anxiety",
          "install calendar pressure",
          "evidence before emotion",
          "donor honesty",
          "bay readiness",
          "photographic proof culture"
        ]
      : [
          "procurement discipline",
          "VIN-first decision making",
          "export and paperwork calm",
          "collector acceptance criteria",
          "trade-account clarity",
          "risk triangulation",
          "support escalation paths",
          "long-term provenance value"
        ];

    const models = ["320d", "520d", "530d", "X3", "X5", "E90", "F10", "G30"];
    const families = ["N47", "N57", "M57", "B47", "B57", "B58"];
    const paragraphs = [];
    let guard = 0;

    while (countWords(paragraphs.join(" ")) < minWords && guard < 80) {
      guard += 1;
      const theme = themes[guard % themes.length];
      const model = models[(guard + sector.key.length) % models.length];
      const family = families[(guard * 3 + (isLeft ? 1 : 2)) % families.length];
      const point = sector.ourPoints[guard % sector.ourPoints.length];
      const risk = sector.dealerPoints[guard % sector.dealerPoints.length];
      const seo = sector.seo[guard % sector.seo.length];

      paragraphs.push(
        `In the ${sector.eyebrow.toLowerCase()}, the ${isLeft ? "left" : "right"} image panel is not decorative space. It is a reading lane for buyers who need more than a caption under a cinematic photograph. This ${theme} passage sits beside the visual of ${sector.imageTag} so the picture and the doctrine move together. When a ${model} owner searches ${family} stock, they are usually balancing downtime, residual value, and the fear of a mystery long-block. Original Bavarian Engine answers that moment with process language: ${point}. The opposite habit — ${risk} — is exactly what this panel is written to interrupt.`
      );

      paragraphs.push(
        `Readers scanning this ${side} column should treat every sentence as a checklist fragment that can be copied into WhatsApp, email, or a workshop job card. Ask for stamp photos before you praise the lighting in a listing. Ask for VIN alignment before you fall in love with accessories in frame. Ask how the crate will be braced, who photographs dispatch, and what inclusions travel with the unit. The headline of this sector — ${sector.headline} — only becomes useful when translated into those operational questions. ${seo.headline} ${seo.body} That is why this essay is long on purpose: short slogans do not survive a failed install weekend.`
      );

      paragraphs.push(
        `Consider the practical sequence a careful buyer follows while looking at this image. First, name the chassis generation and drivetrain layout. Second, name the target engine family and suffix expectations. Third, request mileage context with inspection notes rather than odometer folklore. Fourth, confirm whether the unit is live stock or an allocation fantasy. Fifth, align freight timing with bay availability so the crate does not arrive into chaos. Each step sounds obvious until money is committed and the car is already on stands. The ${side} panel exists to keep the obvious steps visible while the photograph does emotional work.`
      );

      paragraphs.push(
        `Workshops and private collectors use different vocabulary, but they share the same failure modes. A trade account may speak in loom generations, sensor packs, and flywheel compatibility; a private owner may speak in weekly commuting pain and savings versus a dealer crate. Both still need the same evidence pack: code clarity, condition honesty, shipping discipline, and a support path after payment. Original Bavarian Engine positions this sector image as a bridge between those audiences. The left side of the story emphasizes lived workshop pressure; the right side emphasizes procurement doctrine. Together they surround the visual so neither romance nor cynicism gets the final word.`
      );

      paragraphs.push(
        `If you are reading deeply here, use the length as a filter for your own readiness. Can you state your VIN, engine code target, destination country, and preferred delivery window in one message? Can your workshop confirm mounts, cooling, and first-start fluids before the pallet ships? Can you accept that a transparent used engine with documentation often beats an expensive crate that arrives after the season is lost? This panel keeps returning to those questions because ${sector.caption} is not a tagline — it is an operating rule. Repeat it when the photos are beautiful and the paperwork is thin. Repeat it when a seller rushes you. Repeat it when a forum thread tries to replace a stamp image with confidence.`
      );

      paragraphs.push(
        `Across N47 timing-chain conversations, N57 torque-era restorations, M57 swap ambitions, and newer B47 or B57 replacements, the constants remain verification, packaging, and aftercare. The variables are platform era, emissions hardware, and how quickly a bay can absorb the work. This ${theme} essay therefore cycles through constants and variables without pretending one paragraph can replace a specialist review. It does, however, prepare you to have that review efficiently. Bring clearer inputs. Demand clearer outputs. Keep the dossier. When the crate finally leaves the building, the words on this ${side} should already have done their job: converting a cinematic image into a controlled purchase decision for real BMW engines.`
      );
    }

    const text = paragraphs.join("\n\n");
    return {
      side,
      title,
      text,
      wordCount: countWords(text)
    };
  }

  function buildStorySectors() {
    const imagePool = catalogImagePool();
    return STORY_SECTOR_DEFS.map((sector, index) => {
      const leftEssay = buildImageSideEssay(sector, "left", 1500);
      const rightEssay = buildImageSideEssay(sector, "right", 1500);
      return {
        ...sector,
        index: index + 1,
        itemCount: 1500,
        leftEssay,
        rightEssay,
        items: buildSectorItems(sector, index, 1500, imagePool)
      };
    });
  }

  function attachStorySectors() {
    const sectors = buildStorySectors();
    window.OBE_STORY_SECTORS = sectors;
    if (!window.OBE_DATA) window.OBE_DATA = {};
    window.OBE_DATA.storySectors = sectors;
    window.OBE_DATA.storyContentCount = sectors.reduce((sum, sector) => sum + sector.items.length, 0);
    return sectors;
  }

  window.OBE_BUILD_STORY_SECTORS = attachStorySectors;
  attachStorySectors();
})();
