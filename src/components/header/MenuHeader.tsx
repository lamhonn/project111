import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  keyframes,
  Menu,
  MenuItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAtom, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { languageAtom } from '../../context/orderStore';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';
import { theme } from '../../theme/theme';
import Toaster from '../common/Toaster';

// TODO: move to enums file
export enum OrderStatus {
  Received = 'Received',
  Preparing = 'Preparing',
}

interface MenuHeaderProps {
  restaurantName?: string;
  onTotalClick?: () => void;
  orderStatus?: OrderStatus | null;
}

const boingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const MenuHeader: React.FC<MenuHeaderProps> = ({
  restaurantName = 'Restaurant',
  onTotalClick,
  orderStatus,
}) => {
  const { t, i18n } = useTranslation();
  const [animateStatus, setAnimateStatus] = useState(false);
  const [prevStatus, setPrevStatus] = useState<OrderStatus | null>(orderStatus ?? null);
  const [language, setLanguage] = useAtom(languageAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
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
        console.log('Service called');
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

  // Sync i18n language with language atom on mount
  useEffect(() => {
    // Initialize language atom from i18n on first mount
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

  useEffect(() => {
    if (orderStatus && orderStatus !== prevStatus) {
      setAnimateStatus(true);
      setPrevStatus(orderStatus);
      const timer = setTimeout(() => setAnimateStatus(false), 600);
      return () => clearTimeout(timer);
    }
  }, [orderStatus, prevStatus]);

  const getStatusColor = (status: OrderStatus | null) => {
    switch (status) {
      case OrderStatus.Received:
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          border: '#FCD34D',
        };
      case OrderStatus.Preparing:
        return {
          bg: '#D1FAE5',
          text: '#065F46',
          border: '#6EE7B7',
        };
      default:
        return {
          bg: 'grey.100',
          text: 'text.secondary',
          border: 'grey.200',
        };
    }
  };

  const statusColors = orderStatus ? getStatusColor(orderStatus) : null;

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

          {/* Right side - Language Selector & Bill Button */}
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
