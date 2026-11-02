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

document.addEventListener('DOMContentLoaded', () => {
  const gatilho = document.querySelector('.tituloConceito');

  const itens = [
    { el: document.querySelector('.retanguloCenario'),  dir: -1, inicio: 0 },
    { el: document.querySelector('.retanguloCenario2'), dir: -1, inicio: 0.1 },
    { el: document.querySelector('.retanguloSolucao'),  dir:  1, inicio: 0.3 },
    { el: document.querySelector('.retanguloSolucao2'), dir:  1, inicio: 0.4 },
  ];

  const DISTANCIA = 400;
  const JANELA = 0.48;
  const DESLOCAMENTO = 120; 
  const ANTECEDENCIA = 0.9;
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
    atual += (alvo - atual) * 0.1;

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


document.addEventListener('DOMContentLoaded', () => {
  const abrirModalBtn = document.querySelector('#minha-conta');
  const fecharModalBtn = document.querySelector('#close-modal');
  const modal = document.querySelector("#modal");
  const fade = document.querySelector("#fade");
  const abrirModal = () => {
    if (!modal || !fade) return;
    if (window.DeltaDB && !window.DeltaDB.getCurrent()) {
      window.location.assign('entrar-conta.html');
      return;
    }
    modal.classList.remove("hide");
    fade.classList.remove("hide");
    abrirModalBtn?.setAttribute("aria-expanded", "true");
  };
  const fecharModal = () => {
    if (!modal || !fade) return;
    modal.querySelectorAll('input, textarea, select').forEach((campo) => campo.setCustomValidity(''));
    modal.querySelectorAll('[role="status"]').forEach((status) => { status.textContent = ''; });
    modal.classList.add("hide");
    fade.classList.add("hide");
    abrirModalBtn?.setAttribute("aria-expanded", "false");
  };

  abrirModalBtn?.addEventListener("click", abrirModal);
  modal?.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hide")) fecharModal();
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

  const topicoAtivo = document.querySelector('.topico.active');
  if (topicoAtivo) moverIndicador(topicoAtivo);

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
  const botaoAbrir = document.getElementById('borda');
  const linkSairConta = document.getElementById('sair-da-conta');

  function toggleModalMenor() {
    fadeMenor.classList.toggle('hide');
    modalMenor.classList.toggle('hide');
  }

  [botaoAbrir, linkSairConta].forEach((elemento) => {
    elemento?.addEventListener('click', toggleModalMenor);
  });

  if (botaoSair) {
    botaoSair.addEventListener('click', () => window.DeltaDB?.logout());
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
  
  const camposSenha = [
    { botao: document.getElementById('botaoOlho'), input: document.getElementById('senha-nova'), icone: document.getElementById('iconeOlho') },
    { botao: document.getElementById('botaoOlho1'), input: document.getElementById('confirmar-senha-nova'), icone: document.getElementById('iconeOlho1') },
  ];

  camposSenha.forEach(({ botao, input, icone }) => {
    botao?.addEventListener('click', () => {
      const mostrar = input.type === 'password';
      input.type = mostrar ? 'text' : 'password';
      icone.src = mostrar ? '../assets/img/olho-aberto.svg' : '../assets/img/olho-fechado.svg';
      icone.alt = mostrar ? 'Ocultar senha' : 'Mostrar senha';
    });
  });

  const formPerfil = document.getElementById('config-perfil');
  const statusPerfil = document.getElementById('perfil-status');
  const nomePerfil = document.getElementById('nome');
  const emailPerfil = document.getElementById('email');
  const formSeguranca = document.getElementById('form-seguranca');
  const senhaNova = document.getElementById('senha-nova');
  const confirmarSenhaNova = document.getElementById('confirmar-senha-nova');
  const popupSalvo = document.getElementById('popup-salvo');
  const fecharPopupSalvo = document.getElementById('fechar-popup-salvo');
  const mensagemPopupSalvo = document.getElementById('popup-salvo-mensagem');
  let timerPopupSalvo;

  function mostrarPopupSalvo(mensagem = 'Informações salvas com sucesso!') {
    if (!popupSalvo) return;
    window.clearTimeout(timerPopupSalvo);
    if (mensagemPopupSalvo) mensagemPopupSalvo.textContent = mensagem;
    popupSalvo.hidden = false;
    popupSalvo.classList.add('visivel');
    timerPopupSalvo = window.setTimeout(() => {
      popupSalvo.classList.remove('visivel');
      popupSalvo.hidden = true;
    }, 3500);
  }

  fecharPopupSalvo?.addEventListener('click', () => {
    window.clearTimeout(timerPopupSalvo);
    popupSalvo.hidden = true;
    popupSalvo.classList.remove('visivel');
  });

  const contaAtual = window.DeltaDB?.getCurrent();
  let perfilSalvo = {};
  try { perfilSalvo = JSON.parse(localStorage.getItem('delta_perfil') || '{}'); } catch (_) {}
  if (contaAtual) {
    nomePerfil.value = contaAtual.name || '';
    emailPerfil.value = contaAtual.email || '';
  } else {
    if (perfilSalvo.nome) nomePerfil.value = perfilSalvo.nome;
    if (perfilSalvo.email) emailPerfil.value = perfilSalvo.email;
  }

  formPerfil?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!formPerfil.reportValidity()) return;
    const perfil = { nome: nomePerfil.value.trim(), email: emailPerfil.value.trim() };
    if (contaAtual && window.DeltaDB) {
      const resultado = window.DeltaDB.updateAccount(contaAtual.id, { name: perfil.nome, email: perfil.email });
      if (!resultado.ok) {
        emailPerfil.setCustomValidity(resultado.message);
        emailPerfil.reportValidity();
        emailPerfil.addEventListener('input', () => emailPerfil.setCustomValidity(''), { once: true });
        return;
      }
    }
    localStorage.setItem('delta_perfil', JSON.stringify(perfil));
    if (statusPerfil) statusPerfil.textContent = 'Dados salvos neste navegador.';
    if (emailNotificacoes) emailNotificacoes.textContent = perfil.email;
    mostrarPopupSalvo();
  });

  confirmarSenhaNova?.addEventListener('input', () => confirmarSenhaNova.setCustomValidity(''));
  senhaNova?.addEventListener('input', () => confirmarSenhaNova.setCustomValidity(''));
  formSeguranca?.addEventListener('submit', (event) => {
    event.preventDefault();
    confirmarSenhaNova.setCustomValidity(
      senhaNova.value === confirmarSenhaNova.value ? '' : 'As senhas não coincidem.'
    );
    if (!formSeguranca.reportValidity()) return;

    if (contaAtual && window.DeltaDB) {
      window.DeltaDB.updateAccount(contaAtual.id, { password: senhaNova.value });
    }
    localStorage.setItem('delta_senha_atualizada_em', new Date().toISOString());
    formSeguranca.reset();
    confirmarSenhaNova.setCustomValidity('');
    mostrarPopupSalvo('Senha alterada com sucesso!');
  });

  const emailNotificacoes = document.querySelector('.email-cadastrado');
  const controlesNotificacoes = { relatorio: 'reports', novidade: 'news', evento: 'events' };
  let preferenciasSalvas = {};
  try { preferenciasSalvas = JSON.parse(localStorage.getItem('delta_notificacoes') || '{}'); } catch (_) {}
  if (emailNotificacoes && contaAtual) emailNotificacoes.textContent = contaAtual.email;
  Object.entries(controlesNotificacoes).forEach(([id, chave]) => {
    const checkbox = document.getElementById(id);
    if (checkbox) checkbox.checked = Boolean(contaAtual?.notifications?.[chave] ?? preferenciasSalvas[chave]);
  });

  document.querySelector('.salvar-not')?.addEventListener('click', () => {
    const preferencias = {};
    Object.entries(controlesNotificacoes).forEach(([id, chave]) => {
      preferencias[chave] = Boolean(document.getElementById(id)?.checked);
    });
    localStorage.setItem('delta_notificacoes', JSON.stringify(preferencias));
    if (contaAtual && window.DeltaDB) {
      const resultado = window.DeltaDB.updateAccount(contaAtual.id, { notifications: preferencias });
      if (!resultado.ok) {
        const statusErro = document.getElementById('notificacoes-status');
        if (statusErro) statusErro.textContent = resultado.message;
        return;
      }
    }
    const status = document.getElementById('notificacoes-status');
    if (status) status.textContent = '';
    guardarEstado();
    mostrarPopupSalvo('Preferências de notificação salvas!');
  });

  document.getElementById('excluir-conta')?.addEventListener('click', (event) => {
    event.preventDefault();
    const status = document.getElementById('excluir-conta-status');
    if (!contaAtual || !window.DeltaDB) {
      if (status) status.textContent = 'Entre na sua conta para realizar esta ação.';
      return;
    }
    if (!window.confirm('Deseja excluir permanentemente esta conta e os dados locais associados?')) return;
    const resultado = window.DeltaDB.deleteAccount(contaAtual.id);
    if (!resultado.ok) {
      if (status) status.textContent = resultado.message;
      return;
    }
    window.location.assign('../pages/index.html');
  });

  const camposModal = modal.querySelectorAll('input');
  const estadoSalvo = new Map();
  let alterado = false;

  const fadeConfirmar = document.getElementById('fade-confirmar');
  const modalConfirmar = document.getElementById('modal-confirmar');
  const botaoCloseConfirmar = document.getElementById('close-modal-confirmar');
  const botaoContinuar = document.getElementById('botao-continuar');
  const botaoDescartar = document.getElementById('botao-descartar');
  const botaoSalvarFechar = document.getElementById('botao-salvar-fechar');

  function guardarEstado() {
    camposModal.forEach((campo) => {
      estadoSalvo.set(campo, campo.type === 'checkbox' ? campo.checked : campo.value);
    });
    alterado = false;
  }

  function restaurarEstado() {
    camposModal.forEach((campo) => {
      const valor = estadoSalvo.get(campo);
      if (campo.type === 'checkbox') campo.checked = valor;
      else campo.value = valor;
    });
    alterado = false;
  }

  guardarEstado();
  formPerfil?.addEventListener('submit', guardarEstado);

  function toggleModalConfirmar() {
    fadeConfirmar.classList.toggle('hide');
    modalConfirmar.classList.toggle('hide');
  }

  function tentarFecharModal() {
    if (alterado) {
      toggleModalConfirmar();
    } else {
      fecharModal();
    }
  }

  [fecharModalBtn, fade].forEach((elemento) => {
    elemento?.addEventListener('click', tentarFecharModal);
  });

  camposModal.forEach((campo) => {
    campo.addEventListener('input', () => { alterado = true; });
    campo.addEventListener('change', () => { alterado = true; });
  });

  botaoContinuar?.addEventListener('click', toggleModalConfirmar);
  botaoCloseConfirmar?.addEventListener('click', toggleModalConfirmar);
  fadeConfirmar?.addEventListener('click', toggleModalConfirmar);

  botaoDescartar?.addEventListener('click', () => {
    restaurarEstado();
    toggleModalConfirmar();
    fecharModal();
  });

  botaoSalvarFechar?.addEventListener('click', () => {
    if (!formPerfil.checkValidity()) {
      toggleModalConfirmar();
      formPerfil.reportValidity();
      return;
    }
    formPerfil.requestSubmit();
    toggleModalConfirmar();
    fecharModal();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const botaoMenu = document.getElementById('botao-menu');
  const menu = document.getElementById('menu-navegacao');
  if (!botaoMenu || !menu) return;

  function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  botaoMenu.addEventListener('click', () => {
    const aberto = botaoMenu.getAttribute('aria-expanded') !== 'true';
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    menu.classList.toggle('aberto', aberto);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !botaoMenu.contains(event.target)) fecharMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharMenu();
  });
});
