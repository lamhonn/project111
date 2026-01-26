import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

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
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
