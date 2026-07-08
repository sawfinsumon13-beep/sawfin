// Verified image URLs — all tested HTTP 200
const OLD_ENGINE_IMAGES = [
  'https://images.unsplash.com/photo-1688701108480-0db760644684?w=800&q=80',
  'https://images.unsplash.com/photo-1763836223247-e44e2753883e?w=800&q=80',
  'https://images.unsplash.com/photo-1760713174351-4e7350ff797e?w=800&q=80',
  'https://images.unsplash.com/photo-1753183514957-0e50d201a6fa?w=800&q=80',
  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80'
];

const ALL_ENGINE_IMAGES = [
  ...OLD_ENGINE_IMAGES,
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80';

function getProductImage(id, offset = 0, era = 'modern') {
  const pool = era === 'classic' ? OLD_ENGINE_IMAGES : ALL_ENGINE_IMAGES;
  return pool[(id + offset) % pool.length];
}

function imgTag(src, alt, extra = '') {
  const safe = src || FALLBACK_IMAGE;
  return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" ${extra}>`;
}
