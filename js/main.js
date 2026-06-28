document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    initFaq();
    initVinForm();
    initProductFilters();
  });
});

function initFaq() {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      btn.setAttribute('aria-expanded', 'false');

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initVinForm() {
  const form = document.querySelector('.vin-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const vin = input?.value.trim();

    if (!vin) {
      alert('Please enter your VIN or engine code.');
      return;
    }

    const message = encodeURIComponent(
      `Hi, I'd like to check stock for my vehicle.\n\nVIN / Engine code: ${vin}`
    );
    window.open(`https://wa.me/4917613627363?text=${message}`, '_blank');
  });
}

function initProductFilters() {
  if (document.getElementById('products-grid')) return;
  const tags = document.querySelectorAll('.filter-tag[data-filter]');
  const products = document.querySelectorAll('.product-card[data-category]');

  if (!tags.length || !products.length) return;

  tags.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = tag.dataset.filter;

      tags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');

      products.forEach((product) => {
        const show = filter === 'all' || product.dataset.category === filter;
        product.style.display = show ? '' : 'none';
      });
    });
  });
}
