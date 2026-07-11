/* Static site route helpers — use .html paths so links work without server rewrites */
function pageUrl(path) {
  if (!path || path === '/') return 'index.html';

  const queryIndex = path.indexOf('?');
  const pathname = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const query = queryIndex >= 0 ? path.slice(queryIndex) : '';
  const segment = pathname.replace(/^\//, '');

  if (!segment) return 'index.html' + query;
  if (segment.endsWith('.html')) return segment + query;
  return `${segment}.html${query}`;
}
