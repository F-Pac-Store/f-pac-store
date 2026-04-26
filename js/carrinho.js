
// =============================
// BASE CARRINHO
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
  window.location.href = "carrinho.html";
}

// =============================
// ALTERAR QUANTIDADE
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
// REMOVER ITEM COM ANIMAÇÃO
// =============================

function removerItem(id, tamanho, cor) {
  const key = `${id}-${tamanho}-${cor}`;
  const el = document.querySelector(`[data-id="${key}"]`);

  const remover = () => {
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
    setTimeout(remover, 300);
  } else {
    remover();
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
// JOINVILLE BASE
// =============================

const JOINVILLE = {
  lat: -26.3475,
  lon: -48.8475
};

// =============================
// GEO VIA CEP
// =============================

async function getCoordsFromCEP(cep) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await res.json();

  if (data.erro) return null;

  const query = `${data.localidade}, ${data.uf}, Brasil`;

  const geo = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );

  const result = await geo.json();

  if (!result || result.length === 0) return null;

  return {
    lat: parseFloat(result[0].lat),
    lon: parseFloat(result[0].lon),
    cidade: data.localidade,
    uf: data.uf
  };
}

// =============================
// DISTÂNCIA HAVERSINE
// =============================

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// =============================
// FRETE POR KM
// =============================

function calcularFretePorKm(distancia) {
  if (distancia <= 5) return 9.43;
  if (distancia <= 10) return 12.74;
  if (distancia <= 15) return 16.12;
  if (distancia <= 20) return 19.09;
   if (distancia <= 50) return 24.85;
   if (distancia <= 100) return 29.78;
   if (distancia <= 200) return 39.90;
   if (distancia <= 400) return 39.90;
  if (distancia <= 800) return 39.90;
  return 49.90;
}

// =============================
// RENDER CARRINHO
// =============================

function renderCarrinho() {
  const lista = document.getElementById('lista');
  const totalEl = document.getElementById('totalFinal');

  if (!lista) return;

  const carrinho = getCarrinho();
  lista.innerHTML = "";

  let subtotal = 0;

  carrinho.forEach(item => {
    const preco = Number(item.preco) || 0;
    subtotal += preco * item.quantidade;

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
          ${(preco * item.quantidade).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
        </div>

        <button onclick="removerItem('${item.id}','${item.tamanho}','${item.cor}')">X</button>
      </div>
    `;
  });

  let frete = Number(localStorage.getItem('fpacFrete')) || 0;

  // FRETE GRÁTIS INTELIGENTE
  const FRETE_GRATIS_MINIMO = 200;

  if (subtotal >= FRETE_GRATIS_MINIMO) {
    frete = 0;
  }

  const totalFinal = subtotal + frete;

  const freteTexto = frete === 0
    ? "GRÁTIS 🎉"
    : frete.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

  if (totalEl) {
    totalEl.innerHTML = `
      Subtotal: ${subtotal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}<br>
      Frete: <strong>${freteTexto}</strong><br>
      <strong>Total: ${totalFinal.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>
    `;
  }

  atualizarContadorCarrinho();
}

// =============================
// FRETE AUTOMÁTICO
// =============================

let timeoutFrete;

document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();

  const cepInput = document.getElementById('cep');
  if (!cepInput) return;

  cepInput.addEventListener('input', () => {
    let cep = cepInput.value.replace(/\D/g, '');
    cepInput.value = cep;

    const resultado = document.getElementById('freteResultado');

    if (cep.length < 8) {
      resultado.innerHTML = "";
      localStorage.removeItem('fpacFrete');
      renderCarrinho();
      return;
    }

    clearTimeout(timeoutFrete);

    timeoutFrete = setTimeout(() => {
      calcularFreteAuto(cep);
    }, 600);
  });
});

// =============================
// FRETE INTELIGENTE
// =============================

async function calcularFreteAuto(cep) {
  const resultado = document.getElementById('freteResultado');

  resultado.innerHTML = "Calculando frete...";

  const origem = await getCoordsFromCEP(cep);

  if (!origem) {
    resultado.innerHTML = "CEP inválido";
    return;
  }

  const distancia = calcularDistanciaKm(
    JOINVILLE.lat,
    JOINVILLE.lon,
    origem.lat,
    origem.lon
  );

  const frete = calcularFretePorKm(distancia);

  localStorage.setItem('fpacFrete', frete);

  resultado.innerHTML = `
    📍 ${origem.cidade} - ${origem.uf}<br>
    📏 ${distancia.toFixed(1)} km<br>
    🚚 Frete: <strong>${frete.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>
  `;

  renderCarrinho();
}
