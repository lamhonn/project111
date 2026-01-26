import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface LockedDialogProps {
  isOpen: boolean;
}

const LockedDialog: React.FC<LockedDialogProps> = ({ isOpen }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      // Prevent closing the dialog
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          textAlign: 'center',
          p: theme.spacing.lg,
        }
      }}
    >
      <DialogContent sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon
              sx={{
                fontSize: 60,
                color: 'warning.main',
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: theme.typography.fontWeights.bold,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {t('lockedDialog.title')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: '1.1rem',
          }}
        >
          {t('lockedDialog.message')}
        </Typography>

      </DialogContent>
    </Dialog>
  );
};

export default LockedDialog;
