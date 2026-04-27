// =============================
// CARRINHO GLOBAL F PAC
// =============================

const CARRINHO_KEY = "fpacCarrinho";

// ===== UTIL =====
function getCarrinho() {
  return JSON.parse(localStorage.getItem(CARRINHO_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
}

// ===== ADICIONAR ITEM =====
function adicionarItem(item) {
  const carrinho = getCarrinho();

  const index = carrinho.findIndex(i =>
    i.id === item.id &&
    JSON.stringify(i.variacao || {}) === JSON.stringify(item.variacao || {})
  );

  if (index >= 0) {
    carrinho[index].quantidade += item.quantidade;
  } else {
    carrinho.push(item);
  }

  salvarCarrinho(carrinho);
  atualizarBadge();
}

// ===== REMOVER ITEM =====
function removerItem(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  atualizarBadge();
}

// ===== ATUALIZAR QUANTIDADE =====
function atualizarQuantidade(index, quantidade) {
  const carrinho = getCarrinho();

  if (!carrinho[index]) return;

  if (quantidade <= 0) {
    carrinho.splice(index, 1);
  } else {
    carrinho[index].quantidade = quantidade;
  }

  salvarCarrinho(carrinho);
  atualizarBadge();
}

// ===== TOTAL =====
function calcularTotal() {
  return getCarrinho().reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
}

// ===== BADGE DO MENU =====
function atualizarBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const totalItens = getCarrinho().reduce((s,i)=>s+i.quantidade,0);
  badge.innerText = totalItens;
}
