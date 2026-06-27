# VeloCore — Premium Automotive HTML Website

A complete, premium BMW engine eCommerce website built with pure HTML, CSS, and JavaScript.

## Quick Start

Open `website/index.html` in your browser, or serve locally:

```bash
cd website
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Full homepage with all sections |
| Shop | `shop.html` | Product catalog with filters |
| Product | `product.html` | Product detail with specs & gallery |
| Categories | `categories.html` | Engine family categories |
| Cart | `cart.html` | Shopping cart |
| Checkout | `checkout.html` | Guest checkout flow |
| Contact | `contact.html` | Contact form & map |
| About | `about.html` | Company information |
| Blog | `blog.html` | Articles & insights |
| Warranty/Shipping/Returns | Static pages | Policies |
| Privacy/Terms/Cookies | Static pages | Legal |

## Features

- Premium luxury automotive design (dark blue, black, gold)
- Fully responsive (desktop, tablet, mobile)
- Dark mode toggle
- Sticky header with live search
- Engine code, VIN, and product search
- Shopping cart & wishlist (localStorage)
- FAQ accordion
- Animated counters & scroll reveal
- WhatsApp floating button
- Back to top button
- SEO meta tags & Schema.org markup

## Structure

```
website/
├── index.html          # Homepage
├── shop.html           # Product listing
├── product.html        # Product detail
├── contact.html        # Contact page
├── cart.html           # Shopping cart
├── checkout.html       # Checkout
├── about.html          # About us
├── blog.html           # Blog
├── categories.html     # Categories
├── css/style.css       # All styles
└── js/
    ├── main.js         # Interactions & cart
    └── products.js     # Product data
```

## Customization

- **Colors**: Edit CSS variables in `css/style.css` (`:root`)
- **Products**: Edit the `PRODUCTS` array in `js/products.js`
- **Contact info**: Update footer and contact page
- **WhatsApp**: Change number in HTML `wa.me/` links

## License

MIT
