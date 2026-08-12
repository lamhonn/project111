import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Badge,
  keyframes,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import OrderSummaryDialog from '../order/OrderSummaryDialog';
import BillSummaryDialog from '../order/BillSummaryDialog';
import { billsAtom, sessionOrdersAtom } from '../../state/sessionStore';
import { calculateTotalSessionPrice } from '../../utils/orderUtils';

// Pulsing animation for active statuses
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const ActionBar: React.FC = () => {
  const { t } = useTranslation();

  const orders = useAtomValue(sessionOrdersAtom);
  const orderCount = orders.length;
  const bills = useAtomValue(billsAtom);
  const totalPrice = calculateTotalSessionPrice(orders);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showTotalDialog, setShowTotalDialog] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Determine if there are active orders (preparing or received) or split bills
  const hasOrders = orders.length > 0;

  const handleShowOrder = (): void => {
    setShowOrderDialog(true);
  };

  const handleCloseOrderDialog = (): void => {
    setShowOrderDialog(false);
  };

  const handleBillClick = (): void => {
    setShowTotalDialog(true);
  };

  const handleCloseTotalDialog = (): void => {
    setShowTotalDialog(false);
  };

  useEffect(() => {
    setShouldPulse(true);

    setTimeout(() => setShouldPulse(false), 2500);
  }, [orderCount])

  return (
    <>
      {/* Floating Action Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.primary,
          p: theme.spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: theme.spacing.md,
          boxShadow: theme.shadows.lg,
          zIndex: 50,
        }}
      >
        {/* Bill Button */}
        <Button
          onClick={handleBillClick}
          sx={{
            flex: 1,
            backgroundColor: hasOrders ? '#fefce8' : theme.colors.brandWhite,
            color: hasOrders ? '#eab308' : theme.colors.primary,
            fontSize: theme.typography.fontSizes.medium,
            px: theme.spacing.lg,
            py: 1.5,
            borderRadius: theme.borderRadius.xlarge,
            textTransform: 'none',
            boxShadow: theme.shadows.sm,
            gap: theme.spacing.sm,
            border: shouldPulse ? '2px solid #eab308' : 'none',
            '&:hover': {
              backgroundColor: hasOrders ? '#fef3c7' : 'grey.100',
            },
            animation: shouldPulse ? `${pulse} 2s ease-in-out infinite` : 'none',
          }}
        >
          <Typography component="span">{t('common.bill')}</Typography>
          <Badge
            badgeContent={hasOrders}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'error.main',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: theme.typography.fontWeights.bold,
                minWidth: 20,
                height: 20,
              },
            }}
          >
            <ReceiptIcon />
          </Badge>
        </Button>

        {/* Show Order Button */}
        <Button
          onClick={handleShowOrder}
          // disabled={!hasOrder}
          sx={{
            flex: 1,
            backgroundColor: theme.colors.brandWhite,
            color: theme.colors.primary,
            fontSize: theme.typography.fontSizes.medium,
            px: theme.spacing.lg,
            py: 1.5,
            borderRadius: theme.borderRadius.xlarge,
            textTransform: 'none',
            boxShadow: theme.shadows.sm,
            gap: theme.spacing.sm,
            '&:hover': {
              backgroundColor: 'grey.100',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(34, 197, 94, 0.5)',
            },
          }}
        >
          <Typography component="span">{t('actionBar.showOrder')}</Typography>
          <Badge
            badgeContent={orderCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'error.main',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: theme.typography.fontWeights.bold,
                minWidth: 20,
                height: 20,
              },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
          {orderCount > 0 && (
            <Typography component="span" fontWeight="bold" sx={{ ml: 0.5 }}>
              {totalPrice.toFixed(2)} €
            </Typography>
          )}
        </Button>
      </Box>

      {/* Order Summary Dialog */}
      <OrderSummaryDialog
        isOpen={showOrderDialog}
        onClose={handleCloseOrderDialog}
      />

      {/* Total Order Summary Dialog */}
      <BillSummaryDialog
        isOpen={showTotalDialog}
        onClose={handleCloseTotalDialog}
      />
    </>
  );
};

export default ActionBar;