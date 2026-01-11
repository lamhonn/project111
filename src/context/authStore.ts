import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

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

// Write-only atom to revoke authorization
export const revokeAuthorizationAtom = atom(
  null,
  (get, set) => {
    set(isAuthorizedAtom, false);
  }
);
