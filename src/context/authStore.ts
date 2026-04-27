import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Tablet JWT stored in localStorage. Populated by verifyTabletPin (WF-02).
// Null means the tablet has not been paired or the token was cleared.
export const tabletTokenAtom = atomWithStorage<string | null>('tablet_token', null);

// Derived read-only atom — true only when a tablet JWT is present in storage.
// AuthGuard reads this. Nothing else should change access control logic.
export const isAuthorizedAtom = atom((get) => get(tabletTokenAtom) !== null);

// Write-only atom to clear tablet authentication (logout / session revoke).
export const clearTabletAuthAtom = atom(null, (_get, set) => {
  set(tabletTokenAtom, null);
});
