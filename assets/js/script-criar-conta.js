document.addEventListener('DOMContentLoaded', () => {
    const botaoOlho = document.getElementById('botaoOlho');
    const inputSenha = document.getElementById('senha');
    const iconeOlho = document.getElementById('iconeOlho');
    const mensagemSenha = document.getElementById('mensagemSenha');
    const botaoAcao = document.querySelector('[data-next]');
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    botaoOlho?.addEventListener('click', () => {
        const mostrar = inputSenha.type === 'password';
        inputSenha.type = mostrar ? 'text' : 'password';
        iconeOlho.src = mostrar ? '../assets/img/olho-aberto.svg' : '../assets/img/olho-fechado.svg';
        iconeOlho.alt = mostrar ? 'Ocultar senha' : 'Mostrar senha';
    });

    if (!inputSenha) return;

    inputSenha.addEventListener('input', () => {
        if (!mensagemSenha) return;
        const valida = regexSenha.test(inputSenha.value);
        mensagemSenha.textContent = !inputSenha.value ? '' : valida
            ? 'Senha válida!'
            : 'Mínimo de 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.';
        mensagemSenha.style.color = valida ? 'green' : 'red';
    });

    botaoAcao?.addEventListener('click', (event) => {
        const campos = [...document.querySelectorAll('[data-required]')];
        const campoInvalido = campos.find((campo) => !campo.value.trim() || !campo.checkValidity());
        if (campoInvalido) {
            event.preventDefault();
            campoInvalido.reportValidity();
            campoInvalido.focus();
            return;
        }

        if (botaoAcao.hasAttribute('data-validate-password') && !regexSenha.test(inputSenha.value)) {
            event.preventDefault();
            if (mensagemSenha) {
                mensagemSenha.textContent = 'Senha inválida. Verifique os requisitos.';
                mensagemSenha.style.color = 'red';
            }
            inputSenha.focus();
            return;
        }

        window.location.assign(botaoAcao.dataset.next);
    });
});
