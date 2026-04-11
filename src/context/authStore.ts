import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { decodeJwtClaims } from '../api/utils/authSession';

/**
 * Simple authorization state with PIN-based access
 * 
 * Uses localStorage to persist authorization between sessions.
 * Authorization is granted by entering any 8-digit PIN.
 * 
 * TODO: Add actual PIN validation and JWT token handling later
 */

// Authorization status stored in localStorage
// Set to true to allow access, false to block
export const isAuthorizedAtom = atomWithStorage<boolean>('is_authorized', false);
export const authTokenAtom = atomWithStorage<string | null>('authToken', null);

export type TabletTokenClaims = {
  organizationId?: string;
  tabletId?: string;
  tableNumber?: number;
  role?: string;
};

export const authTokenClaimsAtom = atom<TabletTokenClaims | null>((get) => {
  const token = get(authTokenAtom);
  return decodeJwtClaims<TabletTokenClaims>(token);
});

// Write-only atom to authorize with PIN
export const authorizePinAtom = atom(
  null,
  (get, set, pin: string) => {
    // For now, accept any 8-digit PIN
    if (pin.length === 8 && /^\d{8}$/.test(pin)) {
      set(isAuthorizedAtom, true);
      return { success: true };
    }
    return { success: false, error: 'PIN must be 8 digits' };
  }
);

export const authorizeWithTokenAtom = atom(
  null,
  (_get, set, token: string) => {
    const sanitized = token.trim();
    if (!sanitized) {
      return { success: false, error: 'Token cannot be empty' };
    }

    set(authTokenAtom, sanitized);
    set(isAuthorizedAtom, true);
    return { success: true };
  }
);

// Write-only atom to revoke authorization
export const revokeAuthorizationAtom = atom(
  null,
  (get, set) => {
    set(isAuthorizedAtom, false);
    set(authTokenAtom, null);
  }
);
