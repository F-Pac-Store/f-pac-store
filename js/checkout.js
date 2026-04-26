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
// FRETE POR BAIRRO
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
// RESUMO DO CARRINHO
// =============================
function renderResumo() {
  const carrinho = getCarrinho();
  const el = document.getElementById('resumoPedido');

  if (!el) return;

  if (carrinho.length === 0) {
    el.innerHTML = "<p>Carrinho vazio</p>";
    return;
  }

  let total = 0;
  let html = "";

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    html += `
      <div style="margin-bottom:8px;">
        ${item.nome} - Qtd: ${item.quantidade}
      </div>
    `;
  });

  html += `<hr><strong>Total produtos: R$ ${total.toFixed(2)}</strong>`;
  el.innerHTML = html;
}

// =============================
// AUTO PREENCHER CLIENTE
// =============================
function preencherCliente() {
  const c = getCliente();

  if (!c.nome) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  set('nome', c.nome);
  set('whatsapp', c.whatsapp);
  set('bairro', c.bairro);
  set('rua', c.rua);
  set('numero', c.numero);
}

// =============================
// FINALIZAR PEDIDO
// =============================
function confirmarCheckout() {

  const nome = document.getElementById('nome')?.value.trim();
  const whatsapp = document.getElementById('whatsapp')?.value.trim();
  const bairro = document.getElementById('bairro')?.value.trim();
  const rua = document.getElementById('rua')?.value.trim();
  const numero = document.getElementById('numero')?.value.trim();
  const obs = document.getElementById('obs')?.value || "";

  if (!nome || !whatsapp || !bairro || !rua || !numero) {
    const erro = document.getElementById('erro');
    if (erro) erro.style.display = "block";
    return;
  }

  const carrinho = getCarrinho();

  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const pedido = gerarPedido();

  let total = 0;
  let msg = `🛒 *NOVO PEDIDO*\n\n`;

  msg += `📦 Pedido: ${pedido.codigo}\n`;
  msg += `📅 ${pedido.data} ${pedido.hora}\n\n`;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    msg += `• ${item.nome}\nQtd: ${item.quantidade}\n\n`;
  });

  // FRETE
  const frete = fretePorBairro[bairro] ?? 10;
  total += frete;

  msg += `🚚 Frete: R$ ${frete.toFixed(2)}\n`;
  msg += `💰 Total: R$ ${total.toFixed(2)}\n\n`;

  msg += `👤 ${nome}\n📱 ${whatsapp}\n`;
  msg += `📍 ${rua}, ${numero} - ${bairro}\n`;

  if (obs) msg += `📝 Obs: ${obs}\n`;

  msg += `\n💳 Pagamento via PIX`;

  const numeroLoja = "5547997465602";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;

  salvarCliente({ nome, whatsapp, bairro, rua, numero });

  const ok = document.getElementById('mensagemEnviada');
  if (ok) ok.style.display = "block";

  setTimeout(() => {
    window.open(url, "_blank");
    localStorage.removeItem('fpacCarrinho');
    window.location.href = "index.html";
  }, 1000);
}

// =============================
// INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
  renderResumo();
  preencherCliente();
});
