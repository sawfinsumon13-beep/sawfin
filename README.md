# Bavarian Engines

Static HTML website for **Bavarian Engines** — modeled after [bavarianengine.com](https://bavarianengine.com/). Ready for **Hostinger** upload.

## Contact

| | |
|---|---|
| **Business** | Bavarian Engines |
| **Phone / WhatsApp** | +447944470816 |
| **Email** | flashkingpro202@gmail.com |
| **Address** | Tilsiter Str. 90, 22047 Hamburg, Germany |

## All pages

| Page | File |
|------|------|
| Home | `index.html` |
| All Engines (Shop) | `shop.html` |
| N47 Engines | `n47-engines.html` |
| N57 Engines | `n57-engines.html` |
| B47 Engines | `b47-engines.html` |
| B57 Engines | `b57-engines.html` |
| B58 Engines | `b58-engines.html` |
| M57 Engines | `m57-engines.html` |
| M57 Swap Kits | `m57-swap-kits.html` |
| Services | `services.html` |
| About Us | `about.html` |
| Contact Us | `contact.html` |
| Policies | `policies.html` |
| Blog | `blog.html` |
| Reviews | `reviews.html` |

### Blog (61 articles, 2200+ words each)

- Listing loads from `js/blog-index.json` with pagination (12 per page)
- Individual articles: `blog-{slug}.html` (e.g. `blog-n47-vs-n57.html`)
- Regenerate: `python3 scripts/generate-blog.py`

## Preview locally

```bash
python3 -m http.server 8080
```

| Page | URL |
|------|-----|
| Home | http://127.0.0.1:8080/index.html |
| Shop | http://127.0.0.1:8080/shop.html |
| M57 Swap Kits | http://127.0.0.1:8080/m57-swap-kits.html |
| Blog | http://127.0.0.1:8080/blog.html |
| Reviews | http://127.0.0.1:8080/reviews.html |

## Catalog (2,000 engines + real photos)

- **2,000 products** in `js/products.json`
- **616 real BMW engine photos** in `images/engines/` (~80 MB) — engines on pallets, workshop style
- Each product: **1 main image + 5 thumbnails** (6 real photos per listing)
- **124 unique donor engine photo sets** used across the catalog

```bash
python3 scripts/download-engine-images.py   # download real photos
python3 scripts/generate-products.py        # build 2000-product catalog
```

## Deploy to Hostinger

1. Log in to **hPanel** → **File Manager** → `public_html`
2. Upload **all files** including the `images/engines/` folder (~80 MB)
3. Keep folder structure: `css/`, `js/`, `images/engines/`
4. Visit your domain

## Menu (matches reference site)

Home · Engines (dropdown) · M57 Swap Kits · Services · About Us · Contact Us · Policies · Blog · Reviews
