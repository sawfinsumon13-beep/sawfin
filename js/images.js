// Bavarian-style warehouse inventory photos — local sets, one gallery per product
const IMAGE_MANIFEST = {
  fallback: 'images/engines/sets/set-0001/01.jpg',
  categories: {
    N47: 'images/engines/sets/set-0014/01.jpg',
    N57: 'images/engines/sets/set-0108/01.jpg',
    M57: 'images/engines/sets/set-0087/01.jpg',
    B57: 'images/engines/sets/set-0052/01.jpg',
    B47: 'images/engines/sets/set-0061/01.jpg',
    M54: 'images/engines/sets/set-0047/01.jpg',
    M20: 'images/engines/sets/set-0050/01.jpg',
    M30: 'images/engines/sets/set-0051/01.jpg',
    M47: 'images/engines/sets/set-0038/01.jpg',
    B58: 'images/engines/sets/set-0060/01.jpg',
    S54: 'images/engines/sets/set-0046/01.jpg'
  }
};

const CATEGORY_IMAGES = IMAGE_MANIFEST.categories;
const FALLBACK_IMAGE = IMAGE_MANIFEST.fallback;

const GALLERY_LABELS = [
  'engine on pallet — main view',
  'warehouse angle — hoses and components',
  'workshop side view',
  'engine block close-up',
  'turbo and ancillaries detail',
  'inventory floor shot'
];

function getCategoryImage(family) {
  return CATEGORY_IMAGES[family] || FALLBACK_IMAGE;
}

function extractFamilyFromText(text) {
  const match = (text || '').match(/\b([NSBM]\d{2,3}|M\d{2})\b/i);
  return match ? match[1].toUpperCase() : '';
}

function getEngineGalleryImages(engine) {
  if (engine.images && engine.images.length) {
    return engine.images;
  }
  return [FALLBACK_IMAGE];
}

function getEngineThumbnail(engine) {
  return getEngineGalleryImages(engine)[0];
}

function getEngineImageAlt(engine, index = 0) {
  const label = GALLERY_LABELS[index % GALLERY_LABELS.length];
  return `BMW ${engine.family} ${engine.fuel} engine — ${label}`;
}

function getBlogImage(post) {
  const family = extractFamilyFromText(post.title);
  if (family && CATEGORY_IMAGES[family]) {
    return CATEGORY_IMAGES[family];
  }
  if (post.images && post.images[0]) {
    return post.images[0];
  }
  const setNum = String(((post.id - 1) % 120) + 1).padStart(4, '0');
  return `images/engines/sets/set-${setNum}/01.jpg`;
}

function imgTag(src, alt, extra = '') {
  const safe = src || FALLBACK_IMAGE;
  return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" ${extra}>`;
}
