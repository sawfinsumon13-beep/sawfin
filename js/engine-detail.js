document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  if (!id) {
    window.location.href = pageUrl('/engines');
    return;
  }

  const container = document.getElementById('engineDetail');
  container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading engine details...</div>';

  try {
    const chunkNum = String(Math.ceil(id / 50)).padStart(3, '0');
    const dataUrl = new URL(`data/engines/chunk-${chunkNum}.json`, window.location.href).href;
    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error(`Could not load engine data (${res.status})`);
    const engines = await res.json();
    const engine = engines.find(e => e.id === id);

    if (!engine) {
      container.innerHTML = '<p class="loading">Engine not found. <a href="' + pageUrl('/engines') + '">Browse all engines</a></p>';
      return;
    }

    const title = formatEngineTitle(engine);
    const platforms = getEnginePlatformInfo(engine);
    const emailBuyHref = buildEnginePurchaseEmail(engine);
    const whatsappBuyHref = buildEnginePurchaseWhatsApp(engine);

    document.title = `${title} | bmwusedengines`;
    document.getElementById('breadcrumbName').textContent = `${engine.family} — ID ${engine.id}`;

    const galleryImages = getEngineGalleryImages(engine);

    container.innerHTML = `
      <div class="detail-layout">
        <div class="gallery">
          <div class="gallery-main">
            <img id="mainImage" src="${galleryImages[0]}" alt="${getEngineImageAlt(engine, 0)}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
          </div>
          <div class="gallery-thumbs">
            ${galleryImages.map((img, i) => `
              <img src="${img}" alt="${getEngineImageAlt(engine, i)}"
                   class="${i === 0 ? 'active' : ''}"
                   onclick="document.getElementById('mainImage').src='${img}';document.querySelectorAll('.gallery-thumbs img').forEach(el=>el.classList.remove('active'));this.classList.add('active')"
                   onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">
            `).join('')}
          </div>
        </div>
        <div class="detail-info">
          <h1>${title}</h1>
          <div class="detail-code">Engine Code: ${engine.code} · ${engine.family} Family · Listing #${engine.id}</div>
          <div class="detail-price">${formatPrice(engine.price)}</div>
          <table class="specs-table">
            <tr><td>Displacement</td><td>${engine.displacement}L</td></tr>
            <tr><td>Power Output</td><td>${engine.power} hp</td></tr>
            <tr><td>Fuel Type</td><td>${engine.fuel.charAt(0).toUpperCase() + engine.fuel.slice(1)}</td></tr>
            <tr><td>Production Years</td><td>${engine.yearStart} – ${engine.yearEnd}</td></tr>
            <tr><td>Mileage</td><td>${engine.mileage.toLocaleString()} km</td></tr>
            <tr><td>Condition</td><td>${engine.condition}</td></tr>
            <tr><td>Primary Platform</td><td>${platforms.primary}</td></tr>
            <tr><td>Also Fits</td><td>${platforms.compatible}</td></tr>
            <tr><td>Era</td><td>${engine.era.charAt(0).toUpperCase() + engine.era.slice(1)}</td></tr>
          </table>

          <div class="purchase-panel">
            <h3>Buy This Engine</h3>
            <p>To purchase this unit, contact us by <strong>email</strong> or <strong>WhatsApp</strong>. Include the listing ID (<strong>#${engine.id}</strong>) so we can reserve the correct engine.</p>
            <div class="detail-actions purchase-actions">
              <a href="${emailBuyHref}" class="btn btn-primary btn-buy-email" id="buyEmailBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email to Buy
              </a>
              <a href="${whatsappBuyHref}" class="btn btn-whatsapp btn-buy-whatsapp" id="buyWhatsAppBtn" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp to Buy
              </a>
            </div>
            <div class="purchase-contact-list">
              <a href="mailto:${SITE.email}">${SITE.email}</a>
              <span>·</span>
              <a href="${getTelHref()}">${SITE.phone}</a>
            </div>
          </div>

          <p class="detail-note">
            All engines are dyno-tested and include a 6-month mechanical warranty.
            Shipping available across Europe from Hamburg.
          </p>
        </div>
      </div>
      <div class="detail-description container">
        <h2>Description</h2>
        <p>${engine.description}</p>
        <p>This ${engine.family} engine has been sourced, inspected, and tested at our Hamburg facility.
        Compression readings and leak-down test results are available on request. The unit is ready for
        installation with documented test results and photographic evidence of condition.</p>
        <p>Primary fitment: <strong>${platforms.primary}</strong>. Also compatible with ${platforms.list.join(', ')} and related BMW models from the
        ${engine.yearStart}–${engine.yearEnd} production period. Our technical team can confirm exact
        fitment for your specific VIN before purchase — email or WhatsApp us with listing ID #${engine.id}.</p>
      </div>`;

    document.getElementById('buyEmailBtn')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      openEnginePurchaseEmail(engine);
    });
    document.getElementById('buyWhatsAppBtn')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      openEnginePurchaseWhatsApp(engine);
    });
  } catch (err) {
    console.error('Engine detail load failed:', err);
    container.innerHTML = `
      <p class="loading">Failed to load engine details.</p>
      <p style="color:var(--text-secondary);margin-top:12px;">${err.message || 'Please refresh the page or browse the catalog again.'}</p>
      <p style="margin-top:16px;"><a href="${pageUrl('/engines')}" class="btn btn-outline">Back to Catalog</a></p>`;
  }
});
