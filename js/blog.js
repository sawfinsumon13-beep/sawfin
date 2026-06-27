const BLOG_PER_PAGE = 12;

function renderBlogCard(post) {
  return `
    <a href="${post.url}" class="blog-card">
      <div class="blog-card-image"><img src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy"></div>
      <div class="blog-card-body">
        <div class="blog-meta">${escapeHtml(post.category)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
      </div>
    </a>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPagination(current, total) {
  if (total <= 1) return '';
  let html = '<nav class="blog-pagination" aria-label="Blog pages">';
  if (current > 1) {
    html += `<button type="button" class="blog-page-btn" data-page="${current - 1}">← Previous</button>`;
  }
  html += `<span class="blog-page-info">Page ${current} of ${total}</span>`;
  if (current < total) {
    html += `<button type="button" class="blog-page-btn" data-page="${current + 1}">Next →</button>`;
  }
  html += '</nav>';
  return html;
}

async function initBlogListing() {
  const grid = document.getElementById('blog-grid');
  const paginationEl = document.getElementById('blog-pagination');
  if (!grid) return;

  try {
    const res = await fetch('js/blog-index.json');
    const posts = await res.json();
    const totalPages = Math.ceil(posts.length / BLOG_PER_PAGE);

    const params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page') || '1', 10);
    if (Number.isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * BLOG_PER_PAGE;
    const slice = posts.slice(start, start + BLOG_PER_PAGE);
    grid.innerHTML = slice.map(renderBlogCard).join('');

    const countEl = document.getElementById('blog-count');
    if (countEl) {
      countEl.textContent = `${posts.length} technical articles — buying guides, platform comparisons, workshop advice, and logistics from Hamburg.`;
    }

    if (paginationEl) {
      paginationEl.innerHTML = renderPagination(page, totalPages);
      paginationEl.querySelectorAll('.blog-page-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = btn.dataset.page;
          const url = new URL(window.location.href);
          url.searchParams.set('page', p);
          window.location.href = url.toString();
        });
      });
    }
  } catch (e) {
    grid.innerHTML = '<p style="color:#888;">Unable to load blog articles.</p>';
  }
}

document.addEventListener('DOMContentLoaded', initBlogListing);
