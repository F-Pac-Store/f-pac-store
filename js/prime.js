const estadoPrime = {
  quantidade: null,
  posicao: null,
  acabamento: null
};

document.querySelectorAll(".prime-options").forEach(grupo => {
  const step = grupo.dataset.step;

  grupo.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      grupo.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      estadoPrime[step] = btn.dataset.value;
      validarPrime();
    });
  });
});

function validarPrime(){
  const ok = Object.values(estadoPrime).every(v => v);
  const btn = document.getElementById("btnFinalizar");

  btn.disabled = !ok;

  if(ok){
    btn.onclick = enviarWhats();
  }
}

function enviarWhats(){
  const msg =
    `Olá! Quero criar uma PRIME:\n\n` +
    `• Estampas: ${estadoPrime.quantidade}\n` +
    `• Posição: ${estadoPrime.posicao}\n` +
    `• Acabamento: ${estadoPrime.acabamento}`;

  return () => {
    window.open(
      "https://wa.me/5547997465602?text=" +
      encodeURIComponent(msg),
      "_blank"
    );
  };
}
