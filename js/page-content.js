const PAGE_IMAGE_SEEDS = {
  'm57-swap-kits': 25,
  services: 35,
  about: 45,
  contact: 55,
  policies: 70
};

async function loadPageContent(slug) {
  const container = document.getElementById('pageContent');
  if (!container || slug === 'blog') return;

  try {
    const res = await fetch(`data/pages/${slug}.json`);
    const data = await res.json();

    if (data.layout === 'contact') {
      container.innerHTML = renderContactLayout(data);
    } else if (data.layout === 'policy') {
      container.innerHTML = renderPolicyLayout(data);
    } else {
      container.innerHTML = renderPageSections(data);
    }
  } catch (err) {
    console.error('Failed to load page content:', err);
  }
}

function renderPageSections(data) {
  return data.sections.map((section, i) => {
    const img = section.image;
    const num = String(i + 1).padStart(2, '0');
    const [lead, ...rest] = section.paragraphs;

    return `
    <section class="content-block-section${i % 2 ? ' alt-bg' : ''}" id="section-${num}">
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

function renderContactLayout(data) {
  const hero = data.heroImage;
  const faq = (data.faq || []).map((item, i) => `
    <details class="faq-item"${i === 0 ? ' open' : ''}>
      <summary>${item.q}</summary>
      <div class="faq-answer"><p>${item.a}</p></div>
    </details>
  `).join('');

  return `
    <section class="contact-hero-section">
      <div class="container contact-hero-layout">
        <div class="contact-hero-image">
          <img src="${hero}" alt="BMW engines ready for dispatch from Hamburg" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
        </div>
        <div class="contact-hero-text">
          <span class="section-tag">Hamburg HQ</span>
          <h2>${data.introTitle}</h2>
          ${data.introParagraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    </section>
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Help Centre</span>
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers about quotes, fitment, shipping, and warranty.</p>
        </div>
        <div class="faq-list">${faq}</div>
      </div>
    </section>`;
}

function renderPolicyLayout(data) {
  return `
    <div class="policy-premium">
      ${data.sections.map((section, i) => `
        <section class="policy-block${i % 2 ? ' alt-bg' : ''}">
          <div class="container policy-block-inner">
            <div class="policy-block-text">
              <span class="section-tag">${section.tag}</span>
              <h2>${section.title}</h2>
              ${section.paragraphs.map(p => `<p>${p}</p>`).join('')}
            </div>
            <div class="policy-block-image">
              <img src="${section.image}" alt="${section.imageAlt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
            </div>
          </div>
        </section>
      `).join('')}
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const slug = document.body.dataset.page;
  if (slug) loadPageContent(slug);
});
