import { atom } from 'jotai';

export const serviceCalledAtom = atom<boolean>(false); 

export const setCallService = atom(
    null,
    (get, set) => {
        set(serviceCalledAtom, true);
    }
);