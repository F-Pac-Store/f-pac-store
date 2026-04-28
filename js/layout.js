document.addEventListener("DOMContentLoaded", () => {

  async function loadComponent(url, targetId, callback){
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao carregar ${url}`);
      }

      const html = await response.text();
      target.innerHTML = html;

      // Aguarda renderização antes de rodar script
      setTimeout(() => {
        if (callback && typeof callback === "function") {
          callback();
        }
      }, 50);

    } catch (error) {
      console.error(error);

      // fallback simples (evita layout quebrado)
      target.innerHTML = "";
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