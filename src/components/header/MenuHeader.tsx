import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { theme } from '../../theme/theme';

interface MenuHeaderProps {
  restaurantName?: string;
  tableNumber?: string | number;
  onTotalClick?: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  restaurantName = 'Restaurant',
  tableNumber,
  onTotalClick,
}) => {
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

          {/* Right side - Table Number & Total Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {tableNumber && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: theme.borderRadius.medium,
                  backgroundColor: 'grey.100',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeights.medium,
                    color: 'text.secondary',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  Table
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: theme.typography.fontWeights.bold,
                    color: 'text.primary',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  {tableNumber}
                </Typography>
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
                Total
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MenuHeader;
