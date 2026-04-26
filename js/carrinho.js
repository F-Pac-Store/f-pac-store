// =============================
// CARRINHO GLOBAL
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
  let carrinho = getCarrinho();

  const index = carrinho.findIndex(i =>
    i.id === item.id &&
    JSON.stringify(i.variacao) === JSON.stringify(item.variacao)
  );

  if (index >= 0) {
    carrinho[index].quantidade += item.quantidade;
  } else {
    carrinho.push(item);
  }

  salvarCarrinho(carrinho);
}

// =============================
// REMOVER ITEM
// =============================
function removerItem(index) {
  let carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
}

// =============================
// ATUALIZAR QUANTIDADE
// =============================
function atualizarQuantidade(index, quantidade) {
  let carrinho = getCarrinho();
  if (carrinho[index]) {
    carrinho[index].quantidade = quantidade;
  }
  salvarCarrinho(carrinho);
}

// =============================
// TOTAL
// =============================
function calcularTotal() {
  let carrinho = getCarrinho();
  return carrinho.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
}
