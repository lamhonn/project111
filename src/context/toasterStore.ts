import { atom } from 'jotai';
import { AlertColor } from '@mui/material';

export interface ToasterState {
  open: boolean;
  message: string;
  severity: AlertColor;
  duration?: number;
}

// Atom for managing toaster state
export const toasterAtom = atom<ToasterState>({
  open: false,
  message: '',
  severity: 'success',
  duration: 3000,
});

// Write atom to show toaster
export const showToasterAtom = atom(
  null,
  (get, set, config: Omit<ToasterState, 'open'>) => {
    set(toasterAtom, {
      ...config,
      open: true,
    });
  }
);

// Write atom to hide toaster
export const hideToasterAtom = atom(
  null,
  (get, set) => {
    const currentState = get(toasterAtom);
    set(toasterAtom, {
      ...currentState,
      open: false,
    });
  }
);
