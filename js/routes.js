/* Static site routes — always use relative .html paths (works on any host) */
function pageUrl(path) {
  if (!path || path === '/') {
    return 'index.html';
  }

  const queryIndex = path.indexOf('?');
  const pathname = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  const query = queryIndex >= 0 ? path.slice(queryIndex) : '';
  const segment = pathname.replace(/^\//, '').replace(/\.html$/, '');

  if (!segment) {
    return 'index.html';
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

/* Hostinger sometimes serves from /index.html/ — set base href so all pages work */
function ensureDocumentBase() {
  const path = window.location.pathname || '';
  const subdirMatch = path.match(/^(.*\/index\.html)\/?/i);
  if (!subdirMatch) return;

  const baseHref = subdirMatch[1] + '/';
  let baseEl = document.querySelector('base[data-auto-base]');
  if (!baseEl) {
    baseEl = document.createElement('base');
    baseEl.setAttribute('data-auto-base', '1');
    document.head.prepend(baseEl);
  }
  if (baseEl.getAttribute('href') !== baseHref) {
    baseEl.setAttribute('href', baseHref);
  }
}

ensureDocumentBase();
