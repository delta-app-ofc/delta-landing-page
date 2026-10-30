/* ==========================================================
   FUNÇÕES AUXILIARES GLOBAIS DE SUPORTE
   ========================================================== */
const limitar = (v) => Math.min(Math.max(v, 0), 1);
const suavizar = (t) => t < 0.5
  ? 4 * t * t * t
  : 1 - Math.pow(-2 * t + 2, 3) / 2;

window.addEventListener('pageshow', function(event) {
  if (event.persisted || (performance.navigation && performance.navigation.type === 2)) {
    window.scrollTo(0, 0);
  }
});


/* ==========================================================
   1) CARROSSEL DE VALORES
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const secao = document.querySelector('.card-section');
  const lista = document.getElementById('lista-card');
  const cards = document.querySelectorAll('.card');
  if (!secao || !lista || cards.length === 0) return;

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

  botaoAvancar?.addEventListener('click', () => {
    if (isAnimating || contador >= totalCardsComClones - 1) return;
    contador++;
    ir();
  });

  botaoVoltar?.addEventListener('click', () => {
    if (isAnimating || contador <= 0) return;
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
  ].filter(Boolean);

  if (cartas.length === 0) return;

  const DISTANCIA = 40;
  const DESLOCAMENTO = 200;
  const ATRASO = 0.23;

  const numeros = cartas.map((carta) => {
    const el = carta.querySelector('.numero, .numero2');
    return { el, final: el ? parseInt(el.textContent, 10) : 0 };
  });

  let alvo = 0;
  let atual = 0;
  let rodando = false;

  function desenhar() {
    cartas.forEach((carta, i) => {
      const bruto = limitar((atual - i * ATRASO) / (1 - ATRASO * 2));
      const p = suavizar(bruto);

      carta.style.opacity = p;
      carta.style.transform = `translateY(${(1 - p) * DESLOCAMENTO}px)`;

      if (numeros[i].el) {
        numeros[i].el.textContent = Math.round(numeros[i].final * p);
      }
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
  if (!gatilho) return;

  const itens = [
    { el: document.querySelector('.retanguloCenario'),   dir: -1, inicio: 0 },
    { el: document.querySelector('.retanguloCenario2'), dir: -1, inicio: 0.1 },
    { el: document.querySelector('.retanguloSolucao'),   dir:  1, inicio: 0.3 },
    { el: document.querySelector('.retanguloSolucao2'), dir:  1, inicio: 0.4 },
  ].filter(item => item.el);

  const DISTANCIA = 500;     
  const JANELA = 0.5;         
  const DESLOCAMENTO = 120;  
  const ANTECEDENCIA = 0.8;

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
  window.addEventListener('resize', () => { calcularInicio(); aoRolar(); }, { passive: true });
  aoRolar();
  desenhar();
});


/* ==========================================================
   4 e 5) ANIMAÇÃO: OBJETIVOS E FUNCIONALIDADES (Unificado)
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const limitar = (v) => Math.min(Math.max(v, 0), 1);
  const suavizar = (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const grupos = [];

  function registrarGrupo({
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

    function calcularInicio() {
      const topo = alvoGatilho.getBoundingClientRect().top + window.scrollY;
      inicioScroll = topo - window.innerHeight * antecedencia;
    }

    calcularInicio();
    window.addEventListener('resize', calcularInicio, { passive: true });

    grupos.push({
      elementos,
      distancia,
      atraso,
      deslocamento,
      janela,
      get inicioScroll() { return inicioScroll; }
    });
  }

  registrarGrupo({
    gatilho: '.tituloObjetivos',
    itens: '.cartaoReducao, .cartaoMonitoramento, .cartaoEficiencia',
  });

  registrarGrupo({
    gatilho: '.tituloFuncionalidades',
    itens: '.cartao1, .cartao2, .cartao3, .cartao4, .cartao5, .cartao6',
  });

  let atual = 0;
  let alvo = 0;
  let rodando = false;

  function desenhar() {
    const scrollY = window.scrollY;

    grupos.forEach(grupo => {
      const progressoAlvo = limitar((scrollY - grupo.inicioScroll) / grupo.distancia);
      
      grupo.elementos.forEach((el, i) => {
        const bruto = limitar((progressoAlvo - i * grupo.atraso) / grupo.janela);
        const p = suavizar(bruto);

        el.style.opacity = p;
        el.style.transform = `translate3d(0, ${(1 - p) * grupo.deslocamento}px, 0)`;
      });
    });
  }

  function loop() {
    atual += (alvo - atual) * 0.1;

    if (Math.abs(alvo - atual) < 0.001) {
      atual = alvo;
      rodando = false;
    } else {
      requestAnimationFrame(loop);
    }
    
    desenhar();
  }

  function aoRolar() {
    alvo = window.scrollY;
    if (!rodando) {
      rodando = true;
      requestAnimationFrame(loop);
    }
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  
  alvo = window.scrollY;
  atual = alvo;
  desenhar();
});