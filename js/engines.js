const PER_PAGE = 24;
let allEngines = [];
let filtered = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  await loadEngines();
  applyUrlFilters();
  renderEngines();
  setupFilters();
});

async function loadEngines() {
  const grid = document.getElementById('engineGrid');
  grid.innerHTML = '<div class="loading"><div class="spinner"></div>Loading 3,100+ engines...</div>';

  try {
    const indexRes = await fetch('data/engines/index.json');
    const index = await indexRes.json();
    const promises = [];
    for (let i = 1; i <= index.chunks; i++) {
      const num = String(i).padStart(3, '0');
      promises.push(fetch(`data/engines/chunk-${num}.json`).then(r => r.json()));
    }
    const chunks = await Promise.all(promises);
    allEngines = chunks.flat();
    filtered = [...allEngines];
    document.getElementById('totalCount').textContent = allEngines.length.toLocaleString();
  } catch (err) {
    grid.innerHTML = '<p class="loading">Failed to load engine catalog.</p>';
  }
}

function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const fuel = params.get('fuel');
  const series = params.get('series');
  const era = params.get('era');
  const family = params.get('family');

  if (fuel) {
    document.getElementById('filterFuel').value = fuel;
    filtered = filtered.filter(e => e.fuel === fuel);
  }
  if (series) {
    filtered = filtered.filter(e => e.series === series);
  }
  if (era) {
    document.getElementById('filterEra').value = era;
    filtered = filtered.filter(e => e.era === era);
  }
  if (family) {
    const el = document.getElementById('filterFamily');
    if (el) el.value = family;
    filtered = filtered.filter(e => e.family === family);
  }
}

function setupFilters() {
  ['filterSearch', 'filterFuel', 'filterEra', 'filterFamily', 'filterSort'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
    document.getElementById(id)?.addEventListener('input', applyFilters);
  });
}

function applyFilters() {
  const search = document.getElementById('filterSearch').value.toLowerCase();
  const fuel = document.getElementById('filterFuel').value;
  const era = document.getElementById('filterEra').value;
  const family = document.getElementById('filterFamily').value;
  const sort = document.getElementById('filterSort').value;

  filtered = allEngines.filter(e => {
    if (search && !e.name.toLowerCase().includes(search) && !e.code.toLowerCase().includes(search)) return false;
    if (fuel && e.fuel !== fuel) return false;
    if (era && e.era !== era) return false;
    if (family && e.family !== family) return false;
    return true;
  });

  switch (sort) {
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'power-desc': filtered.sort((a, b) => b.power - a.power); break;
    case 'mileage-asc': filtered.sort((a, b) => a.mileage - b.mileage); break;
    default: filtered.sort((a, b) => a.id - b.id);
  }

  currentPage = 1;
  renderEngines();
}

function bindDetailLinks(root) {
  if (!root || root.dataset.detailBound === '1') return;
  root.dataset.detailBound = '1';
  root.addEventListener('click', (event) => {
    const link = event.target.closest('[data-detail-link]');
    if (!link) return;
    const url = link.getAttribute('href');
    if (!url || url === '#') return;
    event.preventDefault();
    event.stopPropagation();
    const engineId = link.dataset.engineId;
    navigateTo(url, engineId);
  });
}

function renderEngines() {
  const grid = document.getElementById('engineGrid');
  const start = (currentPage - 1) * PER_PAGE;
  const page = filtered.slice(start, start + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  document.getElementById('showingCount').textContent =
    `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length.toLocaleString()} engines`;

  if (page.length === 0) {
    grid.innerHTML = '<p class="loading">No engines match your filters.</p>';
    return;
  }

  grid.innerHTML = page.map(e => {
    const gallery = getEngineGalleryImages(e);
    const title = formatEngineTitle(e);
    const platforms = getEnginePlatformInfo(e);
    const detailUrl = pageUrl(`/engine-detail?id=${e.id}`);
    const emailBuyHref = buildEnginePurchaseEmail(e);
    const whatsappBuyHref = buildEnginePurchaseWhatsApp(e);
  return `
    <article class="engine-card">
      <a href="${detailUrl}" class="engine-card-media" data-detail-link data-engine-id="${e.id}">
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
            <span class="spec-tag">${e.family}</span>
            <span class="spec-tag">${e.power} hp</span>
            <span class="spec-tag">${e.fuel}</span>
            <span class="spec-tag">${e.displacement}L</span>
          </div>
          <div class="card-meta">
            <span class="card-price">${formatPrice(e.price)}</span>
          </div>
        </div>
      </a>
      <div class="card-actions">
        <a href="${detailUrl}" class="btn btn-sm btn-outline" data-detail-link data-engine-id="${e.id}">Details</a>
        <a href="${emailBuyHref}" class="btn btn-sm btn-primary">Email to Buy</a>
        <a href="${whatsappBuyHref}" class="btn btn-sm btn-whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </article>`;
  }).join('');

  bindDetailLinks(grid);

  renderPagination(currentPage, totalPages, (page) => {
    currentPage = page;
    renderEngines();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
