document.addEventListener("DOMContentLoaded", () => {

  const load = (url, targetId) => {
    const target = document.getElementById(targetId);

    if (!target) {
      console.warn(`Placeholder #${targetId} não encontrado`);
      return;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro ao carregar ${url}`);
        }
        return res.text();
      })
      .then(html => {
        target.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
      });
  };

  load("includes/header.html", "header-placeholder");
  load("includes/footer.html", "footer-placeholder");

});
