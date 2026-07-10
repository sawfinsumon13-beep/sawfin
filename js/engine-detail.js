document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) { window.location.href = '/engines'; return; }

  const container = document.getElementById('engineDetail');
  container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading engine details...</div>';

  try {
    const chunkNum = String(Math.ceil(id / 50)).padStart(3, '0');
    const res = await fetch(`data/engines/chunk-${chunkNum}.json`);
    const engines = await res.json();
    const engine = engines.find(e => e.id === id);

    if (!engine) {
      container.innerHTML = '<p class="loading">Engine not found.</p>';
      return;
    }

    document.title = `${engine.name} | Premium BMW Engines`;
    document.getElementById('breadcrumbName').textContent = engine.name;

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
          <h1>${engine.name}</h1>
          <div class="detail-code">Engine Code: ${engine.code} | ${engine.family} Family</div>
          <div class="detail-price">${formatPrice(engine.price)}</div>
          <table class="specs-table">
            <tr><td>Displacement</td><td>${engine.displacement}L</td></tr>
            <tr><td>Power Output</td><td>${engine.power} hp</td></tr>
            <tr><td>Fuel Type</td><td>${engine.fuel.charAt(0).toUpperCase() + engine.fuel.slice(1)}</td></tr>
            <tr><td>Production Years</td><td>${engine.yearStart} – ${engine.yearEnd}</td></tr>
            <tr><td>Mileage</td><td>${engine.mileage.toLocaleString()} km</td></tr>
            <tr><td>Condition</td><td>${engine.condition}</td></tr>
            <tr><td>Platform</td><td>${engine.platform}</td></tr>
            <tr><td>Era</td><td>${engine.era.charAt(0).toUpperCase() + engine.era.slice(1)}</td></tr>
          </table>
          <div class="detail-actions">
            <a href="${pageUrl(`/contact?engine=${engine.id}`)}" class="btn btn-primary">Request Quote</a>
            <a href="tel:+4917613627363" class="btn btn-outline">Call Now</a>
          </div>
          <p style="color:var(--text-secondary);font-size:0.9rem;">
            All engines are dyno-tested and come with a 6-month mechanical warranty.
            Shipping available across Europe.
          </p>
        </div>
      </div>
      <div class="detail-description container">
        <h2>Description</h2>
        <p>${engine.description}</p>
        <p>This ${engine.family} engine has been sourced, inspected, and tested at our Hamburg facility.
        Compression readings and leak-down test results are available on request. The unit is ready for
        installation with documented test results and photographic evidence of condition.</p>
        <p>Compatible with ${engine.platform} platform vehicles and related BMW models from the
        ${engine.yearStart}-${engine.yearEnd} production period. Our technical team can confirm exact
        fitment for your specific VIN before purchase.</p>
      </div>`;
  } catch (err) {
    container.innerHTML = '<p class="loading">Failed to load engine details.</p>';
  }
});
