// =============================
// STORAGE
// =============================

function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('fpacCarrinho', JSON.stringify(carrinho));
}

// =============================
// ADICIONAR ITEM (COM VARIAÇÃO)
// =============================

function adicionarItem(item) {
  const carrinho = getCarrinho();

  const existente = carrinho.find(p =>
    p.id === item.id &&
    p.cor === item.cor &&
    p.tamanho === item.tamanho
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

function removerItem(id, cor, tamanho) {
  const carrinho = getCarrinho().filter(item =>
    !(item.id === id && item.cor === cor && item.tamanho === tamanho)
  );

  salvarCarrinho(carrinho);
  renderCarrinho();
  atualizarContadorCarrinho();
}

// =============================
// CONTADOR
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

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    total += preco * item.quantidade;

    lista.innerHTML += `
      <div>
        <strong>${item.nome}</strong><br>
        ${item.cor ? "Cor: " + item.cor + "<br>" : ""}
        ${item.tamanho ? "Tamanho: " + item.tamanho + "<br>" : ""}
        Qtd: ${item.quantidade}<br>
        ${ (preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
        <br>
        <button onclick="removerItem('${item.id}', '${item.cor}', '${item.tamanho}')">
          Remover
        </button>
        <hr>
      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: " + total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  atualizarContadorCarrinho();
}

// =============================
// INIT
// =============================

document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();
});
