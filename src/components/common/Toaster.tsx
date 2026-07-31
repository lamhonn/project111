import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { theme } from '../../theme/theme';

interface ToasterProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: AlertColor;
  duration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const Toaster: React.FC<ToasterProps> = ({
  open,
  onClose,
  message,
  severity = 'success',
  duration = 3000,
  position = { vertical: 'top', horizontal: 'center' },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: theme.borderRadius.xlarge, boxShadow: theme.shadows.md }}
        icon={false}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
