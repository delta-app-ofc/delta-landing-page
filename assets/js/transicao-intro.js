/* ==========================================================
   transicao-intro.js   (versão com @keyframes)
   Carregar no FINAL do <body> da landing-login.html.

   A animação em si está toda em keyframes no transicao-intro.css.
   Este script só faz o que o CSS não consegue: MEDIR onde está a
   logo real (a largura do texto "DELT" depende da fonte) e passar
   três números para os keyframes: --k, --tx e --ty.
   ========================================================== */
(function () {
  const html = document.documentElement;
  if (!html.classList.contains('vem-da-intro')) return;

  const ponte = document.querySelector('.ponte');
  const logoReal = document.querySelector('.botao-logo');
  const textoReal = document.querySelector('.botao-logo .Delta');

  function limpar() {
    html.classList.remove('vem-da-intro', 'intro-pronta');
    if (ponte) ponte.remove();
  }

  if (!ponte || !logoReal || !textoReal) { limpar(); return; }

  // quando o último keyframe termina, remove tudo
  ponte.addEventListener('animationend', (e) => {
    if (e.animationName === 'ponte-sumir') limpar();
  });

  async function iniciar() {
    try { await document.fonts.ready; } catch (_) {}
    await new Promise(requestAnimationFrame);

    // onde a logo da intro está (a cópia ainda não foi transformada)
    const texto     = ponte.querySelector('.pm-texto').getBoundingClientRect();
    const triangulo = ponte.querySelector('.pm-triangulo').getBoundingClientRect();
    const gota      = ponte.querySelector('.pm-gota').getBoundingClientRect();
    const origem = {
      left: texto.left,
      right: Math.max(triangulo.right, gota.right),
      centroY: texto.top + texto.height / 2
    };

    // onde a logo real está
    const alvo = logoReal.getBoundingClientRect();
    const alvoTexto = textoReal.getBoundingClientRect();

    const k  = alvo.width / (origem.right - origem.left);
    const tx = alvo.left - k * origem.left;
    const ty = (alvoTexto.top + alvoTexto.height / 2) - k * origem.centroY;

    ponte.style.setProperty('--k', k);
    ponte.style.setProperty('--tx', tx + 'px');
    ponte.style.setProperty('--ty', ty + 'px');

    // dispara os keyframes
    html.classList.add('intro-pronta');
  }

  iniciar().catch(limpar);
})();