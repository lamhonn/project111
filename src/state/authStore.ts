import { jwtDecode, JwtPayload } from 'jwt-decode';
import { atom } from 'jotai';
import { atomWithStorage, atomWithReset } from 'jotai/utils';
import { AuthService } from '../api/services/authService';
import { parseUserRole } from '../utils/userRoleUtils';

interface TokenPayload extends JwtPayload {
    organizationId: string,
    userId: string,
    role: string, // parse into UserRole
}

export const tokenAtom = atomWithStorage<string | null>('accessToken', null);

function parseJwt(token: string): TokenPayload | null {
    try {
        const payload = token.split('.')[1];

        if (!payload) {
            return null;
        }

        return jwtDecode(payload);
    } catch {
        return null;
    }
}

export const expirationAtom = atom(
    (get) => get(tokenPayloadAtom)?.exp ?? null
);

export const tabletIdAtom = atom(
    (get) => get(tokenPayloadAtom)?.sub ?? null
);

export const organizationIdAtom = atom(
    (get) => get(tokenPayloadAtom)?.organizationId ?? null
);

export const userIdAtom = atom(
    (get) => get(tokenPayloadAtom)?.userId ?? null
);

export const roleAtom = atom(
    (get) => parseUserRole(get(tokenPayloadAtom)?.role) ?? null
);

export const isAuthorizedAtom = atom((get) => {
    const payload = get(tokenPayloadAtom);

    if (!payload || !payload.exp) {
        return false;
    }

    return payload.exp * 1000 > Date.now();
});

export const tokenPayloadAtom = atom((get) => {
    const token = get(tokenAtom);

    return token ? parseJwt(token) : null;
});

export const currentPinAtom = atom<string>('');

export const errorAtom = atom<string | null>(null);

export const loginAtom = atom(
    null,
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