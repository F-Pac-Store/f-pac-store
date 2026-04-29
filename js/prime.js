// =============================
// PRIME → CARRINHO F PAC STORE
// =============================

const estadoPrime = {
  quantidade: null,
  posicao: null,
  acabamento: null
};

// ATIVA SELEÇÃO VISUAL
document.querySelectorAll(".prime-options").forEach(grupo => {
  const step = grupo.dataset.step;

  grupo.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      grupo.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      estadoPrime[step] = btn.dataset.value;
      validarPrime();
    });
  });
});

// VALIDA SE TODAS AS ETAPAS ESTÃO OK
function validarPrime(){
  const ok = Object.values(estadoPrime).every(v => v);
  const btn = document.getElementById("btnAdicionarCarrinho");

  btn.disabled = !ok;

  if(ok){
    btn.onclick = adicionarPrimeAoCarrinho;
  }
}

// ADICIONAR AO CARRINHO
function adicionarPrimeAoCarrinho(){

  const itemPrime = {
    id: "prime",
    nome: "Camisa PRIME Personalizada",
    preco: 129.90, // você pode ajustar depois
    quantidade: 1,
    variacao: {
      estampas: estadoPrime.quantidade,
      posicao: estadoPrime.posicao,
      acabamento: estadoPrime.acabamento
    }
  };

  adicionarItem(itemPrime);

  alert("PRIME adicionada ao carrinho!");
}
