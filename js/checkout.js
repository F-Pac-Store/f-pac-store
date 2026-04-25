// =============================
// CARRINHO
// =============================

function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

// =============================
// FRETE POR BAIRRO
// =============================

const fretePorBairro = {
  "Paranaguamirim": 5,
  "Adhemar Garcia": 5,
  "Centro": 8
};

function calcularFrete(bairro) {
  return fretePorBairro[bairro] || 10;
}

// =============================
// CLIENTE (AUTO SAVE)
// =============================

function salvarCliente(cliente) {
  localStorage.setItem('fpacCliente', JSON.stringify(cliente));
}

function carregarCliente() {
  return JSON.parse(localStorage.getItem('fpacCliente')) || {};
}

// =============================
// GERAR PEDIDO
// =============================

function gerarPedido() {
  const agora = new Date();

  const codigo =
    "FP" +
    agora.toISOString().slice(2,10).replace(/-/g,'') +
    "-" +
    Math.floor(Math.random() * 1000);

  return {
    codigo,
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR')
  };
}

// =============================
// RENDER RESUMO
// =============================

function renderResumo() {
  const carrinho = getCarrinho();
  const el = document.getElementById('resumoPedido');

  if (!el) return;

  if (carrinho.length === 0) {
    el.innerHTML = "Carrinho vazio";
    return;
  }

  let html = "";
  let total = 0;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    html += `
      <div>
        <strong>${item.nome}</strong><br>
        Qtd: ${item.quantidade}
      </div>
      <hr>
    `;
  });

  html += `<div class="total">Total: R$ ${total.toFixed(2)}</div>`;

  el.innerHTML = html;
}

// =============================
// VALIDAR
// =============================

function validar() {
  const campos = ["nome", "whatsapp", "bairro", "rua", "numero"];

  return campos.every(id =>
    document.getElementById(id).value.trim() !== ""
  );
}

// =============================
// FINALIZAR PEDIDO
// =============================

function confirmarCheckout() {

  const btn = document.getElementById('btnFinalizar');
  if (btn.disabled) return;

  if (!validar()) {
    document.getElementById('erro').style.display = "block";
    return;
  }

  btn.disabled = true;

  const carrinho = getCarrinho();
  const pedido = gerarPedido();

  const nome = document.getElementById('nome').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const bairro = document.getElementById('bairro').value;
  const rua = document.getElementById('rua').value;
  const numeroCasa = document.getElementById('numero').value;
  const obs = document.getElementById('obs').value;

  const frete = calcularFrete(bairro);

  let msg = `🛒 *NOVO PEDIDO*\n\n`;
  msg += `📦 Pedido: ${pedido.codigo}\n`;
  msg += `📅 ${pedido.data} ${pedido.hora}\n\n`;

  let total = 0;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;

    msg += `• ${item.nome}\n`;
    msg += `Qtd: ${item.quantidade}\n`;
    msg += `R$ ${(preco * item.quantidade).toFixed(2)}\n\n`;

    total += preco * item.quantidade;
  });

  msg += `🚚 Frete: R$ ${frete.toFixed(2)}\n`;

  total += frete;

  msg += `💰 Total: R$ ${total.toFixed(2)}\n\n`;

  msg += `👤 ${nome}\n`;
  msg += `📱 ${whatsapp}\n`;
  msg += `📍 ${rua}, ${numeroCasa} - ${bairro}\n`;

  if (obs) msg += `📝 ${obs}\n`;

  // PIX
  msg += `\n💳 PIX: 47997465602\n👤 F Pac Store`;

  // SALVAR CLIENTE
  salvarCliente({ nome, whatsapp, bairro, rua, numeroCasa });

  const numeroLoja = "5547997465602";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;

  document.getElementById('mensagemEnviada').style.display = "block";

  setTimeout(() => {
    window.open(url, "_blank");
    localStorage.removeItem('fpacCarrinho');
    window.location.href = "index.html";
  }, 1200);
}

// =============================
// AUTO PREENCHER
// =============================

document.addEventListener('DOMContentLoaded', () => {
  renderResumo();

  const cliente = carregarCliente();

  if (cliente.nome) {
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('whatsapp').value = cliente.whatsapp;
    document.getElementById('bairro').value = cliente.bairro;
    document.getElementById('rua').value = cliente.rua;
    document.getElementById('numero').value = cliente.numeroCasa;
  }
});
