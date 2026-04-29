document.addEventListener("DOMContentLoaded", initHeader);

function initHeader() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const toggle = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("closeMenu");

  if (!menu || !overlay || !toggle) return;

  // ABRIR MENU
  toggle.addEventListener("click", openMenu);

  // FECHAR MENU
  overlay.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // FECHAR AO CLICAR EM QUALQUER LINK
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // FECHAR COM ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  function openMenu() {
    menu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // trava o scroll
  }

  function closeMenu() {
    menu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
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
