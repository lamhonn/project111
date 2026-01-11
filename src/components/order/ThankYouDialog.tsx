import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface ThankYouDialogProps {
  isOpen: boolean;
  onReset: () => void;
}

const ThankYouDialog: React.FC<ThankYouDialogProps> = ({ isOpen, onReset }) => {
  const { t } = useTranslation();

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
          borderRadius: 3,
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
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
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t('thankYouDialog.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {t('thankYouDialog.message')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('thankYouDialog.enjoyedMeal')}
        </Typography>

        <Button
          variant="contained"
          onClick={onReset}
          sx={{
            mt: 4,
            backgroundColor: theme.colors.primary,
            color: 'white',
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            py: 1.5,
            px: 4,
            borderRadius: theme.borderRadius.xlarge,
            '&:hover': {
              backgroundColor: theme.colors.primaryHover,
            },
          }}
        >
          {t('thankYouDialog.startNewSession')}
        </Button>
      </Box>
    </Box>
  );
};

export default ThankYouDialog;
