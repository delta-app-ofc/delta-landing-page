document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-card');
  const cards = document.querySelectorAll('.card');
  const totalCardsOriginais = cards.length;
  const botaoVoltar = document.getElementById('botao-voltar');
  const botaoAvancar = document.getElementById('botao-avancar');

  const clone1 = cards[0].cloneNode(true);
  const clone2 = cards[cards.length-1].cloneNode(true);

  lista.appendChild(clone1);
  lista.insertBefore(clone2, cards[0]);
  const totalCardsComClones = document.querySelectorAll('.card').length;

  let contador = 1;
  let isAnimating = false;

  lista.style.transition = 'transform 0.4s ease-in-out ';
  lista.style.transform = `translateX(-${contador * 100}%)`;

  function atualizarCarrossel() {
    isAnimating = true;
    lista.style.transition = 'transform 0.4s ease-in-out ';
    lista.style.transform = `translateX(-${contador * 100}%)`;
  }

  botaoAvancar.addEventListener('click', () => {
  if (isAnimating) return;
  if (contador >= totalCardsComClones - 1) return;
  
  contador++;
  atualizarCarrossel();
  });

  botaoVoltar.addEventListener('click', () => {
    if (isAnimating) return;
    if (contador <= 0) return;
    
    contador--;
    atualizarCarrossel();
  });

  lista.addEventListener('transitionend', (e) => {
  if (e.target !== lista) return;
  
  if (contador === totalCardsComClones - 1) {
    lista.style.transition = 'none';
    contador = 1; 
    lista.style.transform = `translateX(-${contador * 100}%)`;
  }

  if (contador === 0) {
    lista.style.transition = 'none';
    contador = totalCardsOriginais; 
    lista.style.transform = `translateX(-${contador * 100}%)`;
  }

  isAnimating = false; 
  });
});