function initHeader() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const toggle = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("closeMenu");

  if (!menu || !overlay || !toggle) return;

  toggle.addEventListener("click", () => {
    menu.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  function closeMenu() {
    menu.classList.remove("active");
    overlay.classList.remove("active");
  }
}
