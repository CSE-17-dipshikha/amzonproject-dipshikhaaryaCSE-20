/* ============================================================
   search.js – Search, filter by category, and sort
   ============================================================ */

let currentCategory = 'all';
let currentQuery    = '';
let currentSort     = 'default';

// ---- Filter + Sort pipeline ----
function getFilteredProducts() {
  let list = [...PRODUCTS];

  // 1. Category
  if (currentCategory !== 'all') {
    list = list.filter(p => p.category === currentCategory);
  }

  // 2. Search query (title, brand, desc)
  if (currentQuery.trim()) {
    const q = currentQuery.toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }

  // 3. Sort
  switch (currentSort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default:
      break; // 'featured' = original order
  }

  return list;
}

function applyFilters() {
  renderGrid(getFilteredProducts());
}

// ---- Category filter ----
function filterByCategory(cat) {
  currentCategory = cat;

  // Update category chips
  document.querySelectorAll('.cat-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  // Update nav links
  document.querySelectorAll('.nav-link[data-cat]').forEach(a => {
    a.classList.toggle('active', a.dataset.cat === cat);
  });

  applyFilters();
  // Scroll to products
  document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Search ----
function doSearch() {
  currentQuery = document.getElementById('searchInput').value.trim();
  applyFilters();
}

// ---- Reset ----
function resetFilters() {
  currentCategory = 'all';
  currentQuery    = '';
  currentSort     = 'default';
  document.getElementById('searchInput').value    = '';
  document.getElementById('sortSelect').value     = 'default';
  document.getElementById('categoryFilter').value = 'all';

  document.querySelectorAll('.cat-chip').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
  document.querySelectorAll('.nav-link[data-cat]').forEach(a => a.classList.toggle('active', a.dataset.cat === 'all'));

  applyFilters();
}

// ---- Bind events ----
function initSearch() {
  const input   = document.getElementById('searchInput');
  const btn     = document.getElementById('searchBtn');
  const sort    = document.getElementById('sortSelect');
  const catSel  = document.getElementById('categoryFilter');

  // Live search (debounced)
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(doSearch, 280);
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  btn.addEventListener('click', doSearch);

  // Sort
  sort.addEventListener('change', () => {
    currentSort = sort.value;
    applyFilters();
  });

  // Category select in search bar
  catSel.addEventListener('change', () => {
    filterByCategory(catSel.value);
  });

  // Category chips
  document.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => filterByCategory(btn.dataset.cat));
  });

  // Nav bottom links
  document.querySelectorAll('.nav-link[data-cat]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      filterByCategory(a.dataset.cat);
    });
  });
}
