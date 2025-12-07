// script.js — slider + tilt + theme toggle + dots
document.addEventListener('DOMContentLoaded', () => {
  // theme toggle (topbar)
  const t = document.getElementById('themeToggle');
  t?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    t.textContent = document.documentElement.classList.contains('dark-mode') ? '☀️' : '🌙';
  });

  // slider
  const slider = document.getElementById('slider');
  const slides = slider ? Array.from(slider.querySelectorAll('.slide')) : [];
  const dotsWrap = document.getElementById('dots');
  let current = 0;

  function createDots() {
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    updateDots();
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((d, i) => d.style.opacity = (i === current ? '1' : '0.35'));
  }

  function layout() {
    slides.forEach((el, i) => {
      const offset = i - current;
      const scale = Math.max(0.68, 1 - Math.abs(offset) * 0.14);
      const x = offset * 160;
      const z = -Math.abs(offset) * 120;
      const rot = offset * -8;
      el.style.transform = `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`;
      el.style.zIndex = 100 - Math.abs(offset);
      el.style.opacity = Math.abs(offset) > 2.2 ? '0' : '1';
    });
  }

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    layout();
    updateDots();
  }

  if (slides.length) {
    createDots();
    layout();
    // prev/next
    document.querySelector('.prev')?.addEventListener('click', () => goTo(current - 1));
    document.querySelector('.next')?.addEventListener('click', () => goTo(current + 1));
    // auto-advance
    let auto = setInterval(() => goTo(current + 1), 4800);
    ['mouseenter', 'touchstart'].forEach(e => slider.addEventListener(e, () => clearInterval(auto)));
    ['mouseleave', 'touchend'].forEach(e => slider.addEventListener(e, () => auto = setInterval(() => goTo(current + 1), 4800)));
    // touch swipe
    let startX = null;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    slider.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
      startX = null;
    });
  }

  // tilt effect for .card (pointer)
  function addTilt(cardEl) {
    const inner = cardEl.querySelector('.card-inner');
    if (!inner) return;
    cardEl.addEventListener('pointermove', (ev) => {
      const r = cardEl.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 18;
      const rotX = (0.5 - py) * 12;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(36px)`;
    });
    cardEl.addEventListener('pointerleave', () => { inner.style.transform = 'rotateX(0) rotateY(0) translateZ(36px)'; });
  }

  document.querySelectorAll('.slide .card').forEach(addTilt);
});