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

function showDeployWarningIfNeeded() {
  const path = window.location.pathname || '';
  if (!/\/index\.html\//i.test(path)) return;

  const banner = document.createElement('div');
  banner.setAttribute('role', 'alert');
  banner.style.cssText = [
    'position:fixed', 'bottom:16px', 'left:16px', 'right:16px', 'z-index:999999',
    'max-width:640px', 'margin:0 auto', 'padding:16px 18px', 'border-radius:12px',
    'background:#7f1d1d', 'color:#fff', 'font:600 14px/1.5 system-ui,sans-serif',
    'box-shadow:0 12px 40px rgba(0,0,0,0.45)', 'border:1px solid #fca5a5'
  ].join(';');
  banner.innerHTML = '<strong>Wrong upload folder on Hostinger.</strong> Move all files from the <code>index.html</code> folder into <code>public_html</code> root (not inside a subfolder). Then open <code>yourdomain.com</code> — not <code>/index.html/</code>.';
  document.body.appendChild(banner);
}
