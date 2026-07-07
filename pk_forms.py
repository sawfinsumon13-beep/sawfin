"""Internal application form pages (replacing external omniform redirects)."""

from __future__ import annotations

LOGO_URL = "https://formsv2.soundestlink.com/forms/138/66eec4ca765446aaf16b7d3c"

FORM_CSS = """
.pk-form-page{background:#eef3f8;min-height:70vh;padding:40px 16px 60px}
.pk-form-card{max-width:720px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px 40px;box-shadow:0 8px 32px rgba(52,42,65,.08)}
.pk-form-logo{display:block;margin:0 auto 24px;max-width:220px;height:auto}
.pk-form-card h1{font-size:28px;font-weight:800;color:#342a41;text-align:center;line-height:1.3;margin:0 0 8px}
.pk-form-card h2{font-size:22px;font-weight:700;color:#342a41;text-align:center;margin:0 0 12px}
.pk-form-intro{text-align:center;color:#5d5c78;font-size:16px;line-height:1.6;margin:0 0 28px;padding-bottom:24px;border-bottom:1px dashed #d8dde8}
.pk-form-field{margin-bottom:20px}
.pk-form-field label{display:block;font-size:14px;font-weight:600;color:#342a41;margin-bottom:8px}
.pk-form-field input,.pk-form-field select,.pk-form-field textarea{width:100%;padding:14px 16px;border:1px solid #d8dde8;border-radius:10px;font-size:16px;color:#342a41;background:#fff;box-sizing:border-box}
.pk-form-field input:focus,.pk-form-field select:focus,.pk-form-field textarea:focus{outline:none;border-color:#774C9D;box-shadow:0 0 0 3px rgba(119,76,157,.12)}
.pk-form-field textarea{min-height:100px;resize:vertical}
.pk-form-section{margin:28px 0 8px;font-size:18px;font-weight:700;color:#342a41}
.pk-form-check{display:flex;gap:10px;align-items:flex-start;margin:20px 0;font-size:14px;color:#5d5c78;line-height:1.5}
.pk-form-check input{margin-top:3px;flex-shrink:0}
.pk-form-submit{width:100%;padding:16px 24px;background:#f4ff73;color:#342a41;border:none;border-radius:999px;font-size:18px;font-weight:700;cursor:pointer;margin-top:8px}
.pk-form-submit:hover{filter:brightness(.97)}
.pk-form-submit:disabled{opacity:.7;cursor:wait}
.pk-form-actions{display:flex;flex-direction:column;gap:12px;margin-top:8px}
.pk-form-submit-email{background:#dec0fc;color:#342a41}
.pk-form-submit-whatsapp{background:#25D366;color:#fff}
.pk-reserve-summary{background:#f6f7fe;border-radius:12px;padding:16px 18px;margin-bottom:24px;font-size:15px;line-height:1.65;color:#342a41}
.pk-reserve-summary h3{font-size:16px;font-weight:700;margin:0 0 10px;color:#342a41}
.pk-reserve-summary ul{margin:0;padding-left:18px}
.pk-reserve-summary li{margin-bottom:6px}
.pk-form-success{display:none;text-align:center;padding:20px 0}
.pk-form-success.active{display:block}
.pk-form-success h3{font-size:24px;color:#342a41;margin:0 0 12px}
.pk-form-success p{color:#5d5c78;line-height:1.6;margin:0 0 10px}
@media(max-width:767px){.pk-form-card{padding:28px 20px 32px}.pk-form-card h1{font-size:24px}}
"""


def render_breeder_application_page() -> str:
    return f"""<div class="shopify-section pk-form-page"><style>{FORM_CSS}</style>
<div class="pk-form-card">
<img class="pk-form-logo" src="{LOGO_URL}" alt="Purebred Kitties">
<h1>Join Our Exclusive Network of Top Breeders</h1>
<h2>Grow Your Business with Purebred Kitties!</h2>
<p class="pk-form-intro">List your kittens on a trusted platform, connect with qualified buyers, and let us handle the logistics—so you can focus on what you love.</p>
<form class="pk-breeder-form" id="pk-breeder-form" action="#" method="post">
<div class="pk-form-field"><label for="pk-breeder-qty">How many kittens would you like to list with us now?</label>
<select id="pk-breeder-qty" name="kitten_quantity" required><option value="">- Select Quantity -</option><option>1</option><option>2</option><option>3+</option></select></div>
<div class="pk-form-field"><label for="pk-breeder-breed">Which breed do you specialize in?</label>
<input id="pk-breeder-breed" name="breed" type="text" placeholder="e.g., Maine Coon" required></div>
<div class="pk-form-field"><label for="pk-breeder-price">What is your price policy?</label>
<input id="pk-breeder-price" name="price_policy" type="text" placeholder="Enter Amount in USD $" required></div>
<div class="pk-form-field"><label for="pk-breeder-includes">What does the kitten have at the time of adoption? (vaccines, shots, documents, etc.)</label>
<input id="pk-breeder-includes" name="adoption_includes" type="text" placeholder="e.g., Vaccinated, Microchipped, Health Certificate" required></div>
<div class="pk-form-field"><label for="pk-breeder-exp">How many years of experience do you have?</label>
<select id="pk-breeder-exp" name="experience" required><option value="">- Select Experience -</option><option>Less than a year</option><option>1-2</option><option>2-3</option><option>3+</option></select></div>
<div class="pk-form-field"><label for="pk-breeder-location">Where is your cattery located?</label>
<input id="pk-breeder-location" name="cattery_location" type="text" required></div>
<p class="pk-form-section">Contact Information</p>
<div class="pk-form-field"><label for="pk-breeder-name">Full Name</label>
<input id="pk-breeder-name" name="full_name" type="text" required></div>
<div class="pk-form-field"><label for="pk-breeder-email">Email Address</label>
<input id="pk-breeder-email" name="email" type="email" required></div>
<div class="pk-form-field"><label for="pk-breeder-phone">Phone Number</label>
<input id="pk-breeder-phone" name="phone" type="tel" placeholder="+1" required></div>
<label class="pk-form-check"><input type="checkbox" name="marketing_consent" value="yes" required>
<span>I agree to receive communication related to my breeder application. For more information on how we process your data for marketing communication, check our <a href="#/pages/privacy-policy">Privacy policy</a>.</span></label>
<button class="pk-form-submit" type="submit">Submit 🐾</button>
</form>
<div class="pk-form-success" id="pk-breeder-success">
<h3>Thank you for submitting your application!</h3>
<p>We've received your details and will review them shortly.</p>
<p>Our team will review your details and be in touch within 24–48 hours to discuss next steps.</p>
<p><strong>We look forward to Partnering with You!</strong></p>
<a class="pk-form-submit" href="#/pages/for-breeders" style="display:inline-block;text-decoration:none;margin-top:16px">Back to Breeder Info</a>
</div>
</div></div>"""


BREEDER_OMNIFORM = (
    "https://omniform1.com/forms/v1/landingPage/6377b4a600e4d27e263b56d1/6403a509653128bbaea27a4f"
)
ADOPTION_OMNIFORM = (
    "https://omniform1.com/forms/v1/landingPage/6377b4a600e4d27e263b56d1/65ec902d75b6cc4e1b8f7ee4"
)


def render_reserve_kitten_page() -> str:
    return f"""<div class="shopify-section pk-form-page"><style>{FORM_CSS}</style>
<div class="pk-form-card">
<img class="pk-form-logo" src="{LOGO_URL}" alt="Purebred Kitties">
<h1>Reserve Your Kitten</h1>
<p class="pk-form-intro">Complete this short form so our adoption team can confirm availability and guide you through the next steps.</p>
<div class="pk-reserve-summary" id="pk-reserve-summary"><h3>Your selection</h3><p>Loading reservation details…</p></div>
<form class="pk-reserve-form" id="pk-reserve-form" action="#" method="post">
<div class="pk-form-field"><label for="pk-reserve-name">Full Name</label>
<input id="pk-reserve-name" name="full_name" type="text" autocomplete="name" required></div>
<div class="pk-form-field"><label for="pk-reserve-email">Email Address</label>
<input id="pk-reserve-email" name="email" type="email" autocomplete="email" required></div>
<div class="pk-form-field"><label for="pk-reserve-phone">Phone / WhatsApp Number</label>
<input id="pk-reserve-phone" name="phone" type="tel" autocomplete="tel" placeholder="+1" required></div>
<div class="pk-form-field"><label for="pk-reserve-city">City &amp; State</label>
<input id="pk-reserve-city" name="city_state" type="text" required></div>
<div class="pk-form-field"><label for="pk-reserve-home">Tell us about your home &amp; family</label>
<textarea id="pk-reserve-home" name="home_info" placeholder="Who lives at home, other pets, experience with cats, etc." required></textarea></div>
<div class="pk-form-field"><label for="pk-reserve-notes">Additional notes (optional)</label>
<textarea id="pk-reserve-notes" name="notes" placeholder="Preferred delivery timing, questions, etc."></textarea></div>
<label class="pk-form-check"><input type="checkbox" name="consent" value="yes" required>
<span>I agree to be contacted about this kitten reservation. See our <a href="#/pages/privacy-policy">Privacy Policy</a>.</span></label>
<div class="pk-form-actions">
<button class="pk-form-submit pk-form-submit-email" type="button" data-pk-submit="email">Submit via Email</button>
<button class="pk-form-submit pk-form-submit-whatsapp" type="button" data-pk-submit="whatsapp">Submit via WhatsApp</button>
</div>
</form>
<div class="pk-form-success" id="pk-reserve-success">
<h3>Thank you!</h3>
<p>Your reservation request has been prepared. If your email app or WhatsApp did not open automatically, please contact us directly.</p>
<p><strong>Phone / WhatsApp:</strong> +1 3475417149<br><strong>Email:</strong> kittenspurebreed@gmail.com</p>
<a class="pk-form-submit" href="#/collections/kittens-for-sale" style="display:inline-block;text-decoration:none;margin-top:16px">Browse More Kittens</a>
</div>
</div></div>"""


def build_form_pages() -> dict[str, dict[str, str]]:
    return {
        "pages/breeder-application": {
            "title": "Breeder Application | Purebred Kitties",
            "html": render_breeder_application_page(),
        },
        "pages/reserve-kitten": {
            "title": "Reserve Your Kitten | Purebred Kitties",
            "html": render_reserve_kitten_page(),
        },
    }


def replace_omniform_links(html: str) -> str:
    import re

    route = "#/pages/breeder-application"
    html = html.replace(BREEDER_OMNIFORM, route)
    html = re.sub(
        rf'href="{re.escape(route)}"\s*target="_blank"',
        f'href="{route}"',
        html,
        flags=re.I,
    )
    html = re.sub(
        rf"href='{re.escape(BREEDER_OMNIFORM)}'\s*target='_blank'",
        f"href='{route}'",
        html,
        flags=re.I,
    )
    return html
