import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { actionBarTheme } from '../../theme';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  maxWidth = 'md',
}) => {
  const theme = actionBarTheme;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
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
          {title}
        </Typography>
        <Typography variant={theme.typography.dialogContent.variant} color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1.5, pt: 0 }}>
        <Button
          onClick={onClose}
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
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
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
              backgroundColor: theme.colors.successHover,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
