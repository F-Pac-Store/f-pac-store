// =============================
// BASE
// =============================
function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCliente(cliente) {
  localStorage.setItem('fpacCliente', JSON.stringify(cliente));
}

function getCliente() {
  return JSON.parse(localStorage.getItem('fpacCliente')) || {};
}

// =============================
// FRETE POR BAIRRO (AJUSTA AQUI)
// =============================
const fretePorBairro = {
  "Paranaguamirim": 5,
  "Adhemar Garcia": 5,
  "Ulysses Guimarães": 6,
  "Floresta": 8
};

// =============================
// PEDIDO
// =============================
function gerarPedido() {
  const agora = new Date();
  return {
    codigo: "FP" + Date.now().toString().slice(-6),
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR')
  };
}

// =============================
// RESUMO
// =============================
function renderResumo() {
  const carrinho = getCarrinho();
  const el = document.getElementById('resumoPedido');

  if (!el || carrinho.length === 0) {
    el.innerHTML = "Carrinho vazio";
    return;
  }

  let total = 0;
  let html = "";

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    html += `<div>${item.nome} - Qtd: ${item.quantidade}</div>`;
  });

  html += `<div class="total">Total: R$ ${total.toFixed(2)}</div>`;
  el.innerHTML = html;
}

// =============================
// AUTO PREENCHER
// =============================
function preencherCliente() {
  const c = getCliente();

  if (!c.nome) return;

  document.getElementById('nome').value = c.nome || "";
  document.getElementById('whatsapp').value = c.whatsapp || "";
  document.getElementById('bairro').value = c.bairro || "";
  document.getElementById('rua').value = c.rua || "";
  document.getElementById('numero').value = c.numero || "";
}

// =============================
// FINALIZAR
// =============================
function confirmarCheckout() {

  const nome = document.getElementById('nome').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const rua = document.getElementById('rua').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const obs = document.getElementById('obs').value;

  if (!nome || !whatsapp || !bairro || !rua || !numero) {
    document.getElementById('erro').style.display = "block";
    return;
  }

  const carrinho = getCarrinho();
  const pedido = gerarPedido();

  let total = 0;
  let msg = `🛒 *NOVO PEDIDO*\n\n`;

  msg += `📦 Pedido: ${pedido.codigo}\n`;
  msg += `📅 ${pedido.data} ${pedido.hora}\n\n`;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    msg += `• ${item.nome}\nQtd: ${item.quantidade}\n`;
  });

  // FRETE
  const frete = fretePorBairro[bairro] || 10;
  total += frete;

  msg += `\n🚚 Frete: R$ ${frete.toFixed(2)}\n`;
  msg += `💰 Total: R$ ${total.toFixed(2)}\n\n`;

  msg += `👤 ${nome}\n📱 ${whatsapp}\n`;
  msg += `📍 ${rua}, ${numero} - ${bairro}\n`;

  if (obs) msg += `📝 ${obs}\n`;

  // PIX
  msg += `\n💳 Pagamento via PIX\n`;

  const numeroLoja = "5547997465602";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;

  salvarCliente({ nome, whatsapp, bairro, rua, numero });

  document.getElementById('mensagemEnviada').style.display = "block";

  setTimeout(() => {
    window.open(url, "_blank");
    localStorage.removeItem('fpacCarrinho');
    window.location.href = "index.html";
  }, 1200);
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  renderResumo();
  preencherCliente();
});
