// =============================
// RESUMO DO CARRINHO
// =============================

function carregarResumo() {
  const carrinho = getCarrinho();
  const container = document.getElementById("resumo");

  if (!container) return;

  container.innerHTML = "";

  carrinho.forEach(item => {
    container.innerHTML += `
      <div class="item-resumo">
        <p>${item.nome}</p>
        <span>${item.quantidade}x - R$ ${item.preco.toFixed(2)}</span>
      </div>
    `;
  });

  document.getElementById("total").innerText =
    "R$ " + calcularTotal().toFixed(2);
}

// =============================
// FINALIZAR PEDIDO (WHATSAPP)
// =============================

function finalizarPedido() {
  const carrinho = getCarrinho();

  let msg = "🛒 Pedido F PAC STORE:%0A%0A";

  carrinho.forEach(item => {
    msg += `• ${item.nome} (${item.quantidade}x) - R$ ${item.preco}%0A`;
  });

  msg += `%0A💰 Total: R$ ${calcularTotal().toFixed(2)}`;

  const url = `https://wa.me/55SEUNUMEROAQUI?text=${msg}`;

  localStorage.removeItem("fpacCarrinho");
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", carregarResumo);
