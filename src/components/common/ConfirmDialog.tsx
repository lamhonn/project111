import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { actionBarTheme } from '../../theme';
import {
  confirmDialogConfigAtom,
  closeConfirmDialogAtom,
} from '../../context/confirmDialogStore';

const ConfirmDialog: React.FC = () => {
  const [config] = useAtom(confirmDialogConfigAtom);
  const closeDialog = useSetAtom(closeConfirmDialogAtom);
  const theme = actionBarTheme;

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
          borderRadius: theme.dialog.borderRadius,
          p: theme.dialog.padding,
        },
      }}
    >
      <DialogContent sx={{ pb: 2 }}>
        <Typography
          variant={theme.typography.dialogTitle.variant}
          fontWeight={theme.typography.dialogTitle.fontWeight}
          gutterBottom
        >
          {config.title}
        </Typography>
        <Typography variant={theme.typography.dialogContent.variant} color="text.secondary">
          {config.message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1.5, pt: 0 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.dialogButtons.cancel.color,
            fontWeight: theme.dialogButtons.cancel.fontWeight,
            textTransform: theme.dialogButtons.cancel.textTransform,
            px: theme.dialogButtons.cancel.paddingX,
            py: theme.dialogButtons.cancel.paddingY,
            borderRadius: theme.dialogButtons.cancel.borderRadius,
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
            backgroundColor: theme.dialogButtons.confirm.backgroundColor,
            color: theme.dialogButtons.confirm.color,
            fontWeight: theme.dialogButtons.confirm.fontWeight,
            textTransform: theme.dialogButtons.confirm.textTransform,
            px: theme.dialogButtons.confirm.paddingX,
            py: theme.dialogButtons.confirm.paddingY,
            borderRadius: theme.dialogButtons.confirm.borderRadius,
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
