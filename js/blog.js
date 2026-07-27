(function () {
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function loadPosts() {
    return fetch("data/blog-posts.json").then(function (r) {
      if (!r.ok) throw new Error("blog");
      return r.json();
    });
  }

  function cardHtml(post) {
    return (
      '<article class="blog-card">' +
      '<a href="blog-post.html?slug=' +
      encodeURIComponent(post.slug) +
      '">' +
      '<div class="blog-card-image"><img src="' +
      post.image +
      '" alt="" loading="lazy"></div>' +
      '<div class="blog-card-body">' +
      '<p class="product-tag">' +
      post.category +
      "</p>" +
      "<h3>" +
      post.title +
      "</h3>" +
      "<p>" +
      post.excerpt +
      "</p>" +
      '<div class="blog-card-meta"><span>' +
      post.date +
      "</span><span>" +
      post.wordCount +
      " words</span></div>" +
      '<span class="blog-read">Read article →</span>' +
      "</div></a></article>"
    );
  }

  function initBlogList() {
    var grid = document.getElementById("blog-grid");
    var count = document.getElementById("blog-count");
    var search = document.getElementById("blog-search");
    if (!grid) return;

    loadPosts()
      .then(function (posts) {
        function render(q) {
          var filtered = posts.filter(function (p) {
            if (!q) return true;
            q = q.toLowerCase();
            return (
              p.title.toLowerCase().includes(q) ||
              p.excerpt.toLowerCase().includes(q) ||
              (p.keyword && p.keyword.toLowerCase().includes(q))
            );
          });
          if (count) {
            count.textContent = "Showing " + filtered.length + " of " + posts.length + " articles";
          }
          grid.innerHTML = filtered.map(cardHtml).join("") || "<p>No articles match.</p>";
        }
        render("");
        if (search) {
          search.addEventListener("input", function () {
            render(search.value);
          });
        }
      })
      .catch(function () {
        grid.innerHTML = "<p>Could not load blog posts. Serve over HTTP.</p>";
      });
  }

  function initBlogPost() {
    var root = document.getElementById("blog-post-root");
    if (!root) return;
    var slug = qs("slug");
    if (!slug) {
      root.innerHTML = '<p>Article not found. <a href="blog.html">Back to blog</a></p>';
      return;
    }

    loadPosts().then(function (posts) {
      var post = posts.find(function (p) {
        return p.slug === slug;
      });
      if (!post) {
        root.innerHTML = '<p>Article not found. <a href="blog.html">Back to blog</a></p>';
        return;
      }
      document.title = post.title + " | Apex Bioreagents";
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.excerpt);

      var related = posts
        .filter(function (p) {
          return p.slug !== post.slug;
        })
        .slice(0, 3)
        .map(cardHtml)
        .join("");

      root.innerHTML =
        '<nav class="breadcrumb"><a href="index.html">Home</a> / <a href="blog.html">Blog</a> / ' +
        post.title +
        "</nav>" +
        '<article class="blog-article">' +
        '<p class="product-tag">' +
        post.category +
        " · Keyword: " +
        post.keyword +
        "</p>" +
        "<h1>" +
        post.title +
        "</h1>" +
        '<p class="blog-card-meta"><span>' +
        post.date +
        "</span><span>" +
        post.author +
        "</span><span>" +
        post.wordCount +
        " words</span></p>" +
        '<div class="blog-hero-image"><img src="' +
        post.image +
        '" alt=""></div>' +
        '<div class="blog-content">' +
        post.body +
        "</div>" +
        '<p class="product-actions-row" style="margin-top:2rem">' +
        '<a class="btn btn-primary" href="products.html">Shop — buy research peptides</a>' +
        '<a class="btn btn-secondary" href="blog.html">All blog articles</a></p>' +
        "</article>" +
        '<section class="section-tight"><h2>Related articles</h2><div class="blog-grid blog-grid-related">' +
        related +
        "</div></section>";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "blog") initBlogList();
    if (document.body.dataset.page === "blog-post") initBlogPost();
  });
})();
