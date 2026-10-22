/* ==========================================================
   1) CARROSSEL DE VALORES
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const secao = document.querySelector('.card-section');
  const lista = document.getElementById('lista-card');
  const cards = document.querySelectorAll('.card');
  const totalCardsOriginais = cards.length;
  const botaoVoltar = document.getElementById('botao-voltar');
  const botaoAvancar = document.getElementById('botao-avancar');

  const clone1 = cards[0].cloneNode(true);
  const clone2 = cards[cards.length - 1].cloneNode(true);

  lista.appendChild(clone1);
  lista.insertBefore(clone2, cards[0]);

  const todosCards = lista.querySelectorAll('.card');
  const totalCardsComClones = todosCards.length;

  const DURACAO = 700; 
  const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

  let contador = 1;
  let isAnimating = false;

  function posicionar(comAnimacao) {
    lista.style.transition = comAnimacao
      ? `transform ${DURACAO}ms ${EASING}`
      : 'none';
    lista.style.transform = `translateX(-${contador * 100}%)`;
  }

  function marcarAtivo() {
    todosCards.forEach((card, i) => {
      card.classList.toggle('ativo', i === contador);
    });
  }

  function ir() {
    isAnimating = true;
    posicionar(true);
    marcarAtivo();
  }

  posicionar(false);

  botaoAvancar.addEventListener('click', () => {
    if (isAnimating) return;
    if (contador >= totalCardsComClones - 1) return;

    contador++;
    ir();
  });

  botaoVoltar.addEventListener('click', () => {
    if (isAnimating) return;
    if (contador <= 0) return;

    contador--;
    ir();
  });

  lista.addEventListener('transitionend', (e) => {
    if (e.target !== lista || e.propertyName !== 'transform') return;

    if (contador === totalCardsComClones - 1 || contador === 0) {
      contador = contador === 0 ? totalCardsOriginais : 1;

      lista.classList.add('sem-transicao');
      posicionar(false);
      marcarAtivo();
      void lista.offsetWidth; 
      lista.classList.remove('sem-transicao');
    }

    isAnimating = false;
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      secao.classList.add('visivel');
      marcarAtivo();
      observador.disconnect(); 
    });
  }, { threshold: 0.25 });

  observador.observe(secao);
});


/* ==========================================================
   2) CARTAS INICIAIS (-35%, 24h, +5)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cartas = [
    document.querySelector('.carta1'),
    document.querySelector('.carta2'),
    document.querySelector('.carta3'),
  ];

  const DISTANCIA = 40;
  const DESLOCAMENTO = 200;
  const ATRASO = 0.23;

  const numeros = cartas.map((carta) => {
    const el = carta.querySelector('.numero, .numero2');
    return { el, final: parseInt(el.textContent, 10) };
  });

  const limitar = (v) => Math.min(Math.max(v, 0), 1);
  const suavizar = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let alvo = 0;
  let atual = 0;
  let rodando = false;

  function desenhar() {
    cartas.forEach((carta, i) => {
      const bruto = limitar((atual - i * ATRASO) / (1 - ATRASO * 2));
      const p = suavizar(bruto);

      carta.style.opacity = p;
      carta.style.transform = `translateY(${(1 - p) * DESLOCAMENTO}px)`;

      numeros[i].el.textContent = Math.round(numeros[i].final * p);
    });
  }

  function loop() {
    atual += (alvo - atual) * 0.08;

    if (Math.abs(alvo - atual) < 0.001) atual = alvo;
    desenhar();

    if (atual !== alvo) {
      requestAnimationFrame(loop);
    } else {
      rodando = false;
    }
  }

  function aoRolar() {
    alvo = limitar(window.scrollY / DISTANCIA);
    if (!rodando) {
      rodando = true;
      requestAnimationFrame(loop);
    }
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();
  desenhar();
});

/* ==========================================================
   3) CENÁRIO / SOLUÇÃO (guiado pelo scroll)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const gatilho = document.querySelector('.tituloConceito');

  const itens = [
    { el: document.querySelector('.retanguloCenario'),  dir: -1, inicio: 0 },
    { el: document.querySelector('.retanguloCenario2'), dir: -1, inicio: 0.1 },
    { el: document.querySelector('.retanguloSolucao'),  dir:  1, inicio: 0.3 },
    { el: document.querySelector('.retanguloSolucao2'), dir:  1, inicio: 0.4 },
  ];

  const DISTANCIA = 500;    
  const JANELA = 0.5;        
  const DESLOCAMENTO = 120; 
  const ANTECEDENCIA = 0.8; 
  const limitar = (v) => Math.min(Math.max(v, 0), 1);
  const suavizar = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let inicioScroll = 0;
  let alvo = 0;
  let atual = 0;
  let rodando = false;

  function calcularInicio() {
    const topoTitulo = gatilho.getBoundingClientRect().top + window.scrollY;
    inicioScroll = topoTitulo - window.innerHeight * ANTECEDENCIA;
  }

  function desenhar() {
    itens.forEach(({ el, dir, inicio }) => {
      const bruto = limitar((atual - inicio) / JANELA);
      const p = suavizar(bruto);

      el.style.opacity = p;
      el.style.transform = `translateX(${dir * (1 - p) * DESLOCAMENTO}%)`;
    });
  }

  function loop() {
    atual += (alvo - atual) * 0.08;

    if (Math.abs(alvo - atual) < 0.001) atual = alvo;
    desenhar();

    if (atual !== alvo) {
      requestAnimationFrame(loop);
    } else {
      rodando = false;
    }
  }

  function aoRolar() {
    alvo = limitar((window.scrollY - inicioScroll) / DISTANCIA);
    if (!rodando) {
      rodando = true;
      requestAnimationFrame(loop);
    }
  }

  calcularInicio();
  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', () => { calcularInicio(); aoRolar(); });
  aoRolar();
  desenhar();
});


/* ==========================================================
   4) CARTÕES DE OBJETIVOS E FUNCIONALIDADES (guiado pelo scroll)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const limitar = (v) => Math.min(Math.max(v, 0), 1);
  const suavizar = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function animarGrupo({
    gatilho,
    itens,
    distancia = 500,
    atraso = 0.1,
    deslocamento = 90,
    antecedencia = 0.8,
  }) {
    const alvoGatilho = document.querySelector(gatilho);
    const elementos = [...document.querySelectorAll(itens)];
    if (!alvoGatilho || elementos.length === 0) return;

    const janela = 1 - atraso * (elementos.length - 1);

    let inicioScroll = 0;
    let alvo = 0;
    let atual = 0;
    let rodando = false;

    function calcularInicio() {
      const topo = alvoGatilho.getBoundingClientRect().top + window.scrollY;
      inicioScroll = topo - window.innerHeight * antecedencia;
    }

    function desenhar() {
      elementos.forEach((el, i) => {
        const bruto = limitar((atual - i * atraso) / janela);
        const p = suavizar(bruto);

        el.style.opacity = p;
        el.style.translate = `0 ${(1 - p) * deslocamento}px`;
      });
    }

    function loop() {
      atual += (alvo - atual) * 0.08;

      if (Math.abs(alvo - atual) < 0.001) atual = alvo;
      desenhar();

      if (atual !== alvo) {
        requestAnimationFrame(loop);
      } else {
        rodando = false;
      }
    }

    function aoRolar() {
      alvo = limitar((window.scrollY - inicioScroll) / distancia);
      if (!rodando) {
        rodando = true;
        requestAnimationFrame(loop);
      }
    }

    calcularInicio();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', () => { calcularInicio(); aoRolar(); });
    aoRolar();
    desenhar();
  }

  animarGrupo({
    gatilho: '.tituloObjetivos',
    itens: '.cartaoReducao, .cartaoMonitoramento, .cartaoEficiencia',
  });

  animarGrupo({
    gatilho: '.tituloFuncionalidades',
    itens: '.cartao1, .cartao2, .cartao3, .cartao4, .cartao5, .cartao6',
  });
});


/* ==========================================================
   5) MODAL "MINHA CONTA" (código original, sem alterações)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
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