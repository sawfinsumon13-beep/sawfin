document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('featuredEngines');
  if (!grid) return;

  try {
    const res = await fetch('data/engines/chunk-001.json');
    const engines = await res.json();
    const featured = engines.slice(0, 6);

    grid.innerHTML = featured.map(e => {
      const gallery = getEngineGalleryImages(e);
      return `
      <a href="/engine-detail?id=${e.id}" class="engine-card">
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
          <h3>${e.name}</h3>
          <p>${e.description.substring(0, 120)}...</p>
          <div class="card-specs">
            <span class="spec-tag">${e.power} hp</span>
            <span class="spec-tag">${e.displacement}L</span>
            <span class="spec-tag">${e.mileage.toLocaleString()} km</span>
          </div>
          <div class="card-meta">
            <span class="card-price">${formatPrice(e.price)}</span>
            <span class="btn btn-sm btn-outline">View Details</span>
          </div>
        </div>
      </a>`;
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
      <a href="/blog-post?id=${b.id}" class="blog-card">
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
