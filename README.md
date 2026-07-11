# Premium BMW Engines

Professional website for [premiumbmwengines.com](http://premiumbmwengines.com/) — Europe's leading BMW engine supplier.

## Features

- **3,100+ engine products** with multiple images, specs, and pricing
- **215 technical blog articles** (~2,500 words each)
- **Premium dark theme** design inspired by professional automotive sites
- Full navigation: Home, Engines, M57 Swap Kits, Services, About, Contact, Policies, Blog, Reviews
- Search, filtering, and pagination
- Responsive layout for all devices

## Contact

- Email: originalbavarianengine@gmail.com
- Phone: +49 15510 030835
- Location: Hamburg, Germany

## Local Development

```bash
# Generate engine and blog data
npm run generate

# Serve locally
npm run serve
```

Open http://localhost:3000

## Deployment

Upload all files to your web host's public directory (e.g. `public_html` or `www`). The site is fully static — no server-side runtime required.

To regenerate data after changes:

```bash
node scripts/generate-data.js
```

## Structure

```
├── index.html              # Homepage
├── engines.html            # Engine catalog (3,100+ products)
├── engine-detail.html      # Individual engine page
├── blog.html               # Blog listing (215 articles)
├── blog-post.html          # Individual blog article
├── m57-swap-kits.html      # M57 swap kits
├── services.html           # Services
├── about.html              # About us
├── contact.html            # Contact form
├── policies.html           # Policies
├── reviews.html            # Customer reviews
├── css/styles.css          # Premium design system
├── js/                     # Frontend logic
├── data/engines/           # Engine catalog data (62 chunks)
├── data/blogs/             # Blog post data (215 articles)
└── scripts/generate-data.js
```
