const header=document.getElementById("header");
const menu=document.getElementById("mobileMenu");
const overlay=document.getElementById("overlay");

function openMenu(){
  menu.classList.add("active");
  overlay.classList.add("active");
}

function closeMenu(){
  menu.classList.remove("active");
  overlay.classList.remove("active");
}

window.addEventListener("scroll",()=>{
  header.classList.toggle("shrink",window.scrollY>80);
});

function atualizarCarrinho(){
  const carrinho=JSON.parse(localStorage.getItem("fpacCarrinho"))||[];
  const badge=document.getElementById("cartCount");
  if(badge) badge.innerText=carrinho.length;
}
atualizarCarrinho();
