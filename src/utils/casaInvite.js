const CASA_INVITE_STORAGE_KEY = 'finance_casa_invite_token';

export function saveCasaInviteToken(token) {
  if (!token) return;
  try {
    localStorage.setItem(CASA_INVITE_STORAGE_KEY, token);
  } catch {}
}

export function getPendingCasaInviteToken() {
  try {
    return localStorage.getItem(CASA_INVITE_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function clearCasaInviteToken() {
  try {
    localStorage.removeItem(CASA_INVITE_STORAGE_KEY);
  } catch {}
}

export function getCasaInviteToken(searchParams) {
  return searchParams.get('convite') || getPendingCasaInviteToken();
}

export function buildCasaInviteUrl(token) {
  if (!token) return '';
  return `${window.location.origin}/convite-casa/${encodeURIComponent(token)}`;
}
