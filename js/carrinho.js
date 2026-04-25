// =============================
// CARRINHO GLOBAL PROFISSIONAL
// =============================

function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('fpacCarrinho', JSON.stringify(carrinho));
}

function adicionarItem(item) {
  const carrinho = getCarrinho();

  const existente = carrinho.find(p => p.id === item.id);

  if (existente) {
    existente.quantidade += item.quantidade;
  } else {
    carrinho.push(item);
  }

  salvarCarrinho(carrinho);
  atualizarContadorCarrinho();

  window.location.href = "carrinho.html";
}

function removerItem(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderCarrinho();
}

// =============================
// CONTADOR GLOBAL
// =============================

function atualizarContadorCarrinho() {
  const carrinho = getCarrinho();
  const total = carrinho.reduce((s, i) => s + i.quantidade, 0);

  const el = document.getElementById('carrinhoQtd');
  if (el) {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-block' : 'none';
  }
}

// =============================
// RENDER CARRINHO
// =============================

function renderCarrinho() {
  const lista = document.getElementById('lista');
  const totalEl = document.getElementById('total');

  if (!lista) return;

  const carrinho = getCarrinho();
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    total += item.preco * item.quantidade;

    lista.innerHTML += `
      <div>
        <strong>${item.nome}</strong><br>
        ${item.cor ? "Cor: " + item.cor + "<br>" : ""}
        ${item.tamanho ? "Tamanho: " + item.tamanho + "<br>" : ""}
        Qtd: ${item.quantidade}<br>
        R$ ${(item.preco * item.quantidade).toFixed(2)}
        <br>
        <button onclick="removerItem(${i})">Remover</button>
        <hr>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: R$ " + total.toFixed(2);
  }
}

// =============================
// PEDIDO PROFISSIONAL
// =============================

function gerarPedido() {
  const agora = new Date();

  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR');

  const codigo = "FP" + agora.getTime().toString().slice(-6);

  return { data, hora, codigo };
}

// =============================
// FINALIZAR WHATSAPP
// =============================

function finalizarWhatsApp() {

  const carrinho = getCarrinho();

  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const pedido = gerarPedido();

  let msg = `🛒 *NOVO PEDIDO*\n\n`;
  msg += `📦 Pedido: ${pedido.codigo}\n`;
  msg += `📅 Data: ${pedido.data} ${pedido.hora}\n\n`;

  let total = 0;

  carrinho.forEach(item => {
    msg += `• ${item.nome}\n`;
    if (item.cor) msg += `Cor: ${item.cor}\n`;
    if (item.tamanho) msg += `Tam: ${item.tamanho}\n`;

    msg += `Qtd: ${item.quantidade}\n`;
    msg += `R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;

    total += item.preco * item.quantidade;
  });

  msg += `💰 Total: R$ ${total.toFixed(2)}\n\n`;
  msg += `📍 Nome:\n📦 Endereço:\n💳 Pagamento:`;

  const numero = "5547997465602";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");

  salvarHistoricoPedido({ pedido, carrinho, total });

  localStorage.removeItem('fpacCarrinho');
  renderCarrinho();
}

// =============================
// HISTÓRICO DE PEDIDOS
// =============================

function salvarHistoricoPedido(dados) {
  const historico = JSON.parse(localStorage.getItem('fpacPedidos')) || [];
  historico.push(dados);
  localStorage.setItem('fpacPedidos', JSON.stringify(historico));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();
});
