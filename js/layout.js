function carregarLayout() {
  fetch("inclui/header.html")
    .then(res => res.text())
    .then(html => document.getElementById("header-placeholder").innerHTML = html);

  fetch("inclui/footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer-placeholder").innerHTML = html);
}

document.addEventListener("DOMContentLoaded", carregarLayout);
