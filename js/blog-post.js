document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) { window.location.href = '/blog'; return; }

  const container = document.getElementById('articleContent');
  container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading article...</div>';

  try {
    const res = await fetch(`data/blogs/post-${String(id).padStart(3, '0')}.json`);
    const post = await res.json();

    document.title = `${post.title} | Premium BMW Engines Blog`;
    document.getElementById('breadcrumbTitle').textContent = post.title;

    container.innerHTML = `
      <div class="article-featured">
        <img src="${post.image}" alt="${post.title}" onerror="this.src='https://placehold.co/800x600/161d28/3d8fe8/png?text=BMW+Blog'">
      </div>
      <div class="article-meta">
        <span class="card-badge">${post.category}</span>
        <span>${post.date}</span>
        <span>${post.author}</span>
        <span>${post.wordCount.toLocaleString()} words</span>
      </div>
      <h1>${post.title}</h1>
      ${post.content}
      <div class="cta-banner">
        <h3>Need a BMW Engine?</h3>
        <p>Browse our catalog of 3,100+ tested engines or contact our technical team for expert advice.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="/engines" class="btn btn-primary">Browse Engines</a>
          <a href="/contact" class="btn btn-outline">Contact Us</a>
        </div>
      </div>`;
  } catch (err) {
    container.innerHTML = '<p class="loading">Article not found.</p>';
  }
});
