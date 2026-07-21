import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';
import { AuthService } from '../api/services/authService';

export const pin = atom<string>();

export const tokenAtom = atomWithStorage<string | null>('accessToken', null);

export const isAuthorizedAtom = atom((get) => {
  const accessToken = get(tokenAtom);
  return !!accessToken;
});

export const currentPinAtom = atom<string>('');

export const errorAtom = atom<string | null>(null);

export const login = atom(
    (get) => get(tokenAtom),
    async (get, set) => {
        try {
            set(errorAtom, null);

            const pin = get(currentPinAtom);
            const response = await AuthService.login(pin);

            set(tokenAtom, response);
        }
        catch {
            set(errorAtom, "Authnentication error");
        }
    }
);