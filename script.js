const cats = [
  {
    id: 1,
    name: 'Persian',
    category: 'longhair',
    age: '12 weeks',
    gender: 'Female',
    price: 1200,
    badge: 'Popular',
    badgeClass: 'popular',
    image: 'https://images.unsplash.com/photo-1595433707805-32b9092a5e10?w=500&h=375&fit=crop',
    description: 'Calm and affectionate with a luxurious long coat. Perfect lap cat for quiet homes.',
  },
  {
    id: 2,
    name: 'Maine Coon',
    category: 'longhair',
    age: '14 weeks',
    gender: 'Male',
    price: 1500,
    badge: 'Giant Breed',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=375&fit=crop',
    description: 'Gentle giants known for their playful personality and impressive tufted ears.',
  },
  {
    id: 3,
    name: 'Siamese',
    category: 'shorthair',
    age: '10 weeks',
    gender: 'Male',
    price: 900,
    badge: 'Talkative',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1513245547812-789637e3ebdb?w=500&h=375&fit=crop',
    description: 'Vocal and social with striking blue eyes. Loves being the center of attention.',
  },
  {
    id: 4,
    name: 'Bengal',
    category: 'shorthair',
    age: '11 weeks',
    gender: 'Female',
    price: 1800,
    badge: 'Exotic Look',
    badgeClass: 'popular',
    image: 'https://images.unsplash.com/photo-1568153180638-259747ab10c5?w=500&h=375&fit=crop',
    description: 'Wild-looking rosettes with an energetic, athletic personality. Loves to climb.',
  },
  {
    id: 5,
    name: 'British Shorthair',
    category: 'shorthair',
    age: '13 weeks',
    gender: 'Male',
    price: 1100,
    badge: 'Easy Going',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&h=375&fit=crop',
    description: 'Round-faced and plush-coated. Independent yet deeply loyal to their family.',
  },
  {
    id: 6,
    name: 'Ragdoll',
    category: 'longhair',
    age: '12 weeks',
    gender: 'Female',
    price: 1400,
    badge: 'Popular',
    badgeClass: 'popular',
    image: 'https://images.unsplash.com/photo-1611042556567-25b15aa38d54?w=500&h=375&fit=crop',
    description: 'Famous for going limp when held. Incredibly docile and great with children.',
  },
  {
    id: 7,
    name: 'Scottish Fold',
    category: 'shorthair',
    age: '11 weeks',
    gender: 'Female',
    price: 1300,
    badge: 'Unique Ears',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&h=375&fit=crop',
    description: 'Adorable folded ears and owl-like expression. Sweet, adaptable temperament.',
  },
  {
    id: 8,
    name: 'Sphynx',
    category: 'exotic',
    age: '14 weeks',
    gender: 'Male',
    price: 2000,
    badge: 'Hairless',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&h=375&fit=crop',
    description: 'Hairless and hypoallergenic. Warm to the touch and craves human companionship.',
  },
  {
    id: 9,
    name: 'Norwegian Forest',
    category: 'longhair',
    age: '13 weeks',
    gender: 'Male',
    price: 1350,
    badge: 'Nordic',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1529770533926-4a4934ff79c5?w=500&h=375&fit=crop',
    description: 'Built for cold climates with a thick double coat. Adventurous and intelligent.',
  },
  {
    id: 10,
    name: 'Abyssinian',
    category: 'shorthair',
    age: '10 weeks',
    gender: 'Female',
    price: 950,
    badge: 'Active',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1571566882370-7d0bde34b0ab?w=500&h=375&fit=crop',
    description: 'One of the oldest breeds. Curious, athletic, and always exploring.',
  },
  {
    id: 11,
    name: 'Savannah',
    category: 'exotic',
    age: '15 weeks',
    gender: 'Male',
    price: 3500,
    badge: 'Rare',
    badgeClass: 'popular',
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=500&h=375&fit=crop',
    description: 'Exotic hybrid with serval ancestry. Tall, lean, and remarkably dog-like loyalty.',
  },
  {
    id: 12,
    name: 'Munchkin',
    category: 'exotic',
    age: '11 weeks',
    gender: 'Female',
    price: 1600,
    badge: 'Short Legs',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&h=375&fit=crop',
    description: 'Distinctive short legs with a big personality. Playful, confident, and social.',
  },
];

let cart = [];
let activeFilter = 'all';

const catGrid = document.getElementById('catGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');

function formatPrice(price) {
  return '$' + price.toLocaleString();
}

function renderCats() {
  const filtered = activeFilter === 'all'
    ? cats
    : cats.filter(cat => cat.category === activeFilter);

  catGrid.innerHTML = filtered.map(cat => `
    <article class="cat-card" data-category="${cat.category}">
      <div class="cat-card-image">
        <img src="${cat.image}" alt="${cat.name} kitten" loading="lazy">
        <span class="cat-badge ${cat.badgeClass}">${cat.badge}</span>
      </div>
      <div class="cat-card-body">
        <h3>${cat.name}</h3>
        <div class="cat-meta">
          <span>${cat.age}</span>
          <span>·</span>
          <span>${cat.gender}</span>
        </div>
        <p class="cat-desc">${cat.description}</p>
        <div class="cat-card-footer">
          <span class="cat-price">${formatPrice(cat.price)}</span>
          <button class="add-btn" data-id="${cat.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const cat = cats.find(c => c.id === id);
  if (!cat) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    showToast(`${cat.name} is already in your cart!`);
    return;
  }

  cart.push({ ...cat });
  updateCart();
  showToast(`${cat.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.length;
  cartCount.textContent = count;
  checkoutBtn.disabled = count === 0;

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);

  if (count === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty. Time to find a furry friend!</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.age} · ${item.gender}</p>
        <span class="cart-item-price">${formatPrice(item.price)}</span>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}">&times;</button>
    </div>
  `).join('');

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
}

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderCats();
  });
});

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('Checkout coming soon! Thanks for your interest.');
  closeCart();
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Message sent! We\'ll be in touch soon.');
  contactForm.reset();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

renderCats();
