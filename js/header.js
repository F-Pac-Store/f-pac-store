document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 80) {
      // Scroll para baixo → header slim
      header.classList.add("shrink");
    } else {
      // Scroll para cima → header grande
      header.classList.remove("shrink");
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });

  // MENU MOBILE (mantido)
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("menuToggle");

  if (menu && toggle) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    });
  }
});
