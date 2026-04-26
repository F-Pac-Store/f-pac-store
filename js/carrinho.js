// =============================
// CARRINHO GLOBAL - F PAC STORE
// =============================

function getCarrinho() {
  return JSON.parse(localStorage.getItem('fpacCarrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('fpacCarrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
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
// ALTERAR QUANTIDADE (+ / -)
// =============================
function alterarQuantidade(id, tamanho, cor, delta) {
  const carrinho = getCarrinho();

  const item = carrinho.find(p =>
    p.id === id &&
    p.tamanho === tamanho &&
    p.cor === cor
  );

  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    removerItem(id, tamanho, cor);
    return;
  }

  salvarCarrinho(carrinho);
  renderCarrinho();
}

// =============================
// REMOVER ITEM (COM ANIMAÇÃO)
// =============================
function removerItem(id, tamanho, cor) {
  const key = `${id}-${tamanho}-${cor}`;
  const el = document.querySelector(`[data-id="${key}"]`);

  const removerDoStorage = () => {
    const carrinho = getCarrinho().filter(item =>
      !(item.id === id && item.tamanho === tamanho && item.cor === cor)
    );

    salvarCarrinho(carrinho);
    renderCarrinho();
  };

  if (el) {
    el.style.transition = "all 0.3s ease";
    el.style.opacity = "0";
    el.style.transform = "translateX(30px)";

    setTimeout(removerDoStorage, 300);
  } else {
    removerDoStorage();
  }
}

// =============================
// CONTADOR CARRINHO
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

    const key = `${item.id}-${item.tamanho}-${item.cor}`;

    lista.innerHTML += `
      <div data-id="${key}"
           style="display:flex; gap:15px; margin-bottom:20px; align-items:center;">

        <img src="${item.imagem || 'imagens/sem-foto.png'}"
             style="width:80px;height:80px;object-fit:contain;background:#f5f5f5;padding:5px;border-radius:8px;">

        <div style="flex:1;">
          <strong>${item.nome}</strong><br>
          ${item.cor ? "Cor: " + item.cor + "<br>" : ""}
          ${item.tamanho ? "Tamanho: " + item.tamanho + "<br>" : ""}

          <div style="display:flex;align-items:center;gap:8px;margin-top:5px;">
            <button onclick="alterarQuantidade('${item.id}','${item.tamanho}','${item.cor}',-1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade('${item.id}','${item.tamanho}','${item.cor}',1)">+</button>
          </div>

          <br>
          ${(preco * item.quantidade).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}
        </div>

        <button onclick="removerItem('${item.id}','${item.tamanho}','${item.cor}')">
          X
        </button>

      </div>
    `;
  });

  if (totalEl) {
    totalEl.innerText = "Total: " + total.toLocaleString('pt-BR',{
      style:'currency',
      currency:'BRL'
    });
  }

  atualizarContadorCarrinho();
}

// =============================
// FRETE POR CEP (TEMPO REAL)
// =============================

async function calcularFrete() {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  const resultado = document.getElementById('freteResultado');

  if (cep.length !== 8) {
    resultado.innerHTML = "CEP inválido";
    return;
  }

  resultado.innerHTML = "Calculando...";

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      resultado.innerHTML = "CEP não encontrado";
      return;
    }

    const uf = data.uf;
    const frete = definirFrete(uf);

    localStorage.setItem('fpacFrete', frete);

    resultado.innerHTML = `
      📍 ${data.localidade} - ${uf}<br>
      🚚 Frete: <strong>${frete.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>
    `;

    atualizarTotalComFrete();

  } catch (err) {
    resultado.innerHTML = "Erro ao calcular frete";
  }
}

function definirFrete(uf) {
  const sul = ["PR", "SC", "RS"];
  const sudeste = ["SP", "RJ", "MG", "ES"];

  const resto = [
    "BA","GO","DF","MT","MS",
    "AM","PA","CE","PE","MA","RN","PB","PI","AL","SE","TO","AC","AP","RO","RR"
  ];

  if (sul.includes(uf)) return 9.90;
  if (sudeste.includes(uf)) return 14.90;
  if (resto.includes(uf)) return 19.90;

  return 24.90;
}

function atualizarTotalComFrete() {
  const carrinho = getCarrinho();

  let subtotal = 0;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    subtotal += preco * item.quantidade;
  });

  const frete = Number(localStorage.getItem('fpacFrete')) || 0;

  const totalFinal = subtotal + frete;

  const totalEl = document.getElementById('totalFinal');

  if (totalEl) {
    totalEl.innerHTML = `
      Subtotal: ${subtotal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}<br>
      Frete: ${frete.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}<br>
      <strong>Total: ${totalFinal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>
    `;
  }
}

// =============================
// INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();
});
