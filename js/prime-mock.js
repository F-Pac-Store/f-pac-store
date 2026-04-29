let quantidade = 1;
let etapaAtual = 1;

const estampas = {
  1: document.querySelector('.mock-estampa.e1'),
  2: document.querySelector('.mock-estampa.e2'),
  3: document.querySelector('.mock-estampa.e3')
};

const stepTitle = document.getElementById("step-title");

// QUANTIDADE
document.querySelectorAll('.quantidade button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.quantidade button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    quantidade = parseInt(btn.dataset.qtd);
    etapaAtual = 1;

    resetEstampas();
    mostrarEstampas();
    atualizarTitulo();
  });
});

// POSIÇÕES
document.querySelectorAll('.posicoes button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    aplicarPosicao(btn.dataset.pos);
  });
});

function resetEstampas(){
  Object.values(estampas).forEach(e=>{
    e.className = 'mock-estampa hidden';
  });
}

function mostrarEstampas(){
  for(let i=1;i<=quantidade;i++){
    estampas[i].classList.remove('hidden');
  }
}

function aplicarPosicao(posicao){
  if(etapaAtual > quantidade) return;

  const estampa = estampas[etapaAtual];
  estampa.className = `mock-estampa e${etapaAtual} ${posicao}`;

  etapaAtual++;
  atualizarTitulo();
}

function atualizarTitulo(){
  if(etapaAtual <= quantidade){
    stepTitle.innerText = `2. Posição da estampa ${etapaAtual}`;
  }else{
    stepTitle.innerText = "Configuração completa";
  }
}
