# Apex Bioreagents — peptide supplier website

Static HTML storefront modeled on [rPeptide](https://www.rpeptide.com/) navigation and product families.

## Catalog

- **367 products** imported into `data/catalog.json` (names, SKUs, prices, size options, categories, descriptions)
- **7 top-level families**: Antibodies, Peptides, Proteins, Neurodegenerative Related Compounds, Coronavirus Research Tools, Kits, Preformed Fibrils
- Nested subcategories (e.g. Beta-Amyloid Native, Labeled, Mutant, Synuclein Wild Type, Tau Fragments, COVID compounds)

Refresh catalog from the public WooCommerce API:

```bash
python3 scripts/build_catalog.py
python3 -c "import json; ..."  # see script for full category-tree fix, or run build + tree fix in CI
```

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home + category tiles + featured fibrils |
| `products.html` | Full shop, sidebar, search, pagination |
| `product.html?slug=…` | Product detail, size selector, add to cart |
| `cart.html` | Cart (localStorage) |
| `services.html`, `about.html`, `contact.html` | Company |
| `resources-*.html` | Resources menu stubs |

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` (required so `fetch('data/catalog.json')` works).

## Customize branding

Edit `js/components.js` (site name) and contact details in footer/contact page.
