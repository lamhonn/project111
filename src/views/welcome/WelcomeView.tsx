import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

/**
 * Welcome View
 * 
 * Shown at the start of a new session.
 * User clicks "Start" to begin their dining experience.
 */
interface WelcomeViewProps {
  onStartSession: () => void;
  backgroundImage?: string;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStartSession, backgroundImage }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: theme.borderRadius.large,
            textAlign: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RestaurantIcon
                sx={{
                  fontSize: 48,
                  color: 'white',
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: theme.typography.fontWeights.bold,
              color: 'text.primary',
            }}
          >
            {t('welcome.title')}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {t('welcome.description')}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onStartSession}
            sx={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              fontWeight: theme.typography.fontWeights.semibold,
              textTransform: 'none',
              py: 1.5,
              px: 6,
              borderRadius: theme.borderRadius.xlarge,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: theme.colors.primaryHover,
              },
            }}
          >
            {t('welcome.startButton')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomeView;
