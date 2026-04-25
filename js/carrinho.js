// =============================
// CARRINHO GLOBAL - F PAC STORE
// =============================

function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('fpacCarrinho', JSON.stringify(carrinho));
}

// =============================
// ADICIONAR ITEM
// =============================
function adicionarItem(item) {
  const carrinho = getCarrinho();

  const existente = carrinho.find(p =>
    p.id === item.id &&
    p.tamanho === item.tamanho &&
    p.cor === item.cor
  );

  if (existente) {
    existente.quantidade += item.quantidade;
  } else {
    carrinho.push(item);
  }

  salvarCarrinho(carrinho);
  atualizarContadorCarrinho();

  window.location.href = "carrinho.html";
}

// =============================
// REMOVER ITEM
// =============================
function removerItem(id) {
  const carrinho = getCarrinho().filter(item => item.id !== id);
  salvarCarrinho(carrinho);
  renderCarrinho();
}

// =============================
// CONTADOR
// =============================
function atualizarContadorCarrinho() {
  const carrinho = getCarrinho();
  const total = carrinho.reduce((s, i) => s + i.quantidade, 0);

  document.querySelectorAll('#carrinhoQtd').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-block' : 'none';
  });
}

// =============================
// RENDER
// =============================
function renderCarrinho() {
  const lista = document.getElementById('lista');
  const totalEl = document.getElementById('total');

  if (!lista) return;

  const carrinho = getCarrinho();
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    lista.innerHTML += `
      <div>
        <strong>${item.nome}</strong><br>
        ${item.cor ? "Cor: " + item.cor + "<br>" : ""}
        ${item.tamanho ? "Tamanho: " + item.tamanho + "<br>" : ""}
        Qtd: ${item.quantidade}<br>
        ${ (preco * item.quantidade).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) }
        <br>
        <button onclick="removerItem('${item.id}')">Remover</button>
        <hr>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: " + total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  }

  atualizarContadorCarrinho();
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();
});
