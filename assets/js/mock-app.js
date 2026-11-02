/* Fluxos locais de cadastro, autenticação e recuperação de senha. */
document.addEventListener('DOMContentLoaded', () => {
  const db = window.DeltaDB;
  if (!db) return;

  const page = location.pathname.split('/').pop().toLowerCase();
  const flow = new URLSearchParams(location.search).get('flow');
  const signupEmailCodeFlow = page === 'codigo-verificacao.html' && flow === 'signup-email';
  const signupCodeFlow = signupEmailCodeFlow;
  const emailInput = document.getElementById('email');
  if (['entrar-conta.html', 'entrar-usuario.html'].includes(page) && emailInput) {
    emailInput.value = localStorage.getItem('delta_mock_remembered_email') || '';
  }
  const clearValidity = (input) => input?.addEventListener('input', () => input.setCustomValidity(''));
  clearValidity(emailInput);
  clearValidity(document.getElementById('senha'));
  clearValidity(document.getElementById('senha-nova'));
  clearValidity(document.getElementById('confirmar-senha'));
  document.querySelectorAll('.codigo-input').forEach(clearValidity);

  function invalid(input, message) {
    if (!input) return;
    input.setCustomValidity(message);
    input.reportValidity();
    input.focus();
  }

  function navigate(button) {
    location.assign(button.dataset.next);
  }

  function getCode() {
    return [...document.querySelectorAll('.codigo-input')].map((input) => input.value).join('');
  }

  let resetTimerId;
  function updateCodePage() {
    const info = document.querySelector('.informacoes');
    const timer = document.querySelector('.tempo');
    const resend = document.querySelector('.reenviar-codigo');
    if (signupCodeFlow) {
      const draft = db.getSignupDraft();
      if (info) info.textContent = 'Digite qualquer c\u00f3digo de 6 n\u00fameros enviado para ' + (draft?.email || '') + ' para continuar o cadastro.';
      if (timer) timer.hidden = true;
      if (resend) resend.hidden = true;
      const confirm = document.querySelector('[data-code-form]');
      if (confirm) confirm.dataset.next = 'concluir-cadastro.html';
      const back = document.querySelector('.voltar')?.closest('a');
      if (back) back.href = 'criar-conta.html';
      return;
    }
    const details = db.getResetDetails();
    if (resend) {
      resend.setAttribute('role', 'button');
      resend.tabIndex = 0;
    }
    if (!details) {
      if (info) info.textContent = 'N\u00e3o h\u00e1 c\u00f3digo ativo. Volte e solicite um novo c\u00f3digo.';
      return;
    }
    if (info) info.textContent = 'Modo de demonstra\u00e7\u00e3o - c\u00f3digo: ' + details.code + '. Conta: ' + details.email + '.';
    if (!timer) return;
    clearInterval(resetTimerId);
    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((details.expiresAt - Date.now()) / 1000));
      timer.textContent = 'Esse c\u00f3digo expira em ' + String(Math.floor(remaining / 60)).padStart(2, '0') + ':' + String(remaining % 60).padStart(2, '0');
      if (remaining === 0) clearInterval(resetTimerId);
    };
    updateTimer();
    resetTimerId = setInterval(updateTimer, 1000);
  }

  if ((signupCodeFlow || page === 'concluir-cadastro.html') && !db.getSignupDraft()) {
    location.replace('criar-conta.html');
    return;
  }

  if (page === 'codigo-verificacao.html') updateCodePage();


  document.addEventListener('click', (event) => {
    const resend = event.target.closest('.reenviar-codigo');
    if (resend) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const current = db.getResetDetails();
      if (!current) {
        const info = document.querySelector('.informacoes');
        if (info) info.textContent = 'Volte à etapa anterior e informe o e-mail da conta.';
        return;
      }
      const result = db.requestPasswordReset(current.email);
      if (result.ok) {
        document.querySelectorAll('.codigo-input').forEach((input) => {
          input.value = '';
          input.setCustomValidity('');
        });
        updateCodePage();
        document.querySelector('.codigo-input')?.focus();
      }
      return;
    }

    const button = event.target.closest('button[data-next]');
    if (!button) return;
    const isSignup = button.hasAttribute('data-validate-password');
    const isProfile = button.hasAttribute('data-profile-form');
    const isEmail = button.hasAttribute('data-email-form');
    const isCode = button.hasAttribute('data-code-form');
    const isPassword = button.hasAttribute('data-password-form');
    const role = button.dataset.authRole;
    if (!isSignup && !isProfile && !isEmail && !isCode && !isPassword && !role) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (role) {
      const email = document.getElementById('email');
      const password = document.getElementById('senha');
      if (!email?.value.trim() || !email.checkValidity()) return email?.reportValidity();
      if (!password?.value) return invalid(password, 'Digite sua senha.');
      const result = db.login(email.value, password.value, role, false);
      if (!result.ok) return invalid(email, result.message);
      navigate(button);
      return;
    }

    if (isSignup) {
      const fields = [...document.querySelectorAll('[data-required]')];
      const missing = fields.find((field) => !field.value.trim() || !field.checkValidity());
      if (missing) return missing.reportValidity();
      const password = document.getElementById('senha');
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      if (!strongPassword.test(password.value)) return invalid(password, 'Use pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo.');
      db.saveSignupDraft({
        name: document.getElementById('nome').value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        password: password.value,
        remember: Boolean(document.getElementById('lembrar-mim')?.checked)
      });
      navigate(button);
      return;
    }

    if (isProfile) {
      const fields = [...document.querySelectorAll('[data-required]')];
      const missing = fields.find((field) => !field.value.trim() || !field.checkValidity());
      if (missing) return missing.reportValidity();
      const result = db.finishSignup({
        phone: document.getElementById('telefone')?.value.trim() || '',
        birthDate: document.getElementById('data').value
      });
      if (!result.ok) return window.alert(result.message);
      navigate(button);
      return;
    }

    if (isEmail) {
      const email = document.getElementById('email');
      if (!email?.value.trim() || !email.checkValidity()) return email?.reportValidity();
      const result = db.requestPasswordReset(email.value);
      if (!result.ok) return invalid(email, result.message);
      navigate(button);
      return;
    }

    if (isCode) {
      const inputs = [...document.querySelectorAll('.codigo-input')];
      const missing = inputs.find((input) => !input.value || !input.checkValidity());
      if (missing) return missing.reportValidity();
      if (!signupEmailCodeFlow) {
        const result = db.verifyResetCode(getCode());
        if (!result.ok) return invalid(inputs[0], result.message);
      }
      navigate(button);
      return;
    }

    if (isPassword) {
      const password = document.getElementById('senha-nova');
      const confirmation = document.getElementById('confirmar-senha');
      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      if (!strongPassword.test(password.value)) return invalid(password, 'Use pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo.');
      if (password.value !== confirmation.value) return invalid(confirmation, 'As senhas não coincidem.');
      const result = db.resetPassword(password.value, getCode());
      if (!result.ok) return invalid(password, result.message);
      navigate(button);
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    const resend = event.target.closest?.('.reenviar-codigo');
    if (!resend || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    resend.click();
  });

  const isAdminPage = /^(inicioCRUD|userCRUD|regionCRUD|regionrateCRUD|propertyCRUD|deviceCRUD|adressCRUD)\.html$/.test(page);
  if (isAdminPage) {
    if (db.getCurrent()?.role !== 'admin') location.replace('entrar-adm.html');
    document.querySelector('.logout')?.addEventListener('click', () => db.logout());
  }
});

