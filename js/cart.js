/* ============================================================
   cart.js – Cart state + localStorage persistence
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'shopzone_cart_v1';

  let items = [];

  // ---------- Persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  // ---------- Helpers ----------
  function find(id) {
    return items.find(i => i.id === id);
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getSavings() {
    return items.reduce((sum, i) => {
      const orig = i.oldPrice || i.price;
      return sum + (orig - i.price) * i.qty;
    }, 0);
  }

  function getTotalQty() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  // ---------- Mutations ----------
  function add(product, qty = 1) {
    const existing = find(product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id:       product.id,
        title:    product.title,
        brand:    product.brand,
        price:    product.price,
        oldPrice: product.oldPrice,
        image:    product.image,
        qty,
      });
    }
    save();
    CartUI.render();
    CartUI.updateBadge();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    save();
    CartUI.render();
    CartUI.updateBadge();
  }

  function updateQty(id, qty) {
    const item = find(id);
    if (!item) return;
    if (qty < 1) { remove(id); return; }
    item.qty = qty;
    save();
    CartUI.render();
    CartUI.updateBadge();
  }

  function clear() {
    items = [];
    save();
    CartUI.render();
    CartUI.updateBadge();
  }

  // ---------- Public API ----------
  return { load, add, remove, updateQty, clear, get items() { return items; }, getTotal, getSavings, getTotalQty };
})();


/* ============================================================
   CartUI – DOM rendering for the sidebar
   ============================================================ */
const CartUI = (() => {

  function updateBadge() {
    const qty = Cart.getTotalQty();
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    badge.textContent = qty;
    badge.classList.remove('bump');
    void badge.offsetWidth; // reflow
    badge.classList.add('bump');
  }

  function render() {
    const body   = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    if (!body || !footer) return;

    if (Cart.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add items to get started</p>
        </div>`;
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = Cart.items.map(item => `
      <div class="cart-item" id="cart-item-${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" 
             onerror="this.src='https://via.placeholder.com/80x80/f0f0f0/999?text=IMG'" />
        <div class="cart-item-info">
          <span class="cart-item-brand">${item.brand}</span>
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">${formatPrice(item.price)}</span>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
            <button class="cart-remove-btn" onclick="Cart.remove(${item.id}); showToast('Removed from cart', 'error');">Delete</button>
          </div>
        </div>
        <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
      </div>
    `).join('');

    const total    = Cart.getTotal();
    const savings  = Cart.getSavings();
    const itemsQty = Cart.getTotalQty();

    footer.innerHTML = `
      <div class="cart-summary-row">
        <span>Subtotal (${itemsQty} item${itemsQty !== 1 ? 's' : ''})</span>
        <span>${formatPrice(total)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Delivery</span>
        <span style="color:var(--clr-green);font-weight:600;">FREE</span>
      </div>
      ${savings > 0 ? `<p class="cart-summary-savings">You save ${formatPrice(savings)} on this order!</p>` : ''}
      <div class="cart-summary-row total">
        <span>Order Total</span>
        <span>${formatPrice(total)}</span>
      </div>
      <button class="btn-checkout" onclick="handleCheckout()">Proceed to Buy (${itemsQty} item${itemsQty !== 1 ? 's' : ''})</button>
      <button class="btn-clear-cart" onclick="Cart.clear(); showToast('Cart cleared', 'info');">Clear Cart</button>
    `;
  }

  return { render, updateBadge };
})();

// ---------- Helpers ----------
function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function handleCheckout() {
  showToast('🎉 Order placed successfully! (Demo)', 'success');
  Cart.clear();
  closeCart();
}
