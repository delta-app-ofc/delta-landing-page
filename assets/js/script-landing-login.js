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







  
  const abrirModalBtn = document.querySelector('#minha-conta');
  const fecharModalBtn = document.querySelector('#close-modal');
  const modal = document.querySelector("#modal");
  const fade = document.querySelector("#fade");
  const toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
  };
   [abrirModalBtn, fecharModalBtn, fade].forEach((elemento) => {
    if (elemento) {
      elemento.addEventListener("click", () => toggleModal());
    }
    });

    modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });







  const indicador = document.querySelector('.indicador');
  const topicos = document.querySelectorAll('.topico');
  const secoes = document.querySelectorAll('.secao');

  function moverIndicador(elemento) {
    indicador.style.top = elemento.offsetTop + 'px';
    indicador.style.left = elemento.offsetLeft + 'px';
    indicador.style.height = elemento.offsetHeight + 'px';
    indicador.style.width = elemento.offsetWidth + 'px';
  }

  function getIdSecao(topico) {
    return topico.dataset.secao.replace('subtitulo-', 'secao-');
  }

  window.addEventListener('DOMContentLoaded', () => {
    const ativo = document.querySelector('.topico.active');
    if (ativo) moverIndicador(ativo);
  });

  topicos.forEach(topico => {
    topico.addEventListener('click', () => {
      topicos.forEach(t => t.classList.remove('active'));
      topico.classList.add('active');

      moverIndicador(topico);

      secoes.forEach(secao => secao.style.display = 'none');
      document.getElementById(getIdSecao(topico)).style.display = 'block';
    });
  });






  const fadeMenor = document.getElementById('fade-menor');
  const modalMenor = document.getElementById('modal-menor');
  const botaoCloseMenor = document.getElementById('close-modal-menor');
  const botaoCancelar = document.getElementById('botao-cancelar');
  const botaoSair = document.getElementById('botao-sair');
  const botaoAbrir = document.getElementById('sair-da-conta');

  function toggleModalMenor() {
    fadeMenor.classList.toggle('hide');
    modalMenor.classList.toggle('hide');
  }

  if (botaoAbrir) {
    botaoAbrir.addEventListener('click', toggleModalMenor);
  }

  if (botaoSair) {
    botaoSair.addEventListener('click', toggleModalMenor); 
  }

  if (botaoCloseMenor) {
    botaoCloseMenor.addEventListener('click', toggleModalMenor);
  }

  if (botaoCancelar) {
    botaoCancelar.addEventListener('click', toggleModalMenor);
  }

  if (fadeMenor) {
    fadeMenor.addEventListener('click', toggleModalMenor);
  }
  
  const botaoOlho = document.getElementById('botaoOlho');
  const inputSenha = document.getElementById('senha-nova');
  const iconeOlho = document.getElementById('iconeOlho')

    botaoOlho.addEventListener('click',()=>{
        if(inputSenha.type === 'password'){
            inputSenha.type = 'text';

            iconeOlho.src = '../assets/img/olho-aberto.svg';
            iconeOlho.alt = 'Ocultar senha';
        }else{
            inputSenha.type = 'password';

            iconeOlho.src = '../assets/img/olho-fechado.svg';
            iconeOlho.alt = 'Mostrar senha';
        }
    })

  const botaoOlho1 = document.getElementById('botaoOlho1');
  const inputSenha1 = document.getElementById('confirmar-senha-nova');
  const iconeOlho1 = document.getElementById('iconeOlho1')

    botaoOlho1.addEventListener('click',()=>{
        if(inputSenha1.type === 'password'){
            inputSenha1.type = 'text';

            iconeOlho1.src = '../assets/img/olho-aberto.svg';
            iconeOlho1.alt = 'Ocultar senha';
        }else{
            inputSenha1.type = 'password';

            iconeOlho1.src = '../assets/img/olho-fechado.svg';
            iconeOlho1.alt = 'Mostrar senha';
        }
    })
});