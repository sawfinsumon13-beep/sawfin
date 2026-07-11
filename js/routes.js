/* Static site route helpers — clean URLs on production, .html for local file preview */
function usesCleanUrls() {
  if (typeof window === 'undefined') return true;
  return !window.location.pathname.endsWith('.html');
}

function pageUrl(path) {
  if (!path || path === '/') {
    return usesCleanUrls() ? '/' : 'index.html';
  }

  const queryIndex = path.indexOf('?');
  const pathname = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const query = queryIndex >= 0 ? path.slice(queryIndex) : '';
  const segment = pathname.replace(/^\//, '').replace(/\.html$/, '');

  if (!segment) {
    return usesCleanUrls() ? '/' : 'index.html';
  }

  // Production servers redirect *.html -> clean path and DROP the query string.
  // Always use /page?query on clean-url hosts so ?id= survives.
  if (usesCleanUrls()) {
    return `/${segment}${query}`;
  }

  return `${segment}.html${query}`;
}
