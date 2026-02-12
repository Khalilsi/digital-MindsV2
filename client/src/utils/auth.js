const AUTH_KEY = "auth";

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isTokenExpired(auth) {
  if (!auth?.token || !auth?.expiresAt) return true;
  return Date.now() >= auth.expiresAt;
}

export function getToken() {
  const auth = getAuth();
  if (!auth || isTokenExpired(auth)) return null;
  return auth.token;
}

export function setAuth(data) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch {}
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
}
