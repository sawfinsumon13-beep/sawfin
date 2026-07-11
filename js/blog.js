const PER_PAGE = 33;
let allPosts = [];
let filtered = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('data/blogs/index.json');
    const data = await res.json();
    allPosts = data.posts;
    filtered = [...allPosts];
    document.getElementById('totalBlogs').textContent = allPosts.length;
    renderBlogs();
    setupFilters();
  } catch (err) {
    document.getElementById('blogGrid').innerHTML = '<p class="loading">Failed to load blog posts.</p>';
  }
});

function setupFilters() {
  document.getElementById('filterCategory')?.addEventListener('change', applyFilters);
  document.getElementById('filterSearch')?.addEventListener('input', applyFilters);
}

function applyFilters() {
  const category = document.getElementById('filterCategory').value;
  const search = document.getElementById('filterSearch').value.toLowerCase();

  filtered = allPosts.filter(p => {
    if (category && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search)) return false;
    return true;
  });

  currentPage = 1;
  renderBlogs();
}

function renderBlogs() {
  const grid = document.getElementById('blogGrid');
  const start = (currentPage - 1) * PER_PAGE;
  const page = filtered.slice(start, start + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  document.getElementById('showingBlogs').textContent =
    `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} articles`;

  grid.innerHTML = page.map(b => `
    <a href="${pageUrl(`/blog-post?id=${b.id}`)}" class="blog-card">
      <div class="card-image">
        <img src="${getBlogImage(b)}" alt="${b.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
      </div>
      <div class="card-body">
        <span class="card-badge">${b.category}</span>
        <h3>${b.title}</h3>
        <p>${b.excerpt}</p>
        <div class="card-meta">
          <span style="font-size:0.8rem;color:var(--text-muted)">${b.date} · ${b.wordCount.toLocaleString()} words</span>
        </div>
      </div>
    </a>
  `).join('');

  renderPagination(currentPage, totalPages, (page) => {
    currentPage = page;
    renderBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
