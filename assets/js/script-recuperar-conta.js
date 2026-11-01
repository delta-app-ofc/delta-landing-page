document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-toggle-password]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const input = document.getElementById(botao.dataset.togglePassword);
            const icone = botao.querySelector('img');
            if (!input || !icone) return;

            const mostrar = input.type === 'password';
            input.type = mostrar ? 'text' : 'password';
            icone.src = mostrar ? '../assets/img/olho-aberto.svg' : '../assets/img/olho-fechado.svg';
            icone.alt = mostrar ? 'Ocultar senha' : 'Mostrar senha';
        });
    });

    const codigo = [...document.querySelectorAll('.codigo-input')];
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
            const senha = document.getElementById('senha-nova');
            const confirmacao = document.getElementById('confirmar-senha');
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
            if (!senha.value || !regex.test(senha.value)) {
                event.preventDefault();
                senha.setCustomValidity('Use pelo menos 8 caracteres, com letras maiúsculas e minúsculas, número e símbolo.');
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
