document.addEventListener("DOMContentLoaded", () => {

  const load = (url, targetId) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao carregar ${url}`);
        return res.text();
      })
      .then(html => {
        document.getElementById(targetId).innerHTML = html;
      })
      .catch(err => console.error(err));
  };

  load("includes/header.html", "header-placeholder");
  load("includes/footer.html", "footer-placeholder");

});
