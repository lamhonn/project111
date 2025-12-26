import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Badge,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAtomValue, useSetAtom } from 'jotai';
import { theme } from '../../theme/theme';
import Toaster from '../common/Toaster';
import OrderSummaryDialog from '../order/OrderSummaryDialog';
import { orderCountAtom, totalPriceAtom } from '../../context/orderStore';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';

interface ActionBarProps {
  // No props needed, using Jotai atoms
}

const ActionBar: React.FC<ActionBarProps> = () => {
  const orderCount = useAtomValue(orderCountAtom);
  const totalPrice = useAtomValue(totalPriceAtom);
  const openConfirmDialog = useSetAtom(openConfirmDialogAtom);
  const [showToaster, setShowToaster] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const handleShowOrder = (): void => {
    setShowOrderDialog(true);
  };

  const handleCloseOrderDialog = (): void => {
    setShowOrderDialog(false);
  };

  const handleCallService = (): void => {
    openConfirmDialog({
      title: 'Call for service?',
      message: 'A waiter will be notified and come to assist you shortly.',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      onConfirm: () => {
        console.log('Service called');
        // Add your call service logic here
        setShowToaster(true);
      },
    });
  };

  const handleCloseToaster = (): void => {
    setShowToaster(false);
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
        {/* Call for Service Button */}
        <Button
          onClick={handleCallService}
          startIcon={<PersonIcon />}
          sx={{
            flex: 1,
            backgroundColor: theme.colors.brandWhite,
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
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
          Call for service
        </Button>

        {/* Show Order Button */}
        <Button
          onClick={handleShowOrder}
          // disabled={!hasOrder}
          sx={{
            flex: 1,
            backgroundColor: theme.colors.brandWhite,
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
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
          <Typography component="span">Show order</Typography>
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

      <Toaster
        open={showToaster}
        onClose={handleCloseToaster}
        message="Service called successfully! A waiter will assist you shortly."
        severity="success"
      />

      {/* Order Summary Dialog */}
      <OrderSummaryDialog
        isOpen={showOrderDialog}
        onClose={handleCloseOrderDialog}
      />
    </>
  );
};

export default ActionBar;