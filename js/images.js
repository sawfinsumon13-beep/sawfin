// Verified BMW engine inventory photos only — TwinPower covers, complete blocks, turbo close-ups
const ENGINE_VIEWS = {
  top_cover: 'https://images.unsplash.com/photo-1539285536184-4281d3ba81e0?w=900&q=80',
  engine_bay: 'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  m_power: 'https://images.unsplash.com/photo-1744223736435-be69cb546250?w=900&q=80',
  diesel_block: 'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  turbo_close: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
  block_close: 'https://images.unsplash.com/photo-1523987410005-146147a9bef4?w=900&q=80',
  hood_open: 'https://images.unsplash.com/photo-1644761152591-4ae6dd643850?w=900&q=80',
  bmw_power: 'https://images.unsplash.com/photo-1707406767272-8c1deea8f5b8?w=900&q=80',
  pallet_main: 'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  pallet_alt: 'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  hoses_detail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
  components_detail: 'https://images.unsplash.com/photo-1523987410005-146147a9bef4?w=900&q=80',
  warehouse_a: 'https://images.unsplash.com/photo-1644761152591-4ae6dd643850?w=900&q=80',
  warehouse_b: 'https://images.unsplash.com/photo-1707406767272-8c1deea8f5b8?w=900&q=80',
  block_side: 'https://images.unsplash.com/photo-1523987410005-146147a9bef4?w=900&q=80',
  intake_detail: 'https://images.unsplash.com/photo-1539285536184-4281d3ba81e0?w=900&q=80',
  mount_detail: 'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  stand_view: 'https://images.unsplash.com/photo-1744223736435-be69cb546250?w=900&q=80',
  floor_view: 'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  inner_detail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
  engine_parts: 'https://images.unsplash.com/photo-1523987410005-146147a9bef4?w=900&q=80',
  workshop: 'https://images.unsplash.com/photo-1644761152591-4ae6dd643850?w=900&q=80'
};

const FAMILY_GALLERIES = {
  N47: ['top_cover', 'diesel_block', 'turbo_close', 'block_close', 'hood_open', 'engine_bay'],
  N57: ['diesel_block', 'top_cover', 'engine_bay', 'turbo_close', 'block_close', 'hood_open'],
  M57: ['diesel_block', 'engine_bay', 'top_cover', 'turbo_close', 'block_close', 'hood_open'],
  B57: ['engine_bay', 'diesel_block', 'top_cover', 'turbo_close', 'block_close', 'hood_open'],
  B47: ['diesel_block', 'top_cover', 'turbo_close', 'block_close', 'hood_open', 'engine_bay'],
  B58: ['m_power', 'engine_bay', 'turbo_close', 'bmw_power', 'block_close', 'top_cover'],
  M54: ['block_close', 'hood_open', 'engine_bay', 'turbo_close', 'diesel_block', 'top_cover'],
  M20: ['hood_open', 'block_close', 'engine_bay', 'diesel_block', 'top_cover', 'turbo_close'],
  M30: ['engine_bay', 'block_close', 'hood_open', 'diesel_block', 'top_cover', 'turbo_close'],
  M47: ['diesel_block', 'top_cover', 'block_close', 'turbo_close', 'hood_open'],
  S54: ['turbo_close', 'm_power', 'bmw_power', 'engine_bay', 'block_close', 'hood_open'],
  N54: ['engine_bay', 'm_power', 'turbo_close', 'bmw_power', 'block_close', 'hood_open'],
  N55: ['engine_bay', 'm_power', 'turbo_close', 'top_cover', 'bmw_power', 'block_close'],
  B48: ['engine_bay', 'diesel_block', 'turbo_close', 'top_cover', 'block_close', 'hood_open'],
  B46: ['engine_bay', 'diesel_block', 'top_cover', 'turbo_close', 'block_close', 'hood_open'],
  N52: ['hood_open', 'engine_bay', 'block_close', 'turbo_close', 'diesel_block'],
  N20: ['engine_bay', 'turbo_close', 'hood_open', 'top_cover', 'block_close'],
  S55: ['m_power', 'turbo_close', 'engine_bay', 'bmw_power', 'block_close'],
  S58: ['m_power', 'turbo_close', 'engine_bay', 'bmw_power', 'block_close', 'hood_open']
};

const DEFAULT_GALLERY = ['diesel_block', 'top_cover', 'engine_bay', 'turbo_close', 'block_close', 'hood_open'];

const ENGINE_PRODUCT_IMAGES = Object.values(ENGINE_VIEWS);

const CATEGORY_IMAGES = {
  N47: ENGINE_VIEWS.top_cover,
  N57: ENGINE_VIEWS.diesel_block,
  M57: ENGINE_VIEWS.diesel_block,
  B57: ENGINE_VIEWS.engine_bay,
  B47: ENGINE_VIEWS.diesel_block,
  M54: ENGINE_VIEWS.block_close,
  M20: ENGINE_VIEWS.hood_open,
  M30: ENGINE_VIEWS.engine_bay,
  M47: ENGINE_VIEWS.diesel_block,
  B58: ENGINE_VIEWS.m_power,
  S54: ENGINE_VIEWS.turbo_close
};

const VIEW_LABELS = {
  top_cover: 'TwinPower engine cover',
  engine_bay: 'engine bay',
  m_power: 'M Power unit',
  diesel_block: 'diesel engine block',
  turbo_close: 'turbo close-up',
  block_close: 'engine block close-up',
  hood_open: 'hood open engine view',
  bmw_power: 'BMW Power engine',
  pallet_main: 'complete engine unit',
  pallet_alt: 'engine assembly view',
  hoses_detail: 'hoses and components',
  components_detail: 'component close-up',
  warehouse_a: 'inventory photo',
  warehouse_b: 'engine detail shot',
  block_side: 'side view on stand',
  intake_detail: 'intake detail',
  mount_detail: 'mounting detail',
  stand_view: 'engine on stand',
  floor_view: 'complete engine view',
  inner_detail: 'internal components',
  engine_parts: 'engine parts detail',
  workshop: 'workshop inspection'
};

const FALLBACK_IMAGE = ENGINE_VIEWS.diesel_block;

function resolveGalleryKeys(family) {
  return FAMILY_GALLERIES[family] || DEFAULT_GALLERY;
}

function resolveViewUrl(key) {
  return ENGINE_VIEWS[key] || FALLBACK_IMAGE;
}

function getProductImage(id, offset = 0) {
  return ENGINE_PRODUCT_IMAGES[(id + offset) % ENGINE_PRODUCT_IMAGES.length];
}

function getCategoryImage(family) {
  return CATEGORY_IMAGES[family] || resolveViewUrl(resolveGalleryKeys(family)[0]);
}

function extractFamilyFromText(text) {
  const match = (text || '').match(/\b([NSBM]\d{2,3}|M\d{2})\b/i);
  return match ? match[1].toUpperCase() : '';
}

function getEngineGalleryImages(engine) {
  const keys = resolveGalleryKeys(engine.family);
  const count = engine.images?.length || keys.length;
  return Array.from({ length: count }, (_, i) => {
    const key = keys[(i + (engine.id % keys.length)) % keys.length];
    return resolveViewUrl(key);
  });
}

function getEngineThumbnail(engine) {
  return getEngineGalleryImages(engine)[0];
}

function getEngineImageAlt(engine, index = 0) {
  const keys = resolveGalleryKeys(engine.family);
  const key = keys[(index + (engine.id % keys.length)) % keys.length];
  const label = VIEW_LABELS[key] || 'warehouse photo';
  return `BMW ${engine.family} ${engine.fuel} engine — ${label}`;
}

function getBlogImage(post) {
  const family = extractFamilyFromText(post.title);
  if (family && CATEGORY_IMAGES[family]) {
    return CATEGORY_IMAGES[family];
  }
  return getProductImage(post.id, 0);
}

function imgTag(src, alt, extra = '') {
  const safe = src || FALLBACK_IMAGE;
  return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" ${extra}>`;
}
