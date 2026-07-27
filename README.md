# Apex Bioreagents — static website

Professional multi-page HTML site for a peptide and protein research supplier (inspired by industry catalog layouts such as [rPeptide](https://www.rpeptide.com/)).

## Pages

- `index.html` — Home, hero, categories, featured fibrils
- `products.html` — Catalog with category filters
- `services.html` — Custom synthesis and contract services
- `about.html` — Company and quality
- `contact.html` — Inquiry form (client-side demo submit)

## Run locally

```bash
cd /workspace
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Customize

Replace **Apex Bioreagents** branding, contact details, and product copy in the HTML files. Add real product images by swapping the SVG placeholders in `products.html` and hero backgrounds in `css/styles.css`.
