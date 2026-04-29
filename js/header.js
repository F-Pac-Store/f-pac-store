document.addEventListener("DOMContentLoaded", initHeader);

function initHeader() {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");

  if (!menu || !toggle) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });
}

// =============================
// SHRINK HEADER NO SCROLL
// =============================
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 80) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});
