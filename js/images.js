// Bavarian-style warehouse engine photos — main shot + multi-angle gallery per family
const ENGINE_VIEWS = {
  top_cover: 'https://images.unsplash.com/photo-1539285536184-4281d3ba81e0?w=900&q=80',
  engine_bay: 'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  m_power: 'https://images.unsplash.com/photo-1744223736435-be69cb546250?w=900&q=80',
  diesel_block: 'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  workshop: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80',
  turbo_close: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
  pallet_main: 'https://images.pexels.com/photos/34640514/pexels-photo-34640514.jpeg?auto=compress&cs=tinysrgb&w=900',
  pallet_alt: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=900',
  hoses_detail: 'https://images.pexels.com/photos/4489724/pexels-photo-4489724.jpeg?auto=compress&cs=tinysrgb&w=900',
  components_detail: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=900',
  warehouse_a: 'https://images.pexels.com/photos/7568415/pexels-photo-7568415.jpeg?auto=compress&cs=tinysrgb&w=900',
  warehouse_b: 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=900',
  block_side: 'https://images.pexels.com/photos/1149134/pexels-photo-1149134.jpeg?auto=compress&cs=tinysrgb&w=900',
  intake_detail: 'https://images.pexels.com/photos/29181493/pexels-photo-29181493.jpeg?auto=compress&cs=tinysrgb&w=900',
  mount_detail: 'https://images.pexels.com/photos/3997965/pexels-photo-3997965.jpeg?auto=compress&cs=tinysrgb&w=900',
  stand_view: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=900',
  floor_view: 'https://images.pexels.com/photos/4489994/pexels-photo-4489994.jpeg?auto=compress&cs=tinysrgb&w=900',
  inner_detail: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=900',
  engine_parts: 'https://images.pexels.com/photos/26083206/pexels-photo-26083206.jpeg?auto=compress&cs=tinysrgb&w=900'
};

const FAMILY_GALLERIES = {
  N47: ['top_cover', 'pallet_alt', 'hoses_detail', 'warehouse_a', 'components_detail', 'workshop'],
  N57: ['pallet_main', 'pallet_alt', 'hoses_detail', 'warehouse_b', 'top_cover', 'workshop'],
  M57: ['pallet_main', 'pallet_alt', 'warehouse_a', 'hoses_detail', 'block_side', 'workshop'],
  B57: ['engine_bay', 'pallet_main', 'hoses_detail', 'diesel_block', 'warehouse_b', 'top_cover'],
  B47: ['diesel_block', 'top_cover', 'pallet_alt', 'hoses_detail', 'warehouse_a', 'components_detail'],
  B58: ['m_power', 'engine_bay', 'turbo_close', 'hoses_detail', 'pallet_alt', 'top_cover'],
  M54: ['hoses_detail', 'warehouse_a', 'pallet_alt', 'components_detail', 'workshop', 'block_side'],
  M20: ['warehouse_a', 'warehouse_b', 'pallet_alt', 'block_side', 'stand_view', 'floor_view'],
  M30: ['warehouse_b', 'warehouse_a', 'block_side', 'pallet_main', 'stand_view', 'floor_view'],
  M47: ['block_side', 'pallet_alt', 'hoses_detail', 'warehouse_a', 'diesel_block'],
  S54: ['turbo_close', 'm_power', 'hoses_detail', 'engine_bay', 'warehouse_a', 'components_detail'],
  N54: ['engine_bay', 'm_power', 'hoses_detail', 'turbo_close', 'warehouse_a', 'components_detail'],
  N55: ['engine_bay', 'm_power', 'hoses_detail', 'top_cover', 'warehouse_a', 'turbo_close'],
  B48: ['engine_bay', 'diesel_block', 'hoses_detail', 'warehouse_a', 'top_cover', 'components_detail'],
  B46: ['engine_bay', 'diesel_block', 'warehouse_a', 'hoses_detail', 'top_cover', 'pallet_alt'],
  N52: ['warehouse_a', 'hoses_detail', 'engine_bay', 'components_detail', 'workshop'],
  N20: ['engine_bay', 'hoses_detail', 'warehouse_a', 'top_cover', 'components_detail'],
  S55: ['m_power', 'turbo_close', 'engine_bay', 'hoses_detail', 'warehouse_a'],
  S58: ['m_power', 'turbo_close', 'engine_bay', 'hoses_detail', 'warehouse_a', 'components_detail']
};

const DEFAULT_GALLERY = ['pallet_main', 'pallet_alt', 'hoses_detail', 'warehouse_a', 'components_detail', 'workshop'];

const ENGINE_PRODUCT_IMAGES = Object.values(ENGINE_VIEWS);

const CATEGORY_IMAGES = {
  N47: ENGINE_VIEWS.top_cover,
  N57: ENGINE_VIEWS.pallet_main,
  M57: ENGINE_VIEWS.pallet_alt,
  B57: ENGINE_VIEWS.engine_bay,
  B47: ENGINE_VIEWS.diesel_block,
  M54: ENGINE_VIEWS.hoses_detail,
  M20: ENGINE_VIEWS.warehouse_a,
  M30: ENGINE_VIEWS.warehouse_b,
  M47: ENGINE_VIEWS.block_side,
  B58: ENGINE_VIEWS.m_power,
  S54: ENGINE_VIEWS.turbo_close
};

const VIEW_LABELS = {
  top_cover: 'engine cover',
  engine_bay: 'engine bay',
  m_power: 'M Power unit',
  diesel_block: 'diesel engine block',
  workshop: 'workshop testing',
  turbo_close: 'turbo close-up',
  pallet_main: 'engine on pallet',
  pallet_alt: 'warehouse pallet view',
  hoses_detail: 'hoses and components',
  components_detail: 'component close-up',
  warehouse_a: 'warehouse inventory',
  warehouse_b: 'warehouse floor shot',
  block_side: 'side view on stand',
  intake_detail: 'intake detail',
  mount_detail: 'mounting detail',
  stand_view: 'engine on stand',
  floor_view: 'floor warehouse view',
  inner_detail: 'internal components',
  engine_parts: 'engine parts detail'
};

const FALLBACK_IMAGE = ENGINE_VIEWS.pallet_main;

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
