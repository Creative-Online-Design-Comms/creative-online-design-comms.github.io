// otago-forest.js — Flip Cards + Carousel

(() => {
  // ---- Flip cards via event delegation (works everywhere) ----
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".fact-card");
    if (!card) return;
    card.classList.toggle("flipped");
    const expanded = card.getAttribute("aria-expanded") === "true";
    card.setAttribute("aria-expanded", String(!expanded));
  });

  // ---- Carousel ----
  let currentIndex = 0;
  let visibleSlides = 3;
  let slides = [];
  let track = null;
  let dots = null;
  let autoPlay = null;

  const getVisibleSlides = () => (window.innerWidth < 768 ? 1 : 3);

  const updateCarousel = () => {
    if (!slides.length || !track) return;

    const slideWidth = slides[0].offsetWidth + 20; // 20px gap from CSS
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // highlight visible slides
    slides.forEach((s) => s.classList.remove("active"));
    for (let i = currentIndex; i < currentIndex + visibleSlides; i++) {
      if (slides[i]) slides[i].classList.add("active");
    }

    // dots
    if (dots) {
      dots.forEach((d) => d.classList.remove("active"));
      const activeDot = Math.floor(currentIndex / visibleSlides);
      if (dots[activeDot]) dots[activeDot].classList.add("active");
    }
  };

  const moveCarousel = (direction) => {
    const maxIndex = Math.max(0, slides.length - visibleSlides);
    currentIndex = Math.min(Math.max(0, currentIndex + direction), maxIndex);
    updateCarousel();
  };

  const currentSlide = (n) => {
    visibleSlides = getVisibleSlides();
    const maxIndex = Math.max(0, slides.length - visibleSlides);
    currentIndex = Math.min(Math.max(0, (n - 1) * visibleSlides), maxIndex);
    updateCarousel();
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlay = setInterval(() => {
      const maxIndex = Math.max(0, slides.length - visibleSlides);
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      updateCarousel();
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlay) clearInterval(autoPlay);
  };

  const initCarousel = () => {
    track = document.querySelector("#layers-carousel .carousel-track");
    slides = Array.from(document.querySelectorAll("#layers-carousel .mySlides"));
    dots = document.querySelectorAll("#layers-carousel .dot");

    if (!track || !slides.length) {
      console.warn("[OtagoForest] Carousel DOM not found.");
      return;
    }

    visibleSlides = getVisibleSlides();
    currentIndex = 0;
    updateCarousel();
    startAutoPlay();

    // pause on hover
    const container = document.querySelector("#layers-carousel .slideshow-container");
    if (container) {
      container.addEventListener("mouseenter", stopAutoPlay);
      container.addEventListener("mouseleave", startAutoPlay);
    }

    // expose for arrows + dots
    window.moveCarousel = moveCarousel;
    window.currentSlide = currentSlide;
  };

  document.addEventListener("DOMContentLoaded", initCarousel);

  window.addEventListener("resize", () => {
    // recalc visible count & reset position to avoid misalignment
    visibleSlides = getVisibleSlides();
    currentIndex = 0;
    updateCarousel();
  });

  // keyboard nav (optional)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveCarousel(-1);
    if (e.key === "ArrowRight") moveCarousel(1);
  });
})();
