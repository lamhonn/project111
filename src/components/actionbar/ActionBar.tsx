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
import { actionBarTheme } from '../../theme';
import Toaster from '../common/Toaster';
import OrderSummaryDialog from '../order/OrderSummaryDialog';
import { orderCountAtom, totalPriceAtom } from '../../context/orderStore';
import { openConfirmDialogAtom } from '../../context/confirmDialogStore';

interface ActionBarProps {
  // No props needed, using Jotai atoms
}

const ActionBar: React.FC<ActionBarProps> = () => {
  const theme = actionBarTheme;
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
        setShowToaster(true); // TODO: make generic level component instead of implementing it on every single component
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
          position: theme.container.position,
          bottom: theme.container.bottom,
          left: theme.container.left,
          right: theme.container.right,
          backgroundColor: theme.container.backgroundColor,
          p: theme.container.padding,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: theme.container.gap,
          boxShadow: theme.container.boxShadow,
          zIndex: theme.container.zIndex,
        }}
      >
        {/* Call for Service Button */}
        <Button
          onClick={handleCallService}
          startIcon={<PersonIcon />}
          sx={{
            flex: 1,
            backgroundColor: theme.buttons.service.backgroundColor,
            color: theme.buttons.service.color,
            fontWeight: theme.buttons.service.fontWeight,
            fontSize: theme.buttons.service.fontSize,
            px: theme.buttons.service.paddingX,
            py: theme.buttons.service.paddingY,
            borderRadius: theme.buttons.service.borderRadius,
            textTransform: theme.buttons.service.textTransform,
            boxShadow: theme.buttons.service.boxShadow,
            gap: theme.buttons.service.gap,
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
            backgroundColor: theme.buttons.order.backgroundColor,
            color: theme.buttons.order.color,
            fontWeight: theme.buttons.order.fontWeight,
            fontSize: theme.buttons.order.fontSize,
            px: theme.buttons.order.paddingX,
            py: theme.buttons.order.paddingY,
            borderRadius: theme.buttons.order.borderRadius,
            textTransform: theme.buttons.order.textTransform,
            boxShadow: theme.buttons.order.boxShadow,
            gap: theme.buttons.order.gap,
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
                backgroundColor: theme.badge.backgroundColor,
                color: theme.badge.color,
                fontSize: theme.badge.fontSize,
                fontWeight: theme.badge.fontWeight,
                minWidth: theme.badge.minWidth,
                height: theme.badge.height,
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