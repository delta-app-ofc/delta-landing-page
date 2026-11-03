document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-toggle-password]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const input = document.getElementById(botao.dataset.togglePassword);
            const icone = botao.querySelector('img');
            if (!input || !icone) return;

            const mostrar = input.type === 'password';
            input.type = mostrar ? 'text' : 'password';
            icone.src = mostrar ? '../assets/img/olho-fechado.svg' : '../assets/img/olho-aberto.svg';
            icone.alt = '';
            botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
        });
    });

    const codigo = [...document.querySelectorAll('.codigo-input')];
    codigo[0]?.focus({ preventScroll: true });
    codigo.forEach((campo, indice) => {
        campo.addEventListener('input', () => {
            campo.value = campo.value.replace(/\D/g, '').slice(-1);
            if (campo.value && codigo[indice + 1]) codigo[indice + 1].focus();
        });
        campo.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && !campo.value && codigo[indice - 1]) codigo[indice - 1].focus();
        });
    });
    codigo[0]?.addEventListener('paste', (event) => {
        const digitos = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, codigo.length);
        if (!digitos) return;
        event.preventDefault();
        [...digitos].forEach((digito, indice) => { codigo[indice].value = digito; });
        codigo[Math.min(digitos.length, codigo.length) - 1].focus();
    });

    const botao = document.querySelector('[data-next]');
    const senhaNova = document.getElementById('senha-nova');
    const regrasSenha = {
        tamanho: (valor) => valor.length >= 8,
        maiuscula: (valor) => /[A-Z]/.test(valor),
        numero: (valor) => /\d/.test(valor),
    };

    function atualizarRegrasSenha() {
        if (!senhaNova) return;
        document.querySelectorAll('.requisitos-senha [data-regra]').forEach((item) => {
            const regra = regrasSenha[item.dataset.regra];
            item.classList.toggle('atendido', Boolean(regra && regra(senhaNova.value)));
        });
    }

    senhaNova?.addEventListener('input', atualizarRegrasSenha);
    atualizarRegrasSenha();
    botao?.addEventListener('click', (event) => {
        if (botao.hasAttribute('data-profile-form')) {
            const campos = [...document.querySelectorAll('[data-required]')];
            const invalido = campos.find((campo) => !campo.value.trim() || !campo.checkValidity());
            if (invalido) {
                event.preventDefault();
                invalido.reportValidity();
                invalido.focus();
                return;
            }
        }

        if (botao.hasAttribute('data-email-form')) {
            const email = document.getElementById('email');
            if (!email?.value || !email.checkValidity()) {
                event.preventDefault();
                email?.reportValidity();
                email?.focus();
                return;
            }
        }

        if (botao.hasAttribute('data-code-form') && codigo.some((campo) => !campo.checkValidity())) {
            event.preventDefault();
            codigo.find((campo) => !campo.checkValidity())?.reportValidity();
            return;
        }

        if (botao.hasAttribute('data-password-form')) {
            const senha = senhaNova;
            const confirmacao = document.getElementById('confirmar-senha');
            const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!senha.value || !regex.test(senha.value)) {
                event.preventDefault();
                senha.setCustomValidity('A senha deve ter pelo menos 8 caracteres, uma letra mai\u00FAscula e um n\u00FAmero.');
                senha.reportValidity();
                senha.addEventListener('input', () => senha.setCustomValidity(''), { once: true });
                senha.focus();
                return;
            }
            if (senha.value !== confirmacao.value) {
                event.preventDefault();
                confirmacao.setCustomValidity('As senhas não coincidem.');
                confirmacao.reportValidity();
                confirmacao.addEventListener('input', () => confirmacao.setCustomValidity(''), { once: true });
                confirmacao.focus();
                return;
            }
        }

        window.location.assign(botao.dataset.next);
    });
});
