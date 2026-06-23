/* ============================================================
   app.js – Boot: initialise all modules
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load cart from localStorage
  Cart.load();

  // 2. Initial product render
  renderGrid(PRODUCTS);

  // 3. Update cart badge with saved cart
  CartUI.updateBadge();

  // 4. Wire up search, filter, sort
  initSearch();

  // 5. Hero slider
  initHero();

  // 6. UI (cart sidebar, modal, toast, scroll)
  initUI();

  console.log(`%cShopZone loaded ✔  ${PRODUCTS.length} products`, 'color:#FF9900;font-weight:bold;font-size:14px');
});
