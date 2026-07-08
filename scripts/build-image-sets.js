#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const POOL_PATH = path.join(ROOT, 'data', 'photo-pool.json');
const OUT_MANIFEST = path.join(ROOT, 'data', 'image-sets-manifest.json');
const SETS_DIR = path.join(ROOT, 'images', 'engines', 'sets');
const CACHE_DIR = path.join(ROOT, 'images', 'engines', '_cache');
const TOTAL_SETS = 120;
const IMAGES_PER_SET = 6;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function download(url, dest, retries = 4) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PremiumBMWEngines/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return download(res.headers.location, dest, retries).then(resolve).catch(reject);
      }
      if (res.statusCode === 429 && retries > 0) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return sleep(2000 * (5 - retries)).then(() => download(url, dest, retries - 1)).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

function pickPhotos(pool, setIndex) {
  const pallet = pool.find((p) => p.id === '34640514');
  const photos = [];
  const used = new Set();

  if (pallet) {
    photos.push(pallet);
    used.add(pallet.id);
  }

  let cursor = (setIndex * 2) % pool.length;
  while (photos.length < IMAGES_PER_SET) {
    const photo = pool[cursor % pool.length];
    cursor += 1;
    if (used.has(photo.id)) continue;
    used.add(photo.id);
    photos.push(photo);
  }

  const offset = setIndex % photos.length;
  return [...photos.slice(offset), ...photos.slice(0, offset)];
}

async function ensureCached(photo) {
  const ext = photo.url.includes('.webp') ? 'webp' : 'jpg';
  const cachePath = path.join(CACHE_DIR, `${photo.id}.${ext}`);
  if (!fs.existsSync(cachePath)) {
    process.stdout.write(`Downloading ${photo.id}...\n`);
    await download(photo.url, cachePath);
  }
  return cachePath;
}

async function main() {
  const { photos: pool } = JSON.parse(fs.readFileSync(POOL_PATH, 'utf8'));
  const manifest = { totalSets: TOTAL_SETS, imagesPerSet: IMAGES_PER_SET, sets: {} };

  fs.mkdirSync(SETS_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  for (const photo of pool) {
    await ensureCached(photo);
    await sleep(400);
  }

  for (let s = 1; s <= TOTAL_SETS; s++) {
    const setId = `set-${String(s).padStart(4, '0')}`;
    const setDir = path.join(SETS_DIR, setId);
    fs.mkdirSync(setDir, { recursive: true });

    const chosen = pickPhotos(pool, s - 1);
    const paths = [];

    for (let i = 0; i < chosen.length; i++) {
      const photo = chosen[i];
      const ext = photo.url.includes('.webp') ? 'webp' : 'jpg';
      const filename = `${String(i + 1).padStart(2, '0')}.${ext}`;
      const rel = `images/engines/sets/${setId}/${filename}`;
      const abs = path.join(ROOT, rel);
      const cachePath = path.join(CACHE_DIR, `${photo.id}.${ext}`);
      fs.copyFileSync(cachePath, abs);
      paths.push(rel);
    }

    manifest.sets[setId] = {
      main: paths[0],
      gallery: paths,
      labels: chosen.map((p) => p.label)
    };
  }

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`Built ${TOTAL_SETS} image sets with ${IMAGES_PER_SET} warehouse photos each.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
