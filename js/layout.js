document.addEventListener("DOMContentLoaded", () => {

  async function loadComponent(url, targetId, callback){
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const res = await fetch(url);
      const html = await res.text();
      target.innerHTML = html;

      if (callback && typeof callback === "function") {
        callback();
      }
    } catch (e) {
      console.error("Erro ao carregar:", url, e);
    }
  }

  // HEADER
  loadComponent("includes/header.html", "header-placeholder", () => {
    if (typeof initHeader === "function") {
      initHeader();
    }
  });

  // FOOTER
  loadComponent("includes/footer.html", "footer-placeholder");

});
