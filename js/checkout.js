function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function gerarPedido() {
  const agora = new Date();
  return {
    codigo: "FP" + Date.now(),
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

  if (!el || carrinho.length === 0) {
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
        Qtd: ${item.quantidade}<br>
      </div>
      <hr>
    `;
  });

  html += `<div class="total">Total: R$ ${total.toFixed(2)}</div>`;

  el.innerHTML = html;
}

// =============================
// VALIDAÇÃO
// =============================
function validar() {
  const nome = document.getElementById('nome').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const rua = document.getElementById('rua').value.trim();
  const numero = document.getElementById('numero').value.trim();

  return nome && whatsapp && bairro && rua && numero;
}

// =============================
// FINALIZAR
// =============================
function confirmarCheckout() {

  if (!validar()) {
    document.getElementById('erro').style.display = "block";
    return;
  }

  const btn = document.getElementById('btnFinalizar');
  btn.disabled = true;

  const carrinho = getCarrinho();
  const pedido = gerarPedido();

  const nome = document.getElementById('nome').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const bairro = document.getElementById('bairro').value;
  const rua = document.getElementById('rua').value;
  const numeroCasa = document.getElementById('numero').value;
  const obs = document.getElementById('obs').value;

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

  msg += `💰 Total: R$ ${total.toFixed(2)}\n\n`;

  msg += `👤 Cliente: ${nome}\n`;
  msg += `📱 WhatsApp: ${whatsapp}\n`;
  msg += `📍 Endereço: ${rua}, ${numeroCasa} - ${bairro}\n`;

  if (obs) msg += `📝 Obs: ${obs}\n`;

  const numeroLoja = "5547997465602";
  const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(msg)}`;

  document.getElementById('mensagemEnviada').style.display = "block";

  setTimeout(() => {
    window.open(url, "_blank");
    localStorage.removeItem('fpacCarrinho');
    window.location.href = "index.html";
  }, 1200);
}

// INIT
document.addEventListener('DOMContentLoaded', renderResumo);
