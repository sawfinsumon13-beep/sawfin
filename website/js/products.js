const PRODUCTS = [
  { id: '1', name: 'BMW N47D20C 2.0L Diesel Engine', slug: 'n47d20c', code: 'N47D20C', family: 'N47', fuel: 'Diesel', price: 2499, oldPrice: 2899, mileage: 85000, rating: 5, reviews: 24, stock: 'in', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop', sale: true },
  { id: '2', name: 'BMW N57D30A 3.0L Diesel Engine', slug: 'n57d30a', code: 'N57D30A', family: 'N57', fuel: 'Diesel', price: 4299, mileage: 72000, rating: 5, reviews: 18, stock: 'in', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop' },
  { id: '3', name: 'BMW M57D30 3.0L Diesel Engine', slug: 'm57d30', code: 'M57D30', family: 'M57', fuel: 'Diesel', price: 3199, mileage: 95000, rating: 5, reviews: 15, stock: 'in', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop' },
  { id: '4', name: 'BMW B47D20A 2.0L Diesel Engine', slug: 'b47d20a', code: 'B47D20A', family: 'B47', fuel: 'Diesel', price: 3499, mileage: 65000, rating: 5, reviews: 21, stock: 'in', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop' },
  { id: '5', name: 'BMW B57D30A 3.0L Diesel Engine', slug: 'b57d30a', code: 'B57D30A', family: 'B57', fuel: 'Diesel', price: 4899, mileage: 58000, rating: 5, reviews: 16, stock: 'in', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop' },
  { id: '6', name: 'BMW B58B30 3.0L Petrol Engine', slug: 'b58b30', code: 'B58B30', family: 'B58', fuel: 'Petrol', price: 5499, mileage: 42000, rating: 5, reviews: 12, stock: 'in', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop' },
  { id: '7', name: 'BMW N47D20A 2.0L Diesel Engine', slug: 'n47d20a', code: 'N47D20A', family: 'N47', fuel: 'Diesel', price: 2699, mileage: 110000, rating: 4, reviews: 19, stock: 'in', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop&q=80&sig=7' },
  { id: '8', name: 'BMW N57D30B 3.0L Diesel Engine', slug: 'n57d30b', code: 'N57D30B', family: 'N57', fuel: 'Diesel', price: 3999, mileage: 88000, rating: 5, reviews: 14, stock: 'in', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80&sig=8' },
];

function productCardHTML(p) {
  const productData = JSON.stringify({ id: p.id, name: p.name, code: p.code, price: p.price, image: p.image });
  const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
  return `
    <div class="card product-card reveal" data-family="${p.family}" data-fuel="${p.fuel}" data-stock="${p.stock}">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.sale ? '<span class="product-badge">SALE</span>' : ''}
        <div class="product-actions">
          <a href="product.html?id=${p.slug}" title="Quick View">👁</a>
          <button class="wishlist-btn" data-product='${productData}' title="Wishlist">♡</button>
        </div>
      </div>
      <div class="product-body">
        <span class="product-code">${p.code}</span>
        <a href="product.html?id=${p.slug}" class="product-name">${p.name}</a>
        <div class="product-rating"><span class="star">${stars}</span><span class="rating-count">(${p.reviews})</span></div>
        <div class="product-footer">
          <div>
            <span class="product-price">€${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="product-price-old">€${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="add-cart-btn" data-product='${productData}' title="Add to cart">🛒</button>
        </div>
        <div class="product-mileage">${p.mileage.toLocaleString()} km</div>
      </div>
    </div>
  `;
}

function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}
