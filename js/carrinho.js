function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('fpacCarrinho', JSON.stringify(carrinho));
}

function adicionarItem(item) {
  const carrinho = getCarrinho();
  carrinho.push(item);
  salvarCarrinho(carrinho);
  atualizarContadorCarrinho();
  window.location.href = "carrinho.html";
}

function removerItem(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  location.reload();
}

function atualizarContadorCarrinho() {
  const carrinho = getCarrinho();
  const total = carrinho.reduce((s, i) => s + i.quantidade, 0);
  const el = document.getElementById('carrinhoQtd');
  if (el) {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);
