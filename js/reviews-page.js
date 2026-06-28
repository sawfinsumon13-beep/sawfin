/** Reviews page — 354 profile grid + 450+ paginated customer reviews */

const REVIEWS_PER_PAGE = 20;
const PROFILE_COUNT = 354;
let allReviews = [];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStars(count) {
  const full = '★'.repeat(count);
  const empty = '☆'.repeat(5 - count);
  return `${full}${empty}`;
}

function renderReviewItem(review) {
  return `
    <article class="review-item" id="${escapeHtml(review.id)}">
      <div class="review-identity">
        <div class="review-avatar" aria-hidden="true">${escapeHtml(review.initials)}<span class="review-verified" title="Verified purchase">✓</span></div>
        <div class="review-meta-block">
          <div class="review-name-row">
            <strong class="review-name">${escapeHtml(review.fullName)}</strong>
            <time class="review-date" datetime="${escapeHtml(review.datetime)}">${escapeHtml(review.date)}</time>
          </div>
          <div class="review-stars" aria-label="${review.stars} out of 5 stars">${renderStars(review.stars)}</div>
        </div>
      </div>
      <p class="review-product">${escapeHtml(review.product)}</p>
      <p class="review-body">${escapeHtml(review.body)}</p>
    </article>`;
}

function renderPagination(current, total) {
  if (total <= 1) return '';
  let html = '<nav class="blog-pagination review-pagination" aria-label="Review pages">';
  if (current > 1) {
    html += `<button type="button" class="blog-page-btn" data-page="${current - 1}">← Previous</button>`;
  }
  html += `<span class="blog-page-info">Page ${current} of ${total} · ${allReviews.length} reviews</span>`;
  if (current < total) {
    html += `<button type="button" class="blog-page-btn" data-page="${current + 1}">Next →</button>`;
  }
  html += '</nav>';
  return html;
}

function getReviewPageForId(reviewId) {
  const index = allReviews.findIndex((r) => r.id === reviewId);
  if (index < 0) return 1;
  return Math.floor(index / REVIEWS_PER_PAGE) + 1;
}

function highlightReview(reviewId) {
  const target = document.getElementById(reviewId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.classList.add('review-item--highlight');
  setTimeout(() => target.classList.remove('review-item--highlight'), 2000);
}

function renderProfiles() {
  const grid = document.getElementById('review-profiles-grid');
  if (!grid || !allReviews.length) return;

  const profiles = allReviews.slice(0, PROFILE_COUNT).map((r) => ({
    initials: r.initials,
    name: r.firstName,
    id: r.id,
  }));

  grid.innerHTML = profiles.map((p, i) => `
    <button type="button" class="review-profile-chip" data-target="${escapeHtml(p.id)}" data-index="${i}" aria-label="Jump to ${escapeHtml(p.name)}'s review">
      <span class="review-profile-avatar">${escapeHtml(p.initials)}<span class="review-verified" aria-hidden="true">✓</span></span>
      <span class="review-profile-name">${escapeHtml(p.name)}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.review-profile-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const page = getReviewPageForId(targetId);
      const url = new URL(window.location.href);
      url.searchParams.set('page', String(page));
      url.hash = targetId;
      window.location.href = url.toString();
    });
  });
}

function renderReviewList(page) {
  const list = document.getElementById('review-list');
  const paginationEl = document.getElementById('review-pagination');
  if (!list) return;

  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const start = (page - 1) * REVIEWS_PER_PAGE;
  const slice = allReviews.slice(start, start + REVIEWS_PER_PAGE);
  list.innerHTML = slice.map(renderReviewItem).join('');

  if (paginationEl) {
    paginationEl.innerHTML = renderPagination(page, totalPages);
    paginationEl.querySelectorAll('.blog-page-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.page;
        const url = new URL(window.location.href);
        url.searchParams.set('page', p);
        url.hash = '';
        window.location.href = url.toString();
      });
    });
  }

  const countLabel = document.getElementById('review-list-count');
  if (countLabel) {
    countLabel.textContent = `Showing ${allReviews.length} verified customer reviews`;
  }
}

async function initReviewsPage() {
  const list = document.getElementById('review-list');
  if (!list) return;

  try {
    const res = await fetch('js/reviews-index.json');
    allReviews = await res.json();

    const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
    const params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page') || '1', 10);
    if (Number.isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    renderProfiles();
    renderReviewList(page);

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => highlightReview(hash), 150);
      const chip = document.querySelector(`.review-profile-chip[data-target="${hash}"]`);
      if (chip) chip.classList.add('active');
    }
  } catch (e) {
    list.innerHTML = '<p style="color:#888;">Unable to load customer reviews.</p>';
  }
}

if (window.SPA_MODE) {
  window.initReviewsPage = initReviewsPage;
} else {
  document.addEventListener('DOMContentLoaded', initReviewsPage);
}
