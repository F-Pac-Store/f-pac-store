function initHeader() {
  const header = document.getElementById("header");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const toggle = document.querySelector(".menu-toggle");

  // Se o header ainda não existir, não executa
  if (!header || !menu || !overlay || !toggle) {
    return;
  }

  // MENU MOBILE
  window.openMenu = function () {
    menu.classList.add("active");
    overlay.classList.add("active");
  };

  window.closeMenu = function () {
    menu.classList.remove("active");
    overlay.classList.remove("active");
  };

  // HEADER SHRINK NO SCROLL
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }
  });
}
