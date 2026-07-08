const PER_PAGE = 24;
let allReviews = [];
let filtered = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/reviews/index.json');
    const data = await res.json();
    allReviews = data.reviews;
    filtered = [...allReviews];

    document.getElementById('totalReviews').textContent = data.total;
    document.getElementById('avgRating').textContent = data.averageRating;
    document.getElementById('satisfactionRate').textContent = data.satisfactionRate + '%';

    renderReviews();
    setupFilters();
  } catch (err) {
    document.getElementById('reviewsGridInner').innerHTML = '<p class="loading">Failed to load reviews.</p>';
  }
});

function setupFilters() {
  document.getElementById('filterStars')?.addEventListener('change', applyFilters);
  document.getElementById('filterSearch')?.addEventListener('input', applyFilters);
}

function applyFilters() {
  const stars = document.getElementById('filterStars').value;
  const search = document.getElementById('filterSearch').value.toLowerCase();

  filtered = allReviews.filter(r => {
    if (stars && r.stars !== parseInt(stars, 10)) return false;
    if (search && !r.text.toLowerCase().includes(search) && !r.engine.toLowerCase().includes(search) && !r.city.toLowerCase().includes(search)) return false;
    return true;
  });

  currentPage = 1;
  renderReviews();
}

function renderReviews() {
  const grid = document.getElementById('reviewsGridInner');
  const start = (currentPage - 1) * PER_PAGE;
  const page = filtered.slice(start, start + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  document.getElementById('showingReviews').textContent =
    `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} reviews`;

  grid.innerHTML = page.map(r => `
    <div class="review-card review-card-premium">
      <div class="review-card-top">
        <div class="review-engine-photo">
          <img src="${r.image}" alt="BMW ${r.engine} engine — customer purchase" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
        </div>
        <div class="review-card-main">
          <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
          <blockquote>"${r.text}"</blockquote>
          <div class="review-meta">
            <span class="review-engine-tag">${r.engine} · ${r.platform}</span>
            ${r.verified ? '<span class="review-verified">Verified Purchase</span>' : ''}
          </div>
        </div>
      </div>
      <div class="review-author">
        <div class="review-avatar">${r.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <strong>${r.name}</strong>
          <span>${r.city}, ${r.country} · ${formatDate(r.date)}</span>
        </div>
      </div>
    </div>
  `).join('');

  renderPagination(currentPage, totalPages, (p) => {
    currentPage = p;
    renderReviews();
    document.getElementById('reviewsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
