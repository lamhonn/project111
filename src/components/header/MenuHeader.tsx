import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  keyframes,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LanguageIcon from '@mui/icons-material/Language';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { languageAtom } from '../../context/orderStore';
import { theme } from '../../theme/theme';

// TODO: move to enums file
export enum OrderStatus {
  Received = 'Received',
  Preparing = 'Preparing',
}

interface MenuHeaderProps {
  restaurantName?: string;
  tableNumber?: string | number;
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
  tableNumber,
  onTotalClick,
  orderStatus,
}) => {
  const { t, i18n } = useTranslation();
  const [animateStatus, setAnimateStatus] = useState(false);
  const [prevStatus, setPrevStatus] = useState<OrderStatus | null>(orderStatus ?? null);
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
          {/* Left side - Restaurant Name & Language */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

            {/* Language Selector */}
            <IconButton
              onClick={handleLanguageClick}
              sx={{
                borderRadius: theme.borderRadius.medium,
                border: '1px solid',
                borderColor: theme.colors.border,
                color: 'text.secondary',
                padding: theme.spacing.sm,
                '&:hover': {
                  borderColor: theme.colors.primary,
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <LanguageIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>

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
          </Box>

          {/* Right side - Table Number & Total Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {tableNumber && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: orderStatus ? 1 : 0.5,
                  px: orderStatus ? 2 : 1.5,
                  py: orderStatus ? 0.75 : 0.5,
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: statusColors?.bg || 'grey.100',
                  border: orderStatus ? '2px solid' : 'none',
                  borderColor: statusColors?.border,
                  animation: animateStatus ? `${boingAnimation} 0.6s ease-in-out` : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeights.medium,
                    color: orderStatus ? statusColors?.text : 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  {t('common.table')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeights.bold,
                    color: orderStatus ? statusColors?.text : 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  {tableNumber}
                </Typography>
                {orderStatus && (
                  <>
                    <Box
                      sx={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: statusColors?.text,
                        mx: 0.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: theme.typography.fontWeights.bold,
                        color: statusColors?.text,
                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                      }}
                    >
                      {t(`orderStatus.${orderStatus.toLowerCase()}`)}
                    </Typography>
                  </>
                )}
              </Box>
            )}

            <Button
              onClick={onTotalClick}
              startIcon={<ReceiptIcon />}
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
                {t('common.bill')}
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MenuHeader;
