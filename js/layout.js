document.addEventListener("DOMContentLoaded", () => {

  async function loadComponent({ url, targetId, onLoad }) {
    const target = document.getElementById(targetId);
    if (!target || target.dataset.loaded) return;

    // Placeholder simples para evitar “vazio”
    target.innerHTML = "<!-- carregando -->";

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erro ${res.status} ao carregar ${url}`);
      }

      const html = await res.text();
      target.innerHTML = html;
      target.dataset.loaded = "true";

      if (typeof onLoad === "function") {
        onLoad();
      }

    } catch (error) {
      console.error(error);
      target.innerHTML = "<!-- erro ao carregar componente -->";
    }
  }

  // HEADER
  loadComponent({
    url: "includes/header.html",
    targetId: "header-placeholder",
    onLoad: () => {
      if (typeof initHeader === "function") {
        initHeader();
      }
    }
  });

  // FOOTER
  loadComponent({
    url: "includes/footer.html",
    targetId: "footer-placeholder"
  });

});
