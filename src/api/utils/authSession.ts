import { store } from '../../context/store';
import { revokeAuthorizationAtom } from '../../context/authStore';
import { resetAppStateAtom } from '../../context/orderStore';

const AUTH_STORAGE_KEYS = ['authToken', 'is_authorized', 'accessToken', 'refreshToken'] as const;

type JwtPayload = {
  exp?: number;
};

type JwtClaims = Record<string, unknown>;

export const normalizeStoredAuthToken = (rawToken: string | null): string | null => {
  if (!rawToken) {
    return null;
  }

  const trimmed = rawToken.trim();
  if (!trimmed) {
    return null;
  }

  // atomWithStorage serializes values as JSON in localStorage.
  // Parse quoted values like "token" back into plain token strings.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'string') {
        return parsed.trim() || null;
      }
    } catch {
      return trimmed.slice(1, -1).trim() || null;
    }
  }

  return trimmed;
};

export const clearStoredAuthKeys = (): void => {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export const decodeJwtClaims = <TClaims extends JwtClaims = JwtClaims>(
  rawToken: string | null,
): TClaims | null => {
  const token = normalizeStoredAuthToken(rawToken);
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded) as TClaims;
  } catch {
    return null;
  }
};

export const isJwtTokenExpired = (token: string, nowMs = Date.now()): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }

  return payload.exp * 1000 <= nowMs;
};

export const revokeAuthorizationSession = (): void => {
  // Sudden-death behavior: wipe local customer flow state on de-auth.
  store.set(resetAppStateAtom);
  store.set(revokeAuthorizationAtom);
  clearStoredAuthKeys();
};
