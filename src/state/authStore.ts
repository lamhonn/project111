import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';
import { AuthService } from '../api/services/authService';

export const tokenAtom = atomWithStorage<string | null>('accessToken', null);

export const isAuthorizedAtom = atom((get) => {
  const accessToken = get(tokenAtom);
  return !!accessToken;
});

export const currentPinAtom = atom<string>('');

export const errorAtom = atom<string | null>(null);

export const loginAtom = atom(
    (get) => get(tokenAtom),
    async (get, set, pin: string) => {
        try {
            set(errorAtom, null);

            const response = await AuthService.login(pin);

            set(tokenAtom, response);
        }
        catch {
            set(errorAtom, "Authnentication error");
        }
    }
);