import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { useSetAtom } from 'jotai';
import { setCallServiceAtom } from '../../state/serviceStore';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ 
  isOpen, 
  onClose,
}) => {
  const { t } = useTranslation();
  const [serviceCalled, setServiceCalled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const callService = useSetAtom(setCallServiceAtom);

  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && serviceCalled) {
      setServiceCalled(false);
    }
  }, [countdown, serviceCalled]);

  const handleCallService = () => {
    setServiceCalled(true);
    setCountdown(10); // 10 second cooldown
    callService();
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: theme.borderRadius.xlarge,
          p: 4,
          maxWidth: 450,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          animation: 'slideUp 0.4s ease-out',
          '@keyframes slideUp': {
            from: {
              transform: 'translateY(30px)',
              opacity: 0,
            },
            to: {
              transform: 'translateY(0)',
              opacity: 1,
            },
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: "24px",
            right: "24px",
            color: theme.colors.text,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main' }} />
        </Box>

        <Typography variant="h5" fontWeight={theme.typography.fontWeights.bold} gutterBottom>
          {t('errorDialog.title')}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          {t('errorDialog.defaultMessage')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleCallService}
            disabled={serviceCalled && countdown > 0}
            sx={{
              backgroundColor: serviceCalled ? 'success.main' : theme.colors.primary,
              color: 'white',
              fontWeight: theme.typography.fontWeights.semibold,
              textTransform: 'none',
              py: 1.5,
              borderRadius: theme.borderRadius.xlarge,
              '&:hover': {
                backgroundColor: serviceCalled ? 'success.dark' : theme.colors.primaryHover,
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.38)',
              },
            }}
          >
            {serviceCalled 
              ? countdown > 0 
                ? t('errorDialog.serviceCalledWait', { seconds: countdown })
                : t('errorDialog.callForService')
              : t('errorDialog.callForService')
            }
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          {serviceCalled && countdown === 0 
            ? t('errorDialog.canCallAgain')
            : t('errorDialog.waiterWillAssist')
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorDialog;
