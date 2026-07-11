const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target1Start = "let cart = [];";
const target1End = "function init() { \n  renderFilters(); \n  renderHomeSections();\n  handleRoute();\n}";

const replacement1 = `let cart = [];
let activeCategory = 'Tous';
let activeBrand = 'Toutes';
let filterNew = false;
let filterDiscount = false;
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
const categories = ['Tous', ...new Set(products.map(p => p.category))];
const brands = ['Toutes', ...new Set(products.map(p => p.brand))];

function saveState() {
  const state = { activeCategory, activeBrand, filterNew, filterDiscount, currentPage };
  localStorage.setItem('dtech_store_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('dtech_store_state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (state.activeCategory) activeCategory = state.activeCategory;
      if (state.activeBrand) activeBrand = state.activeBrand;
      if (typeof state.filterNew === 'boolean') filterNew = state.filterNew;
      if (typeof state.filterDiscount === 'boolean') filterDiscount = state.filterDiscount;
      if (state.currentPage) currentPage = state.currentPage;
    } catch(e) { console.error('Failed to load state', e); }
  }
}

function init() { 
  loadState();
  renderFilters(); 
  renderHomeSections();
  handleRoute();
}`;

html = html.replace(
  /let cart = \[\];[\s\S]*?function init\(\) \{ \n  renderFilters\(\); \n  renderHomeSections\(\);\n  handleRoute\(\);\n\}/,
  replacement1
);

const target2Pattern = /function toggleNewFilter\(\) \{[\s\S]*?function generateProductCard\(p\) \{/;

const replacement2 = `function toggleNewFilter() {
  filterNew = !filterNew;
  currentPage = 1;
  saveState();
  renderFilters();
  renderProducts();
}

function toggleDiscountFilter() {
  filterDiscount = !filterDiscount;
  currentPage = 1;
  saveState();
  renderFilters();
  renderProducts();
}

function filterProducts(category) {
  activeCategory = category;
  currentPage = 1;
  saveState();
  renderFilters();
  renderProducts();
}

function filterByBrand(brand) {
  activeBrand = brand;
  currentPage = 1;
  saveState();
  renderFilters();
  renderProducts();
}

function changePage(page) {
  currentPage = page;
  saveState();
  renderProducts();
  document.getElementById('view-products').scrollIntoView({ behavior: 'smooth' });
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
    // Pagination calculation
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages); // safety reset
    
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    
    let html = paginatedItems.map(p => generateProductCard(p)).join('');
    
    // Add pagination controls if needed
    if (totalPages > 1) {
      let paginationHTML = '<div class="pagination">';
      paginationHTML += \`<button class="page-btn" \${currentPage === 1 ? 'disabled' : ''} onclick="changePage(\${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>\`;
      
      for(let i = 1; i <= totalPages; i++) {
        paginationHTML += \`<button class="page-btn \${currentPage === i ? 'active' : ''}" onclick="changePage(\${i})">\${i}</button>\`;
      }
      
      paginationHTML += \`<button class="page-btn" \${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(\${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>\`;
      paginationHTML += '</div>';
      html += paginationHTML;
    }
    
    grid.innerHTML = html;
  }
}

function generateProductCard(p) {`;

html = html.replace(target2Pattern, replacement2);

fs.writeFileSync('index.html', html);
console.log("Successfully injected pagination and state logic!");

