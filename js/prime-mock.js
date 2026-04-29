const mock = document.getElementById("mock-estampa");

document.querySelectorAll('.prime-options button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.prime-options button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    mock.className = `mock-estampa ${btn.dataset.value}`;
  });
});
