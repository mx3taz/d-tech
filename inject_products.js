const fs = require('fs');

const productsData = JSON.parse(fs.readFileSync('products_data.json', 'utf8'));

// Build the products JS array as a string
let productsJS = 'const products = [\n';
productsData.forEach((p, i) => {
  const descEscaped = (p.desc || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
  const nameEscaped = (p.name || '').replace(/'/g, "\\'");
  
  let specsObj = '';
  const specsEntries = Object.entries(p.specs);
  specsObj = '{ ' + specsEntries.map(([k,v]) => {
    return "'" + k.replace(/'/g, "\\'") + "': '" + v.replace(/'/g, "\\'") + "'";
  }).join(', ') + ' }';

  productsJS += "  { id: " + p.id + ", name: '" + nameEscaped + "', brand: '" + p.brand + "', category: '" + p.category + "', categoryLabel: '" + p.categoryLabel + "', reference: '" + p.reference + "', price: " + p.price + ", img: '" + p.img + "', isNew: " + p.isNew + ", desc: '" + descEscaped + "', specs: " + specsObj + " }";
  if (i < productsData.length - 1) productsJS += ',';
  productsJS += '\n';
});
productsJS += '];';

// Build new JS block
const newJSBlock = `${productsJS}

const categoryLabels = {
  'MAL': 'Machine à Laver',
  'LAVE VAISSELLE': 'Lave-Vaisselle',
  'REF': 'Réfrigérateur',
  'CONG': 'Congélateur',
  'CLIM': 'Climatiseur',
  'ENCASTRABLE': 'Encastrable',
  'PEM': 'Petit Électroménager',
  'TV': 'Téléviseur',
  'MICRO ONDE': 'Micro-ondes'
};

let cart = [];
let activeCategory = 'Tous';
let activeBrand = 'Toutes';
let filterNew = false;
let filterDiscount = false;
const categories = ['Tous', ...new Set(products.map(p => p.category))];
const brands = ['Toutes', ...new Set(products.map(p => p.brand))];

function init() { 
  renderFilters(); 
  renderHomeSections();
  handleRoute();
}

// Router
window.addEventListener('hashchange', handleRoute);

function handleRoute() {
  const hash = window.location.hash || '#home';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  
  if(hash === '#home') {
    document.getElementById('view-home').classList.add('active');
    document.querySelector('.nav-links a[href="#home"]').classList.add('active');
  } else if(hash === '#products') {
    document.getElementById('view-products').classList.add('active');
    document.querySelector('.nav-links a[href="#products"]').classList.add('active');
    renderProducts();
  } else if(hash.startsWith('#product/')) {
    const id = parseInt(hash.split('/')[1]);
    renderProductDetail(id);
    document.getElementById('view-product-detail').classList.add('active');
  } else if(hash === '#checkout') {
    if(cart.length === 0) { window.location.hash = '#products'; return; }
    renderCheckoutSummary();
    document.getElementById('view-checkout').classList.add('active');
  }
  window.scrollTo(0,0);
}

// Renderers
function renderHomeSections() {
  const newProds = products.filter(p => p.isNew);
  const discProds = products.filter(p => p.discountPrice);
  
  document.getElementById('home-new-products').innerHTML = newProds.length > 0 
    ? newProds.slice(0, 4).map(p => generateProductCard(p)).join('')
    : '<p style="grid-column:1/-1; text-align:center; color:var(--gray); padding: 2rem;">Aucune nouveauté pour le moment.</p>';
  document.getElementById('home-discount-products').innerHTML = discProds.length > 0 
    ? discProds.slice(0, 4).map(p => generateProductCard(p)).join('')
    : '<p style="grid-column:1/-1; text-align:center; color:var(--gray); padding: 2rem;">Aucune promotion pour le moment.</p>';
}

function renderFilters() {
  const filtersContainer = document.getElementById('filters');
  
  // Brand filters
  let html = '<div style="display:flex; flex-wrap:wrap; gap:0.8rem; width:100%; margin-bottom:1rem; align-items:center;">';
  html += '<span style="color:var(--gray); font-weight:600; font-size:0.9rem; margin-right:0.5rem;"><i class="fa-solid fa-building"></i> Marque:</span>';
  html += brands.map(brand => 
    \`<button class="filter-btn \${activeBrand === brand ? 'active' : ''}" onclick="filterByBrand('\${brand}')">\${brand}</button>\`
  ).join('');
  html += '</div>';

  // Category filters
  html += '<div style="display:flex; flex-wrap:wrap; gap:0.8rem; width:100%; margin-bottom:1rem; align-items:center;">';
  html += '<span style="color:var(--gray); font-weight:600; font-size:0.9rem; margin-right:0.5rem;"><i class="fa-solid fa-layer-group"></i> Catégorie:</span>';
  html += categories.map(cat => {
    const label = cat === 'Tous' ? 'Tous' : (categoryLabels[cat] || cat);
    return \`<button class="filter-btn \${activeCategory === cat ? 'active' : ''}" onclick="filterProducts('\${cat}')">\${label}</button>\`;
  }).join('');
  html += '</div>';
  
  // Tag filters (New / Discount)
  html += '<div style="display:flex; flex-wrap:wrap; gap:0.8rem; width:100%; align-items:center;">';
  html += '<span style="color:var(--gray); font-weight:600; font-size:0.9rem; margin-right:0.5rem;"><i class="fa-solid fa-filter"></i> Filtres:</span>';
  html += \`<button class="filter-btn \${filterNew ? 'active' : ''}" style="border-color: \${filterNew ? 'var(--secondary)' : 'var(--glass-border)'}" onclick="toggleNewFilter()"><i class="fa-solid fa-sparkles"></i> Nouveautés</button>\`;
  html += \`<button class="filter-btn \${filterDiscount ? 'active' : ''}" style="border-color: \${filterDiscount ? '#ef4444' : 'var(--glass-border)'}" onclick="toggleDiscountFilter()"><i class="fa-solid fa-tag"></i> Promotions</button>\`;
  html += '</div>';
  
  filtersContainer.innerHTML = html;
}

function toggleNewFilter() {
  filterNew = !filterNew;
  renderFilters();
  renderProducts();
}

function toggleDiscountFilter() {
  filterDiscount = !filterDiscount;
  renderFilters();
  renderProducts();
}

function filterProducts(category) {
  activeCategory = category;
  renderFilters();
  renderProducts();
}

function filterByBrand(brand) {
  activeBrand = brand;
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  let filtered = activeCategory === 'Tous' ? [...products] : products.filter(p => p.category === activeCategory);
  
  if (activeBrand !== 'Toutes') filtered = filtered.filter(p => p.brand === activeBrand);
  if (filterNew) filtered = filtered.filter(p => p.isNew);
  if (filterDiscount) filtered = filtered.filter(p => p.discountPrice);
  
  // Product count
  const countEl = document.getElementById('products-count');
  if (countEl) countEl.textContent = filtered.length + ' produit' + (filtered.length > 1 ? 's' : '');
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--gray); font-size: 1.2rem; padding: 3rem 0;"><i class="fa-solid fa-box-open" style="font-size:3rem; display:block; margin-bottom:1rem; opacity:0.3"></i>Aucun produit ne correspond à ces critères.</p>';
  } else {
    grid.innerHTML = filtered.map(p => generateProductCard(p)).join('');
  }
}

function generateProductCard(p) {
  const priceHTML = p.discountPrice 
    ? \`<div class="product-price">\${p.discountPrice.toFixed(2)} DA <span class="old-price">\${p.price.toFixed(2)} DA</span></div>\`
    : \`<div class="product-price">\${p.price.toFixed(2)} DA</div>\`;
  const tag = p.isNew ? '<span class="tag new">NOUVEAU</span>' : (p.discountPrice ? '<span class="tag discount">PROMO</span>' : '');
  const brandBadge = \`<span style="display:inline-block; padding:0.2rem 0.7rem; background:rgba(0,168,255,0.1); border-radius:8px; font-size:0.75rem; font-weight:700; color:var(--secondary); margin-bottom:0.3rem;">\${p.brand}</span>\`;
  
  return \`
    <a href="#product/\${p.id}" class="product-card">
      \${tag}
      <div class="product-img-wrap"><img src="\${p.img}" alt="\${p.name}" loading="lazy"></div>
      \${brandBadge}
      <div class="product-category">\${p.categoryLabel || p.category}</div>
      <h3 class="product-title">\${p.name}</h3>
      \${priceHTML}
      <button class="add-to-cart" onclick="event.preventDefault(); addToCart(event, \${p.id})">
        <i class="fa-solid fa-plus"></i> Ajouter au panier
      </button>
    </a>
  \`;
}

function renderProductDetail(id) {
  const p = products.find(p => p.id === id);
  if(!p) return;
  const priceHTML = p.discountPrice 
    ? \`\${p.discountPrice.toFixed(2)} DA <span class="old-price" style="font-size:1.5rem">\${p.price.toFixed(2)} DA</span>\`
    : \`\${p.price.toFixed(2)} DA\`;
    
  const specsHTML = Object.entries(p.specs).map(([k,v]) => \`<li><span>\${k}</span><span>\${v}</span></li>\`).join('');

  document.getElementById('product-detail-container').innerHTML = \`
    <a href="javascript:history.back()" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Retour</a>
    <div class="product-detail-layout">
      <div class="product-detail-img">
        <img src="\${p.img}" alt="\${p.name}">
      </div>
      <div class="product-detail-info">
        <span style="display:inline-block; padding:0.3rem 1rem; background:rgba(0,168,255,0.1); border-radius:10px; font-size:0.85rem; font-weight:700; color:var(--secondary); margin-bottom:1rem;">\${p.brand}</span>
        <div class="product-category" style="margin-bottom: 0.5rem;">\${p.categoryLabel || p.category}</div>
        <h1>\${p.name}</h1>
        <div style="color:var(--gray); font-size:0.95rem; margin-bottom:1rem;">Réf: \${p.reference}</div>
        <div class="product-detail-price">\${priceHTML}</div>
        <p class="product-detail-desc">\${p.desc}</p>
        
        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Spécifications Techniques</h3>
        <ul class="specs-list">\${specsHTML}</ul>
        
        <button class="btn btn-primary" style="width:100%; padding: 1.2rem; font-size: 1.2rem;" onclick="addToCart(event, \${p.id}, true)">
          <i class="fa-solid fa-cart-shopping"></i> Ajouter au panier
        </button>
      </div>
    </div>
  \`;
}

function renderCheckoutSummary() {
  const list = document.getElementById('checkout-items-list');
  list.innerHTML = cart.map(item => {
    const finalPrice = item.discountPrice || item.price;
    return \`
    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.05)">
      <img src="\${item.img}" style="width:60px; height:60px; object-fit:contain; background:rgba(255,255,255,0.02); border-radius:10px; padding:0.5rem">
      <div style="flex:1">
        <h4 style="font-size:1rem; margin-bottom:0.2rem">\${item.name}</h4>
        <div style="color:var(--gray); font-size:0.9rem">Qté: \${item.quantity}</div>
      </div>
      <div style="font-family:'Outfit'; font-weight:700; color:var(--secondary)">\${(finalPrice * item.quantity).toFixed(2)} DA</div>
    </div>
    \`
  }).join('');
  
  const total = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);
  document.getElementById('checkout-total-price').innerText = total.toFixed(2) + ' DA';
}


// Cart Logic
function addToCart(e, productId, isDetail = false) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  
  if(existing) existing.quantity += 1;
  else cart.push({...product, quantity: 1});
  
  updateCartUI();
  
  const btn = e.currentTarget;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté';
  btn.style.background = 'var(--secondary)';
  if(!isDetail) btn.style.borderColor = 'var(--secondary)';
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 1200);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  if(window.location.hash === '#checkout') {
    if(cart.length === 0) window.location.hash = '#products';
    else renderCheckoutSummary();
  }
}

function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItems = document.getElementById('cart-items');
  
  if(cart.length === 0) {
    cartItems.innerHTML = '<div style="text-align:center; padding: 3rem 0; color:var(--gray);"><i class="fa-solid fa-cart-shopping" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i><p>Votre panier est vide.</p></div>';
  } else {
    cartItems.innerHTML = cart.map(item => {
      const finalPrice = item.discountPrice || item.price;
      return \`
      <div class="cart-item">
        <img src="\${item.img}" alt="\${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">\${item.name}</div>
          <div style="font-size: 0.9rem; color: var(--gray); display:flex; align-items:center; gap: 0.5rem; margin-top: 0.5rem;">
            <span>Qté: \${item.quantity}</span>
            <button onclick="removeFromCart(\${item.id})" style="background:none;border:none;color:#ef4444;cursor:pointer; padding: 4px; font-size: 1rem; margin-left: auto;" title="Supprimer"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
        <div class="cart-item-price">\${(finalPrice * item.quantity).toFixed(2)} DA</div>
      </div>
    \`}).join('');
  }
  
  const total = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);
  document.getElementById('cart-total-price').innerText = total.toFixed(2) + ' DA';
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.classList.toggle('active');
  if(modal.classList.contains('active')) updateCartUI();
}

function submitOrder(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Traitement...';
  
  setTimeout(() => {
    alert('Réservation confirmée ! Nous avons mis vos articles de côté. Veuillez vous rendre en magasin pour le paiement et le retrait.');
    cart = [];
    updateCartUI();
    e.target.reset();
    btn.innerHTML = origHTML;
    window.location.hash = '#home';
  }, 1500);
}

document.addEventListener('DOMContentLoaded', init);`;

// Read current HTML
let html = fs.readFileSync('index.html', 'utf8');

// Find and replace the entire <script> block
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>');

if (scriptStart === -1 || scriptEnd === -1) {
  console.log("ERROR: Could not find script tags");
  process.exit(1);
}

const newHTML = html.substring(0, scriptStart + '<script>'.length) + '\n' + newJSBlock + '\n' + html.substring(scriptEnd);

fs.writeFileSync('index.html', newHTML);
console.log("SUCCESS: Injected " + productsData.length + " products into index.html");
