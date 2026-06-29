/** Sitewide SEO — JSON-LD structured data + dynamic canonical fallback */

(function initSeo() {
  const base = (window.SEO_BASE_URL || window.location.origin).replace(/\/$/, '');
  const path = window.location.pathname.replace(/^\//, '') || 'index.html';
  const pageUrl = `${base}/${path === 'index.html' ? '' : path}`.replace(/\/$/, '') || base;
  const page = document.body.dataset.page || '';
  const title = document.title || 'Bavarian Engines';
  const desc = document.querySelector('meta[name="description"]')?.content || '';
  const image = `${base}${window.SEO_DEFAULT_IMAGE || '/images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp'}`;

  if (!document.querySelector('link[rel="canonical"]')) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = pageUrl.endsWith('/') && pageUrl !== base ? pageUrl.slice(0, -1) : pageUrl || `${base}/`;
    document.head.appendChild(link);
  }

  const org = {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'Bavarian Engines',
    alternateName: 'Bavarian Engine Exchange',
    url: base,
    logo: `${base}/images/engines/sets/set-0108/main-BMW-530d-F10-N57D30A-Engine-2012-1.webp`,
    description: 'Buy used original BMW engines for sale from Hamburg. VIN-verified BMW motors — N47, N57, B47, B57, B58, M57.',
    email: 'originalbavarianengine@gmail.com',
    telephone: window.SITE_PHONE || '+49 15510 030835',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tilsiter Str. 90',
      addressLocality: 'Hamburg',
      postalCode: '22047',
      addressCountry: 'DE',
    },
    areaServed: ['DE', 'EU', 'GB', 'IE', 'FR', 'ES', 'IT', 'NL', 'PL', 'CZ'],
    priceRange: '€€€',
    sameAs: [window.SITE_WA_URL || 'https://wa.me/4915510030835'],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bavarian Engines — BMW Engines For Sale',
    url: base,
    description: 'Buy used BMW engines. Original BMW motors for sale from Bavarian Engines Hamburg.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/shop.html?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const graphs = [org];

  if (page === 'home' || path === 'index.html' || path === '') {
    graphs.push(website);
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where can I buy used BMW engines in Europe?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bavarian Engines in Hamburg supplies buy used BMW engines with VIN verification, documented mileage, and EU export. Browse 2000+ BMW engines for sale online.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are Bavarian Engines original BMW engines?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We supply original BMW engine units from documented donors with stamp verification, compression data, and a six-month mechanical warranty.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which BMW engine families do you stock?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'N47, N57, B47, B57, B58, and M57 BMW engines for sale — diesel and petrol platforms for F-series, G-series, and conversion builds.',
          },
        },
      ],
    });
  }

  if (page === 'shop' || path === 'shop.html') {
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'BMW Engines For Sale',
      description: 'Shop buy used BMW engines — original BMW motors from Bavarian Engines.',
      url: `${base}/shop.html`,
    });
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(graphs.length === 1 ? graphs[0] : { '@context': 'https://schema.org', '@graph': graphs });
  document.head.appendChild(script);
})();
