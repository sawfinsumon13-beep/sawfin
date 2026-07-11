#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const SOURCE_HTML = path.join(ROOT, 'images/engines/bavarian-source/page_source.html');
const OUT_MANIFEST = path.join(ROOT, 'data/image-sets-manifest.json');
const SETS_DIR = path.join(ROOT, 'images/engines/sets');
const BASE_URL = 'https://bavarianengineexchanges.com/index.html/';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const html = fs.readFileSync(SOURCE_HTML, 'utf8');
  const match = html.match(/JSON\.parse\(atob\("([^"]+)"\)\)/);
  if (!match) throw new Error('Could not find __EMBED__ data');
  const data = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
  const products = data.products || [];
  console.log(`Found ${products.length} Bavarian products`);

  const setMap = new Map();
  for (const p of products) {
    const setMatch = (p.image || '').match(/set-\d+/);
    if (!setMatch) continue;
    const setId = setMatch[0];
    if (!setMap.has(setId)) {
      const gallery = [p.image, ...(p.thumbnails || [])].slice(0, 6);
      setMap.set(setId, { gallery, title: p.title || '' });
    }
  }

  const setIds = [...setMap.keys()].sort((a, b) => {
    const na = parseInt(a.replace('set-', ''), 10);
    const nb = parseInt(b.replace('set-', ''), 10);
    return na - nb;
  });

  console.log(`Unique image sets: ${setIds.length}`);
  fs.mkdirSync(SETS_DIR, { recursive: true });

  const manifest = { totalSets: setIds.length, imagesPerSet: 6, sets: {} };
  let downloaded = 0;

  for (const setId of setIds) {
    const { gallery, title } = setMap.get(setId);
    const setDir = path.join(SETS_DIR, setId);
    fs.mkdirSync(setDir, { recursive: true });
    const localGallery = [];

    for (let i = 0; i < gallery.length; i++) {
      const rel = gallery[i];
      const srcName = rel.split('/').pop();
      const stdName = `${String(i + 1).padStart(2, '0')}.webp`;
      const dest = path.join(setDir, stdName);
      const cacheByOrig = path.join(setDir, srcName);

      if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
        try {
          await download(BASE_URL + rel, cacheByOrig);
          fs.copyFileSync(cacheByOrig, dest);
          downloaded++;
          if (downloaded % 50 === 0) process.stdout.write(`Downloaded ${downloaded} images...\n`);
          await sleep(80);
        } catch (err) {
          console.error(`Skip ${rel}: ${err.message}`);
        }
      }

      if (fs.existsSync(dest)) {
        localGallery.push(`images/engines/sets/${setId}/${stdName}`);
      }
    }

    if (localGallery.length) {
      manifest.sets[setId] = {
        main: localGallery[0],
        gallery: localGallery,
        title
      };
    }
  }

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`Done. ${Object.keys(manifest.sets).length} sets in manifest, ${downloaded} images downloaded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
