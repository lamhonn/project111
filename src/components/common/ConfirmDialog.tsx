import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { theme } from '../../theme/theme';
import {
  confirmDialogConfigAtom,
  closeConfirmDialogAtom,
} from '../../context/confirmDialogStore';

const ConfirmDialog: React.FC = () => {
  const [config] = useAtom(confirmDialogConfigAtom);
  const closeDialog = useSetAtom(closeConfirmDialogAtom);

  const handleClose = (): void => {
    closeDialog();
  };

  const handleConfirm = (): void => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    closeDialog();
  };

  return (
    <Dialog
      open={config.isOpen}
      onClose={handleClose}
      maxWidth={config.maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          p: theme.spacing.lg,
        },
      }}
    >
      <DialogContent sx={{ pb: 2 }}>
        <Typography
          variant="h6"
          fontWeight={theme.typography.fontWeights.semibold}
          gutterBottom
        >
          {config.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {config.message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1.5, pt: 0 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.colors.text,
            fontWeight: theme.typography.fontWeights.medium,
            textTransform: 'none',
            px: theme.spacing.lg,
            py: 1,
            borderRadius: theme.borderRadius.medium,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          {config.cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.brandWhite,
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            px: theme.spacing.lg,
            py: 1,
            borderRadius: theme.borderRadius.medium,
            '&:hover': {
              backgroundColor: theme.colors.primaryHover,
            },
          }}
        >
          {config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
