/* Banco local de demonstração. Os dados ficam neste navegador; não há servidor. */
(function () {
  const ACCOUNTS_KEY = 'delta_mock_accounts';
  const SESSION_KEY = 'delta_mock_session';
  const SIGNUP_KEY = 'delta_mock_signup';
  const RESET_KEY = 'delta_mock_password_reset';
  const REMEMBERED_EMAIL_KEY = 'delta_mock_remembered_email';
  const USERS_COLLECTION_KEY = 'delta_usuarios';
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

  // Coleções do banco simulado usadas pelas telas administrativas.
  function readCollection(key) {
    if (key === USERS_COLLECTION_KEY) return userRecords();
    const value = readJson(key, null);
    return Array.isArray(value) ? value : null;
  }

  function writeCollection(key, records) {
    if (!Array.isArray(records)) throw new TypeError('A coleção deve ser uma lista.');
    if (key === USERS_COLLECTION_KEY) return writeUserRecords(records);
    localStorage.setItem(key, JSON.stringify(records));
    return { ok: true };
  }

  function userRecords() {
    return accounts().map((account, index) => ({
      id: index + 1,
      accountId: account.id,
      values: [
        account.name || '',
        account.email || '',
        '*******',
        account.phone || '',
        account.birthDate || '',
        (account.createdAt || '').slice(0, 10),
        account.active === false ? 'Não' : 'Sim',
        account.role === 'admin' ? 'Sim' : 'Não',
        account.role === 'manager' ? 'Sim' : 'Não'
      ]
    }));
  }

  function writeUserRecords(records) {
    const currentAccounts = accounts();
    const accountsById = new Map(currentAccounts.map((account) => [account.id, account]));
    const nextAccounts = [];

    for (const record of records) {
      const values = record.values || [];
      const existing = accountsById.get(record.accountId);
      if (existing?.id === DEMO_ADMIN.id) {
        nextAccounts.push(existing);
        continue;
      }

      const email = String(values[1] || '').trim().toLowerCase();
      const duplicate = nextAccounts.some((account) => account.email.toLowerCase() === email);
      if (duplicate) return { ok: false, message: 'Este e-mail já está em uso.' };

      const account = {
        ...(existing || {}),
        id: existing?.id || globalThis.crypto?.randomUUID?.() || `delta-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: String(values[0] || '').trim(),
        email,
        password: existing && values[2] === '*******' ? existing.password : String(values[2] || ''),
        phone: String(values[3] || '').trim(),
        birthDate: values[4] || '',
        createdAt: existing?.createdAt || (values[5] ? new Date(`${values[5]}T12:00:00`).toISOString() : new Date().toISOString()),
        role: values[7] === 'Sim' ? 'admin' : 'user',
        active: values[6] !== 'Não',
        notifications: existing?.notifications || { reports: false, news: false, events: false }
      };

      record.accountId = account.id;
      nextAccounts.push(account);
    }

    const demoAdmin = currentAccounts.find((account) => account.id === DEMO_ADMIN.id);
    if (demoAdmin && !nextAccounts.some((account) => account.id === demoAdmin.id)) {
      return { ok: false, message: 'A conta de demonstração não pode ser removida.' };
    }
    if (nextAccounts.some((account, index) => nextAccounts.some((other, otherIndex) =>
      index !== otherIndex && other.email.toLowerCase() === account.email.toLowerCase()
    ))) return { ok: false, message: 'Este e-mail já está em uso.' };

    writeAccounts(nextAccounts);
    return { ok: true };
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

  function getRememberedEmail() {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  }

  function setRememberedEmail(email) {
    if (email) localStorage.setItem(REMEMBERED_EMAIL_KEY, String(email).trim().toLowerCase());
    else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
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
    if (remember) setRememberedEmail(account.email);
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
      phone: (draft.phone || details.phone || '').trim(),
      birthDate: details.birthDate,
      role: 'user',
      active: true,
      createdAt: new Date().toISOString(),
      acceptedTermsAt: draft.acceptedTerms ? new Date().toISOString() : null,
      notifications: { reports: false, news: false, events: false }
    };

    list.push(account);
    writeAccounts(list);
    setSession(account, draft.remember);
    if (draft.remember) setRememberedEmail(account.email);
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
    const account = list.find((item) => item.id === id);
    writeAccounts(list.filter((item) => item.id !== id));
    if (account?.email === getRememberedEmail()) setRememberedEmail('');
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
    const code = String(Math.floor(1000 + Math.random() * 9000));
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
    if (reset.code !== String(code || '').trim()) {
      return { ok: false, message: 'Código inválido. Confira o código enviado.' };
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
    getRememberedEmail,
    setRememberedEmail,
    getResetDetails,
    verifyResetCode,
    resetPassword,
    readCollection,
    writeCollection
  };
})();
