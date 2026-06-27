# Bavarian Engines

Static HTML website for **Bavarian Engines** — modeled after [bavarianengine.com](https://bavarianengine.com/).

## Contact

| | |
|---|---|
| **Business** | Bavarian Engines |
| **Phone / WhatsApp** | +880 1757 453611 |
| **Email** | sawfin@gmail.com |
| **Address** | Tilsiter Str. 90, 22047 Hamburg, Germany |

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Shop | `shop.html` |
| Services | `services.html` |
| About | `about.html` |
| Reviews | `reviews.html` |
| Contact | `contact.html` |
| Policies | `policies.html` |

## Preview locally

```bash
python3 -m http.server 8080
```

| Page | URL |
|------|-----|
| Home | http://127.0.0.1:8080/index.html |
| Shop | http://127.0.0.1:8080/shop.html |
| Reviews | http://127.0.0.1:8080/reviews.html |
| Contact | http://127.0.0.1:8080/contact.html |

## Deploy to Hostinger

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Open **File Manager** → `public_html`
3. Upload all files keeping this structure:

```
public_html/
├── index.html
├── shop.html
├── about.html
├── services.html
├── reviews.html
├── contact.html
├── policies.html
├── css/style.css
└── js/main.js
```

4. Or upload a **ZIP** of the project and extract inside `public_html`
5. Visit your domain — `index.html` loads automatically

### Optional: custom domain

In hPanel → **Domains** → point your domain to the hosting account. DNS may take up to 24 hours.

## Customize

- **Products:** edit cards in `shop.html`
- **Reviews:** edit `reviews.html`
- **Colors:** CSS variables in `css/style.css`
