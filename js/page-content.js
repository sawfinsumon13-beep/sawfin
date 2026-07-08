async function loadPageContent(slug) {
  const container = document.getElementById('pageContent');
  if (!container) return;

  try {
    const res = await fetch(`data/pages/${slug}.json`);
    const data = await res.json();
    container.innerHTML = renderPageGallery(data) + renderPageSections(data);
  } catch (err) {
    console.error('Failed to load page content:', err);
  }
}

function renderPageGallery(data) {
  const images = (data.gallerySets || []).map((setId, i) => ({
    src: `images/engines/sets/${setId}/01.webp`,
    alt: `BMW engine warehouse inventory photo ${i + 1}`
  }));

  return `
    <section class="engine-gallery-section page-gallery-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Warehouse</span>
          <h2>${data.galleryTitle}</h2>
          <p>${data.gallerySubtitle}</p>
        </div>
        <div class="engine-gallery-grid page-gallery-grid">
          ${images.map(img => `
            <div class="engine-gallery-item">
              <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
}

function renderPageSections(data) {
  const sets = data.gallerySets || [];
  return data.sections.map((section, i) => {
    const setId = sets[i % sets.length] || 'set-0114';
    const imgNum = String((i % 6) + 1).padStart(2, '0');
    const img = `images/engines/sets/${setId}/${imgNum}.webp`;
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

document.addEventListener('DOMContentLoaded', () => {
  const slug = document.body.dataset.page;
  if (slug) loadPageContent(slug);
});
