// Carousel script:

let slideIndex = 1;
showSlides(slideIndex);
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}
// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// navbar 
let position = "absolute";
let navbarTop = 0;
let lastScrollPosition = 0;
let changedPosition = false;
const supportPageOffset = window.pageYOffset !== undefined;

function onScroll() {
  const navbar = document.getElementById("navbar");
  const currentScrollPosition = supportPageOffset
    ? window.pageYOffset
    : document.documentElement.scrollTop;
  if (currentScrollPosition <= 0) {
    if (position !== "absolute") {
      changedPosition = true;
    } else {
      changedPosition = false;
    }
    position = "absolute";
    navbarTop = 0;
    lastScrollPosition = 0;
  } else {
    if (currentScrollPosition > lastScrollPosition) {
      if (position !== "absolute") {
        changedPosition = true;
      } else {
        changedPosition = false;
      }
      position = "absolute";
      let { top, height } = navbar.getBoundingClientRect();
      if (top < -height) {
        top = -height;
      }
      navbarTop = currentScrollPosition + top;
    } else if (currentScrollPosition < lastScrollPosition) {
      const { top } = navbar.getBoundingClientRect();
      if (top >= 0) {
        navbarTop = 0;
        if (position !== "fixed") {
          changedPosition = true;
        } else {
          changedPosition = false;
        }
        position = "fixed";
      }
    }
    lastScrollPosition = currentScrollPosition;
  }
  navbar.style = `position: ${position}; top: ${navbarTop}px; transitiona: ${
    changedPosition ? "none" : "100ms linear"
  }`;
}

window.addEventListener("scroll", onScroll, { passive: true });