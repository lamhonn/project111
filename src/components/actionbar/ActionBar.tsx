import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Badge,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import OrderSummaryDialog from '../order/OrderSummaryDialog';
import TotalOrderSummaryDialog from '../order/TotalOrderSummaryDialog';
import { orderCountAtom, totalPriceAtom } from '../../context/orderStore';

interface ActionBarProps {
  // No props needed, using Jotai atoms
}

const ActionBar: React.FC<ActionBarProps> = () => {
  const { t } = useTranslation();
  const orderCount = useAtomValue(orderCountAtom);
  const totalPrice = useAtomValue(totalPriceAtom);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showTotalDialog, setShowTotalDialog] = useState(false);

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

  // const hasOrder: boolean = orderCount > 0;

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
          startIcon={<ReceiptIcon />}
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
          }}
        >
          {t('common.bill')}
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
      <TotalOrderSummaryDialog
        isOpen={showTotalDialog}
        onClose={handleCloseTotalDialog}
      />
    </>
  );
};

export default ActionBar;