/* ============================================================
   products.js – Render product cards + modal
   ============================================================ */

// ---- Star renderer ----
function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="star">★</span>';
    } else if (i - rating < 1 && i - rating > 0) {
      html += '<span class="star">★</span>';
    } else {
      html += '<span class="star empty">★</span>';
    }
  }
  html += '</div>';
  return html;
}

// ---- Discount % ----
function calcDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

// ---- Stock label ----
function stockLabel(s) {
  if (s === 'in')  return '<span class="in-stock">In Stock</span>';
  if (s === 'low') return '<span class="low-stock">Only 3 left!</span>';
  return '<span class="no-stock">Out of Stock</span>';
}

// ---- Build a product card ----
function buildCard(p) {
  const disc = calcDiscount(p.price, p.oldPrice);
  const badgeMap = { deal: 'badge-deal', new: 'badge-new', prime: 'badge-prime' };
  const badgeClass = p.badge ? badgeMap[p.badge] : '';
  const badgeLabel = p.badge ? (p.badge === 'deal' ? '🔥 Deal' : p.badge === 'new' ? '✦ New' : 'Prime') : '';

  return `
    <div class="product-card" data-id="${p.id}" onclick="openModal(${p.id})">
      ${p.badge ? `<span class="card-badge ${badgeClass}">${badgeLabel}</span>` : ''}
      <button class="card-wishlist ${isWishlisted(p.id) ? 'active' : ''}"
              onclick="toggleWishlist(event, ${p.id})"
              title="Add to Wishlist">
        ${isWishlisted(p.id) ? '❤️' : '🤍'}
      </button>

      <div class="card-img-wrap">
        <img class="card-img" 
             src="${p.image}" 
             alt="${p.title}"
             loading="lazy"
             onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=60';" />
      </div>

      <div class="card-body">
        <span class="card-brand">${p.brand}</span>
        <span class="card-title">${p.title}</span>
        <div class="card-stars">
          ${renderStars(p.rating)}
          <span class="rating-count">${p.reviewCount.toLocaleString('en-IN')}</span>
        </div>
        <div class="card-price-row">
          <span class="price-symbol">₹</span>
          <span class="price-main">${p.price.toLocaleString('en-IN')}</span>
          ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          ${disc ? `<span class="price-discount">${disc}% off</span>` : ''}
        </div>
        ${p.prime ? '<span class="card-prime">✦ prime FREE Delivery</span>' : ''}
        <div class="card-delivery">
          <strong>${p.delivery}</strong> delivery
        </div>
        ${stockLabel(p.stock)}
      </div>

      <div class="card-footer">
        <button class="btn-add-cart" id="add-btn-${p.id}"
                onclick="handleAddToCart(event, ${p.id})"
                ${p.stock === 'out' ? 'disabled' : ''}>
          ${p.stock === 'out' ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button class="btn-buy-now" onclick="handleBuyNow(event, ${p.id})">Buy Now</button>
      </div>
    </div>
  `;
}

// ---- Render grid ----
function renderGrid(products) {
  const grid       = document.getElementById('productsGrid');
  const empty      = document.getElementById('emptyState');
  const countEl    = document.getElementById('resultsCount');

  if (!products || products.length === 0) {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    empty.classList.remove('hidden');
    if (countEl) countEl.textContent = 'No products found';
    return;
  }

  grid.classList.remove('hidden');
  empty.classList.add('hidden');
  grid.innerHTML = products.map(buildCard).join('');
  if (countEl) countEl.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
}

// ---- Add to cart handler ----
function handleAddToCart(e, id) {
  e.stopPropagation();
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  Cart.add(product);
  showToast(`Added "${product.brand} ${product.title.split(' ').slice(0, 4).join(' ')}…" to cart`, 'success');

  // Button feedback
  const btn = document.getElementById(`add-btn-${id}`);
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 1500);
  }
}

// ---- Buy now handler ----
function handleBuyNow(e, id) {
  e.stopPropagation();
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  Cart.add(product);
  openCart();
}

// ---- Wishlist (session only) ----
let wishlist = JSON.parse(localStorage.getItem('shopzone_wishlist') || '[]');

function isWishlisted(id) { return wishlist.includes(id); }

function toggleWishlist(e, id) {
  e.stopPropagation();
  const btn = e.currentTarget;
  if (isWishlisted(id)) {
    wishlist = wishlist.filter(w => w !== id);
    btn.textContent = '🤍';
    btn.classList.remove('active');
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    showToast('Added to wishlist ❤️', 'success');
  }
  localStorage.setItem('shopzone_wishlist', JSON.stringify(wishlist));
}

// ---- Product Modal ----
function openModal(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;

  const disc = calcDiscount(p.price, p.oldPrice);
  const overlay = document.getElementById('modalOverlay');
  const body    = document.getElementById('modalBody');

  body.innerHTML = `
    <div class="modal-img-wrap">
      <img class="modal-img" src="${p.image}" alt="${p.title}"
           onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=60';" />
    </div>
    <div class="modal-info">
      <span class="modal-brand">${p.brand}</span>
      <h2 class="modal-title">${p.title}</h2>
      <div class="card-stars" style="margin:0">
        ${renderStars(p.rating)}
        <span class="rating-count">${p.reviewCount.toLocaleString('en-IN')} ratings</span>
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-price-row">
        <span class="modal-price">₹${p.price.toLocaleString('en-IN')}</span>
        ${p.oldPrice ? `<span class="modal-old-price">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
        ${disc ? `<span class="modal-discount">${disc}% off</span>` : ''}
      </div>
      ${p.prime ? '<span class="card-prime" style="font-size:.85rem">✦ prime FREE Delivery</span>' : ''}
      <div style="font-size:.85rem">
        <strong style="color:var(--clr-green)">Delivery:</strong> ${p.delivery}
      </div>
      ${stockLabel(p.stock)}
      <div class="modal-qty-row">
        <label for="modal-qty-${p.id}">Qty:</label>
        <select class="qty-select" id="modal-qty-${p.id}">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn-add-cart" onclick="modalAddToCart(${p.id})">Add to Cart</button>
        <button class="btn-buy-now" onclick="modalBuyNow(${p.id})">Buy Now</button>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function modalAddToCart(id) {
  const p   = PRODUCTS.find(p => p.id === id);
  const qty = parseInt(document.getElementById(`modal-qty-${id}`).value) || 1;
  Cart.add(p, qty);
  showToast(`Added ${qty}× to cart`, 'success');
  closeModal();
}

function modalBuyNow(id) {
  const p   = PRODUCTS.find(p => p.id === id);
  const qty = parseInt(document.getElementById(`modal-qty-${id}`).value) || 1;
  Cart.add(p, qty);
  closeModal();
  openCart();
}