/* ============================================================
   hero.js – Auto-rotating hero slider
   ============================================================ */

function initHero() {
  const slides  = document.querySelectorAll('.hero-slide');
  const dotsEl  = document.getElementById('heroDots');
  const prev    = document.getElementById('heroPrev');
  const next    = document.getElementById('heroNext');
  const wrapper = document.getElementById('heroSlides');

  if (!slides.length) return;

  let current  = 0;
  let autoPlay = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');

    current = (idx + slides.length) % slides.length;
    wrapper.style.transform = `translateX(-${current * 100}%)`;

    slides[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
  }

  function startAuto() {
    autoPlay = setInterval(() => goTo(current + 1), 4500);
  }
  function stopAuto() {
    clearInterval(autoPlay);
  }

  prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch / swipe
  let touchStart = null;
  document.getElementById('hero').addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  document.getElementById('hero').addEventListener('touchend', e => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    touchStart = null;
  });

  startAuto();
}
