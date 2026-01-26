import { atom } from 'jotai';

export interface ConfirmDialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const defaultConfig: ConfirmDialogConfig = {
  isOpen: false,
  title: '',
  message: '',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  maxWidth: 'md',
};

// Atom to store confirm dialog configuration
export const confirmDialogConfigAtom = atom<ConfirmDialogConfig>(defaultConfig);

// Write-only atom to open confirm dialog
export const openConfirmDialogAtom = atom(
  null,
  (get, set, config: Omit<ConfirmDialogConfig, 'isOpen'>) => {
    set(confirmDialogConfigAtom, {
      ...config,
      isOpen: true,
    });
  }
);

// Write-only atom to close confirm dialog
export const closeConfirmDialogAtom = atom(
  null,
  (get, set) => {
    set(confirmDialogConfigAtom, defaultConfig);
  }
);
