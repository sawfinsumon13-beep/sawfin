/* Static site routes — auto-detect clean URLs vs .html hosting */
function usesCleanUrls() {
  if (typeof window === 'undefined') return false;
  return !/\.html$/i.test(window.location.pathname);
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

  // Clean-url hosts (e.g. /engines) must link to /engine-detail?id=1
  // because engine-detail.html?id=1 gets redirected and loses ?id=
  if (usesCleanUrls()) {
    return `/${segment}${query}`;
  }

  return `${segment}.html${query}`;
}

function rememberEngineDetailId(id) {
  const engineId = parseInt(id, 10);
  if (engineId > 0) {
    try {
      sessionStorage.setItem('bmwEngineDetailId', String(engineId));
    } catch (_) {}
  }
}

function getRememberedEngineDetailId() {
  try {
    const id = parseInt(sessionStorage.getItem('bmwEngineDetailId'), 10);
    return id > 0 ? id : 0;
  } catch (_) {
    return 0;
  }
}

function navigateTo(url, engineId) {
  if (!url) return;
  if (engineId) rememberEngineDetailId(engineId);
  else {
    const match = String(url).match(/[?&]id=(\d+)/);
    if (match) rememberEngineDetailId(match[1]);
  }
  window.location.assign(url);
}
