document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('featuredEngines');
  if (!grid) return;

  try {
    const res = await fetch('data/engines/chunk-001.json');
    const engines = await res.json();
    const featured = engines.slice(0, 6);

    grid.innerHTML = featured.map(e => {
      const gallery = getEngineGalleryImages(e);
      const title = formatEngineTitle(e);
      const platforms = getEnginePlatformInfo(e);
      const detailUrl = pageUrl(`/engine-detail?id=${e.id}`);
      const emailBuyHref = buildEnginePurchaseEmail(e);
      const whatsappBuyHref = buildEnginePurchaseWhatsApp(e);
      return `
      <article class="engine-card">
        <a href="${detailUrl}" class="engine-card-media" onclick="rememberEngineDetailId(${e.id})">
          <div class="card-image">
            <img src="${gallery[0]}" alt="${getEngineImageAlt(e)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
            <div class="card-thumb-row">
              ${gallery.slice(0, 5).map((img, i) => `
                <img src="${img}" alt="${getEngineImageAlt(e, i)}" class="card-thumb${i === 0 ? ' active' : ''}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
              `).join('')}
            </div>
            <span class="card-badge">${e.condition}</span>
          </div>
          <div class="card-body">
            <h3>${title}</h3>
            <p>${platforms.primary} · ${e.code} · ${e.mileage.toLocaleString()} km</p>
            <div class="card-specs">
              <span class="spec-tag">${e.power} hp</span>
              <span class="spec-tag">${e.displacement}L</span>
              <span class="spec-tag">${e.fuel}</span>
            </div>
            <div class="card-meta">
              <span class="card-price">${formatPrice(e.price)}</span>
            </div>
          </div>
        </a>
        <div class="card-actions">
          <a href="${detailUrl}" class="btn btn-sm btn-outline" onclick="rememberEngineDetailId(${e.id})">Details</a>
          <a href="${emailBuyHref}" class="btn btn-sm btn-primary">Email to Buy</a>
          <a href="${whatsappBuyHref}" class="btn btn-sm btn-whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </article>`;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<p class="loading">Unable to load engines. Please try again.</p>';
  }
});

async function loadFeaturedBlogs() {
  const grid = document.getElementById('featuredBlogs');
  if (!grid) return;

  try {
    const res = await fetch('data/blogs/index.json');
    const data = await res.json();
    const featured = data.posts.slice(0, 6);

    grid.innerHTML = featured.map(b => `
      <a href="${pageUrl(`/blog-post?id=${b.id}`)}" class="blog-card">
        <div class="card-image">
          <img src="${getBlogImage(b)}" alt="${b.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
        </div>
        <div class="card-body">
          <span class="card-badge">${b.category}</span>
          <h3>${b.title}</h3>
          <p>${b.excerpt}</p>
        </div>
      </a>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p class="loading">Unable to load blog posts.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadFeaturedBlogs);
