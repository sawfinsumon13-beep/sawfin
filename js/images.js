// Bavarian Engines warehouse inventory photos — local pallet photos, one 6-image gallery per product
const IMAGE_MANIFEST = {
  fallback: 'images/engines/sets/set-0114/01.webp',
  categories: {
    N47: 'images/engines/sets/set-0114/01.webp',
    N57: 'images/engines/sets/set-0108/01.webp',
    M57: 'images/engines/sets/set-0087/01.webp',
    B57: 'images/engines/sets/set-0052/01.webp',
    B47: 'images/engines/sets/set-0061/01.webp',
    M54: 'images/engines/sets/set-0047/01.webp',
    M20: 'images/engines/sets/set-0050/01.webp',
    M30: 'images/engines/sets/set-0051/01.webp',
    M47: 'images/engines/sets/set-0038/01.webp',
    B58: 'images/engines/sets/set-0001/01.webp',
    S54: 'images/engines/sets/set-0046/01.webp'
  }
};

const CATEGORY_IMAGES = IMAGE_MANIFEST.categories;
const FALLBACK_IMAGE = IMAGE_MANIFEST.fallback;

const SHOWCASE_IMAGES = {
  top_cover: 'images/engines/sets/set-0114/01.webp',
  pallet_main: 'images/engines/sets/set-0108/02.webp',
  hoses_detail: 'images/engines/sets/set-0087/03.webp'
};

const GALLERY_LABELS = [
  'engine on pallet — main warehouse view',
  'side angle — hoses and components',
  'rear angle — turbo and ancillaries',
  'close-up — engine stamp area',
  'detail — wiring and sensors',
  'floor shot — complete unit on pallet'
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
  if (post.image) {
    return post.image;
  }
  const setNum = String(((post.id - 1) % 116) + 1).padStart(4, '0');
  return `images/engines/sets/set-${setNum}/01.webp`;
}

function imgTag(src, alt, extra = '') {
  const safe = src || FALLBACK_IMAGE;
  return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" ${extra}>`;
}
