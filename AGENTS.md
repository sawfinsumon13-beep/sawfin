# sawfin

## Cursor Cloud specific instructions

### Product overview
This repository is a **static marketing website** ("Ethereum Recovery Service"): plain
HTML pages at the repo root (`index.html`, `services.html`, `case-studies.html`,
`blog.html`, `blog-post.html`, `about.html`, `faq.html`, `contact.html`, `legal.html`)
plus `assets/css/styles.css` and vanilla JS in `assets/js/` (`site.js`, `blog-data.js`).
There is **no build step, no package manager, and no dependencies** — pages load the CSS/JS
directly via relative paths.

### Running the site (development)
Serve the repo root with any static file server and open the printed URL:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. `python3` and `node`/`npx` are preinstalled,
so `npx serve` works too. There is no hot reload; refresh the browser after editing files.

### Lint / test / build
- No lint/test/build tooling is configured.
- The JS files are plain scripts; validate syntax with `node --check assets/js/site.js`
  and `node --check assets/js/blog-data.js`.
- "Build" = the files as-is; nothing to compile.

### Gotchas
- Open pages through the HTTP server (not `file://`); the blog loads `assets/js/blog-data.js`
  and relative asset paths, which behave correctly only over HTTP.
- The blog index (`blog.html`) renders articles from `BLOG_POSTS` in `assets/js/blog-data.js`;
  `blog-post.html` reads the `?slug=` query param, so individual posts must be reached via links
  from the blog page (or a URL with a valid `slug`).
- The site code currently lives in PR #1 (`cursor/ethereum-recovery-premium-site-e323`).
  The `main` branch only contains `README.md` and this file until that PR is merged.
