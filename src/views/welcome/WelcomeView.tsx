import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { languageAtom } from '../../context/orderStore';
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
  isStarting?: boolean;
  disabled?: boolean;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartSession,
  backgroundImage,
  isStarting = false,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useAtom(languageAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fi', label: 'Suomi' },
    { code: 'sv', label: 'Svenska' },
  ];

  // Sync i18n language with language atom on mount
  useEffect(() => {
    if (i18n.language && i18n.language !== language) {
      setLanguage(i18n.language);
    }
  }, []);

  // Sync i18n when language atom changes
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        position: 'relative',
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      }}
    >
      {/* Language Selector - Top Right */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
        }}
      >
        <Button
          onClick={handleLanguageClick}
          startIcon={<LanguageIcon />}
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.medium,
            borderColor: theme.colors.border,
            color: 'text.primary',
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            px: theme.spacing.md,
            py: theme.spacing.sm,
            '&:hover': {
              borderColor: theme.colors.primary,
              backgroundColor: 'white',
            },
          }}
        >
          {languages.find(lang => lang.code === language)?.label || 'English'}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageClose}
          PaperProps={{
            sx: {
              borderRadius: theme.borderRadius.small,
              minWidth: 140,
              mt: 1,
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={language === lang.code}
              sx={{
                fontWeight: language === lang.code 
                  ? theme.typography.fontWeights.bold 
                  : theme.typography.fontWeights.medium,
                backgroundColor: language === lang.code 
                  ? 'primary.light' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: language === lang.code 
                    ? 'primary.light' 
                    : 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              {lang.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

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
            disabled={disabled}
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
            {isStarting ? 'Starting...' : t('welcome.startButton')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomeView;
