# Bavarian Engines

Static HTML website for the Bavarian Engines BMW engine exchange — modeled after [bavarianengine.com](https://bavarianengine.com/).

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, VIN checker, engine families, featured stock, FAQ |
| Shop | `shop.html` | Product catalog with category filters |
| Services | `services.html` | Services overview and process |
| About | `about.html` | Company story and workflow |
| Contact | `contact.html` | Contact form, WhatsApp, address |
| Policies | `policies.html` | Warranty, returns, shipping, privacy |

## Run locally

Open `index.html` in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Customize

- **Brand name:** already set to Bavarian Engines — edit HTML files if needed
- **Contact details:** update WhatsApp number, email, and address in all pages
- **Products:** edit `shop.html` product cards
- **Colors:** edit CSS variables in `css/style.css`

## Structure

```
├── index.html
├── shop.html
├── about.html
├── services.html
├── contact.html
├── policies.html
├── css/style.css
└── js/main.js
```
