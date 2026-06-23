/* ============================================================
   ui.js – Toast notifications + Cart sidebar toggles
   ============================================================ */

// ---- Toast ----
const ICONS = { success: '✅', error: '🗑️', info: 'ℹ️', default: '🛒' };

function showToast(msg, type = 'default') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${ICONS[type] || ICONS.default}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);

  // Auto-dismiss after 3s
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3000);
}

// ---- Cart sidebar ----
function openCart() {
  document.getElementById('cartSidebar').classList.remove('hidden');
  document.getElementById('cartOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  CartUI.render();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.add('hidden');
  document.getElementById('cartOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function initUI() {
  // Cart toggle
  document.getElementById('cartToggleBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeModal();
    }
  });

  // Sticky navbar: add shadow on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 16px rgba(0,0,0,.5)'
      : '0 2px 8px rgba(0,0,0,.4)';
  }, { passive: true });
}
