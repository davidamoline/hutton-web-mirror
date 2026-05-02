// ─── Sticky tray ─────────────────────────────────────────
const tray = document.getElementById('sticky-tray');
if (tray) {
  const showAfter = 400; // px scrolled before tray appears
  const onTrayScroll = () => {
    const visible = window.scrollY > showAfter;
    tray.classList.toggle('is-visible', visible);
    tray.setAttribute('aria-hidden', String(!visible));
  };
  window.addEventListener('scroll', onTrayScroll, { passive: true });
  onTrayScroll();
}

// ─── Header scroll ───────────────────────────────────────
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Mobile menu ─────────────────────────────────────────
const toggle   = document.getElementById('mobile-toggle');
const closeBtn = document.getElementById('mobile-close');
const menu     = document.getElementById('mobile-menu');
const overlay  = document.getElementById('mobile-overlay');

const openMenu  = () => { menu.classList.add('is-open'); document.body.style.overflow = 'hidden'; toggle?.setAttribute('aria-expanded','true'); menu.setAttribute('aria-hidden','false'); };
const closeMenu = () => { menu.classList.remove('is-open'); document.body.style.overflow = ''; toggle?.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); };

toggle?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu(); });

// ─── Accordion (collapse-on-reclick) ─────────────────────
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.accordion-item');
    const panel  = item.querySelector('.accordion-panel');
    const isOpen = item.classList.contains('is-open');

    // Close every open item
    document.querySelectorAll('.accordion-item.is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      el.querySelector('.accordion-panel').style.maxHeight = '0';
    });

    // Re-open if it was closed
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ─── Testimonials carousel ────────────────────────────────
(function initTestimonialsCarousel() {
  const track  = document.getElementById('t-track');
  const dotsEl = document.getElementById('t-dots');
  const prevBtn= document.getElementById('t-prev');
  const nextBtn= document.getElementById('t-next');
  if (!track) return;

  const slides = Array.from(track.children);
  let current  = 0;

  function goTo(idx) {
    slides[current].classList.remove('t-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('t-active');
    if (dotsEl) {
      dotsEl.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('is-active', i === current));
    }
  }

  // Build dots
  if (dotsEl) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', `Review ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });
  }

  slides[0].classList.add('t-active');
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 6s
  let timer = setInterval(() => goTo(current + 1), 6000);
  const pause = () => clearInterval(timer);
  const resume = () => { timer = setInterval(() => goTo(current + 1), 6000); };
  track.closest('.testimonials-carousel')?.addEventListener('mouseenter', pause);
  track.closest('.testimonials-carousel')?.addEventListener('mouseleave', resume);
})();

// ─── Team carousel ────────────────────────────────────────
(function initTeamCarousel() {
  const carousel = document.getElementById('team-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.team-slide'));
  const dots   = Array.from(document.querySelectorAll('.team-dot'));
  let current  = 0;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-advance every 7s
  let timer = setInterval(() => goTo(current + 1), 7000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 7000); });
})();

// ─── Before/after pagination ─────────────────────────────
(function initBaPagination() {
  const pages   = Array.from(document.querySelectorAll('.ba-page'));
  const prevBtn = document.getElementById('ba-prev');
  const nextBtn = document.getElementById('ba-next');
  const dotsEl  = document.getElementById('ba-dots');
  const counter = document.getElementById('ba-counter');
  if (!pages.length) return;

  let current = 0;

  function updateCounter() {
    if (counter) counter.textContent = `Page ${current + 1} of ${pages.length}`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === pages.length - 1;
    if (dotsEl) dotsEl.querySelectorAll('.ba-dot').forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  function goTo(idx) {
    pages[current].classList.remove('is-active');
    current = Math.max(0, Math.min(idx, pages.length - 1));
    pages[current].classList.add('is-active');
    updateCounter();
    document.getElementById('ba-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Build dots
  if (dotsEl) {
    pages.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'ba-dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', `Page ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  updateCounter();
})();

// ─── Before/after drag slider ─────────────────────────────
document.querySelectorAll('.ba-slider').forEach((slider) => {
  const handle  = slider.querySelector('.ba-handle');
  const afterEl = slider.querySelector('.ba-after');
  if (!handle || !afterEl) return;

  let dragging = false;

  const setPos = (x) => {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  };

  handle.addEventListener('mousedown',  () => { dragging = true; });
  document.addEventListener('mouseup',  () => { dragging = false; });
  document.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });
  handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
  document.addEventListener('touchmove', (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
});
