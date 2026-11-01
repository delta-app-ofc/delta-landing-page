/* Banco local de demonstração. Os dados ficam neste navegador; não há servidor. */
(function () {
  const ACCOUNTS_KEY = 'delta_mock_accounts';
  const SESSION_KEY = 'delta_mock_session';
  const SIGNUP_KEY = 'delta_mock_signup';
  const RESET_KEY = 'delta_mock_password_reset';
  const DEMO_ADMIN = {
    id: 'delta-demo-admin',
    name: 'Administrador Delta',
    email: 'delta.oficial.app@gmail.com',
    password: 'Delta2026#',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString()
  };

  const readJson = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  };

  function accounts() {
    const list = readJson(ACCOUNTS_KEY, []);
    const safeList = Array.isArray(list) ? list : [];
    const demoIndex = safeList.findIndex((account) =>
      account.id === DEMO_ADMIN.id || account.email?.toLowerCase() === DEMO_ADMIN.email
    );

    if (demoIndex < 0) {
      safeList.push({ ...DEMO_ADMIN });
      writeAccounts(safeList);
    } else {
      const saved = safeList[demoIndex];
      if (saved.email !== DEMO_ADMIN.email || saved.password !== DEMO_ADMIN.password || saved.role !== 'admin' || saved.active === false) {
        safeList[demoIndex] = { ...saved, ...DEMO_ADMIN, createdAt: saved.createdAt || DEMO_ADMIN.createdAt };
        writeAccounts(safeList);
      }
    }
    return safeList;
  }
  function writeAccounts(list) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  }

  function publicAccount(account) {
    if (!account) return null;
    const { password, ...safeAccount } = account;
    return safeAccount;
  }

  function getCurrent() {
    let temporarySession = null;
    try { temporarySession = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (_) {}
    const session = temporarySession || readJson(SESSION_KEY, null) || readJson('delta_session', null);
    if (!session?.id) return null;
    const account = accounts().find((item) => item.id === session.id && item.active !== false);
    return publicAccount(account);
  }

  function setSession(account, remember) {
    const value = JSON.stringify({ id: account.id, role: account.role, signedInAt: Date.now() });
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, value);
  }

  function login(email, password, role, remember = false) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const account = accounts().find((item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password &&
      item.role === role &&
      item.active !== false
    );
    if (!account) return { ok: false, message: 'E-mail, senha ou tipo de conta incorretos.' };
    setSession(account, remember);
    return { ok: true, account: publicAccount(account) };
  }

  function saveSignupDraft(data) {
    localStorage.setItem(SIGNUP_KEY, JSON.stringify(data));
  }

  function getSignupDraft() {
    return readJson(SIGNUP_KEY, null);
  }

  function finishSignup(details) {
    const draft = getSignupDraft();
    if (!draft) return { ok: false, message: 'O cadastro expirou. Comece novamente.' };
    const list = accounts();
    if (list.some((item) => item.email.toLowerCase() === draft.email.toLowerCase())) {
      return { ok: false, message: 'Este e-mail já está cadastrado.' };
    }

    const account = {
      id: globalThis.crypto?.randomUUID?.() || `delta-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      password: draft.password,
      phone: details.phone.trim(),
      birthDate: details.birthDate,
      role: 'user',
      active: true,
      createdAt: new Date().toISOString(),
      notifications: { reports: false, news: false, events: false }
    };

    list.push(account);
    writeAccounts(list);
    setSession(account, draft.remember);
    if (draft.remember) localStorage.setItem('delta_mock_remembered_email', account.email);
    sessionStorage.removeItem(SIGNUP_KEY);
    localStorage.removeItem(SIGNUP_KEY);
    return { ok: true, account: publicAccount(account) };
  }

  function updateAccount(id, changes) {
    const list = accounts();
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) return { ok: false, message: 'Conta não encontrada.' };
    if (changes.email && list.some((item, i) => i !== index && item.email.toLowerCase() === changes.email.trim().toLowerCase())) {
      return { ok: false, message: 'Este e-mail já está em uso.' };
    }
    list[index] = { ...list[index], ...changes };
    if (list[index].email) list[index].email = list[index].email.trim().toLowerCase();
    writeAccounts(list);
    return { ok: true, account: publicAccount(list[index]) };
  }

  function deleteAccount(id) {
    const list = accounts();
    if (id === DEMO_ADMIN.id) return { ok: false, message: 'A conta de demonstração não pode ser removida.' };
    writeAccounts(list.filter((item) => item.id !== id));
    logout();
    localStorage.removeItem('delta_perfil');
    localStorage.removeItem('delta_notificacoes');
    localStorage.removeItem(RESET_KEY);
    sessionStorage.removeItem('delta_verified_reset_email');
    sessionStorage.removeItem('delta_created_account');
    return { ok: true };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('delta_session');
  }

  function requestPasswordReset(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const account = accounts().find((item) => item.email.toLowerCase() === normalizedEmail && item.active !== false);
    if (!account) return { ok: false, message: 'Não encontramos uma conta com esse e-mail.' };
    sessionStorage.removeItem('delta_verified_reset_email');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const reset = { email: account.email, code, expiresAt: Date.now() + 10 * 60 * 1000 };
    localStorage.setItem(RESET_KEY, JSON.stringify(reset));
    return { ok: true, code, expiresAt: reset.expiresAt };
  }

  function verifyResetCode(code) {
    const reset = readJson(RESET_KEY, null);
    if (!reset || reset.expiresAt < Date.now()) {
      localStorage.removeItem(RESET_KEY);
      return { ok: false, message: 'O código expirou. Solicite outro.' };
    }
    sessionStorage.setItem('delta_verified_reset_email', reset.email);
    return { ok: true, email: reset.email };
  }

  function getResetDetails() {
    const reset = readJson(RESET_KEY, null);
    return reset && reset.expiresAt >= Date.now() ? { ...reset } : null;
  }

  function resetPassword(password, code) {
    const reset = readJson(RESET_KEY, null);
    if (!reset || reset.expiresAt < Date.now()) {
      localStorage.removeItem(RESET_KEY);
      sessionStorage.removeItem('delta_verified_reset_email');
      return { ok: false, message: 'O código expirou. Solicite outro.' };
    }
    const verifiedEmail = sessionStorage.getItem('delta_verified_reset_email');
    if (verifiedEmail !== reset.email) {
      const verified = verifyResetCode(code);
      if (!verified.ok) return verified;
    }
    const list = accounts();
    const account = list.find((item) => item.email === reset.email);
    if (!account) return { ok: false, message: 'Conta não encontrada.' };
    account.password = password;
    writeAccounts(list);
    localStorage.removeItem(RESET_KEY);
    sessionStorage.removeItem('delta_verified_reset_email');
    return { ok: true };
  }

  window.DeltaDB = {
    demoAdmin: { email: DEMO_ADMIN.email, password: DEMO_ADMIN.password },
    getCurrent,
    login,
    logout,
    saveSignupDraft,
    getSignupDraft,
    finishSignup,
    updateAccount,
    deleteAccount,
    requestPasswordReset,
    getResetDetails,
    verifyResetCode,
    resetPassword
  };
})();
