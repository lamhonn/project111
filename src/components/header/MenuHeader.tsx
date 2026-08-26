import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { languageAtom, restaurantNameAtom } from '../../state/uiStore';
import { openConfirmDialogAtom } from '../../state/confirmDialogStore';
import { theme } from '../../theme/theme';
import Toaster from '../common/Toaster';
import { serviceCalledAtom, setCallServiceAtom } from '../../state/serviceStore';

const MenuHeader: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useAtom(languageAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);

  const callService = useSetAtom(setCallServiceAtom);
  const serviceCalled = useAtomValue(serviceCalledAtom);

  const restaurantName = useAtomValue(restaurantNameAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showToaster, setShowToaster] = useState(false);

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

  const handleCallService = (): void => {
    openConfirmDialog({
      title: t('confirmDialog.callService.title'),
      message: t('confirmDialog.callService.message'),
      cancelText: t('common.cancel'),
      confirmText: t('common.confirm'),
      onConfirm: () => {
        callService();
        setShowToaster(true);
      },
    });
  };

  const handleCloseToaster = (): void => {
    setShowToaster(false);
  };

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fi', label: 'FI' },
    { code: 'sv', label: 'SV' },
  ];

  // Sync i18n when language atom changes
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left side - Restaurant Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: theme.typography.fontWeights.bold,
              color: 'text.primary',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {restaurantName}
          </Typography>

          {/* Right side - Language Selector & Service Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Language Selector */}
            <Button
              onClick={handleLanguageClick}
              variant="outlined"
              sx={{
                borderRadius: theme.borderRadius.medium,
                borderColor: theme.colors.border,
                color: 'text.primary',
                fontWeight: theme.typography.fontWeights.bold,
                textTransform: 'uppercase',
                minWidth: '56px',
                px: theme.spacing.md,
                py: theme.spacing.sm,
                '&:hover': {
                  borderColor: theme.colors.primary,
                  backgroundColor: 'primary.light',
                },
              }}
            >
              {languages.find(lang => lang.code === language)?.label || 'EN'}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageClose}
              PaperProps={{
                sx: {
                  borderRadius: theme.borderRadius.small,
                  minWidth: 80,
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

            <Button
              onClick={handleCallService}
              startIcon={<PersonIcon />}
              variant="outlined"
              disabled={serviceCalled}
              sx={{
                borderColor: theme.colors.border,
                color: 'text.primary',
                fontWeight: theme.typography.fontWeights.medium,
                textTransform: 'none',
                borderRadius: theme.borderRadius.medium,
                px: theme.spacing.md,
                py: theme.spacing.sm,
                '&:hover': {
                  borderColor: 'success.main',
                  backgroundColor: 'success.light',
                },
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t('actionBar.callForService')}
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </Container>

      <Toaster
        open={showToaster}
        onClose={handleCloseToaster}
        message={t('toaster.serviceCalledSuccess')}
        severity="success"
      />
    </AppBar>
  );
};

export default MenuHeader;
