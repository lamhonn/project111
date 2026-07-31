import { atom } from 'jotai';

export const serviceCalledAtom = atom<boolean>(false); 

export const setCallServiceAtom = atom(
    null,
    (get, set) => {
        set(serviceCalledAtom, true);

        // TODO: make the timeout dependent on the staff's confirmation. For now, it's hardcoded to 10 seconds to prevent spamming.
        setTimeout(() => {
            set(serviceCalledAtom, false), 1000
        }, 10000);

        // TODO: call service endpoint
    }
);