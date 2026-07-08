// Real BMW engine inventory photos — TwinPower covers, pallet warehouse, workshop close-ups
const ENGINE_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1539285536184-4281d3ba81e0?w=900&q=80',
  'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  'https://images.unsplash.com/photo-1744223736435-be69cb546250?w=900&q=80',
  'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80',
  'https://images.pexels.com/photos/34640514/pexels-photo-34640514.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/4489724/pexels-photo-4489724.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/7568415/pexels-photo-7568415.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1149134/pexels-photo-1149134.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/29181493/pexels-photo-29181493.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3997965/pexels-photo-3997965.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/4489994/pexels-photo-4489994.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=900'
];

const CATEGORY_IMAGES = {
  N47: 'https://images.unsplash.com/photo-1539285536184-4281d3ba81e0?w=900&q=80',
  N57: 'https://images.pexels.com/photos/34640514/pexels-photo-34640514.jpeg?auto=compress&cs=tinysrgb&w=900',
  M57: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=900',
  B57: 'https://images.unsplash.com/photo-1779261332300-c60f2fbe320f?w=900&q=80',
  B47: 'https://images.unsplash.com/photo-1556838656-af51dadc2c93?w=900&q=80',
  M54: 'https://images.pexels.com/photos/4489724/pexels-photo-4489724.jpeg?auto=compress&cs=tinysrgb&w=900',
  M20: 'https://images.pexels.com/photos/7568415/pexels-photo-7568415.jpeg?auto=compress&cs=tinysrgb&w=900',
  M30: 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=900',
  M47: 'https://images.pexels.com/photos/1149134/pexels-photo-1149134.jpeg?auto=compress&cs=tinysrgb&w=900',
  B58: 'https://images.unsplash.com/photo-1744223736435-be69cb546250?w=900&q=80',
  S54: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80'
};

const FALLBACK_IMAGE = ENGINE_PRODUCT_IMAGES[0];

function getProductImage(id, offset = 0) {
  return ENGINE_PRODUCT_IMAGES[(id + offset) % ENGINE_PRODUCT_IMAGES.length];
}

function getCategoryImage(family) {
  return CATEGORY_IMAGES[family] || getProductImage((family || 'X').charCodeAt(0), 0);
}

function extractFamilyFromText(text) {
  const match = (text || '').match(/\b([NSBM]\d{2,3}|M\d{2})\b/i);
  return match ? match[1].toUpperCase() : '';
}

function getEngineThumbnail(engine) {
  return getCategoryImage(engine.family);
}

function getEngineGalleryImages(engine) {
  const count = engine.images?.length || 4;
  const images = [getEngineThumbnail(engine)];
  for (let i = 1; i < count; i++) {
    images.push(getProductImage(engine.id, i));
  }
  return images;
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
