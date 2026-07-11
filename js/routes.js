/* Static site routes — always use relative .html paths (works on any host, no compile step) */
function pageUrl(path) {
  if (!path || path === '/') return 'index.html';

  const queryIndex = path.indexOf('?');
  const pathname = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const query = queryIndex >= 0 ? path.slice(queryIndex) : '';
  const segment = pathname.replace(/^\//, '').replace(/\.html$/, '');

  if (!segment) return 'index.html';

  return `${segment}.html${query}`;
}
