#!/usr/bin/env python3
"""Build one self-contained HTML file with all products and key pages (SPA)."""

import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

CLONE = Path("/workspace/purebred-kitties-clone")
OUT = Path("/workspace/SINGLE-SITE.html")
ZIP_OUT = Path("/workspace/PUREBRED-KITTIES-SINGLE-SITE.html")

CONTACT_PHONE = "+1 3475417149"
CONTACT_PHONE_E164 = "13475417149"
CONTACT_EMAIL = "kittenspurebreed@gmail.com"
SIGNAL_URL = "https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL"
CDN = "https://purebredkitties.com"

TITLE_RE = re.compile(r"<title>([^<|]+)", re.I)
DESC_RE = re.compile(r'property="og:description" content="([^"]+)"', re.I)
IMG_RE = re.compile(r'property="og:image" content="([^"]+)"', re.I)
PRICE_RE = re.compile(r'data-price-formatted="([^"]+)"', re.I)
H1_RE = re.compile(r"<h1[^>]*>([^<]+)", re.I)


def extract_product(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8", errors="ignore")[:25000]
    handle = path.stem
    title_m = TITLE_RE.search(text) or H1_RE.search(text)
    title = title_m.group(1).strip() if title_m else handle.replace("-", " ").title()
    desc_m = DESC_RE.search(text)
    desc = desc_m.group(1).strip() if desc_m else ""
    img_m = IMG_RE.search(text)
    image = img_m.group(1).strip() if img_m else ""
    if image and "_800x" not in image:
        image = re.sub(r"(_\d+x)?\.(jpg|jpeg|png|webp)", r"_800x.\2", image, count=1, flags=re.I)
    price_m = PRICE_RE.search(text)
    price = price_m.group(1).strip() if price_m else ""
    return {
        "handle": handle,
        "title": title,
        "description": desc[:500],
        "image": image,
        "price": price,
    }


def build_catalog() -> list[dict]:
    files = sorted((CLONE / "products").glob("*.html"))
    catalog = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(extract_product, f): f for f in files}
        for fut in as_completed(futures):
            item = fut.result()
            if item:
                catalog.append(item)
    catalog.sort(key=lambda x: x["handle"])
    return catalog


def extract_page(path: Path, folder: str) -> dict | None:
    html = path.read_text(encoding="utf-8", errors="ignore")
    title_m = TITLE_RE.search(html)
    title = title_m.group(1).strip().split("|")[0].strip() if title_m else path.stem.replace("-", " ").title()
    main_m = re.search(r"<main[^>]*>(.*)</main>", html, re.I | re.DOTALL)
    if not main_m:
        return None
    body = strip_internal_links(main_m.group(1))
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.I | re.DOTALL)
    return {"key": f"{folder}/{path.stem}", "title": title, "html": body}


def build_pages() -> dict[str, dict]:
    pages: dict[str, dict] = {}
    for folder in ("pages", "blogs"):
        for path in sorted((CLONE / folder).glob("*.html")):
            item = extract_page(path, folder)
            if item:
                pages[item["key"]] = {"title": item["title"], "html": item["html"]}
    for name in ("cart", "search"):
        path = CLONE / f"{name}.html"
        if path.exists():
            item = extract_page(path, "root")
            if item:
                pages[name] = {"title": item["title"], "html": item["html"]}
    return pages


def strip_internal_links(html: str) -> str:
    html = re.sub(r'href="/index\.html/', 'href="#/', html)
    html = re.sub(r'href="/products/([^"]+?)\.html"', r'href="#/products/\1"', html)
    html = re.sub(r'href="/pages/([^"]+?)\.html"', r'href="#/pages/\1"', html)
    html = re.sub(r'href="/blogs/([^"]+?)\.html"', r'href="#/blogs/\1"', html)
    html = re.sub(r'href="/collections/([^"]+?)/?"', r'href="#/collections/\1"', html)
    html = re.sub(r'href="/cart\.html"', 'href="#/cart"', html)
    html = re.sub(r'href="/search\.html"', 'href="#/search"', html)
    html = re.sub(r'href="/"', 'href="#/"', html)
    html = re.sub(r'href="#/([^"]+?)\.html"', r'href="#/\1"', html)
    return html


def get_home_shell() -> str:
    index = (CLONE / "index.html").read_text(encoding="utf-8", errors="ignore")
    # Remove injected broken onclick repairs already done
    start = index.find("<body")
    end = index.rfind("</body>")
    if start == -1 or end == -1:
        raise SystemExit("Could not parse index.html body")
    head = index[:start]
    body = index[start:end + 7]
    # Wrap main content for SPA views
    body = body.replace("<body", '<body class="pk-spa"', 1)
    # Wrap homepage content for SPA show/hide
    body = re.sub(
        r"(<body[^>]*>)",
        r'\1<div id="pk-view-home">',
        body,
        count=1,
    )
    return head, body


SPA_CSS = """
<style id="pk-spa-styles">
#pk-view-product,#pk-view-contact,#pk-view-cart,#pk-view-search,#pk-view-collection,#pk-view-page{display:none!important}
.pk-spa-route-product #pk-view-product,
.pk-spa-route-contact #pk-view-contact,
.pk-spa-route-cart #pk-view-cart,
.pk-spa-route-search #pk-view-search,
.pk-spa-route-collection #pk-view-collection,
.pk-spa-route-page #pk-view-page{display:block!important}
.pk-spa-route-product #pk-view-home,
.pk-spa-route-contact #pk-view-home,
.pk-spa-route-cart #pk-view-home,
.pk-spa-route-search #pk-view-home,
.pk-spa-route-collection #pk-view-home,
.pk-spa-route-page #pk-view-home{display:none!important}
#pk-view-product,#pk-view-page{padding:40px 20px;max-width:1200px;margin:0 auto}
#pk-page-root img{max-width:100%;height:auto}
.pk-product-detail{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
@media(max-width:768px){.pk-product-detail{grid-template-columns:1fr}}
.pk-product-detail img{width:100%;border-radius:12px}
.pk-product-detail h1{font-size:2rem;margin:0 0 12px;color:#342A41}
.pk-product-price{font-size:1.5rem;color:#774C9D;font-weight:700;margin:12px 0}
.pk-product-desc{color:#555;line-height:1.6;margin:16px 0}
.pk-btn-order{display:inline-block;background:#B8E847;color:#342A41;padding:14px 28px;border-radius:50px;font-weight:700;text-decoration:none;border:none;cursor:pointer;font-size:1rem;margin:8px 8px 8px 0}
.pk-btn-order:hover{opacity:.9}
.pk-btn-back{color:#774C9D;margin-bottom:20px;display:inline-block;cursor:pointer}
#pk-view-collection,#pk-view-search{padding:40px 20px;max-width:1400px;margin:0 auto}
.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.pk-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);text-decoration:none;color:inherit;display:block}
.pk-card img{width:100%;aspect-ratio:1;object-fit:cover}
.pk-card-body{padding:16px}
.pk-card h3{margin:0 0 4px;font-size:1.1rem}
.pk-card .price{color:#774C9D;font-weight:600}
#pk-search-input,#pk-search-input-2{width:100%;max-width:480px;padding:12px 16px;border:2px solid #ddd;border-radius:8px;font-size:1rem;margin-bottom:24px}
#pk-view-contact{padding:40px 20px;max-width:900px;margin:0 auto}
.pk-contact-box{background:#f9f7fc;border-radius:12px;padding:32px;line-height:2}
.pk-contact-box a{color:#774C9D;font-weight:600}
</style>
"""

SPA_VIEWS = """
<div id="pk-view-product"><a class="pk-btn-back" href="#/">← Back</a><div id="pk-product-root"></div></div>
<div id="pk-view-page"><a class="pk-btn-back" href="#/">← Back</a><div id="pk-page-root"></div></div>
<div id="pk-view-collection"><a class="pk-btn-back" href="#/">← Back</a><h2 id="pk-collection-title">Available Kittens</h2><input id="pk-search-input" type="search" placeholder="Search by name or breed..."><div id="pk-grid" class="pk-grid"></div></div>
<div id="pk-view-search"><a class="pk-btn-back" href="#/">← Back</a><h2>Search</h2><input id="pk-search-input-2" type="search" placeholder="Search kittens..."><div id="pk-grid-2" class="pk-grid"></div></div>
<div id="pk-view-contact"><a class="pk-btn-back" href="#/">← Back</a><h2>Contact Us</h2><div class="pk-contact-box">
<p><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/{phone_e164}">{phone}</a></p>
<p><strong>Signal:</strong> <a href="{signal}" target="_blank" rel="noopener">Message on Signal</a></p>
<p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
<p>Have questions about adopting? Message us on WhatsApp or Signal and we'll help you find your perfect kitten.</p>
</div></div>
<div id="pk-view-cart"><a class="pk-btn-back" href="#/">← Back</a><h2>Your Cart</h2><div id="pk-cart-root"><p>Your cart is empty. <a href="#/collections/kittens-for-sale">Browse kittens</a></p></div>
<button class="pk-btn-order" id="pk-checkout-btn">Checkout via WhatsApp</button></div>
"""

SPA_JS = r"""
(function(){
  var WHATSAPP='13475417149', EMAIL='kittenspurebreed@gmail.com', SIGNAL='https://signal.me/#eu/MEs5W26kT7oIxnW-QEh7_yPa1HN1JkuLRxwWgzK3dMAuS9CzNgVJfpicAJqaaERL';
  var CART_KEY='pk_static_cart_v1';
  var catalogEl=document.getElementById('pk-catalog-data');
  var pagesEl=document.getElementById('pk-pages-data');
  var CATALOG=catalogEl?JSON.parse(catalogEl.textContent):[];
  var PAGES=pagesEl?JSON.parse(pagesEl.textContent):{};
  var byHandle={}; CATALOG.forEach(function(p){byHandle[p.handle]=p;});
  var collectionList=null;

  function parseParts(){
    var h=(location.hash||'#/').replace(/^#/,'').replace(/^\//,'');
    return h.split('/').filter(Boolean).map(function(p){return p.replace(/\.html$/,'');});
  }

  function setRoute(cls){ document.body.className='pk-spa pk-spa-route-'+cls; }

  function route(){
    var parts=parseParts();
    collectionList=null;
    if(parts[0]==='products'&&parts[1]){ setRoute('product'); showProduct(parts[1]); }
    else if(parts[0]==='pages'&&parts[1]){ setRoute('page'); showPage('pages/'+parts[1]); }
    else if(parts[0]==='blogs'&&parts[1]){ setRoute('page'); showPage('blogs/'+parts[1]); }
    else if(parts[0]==='collections'&&parts[1]){ setRoute('collection'); showCollection(parts[1]); }
    else if(parts[0]==='search'){ setRoute('search'); showGrid(document.getElementById('pk-grid-2'),decodeURIComponent((location.search.match(/q=([^&]+)/)||[])[1]||'')); }
    else if(parts[0]==='contact'){ setRoute('page'); showPage('pages/contact'); }
    else if(parts[0]==='cart'){
      if(PAGES.cart){ setRoute('page'); showPage('cart'); }
      else { setRoute('cart'); renderCart(); }
    }
    else { document.body.className='pk-spa'; }
    window.scrollTo(0,0);
  }

  function showPage(key){
    var root=document.getElementById('pk-page-root');
    var page=PAGES[key];
    if(!page){ root.innerHTML='<p>Page not found.</p>'; return; }
    if(page.title) document.title=page.title;
    root.innerHTML=page.html;
  }

  function showProduct(handle){
    handle=handle.replace(/\.html$/,'');
    var p=byHandle[handle]; var root=document.getElementById('pk-product-root');
    if(!p){ root.innerHTML='<p>Product not found.</p>'; return; }
    if(p.title) document.title=p.title;
    root.innerHTML='<div class="pk-product-detail"><div><img src="'+esc(p.image)+'" alt="'+esc(p.title)+'"></div><div><h1>'+esc(p.title)+'</h1>'+
      (p.price?'<div class="pk-product-price">'+esc(p.price)+'</div>':'')+
      '<p class="pk-product-desc">'+esc(p.description)+'</p>'+
      '<button class="pk-btn-order" id="pk-order-btn">Reserve / Order via WhatsApp</button></div></div>';
    document.getElementById('pk-order-btn').onclick=function(){
      var msg='Hello! I would like to reserve/order:\n\nKitten: '+p.title+'\nPrice: '+(p.price||'N/A')+'\n\nPhone/WhatsApp: +1 3475417149\nSignal: '+SIGNAL+'\nEmail: '+EMAIL;
      window.open('https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+encodeURIComponent(msg),'_blank');
    };
  }

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  function collectionKeyword(slug){
    slug=(slug||'').replace(/-page-\d+$/,'');
    if(!slug || /^(kittens-for-sale|all-kittens-for-sale|kittens-in-the-united-states)$/.test(slug)) return '';
    return slug.replace(/-(kittens?|cats?)-for-sale.*$/,'').replace(/-for-sale.*$/,'').replace(/-/g,' ');
  }

  function showCollection(slug){
    var kw=collectionKeyword(slug);
    var titleEl=document.getElementById('pk-collection-title');
    if(titleEl) titleEl.textContent=kw?kw.replace(/\b\w/g,function(c){return c.toUpperCase();})+' Kittens':'Available Kittens';
    collectionList=CATALOG.filter(function(p){
      if(!kw) return true;
      var hay=(p.title+' '+p.handle).toLowerCase();
      return hay.indexOf(kw)!==-1 || hay.indexOf(kw.replace(/ /g,'-'))!==-1;
    });
    showGrid(document.getElementById('pk-grid'), document.getElementById('pk-search-input')?document.getElementById('pk-search-input').value:'', collectionList);
  }

  function showGrid(container, q, source){
    if(!container) return;
    q=(q||'').toLowerCase();
    var base=source||collectionList||CATALOG;
    var list=base.filter(function(p){
      if(!q) return true;
      return (p.title+' '+p.handle).toLowerCase().indexOf(q)!==-1;
    }).slice(0,120);
    container.innerHTML=list.map(function(p){
      return '<a class="pk-card" href="#/products/'+p.handle+'"><img src="'+esc(p.image)+'" alt="" loading="lazy"><div class="pk-card-body"><h3>'+esc(p.title)+'</h3>'+(p.price?'<div class="price">'+esc(p.price)+'</div>':'')+'</div></a>';
    }).join('');
  }

  function renderCart(){
    var cart=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
    var root=document.getElementById('pk-cart-root');
    if(!cart.items.length){ root.innerHTML='<p>Your cart is empty. <a href="#/collections/kittens-for-sale">Browse kittens</a></p>'; return; }
    root.innerHTML='<ul>'+cart.items.map(function(i){return '<li>'+esc(i.title)+'</li>';}).join('')+'</ul>';
  }

  var checkoutBtn=document.getElementById('pk-checkout-btn');
  if(checkoutBtn) checkoutBtn.onclick=function(){
    var cart=JSON.parse(localStorage.getItem(CART_KEY)||'{"items":[]}');
    var msg=cart.items.length?'Hello! I would like to complete my order:\n\n'+cart.items.map(function(i,n){return (n+1)+'. '+i.title;}).join('\n'):'Hello! I would like to inquire about adopting a kitten.';
    msg+='\n\nPhone/WhatsApp: +1 3475417149\nSignal: '+SIGNAL+'\nEmail: '+EMAIL;
    window.open('https://api.whatsapp.com/send?phone='+WHATSAPP+'&text='+encodeURIComponent(msg),'_blank');
  };

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#/"]');
    if(a){ e.preventDefault(); location.hash=a.getAttribute('href').slice(1); }
  });

  ['pk-search-input','pk-search-input-2'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.addEventListener('input',function(){
      var grid=id==='pk-search-input'?document.getElementById('pk-grid'):document.getElementById('pk-grid-2');
      showGrid(grid, el.value, id==='pk-search-input'?collectionList:null);
    });
  });

  window.addEventListener('hashchange', route);
  route();
})();
"""


def build_single_html():
    print("Building product catalog...")
    catalog = build_catalog()
    print(f"Catalog: {len(catalog)} products")

    print("Building static pages...")
    pages = build_pages()
    print(f"Pages: {len(pages)} (info pages, blogs, cart, search)")

    head, body = get_home_shell()
    head = head.replace("</head>", SPA_CSS + "</head>", 1)

    # Close home view, then insert SPA views before closing body
    body = body.replace("</body>", "</div>" + SPA_VIEWS + "</body>", 1)

    # Fix links in body for hash routing
    body = strip_internal_links(body)

    catalog_json = json.dumps(catalog, separators=(",", ":"))
    pages_json = json.dumps(pages, separators=(",", ":"))
    catalog_script = f'<script type="application/json" id="pk-catalog-data">{catalog_json}</script>\n'
    pages_script = f'<script type="application/json" id="pk-pages-data">{pages_json}</script>\n'
    spa_script = f"<script>{SPA_JS}</script>\n"

    # Inject cart script from static-cart.js (minimal)
    cart_src = Path("/workspace/static-cart.js").read_text(encoding="utf-8")

    contact_views = SPA_VIEWS.format(
        phone=CONTACT_PHONE,
        phone_e164=CONTACT_PHONE_E164,
        signal=SIGNAL_URL,
        email=CONTACT_EMAIL,
    )
    body = body.replace(SPA_VIEWS, contact_views, 1)

    html = head + body
    html = html.replace(
        "</body>",
        catalog_script + pages_script + f"<script>{cart_src}</script>\n" + spa_script + "</body>",
        1,
    )

    OUT.write_text(html, encoding="utf-8")
    ZIP_OUT.write_text(html, encoding="utf-8")
    mb = OUT.stat().st_size / (1024 * 1024)
    print(f"Written {OUT} ({mb:.1f} MB, {len(catalog)} products, {len(pages)} pages embedded)")
    return OUT


if __name__ == "__main__":
    build_single_html()
