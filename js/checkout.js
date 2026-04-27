// =============================
// CHECKOUT F PAC (OFICIAL)
// =============================

// ===== FRETE POR BAIRRO =====
const fretePorBairro = {
  "Paranaguamirim": 5,
  "Adhemar Garcia": 5,
  "Ulysses Guimarães": 6,
  "Floresta": 8
};

// ===== PEDIDO =====
function gerarPedido() {
  const agora = new Date();
  return {
    codigo: "FP" + Date.now().toString().slice(-6),
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR')
  };
}

// ===== RESUMO =====
function renderResumoCheckout() {
  const carrinho = getCarrinho();
  const el = document.getElementById('resumoPedido');
  const totalEl = document.getElementById('totalPedido');

  if (!el || carrinho.length === 0) {
    el.innerHTML = "Carrinho vazio";
    return;
  }

  let html = "";
  carrinho.forEach(item => {
    const totalItem = item.preco * item.quantidade;
    html += `
      <div>
        ${item.nome} (${item.quantidade}x) — R$ ${totalItem.toFixed(2)}
      </div>
    `;
  });

  el.innerHTML = html;
  totalEl.innerText = "R$ " + calcularTotal().toFixed(2);
}

// ===== FINALIZAR =====
function confirmarCheckout() {
  const nome = nomeEl.value.trim();
  const whatsapp = whatsappEl.value.trim();
  const bairro = bairroEl.value.trim();
  const rua = ruaEl.value.trim();
  const numero = numeroEl.value.trim();
  const obs = obsEl.value;

  if (!nome || !whatsapp || !bairro || !rua || !numero) {
    erroEl.style.display = "block";
    return;
  }

  const carrinho = getCarrinho();
  const pedido = gerarPedido();

  let total = calcularTotal();
  const frete = fretePorBairro[bairro] || 10;
  total += frete;

  let msg = `🛒 *NOVO PEDIDO F PAC*\n\n`;
  msg += `📦 Pedido ${pedido.codigo}\n`;
  msg += `📅 ${pedido.data} ${pedido.hora}\n\n`;

  carrinho.forEach(item => {
    msg += `• ${item.nome} (${item.quantidade}x)\n`;
  });

  msg += `\n🚚 Frete: R$ ${frete.toFixed(2)}`;
  msg += `\n💰 Total: R$ ${total.toFixed(2)}\n\n`;
  msg += `👤 ${nome}\n📱 ${whatsapp}\n`;
  msg += `📍 ${rua}, ${numero} - ${bairro}\n`;

  if (obs) msg += `📝 ${obs}\n`;
  msg += `\n💳 Pagamento via PIX`;

  const numeroLoja = "5547997465602";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;

  setTimeout(() => {
    window.open(url, "_blank");
    localStorage.removeItem("fpacCarrinho");
    window.location.href = "index.html";
  }, 800);
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  renderResumoCheckout();
});
``
