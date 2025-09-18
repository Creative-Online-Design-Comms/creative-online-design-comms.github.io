// my-javascript.js
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  if (!hero) return; // safety
  const img = hero.querySelector('img');
  const overlay = hero.querySelector('.hero-overlay');

  const maxScale = 1.6;      // how much the image zooms (1 => no zoom)
  const zoomSpan = 0.9;      // portion of hero height used for the zoom/fade (0..1)
  // 0.9 means zoom/fade occurs during ~90% of the hero area being scrolled

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function onScroll() {
    const rect = hero.getBoundingClientRect();
    // how far hero has moved up past the top of the viewport:
    const scrolled = Math.max(0, -rect.top);
    const heroH = hero.offsetHeight;

    // progress: 0 -> 1 while scrolled goes from 0 to (heroH * zoomSpan)
    const denom = Math.max(1, heroH * zoomSpan);
    let raw = scrolled / denom;
    let progress = Math.min(Math.max(raw, 0), 1);

    // eased progress for nicer motion
    const eased = easeOutQuad(progress);

    // scale the image
    const scale = 1 + (maxScale - 1) * eased;
    img.style.transform = `scale(${scale})`;

    // overlay opacity fades in as progress moves from 0 to 1
    overlay.style.opacity = String(eased);

    // optional: once overlay is near fully opaque, reduce image brightness slightly
    // (keeps it from showing through if your overlay is semi-transparent)
    if (eased > 0.95) {
      img.style.opacity = String(1 - (eased - 0.95) * 20); // quickly vanish
    } else {
      img.style.opacity = '1';
    }
  }

  // run on load and wire events
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});



