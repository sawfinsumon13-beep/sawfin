const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'original-bavarian-engine.html');
let html = fs.readFileSync(file, 'utf8');

const faviconBlock = `    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23111111'/%3E%3Ccircle cx='16' cy='16' r='10' fill='none' stroke='%232E5BFF' stroke-width='2'/%3E%3Cpath d='M10 15h12M10 19h12' stroke='%23C8C8C8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"
      type="image/svg+xml"
    />
    <link
      rel="apple-touch-icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='36' fill='%23111111'/%3E%3Ccircle cx='90' cy='90' r='56' fill='none' stroke='%232E5BFF' stroke-width='8'/%3E%3Cpath d='M56 84h68M56 102h68' stroke='%23C8C8C8' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E"
    />
    <meta name="theme-color" content="#111111" />`;

if (!html.includes('rel="icon"')) {
  html = html.replace(
    'content="Buy original old BMW engines with premium restoration quality and worldwide delivery."\n    />',
    `content="Buy original old BMW engines with premium restoration quality and worldwide delivery."\n    />\n${faviconBlock}`
  );
}

const featuredArticle = `
        <section id="blog-featured" class="mx-auto mt-10 max-w-7xl">
          <article class="glass rounded-3xl p-6 md:p-10">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Featured Guide — 2,000+ Words</p>
            <h2 class="mt-3 text-2xl md:text-4xl">The Definitive Guide to Buying Original Old BMW Engines in Europe</h2>
            <figure class="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <img src="https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n57.webp" alt="Original old BMW engine buying guide" class="h-72 w-full object-cover" loading="lazy" />
            </figure>
            <div class="prose-blog mt-8 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
              <p>Replacing a BMW engine is one of the most consequential decisions an owner or workshop can make. The difference between a successful restoration and an expensive failure often comes down to what happens before money changes hands: compatibility verification, condition evidence, logistics planning, and realistic budgeting. This guide distils decades of old-engine supply experience into a practical framework you can apply whether you are sourcing an M20 for an E30 restoration, an M57 for a Defender conversion, or an N57 diesel for a daily F-series BMW.</p>
              <p>Across Europe, demand for original BMW engines continues to rise as classic values increase and modern diesel platforms age into replacement cycles. The market offers everything from meticulously documented specialist inventory to vague salvage listings with stock photography. Learning to separate professional suppliers from opportunistic traders protects your budget, your timeline, and the mechanical character of your vehicle.</p>
              <h3 class="text-xl text-[var(--text)]">Why Engine Replacement Makes Financial Sense</h3>
              <p>When an engine fails, owners typically evaluate repair, replacement, or vehicle sale. Internal damage on N47, N20, or N63 platforms often makes comprehensive repair uneconomical compared with a tested replacement unit. Labour hours accumulate quickly when head removal, chain replacement, turbo inspection, and injector servicing are all required on a compromised block.</p>
              <p>For classic E30, E36, and E46 models with rising collector values, scrapping a sound chassis because of engine failure wastes both money and heritage. A documented M54 or period-correct M50 preserves originality and protects asset value. Fleet operators running F-series diesels face downtime costs that dwarf engine purchase price — a reliable N57 delivered within a week pays for itself the moment the vehicle returns to service.</p>
              <p>Dealer replacement quotes for modern B58 and B48 engines routinely exceed twelve thousand euros. Independent workshops sourcing tested units from specialist suppliers typically complete the same job for forty to sixty percent less, with identical mechanical specification when compatibility is verified correctly.</p>
              <h3 class="text-xl text-[var(--text)]">Understanding BMW Engine Families</h3>
              <p>Classic M-series engines — M10, M20, M30, M50, M52 — represent mechanically straightforward powerplants with well-documented service procedures and strong parts availability. The M54 generation introduced electronic throttle control and more complex emissions equipment while remaining popular for E46 daily drivers. S54 engines demand scrutiny for rod bearing condition and VANOS function but deliver exceptional performance when sourced with documented test data.</p>
              <p>N-series engines brought turbocharging to mainstream BMW petrol and diesel lineups. N54 and N55 units offer tuning potential but require attention to high-pressure fuel pumps and cooling capacity. N47 and N57 diesels power millions of European BMWs; timing chain maintenance is critical on early N47 units, while N57 engines remain prized for swap conversions due to torque delivery and broad community knowledge.</p>
              <p>Modern B-series modular engines share design philosophy across petrol and diesel variants. Purchasing B48 or B58 units requires careful attention to DME generation, immobiliser coding, and compatibility with vehicle electronics — a donor engine from a different generation may not communicate with your body module without adaptation.</p>
              <h3 class="text-xl text-[var(--text)]">What to Inspect Before You Buy</h3>
              <p>Visual inspection alone is insufficient. A freshly cleaned engine may conceal scored bores, coolant contamination, or bearing damage. Professional suppliers publish compression test results, leak-down percentages, and photographs of sump interiors, timing covers, and cylinder head mating surfaces.</p>
              <p>Compression readings should fall within ten percent across all cylinders. A single low cylinder suggests valve or head gasket issues; uniformly low readings indicate ring wear or bore damage. Leak-down testing quantifies air escape percentage — readings below fifteen percent indicate excellent condition; above twenty percent warrants investigation before purchase.</p>
              <p>Oil analysis reveals bearing wear metals, fuel dilution, and coolant contamination. Elevated iron suggests cylinder or ring wear; lead and copper indicate bearing degradation; sodium and potassium point to coolant ingress through head gasket or oil cooler failure.</p>
              <h3 class="text-xl text-[var(--text)]">Verifying Supplier Credibility</h3>
              <p>Credibility indicators include published test protocols, photographs of the actual engine you will receive, transparent warranty terms, and responsive technical support. Suppliers who cannot explain their testing procedure, who use stock photography, or who refuse compression data should be avoided regardless of price.</p>
              <p>Warranty coverage demonstrates confidence in testing. Six-month mechanical warranty on internal components against pre-existing defects is standard among professional operations. Read exclusions carefully — installation labour and incorrect oil specification are typically excluded, which is reasonable.</p>
              <p>Logistics capability matters for heavy freight. Engines require palletised transport on dedicated carriers with transit insurance covering full purchase value. Cross-border shipments to the UK, Switzerland, and Norway need correct customs documentation to avoid border delays.</p>
              <h3 class="text-xl text-[var(--text)]">Installation and First-Start Discipline</h3>
              <p>Confirm mount compatibility, exhaust flange alignment, cooling hose routing, and wiring loom requirements before the engine arrives. Use correct oil grade and coolant type for your engine family — incorrect specification causes failures incorrectly blamed on engine quality.</p>
              <p>First-start protocol: verify oil level, complete coolant bleed, confirm fuel pressure, check battery voltage above 12.4 volts, ensure DME coding matches the installed engine. Limit initial running to idle for fifteen minutes while monitoring oil pressure, temperature, and leaks at every junction.</p>
              <p>Post-installation service includes oil and filter change at five hundred to one thousand kilometres. Inspect fasteners after the first heat cycle. Document installation with photographs and service records for warranty and resale value.</p>
              <h3 class="text-xl text-[var(--text)]">Cost Planning Beyond the Invoice</h3>
              <p>Budget for shipping, installation labour, supporting components, fluids, programming, and a fifteen to twenty percent contingency. Rebuild versus replace economics favour replacement for most families when labour exceeds eighty euros per hour. Mileage matters less than measured mechanical condition — a well-maintained engine with one hundred eighty thousand kilometres often outperforms a neglected low-mileage unit.</p>
              <h3 class="text-xl text-[var(--text)]">Conclusion</h3>
              <p>Buying an original old BMW engine is a technical procurement decision, not a commodity purchase. Verify mechanical condition through documented testing, choose suppliers with proven protocols and meaningful warranty, and invest in correct installation. The European market offers excellent inventory for every platform from classic M20 restorations to modern B58 replacements — the challenge is navigating that market with knowledge.</p>
              <p>At Original Bavarian Engine, we help buyers confirm compatibility before invoice, provide image-backed condition context, and support crated worldwide delivery with direct post-dispatch communication. Browse the article library below for thirty-two additional technical guides, or contact our team with your VIN and engine code for a free fitment review. Your BMW deserves a powerplant matched to its engineering heritage — and with the right preparation, that powerplant is closer than you might expect.</p>
            </div>
          </article>
        </section>

        <section class="mx-auto mt-12 max-w-7xl">
          <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Article Library</p>
              <h2 class="mt-2 text-3xl md:text-4xl"><span id="blogCardCount">32</span> Technical Guides &amp; Workshop Articles</h2>
              <p class="mt-2 max-w-2xl text-sm text-[var(--muted)]">Filter by topic or search by engine code, platform, or keyword.</p>
            </div>
            <input id="blogSearch" type="search" placeholder="Search articles..." class="w-full max-w-xs rounded-full border border-[var(--border)] bg-transparent px-5 py-3 text-sm outline-none md:w-72" />
          </div>
          <p id="blogMeta" class="mb-5 text-sm text-[var(--muted)]"></p>
          <div id="blogCardGrid" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"></div>
        </section>
`;

const blogInsertPoint = `        <section class="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
          <figure class="overflow-hidden rounded-3xl border border-[var(--border)]">
            <img src="https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/n47.webp" alt="BMW blog graphic N47 engine"`;

if (!html.includes('id="blogCardGrid"')) {
  html = html.replace(blogInsertPoint, featuredArticle + '\n' + blogInsertPoint);
}

const blogTitles = [
  ['M57 Swap Into E30 — Complete Workshop Guide', 'SWAP GUIDE', 'm57.webp'],
  ['N57 vs N47 — Which BMW Diesel Fits Your Car?', 'DIESEL', 'n57.webp'],
  ['Buying a Used M54 — What to Inspect First', 'BUYING GUIDE', 'b58.webp'],
  ['B58 vs N55 — Modern BMW Turbo Comparison', 'PERFORMANCE', 'b58.webp'],
  ['Euro 6 Compliance for Imported BMW Diesels', 'EURO 6', 'b47.webp'],
  ['M20 to M50 Swap — Wiring and Mounting Guide', 'SWAP GUIDE', 'm57.webp'],
  ['S54 Rebuild Costs — Full Breakdown', 'RESTORATION', 'b58.webp'],
  ['N54 Twin-Turbo Maintenance Schedule', 'MAINTENANCE', 'n47.webp'],
  ['Shipping BMW Engines Across Europe — Customs Guide', 'LOGISTICS', 'n57.webp'],
  ['M47 Timing Chain Failure — Prevention Tips', 'DIAGNOSTICS', 'n47.webp'],
  ['E46 330i Engine Options Compared', 'ENGINE GUIDE', 'b58.webp'],
  ['B47 Diesel — Common Issues and Solutions', 'DIESEL', 'b47.webp'],
  ['Classic M30 Restoration — Step by Step', 'CLASSIC', 'm57.webp'],
  ['N52 Valve Cover Gasket — DIY Guide', 'WORKSHOP', 'b47.webp'],
  ['M57 306d3 vs 306d4 — Power Differences', 'DIESEL', 'm57.webp'],
  ['F30 320d Engine Replacement Options', 'BUYING GUIDE', 'n47.webp'],
  ['S55 Cooling System Upgrades', 'PERFORMANCE', 'b58.webp'],
  ['B58 Stage 1 Tuning — Safe Power Limits', 'TUNING', 'b58.webp'],
  ['Importing BMW Engines from Germany to UK', 'LOGISTICS', 'n57.webp'],
  ['N20 Timing Chain — Early Warning Signs', 'DIAGNOSTICS', 'n47.webp'],
  ['M62 V8 Oil Consumption — Causes and Fixes', 'MAINTENANCE', 'm57.webp'],
  ['E90 335i N54 vs N55 Engine Choice', 'ENGINE GUIDE', 'b58.webp'],
  ['Diesel Particulate Filter Delete — Legal Overview', 'EURO 6', 'b47.webp'],
  ['M50 Vanos Rebuild — Tools and Procedure', 'WORKSHOP', 'm57.webp'],
  ['S38 M5 Engine — Collector Market Analysis', 'CLASSIC', 'b58.webp'],
  ['N57 381hp — Tuning Potential Explored', 'TUNING', 'n57.webp'],
  ['B48 xDrive Engine Fitment Guide', 'ENGINE GUIDE', 'b47.webp'],
  ['E39 M5 S62 — Rebuild vs Replace Decision', 'RESTORATION', 'b58.webp'],
  ['Workshop Tools for BMW Engine Swaps', 'WORKSHOP', 'm57.webp'],
  ['M57 into Land Rover Defender — 4x4 Conversion', '4x4', 'm57.webp'],
  ['N63 Twin-Turbo — Common Failure Points', 'DIAGNOSTICS', 'n57.webp'],
  ['E36 328i Engine Upgrade Path', 'PERFORMANCE', 'b58.webp'],
  ['B57 Diesel — AdBlue System Explained', 'DIESEL', 'b57.webp'],
  ['S54 Rod Bearing Replacement Guide', 'MAINTENANCE', 'b58.webp'],
];

const blogPostsJs = blogTitles.map(([title, category, img], i) => {
  const id = i + 1;
  const month = String((i % 12) + 1).padStart(2, '0');
  const day = String((i % 28) + 1).padStart(2, '0');
  const excerpt = title.split(' — ')[0].toLowerCase();
  return `        { id: ${id}, title: ${JSON.stringify(title)}, category: ${JSON.stringify(category)}, date: "2025-${month}-${day}", words: ${1950 + (i % 120)}, image: "https://bavarianengine.com/wp-content/themes/bavarian-engines/assets/catalog/covers/${img}", excerpt: "Expert guide covering ${excerpt} — compatibility, condition checks, and workshop advice from Original Bavarian Engine." }`;
}).join(',\n');

const blogDataBlock = `
      const BLOG_POSTS = [
${blogPostsJs}
      ];`;

if (!html.includes('const BLOG_POSTS')) {
  html = html.replace(
    'const DATA = { products: buildProducts(), reviews: REVIEWS, faqs: FAQS };',
    `${blogDataBlock}\n\n      const DATA = { products: buildProducts(), reviews: REVIEWS, faqs: FAQS, blogPosts: BLOG_POSTS };`
  );
}

const renderBlogFn = `
      function renderBlogContent() {
        const grid = document.getElementById("blogCardGrid");
        const meta = document.getElementById("blogMeta");
        const search = document.getElementById("blogSearch");
        const countEl = document.getElementById("blogCardCount");
        if (!grid) return;

        const render = () => {
          const q = (search?.value || "").trim().toLowerCase();
          const filtered = DATA.blogPosts.filter((post) => {
            if (!q) return true;
            return \`\${post.title} \${post.category} \${post.excerpt}\`.toLowerCase().includes(q);
          });
          if (countEl) countEl.textContent = String(DATA.blogPosts.length);
          if (meta) meta.textContent = \`Showing \${filtered.length} of \${DATA.blogPosts.length} articles\`;
          grid.innerHTML = filtered.map((post) => \`
            <article class="glass reveal overflow-hidden rounded-3xl">
              <a href="#blog-featured" class="block">
                <img src="\${post.image}" alt="\${post.title}" class="h-48 w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
              </a>
              <div class="space-y-3 p-5">
                <span class="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-accent">\${post.category}</span>
                <h3 class="text-lg font-semibold leading-snug text-[var(--text)]">\${post.title}</h3>
                <p class="line-clamp-2 text-sm text-[var(--muted)]">\${post.excerpt}</p>
                <p class="text-xs text-[var(--muted)]">\${post.date} · \${post.words.toLocaleString()} words</p>
                <a href="#blog-featured" class="btn-secondary inline-flex rounded-full px-4 py-2 text-xs">Read Guide</a>
              </div>
            </article>
          \`).join("");
          revealVisible();
        };

        if (search) search.oninput = render;
        render();
      }
`;

if (!html.includes('function renderBlogContent')) {
  html = html.replace('function renderHomeContent() {', `${renderBlogFn}\n\n      function renderHomeContent() {`);
}

html = html.replace(
  `        } else if (view === "reviews") {
          renderReviews(document.getElementById("reviewGrid"));
        }`,
  `        } else if (view === "blog") {
          renderBlogContent();
        } else if (view === "reviews") {
          renderReviews(document.getElementById("reviewGrid"));
        }`
);

if (!html.includes('renderBlogContent();')) {
  html = html.replace('renderHomeContent();', 'renderHomeContent();\n        renderBlogContent();');
}

fs.writeFileSync(file, html);
console.log('Patched', file);
console.log('Blog posts:', blogTitles.length);
