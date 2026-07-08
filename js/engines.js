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

  grid.innerHTML = page.map(e => `
    <a href="/engine-detail?id=${e.id}" class="engine-card">
      <div class="card-image">
        <img src="${e.images[0]}" alt="${e.name}" loading="lazy" onerror="this.src='https://placehold.co/800x600/161d28/3d8fe8/png?text=BMW+Engine'">
        <span class="card-badge">${e.condition}</span>
      </div>
      <div class="card-body">
        <h3>${e.name}</h3>
        <p>${e.description.substring(0, 100)}...</p>
        <div class="card-specs">
          <span class="spec-tag">${e.family}</span>
          <span class="spec-tag">${e.power} hp</span>
          <span class="spec-tag">${e.fuel}</span>
          <span class="spec-tag">${e.mileage.toLocaleString()} km</span>
        </div>
        <div class="card-meta">
          <span class="card-price">${formatPrice(e.price)}</span>
          <span class="btn btn-sm btn-outline">Details</span>
        </div>
      </div>
    </a>
  `).join('');

  renderPagination(currentPage, totalPages, (page) => {
    currentPage = page;
    renderEngines();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
