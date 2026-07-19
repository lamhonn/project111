import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const pin = atom<string>();

// Store token in sessionStorage for better security (cleared on tab close)
export const tokensAtom = atomWithStorage<AuthTokens>('auth_token', { accessToken: null, refreshToken: null });

export const isAuthorizedAtom = atom((get) => {
  const { accessToken } = get(tokensAtom);
  return !!accessToken;
});

export const errorAtom = atom<string | null>(null;

// TODO: PIN based login
export const login = atom(
    (get) => get(tokensAtom),
    async (get, set) => {
        try {
            // const response = 
        }
        catch {
            set(errorAtom, "Authnentication error");
        }
    }
);

export const logout = atom(

);

export const refresh = atom(

);