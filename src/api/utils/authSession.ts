import { store } from '../../context/store';
import { revokeAuthorizationAtom } from '../../context/authStore';

const AUTH_STORAGE_KEYS = ['authToken', 'is_authorized', 'accessToken', 'refreshToken'] as const;

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

export const revokeAuthorizationSession = (): void => {
  store.set(revokeAuthorizationAtom);
  clearStoredAuthKeys();
};
