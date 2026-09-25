document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-card');
  const cards = document.querySelectorAll('.card');
  const botaoVoltar = document.getElementById('botao-voltar');
  const botaoAvancar = document.getElementById('botao-avancar');

  let contador = 0;
  const totalCards = cards.length;

  function atualizarCarrossel() {
    lista.style.transform = `translateX(-${contador * 100}%)`;
  }

  botaoAvancar.addEventListener('click', () => {
    if (contador < totalCards - 1) {
      contador++;
      atualizarCarrossel();
    } else {
      contador = 0;
      atualizarCarrossel();
    }
  });

  botaoVoltar.addEventListener('click', () => {
    if (contador > 0) {
      contador--;
      atualizarCarrossel();
    } else {
      contador = totalCards - 1;
      atualizarCarrossel();
    }
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
  const btnVoltar = document.getElementById('botao-voltar');
  const btnAvancar = document.getElementById('botao-avancar');
  const listaCard = document.getElementById('lista-card');

  function executarTrocaComFade(direcao) {
    listaCard.style.opacity = '0.1';
    listaCard.classList.remove('card-fade-in');

    setTimeout(() => {

      listaCard.style.opacity = '1';
      listaCard.classList.add('card-fade-in');
    }, 50); 
  }

  btnVoltar.addEventListener('click', () => executarTrocaComFade('voltar'));
  btnAvancar.addEventListener('click', () => executarTrocaComFade('avancar'));

  const inputSenha = document.getElementById('senha');
  const btnEye = document.getElementById('olho');

  btnEye.addEventListener('click', () => {
    const isPassword = inputSenha.type === 'password';
    
    inputSenha.type = isPassword ? 'text' : 'password';
 
  });
});