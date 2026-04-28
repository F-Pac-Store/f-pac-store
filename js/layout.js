document.addEventListener("DOMContentLoaded", () => {

  const load = async (url, targetId, callback) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const res = await fetch(url);
      const html = await res.text();
      target.innerHTML = html;

      if (callback) callback();
    } catch (e) {
      console.error(e);
    }
  };

  load("includes/header.html", "header-placeholder", () => {
    // SOMENTE depois que o header existe
    if (typeof initHeader === "function") {
      initHeader();
    }
  });

  load("includes/footer.html", "footer-placeholder");
});
