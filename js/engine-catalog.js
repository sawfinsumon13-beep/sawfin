/* Engine catalog display helpers — correct platforms and purchase links */

const FAMILY_PLATFORMS = {
  M10: ['E21', 'E30'],
  M20: ['E30', 'E28', 'E21'],
  M30: ['E28', 'E34', 'E24', 'E23'],
  M40: ['E30', 'E36'],
  M42: ['E36'],
  M44: ['E36', 'Z3'],
  M50: ['E36', 'E34'],
  M52: ['E36', 'E39', 'E46', 'Z3'],
  M54: ['E46', 'E39', 'E53', 'Z3'],
  M21: ['E28', 'E30'],
  M41: ['E36', 'E34'],
  M47: ['E46', 'E39', 'E83'],
  M57: ['E39', 'E46', 'E60', 'E90', 'E53', 'E70'],
  M60: ['E34', 'E32'],
  M62: ['E39', 'E38', 'E53'],
  M67: ['E38', 'E65'],
  S14: ['E30'],
  S38: ['E34'],
  S50: ['E36', 'Z3'],
  S52: ['E36', 'Z3'],
  S54: ['E46', 'Z4'],
  N13: ['F20', 'F30'],
  N20: ['F30', 'F10', 'E84'],
  N26: ['F30', 'F10'],
  N43: ['E90', 'E60'],
  N46: ['E90', 'E87', 'E83'],
  N47: ['E90', 'F30', 'F20', 'F10'],
  N52: ['E90', 'E60', 'E83'],
  N53: ['E90', 'E60'],
  N54: ['E90', 'E82', 'F10'],
  N55: ['F30', 'F10', 'F20'],
  N57: ['F10', 'F30', 'E70', 'F15'],
  N63: ['F10', 'F06', 'G30'],
  N74: ['F01', 'G11'],
  B38: ['F20', 'F30', 'G20'],
  B46: ['F30', 'G20', 'F48'],
  B47: ['F30', 'G20', 'F48'],
  B48: ['F30', 'G20', 'F32'],
  B58: ['F30', 'G20', 'F32', 'G01'],
  B57: ['G30', 'G05', 'G11'],
  S55: ['F80', 'F82'],
  S58: ['G80', 'G82'],
  S63: ['F10', 'F06', 'G30'],
  S65: ['E90', 'E92'],
  S85: ['E60', 'E63']
};

function formatEngineTitle(engine) {
  const fuel = engine.fuel === 'diesel' ? 'Diesel' : 'Petrol';
  const disp = Number(engine.displacement) % 1 === 0
    ? `${engine.displacement}.0L`
    : `${engine.displacement}L`;
  return `BMW ${engine.family} ${disp} ${fuel} — ${engine.power} hp`;
}

function getEnginePlatformInfo(engine) {
  const platforms = FAMILY_PLATFORMS[engine.family];
  if (!platforms || !platforms.length) {
    return {
      primary: engine.platform,
      compatible: engine.platform,
      list: [engine.platform]
    };
  }
  const primary = platforms[(engine.id - 1) % platforms.length];
  const others = platforms.filter(p => p !== primary);
  const compatible = others.length ? `${primary} · ${others.slice(0, 3).join(' · ')}` : primary;
  return { primary, compatible, list: platforms };
}

function buildEnginePurchaseEmail(engine) {
  const title = formatEngineTitle(engine);
  const platforms = getEnginePlatformInfo(engine);
  const subject = `Buy Engine — ${title} (ID ${engine.id})`;
  const body =
    `Hello,\n\nI would like to buy this engine:\n\n` +
    `Engine: ${title}\n` +
    `Code: ${engine.code}\n` +
    `Listing ID: ${engine.id}\n` +
    `Price: ${formatPrice(engine.price)}\n` +
    `Platform: ${platforms.primary}\n` +
    `Mileage: ${engine.mileage.toLocaleString()} km\n` +
    `Condition: ${engine.condition}\n\n` +
    `Please confirm availability, shipping cost, and payment details.\n\nThank you`;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildEnginePurchaseWhatsApp(engine) {
  const title = formatEngineTitle(engine);
  const platforms = getEnginePlatformInfo(engine);
  const text =
    `Hello, I would like to buy this BMW engine:\n\n` +
    `${title}\n` +
    `Code: ${engine.code}\n` +
    `ID: ${engine.id}\n` +
    `Price: ${formatPrice(engine.price)}\n` +
    `Platform: ${platforms.primary}\n` +
    `Mileage: ${engine.mileage.toLocaleString()} km\n\n` +
    `Please confirm availability.`;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

function openEnginePurchaseEmail(engine) {
  window.location.href = buildEnginePurchaseEmail(engine);
}

function openEnginePurchaseWhatsApp(engine) {
  window.open(buildEnginePurchaseWhatsApp(engine), '_blank', 'noopener,noreferrer');
}

function getTelHref() {
  return `tel:${SITE.phone.replace(/\s/g, '')}`;
}

function goToEngineDetail(id) {
  const engineId = parseInt(id, 10);
  if (!engineId) return;
  window.location.href = pageUrl(`/engine-detail?id=${engineId}`);
}

window.goToEngineDetail = goToEngineDetail;
